import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import RoomChat from "./components/RoomChat";
const API_URL = "http://127.0.0.1:5000";
const socket = socketIOClient(API_URL);

class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      message: "",
    };
    this.inputChange = this.inputChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  sendMessage = () => {
    if (this.state.message) {
      socket.emit("send message", this.state.message);
      this.setState({ message: "" });
    }
  };

  inputChange = (e) => {
    this.setState({ message: e.target.value });
  };

  componentDidMount = () => {
    socket.on("relay message", (message) => {
      this.setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, message],
      }));
    });
  };

  render() {
    const { messages } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        <div>
          <input
            onChange={this.inputChange}
            placeholder="Please type a message"
          />
          <button onClick={this.sendMessage}>Send Message</button>
          <div>
            <ul>
              {messages.length > 0 &&
                messages.map((el, index) => <li key={index}>{el}</li>)}
            </ul>
          </div>
        </div>
        <RoomChat socket={socket} />
      </div>
    );
  }
}
export default App;
