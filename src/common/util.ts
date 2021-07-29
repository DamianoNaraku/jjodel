﻿import {
  ModelPiece, MetaMetaModel,
  ECoreClass, ECorePackage, ECoreRoot, ECoreOperation, ECoreAnnotation, ECoreEnum,
  IGraph, IModel, Status,
  XMIModel, MyException,
} from './Joiner';

import ClickEvent = JQuery.ClickEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseMoveEvent = JQuery.MouseMoveEvent;
import MouseUpEvent = JQuery.MouseUpEvent;
import ContextMenuEvent = JQuery.ContextMenuEvent;
export class Dictionary<K = string, V = string> extends Object {}
import * as detectzoooom            from 'detect-zoom'; // https://github.com/tombigel/detect-zoom broken 2013? but works
export type GenericObject = { [key: string]: any };

export class RawVertex{
  public edgesOut: RawEdge[] = [];
  public edgesIn: RawEdge[] = [];
  constructor(public id: string, public data: any = null){}
}
export class RawEdge{
  constructor(public id: string, public source: RawVertex, public target: RawVertex, public data: any = null){
    if (this.source) this.source.edgesOut.push(this);
    if (this.target) this.target.edgesIn.push(this);
  }
}

export class RawGraph{
  private matrix: Dictionary<string, Dictionary<string, boolean>> = null;
  private idMapping: Dictionary<string, RawEdge | RawVertex> = {};
  constructor(public vertex: RawVertex[], public edges: RawEdge[]){
    for (let v of this.vertex) { this.idMapping[v.id] = v; }
    for (let e of this.edges) { this.idMapping[e.id] = e; }
  }

  isDag(canDestryData: boolean = false): boolean {
    let out = {elementsInLoop: []};
    this.getDagOrder(canDestryData, out);
    return !!out.elementsInLoop.length; }

  clone(): RawGraph {
    const vertex = [];
    const edges = [];
    const copiesMapID: Dictionary<string, RawEdge | RawVertex> = {};
    for (let v of this.vertex) { v = new RawVertex(v.id, v.data); vertex.push(v); copiesMapID[v.id] = v; }
    for (let e of this.edges) {
      let source = e.source && copiesMapID[e.source.id];
      let target = e.target && copiesMapID[e.target.id];
      e = new RawEdge(e.id, source, target);
      edges.push(e);
    }
    return new RawGraph(vertex, edges);
  }

  public getDagOrder(canDestroyData: boolean = false, out: {elementsInLoop: RawVertex[]} = {} as any): RawVertex[][] {
    if (!canDestroyData) {
      const ret: RawVertex[][] = this.clone().getDagOrder(true, out).map(varr => varr.map( v => this.idMapping[v.id]));
      out.elementsInLoop = out.elementsInLoop.map( lv => this.idMapping[lv.id]);
      return ret;
    }
    out.elementsInLoop = [... this.vertex];
    let visitedThisIteration: RawVertex[];
    const ret: RawVertex[][] = [];
    while (true) {
      visitedThisIteration = [];
      ret.push(visitedThisIteration);
      for (let i = 0; i < out.elementsInLoop.length; i++) {
        let v: RawVertex = out.elementsInLoop[i];
        if (!v || v.edgesOut) continue;
        visitedThisIteration.push(v);
        out.elementsInLoop[i] = null;
        for (let enteringedges of v.edgesIn) { U.arrayRemoveAll(enteringedges.source.edgesOut, enteringedges); }
      }
      out.elementsInLoop = out.elementsInLoop.filter(v => !!v);
      if (!visitedThisIteration.length) break;
      break;
    }
    return ret.reverse();
  }
  getMatrix(): Dictionary<string, Dictionary<string, number>>{
    return this.matrix || this.buildMatrix();
  }
  buildMatrix(): Dictionary<string, Dictionary<string, number>>{
    const matrix: Dictionary<string, Dictionary<string, number>> = {};
    for (let v1 of this.vertex) {
      matrix[v1.id] = {};
      for (let v2 of this.vertex) {
        matrix[v1.id][v2.id] = U.arrayIntersection(v1.edgesOut, v2.edgesIn).length;
      }
    }
    return this.matrix = matrix;
  }

