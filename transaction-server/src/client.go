package main

import (
	"encoding/json"
	"net/http"

	_ "github.com/herenow/go-crate"
)

func getUserDataHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	req := struct {
		UserID string
	}{""}

	response := struct {
		Balance      float64
		StockAmounts []StockRows
	}{0, nil}

	response.Balance = getBalance(req.UserID)
	response.StockAmounts = getOwnedStocks(req.UserID)

	_ = decoder.Decode(&req)

	payload, _ := json.Marshal(response)

	w.Header().Set("Content-Type", "application/json")
	w.Write(payload)
}

// Returns the balance of a given user
//
func getBalance(UserID string) float64 {
	queryString := "SELECT balance FROM users WHERE user_id = $1;"

	stmt, _ := db.Prepare(queryString)

	var balance float64

	err := stmt.QueryRow(UserID).Scan(&balance)
	defer stmt.Close()

	// If query returns nothing, we need to add the user to the database with a balance of 0
	if err != nil {
		queryString = "INSERT INTO users (user_id, balance) VALUES ($1, $2)"

		stmt, _ := db.Prepare(queryString)

		res, _ := stmt.Exec(UserID, 0)

		numrows, err := res.RowsAffected()
		if numrows < 1 {
			failOnError(err, "Failed to add balance")
		}
		balance = 0.0
	}
	return balance
}

type StockRows struct {
	Symbol   string
	Quantity int
}

// Return the quantities of each stock owned by a given user
//
func getOwnedStocks(UserID string) []StockRows {

	stocks := []StockRows{}

	queryString := "SELECT symbol, quantity FROM stocks WHERE user_id = $1"
	rows, err := db.Query(queryString)

	defer rows.Close()

	if err != nil {
		failGracefully(err, "Failed to select stock amounts")
	}

	for rows.Next() {
		stockAmount := StockRows{}
		if err := rows.Scan(&stockAmount.Symbol, &stockAmount.Quantity); err != nil {
			failGracefully(err, "Failed to parse symbol and amount")
		}
		stocks = append(stocks, stockAmount)
	}
	return stocks
}
