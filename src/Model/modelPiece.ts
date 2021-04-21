import {
  Dictionary,
  EdgePointStyle,
  EdgeStyle,
  GraphSize,
  EdgeModes,
  IAttribute,
  M2Class,
  IEdge,
  IFeature,
  IModel,
  IPackage,
  IReference,
  IVertex,
  Json,
  Model,
  Status,
  U,
  IClass,
  MClass,
  MetaModel,
  MetaMetaModel,
  EOperation,
  EParameter,
  MAttribute,
  MReference,
  ViewHtmlSettings,
  M3Reference,
  M2Attribute,
  M3Attribute,
  M3Class,
  M2Reference,
  M3Package,
  MPackage,
  M2Package,
  Type,
  ELiteral,
  EEnum,
  EAnnotation,
  IClassifier,
  IGraph,
  Typedd,
  IField,
  TSON_JSTypes, ViewPoint, Size, ISize, ReservedClasses
} from '../common/Joiner';

import ClickEvent = JQuery.ClickEvent;
import MouseMoveEvent = JQuery.MouseMoveEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import {ViewRule} from '../GuiStyles/viewpoint';
import {deserializeSummaries} from '@angular/compiler/src/aot/summary_serializer';
import {FunctionCall} from '@angular/compiler';
import {Mark} from '../guiElements/mGraph/Vertex/Mark';
import ContextMenuEvent = JQuery.ContextMenuEvent;
export class StyleComplexEntry {
  html: Element;
  htmlobj: ViewHtmlSettings;
  view: ViewRule;
  ownermp: ModelPiece;
  isownhtml: boolean = false;
  isinstanceshtml: boolean = false;
  isCustomGlobalhtml: boolean = false;
  isGlobalhtml: boolean = false;
}

export class Info {
  static forConsole(obj: any): any {}

  static setraw(baseJson: object, k: string, v: any, toLower: boolean = true): string { return Info.set(baseJson, k, v, '', toLower); }
  static setc(baseJson: object, k: string, v: any, toLower: boolean = true): string { return Info.set(baseJson, k, v, '@', toLower); }
  static seti(baseJson: object, k: string, v: any, toLower: boolean = true): string  { return Info.set(baseJson, k, v, '#', toLower); }
  static set(baseJson: object, k: string, v: any, prefixc: string = '_', toLower: boolean = true): string {
    k = toLower ? k.toLowerCase() : k;
    let prefix = prefixc;
    // U.pw(baseJson[prefix + k], 'setinfo() name altready set: ', k, baseJson);
    while (baseJson[prefix + k]) { prefix += prefixc === '' ? '*' : prefixc; }
    baseJson[prefix + k] = v;
    // if (prefix === '') { baseJson[prefixc + k] = v; }
    return prefix + k; }

  static unsetraw(baseJson: object, k: string, toLower: boolean = true): void { return Info.unset(baseJson, k, '', toLower); }
  static unsetc(baseJson: object, k: string, toLower: boolean = true): void { return Info.unset(baseJson, k, '@', toLower); }
  static unseti(baseJson: object, k: string, toLower: boolean = true): void { return Info.unset(baseJson, k, '#', toLower); }
  static unset(baseJson: object, k: string, prefixc: string = '_', toLower: boolean = true): void {
    k = prefixc + (toLower ? k.toLowerCase() : k);
    delete baseJson[k]; }

  static renameraw(o: object, k1: string, k2: string, toLower: boolean = true): void { return Info.rename(o, k1, k2, '', toLower); }
  static renamec(o: object, k1: string, k2: string, toLower: boolean = true): void { return Info.rename(o, k1, k2, '@', toLower); }
  static renamei(o: object, k1: string, k2: string, toLower: boolean = true): void  { return Info.rename(o, k1, k2, '#', toLower); }
  static rename(baseJson: object, k1: string, k2: string, prefixc: string = '_', toLower: boolean = true): void {
    k1 = prefixc + (toLower ? k1.toLowerCase() : k2);
    k2 = prefixc + (toLower ? k1.toLowerCase() : k2);
    const old: any = baseJson[k1];
    delete baseJson[k1];
    baseJson[k2] = old; }

  static merge(info: Info, targetinfo: Info, prefixc: string = '->'): void {
    let key: string;
    if (!targetinfo) { return; }
    for (key in targetinfo) {
      if (!targetinfo.hasOwnProperty(key)) { continue; }
      if (!prefixc) { switch (key[0]) {
        default: prefixc = ''; break;
        case '#': case '_': case '@': prefixc = key[0]; break; } }
      // console.log('Info.set(' + info + ', ' + key + ', ' + targetinfo[key] + ', ' + prefixc);
      Info.set(info, key, targetinfo[key], prefixc); }
  }
}

export abstract class ModelPiece {
  private static idToLogic = {};
  private static idMax = 0;
  id: number = null;
  parent: ModelPiece = null;
  childrens: ModelPiece[] = [];
  metaParent: ModelPiece = null;
  instances: ModelPiece[] = [];
  name: string = null;
  // styleOfInstances:Element = null;
  // customStyleToErase: Element = null;
  // styleobj: ModelPieceStyleEntry = null;
  key: number[] = null;
  views: ViewRule[] = null;
  annotations: EAnnotation[] = [];
  detachedViews: ViewRule[] = []; // required to delete modelpiece
  private className: string;

  static GetStyle(model: IModel, tsClass: string, checkCustomizedFirst: boolean = true): Element {
    let rootSelector: string;
    if (model.isM()) { rootSelector = '.MDefaultStyles';
    } else if (model.isMM()) { rootSelector = '.MMDefaultStyles';
    } else { U.pe(true, 'm3 objects should not call getStyle()'); }

    let $html: JQuery<Element>;
    const $root: JQuery<Element> = $((checkCustomizedFirst ? '.customized' : '.immutable') + rootSelector);
    if (tsClass.indexOf('m1') === 0 || tsClass.indexOf('m2') === 0) { tsClass = tsClass.substr(2); }
    switch (tsClass) {
      default: U.pe(true, 'unrecognized TS Class: ' + tsClass); return null;
      case 'EEnum': $html = $root.find('.template.EEnum'); break;
      case 'ELiteral': $html = $root.find('.template.ELiteral'); break;
      case 'Class': $html = $root.find('.template.Class'); break;
      case 'Attribute': $html = $root.find('.template.Attribute'); break;
      case 'Reference': $html = $root.find('.template.Reference'); break;
      case 'EOperation': $html = $root.find('.template.Operation'); break;
      case 'EParameter': $html = $root.find('.template.Parameter'); break; }
    U.pw(checkCustomizedFirst && $html.length > 1,
      'found more than one match for custom global style, should there be only 0 or 1.', $html, $root, this, tsClass);
    if (checkCustomizedFirst && $html.length === 0) { return ModelPiece.GetStyle(model, tsClass, false); }
    /*console.log('class?' + (this instanceof IClass), $root.find('.Template'), $root.find('.Class'),
      $root.find('.Template.Class'));
    console.log('condition:', !customizeds, ' && ', $html.length !== -1);*/
    U.pe(!checkCustomizedFirst && $html.length !== 1,
      'expected exactly 1 match for the un-customized global style, found instead ' + $html.length + ':', $html, $root, this);
    const ret: Element = U.cloneHtml($html[0], true);
    ret.classList.remove('template');
    ret.classList.remove('Customized');
    return ret; }

