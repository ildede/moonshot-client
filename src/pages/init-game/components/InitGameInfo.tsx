import React, {useContext} from "react";
import {GameJoiner} from "./GameJoiner";
import {UserNameChooser} from "./UserNameChooser";
import {PlaceChooser} from "./PlaceChooser";
import {GameContext} from "../../../MainApp";

export const InitGameInfo = () => {
  const {username, place} = useContext(GameContext)
  return (
    <div className="main-container">
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
    </div>
  )
}