import React, { Component } from 'react';
import './App.css';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import { Link } from 'react-router-dom';
import logo from './logo_circle.gif';
import Main from './components/main';
import Modal from './components/modal';
import Landing from './components/landing';
import axios from 'axios';

const host = 'http://localhost';
const port = 8123;

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        isOpen: false,
        isLoggedIn: false,
        userState: {},
    };

    this.setUserStateValues = this.setUserStateValues.bind(this);
  }

  setUserStateValues(userState) {
    this.setState({
        userState,
        isLoggedIn: true,
    });
    this.toggleModal();

    console.log('user state mate: ', this.state.userState);
  }

  informLoginStatus() {
      if (!this.state.isLoggedIn) {
        alert('Please login to view this page. Thank you!');
      }
  }

  hideToggle(state=false, isHomepage=false) {
    console.log('userstate:', this.state.userState);
    const selectorId = document.querySelector('.mdl-layout');
    selectorId.MaterialLayout.toggleDrawer();

    if (!this.state.isLoggedIn && !state && !isHomepage) {
        alert('Please login to view this page. Thank you!');
    }

    if (!state && isHomepage) {
        this.setState({ isOpen: false });
    }

    if (state) {
        this.toggleModal();
    }
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  goHome() {
    console.log('hey');
    this.setState({ isOpen: false });
  }

  updateUserStateValues(userState) {
    this.setState({ userState });
  }

  getAccountDetails(isDrawer=false) {
    if (isDrawer) {
        this.hideToggle();
    }
    console.log('user id?', this.state.userState.userID);
    console.log(`${host}:${port}/login`);
    axios.post(`${host}:${port}/get_user_data`, {
        'userID': this.state.userState.userID,
    })
    .then(response => {
        response.data = { ...response.data, userID: this.state.userState.userID };
        this.updateUserStateValues(response.data);
    })
    .catch(err => {
        console.log('err is: ', err);
    });
  }

  render() {
    return (
      <div>
        <Layout className="demo-big-content">
          <Header
            className="header-color"
            title={
                <Link style={{textDecoration: 'none', color: 'white'}} to="/login" userState={this.state.userState}>
                    <img
                        src={logo}
                        alt="avatar"
                        className="avatar-img">
                    </img>
                </Link>
            } scroll>
            <Navigation>
              <Link className="font-styling" onClick={() => this.informLoginStatus()} to="/contact">Meet the Team</Link>
              {!this.state.isLoggedIn &&
                <Link className="font-styling" onClick={() => this.toggleModal()} to="/login">Login</Link>
              }
              {this.state.isLoggedIn &&
                <Link className="font-styling" onClick={() => this.getAccountDetails()} to="/myaccount">View my Account</Link>
              }
            </Navigation>
          </Header>
          <Drawer title={<Link onClick={() => this.hideToggle(false, true)} className="font-styling" style={{textDecoration: 'none', color: 'black'}} to="/">Day Trading System</Link>}>
            <Navigation>
              {this.state.isLoggedIn &&
                <Link className="font-styling" onClick={() => this.hideToggle(false, true)} to="/login">Home</Link>
              }
              {!this.state.isLoggedIn &&
                <Link className="font-styling" onClick={() => this.hideToggle(true)} to="/login">Login</Link>
              }
              {this.state.isLoggedIn &&
                <Link className="font-styling" onClick={() => this.getAccountDetails(true)} to="/myaccount">View my Account</Link>
              }
              <Link className="font-styling" onClick={() => this.hideToggle()} to="/contact">Meet the Team</Link>
            </Navigation>
          </Drawer>
          <Modal
            show={this.state.isOpen}
            setUserStateValues={this.setUserStateValues}
            onClose={this.toggleModal}>
            Please enter your User ID to log in:
          </Modal>
          {this.state.isLoggedIn &&
            <Content>
                <div className="page-content" />
                <Main
                    userState={this.state.userState}
                />
            </Content>
          }
          <Landing
            show={!this.state.isOpen && !this.state.isLoggedIn}
          />
        </Layout>
      </div>
    );
  }
}

export default App;
