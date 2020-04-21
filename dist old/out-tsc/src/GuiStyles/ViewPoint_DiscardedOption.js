/*import {Component, OnInit} from '@angular/core';
import {
  IAttribute,
  M2Class,
  IEdge,
  IModel,
  IPackage,
  IReference,
  ModelPiece,
  PropertyBarr,
  Status,
  U,
  IClass,
  EdgeModes,
  EOperation,
  EParameter,
  Database,
  Size,
  AttribETypes,
  EType,
  Dictionary,
  // Options,
  Point,
  GraphPoint,
  IVertex, GraphSize, EdgeStyle, Json, StyleComplexEntry, ModelPieceStyleEntry, StyleVisibility
} from '../common/Joiner';
import ChangeEvent = JQuery.ChangeEvent;
import BlurEvent = JQuery.BlurEvent;
import KeyDownEvent = JQuery.KeyDownEvent;
import KeyboardEventBase = JQuery.KeyboardEventBase;
import KeyUpEvent = JQuery.KeyUpEvent;
import ClickEvent = JQuery.ClickEvent;
import SelectEvent = JQuery.SelectEvent;

export class ViewHtmlSettings extends ModelPieceStyleEntry {
  private htmlstr: string;
  toString() {
    this.htmlstr = this.html.outerHTML;
    const replacer = (key: string, value: any): string => {
      switch(key.toLowerCase()) {
         case 'html': break;
      }
    };

  }
  updateHtml(): void {
    this.html = U.toHtml(this.htmlstr);
  }
  clone(instances: ViewHtmlSettings) {
    this.allowedOnClass = instances.allowedOnClass;
    this.allowedOnAttribute = instances.allowedOnAttribute;
    this.allowedOnReference = instances.allowedOnReference;
    this.allowedOnOperation = instances.allowedOnOperation;
    this.allowedOnParameter = instances.allowedOnParameter;
    this.AllowedOnM1 = instances.AllowedOnM1;
    this.AllowedOnM2 = instances.AllowedOnM2;
    this.elementStylingCount = instances.elementStylingCount;
    this.featuredependency = instances.featuredependency;
    this.forkCounter = instances.forkCounter;
    this.ForkedFromStr_name = instances.ForkedFromStr_name;
    this.ForkedFromStr_user = instances.ForkedFromStr_user;
    //this.htmlstr = instances.htmlstr;
    this.html = U.toHtml(this.htmlstr);
  }

  setDependencyArray(featuredependency: {template: string, namesArray: string, typesArray: string}[]): void {
    // todo: insert metadata into html, copy from ModelPieceStyleEntry
  }

  saveToDB(): void {

  }
}

export class ViewPoint {
  /* static all: ViewPoint[] = [];* /
static allnames: Dictionary<string, ViewPoint> = {};
// static defaultView: ViewPoint = staticinit();
name: string;
modelView: ModelView;
private targetModel: IModel;
isApplied: boolean = false;
/*
  static staticinit(): ViewPoint {
    const vp: ViewPoint = new ViewPoint();
    vp.name = 'Default'; }* /
static deserializeAndApply(jsonViewpoints: Json[] = [], target: IModel = null) {
  let tmp = [];
  let i: number;
  console.log('deserialize() viewpoints_Json:', jsonViewpoints, target);
  for (i = 0 ; i < jsonViewpoints.length; i++) {
    const v: ViewPoint = new ViewPoint(null, target);
    todo:
      funzione1: copia la struttura di targetmodel
    funzione2: per ogni viewpoint nel salvataggio json, trova il corrispondente ed esegui .copy(salvataggiojson); ma se non esiste?
      funzione2: meglio ancora: fai il merge.
    v.clone(jsonViewpoints[i]);
    // tmp.push(v);
    v.apply(target, false);
  }
}

static get(value: string): ViewPoint { return ViewPoint.allnames[value]; }

constructor(name: string, m: IModel) {
  this.setname(name);
  this.modelView = new ModelView(null, this);
  if (m) this.generateSaveFromModel_Unused(m);
}

merge(v: ViewPoint): void {
  this.name = this.name || v.name;
// todo.
}

export(): string { return JSON.stringify(this); }

clone(obj0: Json): void {
  const obj: ViewPoint = obj0 as ViewPoint;
this.setname(obj.name);
this.modelView = new ModelView(null, null).clone(obj.modelView as Json);
this.targetModel = obj.targetModel;
}

generateSaveFromModel_Unused(m: IModel): ViewPoint {
  this.modelView = new ModelView(null, this).initializeFromModel(m);
  const name: string = m.fullname();
  U.pe(true, 'model name cannot be null here');
  this.targetModel = m;
  this.setname(m.fullname());
  return this; }

setname(s: string) {
  if (!s) s = 'ViewPoint 1';
  if (s === this.name) return;
  if (ViewPoint.allnames[this.name] === this) { delete ViewPoint.allnames[this.name]; }
  while (s in ViewPoint.allnames) { s = U.increaseEndingNumber(s); }
  ViewPoint.allnames[this.name] = this; }

//todo: allow multi-apply. css like.
apply(m: IModel, exclusive: boolean = false): void {
  this.isApplied = true;
this.targetModel = m;
U.ArrayAdd(m.viewpoints, this);
// U.pe(true, 'viewpoint ' + (exclusive ? 'exclusively' : '') + ' applied to wrong model. expected:', this.targetModel, ', found:', m.name, m);
this.modelView.apply(m, exclusive);
m.graph.viewPointShell.add(this);
}

delete(): null {
  delete ViewPoint.allnames[this.name];
  return null; }

}
export abstract class ViewRule {
  static byID: Dictionary<number, ViewRule> = {};
  static absoluteindex: number = 1;
  key: number[];
  id: number;
  own: ViewHtmlSettings;
  instances: ViewHtmlSettings;
  parent: ViewRule;
  // instancesStyleObjKey: string;
  // ownStyleObjKey: string;
  /*  ownStyle: string = null;
    instancesStyle: string = null;
    private html: Element;
    private htmli: Element;* /
  // static getKey(m: ModelPiece): number[] { return U.getIndexesPath(m, 'parent', 'childrens'); }
  // todo: setta l'id che verrà letto qui

  constructor(parent: ViewRule) {
    this.parent = parent;
    console.log('this:', this);
    this.id = ViewRule.absoluteindex++;
    ViewRule.byID[this.id] = this;
    this.own = new ViewHtmlSettings(null);
    this.instances = new ViewHtmlSettings(null); }

  static get(html: HTMLElement | SVGElement): ViewRule {
    while (html && html.dataset && !html.dataset.styleid) html = html.parentNode as HTMLElement | SVGElement;
    return ViewRule.getbyID(html && html.dataset ? +html.dataset.styleid : null); }

  static getbyID(id: number): ViewRule { return ViewRule.byID[id]; }

  findTarget<T extends ModelPiece>(model: IModel, path: number[] = null): T {
    if (!path) { path = this.key; }
    const realindexfollowed: {indexFollowed: string[] | number[], debugArr: {index: string | number, elem: any}[]} = {indexFollowed: [], debugArr:[]};
    let target: T = U.followIndexesPath(model, path, 'childrens', realindexfollowed);
    if (realindexfollowed.indexFollowed.length !== path.length) {
      U.pw(true, 'unable to find target of views:', this, ' search output:', realindexfollowed);
      return null; }
    return target; }

  abstract clone(obj0: Json): void;
  private emptyconstructor(): ViewRule {
    if (this instanceof ModelView) return new ModelView(null, null);
    if (this instanceof PackageView) return new PackageView(null);
    if (this instanceof ClassView) return new ClassView(null);
    if (this instanceof ReferenceView) return new ReferenceView(null);
    if (this instanceof AttributeView) return new AttributeView(null);
    if (this instanceof OperationView) return new OperationView(null);
    if (this instanceof ParameterView) return new ParameterView(null);
    if (this instanceof EdgeViewRule) return new EdgeViewRule(null);
    if (this instanceof EdgePointView) return new EdgePointView(null);
    U.pe(true, 'unable to find view constructor type:', this);
    return null; }

  isEmpty(): boolean { return this.equals(this.emptyconstructor()); }

  equals(other: ViewRule, debug: boolean = true): boolean {
    const s1 = JSON.stringify(this, (key, val) => key === 'id' ? undefined : val);
    const s2 = JSON.stringify(other);
    const ret = s1 === s2;
    U.pif(debug,'view.equals():' + ret + ' --> |'+s1+'| =?= |'+s2+'|');
    return ret; }

  duplicate(): ViewRule {
    const duplicate =  this.emptyconstructor();
    duplicate.clone(this);
    return duplicate; }

  clone0(obj0: Json): void {
    const obj = obj0 as ViewRule;
    this.key = obj.key;
    /*this.instancesStyle = obj.instancesStyle;
    this.ownStyle = obj.ownStyle;* /
    this.own.clone(obj.own);
    this.instances.clone(obj.instances);
  }

  abstract apply(model: IModel, exclusive: boolean): void;
  apply0(model: IModel, exclusive: boolean): ModelPiece {
    const m: ModelPiece = this.findTarget(model);
    U.pw(!m, 'failed to get target of views:', this, 'in model:', model);
    if (!m) return null;
    m.addView(this);
    // TODO: apply adesso è inutile dato che c'è un field ViewRule diretto dentro ModelPiece.
    /*
    if (exclusive || !this.own) { m.customStyleToErase = U.toHtml(this.ownStyle); }
    if (exclusive || !this.ownStyle) { m.customStyleToErase = U.toHtml(this.ownStyle); }
    if (exclusive || !this.instancesStyle) { m.styleOfInstances = U.toHtml(this.instancesStyle); }* /
    // const ownstyle =  U.toHtml(this.ownStyle);
    // const instancesStyle = U.toHtml(this.instancesStyle);
    // m.customStyleToErase = ownstyle; // m.setStyle_SelfLevel_1(U.toHtml(this.ownStyle));
    // m.styleOfInstances = instancesStyle; // m.setStyle_InstancesLevel_2(U.toHtml(this.instancesStyle));
    return m; }

  abstract initializeFromModel(m: ModelPiece): ViewRule;
  initializeFromModel0(m: ModelPiece): void {
    this.instances = new ViewHtmlSettings();
    // this.instancesStyle = m.styleOfInstances.outerHTML;
    // this.ownStyle = m.customStyleToErase.outerHTML;
    this.key = U.getIndexesPath(m, 'parent', 'childrens'); }

  saveToDB(): void {
    this.instances.saveToDB();
    this.own.saveToDB();
  }
  /*
    getHtmlDONOTUSE(m: ModelPiece): Element {
      if(this.own && this.own.html) return this.own.html;
      if(m.metaParent && m.metaParent.views &&  m.metaParent.views.instances && m.metaParent.views.instances.html) return m.metaParent.views.instances.html;
      return m.getGlobalLevelStyle(); }*/
