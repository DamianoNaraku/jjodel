import {
  IClass,
  IFeature,
  Json,
  M2Attribute, M3Class, M3Feature, M3Reference, PropertyBarr,
  ShortAttribETypes,
  Status, Type,
  U
} from '../../../../common/Joiner';

export abstract class IAttribute extends IFeature {
  metaParent: IAttribute;
  instances: IAttribute[];

  constructor(parent: IClass, metaParent: IAttribute) {
    super(parent, metaParent);
    if (parent) U.ArrayAdd(parent.attributes, this);
  }

  /*static GetDefaultStyle(modelRoot: IModel, type: EType = null): HTMLElement | SVGElement {
    return ModelPiece.GetDefaultStyle(modelRoot, 'Attribute', type); }

  static SetDefaultStyle(type: ShortAttribETypes, modelRoot: IModel, newTemplate: HTMLElement): void {
    const selector = '.' + (modelRoot.isM() ? 'M' : 'MM') + 'DefaultStyles>.Attribute.Template.' + type;
    let $oldTemplate: JQuery<HTMLElement> = $(selector + '.Customized');
    if ($oldTemplate.length === 0) { $oldTemplate = $(selector); }
    U.pe($oldTemplate.length !== 1, 'template not found? (' + $oldTemplate.length + '); selector: "' + selector + '"');
    const old = $oldTemplate[0];
    newTemplate.classList.add('template');
    newTemplate.classList.add('Customized');
    old.parentNode.appendChild(newTemplate);
    if (old.classList.contains('Customized')) { old.parentNode.removeChild(old); }
    return; }

  setDefaultStyle(value: string): void {
    U.pw(true, 'Attribute.setDefaultStyle(): todo.');
  }
*/

/*
  getStyle(): HTMLElement | SVGElement {
    const htmlRaw: HTMLElement | SVGElement = super.getStyle();
    const $html = $(htmlRaw);
    const $selector = $html.find('select.TypeSelector') as JQuery<HTMLSelectElement>;
    let i: number;
    for (i = 0; i < $selector.length; i++) { PropertyBarr.makePrimitiveTypeSelector($selector[0], this.getType()); }
    // EType.updateTypeSelector($selector[0] as HTMLSelectElement, this.getType());
    return htmlRaw; }*/

  copy(other: IAttribute, nameAppend: string = '_Copy', newParent: IClass = null): void {
    super.copy(other, nameAppend, newParent);
    if (newParent) { U.ArrayAdd(newParent.attributes, this); }
    this.refreshGUI(); }

}

export class M3Attribute extends IAttribute {
  parent: M3Class;
  metaParent: M3Attribute;
  instances: M2Attribute[]; // | M3Attribute[]

  constructor(parent: M3Class, meta: IAttribute) {
    super(parent, meta);
    this.parse(null, true); }

  duplicate(nameAppend: string = '_', newParent: M3Class = null): M3Attribute { U.pe(true, 'Invalid operation: m3Attr.duplicate()'); return this; }

  generateModel(): Json {
    U.pe(true, 'm3Attr.generateModel()');
    return {}; }

  // getType(): Type { U.pe(true, 'm3Attr.getType()'); return null; }

  parse(json: Json, destructive: boolean = true): void {
    this.name = 'Attribute'; }


  conformability(metaparent: M3Attribute, outObj?: any, debug?: boolean): number {  return 1; }

}
