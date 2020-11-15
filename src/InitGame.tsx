import * as React from "react";
import useMoonshotGame from "./useMoonshotGame";
import Lobby from "./Lobby";

const InitGame = () => {
  console.debug("render InitGame");
  const { connectToLobby, connected } = useMoonshotGame();
  const [data, setData] = React.useState({username: '', isSubmitting: false});

  const usernameChange = (event: any) => {
    console.debug('usernameChange', event)
    setData({...data, username: event.target.value });
  }

  const chooseNameAndConnect = (event: any) => {
    console.debug('submit the form', event);
    setData({...data, isSubmitting: true });
    connectToLobby(data.username);
  };

  if (!connected) {
    return (
      <div>
        <h1>Name</h1>

        <input value={data.username} onChange={usernameChange} type="text" placeholder="Username"/>

        <button disabled={data.isSubmitting} onClick={chooseNameAndConnect}>
          {data.isSubmitting ? ("Loading...") : ("START")}
        </button>

      </div>
    )
  } else {
    return <Lobby/>
  }

}

export default InitGame;