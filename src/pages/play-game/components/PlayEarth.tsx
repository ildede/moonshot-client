import React, {useEffect, useState} from "react";
import {httpServer} from "../../../environment";
import {Piece} from "../model/interfaces";

const ClickableImg = (props: { key: number, part: string, version: number, selectElement: (element: string) => void }) => {

  return (
    <div className="part" onClick={() => props.selectElement(`${props.part}-${props.version}`)}>
      <img src={`img/${props.part}/${props.version}.png`}
           alt={`${props.part}, colors from version ${props.version}.png`}
      />
    </div>
  )
}

export function PlayEarth(props: { gameId: string }): JSX.Element {
  const [pieces, setPieces] = React.useState<Piece[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (pieces.length === 0) {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        const parsed: { earthPieces: Piece[] } = JSON.parse(xhr.responseText);
        console.log('parsed', parsed);
        setPieces(parsed.earthPieces);
      });
      xhr.open('GET', httpServer + '/games/' + props.gameId);
      xhr.send();
    }
  }, [setPieces, pieces.length, props.gameId])

  const handleSubmit = () => {
    if (!isSubmitting) {
      const selected: Piece[] = pieces.filter(p => p.selected);
      setIsSubmitting(true);
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        setIsSubmitting(false);
      });
      xhr.open('POST', httpServer + '/games/' + props.gameId + '/check');
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify(selected));
    }
  }
  const selectElement = (element: string) => {
    setPieces(
      pieces.map((p) => {
        if (element.startsWith(p.part)) {
          p.selected = element.endsWith(p.version.toString());
        }
        return p;
      })
    )
  }
  return (
    <div className="earth-container">
      <form onSubmit={(event) => event.preventDefault()}>
        {pieces.map((p, i) => {
          return (<ClickableImg key={i}
                                part={p.part}
                                version={p.version}
                                selectElement={selectElement}
          />);
        })}
      </form>
      <button onClick={() => handleSubmit()}>LAUNCH!</button>
      {pieces
        .filter((p) => p.selected)
        .map((p, i) => {
          return (<img key={i} src={`img/${p.part}/${p.version}.png`} className={p.part} alt={`${p.part}, colors from version ${p.version}.png`}/>);
        })}
    </div>
  )
}