import {
  Json,
  U,
  IField,
  IEdge,
  IVertex,
  M2Class,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  MetaModel,
  ISidebar,
  IGraph,
  IModel,
  Status,
  IReference,
  EdgeStyle,
  IPackage,
  Model,
  Dictionary,
  MClass,
  ModelNone,
  M2Package,
  IClass,
  M3Attribute,
  M3Class, ViewRule, ViewPoint
} from '../../common/Joiner';


export class MPackage extends IPackage {
  metaParent: M2Package;
  // instances: ModelNone[];
  parent: Model;
  childrens: MClass[];
  name: string;

  constructor(model: Model, json: Json, metaparent: IPackage) {
    super(model, json, metaparent);
    // todo: nel parse il json viene ignorato, cerca come vengono costruite le classi.
    // return;
    // this.setName(name);
    // this.setJson(json);
    this.parse(json, true);
  }

  getClass(name: string, caseSensitive: boolean = false, throwErr: boolean = true, debug: boolean = true): MClass {
    return super.getClass(name, caseSensitive, throwErr, debug) as MClass; }

  addEmptyClass(metaVersion: M2Class): MClass {
    const c: MClass = new MClass(this, null, metaVersion, false);
    if (Status.status.loadedLogic) c.generateVertex();
    console.log('addEmptyClass(); package:', this, '; metaVersion: ', metaVersion, 'classe:', c);
    return c; }

  generateModel(loopDetectionObj: Dictionary<number /*MP id*/, ModelPiece> = null): Json { return this.parent.generateModel(loopDetectionObj); }
  /*
  generateModel(rootClass: MClass): Json {
    const key: string = U.toDottedURI(this.uri) + ':' + rootClass.name;
    const xmlnsuri = '@xmlns:org.eclipse.example.' + this.name;
    const value: Json = {
      '@xmlns:xmi': 'http://www.omg.org/XMI',
      xmlnsuri : U.toHttpsURI(this.uri), // "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
      '-xmi:version': '2.0',
    };
    let i: number;
    for (i = 0, i < this.childrens.length; i++) {
      const cl: MClass = this.childrens[i];
      value[cl.name] = wrongggg!!! non è nemmeno un package, è una cosa del tipo:
    }
    return undefined;
  }

  getInfo(toLower?: boolean): any {
  }

  LinkToMetaParent(meta: IPackage): void {
  }
*/
  parse(json: Json, destructive: boolean = true, uri: string = null, name: string = null): void {
    /* e se c'è un riferimento circolare?
      <league (rootclass)>
        <players (attribute)>
          <player>...</player>
        </players>
      </league>

    "org.eclipse.example.bowling:League": {
      "-xmlns:xmi": "http://www.omg.org/XMI",
      "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
      "-xmi:version": "2.0",
      "Players": [
          { "-name": "tizio" },
          { "-name": "asd" } ]
  }*/
    let i: number;/*
    this.views = [];
    for(i = 0; i < this.parent.viewpoints.length; i++) {
      const vp: ViewPoint = this.parent.viewpoints[i];
      const v = new PackageView(vp.modelView);
      this.views.push(v);
      vp.modelView.packageViews.push(v); }*/
  }

}
