import React, { Component, Fragment } from "react";
import ChatFormat from "../components/ChatFormat";
import MainContext from "../contexts/MainContext";

export default class Home extends Component {
  static contextType = MainContext;
  componentWillUnmount() {
    this.context.setLoading(false);
  }
  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Public chats</h1>
        <ChatFormat />
      </div>
    );
  }
}
