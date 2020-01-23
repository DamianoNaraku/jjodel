import {
  AttribETypes,
  Dictionary, EOperation, EParameter,
  IAttribute,
  IModel,
  Json, M3Attribute,
  M3Class,
  M3Package,
  M3Reference,
  MetaModel,
  ModelPiece, PropertyBarr,
  ShortAttribETypes,
  Status,
  U
} from '../common/Joiner';

export class MetaMetaModel extends IModel {
  static emptyMetaMetaModel: string = '' + 'empty Meta-MetaModel: todo'; // todo
  childrens: M3Package[];
  metaParent: MetaMetaModel;
  instances: MetaModel[];

  constructor(json?: Json) { super(null); this.parse(json, true); }

  conformability(metaparent: MetaMetaModel, outObj: any = null, debug: boolean = false): number { return 1; }

  getAllClasses(): M3Class[] { return super.getAllClasses() as M3Class[]; }
  getAllReferences(): M3Reference[] { return super.getAllReferences() as M3Reference[]; }


  generateModel(): Json { return undefined; }

  getPrefix(): string { return 'mmm'; }
  getPrefixNum(): string { return 'm3'; }
  isM1(): boolean { return false; }
  isM2(): boolean { return false; }
  isM3(): boolean { return true; }

  parse(json: Json, destructive?: boolean): void {
    this.name = 'Meta-Metamodel';
    const useless = new M3Package(this, null); }

  refreshGUI_Alone(debug: boolean = true): void { }

  getDefaultPackage(): M3Package {
    if (this.childrens.length !== 0) { return this.childrens[0]; }
    U.ArrayAdd(this.childrens, new M3Package(this, null));
    return this.childrens[0]; }

  getPackage(): M3Package { return this.getDefaultPackage(); }

  getClass(fullname: string = null, throwErr: boolean = true, debug: boolean = true): M3Class { return this.getDefaultPackage().classes[0]; }

  getAttribute(): M3Attribute { return this.getClass().attributes[0]; }
  getReference(): M3Reference { return this.getClass().references[0]; }
  getOperation(): EOperation { return this.getClass().getOperations()[0]; }
  getParameter(): EParameter { return this.getOperation().childrens[0]; }
  duplicate(nameAppend: string = '_Copy'): MetaMetaModel { U.pe(true, 'invalid operation: m3.duplicate();'); return this; }
}
