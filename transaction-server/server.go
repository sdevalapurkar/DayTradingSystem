package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/herenow/go-crate"
)

var (
	dbstring = "http://localhost:4200/"
	db       = loadDb()
)

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

func addHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		userID  string
		balance float64
	}{"", 0.0}

	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	queryString := "INSERT INTO users (user_id, balance) VALUES ($1, $2)" +
		"ON CONFLICT (user_id) DO UPDATE SET balance = excluded.balance + $2"

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare query")

	res, err := stmt.Exec(req.userID, req.balance)
	failOnError(err, "Failed to add balance")

	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to add balance")
	}

	//w.WriteHeader(http.StatusOK)
}

func quoteHandler(w http.ResponseWriter, r *http.Request) {
	//decoder := json.NewDecoder(r.Body)

}

func buyHandler(w http.ResponseWriter, r *http.Request) {
	// Quote using

	// Charge user account

	// Take balance and divide it by the quote value

	// Add dividend to user's stock
}

func commitBuyHandler(w http.ResponseWriter, r *http.Request) {

}
func cancelBuyHandler(w http.ResponseWriter, r *http.Request) {

}

func sellHandler(w http.ResponseWriter, r *http.Request) {

}

func commitSellHandler(w http.ResponseWriter, r *http.Request) {

}

func cancelSellHandler(w http.ResponseWriter, r *http.Request) {

}

func setBuyAmountHandler(w http.ResponseWriter, r *http.Request) {

}

func cancelSetBuyHandler(w http.ResponseWriter, r *http.Request) {

}

func setBuyTriggerHandler(w http.ResponseWriter, r *http.Request) {

}

func setSellAmountHandler(w http.ResponseWriter, r *http.Request) {

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
