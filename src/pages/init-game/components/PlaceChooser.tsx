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
    <p>
      <button disabled={isSubmitting} onClick={() => createGame('MOON')}>Set Place to MOON</button>
      <button disabled={isSubmitting} onClick={() => createGame('EARTH')}>Set Place to EARTH</button>
    </p>
  )
}