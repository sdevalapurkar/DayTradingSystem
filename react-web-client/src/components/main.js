import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import TeamMembers from './contact';
import Trading from './trading';
import MyAccount from './myaccount';
import PropTypes from 'prop-types';

class Main extends Component {
    componentDidMount() {
        console.log('main props: ', this.props);
    }

    render() {
        return (
            <Switch>
                <Route path="/contact" component={TeamMembers} />
                <Route path="/login" render={(props) => <Trading {...props} userState={this.props.userState} /> } />
                <Route path="/myaccount" render={(props) => <MyAccount {...props} userState={this.props.userState} /> } />
            </Switch>
        );
    }
}

Main.propTypes = {
    userState: PropTypes.any,
};

export default Main;
