import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./energy-diagram.sass";

const BAR_HEIGHT = 200;
const MAX_ENERGY = 300;

interface IProps extends IBaseProps {
  energyInput: number;
  currentEnergy: number;
  running: boolean;
}
interface IState {
}

export class EnergyDiagram extends BaseComponent<IProps, IState> {

  public render() {
    const { energyInput, currentEnergy, running } = this.props;
    const inputHeight = energyInput / MAX_ENERGY * BAR_HEIGHT;
    const currentHeight = currentEnergy / MAX_ENERGY * BAR_HEIGHT;
    const inputStyle = { height: inputHeight };
    const currentStyle = { height: currentHeight };
    const placeholderClass = "energy-diagram-placeholder" + (running ? " running" : "");
    return (
      <div className="energy-diagram-container">
        <div className="energy-bar-input" style={inputStyle} />
        <div className="energy-bar-output" style={currentStyle} />
        <div className={placeholderClass} />
      </div>
    );
  }

}
