import React, { Component } from 'react';
import '../App.css';
import { Layout, Content } from 'react-mdl';
import logo from '../logo_circle.gif';
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
            <div className="move-down">
              <img
                src={logo}
                alt="avatar"
                className="large-img">
              </img>
              <div className="slogan">
                <strong className="slogan-name">
                  We Make Day Trading Easy!
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
