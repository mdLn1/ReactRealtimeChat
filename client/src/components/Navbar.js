import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import MainContext from "../contexts/MainContext";

export default class Navbar extends Component {
  static contextType = MainContext;

  showSignForm = () => {
    this.context.showSignForm();
  };

  logout = () => {
    this.context.setUser(null, null);
  };

  render() {
    return (
      <div className="navbar">
        <NavLink exact to="/">
          Home
        </NavLink>
        {this.context.user.username && (
          <NavLink to="/my-list">My Chats</NavLink>
        )}
        <NavLink to="/about">About</NavLink>
        {this.context.user.username ? (
          <Fragment>
            <span style={{ cursor: "pointer" }} onClick={this.logout}>
              Log out
            </span>
            <span>{this.context.user.username}</span>
          </Fragment>
        ) : (
          <span style={{ cursor: "pointer" }} onClick={this.showSignForm}>
            Sign
          </span>
        )}
      </div>
    );
  }
}
