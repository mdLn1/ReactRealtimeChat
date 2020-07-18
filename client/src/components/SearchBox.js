import React, { Component, Fragment } from "react";
import MainContext from "../contexts/MainContext";

export default class SearchBox extends Component {
  static contextType = MainContext;
  constructor(props) {
    super(props);

    this.state = {
      searchString: "",
    };
  }

  findRoom = (searchString = "") => {
    if (searchString || this.state.searchString) {
      let reg = new RegExp(
        searchString ? searchString : this.state.searchString,
        "i"
      );
      this.context.updateRoomSearch(
        this.context.chats.filter((el) => reg.test(el.room_name))
      );
    }
  };

  inputChange = (e) => {
    this.setState({ searchString: e.target.value });
    if (e.target.value) this.findRoom(e.target.value);
    else {
      this.context.updateRoomSearch(null);
    }
  };

  clearSearch = () => {
    this.setState({ searchString: "" });
  };

  render() {
    return (
      <Fragment>
        <input
          type="text"
          placeholder="Search..."
          name="search"
          onChange={this.inputChange}
          value={this.state.searchString}
        />
        <button onClick={this.findRoom}>
          <i className="fa fa-search" />
        </button>
      </Fragment>
    );
  }
}
