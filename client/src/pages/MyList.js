import React, { Component } from "react";
import ChatFormat from "../components/ChatFormat";
import MainContext from "../contexts/MainContext";
import { withRouter } from "react-router-dom";

class MyList extends Component {
  static contextType = MainContext;
  constructor(props) {
    super(props);

    this.state = {
      roomPasswordRequired: false,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const { username } = this.context.user;
    if (id && !username) this.props.history.replace(`/private/${id}`);
    if(!username) this.props.history.replace("/");
    if (
      this.context?.chats?.users?.findIndex((el) => el.username === username) ===
      -1
    ) {
      this.setState({ roomPasswordRequired: true });
    }
  }
  componentWillUnmount() {
    this.context.setLoading(false);
  }
  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Private chats</h1>
        <ChatFormat type={"private"} />
      </div>
    );
  }
}

export default withRouter(MyList);
