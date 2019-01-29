package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-redis/redis"
	_ "github.com/herenow/go-crate"
)

var host = "http://192.168.99.100"

var (
	dbstring = host + ":4200/"
	db       = loadDb()
	cache    = redis.NewClient(&redis.Options{
		Addr:     "192.168.99.100:6379",
		Password: "",
		DB:       0,
	})
)

// Test connection to Redis
func RedisClient() {
	err := cache.Set("key", "value", 0).Err()
	if err != nil {
		panic(err)
	}

	val, err := cache.Get("key").Result()
	if err != nil {
		panic(err)
	}
	fmt.Println("key", val)

	val2, err := cache.Get("key2").Result()
	if err == redis.Nil {
		fmt.Println("key2 does not exist")
	} else if err != nil {
		panic(err)
	} else {
		fmt.Println("key2", val2)
	}
	// Output: key value
	// key2 does not exist
}

func failOnError(err error, msg string) {
	if err != nil {
		fmt.Printf("%s: %s", msg, err)
		panic(err)
	}
}

func loadDb() *sql.DB {
	db, err := sql.Open("crate", dbstring)

	// If can't connect to DB
	failOnError(err, "Couldn't connect to CrateDB")
	// err := db.Ping()
	// failOnError(err, "Couldn't ping CrateDB")

	return db
}

// Tested
func addHandler(w http.ResponseWriter, r *http.Request) {

	decoder := json.NewDecoder(r.Body)

	req := struct {
		UserID  string
		Balance float64
	}{"", 0.0}

	// Read request json into struct
	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	// Insert new user if they don't already exist, otherwise update their balance
	queryString := "INSERT INTO users (user_id, balance) VALUES ($1, $2)" +
		"ON CONFLICT (user_id) DO UPDATE SET balance = balance + $2"

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare query")

	res, err := stmt.Exec(req.UserID, req.Balance)
	failOnError(err, "Failed to add balance")

	// Check the query actually did something (because this one should always modify something, unless add 0..?)
	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to add balance")
	}

	//w.WriteHeader(http.StatusOK)
}

func getQuote(symbol string) float64 {
	return 50.0
}

func quoteHandler(w http.ResponseWriter, r *http.Request) {
	//decoder := json.NewDecoder(r.Body)

}

// Tested
func buyHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		UserID string
		Amount float64
		Symbol string
	}{"", 0.0, ""}

	// Read request json data into struct
	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	// Get price of requested stock
	price := getQuote(req.Symbol)

	// Calculate total cost to buy given amount of given stock
	buy_number := int(req.Amount / price)

	cost := float64(buy_number) * price

	// Query to get the current balance of the user
	queryString := "SELECT balance FROM users WHERE user_id = $1;"

	// Try to prepare query
	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare query")

	var balance float64

	// Try to perform the query and get the user's balance
	// TODO: this should probably handle a user buy when the user doesn't exist, but it doesn't right now.
	err = stmt.QueryRow(req.UserID).Scan(&balance)
	failOnError(err, "Failed to get user balance")

	defer stmt.Close()

	// Check user balance against cost of requested stock purchase
	if balance >= cost {
		// User has enough, do reserve the funds by pulling them from the account
		queryString = "UPDATE users SET balance = balance - $1 WHERE user_id = $2"
		stmt, err := db.Prepare(queryString)
		failOnError(err, "Failed to prepare withdraw query")

		// Withdraw funds from user's account
		res, err := stmt.Exec(cost, req.UserID)
		failOnError(err, "Failed to withdraw money from user account")

		numrows, err := res.RowsAffected()
		if numrows < 1 {
			failOnError(err, "Failed to reserve funds")
		}

		fmt.Println(buy_number)

		// Add buy transaction to front of user's transaction list
		cache.LPush(req.UserID+":buy", req.Symbol+":"+strconv.Itoa(buy_number))
	}
}

// Tested
func commitBuyHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		UserID string
	}{""}

	// Parse request parameters into struct (just user_id)
	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse request")

	// Get most recent buy transaction
	task := cache.LPop(req.UserID + ":buy")

	tasks := strings.Split(task.Val(), ":")

	fmt.Println(tasks[1])
	fmt.Println(tasks[0])

	// Check if there are any buy transactions to perform
	if len(tasks) <= 1 {
		w.Write([]byte("Failed to commit buy transaction: no buy orders exist"))
		return
	}

	// Add new stocks to user's account
	queryString := "INSERT INTO stocks (quantity, symbol, user_id) VALUES ($1, $2, $3) " +
		"ON CONFLICT (user_id, symbol) DO UPDATE SET quantity = quantity + $1;"
	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare query")

	res, err := stmt.Exec(tasks[1], tasks[0], req.UserID)
	failOnError(err, "Failed to add stocks to account")

	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to add stocks to account")
	}
}

// Tested
func cancelBuyHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		UserID string
	}{""}

	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse request")

	cache.LPop(req.UserID + ":buy")
}

