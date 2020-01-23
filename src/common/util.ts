import {
  IVertex,
  IEdge,
  IField,
  IPackage,
  M2Class,
  IAttribute, IReference,
  IFeature,
  ModelPiece, MetaMetaModel,
  ISidebar, XMIModel,
  IGraph, IModel, Status,
  ECoreClass, ECorePackage, ECoreRoot, ECoreOperation, MAttribute, IClass, IClassifier, ECoreAnnotation, ECoreEnum
} from './Joiner';

import ClickEvent = JQuery.ClickEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseMoveEvent = JQuery.MouseMoveEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import ContextMenuEvent = JQuery.ContextMenuEvent;
export class Dictionary<K = string, V = string> extends Object {}
import * as detectzoooom            from 'detect-zoom'; // https://github.com/tombigel/detect-zoom broken 2013? but works

import ResizableOptions = JQueryUI.ResizableOptions;
import DraggableOptions = JQueryUI.DraggableOptions;
import ResizableUIParams = JQueryUI.ResizableUIParams;
import DraggableEventUIParams = JQueryUI.DraggableEventUIParams;
import KeyDownEvent = JQuery.KeyDownEvent;
import MouseEnterEvent = JQuery.MouseEnterEvent;
import MouseLeaveEvent = JQuery.MouseLeaveEvent;
import ChangeEvent = JQuery.ChangeEvent;

export class MeasurableArrays {rules: Attr[]; imports: Attr[]; exports: Attr[]; variables: Attr[];
  constraints: Attr[]; chain: Attr[]; chainFinal: Attr[]; dstyle: Attr[]; html: HTMLElement | SVGElement; e: Event}

export class myFileReader {
  private static input: HTMLInputElement;
  private static fileTypes: string [];
  private static onchange: (e: ChangeEvent) => void;
  // constructor(onchange: (e: ChangeEvent) => void = null, fileTypes: FileReadTypeEnum[] | string[] = null) { myFileReader.setinfos(fileTypes, onchange); }
  private static setinfos(fileTypes: FileReadTypeEnum[] | string[] = null, onchange: (e: ChangeEvent, files: FileList, contents: string[]) => void, readcontent: boolean) {
    myFileReader.fileTypes = (fileTypes || myFileReader.fileTypes) as string[];
    console.log('fileTypes:', myFileReader.fileTypes, fileTypes);
    myFileReader.input = document.createElement('input');
    const input: HTMLInputElement = myFileReader.input;
    myFileReader.onchange = function (e: ChangeEvent): void {
      if (!readcontent) { onchange(e, input.files, null); return; }
      let contentObj = {};
      let fileLetti: number = 0;
      for (let i: number = 0; i < input.files.length; i++) {
        const f: File = input.files[i];
        console.log('filereadContent['+i+']( file:', f, ')');
        U.fileReadContent(f, (content: string) => {
          console.log('file['+i+'] read complete. done: ' + ( 1 + fileLetti) + ' / ' + input.files.length, 'contentObj:', contentObj);
          contentObj[i] = content; // cannot use array, i'm not sure the callbacks will be called in order. using push is safer but could alter order.
          // this is last file to read.
          if (++fileLetti === input.files.length) {
            const contentArr: string[] = [];
            for (let j: number = 0; j < input.files.length; j++) { contentArr.push(contentObj[j]); }
            onchange(e, input.files, contentArr);
          }
        });
      }
    } || myFileReader.onchange;
  }
  private static reset(): void {
    myFileReader.fileTypes = null;
    myFileReader.onchange = null;
    myFileReader.input = null;
  }
  public static show(onChange: (e: ChangeEvent, files: FileList, contents: string[]) => void, extensions: string[] | FileReadTypeEnum[] = null, readContent: boolean): void {
    myFileReader.setinfos(extensions, onChange, readContent);
    myFileReader.input.setAttribute('type', 'file');
    if (myFileReader.fileTypes) {
      let filetypestr: string = '';
      const sepkey: string = U.getStartSeparatorKey();
      for (let i = 0; i < myFileReader.fileTypes.length; i++) { filetypestr += U.startSeparator(sepkey, ',') + myFileReader.fileTypes[i]; }
      myFileReader.input.setAttribute('accept', filetypestr);
    }
    console.log('fileTypes:', myFileReader.fileTypes, 'input:', myFileReader.input);
    $(myFileReader.input).on('change.custom', myFileReader.onchange).trigger('click');
    myFileReader.reset();
  }
}
export class InputPopup {
  static popupCounter = 0;
  html: HTMLElement;
  constructor(title: string, txtpre: string, txtpost: string, event: any[][] /* array of (['oninput', onInputFunction])*/,
              placeholder: string = null, value: string, inputType: string = 'input', inputSubType: string = null) {
    const value0 = value;
    if (!value) { value = ''; }
    const id = 'popup_' + InputPopup.popupCounter++;
    placeholder = (placeholder ? 'placeholder="' + placeholder + '"' : '');
    inputSubType = (inputSubType ? 'type = "' + inputSubType + '"' : '');
    let innerValue: string;
    if (inputType.toLowerCase() === 'textarea') {
      innerValue = U.replaceAll(U.replaceAll(value, '<', '&lt;'), '>', '&gt;');
      innerValue += '</' + inputType + '>';
      value = '';
    } else { value = value === '' ? '' : 'value="' + U.replaceAll(value, '"', '&quot;') + '"'; innerValue = ''; }
    const container: HTMLElement = U.toHtml('' +
      '<div _ngcontent-c3="" data-closebuttontarget="' + id + '" class="screenWideShadow" style="display: none;">' +
      '<div _ngcontent-c3="" class="popupContent">' +
      '<h1 _ngcontent-c3="" style="text-align: center;">' + title + '</h1>' +
      '<button _ngcontent-c3="" class="closeButton" data-closebuttontarget="' + id + '">X</button>' +
      '<br _ngcontent-c3="">' +
      '<div _ngcontent-c3="" class="TypeList">' +
      '<table class="typeTable"><tbody>' +
      '<tr class="typeRow"><td class="alias textPre">' + txtpre + '</td>' +
      '<' + inputType + ' ' + inputSubType + ' ' + placeholder + ' ' + value + ' class="form-control popupInput" ' +
      'aria-label="Small" aria-describedby="inputGroup-sizing-sm">' + innerValue + txtpost +
      '</td>' +
      '</tr>' +
      '</tbody></table></div>' +
      '</div></div>');
    const $input = $(container).find('input');
    U.closeButtonSetup($(container));
    let i = -1;
    while (++i < event.length) {
      const currentEvt = event[i];
      $input.on(currentEvt[0], currentEvt[1]);
    }
    this.html = container;

    if (inputType === 'textarea') {
      this.getInputNode()[0].setAttribute('style', 'width: calc(75vw - 152px); height: calc(75vh - 200px);');
    }
    this.show();
  }
  getInputNode(): JQuery<HTMLElement> { return $(this.html).find('.popupInput'); }
  show(): void {
    document.body.appendChild(this.html);
    this.html.style.display = 'block'; }
  hide(): void { this.html.style.display = 'none'; }
  destroy(): null {
    if (this.html && this.html.parentNode) {
      this.html.parentNode.removeChild(this.html);
      return this.html = null; }
  }

  addOkButton(load1: string, finish: () => void) {
    const input: HTMLElement = this.getInputNode()[0];
    const button: HTMLButtonElement = document.createElement('button');
    button.innerText = 'Confirm';
    const size: Size = U.sizeof(button);
    button.style.left = 'calc( 50% - ' + size.w / 2 + 'px);';
    input.parentNode.appendChild(button);
    $(button).on('click.btnclickpopup', finish);
  }

  setPostText(str: string) { $(this.html).find('.textPre')[0].innerHTML = str; }
}

export enum ShortAttribETypes {
  void = 'void',
  EChar  = 'Echar',
  EString  = 'EString',
  EDate  = 'EDate',
  EFloat  = 'EFloat',
  EDouble  = 'EDouble',
  EBoolean = 'EBoolean',
  EByte  = 'EByte',
  EShort  = 'EShort',
  EInt  = 'EInt',
  ELong  = 'ELong',
  /*
  ECharObj  = 'ECharObj',
  EStringObj  = 'EStringObj',
  EDateObj  = 'EDateObj',
  EFloatObj  = 'EFloatObj',
  EDoubleObj  = 'EDoubleObj',
  EBooleanObj = 'EBooleanObj',
  EByteObj  = 'EByteObj',
  EShortObj  = 'EShortObj',
  EIntObj  = 'EIntObj',
  ELongObj  = 'ELongObj',
  EELIST  = 'EELIST',*/

}

export class U {
  public static loopcounter = 0;
  private static prefix = 'ULibrary_';
  private static sizeofvar: HTMLElement = null;
  private static $sizeofvar: JQuery<HTMLElement> = null;
  private static clipboardinput: HTMLInputElement = null;
  private static PermuteArr: any[][] = [];
  private static PermuteUsedChars: any[] = [];
  private static resizingBorder: HTMLElement = null;
  private static resizingContainer: HTMLElement = null;
  // static he = null;
  public static production = false;
  private static addCssAvoidDuplicates: Dictionary<string, HTMLStyleElement> = {};
  static $measurableRelativeTargetRoot: JQuery<HTMLElement | SVGElement>;
  static varTextToSvg: SVGSVGElement = null;
  private static dblclickchecker: number = new Date().getTime();// todo: move @ start
  private static dblclicktimerms: number = 300;// todo: move @ start
  static checkDblClick(): boolean {
    const now: number = new Date().getTime();
    const old: number = U.dblclickchecker;
    U.dblclickchecker = now;
    console.log('dblclick time:', now - old, now, old);
    return (now - old <= U.dblclicktimerms); }


  static firstToUpper(s: string): string {
    if (!s || s === '') return s;
    return s.charAt(0).toUpperCase() + s.slice(1); }

  static fileReadContent(file: File, callback: (content :string) => void): void {
    const textType = /text.*/;
    try { if (!file.type || file.type.match(textType)) {
      let reader = new FileReader();
      reader.onload = function(e) { callback( '' + reader.result ); };
      reader.readAsText(file);
      return;
    } } catch(e) { U.pe(true, "Exception while trying to read file as text. Error: |", e, "|", file); }
    U.pe(true, "Wrong file type found: |", file ? file.type : null, "|", file); }

  static fileRead(onChange: (e: ChangeEvent, files: FileList, contents: string[]) => void, extensions: string[] | FileReadTypeEnum[] = null, readContent: boolean): void {
    myFileReader.show(onChange, extensions, readContent);
  }
  public static textToSvg<T extends SVGElement>(str: string): T { return U.textToSvgArr<T>(str)[0]; }
  static textToSvgArr<T extends SVGElement> (str: string): T[] {
    if (!U.varTextToSvg) { U.varTextToSvg = U.newSvg<SVGSVGElement>('svg'); }
    U.varTextToSvg.innerHTML = str;
    const ret: T[] = [];
    let i: number;
    for (i = 0; i < U.varTextToSvg.childNodes.length; i++) { ret.push(U.varTextToSvg.childNodes[i] as T); }
    return ret; }

  static addCss(key: string, str: string, prepend: boolean = true): void {
    const css: HTMLStyleElement = document.createElement('style');
    css.innerHTML = str;
    const old: HTMLStyleElement = U.addCssAvoidDuplicates[key];
    if (old) { old.parentNode.removeChild(old); }
    U.addCssAvoidDuplicates[key] = css;
    if (prepend) { document.head.prepend(css); } else { document.head.append(css); }
  }

  static clear(htmlNode: HTMLElement | SVGElement) {
    while (htmlNode.firstChild) {
      htmlNode.removeChild(htmlNode.firstChild);
    }
  }

  static clearAllTimeouts(): void {
    const highestTimeoutId: number = setTimeout(() => {}, 1) as any;
    for (let i = 0 ; i < highestTimeoutId ; i++) { clearTimeout(i); }
  }
  static petmp(b: boolean, s: any, ...restArgs: any[]): null { return U.pe(b, s, restArgs); }

