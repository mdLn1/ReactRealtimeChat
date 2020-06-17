import React, { Component } from "react";
import PropTypes from "prop-types";

class Message extends Component {
  render() {
    const { side, spanType, message, author, created_at } = this.props;
    return (
      <div className={`${side}-message message`}>
        <span className={spanType}>
          {side !== "right" ? (
            <small>
              <b>{author}</b>
            </small>
          ) : null}
          <div>{message}</div>
          <div style={{ textAlign: "right" }}>
            <small style={{ marginRight: "-12px" }}>{created_at}</small>
          </div>
        </span>
      </div>
    );
  }
}

Message.defaultProps = {
  side: "left",
  spanType: "",
  message: "Default text",
  created_at: new Date().getHours() + ":" + new Date().getMinutes(),
  author: "Username",
};

Message.propTypes = {
  side: PropTypes.string,
  spanType: PropTypes.string,
  message: PropTypes.string,
  created_at: PropTypes.string,
  author: PropTypes.string,
};

export default Message;
