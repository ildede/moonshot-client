import {useContext} from 'react';
import {MoonshotGameContext} from "./context";
import {Locations} from "./types/type";
import {connect} from "./main";

const useMoonshotGame = () => {
  const { state, dispatch } = useContext(MoonshotGameContext);

  function startGame(username: string, location: Locations) {
    dispatch({type: "START", payload: {username: username, location: location}});
    connect(username);
  }

  return {
    startGame,
    username: state.username,
    location: state.location
  }
}

export default useMoonshotGame;