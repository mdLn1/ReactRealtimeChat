import React, { Component, Fragment } from "react";
import axios from "axios";

export default class LoginRegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomName: "",
      password: "",
      privateRoom: false,
      errors: null,
    };
  }

  submitForm = async (e) => {
    e.preventDefault();
    this.setState({ errors: null });
    const { roomName, password, privateRoom } = this.state;
    let errors = [];
    let re = /^[a-z0-9]+$/i;
    if (!re.test(roomName) && roomName.length > 4)
      errors.push("Room name must contain at least 5 alphanumeric characters");
    if (roomName.length > 30)
      errors.push("Room name cannot be longer than 30 characters");
    if (password.length < 8)
      errors.push("Password must be at least 8 characters long");
    if (password.length > 100)
      errors.push("Password must be no longer than 100 characters");

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    // this.context.setUser(username, Math.round(Math.random() * 100));

    // try {
    //   const response = await axios.post("/api/room/", {
    //     roomName,
    //     private: privateRoom,
    //     password,
    //   });
    // if(this.props.roomType === privateRoom)
    //  this.context.updateChats([response.data, ...this.context.chats])
    //   console.log(response.data);
    // } catch (err) {
    //   if (err.response && err.response.data && err.response.data.errors) {
    //     this.setState({ errors: err.response.data.errors });
    //   }
    // }
  };

  onRadioClick = (e) => {
    this.setState({ privateRoom: e.target.value === "private" ? true : false });
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentWillUnmount() {
    this.context.setLoading(false);
  }

  render() {
    const { errors } = this.state;

    let roomNameProps = {
      minLength: 4,
      name: "roomName",
    };
    let passwordProps = {
      minLength: 7,
      name: "password",
    };
    return (
      <div className="sign-container">
        <span className="close" onClick={() => this.props.hideForm()}>
          &times;
        </span>
        <form
          style={{ margin: "0 auto" }}
          className="sign-form"
          onSubmit={this.submitForm}
        >
          <div style={{ paddingBottom: "30px", textAlign: "center" }}>
            <span className="selected-option">New Room</span>
          </div>
          <div className="sign-form-errors">
            <ul>
              {errors &&
                errors.length > 0 &&
                errors.map((el, index) => <li key={index}>{el}</li>)}
            </ul>
          </div>
          <span>
            <input
              className="gate"
              id="roomName"
              type="text"
              placeholder="Room name"
              required
              onChange={this.onInputChange}
              {...roomNameProps}
            />
            <label htmlFor="roomName">Name</label>
          </span>
          <span>
            <input
              className="gate"
              id="password"
              type="password"
              required
              placeholder="Password"
              onChange={this.onInputChange}
              {...passwordProps}
            />
            <label htmlFor="password">Password</label>
          </span>
          <span>
            <label className="radio-button-container">
              Public
              <input
                type="radio"
                name="roomType"
                defaultChecked
                value="public"
                onClick={this.onRadioClick}
              />
              <span className="checkmark"></span>
            </label>
            <label
              className="radio-button-container"
              style={{ marginLeft: "10px" }}
            >
              Private
              <input
                type="radio"
                name="roomType"
                value="private"
                onClick={this.onRadioClick}
              />
              <span className="checkmark"></span>
            </label>
          </span>
          <button type="submit" className="btn">
            <span>Create</span>
          </button>
        </form>
      </div>
    );
  }
}
