import React, {useContext, useState} from "react";
import {GameContext} from "../../../MainApp";
import {httpServer} from "../../../environment";

export const PlaceChooser = () => {
  const {setPlace, setGameId, username} = useContext(GameContext)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const createGame = (place: string) => {
    setIsSubmitting(true);
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      const parse = JSON.parse(xhr.responseText);
      setGameId(parse.id);
      setPlace(place);
    });
    xhr.open('POST', httpServer+'/games/create');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({place: place, username: username}));
  };

  return (
    <div className="select-place-container">
      <div className="select-place-moon">
        <button disabled={isSubmitting} onClick={() => createGame('MOON')}>Play on MOON <span>🌖</span></button>
        <div>Play as Prof. Melier, who crashed on the Moon. Provide instructions to build the spaceship according to your project.</div>
      </div>
      <div className="select-place-earth">
        <button disabled={isSubmitting} onClick={() => createGame('EARTH')}>Play on EARTH <span>🌍</span></button>
        <div>Play as the Earth crew, receive instructions from Prof. Melier and assemble the spaceship parts.</div>
      </div>
    </div>
  )
}