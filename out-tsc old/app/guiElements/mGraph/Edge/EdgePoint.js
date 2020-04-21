import { IEdge, GraphPoint, IVertex, Point, Status, U } from '../../../common/Joiner';
export class EdgePointFittizio {
    constructor(pos, realPoint = null) {
        this.pos = null;
        this.realPoint = null;
        this.pos = pos;
        this.realPoint = realPoint;
    }
    link(realPoint) { this.realPoint = realPoint; }
    getPreviousRealPt(fittizi, includeMySelf = true) {
        let index = fittizi.indexOf(this);
        U.pe(index < 0, 'the element must be inside the array. this:', this, ', arr:', fittizi, ', index:', index);
        index += (includeMySelf ? 1 : 0);
        while (--index >= 0) {
            if (fittizi[index].realPoint) {
                return fittizi[index].realPoint;
            }
        }
        return null;
    }
    getNextRealPt(fittizi, includeMySelf = true, debug = false) {
        let index = fittizi.indexOf(this);
        U.pe(index < 0, 'the element must be inside the array');
        index -= (includeMySelf ? 1 : 0);
        while (++index < fittizi.length) {
            U.pif(debug, index + '/' + fittizi.length + ']', fittizi[index], 'fittiziAll:', fittizi);
            if (fittizi[index].realPoint) {
                return fittizi[index].realPoint;
            }
        }
        return null;
    }
}
export class EdgePoint {
    constructor(e, pos, endPointOfVertex = null) {
        this.id = null;
        this.pos = null;
        this.html = null;
        this.edge = null;
        this.endPointOfVertex = null;
        this.isSelected = null;
        this.isHighlighted = null;
        this.edge = e;
        this.endPointOfVertex = endPointOfVertex;
        // edge = null is ok, è il cursorfollower statico.
        U.pe(this.edge === undefined, 'edge === undefined on EdgePoint constructor.');
        this.html = U.newSvg('circle');
        this.id = EdgePoint.ID++;
        if (e) {
            e.logic.linkToLogic(this.html);
        }
        EdgePoint.all[this.id] = this;
        this.html.dataset.EdgePointID = '' + this.id;
        this.pos = new GraphPoint(0, 0);
        this.isSelected = false;
        this.isHighlighted = false;
        this.refreshGUI();
        this.moveTo(pos, false);
        this.addEventListeners();
    }
    static getFromHtml(html) { return EdgePoint.all[html.dataset.EdgePointID]; }
    follow(e = null) {
        CursorFollowerEP.activeEP = this;
        const edge = this.edge;
        if (this !== CursorFollowerEP.cursorFollower && this === edge.endNode) {
            CursorFollowerEP.activeEP = null;
            IVertex.linkVertexMouseDown(e, edge);
        }
    }
    unfollow() {
        console.log('un-follow');
        CursorFollowerEP.activeEP = null;
    }
    addEventListeners() {
        const $html = $(this.html);
        // $html.off('click.ep').on('click.ep', (e: ClickEvent) => { EdgePoint.getFromHtml(e.currentTarget).onClick(e); });
        $html.off('mousedown.ep').on('mousedown.ep', (e) => { EdgePoint.getFromHtml(e.currentTarget).onMouseDown(e); });
        // $html.off('mousemove.ep').on('mousemove.ep', (e: MouseMoveEvent) => { EdgePoint.getFromHtml(e.currentTarget).onMouseMove(e); });
        $html.off('mouseup.ep').on('mouseup.ep', (e) => { EdgePoint.getFromHtml(e.currentTarget).onMouseUp(e); });
        $html.off('mouseenter.ep').on('mouseenter.ep', (e) => { EdgePoint.getFromHtml(e.currentTarget).onMouseEnter(e); });
        $html.off('mouseleave.ep').on('mouseleave.ep', (ee) => { EdgePoint.getFromHtml(ee.currentTarget).onMouseLeave(ee); });
        // $html.off('mouseover.ep').on('mouseover.ep', (e: MouseLeaveEvent) => { EdgePoint.getFromHtml(e.currentTarget).onMouseOver(e); });
        $html.off('contextmenu.deleteEdgePoint').on('contextmenu.deleteEdgePoint', (e) => { this.detach(); return false; });
    }
    isAttached() { return this.edge !== null; }
    detach(refreshGUI = true) {
        if (!this.isAttached()) {
            return;
        }
        U.arrayRemoveAll(this.edge.midNodes, this);
        if (this.html && this.html.parentNode) {
            this.html.parentNode.removeChild(this.html);
        }
        if (refreshGUI) {
            this.edge.refreshGui();
        }
        this.edge = null;
        this.unfollow();
    }
    onClick(e) { }
    onMouseEnter(e) {
        // console.log('enter');
        this.refreshGUI(null, true);
    }
    onMouseLeave(e) {
        // console.log('leave');
        // if (this.isMoving) { this.onMouseMove(e); }
        this.refreshGUI(null, false);
    }
    onMouseDown(e) {
        this.refreshGUI(true);
        // console.log('leave');
        this.follow(e);
        e.preventDefault();
        e.stopPropagation();
    }
    // onMouseOver(e: MouseOverEvent): void { e.preventDefault(); e.stopPropagation(); }
    /* onMouseMoveOld(e: MouseMoveEvent | MouseLeaveEvent): void {
      if (!this.isMoving) { return; }
      const screenPt: Point = new Point(e.pageX, e.pageY);
      const graphPt: GraphPoint = this.edge.owner.toGraphCoord(screenPt);
      this.moveTo(graphPt, true); }*/
    onMouseUp(e) {
        this.refreshGUI(false);
        e.stopPropagation();
        // console.log('up');
        this.unfollow();
    }
    getCenter(fitHorizontal = false, fitVertical = false) {
        if (IEdge.edgeChanging)
            return this.pos.duplicate();
        return this.edge.owner.fitToGrid(this.pos, true, false, fitHorizontal, fitVertical);
    }
    getStartPoint(fitHorizontal = true, fitVertical = true) {
        return this.getCenter(fitHorizontal, fitVertical);
    }
    getEndPoint(fitHorizontal = true, fitVertical = true) {
        return this.getCenter(fitHorizontal, fitVertical);
    }
    moveTo(pos, refresh, centra = true) {
        if (!this.edge) {
            return;
        }
        const r = centra ? 0 : (isNaN(-this.html.r) ? 0 : -this.html.r);
        U.pe(!this.pos || this.pos.x === null || this.pos.x === undefined, 'this.pos.x undefined', this.pos);
        U.pe(!pos || pos.x === null || pos.x === undefined, 'pos.x undefined', pos);
        this.pos.x = (pos.x + r);
        this.pos.y = (pos.y + r);
        this.html.setAttribute('cx', '' + this.pos.x);
        this.html.setAttribute('cy', '' + this.pos.y);
        this.show();
        if (refresh) {
            this.edge.refreshGui();
        }
    }
    show(debug = false) {
        const oldParent = this.html.parentElement;
        if (oldParent) {
            oldParent.removeChild(this.html);
        }
        this.edge.shell.appendChild(this.html);
        this.html.style.display = 'block';
        this.refreshGUI(null, null, debug);
    }
    hide() { this.html.style.display = 'none'; }
    refreshGUI(select = null, highlight = null, debug = false) {
        if (select !== null) {
            this.isSelected = select;
        }
        if (highlight !== null) {
            this.isHighlighted = highlight;
        }
        if (this.isSelected) {
            this.styleSelected();
        }
        else if (this.isHighlighted) {
            this.styleHighlight();
        }
        else {
            this.styleCommon(debug);
        }
    }
    styleCommon(debug = false) {
        if (!this.isAttached()) {
            U.pw(debug, 'not attached', this);
            return;
        }
        const eps = this.edge.logic.edgeStyleCommon.edgePointStyle;
        if (debug) {
            this.html.setAttributeNS(null, 'debug', 'styleCommon');
        }
        this.html.setAttributeNS(null, 'r', '' + eps.radius);
        this.html.setAttributeNS(null, 'stroke-width', '' + eps.strokeWidth);
        this.html.setAttributeNS(null, 'stroke', eps.strokeColor);
        this.html.setAttributeNS(null, 'fill', eps.fillColor);
    }
    styleHighlight() {
        if (!this.isAttached()) {
            return;
        }
        const eps = this.edge.logic.edgeStyleHighlight.edgePointStyle;
        this.html.setAttributeNS(null, 'r', '' + eps.radius);
        this.html.setAttributeNS(null, 'stroke-width', '' + eps.strokeWidth);
        this.html.setAttributeNS(null, 'stroke', eps.strokeColor);
        this.html.setAttributeNS(null, 'fill', eps.fillColor);
    }
    styleSelected() {
        if (!this.isAttached()) {
            return;
        }
        const eps = this.edge.logic.edgeStyleSelected.edgePointStyle;
        this.html.setAttributeNS(null, 'r', '' + eps.radius);
        this.html.setAttributeNS(null, 'stroke-width', '' + eps.strokeWidth);
        this.html.setAttributeNS(null, 'stroke', eps.strokeColor);
        this.html.setAttributeNS(null, 'fill', eps.fillColor);
    }
}
EdgePoint.ID = 0;
EdgePoint.all = {};
export class CursorFollowerEP extends EdgePoint {
    constructor() {
        super(null, new GraphPoint(0, 0));
        this.endPointOfVertex = undefined;
        this.html.setAttributeNS(null, 'fill', 'purple');
        this.html.setAttributeNS(null, 'stroke', 'purple');
        this.html.setAttributeNS(null, 'r', '5');
        U.eventiDaAggiungereAlBody('cursor follower');
        const $b = $(document.body);
        $b.off('mousemove.cursorFollowerEdgePoint_Move').on('mousemove.cursorFollowerEdgePoint_Move', (e) => {
            const debug = false && false;
            U.pif(debug, 'mousemove.cursorFollowerEdgePoint_Move()');
            const f = CursorFollowerEP.activeEP;
            if (!f || !f.isAttached()) {
                return;
            }
            const graph = Status.status.getActiveModel().graph;
            f.moveTo(graph.toGraphCoord(new Point(e.pageX, e.pageY)), true);
            f.edge.refreshGui(true);
            /// here bug edge
        });
        $b.off('click.cursorFollowerEdgePoint_Detach').on('click.cursorFollowerEdgePoint_Detach', (e) => {
            const f = CursorFollowerEP.get();
            f.detach();
        });
        this.addEventListeners();
    }
    static get() {
        if (!this.cursorFollower) {
            this.cursorFollower = new CursorFollowerEP();
        }
        return this.cursorFollower;
    }
    /*
      cursorFollowerClick(e: ClickEvent) {
        const coord: GraphPoint = this.getCenter();
        this.detach();
        const useless = new EdgePoint(this.edge, coord);
        this.attach(this.edge, null);
      }*/
    onMouseUp(e) { if (this.isAttached()) {
        this.edge.onMouseUp(e);
    } }
    moveTo(pos, refresh, centra = true) {
        super.moveTo(pos, refresh, centra);
        if (!this.isAttached()) {
            return;
        }
        if (refresh) {
            this.edge.refreshGui();
        }
    }
    isAttached() { return this.edge !== null; }
    attach(edge, position, index = Number.POSITIVE_INFINITY) {
        this.detach();
        edge.logic.linkToLogic(this.html);
        this.graph = edge.owner;
        if (index < 0) {
            index = -1;
        }
        if (index === null || index === Number.POSITIVE_INFINITY) {
            index = this.edge.midNodes.length;
        }
        // console.log('CursorFollower.Attach()');
        this.edge = edge;
        this.html.dataset.modelPieceID = '' + this.edge.logic.id;
        U.insertAt(this.edge.midNodes, index + 1, this);
        if (position) {
            this.moveTo(position, false);
        }
        this.graph.container.appendChild(this.html);
        this.follow();
        this.refreshGUI(true);
    }
    addEventListeners() {
        super.addEventListeners();
        /*$(this.html).off('click.makeEdgePoint').on('click.makeEdgePoint',
          (e: ClickEvent) => { CursorFollowerEP.cursorFollower.cursorFollowerClick(e); });*/
        $(this.html).off('mouseup.makeEdgePoint').on('mouseup.makeEdgePoint', (e) => { CursorFollowerEP.get().onMouseUp(e); });
    }
}
CursorFollowerEP.cursorFollower = null;
CursorFollowerEP.activeEP = null;
//# sourceMappingURL=EdgePoint.js.map