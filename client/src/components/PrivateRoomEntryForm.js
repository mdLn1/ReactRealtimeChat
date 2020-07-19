import React, { Component } from "react";
import MainContext from "../contexts/MainContext";
import axios from "axios";
import { Redirect } from "react-router-dom";
export default class PrivateRoomEntryForm extends Component {
  static contextType = MainContext;
  constructor(props) {
    super(props);

    this.state = {
      errors: null,
      password: "",
    };
  }

  accessRoom = async (e) => {
    e.preventDefault();
    this.context.setLoading(true);
    this.setState({ errors: null });
    try {
      const response = await axios.post(
        `/api/room/${this.props.roomId}/entry`,
        {
          password: this.state.password,
        }
      );
      console.log("oy");
      return <Redirect to="/my-list/" />;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        this.setState({ errors: err.response.data.errors });
      }
    } finally {
      this.context.setLoading(false);
    }
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { errors } = this.state;
    const { loading } = this.context;
    return (
      <div className="form-container">
        <form className="modal-form" onSubmit={this.accessRoom}>
          <div style={{ paddingBottom: "30px", textAlign: "center" }}>
            <span className="selected-option one-option">
              Confirm Room Password
            </span>
            {loading && (
              <div style={{ textAlign: "center" }}>
                {" "}
                <div className="lds-dual-ring"></div>
              </div>
            )}
          </div>
          <div className="modal-form-errors">
            <ul>
              {errors &&
                errors.length > 0 &&
                errors.map((el, index) => <li key={index}>{el}</li>)}
            </ul>
          </div>
          <span>
            <input
              className="gate"
              id="password"
              type="password"
              required
              placeholder="Password"
              onChange={this.onInputChange}
              name="password"
              minLength="3"
            />
            <label htmlFor="password">Password</label>
          </span>
          {!loading && (
            <button type="submit" className="btn">
              <span>Confirm</span>
            </button>
          )}
        </form>
      </div>
    );
  }
}
