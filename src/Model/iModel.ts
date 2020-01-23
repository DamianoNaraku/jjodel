import {
  Status,
  IVertex,
  IEdge,
  IField,
  IPackage,
  M2Class,
  IAttribute,
  AttribETypes,
  IFeature,
  Json,
  U,
  ModelPiece,
  ISidebar,
  MetaMetaModel,
  LocalStorage,
  IGraph,
  IReference,
  MetaModel,
  MClass,
  TopBar,
  ModelNone,
  IClass,
  Model,
  M3Package,
  M3Class,
  ViewPoint,
  EEnum,
  IClassifier,
  GraphSize,
  Dictionary,
  SaveListEntry, //, Options
}             from '../common/Joiner';
import {Meta} from '@angular/platform-browser';

export abstract class IModel extends ModelPiece {
  parent: ModelNone;
  childrens: IPackage[];
  metaParent: IModel;
  instances: IModel[];

  graph: IGraph = null;
  sidebar: ISidebar = null;
  storage: LocalStorage = null;
  namespaceVar: string = null;
  uriVar: string = null;
  viewpoints: ViewPoint[] = [];
  // viewpoint: ViewPoint;
  /*
  constructor(json: Json, metaParent: MetaModel, skipParse: boolean = false) {
    super(null, metaParent);
    // todo: mi sa che chiama parse a ripetizione: Modelpiece.parse, IFeature.parse, IAttribute.parse, M2Attribute.parse...
    if (!skipParse) { this.parse(json, true); }
  }*/
  static isValidURI(str: string): boolean { return str.indexOf(' ') !== -1 && true; }
  static removeInvalidNameChars(name: string): string { return U.multiReplaceAll(name, [' '], ['']); }
  // abstract conformsTo(meta: IModel): boolean;
  abstract generateModel(): Json;
  abstract conformability(metaparent: IModel, outObj?: any/*.refPermutation, .attrPermutation*/, debug?: boolean): number;

  constructor(metaVersion?: IModel) {
    super(null, metaVersion);
    this.storage = new LocalStorage(this); }

  uri(str: string = null): string {
    if (str) { if (IModel.isValidURI(str)) { return this.uriVar = str; } else { return null; } }
    if (this.uriVar) { return this.uriVar; }
    return this.uriVar = 'http://default/uri/to/change'; }

  namespace(value: string = null): string {
    let pos: number;
    if (value) {
      this.namespaceVar = value;
      pos = this.namespaceVar.lastIndexOf(':');
      this.namespaceVar = pos === -1 ? this.namespaceVar : this.namespaceVar.substring(0, pos);
    }
    const ns: string = this.namespaceVar;
    if (!ns) { return this.namespace('default.namespace.to.change'); }
    pos = ns.lastIndexOf(':');
    return pos === -1 ? ns : ns.substring(0, pos); }

  getAllClasses(): IClass[] {
    const arr: IClass[] = [];
    const packages: IPackage[] = this.childrens;
    let i;
    for (i = 0; i < packages.length; i++) { packages[i].classes.forEach( (elem: IClass) => {arr.push(elem); } ); }
    return arr; }

  getAllEnums(): EEnum[] {
    const arr: EEnum[] = [];
    const packages: IPackage[] = this.childrens;
    let i;
    for (i = 0; i < packages.length; i++) { packages[i].enums.forEach( (elem: EEnum) => {arr.push(elem); } ); }
    return arr; }

  fullname(): string { return this.name; }

  getVertex(): IVertex { U.pe(true, 'IModel.getVertex();', this); return undefined; }

  getAllReferences(): IReference[] {
    const arr: IReference[] = [];
    const classes: IClass[] = this.getAllClasses();
    let i;
    for (i = 0; i < classes.length; i++) {
      classes[i].references.forEach( (elem: IReference) => {arr.push(elem); } );
    }
    return arr; }

  getPackage(fullname: string, throwErr: boolean = true): IPackage {
    if (fullname.indexOf('.') !== -1) { U.pe(throwErr, 'not a package name:', fullname); return null; }
    let i;
    for ( i = 0; i < this.childrens.length; i++) { if (this.childrens[i].name === fullname) { return this.childrens[i]; } }
    if (fullname.indexOf('.') !== -1) { U.pe(throwErr, 'valid a package name, but package does not exist:', fullname); return null; }
    return null; }