  static pe(b: boolean, s: any, ...restArgs: any[]): null {
    if (!b) { return null; }
    if (restArgs === null || restArgs === undefined) { restArgs = []; }
    let str = 'Error:' + s + '';
    console.error('pe[0/' + (restArgs.length + 1) + ']: ', s);
    for (let i = 0; i < restArgs.length; i++) {
      s = restArgs[i];
      str += 'pe[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
      console.error('pe[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
    }
    if (!U.production) { alert(str); } else U.pw(true, s, ...restArgs);
    return (((b as unknown) as any[])['@makeMeCrash'] as any[])['@makeMeCrash']; }

  static pw(b: boolean, s: any, ...restArgs: any[]): string {
    if (!b) { return null; }
    if (restArgs === null || restArgs === undefined) { restArgs = []; }
    console['' + 'trace']();
    let str = 'Warning:' + s + '';
    console.warn('pw[0/' + (restArgs.length + 1) + ']: ', s);
    for (let i = 0; i < restArgs.length; i++) {
      s = restArgs[i];
      str += 'pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
      console.warn('pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
    }
    U.bootstrapPopup(str, 'warning', 5000);
    // s = (((b as unknown) as any[])['@makeMeCrash'] as any[])['@makeMeCrash'];
    return str; }

  static ps(b: boolean, s: any, ...restArgs: any[]): string {
    if (!b) { return null; }
    if (restArgs === null || restArgs === undefined) { restArgs = []; }
    let str = s + '';
    console.info('ps[0/' + (restArgs.length + 1) + ']: ', s);
    for (let i = 0; i < restArgs.length; i++) {
      s = restArgs[i];
      str += 'ps[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
      console.info('pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
    }
    U.bootstrapPopup(str, 'success', 3000);
    // s = (((b as unknown) as any[])['@makeMeCrash'] as any[])['@makeMeCrash'];
    return str; }

  static pif(b: boolean, s: any, ...restArgs: any[]): string {
    if (!b) {
      return null;
    }
    if (restArgs === null || restArgs === undefined) {
      restArgs = [];
    }
    let str = 'p: ' + s;
    console.info('p:', s);
    for (let i = 0; i < restArgs.length; i++) {
      s = restArgs[i];
      str += 'p[' + (i + 1) + '/' + restArgs.length + ']: ' + s + '\t\t\r\n';
      console.info('p[' + (i + 1) + '/' + restArgs.length + ']: ', s);
    }
    // alert(str);
    return str; }

  static p(s: any, ...restArgs: any[]): string {
    if (restArgs === null || restArgs === undefined) { restArgs = []; }
    let str = 'p: ' + s;
    console.info('p:', s);
    for (let i = 0; i < restArgs.length; i++) {
      s = restArgs[i];
      str += 'p[' + (i + 1) + '/' + restArgs.length + ']: ' + s + '\t\t\r\n';
      console.info('p[' + (i + 1) + '/' + restArgs.length + ']: ', s);
    }
    // alert(str);
    return str;
  }

  static $alertcontainer: JQuery<HTMLElement> = null;
  static alertcontainer: HTMLElement = null;
  static bootstrapPopup(innerhtmlstr: string, color: 'success' | 'warning' | 'danger', timer: number): void {
    const div = document.createElement('div');
    if (!U.$alertcontainer) {
      U.alertcontainer = document.createElement('div');
      U.alertcontainer.classList.add('alertcontainer');
      document.body.appendChild(U.alertcontainer);
      U.$alertcontainer = $(U.alertcontainer); }
    const container: HTMLElement = U.alertcontainer;
    const $container = U.$alertcontainer;
    const $div = $(div);
    container.appendChild(div);
    div.classList.add('alertshell');
    document.body.appendChild(container);
    div.setAttribute('role', 'alert');
    const alertMargin: HTMLElement = document.createElement('div');
    alertMargin.innerHTML = innerhtmlstr;
    alertMargin.classList.add('alert');
    alertMargin.classList.add('alert-' + color);
    div.appendChild(alertMargin);
    const end = () => { $div.slideUp(400, () => { container.removeChild(div); }); };
    $div.hide().slideDown(200, () => setTimeout(end, timer)); }

  static cloneHtml<T extends Element>(html: T, deep = true, defaultIDNum = 1): T {
    const clone: T = html.cloneNode(deep) as T;
    const getLastNum = (str: string): number => {
      let pos = str.length ;
      while ( --pos > 0 && !isNaN(+str.charAt(pos)) ) {}
      const numstr = (str.substring(pos));
      return isNaN(+numstr) ? defaultIDNum : +numstr;
    };
    if (!clone.id) { return clone; }
    let lastnum = getLastNum(clone.id) - 1;
    const tmpID: string = clone.id + (clone.id.indexOf('_Clone') === -1 ? '_Clone' : '');
    while (document.getElementById(tmpID + (++lastnum))) {}
    clone.id = tmpID + lastnum;
    return clone;
  }

  public static clearAttributes(node: Element): void {
    let j: number;
    for (j = 0; j < node.attributes.length; j++) { node.removeAttribute(node.attributes[j].name); }
  }

  static cloneObj<T extends object>(o: T): Json {
    // const r: HTMLElement = document.createElement(o.tagName);
    // r.innerHTML = o.innerHTML;
    // U.pe( o as HTMLElement !== null, 'non utilizzabile su html');
    return JSON.parse(JSON.stringify(o));
    // todo: questa funzione non può clonare html. allow cloneObj of circular objects.
  }

  static cloneObj2<T extends object>(o: T): T {
    U.pe(true, 'todo: dovrebbe fare una deep copy copiando anche le funzioni (cosa che json.stringify non fa).');
    return null; }

  static loadScript(path: string, useEval: boolean = false): void {
    const script = document.createElement('script');
    script.src = path;
    script.type = 'text/javascript';
    U.pe(useEval, 'useEval: todo. potrebbe essere utile per avviare codice fuori dalle funzioni in futuro.');
    document.body.append(script); }

  static newSvg<T extends SVGElement>(type: string): T {
    return document.createElementNS('http://www.w3.org/2000/svg', type) as T; }

  static measurableGetArrays(measureHtml: HTMLElement | SVGElement, e: Event): MeasurableArrays {
    if (!measureHtml) {
      measureHtml = (e.target || e.currentTarget) as HTMLElement | SVGElement; // currentTarget === dicument sometimes.
//      console.log('html:', measureHtml, 'e: ', e);
      if (!measureHtml || measureHtml as any === document) {
        measureHtml = e.target as HTMLElement | SVGElement;
        while (measureHtml && !measureHtml.classList.contains('measurable')) { measureHtml = measureHtml.parentElement; }
        U.pe(!measureHtml, ' failed to get measurableRoot. evt:', e);
      }
      if(measureHtml.classList.contains('ui-wrapper') && !measureHtml.classList.contains('measurable')
        && (measureHtml.firstChild as HTMLElement).classList.contains('measurable')) { measureHtml = measureHtml.firstChild as any; }
    }
    const ret: {rules: Attr[], imports: Attr[], exports: Attr[], variables: Attr[], constraints: Attr[], chain: Attr[],
      chainFinal: Attr[], dstyle: Attr[], html: HTMLElement | SVGElement, e: Event} = {} as any;
    ret.e = e;
    ret.html = measureHtml;
    ret.rules = [];
    ret.constraints = [];
    ret.rules = [];
    ret.imports = [];
    ret.exports = [];
    ret.variables = [];
    ret.constraints = [];
    ret.chain = [];
    ret.chainFinal = [];
    ret.dstyle = [];
    let i: number;
    for (i = 0; i < measureHtml.attributes.length; i++) {
      const attr: Attr = measureHtml.attributes[i];
      const key = attr.name.toLowerCase();
      if (key.indexOf('_') !== 0) { continue; }
      if (key.indexOf('_rule') === 0) { ret.rules.push(attr); continue; }
      if (key.indexOf('_import') === 0) { ret.imports.push(attr); continue; }
      if (key.indexOf('_export') === 0) { ret.exports.push(attr); continue; }
      if (key.indexOf('_constraint') === 0) { ret.constraints.push(attr); continue; }
      if (key.indexOf('_chain') === 0) { ret.chain.push(attr); continue; }
      if (key.indexOf('_chainfinal') === 0) { ret.chainFinal.push(attr); continue; }
      if (key.indexOf('_dstyle') === 0) { ret.dstyle.push(attr); continue; }
      ret.variables.push(attr); }
    return ret; }

  static measurableElementSetup($root: JQuery<Element>, resizeConfig: ResizableOptions = null, dragConfig: DraggableOptions = null): void {
    $root.find('.measurable').addBack('.measurable').each(
      (i: number, h: Element) => U.measurableElementSetupSingle(h as HTMLElement | SVGElement,  resizeConfig, dragConfig)); }
  static measurableElementSetupSingle(elem: HTMLElement | SVGElement, resizeConfig: ResizableOptions = null, dragConfig: DraggableOptions = null): void {
    // apply resizableborder AND jquery.resize
    if (!elem.classList || !elem.classList.contains('measurable') || elem as any === document) {
      U.pw(true, 'invalid measurable:', elem, !elem.classList, '||', !elem.classList.contains('measurable')); return; }
    U.resizableBorderSetup(elem as HTMLElement);
    if (!resizeConfig) { resizeConfig = {}; }
    if (!dragConfig) { dragConfig = {}; }
    resizeConfig.create = resizeConfig.create || eval(elem.dataset.r_create);
    resizeConfig.resize = resizeConfig.resize || eval(elem.dataset.r_resize);
    resizeConfig.start = resizeConfig.start || eval(elem.dataset.r_start);
    resizeConfig.stop = resizeConfig.stop || eval(elem.dataset.r_stop);
    dragConfig.create = dragConfig.create || eval(elem.dataset.d_create);
    dragConfig.drag = dragConfig.drag || eval(elem.dataset.d_drag);
    dragConfig.start = dragConfig.start || eval(elem.dataset.d_start);
    dragConfig.stop = dragConfig.stop || eval(elem.dataset.d_stop);
    for (const key in resizeConfig) {
      if (resizeConfig[key] || !elem.dataset['r_' + key]) { continue; }
      resizeConfig[key] = elem.dataset['r_' + key]; }
    for (const key in dragConfig) {
      if (dragConfig[key] || !elem.dataset['d_' + key]) { continue; }
      dragConfig[key] = elem.dataset['d_' + key]; }
    $(elem).resizable(resizeConfig).draggable(dragConfig);
  }

  static replaceVars<T extends Element>(obj: object, html0: T, cloneHtml = true, debug: boolean = false): T {
    const html: T = cloneHtml ? U.cloneHtml<T>(html0) : html0;
    /// see it in action & parse or debug at
    // v1) perfetto ma non supportata in jscript https://regex101.com/r/Do2ndU/1
    // v2) usata: aggiustabile con if...substring(1). https://regex101.com/r/Do2ndU/3
    // get text between 2 single '$' excluding $$, so they can be used as escape character to display a single '$'
    // console.log('html0:', html0, 'html:', html);
    U.pe(!(html instanceof Element), 'target must be a html node.', html, html0);
    html.innerHTML = U.replaceVarsString(obj, html.innerHTML, debug);
    U.pif(debug, 'ReplaceVars() return = ', html.innerHTML);
    return html; }

  static replaceVarsString0(obj: object, str: string, escapeC: string[] = null, replacer: string[] = null, debug: boolean = false): string {
    U.pe(escapeC && !replacer, 'replacer cannot be null if escapeChar is defined.');
    U.pe(replacer && !escapeC, 'escapeChar cannot be null if replacer is defined');
    if (!escapeC && !replacer) { escapeC = replacer = []; }
    U.pe(escapeC.length !== replacer.length, 'replacer and escapeChar must be arrays of the same length');
    str = str.replace(/(^\$|(((?!\$).|^))[\$](?!\$))(.*?)(^\$|((?!\$).|^)[\$](?!\$))/gm,
      (match: string, capture) => {
        // console.log('matched:', match, 'capture: ', capture);
        if (match === '$') { return ''; }
        let prefixError = '';
        if (match.charAt(0) !== '$') {
          prefixError = match.charAt(0);
          match = match.substring(1); }
        // # = default value: {asHtml = true, isbase64 = false}
        const asHtml = match.charAt(1) === '1' || match.charAt(1) !== '#';
        const isBase64 = match.charAt(2) === '1' || match.charAt(2) !== '#';
        const varname = match.substring(3, match.length - 1);
        const debugtext = varname + '(' + match + ')';
        U.pif(debug, 'match:', match);
        const resultarr = U.replaceSingleVar(obj, varname, isBase64, false);
        let result: string = resultarr[resultarr.length - 1].value;
        if (result !== '' + result) { try { result = JSON.stringify(result); } catch(e) { result = '{_Cyclic object_}'} }
        let i = -1;
        U.pif(debug, 'replaceSingleVar: ', match, ', arr', resultarr, ', ret', result, ', this:', obj);
        if (!asHtml) { while (++i < escapeC.length) { result = U.replaceAll(result, escapeC[i], replacer[i]); } }
        U.pif(debug, 'replaceSingleVar: ' + debugtext + ' --> ' + result + ' --> ' + prefixError, result, obj);
        if (U.isObject(result)) {  }
        return prefixError + result;
      });
    return str; }

  static replaceVarsString(obj: object, htmlStr: string, debug: boolean = false): string {
    U.pe(!obj || !htmlStr, 'parameters cannot be null. obj:', obj, ', htmlString:', htmlStr);
    //  https://stackoverflow.com/questions/38563414/javascript-regex-to-select-quoted-string-but-not-escape-quotes
    //  good regex fatto da me https://regex101.com/r/bmWVrp/4

    // only replace content inside " quotes. (eventually escaping ")
    htmlStr = U.QuoteReplaceVarString(obj, htmlStr, '"', debug);
    // only replace content inside ' quotes. (eventually escaping ')
    htmlStr = U.QuoteReplaceVarString(obj, htmlStr, '\'', debug);
    // replaces what's left outside any quotation. (eventually escaping <>)
    htmlStr = U.replaceVarsString0(obj, htmlStr, ['<', '>'], ['&lt;', '&gt;']); // check here aaaaaaaaaaaaaa $$$$$$$$$$$
    return htmlStr; }

  static QuoteReplaceVarString(obj: object, htmlStr: string, quote: string, debug: boolean = false): string {
    U.pe(quote !== '"' && quote !== '\'', 'the only quote supported are single chars " and \'.');
    const quoteEscape = quote === '&quot;' ? '' : '&#39;'; // '\\' + quote;
    // todo: dovrei anche rimpiazzare & with &amp; per consentire input &something; trattati come stringhe.
    // ""|(:?[^\\](?!"")|^)((:?\\\\)*\"(:?.*?[^\\"]+){0,1}(:?\\\\)*\")
    // '""|(:?[^\\](?!"")|^)((:?\\\\)*\"(:?.*?[^\\"]+){0,1}(:?\\\\)*\")'
    // let regex = /""|(:?[^\\](?!"")|^)((:?\\\\)*\"(:?.*?[^\\"]+){0,1}(:?\\\\)*\")/;
    let regexStr = '""|(:?[^\\\\](?!"")|^)((:?\\\\\\\\)*\\"(:?.*?[^\\\\"]+){0,1}(:?\\\\\\\\)*\\")';
    if (quote !== '"') { regexStr = U.replaceAll(regexStr, '"', '\''); }
    const quoteRegex = new RegExp(regexStr, 'g'); // new RegExp("a", "b"); === /a/b
    htmlStr = htmlStr.replace(quoteRegex, (match: string, capture) => {
      const start: number = match.indexOf(quote);
      const end: number = match.lastIndexOf(quote);
      const content: string = U.replaceVarsString0(obj, match.substring(start + 1, end), [quote], [quoteEscape], debug);
      const ret = match.substring(0, start + 1) + content + match.substring(end);
      U.pif(debug, 'replaceQuotedVars: match: |' + match + '| --> |' + content + '| --> |' + ret + '| html:' , htmlStr, 'capt:', capture);
      return ret;
    });
    return htmlStr;
  }

  //todo: da rimuovere, è stata completamente superata dal nuovo return type array di replaceSingleVar
  static replaceSingleVarGetParentAndChildKey(obj: object, fullpattern: string, canThrow: boolean = false): {parent: any, childkey: string} {
    const ret: {parent: any, childkey: string} = {parent: null, childkey: null};
    let targetPatternParent: string;
    const pos = fullpattern.indexOf('.');
    const isBase64 = fullpattern.charAt(2) === '1' || fullpattern.charAt(2) !== '#';
    U.pe(isBase64, 'currently this method does not support base64 encoded templates. the conversion is still to do.', fullpattern);
    if (pos === -1) {
      ret.parent = obj;
      ret.childkey = fullpattern.substring(3, fullpattern.length - 1);
      return ret; }
    try {
      targetPatternParent = fullpattern.substring(0, pos) + '$';
      const tmparr = U.replaceSingleVarRaw(obj, targetPatternParent);
      ret.parent = tmparr[tmparr.length - 1].value;
      ret.childkey = fullpattern.substring(pos + 1, fullpattern.length - 1);
    } catch (e) {
      U.pw(true, 'replaceSingleVarGetParentAndChildKey failed. fullpattern: |' + fullpattern + '| targetPatternParent: |'
        + targetPatternParent + '| obj: ', obj, ' reason: ', e);
      return null; }
    return ret; }

  static replaceSingleVarRaw(obj: object, fullpattern: string, canThrow: boolean = false): {token: string, value: any}[] {
    fullpattern = fullpattern.trim();
    const isBase64 = fullpattern.charAt(2) === '1' || fullpattern.charAt(2) !== '#';
    const varName = fullpattern.substring(3, fullpattern.length - 1);
    return U.replaceSingleVar(obj, varName, isBase64, canThrow); }

  static replaceSingleVar(obj: object, varname: string, isBase64: boolean, canThrow: boolean = false): {token: string, value: any}[] {
    const debug = false;
    const showErrors = false;
    let debugPathOk = '';
    if (isBase64) { varname = atob(varname); }
    let requestedValue: any = obj;
    const fullpath: string = varname;
    const tokens: string[] = varname.split('.'); // varname.split(/\.,/);
    const ret: {token: string, value: any}[] = [];
    let j;
    let token: string = null;
    for (j = 0; j < tokens.length; j++) {
      ret.push({token: token === null ? 'this' : token, value: requestedValue});
      token = tokens[j];
      U.pif(debug || showErrors, 'replacer: obj[req] = ', requestedValue, '[', token, '] =', (requestedValue ? requestedValue[token] : ''));
      if (requestedValue === null || requestedValue === undefined) {
        U.pe(showErrors, 'requested null or undefined:', obj, ', canthrow ? ', canThrow, ', fillplath:', fullpath);
        if (canThrow) {
          U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. object = ', obj);
          throw new DOMException('replace_Vars.WrongVariablePath', 'replace_Vars.WrongVariablePath');
        } else {
          U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. ovjet = ', obj);
        }

        ret.push({token: token, value: 'Error: ' + debugPathOk + '.' + token + ' = ' + undefined});
        // ret.push({token: token, value: requestedValue});
        return ret;
      } else { debugPathOk += (debugPathOk === '' ? '' : '.') + token; }
      ////
      if (requestedValue instanceof ModelPiece) {
        const info: any = requestedValue.getInfo(true);
        const key = token.toLowerCase();
        if (key in info) { requestedValue = info[key]; } else { requestedValue = requestedValue[token]; }
      } else { requestedValue = (requestedValue === null) ? undefined : requestedValue[token]; }
    }

    ret.push({token: token, value: requestedValue});
    return ret; }

  static replaceSingleVar_backup(obj: object, varname: string, isBase64: boolean, canThrow: boolean = false): any {
    const debug = false;
    const showErrors = false;
    let debugPathOk = '';
    if (isBase64) { varname = atob(varname); }
    let requestedValue: any = obj;
    const fullpath: string = varname;
    const tokens: string[] = varname.split('.'); // varname.split(/\.,/);
    let j;
    for (j = 0; j < tokens.length; j++) {
      const token = tokens[j];
      U.pif(debug || showErrors, 'replacer: obj[req] = ', requestedValue, '[', token, '] =', (requestedValue ? requestedValue[token] : ''));

      if (requestedValue === null || requestedValue === undefined) {
        U.pe(showErrors, 'requested null or undefined:', obj, ', canthrow ? ', canThrow, ', fillplath:', fullpath);
        if (canThrow) {
          U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. object = ', obj);
          throw new DOMException('replace_Vars.WrongVariablePath', 'replace_Vars.WrongVariablePath');
        } else {
          U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. ovjet = ', obj);
        }
        return 'Error: ' + debugPathOk + '.' + token + ' = ' + undefined;
      } else { debugPathOk += (debugPathOk === '' ? '' : '.') + token; }
      ////
      if (requestedValue instanceof ModelPiece) {
        const info: any = requestedValue.getInfo(true);
        const key = token.toLowerCase();
        if (key in info) { requestedValue = info[key]; } else { requestedValue = requestedValue[token]; }
      } else { requestedValue = (requestedValue === null) ? undefined : requestedValue[token]; }
    }
    return requestedValue; }

  static changeVarTemplateDelimitersInMeasurables(innerText: string, toReplace: string = '$', replacement = '£'): string {
    if (!innerText.indexOf('measurable')) { return innerText; } // + performance su scommessa probabilistica. better avg, worser worst case.
    const html = document.createElement('div');
    html.innerHTML = innerText;
    const $measurables = $(html).find('.measurable');
    let i: number;
    let j: number;
    for (i = 0; i < $measurables.length; i++) {
      for (j = 0; j < $measurables[i].attributes.length; j++) {
        if($measurables[i].attributes[j].name[0] !== '_') { continue; }
        U.changeVarTemplateDelimitersInMeasurablesAttr($measurables[i].attributes[j], toReplace, replacement); } }
    return html.innerHTML; }

  static changeBackVarTemplateDelimitersInMeasurablesAttr(attrVal: string, toReplace: string = '£', replacement = '$'): string {
    return U.changeVarTemplateDelimitersInMeasurablesAttrStr(attrVal, toReplace, replacement); }

  private static changeVarTemplateDelimitersInMeasurablesAttr(attr: Attr, toReplace: string = '$', replacement = '£'): void {
    attr.value = U.changeVarTemplateDelimitersInMeasurablesAttrStr(attr.value, toReplace, replacement); }

  private static changeVarTemplateDelimitersInMeasurablesAttrStr(val: string, toReplace: string, replacement: string): string {
    const r = toReplace;
    const rstr = '(^\\' + r + '|(((?!\\' + r + ').|^))[\\' + r + '](?!\\' + r + '))(.*?)(^\\' + r + '|((?!\\' + r + ').|^)[\\' + r + '](?!\\' + r + '))';
    return val.replace(new RegExp(rstr, 'gm'), (match: string, capture) => {
      if (match === toReplace) { return toReplace; }
      let prefixError = '';
      if (match.charAt(0) !== toReplace) {
        prefixError = match.charAt(0);
        match = match.substring(1); }
      return prefixError + replacement + match.substring(1, match.length - 1) + replacement;
    }); }

  static sizeof<T extends HTMLElement | SVGElement>(element: T, debug: boolean = false): Size {
    U.pif(debug, 'sizeof(', element, ')');
    U.pe(element as any === document, 'trying to measure document.');
    if (element as any === document) { element = document.body as any; }
    const $element = $(element);
    U.pe(element.tagName === 'foreignObject', 'SvgForeignElementObject have a bug with size, measure a child instead.');
    let i;
    let tmp;
    let size: Size;
    if (!U.sizeofvar) {
      U.sizeofvar = document.createElement('div');
      document.body.append(U.sizeofvar); }

    const isOrphan = element.parentNode === null;
    // var visible = element.style.display !== 'none';
    // var visible = $element.is(":visible"); crea bug quando un elemento è teoricamente visibile ma orfano
    const ancestors = U.ancestorArray(element);
    const visibile = [];
    if (isOrphan) { U.sizeofvar.append(element); }
    // show all and saveToDB visibility to restore it later
    for (i = 0; i < ancestors.length; i++) { // document has undefined style
      visibile[i] = (ancestors[i].style === undefined) ? (true) : (ancestors[i].style.display !== 'none');
      if (!visibile[i]) {
        $(ancestors[i]).show();
      }
    }
    tmp = $element.offset();
    size = new Size(tmp.left, tmp.top, 0, 0);
    tmp = element.getBoundingClientRect();
    size.w = tmp.width;
    size.h = tmp.height;
    // restore visibility
    for (i = 0; i < ancestors.length; i++) {
      if (!visibile[i]) {
        $(ancestors[i]).hide();
      }
    }
    if (isOrphan) { U.clear(U.sizeofvar); }
    // Status.status.getActiveModel().graph.markS(size, false);
    return size;
  }

  /* ritorna un array con tutti i figli, nipoti... discendenti di @parent */
  static iterateDescendents(parent) {
    return parent.getElementsByTagName('*');
  }

  static ancestorArray<T extends HTMLElement | SVGElement>(domelem: T): Array<T> {
    // [0]=element, [1]=father, [2]=grandfather... [n]=document
    if (domelem === null || domelem === undefined) { return []; }
    const arr = [domelem];
    let tmp: T = domelem.parentNode as T;
    while (tmp !== null) {
      arr.push(tmp);
      tmp = tmp.parentNode as T; }
    return arr;
  }

  static toSvg<T>(html: string): T {
    U.pe(true, 'toSvg maybe not working, test before use');
    const o: SVGElement = U.newSvg<SVGElement>('svg');
    o.innerHTML = html;
    return o.firstChild as unknown as T;
  }

  static toHtmlRow(html: string): HTMLTableRowElement {
    return U.toHtml<HTMLTableRowElement>(html, U.toHtml('<table><tbody></tbody></table>').firstChild as HTMLElement);
  }

  static toHtmlCell(html: string): HTMLTableCellElement {
    return U.toHtml<HTMLTableCellElement>(html, U.toHtml('<table><tbody><tr></tr></tbody></table>').firstChild.firstChild as HTMLElement);
  }

  static toHtml<T extends Element>(html: string, container: HTMLElement | SVGElement = null, containerTag: string = 'div'): T {
    if (container === null) { container = document.createElement(containerTag); }
    container.innerHTML = html;
    const ret: T = container.firstChild as any;
    container.removeChild(ret);
    return ret; }

  static toBase64Image(html: Element, container: Element = null, containerTag: string = 'div'): string {
    // https://github.com/tsayen/dom-to-image
    return 'HtmlToImage todo: check https://github.com/tsayen/dom-to-image';
  }


  /**
   * checks if nodes have a vertical line relationship in the tree (parent, grandparent, ...);
   * @ return {boolean}
   */
  static isParentOf(parent: HTMLElement | SVGElement, child: HTMLElement | SVGElement): boolean {
    //  parent chains:   element -> ... -> body -> html -> document -> null
    while (child !== null) {
      if (parent === child) { return true; }
      child = child.parentNode as HTMLElement | SVGElement;
    }
    return false;
  }

  static isChildrenOf(child: HTMLElement | SVGElement, parent: HTMLElement | SVGElement) {
    return U.isParentOf(parent, child); }

  static setSvgSize(style: SVGElement, size: GraphSize, defaultsize: GraphSize): GraphSize {
    if (!style) return;
    if (size) { size = size.duplicate(); } else { size = defaultsize.duplicate(); defaultsize = null; }
    if (!U.isNumber(size.x)) {
      U.pw(true, 'VertexSize Svg x attribute is NaN: ' + size.x + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.x));
      U.pe(!defaultsize || !U.isNumber(defaultsize.x), 'Both size and defaultsize are null.', size, defaultsize, style);
      size.x = defaultsize.x; }
    if (!U.isNumber(size.y)) {
      U.pw(true, 'VertexSize Svg y attribute is NaN: ' + size.y + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.y));
      U.pe(!defaultsize || !U.isNumber(defaultsize.y), 'Both size and defaultsize are null.', size, defaultsize, style);
      size.y = defaultsize.y; }
    if (!U.isNumber(size.w)) {
      U.pw(true, 'VertexSize Svg w attribute is NaN: ' + size.w + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.w));
      U.pe(!defaultsize || !U.isNumber(defaultsize.w), 'Both size and defaultsize are null.', size, defaultsize, style);
      size.w = defaultsize.w; }
    if (!U.isNumber(size.h)) {
      U.pw(true, 'VertexSize Svg h attribute is NaN: ' + size.h + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.h));
      U.pe(!defaultsize || !U.isNumber(defaultsize.h), 'Both size and defaultsize are null.', size, defaultsize, style);
      size.h = defaultsize.h; }
    // U.pe(true, '100!, ', size, style);
    style.setAttributeNS(null, 'x', '' + size.x);
    style.setAttributeNS(null, 'y', '' + size.y);
    style.setAttributeNS(null, 'width', '' + size.w);
    style.setAttributeNS(null, 'height', '' + size.h);
    return size; }

  static getSvgSize(elem: SVGElement, minimum: GraphSize = null, maximum: GraphSize = null): GraphSize {
    const defaults: GraphSize = new GraphSize(0, 0, 200, 99);
    const ret0: GraphSize = new GraphSize(+elem.getAttribute('x'), +elem.getAttribute('y'),
      +elem.getAttribute('width'), +elem.getAttribute('height'));
    const ret: GraphSize = ret0.duplicate();
    if (!U.isNumber(ret.x)) {
      U.pw(true, 'Svg x attribute is NaN: ' + elem.getAttribute('x') + ' will be set to default: ' + defaults.x);
      ret.x = defaults.x; }
    if (!U.isNumber(ret.y)) {
      U.pw(true, 'Svg y attribute is NaN: ' + elem.getAttribute('y') + ' will be set to default: ' + defaults.y);
      ret.y = defaults.y; }
    if (!U.isNumber(ret.w)) {
      U.pw(true, 'Svg w attribute is NaN: ' + elem.getAttribute('width') + ' will be set to default: ' + defaults.w);
      ret.w = defaults.w; }
    if (!U.isNumber(ret.h)) {
      U.pw(true, 'Svg h attribute is NaN: ' + elem.getAttribute('height') + ' will be set to default: ' + defaults.h);
      ret.h = defaults.h; }
    if (minimum) {
      if (U.isNumber(minimum.x) && ret.x < minimum.x) { ret.x = minimum.x; }
      if (U.isNumber(minimum.y) && ret.y < minimum.y) { ret.y = minimum.y; }
      if (U.isNumber(minimum.w) && ret.w < minimum.w) { ret.w = minimum.w; }
      if (U.isNumber(minimum.h) && ret.h < minimum.h) { ret.h = minimum.h; } }
    if (maximum) {
      if (U.isNumber(maximum.x) && ret.x > maximum.x) { ret.x = maximum.x; }
      if (U.isNumber(maximum.y) && ret.y > maximum.y) { ret.y = maximum.y; }
      if (U.isNumber(maximum.w) && ret.w > maximum.w) { ret.w = maximum.w; }
      if (U.isNumber(maximum.h) && ret.h > maximum.h) { ret.h = maximum.h; } }
    if (!ret.equals(ret0)) { U.setSvgSize(elem, ret, null); }
    return ret; }

  static findMetaParent<ParentT extends ModelPiece, childT extends ModelPiece>(parent: ParentT, childJson: Json, canFail: boolean, debug: boolean = true): childT {
    const modelRoot: IModel = parent.getModelRoot();
    // instanceof crasha non so perchè, dà undefined constructor quando non lo è.
    if (U.getClass(modelRoot) === 'MetaMetaModel') { U.pif(debug, 'return null;'); return null; }
    if (U.getClass(modelRoot) === 'MetaModel') { U.pif(debug, 'return null;'); return null; } // potrei ripensarci e collegarlo a m3
    // todo: risolvi bene e capisci che collegamento deve esserci tra mmpackage e mpackage.
    // fix temporaneo: così però consento di avere un solo package.
    if (U.getClass(modelRoot) === 'Model' && U.getClass(parent) === 'Model') {
      U.pif(debug, 'return: ', parent.metaParent.childrens[0] as childT);
      return parent.metaParent.childrens[0] as childT; }
    // if (modelRoot === Status.status.mmm || !Status.status.mmm && modelRoot instanceof MetaMetaModel) { return null; }
    // if (modelRoot === Status.status.mm) { return null; }
    const ParentMetaParent: ParentT = parent.metaParent as ParentT;
    const metaParentName = Json.read<string>(childJson, XMIModel.namee, null);
    // U.pe(!metaParentName, 'type not found.', childJson);
    let i;
    let ret: childT = null;
    U.pif(debug, 'finding metaparent of:', childJson, 'parent:', parent, 'parent.metaparent:', ParentMetaParent,
      'childrens:', ParentMetaParent ? ParentMetaParent.childrens : 'null parent');
    for (i = 0; i < ParentMetaParent.childrens.length; i++) {
      const metaVersionCandidate = ParentMetaParent.childrens[i];
      const candidateName = metaVersionCandidate.name;
      U.pif(debug, 'check[' + i + '/' + ParentMetaParent.childrens.length + '] ' + candidateName + ' =?= ' + metaParentName + ' ? ' +
        (candidateName === metaParentName));
      // console.log('is metaparent? of:', metaParentName, ' === ', candidateName, ' ? ', candidateName === metaParentName);
      if (candidateName === metaParentName) {
        ret = metaVersionCandidate as childT;
        break;
      }
    }
    U.pif(debug, 'return: ', ret);
    U.pe(ret == null && !canFail, 'metaParent not found. metaParentParent:', ParentMetaParent,
      'metaParentName:', metaParentName, 'parent:', parent, 'json:', childJson);
    // console.log('findMetaParent of:', childJson, ' using parent:', parent, ' = ', ret);
    return ret; }

  /*
    static findMetaParentP(parent: IModel, childJson: Json, canFail: boolean = true): IPackage {
      return U.findMetaParent<IModel, IPackage>(parent, childJson, canFail);
    }

    static findMetaParentC(parent: IPackage, childJson: Json, canFail: boolean = true): M2Class {
      return U.findMetaParent<IPackage, M2Class>(parent, childJson, canFail);
    }

    static findMetaParentA(prnt: M2Class, childJ: Json, canFail: boolean = true): IAttribute {
      return U.findMetaParent<M2Class, IAttribute>(prnt, childJ, canFail);
    }

    static findMetaParentR(prnt: M2Class, childJ: Json, canFail: boolean = true): IReference {
      return U.findMetaParent<M2Class, IReference>(prnt, childJ, canFail);
    }
  */
  static arrayRemoveAll<T>(arr: Array<T>, elem: T, debug: boolean = false): void {
    let index;
    while (true) {
      index = arr.indexOf(elem);
      U.pif (debug, 'ArrayRemoveAll: index: ', index, '; arr:', arr, '; elem:', elem);
      if (index === -1) { return; }
      arr.splice(index, 1);
      U.pif (debug, 'ArrayRemoveAll RemovedOne:', arr);
    }
  }

  static eventiDaAggiungereAlBody(selecteds: string) {
    // todo: guarda gli invocatori
  }

  static isOnEdge(pt: GraphPoint, shape: GraphSize): boolean {
    return U.isOnHorizontalEdges(pt, shape) || U.isOnVerticalEdges(pt, shape); }

  static isOnVerticalEdges(pt: GraphPoint, shape: GraphSize): boolean {
    return U.isOnLeftEdge(pt, shape) || U.isOnRightEdge(pt, shape); }

  static isOnHorizontalEdges(pt: GraphPoint, shape: GraphSize): boolean {
    return U.isOnTopEdge(pt, shape) || U.isOnBottomEdge(pt, shape); }

  static isOnRightEdge(pt: GraphPoint, shape: GraphSize): boolean {
    if (!pt || !shape) { return null; }
    return (pt.x === shape.x + shape.w) && (pt.y >= shape.y && pt.y <= shape.y + shape.h);
  }

  static isOnLeftEdge(pt: GraphPoint, shape: GraphSize): boolean {
    if (!pt || !shape) { return null; }
    return (pt.x === shape.x) && (pt.y >= shape.y && pt.y <= shape.y + shape.h);
  }

  static isOnTopEdge(pt: GraphPoint, shape: GraphSize): boolean {
    if (!pt || !shape) { return null; }
    return (pt.y === shape.y) && (pt.x >= shape.x && pt.x <= shape.x + shape.w);
  }

  static isOnBottomEdge(pt: GraphPoint, shape: GraphSize): boolean {
    if (!pt || !shape) { return null; }
    return (pt.y === shape.y + shape.h) && (pt.x >= shape.x && pt.x <= shape.x + shape.w);
  }
  // usage: var scope1 = makeEvalContext("variable declariation list"); scope1("another eval like: x *=3;");
  // remarks: variable can be declared only on the first call, further calls on a created context can only modify the context without expanding it.

  static makeEvalContext(declarations: string): (exp: string) => any {
    eval(declarations);
    return (str) => eval(str); }

  // same as above, but with dynamic context, although it's only extensible manually and not by the eval code itself.
  static evalInContext(context, js): any {
    let value;
    try { // for expressions
      value = eval('with(context) { ' + js + ' }');
    } catch (e) {
      if (e instanceof SyntaxError) {
        //try { // for statements
        value = (new Function('with(this) { ' + js + ' }')).call(context);
        //} catch (e) { U.pw(true, 'error evaluating')}
      }
    }
    return value; }

  static multiReplaceAllKV(a: string, kv: string[][] = []): string {
    const keys: string[] = [];
    const vals: string[] = [];
    let i: number;
    for (i = 0; i < kv.length; i++) { keys.push(kv[i][0]); vals.push(kv[i][0]); }
    return U.multiReplaceAll(a, keys, vals); }

  static multiReplaceAll(a: string, searchText: string[] = [], replacement: string[] = []): string {
    U.pe(!(searchText.length === replacement.length), 'search and replacement must be have same length:', searchText, replacement);
    let i = -1;
    while (++i < searchText.length) { a = U.replaceAll(a, searchText[i], replacement[i]); }
    return a; }
  static toFileName(a: string = 'nameless.txt'): string {
    if (!a) { a = 'nameless.txt'; }
    a = U.multiReplaceAll(a.trim(), ['\\', '//', ':', '*', '?', '<', '>', '"', '|'],
      ['[lslash]', '[rslash]', ';', '°', '_', '{', '}', '\'', '!']);
    return a; }

  static download(filename: string = 'nameless.txt', text: string = null, debug: boolean = true): void {
    if (!text) { return; }
    filename = U.toFileName(filename);
    const htmla: HTMLAnchorElement = document.createElement('a');
    const blob: Blob = new Blob([text], {type: 'text/plain', endings: 'native'});
    const blobUrl: string = URL.createObjectURL(blob);
    U.pif(debug, text + '|\r\n| <-- rn, |\n| <--n.');
    htmla.style.display = 'none';
    htmla.href = blobUrl;
    htmla.download = filename;
    document.body.appendChild(htmla);
    htmla.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(htmla); }

  /// arrotonda verso zero.
  static trunc(num: number): number {
    if (Math['trunc' + '']) {
      return Math['trunc' + ''](num);
    }
    if (Math.floor && Math.ceil) {
      return Math[num > 0 ? 'floor' : 'ceil'](num);
    }
    return Number(String(num).replace(/\..*/, ''));
  }

  static closeButtonSetup($root: JQuery<HTMLElement>, debug: boolean = false) {
    $root.find('.closeButton').off('click.closeButton').on('click.closeButton',
      (e: ClickEvent) => {
        let html: HTMLElement | SVGElement = e.target as HTMLElement | SVGElement;
        const target: string = html.dataset.closebuttontarget;
        html = html.parentNode as HTMLElement | SVGElement;
        U.pif(debug, 'html:', html, 'target:', e.target, 'targetstr:', target, 'dataset:', e.target.dataset);
        while (html && (html).dataset.closebuttontarget !== target) {
          U.pif(debug, 'html:', html, ', data:', (html).dataset.closebuttontarget, ' === ' + target);
          html = html.parentNode as HTMLElement | SVGElement;
        }
        U.pif(debug, 'html:', html);
        U.pe(!html, 'closeTarget not found: event trigger:', e.target, 'html:', html);
        $(html).hide();
      });
  }

  static insertAt(arr: any[], index: number, elem: any) {
    const oldl = arr.length;
    const ret = arr.splice(index, 0, elem);
    U.pe(oldl + 1 !== arr.length, oldl + ' --> ' + arr.length + '; arr not growing. ret:', ret, arr);
  }

  static setViewBox(svg: SVGElement, size: Size = null): void {
    if (!size) { size = new Size(); size.x = size.y = size.w = size.h = null;}
    let x = +size.x;
    let y = +size.y;
    let w = +size.w;
    let h = +size.h;
    let htmlsize: Size = null;
    if (isNaN(x)) { x = 0; }
    if (isNaN(y)) { y = 0; }
    if (isNaN(w)) { w = htmlsize ? htmlsize.w : (htmlsize = U.sizeof(svg)).w; }
    if (isNaN(h)) { h = htmlsize ? htmlsize.h : (htmlsize = U.sizeof(svg)).h; }
    svg.setAttributeNS(null, 'viewBox', x + ' ' + y + ' ' + w + ' ' + h);
  }

  static getViewBox(svg: SVGElement): Size {
    const str: string = svg.getAttributeNS(null, 'viewbox');
    if (!str) return U.sizeof(svg);
    const arr: string[] = str.split(' ');
    let vbox: Size = new Size(0, 0, 0, 0);
    if (isNaN(+arr[0])) { vbox = U.sizeof(svg); vbox.x = vbox.y = 0; return vbox; } else { vbox.x = +arr[0]; }
    if (isNaN(+arr[1])) { vbox = U.sizeof(svg); vbox.x = vbox.y = 0; return vbox; } else { vbox.y = +arr[1]; }
    if (isNaN(+arr[2])) { vbox = U.sizeof(svg); vbox.x = vbox.y = 0; return vbox; } else { vbox.w = +arr[2]; }
    if (isNaN(+arr[3])) { vbox = U.sizeof(svg); vbox.x = vbox.y = 0; return vbox; } else { vbox.h = +arr[3]; }
    return vbox; }

  static selectHtml(htmlSelect: HTMLSelectElement, optionValue: string, canFail: boolean = false) {
    const $options: JQuery<HTMLOptionElement> = $(htmlSelect).find('option') as unknown as any;
    let i: number;
    let isFound = false;
    if (optionValue === null || optionValue === undefined) { return; }
    for (i = 0; i < $options.length; i++) {
      const opt = $options[i] as HTMLOptionElement;
      if (opt.value === optionValue) { opt.selected = isFound = true; }
    }
    U.pw(!isFound, 'SelectOption not found. html:', htmlSelect, ', searchingFor: |' + optionValue + '|, in options:', $options);
    U.pe(!isFound && !canFail, 'SelectOption not found. html:', htmlSelect, ', searchingFor: |' + optionValue + '| in options:', $options);
  }

  static tabSetup(root: HTMLElement = document.body): void {
    $('.UtabHeader').off('click.tabchange').on('click.tabchange', U.tabClick);
    $('.UtabContent').hide();
    const $tabRoots = $('.UtabContainer');
    let i: number;
    for (i = 0; i < $tabRoots.length; i++) {
      const selectedStr = $tabRoots[i].dataset.selectedtab;
      const $selected = $($tabRoots[i]).find('>.UtabHeaderContainer>.UtabHeader[data-target="' + selectedStr + '"]');
      U.pe($selected.length !== 1, 'tab container must select exactly one tab. found instead: ' + $selected.length,
        'tabRoot:', $tabRoots[i], 'selector:', selectedStr);
      // console.clear(); console.log('triggered: ', $selected);
      $selected.trigger('click');
    }
/*
    U.addCss('customTabs',
      '.UtabHeaderContainer{ padding: 0; margin: 0; display: flex;}\n' +
      '.UtabContainer{\n' +
      'display: flex;\n' +
      'flex-flow: column;\n' +
      '\n}\n' +
      '.UtabHeader{\n' +
      'display: inline-block;\n' +
      'width: auto; flex-grow: 1;\n' +
      'margin: 10px;\n' +
      'margin-bottom: 0;\n' +
      'flex-basis: 0;\n' +
      'text-align: center;\n' +
      'border: 1px solid red;\n}\n' +
      '.UtabHeader+.UtabHeader{\n' +
      'margin-left:0;\n}\n' +
      '.UtabHeader[selected="true"]{\n' +
      'background-color: darkred;\n' +
      '}\n' +
      '.UtabContentContainer{\n' +
      '\n' +
      '    flex-grow: 1;\n' +
      '    flex-basis: 0;\n' +
      '    overflow: auto;' +
      '\n}\n' +
      '.UtabContent{\n' +
      'flex-grow: 1;\n' +
      // 'height: 100%;\n' +
      '\n}\n');*/
  }

  static tabClick(e: ClickEvent): void {
    let root: HTMLElement = e.currentTarget;
    const target = root.dataset.target;
    while (root && !root.classList.contains('UtabContainer')) {
      root = root.parentNode as HTMLElement;
    }
    const $root = $(root);
    const oldTarget = root.dataset.selectedtab;
    root.dataset.selectedtab = target;
    const $targethtml = $root.find('>.UtabContentContainer>.UtabContent[data-target="' + target + '"]');
    U.pe($targethtml.length !== 1, 'tab target count (' + $targethtml.length + ') is !== 1');
    const $oldTargetHtml = $root.find('>.UtabContentContainer>.UtabContent[data-target="' + oldTarget + '"]');
    U.pe($oldTargetHtml.length !== 1, 'oldTab target count (' + $oldTargetHtml.length + ') is !== 1');
    const $oldTargetHeader = $root.find('>.UtabHeaderContainer>.UtabHeader[data-target="' + oldTarget + '"]');
    U.pe($oldTargetHeader.length !== 1, 'oldTabHeader target count (' + $oldTargetHeader.length + ') is !== 1');
    const $targetHeader = $root.find('>.UtabHeaderContainer>.UtabHeader[data-target="' + target + '"]');
    U.pe($targetHeader.length !== 1, 'TabHeader target count (' + $targetHeader.length + ') is !== 1');
    if ($targethtml[0].getAttribute('selected') === 'true') {
      return;
    }
    $oldTargetHeader[0].setAttribute('selected', 'false');
    $targetHeader[0].setAttribute('selected', 'true');
    $oldTargetHtml.slideUp();
    $targethtml.slideDown();
  }

  static removeemptynodes(root: HTMLElement | SVGElement, includeNBSP: boolean = false, debug: boolean = false): HTMLElement | SVGElement {
    let n: number;
    for (n = 0; n < root.childNodes.length; n++) {
      const child: any = root.childNodes[n];
      U.pif(debug, 'removeEmptyNodes: ', child.nodeType);
      switch (child.nodeType) {
      default:
        break;
      case 1:
        U.removeemptynodes(child, includeNBSP);
        break; // node: element
      case 2:
        break; // leaf: attribute
      case 8:
        break; // leaf: comment
      case 3: // leaf: text node
        let txt = child.nodeValue;
        let i: number;
        // replacing first blanks (\n, \r, &nbsp;) with classic spaces.
        for (i = 0; i < txt.length; i++) {
          let exit: boolean = false && false;
          switch (txt[i]) {
          default: exit = true; break; // if contains non-blank is allowed to live but trimmed.
          case '&nbsp': if (includeNBSP) { txt[i] = ' '; } else { exit = true; } break;
          case ' ':
          case '\n':
          case '\r': txt[i] = ' '; break; }
          if (exit) { break; }
        }
        // replacing last blanks (\n, \r, &nbsp;) with classic spaces.
        for (i = txt.length; i >= 0; i--) {
          let exit: boolean = false && false;
          switch (txt[i]) {
          default: exit = true; break; // if contains non-blank is allowed to live but trimmed.
          case '&nbsp': if (includeNBSP) { txt[i] = ' '; } else { exit = true; } break;
          case ' ':
          case '\n':
          case '\r': txt[i] = ' '; break; }
          if (exit) { break; }
        }
        txt = txt.trim();
        U.pif(debug, 'txt: |' + root.nodeValue + '| --> |' + txt + '| delete?', (/^[\n\r ]*$/g.test(txt)));
        if (txt === '') { root.removeChild(child); n--; } else { root.nodeValue = txt; }
        break;
      }
    }
    return root; }

  static replaceAll(str: string, searchText: string, replacement: string, debug: boolean = false, warn: boolean = true): string {
    if (!str) { return str; }
    return str.split(searchText).join(replacement);
    let lastPos = 0;
    if (searchText === replacement) {
      U.pw(warn, 'replaceAll invalid parameters: search text === replacement === ' + replacement);
      return str; }
    U.pif(debug, 'replaceAll(', searchText, ' with ', replacement, ') starting str:', searchText);
    while (str.indexOf(searchText, lastPos)) {
      const old = searchText;
      const lastPosOld = lastPos;
      searchText = searchText.substring(0, lastPos) + replacement + searchText.substring(lastPos + searchText.length);
      lastPos = lastPos + replacement.length;
      U.pif(debug, 'replaceAll() ', old, ' => ', searchText, '; lastpos:' + lastPosOld + ' => ', lastPos);
    }
    return str;
  }

  static isValidHtml(htmlStr: string, debug: boolean = false ): boolean {
    const div = document.createElement('div');
    if (!htmlStr) { return false; }
    div.innerHTML = htmlStr;
    // if (div.innerHTML === htmlStr) { return true; }
    const s2 = U.multiReplaceAll(div.innerHTML, [' ', ' ', '\n', '\r'], ['', '', '', '']);
    const s1 = U.multiReplaceAll(htmlStr, [' ', ' ', '\n', '\r'], ['', '', '', '']);
    const ret: boolean = s1 === s2;
    if (ret || !debug) { return ret; }
    const tmp: string[] = U.strFirstDiff(s1, s2, 20);
    U.pif(debug, 'isValidHtml() ' + (tmp ? '|' + tmp[0] + '| vs |' + tmp[1] + '|' : 'tmp === null'));
    return ret; }

  static getIndex(node: Element): number {
    if (!node.parentElement) { return -1; }
    // return U.toArray(node.parentElement.children).indexOf(node);
    return Array.prototype.indexOf.call(node.parentElement.children, this); }

  static toArray(childNodes: NodeListOf<ChildNode>): ChildNode[] {
    if (Array['' + 'from']) { return Array['' + 'from'](childNodes); }
    const array: ChildNode[] = [];
    let i = -1;
    while (++i < childNodes.length) { array.push(childNodes[i]); }
    return array; }

  static getClass(obj: object): string { return (obj as any).__proto__.constructor.name; }

  static isString(elem: any) { return elem + '' === elem; }

  static permuteV2(input: any[]): any[][] {
    U.PermuteArr = [];
    U.PermuteUsedChars = [];
    return U.permute0V2(input); }

  private static permute0V2(input: any[]): any[][] {
    let i;
    let ch;
    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      U.PermuteUsedChars.push(ch);
      if (input.length === 0) {
        U.PermuteArr.push(U.PermuteUsedChars.slice());
      }
      U.permute0V2(input);
      input.splice(i, 0, ch);
      U.PermuteUsedChars.pop();
    }
    return U.PermuteArr; }

  static permute(inputArr: any[], debug: boolean = true): any[][] {
    const results: any[][] = [];
    const permuteInner = (arr: any[], memo: any[] = []) => {
      let cur;
      let i: number;
      for (i = 0; i < arr.length; i++) {
        cur = arr.splice(i, 1);
        if (arr.length === 0) { results.push(memo.concat(cur)); }
        permuteInner(arr.slice(), memo.concat(cur));
        arr.splice(i, 0, cur[0]);
      }
      return results; };
    return permuteInner(inputArr); }

  static resizableBorderMouseDblClick(e: MouseDownEvent): void {
    const size: Size = U.sizeof(U.resizingContainer);
    const minSize: Size = U.sizeof(U.resizingBorder);
    const oldSize: Size = new Size(0, 0, +U.resizingContainer.dataset.oldsizew, +U.resizingContainer.dataset.oldsizeh);
    const horiz: boolean = U.resizingBorder.classList.contains('left') || U.resizingBorder.classList.contains('right');
    const vertic: boolean = U.resizingBorder.classList.contains('top') || U.resizingBorder.classList.contains('bottom');
    if (horiz && vertic) return; // do nothing on corner, non voglio che venga resizato sia a minheight che a minwidth, solo uno dei 2.
    minSize.w *= horiz ? 2 : 1;
    minSize.h *= vertic ? 2 : 1;
    minSize.x = size.x;
    minSize.y = size.y;
    console.log('old, size, min', oldSize, size, minSize, oldSize.w && size.equals(minSize));
    if (oldSize.w && size.equals(minSize)) {
      U.resizingContainer.style.width = U.resizingContainer.style.minWidth = U.resizingContainer.style.maxWidth = oldSize.w + 'px';
      U.resizingContainer.style.height = U.resizingContainer.style.minHeight = U.resizingContainer.style.maxHeight = oldSize.h + 'px'; }
    else {
      U.resizingContainer.style.width = U.resizingContainer.style.minWidth = U.resizingContainer.style.maxWidth = minSize.w + 'px';
      U.resizingContainer.style.height = U.resizingContainer.style.minHeight = U.resizingContainer.style.maxHeight = minSize.h + 'px';
      U.resizingContainer.dataset.oldsizew = '' + size.w;
      U.resizingContainer.dataset.oldsizeh = '' + size.h; }
  }

  static resizableBorderMouseDown(e: MouseDownEvent): void {
    U.resizingBorder = e.currentTarget;
    U.resizingContainer = U.resizingBorder;
    U.resizingContainer.style.padding = '0';
    U.resizingContainer.style.flexBasis = '0';
    // U.resizingContent.style.width = '100%'; required too
    while (!U.resizingContainer.classList.contains('resizableBorderContainer')) {
      U.resizingContainer = U.resizingContainer.parentNode as HTMLElement; }
    if (U.checkDblClick()) U.resizableBorderMouseDblClick(e); }

  static resizableBorderMouseUp(e: MouseDownEvent): void { U.resizingBorder = U.resizingContainer = null; }
  static resizableBorderUnset(e: ContextMenuEvent): void {
    e.preventDefault();
    const border: HTMLElement = e.currentTarget;
    let container: HTMLElement = border;
    while (container.classList.contains('resizableBorderContainer')) { container = container.parentNode as HTMLElement; }
    container.style.flexBasis = '';
    container.style.minHeight = container.style.minWidth =
    container.style.maxHeight = container.style.maxWidth =
    container.style.height = container.style.width = ''; }

  static resizableBorderMouseMove(e: MouseDownEvent): void {
    if (!U.resizingBorder) { return; }
    const size: Size = U.sizeof(U.resizingContainer);
    const missing: Point = new Point(0, 0);
    const cursor: Point = new Point(e.pageX, e.pageY);
    const puntoDaFarCoinciderePT: Point = cursor.clone();
    const l: boolean = U.resizingBorder.classList.contains('left');
    const r: boolean = U.resizingBorder.classList.contains('right');
    const t: boolean = U.resizingBorder.classList.contains('top');
    const b: boolean = U.resizingBorder.classList.contains('bottom');
    if (l) { puntoDaFarCoinciderePT.x = size.x; }
    if (r) { puntoDaFarCoinciderePT.x = size.x + size.w; }
    if (t) { puntoDaFarCoinciderePT.y = size.y; }
    if (b) { puntoDaFarCoinciderePT.y = size.y + size.h; }
    const add: Point = cursor.subtract(puntoDaFarCoinciderePT, true);
    if (l) { add.x *= -1; }
    if (t) { add.y *= -1; }
    // o = p0 - c
    // p = c
    // c = p0-o
    // console.log('lrtb: ', l, r, t, b);
    // console.log('ptcoinc: ', puntoDaFarCoinciderePT, ' cursor:', cursor, ' size:', size, 'adjust:', add);
    size.w += add.x;
    size.h += add.y;
    const borderSize: Size = U.sizeof(U.resizingBorder);
    if (l || r) { size.w = Math.max(size.w, borderSize.w * 2); }
    if (t || b) { size.h = Math.max(size.h, borderSize.h * 2); }
    U.resizingContainer.style.width = U.resizingContainer.style.maxWidth = U.resizingContainer.style.minWidth = (size.w) + 'px';
    U.resizingContainer.style.height = U.resizingContainer.style.maxHeight = U.resizingContainer.style.minHeight = (size.h) + 'px';
    // console.log('result:' + U.resizingContainer.style.width);
    U.resizingContainer.style.flexBasis = 'unset'; }

  static resizableBorderSetup(root: HTMLElement = document.body): void {
    // todo: addBack is great, aggiungilo tipo ovunque. find() esclude l'elemento radice anche se matcha la query, addback rimedia aggiungendo il
    //  previous matched set che matcha la condizione.
    const $arr = $(root).find('.resizableBorder').addBack('.resizableBorder');
    let i = -1;
    const nl = '\n';
    while (++i < $arr.length) {
      U.makeResizableBorder($arr[i]); }
    U.eventiDaAggiungereAlBody(null);
    $(document.body).off('mousemove.ResizableBorder').on('mousemove.ResizableBorder', U.resizableBorderMouseMove);
    $(document.body).off('mouseup.ResizableBorder').on('mouseup.ResizableBorder', U.resizableBorderMouseUp);
    $('.resizableBorder.corner').off('mousedown.ResizableBorder').on('mousedown.ResizableBorder', U.resizableBorderMouseDown)
      .off('contextmenu.ResizableBorder').on('contextmenu.ResizableBorder', U.resizableBorderUnset);
    $('.resizableBorder.side').off('mousedown.ResizableBorder').on('mousedown.ResizableBorder', U.resizableBorderMouseDown)
      .off('contextmenu.ResizableBorder').on('contextmenu.ResizableBorder', U.resizableBorderUnset);
    return; }

  static makeResizableBorder(html: HTMLElement, left: boolean = true, top: boolean = true, right: boolean = true, bottom = true): void {
    // if (!html.classList.contains('resizableBorderContainer')) { html.classList.add('resizableBorderContainer'); }
    let container: HTMLElement = null;
    let content: HTMLElement = null;
    if (false && html.children.length === 9 && html.children[4].classList.contains('resizableContent')) {
      // already initialized.
      container = html;
      content = container.children[4] as HTMLElement;
      U.clear(container);
    } else {
      // first run: initialing now.
      // const tmpNode: HTMLElement = document.createElement('div');
      // while (html.firstChild) { tmpNode.appendChild(html.firstChild); }
      // while (tmpNode.firstChild) { content.appendChild(tmpNode.firstChild); }
      content = html;
      container = U.cloneHtml(html, false);
      html.setAttribute('original', 'true');
      while (container.classList.length > 0) { container.classList.remove(container.classList.item(0)); }
    }
    console.log('container:', container, 'content:', content);
    U.pe(container.children.length !== 0, '');
    // U.copyStyle(html, container);
    html.parentNode.insertBefore(container, html);
    content.classList.remove('resizableBorderContainer');
    content.classList.add('resizableContent');
    container.classList.add('resizableBorderContainer');
    if (left) { html.dataset.resizableleft = 'true'; }
    if (right) { html.dataset.resizableright = 'true'; }
    if (top) { html.dataset.resizabletop = 'true'; }
    if (bottom) { html.dataset.resizablebottom = 'true'; }

    left = html.dataset.resizableleft === 'true';
    right = html.dataset.resizableright === 'true';
    top = html.dataset.resizabletop === 'true';
    bottom = html.dataset.resizablebottom === 'true';

    // const size: Size = U.sizeof(html);
    // container.style.width = size.w + 'px';
    // container.style.height = size.h + 'px';
    const l: HTMLElement = U.toHtml('<div class="resizableBorder side left"></div>');
    const r: HTMLElement = U.toHtml('<div class="resizableBorder side right"></div>');
    const t: HTMLElement = U.toHtml('<div class="resizableBorder side top"></div>');
    const b: HTMLElement = U.toHtml('<div class="resizableBorder side bottom"></div>');
    const tl: HTMLElement = U.toHtml('<div class="resizableBorder corner top left"></div>');
    const tr: HTMLElement = U.toHtml('<div class="resizableBorder corner top right"></div>');
    const bl: HTMLElement = U.toHtml('<div class="resizableBorder corner bottom left"></div>');
    const br: HTMLElement = U.toHtml('<div class="resizableBorder corner bottom right"></div>');
    const hstripT: HTMLElement = U.toHtml('<div class="resizableStrip up"></div>');
    const hstripM: HTMLElement = U.toHtml('<div class="resizableStrip center"></div>');
    const hstripB: HTMLElement = U.toHtml('<div class="resizableStrip down"></div>');
    l.dataset.resizeenabled = left ? 'true' : 'false';
    r.dataset.resizeenabled = right ? 'true' : 'false';
    t.dataset.resizeenabled = top ? 'true' : 'false';
    b.dataset.resizeenabled = bottom ? 'true' : 'false';
    tl.dataset.resizeenabled = top && left ? 'true' : 'false';
    tr.dataset.resizeenabled = top && right ? 'true' : 'false';
    bl.dataset.resizeenabled = bottom && left ? 'true' : 'false';
    br.dataset.resizeenabled = bottom && right ? 'true' : 'false';
    const style: CSSStyleDeclaration = getComputedStyle(html, null);
    // html.style.border = 'none';
    t.style.borderTop = tl.style.borderTop = tr.style.borderTop = style.borderTop;
    b.style.borderBottom = bl.style.borderBottom = br.style.borderBottom = style.borderBottom;
    l.style.borderLeft = tl.style.borderLeft = bl.style.borderLeft = style.borderLeft;
    r.style.borderRight = tr.style.borderRight = br.style.borderRight = style.borderRight;

    // per un bug lo stile viene sempre letto come "none"
    /*l.style.borderStyle = 'solid';
    r.style.borderStyle = 'solid';
    t.style.borderStyle = 'solid';
    b.style.borderStyle = 'solid';*/
    //console.log('style.border:', style.border);
    /*U.pe(t.style.borderTopStyle === 'none', '1');
    U.pe(isNaN(+t.style.borderWidth), '2');
    U.pe(+t.style.borderWidth === 0, '3');
    if (t.style.borderTopStyle === 'none' || isNaN(+t.style.borderWidth) || +t.style.borderWidth === 0) {
      t.style.borderWidth = t.style.height = t.style.width = t.style.flexGrow = '0'; }
    if (b.style.borderBottomStyle === 'none' || isNaN(+b.style.borderWidth) || +b.style.borderWidth === 0) {
      b.style.borderWidth = b.style.height = b.style.width = b.style.flexGrow = '0'; }
    if (l.style.borderLeftStyle === 'none' || isNaN(+l.style.borderWidth) || +l.style.borderWidth === 0) {
      l.style.borderWidth = l.style.height = l.style.width = l.style.flexGrow = '0'; }
    if (r.style.borderTopStyle === 'none' || isNaN(+r.style.borderWidth) || +r.style.borderWidth === 0) {
      r.style.borderWidth = r.style.height = r.style.width = r.style.flexGrow = '0'; }*/
    /*
    const borderSizeL: Size;
    const borderSizeR: Size;
    const borderSizeT: Size;
    const borderSizeB: Size;
    tl.style.width = l.style.width = bl.style.width = (borderSizeL.w) + 'px';
    tr.style.width = r.style.width = br.style.width = (borderSizeR.w) + 'px';
    tl.style.height = t.style.height = tr.style.height = (borderSizeT.h) + 'px';
    bl.style.height = b.style.height = br.style.height = (borderSizeB.h) + 'px';

    t.style.width = b.style.width = (size.w - (borderSizeL.w + borderSizeR.w)) + 'px';
    l.style.height = r.style.height = (size.h - (borderSizeT.h + borderSizeB.w)) + 'px';*/
    // html.parentNode.appendChild(container);
    hstripT.appendChild(tl);
    hstripT.appendChild(t);
    hstripT.appendChild(tr);
    hstripM.appendChild(l);
    hstripM.appendChild(content);
    hstripM.appendChild(r);
    hstripB.appendChild(bl);
    hstripB.appendChild(b);
    hstripB.appendChild(br);
    container.appendChild(hstripT);
    container.appendChild(hstripM);
    container.appendChild(hstripB);
    container.style.border = 'none';/*
    const size: Size = U.sizeof(container);
    const hbordersize = 10;
    const vbordersize = 10;
    container.style.width = Math.max(hbordersize * 2 + size.w) + 'px';
    container.style.height = Math.max(vbordersize * 2 + size.h) + 'px';*/
    content.style.border = 'none';
    if (!content.style.width || content.style.width === 'auto'){
      content.style.width = '100%';
      content.style.height = '100%'; }
    content.style.minWidth = '0';
    content.style.minHeight = '0';

  }

  static copyStyle(from: HTMLElement | SVGGElement, to: HTMLElement | SVGGElement, computedStyle: CSSStyleDeclaration = null): boolean {
    // trying to figure out which style object we need to use depense on the browser support, so we try until we have one.
    if (!computedStyle) { computedStyle = from['' + 'currentStyle'] || document.defaultView.getComputedStyle(from, null); }
    // if the browser dose not support both methods we will return failure.
    if (!computedStyle) { return false; }
    // checking that the value is not a undefined, object, function, empty or int index ( happens on some browser)
    const stylePropertyValid = (name: any, value: any) => {
      // nb: mind that typeof [] === 'object';
      return typeof value !== 'undefined' && typeof value !== 'object' && typeof value !== 'function' && value.length > 0
        // && value !== parseInt(value, 10); };
        && +name !== parseInt(name, 10); };

    let property: string;
    for (property in computedStyle) {
      // hasOwnProperty is useless, but compiler required
      // console.log('property[', property, '] = ', computedStyle[property]);
      if (!computedStyle.hasOwnProperty(property) || !stylePropertyValid(property, computedStyle[property])) { continue; }
      to.style[property] = computedStyle[property];
    }
    return true; }

  static cclear(): void { console.clear(); console.trace(); }

  static toDottedURI(uri: string): string {
    return U.replaceAll(U.replaceAll(uri.substring(uri.indexOf('://') + '://'.length), '\\', '/'), '/', '.');
  }
  static toHttpsURI(uri: string, folderChar: string = '/'): string {
    return 'https://' + U.replaceAll(uri, '.', folderChar);
  }

  static toNumber(o: any) {
    if (o === null || o === undefined || (U.isString(o) && o.trim() === '')) return null;
    o = +o;
    if (isNaN(o)) return null;
    return o; }

  static isNumber(o: any): boolean { return +o === o && o !== NaN; }
  static isNumberArray(o: any, minn: number = Number.NEGATIVE_INFINITY, max: number = Number.POSITIVE_INFINITY,
                       ifItIsEmptyArrReturn: boolean = true): boolean {
    const validation = (val: number) => U.isNumber(val) && val >= minn && val <= max;
    return U.isArrayOf(o, validation, ifItIsEmptyArrReturn); }

  static isIntegerArray(o: any, minn: number = Number.NEGATIVE_INFINITY, max: number = Number.POSITIVE_INFINITY,
                        ifItIsEmptyArrReturn: boolean = true): boolean {
    const validation = (val: number) => (U.isNumber(val) && Math.floor(val) === val && val >= minn && val <= max);
    return U.isArrayOf(o, validation, ifItIsEmptyArrReturn); }

  static isCharArray(values: any, ifItIsEmpryArrayReturn: boolean = true): boolean {
    const charValidator = (val: string) => (val.length === 1);
    return U.isArrayOf(values, charValidator, ifItIsEmpryArrayReturn); }
  static isArrayOf(value: any, functionCheck: any, ifItIsEmptyArrayReturn: boolean = true): boolean {
    if (!Array.isArray(value)) { return false; }
    let i: number;
    if (value.length === 0) { return ifItIsEmptyArrayReturn; }
    for (i = 0; i < value.length; i++) {
      if (!functionCheck(value[i]) && !U.isArrayOf(value[i], functionCheck, ifItIsEmptyArrayReturn)) { return false; }
    }
    return true; }


  static isStringArray(value: any, ifItIsEmptyArrayReturn: boolean = true): boolean {
    if (!Array.isArray(value)) { return false; }
    let i: number;
    if (value.length === 0) { return ifItIsEmptyArrayReturn; }
    for (i = 0; i < value.length; i++) { if (!U.isString(value[i]) && !U.isStringArray(value[i], true)) { return false; } }
    return true; }

  static clipboardCopy(text: string): void {
    if (!U.clipboardinput) {
      U.clipboardinput = document.createElement('input');
      U.clipboardinput.id = U.prefix + 'CopyDataToClipboard';
      U.clipboardinput.type = 'text';
      U.clipboardinput.style.display = 'block';
      U.clipboardinput.style.position = 'absolute';
      U.clipboardinput.style.top = '-100vh'; }
    document.body.appendChild(U.clipboardinput);
    U.clipboardinput.value = text;
    U.clipboardinput.select();
    document.execCommand('copy');
    document.body.removeChild(U.clipboardinput);
    U.clearSelection(); }

  static clearSelection() {}

  static refreshPage(): void { window.location.href += ''; }


  static isArray(v: any): boolean { return Array.isArray(v); }

  static isEmptyObject(v: any, returnIfNull: boolean = true, returnIfUndefined: boolean = false): boolean {
    return U.isObject(v, returnIfNull, returnIfUndefined) && $.isEmptyObject(v); }

  static isObject(v: any, returnIfNull: boolean = true, returnIfUndefined: boolean = false, retIfArray: boolean = false): boolean {
    if (v === null) { return returnIfNull; }
    if (v === undefined) { return returnIfUndefined; }
    if (Array.isArray(v)) { return retIfArray; }
    // nb: mind that typeof [] === 'array'
    return typeof v === 'object'; }

  static isFunction(v: any): boolean { return (typeof v === 'function'); }

  static isPrimitive(v: any, returnIfNull: boolean = true, returnIfUndefined: boolean = true): boolean {
    if (v === null) { return returnIfNull; }
    if (v === undefined) { return returnIfUndefined; }
    // return (typeof v !== 'function') && (typeof v !== 'object') && (!U.isArray(v));
    return !U.isObject(v) && !Array.isArray(v) && !U.isFunction(v); }

  static getEndingNumber(s: string, ignoreNonNumbers: boolean = false, allowDecimal: boolean = false): number {
    let i = s.length;
    let numberEnd = -1;
    while (--i > 0) {
      if (!isNaN(+s[i])) { if (numberEnd === -1) { numberEnd = i; } continue; }
      if (s[i] === '.' && !allowDecimal) { break; }
      if (s[i] === '.') { allowDecimal = false; continue; }
      if (!ignoreNonNumbers) { break; }
      if (numberEnd !== -1) { ignoreNonNumbers = false; }
    }
    s = numberEnd === -1 ? '1' : s.substring(i, numberEnd);
    return +parseFloat(s); }

  static increaseEndingNumber(s: string, allowLastNonNumberChars: boolean = false, allowDecimal: boolean = false, increaseWhile: (x: string) => boolean = null): string {
    /*let i = s.length;
    let numberEnd = -1;
    while (--i > 0) {
      if (!isNaN(+s[i])) { if (numberEnd === -1) { numberEnd = i; } continue; }
      if (s[i] === '.' && !allowDecimal) { break; }
      if (s[i] === '.') { allowDecimal = false; continue; }
      if (!ignoreNonNumbers) { break; }
      if (numberEnd !== -1) { ignoreNonNumbers = false; }
    }
    if (numberEnd === -1) { return s + '_1'; }
    // i++;
    numberEnd++;*/
    let regexpstr = '([0-9]+' + (allowDecimal ? '|[0-9]+\\.[0-9]+' : '') + ')' + (allowLastNonNumberChars ? '[^0-9]*' : '') + '$';
    const matches: RegExpExecArray = new RegExp(regexpstr, 'g').exec(s); // Global (return multi-match) Single line (. matches \n).
    // S flag removed for browser support (firefox), should work anyway.
    U.pe(matches.length > 2, 'parsing error: /' + regexpstr + '/gs.match(' + s + ')');
    let i = s.length - matches[0].length;
    const prefix = s.substring(0, i);
    let num: number = 1 + (+matches[1]);
    // U.pe(isNaN(num), 'wrong parsing:', s, s.substring(i, numberEnd), i, numberEnd);
    // const prefix: string = s.substring(0, i);
    // console.log('increaseendingNumber:  prefix: |' + prefix+'| num:'+num, '[i] = ['+i+']; s: |'+s+"|");
    while (increaseWhile !== null && increaseWhile(prefix + num)) { num++; }
    return prefix + num; }

  static isValidName(name: string): boolean { return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name); }

  static getTSClassName(thing: any): string { return thing.constructor.name + ''; }

  static detailButtonSetup($root = null): void {
    if (!$root) $root = $(document.body);
    $root.find('button.detail').off('click.detailbutton').on('click.detailbutton', (e: ClickEvent, forceHide: boolean) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const $btn = $(btn);
      const $detailPanel = $root.find(btn.getAttribute('target'));
      const otherButtons: HTMLButtonElement[] = $(btn.parentElement).find('button.detail').toArray().filter(x => x != btn) as any;
      // $styleown.find('div.detail:not(' + btn.getAttribute('target') + ')');

      const b: boolean = btn.dataset.on === '1';
      if (forceHide || b) {
        btn.style.width = '';
        btn.dataset.on = '0';
        btn.style.borderBottom = '';
        btn.style.borderBottomLeftRadius = '';
        btn.style.borderBottomRightRadius = '';
        $btn.find('.closed').show();
        $btn.find('.opened').hide();
        // $detailcontainers.show();
        $detailPanel.hide();
      } else {
        const size: Size = U.sizeof(btn);
        btn.style.width = size.w + 'px';
        btn.dataset.on = '1';
        btn.style.borderBottom = 'none'; // '3px solid #252525';
        btn.style.borderBottomLeftRadius = '0';
        btn.style.borderBottomRightRadius = '0';
        $btn.find('.closed').hide();
        $btn.find('.opened').show()[0].style.width = (size.w - 15 * 2) + 'px';
        console.log('others:', otherButtons, 'me:', $btn);
        $(otherButtons).data('on', '1').trigger('click', true);
        $detailPanel.show();
      }
    });
    $root.find('div.detail').hide();
  }

  // Prevent the backspace key from navigating back.
  static preventBackSlashHistoryNavigation(event: KeyDownEvent): boolean {
    if (!event || !event.key || event.key.toLowerCase() !== 'backspace') { return true; }
    const types: string[] = ['text', 'password', 'file', 'search', 'email', 'number', 'date',
      'color', 'datetime', 'datetime-local', 'month', 'range', 'search', 'tel', 'time', 'url', 'week'];
    const srcElement: JQuery<any> = $(event['' + 'srcElement'] || event.target);
    const disabled = srcElement.prop('readonly') || srcElement.prop('disabled');
    if (!disabled) {
      if (srcElement[0].isContentEditable || srcElement.is('textarea')) { return true; }
      if (srcElement.is('input')) {
        const type = srcElement.attr('type');
        if (!type || types.indexOf(type.toLowerCase()) > -1) { return true; }
      }
    }
    event.preventDefault();
    return false; }
  // esercizio per antonella array deep copy
  /// copy all the element inside the array, eventually deep cloning but not duplicating objects or leaf elements.
  static ArrayCopy<T>(arr: Array<T>, deep: boolean): Array<T> {
    const ret: Array<T> = [];
    let i: number;
    for (i = 0; i < arr.length; i++) {
      if (deep && Array.isArray(arr[i])) {
        const tmp: Array<T> = U.ArrayCopy<T>(arr[i] as unknown as Array<T>, deep);
        ret.push(tmp as unknown as T); } else { ret.push(arr[i]); }
    }
    return ret; }

  static ArrayMerge(arr1: any[], arr2: any[]): void {
    if (!arr1 || !arr2) return;
    Array.prototype.push.apply(arr1, arr2); }

  static ArrayMergeUnique(arr1: any[], arr2: any[]): void {
    if (!arr1 || !arr2) return;
    let i: number;
    for( i = 0; i < arr2.length; i++) { U.ArrayAdd(arr1, arr2[i]); } }

  static ArrayAdd<T>(arr: Array<T>, elem: T, unique: boolean = true, throwIfContained: boolean = false): boolean {
    U.pe(!arr || !Array.isArray(arr), 'arr null or not array:', arr);
    if (!unique) { arr.push(elem); return true; }
    if (arr.indexOf(elem) === -1) { arr.push(elem); return true; }
    U.pe(throwIfContained, 'element already contained:', arr, elem);
    return false; }

  static fieldCount(obj: object): number {
    let counter: number = 1 - 1;
    for (const key in obj) { if (!(key in obj)) { continue; } counter++; }
    return counter; }

  static isPositiveZero(m: number): boolean {
    if (Object['is' + '']) { return Object['is' + ''](m, +0); }
    return (1 / m === Number.POSITIVE_INFINITY); }
  static isNegativeZero(m: number): boolean {
    if (Object['is' + '']) { return Object['is' + ''](m, -0); }
    return (1 / m === Number.NEGATIVE_INFINITY); }

  static TanToRadian(n: number): number { return U.DegreeToRad(U.TanToDegree(n)); }
  static TanToDegree(n: number): number {
    if (U.isPositiveZero(n)) { return 0; }
    if (n === Number.POSITIVE_INFINITY) { return 90; }
    if (U.isNegativeZero(n)) { return 180; }
    if (n === Number.POSITIVE_INFINITY) { return 270; }
    return U.RadToDegree(Math.atan(n)); }

  static RadToDegree(radians: number): number { return radians * (180 / Math.PI); }
  static DegreeToRad(degree: number): number { return degree * (Math.PI / 180); }

  static replaceAllRegExp(value: string, regExp: RegExp, replacement: string): string { return value.replace(regExp, replacement); }

  static fixHtmlSelected($root: JQuery<Element>): void {
    const $selecteds: JQuery<HTMLSelectElement> = $root.find('select') as JQuery<HTMLSelectElement>;
    let i: number;
    for (i = 0 ; i < $selecteds.length; i++) {
      const $option: JQuery<HTMLOptionElement> = $($selecteds[i]).find('option[selected]') as any as JQuery<HTMLOptionElement>;
      U.selectHtml($selecteds[i], $option.length ? $option[0].value : null); }
  }

  static computeMeasurableAttributeRightPart(str: string, attr: Attr, logic: ModelPiece, measurableHtml: HTMLElement | SVGElement,
                                             size: Size = null, absTargetSize: Size = null, relTargetSize: Size = null, allowVariables: boolean = true): any {
    str = U.changeBackVarTemplateDelimitersInMeasurablesAttr(str);
    if (!size) { size = U.sizeof(measurableHtml); }
    let relativeRoot: HTMLElement | SVGElement = measurableHtml;
    while (!relativeRoot.classList.contains('vertexShell')) { relativeRoot = relativeRoot.parentElement; }
    if (!absTargetSize) { absTargetSize = U.sizeof(relativeRoot); }
    if (!relTargetSize) {
      const $relativeHtml = $(relativeRoot).find(measurableHtml.getAttribute('relativeSelectorOf' + attr.name));
      U.pw($relativeHtml.length > 1, 'found more than one relative target (', $relativeHtml, ') assigned to: ', measurableHtml, ' root:', relativeRoot);
      relTargetSize = $relativeHtml.length ? U.sizeof($relativeHtml[0]) : absTargetSize; }
    const relativePos: Point = size.tl().subtract(relTargetSize.tl(), false);
    const absolutePos: Point = size.tl().subtract(absTargetSize.tl(), false);
    const str0debug = str;
    str = U.replaceVarsString(logic, str);

    // ERRORE parzialmente fixato: se il relative container è la vertexRoot che ha bordo e boxsizing = border-box
    // allora this.top == absPositionY - ShellBorderY invece di this.top == absPositionY
    // consiglio generico: non usare mai position: relative su cose con i bordi o con border-box
    const rootStyle = window.getComputedStyle(relativeRoot);
    const borderFix: Point = new Point(+rootStyle.borderTopWidth, +rootStyle.borderLeftWidth);
    if (rootStyle.position === 'relative' && rootStyle.boxSizing === 'border-box'){ absolutePos.subtract(borderFix, false); }
    // relativePos.subtract(borderFix, false); should not work, should check borders on relativetarget vs border on curr. or maybe is correct without any fix.
    if (allowVariables) {
      str = U.multiReplaceAll(str, ['positionX', 'positionX'], ['positionRelX', 'positionRelY']);
      str = U.multiReplaceAll(str,
        ['width', 'height', 'positionAbsX', 'positionAbsY', 'positionRelX', 'positionRelY'],
        ['' + size.w, '' + size.h, '' + absolutePos.x, '' + absolutePos.y, '' + relativePos.x, '' + relativePos.y]);
      str = U.multiReplaceAll(str,
        ['absoluteTargetSizeX', 'absoluteTargetSizeY', 'absoluteTargetSizeW', 'absoluteTargetSizeH'],
        ['' + absTargetSize.x, '' + absTargetSize.y, '' + absTargetSize.w, '' + absTargetSize.h]);
      str = U.multiReplaceAll(str,
        ['relativeTargetSizeX', 'relativeTargetSizeY', 'relativeTargetSizeW', 'relativeTargetSizeH'],
        ['' + relTargetSize.x, '' + relTargetSize.y, '' + relTargetSize.w, '' + relTargetSize.h]);
    }/*
    if (true || attr.name === '_ruleY') {
      console.log(attr.name + ': WallH: ('+(logic.childrens[0] as MAttribute).values[0] + '), top: ' + measurableHtml.style.top +
        ' |' + str0debug + '| --> |' + str + '| abs:', absTargetSize, ' rel:', relTargetSize, ' size:', size, ' htmls.abs', relativeRoot,
        ' rel.html:', $(relativeRoot).find(measurableHtml.getAttribute('relativeSelectorOf' + attr.name)), ' size.html:', measurableHtml,
        'absPos:', absolutePos, 'relPos:', relativePos);
    }*/
    const evalContext = {a: measurableHtml.attributes};
    let a = {};
    let i: number;
    for (i = 0; i < measurableHtml.attributes.length; i++) {
      const attr: Attr = measurableHtml.attributes[i];
      a[attr.name] = attr.value;
    }
    try {
      // str =  U.evalInContext(evalContext, str);
      str = eval(str);
    } catch (e) { U.pw(true, 'error occurred while evaluating ', str, 'in measurable attribute ', attr, 'err:', e, ', are you' +
      ' missing quotes?'); }
    return str; }

  static computeResizableAttribute(attr: Attr, logic: ModelPiece, measurableHtml: HTMLElement | SVGElement, size: Size = null,
                                   absTargetSize: Size = null, relTargetSize: Size = null): {destination: string, operator: string, value: any} {
    const val = attr.value;
    let pos = 0;
    let operator: string = null;
    let i: number;
    for (i = 1; i < val.length - 1; i++) {
      switch (val[i]) {
      case '>':
        if (val[i - 1] !== '-') { continue; } // ignoro lo pseudo operatore "->" per selezionare un attributo in measurableExport
        pos = i; operator = (val[i + 1] === '=' ? '>=' : '>'); break;
      case '<': pos = i; operator = (val[i + 1] === '=' ? '<=' : '<'); break;
      case '!': if (val[i + 1] !== '=') { continue; } pos = i; operator = '='; break;
      case '=': pos = i; operator = '='; break;
      default: continue; } }

    if (!operator) { U.pw(true, 'found measurable _attribute without operator: ', attr); return null; }
    if (!size) { size = U.sizeof(measurableHtml); }
    const leftSide = val.substr(0, pos).trim();
    const rightSide = val.substr(pos + operator.length).trim();
    let value: any = null;
    try { value = U.computeMeasurableAttributeRightPart(rightSide, attr, logic, measurableHtml, size, absTargetSize, relTargetSize);
    } catch (e) { U.pw(true, 'failed to read expression of ' + attr.name + ': |' + attr.value
      + '| --> |' + rightSide + '|. reason:' + e.toString()
      + '; the allowed variables are: width, height, positionRelX, positionRelY, positionAbsX, positionAbsY, ' +
      'relativeTargetSizeX, relativeTargetSizeY, relativeTargetSizeW, relativeTargetSizeH, ' +
      'absoluteTargetSizeX, absoluteTargetSizeY, absoluteTargetSizeW, absoluteTargetSizeH, ' + '. and js functions.'); }
    // console.log('attr:', attr, 'left:', leftSide, 'right:', rightSide, ' ---> |' + value + '|');
    return {destination: leftSide, operator, value}; }


  static processMeasuring(logic: IClassifier, m: MeasurableArrays, ui: ResizableUIParams | DraggableEventUIParams): void {
    const size: Size = U.sizeof(m.html);
    let relativeRoot: HTMLElement | SVGElement = m.html;
    while (!relativeRoot.classList.contains('vertexShell')) { relativeRoot = relativeRoot.parentElement; }
    const absTargetSize: Size = U.sizeof(relativeRoot);
    console.log('measurableHtml parsed special attributes:', m);
    let i: number;
    for (i = 0; i < m.variables.length; i++) { U.processMeasurableVariable(m.variables[i], logic, m.html, size, absTargetSize); }

    for (i = 0; i < m.imports.length; i++) { U.processMeasurableImport(m.imports[i], logic, m.html, null, absTargetSize); }

    for (i = 0; i < m.rules.length; i++) {
      const attr: Attr = m.rules[i];
      const val = attr.value;
      if (val.indexOf('=') === -1) {
        U.pw(true, 'found a .resizable rule attribute without "=". ' + attr.name + ': |' + val + '| inside:', m.html); continue; }
      U.processMeasurableRule(attr, logic, m.html, size, absTargetSize); }

    for (i = 0; i < m.constraints.length; i++) {
      const attr: Attr = m.constraints[i];
      const val = attr.value;
      if (val.indexOf('=') === -1) {
        U.pw(true, 'found a .resizable constraint without "=". ' + attr.name + ': |' + val + '| inside:', m.html); continue; }
      // NB: size must be null, constraint will modify size without updating the object, so it must be recalculated.
      U.processMeasurableConstraint(attr, logic, m.html, null, absTargetSize);}

    for (i = 0; i < m.dstyle.length; i++) { U.processMeasurableDstyle(m.dstyle[i], logic, m.html, null, absTargetSize); }

    for (i = 0; i < m.exports.length; i++) {
      const attr: Attr = m.exports[i];
      const val = attr.value;
      if (val.indexOf('=') === -1) {
        U.pw(true, 'found a .resizable export attribute without "=". ' + attr.name + ': |' + val + '| inside:', m.html); continue; }
      U.processMeasurableExport(attr, logic, m.html, size, absTargetSize); }

    for (i = 0; i < m.chain.length; i++) { U.processMeasurableChain(m.chain[i], logic, m.html, null, absTargetSize, logic.getVertex(), ui); }

    for (i = 0; i < m.chainFinal.length; i++) { U.processMeasurableChain(m.chainFinal[i], logic, m.html, null, absTargetSize, logic.getVertex(), ui); }

  }

  static processMeasurableExport(attr: Attr, logic: ModelPiece, measurableHtml: HTMLElement | SVGElement,
                                 size: Size = null, absTargetSize: Size = null): void {
    const rule: {destination: string, value: any} = U.computeResizableAttribute(attr, logic, measurableHtml, size, absTargetSize);
    // U.pw(true, 'process export:', rule, attr);
    if (!rule) { return; }
    const attributePseudoSelector = '->';
    rule.destination = U.changeBackVarTemplateDelimitersInMeasurablesAttr(rule.destination);
    rule.destination = U.replaceVarsString(logic, rule.destination);
    const pos = rule.destination.lastIndexOf(attributePseudoSelector);
    let htmlSelector: string;
    let attribName: string;
    if (pos !== -1) {
      htmlSelector = rule.destination.substring(0, pos);
      attribName = rule.destination.substring(pos + attributePseudoSelector.length).trim();
    } else {
      htmlSelector = rule.destination;
      attribName = null; }
    const $targets = $(htmlSelector);
    if (attribName) { $targets.attr(attribName, rule.value); } else { $targets.html(rule.value); }
  }

  static processMeasurableChain(attr0: Attr, logic: ModelPiece, measurableHtml: HTMLElement | SVGElement,
                                size: Size = null, absTargetSize: Size = null, vertex: IVertex, ui: ResizableUIParams | DraggableEventUIParams): void {

    const destination: string = U.computeMeasurableAttributeRightPart('\'' + attr0.value + '\'', attr0, logic, measurableHtml, size, absTargetSize, null, false);
    const attributePseudoSelector = '->';
    const pos = destination.indexOf(attributePseudoSelector);
    let htmlSelector: string;
    let attribName: string;
    if (pos !== -1) {
      htmlSelector = destination.substring(0, pos);
      attribName = destination.substring(pos + attributePseudoSelector.length).trim();
    } else {
      htmlSelector = destination;
      attribName = null; }
    const $targets = $(htmlSelector);
    console.log('measurableChain: ' + htmlSelector + ' -> ' + attribName + '| targets:', $targets);
    U.pe($targets.length <= 0, 'measurableChain: ' + htmlSelector + ' -> ' + attribName + '| targets:', $targets);
    let i: number;
    for (i = 0; i < $targets.length; i++) {
      const html: HTMLElement | SVGElement = $targets[i];
      const attr: Attr = attribName ? html.attributes.getNamedItem(attribName) : null;
      if (!attr) { vertex.measuringChanged(ui, null, html); continue; }
      if (attribName.indexOf('_') !== 0) { continue; }
      if (attribName.indexOf('_rule') === 0) { U.processMeasurableRule(attr, logic, html, null, null);
      } else if (attribName.indexOf('_import') === 0) { U.processMeasurableImport(attr, logic, html, null, null);
      } else if (attribName.indexOf('_export') === 0) { U.processMeasurableExport(attr, logic, html, null, null);
      } else if (attribName.indexOf('_constraint') === 0) { U.processMeasurableConstraint(attr, logic, html, null, null);
      } else if (attribName.indexOf('_dstyle') === 0) { U.processMeasurableDstyle(attr, logic, html, null, null);
      } else { U.processMeasurableVariable(attr, logic, html, null, null); }
      const val: Attr = $targets.length === 1 ? html.attributes.getNamedItem(attribName.substr(1)) : null;
      if (!val) { continue; }
      measurableHtml.setAttribute(attr0.name.substr(1), val.value);
    }
  }

  static processMeasurableRule(attr: Attr, logic: ModelPiece, measurableHtml: HTMLElement | SVGElement,
                               size: Size = null, absTargetSize: Size = null): void {
    const rule: {destination: string, value: any} = U.computeResizableAttribute(attr, logic, measurableHtml, size, absTargetSize);
    if (!rule) { return; }
    console.log('rule:', rule, 'attr:', attr);
    const tmp: {parent: any, childkey: string} = U.replaceSingleVarGetParentAndChildKey(logic, rule.destination);
    if (!tmp) {
      U.pw(true, 'replaceVar of ' + rule.destination + '| failed. while parsing the resizable.rule |' + attr.name + ' in vertex of: ' + logic.name);
      return; }
    if (!tmp.parent && !(tmp.parent instanceof ModelPiece)) {
      U.pw(true, 'found a rule template with his parent missing or not instance of ModelPiece?? :', tmp.parent, 'rule:', rule);
      return; }
    const destinationParent: ModelPiece = tmp.parent as ModelPiece;
    switch (tmp.childkey) {
    default:
      U.pw(true, 'The rule ' + attr.name + ': |' + attr.value + '| is targeting a valid but not yet allowed field, currently only ".values" is allowed.');
      break;
    case 'values':
      if (destinationParent instanceof MAttribute) {
        destinationParent.setValue(rule.value);
        break;
      }
      U.pw(true, 'The rule ' + attr.name + ': |' + attr.value + '| is trying to set "value" on an invalid modelPiece:', destinationParent);
      break;
    }
  }

  static processMeasurableConstraint(attr: Attr, logic: ModelPiece, measurableHtml: HTMLElement | SVGElement,
                                     size: Size = null, absTargetSize: Size = null): void {
    return U.processMeasurableImport(attr, logic, measurableHtml, size, absTargetSize); }

  static processMeasurableImport(attr: Attr, logic: ModelPiece, measurableHtml: HTMLElement | SVGElement,
                                 size: Size = null, absTargetSize: Size = null): void {
    let relativeRoot: HTMLElement | SVGElement = measurableHtml;
    while (!relativeRoot.classList.contains('vertexShell')) { relativeRoot = relativeRoot.parentElement; }
    const $relativeHtml = $(relativeRoot).find(measurableHtml.getAttribute('relativeSelectorOf' + attr.name));
    U.pw($relativeHtml.length > 1, 'found more than one relative target (', $relativeHtml, ') assigned to: ', measurableHtml, ' root:', relativeRoot);

    const relativeSize: Size = $relativeHtml.length ? U.sizeof($relativeHtml[0]) : absTargetSize;
    const rule: {destination: string, operator: string, value: any} =
      U.computeResizableAttribute(attr, logic, measurableHtml, size, absTargetSize, relativeSize);
    if (!rule) { return; }
    const outputSize: Size = size.duplicate();
    switch (rule.destination) {
    default: U.pw(true, 'invalid import destination: |' + rule.destination + '| found in html:', measurableHtml); break;
    case 'width': outputSize.w = rule.value; break;
    case 'height': outputSize.h = rule.value; break;
    case 'positionAbsX': outputSize.x = (absTargetSize.tl() + rule.value); break;
    case 'positionAbsY': outputSize.y = (absTargetSize.tl() + rule.value); break;
    case 'positionRelX': outputSize.x = (relativeSize.tl() + rule.value); break;
    case 'positionRelY': outputSize.y = (relativeSize.tl() + rule.value); break; }

    const setx = (val: number) => { measurableHtml.setAttributeNS(null, 'x', '' + val); measurableHtml.style.left = val + 'px'; };
    const sety = (val: number) => { measurableHtml.setAttributeNS(null, 'y', '' + val); measurableHtml.style.top = val + 'px'; };
    const setw = (val: number) => { measurableHtml.setAttributeNS(null, 'width', '' + val); measurableHtml.style.width = val + 'px'; };
    const seth = (val: number) => { measurableHtml.setAttributeNS(null, 'height', '' + val); measurableHtml.style.height = val + 'px'; };

    const add = 1;
    switch (rule.operator) {
    default: U.pe(true, 'unrecognized operator (not your fault, 100% developer failure): ' + rule.operator, attr); break;
    case '>=':
      if (size.x < outputSize.x) { setx(outputSize.x); }
      if (size.y < outputSize.y) { sety(outputSize.y); }
      if (size.w < outputSize.w) { setw(outputSize.w); }
      if (size.h < outputSize.h) { seth(outputSize.h); } break;
    case '>':
      if (size.x <= outputSize.x) { setx(outputSize.x + add); }
      if (size.y <= outputSize.y) { sety(outputSize.y + add); }
      if (size.w <= outputSize.w) { setw(outputSize.w + add); }
      if (size.h <= outputSize.h) { seth(outputSize.h + add); } break;
    case '<':
      if (size.x >= outputSize.x) { setx(outputSize.x + add); }
      if (size.y >= outputSize.y) { sety(outputSize.y + add); }
      if (size.w >= outputSize.w) { setw(outputSize.w + add); }
      if (size.h >= outputSize.h) { seth(outputSize.h + add); } break;
    case '<=':
      if (size.x > outputSize.x) { setx(outputSize.x); }
      if (size.y > outputSize.y) { sety(outputSize.y); }
      if (size.w > outputSize.w) { setw(outputSize.w); }
      if (size.h > outputSize.h) { seth(outputSize.h); } break;
    case '=':
      setx(outputSize.x);
      sety(outputSize.y);
      setw(outputSize.w);
      seth(outputSize.h); break;
    }
  }

  static processMeasurableVariable(attr: Attr, logic: ModelPiece, measurableHtml: HTMLElement | SVGElement,
                                   size: Size = null, absTargetSize: Size = null, relTargetSize: Size = null, allowVariables: boolean = true): void {
    attr.ownerElement.setAttribute(attr.name.substr(1),
      U.computeMeasurableAttributeRightPart(attr.value, attr, logic, measurableHtml, size, absTargetSize, relTargetSize,allowVariables));
    return; }

  static strFirstDiff(s1: string, s2: string, len: number): string[] {
    let i: number;
    if (!s1 && !s2) { return [s1, s2]; }
    if (s1 && !s2) { return [s1.substr(0, len), s2]; }
    if (!s1 && s2) { return [s1, s2.substr(0, len)]; }
    const min: number = Math.min(s1.length, s2.length);
    for (i = 0; i < min; i++) { if (s1[i] !== s2[i]) { return [s1.substr(i, len), s2.substr(i, len)]; } }
    return null; }

  static processMeasurableDstyle(attr: Attr, logic: ModelPiece, html: HTMLElement | SVGElement, size: Size = null, absTargetSize: Size = null): void {
    U.processMeasurableVariable(attr, logic, html, size, absTargetSize, null, false);
    const fake: HTMLElement | SVGElement = document.createElement('div');
    fake.setAttribute('style', html.getAttribute('dstyle'));
    console.log('preStyle.Real:', html.getAttribute('style'));
    console.log('preStyle.Fake:', fake.getAttribute('style'));
    U.mergeStyles(fake, html);
    html.setAttribute('style', fake.getAttribute('style'));
    console.log('finalStyle:', html.getAttribute('style'));
    // const fake: HTMLElement = document.createElement('div'); fake.setAttribute('style', elem.getAttribute('dstyle'));
    // let key: string; console.log('processDstyle() fake:', fake, 'attr:', attr, 'html:', elem);
    // for (key in fake.style) { console.log('fake[' + key + '] = ' + fake[key]);
    // if (fake[key] !== null && fake[key] !== undefined && fake[key] !== '') { elem.style[key] = fake[key]; } }

  }

  private static mergeStyles(html: HTMLElement | SVGElement, fake: HTMLElement | SVGElement): void {
    let i: number;
    const styles1 = html.getAttribute('style').split(';');
    const styles2 = fake.getAttribute('style').split(';');
    let stylesKv1: Dictionary<string, string> = {};
    const stylesKv2: Dictionary<string, string> = {};
    let key: string;
    let val: string;
    let pos: number;
    for (i = 0; i < styles1.length; i++) {
      pos = styles1[i].indexOf(':');
      key = styles1[i].substr(0, pos).trim();
      val = styles1[i].substr(pos + 1).trim();
      if (key == '' || val == '') continue;
      stylesKv1[key] = val; }
    for (i = 0; i < styles2.length; i++) {
      pos = styles2[i].indexOf(':');
      key = styles2[i].substr(0, pos).trim();
      val = styles2[i].substr(pos + 1).trim();
      if (key == '' || val == '') continue;
      stylesKv2[key] = val; }
    stylesKv1 = U.join(stylesKv1, stylesKv2, true, false);
    let style: string = '';
    for (key in stylesKv1) { style += key + ':' + stylesKv1[key] + '; '; }
    html.setAttribute('style', style); }

  public static merge(a: object, b: object, overwriteNull: boolean = true, clone: boolean = true): object { return U.join(a, b, overwriteNull, clone); }
  public static join(a: object, b: object, overwriteNull: boolean = true, clone: boolean = true): object {
    if (clone) { a = U.cloneObj(a); }
    let key: string;
    for (key in b) {
      if (!b.hasOwnProperty(key)) { continue; }
      if (b[key] !== undefined && a[key] === null && overwriteNull || a[key] === undefined) { a[key] = b[key]; }
    }
    return a;
  }

  public static getChildIndex_old(html: Node, allNodes: boolean = true): number {
    if (allNodes) { return Array.prototype.indexOf.call(html.parentNode.childNodes, html); }
    return Array.prototype.indexOf.call(html.parentNode.children, html); }

  public static getChildIndex(array: any, child: any): number {
    return Array.prototype.indexOf.call(array, child); }

  public static getIndexesPath_old(parent: Element, child: Element) {
    let ret: number[] = [];
    while (child && child !== parent) {
      ret.push(U.getChildIndex(parent.childNodes, child));
      child = child.parentElement; }
    // ret = ret.splice(ret.length - 2, 1);
    return ret.reverse(); }

  public static getIndexesPath_NoParentKey<T>(child: T, parent: any): string[] {
    U.pe(true, 'getindexespath without parent key: todo');
    return null;
    // todo: top-down ricorsivo a tentativi. implementa loop detection. senza childkey (può variare es: parent.a[3].b.c[1] = child)
    //  return string array con nomi di campi e indici di array.
  }
  public static getIndexesPath<T>(child: T, parentKey: string, childKey: string = null /* null = parent is raw array*/, parentLimit: T = null) {
    let ret: number[] = [];
    while (child) {
      const parent: any = child[parentKey];
      if (child === parentLimit) { break; }
      if (!parent || parent === child) { break; }
      const parentArrChilds: T[] = childKey ? parent[childKey] : parent;
      ret.push(U.getChildIndex(parentArrChilds, child));
      child = child[parentKey];
    }
    return ret.reverse(); }

  static followIndexesPath(root: any, indexedPath: (number | string)[], childKey: string = null,
                           outArr: {indexFollowed: (number | string)[], debugArr: {index: string | number, elem: any}[]} = {indexFollowed: [],
                             debugArr: [{index: 'Start', elem: root}]}, debug: boolean = false): any {
    let j: number;
    let ret: any = root;
    let oldret: any = ret;
    if (outArr) outArr.debugArr.push({index: 'start', elem: root, childKey: childKey} as any);
    U.pe(childKey && childKey !== '' + childKey, 'U.followIndexesPath() childkey must be a string or a null:', childKey, 'root:', root);
    for (j = 0; j < indexedPath.length; j++) {
      let key: number | string = indexedPath[j];
      let childArr = childKey ? ret[childKey] : ret;
      U.pif(debug, 'path ' + j + ') = elem.' + childKey + ' = ', childArr);
      if (!childArr) { return oldret; }
      ret = childArr[key];
      if (key >= childArr.length) { key = 'Key out of boundary: ' + key + '/' + childArr.length + '.'; }
      U.pif(debug, 'path ' + j + ') = elem.' + childKey + '[ ' + key + '] = ', ret);
      if (outArr) outArr.debugArr.push({index: key, elem: ret});
      if (!ret) { return oldret; }
      if (outArr) outArr.indexFollowed.push(key);
      oldret = ret;
    }
    return ret; }

  static followIndexesPathOld(templateRoot: Element, indexedPath: number[], allNodes: boolean = true,
                              outArr: {indexFollowed: number[]} = {indexFollowed: []}, debug: boolean = false): Element {
    let j: number;
    let ret: Element = templateRoot;
    let oldret: Element = ret;
    const debugarr: {index: number, html: Node}[] = [{index: 'Start' as any, html: ret}];
    for (j = 0; j < indexedPath.length; j++) {
      const index = indexedPath[j];
      ret = (allNodes ? ret.childNodes[index] : ret.children[index]) as any;
      if (!ret) {
        console.log('folllowPath: clicked on some dinamically generated content, returning the closest static parent.', debugarr);
        U.pw(debug, 'clicked on some dinamically generated content, returning the closest static parent.', debugarr);
        return oldret; }
      oldret = ret;
      outArr.indexFollowed.push(index);
      debugarr.push({index: index, html: ret});
    }
    U.pif(debug, 'followpath debug arr:', debugarr);
    return ret; }

  static removeDuplicates(arr0: any[], clone: boolean = false): any[] {
    if (!arr0) return [];
    const arr: any[] = clone ? U.cloneObj<any[]>(arr0) as any[] : arr0;
    const found: any[] = [];
    let i: number;
    for (i = 0; i < arr.length; i++) {
      if (arr[i] in found) { U.arrayRemoveAll(arr, arr[i]); i--; continue; }
      found.push(arr[i]); }
    return arr; }

  static findTemplateList(str: string): string[] {
    return undefined;
  }

  static makeSet(notice_willStripSpaces: any): DOMTokenList {
    const useless = document.createElement('');
    // NB: classList behave like a set but will strip spaces
    return useless.classList; }

  private static startSeparatorKeys = {};
  private static startSeparatorKeyMax = -1;
  public static getStartSeparatorKey(): string { return ++U.startSeparatorKeyMax + ''; }
  public static startSeparator(key: string, separator: string = ', '): string {
    if (key in U.startSeparatorKeys) return separator;
    U.startSeparatorKeys[key] = true;
    return ''; }

  static arrayContains(arr: any[], searchElem: any): boolean {
    if (!arr) return false;
    // return arr && arr.indexOf(searchElem) === -1; not working properly on strings. maybe they are evaluated by references and not by values.
    let i: number;
    for (i = 0; i < arr.length; i++) { if (arr[i] === searchElem) return true; }
    return false; }

  static toBoolString(bool: boolean): string { return bool ? "true" : "false"; }
  static fromBoolString(str: string): boolean { return str === "true" || str === 't' || +str === 1; }

  static parseSvgPath(str: string): {assoc: {letter: string, pt: Point}[], pts: Point[]} {
    let i: number;
    let letter: string = null;
    let num1: string = null;
    let num2: string = null; // useless initializing phase to avoid IDE warnings
    let foundFloat: boolean = null;
    let pt: Point = null;
    let current: {letter: string, pt: Point} = null;
    const assoc: {letter: string, pt: Point}[] = [];
    const pts: Point[] = [];
    const ret = {assoc: assoc, pts: pts};
    const debug: boolean = false;
    str = str.toUpperCase();

    const startNextEntry = () => {
      num1 = '';
      num2 = '';
      pt = new Point(0, 0);
      pt.x = null;
      pt.y = null;
      foundFloat = false; };
    const endCurrentEntry = () => {
      pt.y = +num2;
      U.pe(isNaN(pt.y), 'parsed non-number as value of: |' + letter + '| in svg.path attribute: |' + str + '|', ret);

      current = {letter: letter, pt: pt};
      U.pe(pt.x === null || pt.y === null, num1, num2, pt, i, str);
      pts.push(pt);
      assoc.push(current);
      U.pif(debug, 'endEntry:', current, ' position: |' + str.substr(0, i) + '|' + str.substr(i)+"|");
      startNextEntry();
    };
    startNextEntry();
    for (i = 0; i < str.length; i++) {
      const c: string = str[i];
      switch (c) {
      case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case '.': case '-': case '+':
        if (c === '.') { U.pe(foundFloat, ' found 2 floating points in a single parsed number in svg.path attribute: |' + str + '|'); foundFloat = true; }
        U.pe((c === '+' || c === '-') && (pt.x === null && num1 !== '' || pt.y === null && num2 !== ''), 'found a ' + c + ' sign inside a number:', ret, i, str);
        if (pt.x === null) { num1 += c; break; }
        if (pt.y === null) { num2 += c; break; }
        U.pe(true, 'found 3 numbers while parsing svg.path attribute: |' + str + '|', ret); break;
      case ' ':
        if (pt.x === null) {
          pt.x = +num1;
          foundFloat = false;
          U.pe(isNaN(+pt.x), 'parsed non-number as value of: |' + letter + '| in svg.path attribute: |' + str + '|', ret); break; }
        if (pt.y === null) {
          pt.y = +num2;
          U.pe(isNaN(+pt.y), 'parsed non-number as value of: |' + letter + '| in svg.path attribute: |' + str + '|', ret); break; }
        break;
      default:
        if (letter) { endCurrentEntry(); }
        letter = c;
        break;
      }
    }
    endCurrentEntry();
    return ret;
  }
