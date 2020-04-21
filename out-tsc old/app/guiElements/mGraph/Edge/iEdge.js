import { U, IVertex, EdgePoint, ModelPiece, Status, IReference, CursorFollowerEP, EdgePointFittizio, Point, GraphPoint, IClass, ExtEdge, MAttribute, MReference } from '../../../common/Joiner';
var EdgeDecoratorType;
(function (EdgeDecoratorType) {
    EdgeDecoratorType["containment"] = "containment";
    EdgeDecoratorType["generalization"] = "generalization";
    EdgeDecoratorType["simple"] = "simple";
})(EdgeDecoratorType || (EdgeDecoratorType = {}));
export var EdgeModes;
(function (EdgeModes) {
    EdgeModes["straight"] = "straight";
    EdgeModes["angular2"] = "angular con 2 segmenti.";
    EdgeModes["angular3"] = "angular con 3 segmenti (un break centrale)";
    EdgeModes["angular23Auto"] = "angular 2 o angular 3 automatico";
})(EdgeModes || (EdgeModes = {}));
export class IEdge {
    constructor(logic, index, startv = null, end = null) {
        this.headtype = EdgeDecoratorType.simple;
        this.tailtype = EdgeDecoratorType.simple;
        // private static tempMidPoint_Clicked: GraphPoint = null;
        // private static tempMidPoint_ModelPiece: ModelPiece = null;
        this.owner = null;
        this.start = null;
        this.end = null;
        this.midNodes = null;
        this.shell = null;
        this.html = null;
        this.shadow = null;
        this.logic = null;
        this.isSelected = null;
        this.isHighlighted = null;
        // mode: EdgeModes = null;
        this.edgeHead = null;
        this.edgeTail = null;
        this.headShell = null;
        this.tailShell = null;
        this.tmpEnd = null;
        this.tmpEndVertex = null;
        this.useMidNodes = true || true;
        this.useRealEndVertex = true || true;
        this.id = null;
        if (!startv) {
            if (logic instanceof IClass) {
                startv = logic.getVertex();
            }
            if (logic instanceof IReference) {
                startv = logic.getVertex();
            }
        }
        U.pe(!startv, 'startVertex missing');
        U.pe(!logic || !startv, 'new Edge() invalid parameters. logic:', logic, 'start:', startv, 'end:', end);
        if (!end) {
            U.pe(!!IEdge.edgeChanging, 'cannot create a pending edge (without target) while there are other pending edges.');
            IEdge.edgeChanging = this;
        }
        IEdge.all.push(this);
        this.id = IEdge.edgeCount++;
        IEdge.idToEdge[this.id] = this;
        this.logic = logic;
        if (!(this instanceof ExtEdge)) {
            U.pe(index === null || index === undefined, 'index must be set.');
            this.logic.edges[index] = this;
        }
        this.shell = document.createElementNS('http://www.w3.org/2000/svg', 'g'); // U.newSvg<SVGGElement>('g');
        this.html = document.createElementNS('http://www.w3.org/2000/svg', 'path'); // U.newSvg<SVGPathElement>('Path');
        this.shadow = U.newSvg('path');
        this.shell.appendChild(this.html);
        this.shell.appendChild(this.shadow);
        this.shadow.dataset.edgeid = this.shell.dataset.edgeid = this.html.dataset.edgeid = '' + this.id;
        this.start = startv;
        this.start.edgesStart.push(this);
        this.setTarget(end);
        this.startNode = new EdgePoint(this, new GraphPoint(0, 0), this.start);
        this.midNodes = [];
        this.endNode = new EdgePoint(this, new GraphPoint(0, 0), this.end);
        this.owner = this.start.owner;
        this.isSelected = false;
        this.isHighlighted = false;
        this.edgeHead = null;
        this.edgeTail = null;
        this.headShell = null;
        this.tailShell = null;
        this.owner.edgeContainer.append(this.shell);
        this.shell.classList.add('EdgeShell');
        this.html.classList.add('Edge');
        this.shadow.classList.add('Edge', 'Shadow');
        this.shell.dataset.modelPieceID = '' + this.logic.id;
        this.html.dataset.modelPieceID = '' + this.logic.id;
        this.shadow.dataset.modelPieceID = '' + this.logic.id;
        this.html.setAttribute('fill', 'none');
        this.shadow.setAttribute('fill', 'none');
        this.shadow.setAttribute('stroke', 'none');
        this.shadow.setAttribute('visibility', 'hidden');
        this.shadow.setAttribute('pointer-events', 'stroke');
        this.addEventListeners(true, false);
        this.refreshGui();
    }
    static staticInit() {
        IEdge.all = [];
        IEdge.selecteds = [];
        // todo: prevent propagation on click on edges.
        U.eventiDaAggiungereAlBody('trigger onBlur of all IEdge.selecteds.');
        $(document.body).off('click.blurEdgeSelection').on('click.blurEdgeSelection', (ee) => {
            const debug = false;
            U.pif(debug, 'body.click(): clear All Edge Selections');
            let i;
            let arr = U.shallowArrayCopy(IEdge.selecteds);
            for (i = 0; i < arr.length; i++) {
                arr[i].onBlur();
            }
            U.pif(debug, 'graph clicked:', ee);
            const modelPieceClicked = ModelPiece.get(ee);
            const edgeClicked = IEdge.get(ee);
            U.pif(debug, 'modelPieceClicked ? ', modelPieceClicked);
            if (!modelPieceClicked) {
                return;
            }
            const htmlClicked = ee.target;
            let parent = htmlClicked;
            while (parent && parent.classList && !parent.classList.contains('EdgeShell')) {
                parent = parent.parentNode;
            }
            // const edgeClicked: IEdge = (parent && parent.classList) ? edge : null;
            U.pif(debug, 'edgeClicked ? ', edgeClicked);
            if (!edgeClicked) {
                return;
            }
            edgeClicked.onClick(ee);
        });
        $(document.body).off('keydown.deletethings').on('keydown.deletethings', (evt) => {
            let i;
            const target = document.activeElement; // evt.target;
            const tag = target.tagName.toLowerCase();
            const isInput = U.isInput(target, true);
            const model = Status.status.getActiveModel();
            const mp = model.graph.propertyBar.selectedModelPiece;
            const ism2 = mp && model.isM2();
            if (mp === model)
                return;
            const v = mp.getVertex(); // IVertex.getvertexByHtml(target);
            const e = []; //U.shallowArrayCopy(IEdge.selecteds);// IEdge.getByHtml(target);
            const ext = [];
            const elogic = [];
            const extlogic = [];
            for (i = 0; i < IEdge.selecteds.length; i++) {
                const elem = IEdge.selecteds[i];
                if (elem instanceof ExtEdge) {
                    ext.push(elem);
                    extlogic.push(elem.logic);
                }
                else {
                    e.push(elem);
                    elogic.push(elem.logic);
                }
            }
            console.log('document.keydown.deletethings: ', evt, e, v, mp);
            if (e && e.length) {
                console.log('edge: evt.key.toLowerCase() = ', evt.key.toLowerCase());
                switch (evt.key.toLowerCase()) {
                    default: break;
                    case 'delete':
                        for (i = 0; i < elogic.length; i++) {
                            elogic[i].delete(true);
                        }
                        for (i = 0; i < ext.length; i++) {
                            ext[i].remove();
                        }
                        break;
                }
                return;
            }
            if (v) {
                switch (evt.key.toLowerCase()) {
                    default: break;
                    case 'd':
                        if (!evt.ctrlKey || !ism2)
                            return;
                        if (mp === model)
                            return;
                        mp.duplicate();
                        break;
                    case 'delete': // case 'Backspace':
                        if (isInput)
                            return;
                        if (mp === model)
                            return;
                        if (ism2)
                            mp.delete(true);
                        else {
                            if (mp instanceof MAttribute)
                                mp.setValues(null);
                            else if (mp instanceof MReference)
                                mp.clearTargets();
                        }
                        break;
                }
            }
        });
        return IEdge.all;
    }
    static get(e) {
        // return ModelPiece.getLogic(e.classType).edge;
        return IEdge.getByHtml(e.target);
    }
    static getByHtml(html0, debug = true) {
        if (!html0) {
            return null;
        }
        let html = html0;
        while (html && (!html.dataset || !html.dataset.edgeid)) {
            html = html.parentElement;
        }
        const ret = html ? IEdge.getByID(+html.dataset.edgeid) : null;
        // U.pe(debug && !ret, 'failed to find edge. html0:', html0, 'html:', html, 'map:', IEdge.idToEdge);
        return ret;
    }
    static getByID(id) { return IEdge.idToEdge[id]; }
    generateAggregationHead(style) { return null; }
    generateContainmentHead(style) { return this.generateAggregationHead(style); }
    generateContainmentTail(style) { return this.generateAggregationTail(style); }
    generateAggregationTail(style) {
        let svg;
        const bugfigo = false;
        // if (this instanceof ExtEdge) svg = this.edgeTail = this.edgeHead || U.newSvg('svg');
        if (bugfigo || this.edgeTail && this.tailtype === EdgeDecoratorType.containment) {
            svg = this.edgeTail;
        }
        else {
            svg = U.newSvg('svg');
        } // don't set it here, it will be set and eventlistened later.
        this.tailtype = EdgeDecoratorType.containment;
        svg.setAttributeNS(null, 'width', '' + style.width);
        svg.setAttributeNS(null, 'height', '' + style.width);
        svg.setAttributeNS(null, 'viewBox', (-style.width) + ' ' + (-style.width) + ' ' + (200 + style.width * 2) + ' ' + (200 + style.width * 2));
        const path = U.newSvg('path');
        path.setAttributeNS(null, 'fill', style.fill);
        path.setAttributeNS(null, 'stroke', style.stroke);
        path.setAttributeNS(null, 'stroke-width', '' + style.width);
        path.setAttributeNS(null, 'd', 'M100 0 L200 100 L100 200 L0 100 Z');
        svg.appendChild(path);
        return svg;
    }
    generateGeneralizationHead(style) {
        let svg;
        const bugfigo = false;
        if (bugfigo || this.edgeHead && this.headtype === EdgeDecoratorType.generalization) {
            svg = this.edgeHead;
        }
        else {
            svg = U.newSvg('svg');
        }
        this.headtype = EdgeDecoratorType.generalization;
        svg.setAttributeNS(null, 'width', '' + style.width);
        svg.setAttributeNS(null, 'height', '' + style.width);
        svg.setAttributeNS(null, 'viewBox', (-style.width) + ' ' + (-style.width) + ' ' + (200 + style.width * 2) + ' ' + (200 + style.width * 2));
        const path = U.newSvg('path');
        path.setAttributeNS(null, 'fill', style.fill);
        path.setAttributeNS(null, 'stroke', style.stroke);
        path.setAttributeNS(null, 'stroke-width', '' + style.width);
        path.setAttributeNS(null, 'd', 'M100 0 L200 200 L000 200 Z');
        svg.appendChild(path);
        return svg;
    }
    generateGeneralizationTail(style) { return null; }
    static makePathSegment(prevPt, nextPt, mode0, angularFavDirectionIsHorizontal = null, prevVertexSize, nextVertexSize, type = ' L', debug = false) {
        // todo old: devi rifare totalmente la parte di "angularFavDirection" basandoti su se cade perpendicolare sul vertice e devi usare
        // 2 variabili, forzando la direzione ad essere per forza perpendicolare sul lato su cui risiede il vertex.startPt o .endPt
        // poi: se le direzioni forzate coincidono, allora è un angular3, se sono vertical+horizontal, allora è un angular2.
        // nb: in prevVertexSize e nextVertexSize la favDirection viene calcolata uguale, ma l'assenamento prevVertexSize = nextVertexSize;
        // poi deve sparire perchè devo generare 2 diverse favDirection e non una sola.
        let m;
        let pathStr = '';
        const pt1IsOnHorizontalSide = !prevVertexSize ? null : U.isOnHorizontalEdges(prevPt, prevVertexSize);
        const pt2IsOnHorizontalSide = !nextVertexSize ? null : U.isOnHorizontalEdges(nextPt, nextVertexSize);
        // if (prevVertexSize) { prevPt = prevVertexSize} //IVertex.closestIntersection(); }
        if (debug) {
            U.cclear();
            Status.status.getActiveModel().graph.markg(prevPt, true, 'green');
            if (prevVertexSize) {
                Status.status.getActiveModel().graph.markgS(prevVertexSize, false, 'white');
            }
            Status.status.getActiveModel().graph.markg(nextPt, false, 'green');
            if (nextVertexSize) {
                Status.status.getActiveModel().graph.markgS(nextVertexSize, false);
            }
        }
        U.pif(debug, 'prev:' + (pt1IsOnHorizontalSide) + ', next:' + (pt2IsOnHorizontalSide), 'm0:' + mode0 + ' --> ' + mode0 + ', favDirection' + angularFavDirectionIsHorizontal);
        // return '';
        U.pif(debug, 'directions:', pt1IsOnHorizontalSide, pt2IsOnHorizontalSide);
        if (prevVertexSize && !U.isOnEdge(prevPt, prevVertexSize)) {
            U.pw(debug, 'prev not on border');
            return '';
        }
        if (nextVertexSize && !U.isOnEdge(nextPt, nextVertexSize)) {
            U.pw(debug, 'next not on border');
            return '';
        }
        U.pe(prevVertexSize && !U.isOnEdge(prevPt, prevVertexSize) || nextVertexSize && !U.isOnEdge(nextPt, nextVertexSize), 'not on border');
        if (prevVertexSize && !U.isOnEdge(prevPt, prevVertexSize) || nextVertexSize && !U.isOnEdge(nextPt, nextVertexSize)) {
            /*console.clear();
            const g = Status.status.getActiveModel().graph;
            g.markg(prevPt, false, 'green');
            g.markgS(prevVertexSize, false, 'green');
            g.markg(prevPt, false);
            g.markgS(prevVertexSize, false);
            console.log('not on vertex border. pt:', prevPt, 'vertex:', prevVertexSize);
            console.log('not on vertex border. nextpt:', nextPt, 'nextvertex:', nextVertexSize);
            U.pw(true, (!U.isOnEdge(prevPt, prevVertexSize) ? 'prev' : 'next') + ' not on vertex border.');
            return '';
            */
        }
        let mode = mode0;
        if (prevVertexSize && nextVertexSize) {
            // mode = (pt1IsOnHorizontalSide && pt2IsOnHorizontalSide) ? EdgeModes.angular3 : EdgeModes.angular2;
        }
        // if (mode === EdgeModes.angular23Auto) { mode = EdgeModes.angular3; }
        /*
        if (prevVertexSize && mode === EdgeModes.angular23Auto) {
          // U.pe(angularFavDirectionIsHorizontal === null, 'preferred direction is useless with prevVertexSize');
          U.pif(debug, 'favdirection pre:', angularFavDirectionIsHorizontal,
            'isOnVerticalEdge:', U.isOnVerticalEdges(prevPt, prevVertexSize),
            'isOnHorizontalEdge:', U.isOnHorizontalEdges(prevPt, prevVertexSize), 'prevPt:', prevPt, 'prevSize:', prevVertexSize);
          if (angularFavDirectionIsHorizontal === false && U.isOnVerticalEdges(prevPt, prevVertexSize)) {
            mode = EdgeModes.angular2; angularFavDirectionIsHorizontal = true; }
          if (angularFavDirectionIsHorizontal === true && U.isOnHorizontalEdges(prevPt, prevVertexSize)) {
            mode = EdgeModes.angular2; angularFavDirectionIsHorizontal = false; }
          U.pif(debug, 'favdirection post:', angularFavDirectionIsHorizontal);
        } */
        /* compute last favorite direction * /
    let lastIsHorizontalSide: boolean = null;
    const endPt: GraphPoint = allRealPt[allRealPt.length - 1].pos;
    const penultimoPt: GraphPoint = allRealPt[allRealPt.length - 2].getStartPoint();
    console.log('endVertex:', endVertex, 'endPt:', endPt, '; useRealEnd ? ', useRealEndVertex, ' = ', this.tmpEnd, this.tmpEndVertex);
    if (!endVertex) { lastIsHorizontalSide = Math.abs(GraphPoint.getM(penultimoPt, endPt)) < 1; } else
    if (endPt.x === endVertexSize.x) {                   /*from Left* /   lastIsHorizontalSide = true; } else
    if (endPt.x === endVertexSize.x + endVertexSize.w) { /*from Right* /  lastIsHorizontalSide = true; } else
    if (endPt.y === endVertexSize.y) {                   /*from Top* /    lastIsHorizontalSide = false; } else
    if (endPt.y === endVertexSize.y + endVertexSize.h) { /*from Bottom* / lastIsHorizontalSide = false;
    } else { lastIsHorizontalSide = null; }
    U.pe(lastIsHorizontalSide === null, 'endpoint is not on the boundary of vertex.',
      ' Vertex.endpoint:', endPt, '; vertexSize:', endVertexSize);*/
        /* done setting realpoints.pos, now draw path */
        let oldPathStr = pathStr;
        if (mode === EdgeModes.angular23Auto) {
            mode = mode0 = EdgeModes.angular3;
        }
        const angular23 = EdgeModes.angular3;
        // if (mode0 === angular23 && prevVertexSize && !pt1IsOnHorizontalSide && nextVertexSize && pt2IsOnHorizontalSide) {
        U.pif(debug, mode0 === angular23, !!prevVertexSize, pt1IsOnHorizontalSide);
        if (mode0 === angular23 && prevVertexSize && pt1IsOnHorizontalSide) {
            angularFavDirectionIsHorizontal = false;
            mode = EdgeModes.angular3;
            U.pif(debug, 'fixed');
        }
        // if (prevVertexSize) { angularFavDirectionIsHorizontal = pt1IsOnHorizontalSide; }
        // if (nextVertexSize) { angularFavDirectionIsHorizontal = !pt2IsOnHorizontalSide; }
        // if (mode === angular23 && prev)
        switch (mode) {
            default:
                U.pe(true, 'unexpected EdgeMode:', mode);
                break;
            case EdgeModes.angular2:
                m = GraphPoint.getM(prevPt, nextPt); // coefficiente angolare della prossima linea disegnata (come se fosse dritta)
                if (angularFavDirectionIsHorizontal === null) {
                    angularFavDirectionIsHorizontal = Math.abs(m) <= 1;
                } // angolo <= abs(45°)
                if (angularFavDirectionIsHorizontal) {
                    // qui resizer orizzontale
                    oldPathStr = pathStr;
                    pathStr += type + (nextPt.x) + ' ' + (prevPt.y);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 favdirectionHorizontal');
                }
                else {
                    // qui resizer verticale.
                    oldPathStr = pathStr;
                    pathStr += type + (prevPt.x) + ' ' + (nextPt.y);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 favdirectionVertical');
                }
                // qui resizer opposto al precedente.
                // oldPathStr = pathStr;
                // pathStr += type + (nextPt.x) + ' ' + (nextPt.y);
                // U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; ang2 end ridondante?');
                break;
            case EdgeModes.angular23Auto + '':
                U.pw(true, 'mode.angular23Auto should be replaced before entering here');
                break;
            case EdgeModes.angular3:
                m = GraphPoint.getM(prevPt, nextPt); // coefficiente angolare della prossima linea disegnata (come se fosse dritta)
                if (angularFavDirectionIsHorizontal === null) {
                    angularFavDirectionIsHorizontal = Math.abs(m) <= 1;
                } // angolo <= abs(45°)
                if (angularFavDirectionIsHorizontal) {
                    const midX = (nextPt.x + prevPt.x) / 2;
                    // todo: e qui dovrei appendere un path invisibile che cambia cursore in HorizontalResizer intercettare gli eventi edge.
                    oldPathStr = pathStr;
                    pathStr += type + (midX) + ' ' + (prevPt.y);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 orizzontale: orizzontale big');
                    // qui invece uno piccolino verticale
                    oldPathStr = pathStr;
                    pathStr += type + (midX) + ' ' + (nextPt.y);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 orizzontale: verticale small');
                }
                else {
                    const midY = (nextPt.y + prevPt.y) / 2;
                    // todo: qui resizer verticale.
                    oldPathStr = pathStr;
                    pathStr += type + prevPt.x + ' ' + (midY);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 verticale: verticale big');
                    // qui invece uno piccolino orizzontale
                    oldPathStr = pathStr;
                    pathStr += type + nextPt.x + ' ' + (midY);
                    U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; angular3 verticale: orizzontale small');
                }
                // todo: qui resizer opposto al precedente.
                break;
            case EdgeModes.straight: /* nessun punto fittizio di mezzo */ break;
        }
        oldPathStr = pathStr;
        pathStr += type + (nextPt.x) + ' ' + (nextPt.y);
        U.pif(debug, 'pathStr: ', oldPathStr, ' --> ', pathStr, '; lastPt comune a tutti.');
        return pathStr;
    }
    /*private static midPointMouseDown(e: JQuery.MouseDownEvent) {
      IEdge.tempMidPoint_ModelPiece = ModelPiece.getLogic(e.currentTarget);
      IEdge.tempMidPoint_Clicked = Status.status.getActiveModel().graph.toGraphCoord( new Point(e.pageX, e.pageY) );
    }*/ /*
    private static midPointMouseMove(e: JQuery.MouseMoveEvent) {
      const p: GraphPoint = Status.status.getActiveModel().graph.toGraphCoord( new Point(e.pageX, e.pageY) );
  
    }
    private static midPointMouseUp(e: JQuery.MouseUpEvent) { }*/
    canBeLinkedTo(target) { return this.logic.canBeLinkedTo(target); }
    refreshGui(debug = false, useRealEndVertex = null, usemidnodes = null) {
        debug = false;
        let debugi = window['' + 'debug'];
        if (debugi === 1)
            return;
        // || this.start.size.isinside(this.end.size) ||  this.end.size.isinside(this.start.size
        // quando startpoint o endpoint sono dentro un vertice size
        if (!this.midNodes.length && (this.start === this.end)) { //this.start.size.intersection(this.end.size))) {
            $(this.shell).hide();
            return;
        }
        else
            $(this.shell).show();
        U.pe(!this.logic, 'IEdge.logic is null:', this);
        if (useRealEndVertex === null) {
            useRealEndVertex = this.useRealEndVertex;
        }
        if (usemidnodes === null) {
            usemidnodes = this.useMidNodes;
        }
        /* setup variables */
        const startVertex = this.start;
        const startVertexSize = this.start.getSize();
        let endVertex = null;
        let endVertexSize = null;
        let allRealPt = this.getAllRealMidPoints();
        if (!usemidnodes) {
            allRealPt = [allRealPt[0], allRealPt[allRealPt.length - 1]];
        }
        if (useRealEndVertex) {
            endVertex = this.end;
            endVertexSize = endVertex.getSize();
            this.startNode.moveTo(startVertex.getStartPoint(allRealPt[1].getEndPoint()), false);
            this.endNode.moveTo(endVertex.getEndPoint(allRealPt[allRealPt.length - 2].getStartPoint()), false);
        }
        else {
            endVertex = this.tmpEndVertex;
            endVertexSize = endVertex ? endVertex.getSize() : null;
            this.startNode.moveTo(startVertex.getStartPoint(allRealPt[1].getEndPoint()), false);
            this.endNode.moveTo(endVertex ? endVertex.getEndPoint(allRealPt[allRealPt.length - 2].getStartPoint()) : this.tmpEnd, false);
        }
        if (debugi === 2)
            return;
        U.pif(debug, 'allRealPt:', allRealPt);
        let i;
        let pathStr; // 'M' + (allRealPt[0].getStartPoint().x) + ' ' + (allRealPt[0].getStartPoint().y);
        let oldpathStr;
        const graph = this.logic.getModelRoot().graph;
        if (debugi === 3)
            return;
        if (debug) {
            U.cclear();
            if (startVertexSize) {
                graph.markgS(startVertexSize, true, 'blue');
            }
            if (endVertexSize) {
                graph.markgS(endVertexSize, false);
            }
        }
        for (i = 1; i < allRealPt.length; i++) { // escludo il primo punto dal loop.
            const curr = allRealPt[i];
            const prev = allRealPt[i - 1];
            const favdirection = null; // i === allRealPt.length - 1 ? lastdirectionIsHorizontal : null;
            const prevVertexSize = i === 1 ? startVertexSize : null;
            const nextVertexSize = i === allRealPt.length - 1 ? endVertexSize : null;
            const prevPt = prev.getStartPoint(!prevVertexSize, !prevVertexSize);
            const currPt = curr.getEndPoint(!nextVertexSize, !nextVertexSize);
            // console.log(prevVertexSize, new GraphSize());
            const intersection = nextVertexSize && prevVertexSize ? nextVertexSize.intersection(prevVertexSize) : null;
            if (intersection)
                console.log('midenodes.length:', !this.midNodes.length, '&&', prevPt, currPt, ' contained in ', intersection, intersection.contains(prevPt), intersection.contains(currPt));
            if (debug) {
                if (intersection)
                    this.owner.markgS(intersection, true, 'black');
                this.owner.markg(prevPt, true, 'orange');
                this.owner.markg(currPt, false, 'yellow');
                if (prevVertexSize) {
                    graph.markgS(prevVertexSize, false, 'blue');
                }
                if (nextVertexSize) {
                    graph.markgS(nextVertexSize, false);
                }
            }
            if (!this.midNodes.length && intersection && (intersection.contains(prevPt) || intersection.contains(currPt))) {
                $(this.shell).hide();
                return;
            }
            // if (i === 1) { pt1.moveOnNearestBorder(startVertexSize, false); }
            // if (i === allRealPt.length - 1) { pt2.moveOnNearestBorder(endVertexSize, false); }
            if (i === 1) {
                pathStr = 'M' + prevPt.x + ' ' + prevPt.y;
            }
            oldpathStr = pathStr;
            pathStr += IEdge.makePathSegment(prevPt, currPt, this.getEdgeMode(), favdirection, prevVertexSize, nextVertexSize);
            U.pif(debug, 'pathStr: RealPts:' + '[' + i + '] = ' + currPt.toString() + '; prev:' + prevPt.toString());
            U.pif(debug, 'pathStr[' + (i) + '/' + allRealPt.length + ']: ' + oldpathStr + ' --> ' + pathStr);
        }
        if (debugi === 3)
            return;
        this.setPath(pathStr, debug);
        if (debugi === 4)
            return;
        this.getEdgeHead();
        this.getEdgeTail();
        if (debugi === 5)
            return;
        this.appendTailHead(true, pathStr);
        this.appendTailHead(false, pathStr);
        if (debugi === 6)
            return;
        // this.addEventListeners(true, false);
    }
    getEdgeMode() {
        let tmp = this.logic.edgeStyleCommon.style;
        return tmp ? tmp : this.logic.edgeStyleCommon.style = EdgeModes.straight;
    }
    getStyle() {
        if (this.isSelected) {
            return this.logic.edgeStyleSelected;
        }
        if (this.isHighlighted) {
            return this.logic.edgeStyleHighlight;
        }
        else {
            return this.logic.edgeStyleCommon;
        }
    }
    setPath(pathStr, debug = false) {
        let style = this.getStyle();
        /* update style */
        this.html.setAttribute('stroke', style.color);
        this.html.setAttribute('stroke-width', '' + style.width);
        this.shadow.setAttribute('stroke-width', '' + (style.width + IEdge.shadowWidthIncrease));
        // U.clear(this.shell);
        this.shell.appendChild(this.html);
        this.shell.appendChild(this.shadow);
        U.pif(debug, 'edgeHead:', this.edgeHead, 'tail:', this.edgeTail);
        this.html.setAttributeNS(null, 'd', pathStr);
        this.shadow.setAttributeNS(null, 'd', pathStr);
        let i;
        if (this.isSelected) {
            this.startNode.show();
            for (i = 0; i < this.midNodes.length; i++) {
                this.midNodes[i].show();
            }
            this.endNode.show();
        }
        else if (this.isHighlighted) {
            this.startNode.hide();
            for (i = 0; i < this.midNodes.length; i++) {
                this.midNodes[i].show();
            }
            this.endNode.hide();
        }
        else {
            this.startNode.hide();
            for (i = 0; i < this.midNodes.length; i++) {
                this.midNodes[i].hide();
            }
            this.endNode.hide();
        }
    }
    addEventListeners(foredge, forheadtail) {
        const $edgetail = forheadtail ? $(this.headShell).add(this.tailShell) : $();
        const $shell = foredge ? $(this.shell) : $();
        const $edgeparts = $shell.find('.Edge').add($edgetail);
        // U.pe(!$shell.length, 'html+', $htmlplus, 'html', $html, 'tailhead', $edgetail);
        //  U.pe(!$edgetail.length, 'html+', $htmlplus, 'html', $html, 'tailhead', $edgetail, 'head-tail:', this.edgeHead, this.edgeTail);
        $shell.off('click.pbar').on('click.pbar', (e) => IVertex.ChangePropertyBarContentClick(e, this));
        /*$html.off('mousedown.showStyle').on('mousedown.showStyle',
          (e: MouseDownEvent) => { Status.status.getActiveModel().graph.propertyBar.styleEditor.showE(this.logic); });*/
        $shell.off('mousedown.startSetMidPoint').on('mousedown.startSetMidPoint', (e) => {
            // const ownermp: M2Class | IReference = ModelPiece.getLogic(e.currentTarget) as M2Class | IReference;
            // U.pe( ownermp === null || ownermp === undefined, 'unable to get logic of:', e.currentTarget);
            const edge = IEdge.get(e);
            U.pe(!e, 'unable to get edge of:', e.currentTarget);
            edge.onMouseDown(e);
        });
        $shell.off('mousemove.startSetMidPoint').on('mousemove.startSetMidPoint', (e) => {
            // const ownermp: M2Class | IReference = ModelPiece.getLogic(e.currentTarget) as M2Class | IReference;
            // U.pe( ownermp === null || ownermp === undefined, 'unable to get logic of:', e.currentTarget);
            const edge = IEdge.getByHtml(e.target, true);
            edge.onMouseMove(e);
        });
        $shell.off('click.addEdgePoint').on('click.addEdgePoint', (e) => { IEdge.get(e).onClick(e); });
        $edgeparts.off('mouseover.cursor').on('mouseover.cursor', (e) => { IEdge.get(e).onMouseOver(e); });
        $edgeparts.off('mouseenter.cursor').on('mouseenter.cursor', (e) => { IEdge.get(e).onMouseEnter(e); });
        $edgeparts.off('mouseleave.cursor').on('mouseleave.cursor', (e) => { IEdge.get(e).onMouseLeave(e); });
    }
    onBlur() {
        this.isSelected = false;
        this.html.classList.remove('selected_debug');
        U.arrayRemoveAll(IEdge.selecteds, this);
        let i;
        for (i = 0; i < this.midNodes; i++) {
            this.midNodes[i].hide();
        }
        this.refreshGui();
    }
    getAllRealMidPoints() {
        const allNodes = [];
        allNodes.push(this.startNode);
        let i = 0;
        while (i < this.midNodes.length) {
            allNodes.push(this.midNodes[i++]);
        }
        allNodes.push(this.endNode);
        return allNodes;
    }
    getAllFakePoints(debug = false) {
        // if (!this.html) { return null; }
        const d = this.html.getAttributeNS(null, 'd'); // .replace('M', 'L');
        // let dArr: string[] = d.split('L'); /// consider instead: U.parseSvgPath(pathStr).pts;
        // if (dArr.length === 1) { dArr = [dArr[0], dArr[0]]; }
        let i;
        const realMidPoints = this.getAllRealMidPoints();
        const nodiFittizi = [];
        let realNodeIndex = 0;
        let puntiReali = 0;
        const parsedpts = U.parseSvgPath(d);
        for (i = 0; i < parsedpts.pts.length; i++) {
            const pt = new GraphPoint(parsedpts.pts[i].x, parsedpts.pts[i].y);
            let target = null;
            U.pif(debug, 'getAllFakePoints() d:', d, 'pt', pt, 'realMidPoints:', realMidPoints, 'index:', realNodeIndex, 'match?', realNodeIndex >= realMidPoints.length ? 'overflow' : realMidPoints[realNodeIndex].pos.equals(pt));
            let fitHorizontal;
            let fitVertical;
            if (i !== 0 && i !== parsedpts.pts.length - 1) {
                fitHorizontal = fitVertical = true;
            }
            if (i === 0 && !U.isOnHorizontalEdges(pt, this.start.getSize())) {
                fitHorizontal = false;
                fitVertical = true;
            }
            if (i === 0 && U.isOnHorizontalEdges(pt, this.start.getSize())) {
                fitHorizontal = true;
                fitVertical = false;
            }
            if (i === parsedpts.pts.length - 1 && !U.isOnHorizontalEdges(pt, this.end.getSize())) {
                fitHorizontal = false;
                fitVertical = true;
            }
            if (i === parsedpts.pts.length - 1 && U.isOnHorizontalEdges(pt, this.end.getSize())) {
                fitHorizontal = true;
                fitVertical = false;
            }
            // fitHorizontal = (i === 0 && U.isOnHorizontalEdges(pt, this.start.getSize()));
            const midPoint = realMidPoints[realNodeIndex].getStartPoint(fitHorizontal, fitVertical);
            // todo: se cambi endpoint !== startpoint, devi fare due check.
            // const prevPt: GraphPoint = allNodes[realNodeIndex].getStartPoint(!!prevVertexSize, !!prevVertexSize);
            // const currPt: GraphPoint = curr.getEndPoint(!!nextVertexSize, !!nextVertexSize);
            U.pif(debug, pt, ' =?= ', midPoint, pt.equals(midPoint));
            if (pt.equals(midPoint)) {
                puntiReali++;
                target = realMidPoints[realNodeIndex++];
            }
            nodiFittizi.push(new EdgePointFittizio(pt, target));
        }
        if (puntiReali < 2 || puntiReali < realMidPoints.length) {
            const prettyFittizi = [];
            const prettyRealMidPoints = [];
            i = -1;
            while (++i < nodiFittizi.length) {
                prettyFittizi.push(nodiFittizi[i].pos.toString());
            }
            i = -1;
            while (++i < realMidPoints.length) {
                prettyRealMidPoints.push(realMidPoints[i].pos.toString());
            }
            U.pw(debug, 'fallimento nell\'assegnare fakepoints ai punti reali. Assegnati:' + puntiReali + ' / ' + prettyRealMidPoints.length
                + '; fittizi trovati:', prettyFittizi, ' reali:', prettyRealMidPoints, ', parsedpts:', parsedpts, ', path:', d);
        }
        return nodiFittizi;
    }
    getBoundingMidPoints(e, style = null, canFail = false, arrFittizi = null) {
        const fittizi = arrFittizi ? arrFittizi : this.getAllFakePoints();
        const tmp = this.getBoundingMidPointsFake(e, style, canFail, fittizi);
        return { prev: tmp[0].getPreviousRealPt(fittizi), next: tmp[1].getNextRealPt(fittizi) };
    }
    getBoundingMidPointsFake(e, style = null, canFail = false, arrFittizi = null) {
        // if (style.style === EdgeModes.straight) { return this.getBoundingMidPointsStraight(e, canFail); }
        // const edge: IEdge = ModelPiece.getLogic(e.classType).edge;
        const clickedPt = GraphPoint.fromEvent(e);
        const lineWidth = +this.shadow.getAttributeNS(null, 'stroke-width');
        const allNodes = this.getAllRealMidPoints();
        const fittizi = arrFittizi ? arrFittizi : this.getAllFakePoints();
        let i = 0;
        let closestPrev = null;
        let closestNext = null;
        let closestDistance = Number.POSITIVE_INFINITY;
        if (fittizi.length <= 2)
            return null;
        while (++i < fittizi.length) {
            const prev = fittizi[i - 1];
            const next = fittizi[i];
            const currentDistance = clickedPt.distanceFromLine(prev.pos, next.pos);
            /*if (clickedPt.isInTheMiddleOf(prev.pos, next.pos, lineWidth)) { return [prev, next]; }*/
            if (currentDistance < closestDistance) {
                closestPrev = prev;
                closestNext = next;
                closestDistance = currentDistance;
            }
        }
        return [closestPrev, closestNext];
    }
    getBoundingMidPointsStraight_OLD(e, canFail = false) {
        const edge = null; // ModelPiece.getLogic(e.classType).edge;
        const clickedPt = GraphPoint.fromEvent(e);
        const first = this.startNode;
        const second = (this.midNodes.length === 0 ? this.endNode : this.midNodes[0]);
        const penultimo = (this.midNodes.length === 0 ? this.startNode : this.midNodes[this.midNodes.length - 1]);
        const last = this.endNode;
        const lineWidth = +this.shadow.getAttributeNS(null, 'stroke-width');
        if (clickedPt.isInTheMiddleOf(first.pos, second.pos, lineWidth)) {
            /*console.log('bounding (first[' + edge.midNodes.indexOf(second)
              + '] && second[' + + edge.midNodes.indexOf(penultimo) + ']); e:', edge);*/
            return [first, second];
        }
        /* if (penultimo !== first && second !== penultimo && clickedPt.isInTheMiddleOf(second.pos, penultimo.pos, lineWidth)) {
          console.log('bounding (second[' + edge.midNodes.indexOf(second)
            + '] && penultimo[' + + edge.midNodes.indexOf(penultimo) + ']), e:', edge);
          U.pe(edge.midNodes.indexOf(second) + 1 !== edge.midNodes.indexOf(penultimo), 'non conseguenti');
          return [second, penultimo]; } */
        if (last !== second && clickedPt.isInTheMiddleOf(penultimo.pos, last.pos, lineWidth)) {
            /*console.log('bounding (penultimo[' + edge.midNodes.indexOf(penultimo)
              + '] && ultimo[' + + edge.midNodes.indexOf(last) + ']); e:', edge);*/
            return [penultimo, last];
        }
        let i;
        for (i = 0; i < this.midNodes.length; i++) { // ottimizzazione: può partire da 1 e terminare 1 prima (penultimo)
            const pre = i === 0 ? first : this.midNodes[i - 1];
            const now = this.midNodes[i];
            if (clickedPt.isInTheMiddleOf(pre.pos, now.pos, lineWidth)) {
                /*console.log('bounding (pre[' + edge.midNodes.indexOf(pre)
                  + '] && now[' + + edge.midNodes.indexOf(now) + ']), e:', edge);*/
                U.pe(edge.midNodes.indexOf(pre) + 1 !== edge.midNodes.indexOf(now), 'non consecutivi.');
                return [pre, now];
            }
        }
        console.log('clickedPt:', clickedPt, ', start:', this.startNode.pos, ', mids:', this.midNodes, ', end:', this.endNode.pos);
        U.pe(!canFail, 'bounding points not found:', e, this, 'edge:', IEdge.get(e));
        return null;
    }
    onMouseLeave(e) {
        this.isHighlighted = false;
        this.startNode.refreshGUI(null, false);
        this.endNode.refreshGUI(null, false);
        let i;
        for (i = 0; i < this.midNodes.length; i++) {
            this.midNodes[i].refreshGUI(null, false);
        }
        this.refreshGui();
    }
    onMouseEnter(e) {
        this.onMouseLeave(null);
        this.isHighlighted = true;
        this.refreshGui(true);
    }
    onMouseMove(e) { this.onMouseOver(e, false); }
    onMouseOver(e, canFail = false, debug = false) {
        if (CursorFollowerEP.get().isAttached() || IEdge.edgeChanging) {
            return;
        }
        const fakePoints = this.getAllFakePoints();
        const tmp = this.getBoundingMidPointsFake(e, null, canFail, fakePoints);
        if (!tmp || tmp.length < 2) {
            return;
        }
        const preFake = tmp[0];
        const nextFake = tmp[1];
        const pre = preFake.getPreviousRealPt(fakePoints);
        const next = nextFake.getNextRealPt(fakePoints);
        U.pe(!pre, 'failed to get previousRealPt of point:', preFake, ', all fakePoints:', fakePoints);
        U.pe(!next, 'failed to get nextRealPt of point:', nextFake, ', all fakePoints:', fakePoints);
        let i = -1;
        this.startNode.refreshGUI(null, false);
        this.endNode.refreshGUI(null, false);
        let cursor;
        switch (this.getEdgeMode()) {
            default:
                cursor = 'help';
                break;
            case EdgeModes.straight:
                cursor = 'select';
                break;
            case EdgeModes.angular2:
            case EdgeModes.angular3:
            case EdgeModes.angular23Auto:
                if (preFake.pos.x === nextFake.pos.x) {
                    cursor = 'col-resize';
                }
                else if (preFake.pos.y === nextFake.pos.y) {
                    cursor = 'row-resize';
                }
                else {
                    cursor = 'no-drop';
                }
                break;
        }
        this.shadow.style.cursor = this.html.style.cursor = cursor;
        while (++i < this.midNodes.length) {
            this.midNodes[i].refreshGUI(null, false);
        }
        if (debug) {
            U.cclear();
        }
        U.pif(debug, 'fake     pre: ', preFake, ', next:', nextFake);
        U.pif(debug, 'real     pre: ', pre, ', next:', next);
        pre.refreshGUI(null, true);
        next.refreshGUI(null, true);
    }
    onClick(e) {
        // console.log('IEdge.clicked:', this);
        const debug = false;
        this.isSelected = true;
        IEdge.selecteds.push(this);
        let i;
        this.html.setAttributeNS(null, 'stroke-width', '' + 5);
        this.html.classList.add('selected_debug');
        this.startNode.show();
        if (debug) {
            U.cclear();
        }
        U.pif(debug, 'midnodes:', this.midNodes);
        for (i = 0; i < this.midNodes; i++) {
            this.midNodes[i].show(debug);
        }
        this.endNode.show();
        // if (!triggered) { Status.status.getActiveModel().graph.propertyBar.styleEditor.showE(this.logic); }
        this.refreshGui();
        IVertex.ChangePropertyBarContentClick(e, this);
        e.stopPropagation();
    }
    onMouseDown(e) {
        if (!this.isSelected) {
            return;
        }
        const tmp = this.getBoundingMidPoints(e);
        const pos = this.owner.toGraphCoord(new Point(e.pageX, e.pageY));
        CursorFollowerEP.get().attach(this, pos, this.midNodes.indexOf(tmp.prev));
    }
    onMouseUp(e) {
        const len0 = this.midNodes.length;
        const index = this.midNodes.indexOf(CursorFollowerEP.get());
        if (!this.isSelected) {
            return;
        }
        // console.log('point inserted Pre', this.midNodes, ' [0]:', this.midNodes[0], this.midNodes[1]);
        CursorFollowerEP.get().detach(false);
        const len1 = this.midNodes.length;
        U.insertAt(this.midNodes, index, new EdgePoint(this, CursorFollowerEP.get().pos));
        const len2 = this.midNodes.length;
        U.pe(len0 !== this.midNodes.length, 'size varied: ' + len0 + ' --> ' + len1 + ' --> ' + len2 + ' --> ' + this.midNodes.length);
        // console.log('point inserted Post:', this.midNodes,  len0 + ' --> ' + this.midNodes.length);
        this.refreshGui();
    }
    remove() {
        console.log('edge.remove()');
        this['' + 'removedtwice'] = 1 + (+this['' + 'removedtwice'] || 0);
        if (this['' + 'removedtwice'] > 1) {
            U.pw(true, 'edge removed ' + this['' + 'removedtwice'] + ' times.', this);
            return;
        }
        U.arrayRemoveAll(this.start.edgesStart, this);
        U.arrayRemoveAll(this.end.edgesEnd, this);
        U.arrayRemoveAll(IEdge.all, this);
        U.arrayRemoveAll(IEdge.selecteds, this);
        const index = this.getIndex();
        this.logic.edges[index] = null;
        if (this.logic instanceof MReference)
            this.logic.mtarget[index] = null;
        if (this instanceof ExtEdge)
            U.arrayRemoveAll(this.logic.extends, this.end.logic());
        this.shell.parentNode.removeChild(this.shell);
        // gc helper
        this.end = null;
        this.logic = null;
        this.tmpEnd = null;
        this.tmpEndVertex = null;
        this.endNode = null;
        this.midNodes = null;
        this.owner = null;
        this.start = null;
        this.startNode = null;
    }
    unsetTarget() {
        const v = this.end;
        if (!v) {
            return null;
        }
        this.end = null;
        U.arrayRemoveAll(v.edgesEnd, this);
        return v;
    }
    setTarget(v) {
        this.unsetTarget();
        this.end = v;
        if (v) {
            v.edgesEnd.push(this);
        }
    }
    mark(markb, key = 'errorGeneric', color = 'red') {
        U.pe(true, 'IEdge.mark() todo.');
    }
    // bug: https://bugzilla.mozilla.org/show_bug.cgi?id=577785#c2
    getEdgeHead() {
        const logic = this.logic;
        const logicref = this.logic instanceof IReference ? this.logic : null;
        const logicclass = this.logic instanceof IClass ? this.logic : null;
        let html = null;
        //console.trace();
        //console.log('getEdgeHead(), ', this.getStyle().edgeHeadStyle, this.isHighlighted);
        let debugi = window['' + 'debug'];
        if (debugi === 4.1)
            return this.edgeHead ? this.edgeHead : html;
        if (logicref && logicref.isContainment()) {
            html = this.generateContainmentHead(this.getStyle().edgeHeadStyle);
        }
        if (this instanceof ExtEdge) {
            html = this.generateGeneralizationHead(this.getStyle().edgeHeadStyle);
        }
        U.pe(this instanceof ExtEdge && !html, 'cannot return null on extedge:', html, this);
        if (debugi === 4.2)
            return this.edgeHead ? this.edgeHead : html;
        if (!html) {
            return this.edgeHead = null;
        }
        if (html === this.edgeHead)
            return;
        this.edgeHead = html;
        html.classList.add('Edge', 'EdgeHead');
        if (this.headShell)
            this.headShell.appendChild(this.edgeHead);
        return this.edgeHead;
    }
    getEdgeTail() {
        const logic = this.logic;
        const logicref = this.logic instanceof IReference ? this.logic : null;
        const logicclass = this.logic instanceof IClass ? this.logic : null;
        let html = null;
        if (logicref && logicref.isContainment()) {
            html = this.generateContainmentTail(this.getStyle().edgeHeadStyle);
        }
        if (this instanceof ExtEdge) {
            html = this.generateGeneralizationTail(this.getStyle().edgeHeadStyle);
        }
        if (!html) {
            return this.edgeTail = null;
        }
        if (html === this.edgeTail)
            return;
        this.edgeTail = html;
        html.classList.add('Edge', 'EdgeTail');
        if (this.tailShell)
            this.tailShell.appendChild(this.edgeTail);
        return this.edgeTail = html;
    }
    appendTailHead(tail, pathStr, debug = false) {
        const svg = tail ? this.edgeTail : this.edgeHead;
        const shell = tail ? this.tailShell : this.headShell;
        if (!svg) {
            return;
        }
        // debug = true;
        if (debug)
            U.cclear();
        const oldPathStr = pathStr;
        let startsub;
        let endsub;
        // filtro il pathStr estraendo solo i primi 2 o gli ultimi 2 punti. (migliora performance su edge pieni di edgepoints)
        let pt1;
        let pt2;
        if (!tail) {
            endsub = pathStr.length;
            startsub = pathStr.lastIndexOf('L');
            U.pe(startsub === -1, 'the pathString have no L (but should have at least 2 points)');
            startsub = pathStr.lastIndexOf('L', startsub - 1);
            if (startsub === -1) {
                startsub = 0;
            }
        }
        else {
            startsub = 0;
            endsub = pathStr.indexOf('L');
            U.pe(endsub === -1, 'the pathString have no L (but should have at least 2 points)');
            endsub = pathStr.indexOf('L', endsub + 1);
            if (endsub === -1) {
                endsub = pathStr.length;
            }
        }
        pathStr = pathStr.substring(startsub, endsub);
        U.pif(debug, 'pathStr: ' + oldPathStr + ' --> ' + pathStr, 'onEnd ? ', !tail);
        const points = U.parseSvgPath(pathStr).pts;
        U.pe(points.length !== 2, 'expected exactly 2 points, the pathStr got substringed for that.', points);
        if (!tail) {
            pt1 = points[1];
            pt2 = points[0];
        }
        else {
            pt1 = points[0];
            pt2 = points[1];
        }
        if (debug) {
            this.owner.markg(pt1, true, 'red');
            this.owner.markg(pt2, false, 'blue');
        }
        U.pif(debug, 'size of head: ', svg, 'pt1:', pt1, 'pt2:', pt2, ', pts:', points, pathStr, oldPathStr);
        this.appendTailHead2(tail, pt1, pt2);
    }
    appendTailHead2(tail, pt1, pt2real, debug = false) {
        const m = GraphPoint.getM(pt1, pt2real);
        const svg = tail ? this.edgeTail : this.edgeHead;
        let shell = tail ? this.tailShell : this.headShell;
        const HeadSize = U.getSvgSize(svg);
        const firstEdgePointHtml = this.html.nextElementSibling;
        if (!shell) {
            shell = U.newSvg('g');
            shell.appendChild(svg);
            if (tail) {
                this.tailShell = shell;
            }
            else {
                this.headShell = shell;
            }
            if (firstEdgePointHtml) {
                this.shell.insertBefore(shell, firstEdgePointHtml);
            }
            else {
                this.shell.appendChild(shell);
            }
            this.addEventListeners(false, true);
        }
        if (debug) {
            this.owner.markg(pt1, true, 'red');
            this.owner.markg(pt2real, false, 'green');
        }
        U.pif(debug, 'size of head: ', HeadSize, 'pt1:', pt1, 'pt2:', pt2real, 'm:', m);
        const degreeRad = pt1.degreeWith(pt2real, true); // U.TanToDegree(m);
        const center = new GraphPoint(0, 0);
        const pt2 = new GraphPoint(0, 0);
        //todo: perchè zindex e position?
        // svg.style.zIndex = '' + 100;
        // svg.style.position = 'absolute';
        pt2.x = pt1.x - HeadSize.w * Math.cos(degreeRad);
        pt2.y = pt1.y - HeadSize.h * Math.sin(degreeRad);
        center.x = (pt1.x + pt2.x) / 2;
        center.y = (pt1.y + pt2.y) / 2;
        const degree = U.RadToDegree(degreeRad) + 90; // uso riferimento con 0 = top invece di 0 = right
        if (debug) {
            this.owner.markg(pt2, false, 'blue');
        }
        shell.setAttributeNS(null, 'transform', 'rotate(' + degree + ' ' + center.x + ' ' + center.y + ')');
        (svg).setAttributeNS(null, 'x', '' + (center.x - HeadSize.w / 2));
        (svg).setAttributeNS(null, 'y', '' + (center.y - HeadSize.h / 2));
    }
    getIndex() { return this.logic.edges.indexOf(this); }
}
IEdge.selecteds = [];
IEdge.all = null;
IEdge.shadowWidthIncrease = 7;
IEdge.edgeChangingStopTime = Date.now();
IEdge.idToEdge = {};
IEdge.edgeCount = 0 || 0;
//# sourceMappingURL=iEdge.js.map