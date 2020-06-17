import React, { Component, Fragment } from "react";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Home from "./pages/Home";
import socketIOClient from "socket.io-client";
import MyList from "./pages/MyList";
import MainContext from "./contexts/MainContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginRegisterForm from "./components/LoginRegisterForm";
import axios from "axios";
const API_URL = "http://127.0.0.1:5000";
const socket = socketIOClient(API_URL);

axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.headers.post["Content-Type"] = "application/json";

export default class App extends Component {
  state = {
    user: { username: null },
    setUser: (username) => {
      if (username === null)
        delete axios.defaults.headers.common["x-auth-token"];
      this.setState({
        user: { username },
        signFormDisplayed: false,
      });
    },
    setAuthToken: (token) => {
      axios.defaults.headers.common["x-auth-token"] = token;
    },
    signFormDisplayed: false,
    showSignForm: () => {
      this.setState((prevState) => ({
        ...prevState,
        signFormDisplayed: !prevState.signFormDisplayed,
      }));
    },
    chats: null,
    updateChats: (chats) => {
      this.setState({ chats });
    },
    loading: false,
    setLoading: (val) => {
      this.setState({ loading: val });
    },
    currentChatMessages: null,
    updateMessages: (messages) => {
      this.setState({ currentChatMessages: messages });
    },
    socket: socket,
  };

  render() {
    return (
      <Fragment>
        <MainContext.Provider value={this.state}>
          <Router>
            <Navbar />
            <div style={{ position: "relative" }}>
              {this.state.signFormDisplayed && <LoginRegisterForm />}
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/my-list">
                  <MyList />
                </Route>
                <Route path="/about">
                  <About />
                </Route>
              </Switch>
            </div>
          </Router>
        </MainContext.Provider>
      </Fragment>
    );
  }
}