/*
  static unescapeHtmlEntities(s: string): string { return HE.decode(s); }
  static escapeHtmlEntities(s: string): string { return HE.encode(s); }*/
  static shallowArrayCopy<T>(arr: T[]): T[] {
    let ret: T[] = [];
    let i: number;
    if (!arr) return null;
    for (i = 0; i < arr.length; i++) { ret.push(arr[i]); }
    return ret; }

  static arrayInsertAt(arr: any[], index: number, item: any): void {
    U.pe(!arr || !Array.isArray(arr), 'ArrayInsertAt() must have a parameter array');
    index = Math.max(0, index);
    index = Math.min(arr.length, index);
    arr.splice(index, 0, item);
  }

  static newArray(size: number): any[] {
    let ret = [];
    ret.length = Math.max(0, size);
    return ret; }
}

export enum AttribETypes {
//  FakeElementAddFeature = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//FakeElement',
// era il 'pulsante per aggiungere feature nel mm.',
  // reference = 'reference??',
  void = '???void',
  EChar = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EChar',
  EString = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString',
  EDate = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDate',
  EFloat = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EFloat',
  EDouble = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble',
  EBoolean = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBoolean',
  EByte = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EByte',
  EShort = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EShort',
  EInt = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt',
  ELong = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//ELong',
  /*
  ECharObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//ECharObject',
  EStringObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EStringObject',
  EDateObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDateObject',
  EFloatObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EFloatObject',
  EDoubleObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDoubleObject',
  EBooleanObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBooleanObj',
  EByteObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EByteObject',
  EShortObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EShortObject',
  EIntObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EIntegerObject',
  ELongObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//ELongObject', */
  // EELIST = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EEList', // List<E> = List<?>
}

