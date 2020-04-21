import { EdgeModes } from '../../../common/Joiner';
export class EdgePointStyle {
    constructor(radius = null, strokeWidth = null, strokeColor = null, fillColor = null) {
        this.radius = null;
        this.strokeWidth = null;
        this.strokeColor = null;
        this.fillColor = null;
        this.radius = radius;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.fillColor = fillColor;
    }
}
export class EdgeHeadStyle {
    constructor(width, height, fill, stroke) {
        this.width = width;
        this.height = height;
        this.fill = fill;
        this.stroke = stroke;
    }
    clone() { return new EdgeHeadStyle(this.width, this.height, this.fill, this.stroke); }
}
export class EdgeStyle {
    constructor(style = EdgeModes.angular23Auto, width = 2, color = '#ffffff', edgePointStyle, edgeHeadStyle) {
        this.style = null;
        this.width = null;
        this.color = null;
        this.edgePointStyle = edgePointStyle;
        this.edgeHeadStyle = edgeHeadStyle;
        this.style = style;
        this.width = width;
        this.color = color;
    }
    clone() { return new EdgeStyle(this.style, this.width, this.color, this.edgePointStyle, this.edgeHeadStyle); }
}
//# sourceMappingURL=edgeStyle.js.map