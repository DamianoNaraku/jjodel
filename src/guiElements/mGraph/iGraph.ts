import {
  Json,
  U,
  IEdge,
  IVertex,
  IPackage,
  M2Class,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  ISidebar,
  IModel,
  Status,
  Size,
  IReference,
  GraphPoint,
  GraphSize,
  PropertyBarr,
  Dictionary,
  IClass,
  ViewPoint,
  EOperation,
  EParameter,
  Point,
  EEnum,
  ExtEdge,
  measurableRules,
  DamContextMenu,
  Model, IClassifier
} from '../../common/Joiner';
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import MouseMoveEvent = JQuery.MouseMoveEvent;
import ClickEvent = JQuery.ClickEvent;
import KeyDownEvent = JQuery.KeyDownEvent;
import BlurEvent = JQuery.BlurEvent;
import ChangeEvent = JQuery.ChangeEvent;
import {StartDragContext} from './Vertex/iVertex';
import ContextMenuEvent = JQuery.ContextMenuEvent;
import {Layouting} from './Layouting';
import {Keystrokes} from '../../common/util';


export class ViewPointShell {
  graph: IGraph;
  model: IModel;
  html: HTMLElement;
  $html: JQuery<HTMLElement>;
  $template: JQuery<HTMLLIElement>;
  template: HTMLLIElement;
  lastVP: ViewPoint = null; // se ne sono attivi multipli e modifichi lo stile di qualcosa, questo sarà quello che viene aggiornato.
  defaultCheckbox: HTMLInputElement;
  checkboxes: HTMLInputElement[];
  ignoreEvents: boolean;
  getViewpointGUI: Dictionary<number /*Viewpoint.id*/, HTMLLIElement> = {};
  constructor(g: IGraph) {
    this.graph = g;
    this.model = g.model;
    this.$html = $(g.container.parentElement).find('.viewpointShell');
    this.html = this.$html[0];
    this.$template = this.$html.find('li.viewpointrow.template') as JQuery<HTMLLIElement>;
    this.template = this.$template[0];
    const $checkboxlidefault = this.$html.find('li.viewpointrow.default');
    const $defaultCheckbox = $checkboxlidefault.find('input[type="radio"]') as JQuery<HTMLInputElement>;
    this.defaultCheckbox = $defaultCheckbox[0];
    this.checkboxes = [];
    this.getViewpointGUI = {};
    let i: number;
    // this.ignoreEvents = false;
    $defaultCheckbox.on('click', (e: ClickEvent) => { this.undoAll(true); });
    $checkboxlidefault.find('button.duplicate').on('click', (e: ClickEvent) => this.duplicateEvent(e, null, this.defaultCheckbox) );
  }
  /*undoAllOld(model :IModel): void {
    let i1: number;
    let i2: number;
    let i3: number;
    let i4: number;
    model.graph.gridDisplay = IGraph.defaultGridDisplay;
    model.graph.scroll = new GraphPoint(0, 0);
    model.graph.setZoom(IGraph.defaultZoom);
    model.graph.setGrid(IGraph.defaultGrid);
    const undostyle = (m: ModelPiece) => { m.resetViews(); };
    for (i1 = 0; i1 < model.childrens.length; i1++) {
      const pkg: IPackage = model.childrens[i1];
      undostyle(pkg);
      for (i2 = 0; i2 < pkg.childrens.length; i2++) {
        const c: IClass = pkg.childrens[i2];
        undostyle(c);
        c.shouldBeDisplayedAsEdge(false);
        for (i3 = 0; i3 < c.attributes.length; i3++) {
          const a: IAttribute = c.attributes[i3];
          undostyle(a); }
        for (i3 = 0; i3 < c.references.length; i3++) {
          const r: IReference = c.references[i3];
          undostyle(r); }
        const operations = c.getOperations();
        for (i3 = 0; i3 < operations.length; i3++) {
          const o: EOperation = operations[i3];
          undostyle(o);
          for (i4 = 0; i4 < o.childrens.length; i4++) {
            const p: EParameter = o.childrens[i4];
            undostyle(p); }
        }
      }
    }
    model.refreshGUI_Alone();
  }*/
  undoAll(changingGuiChecked: boolean): void {
    let i: number;
    // de-apply all
    for (i = 0; i < this.model.viewpoints.length; i++) { this.model.viewpoints[i].detach(); }
    // update gui
    this.ignoreEvents = true;
    if (changingGuiChecked) {
      for (i = 0; i < this.checkboxes.length; i++) { this.checkboxes[i].checked = false; }
     // this.graph.model.refreshGUI_Alone();
    }
    const defaultradio: HTMLInputElement = this.$html.find('input[type="radio"]')[0] as HTMLInputElement;
    defaultradio.checked = true;
    this.ignoreEvents = false;
    this.refreshApplied();
  }