// export type Json = object;
export class Json {
  constructor(j: object) {/* U.pe('' + j === j, 'parameter cannot be a string'); */}

  static getAnnotations(thiss: Json): Json[] {
    const ret = thiss[ECorePackage.eAnnotations];
    if (!ret || $.isEmptyObject(ret)) { return []; }
    if (Array.isArray(ret)) { return ret; } else { return [ret]; } }

  static getDetails(thiss: Json): Json[] {
    const ret = thiss[ECoreAnnotation.details];
    if (!ret || $.isEmptyObject(ret)) { return []; }
    if (Array.isArray(ret)) { return ret; } else { return [ret]; } }

  static getChildrens(thiss: Json, throwError: boolean = false, functions: boolean = false): Json[] {
    if (!thiss && !throwError) { return []; }
    const mod = thiss[ECoreRoot.ecoreEPackage];
    const pkg = thiss[ECorePackage.eClassifiers];
    const cla = thiss[functions ? ECoreClass.eOperations : ECoreClass.eStructuralFeatures];
    const fun = thiss[ECoreOperation.eParameters];
    const lit = thiss[ECoreEnum.eLiterals];

    const ret: any = mod || pkg || cla || fun || lit;
    /*if ( ret === undefined || ret === null ) {
      if (thiss['@name'] !== undefined) { ret = thiss; } // if it's the root with only 1 child arrayless
    }*/
    // U.pe(true, debug, 'getchildrens(', thiss, ')');
    U.pe( throwError && !ret, 'getChildrens() Failed: ', thiss, ret);
    // console.log('ret = ', ret, ' === ', {}, ' ? ', ($.isEmptyObject(ret) ? [] : [ret]));
    if (!ret || $.isEmptyObject(ret)) { return []; }
    if (Array.isArray(ret)) { return ret; } else { return [ret]; }
  }

