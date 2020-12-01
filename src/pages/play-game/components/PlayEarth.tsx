import React, {useEffect, useState} from "react";
import {httpServer} from "../../../environment";
import {Piece} from "../model/interfaces";

const ClickableImg = (props: { key: number, part: string, version: number, selectElement: (part: string, version: number) => void }) => {

  return (
    <div>
      <img src={`img/${props.part}/${props.version}.png`}
           alt={`${props.part}, colors from version ${props.version}.png`}
           onClick={() => props.selectElement(props.part, props.version)}
      />
    </div>
  )
}

export function PlayEarth(props: { gameId: string, seconds: number }): JSX.Element {
  const [pieces, setPieces] = React.useState<Piece[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (pieces.length === 0) {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        const parsed: { earthPieces: Piece[] } = JSON.parse(xhr.responseText);
        setPieces(parsed.earthPieces);
      });
      xhr.open('GET', httpServer + '/games/' + props.gameId);
      xhr.send();
    }
  }, [setPieces, pieces.length, props.gameId])

  useEffect(() => {
    if (props.seconds > 100) {
      handleSubmit();
    }
  })

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
  const selectElement = (selectedPart: string, selectedVersion: number) => {
    setPieces(
      pieces.map((p) => {
        if (p.part === selectedPart) {
          p.selected = p.version === selectedVersion;
        }
        return p;
      })
    )
  }
  return (
    <>
        <div className="part-container">
          {pieces.map((p, i) => {
            return (<ClickableImg key={i}
                                  part={p.part}
                                  version={p.version}
                                  selectElement={selectElement}
            />);
          })}
        </div>
        <div className="rocket-container">
          <div id="rocket">
            {pieces
              .filter((p) => p.selected)
              .map((p, i) => {
                return (<img key={i} src={`img/${p.part}/${p.version}.png`} className={p.part} alt={`${p.part}, colors from version ${p.version}.png`}/>);
              })}
          </div>
        </div>
      {pieces.filter((p) => p.selected).length === 5
        ? <div className="launch-container"><button onClick={() => handleSubmit()}>LAUNCH!</button></div>
        : <></>
      }
    </>
  )
}