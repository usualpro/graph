import { LinePath } from "@visx/shape";
import { scaleLinear, scaleTime } from "@visx/scale";
import { extent, max } from "@visx/vendor/d3-array";
import { withScreenSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { EditableAnnotation, Label, Connector } from "@visx/annotation";
import { DateValue } from "@visx/mock-data/lib/generators/genDateValue";
import {
  curveStepBefore,
  curveStep,
  curveStepAfter,
  curveBasis,
} from "@visx/curve";
import { MarkerX, MarkerArrow, MarkerCircle } from "@visx/marker";

interface CurveProps {
  screenWidth: number;
}
const getX = (d: DateValue) => d.date;

const getY = (d: DateValue) => d.value;

// Define your data
const data = [
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

{
  /*<EditableAnnotation
        key={j}
        x={xScale(getX(d))}
        y={yScale(getY(d))}
        width={width}
        height={200}
        canEditLabel={true}
        canEditSubject={false}
        dx={50} // x offset of label from subject
        dy={50} // y offset of label from subjec
      >
        <Connector />
        <Label
          backgroundFill="white"
          showAnchorLine={true}
          anchorLineStroke={"red"}
          fontColor={"red"}
          subtitle={"subtitle"}
          title={"title"}
          width={100}
        />
    </EditableAnnotation>*/
}

const C = (e: unknown) => {
  const width = (e as CurveProps).screenWidth;
  const height = 250;

  const markerStart = "url(#marker-x)";
  const markerEnd = "url(#marker-arrow)";
  const markerMid = "url(#marker-circle)";

  // Define the scales for your x and y axes
  const xScale = scaleTime<number>({
    domain: extent(data, getX) as [Date, Date],
  });

  const yScale = scaleLinear<number>({
    domain: [0, max(data, getY) as number],
  });

  xScale.range([0, width - 50]);
  yScale.range([200, 0]);

  const Points = () =>
    data.map((d, j) =>
      j < data.length - 1 && j > 0 ? (
        <circle
          key={j}
          r={3}
          cx={xScale(getX(d))}
          cy={yScale(getY(d))}
          stroke="rgba(33,33,33,0.5)"
          strokeWidth={2}
          fill="transparent"
        />
      ) : null
    );

  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="#efefef" rx={14} ry={14} />
      <Group left={13} top={13}>
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
          x={(d) => xScale(getX(d)) ?? 0}
          y={(d) => yScale(getY(d)) ?? 0}
          stroke="#333"
          shapeRendering="geometricPrecision"
          strokeWidth={2}
          markerMid={markerMid}
          markerStart={markerStart}
          markerEnd={markerEnd}
        />
        {/*<Points />*/}
      </Group>
    </svg>
  );
};

export const Curve = withScreenSize(C);
