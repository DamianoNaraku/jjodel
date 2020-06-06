import {
  IVertex,
  IEdge,
  IField,
  IPackage,
  IAttribute,
  AttribETypes,
  IFeature,
  Json,
  U,
  ModelPiece,
  ISidebar,
  IGraph,
  M2Class,
  IReference,
  Status,
  DetectZoom,
  Model,
  ECoreAttribute,
  ECoreClass,
  ECorePackage,
  ECoreReference,
  ECoreRoot,
  Point,
  GraphPoint,
  IModel,
  Size,
  EdgeStyle, MFeature, M2Attribute, M3Class, IClass,
  Dictionary, GraphSize, MPackage, MReference, MAttribute, M2Reference, M2Feature, EOperation,
} from '../common/Joiner';

export class MClass extends IClass {
  static stylesDatalist: HTMLDataListElement;
  metaParent: M2Class;
  // instances: ModelNone[];
  parent: MPackage;
  childrens: MFeature[];
  attributes: MAttribute[];
  references: MReference[];
  referencesIN: MReference[];
  // external pointers to this class.
  // id: number;
  // instances: ModelPiece[];
  // metaParent: M2Class;
  // parent: MPackage;
  // childrens: ModelPiece[];
  /*attributes: MAttribute[];
  references: MReference[];
  referencesIN: MReference[];
*/

  constructor(pkg: MPackage, json: Json, metaVersion: M2Class) {
    super(pkg, metaVersion);
    if (!pkg && !json && !metaVersion) { return; } // empty constructor for .duplicate();
    U.pe(!metaVersion, 'null metaparent?');
    this.parse(json, true);
  }
  unsetExtends(superclass: M2Class): void {
    if (!superclass) return;
    let i: number;
    let j: number;
    let inheritablefeatures: Dictionary<number, M2Feature> = {};
    // prendo la lista di tutte le m2-feature che dovrei istanziare, direttamente o per eredità.
    for (i = -1; i < this.metaParent.extends.length; i++) {
      let m2class = i === -1? this.metaParent : this.metaParent.extends[i];
      if (m2class == superclass) continue;
      for (j = 0; j < m2class.childrens.length; j++) {
        let m2feature = m2class.childrens[j];
        inheritablefeatures[m2feature.id] = m2feature;
      }
    }
    // cancello le m2-feature presenti ma fuori dalla lista di quelle che dovrebbero esserci.
    let childrens: MFeature[] = U.shallowArrayCopy(this.childrens);
    for (i = 0; i < childrens.length; i++) {
      const feature: MFeature = childrens[i];
      if (inheritablefeatures[feature.metaParent.id]) continue;
      // if (superclass.childrens.indexOf(feature.metaParent) < 0) continue; OLD System was wrong:
      // se un attributo lo estendo da due classi diverse, il delete di un extend non deve cancellarlo.
      // es: B1 extends A; B2 extends A; C extends B1, B2; C eredita 2 volte le cose di A, una le cose di B1 e una le cose di B2,
      // se tolgo l'extend a B1 devo tenere quelle di A.
      feature.delete(); }
    this.refreshGUI_Alone(); }

  //todo: fai getByName con prefisso della classe inherited per console. tipo:  ClassC.ClassB1:samenamefeature vs ClassC.ClassB2:samenamefeature
  setExtends(superclass: M2Class, refresh: boolean = false): boolean {
    if (!superclass) return false;
    const attributes: M2Attribute[] = [...superclass.getAllAttributes()];
    const references: M2Reference[] = [...superclass.getAllReferences()];
    let i: number;
    let tmp: any;
    // exclude the ones already instantiated.
    for (i = 0; i < this.attributes.length; i++) { U.arrayRemoveAll(attributes, this.attributes[i].metaParent); }
    for (i = 0; i < this.references.length; i++) { U.arrayRemoveAll(references, this.references[i].metaParent); }
    // create the missing ones.
    for (i = 0; i < attributes.length; i++) { new MAttribute(this, null, attributes[i]); }
    for (i = 0; i < references.length; i++) { new MReference(this, null, references[i]); }

    if (refresh) this.refreshGUI_Alone(); }

