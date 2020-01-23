import {IEdge, GraphPoint, IVertex, Dictionary, EdgePointStyle, EdgeStyle, IGraph, Point, Status, U} from '../../../common/Joiner';
import ClickEvent = JQuery.ClickEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import MouseMoveEvent = JQuery.MouseMoveEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseLeaveEvent = JQuery.MouseLeaveEvent;
import MouseEnterEvent = JQuery.MouseEnterEvent;
import MouseOverEvent = JQuery.MouseOverEvent;
import ContextMenuEvent = JQuery.ContextMenuEvent;

export interface IEdgePoint {
  edge: IEdge;
  // pos: GraphPoint;
  // html: HTMLElement | SVGCircleElement;
  getEndPoint(): GraphPoint;
  getStartPoint(): GraphPoint;
  moveTo(pos: GraphPoint, refresh: boolean, centra: boolean);
  show(): void;
  hide(): void;
}
export class EdgePointFittizio {
  pos: GraphPoint = null;
  realPoint: EdgePoint = null;
  constructor(pos: GraphPoint, realPoint: EdgePoint = null) {
    this.pos = pos;
    this.realPoint = realPoint;
  }
  link(realPoint: EdgePoint) { this.realPoint = realPoint; }

  getPreviousRealPt(fittizi: EdgePointFittizio[], includeMySelf = true) {
    let index = fittizi.indexOf(this);
    U.pe(index < 0, 'the element must be inside the array. this:', this, ', arr:', fittizi, ', index:', index);
    index += (includeMySelf ? 1 : 0);
    while (--index >= 0) {
      if (fittizi[index].realPoint) { return fittizi[index].realPoint; }
    }
    return null;
  }
  getNextRealPt(fittizi: EdgePointFittizio[], includeMySelf = true, debug: boolean = false) {
    let index = fittizi.indexOf(this);
    U.pe(index < 0, 'the element must be inside the array');
    index -= (includeMySelf ? 1 : 0);
    while (++index < fittizi.length) {
      U.pif(debug, index + '/' + fittizi.length + ']', fittizi[index], 'fittiziAll:', fittizi);
      if (fittizi[index].realPoint) { return fittizi[index].realPoint; } }
    return null;
  }
}
export class EdgePoint implements IEdgePoint {
  static ID = 0;
  static all: Dictionary = {};
  id: number = null;
  pos: GraphPoint = null;
  html: SVGCircleElement = null;
  edge: IEdge = null;
  endPointOfVertex: IVertex = null;
  isSelected: boolean = null;
  isHighlighted: boolean = null;

  constructor(e: IEdge, pos: GraphPoint, endPointOfVertex: IVertex = null) {
    this.edge = e;
    this.endPointOfVertex = endPointOfVertex;
    // edge = null is ok, è il cursorfollower statico.
    U.pe(this.edge === undefined, 'edge === undefined on EdgePoint constructor.');
    this.html = U.newSvg<SVGCircleElement>('circle');
    this.id = EdgePoint.ID++;
    if (e) { e.logic.linkToLogic(this.html); }
    EdgePoint.all[this.id] = this;
    this.html.dataset.EdgePointID = '' + this.id;
    this.pos = new GraphPoint(0, 0);
    this.isSelected = false;
    this.isHighlighted = false;
    this.refreshGUI();
    this.moveTo(pos, false);
    this.addEventListeners(); }

  static getFromHtml(html: HTMLElement | SVGElement): EdgePoint { return EdgePoint.all[html.dataset.EdgePointID]; }

  follow(e: MouseDownEvent = null): void {
    CursorFollowerEP.activeEP = this;
    const edge: IEdge = this.edge;
    if (this as EdgePoint !== CursorFollowerEP.cursorFollower && this === edge.endNode) {
      CursorFollowerEP.activeEP = null;
      IVertex.linkVertexMouseDown(e, edge);
    }
  }

  unfollow(): void {
    console.log('un-follow');
    CursorFollowerEP.activeEP = null; }

  addEventListeners(): void {
    const $html = $(this.html);
    // $html.off('click.ep').on('click.ep', (e: ClickEvent) => { EdgePoint.getFromHtml(e.currentTarget).onClick(e); });
    $html.off('mousedown.ep').on('mousedown.ep', (e: MouseDownEvent) => { EdgePoint.getFromHtml(e.currentTarget).onMouseDown(e); });
    // $html.off('mousemove.ep').on('mousemove.ep', (e: MouseMoveEvent) => { EdgePoint.getFromHtml(e.currentTarget).onMouseMove(e); });
    $html.off('mouseup.ep').on('mouseup.ep', (e: MouseUpEvent) => { EdgePoint.getFromHtml(e.currentTarget).onMouseUp(e); });
    $html.off('mouseenter.ep').on('mouseenter.ep', (e: MouseEnterEvent) => { EdgePoint.getFromHtml(e.currentTarget).onMouseEnter(e); });
    $html.off('mouseleave.ep').on('mouseleave.ep', (ee: MouseLeaveEvent) => { EdgePoint.getFromHtml(ee.currentTarget).onMouseLeave(ee); });
    // $html.off('mouseover.ep').on('mouseover.ep', (e: MouseLeaveEvent) => { EdgePoint.getFromHtml(e.currentTarget).onMouseOver(e); });
    $html.off('contextmenu.deleteEdgePoint').on('contextmenu.deleteEdgePoint',
      (e: ContextMenuEvent) => { this.detach(); return false; });
  }

