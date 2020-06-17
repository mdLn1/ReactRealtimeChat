import React, { Component } from "react";
import PropTypes from "prop-types";

class RoomItem extends Component {
  render() {
    const { indexActive, index, setActive, room_name, users, _id, user } = this.props;
    return (
      <div
        className={`room-item ${indexActive === index ? "active" : ""}`}
        onClick={() => setActive(index)}
      >
        <div className="title">{room_name}</div>
        <small className="ovf-txt">
          {users && users.length > 0
            ? users.map(
                (el, index) =>
                  `${el.username === user.username ? "You" : el.username}${
                    index < users.length - 1 ? ", " : ""
                  }`
              )
            : "No participants yet"}
        </small>
      </div>
    );
  }
}

RoomItem.defaultProps = {
  room_name: "roomName",
  users: [{ username: "user1" }, { username: "user2" }],
  _id: "dsasfas",
};

RoomItem.propTypes = {
  room_name: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.object),
  _id: PropTypes.string,
};

export default RoomItem;
