import React, {createContext, useReducer} from 'react';
import {Action, InitialStateType, Locations} from "./types/type";

const initialState: InitialStateType = {
  messages: [],
  username: '',
  location: Locations.NotKnown
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
    case "START":
      console.log("action.location ", action.payload.location);
      console.log("action.username ", action.payload.username);

      return {
        messages: [],
        username: action.payload.username || `Player on ${action.payload.location}`,
        location: action.payload.location
      }
    case "NEW_MESSAGE":
      console.log("action.location ", action.payload.message);
      return {
        messages: [...state.messages, action.payload.message],
        username: state.username,
        location: state.location
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