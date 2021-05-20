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
  ModelPiece, Status, MClass, ECoreClass, ModelNone, M3Class, M3Reference, M2Package, MReference, IClass, Dictionary
} from '../common/Joiner';
import {RawEdge, RawGraph, RawVertex} from '../common/util';

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
    if (json === '{}') json = {};
    U.pw(json === '' + json, 'ModelPiece.parse() parameter must be a parsed ECORE/json. autofixed.', json);
    if (json === '' + json) json = JSON.parse(json + '');
    if (destructive) { this.childrens = []; }
    let key: string;
    for (key in json) {
      if (!json.hasOwnProperty(key)) { continue; }
      const namespacedclass: string = key;
      const mmclass: M2Class = this.metaParent.getClassByNameSpace(namespacedclass, false, true);
      const value: Json = json[key];
      new MClass(this.getDefaultPackage(), value, mmclass, true);
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
  getClass(fullname: string, caseSensitive: boolean = false, throwErr: boolean = true, debug: boolean = true): MClass {
    return super.getClass(fullname, caseSensitive, throwErr, debug) as MClass; }

  generateModel(loopDetectionObj: Dictionary<number /*MP id*/, ModelPiece> = null): Json {
    const json: Json =  {};
    const classRoot: MClass = this.getClassRoot();
    if (!classRoot) return Model.emptyModel;

    // U.pe(!U.isObject(loopDetectionObj), "loopdetection not object param:", loopDetectionObj, loopDetectionObj || {});
    json[classRoot.metaParent.getNamespaced()] = classRoot.generateModel(loopDetectionObj, true);
    return json; }

  // namespace(set: string = null): string { return this.metaParent.namespace(set); }

  getDefaultPackage(): MPackage {
    if (this.childrens.length !== 0) { return this.childrens[0]; }
    new MPackage(this, null, this.metaParent.getDefaultPackage());
    return this.childrens[0]; }


  conformability(metaparent: MetaModel, outObj?: any, debug?: boolean): number {
    U.pw(true, 'm1.conformability(): to do.');
    return 1; }


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

  fixReferences(): void{
    let refs: MReference[] = this.getAllReferences();
    for (let ref of refs) { ref.fixReferences(this.classRoot); }
  }

  findContainmentLoop(): MClass[] {
    const allContainmentRefs: MReference[] = this.getAllReferences().filter( r => r.isContainment());
    // dag con nodi e archi oggetti grezzi general purpose, prendo nodi = classi e archi = (class1, class2) salvo tutto con un id eseguo il dag e rispondo riprendendo le logiche tramite id dopo aver beccato il loop
    const nodesLogic: MClass[] = [...new Set([... (allContainmentRefs as any).flatMap( r => r.mtarget), ...(allContainmentRefs as any).map( r => r.parent)])];

    const vertexIDMap: Dictionary<string, RawVertex> = {};
    const rawVertex: RawVertex[] = nodesLogic.map(c => { return vertexIDMap['' + c.id] = new RawVertex('' + c.id, c); });
    let i: number = 0;
    const rawEdges: RawEdge[] = (allContainmentRefs as any).flatMap( (r: MReference) => {
      const sourcev: RawVertex = vertexIDMap['' + r.parent.id];
      return r.mtarget.map( (target: MClass) => {
        const targetv: RawVertex = vertexIDMap['' + target.id];
        return new RawEdge('e' + i++, sourcev, targetv, r);
      });
    });
    const out: {elementsInLoop: RawVertex[]} = {elementsInLoop: []};
    new RawGraph(rawVertex, rawEdges).getDagOrder(true, out);
    return out.elementsInLoop.map( e => ModelPiece.getByID(+e.id)) as MClass[];
  }
}
