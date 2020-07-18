import React, { Component, Fragment } from "react";
import MessagesList from "./MessagesList";
import MainContext from "../contexts/MainContext";
import RoomItem from "./RoomItem";
import PropTypes from "prop-types";
import axios from "axios";
import CreateRoom from "./CreateRoom";
import SearchBox from "./SearchBox";
import Loader from "./Loader";
import InviteSomeoneForm from "./InviteSomeoneForm";

const pageSize = 10;

class ChatFormat extends Component {
  static contextType = MainContext;

  constructor(props) {
    super(props);
    this.state = {
      errors: null,
      indexActive: -1,
      showRoomCreate: false,
      message: "",
      loading: false,
      pageNo: 1,
      endReached: false,
      loadingMoreMessages: false,
      messagesCurrentlySelectedRoom: [],
      showRoomInfo: false,
      showInviteSomeoneForm: false
    };
    this.messagesList = React.createRef();
    this.searchBox = React.createRef();
  }

  toggleRoomCreate = () => {
    this.setState((prevState) => ({
      showRoomCreate: !prevState.showRoomCreate,
    }));
  };

  findAndShowRoom = (roomId) => {
    const roomIndex = this.context.chats.findIndex((el) => el._id === roomId);
    this.context.updateRoomSearch(null);
    this.searchBox.current.clearSearch();
    this.fetchMessages(roomIndex);
  };

  toggleRoomInfo = () => {
    this.setState((prevState) => ({
      showRoomInfo: !prevState.showRoomInfo,
    }));
  };

  toggleInviteSomeone = () => {
    this.setState((prevState) => ({
      showInviteSomeoneForm: !prevState.showInviteSomeoneForm,
    }));
  };

