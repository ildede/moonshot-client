import React, {useState} from 'react';
import {Locations} from "../types/type";
import {IMessage} from "@stomp/stompjs";
import StompClient from "react-stomp-client";

interface ChatMessage {
  location: Locations;
  message: string;
}


const MessageSender = (props: { place: Locations, gameId?: string }) => {
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const messageChange = (event: any) => {
    setMessage(event.target.value);
  }

  const sendMessage = () => {
    if (message) {
      setIsSubmitting(true);
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        setIsSubmitting(false);
      });
      xhr.open('POST', 'http://localhost:8080/games/message');
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify({ game: props.gameId, location: props.place, message: message }));
    }
  }

  return (
    <>
      <input
        type="text" autoComplete="off"
        placeholder="Type a message..."
        value={message}
        onChange={messageChange}
      />
      <button disabled={isSubmitting} onClick={sendMessage}>
        {isSubmitting ? ("Wait...") : ("Send")}
      </button>
    </>
  )
}


function Place(props: { place: Locations, username: string, gameId?: string }): JSX.Element {
  const [list, setList] = React.useState<ChatMessage[]>([]);

  const handleMessage = (stompMessage: IMessage) => {
    const parsed: any = JSON.parse(stompMessage.body);
    setList([...list, { location: parsed.location, message: parsed.message }])
  }

  return (
    <>
      <h2>{props.place}</h2>
      <p>Hi {props.username}, tell to your teammate what to do.</p>

      <div className="game-container">

      </div>

      <div className="message-container">
        <div className="message-box">
          <StompClient endpoint="ws://localhost:8080/ws"
                       topic={`games/list/${props.gameId}`}
                       onMessage={(stompMessage: IMessage) => handleMessage(stompMessage)}
          >
            {list.map((v: ChatMessage, i) => <li key={i}>{v.location}: {v.message}</li>)}
          </StompClient>
        </div>
        <div className="message-sender">
          <MessageSender place={props.place} gameId={props.gameId} />
        </div>
      </div>

    </>
  )
}

export default Place;
