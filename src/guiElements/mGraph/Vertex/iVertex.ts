import {
  Json,
  U,
  IEdge,
  IField,
  IPackage,
  M2Class,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  ISidebar,
  IGraph,
  IModel,
  IClass,
  Point,
  DamContextMenuComponent,
  Typedd,
  Status,
  Size,
  Model,
  IReference,
  Dictionary,
  DetectZoom,
  PropertyBarr,
  MClass,
  MReference,
  M2Reference,
  EOperation,
  EParameter,
  MAttribute,
  IPoint,
  GraphSize,
  GraphPoint,
  StyleComplexEntry,
  Type,
  EEnum,
  ELiteral,
  ExtEdge,
  IClassifier,
  Measurable,
  measurableRules,
  MeasurableRuleParts,
  MeasurableRuleLists,
  Draggableoptions,
  Resizableoptions,
  Rotatableoptions,
  DraggableOptionsImpl,
  ResizableOptionsImpl, StyleEditor, ReservedClasses,
} from '../../../common/Joiner';
import MouseMoveEvent = JQuery.MouseMoveEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import MouseEnterEvent = JQuery.MouseEnterEvent;
import MouseLeaveEvent = JQuery.MouseLeaveEvent;
import ClickEvent = JQuery.ClickEvent;
import ChangeEvent = JQuery.ChangeEvent;
import ContextMenuEvent = JQuery.ContextMenuEvent;
import KeyDownEvent = JQuery.KeyDownEvent;
import KeyUpEvent = JQuery.KeyUpEvent;
import KeyPressEvent = JQuery.KeyPressEvent;
import ResizableOptions = JQueryUI.ResizableOptions;
import DraggableOptions = JQueryUI.DraggableOptions;
import ResizableUIParams = JQueryUI.ResizableUIParams;
import DraggableEventUIParams = JQueryUI.DraggableEventUIParams;
import {FocusHistoryEntry} from '../../../common/util';
import {RotatableOptions} from '../../../common/measurable';

export class StartDragContext {
  size: GraphSize;
  // time: Date;
  // grid: GraphPoint;
  constructor(v: IVertex) {
    this.size = v.size.duplicate();
    // this.time = new Date();
    // this.grid = v.owner.grid.duplicate();
  }
}

export class IVertex {
  static all: Dictionary = {};
  static ID = 0;
  static selected: IVertex = null;
  static selectedGridWasOn: GraphPoint = null;
  static selectedStartPt: GraphPoint = null;
  static startDragContext: StartDragContext;
  private static minSize: GraphSize = null;
  private static defaultSize: GraphSize = null;
  public tolleranzaRightClickMove: number = 5;
  classe: IClassifier;
  // package: IPackage;
  owner: IGraph;
  fields: IField[] = [];
  edgesStart: IEdge[] = [];
  edgesEnd: IEdge[] = [];
  // styleRaw: SVGForeignObjectElement = null;
  // style: SVGForeignObjectElement = null;
  // position: GraphPoint;
  size: GraphSize;
  contains: IVertex[];
  id: number;
  htmlg: SVGGElement;
  // dragaxis: {x: boolean, y: boolean} = {x: true, y: true};
  // reshandles: {n: boolean, s: boolean, e: boolean, w: boolean, ne: boolean, nw: boolean, sw: boolean, se: boolean} = {n: false, s: false, e: false, w: false, ne: false, nw: false, sw: false, se: false};
  dragConfig: DraggableOptions;
  private htmlForeign: SVGForeignObjectElement;
  private Vmarks: Dictionary<string, SVGRectElement> = {};

  static staticinit(): GraphPoint {
    const g: GraphPoint = new GraphPoint(0, 0);
    g.x = 'prevent_doublemousedowncheck' as any;
    g.y = 'prevent_doublemousedowncheck' as any;
    IVertex.minSize = new GraphSize(null, null, 0, 0);
    IVertex.defaultSize = new GraphSize(5, 5, 201, 41);
    return IVertex.selectedGridWasOn = g; }
  /*
    static linkVertexMouseDownButton(e: MouseDownEvent): void {
      const ref: IReference = ModelPiece.get(e) as IReference;
      U.pe(!(ref instanceof IReference), 'linkVertexButtons are currently only allowed on IReferences.');
      const edges: IEdge[] = ref.getEdges();
      U.pe(!edges, 'ref.edges === null', ref);
      let edge: IEdge;
      let index: number;
      if (ref.getModelRoot().isMM()) { edge = edges[index = 0]; } else
      if (ref.upperbound > 0 && edges.length >= ref.upperbound) { edge = edges[index = ref.upperbound - 1]; }
      else { edge = new IEdge(ref); index = edges.length - 1; }
      if (!edge) edge = new IEdge(ref);
      IVertex.linkVertexMouseDown(e, edge); }*/

  static linkVertexMouseDown(e: MouseDownEvent, edge: IEdge = null, location: GraphPoint = null): void {
    if (e) { e.stopPropagation(); }
    if (IEdge.edgeChanging) { IEdge.edgeChanging.owner.edgeChangingAbort(e); }
    edge = edge ? edge : IEdge.get(e);
    U.pe(!edge, 'IVertex.linkVertexMouseDown() failed to get edge:', e);
    const logic: IClass | IReference = edge.logic;
    const classe: IClass = logic instanceof IClass ? logic : null;
    const ref: IReference = logic instanceof IReference ? logic : null;
    // U.pe( !ref, 'The .LinkVertex element must be inserted only inside a reference field.');
    IEdge.edgeChanging = edge;
    edge.useRealEndVertex = false;
    edge.useMidNodes = true;
    edge.tmpEnd = location ? location : GraphPoint.fromEvent(e);
    U.pe(!edge.tmpEnd, 'failed to get coordinates from event:', e);
    edge.tmpEndVertex = null;
    // edge.tmpEndVertex = ref.parent.getVertex();
    edge.refreshGui(); }

  static getvertex(e: Event | MouseEvent | MouseDownEvent | MouseUpEvent | MouseMoveEvent | MouseEnterEvent | MouseLeaveEvent | ClickEvent
    | KeyDownEvent | KeyUpEvent | KeyPressEvent | ChangeEvent): IVertex {
    return IVertex.getvertexByHtml(e.currentTarget as Element); }

  static getvertexByHtml(node0: Element): IVertex {
    let node: HTMLElement = node0 as HTMLElement
    U.pe(!node, 'getVertexByHtml: parameter is not a DOM node:', node);
    while (node && node.dataset && !node.dataset.vertexID) { node = node.parentElement; }
    // console.log('getVertex by id:' + node.dataset.vertexID, 'all:', IVertex.all);
    return node && node.dataset ? IVertex.getByID(+(node.dataset.vertexID)) : null; }

  static getByID(id: number): IVertex { return IVertex.all[id]; }

