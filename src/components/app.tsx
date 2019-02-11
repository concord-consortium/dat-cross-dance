import { inject, observer } from "mobx-react";
import * as React from "react";
import { SizeMe } from "react-sizeme";
import { BaseComponent } from "./base";
import { ChartDisplay } from "./charts/chart-display";
import Attribution from "./attribution";

import "./app.sass";
import { DanceSimulation } from "./dance-simulation";
import { EnergyDiagram } from "./energy-diagram";

interface ISize {     // Used by SizeMe to pass the resized parent details
  size: {             // to its children.
    width?: number;
    height?: number;
  };
}
@inject("stores")
@observer
export class AppComponent extends BaseComponent<{}, {}> {

  public render() {
    const { ui, appMode } = this.stores;
    return (
      <div className="app-container">
        <div className="controls-and-content-container">
          <div className="main-content">
            <div className="section simulation">
              <DanceSimulation />
              <Attribution />
            </div>
            <div className="section chart-table">
              <div className="subsection table">
                <EnergyDiagram />
                <EnergyDiagram />
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
}
