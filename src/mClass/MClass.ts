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
  EdgeStyle,
  MFeature,
  M2Attribute,
  M3Class,
  IClass,
  Dictionary,
  GraphSize,
  MPackage,
  MReference,
  MAttribute,
  M2Reference,
  M2Feature,
  EOperation,
  Typedd,
  EAnnotation,
  MetaMetaModel,
  MetaModel,
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

  constructor(pkg: MPackage, json: Json, metaVersion: M2Class, autodetection: boolean) {
    super(pkg, metaVersion);
    if (!pkg && !json && !metaVersion) { return; } // empty constructor for .duplicate();
    U.pe(!metaVersion, 'null metaparent?');
    this.parse(json, true);

    if (autodetection){
      // let possibleClasses: M2Class[] = newMetaParent.getAllSubClasses(true);
      if (this.metaParent) U.arrayRemoveAll(this.metaParent.instances, this);
      let scores = this.metaParent.getTypeConversionScores(false, true);
    }
    this.changeMetaParent(metaVersion, false);
  }

  getAttribute(name: string, caseSensitive: boolean = false): MAttribute {
    let i: number;
    if (!caseSensitive) { name = name.toLowerCase(); }
    let attributes: MAttribute[] = [...this.getAllAttributes()];
    for (i = 0; i < attributes.length; i++) {
      const s: string = attributes[i].metaParent.name;
      if ((caseSensitive ? s : s.toLowerCase()) === name) { return attributes[i]; } }
    return null; }

  getReference(name: string, caseSensitive: boolean = false): MReference {
    let i: number;
    if (!caseSensitive) { name = name.toLowerCase(); }
    let references: MReference[] = [...this.getAllReferences()];
    for (i = 0; i < references.length; i++) {
      const s1: string = references[i].metaParent.name;
      console.log('find IReference[' + s1 + '] =?= ' + name + ' ? ' + (caseSensitive ? s1 : s1 && s1.toLowerCase()) === name);
      if ((caseSensitive ? s1 : s1 && s1.toLowerCase()) === name) { return references[i]; } }
    return null; }


  public doUnsetExtends(superclass: M2Class): void {
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
  public changeMetaParent(newMetaParent: M2Class, allowFeatureRemoval: boolean = false, refreshGui: boolean = false): void {
    if (!newMetaParent) return;
    if (this.metaParent) U.arrayRemoveAll(this.metaParent.instances, this);
    this.metaParent = newMetaParent;
    this.metaParent.instances.push(this);
    const newattributes: M2Attribute[] = [...newMetaParent.getAllAttributes()].reverse(); // need shallow copy
    const newreferences: M2Reference[] = [...newMetaParent.getAllReferences()].reverse();
    let i: number;

    // remove features not present in new type
    if (allowFeatureRemoval) {
      let thisAttrs: MAttribute[] = [... this.attributes];
      let thisRefs: MReference[] = [... this.references];
      for (i = 0; i < thisAttrs.length; i++) {
        const elem: MAttribute = thisAttrs[i];
        if (newattributes.indexOf(elem.metaParent) < 0) { refreshGui = true; elem.delete(false); }
      }
      for (i = 0; i < thisRefs.length; i++) {
        const elem: MReference = thisRefs[i];
        if (newreferences.indexOf(elem.metaParent) < 0) { refreshGui = true; elem.delete(false); }
      }
    }

    // exclude the ones already instantiated (avoid duplicates)
    for (i = 0; i < this.attributes.length; i++) { U.arrayRemoveAll(newattributes, this.attributes[i].metaParent); }
    for (i = 0; i < this.references.length; i++) { U.arrayRemoveAll(newreferences, this.references[i].metaParent); }

    // create the missing ones.
    for (i = 0; i < newattributes.length; i++) { new MAttribute(this, null, newattributes[i]); }
    for (i = 0; i < newreferences.length; i++) { new MReference(this, null, newreferences[i]); }

    if (refreshGui) this.refreshGUI_Alone();
  }

  // getAllChildrens(): MFeature[] { return (this.childrens); }
  getAllChildrens(includeOperations: boolean = true,
                    includeAnnotations: boolean = true, includeAttributes: boolean = true, includeReferences: boolean = true,
                    includeShadowed: boolean | null = false/*null = both shadow and unshadow, true = onlyshadowed*/): ModelPiece[] {
    const arr: ModelPiece[] = [];
    let j: number;
    const extChildrens: ModelPiece[] = [...this.childrens, ...this.metaParent.annotations, ...this.metaParent.operations];
    for (j = 0; j < extChildrens.length; j++) {
      const child: ModelPiece = extChildrens[j];
      // console.log('getAllChildrens', child.metaParent, this.metaParent, child, this);
      if (includeAttributes && child instanceof IAttribute) { arr.push(child); continue; }
      if (includeReferences && child instanceof IReference) { arr.push(child); continue; }
      if (includeOperations && child instanceof EOperation) { arr.push(child); continue; }
      if (includeAnnotations && child instanceof EAnnotation) { arr.push(child); continue; }
    }
    return arr; }

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
  getBasicAnnotations(): EAnnotation[] { return this.metaParent.getBasicAnnotations(); }

  endingName(valueMaxLength: number = 10): string {
    if (this.attributes.length > 0) { return this.attributes[0].endingName(valueMaxLength); }
    if (this.references.length > 0) { return this.references[0].endingName(valueMaxLength); }
    return ''; }

  getModelRoot(acceptNull: boolean = false): Model { return super.getModelRoot(acceptNull) as Model; }

  isRoot(): boolean { return this === Status.status.m.classRoot; }
  setRoot(value: boolean): void {
    U.pe(!value, 'should only be used to set root. to delete a root choose another one and call setRoot on it.');
    this.getModelRoot().classRoot = this;
  }


  conformability(meta: M2Class, outObj?: any): number {
    throw new Error('M.conformability%() todo');
  }

  duplicate(nameAppend: string = null, newParent: IPackage | ModelPiece = null): MClass {
    const c = new MClass(null, null, null, false);
    c.copy(this);
    c.refreshGUI_Alone();
    return c; }

  // linkToMetaParent(meta: M2Class): void { return super.linkToMetaParent(meta); }

  generateModel(loopDetectionObj: Dictionary<number /*MP id*/, ModelPiece> = null, root: boolean = false): Json {
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

    if (!loopDetectionObj) loopDetectionObj = {};
    U.pe(!U.isObject(loopDetectionObj), "loopdetection not object param:", loopDetectionObj, loopDetectionObj || {});
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
        const value: Json | string = (child).generateModel(loopDetectionObj);
        // some error here, il value = ELIteral viene assegnato alla key .nome
        if (value === '' || value === null || value === undefined || U.isEmptyObject(value)) { continue; }
        const key: string = (U.isPrimitive(value) ? inlineMarker : '') + child.metaParent.name;
        // U.pe(json[key], 'overriding value inside MClass.generateModel()', ', key:', key, ', newVal:', value, ', json:', json, ', MClass:', this, ', feature:', child);
        /*let wind = window as any;
        if (!wind.json) wind.json = {};
        if (!wind.json[key]) wind.json[key] = [];
        wind.json[key].push({value: value, m1id: child.id, m2id: child.metaParent.id, index: i + '/' + arr[outi].length, m2name: child.metaParent.name, setter: child});*/
        json[key] = value; }
    }
    return json; }

  parse_asgeneric_broke(json: Json, destructive: boolean = true): void {
    json = U.cloneObj(json);
    if (destructive) {
      this.attributes = [];
      this.references = [];
      this.childrens = [];
      this.referencesIN = []; }
    this.metaParent = MetaModel.genericObject;
    // this.changeMetaParent(this.metaParent, true, false); // fill childrens, attributes, references con istanze delle m2feature ereditate.
    const inlineMarker: string = Status.status.XMLinlineMarker;
    let allKeys = Object.keys(json);
    const xmiVersion = json[inlineMarker + 'xmi:version'];
    delete json[inlineMarker + 'xmi:version'];
    if (xmiVersion) {
      U.pe(+xmiVersion !== 2, "This xmi version (" + xmiVersion + ") is not supported");
      this.setRoot(true);
    }
    for (let key of allKeys) {
      if (!json.hasOwnProperty(key)) { continue; }
      let keyParts = key.split(':');
      const val = json[key];
      switch (keyParts[0]) {
        default:
          if (typeof val === 'string') { new MAttribute(this, null, MetaModel.genericAttribute); }
          else { new MReference(this, null, MetaModel.genericReference); }
          // U.pe(true, 'unexpected entry while parsing M1Class:' + keyParts[0], keyParts);
        break;
        case inlineMarker + 'xmlns':
          switch (keyParts[1]) {
            case 'xmi': break; //"-xmlns:xmi": "http://www.omg.org/XMI",
            default: // "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
              const value: Json = json[key];
              // todo: (set / handle) the (package / namespace)
            break;
          }
        }
      }
  }

  parse(json: Json, destructive: boolean = true): void {
    if (destructive) {
      this.attributes = [];
      this.references = [];
      this.childrens = [];
      this.referencesIN = []; }
    this.changeMetaParent(this.metaParent, true, false); // fill childrens, attributes, references con istanze delle m2feature ereditate.

    /*{                                                           <--- classRoot
        "-xmlns:xmi": "http://www.omg.org/XMI",
        "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
        "-xmi:version": "2.0",
        "Players": [
          { "-name": "tizio" },          <-- class[0]
          { "-name": "asd" }             <-- class[1]
        ]
      }*/
    // todo big bug: se un m1-object ha una reference a Mammifero{ età }, ma io gli assegno Balena{ età, peso }, si aspetta di trovare solo {età}
    // ma potrei avergli assegnato una balena con anche il peso, e lui in questo parse assume che sia solo un mammifero senza peso.
    // l'errore è sin da prima del parse, è quando gli passo il metaParent proprio
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
            U.pw(true, 'm1 model attribute-or-reference type not found. class:', this, ', json:', json,
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


  getChildrenIndex_ByMetaParent(meta: ModelPiece): number {
    const arr: ModelPiece[] = this.getAllChildrens(true, true, true, true, false);
    return MClass.getArrayIndex_ByMetaParentID(meta.id, arr); }

  getAttributeIndex_ByMetaParent(meta: M2Attribute): number {
    const arr: MAttribute[] = [...this.getAllAttributes()];
    return MClass.getArrayIndex_ByMetaParentID(meta.id, arr); }

  getReferenceIndex_ByMetaParent(meta: M2Reference): number {
    const arr: MReference[] = [...this.getAllReferences()];
    return MClass.getArrayIndex_ByMetaParentID(meta.id, arr); }

  private static getArrayIndex_ByMetaParentID(id: number, array: ModelPiece[]): number {
    let i = -1;
    while (++i < array.length) { if (id === array[i].metaParent.id) { return i; } }
    return -1; }

    delete(refreshgui: boolean = true, fromParent: boolean = false): void{
      super.delete(false, fromParent);
      // NB: gli m1-link a questo oggetto sono già stati rimossi da setType in m2 o da delete vertex in IClass
    }

  convertTo(classe: M2Class): void{
    console.log('m1-convertTo()', {thiss: this, currentMeta: [this.metaParent.toString(), this.metaParent], nextMeta: [classe.toString(), classe]});
    this.changeMetaParent(classe, true, true);
  }
  /*
  canConvertTo(classe: M2Class): boolean{
    if (!classe) return true;
    if (classe.getInterface() || classe.getAbstract()) return false;
    return this.metaParent.isExtending(classe) || classe.isExtending(this.metaParent);
  }*/
  getContainer(): MReference {
    for (let ref of this.referencesIN) if (ref.isContainment()) return ref;
    return null; }

  getM1Path(includeSelf: boolean = false): (MClass | MReference)[]{
    const path: (MClass | MReference)[] = [];
    if (includeSelf) path.push(this);
    let currentNode: MClass = this;
    let maxDepth = 1000;
    while (true) {
      U.pe(!--maxDepth, 'cannot save m1: loop of containment');
      if (currentNode.isRoot()) { return path.reverse(); }
      const container: MReference = currentNode.getContainer();
      if (!container) return null;
      currentNode = container.parent
      path.push(container);
      path.push(currentNode);
    }
  }
  getM1PathStr(canWarn: boolean = false): string{
    const path: (MClass | MReference)[] = this.getM1Path(true);
    let ret: string = '/';
    // let lastClass: MClass = this.getModelRoot().getClassRoot();
    let lastRef: MReference = null;
    let i: number = 0;
    if (!path) { U.pw(canWarn, 'found disconnected data in M1', {thiss: this, path}); return null; }
    for (let elem of path){
      // console.log('following m1 path:', {path, i, elem, lastRef, ret});
      if (elem instanceof MReference){
        // alternare classi e reference, mai 2 classi o 2 reference consecutive, si parte da ref (root-class è sottinteso) e si termina con class.
        U.pe(i++ % 2 === 0, 'dev error r: m1 path should follow the schema [Class, Reference]*', path, this);
        ret += '/@' + elem.metaParent.name;
        lastRef = elem;
      }else if (elem instanceof MClass){
        U.pe(i++ % 2 === 1, 'dev error c: m1 path should follow the schema [Class, Reference]*', path, this);
        ret += !lastRef ? '' : '.' + lastRef.mtarget.indexOf(elem);
      }
    }
    return ret;
  }
  static getByM1Path(root: MClass, path: string): MClass{
    const refstrarr: string[] = path.split('/@');
    let currentClass: MClass = root;
    let currentRef: MReference = null;
    for (let refstr of refstrarr) {
      if (refstr === '/') continue;
      const lastindex: number = refstr.lastIndexOf('.');
      const refname: string = refstr.substr(0, lastindex);
      const targetindex: string = refstr.substr(lastindex + 1);
      U.pe(!U.isNumerizable(targetindex), 'm1 parse error: index is not a number', {refstr, refstrarr, path, root});
      currentRef = currentClass.getReference(refname);
      currentClass = currentRef.mtarget[+targetindex];
    }
    return currentClass;
  }

  isConnectedToRoot(): boolean{
    let currentClass: MClass = this;
    while (!currentClass.isRoot()) {
      const containerRef: MReference = currentClass.getContainer();
      if (!containerRef) return false;
      currentClass = containerRef.parent
    }
    return true;
  }

  isInvalidRoot(): boolean { return !this.isRoot() && !this.getContainer(); }

  getContainerChain(): MClass[] {
    const ret: MClass[] = [];
    let currentClass: MClass = this;
    while (true) {
      const containerRef: MReference = currentClass.getContainer();
      if (!containerRef) return ret;
      currentClass = containerRef.parent;
      if (ret.indexOf(currentClass) >= 0) { U.pw(true, 'model have a containment loop'); return ret; }
      ret.push(currentClass);
    }
  }
  isContainedIn(container: MClass): boolean{ return this.getContainerChain().indexOf(container) >= 0; }


  // todo problema: se ci sono 2 sottoclassi con stessi nomi di feature ma diversi tipi... o addirittura diverso tipo di modelpiece
  // (attribute vs operation) vengono considerati uguali perchè valuta solo i nomi delle feature e non la compatibilità del valore con il tipo
  static findMetaSubClass(json1: Json, targetMM: M2Class, debug: boolean = true): M2Class{
    U.pif(debug, 'findMetaSubclass to use', json1);
    const subclasses: M2Class[] = targetMM.getAllSubClasses(true);
    const requiredFeatures: Dictionary<string, boolean> = U.toDictionary(Object.keys(json1).map(f=>f.substr(Status.status.XMLinlineMarker.length).toLowerCase()), false);
    const scores: MetaClassCompatibility[] = subclasses.map( c => new MetaClassCompatibility(requiredFeatures, c, targetMM))
      .sort((mc1, mc2) => mc2.matchingScore - mc1.matchingScore);
    const bestScorePareggi: MetaClassCompatibility[] = scores.filter(match => match.matchingScore == scores[0].matchingScore)
      .sort((m1,m2) => m1.subclassingDepthLevel-m2.subclassingDepthLevel); // take only best scores
    U.pif(debug, 'findMetaSubclass to use matched:', {match: bestScorePareggi[0].m2Class.name, subclasses, requiredFeatures, scores, scoresn: scores.map(s=>s.m2Class.name)});
    return bestScorePareggi[0].m2Class;
  }
}


class MetaClassCompatibility {
  static missingScore: number = -100; // using this m2 will remove features
  static surplusScore: number = -1; // using this m2 will add features
  static matchingScore: number = 0;
  static caseSensitiveness: number = 0.1; // 1 = 100% score penalty, 0 = totally case insensitive.
  missing: Dictionary<string, number>; // key - matchingDegree
  surplus: Dictionary<string, number>;
  matching: Dictionary<string, number>;
  allm1Features: Dictionary<string, boolean>;
  m2Class: M2Class;
  matchingScore: number;
  subclassingDepthLevel: number;

  constructor(m1Features: Dictionary<string, boolean>, m2Class: M2Class, rootClass: M2Class, caseSensitiveness?: number) {
    //todo: per ora solo case insensitive, magari fallo con case sensitiveness opzionale.
    if (undefined === caseSensitiveness) caseSensitiveness = MetaClassCompatibility.caseSensitiveness;
    this.allm1Features = m1Features;
    this.m2Class = m2Class;
    this.matching = {};
    this.missing = {};
    this.surplus = {};
    this.matchingScore = 0;
    this.subclassingDepthLevel = rootClass.getSubclassDepthLevel(m2Class);
    // const m2features: Dictionary<string, boolean> = U.toDictionary(m2Class.getAllChildrens().map(c => c.name), false);
    const m2featuresLowercase: Dictionary<string, boolean> =  U.toDictionary(m2Class.getAllChildrens().map(c => c.name.toLowerCase()), false);
    for (let key in this.allm1Features) {
      if (m2featuresLowercase[key]) {
        this.matching[key] = 1;
      } else {
        this.missing[key] = 1;
        this.matchingScore += MetaClassCompatibility.missingScore;
      }
    }
    for (let key in m2featuresLowercase) {
      if (this.allm1Features[key]) {
        // this.matching[key] = 1;
      } else {
        this.surplus[key] = 1;
        this.matchingScore += MetaClassCompatibility.surplusScore;
      }
  }
  }
}
