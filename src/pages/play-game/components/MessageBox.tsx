import React from "react";
import {ChatMessage} from "../model/interfaces";
import {IMessage} from "@stomp/stompjs";
import StompClient from "react-stomp-client";
import {websocketServer} from "../../../environment";

export const MessagesBox = (props: { gameId: string }) => {
  const [list, setList] = React.useState<ChatMessage[]>([]);

  const handleMessage = (stompMessage: IMessage) => {
    const parsed: any = JSON.parse(stompMessage.body);
    setList([...list, {location: parsed.location, message: parsed.message}])
  }

  return (
    <StompClient endpoint={websocketServer + "/ws"}
                 topic={`games/list/${props.gameId}`}
                 onMessage={(stompMessage: IMessage) => handleMessage(stompMessage)}
    >
      {list.map((v: ChatMessage, i) => <li key={i}>{v.location}: {v.message}</li>)}
    </StompClient>
  );
}