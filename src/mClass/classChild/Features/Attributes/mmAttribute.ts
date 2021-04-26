import {
  IAttribute,
  M3Attribute,
  M2Class,
  MAttribute,
  ECoreAttribute,
  Json,
  ShortAttribETypes,
  U,
  MetaModel,
  AttribETypes, Status, Dictionary, ModelPiece,
} from '../../../../common/Joiner';

export class M2Attribute extends IAttribute {
  static stylesDatalist: HTMLDataListElement;
  parent: M2Class;
  metaParent: M3Attribute;
  instances: MAttribute[];

  constructor(classe: M2Class, json: Json) {
    super(classe, Status.status.mmm.getAttribute());
    if (!classe && !json) { return; } // empty constructor for .duplicate();
    this.parse(json, true); }

  getModelRoot(acceptNull: boolean = false): MetaModel { return super.getModelRoot(acceptNull) as MetaModel; }

  parse(json: Json, destructive: boolean) {
    this.setName(Json.read(json, ECoreAttribute.namee, 'Attribute_1'));
    this.setLowerbound(+Json.read(json, ECoreAttribute.lowerbound, 0));
    this.setUpperbound(+Json.read(json, ECoreAttribute.upperbound, 1));
    this.type.changeType(Json.read(json, ECoreAttribute.eType, AttribETypes.EString));
    /*
    this.views = [];
    let i: number;
    for(i = 0; i < this.parent.views.length; i++) {
      const pv: ClassView = this.parent.views[i];
      const v = new AttributeView(pv);
      this.views.push(v);
      pv.attributeViews.push(v); }*/
  }

  generateModel(loopDetectionObj: Dictionary<number /*MClass id*/, ModelPiece> = null): Json {
    const model = new Json(null);
    Json.write(model, ECoreAttribute.xsitype, 'ecore:EAttribute');
    Json.write(model, ECoreAttribute.eType, this.type.toEcoreString());
    Json.write(model, ECoreAttribute.namee, this.name);
    Json.write(model, ECoreAttribute.lowerbound, '' + this.getLowerbound());
    Json.write(model, ECoreAttribute.upperbound, '' + this.getUpperbound());
    return model; }

  duplicate(nameAppend: string = '_Copy', newParent: M2Class = null): M2Attribute {
    const a: M2Attribute = new M2Attribute(null, null);
    a.copy(this, nameAppend, newParent);
    return a; }


  replaceVarsSetup(): void { super.replaceVarsSetup(); }

  conformability(metaparent: M3Attribute, outObj?: any, debug?: boolean): number { return 1; }










}
