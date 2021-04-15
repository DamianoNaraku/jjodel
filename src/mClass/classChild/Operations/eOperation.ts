import {
  AttribETypes,
  ECoreOperation,
  EParameter,
  IClass,
  Typedd,
  Info,
  Json,
  M2Class, M3Class,
  ModelPiece,
  ShortAttribETypes, Type,
  U, ELiteral, GraphSize, IVertex, IEdge, IReference, Status, Dictionary, MClass
} from '../../../common/Joiner';
import {ViewRule} from '../../../GuiStyles/viewpoint';
import {Mark} from '../../../guiElements/mGraph/Vertex/Mark';
// export abstract class EOperation extends Typedd {}
/*
export class OperationVisibility {
  static public = 'public';
  static private = 'private';
  static protected = 'protected';
  static internal = 'internal';
  static protectedinternal = 'protected internal';
  static protectedprivate = 'protected private'; }*/

export enum AccessModifier {
  public = 'public',
  private = 'private',
  protected = 'protected',
  internal = 'internal',
  package = 'package',
  protectedinternal = 'protected internal',
  protectedprivate = 'protected private', }

export class EOperation extends Typedd {
  static stylesDatalist: HTMLDataListElement;
  // instances: Typedd[] = undefined;
  // metaParent: Typedd = undefined;
  parent: M2Class | M3Class;
  childrens: EParameter[];
  exceptionsStr: string = ''; // classlist to be later processed and linked.
  visibility: AccessModifier = AccessModifier.private;
  detailIsOpened: boolean = false && false;
  type: Type;
  // exceptions: IClass[];
  // todo: ha davvero senso processarli e creare anche IClass.Object etc? mi conviene tenerli a stringa.

  constructor(parent: M2Class | M3Class, json: Json) {
    super(parent, null);
    if (parent instanceof M2Class) parent.operations.push(this);
    this.parse(json); }

  isInherited(forClass: IClass): boolean { if (this.parent !== forClass) return true; }

  canOverride(other: EOperation): boolean {
    console.log('CanOverride(', this, ', ', other, ') ? ',
      this.name === other.name,
      this.parent !== other.parent,
      this.getSignature() == other.getSignature(),
      this.getReturnType().canOverride(other.getReturnType()));

    // NB: se A.a(Object): Object e B.a(String):String lo tratta come polimorfismo. se A.a(String): Object e B.a(String):String lo tratta come override valido.
    return this.name === other.name && this.parent !== other.parent && this.getSignature() == other.getSignature() && this.getReturnType().canOverride(other.getReturnType()); }
  canPolymorph(other: EOperation): boolean {
    console.log('canPolymorph(', this, ', ', other, ') ? ',
      this.name === other.name,
      this.getSignature() != other.getSignature());
    // todo: hide shadowed features
    return this.name === other.name && this.getSignature() != other.getSignature(); }

  isCompatible(other: EOperation, allowMark: boolean = false): boolean {
    let ret = this === other || (this.name !== other.name) || this.canOverride(other) || this.canPolymorph(other);
    if (allowMark) {
      if (!ret) this.markIncompatibility(other); else this.unmarkIncompatibility(other);
    }
    return ret; }

  getReturnType(): Type { return this.getType(); }

  getChildrenParameter(index: number): EParameter { return this.childrens[index]; }
  getChildrenParameterSelector(index: number): string { return this.getChildrenParameter(index).getSelector(); }

  getVisibilityChar(): string {
    switch (this.visibility) {
      case AccessModifier.public: return '+';
      case AccessModifier.private: return '-';
      case AccessModifier.protected: return '#';
      case AccessModifier.internal:
      case AccessModifier.package: return '~';
      case AccessModifier.protectedinternal: return '#~';
      case AccessModifier.protectedprivate: return '#-';
      default: return '?'; } }

  getClass(): IClass { return this.parent; }
  conformability(metaparent: ModelPiece, outObj?: any, debug?: boolean): number { U.pe(true, 'operation.conformability()'); return 0; }