  static FieldNameChanged(e: ChangeEvent) {
    const html: Element = e.currentTarget;
    const modelPiece: ModelPiece = ModelPiece.getLogic(html);
    modelPiece.fieldChanged(e);
    modelPiece.getModelRoot().graph.propertyBar.show(null, html, null, true);
    // $(html).trigger('click'); // updates the propertyBar
    // const m: IModel = modelPiece.getModelRoot();
    const mm: IModel = Status.status.mm;
    const m: IModel = Status.status.m;
    setTimeout( () => { mm.refreshGUI(); m.refreshGUI(); }, 1); }

  static ChangePropertyBarContentClick(e: ClickEvent | MouseDownEvent, isEdge: IEdge = null): ModelPiece {
    const html: Element = e.target; // todo: approfondisci i vari tipi di classType (current, orginal...)
    const modelPiece: ModelPiece = ModelPiece.getLogic(html);
    const model: IModel = modelPiece.getModelRoot();
    U.pe(!modelPiece, 'failed to get modelPiece from html:', html);
    const pbar: PropertyBarr = model.graph.propertyBar;
    pbar.show(modelPiece, html, isEdge, false);
    return modelPiece; }

  static GetMarkedWith(markKey: string, colorFilter: string = null): IVertex[] {
    const ret: IVertex[] = [];
    for (const id in IVertex.all) {
      if (!IVertex.all[id]) { continue; }
      const vertex: IVertex = IVertex.all[id];
      if (vertex.isMarkedWith('refhover', colorFilter)) { ret.push(vertex); } }
    return ret; }

  constructor(logical: IClassifier, size: GraphSize = null) {
    if (!logical) return;
    this.id = IVertex.ID++;
    IVertex.all[this.id] = this;
    const graph: IGraph = logical.getModelRoot().graph;
    this.logic(logical);
    if (graph) { graph.addVertex(this); }
    this.contains = [];
    this.fields = [];
    this.edgesStart = [];
    this.edgesEnd = [];
    this.classe = logical;
    this.classe.vertex = this;
    this.setGraph(logical.getModelRoot().graph);
    if (!size) {
      size = IVertex.defaultSize;
      const gsize: Size = this.owner.getSize();
      size.x = this.owner.scroll.x + (gsize.w - size.w) / 2;
      size.y = this.owner.scroll.y + (gsize.h - size.h) / 2;
    }
    this.size = size;
    this.refreshGUI();
    // this.refreshGUI(); // need both refresh
  }

  mark(markb: boolean, key: string, color: string = 'red', radiusX: number = 10, radiusY: number = 10,
       width: number = 5, backColor: string = 'none', extraOffset: GraphSize = null): void {
    if (!this.isDrawn()) { return; }
    if (color === null) { color = 'yellow'; }
    if (radiusX === null) { radiusX = 10; }
    if (radiusY === null) { radiusY = 10; }
    if (backColor === null) { backColor = 'none'; }
    if (width === null) { width = 5; }
    let mark: SVGRectElement = this.Vmarks[key];
    if (key === 'refhover') { // crosshair (+), alias (default+link), cell (excel)
      const vertexRoot: SVGForeignObjectElement = this.htmlForeign;
      const $inputs = $(vertexRoot).find('input, textarea, select, button');
      let cursor: string = null;
      console.log('markedHover', markb, vertexRoot, $inputs);
      if (markb) {
        vertexRoot.style.cursor = cursor = (color === 'red' ? 'no-drop' : 'crosshair'); // NO important, bugga e non setta il campo.
      } else { vertexRoot.style.removeProperty('cursor'); }
      let i: number;
      for (i = 0; i < $inputs.length; i++) {
        if (!cursor) { $inputs[i].style.removeProperty('cursor'); } else { $inputs[i].style.cursor = cursor; }
      }
    }
    // mark off
    if (!markb) { // se non deve essere marchiato
      if (mark) { // ma lo è attualmente
        if (mark.parentNode) { mark.parentNode.removeChild(mark); }
        delete this.Vmarks[key]; }
      return; }
    // mark on
    if (!extraOffset) { const same = 5; extraOffset = new GraphSize(same, same, same, same); }
    mark = this.Vmarks[key] = U.newSvg<SVGRectElement>('rect');
    const size: GraphSize = this.getSize();
    // console.log('extraoffset:', extraOffset, 'size:', size);
    size.x -= extraOffset.x;
    size.y -= extraOffset.y;
    size.w += extraOffset.x + extraOffset.w;
    size.h += extraOffset.y + extraOffset.h;
    U.setSvgSize(mark, size, null);
    /*
    mark.setAttributeNS(null, 'x', '' + size.x);
    mark.setAttributeNS(null, 'y', '' + size.y);
    mark.setAttributeNS(null, 'width', '' + (size.w));
    mark.setAttributeNS(null, 'height', '' + (size.h));*/
    mark.setAttributeNS(null, 'rx', '' + (radiusX));
    mark.setAttributeNS(null, 'ry', '' + (radiusY));
    mark.setAttributeNS(null, 'stroke', '' + (color));
    mark.setAttributeNS(null, 'stroke-width', '' + (width));
    mark.setAttributeNS(null, 'fill', '' + (backColor));
    this.logic().getModelRoot().graph.vertexContainer.prepend(mark); }

  getStartPoint(nextPt: GraphPoint = null): GraphPoint { return this.getMidPoint(nextPt); }
  getEndPoint(nextPt: GraphPoint = null): GraphPoint { return this.getMidPoint(nextPt); }
  getMidPoint(prevPt: GraphPoint = null): GraphPoint {
    // NB: MAI fare sizeof() di un SVGForeignObjectElement, ridà valori sballati. fallo ai suoi childs.
    const html: HTMLElement = this.getHtmlFirstChild();
    const $htmlEP = $(html).find('.EndPoint');
    let htmlEP: HTMLElement;
    let endPointSize: Size;
    let pt: GraphPoint;
    if ($htmlEP.length === 0) { htmlEP = html; } else { htmlEP = $htmlEP[0]; }
    endPointSize = U.sizeof(htmlEP);
    // console.log('htmlsize:', htmlSize, 'childSize:', U.sizeof(html.firstChild as HTMLElement));
    // console.log('real size(', htmlSize, ') vs graphSize(', this.toGraphCoordS(htmlSize), '), html:', html);
    const endPointGSize: GraphSize = this.owner.toGraphCoordS(endPointSize);
    const vertexGSize = this.getSize();
    pt = endPointGSize.tl();
    pt.x += endPointGSize.w / 2;
    pt.y += endPointGSize.h / 2;
    if (! prevPt ) { return pt; }
    pt = GraphSize.closestIntersection(vertexGSize, prevPt, pt, this.owner.grid);
    U.pe(!U.isOnEdge(pt, vertexGSize), 'not on Vertex edge.');
    return pt; }