  getClass(fullname: string, throwErr: boolean = true, debug: boolean = true): IClass {
    const tks: string[] = fullname.split('.');
    if (tks.length !== 2) { U.pe(throwErr, 'not a full class name:', fullname); return null; }
    const classes: IClass[] = this.getAllClasses();
    let i = -1;
    while (++i < classes.length) {
      const currentFname = classes[i].fullname();
      U.pif(debug, 'fllname: |' + fullname + '| =?= |' + currentFname + '| = ' + currentFname === fullname);
      if (currentFname === fullname) { return classes[i]; }
    }
    const name: string = fullname.substr(fullname.indexOf('.') + 1);
    i = -1;
    while (++i < classes.length) {
      U.pif(debug, 'name: |' + name + '| =?= |' + classes[i].name + '| = ' + classes[i].name === name);
      if (classes[i].name === name) { return classes[i]; }
    }
    U.pe(throwErr, 'valid name but unable to find it. fullname:', fullname, 'classes:', classes);
    return null;
    // let i;
    // for ( i = 0; i < pkg.childrens.length; i++) { if (pkg.childrens[i].name === fullname) { return pkg.childrens[i] as M2Class; } }
  }


  // fieldChanged(e: JQuery.ChangeEvent) { U.pe(true, 'should never happen', e); }

  abstract duplicate(nameAppend?: string): IModel;

  getEmptyModel(): string {
    if (this instanceof MetaMetaModel) return MetaMetaModel.emptyMetaMetaModel;
    if (this instanceof MetaModel) return MetaModel.emptyModel;
    if (this instanceof Model) return Model.emptyModel;
    return null; }

  delete(): void {
    this.storage.remove(this.name, SaveListEntry.model);
    // set empty (meta)model as most recent anonymous savefile and next to be opened.
    LocalStorage.deleteLastOpened(this instanceof MetaModel ? 2 : 1);
    /*this.storage.add(null, null, SaveListEntry.model);
    this.storage.add(null, null, SaveListEntry.view);
    this.storage.add(null, null, SaveListEntry.vertexPos);*/
    U.refreshPage(); }

  refreshGUI_Alone(debug: boolean = true): void {
    let i: number;
    for (i = 0; i < this.childrens.length; i++ ) { this.childrens[i].refreshGUI_Alone(debug); } }

  isNameTaken(name: string): boolean { return !!this.storage.get(name, SaveListEntry.model); }

  setName(value: string, refreshGUI: boolean = false): string {
    const oldname: string = this.name;
    if (this.isNameTaken(value)) { U.pw(true, 'tried to saveToDB a model with a name already in use'); return oldname; }
    super.setName(value);
    this.storage.rename(oldname, this.name, SaveListEntry.model);
    this.graph.propertyBar.refreshGUI();
    return this.name; }

  save(isAutosave: boolean, saveAs: boolean = false): void {
    this.storage.saveModel(isAutosave, saveAs); }

  abstract getDefaultPackage(): IPackage;
  abstract isM3(): boolean;
  abstract isM2(): boolean;
  abstract isM1(): boolean;

  isMMM(): boolean { return this.isM3(); }
  isMM(): boolean { return this.isM2(); }
  isM(): boolean { return this.isM1(); }

  abstract getPrefix(): string;
  abstract getPrefixNum(): string;

  addClass(parent: IPackage = null, meta: IClass = null): IClass {
    if (!parent) { parent = this.getDefaultPackage(); }
    return parent.addEmptyClass(meta); }

  friendlyClassName(toLower: boolean = true): string {
    if (this instanceof MetaMetaModel) { return 'Meta-metamodel'.toLowerCase(); }
    if (this instanceof MetaModel) { return 'Metamodel'.toLowerCase(); }
    if (this instanceof Model) { return 'Model'.toLowerCase(); }
    U.pe(true, 'unexpected'); return 'error'; }

    getLastView(): ViewPoint {
      let i: number;
      for (i = this.viewpoints.length; --i >= 0; ) {
        const vp: ViewPoint = this.viewpoints[i];
        if (vp.isApplied) return vp; }
      return null;
    }

  public static getByName(name: string): IModel {
    if (Status.status.mmm.fullname() === name) return Status.status.mmm;
    if (Status.status.mm.fullname() === name) return Status.status.mm;
    if (Status.status.m.fullname() === name) return Status.status.m;
    return null; }

