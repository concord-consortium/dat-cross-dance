import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./dance-simulation.sass";

interface IProps extends IBaseProps {
}
interface IState {
}

export class DanceSimulation extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="simulation-container">
        <div className="simulation-placeholder" />
      </div>
    );
  }
}
