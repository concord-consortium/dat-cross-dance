import { inject, observer } from "mobx-react";
import * as React from "react";
import { SizeMe } from "react-sizeme";
import { BaseComponent } from "./base";
import { ChartDisplay } from "./charts/chart-display";
import Attribution from "./attribution";

import "./app.sass";
import { DanceSimulation } from "./dance-simulation";
import { EnergyDiagram } from "./energy-diagram";

let DANCE_PROTEIN_INTERVAL: any;
let DANCE_CARB_INTERVAL: any;

const START_PROTEIN_ENERGY = 250;
const START_CARB_ENERGY = 300;
const END_PROTEIN_ENERGY_PERCENT = 0.5;
const END_CARB_ENERGY_PERCENT = 0.75;
const TIMER_DURATION = 15;

interface ISize {     // Used by SizeMe to pass the resized parent details
  size: {             // to its children.
    width?: number;
    height?: number;
  };
}
interface IProps { }
interface IState {
  currentTime: number;
  currentEnergyProtein: number;
  currentEnergyCarb: number;
  runningCarb: boolean;
  runningProtein: boolean;
}

@inject("stores")
@observer
export class AppComponent extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      currentTime: 0,
      currentEnergyProtein: START_PROTEIN_ENERGY,
      currentEnergyCarb: START_CARB_ENERGY,
      runningCarb: false,
      runningProtein: false
    };
  }
  public componentDidMount() {
    // this.runCarbSimulation();
    // this.runProteinSimulation();
  }

  public render() {
    const { currentEnergyCarb, currentEnergyProtein, runningCarb, runningProtein } = this.state;
    return (
      <div className="app-container">
        <div className="controls-and-content-container">
          <div className="main-content">
            <div className="section simulation">
              <DanceSimulation dance={runningCarb ? "carb" : runningProtein ? "protein" : ""} />
              <div className="simulation-controls">
                <div className="run-simulation-button carb" onClick={this.runCarbSimulation}>
                  <div className="simulation-button-text">Carb-rich Meal</div>
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
                  <div>Carb-rich Meal</div>
                  <EnergyDiagram energyInput={300} currentEnergy={currentEnergyCarb}
                    running={runningCarb} />
                </div>
                <div className="energy-diagram protein">
                  <div>Protein-rich Meal</div>
                  <EnergyDiagram energyInput={250} currentEnergy={currentEnergyProtein}
                    running={runningProtein} />
                </div>
              </div>
              <div className="subsection chart">
                <SizeMe monitorHeight={true}>
                  {({ size }: ISize) =>
                    <ChartDisplay parentWidth={size.width ? size.width : 0}
                      parentHeight={size.height ? size.height : 1} />
                  }
                </SizeMe>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  private runCarbSimulation = () => {
    const { runningCarb, runningProtein } = this.state;
    let nextTime = 0;
    if (!runningCarb && !runningProtein) {
      this.setState({runningCarb: true});
      DANCE_CARB_INTERVAL = setInterval(() => {
        nextTime++;
        const danceComplete = nextTime / TIMER_DURATION;
        const currentEnergy = START_CARB_ENERGY - (START_CARB_ENERGY * END_CARB_ENERGY_PERCENT * danceComplete);
        this.setState({ currentEnergyCarb: currentEnergy });
        // console.log(nextTime, danceComplete, currentEnergy);
        if (nextTime >= TIMER_DURATION) {
          clearInterval(DANCE_CARB_INTERVAL);
          this.setState({ runningCarb: false });
        }
      }, 1000);
    }
  }

  private runProteinSimulation = () => {
    const { runningCarb, runningProtein } = this.state;
    let nextTime = 0;
    if (!runningCarb && !runningProtein) {
      this.setState({runningProtein: true});
      DANCE_PROTEIN_INTERVAL = setInterval(() => {
        nextTime++;
        const danceComplete = nextTime / TIMER_DURATION;
        const currentEnergy =
          START_PROTEIN_ENERGY - (START_PROTEIN_ENERGY * END_PROTEIN_ENERGY_PERCENT * danceComplete);
        this.setState({ currentEnergyProtein: currentEnergy });
        // console.log(nextTime, danceComplete, currentEnergy);
        if (nextTime >= TIMER_DURATION) {
          clearInterval(DANCE_PROTEIN_INTERVAL);
          this.setState({ runningProtein: false });
        }
      }, 1000);
    }
  }
}
