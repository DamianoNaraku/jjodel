import {IEdge, GraphPoint, IVertex, U, EdgeModes} from '../../../common/Joiner';

export class EdgePointStyle {
  radius: number = null;
  strokeWidth: number = null;
  strokeColor: string = null;
  fillColor: string = null;
  constructor(radius: number = null, strokeWidth: number = null, strokeColor: string = null, fillColor: string = null) {
    this.radius = radius;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.fillColor = fillColor; }
}
export class EdgeHeadStyle {
  width: number;
  height: number;
  fill: string;
  stroke: string;
  constructor (width: number, height: number, fill: string, stroke: string) {
    this.width = width;
    this.height = height;
    this.fill = fill;
    this.stroke = stroke; }

  clone(): EdgeHeadStyle { return new EdgeHeadStyle(this.width, this.height, this.fill, this.stroke); }
}
export class EdgeStyle {
  style: EdgeModes = null;
  width: number = null;
  color: string = null;
  edgePointStyle: EdgePointStyle;
  edgeHeadStyle: EdgeHeadStyle;

  constructor(style: EdgeModes = EdgeModes.angular23Auto, width: number = 2, color: string = '#ffffff',
              edgePointStyle: EdgePointStyle, edgeHeadStyle: EdgeHeadStyle) {
    this.edgePointStyle = edgePointStyle;
    this.edgeHeadStyle = edgeHeadStyle;
    this.style = style;
    this.width = width;
    this.color = color; }

  clone(): EdgeStyle { return new EdgeStyle(this.style, this.width, this.color, this.edgePointStyle, this.edgeHeadStyle); }
}