// Tested
func sellHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		UserID string
		Amount float64 // Dollar value to sell
		Symbol string
	}{"", 0, ""}

	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse request")

	price := getQuote(req.Symbol)

	// Calculate the number of the stock to sell
	sell_number := int(req.Amount / price)

	sale_price := price * float64(sell_number)

	// TODO: Should handle an attempted sale of unowned stocks
	// Check that the user has enough stocks to sell
	queryString := "SELECT quantity FROM stocks WHERE user_id = $1 and symbol = $2"

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare query")

	// Number of given stock owned by user
	var balance int
	err = stmt.QueryRow(req.UserID, req.Symbol).Scan(&balance)
	failOnError(err, "Failed to retrieve number of given stock owned by user")

	defer stmt.Close()

	// Check if the user has enough
	if balance >= sell_number {
		queryString = "UPDATE stocks SET quantity = quantity - $1 where user_id = $2 and symbol = $3;"
		stmt, err = db.Prepare(queryString)
		failOnError(err, "Failed to prepare query")

		// Withdraw the stocks to sell from user's account
		res, err := stmt.Exec(sell_number, req.UserID, req.Symbol)
		failOnError(err, "Failed to reserve stocks to sell")

		numrows, err := res.RowsAffected()
		if numrows < 1 {
			failOnError(err, "Failed to reserve stocks to sell")
		}
		fmt.Println(sale_price)
		cache.LPush(req.UserID+":sell", req.Symbol+":"+strconv.FormatFloat(sale_price, 'f', -1, 64))
	}
}

// Tested
func commitSellHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		UserID string
	}{""}

	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse request")

	task := cache.LPop(req.UserID + ":sell")

	tasks := strings.Split(task.Val(), ":")

	if len(tasks) <= 1 {
		w.Write([]byte("Failed to commit sell transaction: no sell orders exist"))
		return
	}

	fmt.Println(tasks[1])

	queryString := "UPDATE users SET balance = balance + $1 WHERE user_id = $2;"
	stmt, err := db.Prepare(queryString)

	failOnError(err, "Failed to prepare query")

	fmt.Println(tasks[1])
	res, err := stmt.Exec(tasks[1], req.UserID)
	failOnError(err, "Failed to refund money for stock sale")

	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to refund money for stock sale")
	}

}

// Tested
func cancelSellHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		UserID string
	}{""}

	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse request")

	cache.LPop(req.UserID + ":sell")
}

// Tested
func setBuyAmountHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		UserID string
		Symbol string
		Amount int
	}{"", "", 0}

	// Parse request into struct
	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse request")

	// Add buy amount to user's account. If a buy amount already exists for the requested stock, add this to it
	queryString := "INSERT INTO buy_amounts (user_id, symbol, quantity) VALUES ($1, $2, $3) " +
		"ON CONFLICT (user_id, symbol) DO UPDATE SET quantity = quantity + $3;"

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare query")

	res, err := stmt.Exec(req.UserID, req.Symbol, req.Amount)
	failOnError(err, "Failed to update buy amount")

	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to update buy amount")
	}
}

// Tested
func cancelSetBuyHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		UserID string
		Symbol string
	}{"", ""}

	// Parse request parameters into struct
	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse request")

	queryString1 := "DELETE FROM buy_amounts WHERE user_id = $1 AND symbol = $2;"

	queryString2 := "DELETE FROM triggers WHERE user_id = $1 AND symbol = $2 AND method = 'buy';"

	rows1, err := db.Query(queryString1, req.UserID, req.Symbol)
	failOnError(err, "Failed to delete buy amount")

	defer rows1.Close()

	rows2, err := db.Query(queryString2, req.UserID, req.Symbol)
	failOnError(err, "Failed to delete trigger")

	defer rows2.Close()

}

// TODO: Every 60 seconds, see if price is cached. If it is, check it against triggers. If it's not and there's a trigger
// that exists, get quote for that stock and evaluate trigger.
func setBuyTriggerHandler(w http.ResponseWriter, r *http.Request) {

}

// Tested
func setSellAmountHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		UserID string
		Symbol string
		Amount int
	}{"", "", 0}

	// Parse request into struct
	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse request")

	// Add buy amount to user's account. If a buy amount already exists for the requested stock, add this to it
	queryString := "INSERT INTO sell_amounts (user_id, symbol, quantity) VALUES ($1, $2, $3) " +
		"ON CONFLICT (user_id, symbol) DO UPDATE SET quantity = quantity + $3;"

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare query")

	res, err := stmt.Exec(req.UserID, req.Symbol, req.Amount)
	failOnError(err, "Failed to update sell amount")

	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to update sell amount")
	}
}

func setSellTriggerHandler(w http.ResponseWriter, r *http.Request) {

}

func cancelSetSellHandler(w http.ResponseWriter, r *http.Request) {

}

func dumpLogHandler(w http.ResponseWriter, r *http.Request) {

}

func displaySummaryHandler(w http.ResponseWriter, r *http.Request) {

}

func main() {
	port := ":8080"
	http.HandleFunc("/add", addHandler)
	http.HandleFunc("/quote", quoteHandler)
	http.HandleFunc("/buy", buyHandler)
	http.HandleFunc("/commit_buy", commitBuyHandler)
	http.HandleFunc("/cancel_buy", cancelBuyHandler)
	http.HandleFunc("/sell", sellHandler)
	http.HandleFunc("/commit_sell", commitSellHandler)
	http.HandleFunc("/cancel_sell", cancelSellHandler)
	http.HandleFunc("/set_buy_amount", setBuyAmountHandler)
	http.HandleFunc("/cancel_set_buy", cancelSetBuyHandler)
	http.HandleFunc("/set_buy_trigger", setBuyTriggerHandler)
	http.HandleFunc("/set_sell_amount", setSellAmountHandler)
	http.HandleFunc("/set_sell_trigger", setSellTriggerHandler)
	http.HandleFunc("/cancel_set_sell", cancelSetSellHandler)
	http.HandleFunc("/dumplog", dumpLogHandler)
	http.HandleFunc("/display_summary", displaySummaryHandler)
	http.ListenAndServe(port, nil)
}
