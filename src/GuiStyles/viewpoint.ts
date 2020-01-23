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
  Dictionary,
  // Options,
  Point,
  GraphPoint,
  IVertex, GraphSize, EdgeStyle, Json, StyleComplexEntry, IClassifier,
} from '../common/Joiner';
import ChangeEvent = JQuery.ChangeEvent;
import BlurEvent = JQuery.BlurEvent;
import KeyDownEvent = JQuery.KeyDownEvent;
import KeyboardEventBase = JQuery.KeyboardEventBase;
import KeyUpEvent = JQuery.KeyUpEvent;
import ClickEvent = JQuery.ClickEvent;
import SelectEvent = JQuery.SelectEvent;

export class StyleVisibility {
  public static _public: string = 'public';
  public static _private: string = 'private';
  // approccio estendibile ai gruppi senza neanche creare nuove tabelle.
  public static _publicExceptUserList: string = 'crea una relationship table key=tutto= (owner+stylename+utenteCheNONPuòVedere)';
  public static _privateExceptUserList: string = 'crea una relationship table key=tutto= (owner+stylename+utenteChePuòVedere)';  // lo vede nessuno tranne...
  visibility: string;
}

export class ViewHtmlSettings{
  name: string;
  styleVisibility: StyleVisibility;
  userOwner: string;
  imgPreviewBase64: string;
  elementStylingCount: number;
  userImportingThis: number;
  forkCounter: number;
  ForkedFromStr_user: string;
  ForkedFromStr_name: string;
  AllowedOnM2: boolean;
  AllowedOnM1: boolean;
  allowedOnClass: boolean;
  allowedOnAttribute: boolean;
  allowedOnReference: boolean;
  allowedOnOperation: boolean;
  allowedOnParameter: boolean;
  featuredependency: {template: string, namesArray: string, typesArray: string}[] = []; // dot separated. "Class" as typeof (m1class | m2class) instead of the name
  protected html: Element = null;
  private htmlstr: string;

  toJSON(nameOrIndex: string): Json {
    this.updateHtmlMetaData();
    const copy0: any = {};
    for (let key in this) { copy0[key] = this[key]; }
    const copy: ViewHtmlSettings = copy0;
    copy.htmlstr = this.html.outerHTML;
    delete copy.html;
    return copy; }

  toString(): string { return JSON.stringify(this); }

  updateHtml(): void {
    this.html = U.toHtml(this.htmlstr);
    // todo: inserisci tutti gli attributi metadata nell html.
  }
  updateHtmlMetaData(): void {
    this.htmlstr = this.html.outerHTML;
    const $meta = $(this.html).find('meta');
    const setValue = (jq: JQuery<HTMLElement | SVGElement>): string => { return jq.length === 0 ? '' : jq[0].innerHTML; };
    const isTrue = (jq: JQuery<HTMLElement | SVGElement>): boolean => { return jq.length > 0 && jq[0].innerHTML  === '1' || jq[0].innerHTML === 'true'; };
    $meta.find('owner').text(this.userOwner);
    $meta.find('name').text(this.name);
    $meta.find('isM1').text(this.AllowedOnM1);
    $meta.find('isM2').text(this.AllowedOnM2);
    $meta.find('isClass').text(this.allowedOnClass);
    $meta.find('isAttribute').text(this.allowedOnAttribute);
    $meta.find('isReference').text(this.allowedOnReference);
    $meta.find('isOperation').text(this.allowedOnOperation);
    $meta.find('isParameter').text(this.allowedOnParameter);
    $meta.find('preview').html(this.imgPreviewBase64);
    let featuredependencystr: string = '';
    let i: number;
    for (i = 0; i < this.featuredependency.length; i++) {
      const f = this.featuredependency[i];
      featuredependencystr += '<dependency><template>' + f.template + '</template><names>' + f.namesArray + '</names><types>' + f.typesArray + '</types></template>';
    }
    $meta.find('featuredependencyList').html(featuredependencystr);
  }