  setSize(size: GraphSize, refreshVertex: boolean = false, refreshEdge: boolean = true, trigger: string = null && measurableRules.onRotationEnd): void {
    const htmlForeign: SVGForeignObjectElement = this.getHtmlRawForeign();
    if (!size || this.getSize().equals(size)) { U.setSvgSize(htmlForeign, this.size, IVertex.defaultSize); return; }
    /*
    if(window['debug'] === 1) for (let key in IVertex.all) {
      let v2 = (IVertex.all[key] as IVertex);
      U.pe(v2 !== this && v2.size.equals(size), 'err:', this.getSize(), '->', size);
    }*/
    const oldsize: GraphSize = this.size.duplicate();
    this.size.x = (U.isNumerizable(size.x)) ? +size.x : this.size.x;
    this.size.y = (U.isNumerizable(size.y)) ? +size.y : this.size.y;
    this.size.w = (U.isNumerizable(size.w)) ? +size.w : this.size.w;
    this.size.h = (U.isNumerizable(size.h)) ? +size.h : this.size.h;
    // console.log('oldSize:', oldsize, 'new size candidate:', size, 'result:', this.size);
    U.setSvgSize(htmlForeign, this.size, IVertex.defaultSize);
    const pbar: PropertyBarr = this.owner.propertyBar;
    if (pbar && pbar.selectedModelPiece === this.logic() && pbar.styleEditor.isLoaded() && pbar.styleEditor.sizeInputx) {
      const se: StyleEditor = pbar.styleEditor;
      se.sizeInputx.value = '' + this.size.x;
      se.sizeInputy.value = '' + this.size.y;
      se.sizeInputw.value = '' + this.size.w;
      se.sizeInputh.value = '' + this.size.h; }
    // todo: cerca tutti gli as string, non è un vero cast ma solo un cambiotipo senza trasformazione, crea errori.
    // const spostamento: GraphPoint = this.size.tl().subtract(oldSize.tl(), true);
    // todo: cambia struttura interna size in tl+br, controlla tutti i riferimenti a tl(newinstnce = false) e considera di cambiarli a true.
    if (refreshVertex) { this.refreshGUI(); }
    if (refreshEdge) { this.refreshEdgesGUI(); }
    if (trigger) {
      let measnode = this.getMeasurableNode();
      if (measnode.classList.contains('measurable')) this.measuringEventTrigger(null, null, trigger, measnode); }
  }

  private draw(): void {
    // return this.draw0();
    try { this.draw0(); }
    catch(e) {
      U.pe(true, 'failed to draw vertex of "' + this.logic().printableNameshort() + '".', e);
    }
  }


  public isAutosize(): {x: boolean, y: boolean, atLeastOne: boolean} {
    const html: HTMLElement = this.getHtmlFirstChild();
    const autosizey: string = html.dataset.autosizey;
    const autosizex: string = html.dataset.autosizex;
    const ret: {x: boolean, y: boolean, atLeastOne: boolean} = {x: true, y: true, atLeastOne: null};
    const admittedStyles: string[] = ['auto', 'min-content', 'max-content'];
    const admittedDisplays: string[] = ['inline', 'inline-block', 'inline-flex'];
    if (autosizey !== '1' && autosizey !== 't' && autosizey !== 'true') { ret.y = false; }
    else if (admittedStyles.indexOf(html.style.height) === -1) {
      U.oneTime('autosize1key' + this.id, U.pw, true, 'To use autosize the root node must have "height: ' + admittedStyles.join('|') + ';", this has been automatically solved with "auto". was:' + html.style.height);
      html.style.height = 'auto'; }
    if (autosizex !== '1' && autosizex !== 't' && autosizex !== 'true') { ret.x = false; }
    else {
      if (admittedStyles.indexOf(html.style.width) === -1) {
        U.oneTime('autosize1key' + this.id, U.pw, true, 'To use autosize the root node must have "width: ' + admittedStyles.join('|') + ';", this has been automatically solved with "auto". was:' + html.style.width);
        html.style.width = 'auto'; }
      if (admittedDisplays.indexOf(html.style.display) === -1) {
        U.oneTime('autosize2key' + this.id, U.pw, true, 'To use autosizeWidth the root node must have "display: ' + admittedDisplays.join('|') + ';", this has been automatically solved with "inline-block". was:' + html.style.display);
        html.style.display = 'inline-block'; }
    }
    ret.atLeastOne = ret.x || ret.y;
    return ret; }

  private draw0(): void {
    /*const htmlRaw: SVGForeignObjectElement = U.newSvg('foreignObject');
    htmlRaw.appendChild(this.classe.getStyleObj().html);*/
    const style: StyleComplexEntry = this.classe.getStyle();
    const htmlRaw0: SVGForeignObjectElement = style.html as SVGForeignObjectElement;

    U.pe(!this.classe || !(htmlRaw0 instanceof Element), 'class null?', this, htmlRaw0);
    const htmlRaw: SVGForeignObjectElement = this.setHtmls(this.classe, htmlRaw0);
    if (this.classe instanceof IClass) this.drawC(this.classe);
    if (this.classe instanceof EEnum) this.drawE(this.classe);
    this.addEventListeners();
    U.fixHtmlSelected($(htmlRaw));
    Type.updateTypeSelectors($(this.getHtmlFirstChild()));
    // let onrefresh: string = this.htmlForeign.getAttribute('onrefreshgui');
    const $htmlraw = $(htmlRaw);
    let i: number;
    const parenttmp = htmlRaw.parentNode;
    const next = htmlRaw.nextSibling;
    if (parenttmp) parenttmp.removeChild(htmlRaw);
    // duplicate id removal. TODO: non funziona, forse rileva ancora gli id del vecchio html generato e risultano già inseriti on refresh.
    /*const idarr = $htmlraw.find('[id]').addBack('[id]');
    for (i = 0; i < idarr.length; i++) {
      if (!document.getElementById(idarr[i].id)) { continue; }
      idarr[i].innerHTML = '';
      U.clearAttributes(idarr[i]);
      idarr[i].style.display = 'none';
    }*/
    const scripts: JQuery<HTMLScriptElement> =  $htmlraw.find('script') as any;

    for(i = 0; i < scripts.length; i++) {
      // clone the script, empty it while keeping (to keep same indexedPath structure as the template), execute id
      // todo: problema: tutti i successivi elementi con id statici verranno rimossi e avranno struttura template != struttura ongraph
      //  e falliranno a mostrare il clicked fragment nello styleeditor.
      // non va bene: se cambio lo stile quello script appeso al body rimane e devo aggiornare la pagina.
      // since newlines are replaced with spaces, scripts inline // comments are not allowed. use /*comments*/
      // const oldid = scripts[i].id;
      // delete scripts[i].id;

      //console.log('script:', scripts[i], 'length:', scripts[i].innerHTML.length, scripts[i].innerText.length);
      if (!scripts[i].innerHTML.length) { continue; } // "deleted" empty element
      const cloned = scripts[i];
      /*const cloned: HTMLScriptElement = U.cloneHtml(scripts[i]); bug: probably getbyid is working on detached elements too.
      it is altering the ViewRule.
      cloned.id = oldid;
      scripts[i].innerHTML = '';
      document.body.appendChild(cloned);*/
      console.log('eval:', cloned.innerHTML);
      try { eval(cloned.innerHTML); } catch(e) { U.pw(true, 'error in user script of "' + this.logic().printableName()+ '":', e, 'script:', cloned); }
    }
    if (parenttmp) { if (next) parenttmp.insertBefore(htmlRaw, next); else parenttmp.appendChild(htmlRaw); }
    if (this.isAutosize().atLeastOne) this.autosizeNew(false, false);
  }