  // getAllChildrens(): MFeature[] { return (this.childrens); }
  getAllAttributes(): Set<MAttribute> { return new Set(this.attributes); }
  getAllReferences(): Set<MReference> { return new Set(this.references); }
  /*getDisplayedChildrens(): Set<EOperation | MFeature> {
    const arr: Set<EOperation|MFeature> = new Set<EOperation|MFeature>(this.getAllChildrens());
    U.SetMerge(true, arr, this.getAllOperations());
    return arr; }
  getDisplayedOperations(): Set<EOperation> { return this.getAllOperations(); }
  getDisplayedAttributes(): Set<MAttribute> { return this.getAllAttributes(); }
  getDisplayedReferences(): Set<MReference> { return this.getAllReferences(); }*/
  /*getBasicChildrens(): Set<MFeature> {
    const ret: Set<MFeature> = new Set();
    let i: number;
    for (i = 0; i < this.childrens.length; i++) { if (this.childrens[i].metaParent.parent === this.metaParent) ret.add(this.childrens[i]); }
    return ret; }*/
  getBasicAttributes(): Set<MAttribute> {
    const ret: Set<MAttribute> = new Set();
    let i: number;
    for (i = 0; i < this.attributes.length; i++) { if (this.attributes[i].metaParent.parent === this.metaParent) ret.add(this.attributes[i]); }
    return ret; }
  getBasicReferences(): Set<MReference> {
    const ret: Set<MReference> = new Set();
    let i: number;
    for (i = 0; i < this.references.length; i++) { if (this.references[i].metaParent.parent === this.metaParent) ret.add(this.references[i]); }
    return ret; }
  getBasicOperations(): Set<EOperation> { return this.metaParent.getBasicOperations(); }

  endingName(valueMaxLength: number = 10): string {
    if (this.attributes.length > 0) { return this.attributes[0].endingName(valueMaxLength); }
    if (this.references.length > 0) { return this.references[0].endingName(valueMaxLength); }
    return ''; }

  getModelRoot(): Model { return super.getModelRoot() as Model; }

  isRoot(): boolean { return this === Status.status.m.classRoot; }
  setRoot(value: boolean): void {
    U.pe(!value, 'should only be used to set root. to delete a root choose another one and call setRoot on it.');
    this.getModelRoot().classRoot = this;
  }


  conformability(meta: M2Class, outObj?: any): number {
    throw new Error('M.conformability%() todo');
  }

  duplicate(nameAppend: string = null, newParent: IPackage | ModelPiece = null): MClass {
    const c = new MClass(null, null, null);
    c.copy(this);
    c.refreshGUI_Alone();
    return c; }

  // linkToMetaParent(meta: M2Class): void { return super.linkToMetaParent(meta); }
  generateModel(root: boolean = false): Json {
    /*
       { "-name": "tizio", "attrib2": value2, ...}
    OR:
       {
        "-xmlns:xmi": "http://www.omg.org/XMI",
        "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
        "-xmi:version": "2.0",
        "Players": [
          { "-name": "tizio" },
          { "-name": "asd" }
        ]
      }
    */
    const inlineMarker: string = Status.status.XMLinlineMarker;
    const json: Json = {};
    if (root) {
      json[inlineMarker + 'xmlns:xmi'] =  'http://www.omg.org/XMI';
      json[inlineMarker + 'xmlns:' + this.getModelRoot().namespace()] = this.getModelRoot().uri();
      json[inlineMarker + 'xmi:version'] =  '2.0'; }
    let outi: number;
    let i: number;
    const arr: MFeature[][] = [this.attributes, this.references];
    for (outi = 0; outi < arr.length; outi++) {
      for (i = 0; i < arr[outi].length; i++) {
        const child: MFeature = arr[outi][i];
        if (child.isShadowed(this)) continue;
        const value: Json | string = (child).generateModel();
        // some error here, il value = ELIteral viene assegnato alla key .nome
        if (value === '' || value === null || value === undefined || U.isEmptyObject(value)) { continue; }
        const key: string = (U.isPrimitive(value) ? inlineMarker : '') + child.metaParent.name;
        U.pe(json[key], 'overriding value inside MClass.generateModel()',
          ', key:', key, ', newVal:', value, ', json:', json, ', MClass:', this, ', feature:', child);
        /*let wind = window as any;
        if (!wind.json) wind.json = {};
        if (!wind.json[key]) wind.json[key] = [];
        wind.json[key].push({value: value, m1id: child.id, m2id: child.metaParent.id, index: i + '/' + arr[outi].length, m2name: child.metaParent.name, setter: child});*/
        json[key] = value; }
    }
    return json; }

