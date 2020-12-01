import React from "react";
import {ChatMessage} from "../model/interfaces";
import {IMessage} from "@stomp/stompjs";
import StompClient from "react-stomp-client";
import {websocketServer} from "../../../environment";

export const MessagesBox = (props: { gameId: string, handleSeconds: (seconds: number) => void }) => {
  const [list, setList] = React.useState<ChatMessage[]>([]);

  const handleMessage = (stompMessage: IMessage) => {
    const parsed: any = JSON.parse(stompMessage.body);
    if (parsed.location === "seconds-from-start") {
      props.handleSeconds(Number(parsed.message));
    } else if (parsed.location === "seconds-to-start") {
      props.handleSeconds(-1 * Number(parsed.message));
    } else {
      setList([...list, {location: parsed.location, message: parsed.message}])
    }
  }

  return (
    <StompClient endpoint={websocketServer + "/ws"}
                 topic={`games/list/${props.gameId}`}
                 onMessage={(stompMessage: IMessage) => handleMessage(stompMessage)}
    >
      {list.map((v: ChatMessage, i) => <div key={i} className={v.location.toLowerCase()}>{v.message}</div>)}
    </StompClient>
  );
}