  public setHtml(html: Element): void { return this.setHtml0(html, null); }
  public setHtmlStr(html: string): void { return this.setHtml0(null, html); }
  private setHtml0(html: Element, htmlstr: string): void {
    // U.pe(!html && !htmlstr, 'both html and htmlstr are null.');
    // U.pe(true, this, html, htmlstr, !html, !htmlstr, !html && !htmlstr);
    if (!html) { html = U.toHtml(htmlstr); }
    if (!htmlstr) { htmlstr = html ? html.outerHTML : null; }
    U.pe(!html || !htmlstr, this, 'html is null:', html, 'htmlstr:', htmlstr, 'html?', !html, 'htmlstr?', !htmlstr, 'html && htmlstr?', !html && !htmlstr);
    U.pe(!!html.parentElement || !!html.parentNode, 'parentElement shuld be null here:', html, this);
    this.html = html;
    const $meta: JQuery<Element> = $(html).find('meta');
    const getValue = (jq: JQuery<Element>): string => { return jq.length === 0 ? '' : jq[0].innerHTML; };
    const isTrue = (jq: JQuery<Element>): boolean => { return jq.length > 0 && (jq[0].innerHTML  === '1' || jq[0].innerHTML === 'true'); };
    this.userOwner = getValue($meta.find('owner'));
    this.name = getValue($meta.find('name'));
    this.AllowedOnM1 = isTrue($meta.find('isM1'));
    this.AllowedOnM2 = isTrue($meta.find('isM2'));
    this.allowedOnClass = isTrue($meta.find('isClass'));
    this.allowedOnAttribute = isTrue($meta.find('isAttribute'));
    this.allowedOnReference = isTrue($meta.find('isReference'));
    this.allowedOnOperation = isTrue($meta.find('isOperation'));
    this.allowedOnParameter = isTrue($meta.find('isParameter'));
    const $tmp: JQuery<HTMLElement> = $meta.find('preview') as JQuery<HTMLElement>;
    this.imgPreviewBase64 = $tmp.length > 0 ? $tmp[0].innerText : U.toBase64Image(U.toHtml('<div>Select a instance to initializeFromModel' +
      ' the preview.</div>')); }
  public getHtml(): Element { return this.html; }
  public getHtmlstr(): string { return this.html.outerHTML; }

  clone(json: ViewHtmlSettings) {
    this.allowedOnClass = json.allowedOnClass;
    this.allowedOnAttribute = json.allowedOnAttribute;
    this.allowedOnReference = json.allowedOnReference;
    this.allowedOnOperation = json.allowedOnOperation;
    this.allowedOnParameter = json.allowedOnParameter;
    this.AllowedOnM1 = json.AllowedOnM1;
    this.AllowedOnM2 = json.AllowedOnM2;
    this.elementStylingCount = json.elementStylingCount;
    this.featuredependency = json.featuredependency;
    this.forkCounter = json.forkCounter;
    this.ForkedFromStr_name = json.ForkedFromStr_name;
    this.ForkedFromStr_user = json.ForkedFromStr_user;
    //this.htmlstr = json.htmlstr;
    if (json.htmlstr) this.html = U.toHtml(json.htmlstr);
    U.pe(!(this.html instanceof Element), 'invalid htmlstr:', json.htmlstr, json);
  }

  setDependencyArray(featuredependency: {template: string, namesArray: string, typesArray: string}[]): void {
    // todo: insert metadata into html, copy from ModelPieceStyleEntry
  }

  saveToDB() {
    
  }
}

export class ViewRule {
  static allByID: Dictionary<number, ViewRule> = {};
  static maxID: number = 0;
  public id: number;
  public viewpoint: ViewPoint;
  public target: ModelPiece = null;
  protected targetStr: string = null;
  htmlo: ViewHtmlSettings = null;
  htmli: ViewHtmlSettings = null;
  /// for classes
  public displayAsEdge: boolean = false;
  public vertexSize: GraphSize = null;
  /// for classes or references
  public edgeViews: EdgeViewRule[] = [];
  protected viewpointstr: string;

  static getbyID(id: number): ViewRule { return ViewRule.allByID[id]; }
  static getbyHtml(html0: Element): ViewRule {
    let html: HTMLElement | SVGElement = html0 as HTMLElement | SVGElement;
    while (html && html.dataset && !html.dataset.styleid) html = html.parentNode as HTMLElement | SVGElement;
    return ViewRule.getbyID(html && html.dataset ? +html.dataset.styleid : null); }

