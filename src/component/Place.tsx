import React, {FormEvent, useEffect, useState} from 'react';
import {Locations} from "../types/type";
import {IMessage} from "@stomp/stompjs";
import StompClient from "react-stomp-client";

interface ChatMessage {
  location: Locations;
  message: string;
}


const MessageSender = (props: { place: Locations, gameId?: string }) => {
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const messageChange = (event: any) => {
    setMessage(event.target.value);
  }

  const sendMessage = () => {
    if (message) {
      setIsSubmitting(true);
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        setIsSubmitting(false);
      });
      xhr.open('POST', 'http://localhost:8080/games/message');
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify({ game: props.gameId, location: props.place, message: message }));
    }
  }

  return (
    <>
      <input
        type="text" autoComplete="off"
        placeholder="Type a message..."
        value={message}
        onChange={messageChange}
      />
      <button disabled={isSubmitting} onClick={sendMessage}>
        {isSubmitting ? ("Wait...") : ("Send")}
      </button>
    </>
  )
}

function PlayEarth() {
  const [pieces, setPieces] = React.useState<Piece[]>([]);

  useEffect(() => {
    setPieces([
      {color: "red", shape: "circle"},
      {color: "blue", shape: "square"},
      {color: "green", shape: "triangle"},
      {color: "green", shape: "circle"},
      {color: "red", shape: "square"},
      {color: "blue", shape: "triangle"}
    ])
  }, [setPieces])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submit:", pieces.filter(p => p.selected));
  }
  const selectElement = (element: string, selected: boolean) => {
    setPieces(
      pieces.map((p) => {
        if (element.startsWith(p.shape) && element.endsWith(p.color)) {
          p.selected = selected;
        }
        return p;
      })
    )
  }
  return (
    <div>
      <h3>Choose the right pieces with the help of your teammate</h3>
      <form onSubmit={(event) => handleSubmit(event)}>
        {pieces.map((p, i) => {
          switch (p.shape) {
            case "square":
              return (<ClickableShape key={i} name={p.shape+"-"+p.color} style={{height: "50px", width: "50px", backgroundColor: p.color}} selectElement={selectElement} />);
            case "circle":
              return (<ClickableShape key={i} name={p.shape+"-"+p.color} style={{height: "50px", width: "50px", borderRadius: "50px", backgroundColor: p.color}} selectElement={selectElement} />);
            case "triangle":
              return (<ClickableShape key={i} name={p.shape+"-"+p.color} style={{height: "0", width: "0", borderBottom: `50px solid ${p.color}`, borderTop: "0px solid transparent", borderLeft: "25px solid transparent", borderRight: "25px solid transparent"}} selectElement={selectElement} />);
            default:
              return <></>
          }})}
          <button type="submit">SUBMIT</button>
      </form>
    </div>
  )
}

const ClickableShape = (props: { key: number, name: string, style: React.CSSProperties, selectElement: (element: string, selected: boolean) => void }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <div style={ clicked ? {border: "2px solid black", width: "min-content", padding: "2px", margin: "2px"} : { padding: "4px", margin: "2px"}}>
      <input
        style={{display: "none"}}
        name={props.name}
        type="checkbox"
        checked={clicked}
        onChange={() => setClicked(!clicked)}
      />
      <div style={props.style} onClick={() => { setClicked(!clicked);props.selectElement(props.name, !clicked);}}/>
    </div>
  )
}

interface Piece {
  color: string;
  shape: string;
  selected?: boolean;
}
function PlayMoon() {
  const [pieces, setPieces] = React.useState<Piece[]>([]);

  useEffect(() => {
    setPieces([{color: "red", shape: "circle"}, {color: "blue", shape: "square"}, {color: "green", shape: "triangle"}])
  }, [setPieces])

  return (<div>
    <h3>Help your teammate choose the right option</h3>
    {pieces.map((p, i) => {
      switch (p.shape) {
        case "square":
          return (<div key={i} style={{height: "50px", width: "50px", backgroundColor: p.color}}/>);
        case "circle":
          return (<div key={i} style={{height: "50px", width: "50px", borderRadius: "50px", backgroundColor: p.color}}/>);
        case "triangle":
          return (<div key={i} style={{height: "0", width: "0", borderBottom: `50px solid ${p.color}`, borderTop: "0px solid transparent", borderLeft: "25px solid transparent", borderRight: "25px solid transparent"}}/>);
        default:
          return <></>
      }})}
  </div>)
}

function Place(props: { place: Locations, username: string, gameId?: string }): JSX.Element {
  const [list, setList] = React.useState<ChatMessage[]>([]);

  const handleMessage = (stompMessage: IMessage) => {
    const parsed: any = JSON.parse(stompMessage.body);
    setList([...list, { location: parsed.location, message: parsed.message }])
  }

  return (
    <>
      <h2>{props.place}</h2>
      <p>Hi {props.username}, tell to your teammate what to do.</p>

      <div className="game-container">
        {
          props.place === Locations.Earth
            ? <PlayEarth />
            : <PlayMoon />
        }
      </div>

      <div className="message-container">
        <div className="message-box">
          <StompClient endpoint="ws://localhost:8080/ws"
                       topic={`games/list/${props.gameId}`}
                       onMessage={(stompMessage: IMessage) => handleMessage(stompMessage)}
          >
            {list.map((v: ChatMessage, i) => <li key={i}>{v.location}: {v.message}</li>)}
          </StompClient>
        </div>
        <div className="message-sender">
          <MessageSender place={props.place} gameId={props.gameId} />
        </div>
      </div>

    </>
  )
}

export default Place;