  duplicate(nameAppend: string = '_Copy', newParent: M2Class = null): EOperation {
    const c: EOperation = new EOperation(this.parent, null);
    c.copy(this); return c; }

  copy(c: EOperation, nameAppend: string = '_Copy', newParent: M2Class = null): void {
    super.copy(c, nameAppend, newParent);
    this.exceptionsStr = c.exceptionsStr;
    //// set childrens
    // this.arguments = []; for (i = 0; i < this.childrens.length; i++) { U.ArrayAdd(this.arguments, this.childrens[i]); }
    this.refreshGUI(); }

  generateModel(loopDetectionObj: Dictionary<number /*MClass id*/, MClass> = null): Json {
    const parameters: Json[] = [];
    const json: Json = {};
    json[ECoreOperation.eParameters] = parameters;
    /*
						"_name": "EExceptionNameCustom",
						"_ordered": "false",
						"_unique": "false",
						"_lowerBound": "5",
						"_upperBound": "7",
						"_eType": "#//Casa",
						"_eExceptions": "#//Casa #//League ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt",
						"eParameters": [ ]*/
    Json.write(json, ECoreOperation.namee, this.name);
    Json.write(json, ECoreOperation.eType, this.getType().toEcoreString() );
    Json.write(json, ECoreOperation.lowerBound, '' + this.lowerbound);
    Json.write(json, ECoreOperation.upperBound, '' + this.upperbound);
    Json.write(json, ECoreOperation.eexceptions, this.exceptionsStr);
    Json.write(json, ECoreOperation.ordered, '' + this.ordered);
    Json.write(json, ECoreOperation.unique, '' + this.unique);
    let i: number;
    for (i = 0; i < this.childrens.length; i++) { parameters.push(this.childrens[i].generateModel(loopDetectionObj)); }
    return json; }

  getInfo(toLower: boolean = false): any {
    const info: any = super.getInfo(toLower);
    Info.unset(info, 'instances');
    Info.rename(info, 'type', 'returnType');
    Info.rename(info, 'typeDetail', 'returnTypeDetail');
    return info; }

  parse(json: Json, destructive?: boolean): void {
    this.setName( (this.parent instanceof M3Class) ? 'Operation' : Json.read<string>(json, ECoreOperation.namee, 'Func_1'));
    this.setType(Json.read<string>(json, ECoreOperation.eType, AttribETypes.void));
    this.setLowerbound(+Json.read<number>(json, ECoreOperation.lowerBound, 'NAN_Trigger'));
    this.setUpperbound(+Json.read<number>(json, ECoreOperation.upperBound, 'NAN_Trigger'));
    this.exceptionsStr = Json.read<string>(json, ECoreOperation.eexceptions, '');
    this.ordered = 'true' === '' + Json.read<boolean>(json, ECoreOperation.ordered, 'false');
    this.unique = 'true ' === '' + Json.read<boolean>(json, ECoreOperation.unique, 'false');
    this.visibility = AccessModifier.package;
    const parameters: Json[] = Json.getChildrens(json, false);
    let i: number;
    for (i = 0; i < parameters.length; i++) {
      const param: EParameter = new EParameter(this, parameters[i]);
      // U.ArrayAdd(this.arguments, param);
      U.ArrayAdd(this.childrens, param); }/*
    this.views = [];
    for(i = 0; i < this.parent.views.length; i++) {
      const pv: ClassView = this.parent.views[i];
      const v = new OperationView(pv);
      this.views.push(v);
      pv.operationViews.push(v); }*/

    /*  https://codebeautify.org/xmltojson
				"Operations": [ {
						"_name": "EExceptionNameCustom",
						"_ordered": "false",
						"_unique": "false",
						"_lowerBound": "5",
						"_upperBound": "7",
						"_eType": "#//Casa",
						"_eExceptions": "#//Casa #//League ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt" },
					{
						"eParameters": [
							{
								"_eType": "#//Casa"
							},
							{
								"eAnnotations": {
									"_source": "annotationtext",
									"_references": "#//Umano/anni #//Umano/Attribute_1"
								},
								"_name": "dbl",
								"_ordered": "false",
								"_unique": "false",
								"_lowerBound": "1",
								"_upperBound": "2",
								"_eType": "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble"
							}
						],
						"_name": "operationDam"
					}
				],*/
  }

