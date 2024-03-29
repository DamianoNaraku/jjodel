import {
  AttribETypes,
  GraphPoint,
  GraphSize,
  IAttribute,
  M2Class,
  IEdge,
  IFeature,
  IField,
  IModel,
  IVertex,
  Json,
  Model,
  ModelPiece,
  PropertyBarr,
  Size,
  Status,
  MClass,
  MAttribute,
  U,
  ECoreAttribute,
  ECoreReference,
  ShortAttribETypes,
  IReference,
  Dictionary,
  MPackage,
  M3Reference,
  M2Reference,
  IClass,
  Info, Type, EEnum,
} from '../../../../common/Joiner';

export class MReference extends IReference {
  static stylesDatalist: HTMLDataListElement;
  // private static loopDetection: Dictionary<number /*MClass id*/, MClass> = {};

  parent: MClass;
  metaParent: M2Reference;
  // instances: ModelNone[];
  mtarget: MClass[];
  /*childrens: ModelPiece[];
  instances: ModelPiece[];
  metaParent: IReference;
  // parent: MClass;
  */
  // mtarget: MClass[];
  // targetStr: string;
  // constructor() {}

  constructor(classe: MClass, json: Json, metaParent: M2Reference) {
    super(classe, metaParent);
    if (!classe && !json && !metaParent) { return; } // empty constructor for .duplicate();
    this.parse(json, true); }
/*
  getStyle(): HTMLElement | SVGElement {
    const htmlRaw: HTMLElement | SVGElement = super.getStyle();
    const $html = $(htmlRaw);
    const $selector = $html.find('select.ClassSelector');
    M2Class.updateMMClassSelector($selector[0] as HTMLSelectElement, this.getm2Target());
    return htmlRaw; }*/

  getm2Target(): M2Class { return this.metaParent.getTarget(); }
  getTarget(index: number = 0): MClass { return this.mtarget[index]; }

  getfirstEmptyTarget(): number {
    let i:number;
    for (i = 0; i < this.mtarget.length; i++){ if (!this.mtarget[i]) return i; }
    return this.metaParent.upperbound === -1 ? this.mtarget.length : -1; }

  getfirstFilledTarget(): number {
    let i: number;
    for (i = 0; i < this.mtarget.length; i++){ if (this.mtarget[i]) return i; }
    return -1; }

  endingName(valueMaxLength: number = 10): string {
    const index = this.getfirstEmptyTarget();
    if (index !== -1) {
      const t: MClass = this.mtarget[index];
      if (t instanceof MClass && t.attributes.length > 0) {
        const a: MAttribute = t.attributes[0];
        return a.endingName(valueMaxLength); } }
    return ''; }
/*
  conformability(meta: M2Reference, debug: boolean = true): number {
    let comformability = 0;
    comformability += 0.1 * StringSimilarity.compareTwoStrings(this.getm2Target().name, meta.classType.name);
    // todo: devi calcolare la 90% conformability in base al tipo dedotto della classe del m1-target.
    // comformability += 0.2 * StringSimilarity.compareTwoStrings(this.name, meta.name);
    // comformability += 0.2 * (this.metaParent.containment === meta.containment ? 1 : 0);
    U.pif(debug, 'REFERENCE.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', comformability);
    return comformability; }*/



  duplicate(nameAppend: string = '_Copy', newParent: MClass = null): MReference {
    const r: MReference = new MReference(null, null, null);
    return r.copy(this, nameAppend, newParent); }

  getInfo(toLower?: boolean): any {
    const info: Json = {};
    Info.set(info, 'target', this.mtarget);
    Info.unset(info, 'upperbound');
    Info.unset(info, 'lowerbound');
    let i: number;
    for (i = 0; i < this.mtarget.length; i++) {
      const t: MClass = this.mtarget[i];
      if (!t) continue;
      // todo problem: le mClassi non hanno un nome
      Info.set(info, '' + i, t); }
    return info; }

  delete(refreshgui: boolean = true, fromParent: boolean = false, linkStart: number = null, linkEnd: number = null): void {
    let oldParent = this.parent;
    let i: number;
    super.delete(false, fromParent, linkStart, linkEnd);
    // remove edges
    linkEnd = Math.min(this.mtarget.length, linkEnd);
    linkStart = Math.max(0, linkStart);
    for (i = linkStart; i < linkEnd; i++) { this.setTarget(i, null); }
    if (refreshgui) { setTimeout( ()=> {oldParent.refreshGUI(); }, 0); }
  }

  getType(): Type { return (this.metaParent ? this.metaParent.getType() : null); }

