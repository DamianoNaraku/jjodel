import { EEnum, ELiteral, EOperation, EParameter, IAttribute, IClass, IModel, IPackage, IReference, M2Attribute, MClass, ModelPiece, MReference, OperationVisibility, StyleEditor, Type, U } from '../../common/Joiner';
export class PropertyBarr {
    constructor(model) {
        this.model = null;
        this.styleEditor = null;
        this.model = model;
        this.selectedModelPiece = null;
        const $root = this.get$root();
        this.container = $root.find('.propertySidebarCurrentContent')[0];
        this.templateContainer = $root.find('.propertySidebarTemplates')[0];
        U.pe(!this.container, 'property bar shell not found in: ', $root);
        U.pe(!this.templateContainer, 'property bar template shell not found in: ', $root);
        this.styleEditor = new StyleEditor(this, $root);
    }
    templateMinimizerClick(e) {
        const minimizer = e.currentTarget;
        let templatee = minimizer;
        while (!templatee.classList.contains('wastemplate')) {
            templatee = templatee.parentNode;
        }
        templatee.classList.add('minimized');
        $(templatee).off('click.maximizeTemplate').on('click.maximizeTemplate', (ee) => { PropertyBarr.templateMaximizerClick(ee); }).on('contextmenu', (e) => { this.subTemplateShow(e); });
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
    }
    static templateMaximizerClick(e) {
        const template = e.currentTarget;
        template.classList.remove('minimized');
    }
    static makeVisibilitySelector(selectHtml, visibility) {
        if (selectHtml === null) {
            selectHtml = document.createElement('select');
        }
        U.clear(selectHtml);
        const optgrp = document.createElement('optgroup');
        optgrp.label = 'Access Modifier';
        selectHtml.appendChild(optgrp);
        let optionFound = false;
        for (const key in OperationVisibility) {
            if (!OperationVisibility[key]) {
                continue;
            }
            const access = OperationVisibility[key];
            const opt = document.createElement('option');
            opt.value = access;
            opt.innerHTML = access;
            if (visibility === access) {
                opt.selected = true;
                optionFound = true;
            }
            optgrp.appendChild(opt);
        }
        U.pe(visibility && !optionFound, 'OperationVisibility selected option not found; optgrp:', optgrp, 'OperationVisibility:', OperationVisibility, ', searchedVal:', visibility);
        return selectHtml;
    }
    subTemplateShow(e) {
        const target = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();
        if (target.classList.contains('list'))
            return false;
        const mp = ModelPiece.getLogic(target);
        this.show(mp, mp.getHtmlOnGraph(), null);
        return false;
    }
    removeOthers($html, keep) {
        const toremove = '.model, .package, .class, .enum, .attribute, .reference, .operation, .parameter, .literal';
        // ['.model', '.package', '.class', '.enum', '.attribute', '.reference', '.operation', '.parameter', '.literal'];
        const index = toremove.indexOf(keep);
        U.pe(index === -1, 'invalid selector to keep:', keep, toremove);
        // toremove = toremove.substr(0, index - 1) + toremove.substr(index + keep.length);
        $html.find(toremove).not(keep).remove();
    }
    getTemplate(o, selector = 'propertySidebarTemplates', root = null) {
        // selector = '.propertySidebarTemplates';
        // if (!root) { root = this.templateContainer; }
        // const $html = $(U.cloneHtml<HTMLElement>($(root).find(selector)[0]));
        const html = U.cloneHtml(this.templateContainer);
        o.linkToLogic(html);
        html.classList.add('linkedWith_' + U.getTSClassName(o));
        html.classList.remove('propertySidebarTemplates');
        html.classList.remove('template');
        html.classList.add('wastemplate');
        const $html = $(html);
        $html.find('.replaceVarOn').each((ii, elem) => { U.replaceVars(o, elem, false); });
        let namestr;
        const model = o.getModelRoot();
        if (!(o instanceof IModel || model.isMM())) {
            namestr = o.metaParent.name;
        }
        else {
            namestr = o.name;
        }
        $html.find('input.name').val(namestr)
            .off('change.pbar').on('change.pbar', (evt) => {
            const input = evt.currentTarget;
            console.log('value:', input.value, 'inputHtml:', input, 'evt:', evt);
            input.value = o.setName(input.value, true);
        });
        $html.find('.replaceVarOn').each((i, elem) => { U.replaceVars(o, elem, false); });
        $html.find((model.isM() ? '.m1' : '.m2') + 'disable').attr('disabled');
        $html.find((model.isM() ? '.m1' : '.m2') + 'hide').remove();
        return $html;
    }
    get$root() {
        let TabRootHtml = this.model.graph.container;
        // console.log('TabRootHtml:', TabRootHtml);
        while (!TabRootHtml.classList.contains('UtabContent')) {
            TabRootHtml = TabRootHtml.parentNode;
        }
        const $ret = $(TabRootHtml).find('.propertyBarContainer');
        U.pe($ret.length !== 1, 'pbar container not found:', $ret);
        return $ret;
    }
    updateRaw(o = null) {
        // o = o || this.selectedModelPiece;
        // if (!o) { return; }
        const $root = this.get$root();
        const textArea = this.rawTextArea = $root.find('.rawecore')[0];
        if (!textArea) {
            return;
        }
        textArea.value = o.generateModelString();
    }
    show(o = null, clickedLevel, isEdge, forceRefresh = true) {
        if (!forceRefresh && this.selectedModelPiece === o && this.selectedModelPieceIsEdge === isEdge) {
            if (clickedLevel === this.clickedLevel) {
                return;
            }
            this.clickedLevel = clickedLevel = clickedLevel || this.clickedLevel;
            if (isEdge) {
                this.styleEditor.showE(o, isEdge);
            }
            else {
                this.styleEditor.show(o, clickedLevel);
            }
            return;
        }
        this.selectedModelPiece = o = (o || this.selectedModelPiece);
        this.clickedLevel = clickedLevel = (clickedLevel || this.clickedLevel);
        if (isEdge) {
            this.styleEditor.showE(o, isEdge);
        }
        else {
            this.styleEditor.show(o, clickedLevel);
        }
        U.pe(!(o instanceof ModelPiece), 'invalid parameter type:', U.getTSClassName(o), o);
        this.selectedModelPieceIsEdge = isEdge;
        if (!o) {
            return;
        }
        // console.log('PropertyBar.show: ', o);
        U.clear(this.container);
        if (false && false) {
        }
        else if (o instanceof IModel) {
            this.container.append(this.getM_I(o));
        }
        else if (o instanceof IPackage) {
            this.container.append(this.getP_I(o));
        }
        else if (o instanceof IClass) {
            this.container.append(this.getC_I(o));
        }
        else if (o instanceof EEnum) {
            this.container.append(this.getE_I(o));
        }
        else if (o instanceof IAttribute) {
            this.container.append(this.getA_I(o));
        }
        else if (o instanceof IReference) {
            this.container.append(this.getR_I(o));
        }
        else if (o instanceof EOperation) {
            this.container.append(this.getO(o));
        }
        else if (o instanceof EParameter) {
            this.container.append(this.getParam(o));
        }
        else if (o instanceof ELiteral) {
            this.container.append(this.getEL(o));
        }
        else {
            U.pe(true, 'invalid ModelPiece type instance: ', o);
        }
        this.updateRaw(o);
        const $container = $(this.container);
        // $container.find('.template').addClass('.wastemplate').removeClass('template');
        Type.updateTypeSelectors($container);
        $container.find('.minimizer').off('click.minimizeTemplate').on('click.minimizeTemplate', (e) => { this.templateMinimizerClick(e); });
        /// ottimizzazioni di stile.
        while ($container.find('.wastemplate:has(>.content:not(:has(*)))').remove().length) { } // remove empty minimizer-content.
        // rimuove template.minimizer nested con un solo child che è un altro template+minimizer.
        // tipo:  ((1, 2)) --> (1, 2); sopravvive invece: (1, (2)) -> (1, (2));
        const monoChildReplacer = (i, h) => {
            /*
              '<template_1>' +
                '<content_1>' +
                  '<template_2>' +
                    '<content_2>' +
                    '</content_2>' +
                  '</template_2>' +
                '</content_1>' +
              '</template_1>';*/
            const content1 = h;
            const template1 = h.parentElement;
            const template2 = content1.firstChild;
            const content2 = $(template2).find('>.content')[0];
            const parent = template1.parentElement;
            parent.insertBefore(template2, template1);
            parent.removeChild(template1);
            // template1.insertBefore(content2, content1);
            // template1.removeChild(content1);
        };
        // while ($container.find('.content:has(>.wastemplate:only-child)').each(monoChildReplacer).length) {}
        while ($container.find('.content:has(>.wastemplate:only-child)').each(monoChildReplacer).length) { }
        // rimuove il template.minimizer alla radice, non ha senso chiudere tutto e rimanere con la pbar vuota.
        $container.find('.minimizer.single').on('contextmenu', (e) => { this.subTemplateShow(e); });
        const contentRoot = $container.find('>.wastemplate>.content')[0];
        U.clear(this.container);
        while (contentRoot.firstChild) {
            this.container.append(contentRoot.firstChild);
        }
    }
    getM_I(o) {
        const $html = this.getTemplate(o);
        this.removeOthers($html, '.model'); // $html.find('.model').show();
        const nsHtml = $html.find('input.namespace')[0];
        const uriHtml = $html.find('input.uri')[0];
        nsHtml.value = o.namespace();
        uriHtml.value = o.uri();
        $(uriHtml).off('change.pbar').on('change.pbar', (e) => { o.uri(uriHtml.value); });
        $(nsHtml).off('change.pbar').on('change.pbar', (e) => { o.namespace(nsHtml.value); });
        const pkgListHtml = ($html.find('.packageList')[0]);
        let i;
        for (i = 0; i < o.childrens.length; i++) {
            pkgListHtml.appendChild(this.getP_I(o.childrens[i]));
        }
        return $html[0];
    }
    getP_I(o) {
        const $html = this.getTemplate(o);
        this.removeOthers($html, '.package'); // $html.find('.package').show();
        const classListHtml = $html.find('.classList')[0];
        const enumListHtml = $html.find('.enumList')[0];
        let i;
        for (i = 0; i < o.classes.length; i++) {
            classListHtml.appendChild(this.getC_I(o.classes[i]));
        }
        for (i = 0; i < o.enums.length; i++) {
            enumListHtml.appendChild(this.getE_I(o.enums[i]));
        }
        // package own properties (sembra ci sia solo il name)
        return $html[0];
    }
    getC_I(o) {
        const $html = this.getTemplate(o);
        this.removeOthers($html, '.class');
        // $html.find('.class').show();
        let i;
        const attribListHtml = ($html.find('.attributeList')[0]);
        const refListHtml = ($html.find('.referenceList')[0]);
        const opListHtml = ($html.find('.operationList')[0]);
        for (i = 0; i < o.attributes.length; i++) {
            attribListHtml.appendChild(this.getA_I(o.attributes[i]));
        }
        for (i = 0; i < o.references.length; i++) {
            refListHtml.appendChild(this.getR_I(o.references[i]));
        }
        const operations = o.getOperations();
        for (i = 0; i < operations.length; i++) {
            opListHtml.appendChild(this.getO(operations[i]));
        }
        if (!(o instanceof MClass)) {
            return $html[0];
        }
        /// Se MClass
        const classe = o;
        const isRoot = ($html.find('input.isRoot')[0]);
        console.log('this:', o);
        isRoot.disabled = isRoot.checked = classe.isRoot();
        $(isRoot).off('change.pbar').on('change.pbar', (evt) => {
            const input = evt.currentTarget;
            if (!input.checked) {
                input.checked = true;
                return $html[0];
            }
            classe.setRoot(input.checked);
            classe.refreshGUI();
            this.refreshGUI();
        });
        return $html[0];
    }
    getE_I(o) {
        const $html = this.getTemplate(o);
        this.removeOthers($html, '.enum'); //$html.find('.enum').show();
        let i;
        const literalsHtml = ($html.find('.literalList')[0]);
        for (i = 0; i < o.childrens.length; i++) {
            literalsHtml.appendChild(this.getEL(o.childrens[i]));
        }
        return $html[0];
    }
    setClassChild(o, $html) {
        let upperbound = o.getUpperbound();
        let lowerbound = o.getLowerbound();
        const htmlUpperBound = $html.find('input.upperbound')[0];
        const htmlLowerBound = $html.find('input.lowerbound')[0];
        if (!htmlUpperBound || !htmlLowerBound)
            return;
        if (upperbound === null) {
            htmlUpperBound.placeholder = '1';
        }
        else {
            htmlUpperBound.value = '' + upperbound;
        }
        if (lowerbound === null) {
            htmlLowerBound.placeholder = '1';
        }
        else {
            htmlLowerBound.value = '' + lowerbound;
        }
        $(htmlUpperBound).off('change.pbar').on('change.pbar', (evt) => {
            const target = evt.currentTarget;
            o.setUpperbound(+target.value);
            o.refreshGUI();
        });
        $(htmlLowerBound).off('change.pbar').on('change.pbar', (evt) => {
            const target = evt.currentTarget;
            o.setLowerbound(+target.value);
            o.refreshGUI();
        });
    }
    getR_I(o) {
        const $html = this.getTemplate(o);
        this.removeOthers($html, '.reference'); // $html.find('.reference').show();
        this.setClassChild(o, $html);
        const htmlContainment = $html.find('input.referenceContainment')[0];
        htmlContainment.checked = o.isContainment();
        const selectType = $html.find('select')[0];
        if (o instanceof MReference) {
            return $html[0];
        }
        const ref = o;
        $(selectType).off('change.pbar').on('change.pbar', (evt) => {
            const target = evt.currentTarget;
            ref.type.changeType(target.value);
        });
        $(htmlContainment).off('change.pbar').on('change.pbar', (evt) => {
            const target = evt.currentTarget;
            ref.setContainment(target.checked);
            ref.refreshGUI();
        });
        return $html[0];
    }
    getA_I(o) {
        const $html = this.getTemplate(o);
        this.removeOthers($html, '.attribute');
        // $html.find('.attribute').show();
        this.setClassChild(o, $html);
        // const typeHtml: HTMLSelectElement = ($html.find('select.attributeType')[0] as HTMLSelectElement);
        // Type.makeTypeSelector(typeHtml, o.getType(), true, true, false, false);
        /* $(typeHtml).off('change.pbar').on('change.pbar',
          (evt: Event) => {
            const target: HTMLSelectElement = (evt.currentTarget as HTMLSelectElement);
            o.setType(target.value, null, true);} );*/
        if (o instanceof M2Attribute) {
            return $html[0];
        }
        // Se MAttribute
        const attr = o;
        $html.find('.attributeValue').val(attr.getValueStr()).off('change.pbar').on('change.pbar', (evt) => {
            const input = evt.currentTarget;
            attr.setValueStr(input.value);
            attr.refreshGUI();
        });
        return $html[0];
    }
    getO(o) {
        const $html = this.getTemplate(o);
        this.removeOthers($html, '.operation'); // $html.find('.operation').show();
        this.setClassChild(o, $html);
        let i;
        const paramListHtml = ($html.find('.parameterList')[0]);
        const visibilityHtml = ($html.find('.visibilitySelector')[0]);
        PropertyBarr.makeVisibilitySelector(visibilityHtml, o.visibility);
        let paramHtml = this.getParam(o, true);
        const returnName = $(paramHtml).find('input.name')[0];
        returnName.placeholder = 'Return type.';
        returnName.disabled = true;
        returnName.value = '';
        const templateContainingParamList = paramListHtml;
        // while (!templateContainingParamList.classList.contains('replaceVarOn')) { templateContainingParamList = templateContainingParamList.parentElement; }
        templateContainingParamList.prepend(paramHtml);
        for (i = 0; i < o.childrens.length; i++) {
            paramHtml = this.getParam(o.childrens[i], false);
            paramListHtml.appendChild(paramHtml);
        }
        $html.find('input.exceptions').val(o.exceptionsStr).off('change.pbar').on('change.pbar', (evt) => {
            const input = evt.currentTarget;
            input.value = o.exceptionsStr = input.value;
        });
        return $html[0];
    }
    getEL(eLiteral) {
        const $html = this.getTemplate(eLiteral);
        this.removeOthers($html, '.literal'); // $html.find('.literal').show();
        this.setClassChild(eLiteral, $html);
        $html.find('.value').val(eLiteral.ordinal).off('change.pbar').on('change.pbar', (evt) => {
            const input = evt.currentTarget;
            eLiteral.ordinal = +input.value;
            eLiteral.refreshGUI();
        });
        $html.find('input.literal').val(eLiteral.literal).off('change.pbar').on('change.pbar', (evt) => {
            const input = evt.currentTarget;
            eLiteral.setLiteral(input.value);
            eLiteral.refreshGUI();
        });
        $html.find('.name').val(eLiteral.name).off('change.pbar').on('change.pbar', (evt) => {
            const input = evt.currentTarget;
            eLiteral.setName(input.value);
            eLiteral.refreshGUI();
        });
        return $html[0];
    }
    refreshGUI() { this.show(this.selectedModelPiece, this.clickedLevel, this.selectedModelPieceIsEdge); }
    getParam(o, asReturnType = false) {
        const $html = this.getTemplate(o);
        this.removeOthers($html, '.parameter'); // $html.find('.parameter').show();
        this.setClassChild(o, $html);
        const typeHtml = $html.find('select')[0];
        typeHtml.dataset.void = asReturnType ? "true" : "false";
        const ordered = $html.find('input.ordered')[0];
        const unique = $html.find('input.unique')[0];
        ordered.checked = o.ordered;
        unique.checked = o.unique;
        $(typeHtml).off('change.pbar').on('change.pbar', (evt) => {
            const target = evt.currentTarget;
            o.setType(target.value, null, true);
        }); // .trigger('change');
        return $html[0];
    }
    onShow(isRaw = false) { this.styleEditor.onHide(); }
    onHide() { }
}
//# sourceMappingURL=propertyBar.js.map