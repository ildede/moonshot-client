import React from 'react';
import {IMessage} from "@stomp/stompjs";
import StompClient from "react-stomp-client";
import {MessageSender} from "./MessageSender";
import {websocketServer} from "../environment";
import {PlayEarth} from "./PlayEarth";
import {ChatMessage} from "../model/interfaces";
import {PlayMoon} from "./PlayMoon";

function Place(props: { place: string, username: string, gameId?: string }): JSX.Element {
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
        {
          props.place === 'EARTH'
            ? <PlayEarth gameId={props.gameId || "empty"}/>
            : <PlayMoon gameId={props.gameId || "empty"}/>
        }
      </div>

      <div className="message-container">
        <div className="message-box">
          <StompClient endpoint={websocketServer+"/ws"}
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
