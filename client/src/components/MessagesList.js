import React, { Component, Fragment } from "react";
import Message from "./Message";
import PropTypes from "prop-types";
import MainContext from "../contexts/MainContext";

class MessagesList extends Component {
  static contextType = MainContext;
  handleScroll = () => {
    let el = document.getElementById("messages-container");
    if (el.scrollTop === 0) this.props.loadMoreMessages();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.messages !== this.props.messages) {
      let el = document.getElementById("messages-container");
      if (prevProps.pageNo !== this.props.pageNo && el.scrollHeight - el.scrollTop < 700)
        el.scrollTop = el.scrollHeight;
      if (prevProps.pageNo !== this.props.pageNo && el.scrollHeight - el.scrollTop > 700) {
        el.scrollTop = (this.props.messages.length - prevProps.messages.length) * 50;
      }
    }
  }
  render() {
    const { messages } = this.props;
    const { user } = this.context;
    return (
      <div
        className="messages-list"
        onScroll={this.handleScroll}
        id="messages-container"
      >
        {messages.map((el, index) => {
          let date = new Date(el.created_at);
          let messageDate = date.toLocaleDateString();
          let todaysDate = new Date().toLocaleDateString();
          let hours = date.getHours();
          let minutes = date.getMinutes();
          let time = `${hours > 9 ? hours : "0" + hours}:${
            minutes > 9 ? minutes : "0" + minutes
          }`;
          const message = (
            <Message
              key={index}
              side={`${el.author !== user.username ? "left" : "right"}`}
              {...el}
              created_at={time}
            />
          );
          if (index === 0) {
            return (
              <Fragment key={index}>
                <div className="date">
                  <span>{messageDate !== todaysDate ? messageDate : "TODAY"}</span>
                </div>
                {message}
              </Fragment>
            );
          }
          if (
            index > 0 &&
            messageDate !== todaysDate &&
            messageDate !==
              new Date(messages[index - 1].created_at).toLocaleDateString()
          ) {
            return (
              <Fragment key={index}>
                <div className="date">
                  <span>{messageDate}</span>
                </div>
                {message}
              </Fragment>
            );
          }
          if (
            index > 0 &&
            messageDate === todaysDate &&
            messageDate !==
              new Date(messages[index - 1].created_at).toLocaleDateString()
          )
            return (
              <Fragment key={index}>
                <div className="date">
                  <span>TODAY</span>
                </div>
                {message}
              </Fragment>
            );
          return <Fragment key={index}>{message}</Fragment>;
        })}
      </div>
    );
  }
}
MessagesList.defaultProps = {
  messages: [
    // {
    //   author: "author",
    //   created_at: "2020-05-31T13:17:42.323Z",
    //   message: "default message",
    // },
  ],
};

MessagesList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
};

export default MessagesList;
