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
  simulationRunning: boolean;
  displayText: string;
  displayPlaceholder: string;
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
      hasRunProteinSimulation: false,
      simulationRunning: false,
      displayText: "",
      displayPlaceholder: ""
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
      displayText,
      displayPlaceholder
    } = this.state;
    const carbButtonClass = "run-simulation-button carb" +
      (runningCarb ? " running" : runningProtein ? " inactive" : "");
    const proteinButtonClass = "run-simulation-button protein" +
      (runningProtein ? " running" : runningCarb ? " inactive" : "");

    const startProteinSimulation = () => {
      if (!this.state.simulationRunning) {
        this.setState({displayText: ""});
        if (inputEnergyProtein > 0) {
          // Restarting simulation, set back to 0, remove input bar completely
          this.setState({ inputEnergyProtein: -1, currentEnergyProtein: 0, currentHungerProtein: 0 });
          setTimeout(() => {
            // input bar returns, 0 height
            this.setState({ inputEnergyProtein: 0 });
            setTimeout(() => {
              // input bar will animate to input energy level as part of simulation
              this.runProteinSimulation();
            }, 200);
          }, 200);
        } else {
          this.runProteinSimulation();
        }
      }
    };
    const startCarbSimulation = () => {
      if (!this.state.simulationRunning) {
        this.setState({ displayText: "" });
        if (inputEnergyCarb > 0) {
          // Restarting simulation, set back to 0, remove input bar completely
          this.setState({ inputEnergyCarb: -1, currentEnergyCarb: 0, currentHungerCarb: 0 });
          setTimeout(() => {
            // input bar returns, 0 height
            this.setState({ inputEnergyCarb: 0 });
            setTimeout(() => {
              // input bar will animate to input energy level as part of simulation
              this.runCarbSimulation();
            }, 200);
          }, 200);
        } else {
          this.runCarbSimulation();
        }
      }
    };
    return (
      <div className="app-container">
        <div className="controls-and-content-container">
          <div className="main-content">
            <div className="section simulation">
              <DanceSimulation dance={runningCarb ? "carb" : runningProtein ? "protein" : ""}
                displayText={displayText} displayPlaceholder={displayPlaceholder} />
              <div className="simulation-controls">
                <div className={proteinButtonClass} onClick={startProteinSimulation}>
                  <div className="simulation-button-text">Protein-rich Meal</div>
                  <div className="simulation-button-icon protein" />
                </div>
                <div className={carbButtonClass} onClick={startCarbSimulation}>
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
                    running={runningProtein} display={inputEnergyProtein > 0}
                    currentHunger={currentHungerProtein} finalEnergyUsePercent={END_PROTEIN_ENERGY_PERCENT} />
                </div>
                <div className="energy-diagram carb">
                  <div>Carbohydrate-rich Meal</div>
                  <EnergyDiagram energyInput={inputEnergyCarb} currentEnergy={currentEnergyCarb}
                    running={runningCarb} display={inputEnergyCarb > 0}
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
                  <div className="key-text">% of Energy Used</div>
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
    const { simulationRunning } = this.state;
    // carb energy usage like a log curve
    const energyFunc = (x: number) => (0.83 * Math.log10((9 * x) + 1));
    const hungerFunc = (x: number) => (1 - Math.cos(x));
    const timeMax = Math.PI / 2;
    if (!simulationRunning) {
      this.setState({
        inputEnergyCarb: START_CARB_ENERGY,
        simulationRunning: true,
        displayText: "",
        displayPlaceholder: ""
      });
      this.runSimulation(
        () => {
          // Start simulation callback
          this.setState({
            runningCarb: true,
            currentEnergyCarb: START_CARB_ENERGY
          });
        },
        (danceComplete: number) => {
          // Update simulation callback
          const currentEnergy =
          START_CARB_ENERGY - (START_CARB_ENERGY * energyFunc(danceComplete * timeMax));
          const currentHunger = START_CARB_ENERGY - (START_CARB_ENERGY * hungerFunc(danceComplete * timeMax));
          this.setState({
            currentEnergyCarb: currentEnergy,
            currentHungerCarb: currentHunger
          });
        },
        () => {
          // finish simulation callback
          this.setState({
            runningCarb: false,
            hasRunCarbSimulation: true,
            simulationRunning: false,
            displayText: "Anika is hungry.",
            displayPlaceholder: "hungry"
          });
      });
    }
  }

  private runProteinSimulation = () => {
    const { simulationRunning } = this.state;
    // protein energy use like a sine curve from 0 to pi/2
    const energyFunc = (x: number) => (Math.sin(x));
    const hungerFunc = (x: number) => (1 - Math.cos(4 * x / 5));
    const timeMax = Math.PI / 2;
    if (!simulationRunning) {
      // Set initial energy first, wait two seconds, then start animation
      this.setState({
        inputEnergyProtein: START_PROTEIN_ENERGY,
        simulationRunning: true,
        displayText: "",
        displayPlaceholder: ""
      });
      this.runSimulation(
        () => {
          // Start simulation callback
          this.setState({
            runningProtein: true,
            currentEnergyProtein: START_PROTEIN_ENERGY
          });
        },
        (danceComplete: number) => {
          // Update simulation callback

          const currentEnergy =
            START_PROTEIN_ENERGY - (START_PROTEIN_ENERGY * energyFunc(danceComplete * timeMax));
          const currentHunger = START_PROTEIN_ENERGY - (START_PROTEIN_ENERGY * hungerFunc(danceComplete * timeMax));
          this.setState({
            currentEnergyProtein: currentEnergy,
            currentHungerProtein: currentHunger,
            currentTime: danceComplete
          });
        },
        () => {
          // Finish simulation callback
          this.setState({
            runningProtein: false,
            hasRunProteinSimulation: true,
            simulationRunning: false,
            displayText: "Anika is tired.",
            displayPlaceholder: "tired"
          });
        }
      );
    }
  }

  private runSimulation = (startSimulation: any, updateSimulation: any, finishSimulation: any) => {
    let nextTime = -10;
    setTimeout(() => {
      startSimulation();
      DANCE_INTERVAL = setInterval(() => {
        const danceComplete = nextTime / TIMER_DURATION;
        if (nextTime >= 0) {
          updateSimulation(danceComplete);
        }
        nextTime++;
        if (nextTime >= TIMER_DURATION) {
          clearInterval(DANCE_INTERVAL);
          finishSimulation();
        }
      }, 100);
    }, 2000);
  }
}
