package main

import (
	"database/sql"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"log"
	"net/http"
	"os"
	"sort"
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
type UserCommand struct {
	XMLName        xml.Name `xml:"userCommand"`
	Timestamp      int      `xml:"timestamp"`
	Server         string   `xml:"server"`
	TransactionNum int      `xml:"transactionNum"`
	Command        string   `xml:"command"`
	Username       string   `xml:"username,omitempty"`
	StockSymbol    string   `xml:"stockSymbol,omitempty"`
	Filename       string   `xml:"filename,omitempty"`
	Funds          float64  `xml:"funds,omitempty"`
}

func (uc UserCommand) GetTimestamp() int {
	return uc.Timestamp
}

// SystemEvent data type
type SystemEvent struct {
	XMLName        xml.Name `xml:"systemEvent"`
	Timestamp      int      `xml:"timestamp"`
	Server         string   `xml:"server"`
	TransactionNum int      `xml:"transactionNum"`
	Command        string   `xml:"command"`
	Username       string   `xml:"username,omitempty"`
	StockSymbol    string   `xml:"stockSymbol,omitempty"`
	Filename       string   `xml:"filename,omitempty"`
	Funds          float64  `xml:"funds,omitempty"`
}

func (se SystemEvent) GetTimestamp() int {
	return se.Timestamp
}

// QuoteServer data type
type QuoteServer struct {
	XMLName         xml.Name `xml:"quoteServer"`
	Timestamp       int      `xml:"timestamp"`
	Server          string   `xml:"server"`
	TransactionNum  int      `xml:"transactionNum"`
	Price           int      `xml:"price"`
	StockSymbol     string   `xml:"stockSymbol"`
	Username        string   `xml:"username"`
	QuoteServerTime int      `xml:"quoteServerTime"`
	CryptoKey       string   `xml:"cryptoKey"`
}

func (qs QuoteServer) GetTimestamp() int {
	return qs.Timestamp
}

// AccountTransaction data type
type AccountTransaction struct {
	XMLName        xml.Name `xml:"accountTransaction"`
	Timestamp      int      `xml:"timestamp"`
	Server         string   `xml:"server"`
	TransactionNum int      `xml:"transactionNum"`
	Action         string   `xml:"action"`
	Username       string   `xml:"username"`
	Funds          float64  `xml:"funds"`
}

func (at AccountTransaction) GetTimestamp() int {
	return at.Timestamp
}

// ErrorEvent data type
type ErrorEvent struct {
	XMLName        xml.Name `xml:"errorEvent"`
	Timestamp      int      `xml:"timestamp"`
	Server         string   `xml:"server"`
	TransactionNum int      `xml:"transactionNum"`
	Command        string   `xml:"command"`
	Username       string   `xml:"username,omitempty"`
	StockSymbol    string   `xml:"stockSymbol,omitempty"`
	Filename       string   `xml:"filename,omitempty"`
	Funds          float64  `xml:"funds,omitempty"`
	ErrorMessage   string   `xml:"errorMessage,omitempty"`
}

func (ee ErrorEvent) GetTimestamp() int {
	return ee.Timestamp
}

type LogType interface {
	GetTimestamp() int
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
		Username        string
		Stock           string
		CryptoKey       string
		QuoteServerTime int64
		Price           float64
	}{0, "", "", "", "", 0, 0.0}

	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	// res2B, _ := json.Marshal(req)
	// fmt.Println(string(res2B))

	queryString := "INSERT INTO quote_server_events (crypto_key, price, quote_server_time, server, stock, timestamp, transaction_num, user_id)" +
		" VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"

	timestamp := createTimestamp()

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare quote server event log query")

	res, err := stmt.Exec(req.CryptoKey, req.Price, req.QuoteServerTime, req.Server, req.Stock, timestamp, req.TransactionNum, req.Username)
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

	queryString := "INSERT INTO account_transactions (action, funds, server, timestamp, transaction_num, user_id)" +
		" VALUES ($1, $2, $3, $4, $5, $6)"

	timestamp := createTimestamp()

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare account transaction log query")

	res, err := stmt.Exec(req.Action, req.Funds, req.Server, timestamp, req.TransactionNum, req.Username)
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

	queryString := "INSERT INTO error_events (error_message, filename, funds, server, stock, timestamp, transaction_num, user_id)" +
		" VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"

	timestamp := createTimestamp()

	stmt, err := db.Prepare(queryString)
	failOnError(err, "Failed to prepare error events log query")

	res, err := stmt.Exec(req.ErrorMessage, req.Filename, req.Funds, req.Server, req.Stock, timestamp, req.TransactionNum, req.Username)
	failOnError(err, "Failed to add error events log")

	numrows, err := res.RowsAffected()
	if numrows < 1 {
		failOnError(err, "Failed to add error events log")
	}
}

func dumpLogHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		Filename string
	}{""}
	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	dumpLog(req.Filename, "", false)
}

func dumpUserLogHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		Filename string
		UserID   string
	}{"", ""}
	err := decoder.Decode(&req)
	failOnError(err, "Failed to parse the request")

	dumpLog(req.Filename, req.UserID, true)
}

func dumpLog(filename string, username string, isUser bool) {
	userquery := ""
	if isUser {
		userquery = " WHERE user_id = '" + username + "'"
	}
	logs := []LogType{}

	// Get usercommands
	queryString := "SELECT * FROM user_commands" + userquery
	rows, err := db.Query(queryString)
	failOnError(err, "Failed to prepare query")
	defer rows.Close()

	for rows.Next() {
		logEvent := UserCommand{}

		if err := rows.Scan(&logEvent.Command, &logEvent.Filename, &logEvent.Funds, &logEvent.Server,
			&logEvent.StockSymbol, &logEvent.Timestamp, &logEvent.TransactionNum, &logEvent.Username); err != nil {
			log.Fatal(err)
		}

		logs = append(logs, logEvent)
	}

	// Get systemevents
	queryString = "SELECT * FROM system_events" + userquery

	rows, err = db.Query(queryString)
	failOnError(err, "Failed to prepare query")
	defer rows.Close()

	for rows.Next() {
		logEvent := SystemEvent{}

		if err := rows.Scan(&logEvent.Command, &logEvent.Filename, &logEvent.Funds, &logEvent.Server,
			&logEvent.StockSymbol, &logEvent.Timestamp, &logEvent.TransactionNum, &logEvent.Username); err != nil {
			log.Fatal(err)
		}

		logs = append(logs, logEvent)
	}

	// Get quoteserver
	queryString = "SELECT * FROM quote_server_events" + userquery

	rows, err = db.Query(queryString)
	failOnError(err, "Failed to prepare query")
	defer rows.Close()

	for rows.Next() {
		logEvent := QuoteServer{}

		if err := rows.Scan(&logEvent.CryptoKey, &logEvent.Price, &logEvent.QuoteServerTime,
			&logEvent.Server, &logEvent.StockSymbol, &logEvent.Timestamp, &logEvent.TransactionNum, &logEvent.Username); err != nil {
			log.Fatal(err)
		}

		logs = append(logs, logEvent)
	}

	// Get accounttransactions
	queryString = "SELECT * FROM account_transactions" + userquery

	rows, err = db.Query(queryString)
	failOnError(err, "Failed to prepare query")
	defer rows.Close()

	for rows.Next() {
		logEvent := AccountTransaction{}

		if err := rows.Scan(&logEvent.Action, &logEvent.Funds, &logEvent.Server, &logEvent.Timestamp,
			&logEvent.TransactionNum, &logEvent.Username); err != nil {
			log.Fatal(err)
		}

		logs = append(logs, logEvent)
	}

	// Get errorevents
	queryString = "SELECT * FROM error_events" + userquery

	rows, err = db.Query(queryString)
	failOnError(err, "Failed to prepare query")
	defer rows.Close()

	for rows.Next() {
		logEvent := ErrorEvent{}

		if err := rows.Scan(&logEvent.ErrorMessage, &logEvent.Filename, &logEvent.Funds, &logEvent.Server,
			&logEvent.StockSymbol, &logEvent.Timestamp, &logEvent.TransactionNum, &logEvent.Username); err != nil {
			log.Fatal(err)
		}

		logs = append(logs, logEvent)
	}

	// Sort by timestamp
	sort.Slice(logs, func(i, j int) bool {
		return logs[i].GetTimestamp() < logs[j].GetTimestamp()
	})

	// Write to file
	file, err := os.Create(filename)
	failOnError(err, "File couldn't be created")
	defer file.Close()
	file.Write([]byte("<?xml version=\"1.0\"?>\n"))
	file.Write([]byte("<log>\n"))
	test, err := xml.MarshalIndent(logs, "  ", "    ")
	if err != nil {
		fmt.Printf("error: %v\n", err)
	}

	n1, err := file.Write(test)
	file.Write([]byte("\n</log>"))
	fmt.Printf("wrote %d bytes\n", n1)

	failOnError(err, "Failed to write log files to XML")

}

func main() {
	port := ":8081"
	http.HandleFunc("/logUserCommand", logUserCommandHandler)
	http.HandleFunc("/logSystemEvent", logSystemEventHandler)
	http.HandleFunc("/logQuoteServer", logQuoteServerHandler)
	http.HandleFunc("/logAccountTransaction", logAccountTransactionHandler)
	http.HandleFunc("/logErrorEvent", logErrorEventHandler)
	http.HandleFunc("/dumpLog", dumpLogHandler)
	http.HandleFunc("/dumpUserLog", dumpUserLogHandler)
	http.ListenAndServe(port, nil)
}
