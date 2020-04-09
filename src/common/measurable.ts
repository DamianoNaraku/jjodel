// requires: U, jQuery, jQueryUI

import {U, ISize, IPoint, Dictionary, IVertex, IGraph, ModelPiece, IModel, MyConsole, EvalOutput, GraphSize, GraphPoint} from './Joiner';
// import {ModelPiece, IClassifier, IVertex, MAttribute, Size, Point} from './Joiner';
import ResizableOptions = JQueryUI.ResizableOptions;
import ResizableUIParams = JQueryUI.ResizableUIParams;
import DraggableEventUIParams = JQueryUI.DraggableEventUIParams;
import DraggableOptions = JQueryUI.DraggableOptions;
import {createTokenForExternalReference} from '@angular/compiler/src/identifiers';
import {Draggableoptions, Resizableoptions, Rotatableoptions} from '../app/measurabletemplate/measurabletemplate.component';
/*
export class MeasurableArrays {rules: Attr[]; imports: Attr[]; exports: Attr[]; variables: Attr[];
  constraints: Attr[]; chain: Attr[]; chainFinal: Attr[]; dstyle: Attr[]; html: Element; e: Event; }*/
export class ConstraintLeftAdmitteds {
  vertexSize: GraphSize;
  width: number;
  height: number;
  relativePos: GraphPoint;
  relativeVPos: GraphPoint;
  absoluteGPos: GraphPoint;
  absoluteDocPos: IPoint; // può servire a tenere qualcosa fisso al centro del grafo anche se faccio panning
}
export class MeasurableEvalContext extends ConstraintLeftAdmitteds {
  node: Element;
  vertex: IVertex;
  graphSize: ISize;
  documentSize: ISize;
  graphScroll: IPoint;
  graphZoom: IPoint;
  // NB: se un attributo viene sovrascritto durante l'esecuzione di una regola measurable, i valori in questa mappa NON verranno aggiornati fino al prossimo evento (onresize, ondrag...)
  a: Dictionary<string, string>;
  // NB: questi sono sempre updated
  attributes: NamedNodeMap;
  graph: IGraph;
  modelPiece: ModelPiece;
  modelRoot: IModel;
  target: MeasurableEvalContext;
  static isVertex(context: MeasurableEvalContext): boolean { return context.vertex.getHtmlRawForeign() === context.node; }
  setSize = (w: number = null, h: number = null): void => {
    if (U.isNumerizable(w)) { this.width = w; }
    if (U.isNumerizable(h)) { this.height = h; }
  };
  setAbsoluteGPos = (x: number = null, y: number = null): void => {
    const isVertex: boolean = MeasurableEvalContext.isVertex(this);
    if (U.isNumerizable(x)) {
      this.absoluteGPos.x = +x;
      if (isVertex) {
        this.vertexSize.x = this.absoluteGPos.x;
        this.relativeVPos.x = 0;
        this.relativeVPos.y = 0; }
      else { this.relativeVPos.x = this.absoluteGPos.x - this.vertexSize.x; }
      if (this.target) { this.relativePos.x = this.absoluteGPos.x - this.target.absoluteGPos.x; }
      this.absoluteDocPos.x = this.graphSize.x + (this.absoluteGPos.x - this.graphScroll.x) / this.graphZoom.x;
    }
    if (U.isNumerizable(y)) {
      this.absoluteGPos.y = +y;
      if (isVertex) {
        this.vertexSize.y = this.absoluteGPos.y;
        this.relativeVPos.x = 0;
        this.relativeVPos.y = 0; }
      else { this.relativeVPos.y = this.absoluteGPos.y - this.vertexSize.y; }
      if (this.target) { this.relativePos.y = this.absoluteGPos.y - this.target.absoluteGPos.y; }
      this.absoluteDocPos.y = this.graphSize.y + (this.absoluteGPos.y - this.graphScroll.y) / this.graphZoom.y;
    }

  };
  setRelativePos = (x: number = null, y: number = null): void => {
    if (!this.target) return;
    const isVertex: boolean = MeasurableEvalContext.isVertex(this);
    if (U.isNumerizable(x)) { this.absoluteGPos.x = this.target.absoluteGPos.x + x; }
    if (U.isNumerizable(y)) { this.absoluteGPos.y = this.target.absoluteGPos.y + y; }
    this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y);
  };
  setRelativeVPos = (x: number = null, y: number = null): void => {
    const isVertex: boolean = MeasurableEvalContext.isVertex(this);
    if (U.isNumerizable(x)) { this.absoluteGPos.x = this.vertexSize.x + x; }
    if (U.isNumerizable(y)) { this.absoluteGPos.y = this.vertexSize.y + y; }
    this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y);
  };
  setVertexSize = (x: number = null, y: number = null, w: number = null, h: number = null): void => {
    const isVertex: boolean = MeasurableEvalContext.isVertex(this);
    if (U.isNumerizable(w)) this.vertexSize.w = +w;
    if (U.isNumerizable(h)) this.vertexSize.w = +h;
    if (isVertex) { this.setAbsoluteGPos(x, y); }
    else {
      if (U.isNumerizable(x)) { this.absoluteGPos.x = x + this.relativeVPos.x; }
      if (U.isNumerizable(y)) { this.absoluteGPos.y = y + this.relativeVPos.y; }
      this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y); }
  };
  // può servire a tenere qualcosa fisso al centro del grafo anche se faccio panning
  setAbsoluteDocPos = (x: number = null, y: number = null): void => {
    if (U.isNumerizable(x)) {
      this.absoluteDocPos.x = x;
      this.absoluteGPos.x = this.graphScroll.x + this.graphZoom.x * (this.absoluteDocPos.x - this.graphSize.x); }
    if (U.isNumerizable(y)) {
      this.absoluteDocPos.y = y;
      this.absoluteGPos.y = this.graphScroll.y + this.graphZoom.y * (this.absoluteDocPos.y - this.graphSize.y); }
    this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y); };

  setVertexX = (x: number = null): void => { return this.setVertexSize(x, null, null, null); };
  setVertexY = (y: number = null): void => { return this.setVertexSize(null, y, null, null); };
  setVertexW = (w: number = null): void => { return this.setVertexSize(null, null, w, null); };
  setVertexH = (h: number = null): void => { return this.setVertexSize(null, null, null, h); };
  setAbsoluteGPosX = (x: number = null): void => { return this.setAbsoluteGPos(x, null); };
  setAbsoluteGPosY = (y: number = null): void => { return this.setAbsoluteGPos(null, y); };
  setAbsoluteDocPosX = (x: number = null): void => { return this.setAbsoluteDocPos(x, null); };
  setAbsoluteDocPosY = (y: number = null): void => { return this.setAbsoluteDocPos(null, y); };
  setWidth = (w: number = null): void => { this.setSize(w, null); };
  setHeight = (h: number = null): void => { this.setSize(null, h); };
}
type pattern = string;
export enum MeasurableOperators { eq = '=', lt = '<', lte = '<=', gt = '>', gte = '>=', ne = '!='}
/*
export class SizeVariables {
  static width: string = 'width';
  static height: string = 'height';
  static positionRelX: string = 'positionRelX';
  static positionRelY: string = 'positionRelY';
  static positionAbsX: string = 'positionAbsX';
  static positionAbsY: string = 'positionAbsY';
  static relativeTargetSizeX: string = 'relativeTargetSizeX';
  static relativeTargetSizeY: string = 'relativeTargetSizeY';
  static relativeTargetSizeW: string = 'relativeTargetSizeW';
  static relativeTargetSizeH: string = 'relativeTargetSizeH';
  static absoluteTargetSizeX: string = 'absoluteTargetSizeX';
  static absoluteTargetSizeY: string = 'absoluteTargetSizeY';
  static absoluteTargetSizeW: string = 'absoluteTargetSizeW';
  static absoluteTargetSizeH: string = 'absoluteTargetSizeH';
}
export class ValidImportLefts {
  static width: string = 'width';
  static height: string = 'height';
  static positionRelX: string = 'positionRelX';
  static positionRelY: string = 'positionRelY';
  static positionAbsX: string = 'positionAbsX';
  static positionAbsY: string = 'positionAbsY';
  static relativeTargetSizeX: string = 'relativeTargetSizeX';
  static relativeTargetSizeY: string = 'relativeTargetSizeY';
  static absoluteTargetSizeX: string = 'absoluteTargetSizeX';
  static absoluteTargetSizeY: string = 'absoluteTargetSizeY';
}*/
// le uso direttamente dentro la libreria U... // export enum constraintConditions { insideRect = 'insideRect', insideNode = 'insideNode', insidePolygon = 'insidePolygon', insideCircle = 'insideCircle'};
export class MeasurableRuleParts {
  static operatormap: Dictionary<measurableRules, Dictionary<MeasurableOperators, boolean>> = null;
  static leftmap: Dictionary<measurableRules, pattern>;

