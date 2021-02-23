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
  MAttribute,
  MReference, MClass, IClass, M2Reference, M2Feature, M3Class, M2Package, M2Attribute, M3Reference, M3Attribute, M3Feature, MetaModel,
  EOperation, EParameter, Typedd, Type, Dictionary, ExtEdge, ShortAttribETypes, EAnnotation, AccessModifier,
} from '../common/Joiner';
import Swal from "sweetalert2";


export class M2Class extends IClass {
  static stylesDatalist: HTMLDataListElement;
  // static all: any[] = [];
  parent: M2Package;
  childrens: Array<M2Feature | EOperation>; // M2Feature[];
  // features: M2Feature[]; // M2Feature[];
  operations: EOperation[] = [];
  attributes: M2Attribute[];
  references: M2Reference[];
  referencesIN: M2Reference[]; // external pointers to this class.
  metaParent: M3Class;
  instances: MClass[];
  extends: M2Class[] = [];
  gotExtendedBy: M2Class[] = [];
  isAbstract: boolean;
  isInterface: boolean;
  visibility: AccessModifier = AccessModifier.package;
  private extendsStr: string[];
  public extendEdges: ExtEdge[];

  getAccessModifier(): AccessModifier { return this.visibility; }
  getVisibility(): AccessModifier { return this.getAccessModifier(); }
  setAccessModifier(a: AccessModifier): void {
    const output: {reason: string} = {reason: ''};
    if (!this.canChangeAccessModifierValidityTo(a, output, true)) {
      U.pe(true, 'cannot set visibility scope to "' + a.toString() + '" because ' + output.reason);
    }
    this.visibility = a; }

  public canChangeAccessModifierValidityTo(a: AccessModifier, {reason: string}, allowMark: boolean = false): boolean {
    //todo: controlla che le m2-reference e utilizzo nei parametri rispettino il visibility scope
    return true;
  }
  /*
    static updateAllMMClassSelectors(root0: Element = null, updateModel: boolean = false, updateSidebar: boolean = true): void {
      let root: Element = root0;
      if (!Status.status.loadedGUI) { return; }
      if (!root) { root = Status.status.mm.graph.container; }
      // console.log('updateAllMMClassSelectors()', 'selects:', $selectors, root);
      const $selectors = $(root).find('select.ClassSelector');
      let i = -1;
      while (++i < $selectors.length) { M2Class.updateMMClassSelector($selectors[i] as HTMLSelectElement); }
      if (updateSidebar && Status.status.m && Status.status.m.sidebar) { Status.status.m.sidebar.loadDefaultHtmls(); }
      if (!updateModel) { return; }
      // if (Status.status.mm && Status.status.mm.sidebar) { Status.status.mm.sidebar.updateAll(); }
      if (Status.status.m) { Status.statm.refreshGUI(); }
    }
  /*
    static updateMMClassSelector(htmlSelect: HTMLSelectElement, selected: M2Class = null, debug = false,
                                 mustSelect: boolean = true): HTMLSelectElement {
      if (!htmlSelect || !Status.status.loadedGUI) { return; }
      const optGrp: HTMLOptGroupElement = document.createElement('optgroup');
      let toSelect: string;
      if (debug) { console.clear(); }
      if (mustSelect && !selected) {
        const mp: ModelPiece = ModelPiece.getLogic(htmlSelect);
        U.pif(debug, 'ownermp:', mp, 'select:', htmlSelect);
        // if (ownermp instanceof IAttribute || ownermp instanceof MAttribute) { selected = ownermp.parent as M2Class; }
        if (mp instanceof Typedd) { selected = (mp as Typedd).type; }
        U.pw(!selected, 'ClassSelectors must be held inside a m2-reference:', htmlSelect, 'ownermp:', mp) ;
        if (!selected) { return; }
      }
      toSelect = '' + (selected ? selected.id : '');
      U.pif(debug, 'selected:', selected);
      U.clear(htmlSelect);
      htmlSelect.appendChild(optGrp);
      optGrp.setAttribute('label', 'Class list');
      const mmClasses: M2Class[] = Status.status.mm.getAllClasses();
      let i: number;
      let found: boolean = !mustSelect;
      for (i = 0; i < mmClasses.length; i++) {
        const classe: M2Class = mmClasses[i];
        if (classe.shouldBeDisplayedAsEdge()) { continue; }
        const opt: HTMLOptionElement = document.createElement('option');
        opt.value = '' + classe.id;
        if (toSelect && opt.value === toSelect) { opt.setAttribute('selected', ''); opt.selected = found = true; }
        // console.log('mustselect?' + mustSelect + ': ' + toSelect + '&&' + opt.value + ' ? ' + found);
        opt.innerHTML = classe.name;
        optGrp.appendChild(opt); }
      U.pw(debug && !found, 'class not found.', mmClasses, 'searchedClass:', selected,
        'shouldBeEdge?', selected && selected.shouldBeDisplayedAsEdge());
      return htmlSelect; }
  */
  // isRoot(): boolean { U.pe(true, 'm2 class cannot be roots.'); return false; }
  // setRoot(value: boolean): void { U.pe(true, 'only usable in model version'); }