  static read<T>(json: Json, field: string, valueIfNotFound: any = 'read<T>CanThrowError'): T {
    let ret: any = json ? json[field] : null;
    if (ret !== null && field.indexOf(Status.status.XMLinlineMarker) !== -1) {
      U.pe(U.isObject(ret, false, false, true), 'inline value |' + field + '| must be primitive.', ret);
      ret = U.multiReplaceAll('' + ret, ['&amp;', '&#38;', '&quot;'], ['&', '\'', '"']);
    }
    if ((ret === null || ret === undefined)) {
      U.pe(valueIfNotFound === 'read<T>CanThrowError', 'Json.read<',  '> failed: field[' + field + '], json: ', json);
      return valueIfNotFound; }
    return ret as T ; }

  static write(json: Json, field: string, val: any): string {
    if (val !== null && field.indexOf(Status.status.XMLinlineMarker) !== -1) {
      U.pe(val !== '' + val, 'inline value |' + field + '| must be a string.', val);
      val = U.multiReplaceAll(val, ['&', '\'', '"'], ['&amp;', '&#38;', '&quot;']);
    }
    else U.pe(val !== '' + val || !U.isObject(val, true), 'primitive values should be inserted only inline in the xml:', field, val);
    json[field] = val;
    return val; }
}


export class DetectZoom {
  static device(): number { return detectzoooom.device(); }
  static zoom(): number {U.pe(true, 'better not use this, looks like always === 1'); return detectzoooom.zoom(); }
  private test(): any {
    let a: InputPopup;
    return a = null; }
}