  constructor(owner: ViewPoint, target: ModelPiece = null) {
    ViewRule[this.id = ViewRule.maxID++] = this;
    if (owner) owner.views.push(this);
    this.viewpoint = owner;
    this.target = target;
    this.setTargetStr();
  }

  // will be called by JSON.serialize() before starting, replacing the original parameter.
  toJSON(nameOrIndex: string): Json{
    const copy0: any = {};
    this.setViewpointStr();
    this.setTargetStr();
    for (let key in this) { copy0[key] = this[key]; }
    const copy: ViewRule = copy0;
    if (this.target instanceof IClassifier) this.vertexSize = this.target.getVertex().getSize();
    delete copy.id;
    delete copy.target;
    delete copy.viewpoint;
    return copy; }

  // redundant explicit call toJSON just to make the IDE realize i'm using it.
  toJsonString(): string { return JSON.stringify(this.toJSON(null)); }

  setViewpointStr(): void { this.viewpointstr = this.viewpoint ? this.viewpoint.name : null; }
  setTargetStr(): void {
    this.targetStr = this.target ? this.target.getKeyStr() : null;
    U.pe(!this.targetStr && !!this.target, 'failed to get targetstr from:', this.target);
  }

  updateViewpoint(vp: ViewPoint = null): void {
    this.viewpoint = vp || ViewPoint.get(this.viewpointstr);
    const arr = this.edgeViews ? this.edgeViews : [];
    let i: number;
    for (i = 0; i < arr.length; i++) { arr[i].updateViewpoint(vp); } }

  updateTarget(): void {
    const root: IModel = this.viewpoint.target;
    const path: number[] = JSON.parse(this.targetStr);
    const realindexfollowed: {indexFollowed: string[] | number[], debugArr: {index: string | number, elem: any}[]} = {indexFollowed: [], debugArr:[]};
    this.target = ModelPiece.getByKey(path, realindexfollowed);
    if (realindexfollowed.indexFollowed.length !== path.length) {
      U.pw(true, 'unable to find target of view:', this, ' search output:', realindexfollowed);
      this.target = null; }
  }
  clone(json: ViewRule): void {
    if(json.setViewpointStr) { json.setViewpointStr(); }
    for(let key in json) {
      switch (key){
      default: U.pe(true, 'unexpected key', key, json); break;
      case 'id': case 'target': break;
      case 'targetStr': this.targetStr = json[key]; break;
      case 'htmlo':
        if (!json.htmlo) { this.htmlo = null; break; }
        if (!this.htmlo) { this.htmlo = new ViewHtmlSettings(); }
        this.htmlo.clone(json.htmlo); break;
      case 'htmli':
        if (!json.htmli) { this.htmli = null; break; }
        if (!this.htmli) { this.htmli = new ViewHtmlSettings(); }
        this.htmli.clone(json.htmli); break;
      case 'displayAsEdge': this.displayAsEdge = json.displayAsEdge; break;
      case 'vertexSize': this.vertexSize = json.vertexSize ? new GraphSize().clone(json.vertexSize) : null; break;
      case 'edgeViews':
        this.edgeViews = [];
        const arr = json.edgeViews ? json.edgeViews : [];
        let i: number;
        for (i = 0; i < arr.length; i++) {
          U.ArrayAdd(this.edgeViews, new EdgeViewRule(this.viewpoint).clone(arr[i]));
        }
        break;
      case 'viewpointstr': this.viewpointstr = json.viewpointstr; break; }
    }
    this.updateViewpoint();
    this.updateTarget();
  }

  duplicate(): ViewRule {
    const duplicate = new ViewRule(null);
    duplicate.clone(this);
    return duplicate; }

  isEmpty(): boolean { return this.equals(new ViewRule(this.viewpoint)); }
  equals(other: ViewRule): boolean { return this.toString() === other.toString(); }
  // should only be called from ViewPoint
  apply(target: ModelPiece = null): void {
    this.target = target || this.target || ModelPiece.getByKeyStr(this.targetStr);
    console.log(this);
    this.viewpoint.viewsDictionary[this.target.id] = this;
    U.ArrayAdd(this.target.views, this);
  }
  // should only be called from ViewPoint
  detach() {
    // if (!this.target) return; target must never be deleted in Viewww.
    U.arrayRemoveAll(this.target.views, this);
    U.ArrayAdd(this.target.detachedViews, this);
    delete this.viewpoint.viewsDictionary[this.target.id];
    this.setTargetStr();
    // this.target = null; target must never be deleted in ViewRule
  }

