import {
  AttribETypes,
  IAttribute,
  M2Class,
  IFeature,
  IReference,
  Json,
  MClass,
  ModelPiece,
  ShortAttribETypes, M2Attribute,
  U, M3Attribute, IVertex, IField, MetaModel, Model, Status, Info, Type, EEnum, ELiteral, Dictionary,
} from '../../../../common/Joiner';
import {del}   from 'selenium-webdriver/http';
import {EType} from '../../Type';
import ChangeEvent = JQuery.ChangeEvent;


export class MAttribute extends IAttribute {
  static stylesDatalist: HTMLDataListElement;
  parent: MClass;
  metaParent: M2Attribute;
  // instances: ModelNone[];
  values: any[];
  valuesStr: string;

  static typeChange(arr: any[], newType: EType): void {
    let i = -1;
    while (++i < arr.length) {
      if (Array.isArray(arr[i])) { MAttribute.typeChange(arr[i], newType); continue; }
      let newVal: any;
      switch (newType.short) {
        default: U.pe(true, 'unexpected type: ' + newType.short); break;
        case ShortAttribETypes.EDate: newVal = null; break;
        case ShortAttribETypes.EFloat: case ShortAttribETypes.EDouble:
          newVal = parseFloat('' + arr[i]);
          if (newVal === null || newVal === undefined) { newVal = newType.defaultValue; }
          break;
        case ShortAttribETypes.EBoolean: newVal = !!arr[i]; break;
        case ShortAttribETypes.EChar:
          newVal = (arr[i] + '')[0];
          if (newVal === undefined || newVal === null) { newVal = newType.defaultValue; }
          break;
        case ShortAttribETypes.EString: newVal = (arr[i] === null || arr[i] === undefined ? null : '' + arr[i]); break;
        case ShortAttribETypes.EInt: case ShortAttribETypes.EByte: case ShortAttribETypes.EShort: case ShortAttribETypes.ELong:
          let tentativo: number = parseInt('' + arr[i], 10);
          tentativo = !isNaN(+tentativo) ? (+tentativo) : newType.defaultValue;
          tentativo = Math.min(newType.maxValue, Math.max(newType.minValue, tentativo));
          newVal = tentativo;
          break;
      }
      U.pe(newVal === null || newVal === undefined, 'failed to fix value:', arr, newType);
      arr[i] = newVal;
    }
  }

  constructor(parent: MClass, json: Json, meta: M2Attribute) {
    super(parent, meta);
    this.parse(json, true); }

    test(){
      // var topp={x:'$##@WallTopX.values.0$',y:0};var bot={x:'$##@WallBotX.values.0$',y:'$##@WallHeight.values.0$'};if(bot.y<=topp.y){return}e.B9=90+DEGREE(Math.atan((topp.x-bot.x)/(topp.y-bot.y)));

    }

  getModelRoot(acceptNull: boolean = false): Model { return super.getModelRoot(acceptNull) as Model; }

  parse(json: Json, destructive: boolean): void {
    // if (!json) { json = }
    this.setValues(json as any[]);/*
    if (!this.validate()) {
      this.setValues(null);
      U.pw(true, 'marked attribute (' + this.metaParent.name + ') with type ', this.getType(), 'values:', this.values, 'this:', this);
      this.mark(true, 'errorValue');
    } else { this.mark(false, 'errorValue'); }*/
    // this.refreshGUI();
/*
    this.views = [];
    let i: number;
    for(i = 0; i < this.parent.views.length; i++) {
      const pv: ClassView = this.parent.views[i];
      const v = new AttributeView(pv);
      this.views.push(v);
      pv.attributeViews.push(v); }*/
  }

  endingName(valueMaxLength: number = 10): string {
    if (this.values && this.values.length > 0) { return (this.values[0] + '').substr(0, valueMaxLength); }
    return ''; }

  getType(): Type { return (this.metaParent ? this.metaParent.getType() : null); }

  getInfo(toLower: boolean = false): any {
    const info: any = super.getInfo();
    Info.set(info, 'values', this.values);
    return info; }
/*
  conformability(meta: IAttribute, debug: boolean = true): number {
    let conformability = 0;
    // todo: questo check è totalmente sbagliato, this.getType non può riuscire senza un metaParent assegnato
    conformability += 0.5 * StringSimilarity.compareTwoStrings(this.getType().short, meta.getType().primitiveType.short);
    conformability += 0.5 * StringSimilarity.compareTwoStrings(this.name, meta.name);
    U.pif(debug, 'ATTRIBUTE.comform(', this.name, {0: this}, ', ', meta.name, {0: meta}, ') = ', conformability);
    return conformability; }*/

