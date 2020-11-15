import React, {useState} from 'react';
import {Locations} from "../types/type";

function Place(props: { place: Locations, username: string }): JSX.Element {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    console.log('send message:', message);
  }

  return (
    <div>
      <div>
        <div>
          <h1>{props.place}</h1>
          <p>Hi {props.username}, tell to your teammate what to do.</p>
        </div>

        <ul id="messageArea">
        </ul>

        <div>
          <div>
            <input
              type="text" autoComplete="off"
              placeholder="Type a message..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Place;
