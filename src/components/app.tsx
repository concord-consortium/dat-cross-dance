import { inject, observer } from "mobx-react";
import * as React from "react";
import { SizeMe } from "react-sizeme";
import { BaseComponent } from "./base";
import Attribution from "./attribution";

import "./app.sass";
import { DanceSimulation } from "./dance-simulation";
import { EnergyDiagram } from "./energy-diagram";

let DANCE_INTERVAL: any;

const START_PROTEIN_ENERGY = 250;
const START_CARB_ENERGY = 300;
const END_PROTEIN_ENERGY_PERCENT = 0.5;
const END_CARB_ENERGY_PERCENT = 0.75;
const TIMER_DURATION = 150;

interface ISize {     // Used by SizeMe to pass the resized parent details
  size: {             // to its children.
    width?: number;
    height?: number;
  };
}
interface IProps { }
interface IState {
  currentTime: number;
  inputEnergyProtein: number;
  inputEnergyCarb: number;
  currentEnergyProtein: number;
  currentEnergyCarb: number;
  currentHungerProtein: number;
  currentHungerCarb: number;
  runningCarb: boolean;
  runningProtein: boolean;
  hasRunCarbSimulation: boolean;
  hasRunProteinSimulation: boolean;
}

@inject("stores")
@observer
export class AppComponent extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      currentTime: 0,
      inputEnergyProtein: 0,
      inputEnergyCarb: 0,
      currentEnergyProtein: 0,
      currentEnergyCarb: 0,
      currentHungerProtein: 0,
      currentHungerCarb: 0,
      runningCarb: false,
      runningProtein: false,
      hasRunCarbSimulation: false,
      hasRunProteinSimulation: false
    };
  }

  public render() {
    const {
      inputEnergyCarb,
      inputEnergyProtein,
      currentEnergyCarb,
      currentEnergyProtein,
      currentHungerCarb,
      currentHungerProtein,
      runningCarb,
      runningProtein,
      hasRunCarbSimulation,
      hasRunProteinSimulation } = this.state;
    const carbButtonClass = "run-simulation-button carb" +
      (runningCarb ? " running" : runningProtein ? " inactive" : "");
    const proteinButtonClass = "run-simulation-button protein" +
      (runningProtein ? " running" : runningCarb ? " inactive" : "");
    return (
      <div className="app-container">
        <div className="controls-and-content-container">
          <div className="main-content">
            <div className="section simulation">
              <DanceSimulation dance={runningCarb ? "carb" : runningProtein ? "protein" : ""} />
              <div className="simulation-controls">
                <div className={proteinButtonClass} onClick={this.runProteinSimulation}>
                  <div className="simulation-button-text">Protein-rich Meal</div>
                  <div className="simulation-button-icon protein" />
                </div>
                <div className={carbButtonClass} onClick={this.runCarbSimulation}>
                  <div className="simulation-button-text">Carbohydrate-rich Meal</div>
                  <div className="simulation-button-icon carb" />
                </div>
              </div>
              <Attribution />
            </div>
            <div className="section chart-table">
              <div className="subsection diagram">
                <div className="energy-diagram protein">
                  <div>Protein-rich Meal</div>
                  <EnergyDiagram energyInput={inputEnergyProtein} currentEnergy={currentEnergyProtein}
                    running={runningProtein} display={runningProtein || hasRunProteinSimulation}
                    currentHunger={currentHungerProtein} finalEnergyUsePercent={END_PROTEIN_ENERGY_PERCENT} />
                </div>
                <div className="energy-diagram carb">
                  <div>Carbohydrate-rich Meal</div>
                  <EnergyDiagram energyInput={inputEnergyCarb} currentEnergy={currentEnergyCarb}
                    running={runningCarb} display={runningCarb || hasRunCarbSimulation}
                    currentHunger={currentHungerCarb} finalEnergyUsePercent={END_CARB_ENERGY_PERCENT} />
                </div>
              </div>
              <div className="energy-diagram-key">
                <div className="key input">
                  <div className="key-color" />
                  <div className="key-text">Calories Consumed</div>
                </div>
                <div className="key output">
                  <div className="key-color" />
                  <div className="key-text">Energy Used</div>
                </div>
                <div className="key hunger">
                  <div className="key-color" />
                  <div className="key-text">Level of Hunger</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private runCarbSimulation = () => {
    const { runningCarb, runningProtein } = this.state;
    // carb energy usage like a log curve
    const energyFunc = (x: number) => (0.83 * Math.log10((10 * x) + 1));
    const hungerFunc = (x: number) => (1 - Math.cos(x));
    const timeMax = Math.PI / 2;
    if (!runningCarb && !runningProtein) {
      this.setState({
        runningCarb: true,
        inputEnergyCarb: START_CARB_ENERGY,
        currentEnergyCarb: START_CARB_ENERGY
      });
      this.runSimulation((danceComplete: number) => {
        const currentEnergy =
          START_CARB_ENERGY - (START_CARB_ENERGY * energyFunc(danceComplete * timeMax));
        const currentHunger = START_CARB_ENERGY - (START_CARB_ENERGY * hungerFunc(danceComplete * timeMax));
        this.setState({ currentEnergyCarb: currentEnergy, currentHungerCarb: currentHunger });
      }, () => {
        this.setState({ runningCarb: false, hasRunCarbSimulation: true });
      });
    }
  }

  private runProteinSimulation = () => {
    const { runningCarb, runningProtein, hasRunCarbSimulation } = this.state;
    // protein energy use like a sine curve from 0 to pi/2
    const energyFunc = (x: number) => (Math.sin(x));
    const hungerFunc = (x: number) => (1 - Math.cos(4 * x / 5));
    const timeMax = Math.PI / 2;
    if (!runningCarb && !runningProtein) {
      this.setState({
        runningProtein: true,
        inputEnergyProtein: START_PROTEIN_ENERGY,
        currentEnergyProtein: START_PROTEIN_ENERGY
      });
      this.runSimulation((danceComplete: number) => {
        const currentEnergy =
          START_PROTEIN_ENERGY - (START_PROTEIN_ENERGY * energyFunc(danceComplete * timeMax));
        const currentHunger = START_PROTEIN_ENERGY - (START_PROTEIN_ENERGY * hungerFunc(danceComplete * timeMax));
        this.setState({ currentEnergyProtein: currentEnergy, currentHungerProtein: currentHunger });
      }, () => {
        this.setState({ runningProtein: false, hasRunProteinSimulation: true });
      });
    }
  }

  private runSimulation = (updateSimulation: any, finishSimulation: any) => {
    let nextTime = 0;
    DANCE_INTERVAL = setInterval(() => {
      const danceComplete = nextTime / TIMER_DURATION;
      updateSimulation(danceComplete);
      nextTime++;
      if (nextTime >= TIMER_DURATION) {
        clearInterval(DANCE_INTERVAL);
        finishSimulation();
      }
    }, 100);
  }

}
