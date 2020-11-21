import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Locations} from "./types/type";
import {IMessage} from "@stomp/stompjs";
import StompClient from "react-stomp-client";

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
    console.log('Creo NEW_GAME');
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      // update the state of the component with the result here
      console.log(xhr.responseText);
      const parse = JSON.parse(xhr.responseText);
      setGameId(parse.id);
      setPlace(place);
    });
    xhr.open('POST', 'http://localhost:8080/games/create');
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
      <h1>PLAY!</h1>
      <p>User: {username}</p>
      <p>Place: {place}</p>
      <p>Game: {gameId}</p>
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
      // update the state of the component with the result here
      const parsed: any[] = JSON.parse(xhr.responseText);
      console.log('parsed', parsed);
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
      console.log('mapped', mapped);
      setList(mapped);
    });
    xhr.open('GET', 'http://localhost:8080/games/list');
    // xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send();
  }, [setList]);

  const handleMessage = (stompMessage: IMessage) => {
    const parsed = JSON.parse(stompMessage.body);
    console.log(parsed);
    if (parsed.type === 'REMOVE_GAME') {
      setList(list.filter(g => g.gameId !== parsed.content));
    }
    if (parsed.type === 'NEW_GAME') {
      setList([...list, { gameId: parsed.content, location: parsed.location, creationTime: parsed.timestamp, username: parsed.sender }])
    }
  }
  const joinGame = (gameId: string, place: string) => {
    console.log('Faccio JOIN a un game esistente', { game: gameId, username: username, location: place });
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      // update the state of the component with the result here
      console.log('risposta server', xhr.responseText);
      setGameId(gameId);
      setPlace(place);
    });
    xhr.open('POST', 'http://localhost:8080/games/join');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ game: gameId, username: username, location: place }));
  }

  return (
    <StompClient endpoint="ws://localhost:8080/ws"
                 topic="games/list"
                 onMessage={(stompMessage: IMessage) => handleMessage(stompMessage)}
    >
      <div>
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