import React from 'react';
import './App.css';
import {connect, sendMessage} from "./main";

function App() {
  return (
    <>
      <div id="username-page">
        <div className="username-page-container">
          <h1 className="title">Enter your username</h1>
          <form id="usernameForm" name="usernameForm" onSubmit={connect}>
            <div className="form-group">
              <input type="text" id="name" placeholder="Username" autoComplete="off" className="form-control"/>
            </div>
            <div className="form-group">
              <button type="submit" className="accent username-submit">Start Chatting</button>
            </div>
          </form>
        </div>
      </div>

      <div id="chat-page" className="hidden">
        <div className="chat-container">
          <div className="chat-header">
            <h2>Welcome to Spring Boot Chat Application</h2>
          </div>
          <div className="connecting">
            Connecting...
          </div>
          <ul id="messageArea">

          </ul>
          <form id="messageForm" name="messageForm" onSubmit={sendMessage}>
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

    </>
  );
}

export default App;