  public getSignature(maxarguments: number = Number.POSITIVE_INFINITY): string {
    let parameterStr = '';
    maxarguments = Math.min(maxarguments, this.childrens.length);
    let i: number;
    const debug: boolean = false;
    const separator = ', ';
    for (i = 0; i < maxarguments; i++) {
      if (i !== 0) { parameterStr += separator; }
      U.pif(debug, 'parameter[' + i + '] = ', this.childrens[i]);
      U.pif(debug, 'parameterStr: |' + parameterStr + '| --> |' + parameterStr + this.childrens[i].getType().toShortString() + '|');
      parameterStr += this.childrens[i].getType().toShortString(); }
    return parameterStr; }

  setSignatureHtml(html: HTMLElement, separator: string, maxargumentchars: number = null, maxarguments: number = null): void {
    const debug: boolean = false && true;
    maxargumentchars = isNaN(+maxargumentchars) ? 10 : +maxargumentchars;
    maxarguments = isNaN(+maxarguments) ? 2 : +maxarguments;
    const fixName = (s: string): string => {
      U.pif(debug, 'fixname: |' + s + '| --> |' + s.substring(0, maxargumentchars - 1) + '…|');
      if (s.length > maxargumentchars) { return s.substring(0, maxargumentchars - 1) + '…'; }
      return s; };
    let i: number;
    let parameterStr = this.getSignature(maxarguments);
    U.pif(debug, 'finalSignature: ', this.getVisibilityChar(), fixName(this.name), parameterStr,
      fixName(this.type.toShortString()), this);
    // todo: innerText is not standard, switch to textContent
    html.innerHTML = '&nbsp'; // == ' '
    html.textContent += this.getVisibilityChar() + '' + fixName(this.name) + '(' + parameterStr + ') → ' // → ⇒
      + this.type.toShortString();
    html.dataset.visibility = this.visibility;
    html.dataset.exceptions = this.exceptionsStr; }

  setType(ecoreTypeString: string, throwError: boolean = true, refreshGui: boolean = true): boolean{
    let ret = super.setType(ecoreTypeString, throwError, refreshGui);
    if (!ret) return false;
    if (this.parent instanceof M2Class) this.parent.calculateInheritanceViolations(true);
    return true; }

  // getReturnType(): EParameter { return this.getFakeReturnTypeParameter(); }
/*
  getFakeReturnTypeParameter(): EParameter {
    const fake: EParameter = new EParameter(null, null);
    U.arrayRemoveAll(this.childrens, fake);
    fake.parent = this; // can travel fake -> original, can't original -> fake.
    fake.id = this.id;
    fake.ordered = this.ordered;
    fake.unique = this.unique;
    fake.setLowerbound(this.getLowerbound());
    fake.setUpperbound(this.getUpperbound());
    fake.setType(this.getType().toEcoreString());
    fake.name = '';
    return fake; }*/

  addParameter(): EParameter {
    const p: EParameter = new EParameter(this, null);
    U.ArrayAdd(this.childrens, p);
    return p; }

  markIncompatibility(other: EOperation){
    U.pw(true, 'Marked operations are incompatible toghether.');
    this.mark(true, other, 'incompatibility:' + this.id + '_' + other.id, null); }

  unmarkIncompatibility(other: EOperation): void{
    console.log('mark: unmark:', this.id + '_' + other.id, this);
    this.mark(false, other, 'incompatibility:' + this.id + '_' + other.id, null); }

  unmarkAllIncompatibility(): void{
    return;
    // super.unmarkAll((key: string) => { return key.indexOf('incompatibility') === 0; });
  }



  delete(refreshgui: boolean = true): void{
    super.delete(true);
  }

  markedCompatibility: {key: string, target: EOperation}[] = [];
}
