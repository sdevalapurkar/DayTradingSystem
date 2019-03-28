import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import TeamMembers from './contact';
import Trading from './trading';
import MyAccount from './myaccount';
import PropTypes from 'prop-types';

class Main extends Component {
    componentDidMount() {
        console.log(this.props);
    }

    render() {
        return (
            <Switch>
                <Route path="/contact" component={TeamMembers} />
                <Route path="/login" render={(props) => <Trading {...props} userState={this.props.userState} /> } />
                <Route path="/myaccount" render={(props) => <MyAccount {...props} data = {tableData} /> } />
            </Switch>
        );
    }
}

var tableData = {
    columns: ['Service', 'Cost/Unit', 'Unit', 'Units Requested'],
    rows: [{
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'Veterinary Assitance',
      'Cost/Unit': 50,
      'Unit': '1 Hour',
      'Units Requested': 12
    }, {
      'Service': 'foo',
      'Unit': null,
      'Cost/Unit': undefined,
      'Units Requested': 42
    }]
};

Main.propTypes = {
    userState: PropTypes.any,
};

export default Main;
