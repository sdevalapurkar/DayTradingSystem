import React, { Component } from 'react';
import './App.css';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import { Link } from 'react-router-dom';
import logo from './logo.png';
import Main from './components/main';
import Modal from './components/modal';
import Landing from './components/landing';
import { Redirect } from 'react-router-dom'

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
    this.setState({ isOpen: false });
  }

  render() {
    return (
      <div>
        <Layout className="demo-big-content">
          <Header
            className="header-color"
            title={
                <Link onClick={() => this.goHome()} style={{textDecoration: 'none', color: 'white'}} to="/">
                    <img
                        src={logo}
                        alt="avatar"
                        className="avatar-img">
                    </img>
                </Link>
            } scroll>
            <Navigation>
              <Link onClick={() => this.informLoginStatus()} to="/contact">Meet the Team</Link>
              {!this.state.isLoggedIn &&
                <Link onClick={() => this.toggleModal()} to="/login">Login</Link>
              }
              {this.state.isLoggedIn &&
                <Link onClick={() => console.log('view my account')} to="/myaccount">View my Account</Link>
              }
            </Navigation>
          </Header>
          <Drawer title={<Link style={{textDecoration: 'none', color: 'black'}} to="/">Day Trading System</Link>}>
            <Navigation>
              <Link onClick={() => this.hideToggle(false, true)} to="/">Home</Link>
              {!this.state.isLoggedIn &&
                <Link onClick={() => this.hideToggle(true)} to="/login">Login</Link>
              }
              {this.state.isLoggedIn &&
                <Link onClick={() => this.hideToggle()} to="/myaccount">View my Account</Link>
              }
              <Link onClick={() => this.hideToggle()} to="/contact">Meet the Team</Link>
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
                <Main/>
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