  public autosizeNew(refreshVertex: boolean = false, refreshEdge: boolean = true, trigger: string = null, autosizeobj: {x: boolean, y: boolean, atLeastOne: boolean} = null): IVertex {
    if (!autosizeobj) autosizeobj = this.isAutosize();
    if (!autosizeobj.atLeastOne) return this;
    let html: Element = this.getMeasurableNode();
    if (html.tagName.toLowerCase() === 'foreignobject') html = html.children[0];
    const actualSize = this.owner.toGraphCoordS(U.sizeof(html));
    actualSize.x = null;
    actualSize.y = null;
    if (!autosizeobj.x) actualSize.w = null;
    if (!autosizeobj.y) actualSize.h = null;
    // console.log('setSize:', actualSize, this.size, autosizeobj, html, U.sizeof(html));
    this.setSize(actualSize, refreshVertex, refreshEdge, trigger);
    return this; }

  private drawE(data: EEnum, canfail: boolean = true): void {
    try { this.drawE0(data); }
    catch(e) {
      if (!canfail) { throw e; }
      const style = data.getStyle();
      const styletype = style.isinstanceshtml ? 'inherited' : ( style.isownhtml ? 'personal' : 'default');
      U.pw(true, 'failed to draw ' + styletype + ' style of enum "' + data.printableNameshort() + '", his style will be resetted.', e);
      if (style.isinstanceshtml) style.view.htmli = null;
      if (style.isownhtml) style.view.htmlo = null;
      this.htmlForeign = null;
      this.drawE(data, false); }
  }
  private drawC(data: IClass, canfail: boolean = true): void {
    canfail = false;
    try { this.drawC0(data); }
    catch(e) {
      if (!canfail) { throw e; }
      const m: IModel = data.getModelRoot();
      const style = data.getStyle();
      const styletype = style.isinstanceshtml ? 'inherited' : ( style.isownhtml ? 'personal' : 'default');
      U.pw(true, 'failed to draw ' + styletype + ' style of ' + (m.isM() ? 'm1-object' : 'class') + ' "' + data.printableNameshort() + '", his style will be resetted.', e);
      if (style.isinstanceshtml) style.view.htmli = null;
      if (style.isownhtml) style.view.htmlo = null;
      this.htmlForeign = null;
      this.drawC(data, false); }
  }
  drawO(data: EOperation, canfail: boolean = true): Element {
    try { return this.drawO0(data); }
    catch(e) {
      if (!canfail) { throw e; }
      const m: IModel = data.getModelRoot();
      const style = data.getStyle();
      const styletype = style.isinstanceshtml ? 'inherited' : ( style.isownhtml ? 'personal' : 'default');
      U.pw(true, 'failed to draw ' + styletype + ' style of ' + m.getPrefix() + '-operation "' + data.printableNameshort() + '", his style will be resetted.', e);
      if (style.isinstanceshtml) style.view.htmli = null;
      if (style.isownhtml) style.view.htmlo = null;
      return this.drawO(data, false); }
  }
  drawParam(data: EParameter, canfail: boolean = true): Element {
    try { return this.drawParam0(data); }
    catch(e) {
      if (!canfail) { throw e; }
      const m: IModel = data.getModelRoot();
      const style = data.getStyle();
      const styletype = style.isinstanceshtml ? 'inherited' : ( style.isownhtml ? 'personal' : 'default');
      U.pw(true, 'failed to draw ' + styletype + ' style of ' + m.getPrefix() + '-parameter "' + data.printableNameshort() + '", his style will be resetted.', e);
      if (style.isinstanceshtml) style.view.htmli = null;
      if (style.isownhtml) style.view.htmlo = null;
      return this.drawParam(data, false); }
  }
  drawEChild(data: ELiteral): Element { return this.drawTerminal(data); }
  drawA(data: IAttribute): Element { return this.drawTerminal(data); }
  drawR(data: IReference): Element { return this.drawTerminal(data); }
  drawTerminal(data: Typedd, canfail: boolean = true): Element {
    try { return this.drawTerminal0(data); }
    catch(e) {
      if (!canfail) { throw e; }
      const m: IModel = data.getModelRoot();
      const style = data.getStyle();
      const styletype = style.isinstanceshtml ? 'inherited' : ( style.isownhtml ? 'personal' : 'default');
      U.pw(true, 'failed to draw ' + styletype + ' style of ' + m.getPrefix() + '"' + data.printableNameshort() + '", his style will be resetted.', e);
      if (style.isinstanceshtml) style.view.htmli = null;
      if (style.isownhtml) style.view.htmlo = null;
      return this.drawTerminal(data, false); }
  }
  private drawE0(logic: EEnum): void {
    if (!this.htmlForeign) {
      const style: StyleComplexEntry = this.classe.getStyle();
      this.htmlForeign = style.html as SVGForeignObjectElement; }
    const html: SVGForeignObjectElement = this.htmlForeign;
    /// append childrens:
    const $eContainer = $(html).find('.LiteralContainer');
    let i: number;
    for (i = 0; i < logic.childrens.length; i++) {
      const field = this.drawEChild(logic.childrens[i]);
      $eContainer.append(field); }
  }
  private drawC0(data: IClass): void {
    // console.log('drawC()');
    if (!this.htmlForeign) {
      const style: StyleComplexEntry = this.classe.getStyle();
      this.htmlForeign = style.html as SVGForeignObjectElement; }
    const html: SVGForeignObjectElement = this.htmlForeign;
    /// append childrens:
    const $attContainer = $(html).find('.AttributeContainer');
    const $refContainer = $(html).find('.ReferenceContainer');
    const $opContainer = $(html).find('.OperationContainer');

    // U.pe($attContainer.length !== 1, 'there must be exactly one element with class "AttributeContainer".', $attContainer);
    // U.pe($refContainer.length !== 1, 'there must be exactly one element with class "ReferenceContainer".', $refContainer);
    // U.pe($opContainer.length !== 1, 'there must be exactly one element with class "OperationContainer".', $opContainer);
    // const attContainer = $attContainer[0];
    // const refContainer = $refContainer[0];
    // const opContainer = $opContainer[0];

    let i: number;

    for (i = 0; i < data.attributes.length; i++) {
      const field = this.drawA(data.attributes[i]);
      field.id = 'ID' + data.attributes[i].id;
      $attContainer.append(field);
    }

    console.trace('4x', 'data.references:', data.references, data.references.length);
    for (i = 0; i < data.references.length; i++) {
      const field = this.drawR(data.references[i]);
      field.id = 'ID' + data.references[i].id;
      $refContainer.append(field);
    }

    const operations: EOperation[] = data.getOperations();
    for (i = 0; i < operations.length; i++) {
      // console.log('append ref:', data.references[i]);
      const field = this.drawO(operations[i]);
      field.id = 'ID' + operations[i].id;
      $opContainer.append(field); }
  }
  getStartPointHtml(): Element {
    const html: HTMLElement = this.getHtmlFirstChild();
    const $start = $(html).find('.StartPoint');
    if ($start.length > 0) { return $start[0]; } else { return html; } }
  getEndPointHtml(): Element {
    const html: Element = this.getHtmlFirstChild();
    const $start = $(html).find('.EndPoint');
    if ($start.length > 0) { return $start[0]; }
    return (html.tagName.toLowerCase() === 'foreignobject') ? html.firstChild as Element : html; }
  public getMeasurableNode(): Element { return this.htmlForeign; }
  private setHtmls(data: IClassifier, htmlRaw: SVGForeignObjectElement): SVGForeignObjectElement {
    // console.log('drawCV()');
    if (!this.htmlg) { this.owner.vertexContainer.appendChild(this.htmlg = U.newSvg('g'));  data.linkToLogic(this.htmlg); this.addRootEventListeners(); }
    else U.clear(this.htmlg);
    let i: number;
    const graphHtml: Element = this.owner.vertexContainer;
    const $graphHtml: JQuery<Element> = $(graphHtml);
    // console.log('drawing Vertex[' + data.name + '] with style:', htmlRaw, 'logic:', data);
    // console.log('drawVertex: template:', htmlRaw);
    const foreign: SVGForeignObjectElement = this.htmlForeign = U.textToSvg(U.replaceVars<SVGForeignObjectElement>(data, htmlRaw, true).outerHTML);
    this.htmlForeign.classList.add(ReservedClasses.vertexRoot);
    const $foreign = $(foreign);
    data.linkToLogic(foreign);
    const $elementWithID = $foreign.find('[id]');
    // duplicate prevention.
    for (i = 0; i < $elementWithID.length; i++) {
      const elem = $elementWithID[i];
      const id: string = '#' + elem.id;
      const $duplicate = $graphHtml.find(id);
      if ($duplicate.length) { $foreign.remove(id); }
    }
    this.htmlg.appendChild(foreign);
    foreign.id = 'ID' + data.id;
    foreign.dataset.vertexID = '' + this.id;
    if (!this.size) { this.size = this.getSize(); } else { this.setSize(this.size, false, false); }

    U.pe(this.htmlForeign.tagName.toLowerCase() !== 'foreignobject', 'The custom style root must be a foreignObject node.', this.htmlForeign);
    U.pe(this.htmlForeign.childNodes.length !== 1, 'The custom style must have a single child node,' +
      ' without spaces between <foreignObject> and the next tag. found ' + this.htmlForeign.childNodes.length + ' childrens.',
      this.htmlForeign, this.htmlForeign.childNodes);
    // this.html = this.htmlForeign.firstChild as HTMLElement;
    return foreign; }

