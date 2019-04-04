import React, { Component } from 'react';
import '../App.css';

export default class MyAccount extends Component {
    listStocks = (userState) => {
        let table = []
    
        // Outer loop to create parent
        for (let i = -1; i < userState.StockAmounts.length; i++) {
          let children = []
          //Inner loop to create children
          for (let j = 0; j < 3; j++) {
            if (i == -1 && j == 0) {
                children.push(<td>{'Stock Symbol'}</td>)
            } else if (i == -1 && j == 1) {
                children.push(<td>{'Amount ($)'}</td>)
            } else if (j == 0) {
                children.push(<td>{`${userState.StockAmounts[i].Symbol}`}</td>)
            } else if (j == 1) {
                children.push(<td>{`${userState.StockAmounts[i].Quantity}`}</td>)
            }
          }
          //Create the parent and add the children
          table.push(<tr>{children}</tr>)
        }
        return table
      }

      listBuyAmounts = (userState) => {
        let table = []
    
        // Outer loop to create parent
        for (let i = -1; i < userState.BuyAmounts.length; i++) {
          let children = []
          //Inner loop to create children
          for (let j = 0; j < 3; j++) {
            if (i == -1 && j == 0) {
                children.push(<td>{'Stock Symbol'}</td>)
            } else if (i == -1 && j == 1) {
                children.push(<td>{'Amount ($)'}</td>)
            } else if (j == 0) {
                children.push(<td>{`${userState.BuyAmounts[i].Symbol}`}</td>)
            } else if (j == 1) {
                children.push(<td>{`${userState.BuyAmounts[i].Quantity}`}</td>)
            }
          }
          //Create the parent and add the children
          table.push(<tr>{children}</tr>)
        }
        return table
      }

      listBuyTriggers = (userState) => {
        let table = []
    
        // Outer loop to create parent
        for (let i = -1; i < userState.BuyTriggers.length; i++) {
          let children = []
          //Inner loop to create children
          for (let j = 0; j < 3; j++) {
            if (i == -1 && j == 0) {
                children.push(<td>{'Stock Symbol'}</td>)
            } else if (i == -1 && j == 1) {
                children.push(<td>{'Amount ($)'}</td>)
            } else if (j == 0) {
                children.push(<td>{`${userState.BuyTriggers[i].Symbol}`}</td>)
            } else if (j == 1) {
                children.push(<td>{`${userState.BuyTriggers[i].Price}`}</td>)
            }
          }
          //Create the parent and add the children
          table.push(<tr>{children}</tr>)
        }
        return table
      }

      listSellAmounts = (userState) => {
        let table = []
    
        // Outer loop to create parent
        for (let i = -1; i < userState.SellAmounts.length; i++) {
          let children = []
          //Inner loop to create children
          for (let j = 0; j < 3; j++) {
            if (i == -1 && j == 0) {
                children.push(<td>{'Stock Symbol'}</td>)
            } else if (i == -1 && j == 1) {
                children.push(<td>{'Amount ($)'}</td>)
            } else if (j == 0) {
                children.push(<td>{`${userState.SellAmounts[i].Symbol}`}</td>)
            } else if (j == 1) {
                children.push(<td>{`${userState.SellAmounts[i].Quantity}`}</td>)
            }
          }
          //Create the parent and add the children
          table.push(<tr>{children}</tr>)
        }
        return table
      }

      listSellTriggers = (userState) => {
        let table = []
    
        // Outer loop to create parent
        for (let i = -1; i < userState.SellTriggers.length; i++) {
          let children = []
          //Inner loop to create children
          for (let j = 0; j < 3; j++) {
            if (i == -1 && j == 0) {
                children.push(<td>{'Stock Symbol'}</td>)
            } else if (i == -1 && j == 1) {
                children.push(<td>{'Amount ($)'}</td>)
            } else if (j == 0) {
                children.push(<td>{`${userState.SellTriggers[i].Symbol}`}</td>)
            } else if (j == 1) {
                children.push(<td>{`${userState.SellTriggers[i].Price}`}</td>)
            }
          }
          //Create the parent and add the children
          table.push(<tr>{children}</tr>)
        }
        return table
      }

    render() {
        const userState = this.props.userState;

        return (
            <div>
                <div>
                    <h2 className="title-h2">{`Account Details for ${userState.userID}`}</h2>
                </div>
                <div className="table-styling">
                    <p>
                        {`Account Balance: $${userState.Balance}`}
                    </p>
                    <p></p>
                    <p></p>

                    <strong>
                        Stocks Owned:
                    </strong>
                    <table align="center">
                        {this.listStocks(userState)}
                    </table>
                    <p></p>
                    <p></p>

                    <strong>
                        Buy Amounts
                    </strong>
                    <table align="center">
                        {this.listBuyAmounts(userState)}
                    </table>
                    <p></p>
                    <p></p>

                    <strong>
                        Buy Triggers
                    </strong>
                    <table align="center">
                        {this.listBuyTriggers(userState)}
                    </table>
                    <p></p>
                    <p></p>

                    <strong>
                        Sell Amounts
                    </strong>
                    <table align="center">
                        {this.listSellAmounts(userState)}
                    </table>
                    <p></p>
                    <p></p>

                    <strong>
                        Sell Triggers
                    </strong>
                    <table align="center">
                        {this.listSellTriggers(userState)}
                    </table>
                    <p></p>
                    <p></p>
                </div>
            </div>
        );
    }
}
