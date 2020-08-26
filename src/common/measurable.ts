// requires: U, jQuery, jQueryUI

import {
  U,
  ISize,
  IPoint,
  Dictionary,
  IVertex,
  IGraph,
  ModelPiece,
  IModel,
  MyConsole,
  EvalOutput,
  GraphSize,
  GraphPoint,
  Draggableoptions,
  Resizableoptions,
  Rotatableoptions,
  Size, Point, Status, ReservedClasses, SelectorOutput, MeasurableTemplateGenerator, Model, MyException
} from './Joiner';
// import {ModelPiece, IClassifier, IVertex, MAttribute, Size, Point} from './Joiner';
import ResizableOptions = JQueryUI.ResizableOptions;
import ResizableUIParams = JQueryUI.ResizableUIParams;
import DraggableEventUIParams = JQueryUI.DraggableEventUIParams;
import DraggableOptions = JQueryUI.DraggableOptions;
import {createTokenForExternalReference} from '@angular/compiler/src/identifiers';
import {PendingFunctionCall, ProtectedModelPiece} from '../Model/modelPiece';
/*
export class MeasurableArrays {rules: Attr[]; imports: Attr[]; exports: Attr[]; variables: Attr[];
  constraints: Attr[]; chain: Attr[]; chainFinal: Attr[]; dstyle: Attr[]; html: Element; e: Event; }*/

export class ConstraintLeftAdmittedsStatic {
  static readonly vertexSizeX: 'vertexSize.x' = 'vertexSize.x';
  static readonly vertexSizeY: 'vertexSize.y' = 'vertexSize.y';
  static readonly vertexSizeW: 'vertexSize.w' = 'vertexSize.w';
  static readonly vertexSizeH: 'vertexSize.h' = 'vertexSize.h';
  static readonly width: 'width' = 'width';
  static readonly height: 'height' = 'height';
  static readonly relativePosX: 'relativePos.x' = 'relativePos.x';
  static readonly relativePosY: 'relativePos.y' = 'relativePos.y';
  static readonly relativeVPosX: 'relativeVPos.x' = 'relativeVPos.x';
  static readonly relativeVPosY: 'relativeVPos.y' = 'relativeVPos.y';
  static readonly absoluteGPosX: 'absoluteGPos.x' = 'absoluteGPos.x';
  static readonly absoluteGPosY: 'absoluteGPos.y' = 'absoluteGPos.y';
  static readonly absoluteDocPosX: 'absoluteDocPos.x' = 'absoluteDocPos.x';
  static readonly absoluteDocPosY: 'absoluteDocPos.y' = 'absoluteDocPos.y';

  static readonly targetvertexSizeX: 'target.vertexSize.x' = 'target.vertexSize.x';
  static readonly targetvertexSizeY: 'target.vertexSize.y' = 'target.vertexSize.y';
  static readonly targetvertexSizeW: 'target.vertexSize.w' = 'target.vertexSize.w';
  static readonly targetvertexSizeH: 'target.vertexSize.h' = 'target.vertexSize.h';
  static readonly targetwidth: 'target.width' = 'target.width';
  static readonly targetheight: 'target.height' = 'target.height';
  static readonly targetrelativePosX: 'target.relativePos.x' = 'target.relativePos.x';
  static readonly targetrelativePosY: 'target.relativePos.y' = 'target.relativePos.y';
  static readonly targetrelativeVPosX: 'target.relativeVPos.x' = 'target.relativeVPos.x';
  static readonly targetrelativeVPosY: 'target.relativeVPos.y' = 'target.relativeVPos.y';
  static readonly targetabsoluteGPosX: 'target.absoluteGPos.x' = 'target.absoluteGPos.x';
  static readonly targetabsoluteGPosY: 'target.absoluteGPos.y' = 'target.absoluteGPos.y';
  static readonly targetabsoluteDocPosX: 'target.absoluteDocPos.x' = 'target.absoluteDocPos.x';
  static readonly targetabsoluteDocPosY: 'target.absoluteDocPos.y' = 'target.absoluteDocPos.y';
}
export class UnsafeMeasurableEvalContext {
  model: /*ModelPiece*/ModelPiece;
  node: /*HtmlElement*/Element;
  vertex: /*Vertex*/IVertex;
  graph: /*Graph*/IGraph;
  modelRoot: /*Model*/IModel;
}
export class MeasurableEvalContext {
  unsafec: UnsafeMeasurableEvalContext
  graphSize: ISize;
  documentSize: ISize;
  graphScroll: IPoint;
  graphZoom: IPoint;
  // NB: se un attributo viene sovrascritto durante l'esecuzione di una regola measurable, i valori in questa mappa NON verranno aggiornati fino al prossimo evento (onresize, ondrag...)
  a: Dictionary<string, string>;
  // NB: questi sono sempre updated
  attributes: Dictionary<string, string>;
  model: ProtectedModelPiece;
  target: MeasurableEvalContext;
  isFilled: boolean = false;

  // editable positions
  vertexSize: GraphSize;
  width: number;
  height: number;
  relativePos: GraphPoint;
  relativeVPos: GraphPoint;
  absoluteGPos: GraphPoint;
  absoluteDocPos: IPoint; // posizione dell'elemento rispetto al documento, es: impedisce che l'elemento scenda oltre metà schermata.
  constructor() {
    this.unsafec = new UnsafeMeasurableEvalContext();
  }

