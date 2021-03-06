import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";
import * as ReactTooltip from "react-tooltip";

import "./energy-diagram.sass";

const MAX_BAR_HEIGHT = 200;
const MAX_ENERGY = 300;

interface IProps extends IBaseProps {
  energyInput: number;
  currentEnergy: number;
  currentHunger: number;
  finalEnergyUsePercent: number;
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
    const { energyInput, currentEnergy, currentHunger, running, display, finalEnergyUsePercent } = this.props;
    const inputHeight = energyInput / MAX_ENERGY * MAX_BAR_HEIGHT;
    const maxExpendedEnergyHeight = inputHeight * finalEnergyUsePercent;
    const barHeight = inputHeight;
    // TODO: figure out "hunger"
    const heightHunger = currentHunger > 0 ?  (1 - (currentHunger / energyInput)) * maxExpendedEnergyHeight : 0;
    const heightExpendedEnergy = energyInput > 0 && currentEnergy > 0 ?
      (1 - (currentEnergy / energyInput)) * maxExpendedEnergyHeight : 0;
    // console.log(energyInput, currentEnergy, inputHeight, heightHunger, heightExpendedEnergy);

    const inputStyle = { height: inputHeight };
    const currentStyleHunger = { height: heightHunger };
    const currentStyleExpended = { height: heightExpendedEnergy };

    const placeholderClass = "energy-diagram-placeholder" + (running ? " running" : "");
    const containerClass = "energy-diagram-container" + (display ? "" : " inactive");
    return (
      <div className={containerClass}>
        {energyInput >= 0 && <div className="energy-bar-input" data-tip="Calories Consumed" style={inputStyle} />}
        <div className="energy-bar-hunger" data-tip="Level of Hunger" style={currentStyleHunger} />
        <div className="energy-bar-expended" data-tip="Energy Used" style={currentStyleExpended} />
        <div className={placeholderClass} />
        <ReactTooltip delayHide={1000} delayShow={0} />
      </div>
    );
  }

}
