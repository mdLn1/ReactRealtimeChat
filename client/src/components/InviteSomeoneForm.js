import React, { Component } from "react";

export default class InviteSomeoneForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false,
    };
  }

  copyLinkToClipboard = () => {
    var textToCopy = document.getElementById("invitation-link");

    textToCopy.select();
    textToCopy.setSelectionRange(0, 99999); /*For mobile devices*/

    document.execCommand("copy");
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };
  render() {
    return (
      <div className="form-container">
        <span className="close" onClick={() => this.props.hideForm()}>
          &times;
        </span>
        <div className="modal-form" style={{ width: "400px" }}>
          <div style={{ paddingBottom: "30px", textAlign: "center" }}>
            <span className="selected-option one-option">Invite Someone</span>
          </div>
          <div>
            <label id="link" style={{ display: "block", marginBottom: "10px" }}>
              Share Invitation Link
            </label>
            <div>
              <input
                readOnly
                type="text"
                name="link"
                id="invitation-link"
                className="gate"
                type="text"
                value={this.props.link}
                style={{
                  paddingLeft: "15px",
                  transition: "none",
                  minWidth: this.state.copied ? "230px" : "245px",
                }}
              />
              <button id="copy-link-invite" onClick={this.copyLinkToClipboard}>
                {this.state.copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p>
              You need to tell them the password you used when the room was
              created.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