  drawO0(data: EOperation): Element {
    const html: Element =  this.drawTerminal(data);
    const $html = $(html);
    const $signature = $html.find('.specialjs.signature');
    let i: number;
    for (i = 0; i < $signature.length; i++) {
      const htmldataset: HTMLElement = $signature[0] as HTMLElement;
      data.setSignatureHtml(htmldataset, ', ', +htmldataset.dataset.maxargumentchars, +htmldataset.dataset.maxarguments); }
    const $detailHtml: JQuery<HTMLElement> = $html.find('.operationDetail') as JQuery<HTMLElement> ;
    $signature.off('click.show').on('click.show', (e: Event) => {
      const target: Element = e.target as Element;
      let avoidToggle: boolean;
      switch (target.tagName.toLowerCase()) {
        case 'input':
        case 'textarea':
        case 'select': avoidToggle = true; break;
        default: avoidToggle = ((target instanceof HTMLElement) && target.isContentEditable); break; }
      if (avoidToggle) { return; }
      data.detailIsOpened = !data.detailIsOpened;
      data.detailIsOpened ? $detailHtml.show() : $detailHtml.hide();
      this.autosizeNew(false, true);
    });
    data.detailIsOpened ? $detailHtml.show() : $detailHtml.hide();

    $html.find('input.name').val(data.name);
    const $parameterList = $detailHtml.find('.parameterList');
    let j: number;
    for (j = 0; j < $parameterList.length; j++) {
      const parameterList = $parameterList[j];
      // U.clear(parameterList);
      const lastChild: Node = parameterList.childNodes[parameterList.childNodes.length - 1];
      for (i = 0; i < data.childrens.length; i++) {
        const field = this.drawParam(data.childrens[i]);
        parameterList.insertBefore(field, lastChild); }
      // for (i = oldChilds.length; i > 0; i--) { parameterList.prepend(oldChilds.item(i)); }
    }

    const $addParamButton = $html.find('.addParameterButton');
    // $addParamButton.html('<button style="width: 100%; height: 100%;">+</button>');
    $addParamButton.off('click.add').on('click.add', (e: Event) => { data.addParameter(); this.refreshGUI(); });
    return html; }

  drawParam0(data: EParameter): Element {
    let i: number;
    const html: Element = this.drawTerminal(data);
    const $html = $(html);
    // const $typeHtml: JQuery<HTMLSelectElement> = $html.find('select.fullType') as JQuery<HTMLSelectElement>;
    const $nameHtml: JQuery<HTMLInputElement> = $html.find('input.name') as JQuery<HTMLInputElement>;
    $nameHtml.val(data.name);
    return html; }


  drawTerminal0(data: Typedd): Element {
    data.replaceVarsSetup();
    const style: StyleComplexEntry = data.getStyle();
    const htmlRaw: Element = style.html;
    U.pe(!htmlRaw, 'failed to get attribute style:', data);
    // todo: sposta l'opearzione nei Graph.Field
    const html: Element = U.replaceVars<Element>(data, htmlRaw, true);
    data.linkToLogic(html as any);
    return html; }

  toEdge(start: IVertex, end: IVertex): IEdge {
    // todo
    U.pe(true, 'vertexToEdge() todo.');
    return null; }

