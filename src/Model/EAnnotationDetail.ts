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
  EdgePointStyle, EOperation, EParameter, Typedd, Type, IClassifier, ECoreAnnotation, EAnnotation
}                    from '../common/Joiner';
import {ECoreDetail} from './iModel';

export class EAnnotationDetail extends ModelPiece {
  parent: EAnnotation;
  value: string;

  constructor(parent: ModelPiece, json: Json){
    super(parent, null);
    this.parse(json); }

  duplicate(nameAppend?: string, newParent?: ModelPiece): ModelPiece {
    return undefined; // todo
  }

  fullname(): string { return this.parent.fullname() + '.' + this.name; }

  generateModel(): Json {
    const json: Json = {};
    if (this.name !== null) Json.write(json, ECoreDetail.key, this.name);
    if (this.value !== null) Json.write(json, ECoreDetail.value, this.value);
    return json; }

  getVertex(): IVertex { return this.parent.getVertex(); }

  parse(json: Json, destructive?: boolean): void {
    let key: string;
    this.childrens = [];
    if (!json) { json = {}; }
    for(key in json){
      const value = json[key];
      switch (key) {
        default: U.pe(true, 'unexpected field in EDetail:  ' + key + ' => |' + value + '|'); break;
        case ECoreDetail.key: break;
        case ECoreDetail.value: break; }
    }
    this.value = Json.read(json, ECoreDetail.value, '');
    this.setName(Json.read(json, ECoreDetail.key, 'DetailKey1'));
  }

  refreshGUI_Alone(debug?: boolean): void { return this.parent.refreshGUI_Alone(); }
}
