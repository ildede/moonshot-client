import * as React from "react";
import {Locations} from "./types/type";
import useMoonshotGame from "./useMoonshotGame";

const LocationManager = () => {
  console.debug("render LocationManager");
  const { startGame, username, location } = useMoonshotGame()

  const [data, setData] = React.useState({
    chosenLocation: location,
    username: username,
    isSubmitting: false,
    errorMessage: null
  });

  const selectChange = (event: any) => {
    console.debug("selectChange", event)
    setData({...data, chosenLocation: event.target.value });
  };
  const usernameChange = (event: any) => {
    console.debug("usernameChange", event)
    setData({...data, username: event.target.value });
  };

  const handleSubmit = (event: any) => {
    console.debug('submit the form', event);
    event.preventDefault();
    setData({...data, isSubmitting: true, errorMessage: null });
    startGame(data.username, data.chosenLocation);
  };

  if (location === Locations.NotKnown) {
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

          <div className="form-group">
            <label>
              Location
              <select value={data.chosenLocation} onChange={selectChange} className="form-control">
                <option value={Locations.NotKnown}>I don't know</option>
                <option value={Locations.Earth}>Earth</option>
                <option value={Locations.Moon}>Moon</option>
              </select>
            </label>
          </div>

          <button type="submit" disabled={data.isSubmitting} className="accent username-submit">
            {data.isSubmitting ? ("Loading...") : ("START")}
          </button>

        </form>
      </div>
    );
  } else {
    return <></>
  }
}

export default LocationManager;