  isAttached(): boolean { return this.edge !== null; }

  detach(refreshGUI: boolean = true): void {
    if (!this.isAttached()) { return; }
    U.arrayRemoveAll(this.edge.midNodes, this);
    if (this.html && this.html.parentNode) { this.html.parentNode.removeChild(this.html); }
    if (refreshGUI) { this.edge.refreshGui(); }
    this.edge = null;
    this.unfollow(); }

  onClick(e: ClickEvent): void { }

  onMouseEnter(e: MouseEnterEvent): void {
    // console.log('enter');
    this.refreshGUI(null, true);  }

  onMouseLeave(e: MouseLeaveEvent): void {
    // console.log('leave');
    // if (this.isMoving) { this.onMouseMove(e); }
    this.refreshGUI(null, false); }

  onMouseDown(e: MouseDownEvent): void {
    this.refreshGUI(true);
    // console.log('leave');
    this.follow(e);
    e.preventDefault(); e.stopPropagation(); }
  // onMouseOver(e: MouseOverEvent): void { e.preventDefault(); e.stopPropagation(); }
  /* onMouseMoveOld(e: MouseMoveEvent | MouseLeaveEvent): void {
    if (!this.isMoving) { return; }
    const screenPt: Point = new Point(e.pageX, e.pageY);
    const graphPt: GraphPoint = this.edge.owner.toGraphCoord(screenPt);
    this.moveTo(graphPt, true); }*/

  onMouseUp(e: MouseUpEvent): void {
    this.refreshGUI(false);
    e.stopPropagation();
    // console.log('up');
    this.unfollow(); }

  getCenter(fitHorizontal: boolean = false, fitVertical: boolean = false): GraphPoint {
    return this.edge.owner.fitToGrid(this.pos, true, false, fitHorizontal, fitVertical); }
  getStartPoint(fitHorizontal: boolean = true, fitVertical: boolean = true): GraphPoint {
    return this.getCenter(fitHorizontal, fitVertical); }
  getEndPoint(fitHorizontal: boolean = true, fitVertical: boolean = true): GraphPoint {
    return this.getCenter(fitHorizontal, fitVertical); }

  moveTo(pos: GraphPoint, refresh: boolean, centra: boolean = true) {
    if (!this.edge) { return; }
    const r: number = centra ? 0 : (isNaN(-this.html.r) ? 0 : -this.html.r);
    U.pe(!this.pos || this.pos.x === null || this.pos.x === undefined, 'this.pos.x undefined', this.pos);
    U.pe(!pos || pos.x === null || pos.x === undefined, 'pos.x undefined', pos);
    this.pos.x = (pos.x + r);
    this.pos.y = (pos.y + r);
    this.html.setAttribute('cx', '' + this.pos.x);
    this.html.setAttribute('cy', '' + this.pos.y);
    this.show();
    if (refresh) { this.edge.refreshGui(); } }

  show(debug: boolean = false): void {
    const oldParent: HTMLElement | SVGElement = this.html.parentNode as HTMLElement | SVGElement;
    if (oldParent) { oldParent.removeChild(this.html); }
    this.edge.shell.appendChild(this.html);
    this.html.style.display = 'block';
    this.refreshGUI(null, null, debug); }

  hide(): void { this.html.style.display = 'none'; }

  public refreshGUI(select: boolean = null, highlight: boolean = null, debug: boolean = false): void {
    if (select !== null) { this.isSelected = select; }
    if (highlight !== null) { this.isHighlighted = highlight; }
    if (this.isSelected) { this.styleSelected(); } else
    if (this.isHighlighted) { this.styleHighlight(); } else { this.styleCommon(debug); } }

  private styleCommon(debug: boolean = false): void {
    if (!this.isAttached()) { U.pw(debug, 'not attached', this); return; }
    const eps: EdgePointStyle = this.edge.logic.edgeStyleCommon.edgePointStyle;
    if (debug) { this.html.setAttributeNS(null, 'debug', 'styleCommon'); }
    this.html.setAttributeNS(null, 'r', '' + eps.radius);
    this.html.setAttributeNS(null, 'stroke-width', '' + eps.strokeWidth);
    this.html.setAttributeNS(null, 'stroke', eps.strokeColor);
    this.html.setAttributeNS(null, 'fill', eps.fillColor); }

