import * as React from "react";
import {MoonshotGameContext} from "./context";
import {Locations} from "./types/type";

const LocationManager = () => {
  console.debug("render LocationManager");
  const { state, dispatch } = React.useContext(MoonshotGameContext);

  const [data, setData] = React.useState({
    chosenLocation: state.location,
    username: state.username,
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

    dispatch({
      type: "START",
      payload: { location: data.chosenLocation, username: data.username }
    });

  };

  /*
  export function connect(event) {
    username = document.querySelector('#name').value.trim();

    if(username) {
        document.querySelector('#username-page').classList.add('hidden');
        document.querySelector('#chat-page').classList.remove('hidden');

        const socket = new SockJS('http://192.168.0.11:8080/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}
  * */

  //     <div id="username-page">
  //       <div className="username-page-container">
  //         <h1 className="title">Enter your username</h1>
  //         <form id="usernameForm" name="usernameForm" onSubmit={connect}>
  //           <div className="form-group">
  //             <input type="text" id="name" placeholder="Username" autoComplete="off" className="form-control"/>
  //           </div>
  //           <div className="form-group">
  //             <button type="submit" className="accent username-submit">Start Chatting</button>
  //           </div>
  //         </form>
  //       </div>
  //     </div>


  if (state.location === Locations.NotKnown) {
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