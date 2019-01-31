package main

import (
	"fmt"
	"database/sql"
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

// Reserves the given amount of money from the given user
// Parameters:
// 		UserID: 	the userID for the user to reserve funds from
// 		amount:		the amount of money to reserve
// 
func ReserveFunds(UserID string, amount float64) {

}

func ReleaseFunds(UserID string, amount float64) {
	
}