  refreshApplied(): void {
    // this.undoAll(false);
    let i: number;
    let stylecustomized: boolean = false;
    const makeSureAllCheckboxesAreProcessed: HTMLInputElement[] = this.checkboxes.slice();
    this.graph.propertyBar.styleEditor.hide();
    for (i = this.model.viewpoints.length; --i >= 0; ) {
      const vp: ViewPoint = this.model.viewpoints[i];
      const checkbox: HTMLInputElement = this.getCheckbox(vp);
      U.pe(!checkbox, 'failed to get checkbox of:', vp, this);
      U.arrayRemoveAll(makeSureAllCheckboxesAreProcessed, checkbox);
      stylecustomized = stylecustomized || checkbox.checked;
      vp.apply();
      vp.isApplied = checkbox.checked;
      // if (vp.isApplied === checkbox.checked) { continue; }
      // if (vp.isApplied) { vp.detach(); } else { vp.apply(); } // just used to set isapplied
    }
    const defaultradio: HTMLInputElement = this.$html.find('input[type="radio"]')[0] as HTMLInputElement;
    defaultradio.checked = !stylecustomized;
    this.updatelastvp();
    const isM2: boolean = true; // this.graph.model.isM2(); per qualche motivo è false se cambio una checkbox in m2, ha collegato modello sbagliato?

    if (stylecustomized) {
      this.graph.model.refreshGUI();
      if (isM2) Status.status.m.refreshGUI();
      this.graph.propertyBar.styleEditor.show();
      if (isM2) { Status.status.m.graph.propertyBar.styleEditor.show(); }
    }
    else {
      try {
        this.graph.model.refreshGUI_Alone();
      } catch(e) {
        console.error('error while disabling all vp(0):', e);
        this.graph.propertyBar.styleEditor.hide();
      }
    }
    setTimeout( () => {
      if (isM2)
        try {
          Status.status.m.refreshGUI();
        } catch(e) {
          console.error('error while disabling all vp(1):', e);
          Status.status.m.graph.propertyBar.styleEditor.hide(); }

      this.graph.propertyBar.styleEditor.show();
      if (isM2) Status.status.m.graph.propertyBar.styleEditor.show();
    }, 10);
  }
  duplicateEvent(e: ClickEvent, oldvp: ViewPoint, oldvpCheckbox: HTMLInputElement, debug: boolean = false): void {
    U.pif(debug, 'duplicate(' + (oldvp ? oldvp.name : null) + ') Start:', this.model.viewpoints);
    // const vp: ViewPoint = ViewPoint.get($input[0].value);
    let newvp: ViewPoint = new ViewPoint(this.model, oldvp ? oldvp.name : null);
    if (oldvp) { newvp.clone(oldvp); newvp.updateTarget(this.model); }
    this.ignoreEvents = true;
    this.add(newvp, false);
    if (oldvpCheckbox) { oldvpCheckbox.checked = false; }
    this.ignoreEvents = false;
    this.refreshApplied();
    U.pif(debug, 'duplicate() End:', this.model.viewpoints);
  }

  add(v: ViewPoint, allowApply: boolean): void {
    const $li: JQuery<HTMLLIElement> = this.$template.clone();
    const li: HTMLLIElement = $li[0];
    const $checkbox: JQuery<HTMLInputElement> = $li.find('input[type="checkbox"]') as any;
    const checkbox: HTMLInputElement = $checkbox[0];
    this.checkboxes.push(checkbox);
    this.getViewpointGUI[v.id] = li;
    const $input: JQuery<HTMLInputElement> = $li.find('input.name') as any;
    const input: HTMLInputElement = $input[0];
    const $duplicate: JQuery<HTMLButtonElement> = $li.find('button.duplicate') as any;
    const $delete: JQuery<HTMLButtonElement> = $li.find('button.remove') as any;
    const $rename: JQuery<HTMLButtonElement> = $li.find('button.edit') as any;

    $duplicate.on('click', (e: ClickEvent) => this.duplicateEvent(e, v, checkbox));
    $delete.on('click', (e: ClickEvent) => {
      this.html.removeChild(li);
      U.arrayRemoveAll(this.checkboxes, checkbox);
      delete this.getViewpointGUI[v.id];
      v.delete(); });
    $rename.on('click', (e: ClickEvent) => {
      input.readOnly = false;
      input.focus();
      //
      //
      // $rename.hide(); $delete.hide(); $duplicate.hide();
    });
    const inputConfirm = (key: string) => {
      console.log('vprename ?', key);
      switch (key) {
        default: return;
        case Keystrokes.numpadEnter:
        case Keystrokes.enter: v.setname(input.value); break;
        case Keystrokes.escape: break; }
      let oldVal = input.value;
      input.value = v.name;
      input.readOnly = true;
      console.log('vprename ok:', v.name, input.value, oldVal);
    };
    $input.on('keydown', (e: KeyDownEvent) => { inputConfirm(e.key); });
    $input.on('blur', (e: BlurEvent) => { inputConfirm(Keystrokes.enter); });
    $input.on('click', (e: ClickEvent) => {
      // todo: se non lo fa già di suo: (per triggerare default.click() = this.undoAll();
      // if (input.readOnly) { this.undoAll(true); }
    });
    checkbox.dataset.vpid = '' + v.id;
    input.value = v.name;
    checkbox.checked = v.isApplied;
    $checkbox.on('change', (e: ChangeEvent): boolean => {
      const checkbox: HTMLElement = e.currentTarget;
      const vp: ViewPoint = ViewPoint.getByID( +checkbox.dataset.vpid);
      vp.runtimeorder = ViewPoint.LAST_ORDER++;
      console.log('changed cbox:', checkbox);
      if (this.ignoreEvents) { e.preventDefault(); return false; }
      setTimeout( () => this.refreshApplied(), 1); // devo dare tempo alla checkbox di settarsi
      return true; });
    if (allowApply && v.isApplied) {
      $checkbox.trigger('change');
    }
    li.classList.remove('template');
    li.classList.add ( "linkedToModel_" + this.model.getPrefix() );
    this.html.appendChild(li);
  }