  duplicate(nameAppend: string = null, newParent: MClass = null): MAttribute {
    const ret: MAttribute = new MAttribute(newParent, null, this.metaParent);
    ret.copy(this, nameAppend, newParent);
    return ret; }

  copy(other: MAttribute, nameAppend: string = '_Copy', newParent: MClass = null): void {
    super.copy(other, nameAppend, newParent);
    this.setValueStr(other.getValueStr()); }

  generateModel(loopDetectionObj: Dictionary<number /*MP id*/, ModelPiece> = null): Json | string {
    if (this.values.length === 0) { return null; }
    let values: Json[] = this.values;
    if (this.values[0] instanceof ELiteral) {
      values = [];
      let i: number;
      for (i = 0; i < this.values.length; i++) {
        const v = this.values[i];
        if (v instanceof ELiteral) { values.push(v.generateModelM1(loopDetectionObj)); }
      }
    }
    if (values.length === 1) { return values[0]; }
    return values; }

  validate(): boolean {
    let i: number;
    const primitive: EType = this.getType().primitiveType;
    const enumtype: EEnum = this.getType().enumType;
    if (enumtype) {
      const admittedValues: string[] = enumtype.getAllowedValuesStr();
      for (i = 0; i < this.values.length; i++) {
        if (!U.arrayContains(admittedValues, this.values[i])) { return false; }
      }
      return true; }
    U.pe(!primitive, 'found type in Mattribute that is neither primitive nor enumerative', this);
    // console.log('U.isIntegerArray(values:', this.values, ', minvalue:', primitive.minValue, ' maxval:', primitive.maxValue);
    switch (primitive.long) {
    default: U.pe(true, 'unexpected mattrib type:', this.getType()); return false;
      // case AttribETypes.void: ...
      case AttribETypes.EDate: U.pe(true, 'eDAte: todo'); break;
      case AttribETypes.EBoolean: return true;
      case AttribETypes.EChar: return U.isString(this.values) || U.isCharArray(this.values);
      case AttribETypes.EString: return U.isStringArray(this.values);
      case AttribETypes.EFloat:
      case AttribETypes.EDouble:
        for (i = 0; i < this.values.length; i++) { this.values[i] = +this.values[i]; }
        return U.isNumberArray(this.values, primitive.minValue, primitive.maxValue);
      case AttribETypes.EByte:
      case AttribETypes.EShort:
      case AttribETypes.EInt:
      case AttribETypes.ELong:
        for (i = 0; i < this.values.length; i++) { this.values[i] = +this.values[i]; }
        return U.isIntegerArray(this.values, primitive.minValue, primitive.maxValue);
    }
  }

  fieldChanged(e: ChangeEvent) {
    console.log('fieldchanged m1 attr', e);
    const html: HTMLElement = e && e.currentTarget;
    if (e) switch (html.tagName.toLowerCase()) {
      default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
      case 'textarea':
      case 'input':
        this.setValueStr((html as HTMLInputElement).value);
        (html as HTMLInputElement).value = this.getValueStr();
        break;
      case 'select': U.pe(true, 'Unexpected non-disabled select field in a Vertex.MAttribute.'); break;
    }
    super.fieldChanged(e, true);
  }

