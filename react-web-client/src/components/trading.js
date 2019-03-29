import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const host = 'http://localhost';
const port = 8123;

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
            open: false,
        }
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    isPositiveNumber(value) {
        if (isNaN(value)) {
            alert('Please enter a valid dollar amount.');
            return false;
        } else if (value < 0) {
            alert('Please enter a positive dollar amount.');
            return false;
        } else if (!value) {
            alert('Please enter a dollar amount.');
            return false;
        }

        return true;
    }

    getQuote() {
        if (this.state.quoteSymbol.length > 3) {
            alert('Please enter a valid stock symbol.');  
            return;
        } else if (!this.state.quoteSymbol) {
            alert('Please enter a stock symbol.');
            return;
        }

      const userID = this.props.userState.userID;
      axios.get(`${host}:${port}/quote`, {
            'userID': userID,
            'symbol': this.state.quoteSymbol,
            'transactionNum': 1,
      })
      .then(response => {
            console.log('response is: ', response);
            response.data = { ...response.data, userID: this.state.userID };
            console.log('response.data ', response.data);
      })
      .catch(err => {
            console.log('err is: ', err);
      });
    }

    addAmount() {
        if (!this.isPositiveNumber(this.state.amountToAdd)) {
            return;
        }

        const userID = this.props.userState.userID;
        axios.post(`${host}:${port}/add`, {
            'userID': userID,
            'amount': this.state.amountToAdd,
            'transactionNum': 1,
        })
        .then(response => {
                console.log('response is: ', response);
                response.data = { ...response.data, userID: this.state.userID };
                console.log('response.data ', response.data);
        })
        .catch(err => {
                console.log('err is: ', err);
        });
    }

    buyStock() {
        if (this.state.stockToBuy.length > 3) {
            alert('Please enter a valid stock symbol.');  
            return;
        } else if (!this.state.stockToBuy) {
            alert('Please enter a stock symbol.');
            return;
        }

        if (!this.isPositiveNumber(this.state.amountToBuy)) {
            return;
        }

        this.handleClickOpen();

        const userID = this.props.userState.userID;
        axios.post(`${host}:${port}/buy`, {
            'userID': userID,
            'amount': this.state.amountToBuy,
            'symbol': this.state.stockToBuy,
            'transactionNum': 1,
        })
        .then(response => {
                console.log('response is: ', response);
                response.data = { ...response.data, userID: this.state.userID };
                console.log('response.data ', response.data);
        })
        .catch(err => {
                console.log('err is: ', err);
        });
    }

    sellStock() {
        if (this.state.stockToSell.length > 3) {
            alert('Please enter a valid stock symbol.');  
            return;
        } else if (!this.state.stockToSell) {
            alert('Please enter a stock symbol.');
            return;
        }
        if (!this.isPositiveNumber(this.state.amountToSell)) {
            return;
        }

        const userID = this.props.userState.userID;
        axios.post(`${host}:${port}/sell`, {
            'userID': userID,
            'amount': this.state.amountToSell,
            'symbol': this.state.stockToSell,
            'transactionNum': 1,
        })
        .then(response => {
                console.log('response is: ', response);
                response.data = { ...response.data, userID: this.state.userID };
                console.log('response.data ', response.data);
        })
        .catch(err => {
                console.log('err is: ', err);
        });
    }

    render() {
        return (
            <div>
                <div>
                    <h2 className="title-h2">Day Trading Time!</h2>
                </div>
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
                    <input className="input-class-name" placeholder="Enter amount" type="text" onChange={evt => this.setState({ amountToAdd: evt.target.value })} />
                    </label>
                    <input className="button-fancy-new" value="Add Amount" onClick={() => this.addAmount()} />
                </form>
                <form className="form-class-name">
                    <p>Buy Stock:</p>
                    <label>
                    <input className="input-class-name" placeholder="Enter stock symbol" type="text" onChange={evt => this.setState({ stockToBuy: evt.target.value })} />
                    <input className="input-class-name" placeholder="Enter amount" type="text" onChange={evt => this.setState({ amountToBuy: evt.target.value })} />
                    </label>
                    <input className="button-fancy-new" value="Buy Stock" onClick={() => this.buyStock()} />
                </form>
                <form className="form-class-name">
                    <p>Sell Stock:</p>
                    <label>
                    <input className="input-class-name" placeholder="Enter stock symbol" type="text" onChange={evt => this.setState({ stockToSell: evt.target.value })} />
                    <input className="input-class-name" placeholder="Enter amount" type="text" onChange={evt => this.setState({ amountToSell: evt.target.value })} />
                    </label>
                    <input className="button-fancy-new" value="Sell Stock" onClick={() => this.sellStock()} />
                </form>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Commit your Transaction"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you would like to buy this amount of stock at this time?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel Buy
                        </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            Commit Buy
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Trading.propTypes = {
    userState: PropTypes.any,
};