  readVertexPositionSaveArr(dic: Dictionary<string, GraphSize>): void {
    for (let key in dic) {
      const value: GraphSize = new GraphSize().clone(dic[key]);
      const mp = ModelPiece.getByKeyStr(key);
      if (!mp) { U.pw(true, 'invalid vertex save, failed to get targetmodelpiece: ', key, dic, this); continue; }
      mp.getVertex().setSize(value);
    }
  }
  generateVertexPositionSaveArr(): Dictionary<string, GraphSize> {
    let i: number;
    let j: number;
    let ret: Dictionary<string, GraphSize> = {};
    let arr: IClassifier[][] = [this.getAllEnums(), this.getAllClasses()];
    for (j = 0; j < arr.length; j++)
      for (i = 0; i < arr[j].length; i++) { ret[arr[j][i].getKeyStr()] = arr[j][i].getVertex().getSize(); }
    return ret; }

  generateViewPointSaveArr(): Json[] {
    /*let i: number;
    let tmp: any = [];
    for (i = 0; i < this.viewpoints.length; i++) { tmp.push(this.viewpoints[i].toJSON()); }
    return tmp;*/
    return this.viewpoints; }
}


export class ECoreRoot {
  static ecoreEPackage: string;
  public static initializeAllECoreEnums(): void {
    ECoreRoot.ecoreEPackage = 'ecore:EPackage';

    ECorePackage.eAnnotations = ECoreClass.eAnnotations = ECoreEnum.eAnnotations = EcoreLiteral.eAnnotations =
      ECoreReference.eAnnotations = ECoreAttribute.eAnnotations = ECoreOperation.eAnnotations = ECoreParameter.eAnnotations = 'eAnnotations';

    ECoreAnnotation.source = Status.status.XMLinlineMarker + 'source';
    ECoreAnnotation.references = Status.status.XMLinlineMarker + 'references'; // "#/" for target = package.
    ECoreAnnotation.details = 'details'; // arr
    ECoreDetail.key = Status.status.XMLinlineMarker + 'key'; // can have spaces
    ECoreDetail.value = Status.status.XMLinlineMarker + 'value';

    ECorePackage.eClassifiers = 'eClassifiers';
    ECorePackage.xmlnsxmi = Status.status.XMLinlineMarker + 'xmlns:xmi'; // typical value: http://www.omg.org/XMI
    ECorePackage.xmlnsxsi = Status.status.XMLinlineMarker + 'xmlns:xsi'; // typical value: http://www.w3.org/2001/XMLSchema-instance
    ECorePackage.xmiversion = Status.status.XMLinlineMarker + 'xmi:version'; // typical value: "2.0"
    ECorePackage.xmlnsecore = Status.status.XMLinlineMarker + 'xmlns:ecore';
    ECorePackage.nsURI = Status.status.XMLinlineMarker + 'nsURI'; // typical value: "http://org/eclipse/example/bowling"
    ECorePackage.nsPrefix = Status.status.XMLinlineMarker + 'nsPrefix'; // typical value: org.eclipse.example.bowling
    ECorePackage.namee = Status.status.XMLinlineMarker + 'name';

    ECoreClass.eStructuralFeatures = 'eStructuralFeatures';
    ECoreClass.eOperations = 'eOperations';
    ECoreClass.xsitype = Status.status.XMLinlineMarker + 'xsi:type'; // "ecore:EClass"
    ECoreClass.namee = ECorePackage.namee;
    ECoreClass.eSuperTypes = Status.status.XMLinlineMarker + 'eSuperTypes'; // space separated: "#name1 #name2"...
    ECoreClass.instanceTypeName = Status.status.XMLinlineMarker + 'instanceTypeName';  // raw str
    ECoreClass.instanceTypeName = Status.status.XMLinlineMarker + 'instanceTypeName';
    ECoreClass.abstract = Status.status.XMLinlineMarker + 'abstract'; // bool
    ECoreClass.interface = Status.status.XMLinlineMarker + 'interface'; // bool

    ECoreEnum.instanceTypeName = ECoreClass.instanceTypeName;
    ECoreEnum.serializable = 'serializable'; // "false", "true"
    ECoreEnum.xsitype = ECoreClass.xsitype; // "ecore:EEnum"
    ECoreEnum.eLiterals = 'eLiterals';
    ECoreEnum.namee = ECorePackage.namee;

    EcoreLiteral.literal = 'literal';
    EcoreLiteral.namee = ECorePackage.namee;
    EcoreLiteral.value = 'value'; // any integer (-inf, +inf), not null. limiti = a type int 32 bit?

    ECoreReference.xsitype = Status.status.XMLinlineMarker + 'xsi:type'; // "ecore:EReference"
    ECoreReference.eType = Status.status.XMLinlineMarker + 'eType'; // "#//Player"
    ECoreReference.containment = Status.status.XMLinlineMarker + 'containment'; // "true"
    ECoreReference.upperbound = Status.status.XMLinlineMarker + 'upperBound'; // "@1"
    ECoreReference.lowerbound = Status.status.XMLinlineMarker + 'lowerBound'; // does even exists?
    ECoreReference.namee = Status.status.XMLinlineMarker + 'name';

    ECoreAttribute.xsitype = Status.status.XMLinlineMarker + 'xsi:type'; // "ecore:EAttribute",
    ECoreAttribute.eType = Status.status.XMLinlineMarker + 'eType'; // "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString"
    ECoreAttribute.namee = Status.status.XMLinlineMarker + 'name';


    ECoreOperation.eParameters = 'eParameters';
    ECoreOperation.namee = Status.status.XMLinlineMarker + 'name'; // "EExceptionNameCustom",
    ECoreOperation.ordered = Status.status.XMLinlineMarker + 'ordered'; // "false",
    ECoreOperation.unique = Status.status.XMLinlineMarker + 'unique'; // "false",
    ECoreOperation.lowerBound = Status.status.XMLinlineMarker + 'lowerBound'; // "5", ma che senso ha su una funzione?? è il return?
    ECoreOperation.upperBound = Status.status.XMLinlineMarker + 'upperBound';
    ECoreOperation.eType = Status.status.XMLinlineMarker + 'eType'; // "#//Classname",
    ECoreOperation.eexceptions = Status.status.XMLinlineMarker + 'eExceptions';
    // "#//ClassnameException1 #//ClassNameException2 (also custom classes) ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt

    ECoreParameter.namee = Status.status.XMLinlineMarker + 'name';
    ECoreParameter.ordered = Status.status.XMLinlineMarker + 'ordered'; // "false";
    ECoreParameter.unique = Status.status.XMLinlineMarker + 'unique'; // "false"
    ECoreParameter.lowerBound = Status.status.XMLinlineMarker + 'lowerBound'; // "1"
    ECoreParameter.upperBound = Status.status.XMLinlineMarker + 'upperBound'; // "2"
    ECoreParameter.eType = Status.status.XMLinlineMarker + 'eType'; // "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDoubl

    XMIModel.type = Status.status.XMLinlineMarker + 'type';
    XMIModel.namee = Status.status.XMLinlineMarker + 'name'; }
}

