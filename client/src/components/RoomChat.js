import React, { Component } from "react";

export default class RoomChat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      announcements: [],
      message: "",
    };
    this.inputChange = this.inputChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.joinGameRoom = this.joinGameRoom.bind(this);
  }
  sendMessage = () => {
    if (this.state.message) {
      this.props.socket.emit("room message", this.state.message);
      this.setState({ message: "" });
    }
  };

  inputChange = (e) => {
    this.setState({ message: e.target.value });
  };

  joinGameRoom = () => {
    this.props.socket.emit("join room");
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on("group message", (message) => {
      this.setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, message],
      }));
    });
  }

  render() {
    const { messages } = this.state;
    return (
      <div style={{ backgroundColor: "yellow" }}>
        <input
          onChange={this.inputChange}
          placeholder="Please type a message"
        />
        <button onClick={this.sendMessage}>Room Message</button>
        <button onClick={this.joinGameRoom}>Join room game</button>
        <div>
          <ul>
            {messages.length > 0 &&
              messages.map((el, index) => <li key={index}>{el}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}