  static staticinit(): Dictionary<measurableRules, string[]> {
    const leftmap = {};
    const operatormap = {};
    console.log(leftmap, measurableRules.variable);
    console.log(leftmap, measurableRules.variable);
    leftmap[measurableRules.variable] = '^$';
    // leftmap[measurableRules.rule] = '^\$##.*(\.values|\.values\.[0-9]+)\$$'; poi diventata "^values\[[0-9]*\]$" poi cancellata

    leftmap[measurableRules.constraint] = '.*';// should be '^(' + Object.values(SizeVariables).join('|') + ')$';
    leftmap[measurableRules.dynamicStyle] =
      leftmap[measurableRules.dynamicClass] = leftmap[measurableRules.variable];
    // CSS3 selector is not regular language https://stackoverflow.com/questions/12575845/what-is-the-regex-of-a-css-selector
    leftmap[measurableRules.export] =
    leftmap[measurableRules.onRefresh] =
    leftmap[measurableRules.onResizeStart] =
    leftmap[measurableRules.whileResizing] =
    leftmap[measurableRules.onResizeEnd] =
    leftmap[measurableRules.onDragStart] =
    leftmap[measurableRules.whileDragging] =
    leftmap[measurableRules.onDragEnd] = '.+';
    leftmap[measurableRules._jquiRes] = leftmap[measurableRules._jquiDra] = leftmap[measurableRules._jquiRot] = '\'.*';


    operatormap[measurableRules._jquiRes] = {};
    operatormap[measurableRules._jquiDra] = {};
    operatormap[measurableRules._jquiRot] = {};
    operatormap[measurableRules.variable] = {}; // none
    // operatormap[measurableRules.rule] = {};
    // operatormap[measurableRules.rule][MeasurableOperators.eq] = true;
    operatormap[measurableRules.export] = {};
    operatormap[measurableRules.export][MeasurableOperators.eq] = true;
    operatormap[measurableRules.constraint] = {};
    operatormap[measurableRules.constraint][MeasurableOperators.lte] =  true;
    operatormap[measurableRules.constraint][MeasurableOperators.eq] =  true;
    operatormap[measurableRules.constraint][MeasurableOperators.gte] =  true;
    // se lo fai: constraint non lineare NON ha operatori, le cose tipo "insideNode" sono funzioni in U.
    // il valore di fallback è calcolato da un'attributo "fallbackOfLinearConstraint<name>"
  operatormap[measurableRules.dynamicClass] =
    operatormap[measurableRules.dynamicStyle] = operatormap[measurableRules.variable];
  operatormap[measurableRules.onResizeStart] =
    operatormap[measurableRules.whileResizing] =
    operatormap[measurableRules.onResizeEnd] =
    operatormap[measurableRules.onDragStart] =
    operatormap[measurableRules.whileDragging] =
    operatormap[measurableRules.onDragEnd] = operatormap[measurableRules.export];

    MeasurableRuleParts.leftmap = leftmap;
    return MeasurableRuleParts.operatormap = operatormap; }

