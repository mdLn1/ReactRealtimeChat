import React, { Component } from "react";
import RoomItem from "../components/RoomItem";
import MainContext from "../contexts/MainContext";
import axios from "axios";

export default class RoomList extends Component {
  static contextType = MainContext;
  constructor(props) {
    super(props);
    this.state = {
      messagesCurrentlySelectedRoom: null,
      errors: null,
      indexActive: 0,
    };
  }

  async componentDidMount() {
    const { chats, setLoading } = this.context;
    try {
      setLoading(true);
      if (chats && chats.length > 0) {
        const response = await axios.get(`/api/messages/${chats[0]._id}`);
        this.setState({
          messagesCurrentlySelectedRoom: response.data.messages,
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors)
        this.setState({ errors: error.response.data.errors });
    }
    setLoading(false);
  }

  setActive = (index) => {
    this.setState({ indexActive: index });
  };

  render() {
    const { chats } = this.context;
    return (
      <div
        style={{
          position: "absolute",
          top: "0",
          overflow: "hidden",
          left: "0",
          height: "100%",
          width: "100%",
        }}
      >
        <div className="rooms-container">
          {chats && chats.map((el, index) => (
            <RoomItem
              key={index}
              index={index}
              indexActive={this.state.indexActive}
              setActive={this.setActive}
            />
          ))}
        </div>
      </div>
    );
  }
}