  canBeLinkedTo(hoveringTarget: MClass): boolean {
    // todo: può essere linkato: se non-containment sempre, altrimenti se: target non è root, target non è già contenuto.
    const c1: M2Class = hoveringTarget.metaParent;
    const c2: M2Class = this.getType().classType;
    console.log('canbelinkedm1 ? ', c1, c2);
    if (!c1.isExtending(c2, true)) return false;
    if (!this.isContainment()) return true;

    // solo per la stampa
    if (hoveringTarget === this.parent) { U.ps(true, 'Objects cannot contain themselves.'); return false; }
    // solo per la stampa
    // if (hoveringTarget.isRoot() && this.parent.isConnectedToRoot()) { U.ps(true, 'This reference would cause a containment loop.'); return false; }
    if (this.parent.isContainedIn(hoveringTarget)) { U.ps(true, 'This reference would cause a containment loop.'); return false; }
    // solo per la stampa
    if (hoveringTarget.isRoot()) { U.ps(true, 'Root object cannot be contained.'); return false; }
    // controllo sufficiente da solo a ritornare il giusto valore, ma ne ho aggiunti di precedenti per stampe più chiare
    if (hoveringTarget.getContainer()) {// && hoveringTarget.isConnectedToRoot()) {
      U.ps(true, 'Target is already contained in a different object.');
      return false; }
    return true; }

  // link(targetStr?: string, debug?: boolean): void { throw new Error('mreference.linkByStr() should never be called'); }


  // LinkToMetaParent(ref: MReference): void { super.LinkToMetaParent(ref); }
  generateModel(loopDetectionObj0: Dictionary<number /*MClass id*/, ModelPiece> = null): Json {
    const loopDetectionObj = loopDetectionObj0 || {};
    console.log("loopdetect isobject?", U.isObject(loopDetectionObj), " param:", loopDetectionObj0, loopDetectionObj0 || {});
    U.pe(!U.isObject(loopDetectionObj), "loopdetection not object param:", loopDetectionObj0, loopDetectionObj0 || {});
    return this.generateModelLoop(loopDetectionObj); }

  generateModelLoop(loopDetectionObj: Dictionary<number /*MClass id*/, MClass>): Json {
    const ret: Json[] = [];
    let i: number;
    for (i = 0; i < this.mtarget.length; i++) {
      if (!this.mtarget[i]) continue;
      const mclass: MClass = this.mtarget[i];
      if (false && loopDetectionObj[mclass.id]) {
        // todo. il ontrollo è sbagliato.constructorè vero loop solo se la classe è già stata incontrata (come oggetto in containment) e sta ritornando un object invece che una stringa (doppio containment)
        // ma è impossibile costruire un modello osì, e se lo leggo da xmi li interpreto come 2 classi diverse quindi disabilito il check.
        // todo: in caso di loop cosa ci devo mettere nel modello?
        ret.push('LoopingReference');
        U.pw(true, 'looping reference in model');
      } else {
        loopDetectionObj[mclass.id] = mclass;
        if (this.isContainment()){ ret.push(mclass.generateModel(loopDetectionObj, false)); }
        else ret.push(mclass.getM1PathStr());
      }
    }
    if (ret.length === 1 && ret[0] === '' + ret[0]) return ret[0];
    else return ret;
  }

  generateEdges(): IEdge[] {
    // const arr: IEdge[] = [];
    let i: number;
    // while (this.edges && this.edges.length > 0) { this.edges[0].remove(); U.arrayRemoveAll(this.edges, this.edges[0]); }
    for (i = 0; i < this.mtarget.length; i++) {
      if (this.edges[i] || !this.mtarget[i]) continue;
      this.edges[i] = (new IEdge(this, i, this.parent.getVertex(), this.mtarget[i].getVertex(), null)); }
    return this.edges; }

