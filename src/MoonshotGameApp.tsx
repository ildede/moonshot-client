import * as React from "react";
import { MoonshotGameProvider } from "./context";
import LocationManager from "./LocationManager";
import Game from "./Game";

export default function MoonshotGameApp() {
  console.debug("render MoonshotGameApp");
  return (
    <MoonshotGameProvider>
      <LocationManager />
      <Game />
    </MoonshotGameProvider>
  )
}