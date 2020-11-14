import React from "react";
import {MoonshotGameProvider} from "./context";
import InitGame from "./InitGame";
import Game from "./Game";
import useMoonshotGame from "./useMoonshotGame";
import {Locations} from "./types/type";

export default function MoonshotGameApp() {
  console.debug("render MoonshotGameApp");
  const { location } = useMoonshotGame();

  return (
    <MoonshotGameProvider>
      <Switch test={location}>
        <Case value={Locations.NotKnown}><InitGame/></Case>
        <Case value={Locations.Earth}><Game/></Case>
        <Case value={Locations.Moon}><Game/></Case>
      </Switch>
    </MoonshotGameProvider>
  )
}

const Switch = (props:any) => {
  const { test, children } = props;
  return children.find((child:any) => {
    return child.props.value === test;
  });
};
const Case = ({ children, value }: { children: any, value: Locations }) => {
  return children;
}
