import React, {useContext, useEffect, useLayoutEffect, useRef} from "react";
import {ChatMessage} from "../model/interfaces";
import {IMessage} from "@stomp/stompjs";
import StompClient from "react-stomp-client";
import {websocketServer} from "../../../environment";
import {GameContext} from "../../../MainApp";

const AlwaysScrollToBottom = () => {
  const divRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => divRef?.current?.scrollIntoView());
  return <div ref={divRef} />;
};

export const MessagesBox = (props: { gameId: string, handleSeconds: (seconds: number) => void }) => {
  const { setPlace } = useContext(GameContext);
  const [list, setList] = React.useState<ChatMessage[]>([]);

  const handleMessage = (stompMessage: IMessage) => {
    const parsed: any = JSON.parse(stompMessage.body);
    if (parsed.location === "seconds-from-start") {
      props.handleSeconds(Number(parsed.message));
    } else if (parsed.location === "seconds-to-start") {
      props.handleSeconds(-1 * Number(parsed.message));
    } else if (parsed.location === "game-end") {
      setPlace(parsed.message);
    } else {
      setList([...list, {location: parsed.location, message: parsed.message}]);
    }
  }

  return (
    <StompClient endpoint={websocketServer + "/ws"}
                 topic={`games/list/${props.gameId}`}
                 onMessage={(stompMessage: IMessage) => handleMessage(stompMessage)}
    >
      {list.map((v: ChatMessage, i) => <div key={i} className={v.location.toLowerCase()}>{v.message}</div>)}
      <AlwaysScrollToBottom />
    </StompClient>
  );
}