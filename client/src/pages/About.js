import React, { Component } from "react";

export default class About extends Component {
  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>About</h1>
        <div className="about-container">
          <article>
            <section>
              <h2>The website:</h2>
              <p>
                This web application has been built to illustrate how a live
                chat application might work. The MERN stack was used for the
                development of the web application by integrating Socket.io to
                allow sending/receiving messages live with client updates. This
                can be noticed when chatting with somebody within the same
                window, notifications for chat rooms were not implemented.
              </p>
            </section>
            <section>
              <h2>Resources:</h2>
              <p>
                A variety of web resources were used to give a nice touch to the
                user interface, some of them listed below.
              </p>
              <h3>Loaders</h3>
              <p>
              <a href="https://loading.io/" target="_blank" rel="noopener noreferrer">
                  Loading.io loaders generator
                </a></p>
              <h3>CSS Shadows</h3>
              <p>
                <a href="https://www.cssmatic.com/box-shadow" target="_blank" rel="noopener noreferrer">
                  CSS matic
                </a>
              </p>
              <h3>Background patterns</h3>
              <p>
                <a
                  href="https://www.toptal.com/designers/subtlepatterns/"
                  target="_blank" rel="noopener noreferrer"
                >
                  Toptal
                </a>
              </p>
              <h3>CSS Effects</h3>
              <p>
                <a href="https://codepen.io/MichaelArestad/pen/ohLIa" target="_blank" rel="noopener noreferrer">
                  Michael Arestad text inputs
                </a>
              </p>
              <p>
                <a href="https://codepen.io/sfoxy/pen/XpOoJe" target="_blank" rel="noopener noreferrer">
                 Julia's cool buttons
                </a>
              </p>
              <p>
                <a href="https://www.fabriziovanmarciano.com/button-styles/" target="_blank" rel="noopener noreferrer">
                 Fabrizio Van Marcinio inspiring buttons
                </a>
              </p>
              <p>
                <a href="https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_custom_radio" target="_blank" rel="noopener noreferrer">
                W3schools custom radio buttons
                </a>
              </p>
              <h3>Icons</h3>
              <p>
                <a href="https://fontawesome.com/v4.7.0/icons/" target="_blank" rel="noopener noreferrer">
                  Fontawesome 4.7
                </a>
              </p>
            </section>
          </article>
        </div>
      </div>
    );
  }
}
