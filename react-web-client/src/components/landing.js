import React, { Component } from 'react';
import '../App.css';
import { Layout, Content } from 'react-mdl';
import logo from '../logo.png';
import PropTypes from 'prop-types';

class Landing extends Component {
  render() {
    if(!this.props.show) {
      return null;
    }

    return (
      <div className="demo-big-content">
        <Layout>
          <Content>
            <div>
              <img
                src={logo}
                alt="avatar"
                className="large-img">
              </img>
              <div className="slogan">
                <strong className="slogan-name">
                  WE MAKE DAY TRADING EASY!
                </strong>
              </div>
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

Landing.propTypes = {
  show: PropTypes.bool,
};

export default Landing;
