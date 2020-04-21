import { U, IEdge, IVertex, IModel, Status, Size, GraphPoint, GraphSize, PropertyBarr, ViewPoint, Point } from '../../common/Joiner';
export class ViewPointShell {
    constructor(g) {
        this.lastVP = null; // se ne sono attivi multipli e modifichi lo stile di qualcosa, questo sarà quello che viene aggiornato.
        this.getViewpointGUI = {};
        this.graph = g;
        this.model = g.model;
        this.$html = $(g.container.parentElement).find('.viewpointShell');
        this.html = this.$html[0];
        this.$template = this.$html.find('li.viewpointrow.template');
        this.template = this.$template[0];
        const $checkboxlidefault = this.$html.find('li.viewpointrow.default');
        const $defaultCheckbox = $checkboxlidefault.find('input[type="radio"]');
        this.defaultCheckbox = $defaultCheckbox[0];
        this.checkboxes = [];
        this.getViewpointGUI = {};
        let i;
        // this.ignoreEvents = false;
        $defaultCheckbox.on('click', (e) => { this.undoAll(true); });
        $checkboxlidefault.find('button.duplicate').on('click', (e) => this.duplicateEvent(e, null, this.defaultCheckbox));
    }
    /*undoAllOld(model :IModel): void {
      let i1: number;
      let i2: number;
      let i3: number;
      let i4: number;
      model.graph.gridDisplay = IGraph.defaultGridDisplay;
      model.graph.scroll = new GraphPoint(0, 0);
      model.graph.setZoom(IGraph.defaultZoom);
      model.graph.setGrid(IGraph.defaultGrid);
      const undostyle = (m: ModelPiece) => { m.resetViews(); };
      for (i1 = 0; i1 < model.childrens.length; i1++) {
        const pkg: IPackage = model.childrens[i1];
        undostyle(pkg);
        for (i2 = 0; i2 < pkg.childrens.length; i2++) {
          const c: IClass = pkg.childrens[i2];
          undostyle(c);
          c.shouldBeDisplayedAsEdge(false);
          for (i3 = 0; i3 < c.attributes.length; i3++) {
            const a: IAttribute = c.attributes[i3];
            undostyle(a); }
          for (i3 = 0; i3 < c.references.length; i3++) {
            const r: IReference = c.references[i3];
            undostyle(r); }
          const operations = c.getOperations();
          for (i3 = 0; i3 < operations.length; i3++) {
            const o: EOperation = operations[i3];
            undostyle(o);
            for (i4 = 0; i4 < o.childrens.length; i4++) {
              const p: EParameter = o.childrens[i4];
              undostyle(p); }
          }
        }
      }
      model.refreshGUI_Alone();
    }*/
    undoAll(changingGuiChecked) {
        let i;
        // de-apply all
        for (i = 0; i < this.model.viewpoints.length; i++) {
            this.model.viewpoints[i].detach();
        }
        // update gui
        this.ignoreEvents = true;
        if (changingGuiChecked) {
            for (i = 0; i < this.checkboxes.length; i++) {
                this.checkboxes[i].checked = false;
            }
            this.graph.model.refreshGUI_Alone();
        }
        const defaultradio = this.$html.find('input[type="radio"]')[0];
        defaultradio.checked = true;
        this.ignoreEvents = false;
    }
    refreshApplied() {
        // this.undoAll(false);
        let i;
        let stylecustomized = false;
        const makeSureAllCheckboxesAreProcessed = this.checkboxes.slice();
        for (i = this.model.viewpoints.length; --i >= 0;) {
            const vp = this.model.viewpoints[i];
            const checkbox = this.getCheckbox(vp);
            U.pe(!checkbox, 'failed to get checkbox of:', vp, this);
            U.arrayRemoveAll(makeSureAllCheckboxesAreProcessed, checkbox);
            stylecustomized = stylecustomized || checkbox.checked;
            if (vp.isApplied === checkbox.checked) {
                continue;
            }
            if (vp.isApplied) {
                vp.detach();
            }
            else {
                vp.apply();
            }
        } /*
        for (i = 0; i < makeSureAllCheckboxesAreProcessed.length; i++) {
          const cbox: HTMLInputElement = makeSureAllCheckboxesAreProcessed[i];
          const vp = ViewPoint.getbyID(+cbox.dataset.vpid);
          if (vp.isApplied === checkbox.checked) { continue; }
          if (vp.isApplied) { vp.detach(); } else { vp.apply(); }
        }*/
        U.pe(!!makeSureAllCheckboxesAreProcessed.length, 'Error: some checkbox are not yet processed.', makeSureAllCheckboxesAreProcessed, this);
        // U.pe(true, 'stopped here still works? 2');
        const defaultradio = this.$html.find('input[type="radio"]')[0];
        defaultradio.checked = !stylecustomized;
        this.updatelastvp();
        this.graph.model.refreshGUI_Alone();
        this.graph.propertyBar.refreshGUI();
    }
    duplicateEvent(e, oldvp, oldvpCheckbox, debug = false) {
        U.pif(debug, 'duplicate(' + (oldvp ? oldvp.name : null) + ') Start:', this.model.viewpoints);
        // const vp: ViewPoint = ViewPoint.get($input[0].value);
        let newvp = new ViewPoint(this.model, oldvp ? oldvp.name : null);
        if (oldvp) {
            newvp.clone(oldvp);
            newvp.updateTarget(this.model);
        }
        this.ignoreEvents = true;
        this.add(newvp, false);
        if (oldvpCheckbox) {
            oldvpCheckbox.checked = false;
        }
        this.ignoreEvents = false;
        this.refreshApplied();
        U.pif(debug, 'duplicate() End:', this.model.viewpoints);
    }
    add(v, allowApply) {
        const $li = this.$template.clone();
        const li = $li[0];
        const $checkbox = $li.find('input[type="checkbox"]');
        const checkbox = $checkbox[0];
        this.checkboxes.push(checkbox);
        this.getViewpointGUI[v.id] = li;
        const $input = $li.find('input.name');
        const input = $input[0];
        const $duplicate = $li.find('button.duplicate');
        const $delete = $li.find('button.remove');
        const $rename = $li.find('button.edit');
        $duplicate.on('click', (e) => this.duplicateEvent(e, v, checkbox));
        $delete.on('click', (e) => {
            this.html.removeChild(li);
            U.arrayRemoveAll(this.checkboxes, checkbox);
            delete this.getViewpointGUI[v.id];
            v.delete();
        });
        $rename.on('click', (e) => {
            input.readOnly = false;
            input.focus();
            //
            //
            // $rename.hide(); $delete.hide(); $duplicate.hide();
        });
        const inputConfirm = (confirm = true) => {
            if (confirm) {
                v.setname(input.name);
            }
            input.value = v.name;
            input.readOnly = true;
            // $rename.show();
            // $delete.show();
            // $duplicate.show();
        };
        $input.on('keydown', (e) => { if (e.key === 'return') {
            inputConfirm(true);
        }
        else if (e.key === 'escape') {
            inputConfirm(false);
        } });
        $input.on('blur', (e) => { inputConfirm(false); });
        $input.on('click', (e) => {
            // todo: se non lo fa già di suo: (per triggerare default.click() = this.undoAll();
            // if (input.readOnly) { this.undoAll(true); }
        });
        checkbox.dataset.vpid = '' + v.id;
        input.value = v.name;
        checkbox.checked = v.isApplied;
        $checkbox.on('change', (e) => {
            if (this.ignoreEvents) {
                e.preventDefault();
                return false;
            }
            this.refreshApplied();
            return true;
        });
        if (allowApply && v.isApplied) {
            $checkbox.trigger('change');
        }
        li.classList.remove('template');
        this.html.appendChild(li);
    }
    updatelastvp() {
        this.$html.find('li[islastvp]').removeAttr('islastvp');
        const vp = this.model.getLastView();
        console.log('updatelastvp() ', this.model.viewpoints, this.getViewpointGUI, this);
        if (!vp)
            return;
        this.lastVP = vp;
        const li = this.getViewpointGUI[vp.id];
        li.setAttribute('islastvp', 'true');
    }
    getCheckbox(vp) {
        let i;
        for (i = 0; i < this.checkboxes.length; i++) {
            const cbox = this.checkboxes[i];
            if (cbox.dataset.vpid === '' + vp.id)
                return cbox;
        }
        return null;
    }
}
var CursorAction;
(function (CursorAction) {
    CursorAction[CursorAction["drag"] = 0] = "drag";
    CursorAction[CursorAction["select"] = 1] = "select";
    CursorAction[CursorAction["multiselect"] = 2] = "multiselect";
})(CursorAction || (CursorAction = {}));
export class IGraph {
    constructor(model, container) {
        this.id = null;
        this.container = null;
        this.model = null;
        this.vertex = null;
        this.edges = null;
        this.scroll = null;
        this.propertyBar = null;
        this.zoom = null;
        this.grid = null;
        this.gridDisplay = false && false;
        // campi per robe di debug
        this.allMarkgp = [];
        U.pe(!container, 'graph container is null. model:', model);
        this.id = IGraph.ID++;
        IGraph.all[this.id + ''] = this;
        this.model = model;
        this.model.graph = this;
        this.container = container;
        this.container.dataset.graphID = '' + this.id;
        this.edgeContainer = U.newSvg('g');
        this.edgeContainer.classList.add('allEdgeContainer');
        this.vertexContainer = U.newSvg('g');
        this.vertexContainer.classList.add('allVertexContainer');
        this.container.appendChild(this.edgeContainer);
        this.container.appendChild(this.vertexContainer);
        this.gridDefsHtml = $(this.container).find('g.gridContainer>defs')[0];
        this.gridHtml = $(this.container).find('g.gridContainer>rect.grid')[0];
        this.gridHtml.setAttributeNS(null, 'fill', 'url(#grid_' + this.id + ')');
        this.isMoving = null;
        this.clickedScroll = null;
        this.cursorAction = CursorAction.select;
        // this.svg = $(this.container).find('svg.graph')[0] as unknown as SVGElement;
        this.vertex = [];
        this.edges = [];
        this.zoom = new Point(1, 1);
        this.scroll = new GraphPoint(0, 0);
        this.grid = new GraphPoint(20, 20);
        this.gridPos = new Point(0, 0);
        this.gridDisplay = true;
        let i;
        let j;
        const earr = this.model.getAllEnums();
        for (i = 0; i < earr.length; i++) {
            earr[i].generateVertex();
        }
        const classArr = this.model.getAllClasses();
        const classEdges = [];
        for (i = 0; i < classArr.length; i++) {
            if (classArr[i].shouldBeDisplayedAsEdge()) {
                classEdges.push(classArr[i]);
                continue;
            }
            classArr[i].generateVertex();
        }
        // vertex disegnati, ora disegno gli edges.
        // Class-extends-edges
        if (this.model.isM2()) {
            for (i = 0; i < classArr.length; i++) {
                const classe = classArr[i];
                for (j = 0; j < classe.extends.length; j++) {
                    U.ArrayAdd(this.edges, classe.makeExtendEdge(classe.extends[j]));
                }
            }
        }
        // Class-edges
        for (i = 0; i < classEdges.length; i++) {
            U.ArrayMerge(this.edges, classEdges[i].generateEdge());
        }
        // Reference-edges
        const arrReferences = this.model.getAllReferences();
        for (i = 0; i < arrReferences.length; i++) {
            U.ArrayMerge(this.edges, arrReferences[i].generateEdges());
        }
        this.propertyBar = new PropertyBarr(this.model);
        this.viewPointShell = new ViewPointShell(this);
        this.addGraphEventListeners();
        this.setGrid0();
    }
    static getByID(id) { return IGraph.all[id]; }
    static getByHtml(html) {
        for (const id in IGraph.all) {
            if (!IGraph.all.hasOwnProperty(id)) {
                continue;
            }
            const graph = IGraph.all[id];
            if (U.isParentOf(graph.container, html)) {
                return graph;
            }
        }
        U.pe(true, 'failed to find parent graph of:', html);
        return null;
    }
    fitToGrid(pt0, clone = true, debug = false, fitHorizontal = true, fitVertical = true) {
        const pt = clone ? pt0.duplicate() : pt0;
        U.pe(!this.grid, 'grid not initialized.');
        if (fitHorizontal && !isNaN(this.grid.x) && this.grid.x > 0) {
            pt.x = Math.round(pt.x / this.grid.x) * this.grid.x;
        }
        if (fitVertical && !isNaN(this.grid.y) && this.grid.y > 0) {
            pt.y = Math.round(pt.y / this.grid.y) * this.grid.y;
        }
        U.pif(debug, 'fitToGrid(', pt0, '); this.grid:', this.grid, ' = ', pt);
        return pt;
    }
    fitToGridS(pt0, clone = true, debug = false, fitHorizontal = true, fitVertical = true) {
        const pt = clone ? pt0.duplicate() : pt0;
        U.pe(!this.grid, 'grid not initialized.');
        if (fitHorizontal && !isNaN(this.grid.x) && this.grid.x > 0) {
            pt.x = Math.round(pt.x / this.grid.x) * this.grid.x;
        }
        if (fitVertical && !isNaN(this.grid.y) && this.grid.y > 0) {
            pt.y = Math.round(pt.y / this.grid.y) * this.grid.y;
        }
        U.pif(debug, 'fitToGrid(', pt0, '); this.grid:', this.grid, ' = ', pt);
        return pt;
    }
    addGraphEventListeners() {
        const $graph = $(this.container);
        const thiss = this;
        this.model.linkToLogic(this.container);
        // $graph.off('mousedown.graph').on('mousedown.graph', (evt: MouseDownEvent) => { thiss.onMouseDown(evt); });
        // $graph.off('mouseup.graph').on('mouseup.graph', (evt: MouseUpEvent) => { thiss.onMouseUp(evt); });
        $graph.off('mousemove.graph').on('mousemove.graph', (evt) => { this.onMouseMove(evt); });
        // $graph.off('keydown.graph').on('keydown.graph', (evt: KeyDownEvent) => { thiss.onKeyDown(evt); }); non triggerabile, non ha focus.
        // $graph.off('click.mark').on('click.mark', (e: ClickEvent) => { thiss.markClick(e, true); } );
        $graph.off('mousedown.move').on('mousedown.move', (e) => this.onMouseDown(e, false));
        $graph.off('mouseup.move').on('mouseup.move', (e) => this.onMouseUp(e));
        // @ts-ignore
        if (!!ResizeObserver) { // not supported by edge, android firefox.
            if (!window['' + 'resizeobservers'])
                window['' + 'resizeobservers'] = [];
            // @ts-ignore
            const tmp = new ResizeObserver((entryes, observer) => { this.onResize(); });
            window['' + 'resizeobservers'] = tmp;
            tmp.observe(this.container.parentElement);
        }
        // @ts-ignore
        if (!ResizeObserver) {
            let oldSize = null;
            setInterval(() => {
                U.pif(true, 'setinterval graphsize checker');
                const size = this.getSize();
                if (!size.equals(oldSize))
                    this.onResize(size);
            }, 100);
        }
        // altre opzioni:
        // 1) MutationObserver (detect dom changes (attributes like "style" too)),
        // 2) http://marcj.github.io/css-element-queries/ : sembra simile a mutationObserver, no timers, funziona su flexbox che non cambiano
        // direttamente valori. non ho capito perchè parsa tutti i file css.
        // 3) "Use a combination of mousedown, mousemove and/or mouseup to tell whether the div is being / has been resized.
        // If you want really fine-grained control you can check in every mousemove event how much / if the div has been resized. If you don't need that,
        // you can simply not use mousemove at all and just measure the div in mousedown and mouseup and figure out if it was resized in the latter."
        // PROBLEMA: potrebbe avvenire un resize dovuto a serverEvents, keyboardEvents, timers.
    }
    onMouseDown(evt, isTrigger) {
        // console.log('graphONMouseDown', evt);
        isTrigger = isTrigger || !evt || evt['' + 'isTrigger'] || !evt.originalEvent;
        switch (this.cursorAction) {
            default:
                U.pe(true, 'unexpected cursorAction:', this.cursorAction);
                break;
            case CursorAction.drag:
            case CursorAction.select:
                const mp = isTrigger ? null : IVertex.ChangePropertyBarContentClick(evt);
                // console.log('graphONMouseDown', isTrigger, mp instanceof IModel);
                if (!(isTrigger || (mp instanceof IModel)))
                    return;
                this.isMoving = Point.fromEvent(evt);
                this.clickedScroll = this.scroll.duplicate();
                break;
            case CursorAction.multiselect: break;
        }
    }
    onMouseUp(evt) {
        if (this.isMoving) {
            this.isMoving = this.clickedScroll = null;
        }
    }
    onMouseMoveSetReference(evt, edge) {
        // console.log('graph.movereference()', edge, edge ? edge.tmpEndVertex : null);
        if (!edge || edge.tmpEndVertex) {
            return;
        }
        // const ref: IReference | IClass = edge.logic;
        edge.tmpEnd = GraphPoint.fromEvent(evt);
        U.pe(!edge.tmpEnd, 'failed to get coordinates from event:', evt);
        // console.log('graph.movereference: success!', edge.tmpEnd);
        edge.refreshGui(null, false);
    }
    onMouseMoveVertexMove(evt, v) {
        if (!v) {
            return;
        }
        // if (U.vertexOldPos === 1) U.vertexOldPos = 2;
        console.log('onMouseMoveVertexMove:', evt, v);
        const currentMousePos = new Point(evt.pageX, evt.pageY);
        // console.log('evt:', evt);
        let currentGraphCoord = this.toGraphCoord(currentMousePos);
        currentGraphCoord = currentGraphCoord.subtract(IVertex.selectedStartPt, false);
        v.moveTo(currentGraphCoord);
    }
    onMouseMoveDrag(e) {
        if (!this.isMoving)
            return;
        const offset = Point.fromEvent(e);
        offset.subtract(this.isMoving, false);
        this.scroll.x = this.clickedScroll.x - offset.x;
        this.scroll.y = this.clickedScroll.y - offset.y;
        this.setGridPos();
        // console.log('scroll:', this.scroll, 'offset:', offset, ' scroll0: ', this.clickedScroll, ' currentCursor:', this.isMoving);
        this.updateViewbox();
    }
    onMouseMove(evt) {
        if (IEdge.edgeChanging)
            return this.onMouseMoveSetReference(evt, IEdge.edgeChanging);
        if (IVertex.selected)
            return this.onMouseMoveVertexMove(evt, IVertex.selected);
        if (this.isMoving)
            return this.onMouseMoveDrag(evt);
    }
    edgeChangingAbort(e) {
        const edge = IEdge.edgeChanging;
        if (!edge) {
            return;
        }
        IEdge.edgeChanging = null;
        // unmark hovering vertex
        const hoveringVertex = IVertex.GetMarkedWith('refhover');
        let i;
        U.pw(hoveringVertex.length > 1, 'hovering on more than one target at the same time should be impossible.', hoveringVertex);
        for (i = 0; i < hoveringVertex.length; i++) {
            hoveringVertex[i].mark(false, 'refhover');
        }
        // restore previous endTarget or delete edge.
        console.log('edgeChange abort');
        if (!edge.end) {
            edge.remove();
            return;
        }
        edge.useMidNodes = true;
        edge.useRealEndVertex = true;
        edge.tmpEnd = null;
        edge.refreshGui();
        edge.refreshGui();
    }
    toGraphCoordS(s) {
        const tl = this.toGraphCoord(new Point(s.x, s.y));
        const br = this.toGraphCoord(new Point(s.x + s.w, s.y + s.h));
        const ret = new GraphSize(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        return ret;
    }
    computeSize() { this.size = U.sizeof(this.container); }
    getSize() {
        if (!this.size)
            this.computeSize();
        return this.size;
    }
    toGraphCoord(p) {
        const graphSize = this.getSize();
        const ret = new GraphPoint(p.x, p.y);
        const debug = true;
        ret.x -= graphSize.x;
        ret.y -= graphSize.y;
        ret.x += this.scroll.x;
        ret.y += this.scroll.y;
        ret.x /= this.zoom.x;
        ret.y /= this.zoom.y;
        // console.log('toGraph()  - graphSize:', graphSize, ' + scroll: ', this.scroll, ' / zoom', this.zoom);
        if (debug) {
            const ver = this.toHtmlCoord(ret);
            U.pe(ver.x !== p.x || ver.y !== p.y, 'error in toGraphCoord or toHtmlCoord: inputPt:', p, ', result: ', ret, 'verify:', ver, 'point:', p, 'scroll:', this.scroll, 'zoom:', this.zoom, 'GraphHtmlSize:', graphSize);
        }
        return ret;
    }
    toHtmlCoordS(s) {
        if (s === null) {
            return null;
        }
        const tl = this.toHtmlCoord(new GraphPoint(s.x, s.y));
        const br = this.toHtmlCoord(new GraphPoint(s.x + s.w, s.y + s.h));
        return new Size(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    }
    toHtmlCoord(p) {
        const graphSize = this.getSize();
        const ret = new Point(p.x, p.y);
        // console.log('toHtml()', ' * zoom', this.zoom, ' - scroll: ', this.scroll, ' + graphSize:', graphSize);
        ret.x *= this.zoom.x;
        ret.y *= this.zoom.y;
        ret.x -= this.scroll.x;
        ret.y -= this.scroll.y;
        ret.x += graphSize.x;
        ret.y += graphSize.y;
        return ret;
    }
    getAllVertexIsBroke() { return this.vertex; }
    markClick(e, clean = true) { return this.mark(new Point(e.pageX, e.pageY), clean); }
    markg(gp, clean = false, colorTop = 'red') {
        return this.mark(this.toHtmlCoord(gp), clean, colorTop);
    }
    markgS(gs, clean = false, colorTop = 'red', colorBot = null) {
        /*if (!colorBot) { colorBot = colorTop; }
        this.markg(gs.tl(), clean, colorTop);
        this.markg(gs.tr(), false, colorTop);
        this.markg(gs.bl(), false, colorBot);
        this.markg(gs.br(), false, colorBot);*/
        // const htmls: Size = this.owner.toHtmlCoordS(size0);
        return this.markS(this.toHtmlCoordS(gs), clean, colorTop, colorBot);
    }
    markS(s, clean = false, colorTop = 'red', colorBot = null) {
        if (!colorBot) {
            colorBot = colorTop;
        }
        U.pe(!s, 'size cannot be null.');
        this.mark(s.tl(), clean, colorTop);
        // color = 'white';
        this.mark(s.tr(), false, colorTop);
        // color = 'purple';
        this.mark(s.bl(), false, colorBot);
        // color = 'orange';
        this.mark(s.br(), false, colorBot);
    }
    mark(p, clean = false, color = 'red') {
        const gp = this.toGraphCoord(p);
        if (clean) {
            let i;
            for (i = 0; i < this.allMarkgp.length; i++) {
                const node = this.allMarkgp[i];
                if (this.container.contains(node)) {
                    this.container.removeChild(node);
                }
            }
            for (i = 0; i < IGraph.allMarkp.length; i++) {
                const node = IGraph.allMarkp[i];
                if (document.body.contains(node)) {
                    document.body.removeChild(node);
                }
            }
        }
        // console.log('mark:', p, gp);
        this.markp = U.toHtml('<div style="width:10px; height:10px; top:' + (p.y - 5) + 'px; left:' + (p.x - 5) + 'px;' +
            ' position: absolute; border: 1px solid ' + color + '; z-index:1;">');
        this.markgp = U.newSvg('circle');
        this.markgp.setAttribute('cx', '' + gp.x);
        this.markgp.setAttribute('cy', '' + gp.y);
        this.markgp.setAttribute('r', '' + 1);
        this.markgp.setAttribute('stroke', color);
        this.allMarkgp.push(this.markgp);
        IGraph.allMarkp.push(this.markp);
        document.body.appendChild(this.markp);
        this.container.appendChild(this.markgp);
    }
    setGrid(x, y) {
        this.grid.x = x;
        this.grid.y = y;
        this.setGrid0();
    }
    setScroll(x, y) {
        this.scroll.x = x;
        this.scroll.y = y;
        this.setGrid0();
        this.updateViewbox();
    }
    setZoom(x, y) {
        const oldZoom = this.zoom.duplicate();
        y = x;
        this.zoom.x = !U.isNumber(x) || x === 0 ? this.zoom.x : +x;
        this.zoom.y = !U.isNumber(y) || y === 0 ? this.zoom.y : +y;
        console.log('zoomOld:', oldZoom, 'x:', x, 'y:', y, ' zoom:', this.zoom);
        this.updateViewbox();
    }
    onResize(currSize = null) {
        if (currSize)
            this.size = currSize;
        else
            this.computeSize();
        this.updateViewbox();
    }
    updateViewbox() {
        const vbox = U.getViewBox(this.container);
        vbox.w = this.size.w / this.zoom.x;
        vbox.h = this.size.h / this.zoom.y;
        vbox.x = this.scroll.x;
        vbox.y = this.scroll.y;
        U.setViewBox(this.container, vbox);
    }
    setGridPos() {
        const biggerSquareX = this.grid.x * 10;
        const biggerSquareY = this.grid.y * 10;
        const safetySquares = 1;
        this.gridHtml.setAttributeNS(null, 'x', '' + ((this.scroll.x - this.scroll.x % biggerSquareX) - biggerSquareX * safetySquares));
        this.gridHtml.setAttributeNS(null, 'y', '' + ((this.scroll.y - this.scroll.y % biggerSquareY) - biggerSquareY * safetySquares));
        const size = new Size(0, 0, window.screen.width, window.screen.height);
        size.w = Math.max(size.w, window.outerWidth);
        size.h = Math.max(size.h, window.outerHeight);
        this.gridHtml.setAttributeNS(null, 'width', ((size.w + biggerSquareX * safetySquares * 2) / this.zoom.x) + '');
        this.gridHtml.setAttributeNS(null, 'height', ((size.h + biggerSquareY * safetySquares * 2) / this.zoom.y) + '');
    }
    setGrid0(checked = null) {
        const graph = (this.model === Status.status.mm ? Status.status.mm.graph : Status.status.m.graph);
        if (checked === null) {
            checked = graph.gridDisplay;
        }
        graph.gridDisplay = checked;
        const maxSquareSize = 10000; // Number.MAX_SAFE_INTEGER sarebbe meglio maxint, ma temo per il consumo di memoria.
        const x = isNaN(this.grid.x) || this.grid.x <= 0 ? maxSquareSize : this.grid.x; // if the size of squares in grid is zero or negative, i just use a big number.
        const y = isNaN(this.grid.y) || this.grid.y <= 0 ? maxSquareSize : this.grid.y;
        this.gridDefsHtml.innerHTML =
            '<pattern id="smallGrid_' + this.id + '" width="' + x + '" height="' + y + '" patternUnits="userSpaceOnUse">\n' +
                '  <path d="M ' + x + ' 0 L 0 0 0 ' + y + '" fill="none" stroke="gray" stroke-width="0.5"/>\n' +
                '</pattern>\n' +
                '<pattern id="grid_' + this.id + '" width="' + (x * 10) + '" height="' + (y * 10) + '" patternUnits="userSpaceOnUse">\n' +
                '  <rect width="' + (x * 10) + '" height="' + (y * 10) + '" fill="url(#smallGrid_' + this.id + ')"/>\n' +
                '  <path d="M ' + (x * 10) + ' 0 L 0 0 0 ' + (y * 10) + '" fill="none" stroke="gray" stroke-width="1"/>\n' +
                '</pattern>';
        this.setGridPos();
        // $grid[0].setAttributeNS(null, 'justForRefreshingIt', 'true');
        // $grid.x
        if (checked) {
            $(this.gridHtml).show();
        }
        else {
            $(this.gridHtml).hide();
        }
    }
    addVertex(v) {
        v.owner = this;
        U.ArrayAdd(this.vertex, v);
        // todo: aggiungi edges tra i vertici. in matrix edgeMatrix[vertex][vertex] = edge
    }
}
// todo: this.vertex non è mai aggiornato reealmente.
IGraph.all = {};
IGraph.ID = 0;
IGraph.allMarkp = []; // campo per robe di debug
IGraph.defaultGridDisplay = true;
IGraph.defaultGrid = new GraphPoint(20, 20);
IGraph.defaultZoom = new Point(1, 1);
//# sourceMappingURL=iGraph.js.map