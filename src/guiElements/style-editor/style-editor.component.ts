import {Component, OnInit} from '@angular/core';
import {
  AccessModifier, DamContextMenuComponent,
  Draggableoptions,
  DraggableOptionsPH,
  EdgeModes,
  GraphSize,
  IClass,
  IClassifier,
  IEdge,
  IModel, InputPopup,
  IPackage,
  IReference,
  IVertex, M2Class,
  Measurable, MeasurableEvalContext,
  MeasurableRuleLists,
  MeasurableRuleParts,
  measurableRules,
  MeasurableTemplateGenerator,
  ModelPiece,
  PropertyBarr,
  ReservedClasses,
  Resizableoptions,
  ResizableoptionsPH,
  RotatableoptionsPH,
  Status,
  StyleComplexEntry, TSON_JSTypes,
  U,
  ViewHtmlSettings,
  ViewPoint,
  ViewRule,
} from '../../common/Joiner';
import {PropertyBarTabs} from '../propertyBar/propertyBar';
import ChangeEvent = JQuery.ChangeEvent;
import KeyDownEvent = JQuery.KeyDownEvent;
import ClickEvent = JQuery.ClickEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import {AutocompleteMatch} from '../../common/util';
import {Style} from '@angular/cli/lib/config/schema';
import Swal from 'sweetalert2';
import ContextMenuEvent = JQuery.ContextMenuEvent;

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
class editorcontext {templateLevel: Element; graphLevel: Element; applyNodeChangesToInput: () => void;}
type ownStyleContext = {
  editLabel: HTMLLabelElement;
  editAllowed: HTMLButtonElement;
  // selectstyle: HTMLSelectElement,
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
  styledelete: HTMLButtonElement,
  measurableCheckbox: HTMLInputElement,
  interfaceCheckbox: HTMLInputElement,
  abstractCheckbox: HTMLInputElement,
};

export class StyleEditor {
  private propertyBar: PropertyBarr = null;
  private $root: JQuery<HTMLElement> = null;
  private $templates: JQuery<HTMLElement> = null;
  private $display: JQuery<HTMLElement> = null;
  private root: HTMLElement = null;
  private templates: HTMLElement = null;
  private display: HTMLElement = null;
  private clickedLevel: Element = null;
  sizeInputx: HTMLInputElement;
  sizeInputy: HTMLInputElement;
  sizeInputw: HTMLInputElement;
  sizeInputh: HTMLInputElement;
  private ownstylecontext: ownStyleContext;