  private addRootEventListeners(): void {
    const $html = $(this.htmlg);
    $html.off('mousedown.vertex').on('mousedown.vertex', (e: MouseDownEvent) => { this.onMouseDown(e); });
    $html.off('mouseup.vertex').on('mouseup.vertex', (e: MouseUpEvent) => { this.onMouseUp(e); });
    $html.off('mousemove.vertex').on('mousemove.vertex', (e: MouseMoveEvent) => { this.onMouseMove(e); });
    $html.off('mouseenter.vertex').on('mouseenter.vertex', (e: MouseEnterEvent) => { this.onMouseEnter(e); });
    $html.off('mouseleave.vertex').on('mouseleave.vertex', (e: MouseLeaveEvent) => { this.onMouseLeave(e); });
    $html.off('click').on('click', (e: ClickEvent) => { this.onClick(e); });
    $html.off('contextmenu').on('contextmenu', (e: ContextMenuEvent): boolean => { return this.vertexContextMenu(e); });
    // const $addFieldButtonContainer: JQuery<HTMLElement> = $html.find('.addFieldButtonContainer') as any as JQuery<HTMLElement>;
    // this.setAddButtonContainer($addFieldButtonContainer[0]);
   }
  private addEventListeners(): void {
    let i: number;
    const $html = $(this.htmlg);
    $html.find('.addFieldButton').off('click.addField').on('click.addField', (e: ClickEvent) => { this.addFieldClick(e); });
    $html.find('.AddFieldSelect').off('change.addField').on('change.addField',  (e: ChangeEvent) => { this.addFieldClick(e as any); });
    $html.find('input, select, textarea').off('change.fieldchange').on('change.fieldchange', (e: ChangeEvent) => IVertex.FieldNameChanged(e));
    // NB: deve essere solo un off, oppure metti selettore .NOT(class) nel selettore dei 'select' di sopra
    // if (!IVertex.contextMenu) { IVertex.contextMenu = new MyContextMenuClass(new ContextMenuService()); }
    $html.find('.Attribute, .Reference, .ELiteral, .Operation, .Parameter').off('contextmenu').on('contextmenu', (e: ContextMenuEvent): boolean => { return this.featureContextMenu(e); });

    // todo: viene chiamato 1 volta per ogni elementNode con modelID, ma io eseguo tutto dalla radice.
    // quindi viene eseguito N +1 volte per ogni vertice dove N sono i suoi (attributes + references)
    // console.log(html.tagName, html.dataset.modelpieceid);
    // if (html.tagName.toLowerCase() === 'foreignobject' && html.dataset.modelpieceid )
    //   { html = html.firstChild as Element; }
    // while (!(html.classList.contains('Vertex'))) { console.log(html); html = html.parentNode as Element; }
    // $html.find('.LinkVertex').off('mousedown.setReference').on('mousedown.setReference', IVertex.linkVertexMouseDownButton);
    const defaultResizeConfig: ResizableOptions = new ResizableOptionsImpl();
    const defaultDragConfig: DraggableOptions = new DraggableOptionsImpl();
    const defaultRotConfig: RotatableOptions = new RotatableOptions();
    // NB: do not delete the apparantly useless dynamic functions.
    // jqueryui is binding this to e.currentTarget and e.currentTarget to document.body, the dynamic function makes this instanceof iVertex again.
    // defaultResizeConfig.create = (e: Event, ui: ResizableUIParams) => this.measuringTrigger(ui, e, measurableRules.onRefresh);
    defaultResizeConfig.start = (e: Event, ui: ResizableUIParams) => this.measuringEventTrigger(ui, e, measurableRules.onResizeStart);
    defaultResizeConfig.resize = (e: Event, ui: ResizableUIParams) => this.measuringEventTrigger(ui, e, measurableRules.whileResizing);
    defaultResizeConfig.stop = (e: Event, ui: ResizableUIParams) => this.measuringEventTrigger(ui, e, measurableRules.onResizeEnd);
    // defaultDragConfig.create = (e: Event, ui: DraggableEventUIParams) => this.measuringTrigger(ui, e, measurableRules.onRefresh);
    defaultDragConfig.start = (e: Event, ui: DraggableEventUIParams) => this.measuringEventTrigger(ui, e, measurableRules.onDragStart);
    defaultDragConfig.drag = (e: Event, ui: DraggableEventUIParams) => this.measuringEventTrigger(ui, e, measurableRules.whileDragging);
    defaultDragConfig.stop = (e: Event, ui: DraggableEventUIParams) => this.measuringEventTrigger(ui, e, measurableRules.onDragEnd);
    defaultRotConfig.start = (e: Event, ui: DraggableEventUIParams) => this.measuringEventTrigger(ui, e, measurableRules.onRotationStart);
    defaultRotConfig.rotate = (e: Event, ui: DraggableEventUIParams) => this.measuringEventTrigger(ui, e, measurableRules.whileRotating);
    defaultRotConfig.stop = (e: Event, ui: DraggableEventUIParams) => this.measuringEventTrigger(ui, e, measurableRules.onRotationEnd);
    this.dragConfig = null;
//     console.log('measurableElementSetup:', defaultResizeConfig, defaultDragConfig);
    // todo: sta cosa potrei eliminarla se uso jqui.create oppure li cerco mentre creo il $(node).resizable(resConfig);
    Measurable.measurableElementSetup($html, defaultResizeConfig, defaultRotConfig, defaultDragConfig, this);
    const $elementsWithRefreshTrigger = $html.find('.' + ReservedClasses.onRefresh);
    for (i = 0; i < $elementsWithRefreshTrigger.length; i++) {
      const elem: Element = $elementsWithRefreshTrigger[i];
      this.measuringEventTrigger(null, null, measurableRules.onRefresh, elem);
    }
  }

  measuringEventTrigger(uiseless: ResizableUIParams | DraggableEventUIParams = null, e: Event = null, prefix: string, html: Element = null): void {
    if (!html) html = e.target as Element;
    // console.log('measuringEventTrigger:', prefix); // , html, e);
    if (!html.attributes) return;
    let i: number;
    for (i = 0; i < html.attributes.length; i++) {
      const a: Attr = html.attributes[i];
      if (a.name.indexOf(prefix.toLowerCase()) !== 0) continue;
      new MeasurableRuleParts(a, prefix).process(false, this, this.owner);
    }
  }

  /*
    measuringInit(ui: ResizableUIParams | DraggableEventUIParams, e: Event): void {
      const m = U.measurableGetArrays(null, e);
      console.log('measuringInit:', ui, e, m);
      let i: number;
      const size: Size = U.sizeof(m.html);
      const absTargetSize: Size = this.owner.getSize();
      const logic: IClassifier = this.logic();
      for (i = 0; i < m.variables.length; i++) { U.processMeasurableVariable(m.variables[i], logic, m.html, size, absTargetSize); }
      for (i = 0; i < m.dstyle.length; i++) { U.processMeasurableDstyle(m.dstyle[i], logic, m.html, null, absTargetSize); }
      for (i = 0; i < m.imports.length; i++) { U.processMeasurableImport(m.imports[i], logic, m.html, null, absTargetSize); }
    }

    measuringChanging(ui: ResizableUIParams | DraggableEventUIParams, e: Event, measurHtml: Element = null): void {
      const m: MeasurableArrays = U.measurableGetArrays(measurHtml, e);
      console.log('Changing.measurableHtml parsed special attributes:', m);
      m.imports = [];
      m.chainFinal = [];
      // m.dstyle = [];
      // m.rules = [];
      // m.variables = [];
      U.processMeasuring(this.logic(), m, ui);
    }

    measuringChanged(ui: ResizableUIParams | DraggableEventUIParams, e: Event, measurHtml: Element = null): void {
      const m = U.measurableGetArrays(measurHtml, e);
      console.log('Changed.measurableHtml parsed special attributes:', m);
      m.chain = [];
      m.imports = [];
      U.processMeasuring(this.logic(), m, ui);
    }*/


