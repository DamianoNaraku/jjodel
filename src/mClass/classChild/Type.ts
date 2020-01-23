import {
  AttribETypes,
  Dictionary,
  EEnum,
  EOperation,
  EParameter,
  M2Attribute,
  M2Class,
  M2Package,
  M2Reference,
  MAttribute,
  ModelPiece,
  ShortAttribETypes,
  Status,
  Typedd,
  U
} from '../../common/Joiner';
import ChangeEvent = JQuery.ChangeEvent;

export class Type {
  public static all: Type[] = [];
  private static idMax: number = 0;
  private static allByID: Dictionary<number, Type> = {};
  static classTypePrefix: string = '#//';
  private typestr: string;
  public primitiveType: EType = null;
  public classType: M2Class = null;
  public enumType: EEnum = null;
  public owner: ModelPiece = null; // todo: cambia to Typedd
  private id: number;
  public printablename: string;

  static updateTypeSelectors($searchRoot: JQuery<HTMLElement>, primitives: boolean = true, enums: boolean = true, classes: boolean = true): void{
    if (!$searchRoot) { $searchRoot = $(document.body); }
    let key = U.getStartSeparatorKey();
    const query = (primitives ? U.startSeparator(key) + 'select[data-primitive="true"]' : '') +
      (enums ? U.startSeparator(key) + 'select[data-enum="true"]' : '') +
      (classes ? U.startSeparator(key) + 'select[data-class="true"]' : '');
    key = U.getStartSeparatorKey();
    const notquery = (primitives ? U.startSeparator(key) + '.template select[data-primitive="true"]' : '') +
      (enums ? U.startSeparator(key) + '.template select[data-enum="true"]' : '') +
      (classes ? U.startSeparator(key) + '.template select[data-class="true"]' : '');
//    console.log(query);
    const $selects: JQuery<HTMLSelectElement> = $searchRoot.find(query).not(notquery) as any;
    for (let i = 0; i < $selects.length; i++) { Type.updateTypeSelector($selects[i]); }
    if (classes && Status.status.m &&  Status.status.m.sidebar) { Status.status.m.sidebar.updateAll(); }
  }
  static updateTypeSelector(selectHtml: HTMLSelectElement): void{
    const addPrimitive = selectHtml.dataset.primitive === "true";
    const addEnum = selectHtml.dataset.enum === "true";
    const addClass = selectHtml.dataset.class === "true";
    const addVoid = selectHtml.dataset.void === "true";
    const type: Type = Type.get(+selectHtml.dataset.typeid);
    Type.makeTypeSelector(selectHtml, type, addPrimitive, addEnum, addClass, addVoid); }

  private static selectors: {all: HTMLSelectElement[], primitives: HTMLSelectElement[], classes: HTMLSelectElement[], enums: HTMLSelectElement[]}
    = {all: [], primitives: [], classes: [], enums: []};