export abstract class ISize {
  x: number;
  y: number;
  w: number;
  h: number;
  constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
    if (isNaN(+x)) { x = 0; }
    if (isNaN(+y)) { y = 0; }
    if (isNaN(+w)) { w = 0; }
    if (isNaN(+h)) { h = 0; }
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h; }
  abstract makePoint(x: number, y: number): IPoint;
  abstract clone(otherJson: ISize): ISize;
  abstract duplicate(): ISize;
  tl(): IPoint { return this.makePoint(   this.x,             this.y         ); }
  tr(): IPoint { return this.makePoint(this.x + this.w,    this.y         ); }
  bl(): IPoint { return this.makePoint(   this.x,          this.y + this.h); }
  br(): IPoint { return this.makePoint(this.x + this.w, this.y + this.h); }
  equals(size: ISize): boolean { return this.x === size.x && this.y === size.y && this.w === size.w && this.h === size.h; }
  /// field-wise Math.min()
  min(minSize: ISize, clone: boolean): ISize {
    const ret: ISize = clone ? this.duplicate() : this;
    if (!isNaN(minSize.x) && ret.x < minSize.x) { ret.x = minSize.x; }
    if (!isNaN(minSize.y) && ret.y < minSize.y) { ret.y = minSize.y; }
    if (!isNaN(minSize.w) && ret.w < minSize.w) { ret.w = minSize.w; }
    if (!isNaN(minSize.h) && ret.h < minSize.h) { ret.h = minSize.h; }
    return ret; }
  max(maxSize: ISize, clone: boolean): ISize {
    const ret: ISize = clone ? this.duplicate() : this;
    if (!isNaN(maxSize.x) && ret.x > maxSize.x) { ret.x = maxSize.x; }
    if (!isNaN(maxSize.y) && ret.y > maxSize.y) { ret.y = maxSize.y; }
    if (!isNaN(maxSize.w) && ret.w > maxSize.w) { ret.w = maxSize.w; }
    if (!isNaN(maxSize.h) && ret.h > maxSize.h) { ret.h = maxSize.h; }
    return ret; }
}
export class Size extends ISize {
  static fromPoints(firstPt: Point, secondPt: Point): Size {
    const minX = Math.min(firstPt.x, secondPt.x);
    const maxX = Math.max(firstPt.x, secondPt.x);
    const minY = Math.min(firstPt.y, secondPt.y);
    const maxY = Math.max(firstPt.y, secondPt.y);
    return new Size(minX, minY, maxX - minX, maxY - minY); }
  dontMixWithGraphSize: any;
  clone(json: Size): Size { return new Size(json.x, json.y, json.w, json.h); }
  duplicate(): Size { return new Size().clone(this); }
  makePoint(x: number, y: number): Point { return new Point(x, y); }
  tl(): Point { return super.tl() as Point; }
  tr(): Point { return super.tr() as Point; }
  bl(): Point { return super.bl() as Point; }
  br(): Point { return super.br() as Point; }
  equals(size: Size): boolean { return super.equals(size); }
  min(minSize: Size, clone: boolean): Size { return super.min(minSize, clone) as Size; }
  max(minSize: Size, clone: boolean): Size { return super.max(minSize, clone) as Size; }
}
export class GraphSize extends ISize {
  static fromPoints(firstPt: GraphPoint, secondPt: GraphPoint): GraphSize {
    const minX = Math.min(firstPt.x, secondPt.x);
    const maxX = Math.max(firstPt.x, secondPt.x);
    const minY = Math.min(firstPt.y, secondPt.y);
    const maxY = Math.max(firstPt.y, secondPt.y);
    return new GraphSize(minX, minY, maxX - minX, maxY - minY); }
  static closestIntersection(vertexGSize: GraphSize, prevPt: GraphPoint, pt0: GraphPoint, gridAlign: GraphPoint = null): GraphPoint {
    let pt = pt0.clone();
    const m = GraphPoint.getM(prevPt, pt);
    const q = GraphPoint.getQ(prevPt, pt);
    U.pe( Math.abs((pt.y - m * pt.x) - (prevPt.y - m * prevPt.x)) > .001,
      'wrong math in Q:', (pt.y - m * pt.x), ' vs ', (prevPt.y - m * prevPt.x));
    /*const isL = prevPt.x < pt.x;
    const isT = prevPt.y < pt.y;
    const isR = !isL;
    const isB = !isT; */
    if (m === Number.POSITIVE_INFINITY && q === Number.NEGATIVE_INFINITY) { // bottom middle
      return new GraphPoint(vertexGSize.x + vertexGSize.w / 2, vertexGSize.y + vertexGSize.h); }
    // console.log('pt:', pt, 'm:', m, 'q:', q);
    let L: GraphPoint = new GraphPoint(0, 0);
    let T: GraphPoint = new GraphPoint(0, 0);
    let R: GraphPoint = new GraphPoint(0, 0);
    let B: GraphPoint = new GraphPoint(0, 0);
    L.x = vertexGSize.x;
    L.y = m * L.x + q;
    R.x = vertexGSize.x + vertexGSize.w;
    R.y = m * R.x + q;
    T.y = vertexGSize.y;
    T.x = (T.y - q) / m;
    B.y = vertexGSize.y + vertexGSize.h;
    B.x = (B.y - q) / m;
    // prendo solo il compreso pt ~ prevPt (escludo così il "pierce" sulla faccia opposta), prendo il più vicino al centro.
    // console.log('4 possibili punti di intersezione (LTBR):', L, T, B, R);
    /* this.owner.mark(this.owner.toHtmlCoord(T), true, 'blue');
    this.owner.mark(this.owner.toHtmlCoord(B), false, 'violet');
    this.owner.mark(this.owner.toHtmlCoord(L), false, 'red');
    this.owner.mark(this.owner.toHtmlCoord(R), false, 'orange');*/
    if ( (B.x >= pt.x && B.x <= prevPt.x) || (B.x >= prevPt.x && B.x <= pt.x) ) { } else { B = null; }
    if ( (T.x >= pt.x && T.x <= prevPt.x) || (T.x >= prevPt.x && T.x <= pt.x) ) { } else { T = null; }
    if ( (L.y >= pt.y && L.y <= prevPt.y) || (L.y >= prevPt.y && L.y <= pt.y) ) { } else { L = null; }
    if ( (R.y >= pt.y && R.y <= prevPt.y) || (R.y >= prevPt.y && R.y <= pt.y) ) { } else { R = null; }
    // console.log('superstiti step1: (LTBR):', L, T, B, R);
    const vicinanzaT = !T ? Number.POSITIVE_INFINITY : ((T.x - pt.x) * (T.x - pt.x)) + ((T.y - pt.y) * (T.y - pt.y));
    const vicinanzaB = !B ? Number.POSITIVE_INFINITY : ((B.x - pt.x) * (B.x - pt.x)) + ((B.y - pt.y) * (B.y - pt.y));
    const vicinanzaL = !L ? Number.POSITIVE_INFINITY : ((L.x - pt.x) * (L.x - pt.x)) + ((L.y - pt.y) * (L.y - pt.y));
    const vicinanzaR = !R ? Number.POSITIVE_INFINITY : ((R.x - pt.x) * (R.x - pt.x)) + ((R.y - pt.y) * (R.y - pt.y));
    const closest = Math.min(vicinanzaT, vicinanzaB, vicinanzaL, vicinanzaR);
    // console.log( 'closest:', closest);
    // succede quando pt e prevPt sono entrambi all'interno del rettangolo del vertice.
    // L'edge non è visibile e il valore ritornato è irrilevante.
    if (closest === Number.POSITIVE_INFINITY) {
      /* top center */
      pt = vertexGSize.tl();
      pt.x += vertexGSize.w / 2; } else
    if (closest === Number.POSITIVE_INFINITY) {
      /* bottom center */
      pt = vertexGSize.br();
      pt.x -= vertexGSize.w / 2; } else
    if (closest === vicinanzaT) { pt = T; } else
    if (closest === vicinanzaB) { pt = B; } else
    if (closest === vicinanzaR) { pt = R; } else
    if (closest === vicinanzaL) { pt = L; }

    if (!gridAlign) { return pt; }
    if ((pt === T || pt === B || isNaN(closest)) && gridAlign.x) {
      const floorX: number = Math.floor(pt.x / gridAlign.x) * gridAlign.x;
      const ceilX: number = Math.ceil(pt.x / gridAlign.x) * gridAlign.x;
      let closestX;
      let farthestX;
      if (Math.abs(floorX - pt.x) < Math.abs(ceilX - pt.x)) {
        closestX = floorX; farthestX = ceilX;
      } else { closestX = ceilX; farthestX = floorX; }

      // todo: possibile causa del bug che non allinea punti fake a punti reali. nel calcolo realPT questo non viene fatto.
      // if closest grid intersection is inside the vertex.
      if (closestX >= vertexGSize.x && closestX <= vertexGSize.x + vertexGSize.w) { pt.x = closestX; } else
      // if 2° closer grid intersection is inside the vertex.
      if (closestX >= vertexGSize.x && closestX <= vertexGSize.x + vertexGSize.w) { pt.x = farthestX;
        // if no intersection are inside the vertex (ignore grid)
      } else { pt = pt; }
    } else if ((pt === L || pt === R) && gridAlign.y) {
      const floorY: number = Math.floor(pt.y / gridAlign.y) * gridAlign.y;
      const ceilY: number = Math.ceil(pt.y / gridAlign.y) * gridAlign.y;
      let closestY;
      let farthestY;
      if (Math.abs(floorY - pt.y) < Math.abs(ceilY - pt.y)) {
        closestY = floorY; farthestY = ceilY;
      } else { closestY = ceilY; farthestY = floorY; }

      // if closest grid intersection is inside the vertex.
      if (closestY >= vertexGSize.y && closestY <= vertexGSize.y + vertexGSize.h) { pt.y = closestY; } else
      // if 2° closer grid intersection is inside the vertex.
      if (closestY >= vertexGSize.y && closestY <= vertexGSize.y + vertexGSize.h) { pt.y = farthestY;
        // if no intersection are inside the vertex (ignore grid)
      } else { pt = pt; }
    }
    return pt; }
  dontMixWithSize: any;
  clone(json: GraphSize): GraphSize { return new GraphSize(json.x, json.y, json.w, json.h); }
  duplicate(): GraphSize { return new GraphSize().clone(this); }
  makePoint(x: number, y: number): Point { return new GraphPoint(x, y); }
  tl(): GraphPoint { return super.tl() as GraphPoint; }
  tr(): GraphPoint { return super.tr() as GraphPoint; }
  bl(): GraphPoint { return super.bl() as GraphPoint; }
  br(): GraphPoint { return super.br() as GraphPoint; }
  equals(size: GraphSize): boolean { return super.equals(size); }
  min(minSize: GraphSize, clone: boolean): GraphSize { return super.min(minSize, clone) as GraphSize; }
  max(minSize: GraphSize, clone: boolean): GraphSize { return super.max(minSize, clone) as GraphSize; }
}

