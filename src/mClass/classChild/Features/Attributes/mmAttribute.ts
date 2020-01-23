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
  AttribETypes, Status,
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

  getModelRoot(): MetaModel { return super.getModelRoot() as MetaModel; }

  parse(json: Json, destructive: boolean) {
    this.setName(Json.read<string>(json, ECoreAttribute.namee, 'Attribute_1'));
    this.type.changeType(Json.read<string>(json, ECoreAttribute.eType, AttribETypes.EString));
    /*
    this.views = [];
    let i: number;
    for(i = 0; i < this.parent.views.length; i++) {
      const pv: ClassView = this.parent.views[i];
      const v = new AttributeView(pv);
      this.views.push(v);
      pv.attributeViews.push(v); }*/
  }

  generateModel(): Json {
    const model = new Json(null);
    Json.write(model, ECoreAttribute.xsitype, 'ecore:EAttribute');
    Json.write(model, ECoreAttribute.eType, this.type.toEcoreString());
    Json.write(model, ECoreAttribute.namee, this.name);
    return model; }

  duplicate(nameAppend: string = '_Copy', newParent: M2Class = null): M2Attribute {
    const a: M2Attribute = new M2Attribute(null, null);
    a.copy(this, nameAppend, newParent);
    return a; }


  replaceVarsSetup(): void { super.replaceVarsSetup(); }

  conformability(metaparent: M3Attribute, outObj?: any, debug?: boolean): number { return 1; }










}
