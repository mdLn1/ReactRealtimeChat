import React, { Component, Fragment } from "react";
import MainContext from "../contexts/MainContext";
import axios from "axios";
import Loader from "./Loader";
import { withRouter } from "react-router-dom";

class LoginRegisterForm extends Component {
  static contextType = MainContext;
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      errors: null,
      register: false,
      loading: false,
    };
  }

  setFormOption = () => {
    this.setState((prevState) => ({
      ...prevState,
      register: !prevState.register,
    }));
  };

  showSignForm = () => {
    this.context.showSignForm();
  };

  submitForm = async (e) => {
    e.preventDefault();
    this.setState({ errors: null });
    const { username, password, register } = this.state;
    let errors = [];
    if (register) {
      let re = /^[a-z0-9]+$/i;
      if (!re.test(username) && username.length > 4)
        errors.push("Username must contain at least 5 alphanumeric characters");
      if (username.length > 30)
        errors.push("Username cannot be longer than 30 characters");
      if (password.length < 8)
        errors.push("Password must be at least 8 characters long");
      if (password.length > 100)
        errors.push("Password cannot be longer than 100 characters");
      if (!/[^a-z0-9]+/i.test(password))
        errors.push(
          "Password should contain at least one non-alphanumeric character such as '.,/-=+|!$£%^'"
        );
    } else {
      if (username.length < 4)
        errors.push("Username must be at least 4 characters long");
      if (password.length < 8)
        errors.push("Password must be at least 8 characters long");
    }

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    // this.context.setUser(username, Math.round(Math.random() * 100));

    try {
      // this.setState({ loading: true });
      const response = await axios.post(
        `/api/user/${register ? "register" : "login"}`,
        {
          username,
          password,
        }
      );
      const { token, user } = response.data;
      this.context.setUser(user.username);
      this.context.setAuthToken(token);
      if (window.location.pathname.includes("private")) {
        this.props.history.push(`/my-list/${this.props.match.id}`);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        this.setState({ errors: err.response.data.errors });
      }
    }
    // this.setState({ loading: false });
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentWillUnmount() {
    this.context.setLoading(false);
  }

  render() {
    const { register, errors, loading } = this.state;

    let usernameRegisterProps = {
      minLength: register ? 5 : 3,
      name: "username",
    };
    let passwordRegisterProps = {
      minLength: register ? 7 : 3,
      name: "password",
    };

    let showLoginRequiredMessage = this.props.location.pathname.includes("private");
    return (
      <div className="form-container">
        <span className="close" onClick={this.showSignForm}>
          &times;
        </span>
        {loading && (
          <Loader
            properties={{
              margin: "auto",
              position: "absolute",
              top: "30%",
              left: "35%",
              marginRight: "-50%",
              transform: 'translate("-50%", "-50%")',
            }}
          />
        )}
        <form
          className="modal-form"
          onSubmit={this.submitForm}
        >
          <div style={{ paddingBottom: "30px", textAlign: "center" }}>
            {showLoginRequiredMessage && (
              <div>
                You need to be logged in before you can accept an invitation.
              </div>
            )}
            {register ? (
              <Fragment>
                <span
                  className="not-selected-option"
                  style={{ marginRight: "20px" }}
                  onClick={this.setFormOption}
                >
                  Login
                </span>
                <span className="verticalLine"></span>
                <span
                  className="selected-option"
                  style={{ marginLeft: "20px" }}
                >
                  Register
                </span>
              </Fragment>
            ) : (
              <Fragment>
                <span
                  className="selected-option"
                  style={{ marginRight: "20px" }}
                >
                  Login
                </span>
                <span className="verticalLine"></span>

                <span
                  className="not-selected-option"
                  style={{ marginLeft: "20px" }}
                  onClick={this.setFormOption}
                >
                  Register
                </span>
              </Fragment>
            )}
          </div>
          <div className="modal-form-errors">
            <ul>
              {errors &&
                errors.length > 0 &&
                errors.map((el, index) => <li key={index}>{el}</li>)}
            </ul>
          </div>
          <span>
            <input
              className="gate"
              id="username"
              type="text"
              placeholder="Username"
              required
              onChange={this.onInputChange}
              {...usernameRegisterProps}
            />
            <label htmlFor="username">Username</label>
          </span>
          <span>
            <input
              className="gate"
              id="password"
              type="password"
              required
              placeholder="Password"
              onChange={this.onInputChange}
              {...passwordRegisterProps}
            />
            <label htmlFor="password">Password</label>
          </span>
          {!loading && (
            <button type="submit" className="btn">
              <span>{register ? "Register" : "Login"}</span>
            </button>
          )}
        </form>
      </div>
    );
  }
}

export default withRouter(LoginRegisterForm);
