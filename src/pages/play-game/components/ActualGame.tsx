import React, {useContext} from "react";
import {GameContext} from "../../../MainApp";
import {PlayEarth} from "./PlayEarth";
import {PlayMoon} from "./PlayMoon";
import {MessagesBox} from "./MessageBox";
import {MessageSender} from "./MessageSender";

export const ActualGame = () => {
  const {username, place, gameId} = useContext(GameContext);

  return (
    <>
      <h2>{place}</h2>
      <p>Hi {username}, tell to your teammate what to do.</p>

      <div className="game-container">
        {
          place === 'EARTH'
            ? <PlayEarth gameId={gameId || "empty"}/>
            : <PlayMoon gameId={gameId || "empty"}/>
        }
      </div>

      <div className="message-container">
        <div className="message-box">
          <MessagesBox gameId={gameId} />
        </div>
        <div className="message-sender">
          <MessageSender place={place} gameId={gameId} />
        </div>
      </div>

    </>
  )
}