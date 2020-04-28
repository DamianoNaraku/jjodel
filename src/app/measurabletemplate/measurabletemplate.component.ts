import {Component, OnInit} from '@angular/core';
import {Dictionary, GraphSize, Measurable, measurableRules, U} from '../../common/Joiner';
import {ConstraintLeftAdmitteds, ConstraintLeftAdmittedsStatic} from '../../common/measurable';

@Component({
  selector: 'app-measurabletemplate',
  templateUrl: './measurabletemplate.component.html',
  styleUrls: ['./measurabletemplate.component.css']
})
export class MeasurabletemplateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
export class MeasurableTemplateGenerator {
  private static output: HTMLElement = null;
  public static constraintMap: Dictionary<string, string>; // deformed ConstraintLeftAdmitteds;
  public static constraintPlaceholderMap: Dictionary<string, string>; // deformed ConstraintLeftAdmitteds;
  public static generateMeasurableTemplate(): HTMLElement {
    if (MeasurableTemplateGenerator.output) return U.cloneHtml(MeasurableTemplateGenerator.output, true);
    const $root: JQuery<HTMLElement> = $('#measurableTemplateGeneratorShell');
    class Tmp {
      static maxindex: number = 0;
      index: number;
      name: string;
      haveleft: boolean;
      prefix: string;
      nameph: string;
      preleft: string;
      leftph: string;
      rightph: string;
      havetarget: boolean;
      haveoperator: boolean | string;
      constructor(prefix: string, name: string, preleft: string = null, haveleft: boolean = true, haveoperator: boolean | string = false, havetarget: boolean = true, leftph: string = null, rightph: string = null, nameph: string = null) {
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

    const arr: Tmp[] = [];
    let prefix: string;
    let name: string;
    let preleft: string;
    let haveleft: boolean;
    let havetarget: boolean;
    let leftph: string;
    let rightph: string;
    let nameph: string;
    let haveoperator: string | boolean;


    prefix = measurableRules.onRefresh;
    name = prefix.substr(1);
    preleft = 'if';
    haveleft = true;
    haveoperator = 'do';
    havetarget = true;
    nameph = null;
    leftph = 'condition';
    rightph = '[selector] [' + U.AttributeSelectorOperator + '] rulename';
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
    haveoperator = '⇠';
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
    let i: number;
    const template: HTMLElement = $root.find('.rule.template')[0];
    const accordion: HTMLElement = $root.find('.meas_acc')[0];


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
    for (let k in measurableRules) { debugrulecounter++; }
    U.pe(arr.length !== debugrulecounter, 'missing ' + (debugrulecounter - (2*3) - arr.length)+ ' rules:', measurableRules, arr); // - on(dra, res, rot) + (start, end) = 3*2 casi esclusi
    for (i = 0; i < arr.length; i++) {
      const elem: Tmp = arr[i];
      const nodee: HTMLElement = template.cloneNode(true) as HTMLElement;
      nodee.setAttribute('class', 'panel ' + elem.prefix);
      nodee.setAttribute('prefix', elem.prefix);
      nodee.setAttribute('prefixlc', elem.prefix.toLowerCase());
      const $node: JQuery<HTMLElement> = $(nodee);
      const title: HTMLElement = $node.find('h7')[0];
      const prefix: HTMLElement = $node.find('.compoundInputprefix > .prefix')[0];
      const attrname: HTMLInputElement = $node.find('.compoundInputprefix > .attrname')[0] as HTMLInputElement;
      const preleft: HTMLElement = $node.find('.preleft')[0];
      const leftside: HTMLInputElement = $node.find('.leftside')[0] as HTMLInputElement;
      const operatorselect: HTMLSelectElement = $node.find('select.operator.relational')[0] as HTMLSelectElement;
      const operatorselect2: HTMLSelectElement = $node.find('select.operator.trigger')[0] as HTMLSelectElement;
      const operatortext: HTMLElement = $node.find('span.operator')[0];
      const opparent: HTMLElement = operatorselect.parentElement;
      const rightside: HTMLInputElement = $node.find('.rightside')[0] as HTMLInputElement;
      const target: HTMLInputElement = $node.find('input.target')[0] as HTMLInputElement;
      if (elem.haveoperator === true) {
        U.remove(operatortext);
        U.remove(operatorselect2);
      } else if (elem.haveoperator === 'when') {
        // empty on purpose
      } else if (elem.haveoperator === elem.haveoperator + '') {
        operatortext.innerText = elem.haveoperator;
        U.remove(operatorselect);
        U.remove(operatorselect2);
      } else if (elem.haveoperator === false) {
        U.remove(operatortext);
        U.remove(operatorselect);
        U.remove(operatorselect2); }
      if (elem.preleft) { preleft.innerText = elem.preleft; } else U.remove(preleft);

      attrname.placeholder = elem.nameph;
      nodee.classList.remove(arr[i].prefix);
      nodee.classList.add(arr[i].prefix);
      leftside.placeholder = elem.leftph;
      U.pe(Measurable.separator.length !== 1, 'se cambi il separatore da char a stringa devi aggiornare questo pattern');
      leftside.pattern = '[^' + Measurable.separator + ']*';
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

      if (arr[i].prefix !== '_') genericvarpattern += '|' + arr[i].prefix.substr(1);
      switch (arr[i].prefix) {
        default: break;
        case measurableRules.variable:
          genericvarattrnameinput = attrname; break;
        case measurableRules.onRefresh:
        case measurableRules.onDragStart: case measurableRules.onRotationStart: case measurableRules.onResizeStart:
        case measurableRules.whileRotating: case measurableRules.whileResizing: case measurableRules.whileDragging:
        case measurableRules.onDragEnd: case measurableRules.onResizeEnd: case measurableRules.onRotationEnd:
          // U.remove(operatorselect2); triggerscommon();
          break;
        case measurableRules.constraint:
          leftside.setAttribute('list', 'measurableList' + arr[i].prefix);
          leftside.dataset['target'] = arr[i].prefix;
          break;
        case measurableRules._jquiDra: //dynamicjquiplaceholder(attrname, Draggableoptions); break;
        case measurableRules._jquiRes: //dynamicjquiplaceholder(attrname, Resizableoptions); break;
        case measurableRules._jquiRot: //dynamicjquiplaceholder(attrname, Rotatableoptions); break;
          attrname.setAttribute('list', 'measurableList' + arr[i].prefix);
          attrname.dataset['target'] = arr[i].prefix;
          attrname.setAttribute('defaultvalue', '');
          break;
        /*
      case 'never again, was on (Drag, res, rot) + (start, doing, end)':
        prefix.innerText = '_ondrag';
        operatorselect2.children[0].children[0].innerHTML = 'Start';
        operatorselect2.children[0].children[1].innerHTML = 'ging';
        operatorselect2.children[0].children[2].innerHTML = 'End';
        triggerscommon();
        prefix.innerText = '_onresiz';
        operatorselect2.children[0].children[0].innerHTML = 'eStart';
        operatorselect2.children[0].children[1].innerHTML = 'ing';
        operatorselect2.children[0].children[2].innerHTML = 'eEnd';
        triggerscommon();
        prefix.innerText = '_onrotat';
        operatorselect2.children[0].children[0].innerHTML = 'ionStart';
        operatorselect2.children[0].children[1].innerHTML = 'ing';
        operatorselect2.children[0].children[2].innerHTML = 'ionEnd';
        triggerscommon();
        break;*/
      }


      if (!elem.haveleft) { U.remove(leftside); U.remove(opparent); }
      if (!elem.havetarget) { U.remove(target); }
      title.dataset.target = ".meas_acc > .panel > ." + elem.prefix;
      title.innerHTML = '<span class="innertitle">' + elem.name + '&nbsp;(<span class="rulecounter">0</span>)</span><button class="addrule btn btn-sm btn-success">+</button><span class="countershell"></span>';
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
    MeasurableTemplateGenerator.makedatasetLists();
    return this.generateMeasurableTemplate(); }

  public static makedatasetLists(): void {
    const constraintOptions: ConstraintLeftAdmitteds = new ConstraintLeftAdmitteds();
    let opt: HTMLOptionElement;
    let datalist: HTMLDataListElement;
    let key: string;
    let i: number;
    delete constraintOptions.absoluteDocPos;
    constraintOptions['absoluteDocPos.x'] = 'absoluteDocPos.x';
    constraintOptions['absoluteDocPos.y'] = 'absoluteDocPos.y';
    delete constraintOptions.absoluteGPos;
    constraintOptions['absoluteGPos.x'] = 'absoluteGPos.x';
    constraintOptions['absoluteGPos.y'] = 'absoluteGPos.y';
    delete constraintOptions.relativePos;
    constraintOptions['relativePos.x'] = 'relativePos.x';
    constraintOptions['relativePos.y'] = 'relativePos.y';
    delete constraintOptions.relativeVPos;
    constraintOptions['relativeVPos.x'] = 'relativeVPos.x';
    constraintOptions['relativeVPos.y'] = 'relativeVPos.y';
    delete constraintOptions.vertexSize;
    constraintOptions['vertexSize.x'] = 'vertexSize.x';
    constraintOptions['vertexSize.y'] = 'vertexSize.y';
    constraintOptions['vertexSize.w'] = 'vertexSize.w';
    constraintOptions['vertexSize.h'] = 'vertexSize.h';
    const constraintOptionsPH: Dictionary<string, string> = U.cloneObj(constraintOptions);
    for (key in constraintOptionsPH) { constraintOptionsPH[key] = 'Number'; }
    MeasurableTemplateGenerator.constraintMap = constraintOptions;
    MeasurableTemplateGenerator.constraintPlaceholderMap = constraintOptionsPH;
    let datasets: object[] = [ResizableoptionsPH, DraggableOptionsPH, RotatableoptionsPH, constraintOptionsPH];
    let rulenames: string[] = [measurableRules._jquiRes, measurableRules._jquiDra, measurableRules._jquiRot, measurableRules.constraint];
    for (i = 0; i < datasets.length; i++) {
      datalist = document.createElement('datalist');
      document.body.appendChild(datalist);
      datalist.id = 'measurableList' + rulenames[i];
      console.log('datasets:', datasets);
      for (key in datasets[i]) {
        opt = document.createElement('option');
        datalist.appendChild(opt);
        // opt.value = datasets[i][key];
        opt.value = key;
      }
    }
  }
}
export class Rotatableoptions {
  static readonly degrees: string = 'degrees';
  // static radians: string = 'radians';
  static readonly handle: string = 'handle'; //  internamente richiede come parametro un $('imageselector')... crea un elemento con quell'immagine. e appendilo al vertice con display: none per evitare di ricrearne uno ogni volta che crei un vertice, almeno così viene anche cancellato assieme al vertice. prova se l'url netto va bene lo stesso in overloading
  static readonly handleOffsetX: string = 'handleOffsetX';
  static readonly handleOffsetY: string = 'handleOffsetY'; // internamente è: handleOffset: { top: 0, left: 0 }
  static readonly rotationCenterOffsetX: string = 'rotationCenterOffsetX';
  static readonly rotationCenterOffsetY: string = 'rotationCenterOffsetY';
   // internamente è: rotationCenterOffset: { top: 0, left: 0 } from the center of the element
  static readonly step: string = 'step'; // internamente ha "snap = boolean" e step = number, setta anche snap = true se trovi step come attributo measur-rotatable.
  static readonly transforms: string = 'transforms'; // non chiaro neanche negli esempi demo. googla.
  static readonly wheelRotate: string = 'wheelRotate'; // NB: non previene lo scroll della pagina come azione default.
  static readonly onRotating: string = 'onRotating'; // NB: se la sua trimmed version non inizia con function oppure con /^([^)]+)[\s]*=>$/ allora aggiungicelo tu a tempo di esecuzione? o non vale la pena per degradazione performance?.
  static readonly onRotationStart: string = 'onRotationStart'; // in realtà è "start"
  static readonly onRotationEnd: string = 'onRotationEnd'; // in realtà è "stop"
  static readonly disabled: string = 'disabled';
  // static readonly enabled: string = 'enabled'; // $var.resizable('disable'); or .resizable( "enable" );
}
//if the placeholder value is a choice of literals, the first literal is the default value. UPPERCASED, CamelCased and (parenthesized) words are not literals. Those values are not dynamic and are evaluated only once.

export class Resizableoptions {
  static readonly alsoResize: string = 'alsoResize';
  static readonly animate: string = 'animate';
  static readonly animateDuration: string = 'animateDuration';
  static readonly animateEasing: string = 'animateEasing';
  static readonly aspectRatio: string = 'aspectRatio';
  static readonly autoHide: string = 'autoHide';
  static readonly cancel: string = 'cancel';
  static readonly classes: string = 'classes';
  static readonly containment: string = 'containment';
  static readonly delay: string = 'delay';
  static readonly distance: string = 'distance';
  static readonly ghost: string = 'ghost';
  static readonly grid: string = 'grid';
  static readonly handles: string = 'handles';
  static readonly helper: string = 'helper';
  static readonly maxHeight: string = 'maxHeight';
  static readonly maxWidth: string = 'maxWidth';
  static readonly minHeight: string = 'minHeight';
  static readonly minWidth: string = 'minWidth';
// Methods
// destroy()
  static readonly disabled: string = 'disabled';
  // static readonly enabled: string = 'enabled'; // $var.resizable('disable'); or .resizable( "enable" );
// instance(); only useful as return value on javascript
// .resizable('option',{key', 'optionname') return the current option or a key-value object with all options or .resizable('option', {key: value}) setta opzioni.
// .resizable('widget') return $(resizable element)
  static readonly create: string = 'create'; // .resizable('create', functioncallback);
  static readonly resizing: string = 'resizing';
  static readonly resizeStart: string = 'resizeStart';
  static readonly resizeStop: string = 'resizeStop';
}

export class Draggableoptions {
  static readonly addClasses: string = 'addClasses';
  static readonly appendTo: string = 'appendTo';
  static readonly axis: string = 'axis'; // actually "x, y" happens when you input "false"
  static readonly cancel: string = 'cancel';
  static readonly classes: string = 'classes';
  static readonly connectToSortable: string = 'connectToSortable';
  static readonly containment: string = 'containment';
  static readonly cursor: string = 'cursor'; // todo: setta default: quadriarrow (crosshair?)
  static readonly cursorAt: string = 'cursorAt';
  static readonly delay: string = 'delay';
  static readonly distance: string = 'distance';
  //todo: permetti di fare cambiamenti a run-time usando: chain -> optional export (dinamically rcalculate and replace content of _jquiDrag* attributes), second chain -> point to _jquiDragRule and execute things like in the example "Get or set the grid option, after initialization: ..."
  static readonly grid: string = 'grid';
  static readonly handle: string = 'handle';
  static readonly helper: string = 'helper';
  static readonly iframeFix: string = 'iframeFix';
  static readonly opacity: string = 'opacity';
  static readonly refreshPositions: string = 'refreshPositions';
  // todo: droppable
  static readonly revert: string = 'revert';
  static readonly revertDuration: string = 'revertDuration';
  static readonly scope: string = 'scope';
  static readonly scroll: string = 'scroll'; //todo: devi fare lo scroll quando trascini un vertice out of visible graph boundary.
  static readonly scrollSensitivity: string = 'scrollSensitivity'; //Distance in pixels from the edge of the viewport after which the viewport should scroll. Distance is relative to pointer, not the draggable.
  static readonly scrollSpeed: string = 'scrollSpeed';
  static readonly snap: string = 'snap';
  static readonly snapMode: string = 'snapMode';
  static readonly snapTolerance: string = 'snapTolerance';
  static readonly stack: string = 'stack';
  static readonly zIndex: string = 'zIndex';
// Methods
  static readonly disabled: string = 'disabled';
  // static readonly enabled: string = 'enabled'; //  actually it is: .droppable( "enable" / "disable")
  static readonly dragging: string = 'dragging';
  static readonly dragStart: string = 'dragStart';
  static readonly dragStop: string = 'dragStop';
}

export class RotatableoptionsPH {
  static readonly degrees: string = 'false | number';
  static readonly radians: string = 'false | number';
  static readonly handle: string = 'image url'; // internamente richiede come parametro un $('imageselector')... crea un elemento con quell'immagine. e appendilo al vertice con display: none per evitare di ricrearne uno ogni volta che crei un vertice, almeno così viene anche cancellato assieme al vertice. prova se l'url netto va bene lo stesso in overloading
  static readonly handleOffsetX: string = 'width / 2';
  static readonly handleOffsetY: string = '-20'; // internamente è: handleOffset: { top: 0, left: 0 }
  static readonly rotationCenterOffsetX: string = 'width / 2';
  static readonly rotationCenterOffsetY: string = 'height / 2';
// internamente è: rotationCenterOffset: { top: 0, left: 0 } from the center of the element
  static readonly step: string = 'degree'; // internamente ha "snap = boolean" e step = number, setta anche snap = true se trovi step come attributo measur-rotatable.
  static readonly transforms: string = 'null | {scaleY: 2}'; // non chiaro neanche negli esempi demo. googla.
  static readonly wheelRotate: string = 'false'; // NB: non previene lo scroll della pagina come azione default.
  static readonly onRotating: string = 'function(event, ui) { ... }'; // NB: se la sua trimmed version non inizia con function oppure con /^([^)]+)[\s]*=>$/ allora aggiungicelo tu a tempo di esecuzione? o non vale la pena per degradazione performance?.
  static readonly onRotationStart: string = 'function(event, ui) { ... }'; // in realtà è "start"
  static readonly onRotationEnd: string = 'function(event, ui) { ... }'; // in realtà è "stop"
  static readonly disabled: string = 'false | true';
}
//if the placeholder value is a choice of literals, the first literal is the default value. UPPERCASED, CamelCased and (parenthesized) words are not literals. Those values are not dynamic and are evaluated only once.

export class ResizableoptionsPH {
  static readonly alsoResize: string = 'Selector | Element | jQuery';
  static readonly animate: string = 'Boolean';
  static readonly animateDuration: string = 'slow | fast | msec number';
  static readonly animateEasing: string = 'swing | api.jqueryui.com/easings';
  static readonly aspectRatio: string = 'Boolean | Number';
  static readonly autoHide: string = 'Boolean';
  static readonly cancel: string = 'Selector';
  static readonly classes: string = 'Object (see jQUI website)';
  static readonly containment: string = 'Selector | Element | parent | document';
  static readonly delay: string = 'Number';
  static readonly distance: string = 'Number (tolerance)';
  static readonly ghost: string = 'Boolean';
  static readonly grid: string = '[x: 0, y: 0]';
  static readonly handles: string = 'se|s|e|n|w|ne|sw|nw|all (comma separated)';
  static readonly helper: string = 'Classname';
  static readonly maxHeight: string = 'Number';
  static readonly maxWidth: string = 'Number';
  static readonly minHeight: string = 'Number';
  static readonly minWidth: string = 'Number';
  static readonly disabled: string = 'false | true';
// Methods
// destroy()
  static readonly enabled: string = 'true | false'; // $var.resizable('disable'); or .resizable( "enable" );
// instance(); only useful as return value on javascript
// .resizable('option', 'optionname') return the current option or a key-value object with all options or .resizable('option', {key: value}) setta opzioni.
// .resizable('widget') return $(resizable element)
// create: string = ''; .resizable('create', functioncallback);
  static readonly resizing: string = 'function(event, ui){...}';
  static readonly resizeStart: string = 'function(event, ui){...}';
  static readonly resizeStop: string = 'function(event, ui){...}';
}

export class DraggableOptionsPH {
  static readonly  addClasses: string = 'false | tr ue';
  static readonly  appendTo: string = 'Selector | Element | jQuery | parent';
  static readonly  axis: string = 'x, y | x | y'; // actually "x, y" happens when you input "false"
  static readonly  cancel: string = 'Selector';
  static readonly  classes: string = 'Object (see jQUI website)';
  static readonly  connectToSortable: string = 'Selector';
  static readonly  containment: string = 'Selector | SizeArray | parent | document | window';
  static readonly  cursor: string = 'CSSCursor'; // todo: setta default: quadriarrow (crosshair?)
  static readonly  cursorAt: string = '{top, left} | {right, bottom} | {top, right} | {bottom, left}';
  static readonly  delay: string = 'Number (msec)';
  static readonly  distance: string = 'Number (pixel tolerance)';
//todo: permetti di fare cambiamenti a run-time usando: chain -> optional export (dinamically rcalculate and replace content of _jquiDrag* attributes), second chain -> point to _jquiDragRule and execute things like in the example "Get or set the grid option, after initialization: ..."
  static readonly  grid: string = '[x: 0, y: 0]';
  static readonly  handle: string = 'Selector | Element';
  static readonly  helper: string = 'original | clone | Function() => Element';
  static readonly  iframeFix: string = 'Boolean | Selector';
  static readonly opacity: string = 'Number';
  static readonly refreshPositions: string = 'false | true';
//todo: droppable
  static readonly revert: string = 'false | true | valid | invalid | Function() => Boolean';
  static readonly revertDuration: string = 'Number (msec)';
  static readonly scope: string = 'String';
  static readonly scroll: string = 'true | false'; //todo: devi fare lo scroll quando trascini un vertice out of visible graph boundary.
  static readonly scrollSensitivity: string = 'Number (pixel)'; //Distance in pixels from the edge of the viewport after which the viewport should scroll. Distance is relative to pointer, not the draggable.
  static readonly scrollSpeed: string = '20 | Number';
  static readonly snap: string = 'false | true | Selector';
  static readonly snapMode: string = 'both | inner | outer';
  static readonly snapTolerance: string = '20 | Number';
  static readonly stack: string = 'Selector';
  static readonly zIndex: string = 'Number';
// Methods
  static readonly dragging: string = 'function(event, ui){...}';
  static readonly dragStart: string = 'function(event, ui){...}';
  static readonly dragStop: string = 'function(event, ui){...}';
  static readonly disabled: string = 'false | true';
  // static readonly enabled: string = 'true | false'; // actually it is: .droppable( "enable" / "disable")
}
/*
draggableui vertex:
  usa jqui draggable, lui ti aggiorna top, left, tu le trasformi in GraphPoint e setti:
  NO transform() che funzionerebbe su tutti
ma switch sulla taga e setta both: cx (al centro), x (al top-left)
  i vertici default diventano "measurable", con responsabilità dell'utente di inserire la classe se li vuole spostabili. default axis = both.*/
