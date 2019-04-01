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
            buyOpen: false,
            sellOpen: false,
        }
    }

    handleClickOpen = () => {
        this.setState({ buyOpen: true });
    };

    handleClickOpenSell = () => {
        this.setState({ sellOpen: true });
    }

    handleCloseSell = () => {
        this.setState({ sellOpen: false });
    }
    
    handleCommitBuy = () => {
        const userID = this.props.userState.userID;
        axios.post(`${host}:${port}/commit_buy`, {
            'userID': userID,
            'transactionNum': 1,
        })
        .then(response => {
            if (response.status == 200) {
                alert('You have succcessfully committed your buy transaction!');
            }
        })
        .catch(err => {
            alert('Oops, something went wrong. Please try again later.');
        });

        this.setState({ buyOpen: false });
    };

    handleCancelBuy = () => {
        const userID = this.props.userState.userID;
        axios.post(`${host}:${port}/cancel_buy`, {
            'userID': userID,
            'transactionNum': 1,
        })
        .then(response => {
            if (response.status == 200) {
                alert('You have succcessfully cancelled your buy transaction!');
            }
        })
        .catch(err => {
            alert('Oops, something went wrong. Please try again later.');
        });

        this.setState({ buyOpen: false });
    }

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
        axios.post(`${host}:${port}/quote`, {
            'userID': userID,
            'symbol': this.state.quoteSymbol,
            'transactionNum': 1,
        })
        .then(response => {
            const obj = { quote: response.data };
            alert(`The stock ${this.state.quoteSymbol} is currently valued at: $${obj.quote}`);
        })
        .catch(err => {
            alert('Oops, something went wrong. Please ensure you are entering a valid stock symbol. A valid stock symbol must be within 1-3 characters in length and must not contain any numbers or special characters.');
        });
    }

    addAmount() {
        if (!this.isPositiveNumber(this.state.amountToAdd)) {
            return;
        }

        const userID = this.props.userState.userID;
        axios.post(`${host}:${port}/add`, {
            'userID': userID,
            'amount': parseFloat(this.state.amountToAdd),
            'transactionNum': 1,
        })
        .then(response => {
            if (response.status == 200) {
                alert(`Successfully added $${this.state.amountToAdd} to your account!`);
            }
        })
        .catch(err => {
            alert('Oops, something went wrong. Please ensure that you are entering a valid dollar amount to add to your account. Valid dollar amounts are positive numbers.');
        });
    }

    buyStock() {
        if (this.state.stockToBuy.length > 3) {
            alert('Please enter a valid stock symbol.');  
            return;
        } else if (!this.state.stockToBuy) {
            alert('Please enter a stock symbol.');
            return;
        } else if (!this.isPositiveNumber(this.state.amountToBuy)) {
            return;
        }

        const userID = this.props.userState.userID;
        axios.post(`${host}:${port}/buy`, {
            'userID': userID,
            'amount': parseFloat(this.state.amountToBuy),
            'symbol': this.state.stockToBuy,
            'transactionNum': 1,
        })
        .then(response => {
            console.log('response: ', response);
            if (response.status == 200) {
                this.handleClickOpen();
            }
        })
        .catch(err => {
            console.log('err: ', err);
            alert('Please ensure you have sufficient funds in your account.');
        });
    }

    sellStock() {
        if (this.state.stockToSell.length > 3) {
            alert('Please enter a valid stock symbol.');  
            return;
        } else if (!this.state.stockToSell) {
            alert('Please enter a stock symbol.');
            return;
        } else if (!this.isPositiveNumber(this.state.amountToSell)) {
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
            this.handleClickOpenSell();
        })
        .catch(err => {
            alert(`Please ensure you have sufficient amount of the stock ${this.state.stockToSell} in your account.`);
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
                    open={this.state.buyOpen}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    onClose={this.handleCancelBuy}
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
                        <Button onClick={this.handleCancelBuy} color="primary">
                            Cancel Buy
                        </Button>
                        <Button onClick={this.handleCommitBuy} color="primary" autoFocus>
                            Commit Buy
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    open={this.state.sellOpen}
                    onClose={this.handleCloseSell}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Commit your Transaction"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you would like to sell this amount of stock at this time?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseSell} color="primary">
                            Cancel Sell
                        </Button>
                        <Button onClick={this.handleCloseSell} color="primary" autoFocus>
                            Commit Sell
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