  constructor(pkg: M2Package, json: Json, allowWarning: boolean = true) {
    super(pkg, Status.status.mmm.getAllClasses()[0]);
    this.instances = [];
    if (!pkg && !json) { return; } // empty constructor for .duplicate();
    this.parse(json, true, allowWarning);
  }

  getAllSuperClasses(plusThis: boolean = false): M2Class[] {
    // :this sembra buggato come parametro input: se gli passo un parametro stesso tipo mi da comunque errore, ma accetta letteralmente "this"...
    let i: number;
    /*
    const set: Set<IClass> = plusThis ? new Set<IClass>([this as any]) : new Set();
    for (i = 0; i < this.extends.length; i++) {
      U.SetMerge(true, set, this.extends[i].getAllSuperClasses(true)); }
    return [...set];*/

    // deve fare una ricerca per ordini dell'albero (width, non per depth nel grafo)
    const visited: Map<number, M2Class> = new Map();
    const queue: M2Class[] = plusThis ? [this, ...this.extends] : [ ...this.extends];
    const ret: M2Class[] = [];
    for (i = 0; i < queue.length; i++) {
      let elem: M2Class = queue[i];
      if (visited[elem.id]) continue;
      visited[elem.id] = elem;
      ret.push(elem);
      queue.push(...elem.extends);
    }
    return ret;
  }

  getAllSubClasses(plusThis: boolean = false): M2Class[] {
    let i: number;
    const set: Set<M2Class> = plusThis ? new Set<M2Class>([this as any]) : new Set();
    for (i = 0; i < this.gotExtendedBy.length; i++) {
      U.SetMerge(true, set, this.gotExtendedBy[i].getAllSubClasses(true)); }
    return [...set]; }

  getBasicExtends(plusThis: boolean = false): M2Class[] { return plusThis ? [this, ...this.extends] : this.extends; }

  canExtend(superclass: M2Class, output: {reason: string, indirectExtendChain: IClass[]} = {reason: '', indirectExtendChain: null}): boolean {
    if (!superclass)  { output.reason = 'Invalid extend target: ' + superclass; return false; }
    if (superclass === this) { output.reason = 'Classifiers cannot extend themself.'; return false; }
    if (this.extends.indexOf(superclass) >= 0) { output.reason = 'Target class is already directly extended.'; return false; }
    if(!this.getModelRoot().isM2()) { output.reason = 'Only a M2 IClassifier can extend other IClassifiers.'; return false; }
    output.indirectExtendChain = output.indirectExtendChain || superclass.getAllSuperClasses(false);
    if (this.getAllSuperClasses(false).indexOf(superclass) >= 0) { output.reason = 'Target class is already indirectly extended.'; return false; }
    if (output.indirectExtendChain.indexOf(this) >= 0) { output.reason = 'Cannot set this extend, it would cause a inheritance loop.'; return false; }
    // ora verifico se causa delle violazioni di override (attibuti omonimi string e boolean non possono overridarsi)
    let i: number;
    let j: number;
    let childrens: EOperation[] = [...this.getBasicOperations()];
    let superchildrens: EOperation[] = [...superclass.getBasicOperations()];
    for (i = 0; i < childrens.length; i++) {
      let op: EOperation = childrens[i];
      for (j = 0; j < superchildrens.length; j++){
        let superchildren: EOperation = superchildrens[j];
        if (op.name !== superchildren.name) continue;
        if (op.canOverride(superchildren) || op.canPolymorph(superchildren)) continue;
        output.reason = 'Marked homonymous operations cannot override nor polymorph each others.';
        setTimeout( () => {
          op.mark(true, superchildren, 'override');
          setTimeout( () => { op.mark(false, superchildren, 'override'); }, 3000);
        }, 1);
        return false;
      }
    }
    return true; }

