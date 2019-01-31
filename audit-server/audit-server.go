package main

import (
	"database/sql"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/herenow/go-crate"
)

var (
	db          = loadDb(auditstring)
	auditstring = "http://localhost:4201"
)

func failOnError(err error, msg string) {
	if err != nil {
		fmt.Printf("%s: %s", msg, err)
		panic(err)
	}
}

func loadDb(dbstring string) *sql.DB {
	db, err := sql.Open("crate", auditstring)

	// If can't connect to DB
	failOnError(err, "Couldn't connect to CrateDB")
	err = db.Ping()
	failOnError(err, "Couldn't ping CrateDB")
	println("connected to db")
	return db
}

func createTimestamp() int64 {
	return time.Now().UTC().Unix()
}

// UserCommand data type
type userCommand struct {
	Timestamp      string `xml:"timestamp"`
	Server         string `xml:"server"`
	TransactionNum string `xml:"transactionNum"`
	Command        string `xml:"command"`
	Username       string `xml:"username"`
	StockSymbol    string `xml:"stockSymbol"`
	Filename       string `xml:"filename"`
	Funds          string `xml:"funds"`
}

// SystemEvent data type
type SystemEvent struct {
	Timestamp      string  `xml:"timestamp"`
	Server         string  `xml:"server"`
	TransactionNum int     `xml:"transactionNum"`
	Command        string  `xml:"command"`
	Username       string  `xml:"username"`
	StockSymbol    string  `xml:"stockSymbol"`
	Filename       string  `xml:"filename"`
	Funds          float64 `xml:"funds"`
}

// QuoteServer data type
type QuoteServer struct {
	Timestamp       string `xml:"timestamp"`
	Server          string `xml:"server"`
	TransactionNum  int    `xml:"transactionNum"`
	Price           int    `xml:"price"`
	StockSymbol     string `xml:"stockSymbol"`
	Username        string `xml:"username"`
	QuoteServerTime int
	CryptoKey       string
}

// AccountTransaction data type
type AccountTransaction struct {
	Timestamp      string  `xml:"timestamp"`
	Server         string  `xml:"server"`
	TransactionNum int     `xml:"transactionNum"`
	Action         string  `xml:"action"`
	Username       string  `xml:"username"`
	Funds          float64 `xml:"funds"`
}

// ErrorEvent data type
type ErrorEvent struct {
	Timestamp      string  `xml:"timestamp"`
	Server         string  `xml:"server"`
	TransactionNum int     `xml:"transactionNum"`
	Command        string  `xml:"command"`
	Username       string  `xml:"username"`
	StockSymbol    string  `xml:"stockSymbol"`
	Filename       string  `xml:"filename"`
	Funds          float64 `xml:"funds"`
	ErrorMessage   string  `xml:errorMessage`
}

func logUserCommandHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		TransactionNum int
		Server         string
		Command        string
		Username       string
		Stock          string
		Filename       string
		Funds          float64
	}{0, "", "", "", "", "", 0.0}

	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	// res2B, _ := json.Marshal(req)
	// fmt.Println(string(res2B))

	queryString := "INSERT INTO user_commands (command, filename, funds, server, stock, timestamp, transaction_num, user_id)" +
		" VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"

	timestamp := createTimestamp()

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare user command log query")

	res, err := stmt.Exec(req.Command, req.Filename, req.Funds, req.Server, req.Stock, timestamp, req.TransactionNum, req.Username)
	failOnError(err, "Failed to add user command log")

	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to add user command log")
	}

}

func logSystemEventHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		TransactionNum int
		Server         string
		Command        string
		Username       string
		Stock          string
		Filename       string
		Funds          float64
	}{0, "", "", "", "", "", 0.0}

	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	// res2B, _ := json.Marshal(req)
	// fmt.Println(string(res2B))

	queryString := "INSERT INTO system_events (command, filename, funds, server, stock, timestamp, transaction_num, user_id)" +
		" VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"

	timestamp := createTimestamp()

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare system event log query")

	res, err := stmt.Exec(req.Command, req.Filename, req.Funds, req.Server, req.Stock, timestamp, req.TransactionNum, req.Username)
	failOnError(err, "Failed to add system event log")

	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to add system event log")
	}
}

func logQuoteServerHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		TransactionNum  int
		Server          string
		Action          string
		Username        string
		Stock           string
		CryptoKey       string
		QuoteServerTime int64
		Price           float64
	}{0, "", "", "", "", "", 0, 0.0}

	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	// res2B, _ := json.Marshal(req)
	// fmt.Println(string(res2B))

	queryString := "INSERT INTO quote_server_events (action, crypto_key, price, quote_server_time, server, stock, timestamp, transaction_num, user_id)" +
		" VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"

	timestamp := createTimestamp()

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare quote server event log query")

	res, err := stmt.Exec(req.Action, req.CryptoKey, req.Price, req.QuoteServerTime, req.Server, req.Stock, timestamp, req.TransactionNum, req.Username)
	failOnError(err, "Failed to add quote server event log")

	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to add quote server event log")
	}
}

func logAccountTransactionHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		TransactionNum int
		Server         string
		Action         string
		Username       string
		Funds          float64
	}{0, "", "", "", 0.0}

	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	// res2B, _ := json.Marshal(req)
	// fmt.Println(string(res2B))

	queryString := "INSERT INTO account_transactions (action, funds, timestamp, transaction_num, user_id)" +
		" VALUES ($1, $2, $3, $4, $5)"

	timestamp := createTimestamp()

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare account transaction log query")

	res, err := stmt.Exec(req.Action, req.Funds, timestamp, req.TransactionNum, req.Username)
	failOnError(err, "Failed to add account transaction log")

	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to add account transaction log")
	}
}

func logErrorEventHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		TransactionNum int
		Server         string
		Command        string
		Username       string
		Stock          string
		Filename       string
		ErrorMessage   string
		Funds          float64
	}{0, "", "", "", "", "", "", 0.0}

	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	// res2B, _ := json.Marshal(req)
	// fmt.Println(string(res2B))

	queryString := "INSERT INTO error_events (error_message, filename, funds, stock, timestamp, transaction_num, user_id)" +
		" VALUES ($1, $2, $3, $4, $5, $6, $7)"

	timestamp := createTimestamp()

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare error events log query")

	res, err := stmt.Exec(req.ErrorMessage, req.Filename, req.Funds, req.Stock, timestamp, req.TransactionNum, req.Username)
	failOnError(err, "Failed to add error events log")

	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to add error events log")
	}
}

func dumpLog(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		Filename string
	}{""}
	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	queryString := "SELECT * FROM user_commands"

	rows, err := db.Query(queryString)
	failOnError(err, "Failed to prepare query")
	defer rows.Close()

	userCommandArray := []userCommand{}

	for rows.Next() {
		uc := userCommand{}

		if err := rows.Scan(&uc.Command, &uc.Filename, &uc.Funds, &uc.Server,
			&uc.StockSymbol, &uc.Timestamp, &uc.TransactionNum, &uc.Username); err != nil {
			log.Fatal(err)
		}

		userCommandArray = append(userCommandArray, uc)
	}

	// Write to file
	file, err := os.Create(req.Filename)
	failOnError(err, "File couldn't be created")
	defer file.Close()

	for _, uc := range userCommandArray {

		test, err := xml.MarshalIndent(uc, "  ", "    ")
		if err != nil {
			fmt.Printf("error: %v\n", err)
		}

		n1, err := file.Write(test)
		fmt.Printf("wrote %d bytes\n", n1)

		failOnError(err, "Failed to write log files to XML")
	}

	// os.Stdout.Write(test)
}

func dumpUserLog(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		Filename string
		UserID   string
	}{"", ""}
	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

}

func main() {
	port := ":8081"
	http.HandleFunc("/logUserCommand", logUserCommandHandler)
	http.HandleFunc("/logSystemEvent", logSystemEventHandler)
	http.HandleFunc("/logQuoteServer", logQuoteServerHandler)
	http.HandleFunc("/logAccountTransaction", logAccountTransactionHandler)
	http.HandleFunc("/logErrorEvent", logErrorEventHandler)
	http.HandleFunc("/dumpLog", dumpLog)
	http.ListenAndServe(port, nil)
}
