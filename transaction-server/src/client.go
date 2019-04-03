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

	_ = decoder.Decode(&req)

	response := struct {
		Balance      float64
		StockAmounts []StockRows
		BuyTriggers []BuyTriggerRows
		SellTriggers []SellTriggerRows
		BuyAmounts []BuyAmountRows
		SellAmounts []SellAmountRows
	}{0, nil, nil, nil, nil, nil}

	response.Balance = getBalance(req.UserID)
	response.StockAmounts = getOwnedStocks(req.UserID)
	response.BuyTriggers = getSetBuyTriggers(req.UserID)
	response.SellTriggers = getSetSellTriggers(req.UserID)
	response.BuyAmounts = getSetBuyAmounts(req.UserID)
	response.SellAmounts = getSetSellAmounts(req.UserID)

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

	queryString := "SELECT symbol, quantity FROM stocks WHERE user_id = $1;"
	rows, err := db.Query(queryString, UserID)

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

type BuyTriggerRows struct {
	Symbol string
	Price float64
}

func getSetBuyTriggers(UserID string) []BuyTriggerRows {
	buyTriggers := []BuyTriggerRows{}

	queryString := "SELECT symbol, price FROM triggers WHERE user_id = $1 AND method = 'buy';"
	rows, err := db.Query(queryString, UserID)

	defer rows.Close()

	if err != nil {
		failGracefully(err, "Failed to select buy triggers")
	}

	for rows.Next() {
		buyTrigger := BuyTriggerRows{}
		if err := rows.Scan(&buyTrigger.Symbol, &buyTrigger.Price); err != nil {
			failGracefully(err, "Failed to parse symbol and price")
		}
		buyTriggers = append(buyTriggers, buyTrigger)
	}
	return buyTriggers
}

type SellTriggerRows struct {
	Symbol string
	Price float64
}

func getSetSellTriggers(UserID string) []SellTriggerRows {
	sellTriggers := []SellTriggerRows{}

	queryString := "SELECT symbol, price FROM triggers WHERE user_id = $1 AND method = 'sell';"
	rows, err := db.Query(queryString, UserID)

	defer rows.Close()

	if err != nil {
		failGracefully(err, "Failed to select sell triggers")
	}

	for rows.Next() {
		sellTrigger := SellTriggerRows{}
		if err := rows.Scan(&sellTrigger.Symbol, &sellTrigger.Price); err != nil {
			failGracefully(err, "Failed to parse symbol and price")
		}
		sellTriggers = append(sellTriggers, sellTrigger)
	}
	return sellTriggers
}

type BuyAmountRows struct {
	Symbol string
	Quantity float64
}

func getSetBuyAmounts(UserID string) []BuyAmountRows {
	buyAmounts := []BuyAmountRows{}

	queryString := "SELECT symbol, quantity FROM buy_amounts WHERE user_id = $1;"
	rows, err := db.Query(queryString, UserID)

	defer rows.Close()

	if err != nil {
		failGracefully(err, "Failed to select buy amounts")
	}

	for rows.Next() {
		buyAmount := BuyAmountRows{}
		if err := rows.Scan(&buyAmount.Symbol, &buyAmount.Quantity); err != nil {
			failGracefully(err, "Failed to parse symbol and quantity")
		}
		buyAmounts = append(buyAmounts, buyAmount)
	}
	return buyAmounts
}

type SellAmountRows struct {
	Symbol string
	Quantity float64
}

func getSetSellAmounts(UserID string) []SellAmountRows {
	sellAmounts := []SellAmountRows{}

	queryString := "SELECT symbol, quantity FROM sell_amounts WHERE user_id = $1;"
	rows, err := db.Query(queryString, UserID)

	defer rows.Close()

	if err != nil {
		failGracefully(err, "Failed to select sell amounts")
	}

	for rows.Next() {
		sellAmount := SellAmountRows{}
		if err := rows.Scan(&sellAmount.Symbol, &sellAmount.Quantity); err != nil {
			failGracefully(err, "Failed to parse symbol and quantity")
		}
		sellAmounts = append(sellAmounts, sellAmount)
	}
	return sellAmounts
}
