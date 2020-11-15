import React from "react";
import {MoonshotGameProvider} from "./context";
import InitGame from "./InitGame";
import useMoonshotGame from "./useMoonshotGame";
import {Locations} from "./types/type";
import Place from "./component/Place";

export default function MoonshotGameApp() {
  console.info("render MoonshotGameApp");
  const { location, username } = useMoonshotGame();

  return (
    <MoonshotGameProvider>
      <div className="main-container">
        <Switch test={location}>
          <Case value={Locations.NotKnown}><InitGame/></Case>
          <Case value={Locations.Earth}><Place place={location} username={username}/></Case>
          <Case value={Locations.Moon}><Place place={location} username={username}/></Case>
        </Switch>
      </div>
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
