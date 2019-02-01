package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-redis/redis"
	_ "github.com/herenow/go-crate"
)

// Connects to the database
func loadDb() *sql.DB {
	db, err := sql.Open("crate", dbstring)
	// If can't connect to DB
	failOnError(err, "Couldn't connect to CrateDB")
	return db
}

// Checks and panics on error
// Parameters:
// 		err: 	the error to check
// 		msg: 	a message to print to the console if an error is found
//
func failOnError(err error, msg string) {
	if err != nil {
		fmt.Printf("%s: %s", msg, err)
		panic(err)
	}
}

func failGracefully(err error, msg string) {
	if err != nil {
		fmt.Printf("%s: %s", msg, err)
	}
}

// Returns a fresh quote for a given stock symbol.
// If there is a fresh quote cached, then that value is returned. Otherwise, it fetches and stores one.
// Parameters:
//		symbol: 	(string) symbol of the stock to quote
//
func getQuote(symbol string) float64 {
	// Check if symbol is in cache
	quote, err := cache.Get(symbol).Result()

	if err == redis.Nil {
		// Get quote from the quote server and store it with ttl 60s
		r, err := http.Get("http://localhost:3000/quote")
		failOnError(err, "Failed to retrieve quote from quote server")
		defer r.Body.Close()

		failOnError(err, "Failed to parse quote server response")
		decoder := json.NewDecoder(r.Body)

		res := struct {
			Quote float64
		}{0.0}

		err = decoder.Decode(&res)
		failOnError(err, "Failed to parse quote server response data")

		cache.Set(symbol, strconv.FormatFloat(res.Quote, 'f', -1, 64), 60000000000)
		return 50.0
	} else {
		// Otherwise, return the cached value
		quote, err := strconv.ParseFloat(quote, 32)
		failOnError(err, "Failed to parse float from quote")
		return quote
	}
}

// Reserves the given amount of money from the given user
// Parameters:
// 		UserID: 	the userID for the user to reserve funds from
// 		amount:		the amount of money to reserve
//
func ReserveFunds(UserID string, amount float64) {

}

func ReleaseFunds(UserID string, amount float64) {

}
