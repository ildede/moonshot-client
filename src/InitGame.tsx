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

  const handleSubmit = (event: any) => {
    console.debug('submit the form', event);
    event.preventDefault();
    setData({...data, isSubmitting: true });
    connectToLobby(data.username);
  };

  if (!connected) {
    return (
      <div className="username-page-container">
        <h1 className="title">Name and Location</h1>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>
              Name
              <input value={data.username} onChange={usernameChange} type="text" className="form-control" placeholder="Username"/>
            </label>
          </div>

          <button type="submit" disabled={data.isSubmitting} className="accent username-submit">
            {data.isSubmitting ? ("Loading...") : ("START")}
          </button>

        </form>
      </div>
    )
  } else {
    return <Lobby/>
  }

}

export default InitGame;