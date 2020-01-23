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
export class EdgeStyle {
  style: EdgeModes = null;
  width: number = null;
  color: string = null;
  edgePointStyle: EdgePointStyle = null;
  constructor(style: EdgeModes = EdgeModes.angular23Auto, width: number = 2, color: string = '#ffffff', edgePointStyle: EdgePointStyle) {
    this.edgePointStyle = edgePointStyle;
    this.style = style;
    this.width = width;
    this.color = color; }

  clone(): EdgeStyle { return new EdgeStyle(this.style, this.width, this.color, this.edgePointStyle); }
}
