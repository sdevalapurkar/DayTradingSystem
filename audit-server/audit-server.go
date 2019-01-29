package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/herenow/go-crate"
)

var (
	audit       = loadDb(auditstring)
	auditstring = "http://localhost:4201"
)

func failOnError(err error, msg string) {
	if err != nil {
		fmt.Printf("%s: %s", msg, err)
		panic(err)
	}
}

func loadDb(dbstring string) *sql.DB {
	db, err := sql.Open("crate", dbstring)

	// If can't connect to DB
	failOnError(err, "Couldn't connect to CrateDB")
	// err := db.Ping()
	// failOnError(err, "Couldn't ping CrateDB")

	return db
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
}

func logSystemEventHandler(w http.ResponseWriter, r *http.Request) {

}

func logQuoteServerHandler(w http.ResponseWriter, r *http.Request) {

}

func logAccountTransactionHandler(w http.ResponseWriter, r *http.Request) {

}

func logErrorEventHandler(w http.ResponseWriter, r *http.Request) {

}

func main() {
	port := ":8081"
	http.HandleFunc("logUserCommand", logUserCommandHandler)
	http.HandleFunc("logSystemEvent", logSystemEventHandler)
	http.HandleFunc("logQuoteServer", logQuoteServerHandler)
	http.HandleFunc("logAccountTransaction", logAccountTransactionHandler)
	http.HandleFunc("logErrorEvent", logErrorEventHandler)
	http.ListenAndServe(port, nil)
}
