import { ChartDataSetModel, DataPoint, ChartDataSetModelType, ChartColors } from "./chart-data-set";

function addCarbPoints() {
  const points = [];
  const startValue = 300;
  const endValue = startValue * 0.25;
  points.push (DataPoint.create({ a1: startValue, a2: startValue, label: "Start" }));
  points.push (DataPoint.create({ a1: endValue, a2: endValue, label: "End" }));
  return points;
}
function addProteinPoints() {
  const points = [];
  const startValue = 250;
  const endValue = startValue * 0.5;
  points.push (DataPoint.create({ a1: 250, a2: 250, label: "Start" }));
  points.push (DataPoint.create({ a1: 125, a2: 125, label: "End" }));
  return points;
}

export function allData() {
  const chartDataSets: ChartDataSetModelType[] = [];
  chartDataSets.push(ChartDataSetModel.create({
    name: "Carb",
    dataPoints: addCarbPoints(),
    color: ChartColors[1].hex,
    // pointColors: ["#00ff00", "#ff0000", "#0000ff"],
    backgroundOpacity: 0.9,
    stack: "Carb"
  }));
  chartDataSets.push(ChartDataSetModel.create({
    name: "Protein",
    dataPoints: addProteinPoints(),
    color: ChartColors[0].hex,
    // pointColors: ["#00ff00", "#ff0000", "#0000ff"],
    backgroundOpacity: 0.9,
    stack: "Protein"
  }));
  return chartDataSets;
}