  static isVertex(context: MeasurableEvalContext): boolean { return context.unsafec.vertex.getHtmlRawForeign() === context.unsafec.node; }
  setSize = (w: number = null/*number*/, h: number = null/*number*/): void => /*void*/{
    if (U.isNumerizable(w)) { this.width = +w; }
    if (U.isNumerizable(h)) { this.height = +h; }
  };
  setAbsoluteGPos = (x: number = null/*number*/, y: number = null/*number*/): void=>/*void*/ {
    const isVertex: boolean = MeasurableEvalContext.isVertex(this);
    if (U.isNumerizable(x)) {
      this.absoluteGPos.x = +x;
      if (isVertex) {
        this.vertexSize.x = this.absoluteGPos.x;
        this.relativeVPos.y = 0; //y intenzionale
        this.relativeVPos.x = 0; }
      else { this.relativeVPos.x = this.absoluteGPos.x - this.vertexSize.x; }
      if (this.target) { this.relativePos.x = this.absoluteGPos.x - this.target.absoluteGPos.x; }
      this.absoluteDocPos.x = this.graphSize.x + (this.absoluteGPos.x - this.graphScroll.x) / this.graphZoom.x;
    }
    if (U.isNumerizable(y)) {
      this.absoluteGPos.y = +y;
      if (isVertex) {
        this.vertexSize.y = this.absoluteGPos.y;
        this.relativeVPos.x = 0; //x intenzionale
        this.relativeVPos.y = 0; }
      else { this.relativeVPos.y = this.absoluteGPos.y - this.vertexSize.y; }
      if (this.target) { this.relativePos.y = this.absoluteGPos.y - this.target.absoluteGPos.y; }
      this.absoluteDocPos.y = this.graphSize.y + (this.absoluteGPos.y - this.graphScroll.y) / this.graphZoom.y;
    }

  };
  setRelativePos = (x: number = null/*number*/, y: number = null/*number*/): void=>/*void*/ {
    if (!this.target) return;
    //const isVertex: boolean = MeasurableEvalContext.isVertex(this);
    if (U.isNumerizable(x)) { this.absoluteGPos.x = this.target.absoluteGPos.x + +x; }
    if (U.isNumerizable(y)) { this.absoluteGPos.y = this.target.absoluteGPos.y + +y; }
    this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y);
  };
  setRelativeVPos = (x: number = null/*number*/, y: number = null/*number*/): void=>/*void*/ {
    //const isVertex: boolean = MeasurableEvalContext.isVertex(this); should not be used at all in vertexes.
    if (U.isNumerizable(x)) { this.absoluteGPos.x = this.vertexSize.x + +x; }
    if (U.isNumerizable(y)) { this.absoluteGPos.y = this.vertexSize.y + +y; }
    this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y);
  };
  setVertexSize = (x: number = null/*number*/, y: number = null/*number*/, w: number = null/*number*/, h: number = null/*number*/): void=>/*void*/ {
    const isVertex: boolean = MeasurableEvalContext.isVertex(this);
    console.log('vsize pre:', this.vertexSize.duplicate(), 'w:', w, 'isVertex?', isVertex);
    if (U.isNumerizable(w)) this.vertexSize.w = +w;
    if (U.isNumerizable(h)) this.vertexSize.h = +h;
    console.log('vsize mid:', this.vertexSize.duplicate());
    if (isVertex) { this.setAbsoluteGPos(x, y); }
    else {
      if (U.isNumerizable(x)) { this.absoluteGPos.x = +x + this.relativeVPos.x; }
      if (U.isNumerizable(y)) { this.absoluteGPos.y = +y + this.relativeVPos.y; }
      this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y); }
    console.log('vsize post:', this.vertexSize.duplicate());
  };
  // può servire a tenere qualcosa fisso al centro del grafo anche se faccio panning
  setAbsoluteDocPos = (x: number = null/*number */, y: number = null/*number*/): void=>/*void*/ {
    if (U.isNumerizable(x)) {
      this.absoluteDocPos.x = +x;
      this.absoluteGPos.x = this.graphScroll.x + this.graphZoom.x * (this.absoluteDocPos.x - this.graphSize.x); }
    if (U.isNumerizable(y)) {
      this.absoluteDocPos.y = +y;
      this.absoluteGPos.y = this.graphScroll.y + this.graphZoom.y * (this.absoluteDocPos.y - this.graphSize.y); }
    this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y); };

  setVertexSizeX = (x: number/*number*/ = null): void=>/*void*/ { return this.setVertexSize(x, null, null, null); };
  setVertexSizeY = (y: number/*number*/ = null): void=>/*void*/ { return this.setVertexSize(null, y, null, null); };
  setVertexSizeW = (w: number/*number*/ = null): void=>/*void*/ { return this.setVertexSize(null, null, w, null); };
  setVertexSizeH = (h: number/*number*/ = null): void=>/*void*/ { return this.setVertexSize(null, null, null, h); };
  setVertexX = (x: number/*number*/ = null): void=>/*void*/ { return this.setVertexSizeX(x); };
  setVertexY = (y: number/*number*/ = null): void=>/*void*/ { return this.setVertexSizeY(y); };
  setVertexW = (w: number/*number*/ = null): void=>/*void*/ { return this.setVertexSizeW(w); };
  setVertexH = (h: number/*number*/ = null): void=>/*void*/ { return this.setVertexSizeH(h); };
  setRelativePosX = (x: number/*number*/ = null): void=>/*void*/ { return this.setRelativePos(x, null); };
  setRelativePosY = (y: number/*number*/ = null): void=>/*void*/ { return this.setRelativePos(null, y); };
  setRelativeVPosX = (x: number/*number*/ = null): void=>/*void*/ { return this.setRelativeVPos(x, null); };
  setRelativeVPosY = (y: number/*number*/ = null): void=>/*void*/ { return this.setRelativeVPos(null, y); };
  setAbsoluteGPosX = (x: number/*number*/ = null): void=>/*void*/ { return this.setAbsoluteGPos(x, null); };
  setAbsoluteGPosY = (y: number/*number*/ = null): void=>/*void*/ { return this.setAbsoluteGPos(null, y); };
  setAbsoluteDocPosX = (x: number/*number*/ = null): void=>/*void*/ { return this.setAbsoluteDocPos(x, null); };
  setAbsoluteDocPosY = (y: number/*number*/ = null): void=>/*void*/ { return this.setAbsoluteDocPos(null, y); };
  setWidth = (w: number/*number*/ = null): void=>/*void*/ { return this.setSize(w, null); };
  setHeight = (h: number/*number*/ = null): void=>/*void*/ { return this.setSize(null, h); };

  // serve a dare un oggetto verosimile da cui poter generare i suggerimenti dei nomi e tipi per l'editor delle measurableRule
  static fillFake(filltarget: boolean = true): MeasurableEvalContext {
    let thiss: MeasurableEvalContext = new MeasurableEvalContext();
    thiss.isFilled = false;
    thiss.width = thiss.height = 0;
    thiss.unsafec = new UnsafeMeasurableEvalContext();
    thiss.relativePos = thiss.relativeVPos = thiss.absoluteGPos = thiss.absoluteDocPos = new GraphPoint(0, 0);
    thiss.absoluteDocPos = new Point(0, 0);
    thiss.documentSize = new Size(0, 0);
    thiss.vertexSize = new GraphSize(0, 0, 0, 0);
    thiss.model = U.copyFirstLevelStructureWithoutValues(new ProtectedModelPiece(null, null)) as any;
    // set unsafec
    console.log(new IVertex(null, null), U.copyFirstLevelStructureWithoutValues(new IVertex(null, null)));
    // throw new Error();
    thiss.unsafec.vertex = U.copyFirstLevelStructureWithoutValues(new IVertex(null, null)) as any;
    thiss.unsafec.graph = U.copyFirstLevelStructureWithoutValues(Status.status.mm.graph) as any;
    thiss.unsafec.modelRoot = U.copyFirstLevelStructureWithoutValues(Status.status.mm) as any;
    thiss.unsafec.node = document.createElement('div');

    thiss.attributes = thiss.a = []; // not an array but i want [] suggestions. todo: se è oggetto suggerisci "." se è array suggerisci "["
    // approximation tricks
    if (filltarget) thiss.target = MeasurableEvalContext.fillFake(false);
    thiss.model.unsafemp = thiss.unsafec.model = thiss.model as any as ModelPiece;
    return thiss; }

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

  static fillEvalContext(evalContext: MeasurableEvalContext, backupContext: MeasurableEvalContext = null, node: Element, targetquery: string): MyException {
    console.log('FillEvalContext() called, targetquery: |' + targetquery + '|');
    let tmp: any;
    let tmpjq: any;
    let i: number;
    let j: number;
    const mp: ModelPiece = ModelPiece.getLogic(node);
    const vertex: IVertex = mp.getVertex();
    const graph: IGraph = vertex.owner;
    const backupcontext0: MeasurableEvalContext = backupContext; // to overwrite ".target"
    // prevent to overwrite the initial backup status with a mid-way status by filling a disposable object instead
    if (!backupContext || backupContext.isFilled) backupContext = new MeasurableEvalContext() as any;
    let debug = (window['debug'] === 1);
    let filltarget = () => {
      let backupcontext = 'do not use here, keep changes on the real backupcontext, never write on the mock disposable object.';
      let $tmpjq: JQuery<Element>;
      if (targetquery) try { $tmpjq = $(graph.container).find(targetquery); }
      catch (e) { console.error('exception:', e); return e; }
      U.pif(true, '1.context:', evalContext, 'target:', $tmpjq, evalContext.target);
      if ($tmpjq && $tmpjq.length) {
        evalContext.target = new MeasurableEvalContext();
        backupcontext0.target = backupcontext0.target || new MeasurableEvalContext();
        let exception = MeasurableRuleParts.fillEvalContext(evalContext.target, backupcontext0.target, $tmpjq[0], null);
        if (exception) { console.error('exception2:', exception); exception['mysource'] = ['occurred inside this.target']; return exception; }
      }
      U.pif(true, '2.context:', evalContext, 'target:', $tmpjq, evalContext.target);
      U.pe(debug && !evalContext.target, '!target');
    };

    if (targetquery && !backupContext.target) { filltarget(); }
    if (evalContext.isFilled) {
      evalContext.setAbsoluteDocPos(evalContext.absoluteDocPos.x, evalContext.absoluteDocPos.y);// non ho capito perchè ma rel.pos và in casino, quindi rifaccio la set absolutepos che reinizializza tutte a catena
      U.pe (evalContext.target && (evalContext.relativePos.y !== evalContext.absoluteGPos.y - evalContext.target.absoluteGPos.y),
      'context:', evalContext, 'failed assertion, relativePos != this.absolGpos - target.absolGpos ', evalContext.relativePos, ' !== ', evalContext.absoluteGPos, ' - ', evalContext.target && evalContext.target.absoluteGPos)

      return null; } // must call filltarget() (at least to check if target is filled) even if the main context is already filled. so it's placed below.
    backupContext.isFilled = true; // avoid dual fill, se ci sono due eval() questo rollbackerebbe alla scorsa esecuzione.
    evalContext.isFilled = true;

    evalContext.unsafec.node = node;
    backupContext.unsafec.node = node; // node.cloneNode(true) as Element;
    backupContext.unsafec.graph = evalContext.unsafec.graph = graph;
    backupContext.unsafec.vertex = evalContext.unsafec.vertex = vertex;
    backupContext.unsafec.model = evalContext.unsafec.model = mp;
    backupContext.unsafec.modelRoot = evalContext.unsafec.modelRoot = mp.getModelRoot();
    backupContext.model = new ProtectedModelPiece(mp, null);
    evalContext.model = new ProtectedModelPiece(mp, null);
    U.pe(!evalContext.model.unsafemp, 'unsafe is unset:', evalContext.model, mp, evalContext);
    delete evalContext.model.applyChanges;
    const isvroot: boolean = vertex.getMeasurableNode() === node;
    const size: ISize = isvroot ? graph.toHtmlCoordS(vertex.getSize()) : U.sizeof(node);
    backupContext.width = evalContext.width = size.w;
    backupContext.height = evalContext.height = size.h;


    evalContext.graphScroll = graph.scroll.duplicate();
    evalContext.graphZoom = graph.zoom.duplicate();
    evalContext.vertexSize = vertex.getSize().duplicate();
    evalContext.graphSize = U.sizeof(graph.container).duplicate();
    evalContext.documentSize = new Size(0, 0, document.documentElement.scrollWidth, document.documentElement.scrollHeight); // documentElement counts also body's margin

    backupContext.graphScroll = evalContext.graphScroll.duplicate();
    backupContext.graphZoom = evalContext.graphZoom.duplicate();
    backupContext.vertexSize = evalContext.vertexSize.duplicate();
    backupContext.graphSize = evalContext.graphSize.duplicate();
    backupContext.documentSize = evalContext.documentSize.duplicate();


    let attrs = evalContext.unsafec.node.attributes;
    evalContext.a = {};
    evalContext.attributes = evalContext.a;
    backupContext.attributes = null;
    backupContext.a = null;
    for (i = 0; i < attrs.length; i++) { evalContext.a[attrs[i].name] = attrs[i].value; }

    evalContext.relativePos = new GraphPoint();
    evalContext.relativeVPos = new GraphPoint();
    evalContext.absoluteGPos = new GraphPoint(); // all updated when absoluteGpos is updated.
    evalContext.absoluteDocPos = new Point();
    backupContext.relativePos = new GraphPoint();
    backupContext.relativeVPos = new GraphPoint();
    backupContext.absoluteGPos = new GraphPoint();
    backupContext.absoluteDocPos = new Point();

    // if (evalContext.target) evalContext.relativePos.y = null; // debug
    evalContext.setAbsoluteDocPos(size.x, size.y);
    backupContext.setAbsoluteDocPos(size.x, size.y);

    U.pe (evalContext.target && (evalContext.relativePos.y !== evalContext.absoluteGPos.y - evalContext.target.absoluteGPos.y),
      'context:', evalContext, 'failed assertion, relativePos != this.absolGpos - target.absolGpos ', evalContext.relativePos, ' !== ', evalContext.absoluteGPos, ' - ', evalContext.target && evalContext.target.absoluteGPos)

    return null; };

  prefix: string;
  name: string;
  left: string;
  operator: string;
  right: string;
  target: string;
  output: MeasurableRuleParts;
  triggeredResults: MeasurableRuleParts[];
  attr: Attr;
  outputAttr: Attr;
  // relativeTarget: string;
  fallbackValue: string;

  process(validatefirst: boolean = false, vertex: IVertex = null, graph: IGraph = null): MeasurableRuleParts{
    let out: MeasurableRuleParts;
    out = this.process0(validatefirst, vertex, graph);
    console.log('process rule:', this.prefix, this, 'out:', out);
    return out; }

  process0(validatefirst: boolean = false, vertex: IVertex = null, graph: IGraph = null): MeasurableRuleParts {
    let exception: MyException;
    const out: MeasurableRuleParts = new MeasurableRuleParts(null, null, true);
    let tmp: any;
    let i: number;
    let j: number;
    let evalContext: MeasurableEvalContext = new MeasurableEvalContext();
    let rollbackContext: MeasurableEvalContext = new MeasurableEvalContext();
    if (validatefirst) {
      const validoperators: string[] = Object.keys(MeasurableRuleParts.operatormap[this.prefix]);
      if (validoperators.length > 0 && this.operator || !MeasurableRuleParts.operatormap[this.prefix][this.operator]) {
        out.operator = validoperators.length ? 'must be one of: ' + tmp.join(' ') : 'must be empty, found instead: ' + this.operator + '';
      }
      if (!new RegExp(MeasurableRuleParts.leftmap[this.prefix]).test(this.left)) {
        out.left = validoperators.length ? 'must be one of: ' + tmp.join(' ') : 'must be empty, found instead: ' + this.operator + '';
      }
      exception = MeasurableRuleParts.fillEvalContext(evalContext, rollbackContext, this.attr.ownerElement, out && out.target);
      if (exception) {
        out.left += '\ninvalid target selector: ' + exception.toString();
        out.right += '\ninvalid target selector: ' + exception.toString();
        return out; }
      const tmpev = U.evalInContext(evalContext, this.right);
      out.right = tmpev.exception || tmpev.return;
      // do nothing, just report validation  and execution debugging results
      if (out.left || out.operator || tmpev.exception) return out;
    }

    const exportChanges = (outContext: MeasurableEvalContext, safeContextRollback: MeasurableEvalContext): boolean => {
      let ret: boolean = true;
      try{
        console.log('exportchanges part 1', outContext.vertexSize.y);
        exportChanges0(outContext, safeContextRollback, false);
        console.log('exportchanges part 2', outContext.vertexSize.y);
        if (outContext.target) exportChanges0(outContext.target, safeContextRollback.target, false);
        console.log('exportchanges part 3', outContext.vertexSize.y);
      } catch(e) {
        throw e;
        out.right += + '\n\npartially failed to export changes, likely caused by an overwrite of a predefined variable object.:' + e.toString();
        doRollback();
        ret = false; }
      // rollbackContext.unsafe.model.refreshGUI_Alone(); will erase export changes and cause infinite looks on "onRefresh"
      // if (rollbackContext.target) rollbackContext.target.unsafe.model.refreshGUI_Alone();
      return ret; }

    let debug: boolean = this.prefix === measurableRules.export;
    const doRollback = () => {
      console.trace('doing rollback');
      try{
        exportChanges0(rollbackContext, rollbackContext, true);
        if (rollbackContext.target) exportChanges0(rollbackContext.target, rollbackContext.target, true);
      } catch(e) {
        out.right += + '\npartially failed to rollback changes, contact the developer.:' + e.toString(); return false; }
      return true; }

    const exportChanges0 = (outcontext: MeasurableEvalContext, safeContextRollback: MeasurableEvalContext, isRollback: boolean): void => {
      // let oldContext = outcontext;
      let ermsg: string;
      let rollbackContext = 'donotuse';
      let evalContext = 'donotusetoo'
      const vertex: IVertex = safeContextRollback.unsafec.vertex;
      const graph: IGraph = vertex.owner;
      graph.setZoom(outcontext.graphZoom.x, outcontext.graphZoom.y);
      // graph.setScroll(500, 500);//  error here??? questo mi cambia vpos.y
      graph.setScroll(outcontext.graphScroll.x, outcontext.graphScroll.y);//  error here??? questo mi cambia vpos.y
      // U.pe(true, 'meastest');
      // evalContext.graph.setGrid(outcontext.graphGrid.x, outcontext.graphGrid.y);
      const isVertex = (vertex.getMeasurableNode() === safeContextRollback.unsafec.node);
      vertex.setSize(outcontext.vertexSize, false, true);
      if (!outcontext.model && outcontext !== safeContextRollback) {
        out.right += 'invalid final value for this.model = ' + outcontext.model + ', please do not overwrite context variables.';
        doRollback(); return; }
      if (!isVertex){
        const html: HTMLElement = safeContextRollback.unsafec.node instanceof HTMLElement || safeContextRollback.unsafec.node instanceof SVGSVGElement ? safeContextRollback.unsafec.node as any : null;
        const svgSubElement: SVGElement = !html ? safeContextRollback.unsafec.node as any : null;
        if (!outcontext.relativeVPos || !U.isNumerizable(safeContextRollback.relativeVPos.x) || !U.isNumerizable(outcontext.relativeVPos.y)) {
          out.right+= '\nAn error inside a measurable condition has happened, an invalid value has been wrote inside the variable "relativeVPos".';
          doRollback();  return; }
        if (!html) { out.right += 'inner svg\'s are currently not supported'; doRollback(); return; }
        if (html.style.position !== 'absolute') html.style.position = 'absolute';
        let relativeParentNode: Element = U.getRelativeParentNode(safeContextRollback.unsafec.node);
        if (relativeParentNode === vertex.getHtmlRawForeign()) {
          html.style.top = (outcontext.relativeVPos.y * graph.zoom.y) + 'px';
          html.style.left = (outcontext.relativeVPos.x * graph.zoom.x) + 'px';
        } else {
          // vertex.setSize(outcontext.vertexSize); already done no need to do anything?
          /*const parentGpos: GraphPoint = graph.toGraphCoord(U.sizeof(relativeParentNode).tl());
          html.style.top = ((outcontext.absoluteGPos.y - parentGpos.y) * graph.zoom.y) + 'px';
          html.style.left = ((outcontext.absoluteGPos.x - parentGpos.x) * graph.zoom.y) + 'px';*/
        }
        if (U.isNumerizable(outcontext.width)) html.style.width = (+outcontext.width) + 'px';
        if (U.isNumerizable(outcontext.height)) html.style.height = (+outcontext.height) + 'px';
      }
      if (!isRollback) {
        // called by rollbackContext because evalContext got the method deleted.
        try {
          PendingFunctionCall.executeProtectedMPBuffer();
          PendingFunctionCall.clearProtectedMPBuffer();
        } catch(e) {
          out.right += 'Error while executing buffered model "set" functions, likely caused by invalid paramerers. ' + e.toString();
          doRollback();
          return; }
      } else {
        PendingFunctionCall.clearProtectedMPBuffer();
      }
      // outcontext.setsize o refresh vertex
    }


    let evalOutput: EvalOutput<MeasurableEvalContext> = null;
    const executeRight = (): boolean => {
//      window['debug'] = 1;
      exception = MeasurableRuleParts.fillEvalContext(evalContext, rollbackContext, this.attr.ownerElement, out && out.target);
//      U.pe(window['debug'] === 1, 'out:', out, 'targetStr: |' + out.target + '|', 'exception:', exception, 'evalContext:', evalContext);
      if (exception) {
        out.right += '\nexecution failed, probably for an invalid target selector: ' + exception.toString();
        return false; }
      evalOutput = U.evalInContext<MeasurableEvalContext>(evalContext, this.right);
      let ret: boolean;
      if (evalOutput.exception) {
        out.right += '\n' + evalOutput.exception;
        ret = false; }
      else {
        this.outputAttr.value = evalOutput.return;
        out.right += evalOutput.return;
        ret = true; }
    if (!ret) doRollback();
    return ret; };

    const executeSelector = (): boolean => {
      exception = MeasurableRuleParts.fillEvalContext(evalContext, rollbackContext, this.attr.ownerElement, null);
      evalOutput = U.evalInContext<MeasurableEvalContext>(evalContext, this.target);
      let ret: boolean;
      if (evalOutput.exception) {
        throw evalOutput.exception;
        out.target += '\n' + evalOutput.exception;
        ret = false; }
      else {
        if (evalOutput.return instanceof ModelPiece || evalOutput.return instanceof ProtectedModelPiece) {
          out.target += '\nwarn: output was a ' + U.getTSClassName(evalOutput.return) + ', it got automatically transformed to css+ selector string with .getSelector();';
          evalOutput.return = evalOutput.return.getSelector(); }
        this.outputAttr.value = evalOutput.return;
        out.target = evalOutput.return + out.target;
        ret = true; }
    if (!ret) doRollback();
    return ret; };
    // const exportChanges = () => { U.pe(true, todo); };
    let selectorout: SelectorOutput;

    //U.pe(!rollbackContext.target, '!starget-1', evalOutput.outContext.target);
    if (this.target && !executeSelector()) return out;
    switch (this.prefix) {
      case measurableRules._jquiRes: case measurableRules._jquiDra: case measurableRules._jquiRot:
          out.prefix = 'invalid prefix or wrong execution time. ' + this.prefix + ' rules are parsed at refresh time.';
          U.pw(true, out.prefix);
          return out;
      case measurableRules.console:
          try { out.right += MyConsole.console.execCommand(this.right); } catch (e) { out.right += 'command failed:' + e.toString(); }
          return out;
      default:
          U.pe(true, 'unexpected rule: ' + this.prefix, this);
          out.prefix = 'unexpected rule:' + this.prefix;
          return out;
      case measurableRules.bind:
          if (!executeRight()) return out;
          if (!exportChanges(evalOutput.outContext, rollbackContext)) return out;
          let newmp: ModelPiece = evalOutput.return;
          if (!(newmp instanceof ModelPiece)) { out.right += 'returned value is not a ModelPiece.'; return out; }
          newmp.linkToLogic(this.attr.ownerElement);
          return out;
      case measurableRules.variable:
          if (!executeRight()) return out;
          if (!exportChanges(evalOutput.outContext, rollbackContext)) return out;
          return out;
      case measurableRules.onDragStart:
      case measurableRules.whileDragging:
      case measurableRules.onDragEnd:
      case measurableRules.onResizeStart:
      case measurableRules.whileResizing:
      case measurableRules.onResizeEnd:
      case measurableRules.onRotationStart:
      case measurableRules.whileRotating:
      case measurableRules.onRotationEnd:
      case measurableRules.onRefresh:
          out.triggeredResults = [];
          ///// check precondition
          exception = MeasurableRuleParts.fillEvalContext(evalContext, rollbackContext, this.attr.ownerElement, out && out.target);
        if (exception) {
          out.left += '\ninvalid target selector: ' + exception.toString();
          out.right += '\ninvalid target selector: ' + exception.toString();
          return out; }
          vertex = rollbackContext.unsafec.vertex;
          U.pe (evalContext.target && (evalContext.relativePos.y !== evalContext.absoluteGPos.y - evalContext.target.absoluteGPos.y),
          'context:', evalContext, 'failed assertion, relativePos != this.absolGpos - target.absolGpos ', evalContext.relativePos, ' !== ', evalContext.absoluteGPos, ' - ', evalContext.target && evalContext.target.absoluteGPos)

        evalOutput = U.evalInContext(evalContext, this.left);
          if (evalOutput.exception) {
            out.left += '' + evalOutput.exception;
            out.right += 'not executed.';
            return out; }
          out.left = evalOutput.return;
          if (!out.left) {
            out.right += 'not executed.';
            return out; }
          console.log('5xd', evalOutput.outContext, rollbackContext);
        // return null; // per qualche motivo questo export changes mi azzera la Y del vertex.
          if (!exportChanges(evalOutput.outContext, rollbackContext)) return out; // va messo qui, se lo metto dopo i triggers equivale ad un rollback dei loro cambiamenti.
          ///// try execution
          selectorout = U.processSelectorPlusPlus(this.right, false, $(vertex.owner.container), $(this.attr.ownerElement), Measurable.GlobalPrefix);
          if (selectorout.exception) { out.right += (out.right ? '\n' : '') + selectorout.exception.toString(); return out; }
          // last validation and execution.
          const htmlFoundsevt: Element[] = [];
          const vertexFoundsevt: IVertex[] = [];
          // console.log('resultset', selectorout);
          for (i = 0; i < selectorout.resultSetAttr.length; i++) {
            const a: Attr = selectorout.resultSetAttr[i];
            let ruleprefix: string = Measurable.isExecutableRule(a.name, true);
            if (!ruleprefix) continue;
            let html: Element = a.ownerElement;
            let vertex: IVertex;
            let pos: number = htmlFoundsevt.indexOf(html);
            if (pos > 0) { vertex = vertexFoundsevt[pos]; } else {
              vertex = html.classList.contains(ReservedClasses.vertexRoot) ? IVertex.getvertexByHtml(html) : null;
              htmlFoundsevt.push(html);
              vertexFoundsevt.push(vertex); }
              let mr: MeasurableRuleParts = new MeasurableRuleParts(a, ruleprefix, true);
              try { out.triggeredResults.push(mr.process(false, vertex)); }
              catch (e) { out.right += '\n' + e.toString(); /* must not stop if only 1 triggered fails. */ }
            }
          out.right += selectorout.jqselector + ' ' + U.AttributeSelectorOperator + ' ' + selectorout.attrselector
            + (out.right.length ? '\n' : '' ) + out.right;
          return out;

      case measurableRules.export:
        ////////// prima trovo i bersagli, così se non ci sono mi fermo.
        vertex = vertex || IVertex.getvertexByHtml(this.attr.ownerElement);
        this.left = this.left.trim();
        this.left = this.left || 'this ->';
        selectorout = U.processSelectorPlusPlus(this.left, false, $(vertex.owner.container), $(this.attr.ownerElement), null);
        if (selectorout.exception) { out.left += (out.left ? '\n' : '') + selectorout.exception.toString(); return out; }
        out.left = 'matched ' + selectorout.resultSetElem.length + ' elements and ' + selectorout.resultSetAttr.length + ' attributes. search "xprt" on console to see them';
        console.info('xprt', 'Matched elements:', selectorout.resultSetElem, 'Matched attributes:', selectorout.resultSetAttr);
        if (selectorout.resultSetAttr.length + selectorout.resultSetElem.length === 0) { out.right += 'not executed.'; return out; }
        ////////// can proceed to execution.
        if (!executeRight()) return out;
        if (!exportChanges(evalOutput.outContext, rollbackContext)) return out;
        if (evalOutput.return instanceof Object) {
          if (U.isFunction(evalOutput.return.toString)) { evalOutput.return = evalOutput.return.toString(); }
          else evalOutput.return = JSON.stringify(evalOutput.return); }
        out.right += evalOutput.return;
        ////////// exporting resulting value
        for (i = 0; i < selectorout.resultSetAttr.length; i++) { selectorout.resultSetAttr[i].value = evalOutput.return; }
        for (i = 0; i < selectorout.resultSetElem.length; i++) { selectorout.resultSetElem[i].innerHTML = evalOutput.return; }
        return out;

      case measurableRules.dynamicClass:
        if (!executeRight()) { out.right +='\n If it isn\'t code, try wrapping it in quotes.'; return out;}
        if (!exportChanges(evalOutput.outContext, rollbackContext)) return out;
        if (evalOutput.return instanceof Object) {
          if (U.isFunction(evalOutput.return.toString)) { evalOutput.return = evalOutput.return.toString(); }
          else evalOutput.return = JSON.stringify(evalOutput.return); }
        // out.right += evalOutput.return;
        // start setting classes
        const classes: string[] = (evalOutput.return + '').split(' ');
        for (i = 0; i < classes.length; i++) {
          const cl = classes[i];
          if (!cl[i].length) continue;
          if (cl[i][0] === '+') { this.attr.ownerElement.classList.add(cl[i].substr(1)); continue; }
          if (cl[i][0] === '-') { this.attr.ownerElement.classList.remove(cl[i].substr(1)); continue; }
          out.right += '\nall class tokens must start with a plus (if inserting) or minus (if removing) sign.';
          return out; }
        return out;

      case measurableRules.dynamicStyle:
        if (!executeRight()) { out.right +='\n If it isn\'t code, try wrapping it in quotes.'; return out; }
        if (!exportChanges(evalOutput.outContext, rollbackContext)) return out;
        if (evalOutput.return instanceof Object) {
          if (U.isFunction(evalOutput.return.toString)) { evalOutput.return = evalOutput.return.toString(); }
          else evalOutput.return = JSON.stringify(evalOutput.return); }
        // out.right += evalOutput.return;
        // start setting styles
        console.log('mergeSTyles:', this.attr.ownerElement, evalOutput.return);
        U.mergeStyles(this.attr.ownerElement, null, evalOutput.return, true);
        return out;

      case measurableRules.constraint:
        ///// left validation
        this.left = this.left.trim();
        if (!MeasurableTemplateGenerator.constraintMap[this.left]) {
          out.left += 'invalid.';
          out.right += 'not processed.';
          return out; }
        //console.log('preconstraint1');
//        const preLeft: number = eval("evalContext." + this.left); // must be a simple eval, just because i evalContext[this.left] would become evalContext[vpos.x]
        //U.pe(!rollbackContext.target, '!starget1', evalOutput.outContext.target);
        if (!executeRight()) return out;
        //U.pe(!rollbackContext.target, '!starget2', evalOutput.outContext.target);
        //console.log('preconstraint2', evalOutput.outContext, rollbackContext);
        if (!exportChanges(evalOutput.outContext, rollbackContext)) return out;
        //console.log('preconstraint3', evalOutput.outContext, rollbackContext);
        let postLeft: number = null;
        try { postLeft = eval("evalOutput.outContext." + this.left);} // this one CAN fail if the user deletes the predefined variable in the context.
        catch (e) { out.right += '\n' + e.toString() + '\n; likely caused by an overwrite on a predefined variable inside the path "' + this.left + '".'; return out; }
        // console.log('preconstraint4', evalOutput.outContext, rollbackContext);
        if (this.operator === '=') this.operator = '==';
        const condition: boolean = eval(postLeft + this.operator + evalOutput.return);
        out.operator += '' + !!condition;
        let isTargeting = this.left.indexOf('target.') === 0;
        const left = isTargeting ? this.left.substr('target.'.length) : this.left;
        let oc0 = evalOutput.outContext;
        let rc0 = rollbackContext;
        let oc = isTargeting ? evalOutput.outContext.target : evalOutput.outContext;
        let rc = isTargeting ? rollbackContext.target : rollbackContext;
        U.pe(!isTargeting, 'left side is not targeting');
        if (isTargeting && (!oc || !rc))  { out.left = 'this kind of rule cannot be executed without a target.'; return out; }
        switch (left) {
          default:
            out.left += 'invalid left part, use one of the precompiled suggestions.';
            doRollback();
            // U.pe(true, 'unexpected left part:', this.left, 'but only validated left parts should reach here.');
            return out;
          case ConstraintLeftAdmittedsStatic.height:
            out.left += '' + rc.height;
            if (!condition) oc.setHeight(evalOutput.return);
            break;
          case ConstraintLeftAdmittedsStatic.width:
            out.left += '' + rc.width;
            if (!condition) oc.setWidth(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.absoluteDocPosX:
            out.left += '' + rc.absoluteDocPos.x;
            if (!condition) oc.setAbsoluteDocPosX(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.absoluteDocPosY:
            out.left += '' + rc.absoluteDocPos.y;
            if (!condition)  oc.setAbsoluteDocPosY(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.absoluteGPosX:
            out.left += '' + rc.absoluteGPos.x;
            if (!condition)  oc.setAbsoluteGPosX(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.absoluteGPosY:
            out.left += '' + rc.absoluteGPos.y;
            if (!condition)  oc.setAbsoluteGPosY(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.relativePosX:
            out.left += '' + rc.relativePos.x;
            if (!condition)  oc.setRelativePosX(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.relativePosY:
            out.left += '' + rc.relativePos.y;
            if (!condition)  oc.setRelativePosY(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.relativeVPosX:
            out.left += '' + rc.relativeVPos.x;
            if (!condition)  oc.setRelativeVPosX(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.relativeVPosY:
            out.left += '' + rc.relativeVPos.y;
            if (!condition)  oc.setRelativeVPosY(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.vertexSizeX:
            out.left += '' + rc.vertexSize.x;
            if (!condition)  oc.setVertexSizeX(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.vertexSizeY:
            out.left += '' + rc.vertexSize.y;
            if (!condition)  oc.setVertexSizeY(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.vertexSizeW:
            out.left += '' + rc.vertexSize.w;
            if (!condition)  oc.setVertexSizeW(evalOutput.return); break;
          case ConstraintLeftAdmittedsStatic.vertexSizeH:
            out.left += '' + rc.vertexSize.h;
            if (!condition)  oc.setVertexSizeH(evalOutput.return); break;
        }
        exportChanges(oc0, rc0); // commit
        return out;
    }
    U.pe (true, 'should never reach here');
    return null; }

  constructor(a: Attr, prefix: string = null, doNotThrow: boolean = false) {
    this.attr = a;
    if (a === null) {
      U.pe(!doNotThrow, 'MeasurableRuleParts() called on null attribute:', a, prefix);
      this.attr = null;
      this.output = null;
      this.outputAttr = null;
      this.triggeredResults = [];
      this.operator = '';
      this.right = '';
      this.left = '';
      this.target = '';
      this.prefix = '';
      this.fallbackValue = '';
      this.name = '';
      return; } // empty constructor used by output clone var.

    if (!prefix) {
      const attrname: string = a.name.toLowerCase();
      if (a.name.indexOf('_') === 0) for (let i = 0; i < Measurable.ruleParsingOrder.length; i++) {
        prefix = Measurable.ruleParsingOrder[i];
        if (attrname.indexOf(prefix.toLowerCase()) === 0) { break; }
      }
    }
    if (!prefix && doNotThrow) {
      U.pw(true, 'The attribute "' + a.name + '" is not a valid measurable rule and cannot be parsed or executed.');
      return; }
    U.pe (!prefix, 'not a rule! ', a.name, a);
    this.prefix = prefix; //a.name.substr(0, prefixendindex); questo può avere ChaRCaSe sballati
    this.name = a.name.substr(prefix.length);
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
    this.operator = parts.length === 3 ? parts[1] : '';
    U.pe(this.prefix === measurableRules.constraint && !this.operator, 'failed to get constraint operator: ', this);
    this.right = parts[parts.length - 1];
    const targetstr =  a.ownerElement.getAttribute(('relativeSelectorOf' + a.name));
    this.target = targetstr ? targetstr.trim() : null;
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
  console = '_Console',
  bind = '_Bind', // _bindTo = "@attributename" associa questo node a quel mdoelpiece, anche se era originariamente parte di un altro modelpiece.
  variable = '_Var',
  'export' = '_Export',
  constraint = '_Constraint',
  dynamicClass = '_dClass',
  dynamicStyle = '_dStyle',
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
  _Var: MeasurableRuleParts[] = [];
  _jquiDra: MeasurableRuleParts[] = [];
  _jquiRes: MeasurableRuleParts[] = [];
  _jquiRot: MeasurableRuleParts[] = [];
  _Console: MeasurableRuleParts[] = [];
  _Bind: MeasurableRuleParts[] = [];
  _Export: MeasurableRuleParts[] = [];
  _Constraint: MeasurableRuleParts[] = [];
  _dClass: MeasurableRuleParts[] = [];
  _dStyle: MeasurableRuleParts[] = [];
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
  disabled: boolean = false;
}
export class Measurable {
  static readonly separator: string = '≔';
  static readonly GlobalPrefix: string = '_';
  static ruleParsingOrder: string[] = Measurable.staticinit();
  static eventTriggers: measurableRules[];
  static eventTriggersLowerCase: string[];
  static executableRules: measurableRules[];
  static executableRulesLowerCase: string[];
  static JQUIRules: measurableRules[];
  static JQUIRulesLowerCase: string[];
  static ruleToUppercase: Dictionary<string, measurableRules>;

  static staticinit(): string[]{
    const arr: string[] = Object.values(measurableRules);
    U.arrayRemoveAll(arr, measurableRules.variable);
    arr.push(measurableRules.variable);
    Measurable.eventTriggers = [measurableRules.onRefresh,
      measurableRules.onDragStart, measurableRules.onDragEnd, measurableRules.whileDragging,
      measurableRules.onResizeStart, measurableRules.onResizeEnd, measurableRules.whileResizing,
      measurableRules.onRotationStart, measurableRules.onRotationEnd, measurableRules.whileRotating,
    ];
    Measurable.JQUIRules = [measurableRules._jquiDra, measurableRules._jquiRes, measurableRules._jquiRot];
    Measurable.executableRules = [];
    Measurable.executableRulesLowerCase = [];
    Measurable.ruleToUppercase = {};
    for (let key in measurableRules){
      let val: measurableRules = measurableRules[key] as measurableRules;
      let valLowercase: string = val.toLowerCase();
      Measurable.ruleToUppercase[valLowercase] = val;
      if (Measurable.eventTriggers.indexOf(val) !== -1) continue;
      if (Measurable.JQUIRules.indexOf(val) !== -1) continue;
      Measurable.executableRules.push(val);
      Measurable.executableRulesLowerCase.push(valLowercase);
    }

    Measurable.eventTriggersLowerCase = [];
    Measurable.eventTriggersLowerCase.length = Measurable.eventTriggers.length;
    Measurable.JQUIRulesLowerCase = [];
    Measurable.JQUIRulesLowerCase.length = Measurable.eventTriggers.length;
    for (let i = 0; i < Measurable.eventTriggers.length; i++){ Measurable.eventTriggersLowerCase[i] = Measurable.eventTriggers[i].toLowerCase(); }
    for (let i = 0; i < Measurable.JQUIRules.length; i++){ Measurable.JQUIRulesLowerCase[i] = Measurable.JQUIRules[i].toLowerCase(); }

    return arr;
  }

  static getRuleList(elem: Element, rulefilter: string[] = null, debug: boolean = false): MeasurableRuleLists{
    let i: number;
    let j: number;
    const rulefilterobj = rulefilter && rulefilter.length ? U.toDictionary(rulefilter) : null;
    let ret: MeasurableRuleLists = new MeasurableRuleLists();
    let prefix: string;
    for (i = 0; i < elem.attributes.length; i++){
      const attr: Attr = elem.attributes[i];
      const attrname = attr.name.toLowerCase();
      for (j = 0; j < Measurable.ruleParsingOrder.length; j++){
        // for (j = 0; j < Measurable.rulesListParsingOrder.length; j++) {
        prefix = Measurable.ruleParsingOrder[j];
        if (rulefilterobj && !rulefilterobj[prefix]) continue;
        if (attrname.indexOf(prefix.toLowerCase()) === 0){
          // if (prefix === '_' && attr.name.indexOf('_ng') === 0) continue;
          ret.all.push(new MeasurableRuleParts(attr, prefix));
          U.pe(!ret[prefix], 'Incoerenza tra MeasurableRuleLists e measurableRules:', prefix, ret);
          ret[prefix].push(new MeasurableRuleParts(attr, prefix));
          break;
        }
      }
    }
    return ret;
  }

  // ################ oldies but good

  static measurableElementSetup($root: JQuery<Element>, resConfig: ResizableOptions = null, rotConfig: RotatableOptions = null, dragConfig: DraggableOptions = null, v: IVertex = null): void{
    let arr = $root.find('.measurable').addBack('.measurable');
    const vroot: Element = v ? v.getMeasurableNode() : null;
    for (let i = 0; i < arr.length; i++){
      let h = arr[i];
      if (arr[i] === vroot){ Measurable.measurableElementSetupSingle(h as Element, resConfig, rotConfig, dragConfig, v); }else Measurable.measurableElementSetupSingle(h as Element, resConfig, rotConfig, dragConfig);
    }
  }

// todo: devo importare rotatableOptions, ResizableOptions è la vra classe dichiarata dalla libreria jqui, non la mia. devo fare lo stesso con rotatable.
  static measurableElementSetupSingle(elem0: Element, resConfig: ResizableOptions = null, rotConfig: RotatableOptions = null, draConfig: DraggableOptions = null, isvroot: IVertex = null): void{
    const elem: HTMLElement = elem0 as HTMLElement;
    // apply resizableborder AND jquery.resize
    if (!elem.classList || !elem.classList.contains('measurable') || elem as any === document){
      U.pw(true, 'invalid measurable:', elem, !elem.classList, '||', !elem.classList.contains('measurable'));
      return;
    }
    U.resizableBorderSetup(elem);
    if (!resConfig){ resConfig = new ResizableOptionsImpl(); }
    if (!rotConfig){ rotConfig = new RotatableOptions(); }
    if (!draConfig){ draConfig = new DraggableOptionsImpl(); }
    let func = null;
    let attrval: string = null;
    let i: number;
    let arr: {config: any, friendlyname: string, jquiname: string}[] = [];
    arr.push({config:resConfig, friendlyname:Resizableoptions.create, jquiname:'create'});
    arr.push({config:resConfig, friendlyname:Resizableoptions.resizeStart, jquiname:'start'});
    arr.push({config:resConfig, friendlyname:Resizableoptions.resizing, jquiname:'resize'});
    arr.push({config:resConfig, friendlyname:Resizableoptions.resizeStop, jquiname:'stop'});
    arr.push({config:draConfig, friendlyname:Draggableoptions['create'], jquiname:'create'});
    arr.push({config:draConfig, friendlyname:Draggableoptions.dragStart, jquiname:'start'});
    arr.push({config:draConfig, friendlyname:Draggableoptions.dragging, jquiname:'resize'});
    arr.push({config:draConfig, friendlyname:Draggableoptions.dragStop, jquiname:'stop'});
    arr.push({config:rotConfig, friendlyname:Rotatableoptions['create'], jquiname:'create'});
    arr.push({config:rotConfig, friendlyname:Rotatableoptions.onRotationStart, jquiname:'start'});
    arr.push({config:rotConfig, friendlyname:Rotatableoptions.onRotating, jquiname:'resize'});
    arr.push({config:rotConfig, friendlyname:Rotatableoptions.onRotationEnd, jquiname:'stop'});

    (resConfig as any).prefix = measurableRules._jquiRes;
    (rotConfig as any).prefix = measurableRules._jquiRot;
    (draConfig as any).prefix = measurableRules._jquiDra;

    for (i = 0; i < arr.length; i++){
      attrval = elem.getAttribute((arr[i].config.prefix + arr[i].friendlyname));
      attrval = attrval && attrval.trim();
      if (!attrval) func = null;
      else try{
        func = eval(attrval);
        func = (e, ui) => {
          try{func(e, ui);}
          catch(e){
            U.pw(true, 'error evaluating' + arr[i].friendlyname + ':', e);
          }
        }
      }catch(e){
        U.pw(true, 'invalid function as argument of resize create', e);
        func = null;
      }
      // se resConfig[triggername] non è settato, lo setto a func.
      arr[i].config[arr[i].jquiname] = arr[i].config[arr[i].jquiname] || func;
    }

    if (isvroot){
      isvroot.dragConfig = draConfig;
      const oldconfig: ResizableOptions = U.cloneObj(resConfig);
      resConfig.resize = (e, ui) => {
        isvroot.autosizeNew(true, true, measurableRules.whileResizing);
        oldconfig.resize(e, ui);
      };
      resConfig.start = (e, ui) => {
        isvroot.autosizeNew(true, true, measurableRules.onResizeStart);
        oldconfig.start(e, ui);
      };
      resConfig.stop = (e, ui) => {
        isvroot.autosizeNew(true, true, measurableRules.onResizeEnd);
        oldconfig.stop(e, ui);
      };
    }

    delete (resConfig as any).prefix;
    delete (rotConfig as any).prefix;
    delete (draConfig as any).prefix;

    for (const jquikey in resConfig){
      let friendlykey: string;
      switch(jquikey){
        default:
          friendlykey = jquikey;
          let customparameterval: string = elem.getAttribute((measurableRules._jquiRes + friendlykey));
          if (resConfig[jquikey] || !customparameterval){ continue; }
          resConfig[jquikey] = customparameterval;
          break;
        // case U.varname2(resConfig.disabled, resConfig): break;
        case U.varname2(resConfig, resConfig.create):
        case U.varname2(resConfig, resConfig.start):
        case U.varname2(resConfig, resConfig.stop):
        case U.varname2(resConfig, resConfig.resize):
          break;
      }
    }
    let isRotatableCustomized: boolean = false;
    for (const jquikey in rotConfig){
      let friendlykey: string;
      switch(jquikey){
        default:
          friendlykey = jquikey;
          let customparameterval: string = elem.getAttribute((measurableRules._jquiRot + friendlykey));
          if (rotConfig[jquikey] || !customparameterval || rotConfig[jquikey] === customparameterval){ continue; }
          rotConfig[jquikey] = customparameterval;
          isRotatableCustomized = true;
          break;
        // case U.varname2(resConfig.disabled, resConfig): break;
        // case U.varname2(rotConfig, rotConfig.create):
        case U.varname2(rotConfig, rotConfig.start):
        case U.varname2(rotConfig, rotConfig.stop):
        case U.varname2(rotConfig, rotConfig.rotate):
          break;
      }
    }
    let defaultAction = (friendlykey, jquikey) => {
      let customparameterval = elem.getAttribute((measurableRules._jquiDra + friendlykey));
      if (draConfig[jquikey] || !customparameterval){ return; }
      draConfig[jquikey] = customparameterval;
    };
    for (const jquikey in draConfig){
      let friendlykey: string;
      let customparameterval: string;
      switch(jquikey){
        default:
          friendlykey = jquikey;
          defaultAction(friendlykey, jquikey);
          break;
        case Draggableoptions.axis:
          friendlykey = jquikey;
          defaultAction(friendlykey, jquikey);
          console.log('draconfig.setaxis: ', draConfig[jquikey], elem, jquikey, friendlykey);
          const val: string = U.replaceAll(draConfig[jquikey] + '', ' ', '');
          if (val === null || val === undefined){
            draConfig[jquikey] = '';
            break;
          }
          // else if (val === 'x,y') { draConfig[jquikey] = null; break; } null funziona come se fosse 'x,y', non so se 'x,y' funziona lo stesso. provo.
          else{;}
          break;
        // case U.varname2(resConfig.disabled, resConfig): break;
        case U.varname2(draConfig, draConfig.create):
        case U.varname2(draConfig, draConfig.start):
        case U.varname2(draConfig, draConfig.stop):
        case U.varname2(draConfig, draConfig.drag):
          break;
      }
    }

    const $elem = $(elem);
    console.log('measurableConfig:  drag:', draConfig, 'res:', resConfig, 'rot:', rotConfig, 'isVertex:', isvroot, 'axis:', draConfig.axis, 'handles:', resConfig.handles, elem);
    if (draConfig.axis !== undefined && draConfig.axis !== '' && !isvroot){
      $elem.draggable(draConfig);
      if (draConfig.disabled) $elem.draggable('disable');
    }
    if (resConfig.handles && resConfig.handles !== ''){
      $elem.resizable(resConfig);
      if (resConfig.disabled) $elem.resizable('disable');
    }
    if (isRotatableCustomized){
      let $elemr = $elem as any;
      if (!$elemr.rotatable) U.oneTime('RotatableSupport', U.pw, true, '$.rotatable is not supported yet.');
      else $elemr.rotatable(rotConfig);
      if (rotConfig.disabled) $elemr.rotatable('disable');
    }

  }

  static isRuleOfKind(name: string, rules: measurableRules[] = null, useLowerCaseRules: string[] = null): measurableRules {
    let ret: measurableRules = Measurable.isRuleOfKind0(name, rules, useLowerCaseRules);
    console.log('rulevalidation:', ret, Measurable.ruleToUppercase);
    return ret; }

  static isRuleOfKind0(name: string, rules: measurableRules[] = null, useLowerCaseRules: string[] = null): measurableRules{
    name = useLowerCaseRules ? name.toLowerCase() : name;
    let arr: string[] = useLowerCaseRules ? useLowerCaseRules : rules;
    let i: number;
    for (i = 0; i < arr.length; i++){
      if (name.indexOf(arr[i]) === 0) return useLowerCaseRules ? Measurable.ruleToUppercase[arr[i]] : arr[i] as measurableRules; }
    return null; }

  static isExecutableRule(name: string, caseInsensitive: boolean = false): measurableRules{
    return Measurable.isRuleOfKind(name, Measurable.executableRules, caseInsensitive ? Measurable.executableRulesLowerCase : null); }

  static isJQUIRule(name: string, caseInsensitive: boolean = false): measurableRules{
    return Measurable.isRuleOfKind(name, Measurable.JQUIRules, caseInsensitive ? Measurable.JQUIRulesLowerCase : null); }

  static isTriggerRule(name: string, caseInsensitive: boolean = false): measurableRules{
    return Measurable.isRuleOfKind(name, Measurable.eventTriggers, caseInsensitive ? Measurable.eventTriggersLowerCase : null); }

}

export class ResizableOptionsImpl implements ResizableOptions {
  alsoResize: any = undefined;
  animate: boolean = undefined;
  animateDuration: any = undefined;
  animateEasing: string = undefined;
  aspectRatio: any = undefined;
  autoHide: boolean = undefined;
  cancel: string = undefined;
  containment: any = undefined;
  create: JQueryUI.ResizableEvent = undefined;
  delay: number = undefined;
  disabled: boolean = undefined;
  distance: number = undefined;
  ghost: boolean = undefined;
  grid: any = undefined;
  handles: any = undefined;
  helper: string = undefined;
  maxHeight: number = undefined;
  maxWidth: number = undefined;
  minHeight: number = undefined;
  minWidth: number = undefined;
  resize: JQueryUI.ResizableEvent = undefined;
  start: JQueryUI.ResizableEvent = undefined;
  stop: JQueryUI.ResizableEvent = undefined; }

export class DraggableOptionsImpl implements DraggableOptions {
  addClasses: boolean = undefined;
  appendTo: any = undefined;
  axis: string = undefined;
  cancel: string = undefined;
  classes: JQueryUI.DraggableClasses = undefined;
  connectToSortable: Element|Element[]|JQuery|string = undefined;
  containment: any = undefined;
  create: JQueryUI.DraggableEvent = undefined;
  cursor: string = undefined;
  cursorAt: any = undefined;
  delay: number = undefined;
  disabled: boolean = undefined;
  distance: number = undefined;
  drag: JQueryUI.DraggableEvent = undefined;
  grid: number[] = undefined;
  handle: any = undefined;
  helper: any = undefined;
  iframeFix: any = undefined;
  opacity: number = undefined;
  refreshPositions: boolean = undefined;
  revert: any = undefined;
  revertDuration: number = undefined;
  scope: string = undefined;
  scroll: boolean = undefined;
  scrollSensitivity: number = undefined;
  scrollSpeed: number = undefined;
  snap: any = undefined;
  snapMode: string = undefined;
  snapTolerance: number = undefined;
  stack: string = undefined;
  start: JQueryUI.DraggableEvent = undefined;
  stop: JQueryUI.DraggableEvent = undefined;
  zIndex: number = undefined; }