  private styleHighlight(): void {
    if (!this.isAttached()) { return; }
    const eps: EdgePointStyle = this.edge.logic.edgeStyleHighlight.edgePointStyle;
    this.html.setAttributeNS(null, 'r', '' + eps.radius);
    this.html.setAttributeNS(null, 'stroke-width', '' + eps.strokeWidth);
    this.html.setAttributeNS(null, 'stroke', eps.strokeColor);
    this.html.setAttributeNS(null, 'fill', eps.fillColor); }

  private styleSelected(): void {
    if (!this.isAttached()) { return; }
    const eps: EdgePointStyle = this.edge.logic.edgeStyleSelected.edgePointStyle;
    this.html.setAttributeNS(null, 'r', '' + eps.radius);
    this.html.setAttributeNS(null, 'stroke-width', '' + eps.strokeWidth);
    this.html.setAttributeNS(null, 'stroke', eps.strokeColor);
    this.html.setAttributeNS(null, 'fill', eps.fillColor); }
}

export class CursorFollowerEP extends EdgePoint {
  static cursorFollower: CursorFollowerEP = null;
  static activeEP: EdgePoint = null;
  private graph: IGraph;

  public static get(): CursorFollowerEP {
    if (!this.cursorFollower) { this.cursorFollower = new CursorFollowerEP(); }
    return this.cursorFollower; }

  constructor() {
    super(null, new GraphPoint(0, 0));
    this.endPointOfVertex = undefined;
    this.html.setAttributeNS(null, 'fill', 'purple');
    this.html.setAttributeNS(null, 'stroke', 'purple');
    this.html.setAttributeNS(null, 'r', '5');
    U.eventiDaAggiungereAlBody('cursor follower');
    const $b = $(document.body);
    $b.off('mousemove.cursorFollowerEdgePoint_Move').on('mousemove.cursorFollowerEdgePoint_Move',
      (e: MouseMoveEvent) => {
        const debug: boolean = false && false;
        U.pif(debug, 'mousemove.cursorFollowerEdgePoint_Move()');
        const f: EdgePoint = CursorFollowerEP.activeEP;
        if (!f || !f.isAttached()) { return; }
        const graph = Status.status.getActiveModel().graph;
        f.moveTo(graph.toGraphCoord(new Point(e.pageX, e.pageY)), true);
        f.edge.refreshGui(true);
        /// here bug edge
      });
    $b.off('click.cursorFollowerEdgePoint_Detach').on('click.cursorFollowerEdgePoint_Detach',
      (e: ClickEvent) => {
        const f: CursorFollowerEP = CursorFollowerEP.get();
        f.detach(); });
    this.addEventListeners();
  }
/*
  cursorFollowerClick(e: ClickEvent) {
    const coord: GraphPoint = this.getCenter();
    this.detach();
    const useless = new EdgePoint(this.edge, coord);
    this.attach(this.edge, null);
  }*/
  onMouseUp(e: JQuery.MouseUpEvent): void { if (this.isAttached()) { this.edge.onMouseUp(e); }}

  moveTo(pos: GraphPoint, refresh: boolean, centra: boolean = true) {
    super.moveTo(pos, refresh, centra);
    if (!this.isAttached()) { return; }
    if (refresh) { this.edge.refreshGui(); }
  }

  isAttached(): boolean { return this.edge !== null; }

  attach(edge: IEdge, position: GraphPoint, index: number = Number.POSITIVE_INFINITY): void {
    this.detach();
    edge.logic.linkToLogic(this.html);
    this.graph = edge.owner;
    if (index < 0) { index = -1; }
    if (index === null || index === Number.POSITIVE_INFINITY) { index = this.edge.midNodes.length; }
    // console.log('CursorFollower.Attach()');
    this.edge = edge;
    this.html.dataset.modelPieceID = '' + this.edge.logic.id;
    U.insertAt(this.edge.midNodes, index + 1, this);
    if (position) { this.moveTo(position, false); }
    this.graph.container.appendChild(this.html);
    this.follow();
    this.refreshGUI(true); }

  addEventListeners() {
    super.addEventListeners();
    /*$(this.html).off('click.makeEdgePoint').on('click.makeEdgePoint',
      (e: ClickEvent) => { CursorFollowerEP.cursorFollower.cursorFollowerClick(e); });*/
    $(this.html).off('mouseup.makeEdgePoint').on('mouseup.makeEdgePoint',
      (e: MouseUpEvent) => { CursorFollowerEP.get().onMouseUp(e); });
  }
}