  updatelastvp(): void {
    this.$html.find('li[islastvp]').removeAttr('islastvp');
    const vp: ViewPoint = this.model.getForemostView();
    console.log('updatelastvp() ', this.model.viewpoints, this.getViewpointGUI, this);
    if (!vp) return;
    this.lastVP = vp;
    const li: HTMLLIElement = this.getViewpointGUI[vp.id];
    li.setAttribute('islastvp', 'true');
  }

  getCheckbox(vp: ViewPoint): HTMLInputElement {
    let i: number;
    for (i = 0; i < this.checkboxes.length; i++) {
      const cbox: HTMLInputElement = this.checkboxes[i];
      if (cbox.dataset.vpid === '' + vp.id) return cbox;
    }
    return null;
  }
}
enum CursorAction { drag, select, multiselect }
export class IGraph {
// todo: this.vertex non è mai aggiornato reealmente.
  static all: Dictionary<number, IGraph> = {};
  static ID = 0;
  private static allMarkp: HTMLElement[] = []; // campo per robe di debug
  static defaultGridDisplay: boolean = true;
  static defaultGrid: GraphPoint = new GraphPoint(20, 20);
  static defaultZoom: Point = new Point(1, 1);
  id: number = null;
  container: SVGElement = null;
  model: IModel = null;
  vertex: IVertex[] = null;
  edges: IEdge[] = null;
  scroll: GraphPoint = null;
  propertyBar: PropertyBarr = null;
  zoom: Point = null;
  grid: GraphPoint = null;
  gridDisplay: boolean = false && false;
  edgeContainer: SVGGElement;
  vertexContainer: SVGGElement;
  gridColor1: string = '#808080';
  gridColor2: string = '#808080';
  public layouting: Layouting;

  // campi per robe di debug
  private allMarkgp: SVGCircleElement[] = [];
  private markp: HTMLElement;
  private markgp: SVGCircleElement;
  // private svg: SVGElement;
  public viewPointShell: ViewPointShell;
  private size: Size;
  private cursorAction: CursorAction;
  private isMoving: GraphPoint;
  private clickedScroll: GraphPoint;
  private gridPos: Point;
  private gridHtml: SVGRectElement;
  private gridDefsHtml: SVGDefsElement;
  useGrid: boolean = true;

  static getByID(id: string): IGraph { return IGraph.all[id]; }
  static getByHtml(html: Element): IGraph {
    for (const id in IGraph.all) {
      if (!IGraph.all.hasOwnProperty(id)) { continue; }
      const graph = IGraph.all[id] as IGraph;
      if (U.isParentOf(graph.container, html)) { return graph; }
    }
    U.pe(true, 'failed to find parent graph of:', html);
    return null; }

  constructor(model: IModel, container: SVGElement) {
    U.pe(!container, 'graph container is null. model:', model);
    this.id = IGraph.ID++;
    IGraph.all[this.id + ''] = this;
    this.model = model;
    this.layouting = new Layouting(this);
    this.model.graph = this;
    this.container = container;
    this.container.dataset.graphID = '' + this.id;
    this.edgeContainer = U.newSvg('g');
    this.edgeContainer.classList.add('allEdgeContainer');
    this.vertexContainer = U.newSvg('g');
    this.vertexContainer.classList.add('allVertexContainer');
    this.container.appendChild(this.edgeContainer);
    this.container.appendChild(this.vertexContainer);
    this.gridDefsHtml = $(this.container).find('g.gridContainer>defs')[0] as any;
    this.gridHtml = $(this.container).find('g.gridContainer>rect.grid')[0] as any;
    this.gridHtml.setAttributeNS(null, 'fill', 'url(#grid_' + this.id + ')');
    this.isMoving = null;
    this.clickedScroll = null;
    this.cursorAction = CursorAction.select;
    // this.svg = $(this.container).find('svg.graph')[0] as unknown as SVGElement;
    this.vertex = [];
    this.edges = [];
    this.zoom = new Point(1, 1);
    this.scroll = new GraphPoint(0, 0);
    this.grid = new GraphPoint(20, 20);
    this.gridPos = new Point(0, 0);
    this.gridDisplay = true;
    let i: number;
    let j: number;
    const earr: EEnum[] = this.model.getAllEnums();
    for (i = 0; i < earr.length; i++) { earr[i].generateVertex(); }
    const classArr: IClass[] = this.model.getAllClasses();
    const classEdges: IClass[] = [];
    for (i = 0; i < classArr.length; i++) {
      if (classArr[i].shouldBeDisplayedAsEdge()) { classEdges.push(classArr[i]); continue; }
      classArr[i].generateVertex();
    }
    // vertex disegnati, ora disegno gli edges.
    // Class-extends-edges
    if (this.model.isM2()) {
      for (i = 0; i < classArr.length; i++) {
        const classe: M2Class = classArr[i] as M2Class;
        for (j = 0; j < classe.extends.length; j++) { U.ArrayAdd(this.edges, classe.makeExtendEdge(classe.extends[j])); }
      }
    }
    // Class-edges
    for (i = 0; i < classEdges.length; i++) { U.ArrayMerge(this.edges, classEdges[i].generateEdge()); }
    // Reference-edges
    const arrReferences: IReference[] = this.model.getAllReferences();
    for (i = 0; i < arrReferences.length; i++) { U.ArrayMerge(this.edges, arrReferences[i].generateEdges()); }
    this.propertyBar = new PropertyBarr(this.model);
    this.viewPointShell = new ViewPointShell(this);
    this.addGraphEventListeners();
    this.refreshGridGUI(); }