  parse(json0: Json, destructive: boolean = true): void {
    /*
        "ReferenceName": [
          { "-name": "tizio" },  <-- reference.target[0]
          { "-name": "asd" }     <-- reference.target[1]
        ]*/
    U.pe(!destructive, 'non-destructive parse of MReference to do.');
    if (!json0) { json0 = []; }
    const json: Json[] = Array.isArray(json0) ? json0 : [json0];
    const targetMM: M2Class = this.getm2Target();
    let i: number;
    if (!this.mtarget) { this.mtarget = []; }
    if (!this.edges) { this.edges = []; }
    const upperbound: number = this.getUpperbound();
    if (upperbound >= 0) {
      this.mtarget.length = upperbound;
      this.edges.length = upperbound; }
    if (destructive) { this.clearTargets(); }

    const pkg: MPackage = this.getClass().parent as MPackage;
    for (i = 0; i < json.length; i++) {
      // console.log('mref.parse: ', json0, json, 'i:', json[i]);
      if ($.isEmptyObject(json[i])) { continue; }
      const targetMM_orSubclass: M2Class = MClass.findMetaSubClass(json[i], targetMM); // se ho una reference che punta ad una classe astratta con sottoclassi, i riferimenti potrebbero non essere del tipo della superclasse.
      const t: MClass | string = json[i] === '' + json[i] ? '' + json[i] : new MClass(pkg, json[i], targetMM_orSubclass, true);
      this.mtarget[i] = t as any; // this.setTarget(i, t as any); non usare setTarget qui, t è stringa e il setTarget viene fatto durante lo step fixReferences()
      if (t && t instanceof MClass) t.referencesIN.push(this);
    }
    U.pe(this.metaParent.upperbound !== -1 && this.mtarget.length !== +this.metaParent.upperbound, 'wrong mtarget length', this.mtarget, this.mtarget.length, this.metaParent.upperbound);
  }

  validate(): boolean { return true; }

  copy(r: MReference, nameAppend: string = '_Copy', newParent: MClass = null): MReference {
    this.clearTargets();
    super.copy(r, nameAppend, newParent);
    this.mtarget = U.ArrayCopy(r.mtarget, false);
    this.generateEdges();
    this.refreshGUI();
    return r; }

  linkClass(classe: MClass, index: number, refreshGUI: boolean = true, debug: boolean = false): void { this.setTarget(index, classe); }

  setValues(values: any[] | any = null, index: number = null, autofix: boolean = true, debug: boolean = false): void {
    if (index < 0) index = (this.getUpperbound() - index) % this.getUpperbound();
    if (index === null || index === undefined) {
      values.length = this.getUpperbound();
      let i: number;
      for (i = 0; i < values.length; i++) {
        if (values[i] instanceof MClass) this.setTarget(i, values[i]);
      }
      return;
    }
    if (Array.isArray(values)) { if (values.length === 1) values = values[0]; else return; }
    if (values instanceof MClass) this.setTarget(index, values);
  }

  setTarget(index: number, val: MClass): void {
    let edge: IEdge = this.edges[index];
    // clean up old pointed class & vertex referencesIn
    if (this.mtarget[index]) {
      U.arrayRemoveAll(this.mtarget[index].referencesIN, this);
      if (this.mtarget[index].vertex) U.arrayRemoveAll(this.mtarget[index].vertex.edgesEnd, edge);
    }

    if (val === null) {
      if (this.edges[index]) this.edges[index].remove();
      this.mtarget[index] = null;
      if (index === this.mtarget.length -1 && this.getUpperbound() === -1) {
        while (this.mtarget.length > 0 && !this.mtarget[this.mtarget.length - 1]) { this.mtarget.length--; this.edges.length--; } }
      return; }
    if (this.metaParent.unique && this.mtarget.indexOf(val) >= 0) {
      // basta evitare elementi identici o anche istanze diverse con stessi valori? o con altri concetti di "uguglianza" ?
      U.pif(true, 'This reference type is labeled as "unique" and is already linked to that element.'); return; }
    // if (this.mtarget[index]) { this.setTarget(index, null); }
    this.mtarget[index] = val;
    console.info('mtarget[' + index + ']:', this.mtarget[index]);
    U.ArrayAdd(this.mtarget[index].referencesIN, this);
    if (!Status.status.loadedLogic) return;
    this.generateEdges();
    edge = this.edges[index];
    U.ArrayAdd(this.mtarget[index].vertex.edgesEnd, edge); }

  clearTargets(): void {
    let i: number;
    for (i = 0; i < this.mtarget.length; i++) { this.setTarget(i, null); }
    let upperbound: number = this.getUpperbound();
    if (upperbound >= 0) {
      this.mtarget.length = upperbound;
      this.edges.length = upperbound;
    }
  }

  fixReferences(classRoot: MClass): void{
    for (let i: number = 0; i < this.mtarget.length; i++) {
      let target: string | MClass = this.mtarget[i] as any;
      if (target !== '' + target) continue;
      target = MClass.getByM1Path(classRoot, target);
      if (!target) { U.pw(true, 'invalid model save: failed to find m1 target:', target, this); continue; }
      // target.referencesIN.push(this);
      this.setTarget(i, target);
    }
  }
}
