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
        return (<img key={i} src={`img/${p.part}/${p.version}.png`} className={p.part} alt={`${p.part}, colors from version ${p.version}.png`}/>);
      })}
    </div>
  )
}