  private static makeTypeSelector(selectHtml: HTMLSelectElement, selectedType: Type, addPrimitive: boolean, addEnum: boolean, addClass: boolean, addVoid: boolean): void {
    U.pe(!selectHtml, 'select is null');
    U.clear(selectHtml);
    const mp: ModelPiece = ModelPiece.getLogic(selectHtml) as Typedd;
    if (mp && mp instanceof Typedd) {
      selectedType = mp.getType();
      $(selectHtml).off('change.type').on('change.type', (e: ChangeEvent) => { mp.fieldChanged(e); });
    } else return; //U.pw(true, 'type selector inserted on non-typed element:', selectHtml, mp);
    selectHtml.dataset.typeid = '' + selectedType.id;
    selectHtml.dataset.primitive = '' + (addPrimitive ? "true" : "false");
    selectHtml.dataset.enum = '' + (addEnum ? "true" : "false") ;
    selectHtml.dataset.class = '' + (addClass ? "true" : "false");
    selectHtml.dataset.void = '' + (addVoid ? "true" : "false");

    const grpReturn: HTMLOptGroupElement = document.createElement('optgroup');
    const grpPrimitive: HTMLOptGroupElement = document.createElement('optgroup');
    const grpEnum: HTMLOptGroupElement = document.createElement('optgroup');
    const grpClass: HTMLOptGroupElement = document.createElement('optgroup');
    grpReturn.label = 'Return Types';
    grpPrimitive.label = 'Primitive Types';
    grpEnum.label = 'Enumerative Types';
    grpClass.label = 'ClassReference Types';
    let optionFound = false;
    let key: string;
    let i: number;
    const foundit = (opt: HTMLOptionElement) => { optionFound = true; opt.setAttribute('selected', ''); opt.selected = true; };
    // primitive:
    if (addPrimitive) {
      for (key in EType.shorts) {
        if (!EType.shorts[key]) { continue; }
        const etype: EType = EType.shorts[key];
        if (etype.short === ShortAttribETypes.void && !addVoid) { continue; }
        const opt: HTMLOptionElement = document.createElement('option');
        grpPrimitive.appendChild(opt);
        opt.value = etype.long;
        opt.innerHTML = etype.name;
        if (selectedType && etype === selectedType.primitiveType) { foundit(opt); }} }
    // primitive end
    // Enum Start:
    if (addEnum) {
      const enumarr: EEnum[] = Status.status.mm.getAllEnums();
      for (i = 0; i < enumarr.length; i++) {
        const e: EEnum = enumarr[i];
        const opt: HTMLOptionElement = document.createElement('option');
        grpEnum.appendChild(opt);
        opt.value = e.getEcoreTypeName();
        opt.innerHTML = e.name;
        if (e === selectedType.enumType) { foundit(opt); } }
    }

    // Enum End:
    // class Start:
    if (addClass) {
      const classarr: M2Class[] = Status.status.mm.getAllClasses();
      for (i = 0; i < classarr.length; i++) {
        const e: M2Class = classarr[i];
        const opt: HTMLOptionElement = document.createElement('option');
        grpClass.appendChild(opt);
        opt.value = e.getEcoreTypeName();
        opt.innerHTML = e.name;
        if (e === selectedType.classType) { foundit(opt); } }
    }

    // class End:

    U.ArrayAdd(Type.selectors.all, selectHtml);
    if (addPrimitive) { U.ArrayAdd(Type.selectors.primitives, selectHtml); }
    if (addEnum) { U.ArrayAdd(Type.selectors.enums, selectHtml); }
    if (addClass) { U.ArrayAdd(Type.selectors.classes, selectHtml); }
    if (grpReturn.children.length) selectHtml.appendChild(grpReturn);
    if (grpPrimitive.children.length) selectHtml.appendChild(grpPrimitive);
    if (grpEnum.children.length) selectHtml.appendChild(grpEnum);
    if (grpClass.children.length) selectHtml.appendChild(grpClass);
    U.pe(selectedType && !optionFound, 'selected type option not found; select:', selectHtml,
      ' EType.shorts:', EType, EType.shorts, ', searchedVal:', selectedType);
  }


  public static linkAll(): void { for (let i: number = 0; i < Type.all.length; i++) { Type.all[i].applyTypeStr(); } }

  private static get(id: number): Type { return Type.allByID[id]; }
  constructor(owner: ModelPiece, typestr: string = null) {
    this.owner = owner;
    this.typestr = typestr;
    this.id = Type.idMax++;
    Type.allByID[this.id] = this;
    Type.all.push(this); }

  changeType(typestr: string = null, primitiveType: EType = null, classType: M2Class = null, enumType: EEnum = null): void {
    U.pe((typestr ? 1 : 0) + (primitiveType ? 1 : 0) + (classType ? 1 : 0) !== 1,
      'changeType(): exactly one argument is required. str:', typestr, 'primitive:', primitiveType, 'classType:', classType);
    if (!(typestr || primitiveType || classType || enumType)) return;
    if (typestr) { this.typestr = typestr; }
    if (primitiveType) { this.typestr = primitiveType.long; }
    if (classType) { this.typestr = classType.getEcoreTypeName(); }
    if (enumType) { this.typestr = enumType.getEcoreTypeName(); }
    this.applyTypeStr(); }

