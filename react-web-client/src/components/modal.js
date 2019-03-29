import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const host = 'http://localhost';
const port = 8123;

class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: '',
        }
      }

  submitUserID(userID) {
    var regex = /^[A-Za-z0-9]+$/
    //Validate TextBox value against the Regex.
    var isValid = regex.test(userID);

    if (!userID) {
        alert("Please enter a user ID.");
        return;
    } else if (!isValid) {
        alert("Your input contains special characters. Please fix your input.");
        return;
    }

    console.log(`${host}:${port}/login`);
    axios.post(`${host}:${port}/get_user_data`, {
        'userID': userID,
    })
    .then(response => {
        console.log('response is: ', response);
        response.data = { ...response.data, userID: this.state.userID };
        console.log('response.data ', response.data);
        this.props.setUserStateValues(response.data);
    })
    .catch(err => {
        console.log('err is: ', err);
    });
  }

  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    return (
      
        <div className="move-down-more align-center">
          {this.props.children}
            <form className="form-class-name">
              <label>
                <input placeholder="User ID" className="input-class-name" type="text" onChange={evt => this.setState({ userID: evt.target.value })} name="userid"/>
              </label>
              <input className="button-fancy-new" onClick={() => this.submitUserID(this.state.userID)} className="button-fancy" value="Submit" />
            </form>
            <div className="close-modal">
              <button className="button-fancy-new" onClick={this.props.onClose}>
                Close
              </button>
            </div>
        </div>
     
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  setUserStateValues: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default Modal;
