import React, { Component, Fragment } from "react";
import ChatFormat from "../components/ChatFormat";
import MainContext from "../contexts/MainContext";
import { withRouter } from "react-router-dom";

class Home extends Component {
  static contextType = MainContext;
  componentDidMount() {
    const { id } = this.props.match.params;
    if (id && !this.context.user.username) this.context.showSignForm();
  }
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

export default withRouter(Home);
