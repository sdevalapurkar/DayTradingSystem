import React, { Component } from 'react';

export default class MyAccount extends Component {
    render() {
        console.log('my account props: ', this.props);

        const tableData = {
            columns: ['Balance'],
            rows: [{
              'Balance': this.props.userState.Balance,
            }]
        };

        const dataColumns = tableData.columns;
        const dataRows = tableData.rows;
  
        const tableHeaders = (
            <thead>
                <tr>
                    {dataColumns.map(function(column) {
                        return <th>{column}</th>;
                    })}
                </tr>
            </thead>
        );
  
        const tableBody = dataRows.map(function(row) {
            return (
                <tr>
                    {dataColumns.map(function(column) {
                        return <td>{row[column]}</td>;
                    })}
                </tr>
            );
        });

        return (
            <table className="table table-bordered table-hover" width="100%">
                {tableHeaders}
                {tableBody}
            </table>
        );
    }
}
