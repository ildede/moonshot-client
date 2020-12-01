import React, {useContext, useEffect} from "react";
import {IMessage} from "@stomp/stompjs";
import StompClient from "react-stomp-client";
import {Locations, WaitingGame} from "../model/interfaces";
import {GameContext} from "../../../MainApp";
import {httpServer, websocketServer} from "../../../environment";

const toEmoticon = (s: string) => {
  switch (s) {
    case 'MOON':
      return '🌖';
    case 'EARTH':
      return '🌍';
  }
}
const reverseLocation = (s: string) => {
  switch (s) {
    case 'MOON':
      return 'EARTH';
    case 'EARTH':
      return 'MOON';
  }
}

export const GameJoiner = () => {
  const {setGameId, setPlace, username} = useContext(GameContext);
  const [list, setList] = React.useState<WaitingGame[]>([]);

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      const parsed: any[] = JSON.parse(xhr.responseText);
      const mapped: WaitingGame[] = parsed
        .filter(el => !el.userOnEarth || !el.userOnMoon)
        .map(el => {
          return {
            gameId: el.id,
            location: el.userOnEarth ? Locations.Moon : Locations.Earth,
            creationTime: el.creationTime,
            username: el.userOnEarth ? el.userOnEarth : el.userOnMoon
          }
        })
      setList(mapped);
    });
    xhr.open('GET', httpServer+'/games/list');
    xhr.send();
  }, [setList]);

  const handleMessage = (stompMessage: IMessage) => {
    const parsed = JSON.parse(stompMessage.body);
    if (parsed.type === 'REMOVE_GAME') {
      setList(list.filter(g => g.gameId !== parsed.content));
    }
    if (parsed.type === 'NEW_GAME') {
      setList([...list, {
        gameId: parsed.content,
        location: parsed.location,
        creationTime: parsed.timestamp,
        username: parsed.sender
      }])
    }
  }
  const joinGame = (gameId: string, place: string) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      setGameId(gameId);
      setPlace(place);
    });
    xhr.open('POST', httpServer+'/games/join');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({game: gameId, username: username, location: place}));
  }

  return (
    <StompClient endpoint={websocketServer+"/ws"}
                 topic="games/list"
                 onMessage={(stompMessage: IMessage) => handleMessage(stompMessage)}
    >
      <div className="game-list">
        {list.map((v, i) => {
          return (
            <p key={v.gameId}>
              <strong>{v.username}</strong> is on the {reverseLocation(v.location)}, waiting for you.
              <button onClick={() => joinGame(v.gameId, v.location)}>Join to play on {toEmoticon(v.location)}</button>
            </p>
          )
        })}
      </div>
    </StompClient>
  );
}