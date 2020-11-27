import React, {FormEvent, useEffect, useState} from "react";
import {httpServer} from "../../../environment";
import {Piece} from "../model/interfaces";

const ClickableShape = (props: { key: number, name: string, style: React.CSSProperties, selectElement: (element: string, selected: boolean) => void }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <div style={ clicked ? {border: "2px solid black", width: "min-content", padding: "2px", margin: "2px", float: "left"} : { padding: "4px", margin: "2px", float: "left"} }>
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
              return (<ClickableShape key={i} name={p.shape + "-" + p.color}
                                      style={{height: "50px", width: "50px", backgroundColor: p.color}}
                                      selectElement={selectElement}/>);
            case "circle":
              return (<ClickableShape key={i} name={p.shape + "-" + p.color} style={{
                height: "50px",
                width: "50px",
                borderRadius: "50px",
                backgroundColor: p.color
              }} selectElement={selectElement}/>);
            case "triangle":
              return (<ClickableShape key={i} name={p.shape + "-" + p.color} style={{
                height: "0",
                width: "0",
                borderBottom: `50px solid ${p.color}`,
                borderTop: "0px solid transparent",
                borderLeft: "25px solid transparent",
                borderRight: "25px solid transparent"
              }} selectElement={selectElement}/>);
            default:
              return <></>
          }
        })}
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  )
}