  fitToGrid(pt0: GraphPoint, clone: boolean = true, debug: boolean = false, fitHorizontal = true, fitVertical = true): GraphPoint {
    if (!this.useGrid) return pt0;
    const pt: GraphPoint = clone ? pt0.duplicate() : pt0;
    U.pe(!this.grid, 'grid not initialized.');
    if (fitHorizontal && !isNaN(this.grid.x) && this.grid.x > 0) { pt.x = Math.round(pt.x / this.grid.x) * this.grid.x; }
    if (fitVertical && !isNaN(this.grid.y) && this.grid.y > 0) { pt.y = Math.round(pt.y / this.grid.y) * this.grid.y; }
    U.pif(debug, 'fitToGrid(', pt0, '); this.grid:', this.grid, ' = ', pt);
    return pt; }

  fitToGridS(pt0: GraphSize, clone: boolean = true, debug: boolean = false, fitHorizontal = true, fitVertical = true): GraphSize {
    if (!this.useGrid) return pt0;
    const pt: GraphSize = clone ? pt0.duplicate() : pt0;
    U.pe(!this.grid, 'grid not initialized.');
    if (fitHorizontal && !isNaN(this.grid.x) && this.grid.x > 0) { pt.x = Math.round(pt.x / this.grid.x) * this.grid.x; }
    if (fitVertical && !isNaN(this.grid.y) && this.grid.y > 0) { pt.y = Math.round(pt.y / this.grid.y) * this.grid.y; }
    U.pif(debug, 'fitToGrid(', pt0, '); this.grid:', this.grid, ' = ', pt);
    return pt; }
/*
  graphContextMenu(e: ContextMenuEvent): boolean {
    // console.log('passedThroughVertex', e, e['passedThroughVertex']);
    // if (e['passedThroughVertex'] !== undefined) return e['passedThroughVertex'];
    e.preventDefault();
    e.stopPropagation();
    return false; }
*/
  addGraphEventListeners() {
    const $graph = $(this.container);
    const thiss: IGraph = this;
    this.model.linkToLogic(this.container);
    // $graph.off('mousedown.graph').on('mousedown.graph', (evt: MouseDownEvent) => { thiss.onMouseDown(evt); });
    // $graph.off('mouseup.graph').on('mouseup.graph', (evt: MouseUpEvent) => { thiss.onMouseUp(evt); });
    $graph.off('mousemove.graph').on('mousemove.graph', (evt: MouseMoveEvent) => { this.onMouseMove(evt); });
    // $graph.off('keydown.graph').on('keydown.graph', (evt: KeyDownEvent) => { thiss.onKeyDown(evt); }); non triggerabile, non ha focus.
    // $graph.off('click.mark').on('click.mark', (e: ClickEvent) => { thiss.markClick(e, true); } );
    $graph.off('mousedown.move').on('mousedown.move', (e: MouseDownEvent) => this.onMouseDown(e, false));
    $graph.off('mouseup.move').on('mouseup.move', (e: MouseUpEvent) => this.onMouseUp(e));
    // $graph.off('contextmenu').on('contextmenu', (e: ContextMenuEvent): boolean => { return this.graphContextMenu(e); });
    // @ts-ignore
    if (!!ResizeObserver) { // not supported by edge, android firefox.
      if (!window['' + 'resizeobservers']) window['' + 'resizeobservers'] = [];
      // @ts-ignore
      const tmp = new ResizeObserver( (entryes: ResizeObserverEntry[], observer: ResizeObserverr) => { this.onResize(); });
      window['' + 'resizeobservers'] = tmp;
      tmp.observe(this.container.parentElement);
    }
    // @ts-ignore
    if (!ResizeObserver){
      let oldSize: Size = null;
      setInterval(() => {
        U.pif(true, 'setinterval graphsize checker');
        const size: Size = this.getSize();
        if (!size.equals(oldSize)) this.onResize(size);
      }, 100);
    }
    // altre opzioni:
    // 1) MutationObserver (detect dom changes (attributes like "style" too)),
    // 2) http://marcj.github.io/css-element-queries/ : sembra simile a mutationObserver, no timers, funziona su flexbox che non cambiano
    // direttamente valori. non ho capito perchè parsa tutti i file css.
    // 3) "Use a combination of mousedown, mousemove and/or mouseup to tell whether the div is being / has been resized.
    // If you want really fine-grained control you can check in every mousemove event how much / if the div has been resized. If you don't need that,
    // you can simply not use mousemove at all and just measure the div in mousedown and mouseup and figure out if it was resized in the latter."
    // PROBLEMA: potrebbe avvenire un resize dovuto a serverEvents, keyboardEvents, timers.
  }

