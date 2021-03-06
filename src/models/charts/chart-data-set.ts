import { types, Instance } from "mobx-state-tree";
import * as colors from "../../components/colors.scss";

export interface Color {
  name: string;
  hex: string;
}

interface XYPoint {
  x: number;
  y: number;
}

export const ChartColors: Color[] = [
  // bars
  { name: "blue", hex: colors.chartDataColor1},
  { name: "orange", hex: colors.chartDataColor2},
  { name: "purple", hex: colors.chartDataColor3},
  { name: "green", hex: colors.chartDataColor4},
  { name: "sage", hex: colors.chartDataColor5},
  { name: "rust", hex: colors.chartDataColor6},
  { name: "cloud", hex: colors.chartDataColor7},
  { name: "gold", hex: colors.chartDataColor8},
  { name: "terra", hex: colors.chartDataColor9},
  { name: "sky", hex: colors.chartDataColor10},

  // backgrounds
  { name: "sage", hex: colors.chartColor5},
  { name: "rust", hex: colors.chartColor6},
  { name: "cloud", hex: colors.chartColor7},
  { name: "gold", hex: colors.chartColor8},
  { name: "terra", hex: colors.chartColor9},
  { name: "sky", hex: colors.chartColor10}
];

function timeSeriesSort(a: XYPoint, b: XYPoint) {
  if (a.x < b.x) {
    return -1;
  }
  if (a.x > b.x) {
    return 1;
  }
  return 0;
}

const defaultMax = 100;
const defaultMin = 0;

export const DataPoint = types
  .model("DataPoint", {
    label: types.string,
    a1: types.number,
    a2: types.number
  });
export type DataPointType = typeof DataPoint.Type;

