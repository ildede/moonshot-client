import React, {Dispatch, SetStateAction, useState} from "react";
import {InitGameInfo} from "./pages/init-game/components/InitGameInfo";
import {ActualGame} from "./pages/play-game/components/ActualGame";

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

const MainApp = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [gameId, setGameId] = useState('');
  const [place, setPlace] = useState('intro');

  return (
    <GameContext.Provider value={{ username: username, setUsername: setUsername, gameId: gameId, setGameId: setGameId, place: place, setPlace: setPlace }}>
      <div className={`container ${place.toLowerCase()}`}>
        {username && gameId && place
          ? <ActualGame/>
          : <InitGameInfo/>
        }
      </div>
    </GameContext.Provider>
  )

}

export default MainApp
export { GameContext };