  printClickedMP(e: Event | MouseDownEvent) {
    let mp: ModelPiece = ModelPiece.get(e);
    let name: string =  mp.printableName(20, true);
    console.log('clicked mp:', mp.id, name, mp);
    console.info('clicked mp:', mp.id, name, mp);
  }
  onMouseDown(evt: MouseDownEvent, isTrigger: boolean): void {
    // console.log('graphONMouseDown', evt);
    isTrigger = isTrigger || !evt || evt['' + 'isTrigger'] || !evt.originalEvent;
    console.log('GraphMouseDown:', evt, evt.button, U.mouseWheelButton);
    if (evt && evt.button === U.mouseWheelButton) { evt.preventDefault(); evt.target.blur(); }
    switch (this.cursorAction) {
      default: U.pe(true, 'unexpected cursorAction:', this.cursorAction); break;
      case CursorAction.drag:
      case CursorAction.select:
        let e: IEdge = IEdge.get(evt);
        if (e instanceof ExtEdge) e = null;
        const mp: ModelPiece = isTrigger ? null : IVertex.ChangePropertyBarContentClick(evt, e);
        // console.log('graphONMouseDown', isTrigger, mp instanceof IModel);
        if (!(isTrigger || (mp instanceof IModel))) return;
        this.isMoving = Point.fromEvent(evt);
        this.clickedScroll = this.scroll.duplicate();
        break;
      case CursorAction.multiselect: break;
    } }

  onMouseUp(evt: MouseUpEvent): void {
    if (this.isMoving) { this.isMoving = this.clickedScroll = null; }
    const v: IVertex = IVertex.selected;
    const vcontext: StartDragContext = IVertex.startDragContext;
    if (!v) return;
    IVertex.selected = null;
    v.owner.grid.x = IVertex.selectedGridWasOn.x;
    v.owner.grid.y = IVertex.selectedGridWasOn.y;
    IVertex.selectedGridWasOn.x = 'prevent_doublemousedowncheck' as any;
    IVertex.selectedGridWasOn.y = 'prevent_doublemousedowncheck' as any;
    // const afterContextMenuTimeout = () => setTimeout(afterContextMenu, 0);
    // afterContextMenuTimeout(); // do it regardless of moved or not.
    const gotMoved = !vcontext.size.tl().equals(v.size.tl(), 0);
    if (!gotMoved) { return; }
    v.owner.fitToGridS(v.size, false);
    v.setSize(v.size, false, true, measurableRules.onDragEnd);
    //NB: Ivertex.selected va cancellato per forza prima di gotMoved e setSize, perchè crea casini con dragEnd.
    // Dopo il contextmenù deve tornare nonsettato. se potessi spotare il tempo di esecuzione di contextmenù risolverei tutto... ma è impossibile.
  }

  onMouseMoveSetReference(evt: MouseMoveEvent, edge: IEdge): void {
    // console.log('graph.movereference()', edge, edge ? edge.tmpEndVertex : null);
    if (!edge || edge.tmpEndVertex) { return; }
    // const ref: IReference | IClass = edge.logic;
    edge.tmpEnd = GraphPoint.fromEvent(evt);
    U.pe(!edge.tmpEnd, 'failed to get coordinates from event:', evt);
    // console.log('graph.movereference: success!', edge.tmpEnd);
    edge.refreshGui(null, false); }

  onMouseMoveVertexMove(evt: MouseMoveEvent, v: IVertex): void {
    if (!v) { return; }
    // if (U.vertexOldPos === 1) U.vertexOldPos = 2;
//     console.log('onMouseMoveVertexMove:', v.logic().name, evt, v);
    const currentMousePos: Point = new Point(evt.pageX, evt.pageY);
    // console.log('evt:', evt);
    let currentGraphCoord: GraphPoint = this.toGraphCoord(currentMousePos);
    currentGraphCoord = currentGraphCoord.subtract(IVertex.selectedStartPt, false);
    const axis: string = v.dragConfig && v.dragConfig.axis;
    const isMeasurable = v.dragConfig;
    //NB: axis null = both. axis undefined or empty string = no-one.
    if (isMeasurable) {
      if (axis === undefined || axis !== null && axis.indexOf('x') === -1) currentGraphCoord.x = null;
      if (axis === undefined || axis !== null && axis.indexOf('y') === -1) currentGraphCoord.y = null; }
    // console.log('onMouseMoveVertexMove:', v.logic().name, 'vertex:', v, 'coord:', currentGraphCoord, 'ismeasurable:', isMeasurable);
    v.moveTo(currentGraphCoord); }