  parse(json: Json, destructive: boolean = true): void {
  if (destructive) {
    this.attributes = [];
    this.references = [];
    this.childrens = [];
    this.referencesIN = []; }
    this.setExtends(this.metaParent, false); // fill childrens, attributes, references con istanze delle m2feature ereditate.

    /*{                                                           <--- classRoot
        "-xmlns:xmi": "http://www.omg.org/XMI",
        "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
        "-xmi:version": "2.0",
        "Players": [
          { "-name": "tizio" },          <-- class[0]
          { "-name": "asd" }             <-- class[1]
        ]
      }*/
    const inlineMarker: string = Status.status.XMLinlineMarker;
    for (let key in json) {
      if (!json.hasOwnProperty(key)) { continue; }
      const value: Json = json[key];
      switch (key) {
        case inlineMarker + 'xmlns:xmi':
        // case inlineMarker + 'xmlns:' + this.getModelRoot().namespace():
        case inlineMarker + 'xmi:version': this.setRoot(true); break;
        default:
          // todo: usa il ns del modello per caricare il metamodello con quel namespace se quello attuale non è conforme?
          if (key.indexOf(inlineMarker) === 0) { key = key.substr(inlineMarker.length); }
          if (key.indexOf('xmlns:') === 0) {
            key = key.substr('xmlns:'.length);
            this.getModelRoot().namespace(key);
            U.pw(false, 'setns?', key, this, this.metaParent); continue; }
          const metaAttr: M2Attribute = this.metaParent.getAttribute(key);
          const metaRef: M2Reference = this.metaParent.getReference(key);
          if (metaAttr) {
            const cindex: number = this.getChildrenIndex_ByMetaParent(metaAttr);
            const aindex: number = this.getAttributeIndex_ByMetaParent(metaAttr);
            /*const newA: MAttribute = new MAttribute(this, value, metaAttr);
            this.childrens[cindex] = this.attributes[aindex] = newA;*/
            this.attributes[aindex].parse(value, true);
          } else if (metaRef) {
            const cindex: number = this.getChildrenIndex_ByMetaParent(metaRef);
            const rindex: number = this.getReferenceIndex_ByMetaParent(metaRef);
            // const newR: MReference = new MReference(this, value, metaRef);
            // this.childrens[cindex] = this.references[rindex] = newR;
            let j: number;
            let edges: IEdge[] = this.references[rindex].getEdges();
            for (j = 0; j < edges.length; j++) {}
            this.references[rindex].parse(value, true);

          } else {
            U.pe(true, 'm1 model attribute-or-reference type not found. class:', this, ', json:', json,
              'key/name:', key, ', Iclass:', this.metaParent); }
          break;
      }
    }
  }
  modify_Old(json: Json, destructive: boolean = true): void {
    /*{                                                                                           <-- :classroot
        "-xmlns:xmi": "http://www.omg.org/XMI",
        "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
        "-xmi:version": "2.0",
        "Players": [
          { "-name": "tizio" },          <-- class[0]
          { "-name": "asd" }             <-- class[1]
        ]
      }*/
    if (destructive) { this.childrens = []; this.references = []; this.attributes = []; this.referencesIN = []; }
    const inlineMarker: string = Status.status.XMLinlineMarker;
    for (let key in json) {
      if (!json.hasOwnProperty(key)) { continue; }
      const value: Json = json[key];
      switch (key) {
        case inlineMarker + 'xmlns:xmi':
        // case inlineMarker + 'xmlns:' + this.getModelRoot().namespace():
        case inlineMarker + 'xmi:version': this.setRoot(true); break;
        default:
          // todo: usa il ns del modello per caricare il metamodello con quel namespace se quello attuale non è conforme?
          if (key.indexOf(inlineMarker) === 0) { key = key.substr(inlineMarker.length); }
          if (key.indexOf('xmlns:') === 0) {
            key = key.substr('xmlns:'.length);
            this.getModelRoot().namespace(key);
            U.pw(false, 'setns?', key, this, this.metaParent); continue; }
          const metaAttr: M2Attribute = this.metaParent.getAttribute(key);
          const metaRef: M2Reference = this.metaParent.getReference(key);
          let newA: MAttribute;
          let newR: MReference;
          if (metaAttr) {
            newA = new MAttribute(this, value, metaAttr);
            U.ArrayAdd(this.childrens, newA);
            U.ArrayAdd(this.attributes, newA);
          } else if (metaRef) {
            newR = new MReference(this, value, metaRef);
            U.ArrayAdd(this.childrens, newR);
            U.ArrayAdd(this.references, newR);
          } else {
            U.pe(true, 'model attribute-or-reference type not found. class:', this, ', json:', json,
              'key/name:', key, ', Iclass:', this.metaParent); }
          break;
      }
    }

  }


  getChildrenIndex_ByMetaParent(meta: ModelPiece): number { return MClass.getArrayIndex_ByMetaParentID(meta.id, this.childrens); }
  getAttributeIndex_ByMetaParent(meta: IAttribute): number { return MClass.getArrayIndex_ByMetaParentID(meta.id, this.attributes); }
  getReferenceIndex_ByMetaParent(meta: IReference): number { return MClass.getArrayIndex_ByMetaParentID(meta.id, this.references); }

  static getArrayIndex_ByMetaParentID(id: number, array: ModelPiece[]): number {
    let i = -1;
    while (++i < array.length) { if (id === array[i].metaParent.id) { return i; } }
    return -1; }

}
