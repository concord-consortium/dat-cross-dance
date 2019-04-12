import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";
import * as ReactTooltip from "react-tooltip";

import "./energy-diagram.sass";

const BAR_HEIGHT = 200;
const MAX_ENERGY = 300;

interface IProps extends IBaseProps {
  energyInput: number;
  currentEnergy: number;
  running: boolean;
  display: boolean;
}
interface IState {
}

export class EnergyDiagram extends BaseComponent<IProps, IState> {
  public componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  public render() {
    const { energyInput, currentEnergy, running, display } = this.props;
    const inputHeight = energyInput / MAX_ENERGY * BAR_HEIGHT;
    // TODO: figure out "hunger"
    // const heightHunger = currentEnergy / MAX_ENERGY * BAR_HEIGHT;
    const heightExpendedEnergy = energyInput > 0 ? (1 - (currentEnergy / energyInput)) * BAR_HEIGHT : 0;
    // console.log(energyInput, currentEnergy, inputHeight, heightHunger, heightExpendedEnergy);

    const inputStyle = { height: inputHeight };
    const currentStyleHunger = { height: heightExpendedEnergy };
    const currentStyleExpended = { height: heightExpendedEnergy };

    const placeholderClass = "energy-diagram-placeholder" + (running ? " running" : "");
    const containerClass = "energy-diagram-container" + (display ? "" : " inactive");
    return (
      <div className={containerClass}>
        <div className="energy-bar-input" data-tip="Calories Consumed" style={inputStyle} />
        <div className="energy-bar-hunger" data-tip="Level of Hunger" style={currentStyleHunger} />
        <div className="energy-bar-expended" data-tip="Energy Used" style={currentStyleExpended} />
        <div className={placeholderClass} />
        <ReactTooltip delayHide={1000} delayShow={0} />
      </div>
    );
  }

}