  onMouseMoveDrag(e: MouseMoveEvent): void {
    if (!this.isMoving) return;
    const offset: Point = Point.fromEvent(e);
    offset.subtract(this.isMoving, false);
    this.scroll.x = this.clickedScroll.x - offset.x;
    this.scroll.y = this.clickedScroll.y - offset.y;
    this.setGridPos();
    // console.log('scroll:', this.scroll, 'offset:', offset, ' scroll0: ', this.clickedScroll, ' currentCursor:', this.isMoving);
    this.updateViewbox(); }

  onMouseMove(evt: MouseMoveEvent): void {
    if (IEdge.edgeChanging) return this.onMouseMoveSetReference(evt, IEdge.edgeChanging);
    if (IVertex.selected) return this.onMouseMoveVertexMove(evt, IVertex.selected);
    if (this.isMoving) return this.onMouseMoveDrag(evt);
  }
  edgeChangingAbort(e: KeyDownEvent | MouseDownEvent | ClickEvent | MouseUpEvent): void {
    const edge: IEdge = IEdge.edgeChanging;
    if (!edge) { return; }
    IEdge.edgeChanging = null;
    edge.shell.blur();
    edge.isSelected = false;

    // unmark hovering vertex
    const hoveringVertex: IVertex[] = IVertex.GetMarkedWith('refhover');
    let i: number;
    U.pw(hoveringVertex.length > 1, 'hovering on more than one target at the same time should be impossible.', hoveringVertex);
    for (i = 0; i < hoveringVertex.length; i++) { hoveringVertex[i].mark(false, 'refhover'); }

    // restore previous endTarget or delete edge.
    console.log('edgeChange abort', edge);
    if (!edge.end) { edge.remove(); return; }
    edge.useMidNodes = true;
    edge.useRealEndVertex = true;
    edge.tmpEnd = null;
    edge.onBlur(); // will refreshgui too
    edge.refreshGui();
    // double refresh on purpose, to fix imprecision on huge sudden movement possibly caused by blur (startpoint must keep up)
    // todo: aggiusta dentro refreshgui e reitera solo quella parte interna così posso chiamarlo 1 volta e stare safe e ottimizzato
  }


