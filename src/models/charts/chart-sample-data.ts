
import { ChartDataSetModel, DataPoint, ChartDataSetModelType, ChartColors } from "./chart-data-set";

function addTestDataPoints() {
  const points = [];
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "alpha" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "bravo" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "charlie" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "delta" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "echo" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "foxtrot" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "golf" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "hotel" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "india" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "juliette" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "kilo" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "lima" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "mike" }));
  points.push (DataPoint.create({ a1: rand(), a2: rand(), label: "november" }));
  return points;
}

export function rngData() {
  const chartDataSets: ChartDataSetModelType[] = [];
  chartDataSets.push(ChartDataSetModel.create({
    name: "Spring",
    dataPoints: addTestDataPoints(),
    color: ChartColors[0].hex,
    // pointColors: ["#00ff00", "#ff0000", "#0000ff"],
    backgroundOpacity: 0.9,
    stack: "Spring"
  }));
  chartDataSets.push(ChartDataSetModel.create({
    name: "Summer",
    dataPoints: addTestDataPoints(),
    color: ChartColors[1].hex,
    // pointColors: ["#00ff00", "#ff0000", "#0000ff"],
    backgroundOpacity: 0.3,
    stack: "Summer"
  }));
  return chartDataSets;
}

const rand = () => {
  return Math.round(Math.random() * 100);
};