  joinRoom = async (roomId) => {
    try {
      let resp = await axios.get(`/api/room/${roomId}/join/`);
      let { chats, user, updateChats } = this.context;
      chats[this.state.indexActive].users.push({ username: user.username });
      updateChats(chats);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors)
        this.setState({ errors: error.response.data.errors });
    }
  };

  async componentDidMount() {
    const { socket, setLoading } = this.context;
    try {
      this.setState({ errors: null });
      setLoading(true);
      let resp = await axios.get(
        `/api/room/${this.props.type === "private" ? "private" : ""}`
      );
      if (this.props.type === "private") {
        this.context.setChatsType("private");
      } else {
        this.context.setChatsType();
      }
      this.context.updateChats(resp.data.rooms);
      if (this.state.indexActive !== -1) {
        resp = await axios.get(
          `/api/room/${this.context.chats[this.state.indexActive]._id}`
        );
        this.setState({
          messagesCurrentlySelectedRoom: resp.data.messages,
        });
      }
    } catch (error) {
      if (error?.response?.data?.errors)
        this.setState({ errors: error.response.data.errors });
    }
    setLoading(false);
    socket.on("relay message", this.appendMessage);
  }

  appendMessage = ({ message, room_name }) => {
    let { messagesCurrentlySelectedRoom, indexActive } = this.state;
    let { user, chats } = this.context;
    if (
      chats === null ||
      indexActive === -1 ||
      chats[indexActive].room_name !== room_name
    )
      return;
    messagesCurrentlySelectedRoom.push(message);
    this.setState({ messagesCurrentlySelectedRoom });
    setTimeout(() => {
      let el = document.getElementById("messages-container");
      if (
        message.author === user.username ||
        el.scrollHeight - el.scrollTop < 700
      )
        el.scrollTop = el.scrollHeight + 10000;
    }, 300);
  };
  componentWillMount() {
    this.context.socket.off("relay message", this.appendMessage);
  }
  sendMessage = async (e) => {
    e.preventDefault();
    const { indexActive, message, messagesCurrentlySelectedRoom } = this.state;
    try {
      const resp = await axios.post(
        `/api/message/${this.context.chats[indexActive]._id}`,
        {
          message: message,
        }
      );
      // messagesCurrentlySelectedRoom.push(resp.data.message);
      // this.setState((prevState) => ({
      //   ...prevState,
      //   messagesCurrentlySelectedRoom,
      //   message: "",
      // }));
      this.setState({ message: "" });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors)
        this.setState({ errors: error.response.data.errors });
    }

    setTimeout(() => {
      let el = document.getElementById("messages-container");
      el.scrollTop = el.scrollHeight + 10000;
    }, 300);
  };

  fetchMessages = async (index) => {
    const { chats, setLoading, user, socket } = this.context;
    socket.emit("join room", chats[index].room_name);
    try {
      setLoading(true);
      if (chats && chats.length > 0) {
        if (
          this.props.type === "private" &&
          !chats[index].users.find((el) => el.username === user.username)
        ) {
          console.log("You don't have access to this chat");
          return;
        }
        const response = await axios.get(`/api/room/${chats[index]._id}`);
        this.setState({
          messagesCurrentlySelectedRoom: response.data.messages,
          pageNo: 2,
        });
      }
    } catch (error) {
      if (error?.response?.data?.errors)
        this.setState({ errors: error.response.data.errors });
    }
    this.setState({ indexActive: index, endReached: false });
    setLoading(false);
    setTimeout(() => {
      let el = document.getElementById("messages-container");
      el.scrollTop = el.scrollHeight + 10000;
    }, 300);
  };

  loadMoreMessages = async () => {
    const { chats, setLoading } = this.context;
    let { indexActive, pageNo, endReached, loadingMoreMessages } = this.state;
    if (loadingMoreMessages) return;
    try {
      setLoading(true);
      this.setState({ loadingMoreMessages: true });
      if (chats && chats.length > 0) {
        if (endReached) {
          setTimeout(() => setLoading(false), 500);
          return;
        }
        const response = await axios.get(
          `/api/room/${
            chats[indexActive]._id
          }/?pageNo=${++pageNo}&pageSize=${pageSize}`
        );
        if (response.data.messages.length === 0) {
          setLoading(false);
          this.setState({ endReached: true, loadingMoreMessages: false });
          return;
        }
        this.setState((prevState) => ({
          ...prevState,
          pageNo,
          messagesCurrentlySelectedRoom: [
            ...response.data.messages,
            ...prevState.messagesCurrentlySelectedRoom,
          ],
        }));
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors)
        this.setState({ errors: error.response.data.errors });
    } finally {
      setLoading(false);
      this.setState({ loadingMoreMessages: false });
    }
  };

  inputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { loading, chats, user, roomSearchResult } = this.context;
    const {
      messagesCurrentlySelectedRoom,
      indexActive,
      showRoomCreate,
      message,
      pageNo,
      showRoomInfo,
      showInviteSomeoneForm
    } = this.state;
    return (
      <div className="chat-container">
        {showRoomCreate && (
          <CreateRoom
            hideForm={this.toggleRoomCreate}
            roomsType={this.props.type === "private" ? true : false}
          />
        )}
        {showInviteSomeoneForm && (
          <InviteSomeoneForm
            hideForm={this.toggleInviteSomeone}
            link={`${window.location.hostname}/private/${chats[indexActive]._id}`}
          />
        )}
        <div className="sidenav">
          <header>
            <div className="search-container">
              <SearchBox ref={this.searchBox} />
              {user.username && (
                <button
                  style={{ borderRadius: "7px", marginLeft: "5px" }}
                  onClick={this.toggleRoomCreate}
                >
                  <i className="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
              )}
            </div>
          </header>
          <div style={{ position: "relative", height: "92%" }}>
            {/* {loading && (
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
            )} */}
            {!loading && this.state.errors ? (
              "Error encountered while loading"
            ) : Array.isArray(chats) && chats.length > 0 ? (
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
                  {!roomSearchResult &&
                    chats &&
                    chats.map((el, index) => (
                      <RoomItem
                        key={index}
                        index={index}
                        indexActive={indexActive}
                        user={user}
                        setActive={() => this.fetchMessages(index)}
                        {...el}
                      />
                    ))}
                  {roomSearchResult &&
                    roomSearchResult.length > 0 &&
                    roomSearchResult.map((el, index) => (
                      <RoomItem
                        key={index}
                        index={index}
                        indexActive={-1}
                        user={user}
                        setActive={() => this.findAndShowRoom(el._id)}
                        {...el}
                      />
                    ))}
                  {roomSearchResult !== null &&
                    roomSearchResult.length === 0 && (
                      <div style={{ textAlign: "center", paddingTop: "10px" }}>
                        No chats were found
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", paddingTop: "10px" }}>
                No chats were found
              </div>
            )}
          </div>
        </div>
        <div className="main">
          <header className="main-top">
            {!roomSearchResult && chats && chats.length && indexActive > -1 ? (
              <div style={{ position: "relative" }}>
                <div style={{ fontWeight: "bold" }}>
                  {chats[indexActive].room_name}
                </div>
                <small className="ovf-txt">
                  {chats[indexActive].users.length
                    ? chats[indexActive].users.map(
                        (el, index) =>
                          `${
                            el.username === user.username ? "You" : el.username
                          }${
                            index < chats[indexActive].users.length - 1
                              ? ", "
                              : ""
                          }`
                      )
                    : "No participants yet"}
                </small>
                <div className="menu-drop" role="button" title="Menu">
                  <div className="dropdown">
                    <i
                      aria-hidden="true"
                      className="fa fa-ellipsis-v fa-3"
                      style={{ fontSize: "20px" }}
                    ></i>
                    <div className="dropdown-content">
                      <div className="element" onClick={this.toggleRoomInfo}>
                        Room Info
                      </div>
                      {user.username && this.props.type === "private" && (
                        <div className="element" onClick={this.toggleInviteSomeone}>Invite someone</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  paddingTop: "10px",
                }}
              >
                Please select a room to load the chat
              </div>
            )}
          </header>
          <div className="main-middle">
            {loading && (
              <Loader
                properties={{
                  margin: "auto",
                  zIndex: 100,
                  position: "absolute",
                  top: "35%",
                  left: "45%",
                  marginRight: "-50%",
                  transform: 'translate("-50%", "-50%")',
                }}
              />
            )}
            {showRoomInfo && (
              <div className="room-info">
                <h2 style={{ textAlign: "center" }}>Room info</h2>
                <h3>Participants:</h3>
                <div>
                  {chats[indexActive].users.map((el, index) =>
                    index > 0 ? `, ${el.username}` : el.username
                  )}
                </div>
                <h3>Created on:</h3>
                <div>
                  {`${new Date(
                    chats[indexActive].created_at
                  ).toLocaleDateString()} at ${new Date(
                    chats[indexActive].created_at
                  ).toLocaleTimeString()}`}
                </div>
                <h3>Type:</h3>
                <div>{chats[indexActive].private ? "Public" : "Private"}</div>
                <span
                  className="close"
                  style={{ top: "-5px", right: "27px" }}
                  onClick={this.toggleRoomInfo}
                >
                  &times;
                </span>
              </div>
            )}
            <MessagesList
              ref={this.messagesList}
              messages={messagesCurrentlySelectedRoom}
              loadMoreMessages={this.loadMoreMessages}
              pageNo={pageNo}
            />
          </div>
          <footer className="main-bottom">
            {user.username &&
              indexActive > -1 &&
              (chats[indexActive].users.find(
                (el) => el.username === user.username
              ) ? (
                <form className="message-form" onSubmit={this.sendMessage}>
                  <input
                    placeholder="Type your message"
                    name="message"
                    value={message}
                    minLength={1}
                    onChange={this.inputChange}
                  />

                  <div className="button_cont" align="center">
                    <button className="gradient-button message-button">
                      <span>SEND</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <span
                    className="mask-button"
                    onClick={() => this.joinRoom(chats[indexActive]._id)}
                  >
                    JOIN
                  </span>{" "}
                  this room
                </div>
              ))}{" "}
            {!user.username && (
              <div style={{ textAlign: "center" }}>
                {" "}
                You need to{" "}
                <span
                  className="mask-button"
                  onClick={() => this.context.showSignForm()}
                >
                  Sign In
                </span>{" "}
                to write messages
              </div>
            )}
          </footer>
          )
        </div>
      </div>
    );
  }
}

ChatFormat.defaultProps = {
  type: "public",
  chats: null,
  selectedChatIndex: 0,
};

ChatFormat.propTypes = {
  type: PropTypes.string,
  chats: PropTypes.array,
  selectedChatIndex: PropTypes.number,
};

export default ChatFormat;