  setValueStr(valStr: string) {
    valStr = valStr && valStr.trim() || ''; // .replace(/\s'|,'/g, '"').replace(/\\\\'/g, "\\'") || '';
    if (this.metaParent.upperbound === 1) {
      // this.setValues(JSON.parse( '"' + U.replaceAll(valStr, '"', '\\"') + '"'));
      this.setValues([ valStr ]);
      return; }
    if (valStr[0] !== '[') valStr = '[' + valStr + ']';
    try {
      this.setValues(eval(valStr));
    } catch (e) {
      U.pw(true, 'This attribute have upperbound > 1 and the input is not a valid JSON string: ' + valStr, e);
      return; } finally {}
  }
  // setValues: applicabile alle M1-Feature, se index < 1  index = upperbound - index, se index = null values deve essere array.
  setValues(values: any[] | any = null, index: number = null, autofix: boolean = true, debug: boolean = false): void {
    if (index < 0) index = (this.getUpperbound() - index) % this.getUpperbound();
    if (index !== null && index !== undefined) { this.values[index] = values; }
    debug = true;
    debug = true;
    const values0 = values;
    if (U.isEmptyObject(values, true, true)
     || (Array.isArray(values) && (values.length === 0 || (values.length === 1 && U.isEmptyObject(values[0])))))
       { values = this.getType().defaultValue(); } // redundancy, i'm double fixing it. should check if autofix fixes nulls.
    if (!Array.isArray(values)) { values = [values]; }
    // U.pe(values0 === null && values.length === 1 && values[0] === [0], 'wtf?', values0, values, this);
    if (debug) console.trace();
    U.pif(debug, this.metaParent.fullname() +  '.setvalue: |', values0, '| --> ', values, {defaultv: this.getType().defaultValue(), type: this.getType(), upperbound: this.getUpperbound()});
    this.values = values;
    if (this.getUpperbound() >= 0) { this.values.length = this.getUpperbound(); }
    U.pe('' + values === '' + undefined || '' + values === '' + null, 'undef:', values, this);
    U.pif(debug, 'end value:', values);
    if (autofix) { this.valuesAutofix(debug); }
    U.pif(debug, 'end value post autofix:', this.values);
  }

  valuesAutofix(debug: boolean = false): void {
    const type: Type = this.getType();
    const conversionType = type.enumType || type.primitiveType;
    let i: number;
    if (type.enumType) {
      // conversionType = null; // EType.get(ShortAttribETypes.EString);
      const defaultValue: string = type.enumType.getDefaultValueStr();
      if (!defaultValue) {
        this.values = [];
        if (this.getUpperbound() >= 0) { this.values.length = this.getUpperbound(); }
        return; }
      const admittedValues: string[] = type.enumType.getAllowedValuesStr();
      let j: number;
      for (j = 0; j < this.values.length; j++) {
        this.values[j]+= '';
        if (U.arrayContains(admittedValues,  this.values[j])) { continue; }
        this.values[j] = admittedValues[0];
      }
    }
    if (type.primitiveType) { MAttribute.typeChange(this.values, type.primitiveType); }
  }
  getValueStr(debug: boolean = false): string {
    let ret: any[] | any;
    ret =  this.values;
    U.pif(debug, 'getvaluestr: stage1', ret);
    if (ret === undefined) ret = null;
    let retStr = null;
    if (ret !== null) {
      if (!(Array.isArray(ret))) { ret = [ret]; }
      U.pif(debug, 'stage 1.1:', ret, retStr);
      if (this.metaParent.upperbound === 1) { ret = ret.length ? ret[0] : null; }
      U.pif(debug, 'stage 1.2:', ret, retStr);
      retStr = Array.isArray(ret) ? JSON.stringify(ret) : (ret === null || ret === undefined ? null : '' + ret); }
    U.pif(debug, 'stage2', ret, retStr);
    if (retStr === null) {
      this.setValues(null);
      U.pe(!this.values.length || this.values[0] === null, 'failed to set default val.', this.getType().defaultValue(), this.values );
      retStr = (this.values.length ? '' + this.values[0] : null); }

    U.pif(debug, 'this.values:', this.values, ', val[0]:', this.values[0], 'retStr:', retStr);
    this.valuesStr = retStr;
    return retStr; }

  replaceVarsSetup(debug: boolean = false): void {
    super.replaceVarsSetup();
    const old = this.valuesStr;
    U.pif(debug, this.values);
    const val: string = this.getValueStr() || '';
    U.pif(debug, 'val:', val, ', this.values:', this.values, ', this:', this);
    this.valuesStr = U.replaceAll(val, '\n', '', debug);
    // this.valuesStr = '["1", "2", "33"]'
    if (this.valuesStr && this.getUpperbound() !== 1 && this.valuesStr[0] === '[') {this.valuesStr = this.valuesStr.substr(1, this.valuesStr.length - 2); }
    U.pif(debug, 'valuesSTR: |' + old + '| --> |' + this.valuesStr + '|'); }

}