  public static getByKey(path: number[], realindexfollowed: {indexFollowed: string[] | number[], debugArr: {index: string | number, elem: any}[]} = null): ModelPiece {
    U.pe(!Array.isArray(path), 'ModelPiece.getByKey() should only be called with an array as key:', path);
    U.pe(path.length < 1, 'ModelPiece.getByKey() path array must have >= 1 elements:', path);
    const tmpRoot = {'childrens': [Status.status.m, Status.status.mm, Status.status.mmm]};
    let ret = U.followIndexesPath(tmpRoot, path, 'childrens', realindexfollowed, true);
    U.pe(!(ret instanceof ModelPiece), 'ModelPiece.getByKey failed: ', ret, realindexfollowed);
    return ret; }

  public static getByKeyStr(key: string, realindexfollowed: {indexFollowed: string[] | number[], debugArr: {index: string | number, elem: any}[]} = null): ModelPiece {
    return ModelPiece.getByKey(JSON.parse(key), realindexfollowed); }

  static get(e: JQuery.ChangeEvent | ClickEvent | MouseMoveEvent | MouseDownEvent | MouseUpEvent | Event | ContextMenuEvent): ModelPiece {
    return ModelPiece.getLogic(e.target); }

  public static getLogicalRootOfHtml(html0: Element): Element {
    let html: HTMLElement = html0 as HTMLElement;
    if (!html) { return null; }
    while ( html && (!html.dataset || !html.dataset.modelpieceid)) { html = html.parentElement; }
    return html; }

  static getLogic(html0: Element): ModelPiece {
    let html: HTMLElement = this.getLogicalRootOfHtml(html0) as HTMLElement;
    const ret: ModelPiece = html ? ModelPiece.getByID(+html.dataset.modelpieceid) : null;
    // U.pe(!(ret instanceof T), 'got logic with unexpected class type:', this);
    return ret; }

  static getByID(id: number): ModelPiece { return ModelPiece.idToLogic[id]; }

  constructor(parent: ModelPiece, metaVersion: ModelPiece) {
    this.assignID();
    this.parent = parent;
    this.metaParent = metaVersion;
    this.instances = [];
    this.childrens = [];
    this.views = [];
    if (this.parent) { U.ArrayAdd(this.parent.childrens, this); }
    if (this.metaParent) { U.ArrayAdd(this.metaParent.instances, this); }
  }

  assignID(): number {
    this.id = ModelPiece.idMax++;
    ModelPiece.idToLogic[this.id] = this;
    return this.id; }

  getID(): number { return this.id; }
  getSelector(): string { return '#ID' + this.id; }
  getChildren(index: number): ModelPiece { return this.childrens[index]; }
  getChildrenSelector(index: number): string { return this.getChildren(index).getSelector(); }

  //todo: devo stare attento ogni volta che aggiungo-elimino un elemento a chiamare updateKey()
  // le views si salvano perchè usano la chiave all avvio e poi la rigenerano ad ogni salvataggio e non la usano ulteriormente se non per generare
  // la savestring.
  getKey(): number[] { return this.key ? this.key : this.updateKey(); }
  getKeyStr(): string { return JSON.stringify(this.getKey()); }

  updateKey(): number[] {
    const m = this.getModelRoot();
    const mnum = m.isM3() ? 2 : (m.isM2() ? 1 : 0);
    const pathIndex: number[] = U.getIndexesPath(this, 'parent', 'childrens');
    return this.key = [mnum, ...pathIndex]; }

  replaceVarsSetup(): void { return; }

  linkToLogic(html0: Element, asVertex: boolean = true): void {
    let html: HTMLElement = html0 as HTMLElement;
    if (this.id === null || this.id === undefined) { U.pw(true, 'undefined id:', this); return; }
    if (asVertex) html.classList.add(ReservedClasses.vertexRootG);
    // html.classList.add('VertexShell');
    html.dataset.modelpieceid = '' + this.id; }

  getm2(): MetaModel {
    const root: IModel = this.getModelRoot();
    if (root instanceof Model) { return root.metaParent; }
    if (root instanceof MetaModel) { return root; }
    if (root instanceof MetaMetaModel) { return root.instances[0]; }
    U.pe(true, 'failed to get root.'); }

  getModelRoot(): IModel {
    let p: ModelPiece = this;
    let i = 0;
    while (p.parent && p !== p.parent && i++ < 6) { p = p.parent; }
    U.pe(!p  || !(p instanceof IModel), 'failed to get model root:', this, 'm lastParent:', p);
    return p as any as IModel; }

  isChildNameTaken(s: string, caseSensitive: boolean = false): boolean {
    let i;
    s = s && s.toLowerCase();
    for (i = 0; i < this.childrens.length; i++) {
      let f: ModelPiece = this.childrens[i];
      if (s === (caseSensitive ? f.name : f.name && f.name.toLowerCase())) { return true; } }
    return false; }

  shouldBeDisplayedAsEdge(set: boolean = null): boolean {
    if (set !== null) {
      U.pe( !(this instanceof IClass), 'shouldBeDisplayedAsEdge(' + set + ') should only be set on M2Class instances');
      (this as any as IClass).shouldBeDisplayedAsEdgeVar = set;
      Type.updateTypeSelectors(null, false, false, true);
      return set; }
    if (this instanceof IModel) { return false; }
    if (this instanceof IPackage) { return false; }
    if (this instanceof EEnum) { return false; }
    if (this instanceof IClass) { return (this as IClass).shouldBeDisplayedAsEdgeVar; }
    if (this instanceof IAttribute) { return false; }
    if (this instanceof IReference) { return true; }
    if (this instanceof EOperation) { return false; }
    if (this instanceof EParameter) { return false; }
    if (this instanceof ELiteral) { return false; }
    U.pe(true, 'unrecognized class:', this);
  }

  refreshGUI(debug: boolean = false): void {
    if (!Status.status.loadedLogic) { return; }
    let model: IModel = this.getModelRoot();
    const thingsToRefresh: ModelPiece[] = [this];
    let i: number;

    if (Status.status.refreshModeAll) {
      U.ArrayAdd(thingsToRefresh, Status.status.mmm);
      U.ArrayAdd(thingsToRefresh, Status.status.mm);
      U.ArrayAdd(thingsToRefresh, Status.status.m); }
    if (Status.status.refreshModelAndInstances && model) {
      U.ArrayAdd(thingsToRefresh, model);
      for (i = 0; model.instances && i < model.instances.length; i++) { U.ArrayAdd(thingsToRefresh, model.instances[i]); }
      return; }
    if (Status.status.refreshModelAndParent && model && model.metaParent) {
      model = model.metaParent;
      U.ArrayAdd(thingsToRefresh, model);
      for (i = 0; model.instances && i < model.instances.length; i++) { U.ArrayAdd(thingsToRefresh, model.instances[i]); }
      return; }
    if (Status.status.refreshInstancesToo) {
      for (i = 0; this.instances && i < this.instances.length; i++) { U.ArrayAdd(thingsToRefresh, this.instances[i]); } }
    if (Status.status.refreshModel && model) { U.ArrayAdd(thingsToRefresh, model); }
    if (Status.status.refreshMetaParentToo && this.metaParent) { U.ArrayAdd(thingsToRefresh, this.metaParent); }
    if (Status.status.refreshParentToo && this.parent) { U.ArrayAdd(thingsToRefresh, this.parent); }

    for (i = 0; i < thingsToRefresh.length; i++) {
      const mp: ModelPiece = thingsToRefresh[i];
      if (mp) { mp.refreshGUI_Alone(debug); }
    }
  }

  refreshInstancesGUI(): void {
    let i = 0;
    U.pe(!this.instances, '', this);
    while (i < this.instances.length) {
      try { this.instances[i++].refreshGUI_Alone(false); } catch (e) {} finally {}
    }
  }


