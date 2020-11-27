import React, {useContext} from "react";
import Place from "./Place";
import {Locations} from "../../init-game/model/interfaces";
import {GameContext} from "../../../MainApp";

export const ActualGame = () => {
  const {username, place, gameId} = useContext(GameContext)
  return (
    <>
      <Place place={place === 'MOON' ? Locations.Moon : Locations.Earth} username={username} gameId={gameId}/>
    </>
  )
}