import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { IModel, IPackage, IReference, ModelPiece, Status, U, IClass, EdgeModes, ViewRule, ViewHtmlSettings, MeasurableTemplateGenerator, Measurable, measurableRules } from '../../common/Joiner';
let StyleEditorComponent = class StyleEditorComponent {
    constructor() { }
    ngOnInit() {
    }
};
StyleEditorComponent = tslib_1.__decorate([
    Component({
        selector: 'app-style-editor',
        templateUrl: './style-editor.component.html',
        styleUrls: ['./style-editor.component.css']
    })
], StyleEditorComponent);
export { StyleEditorComponent };
class editorcontext {
}
export class StyleEditor {
    constructor(propertyBar, $root) {
        this.propertyBar = null;
        this.$root = null;
        this.$templates = null;
        this.$display = null;
        this.root = null;
        this.templates = null;
        this.display = null;
        this.clickedLevel = null;
        this.propertyBar = propertyBar;
        this.$root = $root.find('.styleContainer');
        this.$display = this.$root.find('.StyleEditorDisplay');
        this.$templates = this.$root.find('.styleTemplates');
        this.root = this.$root[0];
        this.display = this.$display[0];
        this.templates = this.$templates[0];
    }
    onHide() {
        this.updateClickedGUIHighlight();
    }
    onShow() {
        this.propertyBar.onHide();
        this.updateClickedGUIHighlight();
    }
    onPaste(e) {
        e.preventDefault();
        const div = e.currentTarget;
        let text = e.originalEvent.clipboardData.getData('text/plain');
        text = U.replaceAll(text, '\n', ' ');
        div.innerText = U.replaceAll(text, '\r', ' ');
    }
    isVisible() { return this.$root.is(':visible'); }
    show(m, clickedLevel) {
        this.clickedLevel = clickedLevel;
        // console.log('styleShow(', m, ')');
        if (m instanceof IModel) {
            this.showM(m);
            return;
        }
        if (m instanceof IPackage) {
            this.showM(m.parent);
            return;
        }
        // if (m instanceof IPackage) { this.showP(m); return; }
        this.showMP(m, null, false, null);
        return; /*
        if (m instanceof IClass) { this.showC(m); }
        if (m instanceof IAttribute) { this.showA(m); }
        if (m instanceof IReference) { this.showR(m); }
        if (m instanceof EOperation) { this.showO(m); }
        if (m instanceof EParameter) { this.showParam(m); }*/
    }
    updateClickedGUIHighlight() {
        $(this.propertyBar.model.graph.container).find('.styleEditorSelected').removeClass('styleEditorSelected');
        if (this.isVisible() && this.clickedLevel) {
            this.clickedLevel.classList.add('styleEditorSelected');
        }
    }
    getCopyOfTemplate(m, s, appendTo, clear) {
        let $html = this.$templates.find('.template' + s);
        const html = U.cloneHtml($html[0]);
        html.classList.remove('template');
        html.dataset.modelPieceID = '' + m.id;
        html.style.display = 'block';
        if (appendTo) {
            if (clear)
                U.clear(appendTo);
            appendTo.appendChild(html);
        }
        $html = $(html).find('.' + (m.getModelRoot().isM() ? 'm1' : 'm2') + 'hide').hide();
        return html;
    }
    showM(m) {
        console.log('styleShowM(', m, ')');
        const html = this.getCopyOfTemplate(m, '.model', this.display, true);
        const $html = $(html);
        const gridX = $html.find('.gridX')[0];
        const gridY = $html.find('.gridY')[0];
        const zoomX = $html.find('.zoomX')[0];
        const zoomY = $html.find('.zoomY')[0];
        const showGrid = $html.find('.showGrid')[0];
        const color = $html.find('.graphColor')[0];
        gridX.value = m.graph.grid ? '' + m.graph.grid.x : '';
        gridY.value = m.graph.grid ? '' + m.graph.grid.y : '';
        zoomX.value = m.graph.zoom.x + '';
        zoomY.value = m.graph.zoom.y + '';
        showGrid.checked = m.graph.gridDisplay;
        color.value = '#000ff'; // todo.
        // event listeners:
        $(gridX).off('change.set').on('change.set', (e) => {
            const input = e.currentTarget;
            m.graph.grid.x = isNaN(+input.value) ? 0 : +input.value;
            showGrid.checked = true;
            $(showGrid).trigger('change');
            m.refreshGUI();
        });
        $(gridY).off('change.set').on('change.set', (e) => {
            const input = e.currentTarget;
            m.graph.grid.y = isNaN(+input.value) ? 0 : +input.value;
            showGrid.checked = true;
            $(showGrid).trigger('change');
            m.refreshGUI();
        });
        $(zoomX).off('change.set').on('change.set', (e) => {
            const input = e.currentTarget;
            m.graph.setZoom(+input.value, null);
        });
        $(zoomY).off('change.set').on('change.set', (e) => {
            const input = e.currentTarget;
            m.graph.setZoom(null, +input.value);
        });
        $(showGrid).off('change.set').on('change.set', (e) => {
            const input = e.currentTarget;
            m.graph.setGrid0(input.checked);
        });
    }
    showP(m) { U.pe(true, 'styles of Package(', m, '): unexpected.'); }
    setStyleEditor($styleown, model, mp, style, context, indexedPath = null) {
        /// getting the template to fill.
        const debug = false;
        let i;
        let styleowntemplate = $styleown[0];
        const isInherited = styleowntemplate.classList.contains('inherited');
        const isInheritable = styleowntemplate.classList.contains('inheritable');
        const isOwn = styleowntemplate.classList.contains('own');
        U.pe((isInheritable ? 1 : 0 || isInherited ? 1 : 0 || isOwn ? 1 : 0) !== 1, 'failed to get html styleEditor template');
        let tmp = this.getCopyOfTemplate(mp, '.htmlstyle', null, false);
        styleowntemplate.appendChild(tmp);
        styleowntemplate.classList.remove('template');
        // styleowntemplate.parentElement.insertBefore(tmp, styleowntemplate);
        // styleowntemplate.parentElement.removeChild(styleowntemplate);
        styleowntemplate = tmp;
        U.pe(!styleowntemplate.parentElement, 'null parent: ', styleowntemplate, $styleown);
        $styleown = $(styleowntemplate);
        U.pif(debug, 'styleComplexEntry:', style, 'mp:', mp, styleowntemplate, $styleown);
        const obj = {
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
            saveasName: null
        };
        //// setting up labelAllowEdit (checking if the (own, inherited or inheritable) style exist or a modelpiece local copy is needed.)
        obj.editAllowed = $styleown.find('button.allowEdit')[0];
        obj.editLabel = $styleown.find('label.allowEdit')[0];
        // obj.selectstyle = $styleown.find('select.stylename')[0] as HTMLSelectElement;
        obj.detailButton = $styleown.find('button.detail')[0];
        obj.detailPanel = $styleown.find('div.detail')[0];
        obj.input = $styleown.find('.html[contenteditable="true"]')[0];
        obj.preview = $styleown.find('.preview')[0];
        obj.previewselect = $styleown.find('select.previewselector')[0];
        const $detail = $styleown.find('div.detail');
        obj.isM1 = $detail.find('.model')[0];
        obj.isM2 = $detail.find('.metamodel')[0];
        obj.isClass = $detail.find('.class')[0];
        obj.isAttribute = $detail.find('.attribute')[0];
        obj.isReference = $detail.find('.reference')[0];
        obj.isOperation = $detail.find('.operation')[0];
        obj.isParameter = $detail.find('.parameter')[0];
        obj.saveasName = $detail.find('input.saveas')[0];
        obj.delete = $detail.find('button.delete')[0];
        obj.forkButton = $detail.find('button.saveas')[0];
        // let inheritableStyle: StyleComplexEntry = isInheritable ? mp.getInheritableStyle() : null;
        // let inheritedStyle: StyleComplexEntry = isInherited ? mp.getInheritedStyle() : null;
        const lastvp = model.getLastView();
        U.pif(debug, 'isOwn && !style.isownhtml || isInherited && !inheritedStyle.html || isInheritable && !inheritableStyle.html)', style);
        U.pif(debug, !style ? '' : isOwn + ' && ' + style.isownhtml + ' || ' + isInherited + ' && ' + style.html + ' || ' + isInheritable + ' && ' + style.html);
        if (!!style && !(isOwn && !style.isownhtml || isInherited && !style.html || isInheritable && !style.html)) {
            $(obj.editLabel).hide();
        }
        else {
            // obj.selectstyle.disabled = obj.detailButton.disabled = true;
            obj.input.setAttribute('disabled', 'true');
            obj.input.contentEditable = 'false';
            if (!lastvp) {
                obj.editLabel.innerText = 'Is required to have at least one non-default viewpoint applied to customize styles.';
                obj.editAllowed.style.display = 'none';
            }
            else
                $(obj.editAllowed).on('click', (e) => {
                    const mptarget = isInherited ? mp.metaParent : mp;
                    let v = lastvp.viewsDictionary[mptarget.id];
                    if (!v)
                        v = new ViewRule(lastvp);
                    if (isOwn) {
                        U.pe(!!v.htmlo, 'htmlo should be undefined at this point.');
                        v.htmlo = new ViewHtmlSettings();
                        v.htmlo.setHtmlStr((style ? style.html : mptarget.getStyle().html).outerHTML);
                    }
                    if (isInheritable) {
                        U.pe(!!v.htmli, 'htmli should be undefined at this point.');
                        v.htmli = new ViewHtmlSettings();
                        const instanceCurrentStyle = ModelPiece.GetStyle(Status.status.m, mp.getInstanceClassName());
                        v.htmli.setHtmlStr(instanceCurrentStyle.outerHTML);
                    }
                    if (isInherited) {
                        U.pe(!!v.htmli, 'htmli should be undefined at this point.');
                        v.htmli = new ViewHtmlSettings();
                        v.htmli.setHtmlStr((style ? style.html : mp.getStyle().html).outerHTML);
                    }
                    v.apply(mptarget);
                    this.showMP(mp);
                    // todo: se stylecomplexEntry è null mostra un altro button.editAllowed per inserire lo stile ereditabile che generi htmli.
                });
            if (!style) {
                if (isInheritable) {
                    obj.editLabel.innerHTML = 'This element does not have a inheritable style.';
                }
                if (isInherited) {
                    obj.editLabel.innerHTML = 'The metaParent of this element does not have a inheritable style appliable to this element.';
                }
                obj.editLabel.appendChild(obj.editAllowed);
                U.clear(styleowntemplate);
                styleowntemplate.appendChild(obj.editLabel);
                return null;
            }
        }
        /// start!
        obj.input.setAttribute('placeholder', U.replaceVarsString(mp, obj.input.getAttribute('placeholder')));
        obj.input.innerText = context.templateLevel.outerHTML;
        $styleown.find('.htmllevel').html((isInherited ? 'Instances Html' : 'Own html')
            + ' (' + (indexedPath && indexedPath.length ? 'Level&nbsp;' + indexedPath.length : 'Root&nbsp;level') + ')');
        let graphRoot = mp.getHtmlOnGraph();
        context.graphLevel = U.followIndexesPath(graphRoot, indexedPath);
        context.applyNodeChangesToInput = () => {
            // console.log(templateLevel.outerHTML);
            obj.input.innerText = context.templateLevel.outerHTML;
            onStyleChange();
        };
        const onStyleChange = () => {
            const inputHtml = U.toHtml(obj.input.innerText);
            // console.log('PRE: ', inputHtml, 'outer:', inputHtml.outerHTML, 'innertext:', obj.input.innerText);
            U.pif(debug, '*** setting inheritable PRE. style.htmlobj:', style.htmlobj, ', style:', style, ', context:', context, 'templatelvl.parent:', context.templateLevel.parentElement, ', inputHtml:', inputHtml);
            if (context.templateLevel.parentElement) {
                context.templateLevel.parentElement.insertBefore(inputHtml, context.templateLevel);
                context.templateLevel.parentElement.removeChild(context.templateLevel);
                context.templateLevel = inputHtml;
            }
            else {
                U.pe(!style.view || style.isGlobalhtml, 'default html cannot be modified.', style, 'todo: automatically make new ClassVieww');
                // ??old message?: se tutto va bene qui deve dare errore, crea una nuova ClassVieww e applicalo al modelpiece ed edita quello.
                style.htmlobj.setHtml(context.templateLevel = inputHtml);
                U.pif(debug, '*** setting inheritable POST. style.htmlobj', style.htmlobj, 'style:', style);
            }
            if (isOwn) {
                mp.refreshGUI();
            }
            if (isInheritable) {
                mp.refreshInstancesGUI();
            }
            if (isInherited) {
                mp.metaParent.refreshInstancesGUI();
            }
            if (!isInheritable && indexedPath)
                this.clickedLevel = U.followIndexesPath(mp.getHtmlOnGraph(), indexedPath);
            graphRoot = mp.getHtmlOnGraph();
            context.graphLevel = U.followIndexesPath(graphRoot, indexedPath);
            this.updateClickedGUIHighlight();
            // obj.input.innerText = inputHtml.outerHTML;
            // DANGER: se lo fai con l'evento onchange() ti sposta il cursore all'inizio e finisci per scrivere rawtext prima dell'html invalidandolo.
            // tenendolo dovresti scrivere i caratteri uno alla volta riposizionando il cursore nel punto giusto ogni volta.
            // console.log('POST: ', inputHtml, 'outer:', inputHtml.outerHTML, 'innertext:', obj.input.innerText);
            // updatePreview();
        };
        $(obj.input).off('paste.set').on('paste.set', (e /*ClipboardEvent*/) => { this.onPaste(e); onStyleChange(); })
            // .off('change.set').on('change.set', onStyleChange)
            // .off('input.set').on('input.set', onStyleChange)
            .off('blur.set').on('blur.set', onStyleChange)
            .off('keydown.set').on('keydown.set', (e) => { if (e.key === 'Esc') {
            this.propertyBar.refreshGUI();
        } });
        // obj.selectstyle.disabled = indexedPath && indexedPath.length > 0;
        /*$(obj.selectstyle).on('change', (e: ChangeEvent) => {
          const style: ModelPieceStyleEntry = Styles.getStyleFromKey(obj.selectstyle.value);
          obj.input.innerText = style.htmlstr;
          $(obj.input).trigger('input');
        });*/
        // setup measurable options.
        const measurableRoot = MeasurableTemplateGenerator.generateMeasurableTemplate();
        tmp = $styleown.find('.measurablePlaceholder')[0];
        U.swap(measurableRoot, tmp);
        // .log('swap End:', measurableRoot.childNodes.length, tmp.childNodes.length);
        //U.pe(true,'swapend');
        const $measurableRoot = $(measurableRoot);
        // obj.input is same const ownhtmlinput: HTMLDivElement | HTMLTextAreaElement = $measurableRoot.find('.html[contenteditable="true"]')[0] as HTMLDivElement | HTMLTextAreaElement;
        const $measurableCheckbox = $measurableRoot.find('input.ismeasurable');
        const measurableCheckbox = $measurableCheckbox[0];
        measurableCheckbox.checked = (context.templateLevel.classList.contains('measurable') || context.graphLevel.classList.contains('measurable'));
        const $measurableTitle = $measurableRoot.find('.meas_acc0 > .ruletitle');
        $measurableTitle.on('click', (e) => {
            const $innerroot = $measurableRoot.find('.measurableSettingRoot ');
            const innerroot = $innerroot[0];
            if (innerroot.classList.contains('show')) {
                innerroot.setAttribute('style', '');
                innerroot.classList.add('collapsing');
                // todo: elimina slideup e usa la transizione css su collapsing, come?
                $innerroot.slideUp(400, () => {
                    innerroot.classList.remove('show', 'collapsing');
                    innerroot.classList.remove('collapse');
                    innerroot.classList.add('collapse');
                    $measurableTitle[0].classList.add('collapsed');
                });
                return;
            }
            innerroot.classList.remove('collapse');
            innerroot.classList.add('collapse');
            innerroot.classList.add('show');
            $measurableTitle[0].classList.remove('collapsed');
            $innerroot.slideDown();
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        });
        $measurableCheckbox.on('click', (e) => { e.stopPropagation(); });
        $measurableCheckbox.on('mousedown', (e) => { e.stopPropagation(); });
        $measurableCheckbox.on('mouseup', (e) => { e.stopPropagation(); });
        $measurableCheckbox.off('change.enabledisablemeasurable').on('change.enabledisablemeasurable', (e) => {
            context.templateLevel.classList.remove('measurable');
            if (measurableCheckbox.checked) {
                context.templateLevel.classList.add('measurable');
                $measurableTitle.slideDown();
                if (!measurableRoot.classList.contains('show')) {
                    $measurableTitle.trigger('click');
                }
            }
            else {
                if (measurableRoot.classList.contains('show')) {
                    $measurableTitle.trigger('click');
                }
                $measurableTitle.slideUp();
            }
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
        return indexedPath;
    }
    showMP(m, clickedLevel = null, asMeasurable = false, asEdge = null) {
        // console.log('styleShow(', m, ', ' + U.getTSClassName(m) + ')');
        let i;
        this.clickedLevel = clickedLevel = clickedLevel || this.clickedLevel;
        // set htmls
        const style = m.getStyle();
        const styleinheritable = m.getInheritableStyle();
        const styleinherited = m.getInheritedStyle();
        const clickedRoot = ModelPiece.getLogicalRootOfHtml(clickedLevel);
        const templateRoot = style.html; // m.styleobj.html;// m.getStyle();
        // let templateLevel: Element = templateRoot;
        let indexedPath = U.getIndexesPath(clickedLevel, 'parentNode', 'childNodes', clickedRoot);
        // console.log('clickedRoot', clickedRoot, 'clickedLevel', clickedLevel, 'path:', indexedPath);
        U.pe(U.followIndexesPath(clickedRoot, indexedPath, 'childNodes') !== clickedLevel, 'mismatch.', indexedPath);
        const realindexfollowed = { indexFollowed: [], debugArr: [] };
        let context = new editorcontext();
        context.templateLevel = U.followIndexesPath(templateRoot, indexedPath, 'childNodes', realindexfollowed);
        // console.log('clickedRoot:',clickedRoot, 'clikedLevel:', clickedLevel, 'indexedPath:', indexedPath, 'followed:', realindexfollowed,
        // 'templateRoot:', templateRoot, 'templateLevel:', templateLevel);
        if (realindexfollowed.indexFollowed.length !== indexedPath.length) {
            indexedPath = realindexfollowed.indexFollowed;
            this.clickedLevel = clickedLevel = U.followIndexesPath(clickedRoot, indexedPath);
        }
        this.updateClickedGUIHighlight();
        // html set END.
        const model = m.getModelRoot();
        if (asEdge && (m instanceof IClass || m instanceof IReference) && m.shouldBeDisplayedAsEdge()) {
            return this.showE(m, asEdge);
        }
        const html = this.getCopyOfTemplate(m, '.modelpiece', this.display, true);
        const $html = $(html);
        const showAsEdge = $html.find('.showAsEdge')[0];
        const showAsEdgeText = $html.find('.showAsEdgeText')[0];
        const $styleown = $html.find('.style.own');
        const $styleInherited = $html.find('.style.inherited');
        const $styleInheritable = $html.find('.style.inheritable');
        //const ownhtml = m.getStyle();
        const htmlPath = this.setStyleEditor($styleown, model, m, style, context, indexedPath);
        // U.pe(!style.html, $styleown, m, clickedLevel, model, style, instanceshtml);
        // const clickedonStyle: Element = U.followIndexesPath(style.html, htmlPath) as Element;
        $html.find('.tsclass').html('' + m.printableName()); // + (htmlDepth === 0 ? ' (root level)' : ' (level&nbsp;' + htmlDepth + ')') );
        // console.log('setStyleEditor inherited, ', styleinherited);
        let inheritedcontext = new editorcontext();
        if (styleinherited) {
            const inheritedTemplateRoot = styleinherited.html;
            inheritedcontext.templateLevel = U.followIndexesPath(inheritedTemplateRoot, indexedPath, 'childNodes', realindexfollowed);
            // se ho cliccato su un non-radice non-ereditato, non posso prendere un frammento dell'ereditato, sarebbe un frammento diverso.
            if (inheritedcontext.templateLevel !== context.templateLevel) {
                inheritedcontext.templateLevel = inheritedTemplateRoot;
            }
        }
        this.setStyleEditor($styleInherited, model, m, styleinherited, inheritedcontext);
        // console.log('setStyleEditor inheritable, ', styleinheritable);
        let inheritablecontext = new editorcontext();
        inheritablecontext.templateLevel = styleinheritable ? styleinheritable.html : null;
        if (!model.isM1()) {
            this.setStyleEditor($styleInheritable, model, m, styleinheritable, inheritablecontext);
        }
        else {
            $styleInheritable[0].innerHTML = '<h5 class="text-danger">M1 elements cannot give inheritance.</h5>';
        }
        U.detailButtonSetup($html);
        // <meta>
        //     <dependency><attributes><type>double</ </ </
        //     <preview><img src=imgurl</img> or html diretto.</
        // </meta>
        // pulsanti per settare preview: "takesnapshotOf / set as example... + select vertex with that style"
        const $arrowup = $html.find('button.arrow.up').on('click', (e) => {
            $(clickedLevel.parentNode).trigger('click');
        });
        $arrowup[0].disabled = htmlPath.length === 0 && m instanceof IClass;
        $html.find('button.arrow.down')[0].disabled = true;
        showAsEdge.checked = false;
        if (m instanceof IClass) {
            showAsEdge.disabled = m.references.length < 2;
            showAsEdgeText.innerHTML = 'Show as an edge' + (showAsEdge.disabled ? ' (require&nbsp;>=&nbsp;2&nbsp;references)' : '');
            $(showAsEdge).off('change.set').on('change.set', (e) => {
                m.shouldBeDisplayedAsEdge(true);
                this.showE(m, asEdge);
            });
        }
    }
    /*
      addmeasurableAttributeButtonOld(measurableSelect: HTMLSelectElement, $styleeditor: JQuery<Element>, m: ModelPiece,
                                      style: StyleComplexEntry,
                                      clickedStyle: Element,
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
          const htmldrew: Element = m.getHtmlOnGraph();
          const sameElementInGraph: Element = U.followIndexesPath(htmldrew, htmlPath) as Element;
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
          const sameElementInGraph: Element = U.followIndexesPath(m.getHtmlOnGraph(), htmlPath) as Element;
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
    */
    showE(m, edge) {
        const index = edge.getIndex();
        console.log('styleShowE(', m, ')');
        const html = this.getCopyOfTemplate(m, '.edge', this.display, true);
        const $html = $(html);
        const edgeStyle = $html.find('.edgeStyle')[0];
        const eColorCommon = $html.find('.edgeColor.common')[0];
        const eColorHighlight = $html.find('.edgeColor.highlight')[0];
        const eColorSelected = $html.find('.edgeColor.selected')[0];
        const eWidthCommon = $html.find('.edgeWidth.common')[0];
        const eWidthHighlight = $html.find('.edgeWidth.highlight')[0];
        const eWidthSelected = $html.find('.edgeWidth.selected')[0];
        const epRadiusC = $html.find('.edgePoint.radius')[0];
        const epStrokeWC = $html.find('.edgePoint.strokeW')[0];
        const epStrokeC = $html.find('.edgePoint.stroke')[0];
        const epFillC = $html.find('.edgePoint.fill')[0];
        const epRadiusH = $html.find('.edgePointPreview.radius')[0];
        const epStrokeWH = $html.find('.edgePointPreview.strokeW')[0];
        const epStrokeH = $html.find('.edgePointPreview.stroke')[0];
        const epFillH = $html.find('.edgePointPreview.fill')[0];
        const epRadiusS = $html.find('.edgePointSelected.radius')[0];
        const epStrokeWS = $html.find('.edgePointSelected.strokeW')[0];
        const epStrokeS = $html.find('.edgePointSelected.stroke')[0];
        const epFillS = $html.find('.edgePointSelected.fill')[0];
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
        $(edgeStyle).off('change.set').on('change.set', (e) => {
            let mode;
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
        $(eColorCommon).off('change.set').on('change.set', (e) => {
            m.edgeStyleCommon.color = eColorCommon.value;
            edge.refreshGui();
        });
        $(eWidthCommon).off('change.set').on('change.set', (e) => {
            m.edgeStyleCommon.width = isNaN(+eWidthCommon.value) ? 0 : +eWidthCommon.value;
            edge.refreshGui();
        });
        $(eColorHighlight).off('change.set').on('change.set', (e) => {
            m.edgeStyleHighlight.color = eColorHighlight.value;
            edge.refreshGui();
        });
        $(eWidthHighlight).off('change.set').on('change.set', (e) => {
            m.edgeStyleHighlight.width = isNaN(+eWidthHighlight.value) ? 0 : +eWidthHighlight.value;
            edge.refreshGui();
        });
        $(eColorSelected).off('change.set').on('change.set', (e) => {
            m.edgeStyleSelected.color = eColorSelected.value;
            edge.refreshGui();
        });
        $(eWidthSelected).off('change.set').on('change.set', (e) => {
            m.edgeStyleSelected.width = isNaN(+eWidthSelected.value) ? 0 : +eWidthSelected.value;
            edge.refreshGui();
        });
        $(epRadiusC).off('change.set').on('change.set', (e) => {
            m.edgeStyleCommon.edgePointStyle.radius = isNaN(+epRadiusC.value) ? 0 : +epRadiusC.value;
            edge.refreshGui();
        });
        $(epStrokeWC).off('change.set').on('change.set', (e) => {
            m.edgeStyleCommon.edgePointStyle.strokeWidth = isNaN(+epStrokeWC.value) ? 0 : +epStrokeWC.value;
            edge.refreshGui();
        });
        $(epStrokeC).off('change.set').on('change.set', (e) => {
            m.edgeStyleCommon.edgePointStyle.strokeColor = epStrokeC.value;
            edge.refreshGui();
        });
        $(epFillC).off('change.set').on('change.set', (e) => {
            m.edgeStyleCommon.edgePointStyle.fillColor = epFillC.value;
            edge.refreshGui();
        });
        $(epRadiusH).off('change.set').on('change.set', (e) => {
            m.edgeStyleHighlight.edgePointStyle.radius = isNaN(+epRadiusH.value) ? 0 : +epRadiusH.value;
            edge.refreshGui();
        });
        $(epStrokeWH).off('change.set').on('change.set', (e) => {
            m.edgeStyleHighlight.edgePointStyle.strokeWidth = isNaN(+epStrokeWH.value) ? 0 : +epStrokeWH.value;
            edge.refreshGui();
        });
        $(epStrokeH).off('change.set').on('change.set', (e) => {
            m.edgeStyleHighlight.edgePointStyle.strokeColor = epStrokeH.value;
            edge.refreshGui();
        });
        $(epFillH).off('change.set').on('change.set', (e) => {
            m.edgeStyleHighlight.edgePointStyle.fillColor = epFillH.value;
            edge.refreshGui();
        });
        $(epRadiusS).off('change.set').on('change.set', (e) => {
            m.edgeStyleSelected.edgePointStyle.radius = isNaN(+epRadiusS.value) ? 0 : +epRadiusS.value;
            edge.refreshGui();
        });
        $(epStrokeWS).off('change.set').on('change.set', (e) => {
            m.edgeStyleSelected.edgePointStyle.strokeWidth = isNaN(+epStrokeWS.value) ? 0 : +epStrokeWS.value;
            edge.refreshGui();
        });
        $(epStrokeS).off('change.set').on('change.set', (e) => {
            m.edgeStyleSelected.edgePointStyle.strokeColor = epStrokeS.value;
            edge.refreshGui();
        });
        $(epFillS).off('change.set').on('change.set', (e) => {
            m.edgeStyleSelected.edgePointStyle.fillColor = epFillS.value;
            edge.refreshGui();
        });
    }
    makeMeasurableOptions(measurableShell, inputuseless, style, context, indexedPath) {
        const $measurableShell = $(measurableShell);
        let i;
        const resizearrows = {};
        const dragarrows = {};
        const $arrowroot = $measurableShell.find('.rectangledrawing.outer');
        const $innerroot = $arrowroot.find('.rectangledrawing');
        // todo: sposta la fase di setattribute direttamente nella generazione html.
        resizearrows.tl = $innerroot.find('.top.left').attr('direction', 'tl');
        resizearrows.t = $innerroot.find('.side.top').attr('direction', 't');
        resizearrows.tr = $innerroot.find('.top.right').attr('direction', 'tr');
        resizearrows.ml = $innerroot.find('.side.left').attr('direction', 'l');
        resizearrows.mr = $innerroot.find('.side.right').attr('direction', 'r');
        resizearrows.bl = $innerroot.find('.bot.left').attr('direction', 'bl');
        resizearrows.b = $innerroot.find('.side.bot').attr('direction', 'b');
        resizearrows.br = $innerroot.find('.bot.right').attr('direction', 'br');
        resizearrows.tla = $arrowroot.find('.top.left.arrow').attr('direction', 'tl');
        resizearrows.ta = $arrowroot.find('.side.top.arrow').attr('direction', 't');
        resizearrows.tra = $arrowroot.find('.top.right.arrow').attr('direction', 'tr');
        resizearrows.mla = $arrowroot.find('.side.left.arrow').attr('direction', 'l');
        resizearrows.mra = $arrowroot.find('.side.right.arrow').attr('direction', 'r');
        resizearrows.bla = $arrowroot.find('.bot.left.arrow').attr('direction', 'bl');
        resizearrows.ba = $arrowroot.find('.side.bot.arrow').attr('direction', 'b');
        resizearrows.bra = $arrowroot.find('.bot.right.arrow').attr('direction', 'br');
        dragarrows.x = $measurableShell.find('.arrowh').attr('direction', 'x');
        dragarrows.y = $measurableShell.find('.arrowv').attr('direction', 'y');
        const arrowchange = (e) => {
            let tmp;
            const arrow = e.currentTarget;
            const direction = arrow.getAttribute('direction');
            const innerbox = $innerroot.find('*[direction = "' + direction + '"]')[0];
            const checked = arrow.checked;
            const isrotatable = arrow.classList.contains('rot');
            const isdraggable = arrow.classList.contains('drag');
            const isresizable = !isdraggable && !isrotatable;
            if (innerbox) {
                innerbox.classList.remove('selected');
                if (checked)
                    innerbox.classList.add('selected');
            }
            if (isdraggable) {
                tmp = context.templateLevel.getAttribute('_daxis');
            }
            if (isresizable) {
                tmp = context.templateLevel.getAttribute('_rhandles');
            }
            let currentHandles = U.replaceAll(tmp || '', ' ', '').split(',');
            U.arrayRemoveAll(currentHandles, direction);
            if (checked) {
                U.ArrayAdd(currentHandles, direction);
            }
            U.arrayRemoveAll(currentHandles, '');
            if (isdraggable && currentHandles.length) {
                context.templateLevel.setAttribute('_daxis', currentHandles.join(', '));
            }
            else
                context.templateLevel.removeAttribute('_daxis');
            if (isresizable && currentHandles.length) {
                context.templateLevel.setAttribute('_rhandles', currentHandles.join(', '));
            }
            else
                context.templateLevel.removeAttribute('_rhandles');
            console.log('resizable:', isresizable, 'draggable:', isdraggable, currentHandles, 'tmp:', tmp, context);
            context.applyNodeChangesToInput();
        };
        const rulelist = Measurable.getRuleList(context.templateLevel);
        for (let key in measurableRules) {
            key = measurableRules[key];
            const counterselector = '[data-target=".meas_acc > .panel > .' + key + '"] .rulecounter';
            const counter = $measurableShell.find(counterselector)[0];
            U.pe(!counter, 'counter not found for rule: ' + key);
            counter.innerText = rulelist[key].length;
        }
        for (i = 0; i < rulelist.all.length; i++) {
            const rule = rulelist.all[i];
            U.pe(!rule.prefix, 'astdh', rule, rulelist, context.templateLevel);
            if (rule.prefix === measurableRules._jquiDra && rule.name === 'axis') {
                const value = rulelist._jquiDra[i].right;
                const handles = (value.indexOf('all') !== -1 ? 'x,y' : U.replaceAll(value, ' ', '')).split(',');
                let map = {};
                for (i = 0; i < handles.length; i++) {
                    switch (handles[i]) {
                        default: break;
                        case 'x':
                            map.x = true;
                            break;
                        case 'y':
                            map.y = true;
                            break;
                    }
                }
                dragarrows.x.checked = map.x;
                dragarrows.y.checked = map.y;
                continue;
            }
            if (rule.prefix === measurableRules._jquiRes && rule.name === 'handles') {
                const handles = (rule.right.indexOf('all') !== -1 ? 'n,e,s,w,ne,se,sw,nw' : U.replaceAll(rule.right, ' ', '')).split(',');
                let map = {};
                for (i = 0; i < handles.length; i++) {
                    switch (handles[i]) {
                        default: break;
                        case 'n':
                            map.t = true;
                            break;
                        case 'ne':
                            map.tr = true;
                            break;
                        case 'nw':
                            map.tl = true;
                            break;
                        case 'e':
                            map.r = true;
                            break;
                        case 'w':
                            map.l = true;
                            break;
                        case 's':
                            map.b = true;
                            break;
                        case 'se':
                            map.br = true;
                            break;
                        case 'sw':
                            map.bl = true;
                            break;
                    }
                }
                resizearrows.tl.checked = map.tl;
                resizearrows.t.checked = map.t;
                resizearrows.tr.checked = map.tr;
                resizearrows.ml.checked = map.l;
                resizearrows.mr.checked = map.r;
                resizearrows.bl.checked = map.bl;
                resizearrows.b.checked = map.b;
                resizearrows.br.checked = map.br;
                continue;
            }
            const fakeevt = {};
            fakeevt.currentTarget = $measurableShell.find('.ruletitle[data-target=".meas_acc > .panel > .' + rule.prefix + '" > button.addrule')[0];
            fakeevt.currentTarget = fakeevt.currentTarget.parentElement;
            this.addRule(fakeevt, context, rule);
        }
        $measurableShell.find('.arrow').on('change', arrowchange).trigger('change');
        $measurableShell.find('button.addrule').off('click.addrule').on('click.addrule', (e) => { this.addRule(e, context); });
    }
    /*
      ruletypeenum: {
        _: "_",
        r: "_rule",
        e: "_export",
        co: "_constraint",
        ds: "_dstyle",
        ch: "_chain",
        chf: "_chainFinal",
        i: "_import",
        dd: "_d",
        rr: "_r",
        z: "_z"} = {
        _: "_",
        r: "_rule",
        e: "_export",
        co: "_constraint",
        ds: "_dstyle",
        ch: "_chain",
        chf: "_chainFinal",
        i: "_import",
        dd: "_d",
        rr: "_r",
        z: "_z"};*/
    getruleShellRoot(node) {
        while (node.parentElement && node.classList.contains('panel'))
            node = node.parentElement;
        return node;
    }
    addRule(e, context, ruleparts = null) {
        let i;
        const title = e.currentTarget.parentElement;
        const ruletype = U.trimStart(title.dataset.target.substr(title.dataset.target.lastIndexOf('>') + 1), ['.', ' ']);
        // const targetsectionselector: string = title.dataset.target;
        // const $targetsection: JQuery<HTMLElement> = $measurableShell.find(targetsectionselector) as  JQuery<HTMLElement>;
        const appendparent = title.parentElement;
        const newtemplate = U.cloneHtml($(appendparent).find('.template')[0], true);
        newtemplate.classList.remove('template');
        appendparent.appendChild(newtemplate);
        const $newtemplate = $(newtemplate);
        const nameinput = $newtemplate.find('input.attrname')[0];
        const left = $newtemplate.find('input.leftside')[0];
        const operator = $newtemplate.find('.operatorcontainer > select.operator')[0];
        const right = $newtemplate.find('input.rightside')[0];
        const target = $newtemplate.find('input.target')[0];
        const rulespanelshell = this.getruleShellRoot(nameinput);
        let oldrulename = nameinput.value;
        let leftdataset = left ? $('datalist#' + left.getAttribute('list'))[0] : null;
        let lefthashmap = null;
        const mp = this.propertyBar.selectedModelPiece;
        if (ruleparts) {
            nameinput.value = ruleparts.name;
            if (left)
                left.value = ruleparts.left;
            if (operator)
                U.selectHtml(operator, ruleparts.operator);
            right.value = ruleparts.right;
        }
        if (ruletype === measurableRules._jquiRes) {
            left.pattern = '^' + '\$\#\#.*\.values\.[0-9]+\$' + '$';
            left.setAttribute('list', 'measurabledatalistrule_' + mp.id);
            const tmpdatalist = document.createElement('datalist');
            tmpdatalist.id = 'measurabledatalistrule_' + mp.id;
            rulespanelshell.appendChild(tmpdatalist);
            for (i = 0; i < mp.childrens.length; i++) {
                const opt = document.createElement('option');
                const childname = mp.childrens[i].name;
                opt.value = '$##@' + childname + '.values.0$';
                opt.innerText = childname;
                tmpdatalist.appendChild(opt);
                lefthashmap = null; // non è obbligatorio, salta la validazione basata sui datalist.
                leftdataset = null;
            }
        }
        if (leftdataset) {
            for (i = 0; i < leftdataset.children.length; i++) {
                lefthashmap[leftdataset.children[i].getAttribute('value')] = leftdataset.children[i];
            }
        }
        const generateRuleValue = () => { return (left ? left.value + (operator ? operator.value : ' = ') : '') + right.value; };
        const generateOldRuleName = () => { return ruletype + oldrulename; };
        const generateRuleName = () => { return ruletype + nameinput.value; };
        const updateRule = () => {
            if (left.getAttribute('invalid') === '1' || right.getAttribute('invalid') === '1')
                return;
            const name = generateRuleName();
            const value = generateRuleValue();
            console.log('setattribute: name:', name, ' generated by:', ruletype + ' + ' + nameinput.value);
            context.templateLevel.setAttribute(name, value);
            context.applyNodeChangesToInput();
        };
        const isRuleNameTaken = (name) => {
            const $allrules = $(rulespanelshell).find('input.attrname');
            for (i = 0; i < $allrules.length; i++) {
                const ruleinput = $allrules[i];
                if (ruleinput === nameinput)
                    continue;
                if (ruleinput.value === name)
                    return true;
            }
            return false;
        };
        nameinput.pattern = '[^ "\']*';
        const setRuleTarget = (str) => {
            context.templateLevel.setAttribute('relativeSelectorOf' + generateRuleName(), str);
            U.pif(true, 'changetarget of: |' + ruletype + oldrulename + '|  |' + generateRuleName() + '|');
            context.applyNodeChangesToInput();
        };
        const targetChanged = (e) => { setRuleTarget(target.value); };
        const setRuleName = (name) => {
            if (!U.followsPattern(nameinput))
                return;
            if (oldrulename === name)
                return;
            const oldtarget = context.templateLevel.getAttribute('relativeSelectorOf' + ruletype + oldrulename);
            while (isRuleNameTaken(name)) {
                name = U.increaseEndingNumber(name);
            }
            context.templateLevel.removeAttribute(ruletype + oldrulename);
            if (oldtarget) {
                // non printa? ma funziona U.pif(true, 'rename) delete: |' + ruletype + oldrulename + '|; insert: |' + ruletype + name + '|');
                context.templateLevel.removeAttribute('relativeSelectorOf' + ruletype + oldrulename);
                context.templateLevel.setAttribute('relativeSelectorOf' + ruletype + name, oldtarget);
            }
            oldrulename = nameinput.value = name;
            updateRule();
        };
        const leftChanged = () => {
            const leftval = left.value;
            if (lefthashmap && !lefthashmap[leftval]) {
                left.setAttribute('invalid', '1');
                return;
            }
            left.removeAttribute('invalid');
            updateRule();
        };
        const operatorChanged = () => {
            updateRule();
        };
        const rightChanged = () => {
            updateRule();
        };
        const nameChanged = () => { setRuleName(nameinput.value); };
        $(nameinput).off('change.name').on('change.name', nameChanged);
        $(left).off('change.leftside').on('change.leftside', leftChanged);
        $(operator).off('change.operator').on('change.operator', operatorChanged);
        $(right).off('change.rightside').on('change.rightside', rightChanged);
        $(target).off('change.target').on('change.target', targetChanged);
        $newtemplate.find('button.ruledelete').off('click.delete').on('click.delete', () => {
            newtemplate.parentNode.removeChild(newtemplate);
            context.templateLevel.removeAttribute(generateOldRuleName());
            context.templateLevel.removeAttribute(generateRuleName()); //todo: potrebbe fare casini se qualcuno swappa nomi e cancella una regola?
            context.applyNodeChangesToInput();
        });
        if (!ruleparts)
            setRuleName(nameinput.getAttribute('defaultvalue'));
    }
}
//# sourceMappingURL=style-editor.component.js.map