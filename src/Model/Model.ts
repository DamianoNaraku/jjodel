import {
  IModel,
  Json,
  IPackage,
  M2Class,
  IFeature,
  IAttribute,
  IReference,
  MetaModel,
  U,
  IVertex,
  IEdge,
  EdgeStyle, MPackage,
  ModelPiece, Status, MClass, ECoreClass, ModelNone, M3Class, M3Reference, M2Package, MReference
} from '../common/Joiner';

export class Model extends IModel {
  public static emptyModel = '{}';
  metaParent: MetaModel;
  // instances: ModelNone[];
  childrens: MPackage[];
  classRoot: MClass = null;

  constructor(json: Json, metaModel: MetaModel) {
    super(metaModel);
    this.parse(json, true); }

  // fixReferences(): void {/*useless here? or useful in loops?*/}

  getClassRoot(): MClass {
    if (this.classRoot) { return this.classRoot; }
    const classes = this.getAllClasses();
    if (classes.length) U.pw(true, 'Failed to get m1 class root.<br>You need to select a root class in M1\'s structured editor', this);

    if (classes.length && classes[0]) {
      classes[0].setRoot(true);
      U.ps(true, 'Class root automatically selected.'); }
    return null; }

  parse(json: Json, destructive: boolean, metamodel: MetaModel = null): void {
    if (!metamodel) {metamodel = Status.status.mm; }
    U.pe(!metamodel, 'parsing a model requires a metamodel linked');
    U.pw(json === '' + json, 'ModelPiece.parse() parameter must be a parsed ECORE/json. autofixed.');
    if (json === '' + json) json = JSON.parse(json + '');
    if (destructive) { this.childrens = []; }
    let key: string;
    for (key in json) {
      if (!json.hasOwnProperty(key)) { continue; }
      const namespacedclass: string = key;
      const mmclass: M2Class = this.metaParent.getClassByNameSpace(namespacedclass, false, true);
      const value: Json = json[key];
      new MClass(this.getDefaultPackage(), value, mmclass);
    }

    /*
    {
      "org.eclipse.example.bowling:League": { <-- :classroot
        "-xmlns:xmi": "http://www.omg.org/XMI",
        "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
        "-xmi:version": "2.0",
        "Players": [
          { "-name": "tizio" },
          { "-name": "asd" }
        ]
      }
    }
    */
  }
  // parse(deep: boolean) { super.parse(deep); }

  getAllClasses(): MClass[] { return super.getAllClasses() as MClass[]; }
  getAllReferences(): MReference[] { return super.getAllReferences() as MReference[]; }
  getClass(fullname: string, throwErr: boolean = true, debug: boolean = true): MClass {
    return super.getClass(fullname, throwErr, debug) as MClass; }

  generateModel(): Json {
    const json: Json =  {};
    const classRoot: MClass = this.getClassRoot();
    if (!classRoot) return Model.emptyModel;
    json[classRoot.metaParent.getNamespaced()] = classRoot.generateModel(true);
    return json; }

  // namespace(set: string = null): string { return this.metaParent.namespace(set); }

  getDefaultPackage(): MPackage {
    if (this.childrens.length !== 0) { return this.childrens[0]; }
    new MPackage(this, null, this.metaParent.getDefaultPackage());
    return this.childrens[0]; }


  conformability(metaparent: MetaModel, outObj?: any, debug?: boolean): number {
    U.pw(true, 'm1.conformability(): to do.');
    return 1;
  }


  getPrefix(): string { return 'm'; }
  getPrefixNum(): string { return 'm1'; }
  isM1(): boolean { return true; }
  isM2(): boolean { return false; }
  isM3(): boolean { return false; }

  duplicate(nameAppend: string = '_Copy'): Model {
    const m = new Model(null, null);
    m.copy(this);
    m.refreshGUI();
    return m; }
}