  Vmarks: Dictionary<string, Mark> = {};
  static allmarks: Dictionary<string, Mark> = {} as any;/*
  static updateMarkings(): void {
    // cannot achieve perfection but can call it when:
    // resizeobserver on html + callback on vertexmove + callback on graph move or zoom and set big setinterval
    per ora fallo solo con setinterval dal main e check on ModelPiece.allmarks;
  }*/

  unmarkAll(condition: (key: string) => boolean = null): void{
    // console.log('unmarkAll()', this.Vmarks, condition);
    for (let key in this.Vmarks) {
      // console.log('unmarkAll() key:' + key + ', conditionCheck: ', condition && condition(key), this.Vmarks[key]);
      if (condition && !condition(key)) continue;
      const mark: Mark = this.Vmarks[key];
      mark.mark(false); }
  }

  mark(markb: boolean, paired: ModelPiece, key: string, color: string = null, radiusX: number = 10, radiusY: number = 10,
       width: number = 5, backColor: string = null, extraOffset: ISize = null): void {
    if (markb) new Mark(this, paired, key, color, radiusX, radiusY, width, backColor, extraOffset).mark(true);
    else this.Vmarks[key] && (this.Vmarks[key] as Mark).mark(false);
    return; }

  generateModelString(): string {
    const json: Json = this.generateModel({});
    // console.log('genmodelstring:', json, 'this:',  this);
    return JSON.stringify(json, null, 4); }

  refreshGUI_Alone(debug?: boolean): void {
    if (!Status.status.loadedLogic) { return; }
    let v: IVertex = this.getVertex();
    v.refreshGUI();
    // console.log('pbar selected:', v.owner.propertyBar.selectedModelPiece.name, 'me:', this.name);
    if (this.isChildrenOf(v.owner.propertyBar.selectedModelPiece, true, true)) v.owner.propertyBar.refreshGUI(); }

  isChildrenOf(parent: ModelPiece, includeEqual: boolean = false, includeGrandChildren: boolean = false): boolean {
    if (includeEqual && parent == this) return true;
    if (parent.childrens.indexOf(this) >= 0) return true;
    if (!includeGrandChildren) return false;
    let child: ModelPiece = this;
    while ((child = child.parent)) {
      if (parent.childrens.indexOf(this) >= 0) return true; }
    return false; }

  abstract fullname(): string;
  endingName(valueMaxLength: number = 10): string { return ''; }

  public printableName(valueMaxLength: number = 5, full: boolean = false): string {
    if (this.name !== null) { return full ? this.fullname() : this.name; }
    const ending: String = this.endingName(valueMaxLength);
    return (full ? this.metaParent.fullname() : this.metaParent.name) + ':' + this.id + (ending && ending !== '' ? ':' + ending : ''); }

  public printableNameshort(valueMaxLength: number = 5): string {
    if (this.name !== null) { return this.name; }
    const ending: String = this.endingName(valueMaxLength);
    return this.metaParent.name + ':' + this.id + (ending && ending !== '' ? ':' + ending : ''); }

  abstract parse(json: Json, destructive?: boolean): void;
  abstract getVertex(canMakeIt?: boolean): IVertex;
  abstract generateModel(loopDetectionObj: Dictionary<number /*MClass id*/, ModelPiece>): Json;
  toJSON(loopDetectionObj: Dictionary<number /*MClass id*/, ModelPiece>): Json{
    let ret = {} as any;
    ret.id = this.id;
    ret.name = this.name;
    ret.parent = this.parent.id;
    ret.metaParent = this.metaParent.id;
    ret.annotations = this.annotations.map( (e) => e.id);
    ret.childrens = this.childrens.map( (e) => e.id);
    ret.detachedViews = this.detachedViews.map( (e) => e.id);
    ret.views = this.views.map( (e) => e.id);
    // ret.instances = this.instances.map( (e) => e.id); not a permanent stored data, le istanze sono solo quelle disegnate al momento, non TUTTE,
    // se un M2 è collegato a più M1 crea problemi serializzare anche questo.
    // M1 può avere reference a M2 che viene caricato, M2 non può avere reference persistenti a M1, altrimenti caricherebbe tutti i suoi M1.
    return ret; }

  abstract duplicate(nameAppend?: string, newParent?: ModelPiece): ModelPiece;
  // abstract conformability(metaparent: ModelPiece, outObj?: any/*.refPermutation, .attrPermutation*/, debug?: boolean): number;

  setName0(value: string, refreshGUI: boolean = false, warnDuplicateFix: boolean = false, key: string, allowEmpty: boolean): string {
    if (value === this['' + key]) return this['' + key];
    const valueOld: string = this['' + key];
    const valueInputError = value;
    value = value !== null && value !== undefined ? '' + value.trim() : null;
    const regexp: RegExp = new RegExp((allowEmpty ? '^$|' : '') + '^[a-zA-Z_$][a-zA-Z_$0-9]*$');
//    console.log('set' + key + '.valid ? ' + regexp.test(value) + ' |' + value + '|');
    if (!regexp.test(value)) {
      value = value.replace(/([^a-zA-Z_$0-9])/g, '');
      let i: number = 0;
      while (value[i] && value[i] >= '0' && value[i] <= '9') i++;
      value = value.substr(i);
      let remainder: string = value;
      let firstChar: string = '';
      while (remainder.length > 0 && firstChar === '') {
        firstChar = remainder[0].replace('[^a-zA-Z_$]', '');
        remainder = remainder.substring(1); }
      value = firstChar + remainder;
      U.pw(true, 'a valid ' + key + ' must be match this regular expression: ' + regexp.compile().toString()
        + '; trying autofix: |' + valueInputError + '| --> + |' + value + '|');
      return this['set' + U.firstToUpper(key)](value, true || refreshGUI); }

    if (!allowEmpty && (!value || value === '')) { U.pw(true, key + ' cannot be empty.'); return valueOld; }
    if (value === valueOld) { return valueOld; }

    let nameFixed: boolean = false;
    let i: number;
    if (this instanceof EOperation) {
      const op = this as EOperation;
      this['' + key] = value;
      op.parent.checkViolations(true);
    } else while (this.parent && this.parent['isChild' +  U.firstToUpper(key) + 'Taken'](value) && valueOld !== value) {
      nameFixed = true;
      value = U.increaseEndingNumber(value, false, false); }
    U.pe(nameFixed && (valueInputError === value), 'increaseEningNumber failed:', value, this, this.parent ? this.parent.childrens : null);
    U.pw(nameFixed && warnDuplicateFix, 'that ' + key + ' is already used in this context, trying autofix: |'
      + valueInputError + '| --> + |' + value + '|');

    this['' + key] = value;
    if (refreshGUI) { this.refreshGUI(); }
    return this['' + key]; }

  // meant to be called from user js.
  getChildrenByName(name: string, caseSensitive: boolean = false): ModelPiece {
    let i: number;
    U.pe(!name || name !== '' + name, 'ModelPiece.getChildren() name must be a non-empty string, found: |' + name + '|', name);
    if (!caseSensitive) name = name.toLowerCase();
    const m: IModel = this.getModelRoot();
    const ism1: boolean = m.isM1();
    for (i = 0; i < this.childrens.length; i++){
      const mp: ModelPiece = this.childrens[i];
      let name2: string = (ism1 ? mp.metaParent.name : mp.name);
      if (!caseSensitive) name2 = name2 && name2.toLowerCase();
      if (name === name2) return mp;
    }
    return null; }

  preReplace(): void { this.className = this.getFriendlyClassName(); }

