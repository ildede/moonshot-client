import React from 'react';
import './Game.css';
import {MoonshotGameContext} from "./context";
import {Locations} from "./types/type";
import {connect, sendMessage} from "./main";

function Game() {
  console.debug('render Game');
  const { state, dispatch } = React.useContext(MoonshotGameContext);

  switch (state.location) {
    case Locations.Earth:
      console.log("You are on earth and your name is " + state.username);
      connect(state.username);
      return (
        <div id="chat-page">
          <div className="chat-container">
            <div className="chat-header">
              <h1>Earth</h1>
              <h2>Help your teammate to come back from moon.</h2>
            </div>
            <div className="connecting">
              Connecting...
            </div>
            <ul id="messageArea">

            </ul>
            <form id="messageForm" name="messageForm" onSubmit={event => sendMessage(event, state.username)}>
              <div className="form-group">
                <div className="input-group clearfix">
                  <input type="text" id="message" placeholder="Type a message..." autoComplete="off"
                         className="form-control"/>
                  <button type="submit" className="primary">Send</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )
    case Locations.Moon:
      console.log("You are on Moon and your name is " + state.username);
      connect(state.username);
      return (
        <div id="chat-page">
          <div className="chat-container">
            <div className="chat-header">
              <h1>Moon</h1>
              <h2>Teach Earth how to build something that will save you.</h2>
            </div>
            <div className="connecting">
              Connecting...
            </div>
            <ul id="messageArea">

            </ul>
            <form id="messageForm" name="messageForm" onSubmit={event => sendMessage(event, state.username)}>
              <div className="form-group">
                <div className="input-group clearfix">
                  <input type="text" id="message" placeholder="Type a message..." autoComplete="off"
                         className="form-control"/>
                  <button type="submit" className="primary">Send</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )
    case Locations.NotKnown:
      return (<></>)
  }
}

export default Game;
