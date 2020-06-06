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
  MReference,
  MClass,
  M2Class,
  EdgeStyle,
  M2Reference,
  M2Attribute,
  M3Package,
  M3Reference,
  M3Attribute,
  M3Feature,
  EdgeModes,
  EdgePointStyle, EOperation, EParameter, Typedd, Type, EEnum, WebsiteTheme, M2Feature, ExtEdge, GraphSize, EAnnotation,
} from '../common/Joiner';
import {IClassifier} from './IClassifier';
import {EdgeHeadStyle} from '../guiElements/mGraph/Edge/edgeStyle';
export abstract class ClassInheritance{
  attributes: IAttribute[];
  references: IReference[];
  operations: EOperation[];
  childrens: Typedd[];
}
export abstract class IClass extends IClassifier {
  attributes: IAttribute[];
  references: IReference[];
  operations: EOperation[];
  inherited: ClassInheritance[];
  metaParent: IClass;
  instances: IClass[];
  referencesIN: IReference[] = []; // external pointers to this class.
  shouldBeDisplayedAsEdgeVar: boolean = false && false;

  extends: IClass[] = [];
  gotExtendedBy: IClass[] = [];

  edges: IEdge[] = [];
  edgeStyleCommon: EdgeStyle;
  edgeStyleHighlight: EdgeStyle;
  edgeStyleSelected: EdgeStyle;

  getReferences(personal: boolean = true, inherited: boolean = true) {
    let refs: IReference[] = this.references;
  }

  protected constructor(parent: IPackage, meta: IClass) {
    super(parent, meta);
    if (this.parent) { U.ArrayAdd(this.parent.classes, this); }
    // let selectedcolor: string = 'var(--'; todo, ma crea problemi con l'input type color
    let html: HTMLButtonElement;
    let complementaHex = (hexstr: string): string => { return '#' + U.toHex(16777215 - (U.hexToNum(hexstr)), 6); }
    let i: number;

    this.edgeStyleCommon = new EdgeStyle(EdgeModes.straight, 2, '#7f7f7f',
      new EdgePointStyle(5, 2, '#ffffff', '#000000'),
      new EdgeHeadStyle(20, 20, '#7f7f7f', '#7f7f7f'));
    this.edgeStyleHighlight = new EdgeStyle(EdgeModes.straight, 2, '#ffffff',
      new EdgePointStyle(5, 2, '#ffffff', '#0077ff'),
      new EdgeHeadStyle(20, 20, '#ffffff', '#ffffff'));
    this.edgeStyleSelected = new EdgeStyle(EdgeModes.straight, 4, '#ffffff',
      new EdgePointStyle(5, 2, '#ffffff', '#ff0000'),
      new EdgeHeadStyle(25, 25, '#ffffff', '#ffffff'));

    switch (WebsiteTheme.get()) {
      default: U.pe(true, 'unexpected website theme: |' + WebsiteTheme.get() + '|' + WebsiteTheme.Light + '|'); break;
      case WebsiteTheme.Dark: break;
      case WebsiteTheme.Light:
        let edgeStyles: EdgeStyle[] = [this.edgeStyleCommon, this.edgeStyleHighlight, this.edgeStyleSelected];
        for (i = 0; i < edgeStyles.length; i++) {
          let style: EdgeStyle = edgeStyles[i];
          style.color = complementaHex(style.color);
          style.edgePointStyle.fillColor = complementaHex(style.edgePointStyle.fillColor);
          style.edgePointStyle.strokeColor = complementaHex(style.edgePointStyle.strokeColor);
          style.edgeHeadStyle.fill = complementaHex(style.edgeHeadStyle.fill);
          style.edgeHeadStyle.stroke = complementaHex(style.edgeHeadStyle.stroke); }
        break;
    }
  }