  static fromMatrix(matrix: Dictionary<string, Dictionary<string, number>>): RawGraph {
    const vertex: RawVertex[] = [];
    const edges: RawEdge[] = [];
    const vertexIDMapping: Dictionary<string, RawVertex> = {};
    let idMax: number = 0;
    for (let key in matrix) {
      const v: RawVertex = new RawVertex(key, null);
      vertex.push(v);
      vertexIDMapping[key] = v;
    }

    const getEdgeID = () => { while (matrix['' + idMax]) idMax++; return '' + idMax; }
    for (let v1key in matrix) {
      for (let v2key in matrix) {
        let count: number = matrix[v1key][v2key];
        while (count-- > 0) {
          const e = new RawEdge(getEdgeID(), vertexIDMapping[v1key], vertexIDMapping[v2key]);
          edges.push(e);
        }
      }
    }
    return new RawGraph(vertex, edges);
  }
}
import KeyDownEvent = JQuery.KeyDownEvent;
import MouseEnterEvent = JQuery.MouseEnterEvent;
import MouseLeaveEvent = JQuery.MouseLeaveEvent;
import ChangeEvent = JQuery.ChangeEvent;
import FocusInEvent = JQuery.FocusInEvent;
import BlurEvent = JQuery.BlurEvent;
import TriggeredEvent = JQuery.TriggeredEvent;
import EventBase = JQuery.EventBase;
import KeyPressEvent = JQuery.KeyPressEvent;
import {split} from 'ts-node';
import KeyUpEvent = JQuery.KeyUpEvent;
import {isNewLine} from '@angular/compiler/src/chars';
import {style} from '@angular/animations';
import {by} from 'protractor';
import {start} from 'repl';

  export class myFileReader {
  private static input: HTMLInputElement;
  private static fileTypes: string [];
  private static onchange: (e: ChangeEvent) => void;
  // constructor(onchange: (e: ChangeEvent) => void = null, fileTypes: FileReadTypeEnum[] | string[] = null) { myFileReader.setinfos(fileTypes, onchange); }
  private static setinfos(fileTypes: FileReadTypeEnum[] | string[] = null, onchange: (e: ChangeEvent, files: FileList, contents: string[]) => void, readcontent: boolean) {
    myFileReader.fileTypes = (fileTypes || myFileReader.fileTypes) as string[];
    const debug: boolean = false;
    debug&&console.log('fileTypes:', myFileReader.fileTypes, fileTypes);
    myFileReader.input = document.createElement('input');
    const input: HTMLInputElement = myFileReader.input;
    myFileReader.onchange = function (e: ChangeEvent): void {
      if (!readcontent) { onchange(e, input.files, null); return; }
      let contentObj = {};
      let fileLetti: number = 0;
      for (let i: number = 0; i < input.files.length; i++) {
        const f: File = input.files[i];
        debug&&console.log('filereadContent['+i+']( file:', f, ')');
        U.fileReadContent(f, (content: string) => {
          debug&&console.log('file['+i+'] read complete. done: ' + ( 1 + fileLetti) + ' / ' + input.files.length, 'contentObj:', contentObj);
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
    //console.log('fileTypes:', myFileReader.fileTypes, 'input:', myFileReader.input);
    $(myFileReader.input).on('change.custom', myFileReader.onchange).trigger('click');
    myFileReader.reset();
  }
}


export class FocusHistoryEntry {
  time: Date;
  evt: FocusInEvent;
  element: Element;
  constructor(e: FocusInEvent, element: Element = null, time: Date = null) {
    this.evt = e;
    this.element = element || e.target;
    this.time = time || new Date();
  }
}

export class InputPopup {
  static popupCounter = 0;
  html: HTMLElement;
  buttonContainer: HTMLElement;
  title: HTMLElement;
  txtPre: HTMLElement;
  input: HTMLElement;
  txtPost: HTMLElement;
  okButton: HTMLButtonElement;
  xbutton: HTMLButtonElement;
  container: HTMLElement;
  innercontainer: HTMLElement;

  $html: JQuery<HTMLElement>;
  $title: JQuery<HTMLElement>;
  $txtPre: JQuery<HTMLElement>;
  $input: JQuery<HTMLElement>;
  $txtPost: JQuery<HTMLElement>;
  $okButton: JQuery<HTMLButtonElement>;
  $xbutton: JQuery<HTMLButtonElement>;
  $container: JQuery<HTMLElement>;
  validators: {validatorCallback: (value: string, input: HTMLElement) => boolean, errormsg: string}[] = [];


  constructor(title: HTMLElement |string = null, txtPre: HTMLElement | string = null, inputOrTag: HTMLElement | string = null, txtPost: HTMLElement |string = null){
    const id = 'popup_' + InputPopup.popupCounter++;
    this.container = U.toHtml('<div data-closebuttontarget="' + id + '" class="screenWideShadow" style="display: none;"></div>');
    this.xbutton = document.createElement('button');
    this.xbutton.classList.add('closeButton');
    this.xbutton.dataset.closebuttontarget = id;
    this.xbutton.innerText = 'X';
    this.html = document.createElement('div');
    this.html.classList.add('popupContent');
    this.buttonContainer = document.createElement('div');
    this.buttonContainer.style.width = '100%';
    this.buttonContainer.style.display = 'flex';
    this.buttonContainer.style.marginTop = '10px';
    this.$container = $(this.container);
    this.$xbutton = $(this.xbutton);
    this.$html = $(this.html);
    this.container.append(this.html);
    this.html.append(this.xbutton);
    U.closeButtonSetup($(this.container));

    if (title || txtPre || txtPost) this.setText(title, txtPre, txtPost);
    this.setInputNode(inputOrTag); }

  addButtons(textornode: string|HTMLButtonElement, onclick: ((e:ClickEvent, value: string, input: HTMLElement, btn: HTMLButtonElement) => any)[], classes: string[] = ['btn-primary']): HTMLButtonElement {
    let btn: HTMLButtonElement;
    if (textornode instanceof HTMLButtonElement) { btn = textornode; }
    else {
      btn = document.createElement('button');
      btn.style.margin = 'auto';
      btn.textContent = textornode;
      btn.classList.add('btn', ...classes); }
    let i: number;
    for (i = 0; i < onclick.length; i++) {
      let clickhandler = onclick[i];
      $(btn).on('click', (e: ClickEvent) => { clickhandler(e, U.getValue(this.input), this.input, btn); });
    }
    this.buttonContainer.append(btn);
    return btn; }

  addOkButton(text: string = 'Confirm', onclick: ((e:ClickEvent, value: string, input: HTMLElement, btn: HTMLButtonElement) => any)[]) {
    onclick = onclick || [];
    text = text || 'Confirm';
    onclick.push((e:ClickEvent, value: string, input: HTMLElement, btn: HTMLButtonElement) => { this.destroy(); });
    U.remove(this.okButton);
    this.okButton = this.addButtons(text, onclick, ['btn-primary']);
    this.$okButton = $(this.okButton); }

  onCloseButton(onclick: ((e:ClickEvent, value: string, input: HTMLElement, btn: HTMLButtonElement) => any)[]) {
    let i: number;
    for (i = 0; i < onclick.length; i++) {
      let func = onclick[i];
      this.$xbutton.on('click.customhandler', (e: ClickEvent) => { func(e, U.getValue(this.input), this.input, this.xbutton); });
    }
  }

  setText(title: string|HTMLElement = '', pre: string | HTMLElement = '', post: string | HTMLElement = ''): void {
    U.remove(this.title);
    U.remove(this.txtPre);
    U.remove(this.txtPost);

    if (typeof title === 'string') {
      this.title = document.createElement('h1');
      this.title.style.textAlign = 'center';
      this.title.innerText = title; }
    else this.title = title;

    if (typeof pre === 'string') {
      this.txtPre = document.createElement('div');
      this.txtPre.innerText = pre; }
    else this.txtPre = pre;

    if (typeof post === 'string') {
      this.txtPost = document.createElement('div');
      this.txtPost.innerText = post; }
    else this.txtPost = post;

    this.$title = $(this.title);
    this.$txtPre = $(this.txtPre);
    this.$txtPost = $(this.txtPost); }

  setNestedInputNode(container: HTMLElement = null, node: HTMLElement, addDefaultEvents: boolean = true): void {
   this.innercontainer = container;
   this.setInputNode(node, null, null, addDefaultEvents); }

  setInputNode(nodeOrTag: HTMLElement | string = null, inputSubType: string = null, pattern: string = null, addDefaultEvents: boolean = true): void {
    if (!this.innercontainer) U.remove(this.input);
    if (nodeOrTag === null) return;
    if (typeof nodeOrTag === 'string') {
      this.input = document.createElement(nodeOrTag);
      //console.log('tadebug', nodeOrTag === 'textarea', nodeOrTag);
      if (nodeOrTag === 'textarea') {
        // this.input.classList.add('form-control'); looks better without, mainly for font-size and overflowing outline
        // this.input.style.fontSize = 'inherit';
        this.input.style.width  = 'calc(75vw - 152px)';
        this.input.style.height = 'calc(75vh - 200px)'; }
      if (nodeOrTag === 'input') {
        this.input.classList.add('form-control', 'form-control-lg');
        this.input.style.width = '100%';
        this.input.style.textAlign = 'center';
        this.input.style.margin = '50px 0'; }
      else {
        this.input.style.width  = 'calc(75vw - 152px)';
        this.input.style.height = 'calc(75vh - 200px)';
        this.input.style.border = '1px solid #ced4da';
        this.input.style.borderRadius = '.25rem;';
        this.input.style.padding = '1rem'; }
    }
    else this.input = nodeOrTag;
    if (inputSubType) { this.input.setAttribute('type', inputSubType); }
    if (pattern) { this.input.setAttribute('pattern', pattern); }
    this.$input = $(this.input);

    if (addDefaultEvents) {
      this.validators.push({validatorCallback: (value: string, input: HTMLElement): boolean => {
          const pattern: string = input.getAttribute('pattern');
          if (!pattern) return true;
          const regex = new RegExp(pattern);
          //console.log('validating pattern:', regex, pattern, value);
          return regex.test(value);
        }, errormsg: 'pattern violated.'});
      this.$input.off('keydown.defaultvalidate').on('keydown.defaultvalidate', (e: KeyDownEvent) => { this.defaultKeydownEvt(e); });
      // $input.off('change.defaultvalidate').on('change.defaultvalidate', (e: BlurEvent) => {this.defaultChangeEvt(e)});
    }
  }

  setInput(value: string = null, placeholder: string = null): void {
    U.pe(!this.input, 'cannot set inputPopup values without setting an input field first.');
    U.setInputValue(this.input, value);
    this.input.setAttribute('placeholder', placeholder || ''); }
/*
  oldconstructor(title: string, txtpre: string, txtpost: string, event: any[][] /* array of (['oninput', onInputFunction])* /,
              placeholder: string = null, value: string, inputType: string = 'input',
                 inputSubType: string = null, onsuccess: ((value: string, input: HTMLElement) => any)[]) {
    const value0 = value;
    if (!value) { value = ''; }
    this.onsuccess = onsuccess ? onsuccess : [];
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
      '<tr><td class="errors" style="display: none;"></td></tr>' +
      '</tbody></table></div>' +
      '</div></div>');
    U.closeButtonSetup($(container));
    this.events = event;
    this.html = container;

    if (inputType === 'textarea') {
      this.getInputNode()[0].setAttribute('style', 'width: calc(75vw - 152px); height: calc(75vh - 200px);');
    }
    this.show();
  }*/
  // events: any[][];
  // onsuccess: ((value: string, input: HTMLElement) => any)[];
  // valid = false;
  // getInputNode(): JQuery<HTMLElement> { return $(this.html).find('.popupInput'); }

  // defaultBlurEvt(e: JQuery.BlurEvent){ this.inputted(); }

  private defaultKeydownEvt(e: KeyDownEvent): void { this.inputted(); }

  private inputted(): void {
    const input: HTMLElement = this.input;
    const value: string = U.getValue(input);
    let i: number;
    let valid: boolean = true;
    for (i = 0; this.validators && i < this.validators.length; i++) {
      const valentry = this.validators[i];
      if (!valentry) continue;
      //console.log('this:', this, 'input:', input, 'value:', value);
      if (!valentry.validatorCallback(value, input)) { this.setErrText(valentry.errormsg); valid = false; }
    }
    this.okButton.disabled = !valid; }

  show(): void {
    document.body.appendChild(this.container);
    this.container.style.display = 'none';
    if (this.title) this.html.appendChild(this.title);
    if (this.xbutton) this.html.appendChild(this.xbutton);
    if (this.innercontainer) this.html.appendChild(this.innercontainer);
    else if (this.input) this.html.appendChild(this.input);
    if (this.txtPre) this.html.appendChild(this.txtPre);
    if (this.txtPost) this.html.appendChild(this.txtPost);
    this.html.appendChild(this.buttonContainer);
    this.$container.slideDown(400);
    if (this.input) this.input.focus(); }

  hide(): void {
    this.container.style.display = 'block';
    this.$container.slideUp(400); }

  destroy(): null {
    this.container.style.display = 'block';
    $(this.container).slideUp(400, () => {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
        this.container = null; }} );
    return null; }

  setErrText(str: string) {
    this.setText(null, null, str);
  }

  setValidation(validatorCallback: (value: string, input: HTMLElement) => boolean, errormsg: string): void {
    if (validatorCallback) this.validators.push({validatorCallback: validatorCallback, errormsg: errormsg}); }

}

export class TagNames{
    static FOREIGNOBJECT: "FOREIGNOBJECT" = "FOREIGNOBJECT";
}
export class CSSRuleSorted{
    public all: CSSStyleRule[];

    constructor(styleNode: HTMLStyleElement) {
        const oldParent = styleNode.parentElement;
        if (!oldParent) document.body.append(styleNode);
        let cssRuleList: CSSRuleList = styleNode.sheet['cssRules'] || styleNode.sheet['rules'];
        this.all = [...cssRuleList as any];
        if (!oldParent) document.body.removeChild(styleNode);
        // if (se aveva parent rimane attaccato lì e non serve fare questo) oldParent.append(styleNode);
      }

  public getCSSMediaRule(): CSSMediaRule[]{
    return this.all.filter( (e, i): boolean => { return e instanceof CSSMediaRule; }) as any[];
  }
  public getCSSStyleRule(): CSSStyleRule[]{
    return this.all.filter( (e, i): boolean  => { return e instanceof CSSStyleRule; }) as any[];
  }
  public notIn(list:CSSStyleRule[]): CSSStyleRule[] {
    return this.all.filter( (e, i): boolean  => { return list.indexOf(e) !== -1; });
  }
}
export class CSSParser {
  static parse(styleNode: HTMLStyleElement): CSSRuleSorted { return new CSSRuleSorted(styleNode); }
}
export enum ShortAttribETypes {
  void = 'void',
  EChar  = 'EChar',
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

export class EvalOutput<T extends Object> {
  outContext: T;
  return: any;
  exception: MyException;
}

class EvalContext {
  private static EC_ParStr: string;
  private static EC_TmpParContext: object;
  private static EC_TmpAllowcontextEvalEdit: boolean;
  private static EC_TmpKey: string;
  static EC_ret: any;
  static EC_exception: MyException;
  constructor(context: object, str: string, allowContextEvalEdit: boolean) {
    EvalContext.EC_TmpAllowcontextEvalEdit = allowContextEvalEdit;
    EvalContext.EC_ParStr = str;
    EvalContext.EC_TmpParContext = context;
    EvalContext.EC_TmpAllowcontextEvalEdit = allowContextEvalEdit;
    EvalContext.EC_ret = undefined;
    EvalContext.EC_exception = null;
    //console.log('evalincontext: this', this, 'context:', context);
    delete this['str'];
    delete this['context'];
    delete this['allowContextEvalEdit'];
    // tengo tutte le chiavi al di fuori per non sporcare "this" con variabili locali mentre faccio diventare "this" una shallowcopy di "context"
    for (EvalContext.EC_TmpKey in EvalContext.EC_TmpParContext) { this['' + EvalContext.EC_TmpKey] = EvalContext.EC_TmpParContext['' + EvalContext.EC_TmpKey]; }
    try { EvalContext.EC_ret = eval(EvalContext.EC_ParStr); } catch (e) { EvalContext.EC_exception = e; }
    if (!EvalContext.EC_TmpAllowcontextEvalEdit) return;
    for (EvalContext.EC_TmpKey in this) { EvalContext.EC_TmpParContext['' + EvalContext.EC_TmpKey] = this['' + EvalContext.EC_TmpKey]; }
  }
}

export class SelectorOutput {
  jqselector: string;
  attrselector: string;
  attrRegex: RegExp;
  exception: any;
  resultSetAttr: Attr[];
  resultSetElem: JQuery<Element>;
}

export class U {
  public static loopcounter = 0;
  public static readonly AttributeSelectorOperator: '->' = '->';
  private static prefix = 'ULibrary_';
  private static sizeofvar: HTMLElement = null;
  private static $sizeofvar: JQuery<HTMLElement> = null;
  private static clipboardinput: HTMLInputElement = null;
  private static PermuteArr: any[][] = [];
  private static PermuteUsedChars: any[] = [];
  private static resizingBorder: HTMLElement = null;
  private static resizingContainer: HTMLElement = null;
  // static he = null;
  private static addCssAvoidDuplicates: Dictionary<string, HTMLStyleElement> = {};
  static $measurableRelativeTargetRoot: JQuery<Element>;
  static varTextToSvg: SVGSVGElement = null;
  private static dblclickchecker: number = new Date().getTime();// todo: move @ start
  private static dblclicktimerms: number = 300;
  static mouseLeftButton: number = 0; // from e.button
  static mouseWheelButton: number = 1;
  static mouseRightButton: number = 2;
  static mouseBackButton: number = 3;
  static mouseForwardButton: number = 4;

  static mouseLeftButtons: number = 1; // "evt.buttons" is binary. 7 = left + right + wheel; 0 = no button pressed.
  static mouseRightButtons: number = 2;
  static mouseWheelButtons: number = 4;
  static mouseBackButtons: number = 8;
  static mouseForwardButtons: number = 16;
  // static vertexOldPos: GraphPoint = null;

  static checkDblClick(): boolean {
    const now: number = new Date().getTime();
    const old: number = U.dblclickchecker;
    U.dblclickchecker = now;
    //console.log('dblclick time:', now - old, now, old);
    return (now - old <= U.dblclicktimerms); }

  public static remove(x: Node): void { if (x && x.parentElement) x.parentElement.removeChild(x); }

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

  static clear(htmlNode: Element) {
    while (htmlNode.firstChild) {
      htmlNode.removeChild(htmlNode.firstChild);
    }
  }

  static clearAllTimeouts(): void {
    const highestTimeoutId: number = setTimeout(() => {}, 1) as any;
    for (let i = 0 ; i < highestTimeoutId ; i++) { clearTimeout(i); }
  }


  private static oneTimeMap: Dictionary<string, boolean> = {};
  // todo: un U.genID() che generi unico a seconda del n° linea di codice da cui viene invocato, o sempre diverso se senza linea (console, eval)
  static getStackTrace(sliceThisCall: boolean = true): string[] {
    const ret: string = Error().stack;
    // try { var a = {}; a.debug(); } catch(ex) { ret = ex.stack; }
    // if (Array.isArray(ret)) return ret;
    if (!ret) return ['UnknownStackTrace'];
    const arr: string[] = ret.split('\n');
    // first 2 entries are "Erorr" and "getStackTrace()"
    return sliceThisCall ? arr.slice(2) : arr; }

  private static sequenceNumber: number = 0;
  private static idMap: Dictionary<string, any> = {};
  public static getID(): string { return this.genID(); }
  public static genID(): string { return 'timedkey_' + new Date().valueOf()+'_' + (this.sequenceNumber++); }
  public static setID(key: string, value: any): void {
    U.idMap[key] = value;
  }
  public static unsetID(key: string): void { delete U.idMap[key]; }
  public static isSetID(key: string): boolean { return U.idMap.hasOwnProperty(key); }
  public static getByID<T>(key: string): T { return U.idMap[key]; }

  public static getCaller(stacksToSkip: number = 1): string {
    const stack: string[] = this.getStackTrace(false);
    return stack[stacksToSkip + 3]; // erase getStackTrace() and isFirstTimeCalled() + Error() first stack + n° of layer the caller wants.
  }
  private static gotcalledby: Dictionary<string, boolean> = {};
  public static isFirstTimeCalledByThisLine(stacksToSkip: number = 1) {
    const caller: string = this.getCaller(stacksToSkip);
    if (U.gotcalledby[caller]) return false;
    return U.gotcalledby[caller] = true; }

  public static lineKey(): string { return this.getCaller(1); }
  public static oneTime(key: string = null, printFunction: (b: boolean, s: any, ...restArgs: any[]) => string, condition: boolean, s: any, ...restArgs: any[]): string {
    if (key === null) key = s;
    if (condition || U.oneTimeMap[key]) return null;
    U.oneTimeMap[key] = true;
    return printFunction(condition, s, restArgs); }

  static petmp(b: boolean, s: any, ...restArgs: any[]): null { return U.pe(b, s, restArgs); }

  static pedev(b: boolean, s: any, ...restArgs: any[]): null {
    // todo: questi sono gli errori che dovrebbero verificarsi solo in caso di errori nel codice, mai in seguito ad azioni utente invalide.
    // quindi dovrebbero avere un sistema di error reporting verso un server con ajax request.
    return U.pe(b, s, ...restArgs); }

  static pe(b: boolean, s: any, ...restArgs: any[]): null {
    if (!b) { return null; }
    if (restArgs === null || restArgs === undefined) { restArgs = []; }
    let str = 'Error:' + s + '';
    for (let i = 0; i < restArgs.length; i++) { str += '' + restArgs[i] + '\t\r\n'; }
    console.error(s, ...restArgs);
    window['lastError'] = [restArgs];
    U.bootstrapPopup(str, 'danger', 5000);
    throw new Error(str); }

  static pw(b: boolean, s: any, ...restArgs: any[]): string {
    if (!b) { return null; }
    if (restArgs === null || restArgs === undefined) { restArgs = []; }
    let str = 'Warning:' + s + '';
    for (let i = 0; i < restArgs.length; i++) { str += '' + restArgs[i] + '\t\r\n'; }
    console.trace();
    console.warn(s, ...restArgs);
    U.bootstrapPopup(str, 'warning', 5000);
    return str; }

  static ps(b: boolean, s: any, ...restArgs: any[]): string {
    if (!b) { return null; }
    if (restArgs === null || restArgs === undefined) { restArgs = []; }
    let str = s + '';
    for (let i = 0; i < restArgs.length; i++) { str += '' + restArgs[i] + '\t\t\r\n'; }
    console.info(s, ...restArgs);
    U.bootstrapPopup(str, 'success', 3000);
    return str; }

  static pif(b: boolean, s: any, ...restArgs: any[]): string {
    if (!b) { return null; }
    return U.p(s, ...restArgs); }

  static p(s: any, ...restArgs: any[]): string {
    if (restArgs === null || restArgs === undefined) { restArgs = []; }
    let str = '' + s;
    for (let i = 0; i < restArgs.length; i++) { str += '' + restArgs[i] + '\t\r\n'; }
    console.info(s, ...restArgs);
    return str; }

  static $alertcontainer: JQuery<HTMLElement> = null;
  static alertcontainer: HTMLElement = null;
  static displayedTexts: Dictionary<string, Element> = {};
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
    div.classList.add('alertshell', 'alert_' + color);
    div.setAttribute('role', 'alert');
    const alertMargin: HTMLElement = document.createElement('div');
    alertMargin.innerHTML = innerhtmlstr;
    if (U.displayedTexts[innerhtmlstr]) return;
    U.displayedTexts[alertMargin.innerHTML] = div;
    container.appendChild(div);
    alertMargin.classList.add('alert', 'alert-' + color);
    div.appendChild(alertMargin);
    const end = () => { $div.slideUp(400, () => {
      delete U.displayedTexts[innerhtmlstr];
      div.parentElement && container.removeChild(div);
    }); }; // div.parentElement: nel caso non sia stato manualmente rimosso.
    $div.on('mousedown', (e: MouseDownEvent) => {
      U.clipboardCopy(innerhtmlstr);
      e.preventDefault();
      e.stopPropagation();
      if (U.mouseRightButton === e.button) {
        let i: number;
        let $popups = $('.alertshell.alert_' + color);
        for (i = 0; i < $popups.length; i++) { delete U.displayedTexts[$popups[i].innerHTML]; }
        $popups.remove();
        return; }
      if (U.mouseWheelButton === e.button) {
        U.displayedTexts = [];
        $('.alertshell').remove();
        return; }
      delete U.displayedTexts[innerhtmlstr];
      div.parentElement && container.removeChild(div);
    });
    $div.hide().slideDown(200, () => setTimeout(end, timer));
  }

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

  // safe con SVG, input, select, textarea.
  public static copyVisibleText(element0: Element): string {
    const element: Element = element0.cloneNode(true) as Element;
    const $element = $(element);
    $element.remove(':hidden');
    $element.remove('.addFieldButtonContainer');
    $element.find('input, textarea').addBack('input, textarea').each( (i, e: HTMLInputElement | HTMLTextAreaElement)=> {
      const replacement = document.createElement('div');
      replacement.dataset.replacement = "1";
      replacement.innerText = e.value;
      U.swap(e, replacement);
    });
    $element.find('select').addBack('select').each( (i, e: HTMLSelectElement)=> {
      const replacement = document.createElement('div');
      replacement.dataset.replacement = "1";
      replacement.innerText = e.selectedIndex >= 0 ?  e.options[e.selectedIndex].text : '';
      U.swap(e, replacement);
    });
    U.pe(!!$element.find('select, input, textarea').length,
     'input remaining:', $element.find('select, input, textarea').addBack('select, input, textarea'));
    // console.log('copyVisibleText() textcontent of:', element, U.getRawInnerText(element));
    return U.getRawInnerText(element); }

  // safe con SVG, !! NON safe con input, textarea e select
  private static getRawInnerText(element: Element, win: Window = null): string {
    let userselect: string, msuserselect: string, wkuserselect: string;
    if (element['style']) {
      let e: HTMLElement = element as any;
      userselect = e.style.userSelect;
      msuserselect = e.style.msUserSelect;
      wkuserselect = e.style.webkitUserSelect;
      e.style.userSelect = 'all'; // text
      e.style.msUserSelect = 'all';
      e.style.webkitUserSelect = 'all';
    }
    win = win || window;
    const doc = win.document;
    const wasInDocument = U.isChildrenOf(element, doc.body);
    if (!wasInDocument) { doc.body.appendChild(element); }
    let sel: Selection, range: Range, prevRange: Range, selString: string;
    sel = win.getSelection();
    if (sel.rangeCount) {
      prevRange = sel.getRangeAt(0);
    }
    range = doc.createRange();
    range.selectNodeContents(element);
    sel.removeAllRanges();
    sel.addRange(range);
    selString = sel.toString();
    sel.removeAllRanges();
    prevRange && sel.addRange(prevRange);
    if (!wasInDocument) { doc.body.removeChild(element); }
    if (element['style']) {
      let e: HTMLElement = element as any;
      if (userselect) { e.style.userSelect = userselect; }
      if (msuserselect) { e.style.msUserSelect = userselect; }
      if (wkuserselect) { e.style.webkitUserSelect = userselect; }
    }
    return selString; }

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

  // can replace templates on the root node, canNOT avoid cloning parameter node
  public static replaceVars<T extends Element>(obj: object, elem: T, debug: boolean = false): T {
    /// see it in action & parse or debug at
    // v1) perfetto ma non supportata in jscript https://regex101.com/r/Do2ndU/1
    // v2) usata: aggiustabile con if...substring(1). https://regex101.com/r/Do2ndU/3
    // get text between 2 single '$' excluding $$, so they can be used as escape character to display a single '$'
    // console.log('html0:', html0, 'html:', html);
    U.pe(!(elem instanceof Element), 'target must be a html node.', elem);
    let container = elem.parentElement;
    const wasDetached = !container;
    if (wasDetached) {
      container = document.createElement('div');
      container.append(elem);
      console.info (container, elem); }
    container.innerHTML = U.replaceVarsString(obj, container.innerHTML, debug);
    U.pif(debug, 'ReplaceVars() return = ', container.innerHTML);
    elem = container.firstElementChild as T;
    if (wasDetached) { container.removeChild(elem);}
    return elem; }

  // cannot replace templates on the root node, can avoid cloning parameter node.
  public static replaceVarsInnerOnly<T extends Element>(obj: object, html0: T, cloneHtml = true, debug: boolean = false): T {
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

  private static replaceVarsString0(obj: object, str: string, escapeC: string[] = null, replacer: string[] = null, debug: boolean = false): string {
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

  public static replaceVarsString(obj: object, htmlStr: string, debug: boolean = false): string {
    U.pe(!obj || !htmlStr, 'parameters cannot be null. obj:', obj, ', htmlString:', htmlStr);
    //  https://stackoverflow.com/questions/38563414/javascript-regex-to-select-quoted-string-but-not-escape-quotes
    //  good regex fatto da me https://regex101.com/r/bmWVrp/4

    if (U.isFunction((obj as any).preReplace)) (obj as any).preReplace();
    // only replace content inside " quotes. (eventually escaping ")
    htmlStr = U.QuoteReplaceVarString(obj, htmlStr, '"', debug);
    // only replace content inside ' quotes. (eventually escaping ')
    htmlStr = U.QuoteReplaceVarString(obj, htmlStr, '\'', debug);
    // replaces what's left outside any quotation. (eventually escaping <>)
    htmlStr = U.replaceVarsString0(obj, htmlStr, ['<', '>'], ['&lt;', '&gt;']);
    return htmlStr; }

  private static QuoteReplaceVarString(obj: object, htmlStr: string, quote: string, debug: boolean = false): string {
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
    /////////////////// debug start
    if (isBase64) {
      isBase64 = false;
      // varname = 'name';
    }

    /////////////////////// debug end
    if (isBase64) { U.pe(true, 'base64 unimplemented, varname:', varname); varname = atob(varname); }
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

  static sizeof(element0: Element, debug: boolean = false): Size {
    let element: HTMLElement = element0 as HTMLElement;
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
      visibile[i] = (ancestors[i].style === undefined) ? true : (ancestors[i].style.display !== 'none');
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


  static ancestorFilter<T extends Element>(selector: string, domelem: T, stopNode: Element = null, includeSelf: boolean = true): JQuery<T> {
    return $(U.ancestorArray(domelem, stopNode, includeSelf)).filter(selector); }

  static ancestorArray<T extends Element>(domelem: T, stopNode: Element = null, includeSelf: boolean = true): Array<T> {
    // [0]=element, [1]=father, [2]=grandfather... [n]=document
    if (domelem === null || domelem === undefined) { return []; }
    const arr = includeSelf ? [domelem] : [];
    let tmp: T = domelem.parentNode as T;
    while (tmp !== null && tmp != stopNode) {
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

  static toHtmlValidate(text: string): Element {
    const html: Element = U.toHtml(text);
    if (html.innerHTML === text.replace(/\s+/gi,  '')) return html;
    return null;
  }

  static toHtmlRow(html: string): HTMLTableRowElement {
    return U.toHtml<HTMLTableRowElement>(html, U.toHtml('<table><tbody></tbody></table>').firstChild as HTMLElement);
  }

  static toHtmlCell(html: string): HTMLTableCellElement {
    return U.toHtml<HTMLTableCellElement>(html, U.toHtml('<table><tbody><tr></tr></tbody></table>').firstChild.firstChild as HTMLElement);
  }

  static toHtml<T extends Element>(html: string, container: Element = null, containerTag: string = 'div'): T {
    if (container === null) { container = document.createElement(containerTag); }
    if (!html || html === '') return null;
    container.innerHTML = html;
    const ret: T = container.firstChild as any;
    if (ret) container.removeChild(ret);
    return ret; }

  static toBase64Image(html: Element, container: Element = null, containerTag: string = 'div'): string {
    // https://github.com/tsayen/dom-to-image
    return 'HtmlToImage todo: check https://github.com/tsayen/dom-to-image'; }


  static getParentLine(node: Node, parentLimit: Element = null, bottomToTopOrder: boolean = true, includeparentlimit: boolean = false, includenode: boolean = false): Element[] {
    const arr: Element[] = [];
    if (includenode) arr.push(node as any);
    U.pe(!node, 'U.getParentLine() node argument cannot be null.');
    while (node.parentElement && node.parentElement !== parentLimit) { arr.push(node = node.parentElement);}
    if (includeparentlimit && node.parentElement === parentLimit) arr.push(parentLimit);
    return bottomToTopOrder ? arr : arr.reverse(); }

  /**
   * checks if nodes have a vertical line relationship in the tree (parent, grandparent, ...);
   * @ return {boolean}
   */
  static isParentOf(parent: Element, child: Node): boolean {
    //  parent chains:   element -> ... -> body -> html -> document -> null
    while (child !== null) {
      if (parent === child) { return true; }
      child = child.parentNode;
    }
    return false;
  }

  static isChildrenOf(child: Node, parent: Element) {
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
    const metaParentName = Json.read(childJson, XMIModel.namee, null);
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
    if (!arr) return;
    while (true) {
      index = arr.indexOf(elem);
      U.pif (debug, 'ArrayRemoveAll: index: ', index, '; arr:', arr, '; elem:', elem);
      if (index === -1) { return; }
      arr.splice(index, 1);
      U.pif (debug, 'ArrayRemoveAll RemovedOne:', arr);
    }
  }

  static arraySubstr<T>(arr: Array<T>, start: number, length: number = null): Array<T> { return arr ? arr.slice(start, start + length) : arr; }
  static arraySubstringSlice<T>(arr: Array<T>, start: number, end: number = null): Array<T> { return arr ? arr.slice(start, end) : arr; }

  static eventiDaAggiungereAlBody(selecteds: string) {
    // todo: guarda gli invocatori
  }

  private static GeomTolerance = 0; // 0.001;
  static isOnEdge(pt: GraphPoint, shape: GraphSize, tolerance: number = null): boolean {
    return U.isOnHorizontalEdges(pt, shape, tolerance) || U.isOnVerticalEdges(pt, shape, tolerance); }

  static isOnVerticalEdges(pt: GraphPoint, shape: GraphSize, tolerance: number = null): boolean {
    return U.isOnLeftEdge(pt, shape, tolerance) || U.isOnRightEdge(pt, shape, tolerance); }

  static isOnHorizontalEdges(pt: GraphPoint, shape: GraphSize, tolerance: number = null): boolean {
    return U.isOnTopEdge(pt, shape, tolerance) || U.isOnBottomEdge(pt, shape, tolerance); }

  static isOnRightEdge(pt: GraphPoint, shape: GraphSize, tolerance: number = null): boolean {
    if (!pt || !shape) { return null; }
    if (tolerance === null) tolerance = U.GeomTolerance;
    if (tolerance) return Math.abs(pt.x - (shape.x + shape.w)) < tolerance
      && ( pt.y - (shape.y) > tolerance && pt.y - (shape.y + shape.h) < tolerance);
    return (pt.x === shape.x + shape.w) && (pt.y >= shape.y && pt.y <= shape.y + shape.h);

  }

  static isOnLeftEdge(pt: GraphPoint, shape: GraphSize, tolerance: number = null): boolean {
    if (!pt || !shape) { return null; }
    if (tolerance === null) tolerance = U.GeomTolerance;
    if (tolerance) return Math.abs(pt.x - shape.x) < tolerance
      && (pt.y - (shape.y) > tolerance && pt.y - (shape.y + shape.h) < tolerance);
    return (pt.x === shape.x) && (pt.y >= shape.y && pt.y <= shape.y + shape.h);
  }

  static isOnTopEdge(pt: GraphPoint, shape: GraphSize, tolerance: number = null): boolean {
    if (!pt || !shape) { return null; }
    if (tolerance === null) tolerance = U.GeomTolerance;
    if (tolerance) return Math.abs(pt.y - shape.y) < tolerance
      && (pt.x - (shape.x) > tolerance && pt.x - (shape.x + shape.w) < tolerance);
    return (pt.y === shape.y) && (pt.x >= shape.x && pt.x <= shape.x + shape.w);
  }

  static isOnBottomEdge(pt: GraphPoint, shape: GraphSize, tolerance: number = null): boolean {
    if (!pt || !shape) { return null; }
    if (tolerance === null) tolerance = U.GeomTolerance;
    if (tolerance) return Math.abs(pt.y - shape.y + shape.h) < tolerance
      && (pt.x - (shape.x) > tolerance && pt.x - (shape.x + shape.w) < tolerance);
    return (pt.y === shape.y + shape.h) && (pt.x >= shape.x && pt.x <= shape.x + shape.w);
  }
  // usage: var scope1 = makeEvalContext("variable declariation list"); scope1("another eval like: x *=3;");
  // remarks: variable can be declared only on the first call, further calls on a created context can only modify the context without expanding it.

  public static evalInContext<T extends object>(context: T, str: string, allowcontextEvalEdit: boolean = true): EvalOutput<T> {
    const out: T = new EvalContext(context, str, allowcontextEvalEdit) as any; // becomes a copy of T
    const ret: EvalOutput<T> = new EvalOutput<T>();
    ret.outContext = allowcontextEvalEdit ? context : out; // context contiene l'oggetto originario, out contiene la shallowcopy modificata dall'eval.
    ret.return = EvalContext.EC_ret;
    ret.exception = EvalContext.EC_exception;
    return ret; }

  // same as above, but with dynamic context, although it's only extensible manually and not by the eval code itself.
  static evalInContextOld(context, js): any {
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
        let html: HTMLElement = e.target;
        const target: string = html.dataset.closebuttontarget;
        html = html.parentElement;
        U.pif(debug, 'html:', html, 'target:', e.target, 'targetstr:', target, 'dataset:', e.target.dataset);
        while (html && html.dataset.closebuttontarget !== target) {
          U.pif(debug, 'html:', html, ', data:', (html).dataset.closebuttontarget, ' === ' + target);
          html = html.parentElement;
        }
        U.pif(debug, 'html:', html);
        U.pe(!html, 'closeTarget not found: event trigger:', e.target, 'html:', html);
        $(html).hide();
      });
  }

  static insertAt(arr: any[], index: number, elem: any): void {
    if (index >= arr.length) { arr.push(elem); return; }
    arr.splice(index, 0, elem);
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

  static removeAllNgAttributes($root:JQuery<Element>): void {
    let attrs: Attr[] = U.getAllAttributes($root, (a) => !!a.name.match('ng\-|_ng'));
    for (let attr of attrs) {
      if (!attr.ownerElement) continue;
      attr.ownerElement.removeAttributeNode(attr);
    }
  }

  static getAllAttributes($root: JQuery<Element> = null, matcher: (a: Attr) => boolean): Attr[] {
    if (!$root) $root = $(document) as any;
    const $elems = $root.find('*').addBack();
    const ret: Attr[] = [];
    for (let elem of $elems) {
      if (elem.attributes) Array.prototype.push.apply(ret, Array.prototype.filter.call(elem.attributes, matcher));
    }
    return ret;
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

  static removeemptynodes(root: Element, includeNBSP: boolean = false, debug: boolean = false): Element {
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

  static RGBAToHex(str: string, prefix = '#', postfix = ''): string {
    return U.RGBAToHexObj(str, prefix, postfix).rgbahex;
  }

  static HexToHexObj(str: string): {r: number, g: number, b: number, a: number} {
    str = U.replaceAll(str, '#', '');
    let byteLen: number;
    switch(str.length){
      default: return null;
      case 3: case 4: byteLen = 1; break; // rgb & rgba con 1 byte color depth
      case 6: case 7: case 8: byteLen = 2; break;
    }
    const arr: number[] = [];
    let pos = 0;
    let strval: string;
    let val: number;
    while(true){
      strval = str.substr(pos, byteLen);
      if (!strval) break;
      if (strval.length === 1) strval += strval; // f -> ff, 0 -> 00, 7 -> 77 nb: non usare byteLen, l'ultimo valore può avere bytelen diversa (RR GG BB A)
      val = Number.parseInt(strval, 16);
      if (isNaN(val)) return null;
      arr.push(val);
      pos += byteLen;
    }
    if (arr.length < 3) return null;
    return {r: arr[0], g: arr[1], b: arr[2], a: arr[3]};
  }

  static colorObjToArgb(colorObj: {r: number, g: number, b: number, a: number}, prefix = '#', postfix = ''): {r: number, g: number, b: number, a: number, rgbhex: string, rgbahex: string} {
    const ret = colorObj as {r: number, g: number, b: number, a: number, rgbhex: string, rgbahex: string};
    let tmp = prefix + U.toHex(ret.r, 2) + U.toHex(ret.g, 2) + U.toHex(ret.b, 2);
    ret.rgbhex = tmp + postfix;
    ret.rgbahex =  tmp + U.toHex(ret.a || ret.a === 0 ? ret.a : 255, 2) + postfix;
    return ret;
  }

  static RGBAToHexObj(str: string, prefix = '#', postfix = ''): {r: number, g: number, b: number, a: number, rgbhex: string, rgbahex: string} {
    str = U.replaceAll(str, 'a', '');
    str = U.replaceAll(str, 'rgb', '');
    str = U.replaceAll(U.replaceAll(str, '(', ''), ')', '');
    const rgb = str.split( ',' );
    const ret = {
      r: parseInt( rgb[0] ), //.toString(16); // .substring(4) skip rgb(
      g: parseInt( rgb[1] ),
      b: parseInt( rgb[2] ), // parseInt scraps trailing )
      a: rgb[3] && rgb[3].length ? 255 * (+rgb[3]) : 255,
    };
    return U.colorObjToArgb(ret);
  }

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
    // console.log('old, size, min', oldSize, size, minSize, oldSize.w && size.equals(minSize));
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
    const puntoDaFarCoinciderePT: Point = cursor.duplicate();
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
    // console.log('container:', container, 'content:', content);
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
    t.style.borderTop = tl.style.borderTop = tr.style.borderTop = style.borderTop; // || '0';
    b.style.borderBottom = bl.style.borderBottom = br.style.borderBottom = style.borderBottom; // || '0';
    l.style.borderLeft = tl.style.borderLeft = bl.style.borderLeft = style.borderLeft; // || '0';
    r.style.borderRight = tr.style.borderRight = br.style.borderRight = style.borderRight; // || '0';

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

  // returns true only if parameter is already a number by type. U.isNumber('3') will return false
  static isNumber(o: any): boolean { return +o === o && !isNaN(o); }
  // returns true only if parameter is a number or a stringified number. U.isNumber('3') will return true
  static isNumerizable(o: any): boolean { return o !== null && o !== undefined && o !== '' && !isNaN(+o); }
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
    // nb: mind that typeof [] === 'object'
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
    let prefix: string;
    let num: number;
    if (!matches) {
      prefix = s;
      num = 2;
    } else {
      U.pe(matches.length > 2, 'parsing error: /' + regexpstr + '/gs.match(' + s + ')');
      let i = s.length - matches[0].length;
      prefix = s.substring(0, i);
      num = 1 + (+matches[1]);
      // U.pe(isNaN(num), 'wrong parsing:', s, s.substring(i, numberEnd), i, numberEnd);
      // const prefix: string = s.substring(0, i);
      // console.log('increaseendingNumber:  prefix: |' + prefix+'| num:'+num, '[i] = ['+i+']; s: |'+s+"|");

    }
    while (increaseWhile !== null && increaseWhile(prefix + num)) { num++; }
    return prefix + num; }

  static isValidName(name: string): boolean { return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name); }

  static getTSClassName(thing: any): string {
    if (!thing || !thing.constructor) return typeof(thing);
    return thing.constructor.name + ''; }

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
        // console.log('others:', otherButtons, 'me:', $btn);
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

  static SetMerge<T>(modifyFirst: boolean = true, ...iterables: Iterable<T>[]): Set<T> {
    const set: Set<T> = modifyFirst ? iterables[0] as Set<T>: new Set<T>();
    U.pe(!(set instanceof Set), 'U.SetMerge() used with modifyFirst = true requires the first argument to be a set');
    for (let iterable of iterables) { for (let item of iterable) { set.add(item); } }
    return set; }

  static MapMerge<K, V>(modifyFirst: boolean = true, ...maps: Map<K, V>[]): Map<K, V> {
    const ret: Map<K, V> = modifyFirst ? maps[0] : new Map<K, V>();
    let i: number;
    for (i = 0; i < maps.length; i++) { maps[i].forEach(function(value, key){ ret.set(key, value); }) }
    return ret; }

  static ArrayMerge(arr1: any[], arr2: any[], unique: boolean = false): void {
    if (!arr1 || !arr2) return;
    if (!unique) Array.prototype.push.apply(arr1, arr2);
    let i: number;
    for (i = 0; i < arr2.length; i++) { U.ArrayAdd(arr1, arr2[i]); } }

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

  // ignores first N equal chars and return the substring of s1 from N to N+len or until s1 end.
  public static strFirstDiff(s1: string, s2: string, len: number): string[] {
    let i: number;
    if (!s1 && !s2) { return [s1, s2]; }
    if (s1 && !s2) { return [s1.substr(0, len), s2]; }
    if (!s1 && s2) { return [s1, s2.substr(0, len)]; }
    const min: number = Math.min(s1.length, s2.length);
    for (i = 0; i < min; i++) { if (s1[i] !== s2[i]) { return [s1.substr(i, len), s2.substr(i, len)]; } }
    return null; }

  // get the index of the first char not equal between s1 and s2 or null if one of the string ended.
  public static strFirstDiffIndex(s1: string, s2: string): number{
    let i: number = -1;
    if (!s1 || !s2) return -1;
    let minlen: number = Math.min(s1.length, s2.length);
    // console.log('strequal minlen:', minlen, '|'+s1+'|', '|'+s2+'|');
    for (i = -1; ++i < minlen && s1[i] === s2[i];) {
      // console.log('strequal:', i, 's1:', s1[i], 's2', s2[i], true);
    }
    return i; }

  public static mergeArray(a: any[], b: any[], inplace: boolean, asSet: boolean): any[] {
    a = a || [];
    b = b || [];
    let ret: any[];
    if (inplace) { (ret = a).push(...b); } else { ret = a.concat(...b); }
    return asSet ? [...new Set(ret)] : ret; }

  public static mergeClasses(elem1: Element, elem2: Element): void {
    const classes1: string[] = elem1.getAttribute('class').split(' ');
    const classes2: string[] = elem2.getAttribute('class').split(' ');
    elem1.setAttribute('class', U.mergeArray(classes1, classes2, true, true).join(' ')); }

  public static mergeStyles(html: Element, fake: Element = null, styleString: string = null, prioritizeFake: boolean = false): void {
    let i: number;
    const styles1: any[] = html.getAttribute('style').split(';');
    const styles2: any[] = (styleString = (styleString ? styleString : fake.getAttribute('style'))).split(';');
    let stylesKv1: Dictionary<string, string> = {};
    let stylesKv2: Dictionary<string, string> = {};
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
    if (prioritizeFake) {
      let tmp = stylesKv1;
      stylesKv1 = stylesKv2;
      stylesKv2 = tmp; }
    stylesKv1 = U.join(stylesKv1, stylesKv2, true, false);
    let style: string = '';
    for (key in stylesKv1) { style += key + ':' + stylesKv1[key] + '; '; }
    // console.log('final Style:', style, stylesKv1, stylesKv2, styles2);
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

  public static getChildIndex<T>(array: T[] | any, child: T | any): number {
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

  static followIndexesPath(root: any, indexedPath: (number | string)[], childKey: string,
                           outArr: {indexFollowed: (number | string)[], debugArr: {index: string | number, elem: any}[]} = {indexFollowed: [],
                             debugArr: [{index: 'Start', elem: root}]}, debug: boolean = false): any
  {
    let j: number;
    let ret: any = root;
    let oldret: any = ret;
    U.pe(!childKey, 'must define a childkey', childKey);
    if (outArr) outArr.debugArr.push({index: 'start', elem: root, childKey: childKey} as any);
    debug = +window['debugi'] === 1;
    U.pe(childKey && childKey !== '' + childKey, 'U.followIndexesPath() childkey must be a string or a null:', childKey, 'root:', root);
    for (j = 0; j < indexedPath.length; j++) {
      let key: number | string = indexedPath[j];
      let childArr = childKey ? ret[childKey] : ret;
      U.pif(debug, 'path ' + j + ') = elem.' + childKey + ' = ', childArr);
      if (!childArr) { U.pif(debug, 'U.followIndexEnd 1:', outArr); return oldret; }
      ret = childArr[key];
      if (key >= childArr.length) { key = 'Key out of boundary: ' + key + '/' + childArr.length + '.'; }
      U.pif(debug, 'path ' + j + ') = elem.' + childKey + '[ ' + key + '] = ', ret);
      if (outArr) outArr.debugArr.push({index: key, elem: ret});
      if (!ret) { U.pif(debug, 'U.followIndexEnd 2:', outArr); return oldret; }
      if (outArr) outArr.indexFollowed.push(key);
      oldret = ret;
    }
    U.pif(debug, 'U.followIndexEnd 3:', outArr);
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

  static removeDuplicates(arr0: any[], clone: boolean = false): any[] { return U.mergeArray(arr0, [], !clone, true); }

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

  static toBoolString(bool: boolean, ifNotBoolean: boolean = false): string { return bool === true ? 'true' : (bool === false ? 'false' : '' + ifNotBoolean); }
  static fromBoolString<T>(str: string | boolean, defaultVal: boolean | T = false, allowNull: boolean = false, allowUndefined: boolean = false): boolean | T {
    str = ('' + str).toLowerCase();
    if (allowNull && (str === 'null')) return null;
    if (allowUndefined && (str === 'undefined')) return undefined;

    if (str === "true" || str === 't' || str === '1') return true;
    // if (defaultVal === true) return str === "false" || str === 'f' || str === '0'; // false solo se è esplicitamente false, true se ambiguo.
    if (str === "false" || str === 'f' || str === '0') return false;
    return defaultVal;
  }

  static parseNumberOrBoolean(val: string, params: ParseNumberOrBooleanOptions = new ParseNumberOrBooleanOptions()): number {
    let booleanTry: boolean | '' = U.fromBoolString(val, '', true, true);
    // console.log("isAllowingEdge parsenumberorboolean:", booleanTry, "|", params, "|", val);
    switch ('' + booleanTry) {
      default: U.pe(true, "dev error, unexpected case on U.parseNumberOfBoolean: ", val, ' = ', booleanTry); break;
      case 'true': if (params.allowBooleans) return params.trueValue; break;
      case 'false': if (params.allowBooleans) return params.falseValue; break;
      case 'undefined': if (params.allowUndefined) return params.undefinedValue; break;
      case 'null': if (params.allowNull) return params.nullValue; break;
      case '':
        let valnumber: number = +val;
        if (isNaN(valnumber)) return params.allowedNan ? params.nanValue : params.defaultValue;
        return valnumber;
    }
    return params.defaultValue;
  }

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

  public static focusHistoryEntriesAndIdleTimes: (FocusHistoryEntry | null)[] = undefined;
  public static focusHistoryEntries: FocusHistoryEntry[] = undefined;
  public static focusHistoryElements: Element[] = undefined;
  public static focusHistorySetup(): void {
    U.focusHistoryEntries = U.focusHistoryEntries || [];
    U.focusHistoryElements = U.focusHistoryElements || [];
    U.focusHistoryEntriesAndIdleTimes = U.focusHistoryEntriesAndIdleTimes || [];
    $(document).off('focusin.history').on('focusin.history', (e: FocusInEvent) => {
      const element: Element = e.target;
      // if (document.activeElement === element) return; // do i need to avoid duplicates or not?
      const entry = new FocusHistoryEntry(e, element);
      U.focusHistoryEntriesAndIdleTimes.push(entry);
      U.focusHistoryElements.push(element);
      U.focusHistoryEntries.push(entry);
      setTimeout(() => { U.focusHistoryEntriesAndIdleTimes.push(null); }, 0);
    });
  }
  public static focusHistoryReset(): void {
    U.focusHistoryEntries = [];
    U.focusHistoryElements = []; }
  public static getLastFocusEntry(): FocusHistoryEntry {
    U.pe(!U.focusHistoryEntries, 'focus history not initializated. call U.focusHistorySetup() before');
    return U.focusHistoryEntries[U.focusHistoryEntries.length]; }
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

  static isInput(target: Node, deep_up: boolean, select: boolean = true, input: boolean = true,
                 textarea: boolean = true, contenteditable: boolean = true): boolean {
    let tag: string;
    let attrcontenteditable: string;
    let inputcheck: string = input ? 'input' : 'mustfail';
    let selectcheck: string = select ? 'select' : 'mustfail';
    let textareacheck: string = textarea ? 'textarea' : 'mustfail';
    while (target) {
      if (target === window.document) return false;
      let targetElement: Element = target instanceof Element ? target : null;
      tag = targetElement ? targetElement.tagName.toLowerCase() : null;
      if (tag === inputcheck || tag === selectcheck || tag === textareacheck) {
        // console.log('isInput:', target);
        return true; }
      attrcontenteditable = contenteditable && targetElement ? targetElement.getAttribute('contenteditable') : null;
      if (attrcontenteditable === '' || attrcontenteditable === 'true') {
        // console.log('isInput:', target);
        return true; }
      if (!deep_up) return false;
      target = target.parentNode;
    }
    return false;
  }
  static getValue(input0: Element): string {
    if (!input0) return null;
    const input: HTMLInputElement = (input0 instanceof HTMLInputElement) ? input0 : null;
    if (input) return input.value;
    const textarea: HTMLTextAreaElement = (input0 instanceof HTMLTextAreaElement) ? input0 : null;
    if (textarea) return textarea.value;
    return input0.getAttribute('value') || input0['' + 'innerText'] || input0.innerHTML; }

  static followsPattern(input0: Element, value: string = null): boolean {
    let input: HTMLInputElement = (input0 instanceof HTMLInputElement) ? input0 : null;
    let pattern: string = input ? input.pattern : input0.getAttribute('pattern');
    if (pattern === null || pattern === undefined) return true;
    const val = value || (input ? input.value : U.getValue(input0));
    const regex =  new RegExp(pattern);
    return regex && regex.test(val); }

  static trimStart(s: string, trimchars: string[]): string {
    let i: number;
    for (i = 0; i < s.length && trimchars.indexOf(s[i]) !== -1; i++) { ; }
    return s.substr(i); }

  static arraySubtract(arr1: any[], arr2: any[], inPlace: boolean): any[]{
    let i: number;
    const ret: any[] = inPlace ? arr1 : [...arr1];
    for (i = 0; i < arr2.length; i++) { U.arrayRemoveAll(ret, arr2[i]); }
    return ret; }

  static getAttributesByRegex(elem: Element, regexp: RegExp): Attr[]{
    const ret: Attr[] = [];
    let i: number;
    for (i = 0; i < elem.attributes.length; i++) {
      const attr: Attr = elem.attributes[i];
      if (regexp.test(attr.name)) ret.push(attr); }
    return ret; }

  static getAttributes(elem: Element, validator: (a: Attr) => boolean): Attr[] {
    const ret: Attr[] = [];
    let i: number;
    for (i = 0; i < elem.attributes.length; i++) {
      const attr: Attr = elem.attributes[i];
      if (validator(attr)) ret.push(attr); }
    return ret; }

  static getRelativeParentNode(elem: Element): Element {
    U.pe(!elem || !(elem instanceof Element), 'U.getRelativeParentNode argument must be an Element, found instead:', elem);
    while ((elem = elem.parentElement)) {
      if (window.getComputedStyle(elem).position === 'relative') { return elem; } }
    return document.body; }

  static swapChildrens(node1: Node, node2: Node): void {
    const arr: Node[] = Array.from(node1.childNodes);
    let i: number;
    for (i = 0; i < node2.childNodes.length; i++) { node1.appendChild(node2.childNodes[i]); }
    for (i = 0; i < arr.length; i++) { node2.appendChild(arr[i]); }
  }
  static swap(node1: Node, node2: Node): void {
    U.pe(node1 && !(node1 instanceof Node) || node2 && !(node2 instanceof Node), 'aU.swap() arguments mudt be nodes, found instead:', node1, node2);
    const parent1: Node = node1.parentNode;
    const parent2: Node = node2.parentNode;
    // const next1: Node = node1.nextSibling; // qui non è necessario
    const next2: Node = node2.nextSibling; // se non metto almeno next2, il secondo insertBefore fallisce perchè node2 è stato spostato.
    //console.log('if (parent1 (', parent1, '))  parent1.insertBefore(', node2, node1, '); parent1.removeChild(', node1, '); }');
    //console.log('if (parent2 (', parent2, '))  parent2.insertBefore(', node1, next2, '); parent2.removeChild(', node2, '); }');
    if (parent1) {  parent1.insertBefore(node2, node1); parent1.removeChild(node1); }
    if (parent2) {  parent2.insertBefore(node1, next2); parent2.removeChild(node2); }
  }

  static validateDatalist(input: HTMLInputElement, addinvalidclass: boolean = true, checkByValueAttribute: boolean = true): boolean {
    const debug: boolean = false;
    debug&&console.log('validateDatalist() input.list', input.list);
    if (!input.list) return true;
    let valid: boolean;
    if (checkByValueAttribute) {
      debug&&console.log($(input.list), '.find(\'option[value="' + input.value + '"]');
      valid = $(input.list).find('option[value="' + input.value + '"]').length >= 1;
    } else {
      const arr: JQuery<HTMLOptionElement> = $(input.list).find('option[value="' + input.value + '"]') as any;
      let i: number;
      valid = false;
      for (i = 0; i < arr.length; i++) { if (arr[i].innerText === input.value) { valid = true; break; }}
    }
    debug&&console.log('input:', input, 'addclass:', addinvalidclass, 'valid:', valid);
    if (addinvalidclass){
      if (valid){ input.removeAttribute('invalidDataList'); }else{ input.setAttribute('invalidDataList', 'true'); }
    }
    return valid; }

    /// usage: U.varname({wrappedVariableName}) = 'wrappedVariableName';
  static varname(wrappedVariable: object): string { return Object.keys(wrappedVariable)[0]; }
  static varname2(parentObject: object, variable: object): string {
    for (let key in parentObject) { if (parentObject[key] === variable) return key; }
    U.pe(true, 'not a valid parent:', parentObject, variable); }

  static isTriggered(e: Event | TriggeredEvent | EventBase): boolean {
    // nb: actually JQ.ClickEvent implements JQ.EventBase extends JQ.TriggeredEvent that extends Event (native)
    // but for some reason the IDE is telling me clickEVent is a TriggeredEVent but not not an Event.
    let ist = !!e['isTrigger'];
    let orig = !!e['originalEvent'];
    U.pe(ist === orig, 'assertion failed (istrigger):', ist, orig);
    return ist; }

  static ArrayToMap(arr: (string | number | boolean)[], useIndexesAsValues: boolean = false): Dictionary<string, boolean | number> { return U.toMap(arr, useIndexesAsValues); }
  static toDictionary(arr: (string | number | boolean)[], useIndexesAsValues: boolean = false): Dictionary<string, boolean | number> { return U.toMap(arr, useIndexesAsValues); }
  static toMap(arr: (string | number | boolean)[], useIndexesAsValues: boolean = false): Dictionary<string, boolean | number> {
    const ret: Dictionary<string, boolean | number> = {};
    for (let i = 0; i < arr.length; i++) { ret['' + arr[i]] = useIndexesAsValues ? i : true; }
    // arr.reduce((accumulator,curr)=> (accumulator[curr]='',accumulator), {}); // geniale da stackoverflow (accumulator was "acc")
    return ret; }

  static isUnset(val: any, ignorespaces: boolean = true, parseStrings: boolean = true, ifemptystr: boolean = false, ifnull: boolean = true, ifundef: boolean = true, ifzero: boolean = false): boolean{
    if (val === '' + val) {
      if (ignorespaces) val = val.trim();
      if (val === '') return ifemptystr;
      if (!parseStrings) return true;
      if (val === 'null') return ifnull;
      if (val === 'undefined') return ifundef;
      if (val === '0') return ifzero; }

    if (val) return true;
    if (val === null) return ifnull;
    if (val === undefined) return ifundef;
    if (val === 0) return ifzero;
    U.pe(true, 'isUnset() should not reach here', val);
    return true; }
  static findGetParameter(parameterName: string): string {
    var result = null, tmp = [];
    location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
    return result;
  }
  // usage: flags should be used only if delimiters are not used.
  // delimiters can only be single characters
  static parseRegexString(s: string, onlyIfDelimitedByOneOf: string[] = ['\\', '/'], flags: string = null, canThrow: boolean = true): RegExp {
    const firstchar = s.charAt(0);
    let lastindex: number = -1;
    let i: number;
    let ret: RegExp;
    if (s !== '' + s) { U.pe(canThrow, 'U.parseRegexString() "s" argument must be a string.', s); return null; }
    if (onlyIfDelimitedByOneOf) {
      let found: boolean = false;
      for (i = 0; i < onlyIfDelimitedByOneOf.length; i++) { if (firstchar === onlyIfDelimitedByOneOf[i]) { found = true; break; } }
      if (!found) return null;
      lastindex = s.lastIndexOf(firstchar);
      if (lastindex === 0) return null;
      flags = s.substring(lastindex + 1).trim();
      s = s.substring(1, lastindex).trim();
      try { ret = new RegExp(s, flags); }
      catch (e) {
        U.pe(canThrow, 'evaluation of regex string failed:', s, onlyIfDelimitedByOneOf);
        return null; }
      return ret; }
    if (flags !== '' + flags) { U.pe(canThrow, 'U.parseRegexString() "flags" argument must be a string.', flags); return null; }
    try { ret = new RegExp(s, flags); }
    catch (e) {
      U.pe(canThrow, 'evaluation of regex string failed:', s, onlyIfDelimitedByOneOf);
      return null; }
    return ret; }

  static processSelectorPlusPlus(fullselector: string, prioritizeLeftPart: boolean, $searchRoots: JQuery<Element> = null,
                                 $defaultNode: JQuery<Element> = null, defaultAttributeSelector: string = null, debug: boolean = true): SelectorOutput {
    fullselector = fullselector.trim();
    defaultAttributeSelector = defaultAttributeSelector && defaultAttributeSelector.trim().toLowerCase();
    if (!$searchRoots) $searchRoots = $(document) as any;
    U.pe(fullselector !== '' + fullselector, 'Measurable.processSelectorPlusPlus() parameter exception: ', fullselector);
    ///// try execution
    let ret: SelectorOutput = new SelectorOutput();
    ret.resultSetAttr = [];
    ret.resultSetElem = $([]);
    if (!$searchRoots.length) return ret;
    let attributeSelectorIndex: number = fullselector.lastIndexOf(U.AttributeSelectorOperator);
    if (attributeSelectorIndex === -1) {
      attributeSelectorIndex = prioritizeLeftPart ? 0 : fullselector.length
      fullselector = prioritizeLeftPart ? fullselector + U.AttributeSelectorOperator : U.AttributeSelectorOperator + fullselector; }
    let getAttributes = (html: Element, selector: string, regexp: RegExp): Attr[] => {
      let ret: Attr[];
      if (regexp) { ret = U.getAttributesByRegex(html, regexp); }
      else ret = U.getAttributes(html, (a: Attr) => { return a.name.indexOf(selector) === 0; });
      return ret; };
    // is mono-right (only attribute)
    if (attributeSelectorIndex === 0) {
      ret.jqselector = null;
      ret.attrselector = fullselector.substr(U.AttributeSelectorOperator.length).trim().toLowerCase();
      ret.attrRegex = U.parseRegexString(ret.attrselector, ['/', '\\'], null, false); }

    U.pif(debug, 'part1:  index:', attributeSelectorIndex, ' data:', {...ret});
    // is mono-left (only jqselector), becomes both.
    if (attributeSelectorIndex + U.AttributeSelectorOperator.length === fullselector.length) {
      ret.jqselector = fullselector.substr(0, attributeSelectorIndex).trim();
      ret.attrselector = defaultAttributeSelector ? defaultAttributeSelector : null;
      ret.attrRegex = null; }

    U.pif(debug, 'part2:  index:', attributeSelectorIndex, ' data:', {...ret});
    if (!ret.jqselector && attributeSelectorIndex > 0 && ret.jqselector == null) {
      ret.jqselector = fullselector.substr(0, attributeSelectorIndex);
    }
    if (!ret.attrselector && attributeSelectorIndex > 0 && attributeSelectorIndex < fullselector.length) {
      ret.attrselector = fullselector.substr(attributeSelectorIndex);
    }
    // check if ambiguous mono-part (left or right?), becomes both
    /*
    if (attributeSelectorIndex === -1) {
      // first try to see if is attribute only.
      ret.jqselector = null;
      ret.attrselector = fullselector.toLowerCase();
      ret.attrRegex = U.parseRegexString(ret.attrselector, ['/', '\\'], null, false);
      // first try to check if is mono-right (only attribute)
      ret.resultSetAttr = getAttributes(defaultNode, ret.attrselector, ret.attrRegex);
      if (ret.resultSetAttr.length) { return ret; }
      // if not, it is JQ_selector only
      ret.jqselector = fullselector;
      ret.attrselector = Measurable.GlobalPrefix;
      ret.attrRegex = null; }*/
    if (ret.attrselector === '*') ret.attrRegex = /.*/;
    // is both: left and right
    // U.pe(!ret.attrselector, 'attrselector should be always set at this point, at "-> ' + Measurable.GlobalPrefix + '" on worst case if it was empty.');
    // search for external triggers
    try { ret.resultSetElem = ret.jqselector && ret.jqselector !== 'this' ? $searchRoots.find(ret.jqselector) : ($defaultNode instanceof $ ? $defaultNode : $([])); }
    catch (e) { ret.exception = e; return ret; }
    U.pif(debug, 'part3:  index:', attributeSelectorIndex, ' data:', {...ret}, '$serachRoots', $searchRoots, ' $defaultNode:', $defaultNode, 'jqinstance?' , $defaultNode instanceof jQuery);

    let i: number;
    let j: number;
    if (!ret.attrRegex && !ret.attrselector) return ret;
    const attrSelectorArr: string[] = !ret.attrRegex ? U.replaceAll(ret.attrselector, ',', ' ').split(' ') : null;
    for (i = 0; i < ret.resultSetElem.length; i++) {
      if (ret.attrRegex) { U.ArrayMerge(ret.resultSetAttr, getAttributes(ret.resultSetElem[i], null, ret.attrRegex)); continue; }
      for (j = 0; j < attrSelectorArr.length; j++) {
        let attrname: string = attrSelectorArr[j].trim();
        if (attrname === '') continue;
        U.ArrayMerge(ret.resultSetAttr, getAttributes(ret.resultSetElem[i], attrname, null));
      }
    }
    U.pif(debug, 'part4 ret:  index:', attributeSelectorIndex, ' data:', {...ret});
    return ret; }

  static deepCloneWithFunctions(obj: object): object {
    try {JSON.stringify(obj); } catch(e) { U.pe(true, 'U.deepCloneWithFunctions() Object have circular references.'); } // just to throw exception if the object have circular references
    let copy: object;
    let key: string;
    // Handle the 3 simple types, and null or undefined
    if (null === obj || undefined === obj || "object" !== typeof obj) return obj;

    if (obj instanceof Date) { return new Date(obj.toString()); }
    if (obj instanceof Number) { return new Number(obj.valueOf()); }
    if (obj instanceof Boolean) { return new Boolean(obj.valueOf()); }
    if (obj instanceof String) { return new String(obj.valueOf()); }
    if (obj instanceof String) { return new String(obj.valueOf()); }
    if (obj instanceof Function) { return obj; }
    if (Array.isArray(obj)) { copy = []; }
    if (obj instanceof Object) { copy = {}; }
    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (key in obj) {
        if (obj.hasOwnProperty(key)) copy[key] = U.deepCloneWithFunctions(obj[key]);
      }
      return copy;
    }
    return obj;
  }

  static objecKeysIntersect(obj1: object, obj2: object, prioritizeleft: boolean = true, clone: boolean = false): object {
    if (!U.isObject(obj1, false, false, true) || !U.isObject(obj2, false, false, true)) return prioritizeleft ? obj1 : obj2;
    let retobj: object = clone ? {} : obj1;
    let key: string;

    for (key in obj1) {
      if (key in obj2) { retobj[key] = prioritizeleft ? obj1[key] : obj2[key]; continue }
      if (!clone) delete obj1[key];
    }
    return retobj;
  }

  static toHex(num: number, lengthMin: number = 6): string {
    let ret: string = Math.round(+num).toString(16);
    while (ret.length < lengthMin) ret = '0' + ret;
    return ret; }

  static hexToNum(hexstr: string): number {
    if (hexstr === null || hexstr === undefined) return hexstr as any;
    if (hexstr.charAt(0) === '#') hexstr = hexstr.substr(1);
    if (hexstr.length <= 2 || hexstr.charAt(1).toLowerCase() !== 'x') hexstr = '0x' + hexstr;
    return parseInt(hexstr, 16); }

  static expandInputSetup($root: JQuery<HTMLElement>) {
    $root.find('input.expansible').addBack('input.expansible').on('focus', (e) => {
      let inp: HTMLInputElement = e.currentTarget as HTMLInputElement;
      let $exp = $('.expandedinput[data-expandedid=\"' + inp.dataset.expandedid + '"]');
      let exp = $exp[0];
      let expinput: HTMLElement = exp.firstElementChild as HTMLElement;
      expinput.focus();
      $exp.show();
      console.log(expinput.innerText, inp.value);
      expinput.innerText = inp.value;
    });
    $('.expandedinput').on('keydown', (e) => {
      if (!(e.key === "Enter" && !e.shiftKey)) return;
      let exp: HTMLElement = e.currentTarget as HTMLElement;
      let $exp = $(exp);
      let $inp: JQuery<HTMLInputElement> = $('input.expansible[data-expandedid=\"' + exp.dataset.expandedid + '"]');
      let inp = $inp[0];
      inp.value = (exp.firstElementChild as HTMLElement).innerText;
      $exp.hide();
    });
  }

  /**
   * filtra la selezione dentro un elemento, ignorando selezione che fa overflow e calcolando gli elementi interni come se i testi fossero in un unico nodo (come se il parametero avesse tutto il testo senza childrens).
   * @param {HTMLElement} div: must be a contenteditable or contained in a contenteditable to work (getSelection() will not work on non-focusable i think?)
   **/
  static getDivSelection(div: HTMLElement): {start: number, end: number, text: string} {
    U.pe(div instanceof HTMLInputElement || div instanceof HTMLTextAreaElement, 'parameter must not be a input or textarea element');
    //let caretOffset: number = 0;
    const doc: Document = div.ownerDocument || div['document'];
    const win: Window = doc.defaultView || doc['parentWindow'];
    let sel: Selection;
    let ret: {start: number, end: number, text: string} = {start: 0, end: 0, text: ''};
    let range: Range;
    let caretRange: Range;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) { // if is contenteditable
        range = win.getSelection().getRangeAt(0);
        caretRange = range.cloneRange();
        caretRange.selectNodeContents(div);
        // taking start selection
        caretRange.setEnd(range.startContainer, range.startOffset);
        ret.start = caretRange.toString().length;
        caretRange.setEnd(range.endContainer, range.endOffset);
        ret.end = caretRange.toString().length;
        caretRange.setStart(range.startContainer, range.startOffset);
        ret.text = caretRange.toString(); }
    } else if ( (sel = doc['selection']) && sel.type != "Control") {
      //IE  compatibility (start and text sono improvvisati e non testati)
      var textRange = sel['createRange']();
      var preCaretTextRange = doc.body['createTextRange']();
      preCaretTextRange.moveToElementText(div);
      preCaretTextRange.setEndPoint("EndToStart", textRange);// set selection end to start of the input parameter range.
      ret.start = preCaretTextRange.text.length;
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      ret.end = preCaretTextRange.text.length;
      preCaretTextRange.setEndPoint("StartToStart", textRange);
      ret.text = preCaretTextRange.text; }
    return ret; }

  static getInputSelection(el: HTMLInputElement | HTMLTextAreaElement): {start: number, end: number, text: string} {
    let range: Range;
    let textInputRange: Range;
    let endRange: Range;
    U.pe(!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement), 'parameter must be a input or textarea element');
    let ret: {start: number, end: number, text: string} = {start: 0, end: 0, text: ''};
    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
      ret.start = el.selectionStart;
      ret.end = el.selectionEnd;
    } else { // IE compatibility
      range = document['selection'].createRange();
      if (range && range['parentElement']() == el) {
        let len: number = el.value.length;
        let normalizedValue = el.value.replace(/\r\n/g, "\n");
        // Create a working TextRange that lives only in the input
        textInputRange = el['createTextRange']();
        textInputRange['moveToBookmark'](range['getBookmark']());
        // Check if the start and end of the selection are at the very end
        // of the input, since moveStart/moveEnd doesn't return what we want
        // in those cases
        endRange = el['createTextRange']();
        endRange.collapse(false);

        if (textInputRange['compareEndPoints']("StartToEnd", endRange) > -1) { ret.start = ret.end = len; }
        else {
          ret.start = -textInputRange['moveStart']("character", -len);
          ret.start += normalizedValue.slice(0, ret.start).split("\n").length - 1;

          if (textInputRange['compareEndPoints']("EndToEnd", endRange) > -1) { ret.end = len; }
          else {
            ret.end = -textInputRange['moveEnd']("character", -len);
            ret.end += normalizedValue.slice(0, ret.end).split("\n").length - 1; }
        }
      }
    }
    ret.text = el.innerText.substring(ret.start, ret.end);
    return ret; }

  static getSelection(el: HTMLElement): {start: number, end: number, text: string} {
    let ret: {start: number, end: number, text: string} = {start: 0, end: 0, text: ''};
    U.pe(!(el instanceof HTMLElement), 'U.getSelection(): only html elements are supported');
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) { return U.getInputSelection(el); }
    else return U.getDivSelection(el); }

  // NB: might not work on contenteditable with childrens filled with text.
  static setSelection(el: HTMLElement, start: number, end: number = null): void {
    end = end === null ? start : null;
    let i: HTMLInputElement;
    if (el['setSelectionRange']) { el['setSelectionRange'](start, end); return; } // for inputs
    let range = new Range();
    let endchildIndex = start;
    let startchildIndex = end;
    range.setStart(el.firstChild, startchildIndex);
    range.setEnd(el.firstChild, endchildIndex); // firstchild is raw text.
    // range.startOffset = start;
    // range.endOffset = end;
    // apply the selection, explained later
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
    // el.setSelectionRange(start, end);
  }
  static setSelection2(obj: HTMLElement, start: number, end: number) {
    end = end === null ? start : null;
    var endNode, startNode = endNode = obj.firstChild;

    // startNode.nodeValue = startNode.nodeValue.trim();

    var range = document.createRange();
    range.setStart(startNode, start);
    range.setEnd(endNode, end + 1);

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range); }

  static autocompleteInputSetup(inputGroup: HTMLElement, autocomplete: AutocompleteMatch[]){
    let input: HTMLElement = inputGroup.firstElementChild as HTMLElement;
    let suggestionList: HTMLUListElement = inputGroup.lastElementChild as HTMLUListElement;
    let $suggestionList: JQuery<HTMLUListElement> = $(suggestionList);
    U.pe(!input || !input.contentEditable || !suggestionList || input === suggestionList, 'input html must be a container with firstchild as contenteditable, lastchild as suggestion ul list.');
    let validSuggestions: AutocompleteMatch[] = [];
    let splitIndexes: number[] = [];
    let i: number;
    let li: HTMLLIElement;
    let $li: JQuery<HTMLLinkElement>;
    let $input = $(input);
    const debug: boolean = false;
    let getSuggestionText = (li: HTMLLIElement) => { return (li.lastElementChild as HTMLElement).innerText; }
    let getPreCursorString = (): string => {
      let ret = U.getSelection(input);
      return input.innerText.substr(0, ret.start); };
    const insertStringAtCurrentCursorPosition = (input: HTMLElement, text: string, replacePostText: boolean = false, rightArrow: boolean = false) => {
      let ret = U.getSelection(input);
      let fakeend: string = ' ';
      let str: string = input.innerText;// + fakeend;
      let arrowfix: number = (rightArrow && ret.start < str.length ? -1 :0);
      // se premo right-arrow senza che ci siano elementi dopo il cursore lo mette come penultimo.
      let pre: string = str.substring(0, ret.start + arrowfix);
      let post: string = str.substring(ret.end + arrowfix, str.length) + ' ';
      let i: number = U.strFirstDiffIndex(text, post);
      // console.log('ArrowDebug:', pre, 'text:', text, 'post.substr(i):',post.substr(i), 'post:', post, 'i:', i);
      input.innerText = pre + text + post.substr(i);
      U.setSelection(input, pre.length + 1, null);
    };
    let updateSuggestions = () => {
      // logical and graphical update
      let str = getPreCursorString();
      str = U.replaceAll(str, String.fromCharCode(160), ' ');
      validSuggestions = [];
      splitIndexes = [];
      // console.log('updateSuggestions, prestring: |' + str + '|, suggestions:' + autocomplete.length);
      U.clear(suggestionList);
      for (i = 0; i < autocomplete.length; i++){
        let matchindex = autocomplete[i].matches(str);
        // console.log(autocomplete[i], str);
        // console.log('updateSuggestions[' + i + '], str:' + str + ', hiddenMatch:' + autocomplete[i].hiddenprecondition + ', visibleMatch:' + autocomplete[i].key + ', matchindex:', matchindex);
        if (matchindex === -1) continue;
        splitIndexes.push(matchindex);
        validSuggestions.push(autocomplete[i]);
        let li = autocomplete[i].getLI(matchindex);
        let $li = $(li);

        $li.on('click', () => {
          insertStringAtCurrentCursorPosition(input, getSuggestionText(li));
          U.setSelection(input, input.innerText.length, null);
          updateSuggestions();
        });
        if (validSuggestions.length > 0) $suggestionList.show(); else $suggestionList.hide();
        suggestionList.append(li);
      }
      debug&&console.log('valid suggestions:', validSuggestions);
    }
    $input
      .on('mouseup', (e: MouseUpEvent) => { updateSuggestions(); })
      .on('keydown', (e: KeyDownEvent) => {
        switch(e.key){ default: break;
          case Keystrokes.tab:
            e.preventDefault();
            li = suggestionList.firstElementChild as HTMLLIElement;
            if (!li) break;
            $(li).trigger('click');
            break; }})
      .on('keyup', (e: KeyUpEvent) => {
        debug&&console.log('input keyup:', e);
        switch(e.key){
          default:
            updateSuggestions();
            break;
          // case Keystrokes.tab: break;// can never happen on keyUP unless i stop default action on keydown.

          case Keystrokes.arrowRight:
            if (e.shiftKey) return;
            li = suggestionList.firstElementChild as HTMLLIElement;
            if (!li) { updateSuggestions(); break; } // as a normal arrow press
            // as a suggestion accept
            let char = (li.lastElementChild as HTMLElement).innerText.charAt(0);
            insertStringAtCurrentCursorPosition(input, char, true, true);
            $input.trigger(jQuery.Event('keyup', {key:char}));
            break;
        } });
  }

  // NB: object.keys e for... in listano solo le proprietà enumerabili, le funzioni di classe in es6 non sono enumerabili.
  static getAllProperties(obj0): string[] {
    let props: string[] = [];
    let obj = obj0;
    do {
      props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter(function(e, i, arr) { if (e!=arr[i+1]) return true; });
  }
  static copyFirstLevelStructureWithoutValues(o: object, allowPrimitive: boolean = true, allowObject: boolean = false, allowFunctions: boolean = true): Dictionary<string, string /*type description*/> {
    let ret: Dictionary<string, undefined> = {};
    let keys: string[] = U.getAllProperties(o);
    for (let index in keys) {
      let key = keys[index];
      let val = o[key];
      if(val instanceof Function) { ret[key] = allowFunctions ? val : null; continue; }
      if(val instanceof Object) { ret[key] = allowObject ? val : null; continue; }
      ret[key] = allowPrimitive ? val : null;
    }
    return ret; }


  static getFunctionSignatureFromComments(f: Function): {parameters: {name: string, defaultVal: string, typedesc: string}[], returns: string, f: Function, fname: string, isLambda: boolean, signature: string} {
    U.pe(!(f instanceof Function), 'getFunctionSignature() parameter must be a function');
    // let parameters: {name: string, defaultVal: string, typedesc: string}[] = []; //{name: '', defaultVal: undefined, typedesc: ''};
    let ret: {parameters: {name: string, defaultVal: string, typedesc: string}[], returns: string, f: Function, fname: string, isLambda: boolean, signature: string}
    = {parameters: [], returns: '', f: f, fname: '', isLambda: null, signature: ''};
    let str: string = f.toString();
    let starti: number = str.indexOf('(');
    let endi: number;
    let parcounter: number = 1;
    for (endi = starti + 1; endi < str.length; endi++) {
      if (str[endi] === ')' && --parcounter === 0) break;
      if (str[endi] === '(') parcounter++; }

    let parameterStr = str.substring(starti + 1, endi);
    // console.log('getfuncsignature starti:', starti, 'endi', endi, 'fname:', str.substr(0, starti), 'parameterStr:', parameterStr);
    ret.fname = str.substr(0, starti).trim();
    ret.fname = ret.fname.substr(0, ret.fname.indexOf(' ')).trim();
    // 2 casi: anonimo "function (par1...){}" e "() => {}", oppure nominato: "function a1(){}"
    if (ret.fname === '' || ret.fname === 'function') ret.fname = null; // 'anonymous function';



    let returnstarti: number = str.indexOf('/*', endi + 1);
    let returnendi: number = -1;
    let bodystarti: number = str.indexOf('{', endi + 1);
    if (returnstarti === -1 || bodystarti !== -1 && bodystarti < returnstarti) {
      // no return type or comment is past body
      ret.returns = null;
    } else {
      returnendi = str.indexOf('*/', returnstarti + 2);
      ret.returns = str.substring(returnstarti + 2, returnendi).trim();
      bodystarti = str.indexOf('{', returnendi); }
    if (ret.returns === '') ret.returns = null;

    // is lambda if do not have curly body or contains => between return comment and body
    // console.log('isLambda:', bodystarti, str.substring(Math.max(endi, returnendi)+1, bodystarti));
    ret.isLambda =  bodystarti === -1 || str.substring(Math.max(endi, returnendi)+1, bodystarti).trim() === '=>';

    let regexp = /([^=\/\,]+)(=?)([^,]*?)(\/\*[^,]*?\*\/)?,/g; // only problem: the last parameter won't match because it does not end with ",", so i will append it everytime.
    let match;
    while ((match = regexp.exec(parameterStr + ','))) {
      // match[0] is always the full match (not a capture group)
      // match[2] can only be "=" or empty string
      // nb: match[4] can be "/*something*/" or "," a single , without spaces.
      let par = {name: match[1], defaultVal: match[3], typedesc: match[4] && match[4].length > 1 ? match[4] : null};
      par.name = par.name.trim();
      par.defaultVal = par.defaultVal && par.defaultVal.trim() || null;
      par.typedesc = par.typedesc && par.typedesc && par.typedesc.length > 1 ? par.typedesc.substring(2, par.typedesc.length - 2).trim() || null: null;
      ret.parameters.push(par); }
    // set signature

    ret.signature = '' + (ret.fname ? '/*' + ret.fname + '*/' : '') + '(';
    let i: number;
    for (i = 0; i < ret.parameters.length; i++) {
      let par = ret.parameters[i];
      ret.signature += (i === 0 ? '' : ', ') + par.name + (par.typedesc ? '/*' + par.typedesc + '*/' : '') + (par.defaultVal ? ' = ' + par.defaultVal : '');
    }
    ret.signature += ')' + (ret.returns ? '/*' + ret.returns + '*/' : '');
    return ret; }

   /* for both input, textarea and contenteditable.*/
  static setInputValue(input: HTMLElement, value: string): void{
    value = value === null || value === undefined ? '' : value;
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      input.value = value;
    } else input.innerText = value;
  }

  static hasFocus(elem: Element): boolean { return window.document.activeElement === elem; }
  static hasFocusWithin(elem: Element, includeSelf: boolean = true): boolean {
    if (!elem) return false;
    const active = window.document.activeElement;
    // console.log('hasFocus1:', includeSelf, ' && ', elem === active);
    if (includeSelf && elem === active) return true;
    // console.log('hasFocus2:', active, 'contains', elem, ' = ', active.contains(elem));
    return elem.contains(active); }

  static $makeSelect($root: JQuery<HTMLSelectElement>, entries: Dictionary<string, string>, optgrplabel: string = '', selectedVal: string = ''): void {
    $root.each((i: number, e: HTMLSelectElement) => U.makeSelect(e, entries, optgrplabel, selectedVal));
  }

  // used to convert type from string to some enum checking after validation
  static getEnumValByVal<T>(val: string, enumDeclaration:object): T {
    for (let key in enumDeclaration) {
      if (enumDeclaration[key] === val) return val as any;
    }
    return null; }

  static getEnumValByKey<T>(key: string, enumDeclaration:object): T {
    if (enumDeclaration && enumDeclaration.hasOwnProperty(key)) return enumDeclaration[key] as T;
    return null; }

  static getEnumKeyByVal<T>(val: string | T, enumDeclaration:object): string {
    for (let key in enumDeclaration) {
      if (enumDeclaration[key] === val) return key;
    }
    return null;
  }

  static makeSelect(select: HTMLSelectElement, entries: Dictionary<string, string>, optgrplabel: string = '', selectedVal: string = ''): void {
    const grp: HTMLOptGroupElement = document.createElement('optgroup');
    U.clear(select);
    select.append(grp);
    grp.label = optgrplabel;
    for (let key in entries) {
      const opt: HTMLOptionElement = document.createElement('option');
      opt.setAttribute('value', key);
      opt.innerText = entries[key];
      if (entries[key] === selectedVal) opt.selected = true;
      grp.append(opt);
    }
  }

  static computeConditionalHides($root: JQuery<Element>, obj: Dictionary<string, boolean>, caseSensitive: boolean = false, cascadeOnChildrens: boolean = true,
                                 displayFunction: (e: Element) => void = null, hideFunction: (e: Element) => void = null)
                                 : {show: Element[], hide: Element[], inaltered: Element[]}  {
    if (!displayFunction) displayFunction = (e: Element) => $(e).show();
    if (!hideFunction) hideFunction = (e: Element) => $(e).hide();
    if (cascadeOnChildrens) $root = $root.find('[uif]').addBack('[uif]');
    else $root.filter('[uif]');
    let ret: {show: Element[], hide: Element[], inaltered: Element[]} =
      {hide: [], show: [],  inaltered: []};
    $root.each((i: number, e: Element) => {
      let b: boolean = U.checkConditionalHide(e, obj, caseSensitive);
      switch (b) {
        case true: ret.show.push(e); displayFunction(e); break;
        case false: ret.hide.push(e); hideFunction(e); break;
        default:
        case null: ret.inaltered.push(e); break;
      }
    });
    return ret;
  }

  static checkConditionalHide(html: Element, obj: Dictionary<string, boolean>, caseSensitive: boolean = false): boolean {
    let attrstr: string = html.getAttribute('uif');
    if (!attrstr) return null;
    attrstr = attrstr
    .replace(/\|+/, ' || ')
    .replace(/&+/, ' && ')
    .replace('+', ' + ')
    .replace('-', ' - ')
    .replace('*', ' * ')
    .replace('/', ' / ')
    .replace('!', ' ! ')
    .replace(/\s+/, ' ');
    let i: number;
    let key: string;
    let tokens: string[] = attrstr.split(' ');
    if (!caseSensitive) {
      for (key in obj) {
        const lckey: string = key.toLowerCase();
        if (lckey === key) continue;
        const val: boolean = obj[key];
        delete obj[key];
        obj[lckey] = val;
      }
    }

    for (i = 0; i < tokens.length; i++) {
      const token: string = caseSensitive ? tokens[i] : tokens[i].toLowerCase();
      // ricorda di non salvare in lowercase i token non sostituiti, altrimenti rimpiazza Math.abs() o altre funzioni java native.
      if (obj.hasOwnProperty(token)) tokens[i] = obj[token];
    }
    let ret: boolean;
    try {
      ret = eval(tokens.join(' '));
    } catch (e) {
      // U.pw(true, 'Invalid conditional attribute (UIF), error:', e, 'html:', html, 'attrStr:', attrstr, 'tokens:', tokens, 'dic:', obj, 'caseSensitive:', caseSensitive);
      ret = null;
    }
    // if (ret === null) console.log('rrer', tokens);
    return ret;
    // ipotesi 1:
    //   computa hide = concatenazione hide1 || hide2 || hide3.... (es: m1hide || m1hideifclass), simile per "show"
    // se ottengo:
    // hide = null, show = null --> non computato, com'era rimane.
    // hide = null  --> valueof(showif)
    // show = null  --> valueof(hideif)

    // hide = true, show = true    --> hide
    // hide = true, show = false   --> hide
    // hide = false, show = false  --> hide
    // hide = false, show = true   --> show
  }

  static deserialize(value: string): any{
    if (value === '') return '';// json.parse fail on ''
    if (value == 'undefined') return undefined;// json.parse fail on undefined and 'undefined' too
    let ret: any;
    try {
      ret = JSON.parse(value);
    } catch(e) {
      // U.pe(true, 'failed to deserialize: |', value, '|', e);
      return value; // means it's a raw string different from 'true', 'null', ...
    }
    return ret;
  }


  static makeCssSheet(): HTMLStyleElement{
    const style: HTMLStyleElement = document.createElement('style');
    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")
    style.type = 'text/css';
    style.appendChild(document.createTextNode("")); // necessario per un bug in webkit
    return style; }

  static getActualInlineStyles(el: HTMLElement): string[][] {
    const ret: string[][] = [];
    for (let i = 0, len = el.style.length; i < len; ++i) {
      let name: string = el.style[i];
      ret.push ([name, el.style[name]]);
      // console.log(name, ':', value);
    }
    return ret;
  }

  static disableConsole(){
    console['logg'] = console.log;
    console.log = () => {};
  }
  static enableConsole() {
    if (console['logg']) console.log = console['logg'];
  }

  // copia propietà da un oggetto deserializzato (senza funzioni) in un oggetto non serializzato ma privo di dati
  static cloneProperties(param: GenericObject, json: JSON): void{
    for (let key in json) { param[key] = json[key]; }
  }

  static findFirstAncestor<T extends Node>(startingNode: T, condition: (node) => boolean): T {
    let current: T = startingNode;
    while (current && !condition(current)) { current = current.parentNode as any; }
    return current; }

  static insertNodeAt(parent: Element, child: Element, index: number): void {
    let futureNextSibling: Element = index < 0 ? parent.firstElementChild : (index > parent.children.length ? null : parent.children[index]);
    parent.insertBefore(child, futureNextSibling);
  }

  static arrayIntersection<T>(arr1: T[], arr2: T[]): T[]{
    if (!arr1 || ! arr2) return null;
    return arr1.filter( e => arr2.indexOf(e) >= 0);
  }

  static getLocale(defaultLocale: string = "en-UK"): string{
    if (!navigator) return defaultLocale;
    return navigator.language || navigator.languages[0] || defaultLocale;
  }

  /* NB: if using for <input type="week"> example usage:<br>
   * input.value = "2021-W" + (''+ U.getWeekNumber(d)).padStart(2, '0')
   * */
  static getWeekNumber(d: Date): number{
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    function serial(days: number): number { return 86400000*days; }
    function dateserial(year: number, month: number, day: number): number { return (new Date(year,month-1,day).valueOf()); }
    function weekday(date: number) { return new Date(date).getDay()+1; }
      function yearserial(date: number) { return (new Date(date)).getFullYear(); }
      const date: number = dateserial(year,month,day),
        date2: number = dateserial(yearserial(date - serial(weekday(date-serial(1))) + serial(4)),1,3);
      // ~~ should be equal to for Math.trunc, it just truncate decimals. (not like Math.floor)
      return ~~((date - date2 + serial(weekday(date2) + 5))/ serial(7));
    }

  static fromWeekNumber(y: number, w: number): Date {
    var simple: Date = new Date(y, 0, 1 + (w - 1) * 7);
    var dow: number = simple.getDay();
    var ISOweekStart: Date = simple;
    if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    // ISOweekStart.setMonth(ISOweekStart.getMonth()+1); // myaddition
    return ISOweekStart;
  }

} // end of class U
const $smap = {};
// selettore query "statico", per memorizzare in cache i nodi del DOM read-only per recuperarli più efficientemente. (es: nodi template)
export function $s<T extends Element>(selector: string, clone: boolean = true): JQuery<T>{
  let ret: JQuery<T>;
  if ($smap[selector]) { ret = $smap[selector]; }
  else {
    ret = ($(selector) as any);
    $smap[selector] = ret;
  }
  if (clone) ret = ret.clone(false);
  return ret; }

export enum Keystrokes {
  escape = 'Escape',
  capsLock = 'CapsLock',
  shift = 'Shift',
  tab = 'Tab',
  alt = 'Alt',
  control = 'Control',
  end = 'End',
  home = 'Home',
  pageUp = 'PageUp',
  pageDown = 'PageDown',
  enter = 'Enter', // event.code = 'NumpadEnter' se fatto da numpad, oppure "numpad3", "NumpadMultiply", ShiftLeft, etc...
  numpadEnter = 'NumpadEnter',
  audioVolumeMute = 'AudioVolumeMute',
  audioVolumeUp = 'AudioVolumeUp',
  audioVolumeDown = 'AudioVolumeDown',
  mediaTrackPrevious = 'MediaTrackPrevious',
  delete = 'Delete', // canc
  backspace = 'Backspace',
  space = ' ',
  altGraph = 'AltGraph',
  arrowLeft = 'ArrowLeft',
  arrowRight = 'ArrowRight',
  arrowUp = 'ArrowUp',
  arrowDown = 'ArrowDown',
  insert = 'Insert',
  f1 = 'F1',
  // weird ones:
  meta = 'Meta', // f1, or other f's with custom binding and windows key
  unidentified = 'Unidentified', // brightness
  __NotReacting__ = 'fn, print, maybe others', // not even triggering event?


}
export class AutocompleteMatch {
  hiddenprecondition: string;
  key: string;
  //value: string;
  /*minCharMatch = 1;

  constructor(key: string, minCharMatch: number = 1, value: string = null){
    this.minCharMatch = Math.min(1, minCharMatch);
    //this.value = value;
    this.key = key; }
*/
  constructor(hiddenprecondition: string = '', key: string = ''){
    this.hiddenprecondition = hiddenprecondition;
    this.key = key; }

  matches(preCursorString: string): number{
    let fullkey: string = this.hiddenprecondition + this.key;
    for (let i = this.hiddenprecondition.length; i < fullkey.length; i++){
      let keystart = fullkey.substring(0, i);
      //console.log('str:', preCursorString, ' matches:', keystart);
      let matchindex = preCursorString.lastIndexOf(keystart);
      if (matchindex !== -1 &&  matchindex === preCursorString.length - keystart.length){
        //console.log('matched!  at index:', preCursorString.lastIndexOf(keystart) );
        return i - this.hiddenprecondition.length; // indice dove posso splittare key
      }
    }
    return -1; }

  getLI(splitIndex: number): HTMLLIElement{
    const li: HTMLLIElement = document.createElement('li');
    const matched: HTMLElement = document.createElement('span');
    matched.style.fontWeight = '900';
    matched.classList.add('matched');
    const suggestion: HTMLElement = document.createElement('span');
    suggestion.classList.add('prediction');
    li.classList.add('suggestion');
    li.style.cursor = 'pointer';
    li.append(matched);
    li.append(suggestion);
    matched.innerText = this.key.substr(0, splitIndex);
    suggestion.innerText = this.key.substr(splitIndex);
    return li; }

// aaaa+this.
// aaa+th


}
export enum TSON_JSTypes {
  'null' = 'null',
  'undefined' = 'undefined',
  'boolean' = 'boolean',
  'number' = 'number',
  'string' = 'string',
  'object' = 'object',
  'Array' = 'array',
  'Date' = 'date',
  'Boolean' = 'boolean',// type is obj, serialized as bool.
  'Number' = 'number',
  'String' = 'string',// type is obj, serialized as str.
  'function' = 'function',
}

export enum TSON_UnsupportedTypes {
  'BigInt' = 'bigint',
  'symbol' = 'symbol',
  'arrowFunction?' = 'arrowfunction?',
  'RegExp' = 'regexp',
  'Int8Array' = 'int8array',
  'Uint8Array' = 'uint8array',
  'Uint8ClampedArray' = 'uint8clampedarray',
  'Int16Array' = 'int16array',
  'Uint16Array' = 'uint16array',
  'Int32Array' = 'int32array',
  'Uint32Array' = 'uint32array',
  'Float32Array' = 'float32array',
  'Float64Array' = 'float64array',
  'BigInt64Array' = 'bigint64array',
  'BigUint64Array' = 'biguint64array',
  'Keyed' = 'keyed',
  'collections' = 'collections',
  'Map' = 'map',
  'Set' = 'set',
  'WeakMap' = 'weakmap',
  'WeakSet' = 'weakset',
  'ArrayBuffer' = 'arraybuffer',
  'SharedArrayBuffer' = 'sharedarraybuffer',
  'Atomics' = 'atomics',
  'DataView' = 'dataview',
  'Promise' = 'promise',
  'Generator' = 'generator',
  'GeneratorFunction' = 'generatorfunction',
  'AsyncFunction' = 'asyncfunction',
  'Iterator' = 'iterator',
  'AsyncIterator' = 'asynciterator',
  'Reflection' = 'reflection',
  'Reflect' = 'reflect',
  'Proxy' = 'proxy',
}
export type TSONString = string;
export class TSON { //typed json (js impl.) actually dovrei fare una map che converte JS_Types in TSON_Types per scrivere e leggere types language-indipendent.
  private values: any;
  private types: any;

  public static stringify(val: any): TSONString {
    try { JSON.stringify(val); } catch(e) { U.pe(true, 'U.deepCloneWithFunctions() Object might have circular references.', e); } // just to throw exception if the object have circular references
    let tmp = TSON.cloneAndGetTypings(val);
    const ret = new TSON();
    ret.values = tmp.val as any;//  JSON.stringify(val);
    ret.types = tmp.type as any;// JSON.stringify(typings);
    return JSON.stringify(ret); }

  public static parse(tson: string): any {
    try{
      // let tson: TSON = typeof(Tson) === TSON_JSTypes.string ? JSON.parse(Tson as string) : Tson;
      return TSON.parse0(JSON.parse(tson));
    }
    catch (e) { let er = new Error('TSON.parse failed, it maybe the argument is not a valid TSON string / object.'); er['suberror'] = e; throw e; }
  }

  private static parse0(jsontson: TSON): any {
    TSON.fixTypes(jsontson.values, jsontson.types);
    return jsontson; }

  private static cloneAndGetTypings(obj: any): {val: any, type: string | any[] | object} {
    // let copy: object;
    let key: string;
    let ret: {val: object, type: string | any[] | object} = {val: undefined, type: undefined};
    let tmp: {val: object, type: string | any[] | object} = {val: undefined, type: undefined};
    // Handle primitives
    if (null === obj) { ret.val = obj; ret.type = TSON_JSTypes.null; return ret; }
    if (undefined === obj) { ret.val = obj; ret.type = TSON_JSTypes.undefined; return ret; }
    switch(typeof obj){
      default: U.pe(true, 'unexpected type:', obj, typeof obj); break; // do not use, too dangerous for types not defined in TSON_JSTypes
      case TSON_JSTypes.boolean: ret.val = obj; ret.type = TSON_JSTypes.boolean; return ret;
      case TSON_JSTypes.number: ret.val = obj; ret.type = TSON_JSTypes.number; return ret;
      case TSON_JSTypes.string: ret.val = obj; ret.type = TSON_JSTypes.string; return ret;
      case TSON_JSTypes.function: break;
      case TSON_JSTypes.object: break; // those should cover everything. array and date = object
    }
    if (typeof obj === TSON_JSTypes.boolean) { ret.val = obj; ret.type = TSON_JSTypes.undefined; return ret; }

    // handle non-primitives
    if (obj instanceof Date) { ret.val = new Date(obj.toString()); ret.type = TSON_JSTypes.Date; return ret; }
    if (obj instanceof Boolean) { ret.val = new Boolean(obj.valueOf()); ret.type = TSON_JSTypes.Boolean; return ret; }
    if (obj instanceof Number) { ret.val = new Number(obj.valueOf()); ret.type = TSON_JSTypes.Number; return ret; }
    if (obj instanceof String) { ret.val = new String(obj.valueOf()); ret.type = TSON_JSTypes.String; return ret; }
    // takes lambda too
    if (obj instanceof Function) { ret.val = obj.toString(); ret.type = TSON_JSTypes.function; return ret; }
    if (Array.isArray(obj)) { ret.val = []; ret.type = []; }
    else if (obj instanceof Object) { ret.val = {}; ret.type = {}; }
    if (typeof(obj) === TSON_JSTypes.string) { ret.val = obj; ret.type = TSON_JSTypes.string; return ret; }
    // Handle Object
    for (key in obj) {
      //if (!obj.hasOwnProperty(key)) continue;
      tmp = TSON.cloneAndGetTypings(obj[key]);
      if (key === 'cc') console.log('cc:', tmp);
      ret.val[key] = tmp.val;
      ret.type[key] = tmp.type; }
    return ret; }

  private static fixTypes(values: any, types: any): any {
      let key: string;
      let i: number;
      let exampleval = {a:0, b:'0', c:[1, 'kk', ()=>{}, {k:''}]};
      let exampletyp = {a:'number', b:'string', c:['number', 'string', 'arrowfunc', {k:'string'}]};
      let leafvalstr: string;
      switch (typeof(values)){
        default: // is leaf-type and i can read my typemap
        case TSON_UnsupportedTypes.BigInt: case TSON_UnsupportedTypes.symbol:
          U.pe (true, 'TSON parse found an unsupported type:', typeof(values)); break;
        case TSON_JSTypes.string:
        case TSON_JSTypes.function:
        case TSON_JSTypes.undefined:
        case TSON_JSTypes.number:
        case TSON_JSTypes.boolean:
        leafvalstr = '' + values;
          switch(types) { // primitivi secondo JSON
            default: U.pe(true, 'Unimplemented TSON type found:', types); break;
            case TSON_JSTypes.null: return null;
            case TSON_JSTypes.undefined: return undefined;
            case TSON_JSTypes.Date: return new Date(leafvalstr);
            case TSON_JSTypes.boolean: return new Boolean(leafvalstr).valueOf();
            case TSON_JSTypes.number: return +leafvalstr;
            case TSON_JSTypes.Boolean: return new Boolean(leafvalstr);
            case TSON_JSTypes.Number: return new Number(leafvalstr);
            case TSON_JSTypes.string: return leafvalstr;
            case TSON_JSTypes.String: return new String(leafvalstr);
            case TSON_JSTypes.function: return eval('let a=' + leafvalstr + '; a;');
          }
          //
        case TSON_JSTypes.object:
          let typestr = typeof(types) === 'string' ? types : null; // null if non-leaf type.
          switch(typestr) { // non primitivi secondo JSON
            default: U.pe(true, 'Unimplemented TSON typing found:', types); break;
            case null: // object or array (non primitivi secondo json e non-leaf per tson)
              // if (Array.isArray(values)){ same as object fallback, will ignore length.
              for (key in values) { values[key] = TSON.fixTypes(values[key], types[key]); }
              // problema: Json stringify and parse trasforma (let a = []; a[600] = 1;) in un array con 600 elementi (599 null). problema ereditato da TSON.
              return values; }
      }
      U.pe(true, 'TSON.fixtypes() should not reach here');
    }

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

export class ParseNumberOrBooleanOptions{
  defaultValue?: any;
  allowNull?: boolean; nullValue?: any;
  allowUndefined?: boolean; undefinedValue?: any;
  allowedNan?: boolean; nanValue?: any;
  allowBooleans?: boolean; trueValue?: any; falseValue?: any;
  constructor(
    defaultValue: any = null, allowNull: boolean = false, nullValue: any = null,
    allowUndefined: boolean = false, undefinedValue: any = undefined,
    allowedNan: boolean = false, nanValue: any = NaN,
    allowBooleans: boolean = true, trueValue : any = 1, falseValue: any = 0) {
      this.defaultValue = defaultValue; this.allowNull = allowNull; this.nullValue = nullValue;
      this.allowUndefined = allowUndefined; this.undefinedValue = undefinedValue;
      this.allowedNan = allowedNan; this.nanValue = nanValue;
      this.allowBooleans = allowBooleans; this.trueValue = trueValue; this.falseValue = falseValue;
  }
}

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

  static read(json: Json, field: string, valueIfNotFound: any = 'read<T>()CanThrowError'): string {
    let ret: any = json ? json[field] : null;
    if (ret !== null && ret !== undefined && field.indexOf(Status.status.XMLinlineMarker) !== -1) {
      U.pe(U.isObject(ret, false, false, true), 'inline value |' + field + '| must be primitive.', ret);
      ret = U.multiReplaceAll('' + ret, ['&amp;', '&#38;', '&quot;'], ['&', '\'', '"']);
    }
    if ((ret === null || ret === undefined)) {
      U.pe(valueIfNotFound === 'read<T>()CanThrowError', 'Json.read<',  '> failed: field[' + field + '], json: ', json);
      return valueIfNotFound; }
    return ret; }

  static write(json: Json, field: string, val: string | any[]): string | any[] {
    if (val !== null && field.indexOf(Status.status.XMLinlineMarker) !== -1) {
      U.pe(val !== '' + val, 'inline value |' + field + '| must be a string.', val);
      val = U.multiReplaceAll(val as string, ['&', '\'', '"'], ['&amp;', '&#38;', '&quot;']);
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
    if (x === null) this.x = null;
    else if (isNaN(+x)) { this.x = 0; }
    else this.x = +x;
    if (y === null) this.y = null;
    else if (isNaN(+y)) { this.y = 0; }
    else this.y = +y;
    if (w === null) this.w = null;
    else if (isNaN(+w)) { this.w = 0; }
    else this.w = +w;
    if (h === null) this.h = null;
    else if (isNaN(+h)) { this.h = 0; }
    else this.h = +h; }

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

  abstract intersection(size: ISize): ISize;
  contains(pt: IPoint): boolean {
    return  pt.x >= this.x && pt.x <= this.x + this.w && pt.y >= this.y && pt.y <= this.y + this.h; }
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

  intersection(size: Size): Size {
    // anche "isinside"
    let startx, starty, endx, endy;
    startx = Math.max(this.x, size.x);
    starty = Math.max(this.y, size.y);
    endx = Math.min(this.x + this.w, size.x + size.w);
    endy = Math.min(this.y + this.h, size.y + size.h);
    const intersection: Size = new Size(0, 0, 0, 0);
    intersection.x = startx;
    intersection.y = starty;
    intersection.w = endx - startx;
    intersection.h = endy - starty;
    const doesintersect: boolean = intersection.w > 0 && intersection.h > 0;
    return (doesintersect) ? intersection: null; }
}
export class GraphSize extends ISize {
  static fromPoints(firstPt: GraphPoint, secondPt: GraphPoint): GraphSize {
    const minX = Math.min(firstPt.x, secondPt.x);
    const maxX = Math.max(firstPt.x, secondPt.x);
    const minY = Math.min(firstPt.y, secondPt.y);
    const maxY = Math.max(firstPt.y, secondPt.y);
    return new GraphSize(minX, minY, maxX - minX, maxY - minY); }
  static closestIntersection(vertexGSize: GraphSize, prevPt: GraphPoint, pt0: GraphPoint, gridAlign: GraphPoint = null): GraphPoint {
    let pt = pt0.duplicate();
    const m = GraphPoint.getM(prevPt, pt);
    const q = GraphPoint.getQ(prevPt, pt);
    // U.pe( Math.abs((pt.y - m * pt.x) - (prevPt.y - m * prevPt.x)) > .001, 'wrong math in Q:', (pt.y - m * pt.x), ' vs ', (prevPt.y - m * prevPt.x));
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

  intersection(size: GraphSize): GraphSize {
    // anche "isinside"
    let startx, starty, endx, endy;
    startx = Math.max(this.x, size.x);
    starty = Math.max(this.y, size.y);
    endx = Math.min(this.x + this.w, size.x + size.w);
    endy = Math.min(this.y + this.h, size.y + size.h);
    const intersection: GraphSize = new GraphSize(0, 0, 0, 0);
    intersection.x = startx;
    intersection.y = starty;
    intersection.w = endx - startx;
    intersection.h = endy - starty;
    const doesintersect: boolean = intersection.w > 0 && intersection.h > 0;
    return (doesintersect) ? intersection: null; }

  contains(pt: IPoint): boolean { return super.contains(pt); }

  isOverlapping(size2: GraphSize): boolean { return !!this.intersection(size2); }
  isOverlappingAnyOf(sizes: GraphSize[]): boolean {
    if (!sizes) return false;
    for (let size of sizes) { if (this.isOverlapping(size)) return true; }
    return false;
  }

  multiplyPoint(other: IPoint, newInstance: boolean): GraphSize {
    const ret: GraphSize = newInstance ? new GraphSize() : this;
    ret.x *= other.x;
    ret.w *= other.x;
    ret.y *= other.y;
    ret.h *= other.y;
    return ret; }

  dividePoint(other: IPoint, newInstance: boolean): GraphSize {
    const ret: GraphSize = newInstance ? new GraphSize() : this;
    ret.x /= other.x;
    ret.w /= other.x;
    ret.y /= other.y;
    ret.h /= other.y;
    return ret; }
}

export abstract class IPoint {
  x: number;
  y: number;

  static getM(firstPt: IPoint, secondPt: IPoint): number { return (firstPt.y - secondPt.y) / (firstPt.x - secondPt.x); }
  static getQ(firstPt: IPoint, secondPt: IPoint): number { return firstPt.y - IPoint.getM(firstPt, secondPt) * firstPt.x; }

  constructor(x: number | string = 0, y: number | string = 0) {
    if (x === null) this.x = null;
    else if (isNaN(+x)) { this.x = 0; }
    else this.x = +x;
    if (y === null) this.y = null;
    else if (isNaN(+y)) { this.y = 0; }
    else this.y = +y;}

  toString(): string { return '(' + this.x + ', ' + this.y + ')'; }
  abstract clone(other: IPoint): void;
  abstract duplicate(): IPoint;

  subtract(p2: IPoint, newInstance: boolean): IPoint {
    U.pe(!p2, 'subtract argument must be a valid point: ', p2);
    let p1: IPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.duplicate(); }
    p1.x -= p2.x;
    p1.y -= p2.y;
    return p1; }

  add(p2: IPoint, newInstance: boolean): IPoint {
    U.pe(!p2, 'add argument must be a valid point: ', p2);
    let p1: IPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.duplicate(); }
    p1.x += p2.x;
    p1.y += p2.y;
    return p1; }

  addAll(p: IPoint[], newInstance: boolean): IPoint {
    let i;
    let p0: IPoint;
    if (!newInstance) { p0 = this; } else { p0 = this.duplicate(); }
    for (i = 0; i < p.length; i++) { p0.add(p[i], true); }
    return p0; }

  subtractAll(p: IPoint[], newInstance: boolean): IPoint {
    let i;
    let p0: IPoint;
    if (!newInstance) { p0 = this; } else { p0 = this.duplicate(); }
    for (i = 0; i < p.length; i++) { p0.subtract(p[i], true); }
    return p0; }

  multiply(scalar: number, newInstance: boolean): IPoint {
    U.pe( isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
    let p1: IPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.duplicate(); }
    p1.x *= scalar;
    p1.y *= scalar;
    return p1; }

  divide(scalar: number, newInstance: boolean): IPoint {
    U.pe( isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
    let p1: IPoint;
    if (!newInstance) { p1 = this; } else { p1 = this.duplicate(); }
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
    const pt: IPoint = clone ? this.duplicate() : this;
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

  absolute(): number { return Math.sqrt(this.x * this.x + this.y * this.y); }
}
export class GraphPoint extends IPoint{
  dontmixwithPoint: any;
  static fromEvent(e: ClickEvent | MouseMoveEvent | MouseUpEvent | MouseDownEvent | MouseEnterEvent | MouseLeaveEvent | MouseEvent)
    : GraphPoint {
    if (!e) { return null; }
    const p: Point = new Point(e.pageX, e.pageY);
    const g: IGraph = Status.status.getActiveModel().graph;
    return g.toGraphCoord(p); }

  duplicate(): GraphPoint { return new GraphPoint(this.x, this.y); }
  clone(other: GraphPoint): void { this.x = other.x; this.y = other.y; }
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

  duplicate(): Point { return new Point(this.x, this.y); }
  clone(other: Point): void{ this.x = other.x; this.y = other.y; }
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
