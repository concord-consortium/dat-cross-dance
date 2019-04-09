import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { Chart, ChartType } from "./chart";
import { allData } from "../../models/charts/chart-dance-data";
import { ChartDataModel } from "../../models/charts/chart-data";

interface IProps extends IBaseProps {
  parentWidth: number;
  parentHeight: number;
}
interface IState {
  chartType: ChartType;
}

@inject("stores")
@observer
export class ChartDisplay extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { chartType: "bar" };
  }

  public render() {
    const { chartType } = this.state;
    const { parentWidth, parentHeight } = this.props;
    const danceData = ChartDataModel.create({
      name: "Results",
      dataSets: allData()
    });

    return (
      <div className="chart-panel">
        <div className="chart-content-container">
          <Chart title="Chart Test" chartData={danceData} chartType={chartType}
            isPlaying={false} width={parentWidth} height={parentHeight} />
        </div>
      </div>
    );
  }

}