  defaultValue(): any {
    if (this.primitiveType) return this.primitiveType.defaultValue;
    if (this.enumType) return this.enumType.childrens[0].name;
    return null; }

  private applyTypeStr(): void {
    if (!this.typestr || !Status.status.mm) return;
    this.applyTypeStr0();
    if (this.primitiveType) this.printablename = this.primitiveType.name;
    if (this.enumType) this.printablename = this.enumType.name;
    if (this.classType) this.printablename = this.classType.name ? this.classType.name : this.classType.metaParent.name;
    if (this.typestr === '???void') this.printablename = 'void';
    U.pe(!this.printablename, this);
  }
  private applyTypeStr0(): void {
    const debug = true;
    let i: number;
    let oldClass = this.classType;
    let oldEnum = this.enumType;
    let oldPrimitive = this.primitiveType;
    this.enumType = this.classType = this.primitiveType = null;
    let typestr: string = this.typestr;
    // this.typestr = null;
    if(debug) { U.cclear(); }
    U.pif(debug, 'changeType()', this, this.typestr);
    this.primitiveType = EType.getFromLongString(typestr, false);
    if (!this.primitiveType) {
      U.pe(typestr.indexOf(Type.classTypePrefix) !== 0, 'allyTypeStr(): found typestr neither primitive nor classifier.', this.typestr, this);
      const s: string = typestr.substr(Type.classTypePrefix.length);
      const packages: M2Package[] = Status.status.mm.childrens;
      for (i = 0; i < packages.length; i++) {
        const pkg: M2Package = packages[i];
        const c: M2Class = pkg.getClass(s);
        if (c) { this.classType = c; break; }
        const e: EEnum = pkg.getEnum(s);
        if (e) { this.enumType = e; break; } }
    }
    U.pe(!this.primitiveType && !this.enumType && !this.classType, 'failed to find target: |' + typestr + '|', Status.status.mm);

    if (this.owner instanceof M2Reference) {
      if (oldClass === this.classType) return;
      if (oldClass) { U.arrayRemoveAll(oldClass.referencesIN, this.owner); }
      this.classType.referencesIN.push(this.owner);
      if (this.owner.edges && this.owner.edges.length) { this.owner.edges[0].setTarget(this.classType.vertex); this.owner.edges[0].refreshGui(); }
      U.pif(debug, 'ref target changed; type:' + this + 'inside:', this.owner);
      this.owner.refreshGUI();
      U.pif(debug, 'exit2: m2reference');
      return; }

    U.pif(debug, 'typechanged:', this.owner, this);
    if (this.owner instanceof M2Attribute) {
      for (i = 0; i < this.owner.instances.length; i++) { this.owner.instances[i].valuesAutofix(); }
      this.owner.refreshGUI();
      U.pif(debug, 'exit3: attrib.');
      return; }
    if (this.owner instanceof EOperation) {
      this.owner.refreshGUI();
      return; }
    if (this.owner instanceof EParameter) {
      this.owner.refreshGUI();
      return; }
    U.pe(true, 'unexpected owner instance in changeType():', this);

  }

  toEcoreString(): string {
    if (this.classType) return Type.classTypePrefix + this.classType.name;
    if (this.enumType) return Type.classTypePrefix + this.enumType.name;
    if (this.primitiveType) return this.primitiveType.long;
    return null; }
  toShortString(): string {
    if (this.classType) return '' + this.classType.name;
    if (this.enumType) return '' + this.enumType.name;
    if (this.primitiveType) return '' + this.primitiveType.name;
    return null; }

}


