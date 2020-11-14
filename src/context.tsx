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
  console.debug("mainReducer");
  switch (action.type) {
    case "TO_LOBBY":
      console.log("action.payload", action.payload);

      return {
        messages: [],
        username: action.payload.username || 'Player',
        location: Locations.NotKnown,
        game: ''
      }
    case "NEW_GAME":
      console.log("action.payload", action.payload);

      return {
        messages: [],
        username: state.username,
        location: action.payload.location,
        game: ''
      }
    case "TO_GAME":
      console.log("action.payload", action.payload);

      return {
        messages: [],
        username: state.username,
        location: state.location,
        game: action.payload.game
      }
    default:
      return state;
  }
};

// const messageReducer = (state: MessageType[], action: any): MessageType[] => {
//   console.log("messageReducer, do " + action + " on state " + state);
//   return state;
// };
// const usernameReducer = (state: string, action: any): string => {
//   console.log("usernameReducer, do " + action + " on state " + state);
//   return state;
// };
// const locationReducer = (state: Locations, action: any): Locations => {
//   console.log("locationReducer, do " + action + " on state " + state);
//   return state;
// };

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