  isExtending(superclass: M2Class, orEqual: boolean = true): boolean {
    if (!superclass) return false;
    const extendss: M2Class[] = this.getAllSuperClasses(orEqual);
    let i: number;
    for (i = 0; i < extendss.length; i++) {
      if (superclass === extendss[i]) { return true; }
    }
    return false; }

  setExtends(superclass: M2Class, refreshGUI: boolean = true, force: boolean = false): boolean {
    let out: {reason: string, indirectExtendChain: IClass[]} = {reason: '', indirectExtendChain: null};
    if (!this.canExtend(superclass, out)) {
      U.pw(true, out.reason);
      if (!force) return false; }
    this.extends.push(superclass);
    U.ArrayAdd(superclass.gotExtendedBy, this);
    let i: number;
    if (this instanceof M2Class) for (i = 0; i < this.instances.length; i++) { (this).instances[i].changeMetaParent(this, true, true); }
    if (refreshGUI) this.refreshGUI_Alone();
    const extendChildrens: IClass[] = this.getAllSuperClasses(true);

    console.log('calculateViolationsExtend childrens:'  + extendChildrens, this);
    if (refreshGUI) for (i = 0; i < extendChildrens.length; i++) {
      let extChild: IClass = extendChildrens[i];
      console.log('calculateViolationsExtend');
      extChild.checkViolations(false);
    }
    // if (this.vertex) this.vertex.owner.propertyBar.refreshGUI();
    // if (this.vertex) this.vertex.owner.propertyBar.show(this,null, true, true);
    return true; }

  unsetExtends(superclass: M2Class, removeEdge: boolean = true): void {
    if (!superclass) return;
    console.log('UnsetExtend:', this, this.name);
    U.pe(!this.getModelRoot().isM2(), 'Only m2 IClassifier can un-extend other IClassifiers.');
    let index: number = this.extends.indexOf(superclass);
    if (index < 0) return;
    let i: number;
    this.extends.splice(index, 1);
    U.arrayRemoveAll(superclass.gotExtendedBy, this);
    this.refreshGUI_Alone();
    if (this instanceof M2Class) {
      for (i = 0; i < this.instances.length; i++) { (this).instances[i].doUnsetExtends(superclass as M2Class); }
      if (removeEdge) for (i = 0; i < this.extendEdges.length; i++) {
        let extedge: ExtEdge = this.extendEdges[i];
        if (extedge.end.logic() == superclass) { extedge.remove(); }
      }
    }
    const extendChildrens: IClass[] = this.getAllSubClasses(true);
    for (i = -1; i < extendChildrens.length; i++) {
      let extChild: IClass = i === -1 ? this : extendChildrens[i];
      extChild.checkViolations(true); }
  }

  calculateInheritanceViolations(toAllChain: boolean = false): void {
    if (!Status.status.loadedGUI) return;
    let i: number;
    let j: number;
    if (toAllChain) {
      let classes: IClass[] = [this];
      U.ArrayMerge(classes, this.getAllSubClasses(false));
      U.ArrayMerge(classes, this.getAllSuperClasses(false));
      for (i = 0; i < classes.length; i++) {
        classes[i].checkViolations(false);
      }
    }
    let operations: EOperation[] = [...this.getAllOperations()];

    console.log('3x operation: ', this, operations);
    for (j = 0; j < operations.length; j++) {
      let op1: EOperation = operations[j];
      op1.unmarkAllIncompatibility();
      for (i = 0; i < operations.length; i++) {
        let op2: EOperation = operations[i];
        let ret = op1.isCompatible(op2, true);
        console.log('3x operation[' + j + '] = ', ret, op1.name, op2.name, op1, op2, this, operations);

      }
    }
  }

