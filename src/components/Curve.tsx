import { useState } from "react";
import { LinePath } from "@visx/shape";
import { scaleLinear, scaleTime } from "@visx/scale";
import { extent, max } from "@visx/vendor/d3-array";
import { withParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { localPoint } from "@visx/event";
import { Tooltip } from "@visx/tooltip";
import { DateValue } from "@visx/mock-data/lib/generators/genDateValue";
import { curveStep } from "@visx/curve";
import { MarkerX, MarkerArrow, MarkerCircle } from "@visx/marker";

/**
 * Props for the Curve component.
 */
interface CurveProps {
  parentWidth: number;
  parentHeight: number;
}

/**
 * Data point representing a date and a numeric value.
 */
interface DataPoint {
  date: Date;
  value: number;
}

/**
 * Data for the tooltip.
 */
interface ToolTipData {
  data: DataPoint;
  left: number;
  top: number;
}

/**
 * Data to be plotted in the curve chart.
 */
const data: DataPoint[] = [
  { date: "2023-07-20T09:29:30.522Z", value: 1427 },
  { date: "2023-07-20T10:29:30.522Z", value: 723 },
  { date: "2023-07-20T11:29:30.522Z", value: 485 },
  { date: "2023-07-20T12:29:30.522Z", value: 2624 },
  { date: "2023-07-20T13:29:30.522Z", value: 817 },
  { date: "2023-07-20T14:29:30.522Z", value: 2285 },
  { date: "2023-07-20T15:29:30.522Z", value: 1179 },
  { date: "2023-07-20T16:29:30.522Z", value: 29 },
  { date: "2023-07-20T17:29:30.522Z", value: 1441 },
  { date: "2023-07-20T18:29:30.522Z", value: 1737 },
  { date: "2023-07-20T19:29:30.522Z", value: 2188 },
  { date: "2023-07-20T20:29:30.522Z", value: 1876 },
  { date: "2023-07-20T21:29:30.522Z", value: 2512 },
  { date: "2023-07-20T22:29:30.522Z", value: 1968 },
  { date: "2023-07-20T23:29:30.522Z", value: 107 },
  { date: "2023-07-21T00:29:30.522Z", value: 2755 },
  { date: "2023-07-21T01:29:30.522Z", value: 1130 },
  { date: "2023-07-21T02:29:30.522Z", value: 2212 },
  { date: "2023-07-21T03:29:30.522Z", value: 1794 },
  { date: "2023-07-21T04:29:30.522Z", value: 2495 },
  { date: "2023-07-21T05:29:30.522Z", value: 1444 },
  { date: "2023-07-21T06:29:30.522Z", value: 1054 },
  { date: "2023-07-21T07:29:30.522Z", value: 1714 },
  { date: "2023-07-21T08:29:30.522Z", value: 779 },
  { date: "2023-07-21T09:29:30.522Z", value: 1332 },
].map((e) => ({
  ...e,
  date: new Date(e.date),
}));

/**
 * Extracts the x-coordinate of a data point.
 * @param d - The data point.
 * @returns The x-coordinate of the data point.
 */
const getX = (d: DateValue) => d.date;

/**
 * Extracts the y-coordinate of a data point.
 * @param d - The data point.
 * @returns The y-coordinate of the data point.
 */
const getY = (d: DateValue) => d.value;

/**
 * Curve component for rendering the line chart.
 * @param props - The Curve component props.
 * @returns The rendered Curve component.
 */
const CurveComponent = (e: unknown) => {
  const [tooltipData, setTooltipData] = useState<ToolTipData | null>(null);
  const width = (e as CurveProps).parentWidth;
  const height = (e as CurveProps).parentHeight;
  const markerStart = "url(#marker-x)";
  const markerEnd = "url(#marker-arrow)";
  const markerMid = "url(#marker-circle)";

  const xScale = scaleTime<number>({
    domain: extent(data, getX) as [Date, Date],
  });

  const yScale = scaleLinear<number>({
    domain: [0, max(data, getY) as number],
  });

  /**
   * Handles mouse enter event on the line path.
   * @param event - The mouse enter event.
   */
  const handleMouseEnter = (
    event: React.MouseEvent<SVGPathElement, MouseEvent>
  ) => {
    const { x, y } = localPoint(event) || { x: 0, y: 0 };
    const xScaleInverse = scaleLinear({
      range: xScale.domain(),
      domain: xScale.range(),
    });
    const mouseXValue = xScaleInverse(x);
    const closestDataPoint = data.reduce((acc, d) => {
      const xValue = getX(d);
      return Math.abs(Number(xValue) - Number(mouseXValue)) <
        Math.abs(Number(getX(acc)) - Number(mouseXValue))
        ? d
        : acc;
    }, data[0]);

    setTooltipData({
      data: closestDataPoint,
      left: x,
      top: y,
    });
  };

  /**
   * Handles mouse leave event on the line path.
   */
  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const offset = {
    x: 48,
    y: 48,
  };

  xScale.range([0, width - offset.x]);
  yScale.range([height - offset.y, 0]);

  return (
    <>
      <svg width={width} height={height}>
        <rect width={width} height={height} fill="#efefef" />
        <Group left={offset.x / 2} top={offset.y / 2}>
          <MarkerX
            id="marker-x"
            stroke="#333"
            size={22}
            strokeWidth={4}
            markerUnits="userSpaceOnUse"
          />
          <MarkerCircle id="marker-circle" fill="#333" size={3} refX={2} />
          <MarkerArrow id="marker-arrow" fill="#333" refX={2} size={6} />
          <LinePath
            data={data}
            curve={curveStep}
            height={height}
            x={(d) => xScale(getX(d)) ?? 0}
            y={(d) => yScale(getY(d)) ?? 0}
            stroke="#333"
            shapeRendering="geometricPrecision"
            strokeWidth={2}
            markerStart={markerStart}
            markerMid={markerMid}
            markerEnd={markerEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <Group>
            {data.map((point, index) => (
              <circle
                key={`point-${index}`}
                r={3}
                cx={xScale(getX(point))}
                cy={yScale(getY(point))}
              />
            ))}
          </Group>
        </Group>
      </svg>
      <Tooltip
        top={tooltipData?.top}
        left={tooltipData?.left}
        style={{ pointerEvents: "none", position: "absolute" }}
      >
        {JSON.stringify(tooltipData?.data, null, 2)}
      </Tooltip>
    </>
  );
};

export const Curve = withParentSize(CurveComponent);