  getViewPoint(): ViewPoint { return this.viewpoint; }

  delete(): void {
    console.log('modelview.delete() todo.' +
      'non posso invece di implementarla lasciarla "orfana" senza target e la faccio ignorare dal loader.' +
      'altrimenti non potrei cancellare la view senza cancellare il modelpiece, o forse basta settare tutto a null e mollarla lì?');
  }
}
//todo: nuova idea:
//  creo un set di View[] dentro un ViewPoint.
//  ogni View ha un target: ModelPiece, e un private targetStr: string usato solo per la serializzazione e de-serializzazione.
//  la targetStr deve essere presa da ModelPiece.getKey()
export class ViewPoint extends ViewRule{
  static allnames: Dictionary<string, ViewPoint> = {};
  target: IModel;
  name: string;
  views: ViewRule[];
  viewsDictionary: Dictionary<number, ViewRule>;
  zoom: Point;
  scroll: GraphPoint;
  gridShow: boolean;
  grid: GraphPoint;
  isApplied: boolean = false;

  static getAppliedViews_TOMOVE(m: ModelPiece): ViewRule[] {
    let i: number;
    const arr: ViewRule[] = [];
    for (let name in ViewPoint.allnames) {
      const vp: ViewPoint = ViewPoint.allnames[name];
      const v: ViewRule = vp.getMpStyle(m);
      if (v) arr.push(v);
    }
    return arr; }

  static get(value: string): ViewPoint {
    return ViewPoint.allnames[value];
  }
  // abstract _isApplied(): boolean;
  constructor(target: IModel, name: string = null) {
    super(null);
    this.scroll = new Point(0, 0);
    this.zoom = new Point(1, 1);
    this.grid = new Point(20, 20);
    this.viewsDictionary = {};
    this.views = [];
    this.setname(name);
    this.updateTarget(target); }

  updateTarget(m: IModel = null): void { this.apply(m, true); }

  getMpStyle(m: ModelPiece): ViewRule { return this.viewsDictionary[m.id]; }
  setname(s: string) {
    if (!s) s = 'ViewPoint 1';
    if (s === this.name) return;
    if (ViewPoint.allnames[this.name] === this) { delete ViewPoint.allnames[this.name]; }
    while (s in ViewPoint.allnames) { s = U.increaseEndingNumber(s); }
    ViewPoint.allnames[this.name = s] = this; }

  toJSON(nameOrIndex: string): Json {
    const copy0: any = {};
    this.setTargetStr();
    for (let key in this) { copy0[key] = this[key]; }
    const copy: ViewPoint = copy0;
    delete copy.viewpoint;
    delete copy.viewpointstr;
    delete copy.viewsDictionary;
    delete copy.target;
    return copy; }

  // toString(): string { return JSON.stringify(this); }
  // should only be called from ViewPointShell
  apply(m: IModel = null, onlyAttach: boolean = false, debug: boolean = false): void {
    if (m !== this.target) this.detach();
    this.target = m = (m || this.target);
    U.pe(!this.target, 'called ViewPoint.apply() without a target.', this);
    U.pif(debug, 'add() PRE:', this.target.viewpoints.map((vp) => vp.name), this.target.viewpoints);
    U.arrayRemoveAll(this.target.viewpoints, this);
    U.pif(debug, 'add() MID:', this.target.viewpoints.map((vp) => vp.name), this.target.viewpoints, this.target.viewpoints.indexOf(this));
    U.pif(debug, this.target.viewpoints);
    // U.pw(true, 'stopped');
    // todo: il browser chrome è impazzito e mi fa il sort per nome ogni volta che faccio push.
    this.target.viewpoints.push(this); // NON usare U.ArrayAdd(), la rimozione è necessaria per garantire che venga sempre aggiunto in fondo.
    U.pif(debug, this.target.viewpoints);
    U.pif(debug, 'add() POST:', this.target.viewpoints.map((vp) => vp.name), this.target.viewpoints);
    if (onlyAttach) return;
    let i: number;
    for (i  = 0; i < this.views.length; i++) {
      let v: ViewRule = this.views[i];
      v.apply();
    }
    this.isApplied = true;

    // U.pe(true, 'stopped here still works');
  }
  // should only be called from ViewPointShell
  detach(): void {
    if (!this.isApplied) return;
    // NB: don't remove from model.viewPoints, just de-apply it.
    for(let istr in this.viewsDictionary) {
      let i: number = +istr;
      let v: ViewRule = this.viewsDictionary[i];
      v.detach();
    }
    this.isApplied = false;
  }
  // should only be called from ViewPointShell
  delete() {
    this.detach();
    U.arrayRemoveAll(this.target.viewpoints, this);
    this.target = null;
  }