export const ChartDataSetModel = types
  .model("ChartDataSet", {
    name: types.string,
    dataPoints: types.array(DataPoint),
    // A single color will apply to a whole dataset (a line on a line graph, or all bars on a bar chart)
    color: types.maybe(types.string),
    // An array will vary each point's color
    // useful for bar charts with different color bars or scatter plots with each point a different color
    pointColors: types.optional(types.array(types.string), []),
    // For bars, can vary opacity of the bar by dataset to show a second dataset with less opacity
    backgroundOpacity: types.maybe(types.number),
    // If maxPoints is 0 we will always work with the entire data set
    maxPoints: types.optional(types.number, -1),
    fixedMinA1: types.maybe(types.number),
    fixedMaxA1: types.maybe(types.number),
    fixedMinA2: types.maybe(types.number),
    fixedMaxA2: types.maybe(types.number),
    // expandOnly is used for y-axis scaling. When requesting min/max point values,
    // if this is set the a2 / y axis max returns the max of the full data set, not just the visiblePoints
    expandOnly: false,
    fixedLabelRotation: types.maybe(types.number),
    dataStartIdx: types.maybe(types.number),
    stack: types.maybe(types.string),
    a1AxisLabel: types.maybe(types.string),
    a2AxisLabel: types.maybe(types.string)
  })
  .views(self => ({
    get visibleDataPoints() {
      if (self.maxPoints && self.maxPoints > 0 && self.dataPoints.length >= self.maxPoints) {
        if (self.dataStartIdx !== undefined && self.dataStartIdx > -1) {
          return self.dataPoints.slice(self.dataStartIdx, self.dataStartIdx + self.maxPoints);
        } else {
          // just get the tail of most recent data
          return self.dataPoints.slice(-self.maxPoints);
        }
      } else {
        // If we don't set a max, don't use filtering
        return self.dataPoints;
      }
    }
  }))
  .views(self => ({
    // labels for a data point - essential for a bar graph, optional for a line
    get dataLabels() {
      return self.visibleDataPoints.map(p => p.label);
    },
    // Axis 1 data, for a line will be point x value, for bar will be quantity
    get dataA1() {
      return self.visibleDataPoints.map(p => p.a1);
    },
    // Axis 2 data for a line will be y value, for a bar will be label
    get dataA2() {
      if (self.visibleDataPoints.length > 0 && self.visibleDataPoints[0].a2) {
        return self.visibleDataPoints.map(p => p.a2);
      } else {
        return self.visibleDataPoints.map(p => p.label);
      }
    },
    // Determine minimum and maximum values on each axis
    get maxA1(): number | undefined {
      if (self.fixedMaxA1 !== undefined && self.dataPoints.length <= self.fixedMaxA1) {
        return self.fixedMaxA1;
      } else if (!self.visibleDataPoints || self.visibleDataPoints.length === 0) {
        if (self.maxPoints) {
          return self.maxPoints;
        } else {
          return defaultMax;
        }
      } else if (self.visibleDataPoints && self.visibleDataPoints.length > 0 &&
        self.maxPoints && self.visibleDataPoints.length < self.maxPoints) {
        return self.maxPoints;
      } else {
        return Math.max(...self.visibleDataPoints.map(p => p.a1));
      }
    },
    get maxA2(): number | undefined {
      if (self.fixedMaxA2 !== undefined && !self.expandOnly) {
        return self.fixedMaxA2;
      } else if (!self.visibleDataPoints || self.visibleDataPoints.length === 0) {
        return defaultMax;
      } else if (self.expandOnly) {
        // always return max from all points so y axis only scales up, never down
        if (self.fixedMaxA2) {
          // use fixedMax as a minimum value for max
          const dataMax = Math.max(...self.dataPoints.map(p => p.a2));
          return self.fixedMaxA2 > dataMax ? self.fixedMaxA2 : dataMax;
        } else {
          return Math.max(...self.dataPoints.map(p => p.a2));
        }
      } else {
        // only return max of visible subset of data
        return Math.max(...self.visibleDataPoints.map(p => p.a2));
      }
    },
    get minA1(): number | undefined {
      if (self.fixedMinA1 !== undefined) {
        return self.fixedMinA1;
      } else if (!self.visibleDataPoints || self.visibleDataPoints.length === 0) {
        return defaultMin;
      } else {
        return Math.min(...self.visibleDataPoints.map(p => p.a1));
      }
    },
    get minA2(): number | undefined {
      if (self.fixedMinA2 !== undefined) {
        return self.fixedMinA2;
      } else if (!self.visibleDataPoints || self.visibleDataPoints.length === 0) {
        return defaultMin;
      } else {
        return Math.min(...self.visibleDataPoints.map(p => p.a2));
      }
    },
    // Lines and scatter plots require X and Y coordinates
    get dataAsXY() {
      return self.visibleDataPoints.map(d => ({x: d.a1, y: d.a2}));
    },
    // Sort lines in increasing order of X for time-based plots
    get timeSeriesXY() {
      const xyData = self.visibleDataPoints.map(d => ({ x: d.a1, y: d.a2 }));
      xyData.sort(timeSeriesSort);
      return xyData;
    }
  }))
  .extend(self => {
    // actions
    // fetching a subset of points is designed for scrubbing back and forth along a large set of data
    // starting from a specified index. Set to -1 to remove the filter.
    function subsetPoints(idx: number) {
      self.dataStartIdx = idx;
    }

    function addDataPoint(a1: number, a2: number, label: string) {
      self.dataPoints.push({ a1, a2, label });
    }

    function updateDataPoint(pointIdx: number, newValA1: number, newValA2: number) {
      if (self.dataPoints[pointIdx]) {
        self.dataPoints[pointIdx].a1 = newValA1;
        self.dataPoints[pointIdx].a2 = newValA2;
      }
    }

    function deleteDataPoint(pointIdx: number) {
      if (self.dataPoints.length > pointIdx) {
        self.dataPoints.splice(pointIdx, 1);
      }
    }

    function changeColor(newColor: string) {
      self.color = newColor;
    }

    function clearDataPoints() {
      self.dataPoints.splice(0, self.dataPoints.length);
    }

    // used to filter data to a fixed number of points, or returns all points if set to -1
    function setMaxDataPoints(maxPoints: number) {
      self.maxPoints = maxPoints;
    }

    return {
      actions: {
        addDataPoint,
        updateDataPoint,
        deleteDataPoint,
        changeColor,
        clearDataPoints,
        subsetPoints,
        setMaxDataPoints
      }
    };
  });

export type ChartDataSetModelType = Instance<typeof ChartDataSetModel>;