  onHide(): void {
    console.log('styleeditor.onHide()');
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

  isVisible(): boolean { return PropertyBarr.isTabVisible(this.propertyBar.model, PropertyBarTabs.style); }

  show(m: ModelPiece, clickedLevel: Element) {
    m = m || this.propertyBar.selectedModelPiece;
    if (!m) m = Status.status.getActiveModel();
    // console.log('styleShow(', m, ')');
    this.clickedLevel = null;
    if (m instanceof IModel) { this.showM(m); this.updateClickedGUIHighlight(); return; }
    if (m instanceof IPackage) { this.showM(m.parent); this.updateClickedGUIHighlight(); return; }
    // if (m instanceof IPackage) { this.showP(m); return; }
    this.clickedLevel = clickedLevel = clickedLevel || m.getHtmlOnGraph();
    this.showMP(m, null, false, null);
    this.addEventListeners();
    this.updateClickedGUIHighlight();
    return;/*
    if (m instanceof IClass) { this.showC(m); }
    if (m instanceof IAttribute) { this.showA(m); }
    if (m instanceof IReference) { this.showR(m); }
    if (m instanceof EOperation) { this.showO(m); }
    if (m instanceof EParameter) { this.showParam(m); }*/
  }

  addEventListeners(): void {
    // this.$root.find('[data-modelpieceid]').off('contextmenu')
    // .on('contextmenu', (e: ContextMenuEvent): boolean => { return DamContextMenuComponent.contextMenu.onContextMenu(e); });
  }
  updateClickedGUIHighlight() {
    $(this.propertyBar.model.graph.container).find('.styleEditorSelected').removeClass('styleEditorSelected');
    if (this.isVisible() && this.clickedLevel) { this.clickedLevel.classList.add('styleEditorSelected'); }
  }

  private getCopyOfTemplate(m: ModelPiece, s: string, appendTo: HTMLElement, clear: boolean): HTMLElement {
    let $tmp: JQuery<HTMLElement> = this.$templates.find('.template' + s);
    const html: HTMLElement = U.cloneHtml<HTMLElement>($tmp[0]);
    const $html = $(html);
    html.classList.remove('template');
    html.dataset.modelpieceid = '' + m.id;
    html.style.display = 'block';
    if (appendTo) {
      if (clear) U.clear(appendTo);
      appendTo.appendChild(html); }
    let model: IModel = m.getModelRoot();
    $html.find('.' + (model.isM1() ? 'm1' : 'm2') + 'hide').hide();
    // eccezione: se rimane esistente ma invisibile il pulsante affianco mantiene i bordi spigolosi e non si allinea al centro.
    // cancellare gli elementi è problematico perchè alcuni gli setto eventi, valori e ci interagisco anche se non servirebbe, solo per non mettere mille IF
    // if (model.isM2()) { $html.find('.detailButtonContainer button.detail.inherited').remove(); }
    if (!(m instanceof IClass)) $(html).find('.iclass.show').hide();
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
      if(U.isNumerizable(input.value)) m.graph.grid.x = +input.value; // will be displayed by gridDisplay.trigger
      showGrid.checked = true;
      $(showGrid).trigger('change');
      m.refreshGUI();
    });
    $(gridY).off('change.set').on('change.set', (e: ChangeEvent) => {
      const input: HTMLInputElement = e.currentTarget;
      if(U.isNumerizable(input.value)) m.graph.grid.y = +input.value; // will be displayed by gridDisplay.trigger
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
      m.graph.setGrid(null, null, input.checked);
    });
  }

  showP(m: IPackage) { U.pe(true, 'styles of Package(', m, '): unexpected.'); }

  setStyleEditor($styleown: JQuery<HTMLElement>, model: IModel, mp: ModelPiece, style: StyleComplexEntry, context: editorcontext, indexedPath: number[] = null, insideOwnSection: boolean = false): number[] {
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
    const obj: ownStyleContext = {
      editLabel: null,
      editAllowed: null,
      // selectstyle: null,
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
      saveasName: null,
      styledelete: null,
      measurableCheckbox: null,
      interfaceCheckbox: null,
      abstractCheckbox: null
    };
    if (insideOwnSection) this.ownstylecontext = obj;
    //// setting up labelAllowEdit (checking if the (own, inherited or inheritable) style exist or a modelpiece local copy is needed.)
    obj.editAllowed = $styleown.find('button.allowEdit')[0] as HTMLButtonElement;
    obj.editLabel = $styleown.find('label.allowEdit')[0] as HTMLLabelElement;
    // obj.selectstyle = $styleown.find('select.stylename')[0] as HTMLSelectElement;
    obj.detailButton = $styleown.find('button.detail')[0] as HTMLButtonElement;
    obj.detailPanel = $styleown.find('div.detail')[0] as HTMLElement;
    obj.input = $styleown.find('.html[contenteditable="true"]')[0] as HTMLTextAreaElement | HTMLDivElement;
    obj.preview = $styleown.find('.preview')[0] as HTMLElement;
    obj.previewselect = $styleown.find('select.previewselector')[0] as HTMLSelectElement;
    obj.styledelete = $styleown.find('button.styledelete')[0] as HTMLButtonElement;
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
    if (style && !(isOwn && !style.isownhtml || isInherited && !style.html || isInheritable && !style.html)) {
      $(obj.editLabel).hide();
    } else {
      obj.input.setAttribute('disabled', 'true');
      U.remove(obj.styledelete);
      obj.input.contentEditable = 'false';
      if (!lastvp) {
        obj.editLabel.innerText = 'Is required to have at least one non-default viewpoint applied to customize styles.';
        obj.editAllowed.style.display = 'none';
      } else
        $(obj.editAllowed).on('click', (e: ClickEvent) => {
          const mptarget: ModelPiece = isInherited ? mp.metaParent : mp;
          let v: ViewRule = lastvp.viewsDictionary[mptarget.id];
          if (isOwn) {
            if (!v) v = new ViewRule(lastvp);
            U.pe(!!v.htmlo, 'htmlo should be undefined at this point.');
            v.htmlo = new ViewHtmlSettings();
            v.htmlo.setHtmlStr( (style ? style.html : mptarget.getStyle().html).outerHTML ); }
          if (isInheritable) {
            if (!v) v = new ViewRule(lastvp);
            U.pe(!!v.htmli, 'htmli should be undefined at this point.');
            v.htmli = new ViewHtmlSettings();
            const instanceCurrentStyle: Element = ModelPiece.GetStyle(Status.status.m, mp.getInstanceClassName());
            v.htmli.setHtmlStr( instanceCurrentStyle.outerHTML ); }
          if (isInherited) {
            if (!v) v = new ViewRule(lastvp);
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
    obj.input.setAttribute('placeholder', U.replaceVarsString(mp, obj.input.getAttribute('placeholder')));
    obj.input.innerText = context.templateLevel.outerHTML;

    $styleown.find('.htmllevel').html((isInherited ? 'Instances Html' : 'Own html')
      + ' (' + (indexedPath && indexedPath.length ? 'Level&nbsp;' + indexedPath.length : 'Root&nbsp;level') + ')');
    let graphRoot: Element = mp.getHtmlOnGraph();
    context.graphLevel = graphRoot && insideOwnSection && U.followIndexesPath(graphRoot, indexedPath, 'childNodes');
    // just not displayed U.pe(!graphRoot, 'failed to get graphroot', graphRoot, indexedPath, mp);
    // U.pe(insideOwnSection && !context.graphLevel, 'failed to get graphlv', graphRoot, indexedPath, mp);
    context.applyNodeChangesToInput = (): void => {
      // console.log(templateLevel.outerHTML);
      obj.input.innerText = context.templateLevel.outerHTML;
      onStyleChange();
    };
    const onStyleChange = (): void => {
      console.log('onStyleChange', U.getCaller(), U.getStackTrace());
      const inputHtml: Element = U.toHtml(obj.input.innerText);
      const disabledAttr: string = obj.input.getAttribute('disabled');
      if (disabledAttr === 'true' || disabledAttr === '') return;
      // console.log('PRE: ', inputHtml, 'outer:', inputHtml.outerHTML, 'innertext:', obj.input.innerText);
      U.pif(debug, '*** setting inheritable PRE. style.htmlobj:', style.htmlobj, ', style:', style, ', context:', context,
        'templatelvl.parent:', context.templateLevel.parentElement, ', inputHtml:', inputHtml);
      if (context.templateLevel.parentElement) {
        context.templateLevel.parentElement.insertBefore(inputHtml, context.templateLevel);
        context.templateLevel.parentElement.removeChild(context.templateLevel);
        context.templateLevel = inputHtml;
      } else {
        U.pe(!style.view || style.isGlobalhtml || style.isCustomGlobalhtml, (style.isGlobalhtml ? 'native default html cannot be modified.' : 'overriden default html cannot be modified here. Change it from the element marked with "asDefault".') + ' default', style, 'todo: automatically make new ClassVieww');
        // ??old message?: se tutto va bene qui deve dare errore, crea una nuova ClassVieww e applicalo al modelpiece ed edita quello.
        style.htmlobj.setHtml(context.templateLevel = inputHtml);
        U.pif(debug,'*** setting inheritable POST. style.htmlobj', style.htmlobj, 'style:', style);
      }
      if (isOwn) { mp.refreshGUI(); }
      if (isInheritable) { mp.refreshInstancesGUI(); }
      if (isInherited) { mp.metaParent.refreshInstancesGUI(); }
      if (!isInheritable && indexedPath) this.clickedLevel = U.followIndexesPath(mp.getHtmlOnGraph(), indexedPath, 'childNodes');
      graphRoot = mp.getHtmlOnGraph();
      if (insideOwnSection) {
        context.graphLevel = graphRoot && U.followIndexesPath(graphRoot, indexedPath, 'childNodes');
        this.updateClickedGUIHighlight();
      }
      // obj.input.innerText = inputHtml.outerHTML;
      // DANGER: se lo fai con l'evento onchange() ti sposta il cursore all'inizio e finisci per scrivere rawtext prima dell'html invalidandolo.
      // tenendolo dovresti scrivere i caratteri uno alla volta riposizionando il cursore nel punto giusto ogni volta.
      // console.log('POST: ', inputHtml, 'outer:', inputHtml.outerHTML, 'innertext:', obj.input.innerText);
      // updatePreview();
    };
    $(obj.input).off('paste.set').on('paste.set', (e: any/*ClipboardEvent*/) => { this.onPaste(e); onStyleChange(); })
    // .off('change.set').on('change.set', onStyleChange)
    // .off('input.set').on('input.set', onStyleChange)
      .off('blur.set').on('blur.set', onStyleChange)
    .off('keydown.set').on('keydown.set', (e: KeyDownEvent) => { if (e.key === 'Esc') { this.propertyBar.refreshGUI(); } });


    // setup measurable options.
    const measurableRoot: HTMLElement = MeasurableTemplateGenerator.generateMeasurableTemplate();
    tmp = $styleown.find('.measurablePlaceholder')[0];
    U.swap(measurableRoot, tmp);
    // .log('swap End:', measurableRoot.childNodes.length, tmp.childNodes.length);
    //U.pe(true,'swapend');
    const $measurableRoot = $(measurableRoot);
    const $measurableBody = $measurableRoot.find('.measurableSettingRoot');
    // obj.input is same const ownhtmlinput: HTMLDivElement | HTMLTextAreaElement = $measurableRoot.find('.html[contenteditable="true"]')[0] as HTMLDivElement | HTMLTextAreaElement;
    const $measurableCheckbox: JQuery<HTMLInputElement> = $measurableRoot.find('input.ismeasurable') as JQuery<HTMLInputElement>;
    const measurableCheckbox = obj.measurableCheckbox = $measurableCheckbox[0];
    measurableCheckbox.disabled = obj.input.getAttribute('disabled') === 'true';
    measurableCheckbox.checked = (context.templateLevel.classList.contains('measurable') || insideOwnSection && context.graphLevel && context.graphLevel.classList.contains('measurable'));
    const $measurableTitle = $measurableRoot.find('.meas_acc0 > .maintitle');
    $measurableTitle.on('click', (e: ClickEvent) => {
      const $innerroot = $measurableBody;
      const innerroot = $innerroot[0];
      if (innerroot.classList.contains('show')) {
        // todo: elimina slideup e usa la transizione css su collapsing, come?
        $measurableTitle.addClass('collapsed');
        $innerroot.slideUp(400, () => { innerroot.classList.remove('show', 'collapsing', 'collapse'); });
        return; }
      $measurableTitle.removeClass('collapsed');
      $innerroot.slideDown(400, () => { innerroot.classList.add('collapse', 'show'); });
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    });
    $(obj.styledelete).on('click', () => { style.view.delete(); mp.refreshGUI(); this.show(mp, mp.getHtmlOnGraph()); });
    let stopPropagation = (e: ClickEvent | MouseDownEvent | MouseUpEvent) => { e.stopPropagation(); };
    if (!$measurableCheckbox[0].checked) $measurableTitle.hide();
    let templateParent = context.templateLevel && context.templateLevel.parentElement;
    $measurableCheckbox.on('click', stopPropagation).on('mousedown', stopPropagation).on('mouseup', stopPropagation)
      .off('change.enabledisablemeasurable').on('change.enabledisablemeasurable', (e: ChangeEvent) => {
      context.templateLevel.classList.remove('measurable');
      if (measurableCheckbox.checked) {
        context.templateLevel.classList.add('measurable');
        if (context.templateLevel instanceof HTMLElement) context.templateLevel.style.position = 'absolute';
        $measurableTitle.slideDown();
        if (!$measurableBody[0].classList.contains('show')) { $measurableTitle.trigger('click'); }
        // console.log('is now measurable:', context.templateLevel, 'parent:', context.templateLevel, 'parentStyle', templateParent.style.position);
        if (templateParent) {
          if (templateParent.style.position !== 'relative'){
            U.ps(true, 'The parent node of a measurable element must have style.position="relative" due to jqueryUI limitations. The parent style has been automatically corrected, was'
              + (templateParent.style.position === '' ? ' unset.' : ' \'' + templateParent.style.position + '\'.')
            );
            templateParent.style.position = 'relative';
          }
        }
      }
      else {
        if (context.templateLevel instanceof HTMLElement) context.templateLevel.style.position = ''; // restore default
        console.log(context.templateLevel, context);
        if (templateParent) templateParent.style.position = '';
        if ($measurableBody[0].classList.contains('show')) { $measurableTitle.trigger('click'); }
        $measurableTitle.slideUp(); }
      if (U.isTriggered(e)) return;
      context.applyNodeChangesToInput();
    }).trigger('change');
    this.makeMeasurableOptions(measurableRoot, obj.input, style, context, indexedPath);
    // const measurableSelect: HTMLSelectElement = $measurableRoot.find('select.attributetypeadd')[0] as HTMLSelectElement;
    /*$measurableRoot.find('button.addmeasurable').on('click', () => {
      this.addmeasurableAttributeButton(measurableSelect, $measurableRoot, mp, style, templateLevel as Element, ownhtmlinput, indexedPath);
    });* /
    for (i = 0; i < templateLevel.attributes.length; i++) {
      const a: Attr = templateLevel.attributes[i];
      if (a.name[0] === '_' || a.name.indexOf('r_') == 0 || a.name.indexOf('r_') == 0) {
        const val: Attr = this.clickedLevel.attributes.getNamedItem(a.name.substr(1));
        const style = null;
        this.addmeasurableAttributeButton(measurableSelect, $measurableRoot, mp, style, templateLevel as Element, ownhtmlinput, indexedPath, a, val)
      }
    }*/
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
    const templateRoot: Element = style.html;
    // let templateLevel: Element = templateRoot;
    let indexedPath: number[] = U.getIndexesPath(clickedLevel, 'parentNode', 'childNodes', clickedRoot);
    // console.log('clickedRoot', clickedRoot, 'clickedLevel', clickedLevel, 'path:', indexedPath);
    U.pe(U.followIndexesPath(clickedRoot, indexedPath, 'childNodes') !== clickedLevel, 'mismatch.', indexedPath);
    const realindexfollowed: {indexFollowed: string[] | number[], debugArr: {index: string | number, elem: any}[]} = {indexFollowed: [], debugArr:[]};
    let context: editorcontext = new editorcontext();
    context.templateLevel = U.followIndexesPath(templateRoot, indexedPath, 'childNodes', realindexfollowed);
    // console.log('clickedRoot:',clickedRoot, 'clikedLevel:', clickedLevel, 'indexedPath:', indexedPath, 'followed:', realindexfollowed,
    // 'templateRoot:', templateRoot, 'templateLevel:', templateLevel);
    if (realindexfollowed.indexFollowed.length !== indexedPath.length) {
      indexedPath = realindexfollowed.indexFollowed as number[];
      this.clickedLevel = clickedLevel = U.followIndexesPath(clickedRoot, indexedPath,  'childNodes'); }
    // html set END.
    const model: IModel = m.getModelRoot();
    if (asEdge && (m instanceof IClass || m instanceof IReference) && m.shouldBeDisplayedAsEdge()) { return this.showE(m, asEdge); }
    const html: HTMLElement = this.getCopyOfTemplate(m, '.modelpiece', this.display, true);
    const $html = $(html);
    const $asDefault = $html.find('.asDefault') as JQuery<HTMLInputElement>;
    const asDefault = $asDefault[0];
    asDefault.checked = style.isownhtml && style.view.isDefault;
    asDefault.disabled = !style.isownhtml;
    $asDefault.on('change', (e: ChangeEvent) => { style.view.setDefault(asDefault.checked); });
    const showAsEdge: HTMLInputElement = $html.find('.showAsEdge')[0] as HTMLInputElement;
    const showAsEdgeText: HTMLElement = $html.find('.showAsEdgeText')[0] as HTMLElement;
    const $styleown = $html.find('.style.own');
    const $styleInherited = $html.find('.style.inherited');
    const $styleInheritable = $html.find('.style.inheritable');
    const htmlPath: number[] = this.setStyleEditor($styleown, model, m, style, context, indexedPath, true);
    // U.pe(!style.html, $styleown, m, clickedLevel, model, style, instanceshtml);
    // const clickedonStyle: Element = U.followIndexesPath(style.html, htmlPath) as Element;
    $html.find('.tsclass').html('' + m.printableName()); // + (htmlDepth === 0 ? ' (root level)' : ' (level&nbsp;' + htmlDepth + ')') );
    // console.log('setStyleEditor inherited, ', styleinherited);
    let inheritedcontext: editorcontext = new editorcontext();
    if (styleinherited) {
      const inheritedTemplateRoot: Element = styleinherited.html;
      inheritedcontext.templateLevel = U.followIndexesPath(inheritedTemplateRoot, indexedPath, 'childNodes', realindexfollowed);
      // se ho cliccato su un non-radice non-ereditato, non posso prendere un frammento dell'ereditato, sarebbe un frammento diverso.
      if (inheritedcontext.templateLevel !== context.templateLevel) { inheritedcontext.templateLevel = inheritedTemplateRoot; }
    }
    if (!model.isM2()) { this.setStyleEditor($styleInherited, model, m, styleinherited, inheritedcontext); }
    else { $styleInherited[0].innerHTML = '<h5 class="text-danger">Cannot get inheritance from M3 elements.</h5>'}
    // console.log('setStyleEditor inheritable, ', styleinheritable);
    let inheritablecontext: editorcontext = new editorcontext();
    inheritablecontext.templateLevel = styleinheritable ? styleinheritable.html : null;
    if (!model.isM1()) { this.setStyleEditor($styleInheritable, model, m, styleinheritable, inheritablecontext); }
    else { $styleInheritable[0].innerHTML = '<h5 class="text-danger">M1 elements cannot give inheritance.</h5>'}
    U.detailButtonSetup($html);
    /// start autosize
    const v: IVertex = m instanceof IClassifier ? m.getVertex() : null;
    this.sizeInputx = $html.find('input.sizex')[0] as HTMLInputElement;
    this.sizeInputy = $html.find('input.sizey')[0] as HTMLInputElement;
    this.sizeInputw = $html.find('input.sizew')[0] as HTMLInputElement;
    this.sizeInputh = $html.find('input.sizeh')[0] as HTMLInputElement;
    const $autosizew = $html.find('input.autowidth') as JQuery<HTMLInputElement>;
    const $autosizeh = $html.find('input.autoheight') as JQuery<HTMLInputElement>;
    const autosizew = $autosizew[0];
    const autosizeh = $autosizeh[0];
    if (v && this.sizeInputx) {
      autosizeh.disabled = autosizew.disabled = this.ownstylecontext.measurableCheckbox.disabled;
      const isAutosize = v.isAutosize();
      this.sizeInputw.disabled = autosizew.checked = isAutosize.x;
      this.sizeInputh.disabled = autosizeh.checked = isAutosize.y;
      const autosizeLevelTemplate: HTMLElement = templateRoot.firstChild as any;
      const setAutosize = (statusx: boolean, statusy: boolean): void => {
        const html: HTMLElement = autosizeLevelTemplate; // this.getHtmlFirstChild();
        if (statusx !== null) {
          if (statusx) {
            html.dataset.autosizex = 'true';
            html.style.width = 'auto';
          } else {
            html.dataset.autosizex = 'false';
            html.style.width = '100%';
          }
        }
        if (statusy !== null) {
          if (statusy) {
            html.dataset.autosizey = 'true';
            html.style.height = 'auto';
          } else {
            html.dataset.autosizey = 'false';
            html.style.height = '100%';
          }
        }
        context.applyNodeChangesToInput();
        v.refreshGUI();
        v.refreshEdgesGUI();
      };
      $autosizew.on('change', () => { setAutosize(autosizew.checked, null); this.sizeInputw.disabled = autosizew.checked; });
      $autosizeh.on('change', () => { setAutosize(null, autosizeh.checked); this.sizeInputh.disabled = autosizeh.checked; });
      const vSize: GraphSize = v.getSize();
      this.sizeInputx.value = '' + (vSize.x);
      this.sizeInputy.value = '' + (vSize.y);
      this.sizeInputw.value = '' + (vSize.w);
      this.sizeInputh.value = '' + (vSize.h);
      $(this.sizeInputx).on('change', () => { v.setSize(new GraphSize(+this.sizeInputx.value, null, null, null)); });
      $(this.sizeInputy).on('change', () => { v.setSize(new GraphSize(null, +this.sizeInputy.value, null, null)); });
      $(this.sizeInputw).on('change', () => { v.setSize(new GraphSize(null, null, +this.sizeInputw.value,  null)); });
      $(this.sizeInputh).on('change', () => { v.setSize(new GraphSize(null, null, null, +this.sizeInputh.value)); });
    } else { $html.find('.sizeContainer').remove(); }
    //// end autosize
    // <meta>
    //     <dependency><attributes><type>double</ </ </
    //     <preview><img src=imgurl</img> or html diretto.</
    // </meta>

    // pulsanti per settare preview: "takesnapshotOf / set as example... + select vertex with that style"

    const $arrowupp: JQuery<HTMLButtonElement> = ($html.find('button.arrow.upp') as JQuery<HTMLButtonElement>).on('click', (e: ClickEvent) => {
      this.propertyBar.show(null, clickedRoot, null, false); });
    const $arrowup: JQuery<HTMLButtonElement> = ($html.find('button.arrow.up') as JQuery<HTMLButtonElement>).on('click', (e: ClickEvent) => {
      this.propertyBar.show(null, clickedLevel.parentElement, null, false); });
    $arrowup[0].disabled = $arrowupp[0].disabled = htmlPath.length === 0 && m instanceof IClass;
    // ($html.find('button.arrow.down') as JQuery<HTMLButtonElement>)[0].disabled = true;

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
  public showE(m: IClass | IReference, edge: IEdge) {
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
  private makeMeasurableOptions(measurableShell: Element, inputuseless: HTMLDivElement|HTMLTextAreaElement,
                                style: StyleComplexEntry, context: editorcontext, indexedPath: number[]): void{
    const $measurableShell = $(measurableShell);
    const $meas_acc = $measurableShell.find('.meas_acc');
    let i: number;
    const searchForm: HTMLInputElement = $meas_acc.find('input.rulesearch').on('input', (e: Event) => {
      let searchstr: string = searchForm.value.trim().toLowerCase();
      if(searchstr === '') {
        $meas_acc.find('.panel[prefixlc]').show();
        return; }
      $meas_acc.find('.panel[prefixlc]').hide();
      $meas_acc.find('.panel[prefixlc*=\'' + searchstr + '\']').show();
    })[0] as HTMLInputElement;
    const resizearrows: {tl, tla, t, ta, tr, tra, ml, mla, mr, mra, bl, bla, b, ba, br, bra} = {} as any;
    const dragarrows: {x, y} = {} as any;
    const $arrowroot = $measurableShell.find('.rectangledrawing.outer');
    const $innerroot = $arrowroot.find('.rectangledrawing');
    resizearrows.tl = $innerroot.find('.top.left');
    resizearrows.t = $innerroot.find('.side.top');
    resizearrows.tr = $innerroot.find('.top.right');
    resizearrows.ml = $innerroot.find('.side.left');
    resizearrows.mr = $innerroot.find('.side.right');
    resizearrows.bl = $innerroot.find('.bot.left');
    resizearrows.b = $innerroot.find('.side.bot');
    resizearrows.br = $innerroot.find('.bot.right');
    resizearrows.tla = $arrowroot.find('.top.left.arrow');
    resizearrows.ta = $arrowroot.find('.side.top.arrow');
    resizearrows.tra = $arrowroot.find('.top.right.arrow');
    resizearrows.mla = $arrowroot.find('.side.left.arrow');
    resizearrows.mra = $arrowroot.find('.side.right.arrow');
    resizearrows.bla = $arrowroot.find('.bot.left.arrow');
    resizearrows.ba = $arrowroot.find('.side.bot.arrow');
    resizearrows.bra = $arrowroot.find('.bot.right.arrow');
    dragarrows.x = $measurableShell.find('.arrowh');
    dragarrows.y = $measurableShell.find('.arrowv');

    const updateArrowGUI = (arrow: HTMLInputElement, direction: string = null) => {
      direction = direction || arrow.getAttribute('direction');
      const innerbox: HTMLElement = $innerroot.find('*[direction = "' + direction + '"]')[0] as HTMLElement;
      if (!innerbox) return;
      innerbox.classList.remove('selected');
      if (arrow.checked) innerbox.classList.add('selected');
    };
    const arrowchange = (e: ChangeEvent) => {
      let tmp: any;
      const arrow: HTMLInputElement = e.currentTarget;
      const direction = arrow.getAttribute('direction');
      const checked = arrow.checked;
      const isrotatable = arrow.classList.contains('rot');
      const isdraggable = arrow.classList.contains('drag');
      const isresizable = !isdraggable && !isrotatable;
      updateArrowGUI(arrow, direction);
      if (isdraggable) { tmp = context.templateLevel.getAttribute(measurableRules._jquiDra + Draggableoptions.axis); }
      if (isresizable) { tmp = context.templateLevel.getAttribute(measurableRules._jquiRes + Resizableoptions.handles); }
      let currentHandles: string[] = U.replaceAll(tmp || '', ' ', '').split(',');
      U.arrayRemoveAll(currentHandles, direction);
      if (checked) { U.ArrayAdd(currentHandles, direction); }
      U.arrayRemoveAll(currentHandles, '');
      U.pe (Resizableoptions.handles !== 'handles', Resizableoptions.handles);
      if (isdraggable) {
        if (currentHandles.length) { context.templateLevel.setAttribute(measurableRules._jquiDra + Draggableoptions.axis, currentHandles.join(', ')); }
        else { context.templateLevel.removeAttribute(measurableRules._jquiDra + Draggableoptions.axis); } }
      if (isresizable){
        if (currentHandles.length){ context.templateLevel.setAttribute(measurableRules._jquiRes + Resizableoptions.handles, currentHandles.join(', ')); }
        else { context.templateLevel.removeAttribute(measurableRules._jquiRes + Resizableoptions.handles);} }
      console.log('resizable:', isresizable, 'draggable:', isdraggable, currentHandles, 'tmp:', tmp, context);
      context.applyNodeChangesToInput(); };
    const rulelist: MeasurableRuleLists = Measurable.getRuleList(context.templateLevel, null, true);
    /*
    for (let key in measurableRules) {
      key = measurableRules[key];
      const counterselector: string = '[data-target=".meas_acc > .panel > .' + key + '"] .rulecounter';
      const counter: HTMLElement = $measurableShell.find(counterselector)[0] as any;
       U.pe(!counter, 'counter not found for rule: ' + key);
      counter.innerText = rulelist[key].length;
    }*/
    // console.log('rules:', rulelist.all.length, rulelist, context.templateLevel);
    // $measurableShell.find('.rulecontainer:not(.template)').remove();
    for (i = 0; i < rulelist.all.length; i++) {
      const rule: MeasurableRuleParts = rulelist.all[i];
      U.pe(!rule.prefix, 'astdh', rule, rulelist, context.templateLevel);
      if (rule.prefix === measurableRules._jquiDra && rule.name === Draggableoptions.axis) continue;
      if (rule.prefix === measurableRules._jquiRes && rule.name === Resizableoptions.handles) continue;
      if (false && rule.prefix === measurableRules._jquiDra && rule.name === Draggableoptions.axis) {
        const value = rulelist._jquiDra[i].right;
        const handles: string[] = (value.indexOf('all') !== -1 ? 'x,y' : U.replaceAll(value, ' ', '')).split(',');
        let map: {x,y} = {} as any;
        for (i = 0; i < handles.length; i++) {
          switch(handles[i]) {
            default: break;
            case 'x': map.x = true; break;
            case 'y': map.y = true; break; }
        }
        dragarrows.x.checked = map.x;
        dragarrows.y.checked = map.y;
        continue; }
      if (false && rule.prefix === measurableRules._jquiRes && rule.name === Resizableoptions.handles) {
        const handles: string[] = (rule.right.indexOf('all') !== -1 ? 'n,e,s,w,ne,se,sw,nw' : U.replaceAll(rule.right, ' ', '')).split(',');
        let map: {tl, t, tr, l, r, bl, b, br} = {} as any;
        for (i = 0; i < handles.length; i++) {
          switch(handles[i]) {
            default: break;
            case 'n': map.t = true; break;
            case 'ne': map.tr = true; break;
            case 'nw': map.tl = true; break;
            case 'e': map.r = true; break;
            case 'w': map.l = true; break;
            case 's': map.b = true; break;
            case 'se': map.br = true; break;
            case 'sw': map.bl = true; break; }
        }
        resizearrows.tl.checked = map.tl;
        resizearrows.t.checked = map.t;
        resizearrows.tr.checked = map.tr;
        resizearrows.ml.checked = map.l;
        resizearrows.mr.checked = map.r;
        resizearrows.bl.checked = map.bl;
        resizearrows.b.checked = map.b;
        resizearrows.br.checked = map.br;
        continue; }
      const fakeevt: any = {};
      fakeevt.currentTarget = $measurableShell.find('.ruletitle[data-target=".meas_acc > .panel > .' + rule.prefix + '"] > button.addrule')[0];
      this.addRule(fakeevt, context, rule);
    }

    // per leggere la direzione da una freccia htmlcheckbox: getAttribute('direction');


    let tmp: any;
    let j: number;
    tmp = context.templateLevel.getAttribute(measurableRules._jquiDra + Draggableoptions.axis);
    const dragHandles: string[] = U.replaceAll(tmp || '', ' ', '').split(',');
    tmp = context.templateLevel.getAttribute(measurableRules._jquiRes + Resizableoptions.handles);
    const resHandles: string[] = U.replaceAll(tmp || '', ' ', '').split(',');
    const handlesarr: string[][] = [dragHandles, resHandles];
    for (j = 0; j < handlesarr.length; j++) {
      const handles: string[] = handlesarr[j];
      U.arrayRemoveAll(handles, '');
      for (i = 0; i < handles.length; i++) {
        const arrow: HTMLInputElement = $measurableShell.find('.arrow[direction=' + handles[i] + ']')[0] as any;
        arrow.checked = true;
        updateArrowGUI(arrow); }
    }

    $measurableShell.find('.arrow').on('change', arrowchange);
    $measurableShell.find('button.addrule').off('click.addrule').on('click.addrule',
      (e: ClickEvent) => { e.stopPropagation(); this.addRule(e, context); });
  }

  getruleShellRoot(node: Element): HTMLDivElement {
    while (node.parentElement && !node.classList.contains('panel')) node = node.parentElement;
    return node as HTMLDivElement; }

  addRule(e: ClickEvent, context: editorcontext, ruleparts: MeasurableRuleParts = null): void {
    let i: number;
    const title = (e.currentTarget as HTMLElement).parentElement;
    const $title = $(title);
//    console.log(title, e);
    const ruletype: string = U.trimStart(title.dataset.target.substr(title.dataset.target.lastIndexOf('>') + 1), ['.', ' ']);
    const prefix: string = ruletype;
    const counter: HTMLElement = $title.find('.rulecounter')[0];
    counter.innerHTML = '' + (+counter.innerHTML + 1);
    title.setAttribute('counter', counter.innerText);
    // U.pe(counter.innerHTML === '2', '2');
    // const targetsectionselector: string = title.dataset.target;
    // const $targetsection: JQuery<HTMLElement> = $measurableShell.find(targetsectionselector) as  JQuery<HTMLElement>;
    const appendparent = title.parentElement;
    const newtemplate = U.cloneHtml($(appendparent).find('.template')[0], true);
    newtemplate.classList.remove('template');
    appendparent.insertBefore(newtemplate, title);
    appendparent.insertBefore(title, newtemplate); // non esiste insertAfter, quindi ri-prependo il titolo.

    const $newtemplate = $(newtemplate);
    const nameinput: HTMLInputElement = $newtemplate.find('input.attrname')[0] as HTMLInputElement;
    const left: HTMLInputElement = $newtemplate.find('input.leftside')[0] as HTMLInputElement;
    const operator: HTMLSelectElement = $newtemplate.find('.operatorcontainer > select.operator')[0] as HTMLSelectElement;
    const right: HTMLInputElement = $newtemplate.find('input.rightside')[0] as HTMLInputElement;
    const target: HTMLInputElement = $newtemplate.find('input.target')[0] as HTMLInputElement;
    const $testbutton: JQuery<HTMLButtonElement> = $newtemplate.find('button.executedebug') as any;


    const dynamicjquiplaceholder = (valueinput: HTMLInputElement, phinput: HTMLInputElement, phdictionary: object) => {
      $(valueinput).on('change', () => {
        let valid: boolean = U.validateDatalist(valueinput);
        if (!phdictionary) return;
        console.log(' key:', valueinput.value, 'map:', phdictionary);
        phinput.placeholder = valid ? phdictionary[valueinput.value] : 'invalid jQueryUi parameter';
      });};

    if (left && left.list || nameinput.list) switch (nameinput.dataset['target'] || left && left.dataset['target']) {
      default: U.pe(true, 'unexpected datalist generator:', target, nameinput, left); break;
      case measurableRules._jquiRes: dynamicjquiplaceholder(nameinput, right, ResizableoptionsPH); break;
      case measurableRules._jquiDra: dynamicjquiplaceholder(nameinput, right, DraggableOptionsPH); break;
      case measurableRules._jquiRot: dynamicjquiplaceholder(nameinput, right, RotatableoptionsPH); break;
      case measurableRules.constraint: dynamicjquiplaceholder(left, right, MeasurableTemplateGenerator.constraintPlaceholderMap); break;
    }

    if (ruleparts) { // if existing rule
      nameinput.value = ruleparts.name;
      if (left) left.value = ruleparts.left;
      console.log('md5', operator, ruleparts);
      if (operator) U.selectHtml(operator, ruleparts.operator);
      right.value = ruleparts.right;
      target.value = ruleparts.target;
    }
    else {
      if (prefix === measurableRules.onRefresh) {
        context.templateLevel.classList.add(ReservedClasses.onRefresh)
        context.applyNodeChangesToInput(); }
    }
    const rulespanelshell = this.getruleShellRoot(nameinput);
    const $rulespanelshell = $(rulespanelshell);

    if (e.type === "click") { // if not triggered.
      $rulespanelshell.find('.collapse').addClass('show'); }
    U.pe(rulespanelshell === nameinput, 'a');
    let oldrulename = nameinput.value;
    let leftdataset: Element = left ? $('datalist#' + left.getAttribute('list'))[0] as any : null;
    let lefthashmap = null;
    const mp: ModelPiece = this.propertyBar.selectedModelPiece;


    const generateRuleValue = (): string => {
      let ret: string =  (left ? left.value : '');
      console.log('generaterule operator:', operator, operator && operator.value)
      if (!operator || !(operator instanceof HTMLSelectElement)) return ret + Measurable.separator + right.value;
      switch (operator.value) {
        default: U.pe(true, 'unexpected measurable rule operator:' + operator.value, operator); break; // describing separators (arrows, do, then...) are ignored.
        case '<=': case '<': case '>': case '>=': case '!=': case '==': case '=': case '===': case '!==': ret += Measurable.separator + operator.value; break; }
      return ret + Measurable.separator + right.value; };
    const generateOldRuleName = (): string => { return ruletype + oldrulename; };
    const generateRuleName = (): string => { return ruletype + nameinput.value; };
    const updateRule = () => {
      if (left && (left.getAttribute('invalid') === '1' || right.getAttribute('invalid') === '1')) return;
      const name: string = generateRuleName();
      const value: string = generateRuleValue();
      console.log('setattribute: name:', name, ' generated by:', ruletype + ' + ' + nameinput.value);
      context.templateLevel.setAttribute(name, value);
      context.applyNodeChangesToInput();
    };
    const isRuleNameTaken = (name: string): boolean => {
      const $allrules = $rulespanelshell.find('input.attrname');
      console.log('other names:', rulespanelshell, $allrules);
      for (i = 0; i < $allrules.length; i++){
        const ruleinput = $allrules[i] as HTMLInputElement;
        if (ruleinput === nameinput) continue;
        if (ruleinput.value === name) return true;
      }
      return false;
    };
    nameinput.pattern = '[^ "\']*';
    const setRuleTarget = (str: string): void => {
      context.templateLevel.setAttribute('relativeSelectorOf' + generateRuleName(), str);
      U.pif(true, 'changetarget of: |' + ruletype + oldrulename + '|  |' + generateRuleName() + '|');
      context.applyNodeChangesToInput();
    };
    const targetChanged = (): void => { setRuleTarget(target.value); };
    const setRuleName = (name: string): void => {
      if (!U.followsPattern(nameinput, name)) return;
      console.log('setRuleName pt0 ', nameinput, 'istaken?', isRuleNameTaken(name));
      if (oldrulename === name) return; // errore qui? durante l'add buttopn insert event questo è sempre true, e quando addo una rule sono tutte named "1". non penso più sia questo
      console.log('setRuleName pt2 ', nameinput, 'istaken?', isRuleNameTaken(name));
      const oldtarget = context.templateLevel.getAttribute('relativeSelectorOf' + ruletype + oldrulename);
      while (isRuleNameTaken(name)) { name = U.increaseEndingNumber(name); }
      context.templateLevel.removeAttribute(ruletype + oldrulename);
      if (oldtarget) {
        // non printa? ma funziona U.pif(true, 'rename) delete: |' + ruletype + oldrulename + '|; insert: |' + ruletype + name + '|');
        context.templateLevel.removeAttribute('relativeSelectorOf' + ruletype + oldrulename);
        context.templateLevel.setAttribute('relativeSelectorOf' + ruletype + name, oldtarget);
      }
      console.log('setRuleName pt3 ', nameinput, 'istaken?', isRuleNameTaken(name));
      oldrulename = nameinput.value = name;
      updateRule(); };
    const leftChanged = () => {
      updateRule();
    };

    const operatorChanged = () => {
      updateRule();
    };
    const rightChanged = () => {
      updateRule();
    };
    const nameChanged = () => { setRuleName(nameinput.value = nameinput.value.toLowerCase()); };

    let input: InputPopup;
    let tmp = this.getRuleEditor();
    const editorshell: HTMLElement = tmp.editor;
    const editorinput: HTMLElement = tmp.input;
    const helplink: HTMLElement = U.toHtml('<span>Need help? read the <a href = "https://github.com/DamianoNaraku/jjodel/wiki/Positional-element-editor">documentation</a>.</span>');
    const leftClicked = () => {
      editorinput.innerText = String.fromCharCode(160) + left.value;
      input = new InputPopup();
      input.setText('Left side editor', null, helplink);
      input.setNestedInputNode(editorshell, editorinput);
      input.addOkButton(null, [(e: ClickEvent, value: string) => {
        left.value = U.replaceAll(value, String.fromCharCode(160), ' ').trim();
        leftChanged(); }]);
      input.show();
      U.setSelection(editorinput, editorinput.innerText.length);
      $(editorinput).trigger('mouseup'); }
    const rightClicked = () => {
      editorinput.innerText = String.fromCharCode(160) + right.value;
      input = new InputPopup();
      input.setText('Right side editor', null, helplink);
      input.setNestedInputNode(editorshell, editorinput);
      input.addOkButton(null, [(e: ClickEvent, value: string) => {
        right.value = U.replaceAll(value, String.fromCharCode(160), ' ').trim();
        rightChanged(); }]);
      input.show();
      U.setSelection(editorinput, editorinput.innerText.length);
      // mouseup triggera il ricalcolo dei suggerimenti. sia perchè potrebbero essercene già di pronti, sia per pulire i suggerimenti della precedente apertura (l'editor è unico)
      $(editorinput).trigger('mouseup'); }
    const targetClicked = () => {
      editorinput.innerText = String.fromCharCode(160) + target.value;
      input = new InputPopup();
      input.setText('Target selector editor', null, helplink);
      input.setNestedInputNode(editorshell, editorinput);
      input.addOkButton(null, [(e: ClickEvent, value: string) => {
        target.value = U.replaceAll(value, String.fromCharCode(160), ' ').trim();
        targetChanged(); }]);
      input.show();
      U.setSelection(editorinput, editorinput.innerText.length);
      $(editorinput).trigger('mouseup'); }

    $(nameinput).off('change.name').on('change.name', nameChanged);
    $(operator).off('change.operator').on('change.operator', operatorChanged);
    $(left).off('click.leftside').on('click.leftside', leftClicked);
    $(right).off('click.rightside').on('click.rightside', rightClicked);
    $(target).off('click.target').on('click.target', targetClicked);

    /*
    $(nameinput).off('change.name').on('change.name', nameChanged);
    $(left).off('change.leftside').on('change.leftside', leftChanged);
    $(operator).off('change.operator').on('change.operator', operatorChanged);
    $(right).off('change.rightside').on('change.rightside', rightChanged);
    $(target).off('change.target').on('change.target', targetChanged);*/
    $newtemplate.find('button.ruledelete').off('click.delete').on('click.delete', () => {
      newtemplate.parentNode.removeChild(newtemplate);
      counter.innerHTML = '' + (+counter.innerHTML - 1);
      title.setAttribute('counter', counter.innerText);
      context.templateLevel.removeAttribute(generateOldRuleName());
      context.templateLevel.removeAttribute(generateRuleName()); //todo: potrebbe fare casini se qualcuno swappa nomi e cancella una regola?
      if (prefix === measurableRules.onRefresh) { context.templateLevel.classList.remove(ReservedClasses.onRefresh); }
      context.applyNodeChangesToInput();
    });
    if (!ruleparts) setRuleName(nameinput.getAttribute('defaultvalue'));


    const isEventTriggerRule: boolean = Measurable.eventTriggers.indexOf(prefix as measurableRules) !== -1;
    let debugleft = $newtemplate.find('.debugleft')[0];
    let debugoperator = $newtemplate.find('.debugoperator')[0];
    let debugright = $newtemplate.find('.debugright')[0];
    let debugtarget = $newtemplate.find('.debugtarget')[0];
    let debugtriggers = $newtemplate.find('.debugtriggers')[0];
    if (!left) { U.remove(debugleft.parentElement); debugleft = null; }
    if (!right) { U.remove(debugright.parentElement); debugright = null; }
    if (!operator) { U.remove(debugoperator.parentElement); debugoperator = null; }
    if (!target) { U.remove(debugtarget.parentElement); debugtarget = null; }
    if (!isEventTriggerRule) { U.remove(debugtriggers.parentElement); debugtriggers = null; }
    let execute = () => {
      if (!context.graphLevel) { U.ps(true, 'Rules cannot be executed on elements not displayed on the graph.'); return; }
      const attr: Attr = context.graphLevel.attributes.getNamedItem(generateRuleName().toLowerCase());
      let parts: MeasurableRuleParts = new MeasurableRuleParts(attr, null, false);
      U.pe(!parts.prefix, 'unexpected rule: ' + parts, this, attr, generateRuleName());
      let output: MeasurableRuleParts = new MeasurableRuleParts(null, null, true);
      try { output = parts.process(false); }
      catch (exception) {
        output = new MeasurableRuleParts(null, null, true);
        console.error('testing the execution caused exception:', exception);
        output.right = 'Exception:' + exception;
      }
      console.log('execution output:', output);
      if (debugleft) debugleft.innerText = output.left;
      if (debugoperator) debugoperator.innerText = output.operator;
      if (debugright) debugright.innerText = output.right;
      if (debugtarget) debugtarget.innerText = output.target;
      if (debugtriggers) {
        let str = 'Triggered ' + output.triggeredResults.length + ' rules.';
        debugtriggers.innerText = 'Triggered ' + output.triggeredResults.length + ' rules.';
        if (!output.triggeredResults.length) str += '\n if this is not intended, remind that layoutable rules always start with the "_" prefix, eg: "_export1"'
        debugtriggers.innerText = str;i
      }
    }
    $testbutton.on('mousedown', execute);
  }

  isLoaded(): boolean{
    //todo: carica styleEditor solo quando diventa visibile.
    return true;
  }

  static ruleeditor: HTMLElement = null;
  static ruleeditorinput: HTMLElement = null;
  private getRuleEditor(): {editor: HTMLElement, input: HTMLElement} {
    if (StyleEditor.ruleeditor) return {editor: StyleEditor.ruleeditor, input: StyleEditor.ruleeditorinput};
    const callforeachkeyrecursive = (obj: object, f: (prePath: string, key: string) => void, pathuntilnow: string) => {
      let key0: string;
      let key: string;
      let val: any;
      for (key0 in obj) {
        key = key0;
        val = obj[key];
        if (typeof val === TSON_JSTypes.function) { key += U.getFunctionSignatureFromComments(val).signature + ';'; }
        else if (Array.isArray(val)) { key += '/*array*/'; }
        else if (typeof val === TSON_JSTypes.object) { key += '.'; /*no post comment*/}
        else key += '; /*' + typeof val + '*/';
        U.pe(key === 'vertex', 'key:', key, 'obj[key]:', obj[key], 'val:', val, 'cond:', (val instanceof Object && !(val instanceof Function)));
        f(pathuntilnow + '.', key);
        // console.log(pathuntilnow, val);
        if (val instanceof Element) return;
        if (val instanceof Object) callforeachkeyrecursive(val, f, pathuntilnow + '.' + key0);
      }
    }
    let i: number;
    // let preChars = ' ';
    let spaceUsed = ' '; // String.fromCharCode(160);
    let preChars = '};' + spaceUsed + '*/+-';
    let autocompletekeys: AutocompleteMatch[] = [];

    let addmanyv2 = (prechars: string, prePath: string, key: string) => {
      if (prePath.charAt(0) === '.') prePath = prePath.substr(1);
      for (i = 0; i < preChars.length; i++) { autocompletekeys.push( new AutocompleteMatch(prechars[i] + prePath, key) ); }
    }
    let contextobj: MeasurableEvalContext = MeasurableEvalContext.fillFake();
    let obj = {'this': contextobj};
    callforeachkeyrecursive(obj, (prePath: string, key: string) => { addmanyv2(preChars, prePath, key); }, '');
    let inputcontainer: HTMLElement = document.createElement('div');
    let input: HTMLElement = document.createElement('div');
    let suggestionlist: HTMLUListElement = document.createElement('ul');
    inputcontainer.append(input);
    inputcontainer.append(suggestionlist);
    inputcontainer.setAttribute('style', "width: calc(75vw - 152px); height: auto;");
    input.setAttribute('style', "border: 1px solid #ced4da; border-radius: .25rem; padding: 1rem;");
    input.setAttribute('contenteditable', 'true');
    U.autocompleteInputSetup(inputcontainer, autocompletekeys);
    StyleEditor.ruleeditor = inputcontainer;
    StyleEditor.ruleeditorinput = input;
    return this.getRuleEditor(); }
}
