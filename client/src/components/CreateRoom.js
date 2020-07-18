import React, { Component, Fragment } from "react";
import axios from "axios";
import MainContext from "../contexts/MainContext";

export default class LoginRegisterForm extends Component {
  static contextType = MainContext;

  constructor(props) {
    super(props);

    this.state = {
      roomName: "",
      roomPassword: "",
      privateRoom: false,
      errors: null,
    };
  }

  submitForm = async (e) => {
    e.preventDefault();
    this.setState({ errors: null });
    const { roomName, roomPassword, privateRoom } = this.state;
    let errors = [];
    let re = /^[a-z0-9]+$/i;
    if (privateRoom) {
      if (!re.test(roomName) && roomName.length > 4)
        errors.push(
          "Room name must contain at least 5 alphanumeric characters, no spaces nor other symbols"
        );
      if (roomPassword.length < 8)
        errors.push("Password must be at least 8 characters long");
      if (roomPassword.length > 100)
        errors.push("Password must be no longer than 100 characters");
    }
    if (roomName.length > 30)
      errors.push("Room name cannot be longer than 30 characters");

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    try {
      const response = await axios.post("/api/room/", {
        roomName,
        private: privateRoom,
        password: roomPassword,
      });
      let { room } = response.data;
      room.users[0] = {
        _id: room.users[0],
        username: this.context.user.username,
      };
      if (privateRoom && this.context.chatType === "private")
        this.context.updateChats([room, ...this.context.chats]);
      else if (!privateRoom && this.context.chatType === "public")
        this.context.updateChats([room, ...this.context.chats]);
      this.props.hideForm();
    } catch (err) {
      if (err?.response?.data?.errors) {
        this.setState({ errors: err.response.data.errors });
      }
    }
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
    const { errors, privateRoom } = this.state;

    let roomNameProps = {
      minLength: 4,
      name: "roomName",
    };
    let roomPasswordProps = {};
    if (privateRoom) {
      roomPasswordProps = { minLength: 7, name: "roomPassword" };
    }
    return (
      <div className="form-container">
        <span className="close" onClick={() => this.props.hideForm()}>
          &times;
        </span>
        <form
          className="modal-form"
          onSubmit={this.submitForm}
        >
          <div style={{ paddingBottom: "30px", textAlign: "center" }}>
            <span className="selected-option  one-option">New Room</span>
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
              id="roomName"
              type="text"
              placeholder="Room name"
              required
              onChange={this.onInputChange}
              {...roomNameProps}
            />
            <label htmlFor="roomName">Name</label>
          </span>
          {privateRoom && (
            <span>
              <input
                className="gate"
                id="roomPassword"
                type="password"
                required
                placeholder="Password"
                onChange={this.onInputChange}
                {...roomPasswordProps}
              />
              <label htmlFor="roomPassword">Password</label>
            </span>
          )}
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
