/*import {Component, OnInit} from '@angular/core';
import {
  IAttribute, M2Class, IEdge, IModel, IPackage, IReference, ModelPiece, PropertyBarr, Status, U, IClass,
  EdgeModes, EOperation, EParameter, Database, Size, AttribETypes, EType, ModelPieceStyleEntry, ViewHtmlSettings, StyleComplexEntry
}                 from '../../common/Joiner';
import ChangeEvent = JQuery.ChangeEvent;
import BlurEvent = JQuery.BlurEvent;
import KeyDownEvent = JQuery.KeyDownEvent;
import KeyboardEventBase = JQuery.KeyboardEventBase;
import KeyUpEvent = JQuery.KeyUpEvent;
import ClickEvent = JQuery.ClickEvent;
import SelectEvent = JQuery.SelectEvent;
import {template} from '@angular/core/src/render3';

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
    this.updateClickedGUI();
  }
  onShow(): void {
    this.propertyBar.onHide();
    this.updateClickedGUI();
  }

  constructor(propertyBar: PropertyBarr, $root: JQuery<HTMLElement>) {
    this.propertyBar = propertyBar;
    this.$root = $root.find('.styleContainer');
    this.$display = this.$root.find('.StyleEditorDisplay');
    this.$templates = this.$root.find('.styleTemplates');
    this.root = this.$root[0];
    this.display = this.$display[0];
    this.templates = this.$templates[0]; }

  // static styleChanged(e: ClipboardEvent | ChangeEvent | KeyDownEvent | KeyUpEvent | KeyboardEvent): HTMLElement | SVGElement { }
  static onPaste(e: any): void { // e: ClipboardEvent
    e.preventDefault();
    const div: HTMLDivElement | HTMLTextAreaElement = e.currentTarget as HTMLDivElement | HTMLTextAreaElement;
    const text: string = (e as unknown as any).originalEvent.clipboardData.getData('text/plain');
    div.innerText = text;
  }

  isVisible(): boolean { return this.$root.is(':visible'); }
  show(m: ModelPiece, clickedLevel: Element) {
    this.clickedLevel = clickedLevel;
    console.log('styleShow(', m, ')');
    if (m instanceof IModel) { this.showM(m); return; }
    // if (m instanceof IPackage) { this.showP(m); return; }
    this.showMP(m, null, false, false);
    return;/*
    if (m instanceof IClass) { this.showC(m); }
    if (m instanceof IAttribute) { this.showA(m); }
    if (m instanceof IReference) { this.showR(m); }
    if (m instanceof EOperation) { this.showO(m); }
    if (m instanceof EParameter) { this.showParam(m); }* /
  }

  updateClickedGUI() {
    $(this.propertyBar.model.graph.container).find('.styleEditorSelected').removeClass('styleEditorSelected');
    if (this.isVisible() && this.clickedLevel) { this.clickedLevel.classList.add('styleEditorSelected'); } }
  private getCopyOfTemplate(m: ModelPiece, s: string): HTMLElement {
    const $html: JQuery<HTMLElement> = this.$templates.find('.Template' + s);
    const html: HTMLElement = U.cloneHtml<HTMLElement>($html[0]);
    html.dataset.modelPieceID = '' + m.id;
    U.clear(this.display);
    this.display.appendChild(html);
    html.style.display = 'block';
    console.log($html, '.' + (m.getModelRoot().isM() ? 'm1' : 'm2') + 'hide',
      $html.find('.' + (m.getModelRoot().isM() ? 'm1' : 'm2') + 'hide').hide());

    $html.find('.' + (m.getModelRoot().isM() ? 'm1' : 'm2') + 'hide').hide();
    return html;
  }

  showM(m: IModel) {
    console.log('styleShowM(', m, ')');
    const html: HTMLElement = this.getCopyOfTemplate(m, '.model');
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
      m.graph.zoom.x = isNaN(+input.value) ? 0 : +input.value;
      m.graph.setZoom();
    });
    $(zoomY).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.zoom.y = isNaN(+input.value) ? 0 : +input.value;
      m.graph.setZoom();
    });
    $(showGrid).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      m.graph.ShowGrid(input.checked);
    });
  }

  showP(m: IPackage) { U.pe(true, 'styles of Package(', m, '): unexpected.'); }

  setStyleEditor($styleown, m: ModelPiece, model: IModel, templateLevel: Element, indexedPath: number[] = null): number[] {
    const forinstances: boolean = !!indexedPath;
    let i: number;
    const obj: {
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

    // obj.is...
    /* if (model.isM1()) { obj.isM1.disabled = obj.isM1.checked = true; }
    if (model.isM2()) { obj.isM2.disabled = obj.isM2.checked = true; }
    if (m instanceof IClass) { obj.isClass.disabled = obj.isClass.checked = true; }
    if (m instanceof IReference) { obj.isReference.disabled = obj.isReference.checked = true; }
    if (m instanceof IAttribute) { obj.isAttribute.disabled = obj.isAttribute.checked = true; }
    if (m instanceof EOperation) { obj.isOperation.disabled = obj.isOperation.checked = true; }
    if (m instanceof EParameter) { obj.isParameter.disabled = obj.isParameter.checked = true; } * /
    let style: ModelPieceStyleEntry = m.getStyleObj();
    obj.isM1.checked = style.AllowedOnM1;
    obj.isM2.checked = style.AllowedOnM2;
    obj.isClass.checked = style.allowedOnClass;
    obj.isReference.checked = style.allowedOnReference;
    obj.isAttribute.checked = style.allowedOnAttribute;
    obj.isOperation.checked = style.allowedOnOperation;
    obj.isParameter.checked = style.allowedOnParameter;
    $(obj.isM1).on('change', (e: ChangeEvent) => {
      style.AllowedOnM1 = obj.isM1.checked;
      style.saveToDB();
    });
    $(obj.isM2).on('change', (e: ChangeEvent) => {
      style.AllowedOnM2 = obj.isM2.checked;
      style.saveToDB();
    });
    $(obj.isClass).on('change', (e: ChangeEvent) => {
      style.allowedOnClass = obj.isClass.checked;
      style.saveToDB();
    });
    $(obj.isAttribute).on('change', (e: ChangeEvent) => {
      style.allowedOnAttribute = obj.isAttribute.checked;
      style.saveToDB();
    });
    $(obj.isReference).on('change', (e: ChangeEvent) => {
      style.allowedOnReference = obj.isReference.checked;
      style.saveToDB();
    });
    $(obj.isOperation).on('change', (e: ChangeEvent) => {
      style.allowedOnOperation = obj.isOperation.checked;
      style.saveToDB();
    });
    $(obj.isParameter).on('change', (e: ChangeEvent) => {
      style.allowedOnParameter = obj.isParameter.checked;
      style.saveToDB();
    });
    $(obj.saveasName).on('input', (e: ChangeEvent) => {
      Database.deleteStyle(style, () => {
        style.name = obj.saveasName.value;
        style.saveToDB();
      });
    });
    $(obj.forkButton).on('click', () => {
      m.styleobj = style = style.duplicate();
      obj.saveasName.value = style.name;
    });
    $(obj.delete).on('click', (e: ClickEvent) => { m.styleobj = null; style.delete(); });* /
    // obj.input
    obj.input.setAttribute('placeholder', U.replaceVarsString(m, obj.input.getAttribute('placeholder')));
    obj.input.innerText = templateLevel.outerHTML;
    $styleown.find('button.detail').on('click', (e: ClickEvent) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const $btn = $(btn);
      const $detailPanel = $styleown.find(btn.getAttribute('target'));
      const $otherPanels: Element[] = $styleown.find('div.detail').toArray().filter(x => x != $detailPanel[0]);
      // $styleown.find('div.detail:not(' + btn.getAttribute('target') + ')');

      const b: boolean = btn.dataset.on === '1';
      if (b) {
        btn.style.width = '';
        btn.dataset.on = '0';
        btn.style.borderBottom = '';
        $btn.find('.closed').show();
        $btn.find('.opened').hide();
        // $detailcontainers.show();
        $detailPanel.hide();
      } else {
        const size: Size = U.sizeof(btn);
        btn.style.width = size.w + 'px';
        btn.dataset.on = '1';
        btn.style.borderBottom = '3px solid #252525';
        $btn.find('.closed').hide();
        $btn.find('.opened').show()[0].style.width = (size.w - 15 * 2) + 'px';
        for (i = 0; i < $otherPanels.length; i++) { $($otherPanels).trigger('click'); }
        $detailPanel.show();
      }
    });

    // htmlInput.value = (m.getStyle().firstChild as HTMLElement).outerHTML;
    /*const clickedRoot: Element = ModelPiece.getLogicalRootOfHtml(clickedLevel);
    const templateRoot: HTMLElement | SVGElement = m.styleobj.html;// m.getStyle();
    // let templateLevel: HTMLElement | SVGElement = templateRoot;
    const indexedPath: number[] = U.getIndexesPath(clickedRoot, clickedLevel);
    console.log('clickedRoot', clickedRoot, 'clickedLevel', clickedLevel, 'path:', indexedPath);
    let templateLevel: Element = U.followIndexesPath(templateRoot, indexedPath);
    console.log('templateRoot', templateRoot, 'templateLevel', templateLevel);* /
    obj.input.innerText = templateLevel.outerHTML;
    obj.input.setAttribute('templated', 'true'); // debug, todo: remove
    const updatePreview = () => { obj.preview.innerHTML = obj.input.innerText; };

    $styleown.find('.htmllevel').html((forinstances ? 'Instances Html' : 'Own html')
      + ' (' + (indexedPath && indexedPath.length ? 'Level&nbsp;' + indexedPath.length : 'Root&nbsp;level') + ')');
    let optgroup: HTMLOptGroupElement = U.toHtml('<optgroup label="' + U.getTSClassName(m) + '"></optgroup>');
    obj.previewselect.appendChild(optgroup);
    for (i = 0; i < m.metaParent.instances.length; i++) {
      const peer: ModelPiece = m.metaParent.instances[i];
      const opt: HTMLOptionElement = document.createElement('option');
      optgroup.appendChild(opt);
      opt.value = '' + peer.id;
      opt.innerText = peer.printableName();
    }

    optgroup = U.toHtml('<optgroup label="Compatible Styles"></optgroup>');
    obj.selectstyle.appendChild(optgroup);
    /*    const styles: ModelPieceStyleEntry[] = Styles.getAllowed(m);
        for (i = 0; i < styles.length; i++) {
          const style: ModelPieceStyleEntry = styles[i];
          const opt: HTMLOptionElement = document.createElement('option');
          optgroup.appendChild(opt);
          opt.innerText = style.name;
          opt.value = style.getKey();
        }

    * /
    const onStyleChange = () => {
      const inputHtml: Element = U.toHtml(obj.input.innerText);
      // console.log('PRE: ', inputHtml, 'outer:', inputHtml.outerHTML, 'innertext:', obj.input.innerText);
      if (templateLevel.parentElement) {
        templateLevel.parentElement.insertBefore(inputHtml, templateLevel);
        templateLevel.parentElement.removeChild(templateLevel);
        templateLevel = inputHtml;
      } else {/*
        U.pe(!indexedPath || indexedPath.length > 0 || style.html !== templateLevel, 'parent should be null only on root style elements.');
        style.html = templateLevel = inputHtml as HTMLElement | SVGElement;* /
        m.customStyleToErase = templateLevel = inputHtml;
      }
      m.refreshGUI();
      // obj.input.innerText = inputHtml.outerHTML;
      // DANGER: se lo fai con l'evento onchange() ti sposta il cursore all'inizio e finisci per scrivere rawtext prima dell'html invalidandolo.
      // tenendolo dovresti scrivere i caratteri uno alla volta riposizionando il cursore nel punto giusto ogni volta.
      // console.log('POST: ', inputHtml, 'outer:', inputHtml.outerHTML, 'innertext:', obj.input.innerText);
      updatePreview();
    };
    $(obj.input).off('paste.set').on('paste.set', StyleEditor.onPaste)
      .off('change.set').on('change.set', onStyleChange)
      .off('input.set').on('input.set', onStyleChange)
      .off('blur.set').on('blur.set', onStyleChange)
      .off('keydown.set').on('keydown.set', (e: KeyDownEvent) => { if (e.key === 'Esc') { this.propertyBar.refreshGUI(); } });

    obj.selectstyle.disabled = indexedPath && indexedPath.length > 0;
    /*$(obj.selectstyle).on('change', (e: ChangeEvent) => {
      const style: ModelPieceStyleEntry = Styles.getStyleFromKey(obj.selectstyle.value);
      obj.input.innerText = style.htmlstr;
      $(obj.input).trigger('input');
    });* /
    return indexedPath; }

  showMP(m: ModelPiece, clickedLevel: Element = null, asMeasurable: boolean = false, asEdge: boolean = false) {
    console.log('styleShow(', m, ', ' + U.getTSClassName(m) + ')');
    let i: number;
    this.clickedLevel = clickedLevel = clickedLevel || this.clickedLevel;
    // set htmls
    const clickedRoot: Element = ModelPiece.getLogicalRootOfHtml(clickedLevel);
    const style: StyleComplexEntry = m.getStyle();
    const templateRoot: Element = style.html || null;// m.styleobj.html;// m.getStyle();
    // let templateLevel: HTMLElement | SVGElement = templateRoot;
    let indexedPath: number[] = U.getIndexesPath(clickedLevel, 'parentNode', 'childNodes', clickedRoot);
    console.log('clickedRoot', clickedRoot, 'clickedLevel', clickedLevel, 'path:', indexedPath);
    const realindexfollowed: {indexFollowed: string[] | number[], debugArr: {index: string | number, elem: any}[]} = {indexFollowed: [], debugArr:[]};
    const templateLevel: Element = U.followIndexesPath(templateRoot, indexedPath, 'childNodes', realindexfollowed);
    const clickedonStyle = templateLevel; // todo: sure about this?
    if (realindexfollowed.indexFollowed.length !== indexedPath.length) {
      indexedPath = realindexfollowed.indexFollowed as number[];
      this.clickedLevel = clickedLevel = U.followIndexesPath(clickedRoot, indexedPath);}
    this.updateClickedGUI();
    // html set END.
    const model: IModel = m.getModelRoot();
    if (asEdge && (m instanceof IClass || m instanceof IReference) && m.shouldBeDisplayedAsEdge()) { return this.showE(m); }
    const html: HTMLElement = this.getCopyOfTemplate(m, '.Template.modelpiece');
    const $html = $(html);
    const showAsEdge: HTMLInputElement = $html.find('.showAsEdge')[0] as HTMLInputElement;
    const showAsEdgeText: HTMLElement = $html.find('.showAsEdgeText')[0] as HTMLElement;
    const $styleown = $html.find('.style.own');
    const $stylei = $html.find('.style.instances');
    const instanceshtml = model.isM1() ? null : (m.styleOfInstances ? m.styleOfInstances : ModelPiece.GetStyle(Status.status.m, U.getTSClassName(m)));
    //const ownhtml = m.getStyle();
    // const style: ModelPieceStyleEntry = m.getStyleObj();
    const htmlPath: number[] = this.setStyleEditor($styleown, m, model, templateLevel, indexedPath);
    // U.pe(!style.html, $styleown, m, clickedLevel, model, style, instanceshtml);
    // const clickedonStyle: HTMLElement | SVGElement = U.followIndexesPath(style.html, htmlPath) as HTMLElement | SVGElement;
    $html.find('.tsclass').html('' + m.printableName()); // + (htmlDepth === 0 ? ' (root level)' : ' (level&nbsp;' + htmlDepth + ')') );

    if (!model.isM1()) { this.setStyleEditor($stylei, m, model, templateLevel); }

    // <meta>
    //     <dependency><attributes><type>double</ </ </
    //     <preview><img src=imgurl</img> or html diretto.</
    // </meta>

    // pulsanti per settare preview: "takesnapshotOf / set as example... + select vertex with that style"

    U.pe(!showAsEdge, 'wrong PropertyBar.show() call', m, 'html:', html);
    showAsEdge.checked = false;
    if (m instanceof IClass) {
      showAsEdge.disabled = m.references.length < 2;
      showAsEdgeText.innerHTML = 'Show as an edge' + (showAsEdge.disabled ? ' (require&nbsp;>=&nbsp;2&nbsp;references)' : '');
      $(showAsEdge).off('change.set').on('change.set', (e: ChangeEvent) => {
        m.shouldBeDisplayedAsEdge(true);
        this.showE(m);
      });
    }

    const ownhtmlinput: HTMLDivElement | HTMLTextAreaElement = $styleown.find('.html[contenteditable="true"]')[0] as HTMLDivElement | HTMLTextAreaElement;
    const measurableSelect: HTMLSelectElement = $html.find('select.attributetypeadd')[0] as HTMLSelectElement;
    $html.find('button.addmeasurable').on('click', () => {
      this.addmeasurableAttributeButton(measurableSelect, $html, m, style, clickedonStyle, ownhtmlinput, htmlPath);
    });
    for (i = 0; i < clickedonStyle.attributes.length; i++) {
      const a: Attr = clickedonStyle.attributes[i];
      if (a.name[0] === '_' || a.name.indexOf('r_') == 0 || a.name.indexOf('r_') == 0) {
        const val: Attr = clickedLevel.attributes.getNamedItem(a.name.substr(1));
        this.addmeasurableAttributeButton(measurableSelect, $html, m, style, clickedonStyle, ownhtmlinput, htmlPath, a, val)
      }
    }

    const $arrowup: JQuery<HTMLButtonElement> = ($html.find('button.arrow.up') as JQuery<HTMLButtonElement>).on('click', (e: ClickEvent) => {
      $(clickedLevel.parentNode).trigger('click');
    });
    $arrowup[0].disabled = htmlPath.length === 0 && m instanceof IClass;
    ($html.find('button.arrow.down') as JQuery<HTMLButtonElement>)[0].disabled = true;
    // todo: devi consentire di modificare anche defaultStyle (m3)

  }

  addmeasurableAttributeButton(measurableSelect: HTMLSelectElement, $styleeditor: JQuery<HTMLElement | SVGElement>, m: ModelPiece,
                               style: ViewHtmlSettings,
                               clickedStyle: HTMLElement | SVGElement,
                               ownhtmlinput: HTMLDivElement | HTMLTextAreaElement,
                               htmlPath: number[], attr: Attr = null, valAttr: Attr = null): void {
    let val: string;
    let i: number;
    const template: HTMLElement = U.cloneHtml($styleeditor.find('.measurable.template._root')[0] as HTMLElement);
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
      template.dataset.name = name;
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
    errormsgleft.rule = * /
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
      style.saveToDB(); };
    const leftIsValid = () => { return new RegExp(left.pattern).test(left.value); };
    // todo: set template.dataset.name nb: nel caso di d_ e d_ possono cambiare nome dinamicamente
    // todo: rimuovi modelpiece.ownhtml e modelpiece.instancesHtml e sostituiscili con oggetti ModelPieceStyleEntry.
    const attrchanged = (isr_: boolean = false) => {
      const is_ = left.value === '';
      const attrStr: string = (isr_ || is_ ? '' : left.value + ' ' + operator.value + ' ') + right.value;
      const templateList: string[] = U.removeDuplicates(U.findTemplateList(attrStr));
      style.featuredependency = [];
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
          const typeDetail: EType | M2Class = replacedArr[j].value.typeDetail;
          typesArr += (replacedArr[j].value.this instanceof IClass ? 'Class' : typeDetail.name) + '.'; }
        namesArr = namesArr.substr(0, namesArr.length - 2);
        typesArr = typesArr.substr(0, typesArr.length - 2);
        style.featuredependency.push({template: template, namesArray: namesArr, typesArray: typesArr});
      }
      if (isr_) {
        clickedStyle.removeAttribute(template.dataset.name);
        template.dataset.name = left.value.trim();
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
      const htmldrew: HTMLElement | SVGElement = m.getHtml();
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
      const sameElementInGraph: HTMLElement | SVGElement = U.followIndexesPath(m.getHtml(), htmlPath) as HTMLElement | SVGElement;
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
          _import		  size	  js	    any* /
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

  public showE(m: IClass | IReference) {
    console.log('styleShowE(', m, ')');
    const edge: IEdge = m.edges && m.edges.length ? m.edges[0] : null;
    const html: HTMLElement = this.getCopyOfTemplate(m, '.edge');
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
*/
