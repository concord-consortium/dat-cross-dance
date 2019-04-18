import { inject, observer } from "mobx-react";
import * as React from "react";
import { SizeMe } from "react-sizeme";
import { BaseComponent } from "./base";
import { ChartDisplay } from "./charts/chart-display";
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
      runningCarb,
      runningProtein,
      hasRunCarbSimulation,
      hasRunProteinSimulation } = this.state;
    return (
      <div className="app-container">
        <div className="controls-and-content-container">
          <div className="main-content">
            <div className="section simulation">
              <DanceSimulation dance={runningCarb ? "carb" : runningProtein ? "protein" : ""} />
              <div className="simulation-controls">
                <div className="run-simulation-button carb" onClick={this.runCarbSimulation}>
                  <div className="simulation-button-text">Carbohydrate-rich Meal</div>
                  <div className="simulation-button-icon carb" />
                  </div>
                <div className="run-simulation-button protein" onClick={this.runProteinSimulation}>
                  <div className="simulation-button-text">Protein-rich Meal</div>
                  <div className="simulation-button-icon protein" />
                </div>
              </div>
              <Attribution />
            </div>
            <div className="section chart-table">
              <div className="subsection diagram">
                <div className="energy-diagram carb">
                  <div>Carbohydrate-rich Meal</div>
                  <EnergyDiagram energyInput={inputEnergyCarb} currentEnergy={currentEnergyCarb}
                    running={runningCarb} display={runningCarb || hasRunCarbSimulation} />
                </div>
                <div className="energy-diagram protein">
                  <div>Protein-rich Meal</div>
                  <EnergyDiagram energyInput={inputEnergyProtein} currentEnergy={currentEnergyProtein}
                    running={runningProtein} display={runningProtein || hasRunProteinSimulation}/>
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
    if (!runningCarb && !runningProtein) {
      this.setState({
        runningCarb: true,
        inputEnergyCarb: START_CARB_ENERGY,
        currentEnergyCarb: START_CARB_ENERGY
      });
      this.runSimulation((danceComplete: number) => {
        const currentEnergy =
        START_CARB_ENERGY - (START_CARB_ENERGY * END_CARB_ENERGY_PERCENT * danceComplete);
        this.setState({ currentEnergyCarb: currentEnergy });
      }, () => {
        this.setState({ runningCarb: false, hasRunCarbSimulation: true });
      });
    }
  }

  private runProteinSimulation = () => {
    const { runningCarb, runningProtein, hasRunCarbSimulation } = this.state;
    if (!runningCarb && !runningProtein && hasRunCarbSimulation) {
      this.setState({
        runningProtein: true,
        inputEnergyProtein: START_PROTEIN_ENERGY,
        currentEnergyProtein: START_PROTEIN_ENERGY
      });
      this.runSimulation((danceComplete: number) => {
        const currentEnergy =
        START_PROTEIN_ENERGY - (START_PROTEIN_ENERGY * END_PROTEIN_ENERGY_PERCENT * danceComplete);
        this.setState({ currentEnergyProtein: currentEnergy });
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
