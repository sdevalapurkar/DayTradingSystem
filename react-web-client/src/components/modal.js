import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const host = 'http://localhost';
const port = 8009;

class Modal extends React.Component {

  submitUserID(userID) {
    axios.post(`${host}:${port}/api/ADD`, {
        userID,
    })
    .then(response => {
        console.log('response is: ', response);
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
      <div className="backdrop">
        <div className="modal">
          {this.props.children}

          <div className="footer">
            <form>
              <label>
                User ID:
                <input type="text" name="userid" />
              </label>
              <input onClick={(userid) => this.submitUserID(userid)} className="button-fancy" value="Submit" />
            </form>
            <div className="close-modal">
              <button className="button-fancy" onClick={this.props.onClose}>
                Close
              </button>
            </div>
          </div>
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