export class EType {
  static shorts: Dictionary<ShortAttribETypes, EType> = {};
  name: string = null;
  long: AttribETypes = null;
  short: ShortAttribETypes = null;
  defaultValue: any = null;
  minValue: number;
  maxValue: number;
  constructor(long: AttribETypes, short: ShortAttribETypes, defaultVal: any, minValue: number = null, maxValue: number = null) {
    U.pe(EType.shorts[short], 'etype created twice:', EType.shorts[short]);
    EType.shorts[short] = this;
    this.long = long;
    this.short = short;
    this.defaultValue = defaultVal;
    this.minValue = minValue;
    this.maxValue = maxValue;
    const alias = Status.status.typeAliasDictionary[short];
    this.name = alias ? alias : short; }
  static staticInit(): Dictionary<ShortAttribETypes, EType> {
    EType.shorts = {};
    let noWarning: EType;
    noWarning = new EType(AttribETypes.void, ShortAttribETypes.void, undefined);
    noWarning = new EType(AttribETypes.EDate, ShortAttribETypes.EDate, ' ');
    noWarning = new EType(AttribETypes.EChar, ShortAttribETypes.EChar, ' ');
    noWarning = new EType(AttribETypes.EString, ShortAttribETypes.EString, '');
    noWarning = new EType(AttribETypes.EBoolean, ShortAttribETypes.EBoolean, true);
    noWarning = new EType(AttribETypes.EByte, ShortAttribETypes.EByte, 0, -128, 127);
    noWarning = new EType(AttribETypes.EShort, ShortAttribETypes.EShort, 0, -32768, 32767);
    noWarning = new EType(AttribETypes.EInt, ShortAttribETypes.EInt, 0, -2147483648, 2147483647);
    noWarning = new EType(AttribETypes.ELong, ShortAttribETypes.ELong, 0, -9223372036854775808, 9223372036854775808);
    noWarning = new EType(AttribETypes.EFloat, ShortAttribETypes.EFloat, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    noWarning = new EType(AttribETypes.EDouble, ShortAttribETypes.EDouble, 0,  Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    return EType.shorts; }

  static getFromLongString(ecorelongstring: string, throww: boolean = true): EType {
    switch (ecorelongstring) {
    default: U.pe(throww, 'Etype.Get() unrecognized type: ', ecorelongstring, '; string: ', AttribETypes.EString); break;
    case AttribETypes.void: return EType.get(ShortAttribETypes.void);
    case AttribETypes.EChar: return EType.get(ShortAttribETypes.EChar);
    case AttribETypes.EString: return EType.get(ShortAttribETypes.EString);
    case AttribETypes.EBoolean: return EType.get(ShortAttribETypes.EBoolean);
    case AttribETypes.EByte: return EType.get(ShortAttribETypes.EByte);
    case AttribETypes.EShort: return EType.get(ShortAttribETypes.EShort);
    case AttribETypes.EInt: return EType.get(ShortAttribETypes.EInt);
    case AttribETypes.ELong: return EType.get(ShortAttribETypes.ELong);
    case AttribETypes.EFloat: return EType.get(ShortAttribETypes.EFloat);
    case AttribETypes.EDouble: return EType.get(ShortAttribETypes.EDouble);
    case AttribETypes.EDate: return EType.get(ShortAttribETypes.EDate); }
    return null; }

  static get(a: ShortAttribETypes): EType { return EType.shorts[a]; }
  static getAlias(a: ShortAttribETypes): string {
    const str = Status.status.typeAliasDictionary[a];
    return !str ? '' + a : Status.status.typeAliasDictionary[a]; }

  changeAlias(value: string) {
    this.name = value;
    Status.status.typeAliasDictionary[this.short] = this.name;
    Status.status.aliasTypeDictionary[this.name] = this.short;
    Status.status.mm.refreshGUI();
    Status.status.m.refreshGUI();
    Status.status.mm.graph.propertyBar.refreshGUI();
    Status.status.m.graph.propertyBar.refreshGUI();
  }

}
