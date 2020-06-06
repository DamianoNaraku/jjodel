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
  EdgePointStyle, EOperation, EParameter, Typedd, Type, IClassifier, ECoreAnnotation, EAnnotationDetail
} from '../common/Joiner';

export class EAnnotation extends ModelPiece {
  childrens: EAnnotationDetail[];
  referencesStr: string;
  references: ModelPiece;

  constructor(parent: ModelPiece, json: Json){
    super(parent, null);
    if (this.parent) { U.arrayRemoveAll(this.parent.childrens, this); this.parent.annotations.push(this); }
    this.parse(json); }

  duplicate(nameAppend?: string, newParent?: ModelPiece): ModelPiece {
    return undefined; // todo
  }

  fullname(): string { return this.parent.fullname() + '//' + this.name; }

  setReferencesStr(): void {
    // todo?? se è il main package diventa "#//"
  }

  prepareSerialize(): void { this.setReferencesStr(); }

  generateModel(): Json {
    const json: Json = {};
    this.prepareSerialize();
    let i: number;
    const childarr: Json[] = [];
    for (i = 0; i < this.childrens.length; i++) { childarr.push(this.childrens[i].generateModel()); }
    Json.write(json, ECoreAnnotation.source, this.name);
    Json.write(json, ECoreAnnotation.references, this.referencesStr);
    Json.write(json, ECoreAnnotation.details, childarr);
    return json; }


  getVertex(): IVertex { return this.parent.getVertex(); }

  parse(json: Json, destructive?: boolean): void {
    let key: string;
    this.childrens = [];
    if (!json) { json = {}; }
    for(key in json){
      const value = json[key];
      switch (key) {
      default: U.pe(true, 'unexpected field in EAnnotation:  ' + key + ' => |' + value + '|'); break;
      case ECoreAnnotation.details: break;
      case ECoreAnnotation.references: break;
      case ECoreAnnotation.source: break;
      }
    }
    this.referencesStr = Json.read(json, ECoreAnnotation.source, '#/');
    this.setName(Json.read(json, ECoreAnnotation.name, 'EAnnotation_1'));

    const details: Json[] = Json.getDetails(json);
    for (let i = 0; i < details.length; i++) { new EAnnotationDetail(this, details[i]); }
  }

}