  static fillEvalContext (evalContext: MeasurableEvalContext, node: Element, targetquery: string, vertex: IVertex = null): void {
    let tmp: any;
    let tmpjq: any;
    let i: number;
    evalContext.node = node;
    evalContext.modelPiece = ModelPiece.getLogic(evalContext.node);
    evalContext.vertex = vertex = (vertex || evalContext.modelPiece.getVertex());
    evalContext.graph = evalContext.vertex.owner;
    const size: ISize = U.sizeof(evalContext.node);
    evalContext.width = tmp.w;
    evalContext.height = tmp.h;
    if (targetquery && (tmpjq = $(evalContext.graph.container).find(targetquery)).length) {
      evalContext.target = new MeasurableEvalContext();
      evalContext.target.node = tmpjq[0];
      MeasurableRuleParts.fillEvalContext(evalContext.target, evalContext.target.node, null, null);
    }
    evalContext.graphScroll = evalContext.graph.scroll;
    evalContext.graphZoom = evalContext.graph.zoom;
    evalContext.graphSize = U.sizeof(evalContext.graph.container);
    evalContext.attributes = evalContext.node.attributes;
    evalContext.a = {};
    for (i = 0; i < evalContext.attributes.length; i++) {
      const attr: Attr = evalContext.attributes[i];
      evalContext.a[attr.name] = attr.value; }
    evalContext.setAbsoluteDocPos(tmp.x, tmp.y);
  };
  prefix: string;
  name: string;
  left: string;
  operator: string;
  right: string;
  target: string;
  output: MeasurableRuleParts;
  attr: Attr;
  outputAttr: Attr;
  // relativeTarget: string;
  fallbackValue: string;
  process(validatefirst: boolean = false, vertex: IVertex = null, graph: IGraph = null): MeasurableRuleParts {
    const out: MeasurableRuleParts = new MeasurableRuleParts(null);
    let tmp: any;
    let i: number;
    let j: number;
    const isRoot = (this.attr.ownerElement === vertex.htmlg);
    const evalContext: MeasurableEvalContext = new MeasurableEvalContext();
    if (validatefirst) {
      const validoperators: string[] = Object.keys(MeasurableRuleParts.operatormap[this.prefix]);
      if (validoperators.length > 0 && this.operator || !MeasurableRuleParts.operatormap[this.prefix][this.operator]) {
        out.operator = validoperators.length ? 'must be one of: ' + tmp.join(' ') : 'must be empty, found instead: ' + this.operator + '';
      }
      if (!new RegExp(MeasurableRuleParts.leftmap[this.prefix]).test(this.left)) {
        out.left = validoperators.length ? 'must be one of: ' + tmp.join(' ') : 'must be empty, found instead: ' + this.operator + '';
      }
      MeasurableRuleParts.fillEvalContext(evalContext, this.attr.ownerElement, this.target, vertex);
      const tmpev = U.evalInContext(evalContext, this.right);
      out.right = tmpev.exception || tmpev.return;
      // do nothing, just report validation  and execution debugging results
      if (out.left || out.operator || tmpev.exception) return out;
    }
    MeasurableRuleParts.fillEvalContext(evalContext, this.attr.ownerElement, this.target, vertex);
    let evalOutput: EvalOutput;
    if (this.prefix === measurableRules.console) {
      evalOutput = new EvalOutput();
      try { evalOutput.return = MyConsole.console.execCommand(this.right); } catch (e) { evalOutput.exception = e; }
    } else { evalOutput = U.evalInContext(evalContext, this.right); }
    if (evalOutput.exception) {
      out.right = '' + evalOutput.exception;
      return out; }
    this.outputAttr.value = out.right = evalOutput.return;
    let attributeSelectorToken = '->';
    let pos: number;
    let selector: string;
    let attrSelector: string;
    let $targetsHtml: JQuery<Element>;
    switch (this.prefix) {
      case measurableRules._jquiRes: case measurableRules._jquiDra: case measurableRules._jquiRot: default: out.prefix = 'invalid prefix or wrong execution time. jqui rules are executed at refresh time.'; return out;
      // cancellata in favore di generic attribute che setta una variabile values[] nel contesto.
      // case measurableRules.rule: break;
      case measurableRules.console:
        // everything already did on exec before
        break;
      case measurableRules.bind:
        let newmp: ModelPiece = evalOutput.return;
        if (!(newmp instanceof ModelPiece)) { out.right = 'returned value is not a ModelPiece.'; }
        newmp.linkToLogic(this.attr.ownerElement);
        break;
      case measurableRules.variable: break;
      case measurableRules.onDragStart:
      case measurableRules.onDragEnd:
      case measurableRules.whileDragging:
      case measurableRules.whileResizing:
      case measurableRules.onResizeEnd:
      case measurableRules.onResizeStart:
      case measurableRules.onRefresh:
        pos = this.left.indexOf(attributeSelectorToken);
        const execCondition: boolean = evalOutput.return;
        if (!execCondition) return;
        selector = (pos === -1 ? this.left : this.left.substr(0, pos)).trim();
        attrSelector = pos === -1 ? null : this.left.substr(pos + attributeSelectorToken.length);
        if (!graph) {
          if (!vertex) { vertex = IVertex.getvertexByHtml(this.attr.ownerElement); }
          graph = vertex.owner; }
        $targetsHtml = selector.length ? $(graph.container).find(selector) as any : $(this.attr.ownerElement);
        if (attrSelector) {
          const regexp: RegExp = new RegExp(attrSelector.trim());
          if (!regexp) { out.left = 'invalid attribute selector, must be a regular expression'; return out; }
          for (i = 0; i < $targetsHtml.length; i++) {
            const attrs: Attr[] = U.getAttributesByRegex($targetsHtml[i], regexp);
            for (j = 0; j < attrs.length; j++) { new MeasurableRuleParts(attrs[j]).process(false, null, null); }
          }
        } else {
          out.left = 'selector must contain an attribute selector starting with "->"';
          return out;
          /*
          for (i = 0; i < $targetsHtml.length; i++) {
            const ruleparts: MeasurableRuleParts[] = Measurable.getRuleList($targetsHtml[i]).all;
            for (j = 0; j < ruleparts.length; j++) { ruleparts[j].process(false, null, null); }
          }*/
        }
        break;
      case measurableRules.export:
        pos = this.left.indexOf(attributeSelectorToken);
        selector = pos === -1 ? this.left : this.left.substr(0, pos);
        attrSelector = pos === -1 ? null : this.left.substr(pos + attributeSelectorToken.length);
        if (!graph) {
          if (!vertex) { vertex = IVertex.getvertexByHtml(this.attr.ownerElement); }
          graph = vertex.owner; }
        $targetsHtml = $(graph.container).find(selector) as any;
        if (attrSelector) {
          for (i = 0; i < $targetsHtml.length; i++) {
            const attr: Attr = $targetsHtml[i].attributes.getNamedItem(attrSelector);
            attr.value = evalOutput.return; }
        } else {
          for (i = 0; i < $targetsHtml.length; i++) { $targetsHtml[i].innerHTML = evalOutput.return; }
        }
        break;
      case measurableRules.dynamicClass:
        if (evalOutput.return !== '' + evalOutput.return) return;
        const classes: string[] = (evalOutput.return + '').split(' ');
        for (i = 0; i < classes.length; i++) {
          const cl = classes[i];
          if (!cl[i].length) continue;
          if (cl[i][0] === '+') { this.attr.ownerElement.classList.add(cl[i].substr(1)); continue; }
          if (cl[i][0] === '-') { this.attr.ownerElement.classList.remove(cl[i].substr(1)); continue; }
          out.right = 'all class tokens must start with a plus (if inserting) or minus (if removing) sign.';
          return out; }
        break;
      case measurableRules.dynamicStyle:
        U.mergeStyles(this.attr.ownerElement, null, evalOutput.return);
        break;
      case measurableRules.constraint:
        let operator = this.operator + '' === '=' ? '==' : this.operator;
        let evret = U.evalInContext(evalContext, this.left + operator + ' +' + evalOutput.return, false);
        U.pe(evret.exception, '_constraint should never fail here: ', evret);
        // just execute the assignment on the context
        if (!evret.return) { U.evalInContext(evalContext, this.left + ' = +' + evalOutput.return, false); }
        break;
    }
    if (!evalOutput.outContext) return;
    const outcontext: MeasurableEvalContext = evalOutput.outContext as any;
    evalContext.graph.setZoom(outcontext.graphZoom.x, outcontext.graphZoom.y);
    evalContext.graph.setScroll(outcontext.graphScroll.x, outcontext.graphScroll.y);
    // evalContext.graph.setGrid(outcontext.graphGrid.x, outcontext.graphGrid.y);
    const isVertex = (evalContext.vertex.getHtmlRawForeign() === evalContext.node);
    if (true || isVertex) { // allow vertex modify outside the root rules?
      // evalContext.vertex.setSize(new GraphSize(outcontext.absoluteGPos.x, outcontext.absoluteGPos.y, outcontext.width, outcontext.height));
      U.pe(true, 'meastest');
      const dorefresh: boolean = this.prefix !== measurableRules.onRefresh;
      evalContext.vertex.setSize(evalContext.vertexSize, dorefresh, dorefresh);
    } else {
      const html: HTMLElement = evalContext instanceof HTMLElement || evalContext instanceof SVGSVGElement ? evalContext as any : null;
      const svg = evalContext instanceof SVGElement ? evalContext : null;
      if (!outcontext.relativeVPos || !U.isNumerizable(outcontext.relativeVPos.x) || !U.isNumerizable(outcontext.relativeVPos.y)) {
        U.pw(true, 'An error inside a measurable condition has happened, an invalid value has been wrote inside the variable "relativeVPos".'); return; }
      if (!html) { U.pw(true, 'inner svg are currently not supported'); return; }
      if (html.style.position === '') html.style.position = 'absolute'; // NB: non sovrascrivere con absolute se c'è sticky, fixed...

      let relativeParentNode: Element = U.getRelativeParentNode(evalContext.node);
      if (relativeParentNode === evalContext.vertex.getHtmlRawForeign()) {
        html.style.top = (outcontext.relativeVPos.y * evalContext.graph.zoom.y) + 'px';
        html.style.left = (outcontext.relativeVPos.x * evalContext.graph.zoom.x) + 'px';
      } else {
        const parentGpos: GraphPoint = evalContext.graph.toGraphCoord(U.sizeof(relativeParentNode).tl());
        html.style.top = ((outcontext.absoluteGPos.y - parentGpos.y) * evalContext.graph.zoom.y) + 'px';
        html.style.left = ((outcontext.absoluteGPos.x - parentGpos.x) * evalContext.graph.zoom.y) + 'px';
      }
      if (U.isNumerizable(outcontext.width)) html.style.width = (+outcontext.width) + 'px';
      if (U.isNumerizable(outcontext.height)) html.style.height = (+outcontext.height) + 'px';
    }
  }