  getChildrenAttribute(index: number): IAttribute { return [...this.getAllAttributes()][index]; }
  getChildrenReference(index: number): IReference { return [...this.getAllReferences()][index]; }
  getChildrenOperation(index: number): EOperation { return [...this.getAllOperations()][index]; }
  getChildrenAttributeSelector(index: number): string { return this.getChildrenAttribute(index).getSelector(); }
  getChildrenReferenceSelector(index: number): string { return this.getChildrenReference(index).getSelector(); }
  getChildrenOperationSelector(index: number): string { return this.getChildrenOperation(index).getSelector(); }

  fullname(): string { return this.parent.name + '.' + this.name; }

  generateEdge(): IEdge[] { U.pe(true, 'IClass.generateEdge() todo.'); return null; }

  canBeLinkedTo(target: IClass): boolean {
    if (!this.shouldBeDisplayedAsEdge()) { return false; }
    return false; }

  getEdges(): IEdge[] { return this.edges; }

  delete(refreshgui: boolean = true): void {
    const oldparent = this.parent;
    super.delete(false);
    if (oldparent) U.arrayRemoveAll(oldparent.classes, this);
    // todo: che fare con le reference a quella classe? per ora cancello i campi.
    const pointers: IReference[] = this.getReferencePointingHere();
    let i;
    for (i = 0; i < pointers.length; i++) { pointers[i].delete(); }
    if (this.shouldBeDisplayedAsEdge()) {
      const edges: IEdge[] = U.ArrayCopy(this.getEdges(), false);
      for (i = 0; i < edges.length; i++) { edges[i].remove(); }
    }
    Type.updateTypeSelectors(null, false, false, true);
    if (refreshgui) this.refreshGUI();
  }

  refreshGUI_Alone(debug?: boolean): void {
    if (!Status.status.loadedLogic) { return; }
    if (this.shouldBeDisplayedAsEdge()) {
      if (this.vertex) { this.vertex.remove(); this.vertex = null; }
      const edges: IEdge[] = this.getEdges();
      let i: number;
      for (i = 0; i < edges.length; i++) { edges[i].refreshGui(debug); }
      return; }
  super.refreshGUI_Alone(); }

  getReferencePointingHere(): IReference[] { return this.referencesIN; }

  getAttribute(name: string, caseSensitive: boolean = false): IAttribute {
    let i: number;
    if (!caseSensitive) { name = name.toLowerCase(); }
    let attributes: IAttribute[] = [...this.getAllAttributes()];
    for (i = 0; i < attributes.length; i++) {
      const s: string = attributes[i].name;
      if ((caseSensitive ? s : s.toLowerCase()) === name) { return attributes[i]; } }
    return null; }

  getReference(name: string, caseSensitive: boolean = false): IReference {
    let i: number;
    if (!caseSensitive) { name = name.toLowerCase(); }
    let references: IReference[] = [...this.getAllReferences()];
    for (i = 0; i < references.length; i++) {
      const s1: string = references[i].name;
      console.log('find IReference[' + s1 + '] =?= ' + name + ' ? ' + (caseSensitive ? s1 : s1 && s1.toLowerCase()) === name);
      if ((caseSensitive ? s1 : s1 && s1.toLowerCase()) === name) { return references[i]; } }
    return null; }

  getOperations(name: string, caseSensitive: boolean = true): EOperation[] {
    let i: number;
    if (!caseSensitive) { name = name.toLowerCase(); }
    let ret: EOperation[] = [];
    let operations: EOperation[] = [...this.getAllOperations()];
    for (i = 0; i < operations.length; i++) {
      const s1: string = operations[i].name;
      console.log('find EOperation[' + s1 + '] =?= ' + name + ' ? ' + (caseSensitive ? s1 : s1 && s1.toLowerCase()) === name);
      if ((caseSensitive ? s1 : s1 && s1.toLowerCase()) === name) { ret.push(operations[i]); } }
    return ret; }