  setName(value: string, refreshGUI: boolean = false, warnDuplicateFix: boolean = false): string { return this.setName0(value, refreshGUI, warnDuplicateFix, 'name', false); }
/*  setNameOld(value: string, refreshGUI: boolean = false, warnDuplicateFix: boolean = true): string {
    const valueOld: string = this.name;
    const valueInputError = value;
    value = value ? '' + value.trim() : null;
    if (!value || value === '') { U.pw(true, 'name cannot be empty.'); return valueOld; }
    if (value === valueOld) { return valueOld; }
    const regexp: RegExp = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
    // console.log('setName.valid ? ' + regexp.test(value) + ' |' + value + '|');
    if (!regexp.test(value)) { value = value.replace(/([^a-zA-Z_$0-9])/g, '');
      let i: number = 0;
      while (value[i] && value[i] >= '0' && value[i] <= '9') i++;
      value = value.substr(i);
      let remainder: string = value;
      let firstChar: string = '' || '';
      while (remainder.length > 0 && firstChar === '') {
        firstChar = remainder[0].replace('[^a-zA-Z_$]', '');
        remainder = remainder.substring(1); }
      value = firstChar + remainder;
      U.pw(true, 'a valid name must be match this regular expression: ' + regexp.compile().toString()
        + '; trying autofix: |' + valueInputError + '| --> + |' + value + '|');
      return this.setName(value, true || refreshGUI); }

    let nameFixed: boolean = false;
    let i: number;
    if (this instanceof EOperation) {
      const op = this as EOperation;
      let omonimi: EOperation[] = op.parent.getOperations(value, false);
      op.unmarkIncompatibility();
      for (i = 0; i < omonimi.length; i++) {
        const other: EOperation = omonimi[i];
        if (!op.isCompatible(other)) { op.markIncompatibility(other); }
      }
    }
    else {
      while (this.parent && this.parent.isChildNameTaken(value)) {
        nameFixed = true;
        value = U.increaseEndingNumber(value, false, false); }
      U.pe(nameFixed && (valueInputError === value), 'increaseEndingNumber failed:', value, this, this.parent ? this.parent.childrens : null);
      U.pw(nameFixed && warnDuplicateFix, 'that name is already used in this context, trying autofix: |'
        + valueInputError + '| --> + |' + value + '|', this);
    }
    this.name = value;
    const model: IModel = this.parent ? this.getModelRoot() : null;
    // for (i = 0; model && i < model.instances.length; i++) { model.instances[i].sidebar.fullnameChanged(valueOld, this.name); }
    if (refreshGUI) { this.refreshGUI(); }
    Type.updateTypeSelectors(null, false, false, true);
    return this.name; }
*/
  fieldChanged(e: JQuery.ChangeEvent): void {
    // todo: fix for m2 too. i need to enable custom input in custom viewpoints.
    // U.pe(true, U.getTSClassName(this) + '.fieldChanged() should never be called.');
  }

  copy(other: ModelPiece, nameAppend: string = '_Copy', newParent: ModelPiece = null): void {
    this.setName(other.name + nameAppend);
    let i: number;
    this.views = [];
    for (i = 0; i < other.views.length; i++) {
      const v: ViewRule = other.views[i];
      U.ArrayAdd(this.views, v.duplicate());
    }
    this.parent = newParent ? newParent : other.parent;
    if (this.parent) { U.ArrayAdd(this.parent.childrens, this); }

    this.childrens = [];
    for (i = 0; i < other.childrens.length; i++) { this.childrens.push(other.childrens[i].duplicate('', this)); }
    this.metaParent = other.metaParent;
    if (this.metaParent) { U.ArrayAdd(this.metaParent.instances, this); }
    this.instances = [];
    this.refreshGUI(); }

  // nb: le sottoclassi lo devono sempre chiamare con refreshgui = false
  delete(refreshgui: boolean = true): void {
    console.trace("delete remove self", this, refreshgui);
    this.unmarkAll();
    if (this.parent) {
      U.arrayRemoveAll(this.parent.childrens, this);
      this.parent = null; }
    if (this.metaParent) {
      U.arrayRemoveAll(this.metaParent.instances, this);
      this.metaParent = null; }
    console.log("delete remove childs", this, refreshgui);
    let i: number;
    let arr: any = U.shallowArrayCopy<ViewRule>(this.views);
    for (i = 0; arr && i < arr.length; i++) { arr[i].delete(); }
    arr = U.shallowArrayCopy<ViewRule>(this.detachedViews);
    for (i = 0; arr && i < arr.length; i++) { arr[i].delete(); }
    console.log("delete remove views", this, refreshgui);
    arr = U.shallowArrayCopy<ModelPiece>(this.childrens);
    for (i = 0; arr && i < arr.length; i++) { arr[i].delete(false); }

    console.log("delete remove or convert instances", this, refreshgui);
    arr = U.shallowArrayCopy<ModelPiece>(this.instances);
    if (this instanceof M2Class){
      const instances: MClass[] = arr as any;
      const scores = this.getTypeConversionScores();
      const newType: M2Class = scores.length && scores[0].class;
      if (!newType){
        for (i = 0; instances && i < instances.length; i++) { instances[i].delete(false); }
      }
      else {
        for (i = 0; instances && i < instances.length; i++) { instances[i].convertTo(newType); }
      }
      // posso promuovere le istanze ad una sottoclasse o superclasse di quella cancellata invece di eliminarle.

    } else {
      // not m2-class.
      for (i = 0; arr && i < arr.length; i++) { arr[i].delete(false); }
    }
    console.log("delete end, refresh gui", this, refreshgui);
    if (refreshgui) this.refreshGUI();
  }


  validate(isDeprecated: boolean = true): boolean {
    const names: Dictionary<string, ModelPiece> = {};
    let i: number;
    if (!U.isValidName(name)) { this.mark(true, null, 'Invalid name'); return false; }
    for (i = 0; i < this.childrens.length; i++) {
      const child: ModelPiece = this.childrens[i];
      const name: string = child.name;
      if (names.hasOwnProperty(name)) { child.mark(true, names[name], 'Duplicate children name'); return false; }
      else child.mark(false, null, 'Duplicate children name');
      child.validate();
      names[name] = child; }
    return true; }

  /*
    setStyle_SelfLevel_1(html: Element): void { this.customStyleToErase = html; }
    setStyle_InstancesLevel_2(html: Element): void { this.styleOfInstances = html; }
    setStyle_GlobalLevel_3(html: Element): void {
      const oldCustomStyle: Element = this.getGlobalLevelStyle(true);
      if (oldCustomStyle) { oldCustomStyle.parentNode.removeChild(oldCustomStyle); }
      const model: IModel = this.getModelRoot();
      let rootSelector: string;
      if (model.isM()) { rootSelector = '.MDefaultStyles';
      } else if (model.isMM()) { rootSelector = '.MMDefaultStyles';
      } else { U.pe(true, 'm3 objects should not call getStyle()'); }
      let selectorClass: string = '' + '_ERROR_';
      if (false && false) {
      } else if (this instanceof IClass) { selectorClass = ('Class');
      } else if (this instanceof IReference) { selectorClass = ('Reference');
      } else if (this instanceof IAttribute) { selectorClass = ('Attribute'); }

      let $root: JQuery<Element>;
      $root = $('.customized' + rootSelector);
      const container: Element = $root[0];
      html.classList.add('Template', selectorClass, (this instanceof IClass ? 'Vertex' : ''));
      container.appendChild(html); }*/

  getGlobalLevelStyle(checkCustomizedFirst: boolean = true): Element {
    let tsClass: string = this.getClassName();/*
    if (false && false ) {
    } else if (this instanceof IClass) { tsClass = 'Class';
    } else if (this instanceof IAttribute) { tsClass = 'Attribute';
    } else if (this instanceof IReference) { tsClass = 'Reference';
    } else if (this instanceof EOperation) { tsClass = 'EOperation';
    } else if (this instanceof EParameter) { tsClass = 'EParameter';
    } else { tsClass = 'ERROR: ' + U.getTSClassName(this); }*/
    return ModelPiece.GetStyle(this.getModelRoot(), tsClass, checkCustomizedFirst); }