  clickSetReference(e: ClickEvent | MouseUpEvent | MouseDownEvent, debug: boolean = true): void {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    const edge: IEdge = IEdge.edgeChanging;
    if (!edge) { return; }
    U.pif(debug, 'setreferenceClick success!');
    const vertexLogic: IClassifier = this.logic();
    if (!(vertexLogic instanceof IClass)) return;
    if (!edge.canBeLinkedTo(vertexLogic)) {
      U.pif(debug, 'edge ', edge.logic, 'cannot be linked to ', vertexLogic, 'hoveringvertex:', this);
      return; }
    if (edge.logic instanceof MReference) edge.logic.linkClass(vertexLogic as MClass, edge.getIndex(), true);
    if (edge.logic instanceof M2Reference) edge.logic.setType((vertexLogic as M2Class).getEcoreTypeName());
    if (edge instanceof ExtEdge) {
      if (edge.end) U.arrayRemoveAll(edge.logic.extends,edge.end.logic() as M2Class);
      U.ArrayAdd(edge.logic.extends, this.logic() as M2Class);
    } else {
      U.pe(edge.logic instanceof MClass, 'cst: class edges are currently not supported');
    }
    this.mark(false, 'refhover');
    // altrimenti parte l'onClick su AddFieldButton quando fissi la reference.
    // setTimeout( () => { IEdge.edgeChanging = null; }, 1);
    IEdge.edgeChangingStopTime = Date.now();
    IEdge.edgeChanging = null;
    edge.tmpEnd = null;
    edge.useMidNodes = true;
    edge.useRealEndVertex = true;
    edge.end = this;
    edge.refreshGui(); }

  onClick(e: ClickEvent): void {
    // IVertex.ChangePropertyBarContentClick(e);
  }

  vertexContextMenu(evt: ContextMenuEvent): boolean { return this.onContextMenuInner(evt,  '.Vertex'); }
  featureContextMenu(evt: ContextMenuEvent): boolean { return this.onContextMenuInner(evt,  '.Feature'); }

