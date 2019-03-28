import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Trading extends Component {
  constructor(props) {
    super(props);
    this.getQuote = this.getQuote.bind(this);
    this.addAmount = this.addAmount.bind(this);
    this.buyStock = this.buyStock.bind(this);
    this.sellStock = this.sellStock.bind(this);
    this.isPositiveNumber = this.isPositiveNumber.bind(this);

    this.state = {
        quoteSymbol: '',
        amountToAdd: 0,
        stockToBuy: '',
        amountToBuy: 0,
        stockToSell: '',
        amountToSell: 0,
    }
  }

  isPositiveNumber(value) {
    if (isNaN(value)) {
        alert('Please enter a valid dollar amount');
        return false;
    } else if (value < 0) {
        alert('Please enter a positive dollar amount');
        return false;
    }

    return true;
  }

  getQuote() {
      if (this.state.quoteSymbol.length > 3) {
        alert('Please enter a valid stock symbol.');  
        return;
      }
      const userID = this.props.userState.userID;
      console.log('hey i clicked quote and the symbol is: ', this.state.quoteSymbol);
  }

  addAmount() {
      if (this.isPositiveNumber(this.state.amountToAdd)) {
        console.log('amount is:', this.state.amountToAdd);
      }
  }

  buyStock() {
      if (this.state.stockToBuy.length > 3) {
        alert('Please enter a valid stock symbol.');  
        return;
      }
      if (this.isPositiveNumber(this.state.amountToBuy)) {
        console.log('stock to buy:', this.state.stockToBuy + ' and amount to buy: ', this.state.amountToBuy);
      }
  }

  sellStock() {
      if (this.state.stockToSell.length > 3) {
        alert('Please enter a valid stock symbol.');  
        return;
      }
      if (this.isPositiveNumber(this.state.amountToSell)) {
        console.log('stock to sell: ', this.state.stockToSell + ' and sell amount: ', this.state.amountToSell);
      }
  }

  render() {
    return (
      <div>
        <form className="form-class-name">
            <p>Get Quote:</p>
            <label>
            <input className="input-class-name" placeholder="Enter stock symbol" type="text" onChange={evt => this.setState({ quoteSymbol: evt.target.value })}/>
            </label>
            <input className="button-fancy-new" value="Get Quote" onClick={() => this.getQuote()} />
        </form>
        <form className="form-class-name">
        <p>Add Money to Account:</p>
            <label>
            <input placeholder="Enter amount" type="text" onChange={evt => this.setState({ amountToAdd: evt.target.value })} />
            </label>
            <input className="button-fancy-new" value="Add Amount" onClick={() => this.addAmount()} />
        </form>
        <form className="form-class-name">
            <p>Buy Stock:</p>
            <label>
            <input placeholder="Enter stock symbol" type="text" onChange={evt => this.setState({ stockToBuy: evt.target.value })} />
            <input placeholder="Enter amount" type="text" onChange={evt => this.setState({ amountToBuy: evt.target.value })} />
            </label>
            <input className="button-fancy-new" value="Buy Stock" onClick={() => this.buyStock()} />
        </form>
        <form className="form-class-name">
            <p>Sell Stock:</p>
            <label>
            <input placeholder="Enter stock symbol" type="text" onChange={evt => this.setState({ stockToSell: evt.target.value })} />
            <input placeholder="Enter amount" type="text" onChange={evt => this.setState({ amountToSell: evt.target.value })} />
            </label>
            <input className="button-fancy-new" value="Sell Stock" onClick={() => this.sellStock()} />
        </form>
      </div>
    );
  }
}

Trading.propTypes = {
    userState: PropTypes.any,
};
