import React, {useEffect} from "react";
import {Piece} from "../model/interfaces";
import {httpServer} from "../../../environment";

export function PlayMoon(props: { gameId: string }): JSX.Element {
  const [pieces, setPieces] = React.useState<Piece[]>([]);

  useEffect(() => {
    if (pieces.length === 0) {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        const parsed: { moonPieces: Piece[] } = JSON.parse(xhr.responseText);
        console.log('parsed', parsed);
        setPieces(parsed.moonPieces);
      });
      xhr.open('GET', httpServer + '/games/' + props.gameId);
      xhr.send();
    }
  }, [setPieces, pieces.length, props.gameId])

  return (
    <div className="moon-container">
      {pieces.map((p, i) => {
        switch (p.shape) {
          case "square":
            return (<div key={i} style={{height: "50px", width: "50px", backgroundColor: p.color, margin: "6px"}}/>);
          case "circle":
            return (<div key={i} style={{
              height: "50px",
              width: "50px",
              borderRadius: "50px",
              backgroundColor: p.color,
              margin: "6px"
            }}/>);
          case "triangle":
            return (<div key={i} style={{
              height: "0",
              width: "0",
              borderBottom: `50px solid ${p.color}`,
              borderTop: "0px solid transparent",
              borderLeft: "25px solid transparent",
              borderRight: "25px solid transparent",
              margin: "6px"
            }}/>);
          default:
            return <></>
        }
      })}
    </div>
  )
}