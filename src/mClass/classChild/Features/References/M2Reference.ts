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
  U,
  ECoreAttribute,
  ECoreReference,
  ShortAttribETypes,
  MClass,
  MReference,
  IReference,
  M3Reference,
  EdgeStyle,
  EdgeModes,
  EdgePointStyle, MetaModel, Info, IClass, Type, EEnum, Dictionary,
} from '../../../../common/Joiner';

export class M2Reference extends IReference {
  static stylesDatalist: HTMLDataListElement;
  parent: M2Class;
  metaParent: M3Reference;
  instances: MReference[];

  upperbound: number;
  lowerbound: number;
  containment: boolean = false && false;

  constructor(classe: M2Class, json: Json) {
    super(classe, Status.status.mmm.getReference());
    if (!classe && !json) { return; } // empty constructor for .duplicate();
    this.parse(json, true); }

  getModelRoot(): MetaModel { return super.getModelRoot() as MetaModel; }

  parse(json: Json, destructive: boolean): void {
    /// own attributes.
    this.setName(Json.read<string>(json, ECoreReference.namee, 'Ref_1'));
    this.type.changeType(Json.read<string>(json, ECoreReference.eType, this.parent.getEcoreTypeName() ));
    //const eType = Json.read<string>(json, ECoreReference.eType, '#//' + this.parent.name );
    // this.type = AttribETypes.reference;
    // this.parsePrintableTypeName(eType);
    // this.linkClass();
    this.containment = Json.read<boolean>(json, ECoreReference.containment, false);
    this.setLowerbound(+Json.read<number>(json, ECoreReference.lowerbound, 0));
    this.setUpperbound(+Json.read<number>(json, ECoreReference.upperbound, 1));
    let i: number;/*
    this.views = [];
    for(i = 0; i < this.parent.views.length; i++) {
      const pv: ClassView = this.parent.views[i];
      const v = new ReferenceView(pv);
      this.views.push(v);
      pv.referenceViews.push(v); }*/
  }

  generateModel(loopDetectionObj: Dictionary<number /*MP id*/, ModelPiece> = null): Json {
    const model = new Json(null);
    model[ECoreReference.xsitype] = 'ecore:EReference';
    model[ECoreReference.eType] = this.type.toEcoreString();
    model[ECoreReference.namee] = this.name;
    if (this.lowerbound != null && !isNaN(+this.lowerbound)) { model[ECoreReference.lowerbound] = +this.lowerbound; }
    if (this.upperbound != null && !isNaN(+this.lowerbound)) { model[ECoreReference.upperbound] = +this.upperbound; }
    if (this.containment != null) { model[ECoreReference.containment] = this.containment; }
    return model; }

  generateEdges(): IEdge[] {
    if (!this.edges) this.edges = [null]; // size must be 1
    const e: IEdge = new IEdge(this, 0, this.parent.getVertex(), this.type.classType.getVertex(), null);
    return [e]; }

  useless(): void {}
/*
  fieldChanged(e: JQuery.ChangeEvent) {
    const html: HTMLElement = e.currentTarget;
    switch (html.tagName.toLowerCase()) {
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input': this.setName((html as HTMLInputElement).value); break;
      case 'select':
        const select: HTMLSelectElement = html as HTMLSelectElement;
        const m: M2Class = ModelPiece.getByID(+select.value) as any;
        this.linkClass(m); break;
    }
  }*/

  setContainment(b: boolean): void { this.containment = b; }

  setUpperbound(n: number): void {
    super.setUpperbound(n);
    let i = -1;
    while (++i < this.instances.length) {
      const mref: MReference = this.instances[i];
      if (n !== -1) { mref.mtarget.length = mref.edges.length = n; }
      mref.delete(true, n, Number.POSITIVE_INFINITY); } }

  delete(refreshgui: boolean = true, linkStart: number = null, linkEnd: number = null): void {
    const oldParent = this.parent;
    console.log('m2ref.delete()', refreshgui, oldParent);
    // total deletion
    if (linkStart === null && linkEnd === null) {
      if (this.type.classType) U.arrayRemoveAll(this.type.classType.referencesIN, this);}
    super.delete(false, linkStart, linkEnd);
    console.log('m2ref.delete()', refreshgui, oldParent);

    if (refreshgui && oldParent) { setTimeout( ()=> {oldParent.refreshGUI(); oldParent.refreshInstancesGUI();}, 0); }
  }
/*
  getStyle(debug: boolean = true): HTMLElement | SVGElement {
    const raw: HTMLElement | SVGElement = super.getStyle(debug);
    const $raw = $(raw);
    const $selector = $raw.find('select.ClassSelector');
    M2Class.updateMMClassSelector($selector[0] as HTMLSelectElement, this.classType);
    return raw; }*/

  duplicate(nameAppend: string = '_Copy', newParent: M2Class = null): M2Reference {
    const r: M2Reference = new M2Reference(null, null);
    return r.copy(this, nameAppend, newParent); }

  copy(r: M2Reference, nameAppend: string = '_Copy', newParent: M2Class = null): M2Reference {
    super.copy(r, nameAppend, newParent);
    this.setLowerbound(r.lowerbound);
    this.setUpperbound(r.upperbound);
    this.containment = r.containment;
    this.type.changeType(r.type.toEcoreString());
    this.refreshGUI();
    return this; }


  // linkClass(classe: M2Class = null): void { return this.type.changeType(null, null, classe); }

  // conformability(meta: M3Reference, debug: boolean = true): number { U.pw(true, 'it\'s ok but should not be called'); return 1; }

  getInfo(toLower: boolean = true): any {
    const info: any = super.getInfo();
    // set('typeOriginal', this.type);
    // info['' + 'tsClass'] = (this.getModelRoot().getPrefix()) + 'Reference';
    Info.rename(info, 'type', 'target');
    Info.rename(info, 'typeDetail', 'targetDetail');
    Info.set(info, 'containment', this.containment);
    const targetinfo: Info = this.type.classType ? this.type.classType.getInfo(toLower) : {};
    Info.set(info, 'target', targetinfo);
    Info.merge(info, targetinfo);
    return info; }


   canBeLinkedTo(hoveringTarget: M2Class): boolean {
    // todo: se è un override devo assicurarmi che non invalidi l'override
    return (hoveringTarget instanceof M2Class); }

  getTarget(): M2Class { return this.type.classType; }
}
