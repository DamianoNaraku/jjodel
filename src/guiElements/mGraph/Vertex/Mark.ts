import {Dictionary, GraphSize, ISize, ModelPiece, Size, U} from '../../../common/Joiner';
export class MarkStyle {
  color: string = 'red';
  radiusX: number = 10;
  radiusY: number = 10;
  width: number = 5;
  backColor: string = 'none';
  extraOffset: ISize = null;
  constructor (color: string = null, radiusX: number = 10, radiusY: number = 10,
              width: number = 5, backColor: string = 'transparent', extraOffset: ISize = null) {
    // if (color === null) { color = 'yellow'; }
    if (radiusX === null) { radiusX = 10; }
    if (radiusY === null) { radiusY = 10; }
    if (backColor === null) { backColor = 'transparent'; }
    if (width === null) { width = 5; }
    if (!extraOffset) { const same = -width; extraOffset = new GraphSize(same, same, same, same); }
    this.color = color;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.width = width;
    this.backColor = backColor;
    this.extraOffset = extraOffset; }
}
export class ColorCycle{
  colors: string[];
  index: number = -1;
  constructor(colors: string[]) { this.colors = colors; }

  get(): string {
    this.incrementIndex(1);
    return this.colors[this.index]; }

  getindex(i: number): string {
    this.index = i % this.colors.length;
    return this.colors[this.index]; }

  private incrementIndex(amount: number = 1): void { this.index = (this.index + amount) % this.colors.length; }

  IUsedThisColor(color: string): void {
    let index = this.colors.indexOf(color)
    if (index >= 0) this.index = index; }
}

export class Mark {
  static colorCycle: ColorCycle = null;
  static maxID: number = 0;
  mp1: ModelPiece;
  mp2: ModelPiece;
  key: string;
  style: MarkStyle;
  html1: Element;
  html2: Element;
  private css1: HTMLStyleElement;
  private css2: HTMLStyleElement;
  private id: number;
  private static markingByKey: Dictionary<string, Mark[]> = {};
  public static removeByKey(key: string): Mark[] {
    let mark: Mark;
    for (mark of Mark.markingByKey[key]) mark.mark(false);
    return Mark.markingByKey[key];
  }

  staticinit(): void {
    Mark.colorCycle = new ColorCycle(['red', 'blue', 'gray', 'green', 'yellow', 'purple', 'orange', 'brown'])
  }
  constructor(mp: ModelPiece, paired: ModelPiece, key: string, color: string = null, radiusX: number = 10, radiusY: number = 10,
              width: number = 5, backColor: string = 'transparent', extraOffset: ISize = null) {
    if (!Mark.colorCycle) this.staticinit();
    this.id = Mark.maxID++;
    this.mp1 = mp;
    this.mp2 = paired;
    this.key = key || U.genID();
    if (!Mark.markingByKey[key]) Mark.markingByKey[key] = [];
    Mark.markingByKey[key].push(this);
    this.style = new MarkStyle(color, radiusX, radiusY, width, backColor, extraOffset);
  }

  isApplied() {
    // return !!mp.Vmarks[this.key];
    return !!this.css1 || !!this.css2; }

  private setHtml(markhtml: Element, mp: ModelPiece, css: HTMLStyleElement, markb: boolean): void {
    if (this.style.color === null) { this.style.color = Mark.colorCycle.get(); }
    let html: HTMLElement = this.mp1.getHtmlOnGraph() as HTMLElement;
    let i: number;
    /*if (this.key === 'refhover') { // crosshair (+), alias (default+link), cell (excel)ù
      const $inputs = $(html).find('input, textarea, select, button');
      let cursor: string = null;
      if (markb) {
        html.style.cursor = cursor = (this.style.color === 'red' ? 'no-drop' : 'crosshair');
      } else { html.style.removeProperty('cursor'); }
      for (i = 0; i < $inputs.length; i++) {
        if (cursor) { $inputs[i].style.cursor = cursor; }
        else { $inputs[i].style.removeProperty('cursor'); }
      }
    }*/

    // mark off
    if (!markb) { // se non deve essere marchiato
      if (this.isApplied()) { // ma lo è attualmente
        if (markhtml.parentNode) { markhtml.parentNode.removeChild(markhtml); }
        delete mp.Vmarks[this.key];
        delete ModelPiece.allmarks[mp.id + this.key];
        html.classList.remove('.marked_' + this.id);
      }
      U.remove(css);
      return; }

    // mark on
    mp.Vmarks[this.key] = this;
    ModelPiece.allmarks[mp.id + this.key] = this;
    // html.classList.add('marked_' + this.id);
    // const model = mp.getModelRoot();
    // const size: GraphSize = model.graph.toGraphCoordS(U.sizeof(html));
    // U.setSvgSize(markhtml, size, null);

    let stylestr = '' +
      (this.style.backColor ? '    background-color:' + this.style.backColor + ' !important;\n' : '') +
      '    outline: ' + this.style.width + 'px solid ' + this.style.color + ' !important;\n'+
      (this.key === 'refhover' ? '    pointer: ' + (this.style.color === 'red' ?  + 'no-drop' : 'crosshair') + ' !important;' : '')+
      '    outline-offset: ' + this.style.extraOffset.x + 'px !important;';
    css.innerHTML += '[data-modelpieceid="' + mp.id + '"]' + '{' + stylestr + '}\n';
    document.body.append(css);
      /*+'[data-modelpieceid="' + mp.id + '"]:before{' +
      '    content: \'\';' +
      '    width: 100%;\n' +
      '    height: 100%;\n' +
      '    clear: both;\n' +
      '    display: table;\n' +
      stylestr +
      '    outline-offset: ' + -this.style.extraOffset.x + 'px !important;' +
      '    outline-offset: 10px;\n}'*/
    /*
    markhtml.setAttributeNS(null, 'rx', '' + (this.style.radiusX));
    markhtml.setAttributeNS(null, 'ry', '' + (this.style.radiusY));
    markhtml.setAttributeNS(null, 'stroke', '' + (this.style.color));
    markhtml.setAttributeNS(null, 'stroke-width', '' + (this.style.width));
    markhtml.setAttributeNS(null, 'fill', '' + (this.style.backColor));
    if ((markhtml as HTMLElement).style) (markhtml as HTMLElement).style.pointerEvents = 'none';
    model.graph.vertexContainer.append(markhtml);
    */
  }
  mark(set: boolean = true) {
    // console.log((set ? '' : 'un') + 'mark: 2x ', this.key, set);
    if (set === this.isApplied()) return;
    if (set && (this.mp1 && this.mp1.Vmarks[this.key] || this.mp2 && this.mp2.Vmarks[this.key])) { return; }
    if (this.style.color === null) { this.style.color = Mark.colorCycle.get(); }
    if (this.mp1 && !this.html1) { this.html1 = document.createElement('div'); }
    if (this.mp2 && !this.html2) { this.html2 = document.createElement('div'); }
    if (this.mp1 && !this.css1) { this.css1 = document.createElement('style'); }
    if (this.mp2 && !this.css2) { this.css2 = document.createElement('style'); }
    if (this.mp1 && this.mp1.getVertex(false)) this.setHtml(this.html1, this.mp1, this.css1, set);
    if (this.mp2 && this.mp2.getVertex(false)) this.setHtml(this.html2, this.mp2, this.css2, set);
  }
}
