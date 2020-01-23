import {Component, OnInit} from '@angular/core';
import {
  IAttribute, M2Class, IEdge, IModel, IPackage, IReference, ModelPiece, PropertyBarr, Status, U, IClass,
  EdgeModes, EOperation, EParameter, Database, Size, AttribETypes, ViewRule, ViewHtmlSettings, StyleComplexEntry, ViewPoint, Type
} from '../../common/Joiner';
import ChangeEvent = JQuery.ChangeEvent;
import BlurEvent = JQuery.BlurEvent;
import KeyDownEvent = JQuery.KeyDownEvent;
import KeyboardEventBase = JQuery.KeyboardEventBase;
import KeyUpEvent = JQuery.KeyUpEvent;
import ClickEvent = JQuery.ClickEvent;
import SelectEvent = JQuery.SelectEvent;

@Component({
  selector: 'app-style-editor',
  templateUrl: './style-editor.component.html',
  styleUrls: ['./style-editor.component.css']
})
export class StyleEditorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
export class StyleEditor {
  private propertyBar: PropertyBarr = null;
  private $root: JQuery<HTMLElement> = null;
  private $templates: JQuery<HTMLElement> = null;
  private $display: JQuery<HTMLElement> = null;
  private root: HTMLElement = null;
  private templates: HTMLElement = null;
  private display: HTMLElement = null;
  private clickedLevel: Element = null;

  onHide(): void {
    this.updateClickedGUIHighlight();
  }
  onShow(): void {
    this.propertyBar.onHide();
    this.updateClickedGUIHighlight();
  }

  constructor(propertyBar: PropertyBarr, $root: JQuery<HTMLElement>) {
    this.propertyBar = propertyBar;
    this.$root = $root.find('.styleContainer');
    this.$display = this.$root.find('.StyleEditorDisplay');
    this.$templates = this.$root.find('.styleTemplates');
    this.root = this.$root[0];
    this.display = this.$display[0];
    this.templates = this.$templates[0]; }

  onPaste(e: any): void { // e: ClipboardEvent
    e.preventDefault();
    const div: HTMLDivElement | HTMLTextAreaElement = e.currentTarget as HTMLDivElement | HTMLTextAreaElement;
    let text: string = (e as unknown as any).originalEvent.clipboardData.getData('text/plain');
    text = U.replaceAll(text, '\n', ' ');
    div.innerText = U.replaceAll(text, '\r', ' ');
  }

  isVisible(): boolean { return this.$root.is(':visible'); }
  show(m: ModelPiece, clickedLevel: Element) {
    this.clickedLevel = clickedLevel;
    // console.log('styleShow(', m, ')');
    if (m instanceof IModel) { this.showM(m); return; }
    if (m instanceof IPackage) { this.showM(m.parent); return; }
    // if (m instanceof IPackage) { this.showP(m); return; }
    this.showMP(m, null, false, null);
    return;/*
    if (m instanceof IClass) { this.showC(m); }
    if (m instanceof IAttribute) { this.showA(m); }
    if (m instanceof IReference) { this.showR(m); }
    if (m instanceof EOperation) { this.showO(m); }
    if (m instanceof EParameter) { this.showParam(m); }*/
  }

  updateClickedGUIHighlight() {
    $(this.propertyBar.model.graph.container).find('.styleEditorSelected').removeClass('styleEditorSelected');
    if (this.isVisible() && this.clickedLevel) { this.clickedLevel.classList.add('styleEditorSelected'); } }

  private getCopyOfTemplate(m: ModelPiece, s: string, appendTo: HTMLElement, clear: boolean): HTMLElement {
    let $html: JQuery<HTMLElement> = this.$templates.find('.template' + s);
    const html: HTMLElement = U.cloneHtml<HTMLElement>($html[0]);
    html.classList.remove('template');
    html.dataset.modelPieceID = '' + m.id;
    html.style.display = 'block';
    if (appendTo) {
      if (clear) U.clear(appendTo);
      appendTo.appendChild(html); }
    $html = $(html).find('.' + (m.getModelRoot().isM() ? 'm1' : 'm2') + 'hide').hide();
    return html; }

