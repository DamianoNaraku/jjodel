import {
  AttribETypes,
  IAttribute,
  M2Class,
  IFeature,
  IReference,
  Json,
  MClass,
  ModelPiece,
  ShortAttribETypes,
  M2Attribute,
  ECoreParameter,
  U,
  M3Attribute,
  IVertex,
  IField,
  MetaModel,
  Model,
  Status,
  EOperation,
  ECoreOperation,
  Typedd,
  IClass,
  Info,
  M3Class,
} from '../../../common/Joiner';
// export abstract class EParameter extends Typedd {}
export class EParameter extends Typedd {
  static stylesDatalist: HTMLDataListElement;
  parent: EOperation;

  constructor(parent: EOperation, json: Json) {
    super(parent, null);
    if (!parent) { return; } // fake constructor will allow to travel fake -> original. can't original -> fake.
    this.parse(json); }

  fullname(): string { return super.fullname() + ':' + this.name; }
  getField(): IField { return this.parent ? this.parent.getField() : null; }
  getClass(): IClass { return this.parent ? this.parent.parent : null; }

  conformability(metaparent: ModelPiece, outObj?: any, debug?: boolean): number { U.pe(true, 'eop.conformability'); return 0; }

  duplicate(nameAppend: string = '_Copy', newParent: EOperation = null): EParameter {
    const c: EParameter = new EParameter(null, null);
    c.copy(this, nameAppend, newParent); return c; }

  copy(c: EParameter, nameAppend: string = '_Copy', newParent: EOperation = null): void {
    super.copy(c, nameAppend, newParent);
    //// set childrens
    // let i; for (i = 0; i < this.childrens.length; i++) { U.ArrayAdd(this.parent.arguments, this.childrens[i]); }
    this.refreshGUI(); }

  getInfo(toLower: boolean = false): any {
    const info: any = super.getInfo(toLower);
    Info.unset(info, 'instances');
    return info; }

  generateModel(): Json {
    const json: Json = {};
    Json.write(json, ECoreOperation.lowerBound, '' + this.lowerbound);
    Json.write(json, ECoreOperation.upperBound, '' + this.upperbound);
    Json.write(json, ECoreOperation.ordered, '' + this.ordered);
    Json.write(json, ECoreOperation.unique, '' + this.unique);
    Json.write(json, ECoreOperation.eType, '' + this.getType().toEcoreString());
    return json; }

  parse(json: Json, destructive?: boolean): void {
    /* {"eAnnotations": {
					"_source": "annotationtext",
					"_references": "#//Umano/anni #//Umano/Attribute_1" },
				"_name": "dbl",
				"_ordered": "false",
				"_unique": "false",
				"_lowerBound": "1",
				"_upperBound": "2",
				"_eType": "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble" }*/
    U.pe(!this.parent || !this.parent.parent, 'json:', json, 'this: ', this, 'this.parent:', this.parent, 'this.p.p:', this.parent ? this.parent.parent : undefined);
    this.setName(this.parent.parent instanceof M3Class ? 'Parameter' : Json.read<string>(json, ECoreParameter.namee, 'Param_1'));
    this.setLowerbound(+Json.read<number>(json, ECoreOperation.lowerBound, 'NAN_Trigger'));
    this.setUpperbound(+Json.read<number>(json, ECoreOperation.upperBound, 'NAN_Trigger'));
    this.ordered = 'true' === '' + Json.read<boolean>(json, ECoreOperation.ordered, 'false');
    this.unique = 'true ' === '' + Json.read<boolean>(json, ECoreOperation.unique, 'false');
    this.setType(Json.read<string>(json, ECoreParameter.eType, AttribETypes.EString));
    let i: number;/*
    this.views = [];
    for(i = 0; i < this.parent.views.length; i++) {
      const pv: OperationView = this.parent.views[i];
      const v = new ParameterView(pv);
      this.views.push(v);
      pv.parameterView.push(v); }*/

  }

}
