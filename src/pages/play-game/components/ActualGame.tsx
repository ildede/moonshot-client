import React, {useContext, useState} from "react";
import {GameContext} from "../../../MainApp";
import {PlayEarth} from "./PlayEarth";
import {PlayMoon} from "./PlayMoon";
import {MessagesBox} from "./MessageBox";
import {MessageSender} from "./MessageSender";
import {TimerComponent} from "./TimerComponent";

export const ActualGame = () => {
  const {place, gameId, setPlace, setGameId} = useContext(GameContext);
  const [seconds, setSeconds] = useState<number>(-99);

  const resetGame = () => {
    setPlace('');
    setGameId('');
  }

  if (place === 'EARTH' || place === 'MOON') {
    return (
      <div className={`${place.toLowerCase()}-container`}>
        <div className="timer-container">
          <TimerComponent seconds={seconds} />
        </div>
        {
          place === 'EARTH'
            ? (<PlayEarth gameId={gameId || "empty"} seconds={seconds} />)
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
  } else {
    return (
      <div className={`${place.toLowerCase()}-container`}>
        <div className="result-box">
          <img src={`img/${place.toLowerCase()}.gif`} alt={`You ${place}!`} style={{width: "100%", maxWidth: "100%", height: "auto"}}/>
          <p>Seconds used: {seconds}</p>
        </div>
        <button onClick={resetGame}>Play again</button>
      </div>
    )
  }
}