  clone(json: ViewPoint): void {
    if (json.target && json.setTargetStr) json.setTargetStr();
    let i: number;
    for(let key in json) {
      switch (key){
      default: U.pe(true, 'unexpected key:', key, json); break;
      case 'id': case 'target': case 'viewpoint': break;
      case 'htmlo':
        if (!json.htmlo) { this.htmlo = null; continue; }
        if (!this.htmlo) this.htmlo = new ViewHtmlSettings();
        this.htmlo.clone(json.htmlo);
        break;
      case 'htmli':
        if (!json.htmli) { this.htmli = null; continue; }
        if (!this.htmli) this.htmli = new ViewHtmlSettings();
        this.htmli.clone(json.htmli as ViewHtmlSettings);
        break;
      case 'isApplied': this.isApplied = json.isApplied; break;
      case 'name': this.setname(json.name); break;
      case 'targetStr':
        if (!json.targetStr) break;
        this.targetStr = json.targetStr;
        const m: IModel = ModelPiece.getByKeyStr(this.targetStr) as IModel;
        U.pe(!m, 'failed to find VP.target:', this, this.targetStr, Status.status);
        this.updateTarget(m); break;
      case 'edgeViews':
        this.edgeViews = [];
        if (!json.edgeViews) continue;
        for (i = 0; i < json.edgeViews.length; i++) {
          const v: EdgeViewRule = new EdgeViewRule(this);
          v.clone(json.edgeViews[i]);
          U.ArrayAdd(this.edgeViews, v); } break;
      case 'views':
        this.views = [];
        if (!json.views) continue;
        for (i = 0; i < json.views.length; i++) {
          const v: ViewRule = new ViewRule(this);
          v.clone(json.views[i]);
          U.ArrayAdd(this.views, v); } break;
      case 'grid': this.grid = new Point(json.grid.x, json.grid.y); break;
      case 'gridShow': this.gridShow = json.gridShow; break;
      case 'scroll': this.scroll = new GraphPoint(json.scroll.x, json.scroll.y); break;
      case 'zoom': this.zoom = new GraphPoint(json.zoom.x, json.zoom.y);  break;
      case 'vertexSize': this.vertexSize = json.vertexSize ? new GraphSize(json.vertexSize.x, json.vertexSize.y) : null; break;
      case 'displayAsEdge': this.displayAsEdge = json.displayAsEdge; break;
      }
    }
  }

  duplicate(): ViewRule {
    const duplicate = new ViewPoint(null);
    duplicate.clone(this);
    return duplicate; }

  isEmpty(): boolean {
    const SingleLinkedTempVp = new ViewPoint(null);
    SingleLinkedTempVp.target = this.target;
    // NB: il target deve essere settato così "raw" non tramite costruttore e funzioni perchè non deve inserirlo nei viewpoints[] del target.
    return this.equals(SingleLinkedTempVp, true); }

  equals(other: ViewPoint, ignoreName: boolean = true): boolean {
    const tmp = this.name;
    if (ignoreName) this.name = other.name;
    const ret: boolean = this.toString() === other.toString();
    this.name = tmp;
    return ret; }
}

export class EdgeViewRule extends ViewRule {
  public common: EdgeStyle;
  public highlight: EdgeStyle;
  public selected: EdgeStyle;
  public midPoints: EdgePointView[];
  public edgeIndex: number;

  clone(obj0: Json): EdgeViewRule {
    return this;
  }
}

export class EdgePointView extends ViewRule {
  clone(obj0: Json): void { }


}
