import React, {useContext} from "react";
import {GameJoiner} from "./GameJoiner";
import {UserNameChooser} from "./UserNameChooser";
import {PlaceChooser} from "./PlaceChooser";
import {GameContext} from "../../../MainApp";

export const InitGameInfo = () => {
  const {username, place, setPlace} = useContext(GameContext)

  if (place === 'splash') {
    return (
      <div className="main-container" onClick={() => setPlace('')}>
        <p>click to start</p>
      </div>
      )
  } else {
    return (
      <div className="main-container">
        {username
          ? (
            <>
              <div>{`User: ${username}`}</div>
              <div>
                <h2>CHOOSE where you want to play to create a room!</h2>
                <div>{place ? `Place: ${place}` : <PlaceChooser/>}</div>
                <h2>Or JOIN an existing room!</h2>
                <GameJoiner/>
              </div>
            </>
          )
          : <UserNameChooser/>
        }
      </div>
    )
  }
}