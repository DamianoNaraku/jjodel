import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { measurableRules, U } from '../../common/Joiner';
let MeasurabletemplateComponent = class MeasurabletemplateComponent {
    constructor() { }
    ngOnInit() {
    }
};
MeasurabletemplateComponent = tslib_1.__decorate([
    Component({
        selector: 'app-measurabletemplate',
        templateUrl: './measurabletemplate.component.html',
        styleUrls: ['./measurabletemplate.component.css']
    })
], MeasurabletemplateComponent);
export { MeasurabletemplateComponent };
export class MeasurableTemplateGenerator {
    static generateMeasurableTemplate() {
        if (MeasurableTemplateGenerator.output)
            return U.cloneHtml(MeasurableTemplateGenerator.output, true);
        const $root = $('#measurableTemplateGeneratorShell');
        class Tmp {
            constructor(prefix, name, preleft = null, haveleft = true, haveoperator = false, havetarget = true, leftph = null, rightph = null, nameph = null) {
                this.preleft = preleft;
                this.haveleft = haveleft;
                this.index = Tmp.maxindex++;
                this.name = name;
                this.prefix = prefix;
                this.nameph = nameph ? nameph : 'Name';
                this.leftph = leftph ? leftph : '#####';
                this.rightph = rightph ? rightph : 'Value';
                this.havetarget = havetarget;
                this.haveoperator = haveoperator === null ? false : haveoperator;
            }
        }
        Tmp.maxindex = 0;
        const arr = [];
        let prefix;
        let name;
        let preleft;
        let haveleft;
        let havetarget;
        let leftph;
        let rightph;
        let nameph;
        let haveoperator;
        prefix = measurableRules.onRefresh;
        name = prefix.substr(1);
        preleft = 'if';
        haveleft = true;
        haveoperator = 'do';
        havetarget = true;
        nameph = null;
        leftph = 'condition';
        rightph = '[selector] [->] rulename';
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.onDragStart;
        name = prefix.substr(1);
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.onResizeStart;
        name = prefix.substr(1);
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.onRotationStart;
        name = prefix.substr(1);
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.whileDragging;
        name = prefix.substr(1);
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.whileResizing;
        name = prefix.substr(1);
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.whileRotating;
        name = prefix.substr(1);
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.onDragEnd;
        name = prefix.substr(1);
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.onResizeEnd;
        name = prefix.substr(1);
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.onRotationEnd;
        name = prefix.substr(1);
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.variable;
        name = 'Generic command / variable';
        preleft = null;
        haveleft = false;
        haveoperator = false;
        havetarget = true;
        nameph = 'VarName';
        leftph = null;
        rightph = null;
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.export;
        name = prefix.charAt(1).toUpperCase() + prefix.substr(2);
        preleft = null;
        haveleft = true;
        haveoperator = '=';
        havetarget = true;
        nameph = null;
        leftph = 'selector++';
        rightph = 'String';
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.constraint;
        name = prefix.charAt(1).toUpperCase() + prefix.substr(2);
        preleft = null;
        haveleft = true;
        haveoperator = true;
        havetarget = true;
        nameph = null;
        leftph = 'Size/Pos';
        rightph = null;
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.bind;
        name = prefix.charAt(1).toUpperCase() + prefix.substr(2);
        preleft = null;
        haveleft = false;
        haveoperator = false;
        havetarget = false;
        nameph = null;
        leftph = null;
        rightph = 'ModelPiece.id';
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.console;
        name = prefix.charAt(1).toUpperCase() + prefix.substr(2);
        preleft = null;
        haveleft = false;
        haveoperator = false;
        havetarget = false;
        nameph = null;
        leftph = null;
        rightph = 'Console command';
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.dynamicStyle;
        name = 'Dynamic Style';
        preleft = null;
        haveleft = false;
        haveoperator = false;
        havetarget = true;
        nameph = null;
        leftph = null;
        rightph = 'Html style string';
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules.dynamicClass;
        name = 'Dynamic Class';
        rightph = '+classToAdd -classToRemove';
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules._jquiDra;
        name = 'jQueryUI draggable options';
        preleft = null;
        haveleft = false;
        haveoperator = false;
        havetarget = false;
        nameph = 'ggable Option name';
        leftph = null;
        rightph = null;
        arr.push(new Tmp(prefix, name, null, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules._jquiRes;
        name = 'jQuery resizable options';
        nameph = 'izable Option name';
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        prefix = measurableRules._jquiRot;
        name = 'jQuery rotatable options';
        nameph = 'atable Option name';
        arr.push(new Tmp(prefix, name, preleft, haveleft, haveoperator, havetarget, leftph, rightph, nameph));
        // console.log('arr:', JSON.stringify(arr));
        let i;
        const template = $root.find('.rule.template')[0];
        const accordion = $root.find('.meas_acc')[0];
        let genericvarattrnameinput;
        let genericvarpattern = '^(?!ng';
        /*delete prefix;
        delete name;
        delete preleft;
        delete haveleft;
        delete havetarget;
        delete leftph;
        delete rightph;
        delete nameph;
        delete haveoperator;*/
        let debugrulecounter = 0;
        for (let k in measurableRules) {
            debugrulecounter++;
        }
        U.pe(arr.length !== debugrulecounter, 'missing ' + (debugrulecounter - (2 * 3) - arr.length) + ' rules:', measurableRules, arr); // - on(dra, res, rot) + (start, end) = 3*2 casi esclusi
        for (i = 0; i < arr.length; i++) {
            const elem = arr[i];
            const nodee = template.cloneNode(true);
            nodee.setAttribute('class', 'panel ' + elem.prefix);
            const $node = $(nodee);
            const title = $node.find('h7')[0];
            const prefix = $node.find('.compoundInputprefix > .prefix')[0];
            const attrname = $node.find('.compoundInputprefix > .attrname')[0];
            const preleft = $node.find('.preleft')[0];
            const leftside = $node.find('.leftside')[0];
            const operatorselect = $node.find('select.operator.relational')[0];
            const operatorselect2 = $node.find('select.operator.trigger')[0];
            const operatortext = $node.find('span.operator')[0];
            const opparent = operatorselect.parentElement;
            const rightside = $node.find('.rightside')[0];
            const target = $node.find('input.target')[0];
            if (elem.haveoperator === true) {
                U.remove(operatortext);
                U.remove(operatorselect2);
            }
            else if (elem.haveoperator === 'when') {
                // empty on purpose
            }
            else if (elem.haveoperator === elem.haveoperator + '') {
                operatortext.innerText = elem.haveoperator;
                U.remove(operatorselect);
                U.remove(operatorselect2);
            }
            else if (elem.haveoperator === false) {
                U.remove(operatortext);
                U.remove(operatorselect);
                U.remove(operatorselect2);
            }
            if (elem.preleft) {
                preleft.innerText = elem.preleft;
            }
            else
                U.remove(preleft);
            attrname.placeholder = elem.nameph;
            nodee.classList.remove(arr[i].prefix);
            nodee.classList.add(arr[i].prefix);
            leftside.placeholder = elem.leftph;
            rightside.placeholder = elem.rightph;
            prefix.innerHTML = elem.prefix;
            attrname.innerHTML = elem.nameph;
            attrname.setAttribute('defaultvalue', '1');
            const triggerscommon = () => {
                operatortext.innerText = 'apply';
                operatortext.classList.add('apply');
                U.remove(operatorselect);
                const row = operatortext.parentElement.parentElement;
                const newrow = document.createElement('div');
                row.parentElement.insertBefore(newrow, row.nextElementSibling);
                newrow.classList.add('row', 'break');
                const splitindex = row.innerHTML.indexOf('<span class="eventsplitpoint');
                newrow.innerHTML = row.innerHTML.substring(splitindex);
                row.innerHTML = row.innerHTML.substring(0, splitindex);
            };
            if (arr[i].prefix !== '_')
                genericvarpattern += '|' + arr[i].prefix.substr(1);
            switch (arr[i].prefix) {
                default:
                    break;
                case '_':
                    genericvarattrnameinput = attrname;
                    break;
                case '_onrefresh':
                    U.remove(operatorselect2);
                    triggerscommon();
                    break;
                case '_ondrag':
                    prefix.innerText = '_ondrag';
                    operatorselect2.children[0].children[0].innerHTML = 'Start';
                    operatorselect2.children[0].children[1].innerHTML = 'ging';
                    operatorselect2.children[0].children[2].innerHTML = 'End';
                    triggerscommon();
                    break;
                case '_onresize':
                    prefix.innerText = '_onresiz';
                    operatorselect2.children[0].children[0].innerHTML = 'eStart';
                    operatorselect2.children[0].children[1].innerHTML = 'ing';
                    operatorselect2.children[0].children[2].innerHTML = 'eEnd';
                    triggerscommon();
                    break;
                case '_onrotation':
                    prefix.innerText = '_onrotat';
                    operatorselect2.children[0].children[0].innerHTML = 'ionStart';
                    operatorselect2.children[0].children[1].innerHTML = 'ing';
                    operatorselect2.children[0].children[2].innerHTML = 'ionEnd';
                    triggerscommon();
                    break;
                case '_constraint':
                case '_import':
                    leftside.setAttribute('list', 'measurableList_constraintleft');
                    break;
                case '_jquiDra':
                    attrname.setAttribute('defaultvalue', '');
                    attrname.setAttribute('list', 'measurableList' + arr[i].prefix);
                    break;
                case '_jquiRes':
                    attrname.setAttribute('defaultvalue', '');
                    attrname.setAttribute('list', 'measurableList' + arr[i].prefix);
                    break;
                case '_jquiRot':
                    attrname.setAttribute('defaultvalue', '');
                    attrname.setAttribute('list', 'measurableList' + arr[i].prefix);
                    break;
            }
            if (!elem.haveleft) {
                U.remove(leftside);
                U.remove(opparent);
            }
            if (!elem.havetarget) {
                U.remove(target);
            }
            title.dataset.target = ".meas_acc > .panel > ." + elem.prefix;
            title.innerHTML = '<span class="innertitle">' + elem.name + '&nbsp;(<span class="rulecounter">count</span>)</span><button class="addrule btn btn-sm btn-success">+</button><span class="countershell"></span>';
            $node.find('.rulecontainer')[0].classList.add(elem.prefix);
            accordion.appendChild(nodee);
        }
        genericvarattrnameinput.pattern = genericvarpattern + ')[\\S]+$';
        $root.find('.comment').remove();
        $root.find('.export').remove();
        $root.find('style').remove();
        $root.find('script').remove();
        $root.find('.rule.template').remove();
        let ret = MeasurableTemplateGenerator.output = $root[0];
        ret.classList.remove('template');
        ret.classList.add('oldMeasurablePlaceholder');
        ret.parentElement.removeChild(ret);
        ret.removeAttribute('id');
        return ret;
    }
}
MeasurableTemplateGenerator.output = null;
class Rotatableoptions {
    constructor() {
        this.degrees = 'false | number';
        this.radians = 'false | number';
        this.handle = 'url'; //  internamente richiede come parametro un $('imageselector')... crea un elemento con quell'immagine. e appendilo al vertice con display: none per evitare di ricrearne uno ogni volta che crei un vertice, almeno così viene anche cancellato assieme al vertice. prova se l'url netto va bene lo stesso in overloading
        this.handleOffsetX = 'width / 2';
        this.handleOffsetY = '-20'; // internamente è: handleOffset: { top: 0, left: 0 }
        this.rotationCenterOffsetX = 'width / 2';
        this.rotationCenterOffsetY = 'height / 2';
        // internamente è: rotationCenterOffset: { top: 0, left: 0 } from the center of the element
        this.step = 'degree'; // internamente ha "snap = boolean" e step = number, setta anche snap = true se trovi step come attributo measur-rotatable.
        this.transforms = 'null | {scaleY: 2}'; // non chiaro neanche negli esempi demo. googla.
        this.wheelRotate = 'false'; // NB: non previene lo scroll della pagina come azione default.
        this.onRotating = 'function(event, ui) { ... }'; // NB: se la sua trimmed version non inizia con function oppure con /^([^)]+)[\s]*=>$/ allora aggiungicelo tu a tempo di esecuzione? o non vale la pena per degradazione performance?.
        this.onRotationStart = 'function(event, ui) { ... }'; // in realtà è "start"
        this.onRotationEnd = 'function(event, ui) { ... }'; // in realtà è "stop"
    }
}
//if the placeholder value is a choice of literals, the first literal is the default value. UPPERCASED, CamelCased and (parenthesized) words are not literals. Those values are not dynamic and are evaluated only once.
export class Resizableoptions {
    constructor() {
        this.alsoResize = 'Selector | Element | jQuery';
        this.animate = 'Boolean';
        this.animateDuration = 'slow | fast | msec number';
        this.animateEasing = 'swing | api.jqueryui.com/easings';
        this.aspectRatio = 'Boolean | Number';
        this.autoHide = 'Boolean';
        this.cancel = 'Selector';
        this.classes = 'Object (see jQUI website)';
        this.containment = 'Selector | Element | parent | document';
        this.delay = 'Number';
        this.disabled = 'Boolean';
        this.distance = 'Number (tolerance)';
        this.ghost = 'Boolean';
        this.grid = '[x: 0, y: 0]';
        this.helper = 'Classname';
        this.maxHeight = 'Number';
        this.maxWidth = 'Number';
        this.minHeight = 'Number';
        this.minWidth = 'Number';
        // Methods
        // destroy()
        this.enabled = 'true | false'; // $var.resizable('disable'); or .resizable( "enable" );
        // instance(); only useful as return value on javascript
        // .resizable('option', 'optionname') return the current option or a key-value object with all options or .resizable('option', {key: value}) setta opzioni.
        // .resizable('widget') return $(resizable element)
        // create: string = ''; .resizable('create', functioncallback);
        this.resizing = 'function(event, ui){...}';
        this.resizeStart = 'function(event, ui){...}';
        this.resizeStop = 'function(event, ui){...}';
    }
}
export class DraggableOptions {
    constructor() {
        this.addClasses = 'false | true';
        this.appendTo = 'Selector | Element | jQuery | parent';
        this.axis = 'x, y | x | y'; // actually "x, y" happens when you input "false"
        this.cancel = 'Selector';
        this.classes = 'Object (see jQUI website)';
        this.connectToSortable = 'Selector';
        this.containment = 'Selector | SizeArray | parent | document | window';
        this.cursor = 'CSSCursor'; // todo: setta default: quadriarrow (crosshair?)
        this.cursorAt = '{top, left} | {right, bottom} | {top, right} | {bottom, left}';
        this.delay = 'Number (msec)';
        this.disabled = 'Boolean';
        this.distance = 'Number (pixel tolerance)';
        //todo: permetti di fare cambiamenti a run-time usando: chain -> optional export (dinamically rcalculate and replace content of _jquiDrag* attributes), second chain -> point to _jquiDragRule and execute things like in the example "Get or set the grid option, after initialization: ..."
        this.grid = '[x: 0, y: 0]';
        this.handle = 'Selector | Element';
        this.helper = 'original | clone | Function() => Element';
        this.iframeFix = 'Boolean | Selector';
        this.opacity = 'Number';
        this.refreshPositions = 'false | true';
        //todo: droppable
        this.revert = 'false | true | valid | invalid | Function() => Boolean';
        this.revertDuration = 'Number (msec)';
        this.scope = 'String';
        this.scroll = 'true | false'; //todo: devi fare lo scroll quando trascini un vertice out of visible graph boundary.
        this.scrollSensitivity = 'Number (pixel)'; //Distance in pixels from the edge of the viewport after which the viewport should scroll. Distance is relative to pointer, not the draggable.
        this.scrollSpeed = '20 | Number';
        this.snap = 'false | true | Selector';
        this.snapMode = 'both | inner | outer';
        this.snapTolerance = '20 | Number';
        this.stack = 'Selector';
        this.zIndex = 'Number';
        // Methods
        this.enabled = 'true | false'; // actually it is: .droppable( "enable" / "disable")
        this.dragging = 'function(event, ui){...}';
        this.dragStart = 'function(event, ui){...}';
        this.dragStop = 'function(event, ui){...}';
    }
}
/*
draggableui vertex:
  usa jqui draggable, lui ti aggiorna top, left, tu le trasformi in GraphPoint e setti:
  NO transform() che funzionerebbe su tutti
ma switch sulla taga e setta both: cx (al centro), x (al top-left)
  i vertici default diventano "measurable", con responsabilità dell'utente di inserire la classe se li vuole spostabili. default axis = both.*/
//# sourceMappingURL=measurabletemplate.component.js.map