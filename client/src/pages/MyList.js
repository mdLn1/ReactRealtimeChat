import React, { Component } from "react";
import ChatFormat from "../components/ChatFormat";

export default class MyList extends Component {
  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Private chats</h1>
        <ChatFormat type={"private"} />
      </div>
    );
  }
}
