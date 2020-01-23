import {
  AttribETypes, EEnum, ELiteral,
  EOperation,
  EParameter,
  IAttribute,
  IClass, Typedd,
  IModel,
  IPackage,
  IReference,
  M2Attribute,
  M2Class,
  M2Package,
  M2Reference,
  MAttribute,
  MClass,
  MetaModel,
  Model,
  ModelPiece,
  MPackage,
  MReference,
  OperationVisibility,
  ShortAttribETypes,
  Status,
  StyleEditor, Type,
  U, IEdge
} from '../../common/Joiner';
import ClickEvent = JQuery.ClickEvent;
import ContextMenuEvent = JQuery.ContextMenuEvent;

export class PropertyBarr {
  model: IModel = null;
  container: HTMLElement;
  rawTextArea: HTMLTextAreaElement;
  templateContainer: HTMLElement;
  selectedModelPiece: ModelPiece;
  styleEditor: StyleEditor = null;
  selectedModelPieceIsEdge: IEdge;
  clickedLevel: Element;

  private templateMinimizerClick(e: ClickEvent): void {
    const minimizer: HTMLElement = e.currentTarget;
    let templatee: HTMLElement = minimizer;
    while ( !templatee.classList.contains('wastemplate')) { templatee = templatee.parentNode as HTMLElement; }
    templatee.classList.add('minimized');
    $(templatee).off('click.maximizeTemplate').on('click.maximizeTemplate',
      (ee: ClickEvent) => { PropertyBarr.templateMaximizerClick(ee); }).on('contextmenu', (e: ContextMenuEvent) => { this.subTemplateShow(e); });
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault(); }

  private static templateMaximizerClick(e: ClickEvent): void {
    const template: HTMLElement = e.currentTarget;
    template.classList.remove('minimized'); }

  private static makeVisibilitySelector(selectHtml: HTMLSelectElement, visibility: OperationVisibility): HTMLSelectElement {
    if (selectHtml === null) { selectHtml = document.createElement('select'); }
    U.clear(selectHtml);
    const optgrp: HTMLOptGroupElement = document.createElement('optgroup');
    optgrp.label = 'Access Modifier';
    selectHtml.appendChild(optgrp);
    let optionFound = false;
    for (const key in OperationVisibility) {
      if (!OperationVisibility[key]) { continue; }
      const access: string = OperationVisibility[key];
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = access;
      opt.innerHTML = access;
      if (visibility === access) { opt.selected = true; optionFound = true; }
      optgrp.appendChild(opt); }
    U.pe(visibility && !optionFound, 'OperationVisibility selected option not found; optgrp:', optgrp,
      'OperationVisibility:', OperationVisibility, ', searchedVal:', visibility);
    return selectHtml; }

  constructor(model: IModel) {
    this.model = model;
    this.selectedModelPiece = null;
    const $root: JQuery<HTMLElement> = this.get$root();
    this.container = $root.find('.propertySidebarCurrentContent')[0] as HTMLElement;
    this.templateContainer = $root.find('.propertySidebarTemplates')[0] as HTMLElement;
    U.pe( !this.container, 'property bar shell not found in: ', $root);
    U.pe( !this.templateContainer, 'property bar template shell not found in: ', $root);
    this.styleEditor = new StyleEditor(this, $root); }

  private subTemplateShow(e: ContextMenuEvent): boolean {
    const target: HTMLElement = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    if (target.classList.contains('list')) return false;
    const mp = ModelPiece.getLogic(target);
    this.show(mp, mp.getHtmlOnGraph(), null);
    return false; }

