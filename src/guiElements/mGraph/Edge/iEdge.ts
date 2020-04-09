import {
  Json,
  U,
  IVertex, EdgePoint, IField,
  IPackage,
  M2Class,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  ISidebar,
  IGraph,
  IModel,
  Status, IReference, CursorFollowerEP, EdgePointFittizio,
  Point, GraphPoint, Size, GraphSize, EdgeStyle, PropertyBarr, Dictionary, IClass, ExtEdge, MAttribute, MReference, IClassifier
} from '../../../common/Joiner';
import ClickEvent = JQuery.ClickEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import MouseMoveEvent = JQuery.MouseMoveEvent;
import MouseOverEvent = JQuery.MouseOverEvent;
import MouseEnterEvent = JQuery.MouseEnterEvent;
import MouseLeaveEvent = JQuery.MouseLeaveEvent;
import {EdgeHeadStyle} from './edgeStyle';
import KeyDownEvent = JQuery.KeyDownEvent;

enum EdgeDecoratorType {
  containment = 'containment',
  generalization = 'generalization',
  simple = 'simple' }

export enum EdgeModes {
  straight = 'straight',
  angular2 = 'angular con 2 segmenti.',
  angular3 = 'angular con 3 segmenti (un break centrale)',
  angular23Auto = 'angular 2 o angular 3 automatico' }

  export class IEdge {
  static selecteds: IEdge[] = [];
  static all: IEdge[] = null;
  private static shadowWidthIncrease = 7;
  static edgeChanging: IEdge;
  static edgeChangingStopTime: number = Date.now();
  static idToEdge: Dictionary<number, IEdge> = {};
  static edgeCount: number = 0 || 0;
  private headtype: EdgeDecoratorType = EdgeDecoratorType.simple;
  private tailtype: EdgeDecoratorType = EdgeDecoratorType.simple;
  // private static tempMidPoint_Clicked: GraphPoint = null;
  // private static tempMidPoint_ModelPiece: ModelPiece = null;
  owner: IGraph = null;
  start: IVertex = null;
  end: IVertex = null;
  midNodes: EdgePoint[] = null;
  startNode: EdgePoint;
  endNode: EdgePoint;
  shell: SVGGElement = null;
  html: SVGPathElement = null;
  shadow: SVGPathElement = null;
  logic: IClass | IReference = null;
  isSelected: boolean = null;
  isHighlighted: boolean = null;
  // mode: EdgeModes = null;
  edgeHead: SVGSVGElement = null;
  edgeTail: SVGSVGElement = null;
  headShell: SVGGElement = null;
  tailShell: SVGGElement = null;
  tmpEnd: GraphPoint = null;
  tmpEndVertex: IVertex = null;
  useMidNodes: boolean = true || true;
  useRealEndVertex: boolean = true || true;
  id: number = null;

  static staticInit(): IEdge[] {
    IEdge.all = [];
    IEdge.selecteds = [];
    // todo: prevent propagation on click on edges.
    U.eventiDaAggiungereAlBody('trigger onBlur of all IEdge.selecteds.');
    $(document.body).off('click.blurEdgeSelection').on('click.blurEdgeSelection',
      (ee: ClickEvent) => {
        const debug = false;
        U.pif(debug, 'body.click(): clear All Edge Selections');
        let i: number;
        let arr: IEdge[] = U.shallowArrayCopy(IEdge.selecteds);
        for (i = 0; i < arr.length; i++) { arr[i].onBlur(); }
        U.pif(debug, 'graph clicked:', ee);
        const modelPieceClicked: ModelPiece = ModelPiece.get(ee);
        const edgeClicked: IEdge = IEdge.get(ee);
        U.pif(debug, 'modelPieceClicked ? ', modelPieceClicked);
        if (!modelPieceClicked) { return; }
        const htmlClicked = ee.target;
        let parent: HTMLElement = htmlClicked;
        while (parent && parent.classList && !parent.classList.contains('EdgeShell')) { parent = parent.parentNode as HTMLElement; }
        // const edgeClicked: IEdge = (parent && parent.classList) ? edge : null;
        U.pif(debug, 'edgeClicked ? ', edgeClicked);
        if (!edgeClicked) { return; }
        edgeClicked.onClick(ee);
      });
    $(document.body).off('keydown.deletethings').on('keydown.deletethings', (evt: KeyDownEvent) => {
      let i: number;
      const target: Element = document.activeElement; // evt.target;
      if (!U.isChildrenOf(target, Status.status.getActiveModel().graph.container)) return;
      const tag: string = target.tagName.toLowerCase();
      const isInput: boolean = U.isInput(target, true);
      if (isInput) return;
      const model: IModel = Status.status.getActiveModel();
      const mp: ModelPiece = model.graph.propertyBar.selectedModelPiece;
      const ism2: boolean = mp && model.isM2();
      if (mp === model) return;
      const v: IVertex = mp.getVertex(); // IVertex.getvertexByHtml(target);
      const e: IEdge[] = []; //U.shallowArrayCopy(IEdge.selecteds);// IEdge.getByHtml(target);
      const ext: ExtEdge[] = [];
      const elogic: (IClass | IReference)[] = [];
      const extlogic: M2Class[] = [];
      for (i = 0; i < IEdge.selecteds.length; i++) {
        const elem: IEdge = IEdge.selecteds[i];
        if (elem instanceof ExtEdge) { ext.push(elem); extlogic.push(elem.logic); }
        else { e.push(elem); elogic.push(elem.logic)}
      }
      console.log('document.keydown.deletethings: ', evt, e, v, mp);
      if (e && e.length) {
        console.log('edge: evt.key.toLowerCase() = ', evt.key.toLowerCase());
        switch(evt.key.toLowerCase()) {
          default: break;
          case 'delete':
            for (i = 0; i < elogic.length; i++) { (elogic[i] as ModelPiece).delete(true); }
            for (i = 0; i < ext.length; i++) { ext[i].remove(); }
            break;
        }
        return;
      }
      if (v) {
      switch(evt.key.toLowerCase()) {
        default: break;
        case 'd':
          if (!evt.ctrlKey || !ism2) return;
          if (mp === model) return;
          mp.duplicate();
          break;
        case 'delete': // case 'Backspace':
          // if (isInput) return; was only here, moved to everyone
          if (mp === model) return;
          if (ism2) mp.delete(true); else {
            if (mp instanceof MAttribute) mp.setValues(null); else
            if (mp instanceof MReference) mp.clearTargets();
          }
          break;
      }}
    });
    return IEdge.all; }

  static get(e: ClickEvent | MouseMoveEvent | MouseDownEvent | MouseUpEvent | MouseLeaveEvent | MouseEnterEvent | MouseEvent): IEdge {
    // return ModelPiece.getLogic(e.classType).edge;
    return IEdge.getByHtml(e.target); }

  static getByHtml(html0: Element, debug: boolean = true): IEdge {
    if (!html0) { return null; }
    let html: HTMLElement = html0 as HTMLElement;
    while ( html && (!html.dataset || !html.dataset.edgeid)) { html = html.parentElement; }
    const ret = html ? IEdge.getByID(+html.dataset.edgeid) : null;
    // U.pe(debug && !ret, 'failed to find edge. html0:', html0, 'html:', html, 'map:', IEdge.idToEdge);
    return ret; }

  static getByID(id: number): IEdge { return IEdge.idToEdge[id]; }

  constructor(logic: IClass | IReference, index: number, startv: IVertex = null, end: IVertex = null) {
    if (!startv) {
      if (logic instanceof IClass) { startv = (logic as IClass).getVertex(); }
      if (logic instanceof IReference) { startv = (logic as IReference).getVertex(); } }
    U.pe(!startv, 'startVertex missing');
    U.pe(!logic || !startv, 'new Edge() invalid parameters. logic:', logic, 'start:', startv, 'end:', end);
    if (!end) {
      U.pe(!!IEdge.edgeChanging, 'cannot create a pending edge (without target) while there are other pending edges.');
      IEdge.edgeChanging = this; }
    IEdge.all.push(this);
    this.id = IEdge.edgeCount++;
    IEdge.idToEdge[this.id] = this;
    this.logic = logic;
    if (!(this instanceof ExtEdge)) {
      U.pe(index === null || index === undefined, 'index must be set.');
      this.logic.edges[index] = this; }
    this.shell = document.createElementNS('http://www.w3.org/2000/svg', 'g'); // U.newSvg<SVGGElement>('g');
    this.html = document.createElementNS('http://www.w3.org/2000/svg', 'path'); // U.newSvg<SVGPathElement>('Path');
    this.shadow = U.newSvg<SVGPathElement>('path');
    this.shell.appendChild(this.html);
    this.shell.appendChild(this.shadow);
    this.shadow.dataset.edgeid = this.shell.dataset.edgeid = this.html.dataset.edgeid = '' + this.id;
    this.start = startv;
    this.start.edgesStart.push(this);
    this.setTarget(end);
    this.startNode = new EdgePoint(this, new GraphPoint(0, 0), this.start);
    this.midNodes = [];
    this.endNode = new EdgePoint(this, new GraphPoint(0, 0), this.end);
    this.owner = this.start.owner;
    this.isSelected = false;
    this.isHighlighted = false;
    this.edgeHead = null;
    this.edgeTail = null;
    this.headShell = null;
    this.tailShell = null;

    this.owner.edgeContainer.append(this.shell);
    this.shell.classList.add('EdgeShell');
    this.html.classList.add('Edge');
    this.shadow.classList.add('Edge', 'Shadow');
    this.shell.dataset.modelpieceid = '' + this.logic.id;
    this.html.dataset.modelpieceid = '' + this.logic.id;
    this.shadow.dataset.modelpieceid = '' + this.logic.id;
    this.html.setAttribute('fill', 'none');
    this.shadow.setAttribute('fill', 'none');
    this.shadow.setAttribute('stroke', 'none');
    this.shadow.setAttribute('visibility', 'hidden');
    this.shadow.setAttribute('pointer-events', 'stroke');
    this.addEventListeners(true, false);
    this.refreshGui(); }


  generateAggregationHead(style: EdgeHeadStyle): SVGSVGElement { return null; }
  generateContainmentHead(style: EdgeHeadStyle): SVGSVGElement { return this.generateAggregationHead(style); }
  generateContainmentTail(style: EdgeHeadStyle): SVGSVGElement { return this.generateAggregationTail(style); }

  generateAggregationTail(style: EdgeHeadStyle): SVGSVGElement { // https://jsfiddle.net/Naraku/3hngkrc1/
    let svg: SVGSVGElement;
    let path: SVGPathElement;
    const bugfigo = false;
    // if (this instanceof ExtEdge) svg = this.edgeTail = this.edgeHead || U.newSvg('svg');
    if (bugfigo || this.edgeTail && this.tailtype === EdgeDecoratorType.containment) {
      svg = this.edgeTail;
      // U.clear(svg);
      path = svg.firstChild as SVGPathElement; }
    else {
      svg = U.newSvg<SVGSVGElement>('svg');
      path = U.newSvg<SVGPathElement>('path');
      svg.appendChild(path);
      path.setAttributeNS(null, 'd', 'M100 0 L200 100 L100 200 L0 100 Z'); }
    this.tailtype = EdgeDecoratorType.containment;
    svg.setAttributeNS(null, 'width', '' + style.width);
    svg.setAttributeNS(null, 'height', '' + style.width);
    svg.setAttributeNS(null, 'viewBox',
      (-style.width) + ' ' + (-style.width) + ' ' + (200 + style.width * 2) + ' ' +  (200 + style.width * 2));
    path.setAttributeNS(null, 'fill', style.fill);
    path.setAttributeNS(null, 'stroke', style.stroke);
    path.setAttributeNS(null, 'stroke-width', '' + style.width);
    return svg; }

  generateGeneralizationHead(style: EdgeHeadStyle): SVGSVGElement {
    let svg: SVGSVGElement;
    let path: SVGPathElement;
    const bugfigo = false;
    if (bugfigo || this.edgeHead && this.headtype === EdgeDecoratorType.generalization) {
      svg = this.edgeHead;
      // U.clear(svg);
      path = svg.firstChild as SVGPathElement; }
    else {
      svg = U.newSvg<SVGSVGElement>('svg');
      path = U.newSvg<SVGPathElement>('path');
      svg.appendChild(path);
      path.setAttributeNS(null, 'd', 'M100 0 L200 200 L000 200 Z'); }
    this.headtype = EdgeDecoratorType.generalization;
    svg.setAttributeNS(null, 'width', '' + style.width);
    svg.setAttributeNS(null, 'height', '' + style.width);
    svg.setAttributeNS(null, 'viewBox',
      (-style.width) + ' ' + (-style.width) + ' ' + (200 + style.width * 2) + ' ' +  (200 + style.width * 2));
    path.setAttributeNS(null, 'fill', style.fill);
    path.setAttributeNS(null, 'stroke', style.stroke);
    path.setAttributeNS(null, 'stroke-width', '' + style.width);
    return svg; }

  generateGeneralizationTail(style: EdgeHeadStyle): SVGSVGElement { return null; }

  static makePathSegment(prevPt: GraphPoint, nextPt: GraphPoint, mode0: EdgeModes, angularFavDirectionIsHorizontal: boolean = null,
                                 prevVertexSize: GraphSize, nextVertexSize: GraphSize, type: string = ' L', debug = false): string {
    // todo old: devi rifare totalmente la parte di "angularFavDirection" basandoti su se cade perpendicolare sul vertice e devi usare
    // 2 variabili, forzando la direzione ad essere per forza perpendicolare sul lato su cui risiede il vertex.startPt o .endPt
    // poi: se le direzioni forzate coincidono, allora è un angular3, se sono vertical+horizontal, allora è un angular2.
    // nb: in prevVertexSize e nextVertexSize la favDirection viene calcolata uguale, ma l'assenamento prevVertexSize = nextVertexSize;
    // poi deve sparire perchè devo generare 2 diverse favDirection e non una sola.
    let m;
    let pathStr = '';
    const pt1IsOnHorizontalSide = !prevVertexSize ? null : U.isOnHorizontalEdges(prevPt, prevVertexSize);
    const pt2IsOnHorizontalSide = !nextVertexSize ? null : U.isOnHorizontalEdges(nextPt, nextVertexSize);

    // if (prevVertexSize) { prevPt = prevVertexSize} //IVertex.closestIntersection(); }
    if (debug) {
      U.cclear();
      Status.status.getActiveModel().graph.markg(prevPt, true, 'green');
      if (prevVertexSize) { Status.status.getActiveModel().graph.markgS(prevVertexSize, false, 'white'); }
      Status.status.getActiveModel().graph.markg(nextPt, false, 'green');
      if (nextVertexSize) { Status.status.getActiveModel().graph.markgS(nextVertexSize, false); }
    }
    U.pif(debug, 'prev:' + (pt1IsOnHorizontalSide) + ', next:' + (pt2IsOnHorizontalSide),
      'm0:' + mode0 + ' --> ' + mode0 + ', favDirection' + angularFavDirectionIsHorizontal);
    // return '';
    U.pif(debug, 'directions:', pt1IsOnHorizontalSide, pt2IsOnHorizontalSide);
    if (prevVertexSize && !U.isOnEdge(prevPt, prevVertexSize)) { U.pw(debug, 'prev not on border'); return ''; }
    if (nextVertexSize && !U.isOnEdge(nextPt, nextVertexSize)) { U.pw(debug, 'next not on border'); return ''; }
    U.pe(prevVertexSize && !U.isOnEdge(prevPt, prevVertexSize) || nextVertexSize && !U.isOnEdge(nextPt, nextVertexSize), 'not on border');

    if (prevVertexSize && !U.isOnEdge(prevPt, prevVertexSize) || nextVertexSize && !U.isOnEdge(nextPt, nextVertexSize)) {
      /*console.clear();
      const g = Status.status.getActiveModel().graph;
      g.markg(prevPt, false, 'green');
      g.markgS(prevVertexSize, false, 'green');
      g.markg(prevPt, false);
      g.markgS(prevVertexSize, false);
      console.log('not on vertex border. pt:', prevPt, 'vertex:', prevVertexSize);
      console.log('not on vertex border. nextpt:', nextPt, 'nextvertex:', nextVertexSize);
      U.pw(true, (!U.isOnEdge(prevPt, prevVertexSize) ? 'prev' : 'next') + ' not on vertex border.');
      return '';
      */
    }
    let mode: EdgeModes = mode0;
    if (prevVertexSize && nextVertexSize) {
      // mode = (pt1IsOnHorizontalSide && pt2IsOnHorizontalSide) ? EdgeModes.angular3 : EdgeModes.angular2;
    }
    // if (mode === EdgeModes.angular23Auto) { mode = EdgeModes.angular3; }

    /*
    if (prevVertexSize && mode === EdgeModes.angular23Auto) {
      // U.pe(angularFavDirectionIsHorizontal === null, 'preferred direction is useless with prevVertexSize');
      U.pif(debug, 'favdirection pre:', angularFavDirectionIsHorizontal,
        'isOnVerticalEdge:', U.isOnVerticalEdges(prevPt, prevVertexSize),
        'isOnHorizontalEdge:', U.isOnHorizontalEdges(prevPt, prevVertexSize), 'prevPt:', prevPt, 'prevSize:', prevVertexSize);
      if (angularFavDirectionIsHorizontal === false && U.isOnVerticalEdges(prevPt, prevVertexSize)) {
        mode = EdgeModes.angular2; angularFavDirectionIsHorizontal = true; }
      if (angularFavDirectionIsHorizontal === true && U.isOnHorizontalEdges(prevPt, prevVertexSize)) {
        mode = EdgeModes.angular2; angularFavDirectionIsHorizontal = false; }
      U.pif(debug, 'favdirection post:', angularFavDirectionIsHorizontal);
    } */
    /* compute last favorite direction * /
let lastIsHorizontalSide: boolean = null;
const endPt: GraphPoint = allRealPt[allRealPt.length - 1].pos;
const penultimoPt: GraphPoint = allRealPt[allRealPt.length - 2].getStartPoint();
console.log('endVertex:', endVertex, 'endPt:', endPt, '; useRealEnd ? ', useRealEndVertex, ' = ', this.tmpEnd, this.tmpEndVertex);
if (!endVertex) { lastIsHorizontalSide = Math.abs(GraphPoint.getM(penultimoPt, endPt)) < 1; } else
if (endPt.x === endVertexSize.x) {                   /*from Left* /   lastIsHorizontalSide = true; } else
if (endPt.x === endVertexSize.x + endVertexSize.w) { /*from Right* /  lastIsHorizontalSide = true; } else
if (endPt.y === endVertexSize.y) {                   /*from Top* /    lastIsHorizontalSide = false; } else
if (endPt.y === endVertexSize.y + endVertexSize.h) { /*from Bottom* / lastIsHorizontalSide = false;
} else { lastIsHorizontalSide = null; }
U.pe(lastIsHorizontalSide === null, 'endpoint is not on the boundary of vertex.',
  ' Vertex.endpoint:', endPt, '; vertexSize:', endVertexSize);*/
    /* done setting realpoints.pos, now draw path */
    let oldPathStr = pathStr;

    if (mode === EdgeModes.angular23Auto) { mode = mode0 = EdgeModes.angular3; }
    const angular23: EdgeModes = EdgeModes.angular3;
    // if (mode0 === angular23 && prevVertexSize && !pt1IsOnHorizontalSide && nextVertexSize && pt2IsOnHorizontalSide) {
    U.pif(debug, mode0 === angular23, !!prevVertexSize, pt1IsOnHorizontalSide);
    if (mode0 === angular23 && prevVertexSize && pt1IsOnHorizontalSide) {
      angularFavDirectionIsHorizontal = false;
      mode = EdgeModes.angular3;
      U.pif(debug, 'fixed'); }
    // if (prevVertexSize) { angularFavDirectionIsHorizontal = pt1IsOnHorizontalSide; }
    // if (nextVertexSize) { angularFavDirectionIsHorizontal = !pt2IsOnHorizontalSide; }
    // if (mode === angular23 && prev)
    switch (mode) {
      default: U.pe(true, 'unexpected EdgeMode:', mode); break;
      case EdgeModes.angular2:
        m = GraphPoint.getM(prevPt, nextPt); // coefficiente angolare della prossima linea disegnata (come se fosse dritta)
        if (angularFavDirectionIsHorizontal === null) { angularFavDirectionIsHorizontal = Math.abs(m) <= 1; } // angolo <= abs(45°)
        if (angularFavDirectionIsHorizontal) {
          // qui resizer orizzontale
          oldPathStr = pathStr;
          pathStr += type + (nextPt.x) + ' ' + (prevPt.y);
          U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 favdirectionHorizontal');
        } else {
          // qui resizer verticale.
          oldPathStr = pathStr;
          pathStr += type + (prevPt.x) + ' ' + (nextPt.y);
          U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 favdirectionVertical');
        }
        // qui resizer opposto al precedente.
        // oldPathStr = pathStr;
        // pathStr += type + (nextPt.x) + ' ' + (nextPt.y);
        // U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 end ridondante?');
        break;
      case EdgeModes.angular23Auto + '': U.pw(true, 'mode.angular23Auto should be replaced before entering here'); break;
      case EdgeModes.angular3:
        m = GraphPoint.getM(prevPt, nextPt); // coefficiente angolare della prossima linea disegnata (come se fosse dritta)
        if (angularFavDirectionIsHorizontal === null) { angularFavDirectionIsHorizontal = Math.abs(m) <= 1; } // angolo <= abs(45°)
        if (angularFavDirectionIsHorizontal) {
          const midX = (nextPt.x + prevPt.x) / 2;
          // todo: e qui dovrei appendere un path invisibile che cambia cursore in HorizontalResizer intercettare gli eventi edge.
          oldPathStr = pathStr;
          pathStr += type + (midX) + ' ' + (prevPt.y);
          U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 orizzontale: orizzontale big');
          // qui invece uno piccolino verticale
          oldPathStr = pathStr;
          pathStr += type + (midX) + ' ' + (nextPt.y);
          U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 orizzontale: verticale small');
        } else {
          const midY = (nextPt.y + prevPt.y) / 2;
          // todo: qui resizer verticale.
          oldPathStr = pathStr;
          pathStr += type + prevPt.x + ' ' + (midY);
          U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 verticale: verticale big');
          // qui invece uno piccolino orizzontale
          oldPathStr = pathStr;
          pathStr += type + nextPt.x + ' ' + (midY);
          U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 verticale: orizzontale small');
        }
        // todo: qui resizer opposto al precedente.
        break;
      case EdgeModes.straight: /* nessun punto fittizio di mezzo */ break;
    }
    oldPathStr = pathStr;
    pathStr += type + (nextPt.x) + ' ' + (nextPt.y);
    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; lastPt comune a tutti.');

    return pathStr; }
  /*private static midPointMouseDown(e: JQuery.MouseDownEvent) {
    IEdge.tempMidPoint_ModelPiece = ModelPiece.getLogic(e.currentTarget);
    IEdge.tempMidPoint_Clicked = Status.status.getActiveModel().graph.toGraphCoord( new Point(e.pageX, e.pageY) );
  }*//*
  private static midPointMouseMove(e: JQuery.MouseMoveEvent) {
    const p: GraphPoint = Status.status.getActiveModel().graph.toGraphCoord( new Point(e.pageX, e.pageY) );

  }
  private static midPointMouseUp(e: JQuery.MouseUpEvent) { }*/
  canBeLinkedTo(target: IClass): boolean { return this.logic.canBeLinkedTo(target); }

  refreshGui(debug: boolean = false, useRealEndVertex: boolean = null, usemidnodes: boolean = null) {
    debug = false;
    let debugi: number = window['' + 'debug'];
    if (debugi === 1) return;
    // || this.start.size.isinside(this.end.size) ||  this.end.size.isinside(this.start.size
    // quando startpoint o endpoint sono dentro un vertice size
    if (!this.midNodes.length && (this.start === this.end)) { //this.start.size.intersection(this.end.size))) {
      $(this.shell).hide();
      return; } else $(this.shell).show();
    U.pe(!this.logic, 'IEdge.logic is null:', this);
    if (useRealEndVertex === null) { useRealEndVertex = this.useRealEndVertex; }
    if (usemidnodes === null) { usemidnodes = this.useMidNodes; }
    /* setup variables */
    const startVertex: IVertex = this.start;
    const startVertexSize: GraphSize = this.start.getSize();
    let endVertex: IVertex = null;
    let endVertexSize: GraphSize = null;
    let allRealPt: EdgePoint[] = this.getAllRealMidPoints();
    if (!usemidnodes) { allRealPt = [allRealPt[0], allRealPt[allRealPt.length - 1]]; }
    if (useRealEndVertex) {
      endVertex = this.end;
      endVertexSize = endVertex.getSize();
      this.startNode.moveTo(startVertex.getStartPoint(allRealPt[1].getEndPoint()), false);
      this.endNode.moveTo(endVertex.getEndPoint(allRealPt[allRealPt.length - 2].getStartPoint()), false);
    } else {
      endVertex = this.tmpEndVertex;
      endVertexSize = endVertex ? endVertex.getSize() : null;
      this.startNode.moveTo(startVertex.getStartPoint(allRealPt[1].getEndPoint()), false);
      this.endNode.moveTo(endVertex ? endVertex.getEndPoint(allRealPt[allRealPt.length - 2].getStartPoint()) : this.tmpEnd, false);
    }
    if (debugi === 2) return;
    U.pif(debug, 'allRealPt:', allRealPt);
    let i;
    let pathStr: string; // 'M' + (allRealPt[0].getStartPoint().x) + ' ' + (allRealPt[0].getStartPoint().y);
    let oldpathStr: string;
    const graph: IGraph = this.logic.getModelRoot().graph;

    if (debugi === 3) return;
    if (debug) {
      U.cclear();
      if (startVertexSize) { graph.markgS(startVertexSize, true, 'blue'); }
      if (endVertexSize) { graph.markgS(endVertexSize, false); } }

    for (i = 1; i < allRealPt.length; i++) { // escludo il primo punto dal loop.
      const curr: EdgePoint = allRealPt[i];
      const prev: EdgePoint = allRealPt[i - 1];
      const favdirection: boolean = null; // i === allRealPt.length - 1 ? lastdirectionIsHorizontal : null;
      const prevVertexSize: GraphSize = i === 1 ? startVertexSize : null;
      const nextVertexSize: GraphSize = i === allRealPt.length - 1 ? endVertexSize : null;
      const prevPt: GraphPoint = prev.getStartPoint(!prevVertexSize, !prevVertexSize);
      const currPt: GraphPoint = curr.getEndPoint(!nextVertexSize, !nextVertexSize);
      // console.log(prevVertexSize, new GraphSize());
      const intersection = nextVertexSize && prevVertexSize ? nextVertexSize.intersection(prevVertexSize) : null;
      if (intersection) console.log('midenodes.length:', !this.midNodes.length , '&&', prevPt , currPt, ' contained in ', intersection,
        intersection.contains(prevPt), intersection.contains(currPt));
      if (debug) {
        if (intersection) this.owner.markgS(intersection, true, 'black');
        this.owner.markg(prevPt, true, 'orange');
        this.owner.markg(currPt, false,'yellow');
        if (prevVertexSize) { graph.markgS(prevVertexSize, false, 'blue'); }
        if (nextVertexSize) { graph.markgS(nextVertexSize, false); } }
      if (!this.midNodes.length && intersection && ( intersection.contains(prevPt) || intersection.contains(currPt)) ){
        $(this.shell).hide();
        return; }
      // if (i === 1) { pt1.moveOnNearestBorder(startVertexSize, false); }
      // if (i === allRealPt.length - 1) { pt2.moveOnNearestBorder(endVertexSize, false); }
      if (i === 1) { pathStr = 'M' + prevPt.x + ' ' + prevPt.y; }
      oldpathStr = pathStr;
      pathStr += IEdge.makePathSegment(prevPt, currPt, this.getEdgeMode(), favdirection, prevVertexSize, nextVertexSize);
      U.pif(debug, 'pathStr: RealPts:' + '[' + i + '] = ' + currPt.toString() + '; prev:' + prevPt.toString());
      U.pif(debug, 'pathStr[' + (i) + '/' + allRealPt.length + ']: ' + oldpathStr + ' --> ' + pathStr);
    }

    if (debugi === 3) return;
    this.setPath(pathStr, debug);
    if (debugi === 4) return;
    this.getEdgeHead();
    this.getEdgeTail();
    if (debugi === 5) return;
    this.appendTailHead(true, pathStr);
    this.appendTailHead(false, pathStr);
    if (debugi === 6) return;
    // this.addEventListeners(true, false);
  }

  getEdgeMode(): EdgeModes {
    let tmp = this.logic.edgeStyleCommon.style;
    return tmp ? tmp : this.logic.edgeStyleCommon.style = EdgeModes.straight; }

  private getStyle(): EdgeStyle {
   if (this.isSelected) {
      return this.logic.edgeStyleSelected;
    } if (this.isHighlighted) {
      return this.logic.edgeStyleHighlight;
    } else { return this.logic.edgeStyleCommon; } }

  private setPath(pathStr: string, debug: boolean = false): void {
    let style: EdgeStyle = this.getStyle();
    /* update style */
    this.html.setAttribute('stroke', style.color);
    this.html.setAttribute('stroke-width', '' + style.width);
    this.shadow.setAttribute('stroke-width', '' + (style.width + IEdge.shadowWidthIncrease));
    // U.clear(this.shell);
    this.shell.appendChild(this.html);
    this.shell.appendChild(this.shadow);
    U.pif(debug, 'edgeHead:', this.edgeHead, 'tail:', this.edgeTail);
    this.html.setAttributeNS(null, 'd', pathStr);
    this.shadow.setAttributeNS(null, 'd', pathStr);
    let i: number;
    if (this.isSelected) {
      this.startNode.show();
      for (i = 0; i < this.midNodes.length; i++) { this.midNodes[i].show(); }
      this.endNode.show(); } else
    if (this.isHighlighted) {
      this.startNode.hide();
      for (i = 0; i < this.midNodes.length; i++) { this.midNodes[i].show(); }
      this.endNode.hide();
    } else {
      this.startNode.hide();
      for (i = 0; i < this.midNodes.length; i++) { this.midNodes[i].hide(); }
      this.endNode.hide();
    }
  }

  addEventListeners(foredge: boolean, forheadtail: boolean): void {
    const $edgetail: JQuery<Element> = forheadtail ? $(this.headShell).add(this.tailShell) : $();
    const $shell: JQuery<Element> = foredge ? $(this.shell) : $();
    const $edgeparts = $shell.find('.Edge').add($edgetail as any as JQuery<HTMLElement>);
    // U.pe(!$shell.length, 'html+', $htmlplus, 'html', $html, 'tailhead', $edgetail);
    //  U.pe(!$edgetail.length, 'html+', $htmlplus, 'html', $html, 'tailhead', $edgetail, 'head-tail:', this.edgeHead, this.edgeTail);
    // $shell.off('click.pbar').on('click.pbar', (e: ClickEvent) => IVertex.ChangePropertyBarContentClick(e, this) );
    /*$html.off('mousedown.showStyle').on('mousedown.showStyle',
      (e: MouseDownEvent) => { Status.status.getActiveModel().graph.propertyBar.styleEditor.showE(this.logic); });*/
    $shell.off('mousedown.startSetMidPoint').on('mousedown.startSetMidPoint',
      (e: MouseDownEvent) => {
        // const ownermp: M2Class | IReference = ModelPiece.getLogic(e.currentTarget) as M2Class | IReference;
        // U.pe( ownermp === null || ownermp === undefined, 'unable to get logic of:', e.currentTarget);
        const edge: IEdge = IEdge.get(e);
        U.pe( !e , 'unable to get edge of:', e.currentTarget);
        edge.onMouseDown(e); } );
    $shell.off('mousemove.startSetMidPoint').on('mousemove.startSetMidPoint',
      (e: MouseMoveEvent) => {
        // const ownermp: M2Class | IReference = ModelPiece.getLogic(e.currentTarget) as M2Class | IReference;
        // U.pe( ownermp === null || ownermp === undefined, 'unable to get logic of:', e.currentTarget);
        const edge: IEdge = IEdge.getByHtml(e.target, true);
        edge.onMouseMove(e); } );
    $shell.off('click.addEdgePoint').on('click.addEdgePoint', (e: ClickEvent) => { IEdge.get(e).onClick(e); });
    $edgeparts.off('mouseover.cursor').on('mouseover.cursor', (e: MouseOverEvent) => { IEdge.get(e).onMouseOver(e); });
    $edgeparts.off('mouseenter.cursor').on('mouseenter.cursor', (e: MouseEnterEvent) => { IEdge.get(e).onMouseEnter(e); });
    $edgeparts.off('mouseleave.cursor').on('mouseleave.cursor', (e: MouseLeaveEvent) => { IEdge.get(e).onMouseLeave(e); });

  }
  onBlur() {
    this.isSelected = false;
    this.html.classList.remove('selected_debug');
    U.arrayRemoveAll(IEdge.selecteds, this);
    let i;
    for (i = 0; i < this.midNodes; i++) { this.midNodes[i].hide(); }
    this.refreshGui(); }

  getAllRealMidPoints(): EdgePoint[] {
    const allNodes: EdgePoint[] =  [];
    allNodes.push(this.startNode);
    let i = 0;
    while (i < this.midNodes.length) { allNodes.push(this.midNodes[i++]); }
    allNodes.push(this.endNode);
    return allNodes; }

  getAllFakePoints(debug: boolean = false): EdgePointFittizio[] {
    // if (!this.html) { return null; }
    const d = this.html.getAttributeNS(null, 'd'); // .replace('M', 'L');
    // let dArr: string[] = d.split('L'); /// consider instead: U.parseSvgPath(pathStr).pts;
    // if (dArr.length === 1) { dArr = [dArr[0], dArr[0]]; }
    let i;
    const realMidPoints: EdgePoint[] = this.getAllRealMidPoints();
    const nodiFittizi: EdgePointFittizio[] = [];
    let realNodeIndex = 0;
    let puntiReali = 0;
    const parsedpts:{assoc: {letter: string, pt: Point}[], pts: Point[]} = U.parseSvgPath(d);
    for (i = 0; i < parsedpts.pts.length; i++) {
      const pt: GraphPoint = new GraphPoint(parsedpts.pts[i].x, parsedpts.pts[i].y);
      let target: EdgePoint = null;
      U.pif(debug, 'getAllFakePoints() d:', d, 'pt', pt, 'realMidPoints:', realMidPoints, 'index:', realNodeIndex, 'match?',
        realNodeIndex >= realMidPoints.length ? 'overflow' : realMidPoints[realNodeIndex].pos.equals(pt));
      let fitHorizontal: boolean;
      let fitVertical: boolean;
      if (i !== 0 && i !== parsedpts.pts.length - 1) { fitHorizontal = fitVertical = true; }
      if (i === 0 && !U.isOnHorizontalEdges(pt, this.start.getSize())) { fitHorizontal = false; fitVertical = true; }
      if (i === 0 && U.isOnHorizontalEdges(pt, this.start.getSize())) { fitHorizontal = true; fitVertical = false; }
      if (i === parsedpts.pts.length - 1 && !U.isOnHorizontalEdges(pt, this.end.getSize())) { fitHorizontal = false; fitVertical = true; }
      if (i === parsedpts.pts.length - 1 && U.isOnHorizontalEdges(pt, this.end.getSize())) { fitHorizontal = true; fitVertical = false; }
      // fitHorizontal = (i === 0 && U.isOnHorizontalEdges(pt, this.start.getSize()));
      const midPoint: GraphPoint = realMidPoints[realNodeIndex].getStartPoint(fitHorizontal, fitVertical);
      // todo: se cambi endpoint !== startpoint, devi fare due check.
      // const prevPt: GraphPoint = allNodes[realNodeIndex].getStartPoint(!!prevVertexSize, !!prevVertexSize);
      // const currPt: GraphPoint = curr.getEndPoint(!!nextVertexSize, !!nextVertexSize);
      U.pif(debug, pt, ' =?= ', midPoint, pt.equals(midPoint));
      if (pt.equals(midPoint)) {
        puntiReali++;
        target = realMidPoints[realNodeIndex++];
      }
      nodiFittizi.push( new EdgePointFittizio(pt, target)); }
    if (puntiReali < 2 || puntiReali < realMidPoints.length) {
      const prettyFittizi: string[] = [];
      const prettyRealMidPoints: string[] = [];
      i = -1;
      while (++i < nodiFittizi.length) { prettyFittizi.push(nodiFittizi[i].pos.toString()); }
      i = -1;
      while (++i < realMidPoints.length) { prettyRealMidPoints.push(realMidPoints[i].pos.toString()); }
      U.pw(debug, 'fallimento nell\'assegnare fakepoints ai punti reali. Assegnati:' + puntiReali + ' / ' + prettyRealMidPoints.length
        + '; fittizi trovati:', prettyFittizi, ' reali:', prettyRealMidPoints, ', parsedpts:', parsedpts, ', path:', d);
    }
    return nodiFittizi; }

  getBoundingMidPoints(e: ClickEvent | MouseMoveEvent | MouseUpEvent | MouseDownEvent | MouseEvent | MouseEnterEvent | MouseLeaveEvent,
                       style: EdgeStyle = null, canFail: boolean = false, arrFittizi: EdgePointFittizio[] = null): {prev: EdgePoint, next: EdgePoint} {
    const fittizi: EdgePointFittizio[] = arrFittizi ? arrFittizi : this.getAllFakePoints();
    const tmp: EdgePointFittizio[] = this.getBoundingMidPointsFake(e, style, canFail, fittizi);
    return {prev:tmp[0].getPreviousRealPt(fittizi), next: tmp[1].getNextRealPt(fittizi)}; }

  getBoundingMidPointsFake(e: ClickEvent | MouseMoveEvent | MouseUpEvent | MouseDownEvent | MouseEvent | MouseEnterEvent | MouseLeaveEvent,
                           style: EdgeStyle = null, canFail: boolean = false, arrFittizi: EdgePointFittizio[] = null): EdgePointFittizio[] {

    // if (style.style === EdgeModes.straight) { return this.getBoundingMidPointsStraight(e, canFail); }
    // const edge: IEdge = ModelPiece.getLogic(e.classType).edge;
    const clickedPt: GraphPoint = GraphPoint.fromEvent(e);
    const lineWidth: number = +this.shadow.getAttributeNS(null, 'stroke-width');

    const allNodes: EdgePoint[] =  this.getAllRealMidPoints();
    const fittizi: EdgePointFittizio[] = arrFittizi ? arrFittizi : this.getAllFakePoints();

    let i = 0;
    let closestPrev: EdgePointFittizio = null;
    let closestNext: EdgePointFittizio = null;
    let closestDistance: number = Number.POSITIVE_INFINITY;
    if (fittizi.length <= 2) return null;
    while (++i < fittizi.length) {
      const prev: EdgePointFittizio = fittizi[i - 1];
      const next: EdgePointFittizio = fittizi[i];
      const currentDistance = clickedPt.distanceFromLine(prev.pos, next.pos);
      /*if (clickedPt.isInTheMiddleOf(prev.pos, next.pos, lineWidth)) { return [prev, next]; }*/
      if (currentDistance < closestDistance) { closestPrev = prev; closestNext = next; closestDistance = currentDistance; }
    }
    return [closestPrev, closestNext]; }

  getBoundingMidPointsStraight_OLD(
    e: ClickEvent | MouseMoveEvent | MouseUpEvent | MouseDownEvent | MouseEvent | MouseEnterEvent | MouseLeaveEvent,
    canFail: boolean = false): EdgePoint[] {

    const edge: IEdge = null; // ModelPiece.getLogic(e.classType).edge;
    const clickedPt: GraphPoint = GraphPoint.fromEvent(e);
    const first: EdgePoint = this.startNode;
    const second: EdgePoint = (this.midNodes.length === 0 ? this.endNode : this.midNodes[0]);
    const penultimo: EdgePoint = (this.midNodes.length === 0 ? this.startNode : this.midNodes[this.midNodes.length - 1]);
    const last: EdgePoint = this.endNode;
    const lineWidth: number = +this.shadow.getAttributeNS(null, 'stroke-width');
    if (clickedPt.isInTheMiddleOf(first.pos, second.pos, lineWidth)) {
      /*console.log('bounding (first[' + edge.midNodes.indexOf(second)
        + '] && second[' + + edge.midNodes.indexOf(penultimo) + ']); e:', edge);*/
      return [first, second]; }
    /* if (penultimo !== first && second !== penultimo && clickedPt.isInTheMiddleOf(second.pos, penultimo.pos, lineWidth)) {
      console.log('bounding (second[' + edge.midNodes.indexOf(second)
        + '] && penultimo[' + + edge.midNodes.indexOf(penultimo) + ']), e:', edge);
      U.pe(edge.midNodes.indexOf(second) + 1 !== edge.midNodes.indexOf(penultimo), 'non conseguenti');
      return [second, penultimo]; } */
    if (last !== second && clickedPt.isInTheMiddleOf(penultimo.pos, last.pos, lineWidth)) {
      /*console.log('bounding (penultimo[' + edge.midNodes.indexOf(penultimo)
        + '] && ultimo[' + + edge.midNodes.indexOf(last) + ']); e:', edge);*/
      return [penultimo, last]; }
    let i;
    for (i = 0; i < this.midNodes.length; i++) { // ottimizzazione: può partire da 1 e terminare 1 prima (penultimo)
      const pre: EdgePoint = i === 0 ? first : this.midNodes[i - 1];
      const now: EdgePoint = this.midNodes[i];
      if (clickedPt.isInTheMiddleOf(pre.pos, now.pos, lineWidth)) {
        /*console.log('bounding (pre[' + edge.midNodes.indexOf(pre)
          + '] && now[' + + edge.midNodes.indexOf(now) + ']), e:', edge);*/
        U.pe(edge.midNodes.indexOf(pre) + 1 !== edge.midNodes.indexOf(now), 'non consecutivi.');
        return [pre, now]; }
    }
    console.log('clickedPt:', clickedPt, ', start:', this.startNode.pos, ', mids:', this.midNodes, ', end:', this.endNode.pos);
    U.pe(!canFail, 'bounding points not found:', e, this, 'edge:', IEdge.get(e));
    return null; }

  onMouseLeave(e: MouseLeaveEvent): void {
    this.isHighlighted = false;
    this.startNode.refreshGUI(null, false);
    this.endNode.refreshGUI(null, false);
    let i;
    for (i = 0; i < this.midNodes.length; i++) { this.midNodes[i].refreshGUI(null, false); }
    this.refreshGui(); }

  onMouseEnter(e: MouseEnterEvent): void {
    this.onMouseLeave(null);
    this.isHighlighted = true;
    this.refreshGui(true);
  }

  onMouseMove(e: MouseMoveEvent): void { this.onMouseOver(e as any, false); }

  onMouseOver(e: MouseOverEvent | MouseMoveEvent, canFail: boolean = false, debug: boolean = false): void {
    if (CursorFollowerEP.get().isAttached() || IEdge.edgeChanging) { return; }
    const fakePoints: EdgePointFittizio[] = this.getAllFakePoints();
    const tmp: EdgePointFittizio[] = this.getBoundingMidPointsFake(e, null, canFail, fakePoints);
    if (!tmp || tmp.length < 2) { return; }
    const preFake: EdgePointFittizio = tmp[0];
    const nextFake: EdgePointFittizio = tmp[1];
    const pre: EdgePoint = preFake.getPreviousRealPt(fakePoints);
    const next: EdgePoint = nextFake.getNextRealPt(fakePoints);
    U.pe(!pre, 'failed to get previousRealPt of point:', preFake, ', all fakePoints:', fakePoints);
    U.pe(!next, 'failed to get nextRealPt of point:', nextFake, ', all fakePoints:', fakePoints);
    let i = -1;
    this.startNode.refreshGUI(null, false);
    this.endNode.refreshGUI(null, false);
    let cursor: string;
    switch (this.getEdgeMode()) {
      default: cursor = 'help'; break;
      case EdgeModes.straight: cursor = 'select'; break;
      case EdgeModes.angular2:
      case EdgeModes.angular3:
      case EdgeModes.angular23Auto:
        if (preFake.pos.x === nextFake.pos.x) { cursor = 'col-resize';
        } else if (preFake.pos.y === nextFake.pos.y) { cursor = 'row-resize';
        } else { cursor = 'no-drop'; }
        break;
    }
    this.shadow.style.cursor = this.html.style.cursor = cursor;
    while (++i < this.midNodes.length) { this.midNodes[i].refreshGUI(null, false); }
    if (debug) { U.cclear(); }
    U.pif(debug, 'fake     pre: ', preFake, ', next:', nextFake);
    U.pif(debug, 'real     pre: ', pre, ', next:', next);
    pre.refreshGUI(null, true);
    next.refreshGUI(null, true); }

  onClick(e: ClickEvent): void {
    // console.log('IEdge.clicked:', this);
    const debug = false;
    this.isSelected = true;
    IEdge.selecteds.push(this);
    let i;
    this.html.setAttributeNS(null, 'stroke-width', '' + 5);
    this.html.classList.add('selected_debug');
    this.startNode.show();
    if (debug) { U.cclear(); }
    U.pif(debug, 'midnodes:', this.midNodes);
    for (i = 0; i < this.midNodes; i++) { this.midNodes[i].show(debug); }
    this.endNode.show();
    // if (!triggered) { Status.status.getActiveModel().graph.propertyBar.styleEditor.showE(this.logic); }
    this.refreshGui();
    IVertex.ChangePropertyBarContentClick(e, this);
    e.stopPropagation(); }

  onMouseDown(e: MouseDownEvent): void {
    if (!this.isSelected) { return; }
    const tmp = this.getBoundingMidPoints(e);
    const pos: GraphPoint = this.owner.toGraphCoord(new Point(e.pageX, e.pageY));
    CursorFollowerEP.get().attach(this, pos, this.midNodes.indexOf(tmp.prev)); }

  onMouseUp(e: MouseUpEvent): void {
    const len0: number = this.midNodes.length;
    const index = this.midNodes.indexOf(CursorFollowerEP.get());
    if (!this.isSelected) { return; }
    // console.log('point inserted Pre', this.midNodes, ' [0]:', this.midNodes[0], this.midNodes[1]);
    CursorFollowerEP.get().detach(false);
    const len1: number = this.midNodes.length;
    U.insertAt(this.midNodes, index, new EdgePoint(this, CursorFollowerEP.get().pos));
    const len2: number = this.midNodes.length;
    U.pe(len0 !== this.midNodes.length, 'size varied: ' + len0 + ' --> ' + len1 + ' --> ' + len2 + ' --> ' + this.midNodes.length);
    // console.log('point inserted Post:', this.midNodes,  len0 + ' --> ' + this.midNodes.length);
    this.refreshGui(); }

  remove() {
    console.log('edge.remove()');
    this['' + 'removedtwice'] = 1 + (+this['' + 'removedtwice'] || 0);
    if (this['' + 'removedtwice'] > 1) { U.pw(true, 'edge removed ' + this['' + 'removedtwice'] + ' times.', this); return; }
    U.arrayRemoveAll(this.start.edgesStart, this);
    U.arrayRemoveAll(this.end.edgesEnd, this);
    U.arrayRemoveAll(IEdge.all, this);
    U.arrayRemoveAll(IEdge.selecteds, this);
    const index = this.getIndex();
    this.logic.edges[index] = null;
    if (this.logic instanceof MReference) this.logic.mtarget[index] = null;
    if (this instanceof ExtEdge) U.arrayRemoveAll((this.logic as M2Class).extends, this.end.logic() as M2Class);
    this.shell.parentNode.removeChild(this.shell);
    // gc helper
    this.end = null;
    this.logic = null;
    this.tmpEnd = null;
    this.tmpEndVertex = null;
    this.endNode = null;
    this.midNodes = null;
    this.owner = null;
    this.start = null;
    this.startNode = null;
  }

  unsetTarget(): IVertex {
    const v: IVertex = this.end;
    if (!v) { return null; }
    this.end = null;
    U.arrayRemoveAll(v.edgesEnd, this);
    return v; }

  setTarget(v: IVertex): void {
    this.unsetTarget();
    this.end = v;
    if (v) { v.edgesEnd.push(this); } }
  mark(markb: boolean, key: string = 'errorGeneric', color: string = 'red'): void {
    U.pe(true, 'IEdge.mark() todo.');
  }


    private getEdgeHead(): SVGSVGElement { return this.getEdgeHeadTail(true); }
    private getEdgeTail(): SVGSVGElement { return this.getEdgeHeadTail(false); }
// bug: https://bugzilla.mozilla.org/show_bug.cgi?id=577785#c2
    private getEdgeHeadTail(isHead: boolean, debug: boolean = false): SVGSVGElement {
      const logic: IReference | IClass = this.logic;
      const logicref: IReference = logic instanceof IReference ? logic : null;
      const logicclass: IClass = logic instanceof IClass ? logic : null;
      let html: SVGSVGElement = null;
      let debugi: number;
      let edgeTailHeadSVG = isHead ? this.edgeHead : this.edgeTail;
      if (debug) {
        console.trace();
        console.log('getEdge' + (isHead ? 'Head' : 'Tail') + '(), ', this.getStyle().edgeHeadStyle, this.isHighlighted);
        debugi = window['' + 'debug'];
        if (debugi === 4.1) return  (edgeTailHeadSVG ? edgeTailHeadSVG : html) ; }
      if (isHead) {
        if (logicref && logicref.isContainment()) { html = this.generateContainmentHead(this.getStyle().edgeHeadStyle); }
        if (this instanceof ExtEdge) { html = this.generateGeneralizationHead(this.getStyle().edgeHeadStyle); }
      } else {
        if (logicref && logicref.isContainment()) { html = this.generateContainmentTail(this.getStyle().edgeHeadStyle); }
        if (this instanceof ExtEdge) { html = this.generateGeneralizationTail(this.getStyle().edgeHeadStyle); }
      }
      U.pe(this instanceof ExtEdge && !html, 'cannot return null on extedge:', html, this);
      if (debug && debugi === 4.2) return edgeTailHeadSVG ? edgeTailHeadSVG : html;
      if (!html) {
        if (isHead) this.edgeHead = null; else this.edgeTail = null;
        return null; }
      if (isHead) {
        if (html === this.edgeHead) return html;
        if (!html) return this.edgeHead = null;
        this.edgeHead = html;
        html.classList.add('Edge', 'EdgeHead');
        if (this.headShell) this.headShell.appendChild(html);
      }
      else {
        if (html === this.edgeTail) return html;
        if (!html) return this.edgeTail = null;
        this.edgeTail = html;
        html.classList.add('Edge', 'EdgeTail');
        if (this.tailShell) this.tailShell.appendChild(html);
      }
      return html; }


  private appendTailHead(tail: boolean, pathStr: string, debug: boolean = false) {
    const svg: SVGSVGElement = tail ? this.edgeTail : this.edgeHead;
    const shell: SVGGElement = tail ? this.tailShell : this.headShell;
    if (!svg) { return; }
    // debug = true;
    if (debug) U.cclear();
    const oldPathStr: string = pathStr;
    let startsub: number;
    let endsub: number;
    // filtro il pathStr estraendo solo i primi 2 o gli ultimi 2 punti. (migliora performance su edge pieni di edgepoints)
    let pt1: Point;
    let pt2: Point;
    if (!tail) {
      endsub = pathStr.length;
      startsub = pathStr.lastIndexOf('L');
      U.pe(startsub === -1, 'the pathString have no L (but should have at least 2 points)');
      startsub = pathStr.lastIndexOf('L', startsub - 1);
      if (startsub === -1) { startsub = 0; }
    } else {
      startsub = 0;
      endsub = pathStr.indexOf('L');
      U.pe(endsub === -1, 'the pathString have no L (but should have at least 2 points)');
      endsub = pathStr.indexOf('L', endsub + 1);
      if (endsub === -1) { endsub = pathStr.length; } }
    pathStr = pathStr.substring(startsub, endsub);
    U.pif(debug, 'pathStr: ' + oldPathStr + ' --> ' + pathStr, 'onEnd ? ', !tail);
    const points: Point[] = U.parseSvgPath(pathStr).pts;
    U.pe(points.length !== 2, 'expected exactly 2 points, the pathStr got substringed for that.', points);
    if (!tail) { pt1 = points[1]; pt2 = points[0]; } else { pt1 = points[0]; pt2 = points[1]; }
    if (debug) { this.owner.markg(pt1, true, 'red'); this.owner.markg(pt2, false, 'blue'); }

    U.pif(debug, 'size of head: ', svg, 'pt1:', pt1, 'pt2:', pt2, ', pts:', points, pathStr, oldPathStr);
    this.appendTailHead2(tail, pt1, pt2); }

  private appendTailHead2(tail: boolean, pt1: GraphPoint, pt2real: GraphPoint, debug: boolean = false): void {
    const m = GraphPoint.getM(pt1, pt2real);
    const svg: SVGSVGElement = tail ? this.edgeTail : this.edgeHead;
    let shell: SVGGElement = tail ? this.tailShell : this.headShell;
    const HeadSize: GraphSize = U.getSvgSize(svg);

    const firstEdgePointHtml: Node = this.html.nextElementSibling;
    if (!shell) {
      shell = U.newSvg('g');
      shell.appendChild(svg);
      if (tail) { this.tailShell = shell; } else { this.headShell = shell; }
      if (firstEdgePointHtml) {
        this.shell.insertBefore(shell, firstEdgePointHtml); }
      else { this.shell.appendChild(shell); }
      this.addEventListeners(false, true);
    }
    if (debug) { this.owner.markg(pt1, true, 'red'); this.owner.markg(pt2real, false, 'green'); }
    U.pif(debug, 'size of head: ', HeadSize, 'pt1:', pt1, 'pt2:', pt2real, 'm:', m);

    const degreeRad :number = pt1.degreeWith(pt2real, true); // U.TanToDegree(m);
    const center: GraphPoint = new GraphPoint(0, 0);
    const pt2: GraphPoint = new GraphPoint(0, 0);
    //todo: perchè zindex e position?
    // svg.style.zIndex = '' + 100;
    // svg.style.position = 'absolute';
    pt2.x = pt1.x - HeadSize.w * Math.cos(degreeRad);
    pt2.y = pt1.y - HeadSize.h * Math.sin(degreeRad);
    center.x = (pt1.x + pt2.x) / 2;
    center.y = (pt1.y + pt2.y) / 2;
    const degree = U.RadToDegree(degreeRad) + 90; // uso riferimento con 0 = top invece di 0 = right
    if (debug) { this.owner.markg(pt2, false, 'blue'); }
    shell.setAttributeNS(null, 'transform', 'rotate(' + degree + ' ' + center.x + ' ' + center.y + ')');
    (svg).setAttributeNS(null, 'x', '' + (center.x - HeadSize.w / 2));
    (svg).setAttributeNS(null, 'y', '' + (center.y - HeadSize.h / 2));
  }

  getIndex(): number { return this.logic.edges.indexOf(this); }
}
