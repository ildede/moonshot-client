import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {IMessage} from "@stomp/stompjs";
import StompClient from "react-stomp-client";
import Place from "./component/Place";

const GameContext = React.createContext<{
  username: string, place: string, gameId: string,
  setUsername: Dispatch<SetStateAction<string>>,
  setPlace: Dispatch<SetStateAction<string>>,
  setGameId: Dispatch<SetStateAction<string>>
}>({
  username: '',
  place: '',
  gameId: '',
  setUsername: () => null,
  setPlace: () => null,
  setGameId: () => null
});
enum Locations {
  Earth = 'EARTH',
  Moon = 'MOON'
}
const UserNameChooser = () => {
  const { setUsername } = useContext(GameContext);
  const [name, setName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const nameChange = (event: any) => {
    setName(event.target.value);
  }

  const chooseName = () => {
    setIsSubmitting(true);
    if (name) {
      setUsername(name);
    }
  };

  return (
    <div>
      <h2>Username</h2>
      <input value={name} onChange={nameChange} type="text" placeholder="Username"/>
      <button disabled={!name || isSubmitting} onClick={chooseName}>
        {isSubmitting ? ("Loading...") : ("START")}
      </button>
    </div>
  )
}
const PlaceChooser = () => {
  const { setPlace, setGameId, username } = useContext(GameContext)
  const [isSubmitting, setIsSubmitting]  = useState<boolean>(false)

  const createGame = (place: string) => {
    setIsSubmitting(true);
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      const parse = JSON.parse(xhr.responseText);
      setGameId(parse.id);
      setPlace(place);
    });
    xhr.open('POST', 'https://moonshot-server-spring.herokuapp.com/games/create');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({place: place, username: username}));
  };

  return (
    <p>
      <button disabled={isSubmitting} onClick={() => createGame('MOON')}>Set Place to MOON</button>
      <button disabled={isSubmitting} onClick={() => createGame('EARTH')}>Set Place to EARTH</button>
    </p>
  )
}
const ActualGame = () => {
  const { username, place, gameId } = useContext(GameContext)
  return (
    <>
      <Place place={place === 'MOON' ? Locations.Moon : Locations.Earth} username={username} gameId={gameId}/>
    </>
  )
}
const InitGameInfo = () => {
  const { username, place } = useContext(GameContext)
  return (
    <>
      {username
        ? (
          <>
            <div>{`User: ${username}`}</div>
            <div>
              <h2>CHOOSE!</h2>
              <div>{place ? `Place: ${place}` : <PlaceChooser/>}</div>
              <h2>or JOIN!</h2>
              <GameJoiner/>
            </div>
          </>
        )
        : <UserNameChooser/>
      }
    </>
  )
}
interface WaitingGame {
  gameId: string;
  location: Locations;
  creationTime: string;
  username: string;
}
const GameJoiner = () => {
  const { setGameId, setPlace, username } = useContext(GameContext);
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
    xhr.open('GET', 'https://moonshot-server-spring.herokuapp.com/games/list');
    xhr.send();
  }, [setList]);

  const handleMessage = (stompMessage: IMessage) => {
    const parsed = JSON.parse(stompMessage.body);
    if (parsed.type === 'REMOVE_GAME') {
      setList(list.filter(g => g.gameId !== parsed.content));
    }
    if (parsed.type === 'NEW_GAME') {
      setList([...list, { gameId: parsed.content, location: parsed.location, creationTime: parsed.timestamp, username: parsed.sender }])
    }
  }
  const joinGame = (gameId: string, place: string) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      setGameId(gameId);
      setPlace(place);
    });
    xhr.open('POST', 'https://moonshot-server-spring.herokuapp.com/games/join');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ game: gameId, username: username, location: place }));
  }

  return (
    <StompClient endpoint="wss://moonshot-server-spring.herokuapp.com/ws"
                 topic="games/list"
                 onMessage={(stompMessage: IMessage) => handleMessage(stompMessage)}
    >
      <div className="game-list">
        {list.map((v, i) => {
          return (
            <p key={v.gameId}>
              Created on {v.creationTime} by {v.username}:
              <button onClick={() => joinGame(v.gameId, v.location)}>Join on {v.location}</button>
            </p>
          )
        })}
      </div>
    </StompClient>
  );
}


const MainApp = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [gameId, setGameId] = useState('');
  const [place, setPlace] = useState('');

  return (
    <GameContext.Provider value={{ username: username, setUsername: setUsername, gameId: gameId, setGameId: setGameId, place: place, setPlace: setPlace }}>
      <div className="main-container">
        {username && gameId && place ? <ActualGame/> : <InitGameInfo/>}
      </div>
    </GameContext.Provider>
  )

}

export default MainApp;