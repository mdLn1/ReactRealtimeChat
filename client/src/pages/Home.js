import React, { Component, Fragment } from "react";
import ChatFormat from "../components/ChatFormat";
import MainContext from "../contexts/MainContext";
import { withRouter } from "react-router-dom";
import PrivateRoomEntryForm from "../components/PrivateRoomEntryForm";

class Home extends Component {
  static contextType = MainContext;

  componentDidMount() {
    const { id } = this.props.match.params;
    let url = this.props.match.url;
    if (id && url.includes("private") && !this.context.user.username)
      this.context.showSignForm();
  }
  componentWillUnmount() {
    this.context.setLoading(false);
  }

  hideEntry = () => {
    this.props.history.replace("/");
  };

  successfullyJoinedRoom = () => {
    this.props.history.push("/my-list/");
  };

  render() {
    return (
      <div>
        {this.props.match.params.id &&
          this.props.match.url.includes("confirm-room-password") &&
          this.context.user.username && (
            <PrivateRoomEntryForm
              roomId={this.props.match.params.id}
              hideForm={this.hideEntry}
              joinedRoom={this.successfullyJoinedRoom}
            />
          )}
        <h1 style={{ textAlign: "center" }}>Public chats</h1>
        <ChatFormat />
      </div>
    );
  }
}

export default withRouter(Home);