  private removeOthers($html: JQuery<HTMLElement>, keep: string): void {
    const toremove: string = '.model, .package, .class, .enum, .attribute, .reference, .operation, .parameter, .literal';
    // ['.model', '.package', '.class', '.enum', '.attribute', '.reference', '.operation', '.parameter', '.literal'];
    const index = toremove.indexOf(keep);
    U.pe(index === -1, 'invalid selector to keep:', keep, toremove);
    // toremove = toremove.substr(0, index - 1) + toremove.substr(index + keep.length);
    $html.find(toremove).not(keep).remove(); }
  private getTemplate(o: ModelPiece, selector: string = 'propertySidebarTemplates', root: HTMLElement = null): JQuery<HTMLElement> {
    // selector = '.propertySidebarTemplates';
    // if (!root) { root = this.templateContainer; }
    // const $html = $(U.cloneHtml<HTMLElement>($(root).find(selector)[0]));
    const html = U.cloneHtml<HTMLElement>(this.templateContainer);
    o.linkToLogic(html);
    html.classList.add('linkedWith_' + U.getTSClassName(o));
    html.classList.remove('propertySidebarTemplates');
    html.classList.remove('template');
    html.classList.add('wastemplate');
    const $html = $(html);
    $html.find('.replaceVarOn').each( (ii: number, elem: HTMLElement) => { U.replaceVars(o, elem, false); });
    let namestr: string;
    const model: IModel = o.getModelRoot();
    if (! (o instanceof IModel || model.isMM()) ) { namestr = o.metaParent.name; } else { namestr = o.name; }
    $html.find('input.name').val(namestr)
      .off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        console.log('value:', input.value, 'inputHtml:', input, 'evt:', evt);
        input.value = o.setName(input.value, true);
      });
    $html.find('.replaceVarOn').each( (i: number, elem: HTMLElement) => { U.replaceVars(o, elem, false); });
    $html.find((model.isM() ? '.m1' : '.m2') + 'disable').attr('disabled');
    $html.find((model.isM() ? '.m1' : '.m2') + 'hide').remove();
    return $html; }

  private get$root(): JQuery<HTMLElement> {
    let TabRootHtml: Element = this.model.graph.container;
    // console.log('TabRootHtml:', TabRootHtml);
    while (!TabRootHtml.classList.contains('UtabContent')) { TabRootHtml = TabRootHtml.parentNode as Element; }
    const $ret = $(TabRootHtml).find('.propertyBarContainer') as JQuery<HTMLElement>;
    U.pe($ret.length !== 1, 'pbar container not found:', $ret);
    return $ret; }

  public updateRaw(o: ModelPiece = null): void {
    // o = o || this.selectedModelPiece;
    // if (!o) { return; }
    const $root = this.get$root();
    const textArea = this.rawTextArea = $root.find('.rawecore')[0] as HTMLTextAreaElement;
    if (!textArea) { return; }
    textArea.value = o.generateModelString(); }

  public show(o: ModelPiece = null, clickedLevel: Element, isEdge: IEdge, forceRefresh: boolean = true): void {
    if (!forceRefresh && this.selectedModelPiece === o && this.selectedModelPieceIsEdge === isEdge) {
      if (clickedLevel === this.clickedLevel) { return; }
      this.clickedLevel = clickedLevel = clickedLevel || this.clickedLevel;
      if (isEdge) { this.styleEditor.showE(o as IClass | IReference, isEdge); } else { this.styleEditor.show(o, clickedLevel); }
      return; }
    this.selectedModelPiece = o = (o || this.selectedModelPiece);
    this.clickedLevel = clickedLevel = (clickedLevel || this.clickedLevel);
    if (isEdge) { this.styleEditor.showE(o as IClass | IReference, isEdge); } else { this.styleEditor.show(o, clickedLevel); }

    U.pe(!(o instanceof ModelPiece), 'invalid parameter type:', U.getTSClassName(o), o);
    this.selectedModelPieceIsEdge = isEdge;
    if (!o) { return; }
    // console.log('PropertyBar.show: ', o);
    U.clear(this.container);
    if (false && false) {
    } else if (o instanceof IModel) { this.container.append(this.getM_I(o));
    } else if (o instanceof IPackage) { this.container.append(this.getP_I(o));
    } else if (o instanceof IClass) { this.container.append(this.getC_I(o));
    } else if (o instanceof EEnum) { this.container.append(this.getE_I(o));
    } else if (o instanceof IAttribute) { this.container.append(this.getA_I(o));
    } else if (o instanceof IReference) { this.container.append(this.getR_I(o));
    } else if (o instanceof EOperation) { this.container.append(this.getO(o));
    } else if (o instanceof EParameter) { this.container.append(this.getParam(o));
    } else if (o instanceof ELiteral) { this.container.append(this.getEL(o));
    } else { U.pe(true, 'invalid ModelPiece type instance: ', o); }
    this.updateRaw(o);
    const $container = $(this.container);
    // $container.find('.template').addClass('.wastemplate').removeClass('template');
    Type.updateTypeSelectors($container);
    $container.find('.minimizer').off('click.minimizeTemplate').on('click.minimizeTemplate',
      (e: ClickEvent) => { this.templateMinimizerClick(e); });

    /// ottimizzazioni di stile.
    while ($container.find('.wastemplate:has(>.content:not(:has(*)))').remove().length) {} // remove empty minimizer-content.
    // rimuove template.minimizer nested con un solo child che è un altro template+minimizer.
    // tipo:  ((1, 2)) --> (1, 2); sopravvive invece: (1, (2)) -> (1, (2));
    const monoChildReplacer = (i: number, h: HTMLElement) => {
      /*
        '<template_1>' +
          '<content_1>' +
            '<template_2>' +
              '<content_2>' +
              '</content_2>' +
            '</template_2>' +
          '</content_1>' +
        '</template_1>';*/
      const content1: HTMLElement = h;
      const template1: HTMLElement = h.parentElement;
      const template2: ChildNode = content1.firstChild;
      const content2: ChildNode = $(template2).find('>.content')[0];
      const parent = template1.parentElement;
      parent.insertBefore(template2, template1);
      parent.removeChild(template1);
      // template1.insertBefore(content2, content1);
      // template1.removeChild(content1);
    };
    // while ($container.find('.content:has(>.wastemplate:only-child)').each(monoChildReplacer).length) {}
    while ($container.find('.content:has(>.wastemplate:only-child)').each(monoChildReplacer).length) {}
    // rimuove il template.minimizer alla radice, non ha senso chiudere tutto e rimanere con la pbar vuota.
    $container.find('.minimizer.single').on('contextmenu', (e: ContextMenuEvent) => { this.subTemplateShow(e); });
    const contentRoot = $container.find('>.wastemplate>.content')[0];
    U.clear(this.container);
    while (contentRoot.firstChild) { this.container.append(contentRoot.firstChild); }
  }

  private getM_I(o: IModel): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    this.removeOthers($html, '.model'); // $html.find('.model').show();
    const nsHtml = $html.find('input.namespace')[0] as HTMLInputElement;
    const uriHtml = $html.find('input.uri')[0] as HTMLInputElement;
    nsHtml.value = o.namespace();
    uriHtml.value = o.uri();
    $(uriHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.uri(uriHtml.value); });
    $(nsHtml).off('change.pbar').on('change.pbar', (e: Event) => { o.namespace(nsHtml.value); });
    const pkgListHtml = ($html.find('.packageList')[0]);
    let i;
    for (i = 0; i < o.childrens.length; i++) { pkgListHtml.appendChild(this.getP_I(o.childrens[i])); }
    return $html[0]; }

  private getP_I(o: IPackage): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    this.removeOthers($html, '.package'); // $html.find('.package').show();
    const classListHtml = $html.find('.classList')[0];
    const enumListHtml = $html.find('.enumList')[0];
    let i: number;
    for (i = 0; i < o.classes.length; i++) { classListHtml.appendChild(this.getC_I(o.classes[i])); }
    for (i = 0; i < o.enums.length; i++) { enumListHtml.appendChild(this.getE_I(o.enums[i])); }
    // package own properties (sembra ci sia solo il name)
    return $html[0]; }

  private getC_I(o: IClass): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    this.removeOthers($html, '.class');
    // $html.find('.class').show();
    let i: number;
    const attribListHtml: HTMLElement = ($html.find('.attributeList')[0]);
    const refListHtml: HTMLElement = ($html.find('.referenceList')[0]);
    const opListHtml: HTMLElement = ($html.find('.operationList')[0]);
    for (i = 0; i < o.attributes.length; i++) { attribListHtml.appendChild(this.getA_I(o.attributes[i])); }
    for (i = 0; i < o.references.length; i++) { refListHtml.appendChild(this.getR_I(o.references[i])); }
    const operations: EOperation[] = o.getOperations();
    for (i = 0; i < operations.length; i++) { opListHtml.appendChild(this.getO(operations[i])); }
    if (!(o instanceof MClass)) { return $html[0]; }
    /// Se MClass
    const classe: MClass = o as MClass;
    const isRoot: HTMLInputElement = ($html.find('input.isRoot')[0]) as HTMLInputElement;
    console.log('this:', o);
    isRoot.disabled = isRoot.checked = classe.isRoot();
    $(isRoot).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        if (!input.checked) { input.checked = true; return $html[0]; }
        classe.setRoot(input.checked);
        classe.refreshGUI();
        this.refreshGUI();
      });
    return $html[0]; }

  private getE_I(o: EEnum): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    this.removeOthers($html, '.enum');//$html.find('.enum').show();
    let i: number;
    const literalsHtml: HTMLElement = ($html.find('.literalList')[0]);
    for (i = 0; i < o.childrens.length; i++) { literalsHtml.appendChild(this.getEL(o.childrens[i])); }
    return $html[0]; }

  private setClassChild(o: Typedd, $html: JQuery<HTMLElement>): void {
    let upperbound: number = o.getUpperbound();
    let lowerbound: number = o.getLowerbound();
    const htmlUpperBound = ($html.find('input.upperbound')[0] as HTMLInputElement);
    const htmlLowerBound = ($html.find('input.lowerbound')[0] as HTMLInputElement);
    if (!htmlUpperBound || !htmlLowerBound) return;
    if (upperbound === null) { htmlUpperBound.placeholder = '1'; } else { htmlUpperBound.value = '' + upperbound; }
    if (lowerbound === null) { htmlLowerBound.placeholder = '1'; } else { htmlLowerBound.value = '' + lowerbound; }

    $(htmlUpperBound).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        o.setUpperbound(+target.value);
        o.refreshGUI();
      });
    $(htmlLowerBound).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        o.setLowerbound(+target.value);
        o.refreshGUI();
      });
  }

  private getR_I(o: IReference): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    this.removeOthers($html, '.reference'); // $html.find('.reference').show();
    this.setClassChild(o, $html);
    const htmlContainment = ($html.find('input.referenceContainment')[0] as HTMLInputElement);
    htmlContainment.checked = o.isContainment();
    const selectType = $html.find('select')[0] as HTMLSelectElement;

    if (o instanceof MReference) { return $html[0]; }
    const ref: M2Reference = o as M2Reference;
    $(selectType).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLSelectElement = (evt.currentTarget as HTMLSelectElement);
        ref.type.changeType(target.value); } );
    $(htmlContainment).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        ref.setContainment(target.checked);
        ref.refreshGUI();
      });
    return $html[0]; }

  private getA_I(o: IAttribute): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    this.removeOthers($html, '.attribute');
    // $html.find('.attribute').show();
    this.setClassChild(o, $html);
    // const typeHtml: HTMLSelectElement = ($html.find('select.attributeType')[0] as HTMLSelectElement);
    // Type.makeTypeSelector(typeHtml, o.getType(), true, true, false, false);
    /* $(typeHtml).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLSelectElement = (evt.currentTarget as HTMLSelectElement);
        o.setType(target.value, null, true);} );*/

    if (o instanceof M2Attribute) { return $html[0]; }
    // Se MAttribute
    const attr: MAttribute = o as MAttribute;
    $html.find('.attributeValue').val(attr.getValueStr()).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        attr.setValueStr(input.value);
        attr.refreshGUI();
      });
    return $html[0]; }

  private getO(o: EOperation): HTMLElement {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    this.removeOthers($html, '.operation'); // $html.find('.operation').show();
    this.setClassChild(o, $html);
    let i: number;
    const paramListHtml: HTMLElement = ($html.find('.parameterList')[0]);
    const visibilityHtml: HTMLSelectElement = ($html.find('.visibilitySelector')[0]) as HTMLSelectElement;
    PropertyBarr.makeVisibilitySelector(visibilityHtml, o.visibility);
    let paramHtml: HTMLElement = this.getParam(o, true);
    const returnName: HTMLInputElement = ($(paramHtml).find('input.name')[0] as HTMLInputElement);
    returnName.placeholder = 'Return type.';
    returnName.disabled = true;
    returnName.value = '';
    const templateContainingParamList = paramListHtml;
    // while (!templateContainingParamList.classList.contains('replaceVarOn')) { templateContainingParamList = templateContainingParamList.parentElement; }
    templateContainingParamList.prepend(paramHtml);

    for (i = 0; i < o.childrens.length; i++) {
      paramHtml = this.getParam(o.childrens[i], false);
      paramListHtml.appendChild(paramHtml); }

    $html.find('input.exceptions').val(o.exceptionsStr).off('change.pbar').on('change.pbar', (evt: Event) => {
      const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
      input.value = o.exceptionsStr = input.value; });
    return $html[0]; }

  private getEL(eLiteral: ELiteral): HTMLElement{
    const $html: JQuery<HTMLElement> = this.getTemplate(eLiteral);
    this.removeOthers($html, '.literal'); // $html.find('.literal').show();
    this.setClassChild(eLiteral, $html);
    $html.find('.value').val(eLiteral.ordinal).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        eLiteral.ordinal = +input.value;
        eLiteral.refreshGUI();
      });
    $html.find('input.literal').val(eLiteral.literal).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        eLiteral.setLiteral(input.value);
        eLiteral.refreshGUI();
      });
    $html.find('.name').val(eLiteral.name).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const input: HTMLInputElement = evt.currentTarget as HTMLInputElement;
        eLiteral.setName(input.value);
        eLiteral.refreshGUI();
      });
    return $html[0];
  }

  public refreshGUI() { this.show(this.selectedModelPiece, this.clickedLevel, this.selectedModelPieceIsEdge); }

  private getParam(o: EParameter | EOperation, asReturnType: boolean = false) {
    const $html: JQuery<HTMLElement> = this.getTemplate(o);
    this.removeOthers($html, '.parameter'); // $html.find('.parameter').show();
    this.setClassChild(o, $html);
    const typeHtml: HTMLSelectElement = ($html.find('select')[0] as HTMLSelectElement);
    typeHtml.dataset.void = asReturnType ? "true" : "false";
    const ordered = ($html.find('input.ordered')[0] as HTMLInputElement);
    const unique = ($html.find('input.unique')[0] as HTMLInputElement);
    ordered.checked = o.ordered;
    unique.checked = o.unique;
    $(typeHtml).off('change.pbar').on('change.pbar',
      (evt: Event) => {
        const target: HTMLSelectElement = (evt.currentTarget as HTMLSelectElement);
        o.setType(target.value, null, true); } ); // .trigger('change');
    return $html[0]; }

  public onShow(isRaw: boolean = false): void { this.styleEditor.onHide(); }

  public onHide(): void {}

}