  constructor(a: Attr, prefixendindex: number = null) {
    if (a === null) return; // empty constructor used by output clone var.
    this.attr = a;
    if (!prefixendindex) {
      const key: string = a.name.toLowerCase();
      let prefix: string;
      for (let key in measurableRules) {
        prefix = measurableRules['' + key];
        if (a.name.indexOf(prefix) === 0) { prefixendindex = prefix.length; break; }
      }
    }
    this.prefix = a.name.substr(0, prefixendindex);
    this.name = a.name.substr(prefixendindex);
    /*
    let gti = a.value.indexOf('>=');
    gti = gti == -1 ? Number.POSITIVE_INFINITY : gti;
    let eqi = a.value.indexOf('=');
    eqi = eqi == -1 ? Number.POSITIVE_INFINITY : eqi;
    let lti = a.value.indexOf('>=');
    lti = lti == -1 ? Number.POSITIVE_INFINITY : lti;
    const opindex: number = Math.min(gti, eqi, lti);
    if (opindex === Number.POSITIVE_INFINITY) return null;
    const rightindex = opindex + (eqi === opindex ? 1 : 2);
    this.output = new MeasurableRuleParts(null, null);
    this.left = a.value.substr(0, opindex);
    this.operator = a.value.substr(opindex, rightindex);
    this.right = a.value.substr(rightindex);*/
    const parts: string[] = a.value.split(Measurable.separator);
    this.left = parts.length > 1 ? parts[0] : '';
    this.operator = parts.length === 2 ? parts[1] : '';
    this.right = parts[parts.length - 1];
    this.target = a.ownerElement.getAttribute('relativeSelectorOf' + a.name).trim();
    this.target = this.target.length ? this.target : null;
    this.fallbackValue = null;

    let outputname = a.name.substr(1);
    this.outputAttr = this.attr.ownerElement.attributes.getNamedItem(outputname);
    if (!this.outputAttr) {
      this.attr.ownerElement.setAttribute(outputname, '');
      this.outputAttr = this.attr.ownerElement.attributes.getNamedItem(outputname); }
    }
}