export abstract class IPoint {
  x: number;
  y: number;

  static getM(firstPt: IPoint, secondPt: IPoint): number { return (firstPt.y - secondPt.y) / (firstPt.x - secondPt.x); }
  static getQ(firstPt: IPoint, secondPt: IPoint): number { return firstPt.y - IPoint.getM(firstPt, secondPt) * firstPt.x; }
  constructor(x: number | string, y: number | string) {
    if (isNaN(+x)) { x = 0; }
    if (isNaN(+y)) { y = 0; }
    this.x = +x;
    this.y = +y; }

  toString(): string { return '(' + this.x + ', ' + this.y + ')'; }
  abstract clone(): IPoint;

  subtract(p2: IPoint, newInstance: boolean): IPoint {
    U.pe(!p2, 'subtract argument must be a valid point: ', p2);
    let p1: IPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x -= p2.x;
    p1.y -= p2.y;
    return p1; }

  add(p2: IPoint, newInstance: boolean): IPoint {
    U.pe(!p2, 'add argument must be a valid point: ', p2);
    let p1: IPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x += p2.x;
    p1.y += p2.y;
    return p1; }

  addAll(p: IPoint[], newInstance: boolean): IPoint {
    let i;
    let p0: IPoint;
    if (!newInstance) { p0 = this; } else { p0 = this.clone(); }
    for (i = 0; i < p.length; i++) { p0.add(p[i], true); }
    return p0; }