  getInheritableStyle(): StyleComplexEntry {
    let i: number;
    let matches: ViewRule[] = [];
    for (i = this.views.length; --i >= 0;) {
      let v: ViewRule = this.views[i];
      // if (!v.viewpoint.isApplied) continue;
      if (!v.viewpoint.isApplied || !v.htmli || !v.htmli.getHtml()) continue;
      matches.push(v); }
    if (!matches.length) return null;
    matches = matches.sort( ViewRule.sortCriteria );
    const v: ViewRule = matches[0];
    return v.toStyleComplexEntry(this, v.htmli, false, true, false, false); }

  getInheritedStyle_lv2(): StyleComplexEntry { return this.metaParent ? this.metaParent.getInheritableStyle() : null; }

  getOwnStyle_lv1(): StyleComplexEntry {
    let j: number;
    let matches: ViewRule[] = [];
    for (j = this.views.length; --j >= 0;){
      const v: ViewRule = this.views[j];
      if (!v.viewpoint.isApplied || !v.htmlo || !v.htmlo.getHtml()) continue;
      matches.push(v); }
    if (!matches.length) return null;
    matches = matches.sort( ViewRule.sortCriteria );
    const v: ViewRule = matches[0];
    return v.toStyleComplexEntry(this, v.htmlo, true, false, false, false); }

  getCustomGlobalStyle_lv3(): StyleComplexEntry {
    const model: IModel = this.getModelRoot();
    let vparr: ViewPoint[] = model.viewpoints.sort( ViewPoint.sortCriteria );
    for (let i = 0; i < vparr.length; i++) {
      const vp: ViewPoint = vparr[i];
      if (!vp.isApplied) continue;
      const v: ViewRule = vp.getDefault(this, false);
      if (v) return v.toStyleComplexEntry(this, v.htmlo, false, false, true, false);
    }
    return null; }

  getGlobalStyle_lv4(): StyleComplexEntry {
    const ret = new StyleComplexEntry();
    ret.html = this.getGlobalLevelStyle();
    ret.htmlobj = null;
    ret.view = null;
    ret.ownermp = null;
    ret.isGlobalhtml = true;
    return ret; }

  public getStyle(): StyleComplexEntry {
    let ret: StyleComplexEntry;

    // level 1: own style
    ret = this.getOwnStyle_lv1();
    if (ret) return ret;

    // level 2: inherited style
    ret = this.getInheritedStyle_lv2();
    if (ret) return ret;

    // level 3: prendo lo stile default user-made
    ret = this.getCustomGlobalStyle_lv3();
    if (ret) return ret;

    // level 4: se fallisce tutto, prendo lo stile statico default
    return this.getGlobalStyle_lv4(); }

  /*
  getStyleOld(): ViewHtmlSettings { return this.views.getHtml(this); }
  getStyleOldOld(): Element { return this.views.getHtml(this); }
  getStyleOldissimo(debug: boolean = true): Element {
    // prima precedenza: stile personale.
    let ret: Element;
    if (this.customStyleToErase) { ret = this.customStyleToErase; ret.id = '' + this.id; return ret; }
    // seconda precedenza: stile del meta-parent.
    const metap1 = this.metaParent;
    if (metap1 && metap1.styleOfInstances) { ret = metap1.styleOfInstances; ret.id = '' + this.id; return ret; }
    // terzo e quarto livello: search for customized third-override-css-like global styles; or immutable fourth global styles.
    ret = this.getGlobalLevelStyle(true);
    ret.id = '' + this.id;
    return ret; }
    getStyleObj(): ModelPieceStyleEntry {
      if (this.styleobj) { return this.styleobj; }
      return this.styleobj = ModelPieceStyleEntry.load(this.getStyle(), null); }*/

  getInfo(toLower: boolean = false): Info {
    let i: number;
    const info: any = new Info();
    const instancesInfo: any = {};
    const childrenInfo: any = {};
    const model: IModel = this.getModelRoot();
    Info.set(info, 'tsClass', U.getTSClassName(this));
    Info.set(info, 'this', this);
    if (!(this instanceof IModel)) { Info.set(info, 'parent', this.parent); }
    if (!(this instanceof IFeature)) { Info.set(info, 'childrens', childrenInfo); }
    if (model.isMM()) {
      Info.set(info, 'instance', instancesInfo);
      Info.set(info, 'name', this.name);
    } else { Info.set(info, 'metaParent', this.metaParent); }
    for (i = 0; this.childrens && i < this.childrens.length; i++) {
      const child = this.childrens[i];
      let name = model.isM1() && child.metaParent ? child.metaParent.name : child.name;
      U.pw(!name, 'getInfo() getName error: probably some metaparent is null.', this, child);
      if (!name) name = '';
      Info.setc(info, name.toLowerCase(), child);
      Info.setraw(childrenInfo, name.toLowerCase(), child); }
    for (i = 0; this.instances && i < this.instances.length; i++) { Info.seti(instancesInfo,  '' + i, this.instances[i]); }
    return info; }

  getHtmlOnGraph(): Element {
    if (this instanceof IPackage) return null;
    if (this instanceof IGraph) return null;
    let html: Element = this.getVertex().getHtmlRawForeign();
    if (this instanceof IClass) return html;
    html = $(html).find('*[data-modelpieceid="' + this.id + '"]')[0];
    return html ? html : null; }

  getLastViewWith(fieldname: string): ViewRule {
    let i: number = this.views.length;
    while (--i >= 0) {
      const v: ViewRule = this.views[i];
      const val: any = v['' + fieldname];
      // U.pe(fieldname in v, 'property |' + fieldname + '| does not exist in ViewRule. Field name has changed without changing the string
      // accordingly.');
      if (val !== undefined && val !== null) return v;
    }
    if (!this.metaParent) return null;
    i = this.metaParent.views.length;
    while (--i >= 0) {
      const v: ViewRule = this.metaParent.views[i];
      const val: any = v['' + fieldname];
      // U.pe(fieldname in v, 'property |' + fieldname + '| does not exist in ViewRule. Field name has changed without changing the string
      // accordingly.(2)');
      if (val !== undefined && val !== null) return v;
    }
    return null; }

  getForemostView(allowDisabled: boolean = false): ViewRule {
    const arr = this.views.sort(ViewRule.sortCriteria);
    for (let i = 0; i < arr.length; i++) {
      if (allowDisabled || arr[i].viewpoint.isApplied) return arr[i];
    }
    return null; }
  /*
    addView(v: ViewRule): void {
      // if (!v.viewpoint.viewsDictionary[this.id]) {  v.viewpoint.viewsDictionary[this.id] = []; }
      v.viewpoint.viewsDictionary[this.id] = v;
      U.ArrayAdd(this.views, v); }
    resetViews(): void { this.views = []; }
  */
  getClassName(): string { return this.className = this.getClassName0(); }
  getClassName0(allowInterfaceAbstract: boolean = false): string {
    if(this instanceof M3Class) { return 'm3Class'; }
    if(this instanceof M2Class) {
      if (!allowInterfaceAbstract) return 'm2Class';
      return this.isInterface ? 'Interface' : ( this.isAbstract ? 'Abstract' : 'm2Class'); }
    if(this instanceof MClass) { return 'm1Class'; }
    if(this instanceof EEnum) { return 'EEnum'; }
    if(this instanceof M3Attribute) { return 'm3Attribute'; }
    if(this instanceof M2Attribute) { return 'm2Attribute'; }
    if(this instanceof MAttribute) { return 'm1Attribute'; }
    if(this instanceof M3Reference) { return 'm3Reference'; }
    if(this instanceof M2Reference) { return 'm2Reference'; }
    if(this instanceof MReference) { return 'm1Reference'; }
    if(this instanceof M3Package) { return 'm3Package'; }
    if(this instanceof M2Package) { return 'm2Package'; }
    if(this instanceof MPackage) { return 'm1Package'; }
    if(this instanceof MetaMetaModel) { return 'm3Model'; }
    if(this instanceof MetaModel) { return 'm2Model'; }
    if(this instanceof Model) { return 'm1Model'; }
    if(this instanceof EOperation) { return 'EOperation'; }
    if(this instanceof EParameter) { return 'EParameter'; }
    if(this instanceof ELiteral) { return 'ELiteral'; }
    U.pe(true, 'failed to find class:', this);
  }

