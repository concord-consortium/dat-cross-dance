import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./energy-diagram.sass";

interface IProps extends IBaseProps {
}
interface IState {
}

export class EnergyDiagram extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="energy-diagram-container">
        <div className="energy-bar-input" />
        <div className="energy-bar-output" />
        <div className="energy-diagram-placeholder" />
      </div>
    );
  }

}