  toGraphCoordS(s: Size): GraphSize {
    const tl = this.toGraphCoord(new Point(s.x, s.y));
    const br = this.toGraphCoord(new Point(s.x + s.w, s.y + s.h));
    const ret = new GraphSize(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    return ret; }

  private computeSize(): void { this.size =  U.sizeof(this.container); }
  getSize(): Size {
    if (!this.size ) this.computeSize();
    return this.size; }

  public getGSize(): GraphSize{
    throw new Error("getGSize() todo: should show the size of the whole graph visible and hidden that contain something (bounding rectangle of content)");
  }
  public getVisibleGSize(): GraphSize{
    let size: Size = this.getSize();
    // console.log('gsize', {size, ggsize: new GraphSize(size.x, size.y, size.w, size.h), zoom: this.zoom, ret: new GraphSize(size.x, size.y, size.w, size.h).multiplyPoint(this.zoom, false)});
    return new GraphSize(size.x, size.y, size.w, size.h).dividePoint(this.zoom, false);
  }

  public toGraphCoord(p: Point): GraphPoint {
    const graphSize: Size = this.getSize();
    const ret: GraphPoint = new GraphPoint(p.x, p.y);
    const debug = true;
    ret.x -= graphSize.x;
    ret.y -= graphSize.y;
    ret.x /= this.zoom.x;
    ret.y /= this.zoom.y;
    ret.x += this.scroll.x;
    ret.y += this.scroll.y;
    // console.log('toGraph()  - graphSize:', graphSize, ' + scroll: ', this.scroll, ' / zoom', this.zoom);
    if (debug) {
      const ver: Point = this.toHtmlCoord(ret);
      let tolerance = 0.001;
      U.pw( Math.abs(ver.x - p.x) > tolerance || Math.abs(ver.y - p.y) > tolerance, 'error in toGraphCoord or toHtmlCoord: inputPt:', p, ', result: ', ret, 'verify:', ver,
        'point:', p, 'scroll:', this.scroll, 'zoom:', this.zoom, 'GraphHtmlSize:', graphSize); }
    return ret; }
  toHtmlCoordS(s: GraphSize): Size {
    if (s === null) { return null; }
    const tl = this.toHtmlCoord(new GraphPoint(s.x, s.y));
    const br = this.toHtmlCoord(new GraphPoint(s.x + s.w, s.y + s.h));
    return new Size(tl.x, tl.y, br.x - tl.x, br.y - tl.y); }
  toHtmlCoord(p: GraphPoint): Point {
    const graphSize: Size = this.getSize();
    const ret: Point = new Point(p.x, p.y);
    // console.log('toHtml()', ' * zoom', this.zoom, ' - scroll: ', this.scroll, ' + graphSize:', graphSize);
    ret.x -= this.scroll.x;
    ret.y -= this.scroll.y;
    ret.x *= this.zoom.x;
    ret.y *= this.zoom.y;
    ret.x += graphSize.x;
    ret.y += graphSize.y;
    return ret; }

  getAllVertex(): IVertex[] { return [...this.model.getAllClasses(), ...this.model.getAllEnums()].map((c: IClassifier) => c.getVertex(false)); }
  getAllVertexIsBroke() { return this.vertex; }

  markClick(e: JQuery.ClickEvent, clean: boolean = true) { return this.mark(new Point(e.pageX, e.pageY), clean); }
  markg(gp: GraphPoint, clean: boolean = false, colorTop: string = 'red'): void {
    return this.mark(this.toHtmlCoord(gp), clean, colorTop); }
  markgS(gs: GraphSize, clean: boolean = false, colorTop: string = 'red', colorBot: string = null): void {
    /*if (!colorBot) { colorBot = colorTop; }
    this.markg(gs.tl(), clean, colorTop);
    this.markg(gs.tr(), false, colorTop);
    this.markg(gs.bl(), false, colorBot);
    this.markg(gs.br(), false, colorBot);*/
    // const htmls: Size = this.owner.toHtmlCoordS(size0);
    return this.markS(this.toHtmlCoordS(gs), clean, colorTop, colorBot);
  }
  markS(s: Size, clean: boolean = false, colorTop: string = 'red', colorBot: string = null): void {
    if (!colorBot) { colorBot = colorTop; }
    U.pe(!s, 'size cannot be null.');
    this.mark(s.tl(), clean, colorTop);
    // color = 'white';
    this.mark(s.tr(), false, colorTop);
    // color = 'purple';
    this.mark(s.bl(), false, colorBot);
    // color = 'orange';
    this.mark(s.br(), false, colorBot);
  }
  mark(p: Point, clean: boolean = false, color: string = 'red'): void {
    const gp: GraphPoint = this.toGraphCoord(p);
    if (clean) {
      let i;
      for (i = 0; i < this.allMarkgp.length; i++) {
        const node: SVGCircleElement = this.allMarkgp[i];
        if (this.container.contains(node)) { this.container.removeChild(node); }
      }
      for (i = 0; i < IGraph.allMarkp.length; i++) {
        const node: HTMLElement = IGraph.allMarkp[i];
        if (document.body.contains(node)) { document.body.removeChild(node); }
      }
    }
    // console.log('mark:', p, gp);
    this.markp = U.toHtml('<div style="width:10px; height:10px; top:' + (p.y - 5) + 'px; left:' + (p.x - 5) + 'px;' +
      ' position: absolute; border: 1px solid ' + color + '; z-index:1;">');
    this.markgp = U.newSvg('circle');
    this.markgp.setAttribute('cx', '' + gp.x);
    this.markgp.setAttribute('cy', '' + gp.y);
    this.markgp.setAttribute('r', '' + 1);
    this.markgp.setAttribute('stroke', color);
    this.allMarkgp.push(this.markgp);
    IGraph.allMarkp.push(this.markp);
    document.body.appendChild(this.markp);
    this.container.appendChild(this.markgp); }

  setGrid(x: number = null, y: number = null, checked: boolean = null): void {
    if (x !== null) this.grid.x = x;
    if (y !== null) this.grid.y = y;
    if (checked !== null) this.gridDisplay = checked;
    this.refreshGridGUI(); }

  setUseGrid(b: boolean): void {
    if (this.useGrid === b) return;
    this.useGrid = b;
    this.fitVertexToGrid(false);
  }

  setScroll(x: number, y: number): void {
    const old = this.scroll.duplicate();
    if (x !== null) this.scroll.x = x;
    if (y !== null) this.scroll.y = y;
    console.log('SetScroll(', x, y, '): ', old.x, old.y, ' -> ', this.scroll.x, this.scroll.y);
    this.refreshGridGUI(); // error here
    this.updateViewbox();
  }

  setZoom(x: number, y: number): void {
    const oldZoom = this.zoom.duplicate();
    y = x;
    this.zoom.x = !U.isNumber(x) || x === 0 ? this.zoom.x : +x;
    this.zoom.y = !U.isNumber(y) || y === 0 ? this.zoom.y : +y;
    console.log('zoomOld:', oldZoom, 'x:', x, 'y:', y, ' zoom:', this.zoom);
    this.updateViewbox(); }

  onResize(currSize: Size = null): void {
    if (currSize) this.size = currSize;
    else this.computeSize();
    this.updateViewbox(); }

  updateViewbox(): void {
    const vbox: Size = U.getViewBox(this.container);
    vbox.w = this.size.w / this.zoom.x;
    vbox.h = this.size.h / this.zoom.y;
    vbox.x = this.scroll.x;
    vbox.y = this.scroll.y;
    U.setViewBox(this.container, vbox); }

  setGridPos(): void {
    const biggerSquareX = this.grid.x * 10;
    const biggerSquareY = this.grid.y * 10;
    const safetySquares = 1;
    if (this.grid.x > 0 && !isNaN(this.scroll.x + this.grid.x))
      this.gridHtml.setAttributeNS(null, 'x', '' + ((this.scroll.x - this.scroll.x % biggerSquareX) - biggerSquareX * safetySquares));
    if (this.grid.y > 0 && !isNaN(this.scroll.y + this.grid.y))
      this.gridHtml.setAttributeNS(null, 'y', '' + ((this.scroll.y - this.scroll.y % biggerSquareY) - biggerSquareY * safetySquares));
    const size: Size = new Size(0, 0, window.screen.width, window.screen.height);
    size.w = Math.max(size.w, window.outerWidth);
    size.h = Math.max(size.h, window.outerHeight);
    if (!isNaN(this.grid.x + this.zoom.x))
      this.gridHtml.setAttributeNS(null, 'width', ((size.w + biggerSquareX * safetySquares * 2) / this.zoom.x) + '');
    if (!isNaN(this.grid.y + this.zoom.y))
      this.gridHtml.setAttributeNS(null, 'height', ((size.h + biggerSquareY * safetySquares * 2) / this.zoom.y) + ''); }

  private oldGridX: number = null;
  private oldGridY: number = null;
  refreshGridGUI() {
    const debug = false;
    // if (this.grid.x === null) this.grid.x = this.oldGridX; crea un bug che mette i vertici trascinati che triggerano una rule (anche senza effetto o event senza targets) in vertexPos.y = 0;
    // if (this.grid.y === null) this.grid.y = this.oldGridY; forse perchè null è un valore valido che dice "non usare la griglia", almeno mentre trascini


    if (this.grid.x !== null) this.oldGridX = this.grid.x;
    if (this.grid.y !== null) this.oldGridY = this.grid.y;
    const maxSquareSize = 1000; // Number.MAX_SAFE_INTEGER sarebbe meglio maxint, ma temo per il consumo di memoria.
    const x = isNaN(this.grid.x) || this.grid.x === null ? this.oldGridX : this.grid.x <= 0 ? maxSquareSize : this.grid.x; // if the size of squares in grid is zero or negative, i just use a big number.
    const y = isNaN(this.grid.y) || this.grid.y === null ? this.oldGridX : this.grid.y <= 0 ? maxSquareSize : this.grid.y;
    // NB: x è "displayed grid", grid.x è actual grid. se grid.x = null lo snap è disattivato ma continuo a mostrare old grid.
    debug&&console.log('oldGridX:' + this.oldGridX, this.grid.x, x, this.gridDisplay);
    debug&&console.log('oldGridY:' + this.oldGridY, this.grid.y, y);
    if (x === null || y === null) /*todo: x = getOldX;*/ return;

    let drawx = this.grid.x === null || !(isNaN(this.grid.x) || this.grid.x <= 0 || this.grid.x >= maxSquareSize);
    let drawy = this.grid.x === null || !(isNaN(this.grid.y) || this.grid.y <= 0 || this.grid.x >= maxSquareSize);


    this.gridDefsHtml.innerHTML =
      '<pattern id="smallGrid_' + this.id + '" width="' + x + '" height="' + y + '" patternUnits="userSpaceOnUse">\n' +
      (!drawx && !drawy ? '<!-- no grid -->' :
      '  <path d="m 0 0' + (drawy ? ' l' : ' m' ) + (x) + ' 0' + (drawx ? ' l' : ' m') + ' 0 ' + (y) + '" fill="none" stroke="' + this.gridColor1 + '" stroke-width="0.5"/>\n'
      ) +
      '</pattern>\n' +
      '<pattern id="grid_' + this.id + '" width="' + (x * 10) + '" height="' + (y * 10) + '" patternUnits="userSpaceOnUse">\n' +
      (!drawx && !drawy ? '<!-- no grid -->' :
      '  <rect width="' + (x * 10) + '" height="' + (y * 10) + '" fill="url(#smallGrid_' + this.id + ')"/>\n' +
      '  <path d="m 0 0' + (drawy ? ' l' : ' m' ) + (x * 10) + ' 0' + (drawx ? ' l' : ' m') + ' 0 ' + (y * 10) + '" fill="none" stroke="' + this.gridColor2 + '" stroke-width="1"/>\n') +
      '</pattern>';
    this.setGridPos();
    // $grid[0].setAttributeNS(null, 'justForRefreshingIt', 'true');
    // $grid.x
    if (this.gridDisplay) { $(this.gridHtml).show(); } else { $(this.gridHtml).hide(); }

  }

  addVertex(v: IVertex): void {
    v.owner = this;
    U.ArrayAdd(this.vertex, v);
    // todo: aggiungi edges tra i vertici. in matrix edgeMatrix[vertex][vertex] = edge
  }
/*
  setGrid(grid: GraphPoint): void {
    this.grid = grid;
    this.model.refreshGUI_Alone(); // reallinea tutti i vertici.
  }*/
  getVertexSelection(): IVertex[]{
    return [];
  }
  getEdgeSelection(): IEdge[]{
    return [];
  }
  getSelection(): (IVertex | IEdge)[] {
    return [];
  }

  fitVertexToGrid(force: boolean = false): void{
    const vertexes: IVertex[] = this.getAllVertex();
    vertexes.forEach((v: IVertex, i:number) => {
      v.setSize(this.fitToGridS(v.getSize()), false, true, measurableRules.onDragEnd);
    });
  }

}