  getFriendlyClassName(): string {
    return U.replaceAll(U.replaceAll(U.replaceAll(this.getClassName(), 'm1', ''), 'm2', ''), 'm3', '');
  }
  getInstanceClassName(): string {
    let ret = this.getClassName();
    if (ret.indexOf('m1') !== -1) return null;
    return ret.replace('m2', 'm1').replace('m3', 'm2'); }

  pushDown(untilStartOrEnd: boolean): void { this.pushUp(untilStartOrEnd, +1); }
  pushUp(untilStartOrEnd: boolean, offset: number = -1): void {
    if (!this.parent) { return; }
    let arr: ModelPiece[];
    let parent: any = this.parent;
    let i: number;
    if (untilStartOrEnd) offset = offset > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    if ((arr = parent.childrens) && (i = arr.indexOf(this)) !== -1){
      U.arrayRemoveAll(arr, this);
      U.arrayInsertAt(arr, i + offset, this); }
    if ((arr = parent.enums) && (i = arr.indexOf(this)) !== -1){
      U.arrayRemoveAll(arr, this);
      U.arrayInsertAt(arr, i + offset, this); }
    if ((arr = parent.classes) && (i = arr.indexOf(this)) !== -1){
      U.arrayRemoveAll(arr, this);
      U.arrayInsertAt(arr, i + offset, this); }
    if ((arr = parent.attributes) && (i = arr.indexOf(this)) !== -1){
      U.arrayRemoveAll(arr, this);
      U.arrayInsertAt(arr, i + offset, this); }
    if ((arr = parent.references) && (i = arr.indexOf(this)) !== -1){
      U.arrayRemoveAll(arr, this);
      U.arrayInsertAt(arr, i + offset, this); }
    if ((arr = parent.operations) && (i = arr.indexOf(this)) !== -1){
      U.arrayRemoveAll(arr, this);
      U.arrayInsertAt(arr, i + offset, this); }
    this.updateKey(); }
}

export abstract class ModelNone extends ModelPiece {}

export class PendingFunctionCall {
  static ProtectedMPBuffer: PendingFunctionCall[] = [];
  name: string;
  arguments: any[];
  target: object;

  static executeProtectedMPBuffer(): void {
    let i: number;
    for (i = 0; i < PendingFunctionCall.ProtectedMPBuffer.length; i++) { PendingFunctionCall.ProtectedMPBuffer[i].call(); }
  }

  static clearProtectedMPBuffer(): void { PendingFunctionCall.ProtectedMPBuffer = []; }

  constructor (target: object, name: string, args: any[] = null) {
    this.target = target;
    this.name = name;
    this.arguments = args || [];
  }

  call(target: object = null): void {
    if (!target) target = this.target;
    let f = target[this.name];
    U.pe(!f, 'failed to find function "' + this.name + '" to execute inside:', target, this.arguments);
    f(...this.arguments);
  }

}

export class ServerUpdateRequest {
  static readonly minResendMessageCount = 3;
  static buffer: Dictionary<number, ServerRequestAction> = {};
  static lastupdate: Date;
  static lastNumber = -1;
  THIS_SHOULD_HAVE_A_NUMERIC_KEY_EQUAL_TO_NUM_MAX: ServerRequestAction[];
  numMin: number;
  numMax: number;// can be = numMin
  static send(s: ServerUpdateRequest) {}
  static receive(s: ServerUpdateRequest) {/*
    let i: number;
    if (ServerUpdateRequest.lastNumber > s.numMax) U.refreshPage();
    if (s.numMax < s.numMin) { ServerUpdateRequest.requestMissingFrom(ServerUpdateRequest.lastNumber); U.CompletelyBlockWebPage(); return; }
    // se ho ricevuto un buco nelle richieste, bufferizzo senza eseguire
    if (ServerUpdateRequest.lastNumber !== -1 || ServerUpdateRequest.lastNumber < s.numMin){

      for (i = s.numMin; i <= s.numMax; i++) { ServerUpdateRequest.buffer[i] = s[i]; }
        U.CompletelyBlockWebPage(); // impedisco all'utente di fare altre azioni finchè non si risincronizza
        return;
    }
    const pageGotUnlocked: boolean = U.UnlockWebPage();
    for (i = ServerUpdateRequest.lastNumber + 1; i <= s.numMax; i++) { ServerRequestAction.process(s[i] as ServerRequestAction); }
    ServerUpdateRequest.lastNumber += 1 + (s.numMin - s.numMax);
    if (pageGotUnlocked) {
      for (i = ServerUpdateRequest.lastNumber + 1; i <= s.numMax; i++) {
        let buffered: ServerRequestAction = ServerUpdateRequest.buffer[i];
        if (!buffered) { break; }
        ServerRequestAction.process(buffered); ServerUpdateRequest.lastNumber++;
        delete ServerRequestAction[i]; }
      problema grosso come una casa: se io credo di essere sincronizzato ma è solo internet-lag ed eseguo A mentre mi sta arrivando il comando B:
      io ho eseguito B,A; l'altro ha eseguito A,B
    }*/
  }
}

export class ServerRequestAction {
  modelpiecekey: number[];
  viewRuleKey: number[];
  viewPointRuleKey: number[];
  cmdline: PendingFunctionCall[];

  static process(r: ServerRequestAction){
      const mp = ModelPiece.getByKey(r.modelpiecekey);
      let i: number;
      // for (i = 0; i < r.cmdline.length; i++) PendingFunctionCall.processMP(mp, r.cmdline[i]);
  }
}

export class PendingMeasurableChanges {
  target: ModelPiece;
  cmdline: PendingFunctionCall[];
  constructor(target: ModelPiece) { this.target = target; }
  public add(s: string, args: any[] = null) { this.cmdline.push(new PendingFunctionCall(this.target, s, args)); }
  public apply(): void {
    let i: number;
    for (i = 0; i < this.cmdline.length; i++) this.cmdline[i].call(this.target);
  }
}

class F{
  static alse(): boolean { return false; }
}

