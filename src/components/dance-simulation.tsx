import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./dance-simulation.sass";

interface IProps extends IBaseProps {
  dance: string;
}
interface IState {
}

export class DanceSimulation extends BaseComponent<IProps, IState> {

  public render() {
    const simulationPlaceholderClass = "simulation-placeholder " + (this.props.dance ? this.props.dance : "");
    return (
      <div className="simulation-container">
        <div className={simulationPlaceholderClass} />
      </div>
    );
  }
}
