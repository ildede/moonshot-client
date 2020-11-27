import React, {useContext, useState} from "react";
import {GameContext} from "../../../MainApp";

export const UserNameChooser = () => {
  const {setUsername} = useContext(GameContext);
  const [name, setName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const nameChange = (event: any) => {
    setName(event.target.value);
  }

  const chooseName = () => {
    setIsSubmitting(true);
    if (name) {
      setUsername(name);
    }
  };

  return (
    <div>
      <h2>Username</h2>
      <input value={name} onChange={nameChange} type="text" placeholder="Username"/>
      <button disabled={!name || isSubmitting} onClick={chooseName}>
        {isSubmitting ? ("Loading...") : ("START")}
      </button>
    </div>
  )
}