export class ProtectedModelPiece {/* implements MReference {
  upperbound: any;
  lowerbound: any;
  field: any;
  ordered: any;
  unique: any;
  type: any;
  serializable: any;
  parent: any;
  childrens: any;
  vertex: any;
  instanceTypeName: any;
  id: number;
  metaParent: any;
  instances: any;
  name: any;
  key: any;
  views: any;
  annotations: any;
  detachedViews: any;
  private sidebarHtml: any;

  /////////// real fields*/
  unsafemp: ModelPiece/*ModelPiece*/;
  pendingChanges: PendingMeasurableChanges/*private object*/;
  subChanges: ProtectedModelPiece[] = []/*private object*/;
  constructor(original: ModelPiece, createdBy: ProtectedModelPiece){
    if (createdBy) createdBy.subChanges.push(this);
    this.unsafemp = original;
    this.pendingChanges = new PendingMeasurableChanges(original);
    const unsafeFunctionNames: Dictionary< string, boolean> = {};
    const allowedFunctionNames: Dictionary< string, boolean> = {};
    const alwaysToKeep: object = { applyChanges: ''};

    let key: string;
    for (key in this.unsafemp) {
      if (typeof this.unsafemp[key] === TSON_JSTypes.function) { unsafeFunctionNames[key] = true; } }
    for (key in this) {
      if (typeof this[key] === TSON_JSTypes.function) { allowedFunctionNames[key] = true; } }
    U.join(unsafeFunctionNames, alwaysToKeep, true, false);
    U.objecKeysIntersect(allowedFunctionNames, unsafeFunctionNames, null, false);

    for (key in this) {
      if (typeof this[key] === TSON_JSTypes.function && !(this[key] in allowedFunctionNames)) delete this[key];
    }
  }

  applyChanges(): void /*private*/{ // got deleted in evalContext, it is only in backupContext. evalContext calls it through backupContext.call(this = evalContext);
    PendingFunctionCall.executeProtectedMPBuffer();
//todo: send all messages to Client.receiveMessage(jsonCommandFormat);
  }

  //////// safe functions()

  getID(): number /*number*/ {/*number*/ return this.unsafemp.getID(); }
  getSelector(): string /*string*/ {/*string*/ return this.unsafemp.getSelector(); }