  mark(markb: boolean, paired: ModelPiece, key: string, color: string = null, radiusX: number = 10, radiusY: number = 10,
       width: number = 5, backColor: string = 'transparent', extraOffset: GraphSize = null): void {
    const vertex: IVertex = this.getVertex();
    // const edge: IEdge[] = (this as any as IReference | IClass).getEdges();
    if (vertex && vertex.isDrawn()) { vertex.mark(markb, key, color, radiusX, radiusY, width, backColor, extraOffset); }
    let edges: IEdge[] = null;
    if (this instanceof IClass && this.shouldBeDisplayedAsEdge()) { edges = (this as IClass).getEdges(); }
    if (this instanceof IReference) { edges = (this as IReference).getEdges(); }
    let i: number;
    for (i = 0; edges && i < edges.length; i++) { edges[i].mark(markb, key, color); }
  }
  /*generateEdge(): IEdge[] {

    const e: IEdge = null;
    U.pw(true, 'Class.generateEdge(): todo');
    // todo check questa funzione e pure il shouldbedisplayedasedge
    this.edges = [e];
    return this.edges; }*/

  copy(other: this, nameAppend: string = '_Copy', newParent: IClass = null): void {
    super.copy(other, nameAppend, newParent);
    this.attributes = [];
    this.references = [];
    this.edges = [];
    this.edgeStyleCommon = other.edgeStyleCommon.clone();
    this.edgeStyleHighlight = other.edgeStyleHighlight.clone();
    this.edgeStyleSelected = other.edgeStyleSelected.clone();
    let i: number;
    for ( i = 0; i < this.childrens.length; i++) {
      const child: Typedd = this.childrens[i];
      if (child instanceof IReference) { this.references.push(child); continue; }
      if (child instanceof IAttribute) { this.attributes.push(child); continue; }
      U.pe(true, 'found class.children not reference neither attribute: ', child);
    }
  }

  /*getEdge(): IEdge[] {
    U.pe(!this.shouldBeDisplayedAsEdge(), 'err');
    if (!this.edges) { this.generateEdge(); }
    return this.edges; }*/

  /*linkToMetaParent(meta: IClass): void {
    U.pe(true, 'linkToMetaParent: todo.');
    const outObj: any = {};
    const comformability: number = this.conformability(meta, outObj);
    if (comformability !== 1) {
      U.pw(true, 'm2Class: ' + this.name + ' not fully conform to ' + meta.name + '. Conformability: = ' + comformability * 100 + '%' );
      return; }
    this.metaParent = meta;
    let i: number;
    const refPermutation: number[] = outObj.refPermutation;
    const attrPermutation: number[] = outObj.attrPermutation;
    i = -1;
    while (++i < attrPermutation.length) { this.attributes[i].linkToMetaParent(meta.attributes[attrPermutation[i]]); }
    i = -1;
    while (++i < refPermutation.length) { this.references[i].linkToMetaParent(meta.references[refPermutation[i]]); }
  }*/