  getTypeConversionScores(allowSuperClass: boolean = true, allowSubClass: boolean = true): {class: M2Class, features: number, operations: number, annotations: number}[]{
    const map: Dictionary<string, M2Class> = {};
    const ret: {class: M2Class, features: number, operations: number, annotations: number}[] = [];
    const sortingFunction =
      (e1: {class: M2Class, features: number, operations: number, annotations: number}, e2: {class: M2Class, features: number, operations: number, annotations: number}
      ): number => {
      let s1: string = (e1 as any).order;//  (e1.features + "." + e1.operations + "." + e1.annotations).replace("-", "Z");
      let s2: string = (e2 as any).order;// (e2.features + "." + e2.operations + "." + e2.annotations).replace("-", "Z");
      return s1.localeCompare(s2);
      /*
        // confronto feature number
        if (e1.features !== e2.features) {
          if (e1.features < 0) return e1.features + e2.features;// -1 + -5 = -6 (e1 prima di e2),  -1 + -5 = +4 (e1 dopo e2)
          else return e1.features - e2.features;// +1 - -5 = +6 (e1 dopo di e2),  +1 - 5 = -4 (e1 prima di e2)
        }
        // confronto operations number
        if (e1.operations !== e2.operations) {
          if (e1.operations < 0) return e1.operations + e2.operations;
          else return e1.operations - e2.operations;
        }
        // confronto annotations number
        if (e1.annotations !== e2.annotations) {
          if (e1.annotations < 0) return e1.annotations + e2.annotations;
          else return e1.annotations - e2.annotations;
        }
        return 0;*/
      };
    let candidateClasses = [];
    if (allowSuperClass) U.ArrayMerge(candidateClasses, this.getAllSuperClasses(false));
    if (allowSubClass) U.ArrayMerge(candidateClasses, this.getAllSubClasses(false));
    candidateClasses = candidateClasses.filter((c)=> !c.getInterface() && !c.getAbstract());
    const myFeatures = this.getAllChildrens(false, false);
    const myOperations = this.getAllChildrens(true, false, false, false);
    const myAnnotations = this.getAllChildrens(false, true, false, false);
    for (let i = 0; i < candidateClasses.length ; i++) {
      const candidate: M2Class = candidateClasses[i];
      let featureAdd: number = candidate.getAllChildrens(false, false).length - myFeatures.length;
      let operationsAdd: number = candidate.getAllChildrens(
        true, false, false, false).length - myOperations.length;
      let annotationsAdd: number = candidate.getAllChildrens(
        false, true, false, false).length - myAnnotations.length;
      let elem = {class: candidate, features: featureAdd, operations: operationsAdd, annotations: annotationsAdd};
      ret.push(elem);
      const order: string = (featureAdd + "." + operationsAdd + "." + annotationsAdd).replace("-", "Z");
      (elem as any).order = order;
      // if (map[order]) continue;
      // map[order] = candidate;
    }
    // let lowestKey: string = Object.keys(map).sort()[0];
    // return map[lowestKey];
    return ret.sort(sortingFunction);
  }


  // getDisplayedChildrens(): Set<EOperation | M2Feature> { return this.getBasicChildrens(); }
  //getBasicChildrens(): Set<M2Feature | EOperation> { return super.getBasicChildrens() as Set<M2Feature | EOperation>; }
  // getAllChildrens(): (M2Feature | EOperation)[] { return super.getAllChildrens() as (M2Feature | EOperation)[]; }

  getAllChildrens(includeOperations: boolean = true,
                  includeAnnotations: boolean = true, includeAttributes: boolean = true, includeReferences: boolean = true,
                  /*null = both shadow and unshadow, true = onlyshadowed*/ includeShadowed: boolean | null = true): Typedd[] {
    //todo: actually since getAllExtends returns an array made from a set, and a class cannot contain duplicates, it cannot contain duplicates.
    // sets here are redundant.
    const extendchain: M2Class[] = this.getAllSuperClasses(true);// this.getAllExtends(true);
    let i: number;
    const ret: Typedd[] = [];
    // features and operations can share names
    // features with same name on different classes will just shadow each other without overriding
    // override solo se signature identica.
    // se signature identica e return primitivo diverso: invalido.
    // se signature identica e return Object più specifico: valido.
    for (i = 0; i < extendchain.length; i++) {
      ret.push(...extendchain[i].getBasicChildrens(includeOperations, includeAnnotations, includeAttributes, includeReferences, includeShadowed));
    }
    return ret; }

  getAllAttributes(): Set<M2Attribute> {
    return new Set<M2Attribute> (this.getAllChildrens(false, false, true, false) as M2Attribute[]); }
  getAllReferences(): Set<M2Reference> {
    return new Set<M2Reference> (this.getAllChildrens(false, false, false, true) as M2Reference[]); }


  getBasicAttributes(): Set<M2Attribute> { return new Set(this.attributes); }
  getBasicReferences(): Set<M2Reference> { return new Set(this.references); }
  getBasicOperations(): Set<EOperation> { return new Set(this.operations); }
  getBasicAnnotations(): EAnnotation[] { return (this.annotations); }