  private onContextMenuInner(evt: ContextMenuEvent, classSelector: string): boolean {
    DamContextMenuComponent.contextMenu.hide();
    // only if is focused input
    const lastSelected: FocusHistoryEntry = U.focusHistoryEntries[U.focusHistoryElements.length - 1];
    const gotSelectedNow: boolean = lastSelected && U.isParentOf(lastSelected.element, evt.target) && (new Date().valueOf() - lastSelected.time.valueOf() < 0.3 * 1000);
    const isInput = U.isInput(evt.target, true, false) && !gotSelectedNow;
    const pixelMoved = this.size.tl().subtract(IVertex.startDragContext.size.tl(), false).absolute();
    const gotMoved = pixelMoved >= this.tolleranzaRightClickMove;
    const ret: boolean = isInput && !gotMoved;
    if (ret) return true; else { evt.preventDefault(); evt.stopPropagation(); }
    if (gotMoved) return ret;
    DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), classSelector, evt.currentTarget);
    return false; }

  onMouseDown(e: MouseDownEvent): void {
    if (IEdge.edgeChanging) { this.clickSetReference(e); return; }
    let target: HTMLElement = e.target as HTMLElement;
    if (!U.isChildrenOf(target, Status.status.getActiveModel().graph.container)) return;
    // console.log(e.button, e.buttons, e);
    const parentLine: Element[] = U.getParentLine(target, this.getMeasurableNode(), true, false, true);
    const measurables: JQuery<Element> = $(parentLine).filter('.measurable');
    const clickedOnMeasurableChildren: boolean = !!measurables.length;
    if (e.button !== U.mouseLeftButton && clickedOnMeasurableChildren) { e.stopPropagation(); }
    if (e.button === U.mouseLeftButton && (U.isInput(target, true) || clickedOnMeasurableChildren)) { return; }
    if (e.button === U.mouseWheelButton) { this.owner.onMouseDown(e, true); return; }

    IVertex.selected = this;
    IVertex.startDragContext = new StartDragContext(this);

    if (IVertex.selectedGridWasOn.x as any === 'prevent_doublemousedowncheck') {
      IVertex.selectedGridWasOn.x = IVertex.selected.owner.grid.x; }
    if (IVertex.selectedGridWasOn.y as any === 'prevent_doublemousedowncheck') {
      IVertex.selectedGridWasOn.y = IVertex.selected.owner.grid.y; }
    IVertex.selected.owner.grid.x = null;
    IVertex.selected.owner.grid.y = null;
    IVertex.selectedStartPt = this.owner.toGraphCoord(new Point(e.pageX, e.pageY));
    IVertex.selectedStartPt.subtract(this.size.tl(), false); }

  onMouseUp(e: MouseUpEvent): void {
    if (IEdge.edgeChanging) { this.clickSetReference(e); return; }
  }

  onMouseMove(e: MouseMoveEvent): void { }
  onMouseEnter(e: MouseEnterEvent): void { this.mouseEnterLinkPreview(e); }
  onMouseLeave(e: MouseLeaveEvent): void { this.mouseLeaveLinkPreview(e); }

  mouseEnterLinkPreview(e: MouseEnterEvent): void {
    const edge: IEdge = IEdge.edgeChanging;
    if (!edge) { return; }
    const ref: IReference | IClass = edge.logic;
    /*const edges: IEdge[] = ref.getEdges();
    U.pe(!edges, 'ref.edges === null', ref);
    let edge: IEdge;
    if (ref.upperbound > 0 && edges.length - 1 >= ref.upperbound) { edge = edges[edges.length - 1]; } else { edge = new IEdge(ref); }*/
    const html2: Element = e.currentTarget as HTMLElement | SVGGElement;
    // while (html2 && html2.classList && !html2.classList.contains('vertexShell')) { html2 = html2.parentNode as Element;}
    let hoveringTarget: IClassifier = html2 ? ModelPiece.getLogic(html2) as IClassifier : null;
    U.pe(!hoveringTarget || !(hoveringTarget instanceof IClassifier),
      'the currentTarget should point to the vertex root, only classifier should be retrieved.', hoveringTarget, e, html2);
    const linkable: boolean = hoveringTarget instanceof IClass ? edge.canBeLinkedTo(hoveringTarget) : false;
    const size: GraphSize = hoveringTarget.getVertex().getSize();
    const width = 3;
    const pad = 5 + width;
    const padding: GraphSize = new GraphSize(pad, pad, pad, pad);
    const vertex: IVertex = hoveringTarget.getVertex();
    // const oldHoverVertex: IVertex = window.oldEdgeLink_HoveringVertex;
    // if (oldHoverVertex) { vertex.mark(false, 'refhover'); }
    // window.oldEdgeLink_HoveringVertex = vertex;
    vertex.mark(true, 'refhover',
      linkable ? 'green' : 'red',
      (size.w + padding.x + padding.w) / 10,
      (size.h + padding.y + padding.h) / 10,
      width, null, padding);
    edge.tmpEndVertex = hoveringTarget.getVertex();
    // NB: serve farlo 2 volte, alla prima ripristina il targetEnd ma non corregge lo startingpoint adattandolo alla nuova destinazione.
    edge.refreshGui(null, false); edge.refreshGui(null, false); }

  mouseLeaveLinkPreview(evt: MouseLeaveEvent, debug: boolean = true): void {
    if (!IEdge.edgeChanging) { return; }
    const edge: IEdge = IEdge.edgeChanging;
    U.pif(debug, 'vertexLeave()');
    edge.tmpEndVertex = null;
    edge.tmpEnd = GraphPoint.fromEvent(evt);
    this.mark(false, 'refhover'); }

  addFieldClick(e: ClickEvent): void {
    // impedisco che un click mentre fisso un edge triggeri altre cose, 100ms di "cooldown"
    if (IEdge.edgeChanging || Date.now() - IEdge.edgeChangingStopTime < 100) { return; }
    const modelPiece: IClassifier = this.logic();
    const classe: M2Class = modelPiece instanceof M2Class ? modelPiece : null;
    const enumm: EEnum = modelPiece instanceof EEnum ? modelPiece : null;
    U.pe(!enumm && !classe, 'AddFieldClick should only be allowed on M2-Classes or enumerations.');

    U.pe(!this.classe, 'called addFieldClick on a package');
    Status.status.debug = true;
    const html = this.getHtmlFirstChild();
    let select: HTMLSelectElement;
    // const debugOldJson = U.cloneObj(modelPiece.generateModel());
    select = $(html).find('.AddFieldSelect')[0] as unknown as HTMLSelectElement;
    switch (select.value.toLowerCase()) {
      default: U.pe(true, 'unexpected select value for addField:' + select.value + ' allowed values are: ["Reference", "Attribute", "Operation", "Literal"]'); break;
      case 'reference': U.pe(!classe, '"Reference" as .AddFieldSelect value is only allowed on M2-classes'); classe.addReference(); break;
      case 'attribute': U.pe(!classe, '"Attribute" as .AddFieldSelect value is only allowed on M2-classes'); classe.addAttribute(); break;
      case 'operation': U.pe(!classe, '"Operation" as .AddFieldSelect value is only allowed on M2-classes'); classe.addOperation(); break;
      case 'literal': U.pe(!enumm, '"Literal" as .AddFieldSelect value is only allowed on Enumerations'); enumm.addLiteral(); break; }
  }
  /*
    setAddButtonContainer(container: HTMLElement): void {
      U.toHtml('<span style="display:flex; margin:auto;">Add&nbsp;</span>' +
        '<select class="AddFieldSelect" style="display:flex; margin:auto;"><optgroup label="FeatureType">' +
        '<option value="Attribute" selected="">Attribute</option>' +
        '<option value="Reference">Reference</option>' +
        '<option value="Operation">Operation</option>' +
        '</optgroup></select>' +
        '<span style="display:flex; margin:auto;">&nbsp;field</span>\n' +
        '<button>Go</button>', container); }
  */
  setFields(f: IField[]) {
    this.fields = f;
  }

  setGraph(graph: IGraph) {
    U.pe(!graph, 'Vertex should only be created after Graph initialization.');
    this.owner = graph; }

  refreshGUI(): void { this.draw(); }

  refreshEdgesGUI(): void {
    const refEnd: IEdge[] = this.edgesEnd; // this.getReferencesEnd();
    const refStart: IEdge[] = this.edgesStart; // this.getReferencesStart();
    let i: number;
    for (i = 0; i < refEnd.length; i++) { if (refEnd[i]) { refEnd[i].refreshGui(); } }
    for (i = 0; i < refStart.length; i++) { if (refStart[i]) { refStart[i].refreshGui(); } } }

  moveTo(graphPoint: GraphPoint, gridIgnore: boolean = false): void {
    // console.log('moveTo(', graphPoint, '), gridIgnore:', gridIgnore, ', grid:');
    // const oldsize: GraphSize = this.size; // U.getSvgSize(this.logic().html as SVGForeignObjectElement);
    if (!gridIgnore) { graphPoint = this.owner.fitToGrid(graphPoint); }
    this.setSize(new GraphSize(graphPoint.x, graphPoint.y, null, null), false, true, measurableRules.whileDragging);
  }

  logic(set: IClassifier = null): IClassifier {
    if (set) { return this.classe = set; }
    return this.classe; }
  // todo: elimina differenze html e htmlforeign o almeno controlla e riorganizza
  getHtmlRawForeign(): SVGForeignObjectElement { return this.htmlForeign; }
  getHtmlFirstChild(): HTMLElement { return this.htmlForeign.firstChild as HTMLElement; }
  minimize(): void {
    U.pe(true, 'minimize() to do.');
  }

  isDrawn(): boolean { return !!(this.htmlForeign && this.htmlForeign.parentNode); }

  /*pushDown(): void {
    if (!this.isDrawn()) { return; }
    const html = this.htmlForeign;
    const parent = html.parentNode;
    parent.removeChild(html);
    parent.appendChild(html); }

  pushUp(): void {
    if (!this.isDrawn()) { return; }
    const html = this.htmlForeign;
    const parent = html.parentNode;
    parent.removeChild(html);
    parent.prepend(html); }*/

  remove() {
    console.log('IVertex.delete();');
    let i: number;
    // for (i = 0; i < this.edgesStart.length; i++) {}
    let arr: IEdge[];
    arr = U.ArrayCopy(this.edgesStart, false);
    for (i = 0; i < arr.length; i++) { arr[i].remove(); }
    arr = U.ArrayCopy(this.edgesEnd, false);
    for (i = 0; i < arr.length; i++) { arr[i].remove(); }
    const html = this.htmlForeign;
    html.parentNode.removeChild(html);
    delete IVertex.all[this.id];
    for (const key in this.Vmarks) {
      if (this.Vmarks[key]) { continue; }
      const mark: SVGRectElement = this.Vmarks[key];
      if (mark.parentNode) { mark.parentNode.removeChild(mark); } }
    U.arrayRemoveAll(this.owner.vertex, this);
    this.classe.vertex = null;

    const fields: IField[] = U.ArrayCopy(this.fields, false);
    for (i = 0; i < fields.length; i++) { fields[i].remove(); }

    // gc helper
    this.owner = null;
    this.size = null;
    this.edgesStart = null;
    this.edgesEnd = null; }

  getSize(debug: boolean = false): GraphSize {
    const html0: SVGForeignObjectElement = this.htmlForeign;
    let sizeOld: GraphSize;
    if (debug) {
      sizeOld = this.size ? this.size.duplicate() : null;
      if (this.size) { this.owner.markgS(this.size, true, 'blue'); }
    }
    const size: GraphSize = this.size = U.getSvgSize(html0, IVertex.minSize);
    U.pe(debug && !sizeOld.equals(size), 'Wrong size. this:', this);
    return this.size; }

/// end of IVertex
  isMarkedWith(markKey: string, colorFilter: string = null) {
    if (!this.Vmarks.hasOwnProperty(markKey)) { return false; }
    if (!colorFilter) { return true; }
    const markRect: SVGRectElement = this.Vmarks[markKey];
    return (markRect.getAttributeNS(null, 'stroke') === colorFilter);
  }

}
