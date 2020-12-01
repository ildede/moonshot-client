import React from "react";

export const TimerComponent: (props: { seconds: number }) => JSX.Element = (props: {seconds: number}) => {

  if (props.seconds < 0) {
    return props.seconds === -99
      ? (<div className="waiting-message">WAITING FOR PLAYER</div>)
      : (<div className="waiting-message">GAME STARTS IN {-1 * props.seconds} SECONDS</div>)
  } else {
    return (
      <div className="wrapper">
        <div className="progress-bar" style={{width: `${100 - props.seconds}%`}}>
          <span className="progress-bar-fill" />
        </div>
      </div>
    );
  }
}