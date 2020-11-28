import React, {FormEvent, useEffect, useState} from "react";
import {httpServer} from "../../../environment";
import {Piece} from "../model/interfaces";

const ClickableImg = (props: { key: number, part: string, version: number, selectElement: (element: string, selected: boolean) => void }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <div style={ clicked ? {border: "2px solid black", width: "min-content", padding: "2px", margin: "2px", float: "left"} : { padding: "4px", margin: "2px", float: "left"} }>
      <input
        style={{display: "none"}}
        name={`${props.part}-${props.version}`}
        type="checkbox"
        checked={clicked}
        onChange={() => setClicked(!clicked)}
      />
      <img src={`img/${props.part}/${props.version}.png`}
           className={props.part}
           alt={`${props.part}, colors from version ${props.version}.png`}
           onClick={() => { setClicked(!clicked);props.selectElement(`${props.part}-${props.version}`, !clicked);}}
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
  const selectElement = (element: string, selected: boolean) => {
    setPieces(
      pieces.map((p) => {
        if (element.startsWith(p.part) && element.endsWith(p.version.toString())) {
          p.selected = selected;
        }
        return p;
      })
    )
  }
  return (
    <div>
      <form onSubmit={(event) => handleSubmit(event)}>
        {pieces.map((p, i) => {
          return (<ClickableImg key={i}
                                part={p.part}
                                version={p.version}
                                selectElement={selectElement}
          />);
        })}
        <button type="submit">LAUNCH!</button>
      </form>
    </div>
  )
}