  getChildrenSelector(index: number/*number*/): string /*string*/ {/*string*/ return this.unsafemp.getChildrenSelector(index); }
  getChildrenAttributeSelector(index: number/*number*/): string /*string*/ {/*string*/
    if (!(this.unsafemp instanceof IClass)) throw new Error("called IClass.getChildrenAttributeSelector() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return this.unsafemp.getChildrenAttributeSelector(index); }
  getTarget(index: number = 0/*number = 0*/): ProtectedModelPiece /*ModelPiece (protected shell)*/ {/*ModelPiece*/
    if (!(this.unsafemp instanceof IReference)) throw new Error("called IReference.getTarget() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return new ProtectedModelPiece(this.unsafemp.getTarget(index), this); }
  getTargetSelector(index: number = 0/*number = 0*/): string {/*string*/
    if (!(this.unsafemp instanceof IReference)) throw new Error("called IReference.getTargetSelector() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return this.unsafemp.getTargetSelector(index); }
  getChildrenReferenceSelector(index: number/*number*/): string {/*string*/
    console.log('getChildrenReferenceSelector()', index, this);
    if (!(this.unsafemp instanceof IClass)) throw new Error("called IClass.getChildrenReferenceSelector() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return this.unsafemp.getChildrenReferenceSelector(index); }
  getChildrenOperationSelector(index: number/*number*/): string {/*string*/
    if (!(this.unsafemp instanceof IClass)) throw new Error("called IClass.getChildrenOperationSelector() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return this.unsafemp.getChildrenOperationSelector(index); }
  getChildrenLiteralSelector(index: number/*number*/): string /*string*/ {/*string*/
    if (!(this.unsafemp instanceof EEnum)) throw new Error("called EEnum.getChildrenLiteralSelector() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return this.unsafemp.getChildrenLiteralSelector(index); }
  getChildrenParameterSelector(index: number/*number*/): string /*string*/ {/*string*/
    if (!(this.unsafemp instanceof EOperation)) throw new Error("called EOperation.getChildrenParameterSelector() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return this.unsafemp.getChildrenParameterSelector(index); }
  getChildrenClassSelector(index: number/*number*/): string {/*string*/
    if (!(this.unsafemp instanceof IPackage)) throw new Error("called IPackage.getChildrenClassSelector() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return this.unsafemp.getChildrenClassSelector(index); }
  getChildrenEnumSelector(index: number/*number*/): string {/*string*/
    if (!(this.unsafemp instanceof IPackage)) throw new Error("called IPackage.getChildrenEnumSelector() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return this.unsafemp.getChildrenEnumSelector(index); }

  getChildren(index: number): ProtectedModelPiece { return new ProtectedModelPiece(this.unsafemp.getChildren(index), this); }
  getChildrenAttribute(index: number): ProtectedModelPiece {
    if (!(this.unsafemp instanceof IClass)) throw new Error("called IClass.getChildrenAttribute() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return new ProtectedModelPiece(this.unsafemp.getChildrenAttribute(index), this); }
  getChildrenReference(index: number): ProtectedModelPiece {
    if (!(this.unsafemp instanceof IClass)) throw new Error("called IClass.getChildrenReference() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return new ProtectedModelPiece(this.unsafemp.getChildrenReference(index), this); }
  getChildrenOperation(index: number): ProtectedModelPiece {
    if (!(this.unsafemp instanceof IClass)) throw new Error("called IClass.getChildrenOperation() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return new ProtectedModelPiece(this.unsafemp.getChildrenOperation(index), this); }
  getChildrenLiteral(index: number): ProtectedModelPiece {
    if (!(this.unsafemp instanceof EEnum)) throw new Error("called EEnum.getChildrenLiteral() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return new ProtectedModelPiece(this.unsafemp.getChildrenLiteral(index), this); }
  getChildrenParameter(index: number): ProtectedModelPiece {
    if (!(this.unsafemp instanceof EOperation)) throw new Error("called EOperation.getChildrenParameter() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return new ProtectedModelPiece(this.unsafemp.getChildrenParameter(index), this); }
  getChildrenClass(index: number): ProtectedModelPiece {
    if (!(this.unsafemp instanceof IPackage)) throw new Error("called IPackage.getChildrenClass() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return new ProtectedModelPiece(this.unsafemp.getChildrenClass(index), this); }
  getChildrenEnum(index: number): ProtectedModelPiece {
    if (!(this.unsafemp instanceof IPackage)) throw new Error("called IPackage.getChildrenEnum() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return new ProtectedModelPiece(this.unsafemp.getChildrenEnum(index), this); }

  endingName(valueMaxLength?: number): string{ return this.unsafemp.endingName() }

  fullname(): string { return this.unsafemp.fullname(); }

  generateModel(): Json { return this.unsafemp.generateModel({}); }

  generateModelString(): string { return this.unsafemp.generateModelString(); }

  getClassName(): string{ return this.unsafemp.getClassName(); }

  getInfo(toLower?: boolean): Info{ return this.unsafemp.getInfo(toLower); }

  getInstanceClassName(): string{ return this.unsafemp.getInstanceClassName(); }

  getKey(): number[]{ return this.unsafemp.getKey(); }

  getKeyStr(): string{ return this.unsafemp.getKeyStr(); }

  isChildNameTaken(s: string): boolean{ return this.unsafemp.isChildNameTaken(s); }

  printableName(valueMaxLength?: number, full?: boolean): string{ return this.unsafemp.printableName(valueMaxLength, full); }

  printableNameshort(valueMaxLength?: number): string{ return this.unsafemp.printableNameshort(valueMaxLength); }

  getType(): Type {
    if (!(this.unsafemp instanceof Typedd)) throw new Error("called Typed.getDefaultValueStr() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return this.unsafemp.getType(); }
  getClass(): IClassifier {
    if (!(this.unsafemp instanceof Typedd)) throw new Error("called Typed.getDefaultValueStr() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return new ProtectedModelPiece(this.unsafemp.getClass(), this) as any; }
  getUpperbound(): number {
    if (!(this.unsafemp instanceof Typedd)) throw new Error("called Typed.getUpperbound() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return this.unsafemp.getUpperbound(); }
  getLowerbound(): number {
    if (!(this.unsafemp instanceof Typedd)) throw new Error("called Typed.getLowerbound() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return this.unsafemp.getLowerbound(); }

  getAllowedValuesStr(): string[] {
    let e: EEnum = this.unsafemp instanceof EEnum ? this.unsafemp : null;
    if (!e) throw new Error("called EEnum.getAllowedValuesStr() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return e.getAllowedValuesStr(); }

  getAllowedValuesInt(): number[] {
    let e: EEnum = this.unsafemp instanceof EEnum ? this.unsafemp : null;
    if (!e) throw new Error("called EEnum.getAllowedValuesStr() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return e.getAllowedValuesInt(); }

  getDefaultValueStr(): string {
    let e: EEnum = this.unsafemp instanceof EEnum ? this.unsafemp : null;
    if (!e) throw new Error("called EEnum.getDefaultValueStr() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    return e.getDefaultValueStr(); }




  ////////// safe-able functions adjusting parameters.

  shouldBeDisplayedAsEdge(set?: boolean): boolean{ return this.unsafemp.shouldBeDisplayedAsEdge(null); }






  ////////// unsafe functions got buffered.

  delete(): void {
    if (F.alse()) this.unsafemp.delete(); // just to trigger errors if the source is modified
    this.pendingChanges.add('delete', [true]); }

  duplicate(nameAppend?/*preTypeComment are ignored*/: string/*:string*/, newParent?: ModelPiece/*:ModelPiece = null*/): /*ignored*/ModelPiece/*ignored*/ {/*ModelPiece*/
    if (F.alse()) this.unsafemp.duplicate(nameAppend, newParent); // just to trigger errors if the source is modified
    this.pendingChanges.add('delete', [true]); return null; }

  mark(markb: boolean, paired: ModelPiece = null, key: string, color?: string, radiusX?: number, radiusY?: number, width?: number, backColor?: string, extraOffset?: GraphSize): void{
    if (F.alse()) this.unsafemp.mark(markb, null, key, color, radiusX, radiusY, width, backColor, extraOffset); // just to trigger errors if the source is modified
    this.pendingChanges.add('mark', [...arguments]); }

  pushDown(untilStartOrEnd: boolean): void{
    if (F.alse()) this.unsafemp.pushDown(untilStartOrEnd); // just to trigger errors if the source is modified
    this.pendingChanges.add('pushDown', ['' + untilStartOrEnd]); }

  pushUp(untilStartOrEnd: boolean, offset?: number): void{
    if (F.alse()) this.unsafemp.pushUp(untilStartOrEnd, offset); // just to trigger errors if the source is modified
    this.pendingChanges.add('pushUp', ['' + untilStartOrEnd, '' + offset]); }

  refreshGUI(): void{
    if (F.alse()) this.unsafemp.refreshGUI(); // just to trigger errors if the source is modified
    this.pendingChanges.add('refreshGUI'); }

  refreshGUI_Alone(): void{
    if (F.alse()) this.unsafemp.refreshGUI_Alone(); // just to trigger errors if the source is modified
    this.pendingChanges.add('refreshGUI_Alone'); }

  refreshInstancesGUI(): void{
    if (F.alse()) this.unsafemp.refreshInstancesGUI(); // just to trigger errors if the source is modified
    this.pendingChanges.add('refreshInstancesGUI'); }

  validate(): boolean {
    if (F.alse()) this.unsafemp.validate(); // just to trigger errors if the source is modified
    this.pendingChanges.add('validate');  return undefined; }

  setName(value: string, refreshGUI?: boolean, warnDuplicateFix?: boolean): string {
    if (F.alse()) this.unsafemp.setName(value, refreshGUI, warnDuplicateFix); // just to trigger errors if the source is modified
    this.pendingChanges.add('setName', [...arguments]);  return undefined; }
// EEnum things.

  addLiteral(literal: string = null): ELiteral {
    const t: EEnum = this.unsafemp instanceof EEnum ? this.unsafemp : null;
    if (!t) throw new Error("called EEnum.addLiteral() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    if (F.alse()) t.addLiteral(literal); // just to trigger errors if the source is modified
    this.pendingChanges.add('addLiteral', [...arguments]); return undefined; }

  setType(ecoreTypeString: string, throwError?: boolean, refreshGui?: boolean): boolean {
    const t: Typedd = this.unsafemp as Typedd;
    if (!t) throw new Error("called Typed.setType() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    if (F.alse()) t.setType(ecoreTypeString, true, false);
    this.pendingChanges.add('setType', [...arguments]);  return undefined; }

  setUpperbound(val: number): void {
    const t: Typedd = this.unsafemp instanceof Typedd ? this.unsafemp : null;
    if (!t) throw new Error("called Typed.setUpperbound() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    if (F.alse()) t.setUpperbound(val);
    this.pendingChanges.add('setUpperbound', [...arguments]);  return undefined; }

  setLowerbound(val: number): void {
    const t: Typedd = this.unsafemp instanceof Typedd ? this.unsafemp : null;
    if (!t) throw new Error("called Typed.setLowerbound() on a ModelPiece with a wrong type(" + U.getTSClassName(this.unsafemp) + ") ");
    if (F.alse()) t.setLowerbound(val);
    this.pendingChanges.add('setLowerbound', [...arguments]);  return undefined; }


  /*
    /////// trash to discard NB: do not delete, just comment. if you need to implement MAttribute you won't need to filter and order them again.
    assignID(): number { return undefined; }
    copy(other: ModelPiece, nameAppend?: string, newParent?: ModelPiece): void{ }
    fieldChanged(e: JQuery.ChangeEvent): void{}
    getChildren(name: string, caseSensitive?: boolean): ModelPiece{ return undefined; }
    getGlobalLevelStyle(checkCustomizedFirst?: boolean): Element{ return undefined; }
    getHtmlOnGraph(): Element{ return undefined; }
    getInheritableStyle(): StyleComplexEntry{ return undefined; }
    getInheritedStyle(): StyleComplexEntry{ return undefined; }
    getLastView(): ViewRule{ return undefined; }
    getLastViewWith(fieldname: string): ViewRule{ return undefined; }
    getModelRoot(): IModel{ return undefined; }
    getStyle(): StyleComplexEntry{ return undefined; }
    getVertex(): IVertex{ return undefined; }
    getm2(): MetaModel{ return undefined; }
    linkToLogic(html0: Element): void{ }
    parse(json: Json, destructive?: boolean): void{}
    replaceVarsSetup(): void{}
    setName0(value: string, refreshGUI: boolean, warnDuplicateFix: boolean, key: string, allowEmpty: boolean): string{ return undefined; }
    setNameOld(value: string, refreshGUI?: boolean, warnDuplicateFix?: boolean): string{ return undefined; }
    updateKey(): number[]{ return undefined; }
    getPackage(): IPackage { throw new Error("(Typedd) Method not implemented."); }
    graph(): IGraph { throw new Error("(Typedd) Method not implemented."); }
    generateField(): IField { throw new Error("(Typedd) Method not implemented."); }
    getField(): IField { throw new Error("(Typedd) Method not implemented."); }
    // trash that i could use in future
    getEcoreTypeName(): string { throw new Error("Method not implemented."); }
  /// end of ModelPiece trash

    generateVertex(): IVertex { throw new Error("Method not implemented."); }
    getSidebarHtml(): HTMLElement { throw new Error("Method not implemented."); }
    isChildLiteralTaken(s: string): boolean { return undefined; } // will call isChildNameTaken, l'ho messo perhè viene chiamato da this['funcname...'] in setname()
    private autofixEnumValues(): void{ }
    /// end of trash*/


}