  getModelRoot(): MetaModel { return super.getModelRoot() as MetaModel; }

  getNamespaced(): string {
    const str: string = this.getModelRoot().namespace();
    if (this instanceof Model) { return str; }
    return str + ':' + this.name; }

  parse(json: Json, destructive: boolean, allowWarning: boolean = true) {
//     console.log('M2Class.parse(); json:', json, '; metaVersion: ', this.metaParent, 'this:', this);
    /// own attributes.
    this.extendEdges = [];
    this.setName(Json.read<string>(json, ECoreClass.namee, 'Class_1'), false, allowWarning);
    let key: string;
    for (key in json) {
      switch (key) {
      default: U.pw(true, 'unexpected field in M2Class.parse() |' + key + '|', json); break;
      case ECoreClass.instanceTypeName:
      case ECoreClass.eSuperTypes:
      case ECoreClass.xsitype:
      case ECoreClass.eOperations:
      case ECoreClass.eStructuralFeatures:
      case ECoreClass.abstract:
      case ECoreClass.interface:
      case ECoreClass.namee: break; } }
    this.instanceTypeName = Json.read<string>(json, ECoreClass.instanceTypeName, '');
    this.isInterface = Json.read<string>(json, ECoreClass.interface, 'false') === 'true';
    this.isAbstract = Json.read<string>(json, ECoreClass.abstract, 'false') === 'true';
    let tmps: string = Json.read<string>(json, ECoreClass.eSuperTypes, null);
    this.extendsStr = tmps ? tmps.split(' ') : [];
    // U.pe(true, 'extendsStr:', this.extendsStr, 'tmps', tmps, 'typeof tmps:' + typeof(tmps), 'json:', json);
    /*this.name = Json.read<string>(this.json, ECoreClass.name);
    this.fullname = this.midname = this.parent.fullname + '.' + this.name;*/
    /// childrens
    const features: Json[] = Json.getChildrens(json);
    const functions: Json[] = Json.getChildrens(json, false, true);
    let i: number;
    let newFeature: M2Feature;
    const oldChildrens: Array<M2Feature | EOperation> = this.childrens;
    // let metaParent: M3Feature;
    if (destructive) { this.childrens = []; this.attributes = []; this.references = []; this.operations = []; }
    for (i = 0; i < features.length; i++) {
      // console.log('reading class children[' + i + '/' + childs.length + '] of: ', childs, 'of', json);
      const child: Json = features[i];
      const xsiType = Json.read<string>(child, ECoreAttribute.xsitype);
      U.pe(!destructive, 'Non-destructive class parse: to do');
      switch (xsiType) {
        default: U.pe(true, 'unexpected xsi:type: ', xsiType, ' in feature:', child); break;
        case 'ecore:EAttribute':
          // metaParent = oldChildrens[i] && oldChildrens[i].metaParent ? oldChildrens[i].metaParent : U.findMetaParentA(this, child);
          newFeature = new M2Attribute(this, child);
          U.ArrayAdd(this.attributes, newFeature); break;
        case 'ecore:EReference':
          const metaRef: M3Reference = null;
          // metaParent = oldChildrens[i] && oldChildrens[i].metaParent ? oldChildrens[i].metaParent : U.findMetaParentA(this, child);
          newFeature = new M2Reference(this, child);
          U.ArrayAdd(this.references, newFeature); break;
      }
      U.ArrayAdd(this.childrens, newFeature);
    }
    for (i = 0; i < functions.length; i++) {
      const newFunction: EOperation = new EOperation(this, functions[i]);
      U.ArrayAdd(this.operations, newFunction);
      U.ArrayAdd(this.childrens, newFunction);
    }
  }

