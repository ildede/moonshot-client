import React, {Dispatch, SetStateAction} from 'react';
import {render, screen} from '@testing-library/react';
import {ActualGame} from "./ActualGame";
import {GameContext} from "../../../MainApp";

const fakeDispatch: Dispatch<SetStateAction<string>> = () => {
  return () => "";
}

test('it renders MOON place', () => {
  render(
    <GameContext.Provider value={{ username: "any", setUsername: fakeDispatch, gameId: "gameId", setGameId: fakeDispatch, place: "MOON", setPlace: fakeDispatch }}>
      <ActualGame />
    </GameContext.Provider>
  )

  const location = screen.getByText(/MOON/i);
  expect(location).toBeInTheDocument();
});

test('it renders EARTH place', () => {
  render(
    <GameContext.Provider value={{ username: "any", setUsername: fakeDispatch, gameId: "gameId", setGameId: fakeDispatch, place: "EARTH", setPlace: fakeDispatch }}>
      <ActualGame />
    </GameContext.Provider>
  )

  const location = screen.getByText(/EARTH/i);
  expect(location).toBeInTheDocument();
});
