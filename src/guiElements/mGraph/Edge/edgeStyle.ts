import {IEdge, GraphPoint, IVertex, U, EdgeModes, EdgePoint} from '../../../common/Joiner';

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


  static duplicate(json: EdgePointStyle): EdgePointStyle { const ret = new EdgePointStyle(); ret.clone(json); return ret; }
  duplicate(): EdgePointStyle { return EdgePointStyle.duplicate(this); }

  clone(json: EdgePointStyle): void {
    this.radius = json.radius;
    this.strokeWidth = json.strokeWidth;
    this.strokeColor = json.strokeColor;
    this.fillColor = json.fillColor; }
}

export class EdgeHeadStyle {
  width: number;
  height: number;
  fill: string;
  stroke: string;

  constructor (width: number = null, height: number = null, fill: string = null, stroke: string = null) {
    this.width = width;
    this.height = height;
    this.fill = fill;
    this.stroke = stroke; }

    static duplicate(json: EdgeHeadStyle): EdgeHeadStyle { const ret = new EdgeHeadStyle(); ret.clone(json); return ret; }

    duplicate(): EdgeHeadStyle { return EdgeHeadStyle.duplicate(this); }
    clone(json: EdgeHeadStyle): void {
      this.width = json.width;
      this.height = json.height;
      this.fill = json.fill;
      this.stroke = json.stroke; }
}

export class EdgeStyle {
  style: EdgeModes = null;
  width: number = null;
  color: string = null;
  edgePointStyle: EdgePointStyle;
  edgeHeadStyle: EdgeHeadStyle;

  constructor(style: EdgeModes = EdgeModes.angular23Auto, width: number = 2, color: string = '#ffffff',
              edgePointStyle: EdgePointStyle = null, edgeHeadStyle: EdgeHeadStyle = null) {
    this.edgePointStyle = edgePointStyle;
    this.edgeHeadStyle = edgeHeadStyle;
    this.style = style;
    this.width = width;
    this.color = color; }

  static duplicate(json: EdgeStyle): EdgeStyle { const ret = new EdgeStyle(); ret.clone(json); return ret; }
  duplicate(): EdgeStyle { return EdgeStyle.duplicate(this); }

  clone(json: EdgeStyle): void {
    this.style = json.style;
    this.width = json.width;
    this.color = json.color;
    this.edgePointStyle = EdgePointStyle.duplicate(json.edgePointStyle);
    this.edgeHeadStyle = EdgeHeadStyle.duplicate(json.edgeHeadStyle); }

}
