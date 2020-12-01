import React, {useContext, useState} from "react";
import {GameContext} from "../../../MainApp";

const StarWars = () => {
  return (
    <div className="star-wars-wrapper">
      <section className="star-wars">
        <div className="crawl">

          <div className="title">
            <p>Professor Melier crashed on the moon. He needs to be rescued!</p>
            <h1>But beware of the ComMoonication IntEarthference!</h1>
          </div>

          <p>The only existing copy of the spaceship's blueprint is in the professor's hands!</p>
          <p>He will have to guide his colleagues back on the Earth via radio communication.</p>
          <p>Collaborate together to build a spaceship and rescue Prof. Melier from the moon. Be quick, the intEarthference might make it difficult to comMoonicate...</p>

        </div>

      </section>
    </div>
  );
}


export const UserNameChooser = () => {
  const {setUsername, place, setPlace} = useContext(GameContext);
  const [name, setName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const nameChange = (event: any) => {
    setName(event.target.value);
  }

  const chooseName = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (name) {
      setUsername(name);
      setPlace('splash');
    }
  };

  return (
    <>
      {place === 'intro' ? <StarWars /> : <></>}
      <form onSubmit={chooseName}>
        <h2>Choose a name to start playing</h2>
        <input value={name} onChange={nameChange} type="text" placeholder="Username"/>
        <button disabled={!name || isSubmitting} onClick={chooseName}>
          {isSubmitting ? ("Loading...") : ("START")}
        </button>
      </form>
    </>
  )
}