  generateModel(loopDetectionObj: Dictionary<number /*MP id*/, ModelPiece> = null): Json {
    const featurearr: Json[] = [];
    const operationsarr: Json[] = [];
    const model: Json = {};
    let supertypesstr = '';
    const key: any = U.getStartSeparatorKey();
    let i: number;
    for (i = 0; i < this.extends.length; i++) { supertypesstr += U.startSeparator(key, ' ') + this.extends[i].getEcoreTypeName(); }
    for (i = 0; i < this.attributes.length; i++) { featurearr.push(this.attributes[i].generateModel(loopDetectionObj)); }
    for (i = 0; i < this.references.length; i++) { featurearr.push(this.references[i].generateModel(loopDetectionObj)); }
    for (i = 0; i < this.operations.length; i++) { operationsarr.push(this.operations[i].generateModel(loopDetectionObj)); }

    model[ECoreClass.xsitype] = 'ecore:EClass';
    model[ECoreClass.namee] = this.name;
    model[ECoreClass.interface] = U.toBoolString(this.isInterface);
    model[ECoreClass.abstract] = U.toBoolString(this.isAbstract);
    model[ECoreClass.instanceTypeName] = this.instanceTypeName;
    model[ECoreClass.eSuperTypes] = supertypesstr;
    model[ECoreClass.eStructuralFeatures] = featurearr;
    model[ECoreClass.eOperations] = operationsarr;
    return model; }


  addOperation(): EOperation {
    const op: EOperation = new EOperation(this, null);
    let i: number;
    for (i = 0; i < this.instances.length; i++){
      const inst: MClass = this.instances[0];
    }
    this.refreshInstancesGUI();
    this.refreshGUI();
    return op; }

  addReference(): M2Reference {
    const ref: M2Reference = new M2Reference(this, null);
    ref.type.changeType(null, null, this);
    ref.generateEdges();
    let i: number;
    for (i = 0; i < this.instances.length; i++){
      const inst: MClass = this.instances[i];
      new MReference(inst, null, ref); }
    this.refreshInstancesGUI();
    this.refreshGUI();
    // M2Class.updateAllMMClassSelectors(ref.getHtml());
    return ref; }

  addAttribute(): M2Attribute {
    console.log('addAttribute: pre', this);
    const attr: M2Attribute = new M2Attribute(this, null);
    let i: number;
    for (i = 0; i < this.instances.length; i++){
      const inst: MClass = this.instances[i];
      new MAttribute(inst, null, attr); }
    this.refreshInstancesGUI();
    this.refreshGUI();
    return attr; }

  fieldChanged(e: JQuery.ChangeEvent): void {
    const html: HTMLElement = e.currentTarget;
    if (html.classList.contains('AddFieldSelect')) return;
    switch (html.tagName.toLowerCase()) {
    case 'select':
    default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
    case 'textarea':
    case 'input':
      const input = html as HTMLInputElement;
      input.value = this.setName((input as HTMLInputElement).value); break;
    }
  }

  /*
    setName(name: string, refreshGUI: boolean = true): void {
      super.setName(name, refreshGUI);
      return;
      this.midname = this.parent.name + '.' + this.name;
      this.fullname = this.midname;
      let i;
      for (i = 0; i < this.childrens.length; i++) {
        this.childrens[i].setName(this.childrens[i].name, false && refreshGUI); // per aggiornare il fullname.
      }
      if (refreshGUI) { this.refreshGUI(); M2Class.updateAllMMClassSelectors(); }
  }*/

  duplicate(nameAppend: string = '_Copy', newParent: M2Package = null): M2Class {
    const c: M2Class = new M2Class(null, null);
    c.copy(this);
    Type.updateTypeSelectors(null, false, false, true);
    c.refreshGUI();
    return c; }
/*
  getExtendedClassArray(levelDeep: number = Number.POSITIVE_INFINITY, out: M2Class[] = []): M2Class[] {
    let i: number;
    for (i = 0; i < this.extends.length; i++ ) {
      const curr: M2Class = this.extends[i];
      U.ArrayAdd(out, curr);
      if (levelDeep > 0) { curr.getExtendedClassArray(levelDeep--, out); }
    }
    return out; }*/

  // linkToMetaParent(meta: M3Class): void { return super.linkToMetaParent(meta); }
  getReferencePointingHere(): M2Reference[] { return super.getReferencePointingHere() as M2Reference[]; }
  getAttribute(name: string, caseSensitive: boolean = false): M2Attribute { return super.getAttribute(name, caseSensitive) as M2Attribute; }
  getReference(name: string, caseSensitive: boolean = false): M2Reference { return super.getReference(name, caseSensitive) as M2Reference; }
/*
  isExtending(subclass: M2Class): boolean {
    if (!subclass) return false;
    const extendedTargetClasses: M2Class[] = subclass.getExtendedClassArray();
    let i: number;
    for (i = 0; i < extendedTargetClasses.length; i++) {
      if (this === extendedTargetClasses[i]) { return true; }
    }
    return false;
  }*/
  delete(refreshgui: boolean = true): void{
    const scores = this.getTypeConversionScores(true, true);
    const newType: M2Class = scores.length > 0 && scores[0].class;
    if (newType) this.convertInstancesTo(newType);
    this.forceChangeType(newType);
    super.delete(false); // will remove remaining unconverted instances
    Status.status.mm.refreshGUI();
    Status.status.mm.refreshInstancesGUI();
    Type.updateTypeSelectors(null, false, false, true);
}