  /*conformability(meta: IClass, outObj: any = null/*.refPermutation, .attrPermutation* /, debug: boolean = true): number {
    if (this.attributes > meta.attributes) { return 0; }
    if (this.references > meta.references) { return 0; }
    const refLenArray: number[] = [];
    let i;
    let j;
    // find best references permutation compabilityF
    i = -1;
    while (++i < meta.references.length) { refLenArray.push(i); }
    const refPermut: number[][] = U.permute(refLenArray);
    // console.log('possible class.references permutations[' + meta.references.length + '!]:', refLenArray, ' => ', refPermut);
    const allRefPermutationConformability: number[] = [];
    i = -1;
    let bestRefPermutation: number[] = null;
    let bestRefPermutationValue = -1;
    while (++i < refPermut.length) {
      j = -1;
      const permutation = refPermut[i];
      let permutationComformability = 0;
      while (++j < permutation.length) {
        const Mref: IReference = this.references[j];
        const MMref: IReference = meta.references[permutation[j]];
        const refComf = !Mref ? 0 : Mref.conformability(MMref, debug);
        console.log('ref: permutationComformability:', permutationComformability, ' + ' + refComf + ' / ' + permutation.length,
          '-->', permutationComformability + refComf / permutation.length);
        permutationComformability += refComf / permutation.length; }

      allRefPermutationConformability.push(permutationComformability);
      if (permutationComformability > bestRefPermutationValue) {
        bestRefPermutation = permutation;
        bestRefPermutationValue = permutationComformability; }
      if (permutationComformability === 1) { break; }
    }

    // find best attributes permutation compability
    const attLenArray: number[] = [];
    i = -1;
    while (++i < meta.attributes.length) { attLenArray.push(i); }
    const attPermut: number[][] = U.permute(attLenArray, debug);
    // console.log('possible class.attributes permutations[' + meta.attributes.length + '!]:', attLenArray, ' => ', attPermut);
    const allAttPermutationConformability: number[] = [];
    i = -1;
    let bestAttPermutation: number[] = null;
    let bestAttPermutationValue = -1;
    while (++i < attPermut.length) {
      j = -1;
      const permutation = attPermut[i];
      let permutationComformability = 0;
      while (++j < permutation.length) {
        const M2att: IAttribute = this.attributes[j];
        const M3att: IAttribute = meta.attributes[permutation[j]];
        const attComf = !M2att ? 0 : M2att.conformability(M3att, debug);
        console.log('attr: permutationComformability:', permutationComformability, ' + ' + attComf + ' / ' + permutation.length,
          '-->', permutationComformability + attComf / permutation.length);
        permutationComformability += attComf / permutation.length; }

      allAttPermutationConformability.push(permutationComformability);
      if (permutationComformability > bestRefPermutationValue) {
        bestAttPermutation = permutation;
        bestAttPermutationValue = permutationComformability; }
      if (permutationComformability === 1) { break; }
    }

    const total = meta.childrens.length + 1; // + name
    const nameComformability = StringSimilarity.compareTwoStrings(this.name, meta.name) / total;
    bestAttPermutationValue = Math.max(0, bestAttPermutationValue * (meta.attributes.length / total));
    bestRefPermutationValue = Math.max(0, bestRefPermutationValue * (meta.references.length / total));
    if (outObj) {
      outObj.refPermutation = bestRefPermutation;
      outObj.attrPermutation = bestAttPermutation; }

    const ret = nameComformability + bestAttPermutationValue + bestRefPermutationValue;
    U.pif(debug, 'M2CLASS.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', ret,
      ' = ', nameComformability + ' + ' + bestAttPermutationValue + ' + ', bestRefPermutationValue);
    return ret; }*/
  // todo: typescript proposal: insert type "this.field[]" così posso specificare il tipo di ritorno della funzione uguale a quello di quel campo.

  getAllSuperClasses(plusThis: boolean = false): IClass[] {
    // :this sembra buggato come parametro input: se gli passo un parametro stesso tipo mi da comunque errore, ma accetta letteralmente "this"...
    let i: number;
    const set: Set<IClass> = plusThis ? new Set<IClass>([this as any]) : new Set();
    for (i = 0; i < this.extends.length; i++) {
      U.SetMerge(true, set, this.extends[i].getAllSuperClasses(true)); }
    return [...set]; }

  getAllSubClasses(plusThis: boolean = false): IClass[] {
    let i: number;
    const set: Set<IClass> = plusThis ? new Set<IClass>([this as any]) : new Set();
    for (i = 0; i < this.gotExtendedBy.length; i++) {
      U.SetMerge(true, set, this.gotExtendedBy[i].getAllSubClasses(true)); }
    return [...set]; }

  getBasicExtends(plusThis: boolean = false): IClass[] { return plusThis ? [this, ...this.extends] : this.extends; }

