import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { Chart, ChartType } from "./chart";
import { rngData } from "../../models/charts/chart-sample-data";
// import { dataByFlow, dataByFlowUpToYear, SeasonData, dataByFlowByYearPadded } from "../../data/dam-data-utility";
import {
  DataPointType,
  DataPoint,
  ChartDataSetModelType,
  ChartColors,
  ChartDataSetModel
} from "../../models/charts/chart-data-set";
import { ChartDataModelType, ChartDataModel } from "../../models/charts/chart-data";

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
    // const { riverData } = this.stores;
    // const currentData = chartType === "bar" ?
    // dataByFlowByYearPadded(riverData.flowPercentage, riverData.currentYear) :
    // dataByFlowUpToYear(riverData.flowPercentage, riverData.currentYear);
    // const charts = this.buildAllCharts(currentData);

    const chartTypeOption = (chartDisplayType: string) => {
      const optionId = "chartDisplayType" + chartDisplayType;
      const optionStyle =
        chartType === chartDisplayType ?
          "chart-display-style selected" : "chart-display-style";
      const labelStyle = "label-display-style " + chartDisplayType;
      return <div className={optionStyle}>
        <label htmlFor={optionId} className={labelStyle}>&nbsp;</label>
        <input type="radio" id={optionId} name="chartDisplayType" value={chartDisplayType}
          checked={chartType === chartDisplayType} onChange={this.handleChangeSelection} />
      </div>;
    };
    const randomData = ChartDataModel.create({
      name: "Results",
      dataSets: rngData()
    });

    return (
      <div className="chart-panel">
        <div className="chart-options">
          {chartTypeOption("line")}
          {chartTypeOption("bar")}
        </div>
        <div className="chart-content-container">
          <Chart title="Chart Test" chartData={randomData} chartType={chartType}
            isPlaying={false} width={parentWidth} height={parentHeight} />
        </div>
      </div>
    );
  }

  private handleChangeSelection = (e: any) => {
    const selectedValue = e.currentTarget.value ? e.currentTarget.value : "bar";
    if (selectedValue !== this.state.chartType) {
      this.setState({ chartType:  selectedValue });
    }
  }

  // private buildChart = (sourceData: SeasonData[], season: string, chartType: string) => {
  //   const points: DataPointType[] = [];
  //   sourceData.forEach((d) => {
  //     if (d.Season === season) {
  //       const dataToChart =
  //         chartType === "lake" ? d.EndSeasonSurfaceArea :
  //         chartType === "corna" ? d.CornYieldAgriburg : d.CornYieldFarmville;
  //       const data = dataToChart ? dataToChart : 0;
  //       points.push(DataPoint.create({ a1: d.Year, a2: data, label: d.Year.toString() }));
  //     }
  //   });
  //   return points;
  // }

  // private buildAllCharts = (sourceData: SeasonData[]) => {
  //   const { riverData } = this.stores;

  //   const cornAgriburgDataSet = ChartDataSetModel.create({
  //     name: "Agriburg",
  //     dataPoints: this.buildChart(sourceData, "Summer", "corna"),
  //     color: ChartColors[3].hex,
  //     backgroundOpacity: 0.9,
  //     stack: "CornA",
  //     fixedMaxA2: 250,
  //     fixedMinA2: 0,
  //     a1AxisLabel: "Year",
  //     a2AxisLabel: "Corn Yield (bushels/acre)",
  //     maxPoints: 10
  //   });

  //   const cornFarmvilleDataSet = ChartDataSetModel.create({
  //     name: "Farmville",
  //     dataPoints: this.buildChart(sourceData, "Summer", "cornf"),
  //     color: ChartColors[1].hex,
  //     backgroundOpacity: 0.9,
  //     stack: "CornF",
  //     fixedMaxA2: 250,
  //     fixedMinA2: 0,
  //     a1AxisLabel: "Year",
  //     a2AxisLabel: "Corn Yield (bushels/acre)",
  //     maxPoints: 10
  //   });

  //   const lakeSurfaceAreaDataSet = ChartDataSetModel.create({
  //     name: "Lake Surface Area",
  //     dataPoints: this.buildChart(sourceData, "Summer", "lake"),
  //     color: ChartColors[0].hex,
  //     backgroundOpacity: 0.9,
  //     stack: "Lake",
  //     fixedMaxA2: 90000,
  //     fixedMinA2: 0,
  //     a1AxisLabel: "Year",
  //     a2AxisLabel: "Surface Area (acre)",
  //     maxPoints: 10
  //   });

  //   const chartDataSets: ChartDataSetModelType[] = [];

  //   switch (riverData.dataView) {
  //     case "corn":
  //       chartDataSets.push(cornFarmvilleDataSet);
  //       chartDataSets.push(cornAgriburgDataSet);
  //       break;
  //     case "lake":
  //       chartDataSets.push(lakeSurfaceAreaDataSet);
  //       break;
  //     default:
  //       chartDataSets.push(lakeSurfaceAreaDataSet);
  //   }

  //   const allChartData: ChartDataModelType = ChartDataModel.create({
  //     name: "Results",
  //     dataSets: chartDataSets
  //   });

  //   return allChartData;
  // }
}