  private forceChangeType(newType: M2Class = null): void {
    let i: number;
    let typeds: Typedd[] = Type.getAllWithClassType(this);
    // NB: esistono ancora m1-object che puntano a m1-object istanze di questo oggetto, perchè le istanze vengono cancellate in super.delete() (MP level)
    // e quando cancelli il vertice di una istanza a catena cancelli prima gli edge e quindi resetti le references attive,
    // però il tipo puntato rimarrebbe a questa classe.
    const newTypeStr = newType && newType.getEcoreTypeName() || AttribETypes.EString;
    for (i = 0; i < typeds.length; i++) {
      let typed: Typedd = typeds[i];
      typed.setType(newTypeStr);
    }
    typeds = Type.getAllWithClassType(this);
    console.log('wew', "failed to change all types:", typeds, this,
      Type.all.map((t)=> t.printablename +'_' + (t.classType && t.classType.getEcoreTypeName())),
      Type.all.filter((t)=> (t.classType && t.classType.getEcoreTypeName() === this.getEcoreTypeName())));
    U.pe(!!typeds.length, "failed to change all types:", typeds, this);
  }

  static updateSuperClasses() {
    const dictionary: Dictionary<string, M2Class> = Status.status.mm.getEcoreStr_Class_Dictionary();
    const classes: M2Class[] = Status.status.mm.getAllClasses();
    let j: number;
    let i: number;
    for (i = 0; i < classes.length; i++) {
      const classe: M2Class = classes[i];
      for (j = 0; j < classe.extendsStr.length; j++) {
        const target: M2Class = dictionary[classe.extendsStr[j]];
        U.pe(!target, 'e1, failed to find extended class.extendsStr[' + j + ']:', classe.extendsStr[j], 'in classList:', classes,
          'classe to extend:', classe, 'dictionary:', dictionary);
        classe.setExtends(target, false, true);
      }
      classe.extendsStr = [];
    }
  }
  /*
  public extendClass(targetstr: string, target: M2Class): void {
    if (!target) target = this.getModelRoot().getClassFromEcoreStr(targetstr);
    U.pe(!target, 'e2, failed to find extended class:', targetstr, 'in classList:', Status.status.mm.getAllClasses(), 'this:', this);
    U.ArrayAdd(this.extends, target);
  }
  public unextendClass(targetstr: string, target: M2Class): void {
    if (!target) target = this.getModelRoot().getClassFromEcoreStr(targetstr);
    U.pe(!target, 'e3, failed to find extended class:', targetstr, 'in classList:', Status.status.mm.getAllClasses(), 'this:', this);
    U.arrayRemoveAll(this.extends, target);
  }*/

  makeExtendEdge(target: M2Class): ExtEdge {
    const ret: ExtEdge = new ExtEdge(this, this.getVertex(), target.getVertex(), null);
    this.extendEdges.push(ret);
    return ret; }

  getAbstract(): boolean { return this.isAbstract; }
  getInterface(): boolean { return this.isInterface; }



  public canBeInterface(value: boolean, outputReason: { text: string }): boolean{
    let i: number;
    if (!value) {
      const subclasses: M2Class[] = this.getAllSubClasses(false);
      for (i = 0; i < subclasses.length; i++) {
        const ext: M2Class = subclasses[i] as M2Class;
        if (ext.getInterface()) {
          // no interfacce sotto questa classe
          if (outputReason) outputReason.text = '"' + this.name + '" cannot cease to be an interface because it is extended by "'
            + ext.name + '" wich is an interface.' + ' Update their relationship befor proceeding.';
          return false;
        }
      }
      return true;
    }

    if (this.instances.length) {
      if (outputReason) outputReason.text =
        'The class "' + this.name + '" have ' + this.instances.length + ' instances, convert or delete them before proceeding.';
      return false; }

    const superclasses: M2Class[] = this.getAllSuperClasses(false);
    for (i = 0; i < superclasses.length; i++) {
      const ext: M2Class = superclasses[i] as M2Class;
      if (!ext.getInterface()) {
        // no classi sopra questa interfaccia
        if (outputReason) outputReason.text = '"' + this.name + '" cannot be an interface because it cannot extend "'
          + ext.name + '" wich is a class.' + ' Update their relationship befor proceeding.';
        return false;
      }
    }
    return true;
  }