export enum measurableRules {
  // check when updating measurable rules: 1
  _jquiRes = '_jquiRes',
  _jquiDra = '_jquiDra',
  _jquiRot = '_jquiRot',
  console = '_console',
  bind = '_bind', // _bindTo = "@attributename" associa questo node a quel mdoelpiece, anche se era originariamente parte di un altro modelpiece.
  variable = '_',
  'export' = '_export',
  constraint = '_constraint',
  dynamicClass = '_dclass',
  dynamicStyle = '_dstyle',
  onRefresh = '_onRefresh',
  onResizeStart = '_onResizeStart',
  whileResizing = '_whileResizing',
  onResizeEnd = '_onResizeEnd',
  onDragStart = '_onDragStart',
  whileDragging = '_whileDragging',
  onDragEnd = '_onDragEnd',
  onRotationStart = '_onRotationStart',
  whileRotating = '_whileRotating',
  onRotationEnd = '_onRotationEnd',
  // linearConstraint = '_linearConstraint',
  /*
  studia un miglioramento di rule per poter:
  settare una reference
  settare un valore
  gestire array di valori?
  soluzione: crea array values nel contesto.
  values[] = expressionArray
  values[i] = expressionSimpleValue
  ?
  come posso specificare più semplicemente se settare tutti i valori o solo uno senza usare una left-part?
  remind esisterà anche il comando console:
  set $something$ = value
  e devo renderlo significativamente più semplice di quello


  */
  // onMouseEnter = '_onMouseEnter',
  // onMouseLeave = '_onMouseLeave',
  // onFocus = '_onBlur',
  // onBlur = '_onBlur', it's ok to apply css changes here but not change in data, this should be handled by css only.ù
}
export class MeasurableRuleLists {
  // check when updating measurable rules: 2
  all: MeasurableRuleParts[] = [];
  _: MeasurableRuleParts[] = [];
  _jquiDra: MeasurableRuleParts[] = [];
  _jquiRes: MeasurableRuleParts[] = [];
  _jquiRot: MeasurableRuleParts[] = [];
  _console: MeasurableRuleParts[] = [];
  _bind: MeasurableRuleParts[] = [];
  _export: MeasurableRuleParts[] = [];
  _constraint: MeasurableRuleParts[] = [];
  _dclass: MeasurableRuleParts[] = [];
  _dstyle: MeasurableRuleParts[] = [];
  _onRefresh: MeasurableRuleParts[] = [];
  _onResizeStart: MeasurableRuleParts[] = [];
  _whileResizing: MeasurableRuleParts[] = [];
  _onResizeEnd: MeasurableRuleParts[] = [];
  _onDragStart: MeasurableRuleParts[] = [];
  _whileDragging: MeasurableRuleParts[] = [];
  _onDragEnd: MeasurableRuleParts[] = [];
  _onRotationStart: MeasurableRuleParts[] = [];
  _whileRotating: MeasurableRuleParts[] = [];
  _onRotationEnd: MeasurableRuleParts[] = [];
}
export class RotatableOptions {
  degrees: number = 0;
  handle: JQuery<HTMLImageElement> = undefined;
  handleOffset:  {top: number, left: number} =  { top: 0, left: 0 };
  rotationCenterOffset:  {top: number, left: number} =  { top: 0, left: 0 };
  snap: boolean = false;
  step: number = undefined;
  transforms: { translate: string | '(50%, 50%)', scale: string | '(2)', unknownothers: unknown } = undefined; // non chiaro neanche negli esempi demo. googla.
  wheelRotate: boolean = undefined; // NB: non previene lo scroll della pagina come azione default.
  rotate: (event: Event, ui: DraggableEventUIParams) => unknown = undefined; // NB: se la sua trimmed version non inizia con function oppure con /^([^)]+)[\s]*=>$/ allora aggiungicelo tu a tempo di esecuzione? o non vale la pena per degradazione performance?.
  start: (event: Event, ui: DraggableEventUIParams) => unknown = undefined; // in realtà è "start"
  stop: (event: Event, ui: DraggableEventUIParams) => unknown = undefined; // in realtà è "stop"
}
export class Measurable {
  static readonly separator: string = '≔';
  static getRuleList(elem: Element, rulefilter: string[] = null): MeasurableRuleLists {
    let i: number;
    let j: number;
    const rulefilterobj = rulefilter ? U.toDictionary(rulefilter) : {};
    let ret: MeasurableRuleLists = new MeasurableRuleLists();
    let prefix: string;
    for (i = 0; i < elem.attributes.length; i++) {
      const attr: Attr = elem.attributes[i];
      for (let key in measurableRules) {
        // for (j = 0; j < Measurable.rulesListParsingOrder.length; j++) {
        prefix = measurableRules['' + key];
        if (!rulefilterobj[prefix]) continue;
        if (attr.name.indexOf(prefix) === 0) {
          if (prefix === '_' && attr.name.indexOf('_ng') === 0) continue;
          ret.all.push(new MeasurableRuleParts(attr, prefix.length));
          ret[prefix].push(new MeasurableRuleParts(attr, prefix.length));
          break; }
      }
    }
    return ret; }

