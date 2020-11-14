import {useContext} from 'react';
import {MoonshotGameContext} from "./context";
import {Locations} from "./types/type";

const useMoonshotGame = () => {
  const { state, dispatch } = useContext(MoonshotGameContext);

  function connectToLobby(username: string) {
    dispatch({ type: "TO_LOBBY", payload: { username: username }});
  }

  function createGame(location: Locations) {
    dispatch({ type: "NEW_GAME", payload: { location: location }});
  }

  function joinGame(gameId: string) {
    dispatch({ type: "TO_GAME", payload: { game: gameId }});
  }

  return {
    connectToLobby,
    createGame,
    joinGame,
    username: state.username,
    location: state.location,
    connected: state.username != ''
  }
}

export default useMoonshotGame;