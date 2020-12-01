import React, {useContext, useState} from "react";
import {GameContext} from "../../../MainApp";
import {PlayEarth} from "./PlayEarth";
import {PlayMoon} from "./PlayMoon";
import {MessagesBox} from "./MessageBox";
import {MessageSender} from "./MessageSender";
import {TimerComponent} from "./TimerComponent";

export const ActualGame = () => {
  const {place, gameId} = useContext(GameContext);
  const [seconds, setSeconds] = useState<number>(-99);

  return (
    <div className={`${place.toLowerCase()}-container`}>
        <div className="timer-container">
          <TimerComponent seconds={seconds} />
        </div>
        {
          place === 'EARTH'
            ? (seconds < 0 ? <></> : <PlayEarth gameId={gameId || "empty"}/>)
            : (seconds < 0 ? <></> : <PlayMoon gameId={gameId || "empty"}/>)
        }

        <div className="message-container">
          <div className="message-box">
            <MessagesBox gameId={gameId} handleSeconds={setSeconds} />
          </div>
          <div className="message-sender">
            <MessageSender place={place} gameId={gameId} />
          </div>
        </div>

    </div>
  )
}