  showM(m: IModel) {
    console.log('styleShowM(', m, ')');
    const html: HTMLElement = this.getCopyOfTemplate(m, '.model', this.display, true);
    const $html = $(html);
    const gridX: HTMLInputElement = $html.find('.gridX')[0] as HTMLInputElement;
    const gridY: HTMLInputElement = $html.find('.gridY')[0] as HTMLInputElement;
    const zoomX: HTMLInputElement = $html.find('.zoomX')[0] as HTMLInputElement;
    const zoomY: HTMLInputElement = $html.find('.zoomY')[0] as HTMLInputElement;
    const showGrid: HTMLInputElement = $html.find('.showGrid')[0] as HTMLInputElement;
    const color: HTMLInputElement = $html.find('.graphColor')[0] as HTMLInputElement;
    gridX.value = m.graph.grid ? '' + m.graph.grid.x : '';
    gridY.value = m.graph.grid ? '' + m.graph.grid.y : '';
    zoomX.value = m.graph.zoom.x + '';
    zoomY.value = m.graph.zoom.y + '';
    showGrid.checked = m.graph.gridDisplay;
    color.value = '#000ff'; // todo.
    // event listeners:
    $(gridX).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.grid.x = isNaN(+input.value) ? 0 : +input.value;
      showGrid.checked = true;
      $(showGrid).trigger('change');
      m.refreshGUI();
    });
    $(gridY).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.grid.y = isNaN(+input.value) ? 0 : +input.value;
      showGrid.checked = true;
      $(showGrid).trigger('change');
      m.refreshGUI();
    });
    $(zoomX).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.setZoom(+input.value, null);
    });
    $(zoomY).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.setZoom(null, +input.value);
    });
    $(showGrid).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.ShowGrid(input.checked);
    });
  }

  showP(m: IPackage) { U.pe(true, 'styles of Package(', m, '): unexpected.'); }

  setStyleEditor($styleown: JQuery<HTMLElement>, model: IModel, mp: ModelPiece, style: StyleComplexEntry, templateLevel: Element, indexedPath: number[] = null): number[] {
    /// getting the template to fill.
    const debug: boolean = false;
    let i: number;
    let styleowntemplate: HTMLElement = $styleown[0];
    const isInherited: boolean = styleowntemplate.classList.contains('inherited');
    const isInheritable: boolean = styleowntemplate.classList.contains('inheritable');
    const isOwn: boolean = styleowntemplate.classList.contains('own');
    U.pe((isInheritable ? 1 : 0 || isInherited ? 1 : 0 || isOwn ? 1 : 0) !== 1, 'failed to get html styleEditor template');
    let tmp: any = this.getCopyOfTemplate(mp, '.htmlstyle', null, false);
    styleowntemplate.appendChild(tmp);
    styleowntemplate.classList.remove('template');
    // styleowntemplate.parentElement.insertBefore(tmp, styleowntemplate);
    // styleowntemplate.parentElement.removeChild(styleowntemplate);
    styleowntemplate = tmp;
    U.pe(!styleowntemplate.parentElement, 'null parent: ',  styleowntemplate, $styleown);
    $styleown = $(styleowntemplate);
    U.pif(debug, 'styleComplexEntry:', style, 'mp:', mp, styleowntemplate, $styleown);
    const obj: {
      editLabel: HTMLLabelElement;
      editAllowed: HTMLButtonElement;
      selectstyle: HTMLSelectElement,
      previewselect: HTMLSelectElement,
      preview: HTMLElement,
      input: HTMLDivElement | HTMLTextAreaElement,
      detailButton: HTMLButtonElement,
      detailPanel: HTMLElement,
      isM1: HTMLInputElement,
      isM2: HTMLInputElement,
      isClass: HTMLInputElement,
      isReference: HTMLInputElement,
      isAttribute: HTMLInputElement,
      isOperation: HTMLInputElement,
      isParameter: HTMLInputElement,
      stylename: HTMLInputElement,
      forkButton: HTMLButtonElement,
      delete: HTMLButtonElement,
      saveasName: HTMLInputElement,
    } = {
      editLabel: null,
      editAllowed: null,
      selectstyle: null,
      previewselect: null,
      preview: null,
      input: null,
      detailButton: null,
      detailPanel: null,
      isM1: null,
      isM2: null,
      isClass: null,
      isReference: null,
      isAttribute: null,
      isOperation: null,
      isParameter: null,
      stylename: null,
      forkButton: null,
      delete: null,
      saveasName: null
    };
    //// setting up labelAllowEdit (checking if the (own, inherited or inheritable) style exist or a modelpiece local copy is needed.)
    obj.editAllowed = $styleown.find('button.allowEdit')[0] as HTMLButtonElement;
    obj.editLabel = $styleown.find('label.allowEdit')[0] as HTMLLabelElement;
    obj.selectstyle = $styleown.find('select.stylename')[0] as HTMLSelectElement;
    obj.detailButton = $styleown.find('button.detail')[0] as HTMLButtonElement;
    obj.detailPanel = $styleown.find('div.detail')[0] as HTMLElement;
    obj.input = $styleown.find('.html[contenteditable="true"]')[0] as HTMLTextAreaElement | HTMLDivElement;
    obj.preview = $styleown.find('.preview')[0] as HTMLElement;
    obj.previewselect = $styleown.find('select.previewselector')[0] as HTMLSelectElement;
    const $detail = $styleown.find('div.detail');
    obj.isM1 = $detail.find('.model')[0] as HTMLInputElement;
    obj.isM2 = $detail.find('.metamodel')[0] as HTMLInputElement;
    obj.isClass = $detail.find('.class')[0] as HTMLInputElement;
    obj.isAttribute = $detail.find('.attribute')[0] as HTMLInputElement;
    obj.isReference = $detail.find('.reference')[0] as HTMLInputElement;
    obj.isOperation = $detail.find('.operation')[0] as HTMLInputElement;
    obj.isParameter = $detail.find('.parameter')[0] as HTMLInputElement;
    obj.saveasName = $detail.find('input.saveas')[0] as HTMLInputElement;
    obj.delete = $detail.find('button.delete')[0] as HTMLButtonElement;
    obj.forkButton = $detail.find('button.saveas')[0] as HTMLButtonElement;
    // let inheritableStyle: StyleComplexEntry = isInheritable ? mp.getInheritableStyle() : null;
    // let inheritedStyle: StyleComplexEntry = isInherited ? mp.getInheritedStyle() : null;
    const lastvp: ViewPoint = model.getLastView();
    U.pif(debug, 'isOwn && !style.isownhtml || isInherited && !inheritedStyle.html || isInheritable && !inheritableStyle.html)', style);
    U.pif(debug, !style ? '' : isOwn + ' && ' + style.isownhtml + ' || ' + isInherited + ' && ' + style.html + ' || ' + isInheritable + ' && ' + style.html);
    if (!!style && !(isOwn && !style.isownhtml || isInherited && !style.html || isInheritable && !style.html)) {
      $(obj.editLabel).hide();
    } else {
      obj.selectstyle.disabled = obj.detailButton.disabled = true;
      obj.input.setAttribute('disabled', 'true');
      obj.input.contentEditable = 'false';
      if (!lastvp) {
        obj.editLabel.innerText = 'Is required to have at least one non-default viewpoint applied to customize styles.';
        obj.editAllowed.style.display = 'none';
      } else
      $(obj.editAllowed).on('click', (e: ClickEvent) => {
        const mptarget: ModelPiece = isInherited ? mp.metaParent : mp;
        let v: ViewRule = lastvp.viewsDictionary[mptarget.id];
        if (!v) v = new ViewRule(lastvp);
        if (isOwn) {
          U.pe(!!v.htmlo, 'htmlo should be undefined at this point.');
          v.htmlo = new ViewHtmlSettings();
          v.htmlo.setHtmlStr( (style ? style.html : mptarget.getStyle().html).outerHTML ); }
        if (isInheritable) {
          U.pe(!!v.htmli, 'htmli should be undefined at this point.');
          v.htmli = new ViewHtmlSettings();
          const instanceCurrentStyle: Element = ModelPiece.GetStyle(Status.status.m, mp.getInstanceClassName());
          v.htmli.setHtmlStr( instanceCurrentStyle.outerHTML ); }
        if (isInherited) {
          U.pe(!!v.htmli, 'htmli should be undefined at this point.');
          v.htmli = new ViewHtmlSettings();
          v.htmli.setHtmlStr( (style ? style.html : mp.getStyle().html).outerHTML );
        }
        v.apply(mptarget);
        this.showMP(mp);
        // todo: se stylecomplexEntry è null mostra un altro button.editAllowed per inserire lo stile ereditabile che generi htmli.
      });

      if (!style) {
        if (isInheritable) { obj.editLabel.innerHTML = 'This element does not have a inheritable style.'; }
        if (isInherited) { obj.editLabel.innerHTML = 'The metaParent of this element does not have a inheritable style appliable to this element.'; }
        obj.editLabel.appendChild(obj.editAllowed);
        U.clear(styleowntemplate);
        styleowntemplate.appendChild(obj.editLabel);
        return null; }
    }
    /// start!

    // obj.is...
    if (model.isM1()) { obj.isM1.disabled = obj.isM1.checked = true; }
    if (model.isM2()) { obj.isM2.disabled = obj.isM2.checked = true; }
    if (mp instanceof IClass) { obj.isClass.disabled = obj.isClass.checked = true; }
    if (mp instanceof IReference) { obj.isReference.disabled = obj.isReference.checked = true; }
    if (mp instanceof IAttribute) { obj.isAttribute.disabled = obj.isAttribute.checked = true; }
    if (mp instanceof EOperation) { obj.isOperation.disabled = obj.isOperation.checked = true; }
    if (mp instanceof EParameter) { obj.isParameter.disabled = obj.isParameter.checked = true; }
    let styleown: ViewHtmlSettings = style.htmlobj;
    if (styleown) {
      obj.isM1.checked = styleown.AllowedOnM1;
      obj.isM2.checked = styleown.AllowedOnM2;
      obj.isClass.checked = styleown.allowedOnClass;
      obj.isReference.checked = styleown.allowedOnReference;
      obj.isAttribute.checked = styleown.allowedOnAttribute;
      obj.isOperation.checked = styleown.allowedOnOperation;
      obj.isParameter.checked = styleown.allowedOnParameter;
      $(obj.isM1).on('change', (e: ChangeEvent) => {
        styleown.AllowedOnM1 = obj.isM1.checked;
        styleown.saveToDB();
      });
      $(obj.isM2).on('change', (e: ChangeEvent) => {
        styleown.AllowedOnM2 = obj.isM2.checked;
        styleown.saveToDB();
      });
      $(obj.isClass).on('change', (e: ChangeEvent) => {
        styleown.allowedOnClass = obj.isClass.checked;
        styleown.saveToDB();
      });
      $(obj.isAttribute).on('change', (e: ChangeEvent) => {
        styleown.allowedOnAttribute = obj.isAttribute.checked;
        styleown.saveToDB();
      });
      $(obj.isReference).on('change', (e: ChangeEvent) => {
        styleown.allowedOnReference = obj.isReference.checked;
        styleown.saveToDB();
      });
      $(obj.isOperation).on('change', (e: ChangeEvent) => {
        styleown.allowedOnOperation = obj.isOperation.checked;
        styleown.saveToDB();
      });
      $(obj.isParameter).on('change', (e: ChangeEvent) => {
        styleown.allowedOnParameter = obj.isParameter.checked;
        styleown.saveToDB();
      });
    } else {
      obj.isM1.disabled =
        obj.isM2.disabled =
          obj.isClass.disabled =
            obj.isReference.disabled =
              obj.isAttribute.disabled =
                obj.isOperation.disabled =
                  obj.isParameter.disabled = true; }
    // main input (html); setup input
    obj.input.setAttribute('placeholder', U.replaceVarsString(mp, obj.input.getAttribute('placeholder')));
    obj.input.innerText = templateLevel.outerHTML;

    $styleown.find('.htmllevel').html((isInherited ? 'Instances Html' : 'Own html')
      + ' (' + (indexedPath && indexedPath.length ? 'Level&nbsp;' + indexedPath.length : 'Root&nbsp;level') + ')');
    let optgroup: HTMLOptGroupElement;
    /*
    preview removed.
    const updatePreview = () => { obj.preview.innerHTML = obj.input.innerText; };
    optgroup = U.toHtml('<optgroup label="' + U.getTSClassName(mp) + '"></optgroup>');
    obj.previewselect.appendChild(optgroup);
    for (i = 0; i < mp.metaParent.instances.length; i++) {
      const peer: ModelPiece = mp.metaParent.instances[i];
      const opt: HTMLOptionElement = document.createElement('option');
      optgroup.appendChild(opt);
      opt.value = '' + peer.id;
      opt.innerText = peer.printableName();
    }*/

    optgroup = U.toHtml('<optgroup label="Compatible Styles"></optgroup>');
    let o: HTMLOptionElement = document.createElement('option');
    o.value = 'default';
    o.text = 'default';
    if (style.isGlobalhtml) o.selected = true;
    optgroup.append(o);
    // console.log('viewpointSelect: ', mp.views);
    for (i = 0; i < mp.views.length; i++) {
      const v: ViewRule = mp.views[i];
      o = document.createElement('option');
      o.value = '' + v.id;
      o.text = v.getViewPoint().name + ' (own)';
      if (v === style.view) o.selected = true;
      optgroup.append(o); }
    for (i = 0; mp.metaParent && i < mp.metaParent.views.length; i++) {
      const v: ViewRule = mp.metaParent.views[i];
      o = document.createElement('option');
      o.value = '' + v.id;
      o.text = v.getViewPoint().name + ' (inherited)';
      if (v === style.view) o.selected = true;
      optgroup.append(o); }

    obj.selectstyle.appendChild(optgroup);
    /*    const styles: ModelPieceStyleEntry[] = Styles.getAllowed(m);
        for (i = 0; i < styles.length; i++) {
          const style: ModelPieceStyleEntry = styles[i];
          const opt: HTMLOptionElement = document.createElement('option');
          optgroup.appendChild(opt);
          opt.innerText = style.name;
          opt.value = style.getKey();
        }

    */
    const onStyleChange = () => {
      const inputHtml: Element = U.toHtml(obj.input.innerText);
      // console.log('PRE: ', inputHtml, 'outer:', inputHtml.outerHTML, 'innertext:', obj.input.innerText);
      U.pif(debug, '*** setting inheritable PRE. style.htmlobj:', style.htmlobj, ', style:', style, ', templateLevel:', templateLevel,
        'templatelvl.parent:', templateLevel.parentElement, ', inputHtml:', inputHtml);
      if (templateLevel.parentElement) {
        templateLevel.parentElement.insertBefore(inputHtml, templateLevel);
        templateLevel.parentElement.removeChild(templateLevel);
        templateLevel = inputHtml;
      } else {
        U.pe(!style.view || style.isGlobalhtml, 'default html cannot be modified.', style, 'todo: automatically make new ClassVieww');
        // ??old message?: se tutto va bene qui deve dare errore, crea una nuova ClassVieww e applicalo al modelpiece ed edita quello.
        style.htmlobj.setHtml(templateLevel = inputHtml);
        U.pif(debug,'*** setting inheritable POST. style.htmlobj', style.htmlobj, 'style:', style);
      }
      if (isOwn) { mp.refreshGUI(); }
      if (isInheritable) { mp.refreshInstancesGUI(); }
      if (isInherited) { mp.metaParent.refreshInstancesGUI(); }
      if (!isInheritable && indexedPath) this.clickedLevel = U.followIndexesPath(mp.getHtmlOnGraph(), indexedPath);
      this.updateClickedGUIHighlight();
      // obj.input.innerText = inputHtml.outerHTML;
      // DANGER: se lo fai con l'evento onchange() ti sposta il cursore all'inizio e finisci per scrivere rawtext prima dell'html invalidandolo.
      // tenendolo dovresti scrivere i caratteri uno alla volta riposizionando il cursore nel punto giusto ogni volta.
      // console.log('POST: ', inputHtml, 'outer:', inputHtml.outerHTML, 'innertext:', obj.input.innerText);
      // updatePreview();
    };
    $(obj.input).off('paste.set').on('paste.set', (e: any/*ClipboardEvent*/) => { this.onPaste(e); onStyleChange(); })
      .off('change.set').on('change.set', onStyleChange)
      .off('input.set').on('input.set', onStyleChange)
      .off('blur.set').on('blur.set', onStyleChange)
      .off('keydown.set').on('keydown.set', (e: KeyDownEvent) => { if (e.key === 'Esc') { this.propertyBar.refreshGUI(); } });

    obj.selectstyle.disabled = indexedPath && indexedPath.length > 0;
    /*$(obj.selectstyle).on('change', (e: ChangeEvent) => {
      const style: ModelPieceStyleEntry = Styles.getStyleFromKey(obj.selectstyle.value);
      obj.input.innerText = style.htmlstr;
      $(obj.input).trigger('input');
    });*/

    // setup measurable options.

    const ownhtmlinput: HTMLDivElement | HTMLTextAreaElement = $styleown.find('.html[contenteditable="true"]')[0] as HTMLDivElement | HTMLTextAreaElement;
    const measurableSelect: HTMLSelectElement = $styleown.find('select.attributetypeadd')[0] as HTMLSelectElement;
    $styleown.find('button.addmeasurable').on('click', () => {
      this.addmeasurableAttributeButton(measurableSelect, $styleown, mp, style, templateLevel as HTMLElement | SVGElement, ownhtmlinput, indexedPath);
    });
    for (i = 0; i < templateLevel.attributes.length; i++) {
      const a: Attr = templateLevel.attributes[i];
      if (a.name[0] === '_' || a.name.indexOf('r_') == 0 || a.name.indexOf('r_') == 0) {
        const val: Attr = this.clickedLevel.attributes.getNamedItem(a.name.substr(1));
        const style = null;
        this.addmeasurableAttributeButton(measurableSelect, $styleown, mp, style, templateLevel as HTMLElement | SVGElement, ownhtmlinput, indexedPath, a, val)
      }
    }
    return indexedPath; }

  showMP(m: ModelPiece, clickedLevel: Element = null, asMeasurable: boolean = false, asEdge: IEdge = null) {
    // console.log('styleShow(', m, ', ' + U.getTSClassName(m) + ')');
    let i: number;
    this.clickedLevel = clickedLevel = clickedLevel || this.clickedLevel;
    // set htmls
    const style: StyleComplexEntry = m.getStyle();
    const styleinheritable: StyleComplexEntry = m.getInheritableStyle();
    const styleinherited: StyleComplexEntry = m.getInheritedStyle();
    const clickedRoot: Element = ModelPiece.getLogicalRootOfHtml(clickedLevel);
    const templateRoot: Element = style.html;// m.styleobj.html;// m.getStyle();
    // let templateLevel: HTMLElement | SVGElement = templateRoot;
    let indexedPath: number[] = U.getIndexesPath(clickedLevel, 'parentNode', 'childNodes', clickedRoot);
    // console.log('clickedRoot', clickedRoot, 'clickedLevel', clickedLevel, 'path:', indexedPath);
    U.pe(U.followIndexesPath(clickedRoot, indexedPath, 'childNodes') !== clickedLevel, 'mismatch.', indexedPath);
    const realindexfollowed: {indexFollowed: string[] | number[], debugArr: {index: string | number, elem: any}[]} = {indexFollowed: [], debugArr:[]};
    let templateLevel: Element = U.followIndexesPath(templateRoot, indexedPath, 'childNodes', realindexfollowed);
    // console.log('clickedRoot:',clickedRoot, 'clikedLevel:', clickedLevel, 'indexedPath:', indexedPath, 'followed:', realindexfollowed,
    // 'templateRoot:', templateRoot, 'templateLevel:', templateLevel);
    if (realindexfollowed.indexFollowed.length !== indexedPath.length) {
      indexedPath = realindexfollowed.indexFollowed as number[];
      this.clickedLevel = clickedLevel = U.followIndexesPath(clickedRoot, indexedPath);}
    this.updateClickedGUIHighlight();
    // html set END.
    const model: IModel = m.getModelRoot();
    if (asEdge && (m instanceof IClass || m instanceof IReference) && m.shouldBeDisplayedAsEdge()) { return this.showE(m, asEdge); }
    const html: HTMLElement = this.getCopyOfTemplate(m, '.modelpiece', this.display, true);
    const $html = $(html);
    const showAsEdge: HTMLInputElement = $html.find('.showAsEdge')[0] as HTMLInputElement;
    const showAsEdgeText: HTMLElement = $html.find('.showAsEdgeText')[0] as HTMLElement;
    const $styleown = $html.find('.style.own');
    const $styleInherited = $html.find('.style.inherited');
    const $styleInheritable = $html.find('.style.inheritable');
    //const ownhtml = m.getStyle();
    const htmlPath: number[] = this.setStyleEditor($styleown, model, m, style, templateLevel, indexedPath);
    // U.pe(!style.html, $styleown, m, clickedLevel, model, style, instanceshtml);
    // const clickedonStyle: HTMLElement | SVGElement = U.followIndexesPath(style.html, htmlPath) as HTMLElement | SVGElement;
    $html.find('.tsclass').html('' + m.printableName()); // + (htmlDepth === 0 ? ' (root level)' : ' (level&nbsp;' + htmlDepth + ')') );
    // console.log('setStyleEditor inherited, ', styleinherited);
    let inheritedTemplateLevel: Element = null;
    if (styleinherited) {
      const inheritedTemplateRoot: Element = styleinherited.html;
      inheritedTemplateLevel = U.followIndexesPath(inheritedTemplateRoot, indexedPath, 'childNodes', realindexfollowed);
      // se ho cliccato su un non-radice non-ereditato, non posso prendere un frammento dell'ereditato, sarebbe un frammento diverso.
      if (inheritedTemplateLevel !== templateLevel) { inheritedTemplateLevel = inheritedTemplateRoot; }

    }
    this.setStyleEditor($styleInherited, model, m, styleinherited, inheritedTemplateLevel);
    // console.log('setStyleEditor inheritable, ', styleinheritable);
    const styleInheritableRoot: Element = styleinheritable ? styleinheritable.html : null;
    if (!model.isM1()) { this.setStyleEditor($styleInheritable, model, m, styleinheritable, styleInheritableRoot); }
    else {$styleInheritable[0].innerHTML = '<h5 class="text-danger">M1 elements cannot give inheritance.</h5>'}
    U.detailButtonSetup($html);
    // <meta>
    //     <dependency><attributes><type>double</ </ </
    //     <preview><img src=imgurl</img> or html diretto.</
    // </meta>

    // pulsanti per settare preview: "takesnapshotOf / set as example... + select vertex with that style"

    const $arrowup: JQuery<HTMLButtonElement> = ($html.find('button.arrow.up') as JQuery<HTMLButtonElement>).on('click', (e: ClickEvent) => {
      $(clickedLevel.parentNode).trigger('click');
    });
    $arrowup[0].disabled = htmlPath.length === 0 && m instanceof IClass;
    ($html.find('button.arrow.down') as JQuery<HTMLButtonElement>)[0].disabled = true;

    showAsEdge.checked = false;
    if (m instanceof IClass) {
      showAsEdge.disabled = m.references.length < 2;
      showAsEdgeText.innerHTML = 'Show as an edge' + (showAsEdge.disabled ? ' (require&nbsp;>=&nbsp;2&nbsp;references)' : '');
      $(showAsEdge).off('change.set').on('change.set', (e: ChangeEvent) => {
        m.shouldBeDisplayedAsEdge(true);
        this.showE(m, asEdge);
      });
    }

  }

  addmeasurableAttributeButton(measurableSelect: HTMLSelectElement, $styleeditor: JQuery<HTMLElement | SVGElement>, m: ModelPiece,
                               style: StyleComplexEntry,
                               clickedStyle: HTMLElement | SVGElement,
                               ownhtmlinput: HTMLDivElement | HTMLTextAreaElement,
                               htmlPath: number[], attr: Attr = null, valAttr: Attr = null): void {
    let val: string;
    let i: number;
    const template: HTMLElement = this.getCopyOfTemplate(m, '.measurable._root', null, false);
    const $template = $(template);
    const nameinputprefix: HTMLElement = $template.find('.nameprefix')[0] as HTMLElement;
    const nameinput: HTMLInputElement = $template.find('input.name')[0] as HTMLInputElement;
    const operator: HTMLSelectElement = $template.find('select.operator')[0] as HTMLSelectElement;
    const left: HTMLInputElement = $template.find('input.leftside')[0] as HTMLInputElement;
    const right: HTMLInputElement = $template.find('input.rightside')[0] as HTMLInputElement;
    const evaluation: HTMLInputElement = $template.find('input.evaluation')[0] as HTMLInputElement;
    const outputErrorLeft: HTMLAnchorElement = $template.find('.outputerror.left')[0] as HTMLAnchorElement;
    const outputErrorRight: HTMLAnchorElement = $template.find('.outputerror.right')[0] as HTMLAnchorElement;
    operator.disabled = true;
    operator.selectedIndex = 1;
    right.pattern = '[.]*';
    const setnameinput = (name: string) => {
      template.dataset.printablename = name;
      nameinput.value = name.substr(nameinput.dataset.prefix.length); };

    if (attr) {
      let pos: number = attr.value.indexOf('=');
      let oplen: number = 1;
      let operatorstr: string;
      if (attr.value[pos] === '>') { operatorstr = '>='; pos--; oplen++; } else
      if (attr.value[pos] === '<') { operatorstr = '<='; pos--; oplen++; } else { operatorstr = '='; }
      for (i = 0; i < operator.options.length; i++) {
        if (operator.options[i].value === operatorstr) { operator.selectedIndex = i; operatorstr = null; } }
      U.pe(!!operatorstr, 'option not found in select.', attr.value, operator);
      left.value = attr.value.substr(0, pos);
      right.value = attr.value.substr(pos + oplen);
      evaluation.value = valAttr ? valAttr.value : '';
      if (attr.name.indexOf('d_') === 0) { val = 'd_'; } else
      if (attr.name.indexOf('r_') === 0) { val = 'r_'; } else
      if (attr.name.indexOf('_chainFinal') === 0) { val = '_chainFinal'; } else
      if (attr.name.indexOf('_chain') === 0) { val = '_chain'; } else
      if (attr.name.indexOf('_rule') === 0) { val = '_rule'; } else
      if (attr.name.indexOf('_export') === 0) { val = '_export'; } else
      if (attr.name.indexOf('_import') === 0) { val = '_import'; } else
      if (attr.name.indexOf('_constraint') === 0) { val = '_constraint'; } else
      if (attr.name.indexOf('_dstyle') === 0) { val = '_dstyle'; } else
      if (attr.name.indexOf('_') === 0) { val = '_'; }
      nameinputprefix.innerText = nameinput.dataset.prefix = val;
      setnameinput(attr.name); }
    else {
      val = measurableSelect.value;
      // if (measurableSelect.value[0] === '_') {
      let name: string = measurableSelect.value + 0;
      name = U.increaseEndingNumber(name, false, false, (x: string) => { return !!clickedStyle.attributes.getNamedItem(x); });
      nameinputprefix.innerText = nameinput.dataset.prefix = measurableSelect.value;
      setnameinput(name);
      // } else { template.dataset.name = measurableSelect.value + left.value; }
    }
    /*const errormsgleft: {r_:string, d_:string, rule:string, constraint:string, dstyle:string, import:string, export:string, chain:string,
     chainfinal:string}
    = {r_:null, d_:null, rule:null, constraint:null, dstyle:null, import:null, export:null, chain:null, chainfinal:null};
    const errormsgright: {r_:string, d_:string, rule:string, constraint:string, dstyle:string, import:string, export:string, chain:string, chainfinal:string}
    = {r_:null, d_:null, rule:null, constraint:null, dstyle:null, import:null, export:null, chain:null, chainfinal:null};
    errormsgleft.rule = */
    const $input = $(ownhtmlinput);
    const changenamewhile = (x: string) => { return !!clickedStyle.attributes.getNamedItem(x); };
    const namechanged = () => {
      const oldname: string = template.dataset.name;
      const oldvalue: string = clickedStyle.getAttribute(oldname);
      let name: string = nameinput.dataset.prefix + nameinput.value;
      if (changenamewhile(name)) { name = U.increaseEndingNumber(name, false, false, changenamewhile); }
      setnameinput(name);
      clickedStyle.removeAttribute(oldname);
      clickedStyle.setAttribute(name, oldvalue);
      style.htmlobj.saveToDB(); };
    const leftIsValid = () => { return new RegExp(left.pattern).test(left.value); };
    // todo: set template.dataset.name nb: nel caso di d_ e d_ possono cambiare nome dinamicamente
    // todo: rimuovi modelpiece.ownhtml e modelpiece.instancesHtml e sostituiscili con oggetti ModelPieceStyleEntry.
    const attrchanged = (isr_: boolean = false) => {
      const is_ = left.value === '';
      const attrStr: string = (isr_ || is_ ? '' : left.value + ' ' + operator.value + ' ') + right.value;
      const templateList: string[] = U.removeDuplicates(U.findTemplateList(attrStr));
      const featuredependency: {template: string, namesArray: string, typesArray: string}[] = [];
      let i: number;
      for (i = 0; i < templateList.length; i++) {
        const template: string = templateList[i];
        const optionsSharp: string = template[1] + template[2];
        if (optionsSharp !== '##') {
          U.pw(true, 'gui debugging of template options different from the default "##" is not currently supported: ' + template);
          continue; }
        const replacedArr = U.replaceSingleVarRaw(m, template); // last is the final output
        let j: number;
        let namesArr: string = '';
        let typesArr: string = '';
        for (j = 0; j < replacedArr.length; j++) {
          namesArr += replacedArr[j].token + '.';
          const typeDetail: Type = replacedArr[j].value.typeDetail;
          typesArr += typeDetail.toEcoreString() + '.'; }
        namesArr = namesArr.substr(0, namesArr.length - 2);
        typesArr = typesArr.substr(0, typesArr.length - 2);
        featuredependency.push({template: template, namesArray: namesArr, typesArray: typesArr});
      }

      style.htmlobj.setDependencyArray(featuredependency);
      if (isr_) {
        clickedStyle.removeAttribute(template.dataset.name);
        template.dataset.printablename = left.value.trim();
        clickedStyle.setAttribute(template.dataset.name, right.value);
      } else { clickedStyle.setAttribute(template.dataset.name, attrStr); }
      $input[0].innerText = clickedStyle.outerHTML;
      $input.trigger('input'); // triggers saveToDB and refreshgui.  style.saveToDB();
    };
    const importleft = () => {
      outputErrorLeft.innerText = '';
      if (leftIsValid()) return;
      outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_import';
      outputErrorLeft.innerText = 'Left side must be one of: width, height, positionRelX, positionRelY, positionAbsX, positionAbsY';
    };
    const ruleleft = () => {
      outputErrorLeft.innerText = '';
      if (leftIsValid()) return;
      outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_rule';
      outputErrorLeft.innerText = 'Left side must be a $##template$';
    };
    const exportleft = () => {
      outputErrorLeft.innerText = '';
      const selector = left.value;
      let valid: boolean = false;
      try {
        const matches = m.getVertex() ? $(m.getVertex().getHtml()).find(selector) : [];
        console.log('_export matches: ', matches);
        valid = matches.length > 0;
      } catch (e) {
        outputErrorLeft.innerText = ' Exception: ' + JSON.stringify(e);
        console.log('_export or _chain invalid selector: ', e);
        valid = false;
      }
      if (valid) return;
      outputErrorLeft.innerText = 'Left side is not matching any element, it must be a jQuery selector.' + outputErrorLeft.innerText;
    };
    const _right = () => {
      const htmldrew: HTMLElement | SVGElement = m.getHtmlOnGraph();
      const sameElementInGraph: HTMLElement | SVGElement = U.followIndexesPath(htmldrew, htmlPath) as HTMLElement | SVGElement;
      let result: string;
      outputErrorRight.innerText = '';
      // todo: pre-validazione dei $##template$ con suggerimenti per similarity e display di tutti i nomi ammissibili se ne trova invalidi.
      try { result = U.computeMeasurableAttributeRightPart(right.value, sameElementInGraph.getAttributeNode(template.dataset.name), m, sameElementInGraph); }
      catch (e) {
        console.log('Exception on right part:', e);
        outputErrorRight.innerText = 'Exception on right part: ' + e; }
      evaluation.value = '' + result;
      return result; };
    const constraintRight = () => {
      const result: string = _right();
      const sameElementInGraph: HTMLElement | SVGElement = U.followIndexesPath(m.getHtmlOnGraph(), htmlPath) as HTMLElement | SVGElement;
      // todo: valuta anche left part e outputta: "true: leftpartcalcolata < rightpartcacolata. eventuali exceptions.";
      // todo: NB: è really incasinato e dovrei cambiare il modo di calcolare il risultato, che non calcola left e right, ma calcola size
      //  required e attuale e vede se sono soddisfacibili con l'operatore.
      return; };
    /*
          r_		      str	    any	    /     <-- add dataset to name input.
          d_		      str	    any	    /
          _		        /	      js	    any
          _rule		    $##a$  	js	    any
          _export		  jq	    js	    any
          _chainFinal	export
          _chain		  export
          _constraint	size	  js	    bool	inequality
          _dstyle		  /	      js->css	str
          _import		  size	  js	    any*/
    switch (val) {
    default:
      U.pe(true, 'unexpected select.attributetypeadd value:' + val);
      break;
    case 'r_':
    case 'd_':
      left.placeholder = 'parameter name';
      right.placeholder = 'value';
      right.pattern = '[.]+';
      $(left).on('input', () => { attrchanged(); });
      $(right).on('input', () => { attrchanged(); });
      break;
    case '_rule':
      outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_rule';
      left.placeholder = '$##template$';
      left.pattern = '^\$[10#]{2}[.]*\$$'; //semplificato: questo consente anche $ singoli interni al template, normalmente vietati.
      $(left).on('input', () => {
        attrchanged();
        setTimeout(ruleleft, 1);
      });
      $(right).on('input', () => {
        attrchanged();
        setTimeout(_right, 1);
      });
      break;
    case '_import':
      outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_import';
      left.placeholder = 'width | height | positionRelX | positionRelY | positionAbsX | positionAbsY';
      left.pattern = '$width$|^height$|^positionRelX$|^positionRelY$|^positionAbsX$|^positionAbsY$';
      $(left).on('input', () => {
        attrchanged();
        setTimeout(importleft, 1);
      });
      $(right).on('input', () => {
        attrchanged();
        setTimeout(_right, 1);
      });
      break;
    case '_chain':
    case '_chainFinal':
      outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_chainfinal-and-_chain';
      left.placeholder = 'jQuery selector';
      left.pattern = '[.]*';
      $(left).on('input', () => {
        attrchanged();
        setTimeout(exportleft, 1);
      });
      break;
    case '_export':
      left.placeholder = 'jQuery selector';
      left.pattern = '[.]*';
      outputErrorLeft.href = 'https://github.com/DamianoNaraku/ModelGraph/wiki/measurable-elements#_export';
      $(left).on('input', () => {
        attrchanged();
        setTimeout(exportleft, 1);
      });
      $(right).on('input', () => {
        attrchanged();
        setTimeout(_right, 1);
      });
      break;
    case '_dstyle':
      $(right).on('input', () => {
        attrchanged();
        setTimeout(_right, 1);
      });
      break;
    case '_':
      $(right).on('input', () => {
        attrchanged();
        setTimeout(_right, 1);
      });
      break;
    case '_constraint':
      left.placeholder = 'width | height | positionRelX | positionRelY | positionAbsX | positionAbsY';
      left.pattern = '$width$|^height$|^positionRelX$|^positionRelY$|^positionAbsX$|^positionAbsY$';
      operator.disabled = false;
      $(left).on('input', () => {
        attrchanged();
        setTimeout(importleft, 1);
        setTimeout(constraintRight, 1);
      });
      $(operator).on('change', () => {
        attrchanged();
        setTimeout(constraintRight, 1);
      });
      $(right).on('input', () => {
        attrchanged();
        setTimeout(constraintRight, 1);
      });
      break;

    }
    $(nameinput).on('input', namechanged);
    const parent = $styleeditor.find('.' + val + 'Container');
    U.pe(!parent.length, 'parent not found:', val, ', editor:', $styleeditor);
    $template.find('.hideOn.' + val).hide();
    parent[0].appendChild(template);

    $template.find('button.delete').on('click', () => {
      clickedStyle.removeAttribute(name);
      parent[0].removeChild(template);
    });
  }

  public showE(m: IClass | IReference, edge: IEdge) {
    const index = edge.getIndex();
    console.log('styleShowE(', m, ')');
    const html: HTMLElement = this.getCopyOfTemplate(m as any, '.edge', this.display, true);
    const $html = $(html);
    const edgeStyle: HTMLSelectElement = $html.find('.edgeStyle')[0] as HTMLSelectElement;
    const eColorCommon: HTMLInputElement = $html.find('.edgeColor.common')[0] as HTMLInputElement;
    const eColorHighlight: HTMLInputElement = $html.find('.edgeColor.highlight')[0] as HTMLInputElement;
    const eColorSelected: HTMLInputElement = $html.find('.edgeColor.selected')[0] as HTMLInputElement;
    const eWidthCommon: HTMLInputElement = $html.find('.edgeWidth.common')[0] as HTMLInputElement;
    const eWidthHighlight: HTMLInputElement = $html.find('.edgeWidth.highlight')[0] as HTMLInputElement;
    const eWidthSelected: HTMLInputElement = $html.find('.edgeWidth.selected')[0] as HTMLInputElement;
    const epRadiusC: HTMLInputElement = $html.find('.edgePoint.radius')[0] as HTMLInputElement;
    const epStrokeWC: HTMLInputElement = $html.find('.edgePoint.strokeW')[0] as HTMLInputElement;
    const epStrokeC: HTMLInputElement = $html.find('.edgePoint.stroke')[0] as HTMLInputElement;
    const epFillC: HTMLInputElement = $html.find('.edgePoint.fill')[0] as HTMLInputElement;
    const epRadiusH: HTMLInputElement = $html.find('.edgePointPreview.radius')[0] as HTMLInputElement;
    const epStrokeWH: HTMLInputElement = $html.find('.edgePointPreview.strokeW')[0] as HTMLInputElement;
    const epStrokeH: HTMLInputElement = $html.find('.edgePointPreview.stroke')[0] as HTMLInputElement;
    const epFillH: HTMLInputElement = $html.find('.edgePointPreview.fill')[0] as HTMLInputElement;
    const epRadiusS: HTMLInputElement = $html.find('.edgePointSelected.radius')[0] as HTMLInputElement;
    const epStrokeWS: HTMLInputElement = $html.find('.edgePointSelected.strokeW')[0] as HTMLInputElement;
    const epStrokeS: HTMLInputElement = $html.find('.edgePointSelected.stroke')[0] as HTMLInputElement;
    const epFillS: HTMLInputElement = $html.find('.edgePointSelected.fill')[0] as HTMLInputElement;
    U.pe(!edgeStyle, 'edgeStyle not found. root:', $html, 'selector: ' + '.edgeStyle');

    let styleName = '';
    switch (m.edgeStyleCommon.style) {
    default:
      U.pe(true, 'unrecognized EdgeStyle:', m.edgeStyleCommon.style);
      break;
    case EdgeModes.angular23Auto:
      styleName = 'angular23Auto';
      break;
    case EdgeModes.angular2:
      styleName = 'angular2';
      break;
    case EdgeModes.angular3:
      styleName = 'angular3';
      break;
    case EdgeModes.straight:
      styleName = 'straight';
      break;
    }
    U.selectHtml(edgeStyle, styleName, false);
    eWidthCommon.value = '' + m.edgeStyleCommon.width;
    eWidthHighlight.value = '' + m.edgeStyleHighlight.width;
    eWidthSelected.value = '' + m.edgeStyleSelected.width;
    eColorCommon.value = m.edgeStyleCommon.color;
    eColorHighlight.value = m.edgeStyleHighlight.color;
    eColorSelected.value = m.edgeStyleSelected.color;

    console.log('logic:', m, 'styleCColor:', m.edgeStyleCommon.color, 'output value:', eColorCommon.value);
    epRadiusC.value = '' + m.edgeStyleCommon.edgePointStyle.radius;
    epStrokeWC.value = '' + m.edgeStyleCommon.edgePointStyle.strokeWidth;
    epStrokeC.value = m.edgeStyleCommon.edgePointStyle.strokeColor;
    epFillC.value = m.edgeStyleCommon.edgePointStyle.fillColor;

    epRadiusH.value = '' + m.edgeStyleHighlight.edgePointStyle.radius;
    epStrokeWH.value = '' + m.edgeStyleHighlight.edgePointStyle.strokeWidth;
    epStrokeH.value = m.edgeStyleHighlight.edgePointStyle.strokeColor;
    epFillH.value = m.edgeStyleHighlight.edgePointStyle.fillColor;

    epRadiusS.value = '' + m.edgeStyleSelected.edgePointStyle.radius;
    epStrokeWS.value = '' + m.edgeStyleSelected.edgePointStyle.strokeWidth;
    epStrokeS.value = m.edgeStyleSelected.edgePointStyle.strokeColor;
    epFillS.value = m.edgeStyleSelected.edgePointStyle.fillColor;

    $(edgeStyle).off('change.set').on('change.set', (e: ChangeEvent) => {
      let mode: EdgeModes;
      switch (edgeStyle.value) {
      default:
        U.pe(true, 'unrecognized edgeMode(', edgeStyle.value, ') among: ', EdgeModes);
        break;
      case EdgeModes.straight:
      case 'straight':
        mode = EdgeModes.straight;
        break;
      case EdgeModes.angular23Auto:
      case 'angular23Auto':
        mode = EdgeModes.angular23Auto;
        break;
      case EdgeModes.angular2:
      case 'angular2':
        mode = EdgeModes.angular2;
        break;
      case EdgeModes.angular3:
      case 'angular3':
        mode = EdgeModes.angular3;
        break;
      }
      m.edgeStyleCommon.style = mode;
      m.edgeStyleHighlight.style = mode;
      m.edgeStyleSelected.style = mode;
      edge.refreshGui();
    });
    $(eColorCommon).off('change.set').on('change.set',
      (e: ChangeEvent) => {
        m.edgeStyleCommon.color = eColorCommon.value;
        edge.refreshGui();
      });
    $(eWidthCommon).off('change.set').on('change.set',
      (e: ChangeEvent) => {
        m.edgeStyleCommon.width = isNaN(+eWidthCommon.value) ? 0 : +eWidthCommon.value;
        edge.refreshGui();
      });
    $(eColorHighlight).off('change.set').on('change.set',
      (e: ChangeEvent) => {
        m.edgeStyleHighlight.color = eColorHighlight.value;
        edge.refreshGui();
      });
    $(eWidthHighlight).off('change.set').on('change.set',
      (e: ChangeEvent) => {
        m.edgeStyleHighlight.width = isNaN(+eWidthHighlight.value) ? 0 : +eWidthHighlight.value;
        edge.refreshGui();
      });
    $(eColorSelected).off('change.set').on('change.set',
      (e: ChangeEvent) => {
        m.edgeStyleSelected.color = eColorSelected.value;
        edge.refreshGui();
      });
    $(eWidthSelected).off('change.set').on('change.set',
      (e: ChangeEvent) => {
        m.edgeStyleSelected.width = isNaN(+eWidthSelected.value) ? 0 : +eWidthSelected.value;
        edge.refreshGui();
      });

    $(epRadiusC).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleCommon.edgePointStyle.radius = isNaN(+epRadiusC.value) ? 0 : +epRadiusC.value;
      edge.refreshGui();
    });
    $(epStrokeWC).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleCommon.edgePointStyle.strokeWidth = isNaN(+epStrokeWC.value) ? 0 : +epStrokeWC.value;
      edge.refreshGui();
    });
    $(epStrokeC).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleCommon.edgePointStyle.strokeColor = epStrokeC.value;
      edge.refreshGui();
    });
    $(epFillC).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleCommon.edgePointStyle.fillColor = epFillC.value;
      edge.refreshGui();
    });

    $(epRadiusH).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleHighlight.edgePointStyle.radius = isNaN(+epRadiusH.value) ? 0 : +epRadiusH.value;
      edge.refreshGui();
    });
    $(epStrokeWH).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleHighlight.edgePointStyle.strokeWidth = isNaN(+epStrokeWH.value) ? 0 : +epStrokeWH.value;
      edge.refreshGui();
    });
    $(epStrokeH).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleHighlight.edgePointStyle.strokeColor = epStrokeH.value;
      edge.refreshGui();
    });
    $(epFillH).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleHighlight.edgePointStyle.fillColor = epFillH.value;
      edge.refreshGui();
    });

    $(epRadiusS).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleSelected.edgePointStyle.radius = isNaN(+epRadiusS.value) ? 0 : +epRadiusS.value;
      edge.refreshGui();
    });
    $(epStrokeWS).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleSelected.edgePointStyle.strokeWidth = isNaN(+epStrokeWS.value) ? 0 : +epStrokeWS.value;
      edge.refreshGui();
    });
    $(epStrokeS).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleSelected.edgePointStyle.strokeColor = epStrokeS.value;
      edge.refreshGui();
    });
    $(epFillS).off('change.set').on('change.set', (e: ChangeEvent) => {
      m.edgeStyleSelected.edgePointStyle.fillColor = epFillS.value;
      edge.refreshGui();
    });
  }

}