  canExtend(superclass: IClass, output: {reason: string, indirectExtendChain: IClass[]} = {reason: '', indirectExtendChain: null}): boolean {
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
          setTimeout( () => { op.mark(false, superchildren, 'override'); }, 1000);
          }, Status.status.loadedGUI ? 0 : 2);
        return false;
      }
    }
    return true; }

  isExtending(superclass: M2Class, orEqual: boolean = true): boolean {
    if (!superclass) return false;
    const extendss: IClass[] = this.getAllSuperClasses(orEqual);
    let i: number;
    for (i = 0; i < extendss.length; i++) {
      if (superclass === extendss[i]) { return true; }
    }
    return false; }

  setExtends(superclass: IClass, refreshGUI: boolean = true, force: boolean = false): boolean {
    let out: {reason: string, indirectExtendChain: IClass[]} = {reason: '', indirectExtendChain: null};
    if (!this.canExtend(superclass, out)) {
      U.pw(true, out.reason);
      if (!force) return false; }
    this.extends.push(superclass);
    U.ArrayAdd(superclass.gotExtendedBy, this);
    let i: number;
    if (this instanceof M2Class) for (i = 0; i < this.instances.length; i++) { (this).instances[i].setExtends(superclass as M2Class); }
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

  unsetExtends(superclass: IClass, removeEdge: boolean = true): void {
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
      for (i = 0; i < this.instances.length; i++) { (this).instances[i].unsetExtends(superclass as M2Class); }
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

  getAllChildrens(includeOperations: boolean = true,
                  includeAnnotations: boolean = true, includeAttributes: boolean = true, includeReferences: boolean = true, includeShadowed: boolean = true): Typedd[] {
    //todo: actually since getAllExtends returns an array made from a set, and a class cannot contain duplicates, it cannot contain duplicates. sets here are redundant.
    const extendchain: IClass[] = this.getBasicExtends(true);// this.getAllExtends(true);
    let i: number;
    let j: number;
    const ret: Typedd[] = [];
    const features: Map<string, Typedd> = new Map();
    const operations: Map<string, Typedd> = new Map();
    // features and operations can share names
    // features with same name on different classes will just shadow each other without overriding
    // override solo se signature identica.
    // se signature identica e return primitivo diverso: invalido.
    // se signature identica e return Object più specifico: valido.
    for (i = 0; i < extendchain.length; i++) {
      ret.push(...extendchain[i].getBasicChildrens(includeOperations, includeAnnotations, includeAttributes, includeReferences, includeShadowed));
    }
    return ret; }

  getAllAttributes(): Set<IAttribute> {
    const extendchain: IClass[] = this.getAllSuperClasses(true);
    let i: number;
    const ret: Set<IAttribute> = new Set<IAttribute>();
    for (i = 0; i < extendchain.length; i++) {
      U.SetMerge(true, ret, extendchain[i].getBasicAttributes()); }
    return ret; }
  getAllReferences(): Set<IReference> {
    const extendchain: IClass[] = this.getAllSuperClasses(true);
    let i: number;
    const ret: Set<IReference> = new Set<IReference>();
    for (i = 0; i < extendchain.length; i++) {
      U.SetMerge(true, ret, extendchain[i].getBasicReferences()); }
    return ret; }

  getAllOperations(): Set<EOperation> {
    const extendchain: IClass[] = this.getAllSuperClasses(true);
    let i: number;
    const ret: Set<EOperation> = new Set<EOperation>();
    for (i = 0; i < extendchain.length; i++) {
      U.SetMerge(true, ret, extendchain[i].getBasicOperations()); }
    return ret; }
/*
  getDisplayedChildrens(): Set<Typedd> { return this.getBasicChildrens(); }
  getDisplayedOperations(): Set<EOperation> { return this.getBasicOperations(); }
  getDisplayedAttributes(): Set<IAttribute> { return this.getBasicAttributes(); }
  getDisplayedReferences(): Set<IReference> { return this.getBasicReferences(); }*/

  getBasicChildrens(includeOperations: boolean = true,
                    includeAnnotations: boolean = true, includeAttributes: boolean = true, includeReferences: boolean = true,
                    includeShadowed: boolean = false/*null = both shadow and unshadow, true = onlyshadowed*/): Set<Typedd> {
    if (includeOperations && includeAnnotations) return new Set(this.childrens);
    const arr: Typedd[] = [];
    let j: number;
    for (j = 0; j < this.childrens.length; j++) {
      const child: Typedd = this.childrens[j];
      console.log(child.metaParent, this.metaParent, child, this);
      if (child instanceof IFeature && child.isInherited(this)) continue; // for m1

      if (includeAttributes && child instanceof IAttribute) {
        if (includeShadowed !== null && child.isShadowed(this) !== includeShadowed) continue;
        arr.push(child); continue; }
      if (includeReferences && child instanceof IReference) { arr.push(child); continue; }
      if (includeOperations && child instanceof EOperation) { arr.push(child); continue; }
      if (includeAnnotations && child instanceof EAnnotation) { arr.push(child); continue; }
      // U.pe(true, 'unexpected type of children basic:', child);
    }
    return new Set<Typedd>(arr); }

  getBasicAttributes(): Set<IAttribute> { return new Set(this.attributes); }
  getBasicReferences(): Set<IReference> { return new Set(this.references); }
  abstract getBasicOperations(): Set<EOperation>;

  checkViolations(toAllChain: boolean = true): void {
    if (!Status.status.mm) return;
    this.calculateInheritanceViolations(toAllChain);
    // this.calculateShadowings(toAllChain);
  }
/*
  calculateShadowings(updateSubclassesToo: boolean = true): void {
    let i: number;
    let j: number;
    const superclasses: IClass[] = this.getAllSuperClasses();
    let map: Map<string, IFeature[]> = new Map();
    for (i = 0; i < superclasses.length; i++) {
      let sc: IClass = superclasses[i];
      let features: IFeature[] = [...sc.getBasicChildrens(false, false, true, true, false)] as IFeature[];

      for (j = 0; j < features.length; j++) {
        let feat: IFeature = features[j];
        if (!map[feat.name]) map[feat.name] = [feat.name]; else map[feat.name].push(feat);
      }
    }
    const ownFeatures: IFeature[] = [...this.getBasicChildrens(false, false, true, true, false)] as IFeature[];
    for (j = 0; j < ownFeatures.length; j++) {
      let feat: IFeature = ownFeatures[j];
      un attributo non è shadowed di natura, lo è nella sottoclassi ma non nella sua classe.extendsStralso sto settando shadowed la sottoclasse e non la superclasse
      this.setShadowed(!!map[feat.name]); }
    if (updateSubclassesToo) {
      let subClasses: IClass[] = this.getAllSubClasses(false);
      for (j = 0; j < subClasses.length; j++) {
        let sc: IClass = subClasses[j];
        sc.calculateShadowings(false); }
    }
  }
*/
  calculateInheritanceViolations(toAllChain: boolean = false): void {
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
}
export class M3Class extends IClass {
  parent: M3Package;
  // childrens: M3Feature[];
  attributes: M3Attribute[];
  references: M3Reference[];
  referencesIN: M3Reference[]; // external pointers to this class.
  metaParent: M3Class;
  instances: M2Class[]; //  | M3Class[] = null;

  constructor(parent: M3Package, json: Json = null) {
    super(parent, null);
    this.parse(json, true); }

  duplicate(nameAppend?: string, newParent?: ModelPiece): ModelPiece { U.pe(true, 'Invalid operation: m3Class.duplicate()'); return this; }

  generateModel(): Json { U.pe(true, 'Invalid operation: m3Class.generateModel()'); return this; }
  getBasicOperations(): Set<EOperation> {
    let i: number;
    for (i = 0; i < this.childrens.length; i++) {
      const c: Typedd = this.childrens[i];
      if (c instanceof EOperation) return new Set([c]); }
    U.pe(true, 'failed to find m3Operation');
    return null; }

  parse(json: Json, destructive?: boolean): void {
    this.name = 'Class';
    this.childrens = [];
    this.attributes = [];
    this.references = [];
    this.instances = [];
    const a: M3Attribute = new M3Attribute(this, null);
    const r: M3Reference = new M3Reference(this, null);
    const o: EOperation = new EOperation(this, null);
    const p: EParameter = new EParameter(o, null);
  }

}
