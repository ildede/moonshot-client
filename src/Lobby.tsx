import * as React from "react";
import useMoonshotGame from "./useMoonshotGame";
import {Locations} from "./types/type";
import StompClient from "react-stomp-client";
import {IMessage} from "@stomp/stompjs";

interface WaitingGame {
  gameId: string;
  location: Locations;
  creationDate: string;
}

const Lobby: React.FC = () => {
  const { createGame, joinGame, username } = useMoonshotGame();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [list, setList] = React.useState<WaitingGame[]>([]);

  const handleMessage = (stompMessage: IMessage) => {
    const parsed = JSON.parse(stompMessage.body);
    console.log(parsed);
    if (parsed.type === 'REMOVE_GAME') {
      console.log("remove game:", parsed);
      setList(list.filter(g => g.gameId !== parsed.content));
    }
    if (parsed.type === 'NEW_GAME') {
      console.log("new game:", parsed);
      setList([...list, { gameId: parsed.content, location: Locations.NotKnown, creationDate: parsed.timestamp }])
    }
    if (parsed.type === 'JOIN') {
      console.log("join on game:", parsed);
      list.forEach(g => {
        if (g.gameId === parsed.content) {
          g.location = parsed.location;
        }
      });
      setList(list);
    }
  }
  return (
    <>
      <div>
        <h1>CONNESSO!</h1>
        <p>Ciao {username}</p>
        <button disabled={isSubmitting} onClick={() => {setIsSubmitting(true);createGame();}}>Crea una nuova partita</button>
      </div>
      <div>
          <StompClient endpoint="ws://192.168.0.11:8080/ws"
                       topic="games/list"
                       onMessage={(stompMessage: IMessage) => handleMessage(stompMessage)}
          >
            <div>
              {list.map((v, i) => {
                if (v.location === Locations.NotKnown) {
                  return (<p key={v.gameId}>
                    {v.creationDate}:<br/>
                    <button onClick={() => joinGame(v.gameId, Locations.Moon)}>Join on MOON</button>
                    <button onClick={() => joinGame(v.gameId, Locations.Earth)}>Join on EARTH</button>
                  </p>)
                } else {
                  return (<p key={v.gameId}>
                    {v.creationDate}:<br/>
                    <button onClick={() => joinGame(v.gameId, v.location)}>Join on {v.location}</button>
                  </p>)
                }
              })}
            </div>
          </StompClient>
      </div>
    </>
  );
}

export default Lobby;