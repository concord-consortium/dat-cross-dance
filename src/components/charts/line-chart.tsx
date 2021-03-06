import * as React from "react";
import { Scatter, ChartData } from "react-chartjs-2";
import { observer } from "mobx-react";
import { ChartDataModelType } from "../../models/charts/chart-data";
import { ChartOptions } from "chart.js";
import { ChartColors } from "../../models/charts/chart-data-set";
import { hexToRGBValue } from "../../utilities/color-utils";
import { LineChartControls } from "./line-chart-controls";
import { BaseComponent } from "../base";

interface ILineProps {
  chartData: ChartDataModelType;
  width?: number;
  height?: number;
  isPlaying: boolean;
}

interface ILineState { }

const defaultOptions: ChartOptions = {
  animation: {
    duration: 0
  },
  title: {
    display: true,
    text: "Data",
    fontSize: 22
  },
  legend: {
    display: true,
    position: "top",
    labels: {
      usePointStyle: true,
      fontSize: 11
    }
  },
  maintainAspectRatio: false,
  scales: {
    display: false,
    yAxes: [{
      ticks: {
        min: 0,
        max: 100
      }
    }],
    xAxes: [{
      display: false,
      ticks: {
        min: 0,
        max: 20
      }
    }]
  },
  elements: { point: { radius: 0 } },
  showLines: true
};

const lineDatasetDefaults: ChartData<any> = {
  label: "",
  fill: false,
  lineTension: 0.1,
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBorderWidth: 2,
  pointRadius: 4,
  pointHitRadius: 10,
  data: [0],
  backgroundColor: ChartColors.map(c => hexToRGBValue(c.hex, 0.4)),
  pointBackgroundColor: ChartColors.map(c => hexToRGBValue(c.hex, 0.4)),
  borderColor: ChartColors.map(c => hexToRGBValue(c.hex, 1.0)),
  pointBorderColor: ChartColors.map(c => hexToRGBValue(c.hex, 1.0)),
  pointHoverBackgroundColor: ChartColors.map(c => hexToRGBValue(c.hex, 1.0)),
  pointHoverBorderColor: ChartColors.map(c => hexToRGBValue(c.hex, 1.0))
};

const lineData = (chartData: ChartDataModelType) => {
  const lineDatasets = [];
  for (const d of chartData.dataSets) {
    const dset = Object.assign({}, lineDatasetDefaults, {
      label: d.name,
      data: d.timeSeriesXY
    });
    if (d.color) {
      // backgroundColor is the color under the line, if we decide to fill that area
      dset.backgroundColor = hexToRGBValue(d.color, 0.4);
      // borderColor is the color of the line
      dset.borderColor = hexToRGBValue(d.color, 1);
      dset.pointBorderColor = hexToRGBValue(d.color, 1);
      dset.pointBackgroundColor = hexToRGBValue(d.color, 0.4);
      dset.pointHoverBackgroundColor = hexToRGBValue(d.color, 1);
      dset.pointHoverBorderColor = hexToRGBValue(d.color, 1);
    }
    if (d.pointColors.length > 0) {
      // If we have specified point colors, use those first,
      // then if we run out of colors we fall back to the defaults
      const colors = d.pointColors.concat(ChartColors.map(c => c.hex));
      dset.pointBackgroundColor = colors.map(c => hexToRGBValue(c, 0.4));
      dset.pointBorderColor = colors.map(c => hexToRGBValue(c, 1.0));
      dset.pointHoverBackgroundColor = colors.map(c => hexToRGBValue(c, 1.0));
      dset.pointHoverBorderColor = colors.map(c => hexToRGBValue(c, 1.0));
    }
    if (d.fixedLabelRotation) {
      dset.minRotation = d.fixedLabelRotation;
      dset.maxRotation = d.fixedLabelRotation;
    }
    lineDatasets.push(dset);
  }

  const linePlotData = {
    labels: chartData.dataLabels,
    datasets: lineDatasets
  };

  return linePlotData;
};

@observer
export class LineChart extends BaseComponent<ILineProps, ILineState> {
  constructor(props: ILineProps) {
    super(props);
  }

  public render() {
    const { chartData, width, height, isPlaying } = this.props;
    const chartDisplay = lineData(chartData);
    const graphs: JSX.Element[] = [];
    const minMaxValues = chartData.minMaxAll;
    const options: ChartOptions = Object.assign({}, defaultOptions, {
      title: {
        text: chartData.name
      },
      scales: {
        display: true,
        yAxes: [{
          ticks: {
            min: minMaxValues.minA2,
            max: minMaxValues.maxA2
          },
          scaleLabel: {
            display: true,
            fontSize: 12,
            labelString: chartData.a2AxisLabel
          }
        }],
        xAxes: [{
          display: true,
          ticks: {
            min: minMaxValues.minA1,
            max: minMaxValues.maxA1,
            minRotation: chartData.dataLabelRotation,
            maxRotation: chartData.dataLabelRotation
          },
          scaleLabel: {
            display: true,
            fontSize: 12,
            labelString: chartData.a1AxisLabel
          }
        }]
      }
    });
    const w = width ? width : 400;
    const h = height ? height : 400;
    graphs.push(
      <Scatter
        key={3}
        data={chartDisplay}
        options={options}
        height={h}
        width={w}
        redraw={true}
      />
    );

    return (
      <div className="line-chart-container">
        <div className="line-chart-container" data-test="line-chart">
          {graphs}
        </div>
        <LineChartControls chartData={chartData} isPlaying={isPlaying} />
      </div>
    );
  }
}

export default LineChart;