export class ECoreAnnotation {
  static source: string;
  static references: string;
  static details: string;}

export class ECoreDetail {
  static key: string;
  static value: string; }

export class ECorePackage {
  static eAnnotations: string;
  static eClassifiers: string;
  static xmlnsxmi: string;
  static xmlnsxsi: string;
  static xmiversion: string;
  static xmlnsecore: string;
  static nsURI: string;
  static nsPrefix: string;
  static namee: string;
}

export class ECoreClass {
  static eAnnotations: string;
  static eStructuralFeatures: string;
  static xsitype: string;
  static namee: string;
  static eOperations: string;
  static instanceTypeName: string;
  static eSuperTypes: string;
  static abstract: string;
  static interface: string;

  // static defaultValue = Status.status.XMLinlineMarker + 'defaultValue';  // visualizzato in ecore ma mai salvato dentro il file. inutilizzato
  // nelle classi, assume il valore di "[name] = [NumericValue]" senza le [] negli enum.
}

export class ECoreEnum {
  static eAnnotations: string;
  static xsitype: string;
  static namee: string;
  static instanceTypeName: string;
  static serializable: string;
  static eLiterals: string;
}

export class EcoreLiteral {
  static eAnnotations: string;
  static namee: string;
  static value: string;
  static literal: string;
}


export class ECoreReference {
  static eAnnotations: string;
  static xsitype: string;
  static eType: string;
  static containment: string;
  static upperbound: string;
  static lowerbound: string;
  static namee: string; }

export class ECoreAttribute {
  static eAnnotations: string;
  static xsitype: string;
  static eType: string;
  static namee: string;
}

export class ECoreOperation {
  static eAnnotations: string;
  static eType: string;
  static eexceptions: string;
  static upperBound: string;
  static lowerBound: string;
  static unique: string;
  static ordered: string;
  static namee: string;
  static eParameters: string; }

export class ECoreParameter {
  static eAnnotations: string;
  static namee: string;
  static ordered: string;
  static unique: string;
  static lowerBound: string;
  static upperBound: string;
  static eType: string;
  }

export class XMIModel {
  static type: string;
  static namee: string; }
