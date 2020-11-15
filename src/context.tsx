import React, {createContext, useReducer} from 'react';
import {Action, InitialStateType, Locations} from "./types/type";

const initialState: InitialStateType = {
  messages: [],
  username: '',
  location: Locations.NotKnown,
  game: ''
}

const MoonshotGameContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

const mainReducer = (state: InitialStateType, action: Action) => {
  const xhr = new XMLHttpRequest();
  switch (action.type) {
    case "TO_LOBBY":
      console.log('eseguo per TO_LOBBY');
      return {
        messages: [],
        username: action.payload.username || 'Player',
        location: Locations.NotKnown,
        game: ''
      }
    case "NEW_GAME":
      console.log('eseguo per NEW_GAME');
      xhr.addEventListener('load', () => {
        // update the state of the component with the result here
        console.log(xhr.responseText);
      });
      xhr.open('POST', 'http://192.168.0.11:8080/games/create');
      xhr.send("please");
      return {
        messages: [],
        username: state.username,
        location: Locations.NotKnown,
        game: ''
      }
    case "TO_GAME":
      console.log('eseguo per TO_GAME');
      xhr.addEventListener('load', () => {
        // update the state of the component with the result here
        console.log(xhr.responseText);
      });
      xhr.open('POST', 'http://192.168.0.11:8080/games/join');
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify({ game: action.payload.game, username: state.username, location: action.payload.location }));
      return {
        messages: [],
        username: state.username,
        location: action.payload.location,
        game: action.payload.game
      }
    default:
      return state;
  }
};

const MoonshotGameProvider: React.FC = ({ children }) => {
  console.debug("render MoonshotGameProvider");
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <MoonshotGameContext.Provider value={{state, dispatch}}>
      { children }
    </MoonshotGameContext.Provider>
  )
}

export { MoonshotGameProvider, MoonshotGameContext };