// getHtml(m: ModelPiece): StyleComplexEntry { return ViewRule.getHtml(this); }
/*
static getHtml(m: ModelPiece): StyleComplexEntry {
  let j: number;
  let i: number;
  const ret: StyleComplexEntry = {html:null, htmlobj:null, view:null, ownermp:null, isownhtml:null, isinstanceshtml:null, isGlobalhtml:null};
  for (j = m.views.length; --j >=0 ;){
    const v: ViewRule = m.views[j];
    if (!v.own || !v.own.html) continue;
    ret.html = v.own.html;
    ret.htmlobj = v.own;
    ret.view = v;
    ret.ownermp = m;
    ret.isGlobalhtml = false;
    ret.isinstanceshtml = false;
    ret.isownhtml = true;
    return ret; }
  if (m.metaParent) {
    for (i = m.metaParent.views.length; --i >= 0;) {
      let v: ViewRule = m.metaParent.views[i];
      if (!v.instances || v.instances.html) continue;
      ret.html = v.instances.html;
      ret.htmlobj = v.instances;
      ret.view = v;
      ret.ownermp = m.metaParent;
      ret.isGlobalhtml = false;
      ret.isinstanceshtml = true;
      ret.isownhtml = false;
      return ret; } }
  ret.html = m.getGlobalLevelStyle();
  ret.htmlobj = null;
  ret.view = null;
  ret.ownermp = null;
  ret.isGlobalhtml = true;
  ret.isinstanceshtml = false;
  ret.isownhtml = false;
  return ret; }* /

getViewPoint(): ViewPoint {
  let elem: ViewRule = this;
  while (elem.parent) { elem = elem.parent;}
  return (elem as ModelView).viewpoint; }
}

export class ModelView extends ViewRule{
zoom: Point;
scroll: GraphPoint;
gridShow: boolean;
grid: GraphPoint;
packageViews: PackageView[] = [];
viewpoint: ViewPoint;
constructor(parent: ViewRule, viewpoint: ViewPoint) {
  super(null);
  this.viewpoint = viewpoint;
}

initializeFromModel(m: IModel): ModelView{
  this.initializeFromModel0(m);
  this.zoom = m.graph.zoom;
  this.scroll = m.graph.scroll;
  this.gridShow = m.graph.gridDisplay;
  this.grid = m.graph.grid;
  this.packageViews = [];
  for (let i = 0; i < m.childrens.length; i++) { this.packageViews.push(new PackageView(this).initializeFromModel(m.childrens[i])); }
  this.packageViews.push();
  return this; }
// todo: al posto di undo style applica default in modo esclusivo (override all) e poi tutti gli altri in modo non esclusivo.
apply(m: IModel, exclusive: boolean): void{
  // NOT: super.apply0(m, undo); this object does not have html styles.
  // const m: IModel = this.findTarget();
  m.addView(this);
  if (exclusive || !m.graph.scroll) m.graph.scroll = this.scroll;
  if (exclusive || !m.graph.zoom) m.graph.setZoom(this.zoom);
  if (exclusive || !m.graph.grid) m.graph.setGrid(this.grid);
  if (exclusive || !m.graph.gridDisplay) m.graph.gridDisplay = this.gridShow;
  for(let i: number = 0 ; i < this.packageViews.length; i++) { this.packageViews[i].apply(m, exclusive); }
}

clone(obj0: Json): ModelView {
  this.clone0(obj0);
  const obj: ModelView = obj0 as ModelView;
  this.parent = null; // obj.parent;
  this.viewpoint = obj.viewpoint;
  this.grid = new GraphPoint(obj.grid.x, obj.grid.y);
  this.gridShow = !!obj.gridShow;
  this.scroll = new GraphPoint(obj.scroll.x, obj.scroll.y);
  this.zoom = new Point(obj.zoom.x, obj.zoom.y);
  this.packageViews = [];
  for (let i = 0; i < obj.packageViews.length; i++) { this.packageViews.push(new PackageView(this).clone(this.packageViews[i] as Json)); }
  return this; }
}

export class PackageView extends ViewRule{
classViews: ClassView[];

apply(model: IModel, exclusive: boolean): void {
  const m: IPackage = super.apply0(model, exclusive) as IPackage;
  if (!m) return;
  for(let i: number = 0 ; i < this.classViews.length; i++) { this.classViews[i].apply(model, exclusive); }
}

initializeFromModel(m: IPackage): PackageView {
  this.initializeFromModel0(m);
  this.classViews = [];
  for (let i = 0; i < m.childrens.length; i++) { this.classViews.push(new ClassView(this).initializeFromModel(m.childrens[i])); }
  return this; }

clone(obj0: Json): PackageView {
  this.clone0(obj0);
  const obj: PackageView = obj0 as PackageView;
  this.classViews = [];
  for (let i = 0; i < obj.classViews.length; i++) { this.classViews.push(new ClassView(this).clone(this.classViews[i] as Json)); }
  return this; }
}

export class ClassView extends ViewRule{
public displayAsEdge: boolean = false;
public size: GraphSize;
parent: PackageView;
edgeView: EdgeViewRule[];
attributeViews: AttributeView[];
referenceViews: ReferenceView[];
operationViews: OperationView[]; // todo: check utilizzi di attributeview e aggiorna pure operationviews.

apply(model: IModel, exclusive: boolean): void {
  const m: IClass = super.apply0(model, exclusive) as IClass;
  if (!m) return;
  /* const e: IEdge = m.getEdge();
  if (e) {
    e.start = this.findTarget<IClass>(model, this.displayAsEdgeVertex1).getVertex();
    e.end = this.findTarget<IClass>(model, this.displayAsEdgeVertex2).getVertex();
    for (let i = 0; i < this.edgeView.length; i++){ this.edgeView[i].applyEdgeClass(m, i); }
  }* /
  // todo: prima crea una empty view per tutti, poi rintraccia l'empty view di questo viewpoint e usa il empty.copy(attributeviews[i]);
  // todo: quando salvi evita di salvare quelli che isEmpty() === true;
  for(let i: number = 0 ; i < this.attributeViews.length; i++) { this.attributeViews[i].apply(model, exclusive); }
  for(let i: number = 0 ; i < this.referenceViews.length; i++) { this.referenceViews[i].apply(model, exclusive); }
  m.shouldBeDisplayedAsEdge(this.displayAsEdge);
  const v: IVertex = m.getVertex();
  // exclusive vertex size to do: non ho modo di capire se la dimensione è stata manomessa. controlla gli altri utilizzi di exclusive per capire ctrl+f.
  if (v && this.size) { v.setSize(this.size, true, true); }

}

initializeFromModel(m: IClass): ClassView {
  this.initializeFromModel0(m);
  this.attributeViews = [];
  this.referenceViews = [];
  this.edgeView = [];
  for (let i = 0; i < m.childrens.length; i++) { this.attributeViews.push(new AttributeView(this).initializeFromModel(m.attributes[i])); }
  for (let i = 0; i < m.childrens.length; i++) { this.referenceViews.push(new ReferenceView(this).initializeFromModel(m.references[i])); }
  const edges: IEdge[] = m.getEdges();
  for (let i = 0; i < m.childrens.length; i++) { this.edgeView.push(new EdgeViewRule(this).generateew(edges[i])); }
  const v: IVertex = m.getVertex();
  this.size = v.getSize();
  this.displayAsEdge = m.shouldBeDisplayedAsEdge();
  return this; }

clone(obj0: Json): ClassView {
  this.clone0(obj0);
  const obj: ClassView = obj0 as ClassView;
  this.referenceViews = [];
  this.attributeViews = [];
  this.edgeView = [];
  if (this.parent) U.ArrayAdd(this.parent.classViews, this);
  for (let i = 0; i < obj.attributeViews.length; i++) { this.attributeViews.push(new AttributeView(this).clone(this.attributeViews[i] as Json)); }
  for (let i = 0; i < obj.referenceViews.length; i++) { this.referenceViews.push(new ReferenceView(this).clone(this.referenceViews[i] as Json)); }
  for (let i = 0; i < obj.edgeView.length; i++) { this.edgeView.push(new EdgeViewRule(this).clone(this.edgeView[i] as Json)); }
  return this; }
}

export class AttributeView extends ViewRule {
parent: ClassView;

apply(model: IModel, exclusive: boolean): void {
  const m: IAttribute = super.apply0(model, exclusive) as any;
  if (!m) return;
}

initializeFromModel(m: IAttribute): AttributeView {
  this.initializeFromModel0(m);
  return this; }

clone(obj0: Json): AttributeView {
  this.clone0(obj0);
  const obj: AttributeView = obj0 as AttributeView;
  if (this.parent) U.ArrayAdd(this.parent.attributeViews, this);
  return this; }
}

export class ReferenceView extends ViewRule {
edgeView: EdgeViewRule[] = [];
parent: ClassView;

apply(model: IModel, exclusive: boolean): void {
  const m: IReference = super.apply0(model, exclusive) as any;
  if (!m) return;
  for (let i = 0; i < this.edgeView.length; i++){ this.edgeView[i].applyEdgeReference(m, i, exclusive); }
}

initializeFromModel(m: IReference): ReferenceView {
  this.initializeFromModel0(m);
  const edges: IEdge[] = m.getEdges();
  for (let i = 0; i < m.childrens.length; i++) { this.edgeView.push(new EdgeViewRule(this).generateew(edges[i])); }
  return this; }

clone(obj0: Json): ReferenceView {
  this.clone0(obj0);
  const obj: ReferenceView = obj0 as ReferenceView;
  if (this.parent) U.ArrayAdd(this.parent.referenceViews, this);
  for (let i = 0; i < obj.edgeView.length; i++) { this.edgeView.push(new EdgeViewRule(this).clone(this.edgeView[i] as Json)); }
  return this; }
}

export class OperationView extends ViewRule {
parameterView: ParameterView[];
parent: ClassView;
apply(model: IModel, exclusive: boolean): void {
}

clone(obj0: Json): void {
}

initializeFromModel(m: ModelPiece): ModelView {
  return undefined;
}
}

export class ParameterView extends ViewRule {
parent: OperationView;
apply(model: IModel, exclusive: boolean): void {
}

clone(obj0: Json): void {
}

initializeFromModel(m: ModelPiece): ModelView {
  return undefined;
}
}
export class EdgePointView extends ViewRule {
parent: ReferenceView | ClassView;
apply(model: IModel, exclusive: boolean): void {  }

clone(obj0: Json): void { }

initializeFromModel(m: ModelPiece): ViewRule { U.pe(true, 'call Edgeview.generateew instead.'); return this; }

}
export class EdgeViewRule extends ViewRule {
public common: EdgeStyle;
public highlight: EdgeStyle;
public selected: EdgeStyle;
public midPoints: EdgePointView[];
edgeIndex: number;

apply(m: IModel, exclusive: boolean): void {
}

applyEdgeReference(m: IReference, edgeindex: number, exclusive: boolean) {

}

initializeFromModel(m: ModelPiece): ViewRule { U.pe(true, 'call Edgeview.generateew instead.'); return this; }
generateew(m: IEdge): EdgeViewRule {

  return this; }

clone(obj0: Json): EdgeViewRule {
  return this;
}
}
*/
//# sourceMappingURL=ViewPoint_DiscardedOption.js.map