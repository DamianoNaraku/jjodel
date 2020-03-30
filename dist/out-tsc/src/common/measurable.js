// requires: U, jQuery, jQueryUI
import { U, IVertex, ModelPiece, MyConsole, EvalOutput } from './Joiner';
/*
export class MeasurableArrays {rules: Attr[]; imports: Attr[]; exports: Attr[]; variables: Attr[];
  constraints: Attr[]; chain: Attr[]; chainFinal: Attr[]; dstyle: Attr[]; html: Element; e: Event; }*/
export class MeasurableEvalContext {
    constructor() {
        this.setSize = (w = null, h = null) => {
            if (U.isNumerizable(w)) {
                this.width = w;
            }
            if (U.isNumerizable(h)) {
                this.height = h;
            }
        };
        this.setAbsoluteGPos = (x = null, y = null) => {
            const isVertex = MeasurableEvalContext.isVertex(this);
            if (U.isNumerizable(x)) {
                this.absoluteGPos.x = +x;
                if (isVertex) {
                    this.vertexSize.x = this.absoluteGPos.x;
                    this.relativeVPos.x = 0;
                    this.relativeVPos.y = 0;
                }
                else {
                    this.relativeVPos.x = this.absoluteGPos.x - this.vertexSize.x;
                }
                if (this.target) {
                    this.relativePos.x = this.absoluteGPos.x - this.target.absoluteGPos.x;
                }
                this.absoluteDocPos.x = this.graphSize.x + (this.absoluteGPos.x - this.graphScroll.x) / this.graphZoom.x;
            }
            if (U.isNumerizable(y)) {
                this.absoluteGPos.y = +y;
                if (isVertex) {
                    this.vertexSize.y = this.absoluteGPos.y;
                    this.relativeVPos.x = 0;
                    this.relativeVPos.y = 0;
                }
                else {
                    this.relativeVPos.y = this.absoluteGPos.y - this.vertexSize.y;
                }
                if (this.target) {
                    this.relativePos.y = this.absoluteGPos.y - this.target.absoluteGPos.y;
                }
                this.absoluteDocPos.y = this.graphSize.y + (this.absoluteGPos.y - this.graphScroll.y) / this.graphZoom.y;
            }
        };
        this.setRelativePos = (x = null, y = null) => {
            if (!this.target)
                return;
            const isVertex = MeasurableEvalContext.isVertex(this);
            if (U.isNumerizable(x)) {
                this.absoluteGPos.x = this.target.absoluteGPos.x + x;
            }
            if (U.isNumerizable(y)) {
                this.absoluteGPos.y = this.target.absoluteGPos.y + y;
            }
            this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y);
        };
        this.setRelativeVPos = (x = null, y = null) => {
            const isVertex = MeasurableEvalContext.isVertex(this);
            if (U.isNumerizable(x)) {
                this.absoluteGPos.x = this.vertexSize.x + x;
            }
            if (U.isNumerizable(y)) {
                this.absoluteGPos.y = this.vertexSize.y + y;
            }
            this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y);
        };
        this.setVertexSize = (x = null, y = null, w = null, h = null) => {
            const isVertex = MeasurableEvalContext.isVertex(this);
            if (U.isNumerizable(w))
                this.vertexSize.w = +w;
            if (U.isNumerizable(h))
                this.vertexSize.w = +h;
            if (isVertex) {
                this.setAbsoluteGPos(x, y);
            }
            else {
                if (U.isNumerizable(x)) {
                    this.absoluteGPos.x = x + this.relativeVPos.x;
                }
                if (U.isNumerizable(y)) {
                    this.absoluteGPos.y = y + this.relativeVPos.y;
                }
                this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y);
            }
        };
        // può servire a tenere qualcosa fisso al centro del grafo anche se faccio panning
        this.setAbsoluteDocPos = (x = null, y = null) => {
            if (U.isNumerizable(x)) {
                this.absoluteDocPos.x = x;
                this.absoluteGPos.x = this.graphScroll.x + this.graphZoom.x * (this.absoluteDocPos.x - this.graphSize.x);
            }
            if (U.isNumerizable(y)) {
                this.absoluteDocPos.y = y;
                this.absoluteGPos.y = this.graphScroll.y + this.graphZoom.y * (this.absoluteDocPos.y - this.graphSize.y);
            }
            this.setAbsoluteGPos(this.absoluteGPos.x, this.absoluteGPos.y);
        };
        this.setVertexX = (x = null) => { return this.setVertexSize(x, null, null, null); };
        this.setVertexY = (y = null) => { return this.setVertexSize(null, y, null, null); };
        this.setVertexW = (w = null) => { return this.setVertexSize(null, null, w, null); };
        this.setVertexH = (h = null) => { return this.setVertexSize(null, null, null, h); };
        this.setAbsoluteGPosX = (x = null) => { return this.setAbsoluteGPos(x, null); };
        this.setAbsoluteGPosY = (y = null) => { return this.setAbsoluteGPos(null, y); };
        this.setAbsoluteDocPosX = (x = null) => { return this.setAbsoluteDocPos(x, null); };
        this.setAbsoluteDocPosY = (y = null) => { return this.setAbsoluteDocPos(null, y); };
        this.setWidth = (w = null) => { this.setSize(w, null); };
        this.setHeight = (h = null) => { this.setSize(null, h); };
    }
    static isVertex(context) { return context.vertex.getHtmlRawForeign() === context.node; }
}
export var MeasurableOperators;
(function (MeasurableOperators) {
    MeasurableOperators["eq"] = "=";
    MeasurableOperators["lt"] = "<";
    MeasurableOperators["lte"] = "<=";
    MeasurableOperators["gt"] = ">";
    MeasurableOperators["gte"] = ">=";
    MeasurableOperators["ne"] = "!=";
})(MeasurableOperators || (MeasurableOperators = {}));
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
    constructor(a, prefixendindex = null) {
        if (a === null)
            return; // empty constructor used by output clone var.
        this.attr = a;
        if (!prefixendindex) {
            const key = a.name.toLowerCase();
            let prefix;
            for (let key in measurableRules) {
                prefix = measurableRules['' + key];
                if (a.name.indexOf(prefix) === 0) {
                    prefixendindex = prefix.length;
                    break;
                }
            }
        }
        let gti = a.value.indexOf('>=');
        gti = gti == -1 ? Number.POSITIVE_INFINITY : gti;
        let eqi = a.value.indexOf('=');
        eqi = eqi == -1 ? Number.POSITIVE_INFINITY : eqi;
        let lti = a.value.indexOf('>=');
        lti = lti == -1 ? Number.POSITIVE_INFINITY : lti;
        const opindex = Math.min(gti, eqi, lti);
        if (opindex === Number.POSITIVE_INFINITY)
            return null;
        const rightindex = opindex + (eqi === opindex ? 1 : 2);
        this.output = new MeasurableRuleParts(null, null);
        this.prefix = a.name.substr(0, prefixendindex);
        this.name = a.name.substr(prefixendindex);
        this.left = a.value.substr(0, opindex);
        this.operator = a.value.substr(opindex, rightindex);
        this.right = a.value.substr(rightindex);
        this.target = a.ownerElement.getAttribute('relativeSelectorOf' + a.name).trim();
        this.target = this.target.length ? this.target : null;
        this.fallbackValue = null;
        let outputname = a.name.substr(1);
        measurableRules;
        this.outputAttr = this.attr.ownerElement.attributes.getNamedItem(outputname);
        if (!this.outputAttr) {
            this.attr.ownerElement.setAttribute(outputname, '');
            this.outputAttr = this.attr.ownerElement.attributes.getNamedItem(outputname);
        }
    }
    static staticinit() {
        const leftmap = {};
        const operatormap = {};
        console.log(leftmap, measurableRules.variable);
        console.log(leftmap, measurableRules.variable);
        leftmap[measurableRules.variable] = '^$';
        // leftmap[measurableRules.rule] = '^\$##.*(\.values|\.values\.[0-9]+)\$$'; poi diventata "^values\[[0-9]*\]$" poi cancellata
        leftmap[measurableRules.constraint] = '.*'; // should be '^(' + Object.values(SizeVariables).join('|') + ')$';
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
        operatormap[measurableRules.constraint][MeasurableOperators.lte] = true;
        operatormap[measurableRules.constraint][MeasurableOperators.eq] = true;
        operatormap[measurableRules.constraint][MeasurableOperators.gte] = true;
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
        return MeasurableRuleParts.operatormap = operatormap;
    }
    static fillEvalContext(evalContext, node, targetquery, vertex = null) {
        let tmp;
        let tmpjq;
        let i;
        evalContext.node = node;
        evalContext.modelPiece = ModelPiece.getLogic(evalContext.node);
        evalContext.vertex = vertex = (vertex || evalContext.modelPiece.getVertex());
        evalContext.graph = evalContext.vertex.owner;
        const size = U.sizeof(evalContext.node);
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
            const attr = evalContext.attributes[i];
            evalContext.a[attr.name] = attr.value;
        }
        evalContext.setAbsoluteDocPos(tmp.x, tmp.y);
    }
    ;
    process(validatefirst = false, vertex = null, graph = null) {
        const out = new MeasurableRuleParts(null);
        let tmp;
        let i;
        let j;
        const evalContext = new MeasurableEvalContext();
        if (validatefirst) {
            const validoperators = Object.keys(MeasurableRuleParts.operatormap[this.prefix]);
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
            if (out.left || out.operator || tmpev.exception)
                return out;
        }
        MeasurableRuleParts.fillEvalContext(evalContext, this.attr.ownerElement, this.target, vertex);
        let evalOutput;
        if (this.prefix === measurableRules.console) {
            evalOutput = new EvalOutput();
            try {
                evalOutput.return = MyConsole.console.execCommand(this.right);
            }
            catch (e) {
                evalOutput.exception = e;
            }
        }
        else {
            evalOutput = U.evalInContext(evalContext, this.right);
        }
        if (evalOutput.exception) {
            out.right = '' + evalOutput.exception;
            return out;
        }
        this.outputAttr.value = out.right = evalOutput.return;
        let attributeSelectorToken = '->';
        let pos;
        let selector;
        let attrSelector;
        let $targetsHtml;
        switch (this.prefix) {
            case measurableRules._jquiRes:
            case measurableRules._jquiDra:
            case measurableRules._jquiRot:
            default:
                out.prefix = 'invalid prefix';
                return out;
            // cancellata in favore di generic attribute che setta una variabile values[] nel contesto.
            // case measurableRules.rule: break;
            case measurableRules.console:
                // everything already did on exec before
                break;
            case measurableRules.bind:
                let newmp = evalOutput.return;
                if (!(newmp instanceof ModelPiece)) {
                    out.right = 'returned value is not a ModelPiece.';
                }
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
                const execCondition = evalOutput.return;
                if (!execCondition)
                    return;
                selector = (pos === -1 ? this.left : this.left.substr(0, pos)).trim();
                attrSelector = pos === -1 ? null : this.left.substr(pos + attributeSelectorToken.length);
                if (!graph) {
                    if (!vertex) {
                        vertex = IVertex.getvertexByHtml(this.attr.ownerElement);
                    }
                    graph = vertex.owner;
                }
                $targetsHtml = selector.length ? $(graph.container).find(selector) : $(this.attr.ownerElement);
                if (attrSelector) {
                    const regexp = new RegExp(attrSelector.trim());
                    if (!regexp) {
                        out.left = 'invalid attribute selector, must be a regular expression';
                        return out;
                    }
                    for (i = 0; i < $targetsHtml.length; i++) {
                        const attrs = U.getAttributesByRegex($targetsHtml[i], regexp);
                        for (j = 0; j < attrs.length; j++) {
                            new MeasurableRuleParts(attrs[j]).process(false, null, null);
                        }
                    }
                }
                else {
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
                    if (!vertex) {
                        vertex = IVertex.getvertexByHtml(this.attr.ownerElement);
                    }
                    graph = vertex.owner;
                }
                $targetsHtml = $(graph.container).find(selector);
                if (attrSelector) {
                    for (i = 0; i < $targetsHtml.length; i++) {
                        const attr = $targetsHtml[i].attributes.getNamedItem(attrSelector);
                        attr.value = evalOutput.return;
                    }
                }
                else {
                    for (i = 0; i < $targetsHtml.length; i++) {
                        $targetsHtml[i].innerHTML = evalOutput.return;
                    }
                }
                break;
            case measurableRules.dynamicClass:
                if (evalOutput.return !== '' + evalOutput.return)
                    return;
                const classes = (evalOutput.return + '').split(' ');
                for (i = 0; i < classes.length; i++) {
                    const cl = classes[i];
                    if (!cl[i].length)
                        continue;
                    if (cl[i][0] === '+') {
                        this.attr.ownerElement.classList.add(cl[i].substr(1));
                        continue;
                    }
                    if (cl[i][0] === '-') {
                        this.attr.ownerElement.classList.remove(cl[i].substr(1));
                        continue;
                    }
                    out.right = 'all class tokens must start with a plus (if inserting) or minus (if removing) sign.';
                    return out;
                }
                break;
            case measurableRules.dynamicStyle:
                U.mergeStyles(this.attr.ownerElement, null, evalOutput.return);
                break;
            case measurableRules.constraint:
                let operator = this.operator + '' === '=' ? '==' : this.operator;
                let evret = U.evalInContext(evalContext, this.left + operator + ' +' + evalOutput.return, false);
                U.pe(evret.exception, '_constraint should never fail here: ', evret);
                // just execute the assignment on the context
                if (!evret.return) {
                    U.evalInContext(evalContext, this.left + ' = +' + evalOutput.return, false);
                }
                break;
        }
        if (!evalOutput.outContext)
            return;
        const outcontext = evalOutput.outContext;
        evalContext.graph.setZoom(outcontext.graphZoom.x, outcontext.graphZoom.y);
        evalContext.graph.setScroll(outcontext.graphScroll.x, outcontext.graphScroll.y);
        // evalContext.graph.setGrid(outcontext.graphGrid.x, outcontext.graphGrid.y);
        const isVertex = (evalContext.vertex.getHtmlRawForeign() === evalContext.node);
        if (isVertex) {
            // evalContext.vertex.setSize(new GraphSize(outcontext.absoluteGPos.x, outcontext.absoluteGPos.y, outcontext.width, outcontext.height));
            evalContext.vertex.setSize(evalContext.vertexSize);
        }
        else {
            const html = evalContext instanceof HTMLElement || evalContext instanceof SVGSVGElement ? evalContext : null;
            const svg = evalContext instanceof SVGElement ? evalContext : null;
            if (!outcontext.relativeVPos || !U.isNumerizable(outcontext.relativeVPos.x) || !U.isNumerizable(outcontext.relativeVPos.y)) {
                U.pw(true, 'An error inside a measurable condition has happened, an invalid value has been wrote inside the variable "relativeVPos".');
                return;
            }
            if (!html) {
                U.pw(true, 'inner svg are currently not supported');
                return;
            }
            if (html.style.position === '')
                html.style.position = 'absolute'; // NB: non sovrascrivere con absolute se c'è sticky, fixed...
            let relativeParentNode = U.getRelativeParentNode(evalContext.node);
            if (relativeParentNode === evalContext.vertex.getHtmlRawForeign()) {
                html.style.top = (outcontext.relativeVPos.y * evalContext.graph.zoom.y) + 'px';
                html.style.left = (outcontext.relativeVPos.x * evalContext.graph.zoom.x) + 'px';
            }
            else {
                const parentGpos = evalContext.graph.toGraphCoord(U.sizeof(relativeParentNode).tl());
                html.style.top = ((outcontext.absoluteGPos.y - parentGpos.y) * evalContext.graph.zoom.y) + 'px';
                html.style.left = ((outcontext.absoluteGPos.x - parentGpos.x) * evalContext.graph.zoom.y) + 'px';
            }
            if (U.isNumerizable(outcontext.width))
                html.style.width = (+outcontext.width) + 'px';
            if (U.isNumerizable(outcontext.height))
                html.style.height = (+outcontext.height) + 'px';
        }
    }
}
MeasurableRuleParts.operatormap = null;
export var measurableRules;
(function (measurableRules) {
    // check when updating measurable rules: 1
    measurableRules["_jquiRes"] = "_jquiRes";
    measurableRules["_jquiDra"] = "_jquiDra";
    measurableRules["_jquiRot"] = "_jquiRot";
    measurableRules["console"] = "_console";
    measurableRules["bind"] = "_bind";
    measurableRules["variable"] = "_";
    measurableRules["export"] = "_export";
    measurableRules["constraint"] = "_constraint";
    measurableRules["dynamicClass"] = "_dclass";
    measurableRules["dynamicStyle"] = "_dstyle";
    measurableRules["onRefresh"] = "_onRefresh";
    measurableRules["onResizeStart"] = "_onResizeStart";
    measurableRules["whileResizing"] = "_whileResizing";
    measurableRules["onResizeEnd"] = "_onResizeEnd";
    measurableRules["onDragStart"] = "_onDragStart";
    measurableRules["whileDragging"] = "_whileDragging";
    measurableRules["onDragEnd"] = "_onDragEnd";
    measurableRules["onRotationStart"] = "_onRotationStart";
    measurableRules["whileRotating"] = "_whileRotating";
    measurableRules["onRotationEnd"] = "_onRotationEnd";
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
    // rule = '_rule',
    // chain = '_chain',
    // chainFinal = '_chainFinal',
    // onMouseEnter = '_onMouseEnter',
    // onMouseLeave = '_onMouseLeave',
    // onFocus = '_onBlur',
    // onBlur = '_onBlur', it's ok to apply css changes here but not change in data, this should be handled by css only.
    // onRefreshStart = '_onRefreshStart',
    // whileRefreshing = '_whileRefreshing',
})(measurableRules || (measurableRules = {}));
export class MeasurableRuleLists {
    constructor() {
        // check when updating measurable rules: 2
        this.all = [];
        this._ = [];
        this._jquiDra = [];
        this._jquiRes = [];
        this._jquiRot = [];
        this._console = [];
        this._bind = [];
        this._export = [];
        this._constraint = [];
        this._dclass = [];
        this._dstyle = [];
        this._onRefresh = [];
        this._onResizeStart = [];
        this._whileResizing = [];
        this._onResizeEnd = [];
        this._onDragStart = [];
        this._whileDragging = [];
        this._onDragEnd = [];
        this._onRotationStart = [];
        this._whileRotating = [];
        this._onRotationEnd = [];
    }
}
export class Measurable {
    static getRuleList(elem) {
        let i;
        let j;
        let ret = new MeasurableRuleLists();
        let prefix;
        for (i = 0; i < elem.attributes.length; i++) {
            const attr = elem.attributes[i];
            for (let key in measurableRules) {
                // for (j = 0; j < Measurable.rulesListParsingOrder.length; j++) {
                prefix = measurableRules['' + key];
                if (attr.name.indexOf(prefix) === 0) {
                    if (prefix === '_' && attr.name.indexOf('_ng') === 0)
                        continue;
                    ret.all.push(new MeasurableRuleParts(attr, prefix.length));
                    ret[prefix].push(new MeasurableRuleParts(attr, prefix.length));
                    break;
                }
            }
        }
        return ret;
    }
    // ################ oldies but good
    static measurableElementSetup($root, resizeConfig = null, dragConfig = null) {
        $root.find('.measurable').addBack('.measurable').each((i, h) => Measurable.measurableElementSetupSingle(h, resizeConfig, dragConfig));
    }
    static measurableElementSetupSingle(elem0, resizeConfig = null, dragConfig = null) {
        const elem = elem0;
        // apply resizableborder AND jquery.resize
        if (!elem.classList || !elem.classList.contains('measurable') || elem === document) {
            U.pw(true, 'invalid measurable:', elem, !elem.classList, '||', !elem.classList.contains('measurable'));
            return;
        }
        U.resizableBorderSetup(elem);
        if (!resizeConfig) {
            resizeConfig = {};
        }
        if (!dragConfig) {
            dragConfig = {};
        }
        resizeConfig.create = resizeConfig.create || eval(elem.dataset.r_create);
        resizeConfig.resize = resizeConfig.resize || eval(elem.dataset.r_resize);
        resizeConfig.start = resizeConfig.start || eval(elem.dataset.r_start);
        resizeConfig.stop = resizeConfig.stop || eval(elem.dataset.r_stop);
        dragConfig.create = dragConfig.create || eval(elem.dataset.d_create);
        dragConfig.drag = dragConfig.drag || eval(elem.dataset.d_drag);
        dragConfig.start = dragConfig.start || eval(elem.dataset.d_start);
        dragConfig.stop = dragConfig.stop || eval(elem.dataset.d_stop);
        for (const key in resizeConfig) {
            if (resizeConfig[key] || !elem.dataset['r_' + key]) {
                continue;
            }
            resizeConfig[key] = elem.dataset['r_' + key];
        }
        for (const key in dragConfig) {
            if (dragConfig[key] || !elem.dataset['d_' + key]) {
                continue;
            }
            dragConfig[key] = elem.dataset['d_' + key];
        }
        $(elem).resizable(resizeConfig).draggable(dragConfig);
    }
}
//# sourceMappingURL=measurable.js.map