  subtractAll(p: IPoint[], newInstance: boolean): IPoint {
    let i;
    let p0: IPoint;
    if (!newInstance) { p0 = this; } else { p0 = this.clone(); }
    for (i = 0; i < p.length; i++) { p0.subtract(p[i], true); }
    return p0; }

  multiply(scalar: number, newInstance: boolean): IPoint {
    U.pe( isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
    let p1: IPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x *= scalar;
    p1.y *= scalar;
    return p1; }

  divide(scalar: number, newInstance: boolean): IPoint {
    U.pe( isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
    let p1: IPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.clone(); }
    p1.x /= scalar;
    p1.y /= scalar;
    return p1; }

  isInTheMiddleOf(firstPt: IPoint, secondPt: IPoint, tolleranza: number): boolean {
    const rectangle: Size = Size.fromPoints(firstPt as Point, secondPt as Point);
    const tolleranzaX = tolleranza; // actually should be cos * arctan(m);
    const tolleranzaY = tolleranza; // actually should be sin * arctan(m);
    if (this.x < rectangle.x - tolleranzaX || this.x > rectangle.x + rectangle.w + tolleranzaX) { return false; }
    if (this.y < rectangle.y - tolleranzaX || this.y > rectangle.y + rectangle.h + tolleranzaY) { return false; }
    const m = IPoint.getM(firstPt, secondPt);
    const q = IPoint.getQ(firstPt, secondPt);
    const lineDistance = this.distanceFromLine(firstPt, secondPt);
    // console.log('distance:', lineDistance, ', this:', this, ', p1:', firstPt, ', p2:', secondPt);
    return lineDistance <= tolleranza; }

  distanceFromLine(p1: IPoint, p2: IPoint): number {
    const top: number =
      + (p2.y - p1.y) * this.x
      - (p2.x - p1.x) * this.y
      + p2.x * p1.y
      - p1.x * p2.y;
    const bot =
      (p2.y - p1.y) * (p2.y - p1.y) +
      (p2.x - p1.x) * (p2.x - p1.x);
    return Math.abs(top) / Math.sqrt(bot);  }

  equals(pt: IPoint, tolleranzaX: number = 0, tolleranzaY: number = 0): boolean {
    if (pt === null) { return false; }
    return Math.abs(this.x - pt.x) <= tolleranzaX && Math.abs(this.y - pt.y) <= tolleranzaY; }

  moveOnNearestBorder(startVertexSize: ISize, clone: boolean, debug: boolean = true): IPoint {
    const pt: IPoint = clone ? this.clone() : this;
    const tl: IPoint = startVertexSize.tl();
    const tr: IPoint = startVertexSize.tr();
    const bl: IPoint = startVertexSize.bl();
    const br: IPoint = startVertexSize.br();
    const L: number = pt.distanceFromLine(tl, bl);
    const R: number = pt.distanceFromLine(tr, br);
    const T: number = pt.distanceFromLine(tl, tr);
    const B: number = pt.distanceFromLine(bl, br);
    const min: number = Math.min(L, R, T, B);
    if (min === L) { pt.x = tl.x; }
    if (min === R) { pt.x = tr.x; }
    if (min === T) { pt.y = tr.y; }
    if (min === B) { pt.y = br.y; }
    if (debug && pt instanceof GraphPoint) { Status.status.getActiveModel().graph.markg(pt, false, 'purple'); }
    return pt;
  }

  getM(pt2: IPoint): number { return IPoint.getM(this, pt2); }

  degreeWith(pt2: IPoint, toRadians: boolean): number {
    const directionVector: IPoint = this.subtract(pt2, true);
    const ret: number = Math.atan2(directionVector.y, directionVector.x);
    return toRadians ? ret : U.RadToDegree(ret); }

}
export class GraphPoint extends IPoint{
  dontmixwithPoint: any;
  static fromEvent(e: ClickEvent | MouseMoveEvent | MouseUpEvent | MouseDownEvent | MouseEnterEvent | MouseLeaveEvent | MouseEvent)
    : GraphPoint {
    if (!e) { return null; }
    const p: Point = new Point(e.pageX, e.pageY);
    const g: IGraph = Status.status.getActiveModel().graph;
    return g.toGraphCoord(p); }

  clone(): GraphPoint { return new GraphPoint(this.x, this.y); }
  subtract(p2: GraphPoint, newInstance: boolean): GraphPoint { return super.subtract(p2, newInstance) as GraphPoint; }
  add(p2: GraphPoint, newInstance: boolean): GraphPoint { return super.add(p2, newInstance) as GraphPoint; }
  multiply(scalar: number, newInstance: boolean): GraphPoint { return super.multiply(scalar, newInstance) as GraphPoint; }
  divide(scalar: number, newInstance: boolean): GraphPoint { return super.divide(scalar, newInstance) as GraphPoint; }
  isInTheMiddleOf(firstPt: GraphPoint, secondPt: GraphPoint, tolleranza: number): boolean { return super.isInTheMiddleOf(firstPt, secondPt, tolleranza); }
  distanceFromLine(p1: GraphPoint, p2: GraphPoint): number { return super.distanceFromLine(p1, p2); }
  equals(pt: GraphPoint, tolleranzaX: number = 0, tolleranzaY: number = 0): boolean { return super.equals(pt, tolleranzaX, tolleranzaY); }
  moveOnNearestBorder(startVertexSize: GraphSize, clone: boolean, debug: boolean = true): GraphPoint {
    return super.moveOnNearestBorder(startVertexSize, clone, debug) as GraphPoint; }
  getM(pt2: GraphPoint): number { return super.getM(pt2); }
  degreeWith(pt2: GraphPoint, toRadians: boolean): number { return super.degreeWith(pt2, toRadians); }
}
export class Point extends IPoint{
  dontmixwithPoint: any;
  static fromEvent(e: ClickEvent | MouseMoveEvent | MouseUpEvent | MouseDownEvent | MouseEnterEvent | MouseLeaveEvent | MouseEvent)
    : Point {
    if (!e) { return null; }
    const p: Point = new Point(e.pageX, e.pageY);
    return p; }

  clone(): Point { return new Point(this.x, this.y); }
  subtract(p2: Point, newInstance: boolean): Point { return super.subtract(p2, newInstance) as Point; }
  add(p2: Point, newInstance: boolean): Point { return super.add(p2, newInstance) as Point; }
  multiply(scalar: number, newInstance: boolean): Point { return super.multiply(scalar, newInstance) as Point; }
  divide(scalar: number, newInstance: boolean): Point { return super.divide(scalar, newInstance) as Point; }
  isInTheMiddleOf(firstPt: Point, secondPt: Point, tolleranza: number): boolean { return super.isInTheMiddleOf(firstPt, secondPt, tolleranza); }
  distanceFromLine(p1: Point, p2: Point): number { return super.distanceFromLine(p1, p2); }
  equals(pt: Point, tolleranzaX: number = 0, tolleranzaY: number = 0): boolean { return super.equals(pt, tolleranzaX, tolleranzaY); }
  moveOnNearestBorder(startVertexSize: GraphSize, clone: boolean, debug: boolean = true): Point {
    return super.moveOnNearestBorder(startVertexSize, clone, debug) as Point; }
  getM(pt2: Point): number { return super.getM(pt2); }
  degreeWith(pt2: Point, toRadians: boolean): number { return super.degreeWith(pt2, toRadians); }
}

export class FileReadTypeEnum {
  public static image: FileReadTypeEnum = "image/*" as any;
  public static audio: FileReadTypeEnum = "audio/*" as any;
  public static video: FileReadTypeEnum = "video/*" as any;
  /// a too much huge list https://www.iana.org/assignments/media-types/media-types.xhtml
  public static AndManyOthersButThereAreTooMuch: string = "And many others... https://www.iana.org/assignments/media-types/media-types.xhtml";
  public static OrJustPutFileExtension: string = "OrJustPutFileExtension";
}