  // ################ oldies but good

  static measurableElementSetup($root: JQuery<Element>, resizeConfig: ResizableOptions = null, rotConfig: RotatableOptions = null, dragConfig: DraggableOptions = null, v: IVertex = null): void {
    let arr = $root.find('.measurable').addBack('.measurable');
    const vroot: Element = v ? v.getMeasurableNode() : null;
    for (let i = 0; i < arr.length; i++) {
      let h = arr[i];
      if (arr[i] === vroot) { Measurable.measurableElementSetupSingle(h as Element, resizeConfig, rotConfig, dragConfig, v); }
      else Measurable.measurableElementSetupSingle(h as Element,  resizeConfig, rotConfig, dragConfig);
    }
  }
// todo: devo importare rotatableOptions, ResizableOptions è la vra classe dichiarata dalla libreria jqui, non la mia. devo fare lo stesso con rotatable.
  static measurableElementSetupSingle(elem0: Element, resConfig: ResizableOptions = null, rotConfig: RotatableOptions = null, draConfig: DraggableOptions = null, isvroot: IVertex = null): void {
    const elem: HTMLElement = elem0 as HTMLElement;
    // apply resizableborder AND jquery.resize
    if (!elem.classList || !elem.classList.contains('measurable') || elem as any === document) {
      U.pw(true, 'invalid measurable:', elem, !elem.classList, '||', !elem.classList.contains('measurable')); return; }
    U.resizableBorderSetup(elem);
    if (!resConfig) { resConfig = {}; }
    if (!rotConfig) { rotConfig = new RotatableOptions(); }
    if (!draConfig) { draConfig = {}; }
    let func = null;
    let attrval: string = null;
    let i: number;
    let arr: {config: any, friendlyname: string, jquiname: string}[] = [];
    arr.push({config: resConfig, friendlyname: Resizableoptions.create, jquiname: 'create'});
    arr.push({config: resConfig, friendlyname: Resizableoptions.resizeStart, jquiname: 'start'});
    arr.push({config: resConfig, friendlyname: Resizableoptions.resizing, jquiname: 'resize'});
    arr.push({config: resConfig, friendlyname: Resizableoptions.resizeStop, jquiname: 'stop'});
    arr.push({config: draConfig, friendlyname: Draggableoptions['create'], jquiname: 'create'});
    arr.push({config: draConfig, friendlyname: Draggableoptions.dragStart, jquiname: 'start'});
    arr.push({config: draConfig, friendlyname: Draggableoptions.dragging, jquiname: 'resize'});
    arr.push({config: draConfig, friendlyname: Draggableoptions.dragStop, jquiname: 'stop'});
    arr.push({config: rotConfig, friendlyname: Rotatableoptions['create'], jquiname: 'create'});
    arr.push({config: rotConfig, friendlyname: Rotatableoptions.onRotationStart, jquiname: 'start'});
    arr.push({config: rotConfig, friendlyname: Rotatableoptions.onRotating, jquiname: 'resize'});
    arr.push({config: rotConfig, friendlyname: Rotatableoptions.onRotationEnd, jquiname: 'stop'});

    (resConfig as any).prefix = measurableRules._jquiRes;
    (rotConfig as any).prefix = measurableRules._jquiRot;
    (draConfig as any).prefix = measurableRules._jquiDra;

    for (i = 0; i < arr.length; i++) {
      attrval = elem.getAttribute(arr[i].config.prefix + arr[i].friendlyname).trim();
      if (!attrval) func = null;
      else try {
        func = eval(attrval); func = (e, ui) => { try{func(e, ui);} catch(e) {U.pw(true, 'error evaluating' + arr[i].friendlyname + ':', e);}}
      } catch(e) { U.pw(true, 'invalid function as argument of resize create'); func = null; }
      // se resConfig[triggername] non è settato, lo setto a func.
      arr[i].config[arr[i].jquiname] = arr[i].config[arr[i].jquiname] || func;
    }

    if (isvroot) {
      const oldconfig: ResizableOptions = U.cloneObj(resConfig);
      resConfig.resize = (e, ui) => { isvroot.autosizeNew(true, true, measurableRules.whileResizing); oldconfig.resize(e, ui); };
      resConfig.start = (e, ui) => { isvroot.autosizeNew(true, true, measurableRules.onResizeStart); oldconfig.start(e, ui); };
      resConfig.stop = (e, ui) => { isvroot.autosizeNew(true, true, measurableRules.onResizeEnd); oldconfig.stop(e, ui); };
    }

    resConfig.resize = () => { resConfig.resize; };
    delete (resConfig as any).prefix;
    delete (rotConfig as any).prefix;
    delete (draConfig as any).prefix;

    for (const jquikey in resConfig) {
      let friendlykey: string;
      switch (jquikey) {
        default:
          friendlykey = jquikey;
          let customparameterval: string = elem.getAttribute(measurableRules._jquiRes + friendlykey);
          if (resConfig[jquikey] || !customparameterval) { continue; }
          resConfig[jquikey] = customparameterval;
          break;
        // case U.varname2(resConfig.disabled, resConfig): break;
        case U.varname2(resConfig, resConfig.create): case U.varname2(resConfig, resConfig.start): case U.varname2(resConfig, resConfig.stop): case U.varname2(resConfig, resConfig.resize): break;
      }
    }
    for (const jquikey in rotConfig) {
      let friendlykey: string;
      switch (jquikey) {
        default:
          friendlykey = jquikey;
          let customparameterval: string = elem.getAttribute(measurableRules._jquiRot + friendlykey);
          if (rotConfig[jquikey] || !customparameterval) { continue; }
          rotConfig[jquikey] = customparameterval;
          break;
        // case U.varname2(resConfig.disabled, resConfig): break;
        // case U.varname2(rotConfig, rotConfig.create):
        case U.varname2(rotConfig, rotConfig.start): case U.varname2(rotConfig, rotConfig.stop): case U.varname2(rotConfig, rotConfig.rotate): break;
      }
    }
    for (const jquikey in draConfig) {
      let friendlykey: string;
      switch (jquikey) {
        default:
          friendlykey = jquikey;
          let customparameterval: string = elem.getAttribute(measurableRules._jquiDra + friendlykey);
          if (draConfig[jquikey] || !customparameterval) { continue; }
          draConfig[jquikey] = customparameterval;
          break;
        case Draggableoptions.axis: if (U.replaceAll(draConfig[jquikey] + '', ' ', '') === 'x,y') draConfig[jquikey] = null; break;
        // case U.varname2(resConfig.disabled, resConfig): break;
        case U.varname2(draConfig, draConfig.create): case U.varname2(draConfig, draConfig.start): case U.varname2(draConfig, draConfig.stop): case U.varname2(draConfig, draConfig.drag): break;
      }
    }

    const $elem = $(elem);
    $elem.resizable(resConfig).draggable(draConfig);// .rotatable(rotConfig);
    U.pe(true, 'rotatable:', ($elem as any).rotatable);
    /*
    if (resConfig.disabled) $elem.resizable('disable');
    if (rotConfig.disabled) $elem.rotatable('disable');
    if (draConfig.disabled) $elem.draggable('disable');*/
  }

}