  public canBeAbstract(value: boolean, outputReason: { text: string }): boolean {
    if (!value) return true;
    if (this.instances.length) {
      if (outputReason) outputReason.text =
        'The class "' + this.name + '" have ' + this.instances.length + ' instances.\n<br>Convert or delete them by right-clicking his vertex before proceeding.';
      return false; }

    if (this.getInterface() && !this.canBeInterface(false, outputReason)) {
      if (outputReason) outputReason.text = 'Interfaces cannot be abstract.\n<br>' + outputReason.text;
      return false;
    }
    return true;
  }

  setInterface(value: boolean, canPrintError: boolean = true): void {
    if (this.isInterface === value) return;
    let reason = {text: ''};
    if (!this.canBeInterface(value, reason)) {
      // U.pw(canPrintError, reason.text);
      if (canPrintError) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid operation',
          html: reason.text
        });
      }
      return; }
    if (value) { this.setInterfaceTrue(); }
    else { this.unsetInterface(); }
  }

  private setInterfaceTrue(): void {
    this.unsetAbstract();
    this.isInterface = true; }

  private unsetInterface(): void { this.isInterface = false; }

  public setAbstract(value: boolean, canPrintError: boolean = true): void {
    if (this.isAbstract === value) return;
    let reason = {text: ''};
    if (!this.canBeAbstract(value, reason)) {
      if (canPrintError) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid operation',
          html: reason.text
        });
      }
      // U.pw(canPrintError, reason.text);
      return; }
    /*
    obj.abstractCheckbox.checked = false; // do not accept the change until conversion
    // actually do the thing transforming instances
    if (convertableChoices_AddField.length + convertableChoices_RemoveField.length === 0) {
      let options = {
          'By adding features': { },
          'By removing features': { },
        };
      for(let ii = 0; ii < convertableChoices_AddField.length; ii++) {
        options['By adding features'][convertableChoices_AddField[ii].id] = convertableChoices_AddField[ii].name;
      }
      for(let ii = 0; ii < convertableChoices_RemoveField.length; ii++) {
        options['By removing features'][convertableChoices_RemoveField[ii].id] = convertableChoices_RemoveField[ii].name;
      }
      Swal.fire({
        title: 'What about his instances?',
        html:
          "There are " + classe.instances.length + " instances of this class wich need to be converted to some other class" +
          " by adding or removing features." +
          "<br>You can convert them or undo this operation." +
          "<br><br>Convert them to:",
        icon: 'warning',
        input: 'select',
        inputOptions: options,
        inputPlaceholder: 'Convert them',
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value === '') {
              resolve()
            } else {
              resolve('You need to select a class for conversion.')
            }
          })
        }
      }).then(function (data) {
        const targetClass: M2Class = ModelPiece.getByID(+data.value) as M2Class;
        classe.setAbstract(targetClass);
        obj.abstractCheckbox.checked = true;
        Swal.fire(
          'Done',
          classe.instances.length + " instances converted.",
          'success'
        )
      });
    }
    */
    if (value) { this.setAbstractTrue(); }
    else { this.unsetAbstract(); }
  }

  public setAbstractTrue(): boolean{
    this.unsetInterface();
    return this.isAbstract = true; }

  public unsetAbstract(): boolean{
    return this.isAbstract = false; }


  /*
  public canConvertInstancesTo(classe: M2Class): boolean {
    const instances: MClass[] = this.instances;
    let i: number;
    for (i = 0; i < instances.length; i++) {
      const instance: MClass = instances[i];
      if (instance.metaParent !== this) continue;
      if (!instance.canConvertTo(classe)) return false;
    }
    return true;
  }*/
  public convertInstancesTo(classe: M2Class): void {
    let i: number;
    let convertCount = 0;
    const instances: MClass[] = U.shallowArrayCopy(this.instances);
    for (i = 0; i < instances.length; i++) {
      const instance: MClass = instances[i];
      U.pe(instance.metaParent !== this, "invalid state: mismatch on instances and metaParent:", instance, this);
      instance.convertTo(classe);
      convertCount++;
    }
    U.ps(!!convertCount, convertCount + " subclasses converted to " + classe.name);
  }
}
