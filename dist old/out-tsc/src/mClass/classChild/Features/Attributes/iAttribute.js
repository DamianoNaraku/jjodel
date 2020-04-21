import { IFeature, U } from '../../../../common/Joiner';
export class IAttribute extends IFeature {
    constructor(parent, metaParent) {
        super(parent, metaParent);
        if (parent)
            U.ArrayAdd(parent.attributes, this);
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
    copy(other, nameAppend = '_Copy', newParent = null) {
        super.copy(other, nameAppend, newParent);
        if (newParent) {
            U.ArrayAdd(newParent.attributes, this);
        }
        this.refreshGUI();
    }
}
export class M3Attribute extends IAttribute {
    constructor(parent, meta) {
        super(parent, meta);
        this.parse(null, true);
    }
    duplicate(nameAppend = '_', newParent = null) { U.pe(true, 'Invalid operation: m3Attr.duplicate()'); return this; }
    generateModel() {
        U.pe(true, 'm3Attr.generateModel()');
        return {};
    }
    // getType(): Type { U.pe(true, 'm3Attr.getType()'); return null; }
    parse(json, destructive = true) {
        this.name = 'Attribute';
    }
    conformability(metaparent, outObj, debug) { return 1; }
}
//# sourceMappingURL=iAttribute.js.map