import { U, IEdge, M2Class, ModelPiece, IClass, Point, DamContextMenuComponent, Status, IReference, MClass, MReference, M2Reference, GraphSize, GraphPoint, Type, EEnum, ExtEdge, IClassifier, Measurable, measurableRules, MeasurableRuleParts } from '../../../common/Joiner';
export class IVertex {
    constructor(logical, size = null) {
        this.fields = [];
        this.edgesStart = [];
        this.edgesEnd = [];
        this.Vmarks = {};
        this.id = IVertex.ID++;
        IVertex.all[this.id] = this;
        const graph = logical.getModelRoot().graph;
        this.logic(logical);
        if (graph) {
            graph.addVertex(this);
        }
        this.contains = [];
        this.fields = [];
        this.edgesStart = [];
        this.edgesEnd = [];
        this.classe = logical;
        this.classe.vertex = this;
        this.setGraph(logical.getModelRoot().graph);
        if (!size) {
            size = IVertex.defaultSize;
            const gsize = this.owner.getSize();
            size.x = this.owner.scroll.x + (gsize.w - size.w) / 2;
            size.y = this.owner.scroll.y + (gsize.h - size.h) / 2;
        }
        this.size = size;
        this.refreshGUI();
        // this.refreshGUI(); // need both refresh
    }
    static staticinit() {
        const g = new GraphPoint(0, 0);
        g.x = 'prevent_doublemousedowncheck';
        g.y = 'prevent_doublemousedowncheck';
        IVertex.minSize = new GraphSize(null, null, 0, 0);
        IVertex.defaultSize = new GraphSize(5, 5, 201, 41);
        return IVertex.selectedGridWasOn = g;
    }
    /*
      static linkVertexMouseDownButton(e: MouseDownEvent): void {
        const ref: IReference = ModelPiece.get(e) as IReference;
        U.pe(!(ref instanceof IReference), 'linkVertexButtons are currently only allowed on IReferences.');
        const edges: IEdge[] = ref.getEdges();
        U.pe(!edges, 'ref.edges === null', ref);
        let edge: IEdge;
        let index: number;
        if (ref.getModelRoot().isMM()) { edge = edges[index = 0]; } else
        if (ref.upperbound > 0 && edges.length >= ref.upperbound) { edge = edges[index = ref.upperbound - 1]; }
        else { edge = new IEdge(ref); index = edges.length - 1; }
        if (!edge) edge = new IEdge(ref);
        IVertex.linkVertexMouseDown(e, edge); }*/
    static linkVertexMouseDown(e, edge = null, location = null) {
        if (e) {
            e.stopPropagation();
        }
        if (IEdge.edgeChanging) {
            IEdge.edgeChanging.owner.edgeChangingAbort(e);
        }
        edge = edge ? edge : IEdge.get(e);
        U.pe(!edge, 'IVertex.linkVertexMouseDown() failed to get edge:', e);
        const logic = edge.logic;
        const classe = logic instanceof IClass ? logic : null;
        const ref = logic instanceof IReference ? logic : null;
        // U.pe( !ref, 'The .LinkVertex element must be inserted only inside a reference field.');
        IEdge.edgeChanging = edge;
        edge.useRealEndVertex = false;
        edge.useMidNodes = true;
        edge.tmpEnd = location ? location : GraphPoint.fromEvent(e);
        U.pe(!edge.tmpEnd, 'failed to get coordinates from event:', e);
        edge.tmpEndVertex = null;
        // edge.tmpEndVertex = ref.parent.getVertex();
        edge.refreshGui();
    }
    static getvertex(e) {
        return IVertex.getvertexByHtml(e.currentTarget);
    }
    static getvertexByHtml(node0) {
        let node = node0;
        U.pe(!node, 'getVertexByHtml: parameter is not a DOM node:', node);
        while (node && node.dataset && !node.dataset.vertexID) {
            node = node.parentElement;
        }
        // console.log('getVertex by id:' + node.dataset.vertexID, 'all:', IVertex.all);
        return node && node.dataset ? IVertex.getByID(+(node.dataset.vertexID)) : null;
    }
    static getByID(id) { return IVertex.all[id]; }
    static FieldNameChanged(e) {
        const html = e.currentTarget;
        const modelPiece = ModelPiece.getLogic(html);
        modelPiece.fieldChanged(e);
        modelPiece.getModelRoot().graph.propertyBar.show(null, html, null, true);
        // $(html).trigger('click'); // updates the propertyBar
        // const m: IModel = modelPiece.getModelRoot();
        const mm = Status.status.mm;
        const m = Status.status.m;
        setTimeout(() => { mm.refreshGUI(); m.refreshGUI(); }, 1);
    }
    static ChangePropertyBarContentClick(e, isEdge = null) {
        const html = e.target; // todo: approfondisci i vari tipi di classType (current, orginal...)
        const modelPiece = ModelPiece.getLogic(html);
        const model = modelPiece.getModelRoot();
        U.pe(!modelPiece, 'failed to get modelPiece from html:', html);
        const pbar = model.graph.propertyBar;
        pbar.show(modelPiece, html, isEdge, false);
        return modelPiece;
    }
    static GetMarkedWith(markKey, colorFilter = null) {
        const ret = [];
        for (const id in IVertex.all) {
            if (!IVertex.all[id]) {
                continue;
            }
            const vertex = IVertex.all[id];
            if (vertex.isMarkedWith('refhover', colorFilter)) {
                ret.push(vertex);
            }
        }
        return ret;
    }
    mark(markb, key, color = 'red', radiusX = 10, radiusY = 10, width = 5, backColor = 'none', extraOffset = null) {
        if (!this.isDrawn()) {
            return;
        }
        if (color === null) {
            color = 'yellow';
        }
        if (radiusX === null) {
            radiusX = 10;
        }
        if (radiusY === null) {
            radiusY = 10;
        }
        if (backColor === null) {
            backColor = 'none';
        }
        if (width === null) {
            width = 5;
        }
        let mark = this.Vmarks[key];
        if (key === 'refhover') { // crosshair (+), alias (default+link), cell (excel)
            const vertexRoot = this.htmlForeign;
            const $inputs = $(vertexRoot).find('input, textarea, select, button');
            let cursor = null;
            console.log('markedHover', markb, vertexRoot, $inputs);
            if (markb) {
                vertexRoot.style.cursor = cursor = (color === 'red' ? 'no-drop' : 'crosshair'); // NO important, bugga e non setta il campo.
            }
            else {
                vertexRoot.style.removeProperty('cursor');
            }
            let i;
            for (i = 0; i < $inputs.length; i++) {
                if (!cursor) {
                    $inputs[i].style.removeProperty('cursor');
                }
                else {
                    $inputs[i].style.cursor = cursor;
                }
            }
        }
        // mark off
        if (!markb) { // se non deve essere marchiato
            if (mark) { // ma lo è attualmente
                if (mark.parentNode) {
                    mark.parentNode.removeChild(mark);
                }
                delete this.Vmarks[key];
            }
            return;
        }
        // mark on
        if (!extraOffset) {
            const same = 5;
            extraOffset = new GraphSize(same, same, same, same);
        }
        mark = this.Vmarks[key] = U.newSvg('rect');
        const size = this.getSize();
        // console.log('extraoffset:', extraOffset, 'size:', size);
        size.x -= extraOffset.x;
        size.y -= extraOffset.y;
        size.w += extraOffset.x + extraOffset.w;
        size.h += extraOffset.y + extraOffset.h;
        U.setSvgSize(mark, size, null);
        /*
        mark.setAttributeNS(null, 'x', '' + size.x);
        mark.setAttributeNS(null, 'y', '' + size.y);
        mark.setAttributeNS(null, 'width', '' + (size.w));
        mark.setAttributeNS(null, 'height', '' + (size.h));*/
        mark.setAttributeNS(null, 'rx', '' + (radiusX));
        mark.setAttributeNS(null, 'ry', '' + (radiusY));
        mark.setAttributeNS(null, 'stroke', '' + (color));
        mark.setAttributeNS(null, 'stroke-width', '' + (width));
        mark.setAttributeNS(null, 'fill', '' + (backColor));
        this.logic().getModelRoot().graph.vertexContainer.prepend(mark);
    }
    getStartPoint(nextPt = null) { return this.getMidPoint(nextPt); }
    getEndPoint(nextPt = null) { return this.getMidPoint(nextPt); }
    getMidPoint(prevPt = null) {
        // NB: MAI fare sizeof() di un SVGForeignObjectElement, ridà valori sballati. fallo ai suoi childs.
        const html = this.getHtml();
        const $htmlEP = $(html).find('.EndPoint');
        let htmlEP;
        let endPointSize;
        let pt;
        if ($htmlEP.length === 0) {
            htmlEP = html;
        }
        else {
            htmlEP = $htmlEP[0];
        }
        endPointSize = U.sizeof(htmlEP);
        // console.log('htmlsize:', htmlSize, 'childSize:', U.sizeof(html.firstChild as HTMLElement));
        // console.log('real size(', htmlSize, ') vs graphSize(', this.toGraphCoordS(htmlSize), '), html:', html);
        const endPointGSize = this.owner.toGraphCoordS(endPointSize);
        const vertexGSize = this.getSize();
        pt = endPointGSize.tl();
        pt.x += endPointGSize.w / 2;
        pt.y += endPointGSize.h / 2;
        if (!prevPt) {
            return pt;
        }
        pt = GraphSize.closestIntersection(vertexGSize, prevPt, pt, this.owner.grid);
        U.pe(!U.isOnEdge(pt, vertexGSize), 'not on Vertex edge.');
        return pt;
    }
    setSize(size, refreshVertex = true, refreshEdge = true) {
        if (!size)
            return;
        this.size.x = (U.isNumerizable(size.x)) ? +size.x : this.size.x;
        this.size.y = (U.isNumerizable(size.y)) ? +size.y : this.size.y;
        this.size.w = (U.isNumerizable(size.w)) ? +size.w : this.size.w;
        this.size.h = (U.isNumerizable(size.h)) ? +size.h : this.size.h;
        const htmlForeign = this.getHtmlRawForeign();
        U.setSvgSize(htmlForeign, this.size, IVertex.defaultSize);
        // todo: cerca tutti gli as string, non è un vero cast ma solo un cambiotipo senza trasformazione, crea errori.
        // const spostamento: GraphPoint = this.size.tl().subtract(oldSize.tl(), true);
        // todo: cambia struttura interna size in tl+br, controlla tutti i riferimenti a tl(newinstnce = false) e considera di cambiarli a true.
        if (refreshVertex) {
            this.refreshGUI();
        }
        if (!refreshEdge) {
            return;
        }
        const refEnd = this.edgesEnd; // this.getReferencesEnd();
        const refStart = this.edgesStart; // this.getReferencesStart();
        let i;
        for (i = 0; i < refEnd.length; i++) {
            if (refEnd[i]) {
                refEnd[i].refreshGui();
            }
        }
        for (i = 0; i < refStart.length; i++) {
            if (refStart[i]) {
                refStart[i].refreshGui();
            }
        }
    }
    draw() {
        try {
            this.draw0();
        }
        catch (e) {
            U.pw(true, 'failed to draw vertex of "' + this.logic().printableNameshort() + '".', e);
        }
    }
    draw0() {
        /*const htmlRaw: SVGForeignObjectElement = U.newSvg('foreignObject');
        htmlRaw.appendChild(this.classe.getStyleObj().html);*/
        const style = this.classe.getStyle();
        const htmlRaw0 = style.html;
        U.pe(!this.classe || !(htmlRaw0 instanceof Element), 'class null?', this, htmlRaw0);
        const htmlRaw = this.setHtmls(this.classe, htmlRaw0);
        if (this.classe instanceof IClass)
            this.drawC(this.classe);
        if (this.classe instanceof EEnum)
            this.drawE(this.classe);
        this.addEventListeners();
        U.fixHtmlSelected($(htmlRaw));
        this.autosize(false, false);
        Type.updateTypeSelectors($(this.getHtml()));
        let onrefresh = this.htmlForeign.getAttribute('onrefreshgui');
        const $htmlraw = $(htmlRaw);
        let i;
        const parenttmp = htmlRaw.parentNode;
        const next = htmlRaw.nextSibling;
        if (parenttmp)
            parenttmp.removeChild(htmlRaw);
        // duplicate id removal. TODO: non funziona, forse rileva ancora gli id del vecchio html generato e risultano già inseriti on refresh.
        /*const idarr = $htmlraw.find('[id]').addBack('[id]');
        for (i = 0; i < idarr.length; i++) {
          if (!document.getElementById(idarr[i].id)) { continue; }
          idarr[i].innerHTML = '';
          U.clearAttributes(idarr[i]);
          idarr[i].style.display = 'none';
        }*/
        const scripts = $htmlraw.find('script');
        for (i = 0; i < scripts.length; i++) {
            // clone the script, empty it while keeping (to keep same indexedPath structure as the template), execute id
            // todo: problema: tutti i successivi elementi con id statici verranno rimossi e avranno struttura template != struttura ongraph
            //  e falliranno a mostrare il clicked fragment nello styleeditor.
            // non va bene: se cambio lo stile quello script appeso al body rimane e devo aggiornare la pagina.
            // since newlines are replaced with spaces, scripts inline // comments are not allowed. use /*comments*/
            // const oldid = scripts[i].id;
            // delete scripts[i].id;
            //console.log('script:', scripts[i], 'length:', scripts[i].innerHTML.length, scripts[i].innerText.length);
            if (!scripts[i].innerHTML.length) {
                continue;
            } // "deleted" empty element
            const cloned = scripts[i];
            /*const cloned: HTMLScriptElement = U.cloneHtml(scripts[i]); bug: probably getbyid is working on detached elements too.
            it is altering the ViewRule.
            cloned.id = oldid;
            scripts[i].innerHTML = '';
            document.body.appendChild(cloned);*/
            console.log('eval:', cloned.innerHTML);
            try {
                eval(cloned.innerHTML);
            }
            catch (e) {
                U.pw(true, 'error in user script of "' + this.logic().printableName() + '":', e, 'script:', cloned);
            }
        }
        if (parenttmp) {
            if (next)
                parenttmp.insertBefore(htmlRaw, next);
            else
                parenttmp.appendChild(htmlRaw);
        }
        // console.log('onrefresh:', onrefresh, 'window.onrefresh:', window[onrefresh]);
        if (onrefresh) {
            window[onrefresh](this, this.logic(), htmlRaw);
        }
    }
    autosize(refreshVertex = true, refreshEdge = true, debug = false) {
        const html = this.getHtml();
        const autosize = html.dataset.autosize;
        // console.log('autosize() ? ', modelPiece.html, ' dataset.autosize:', autosize);
        U.pe(autosize !== '1' && autosize !== 't' && autosize !== 'true', 'foreignObject:first-child must have data-autosize="true", and style {height: 100%;} required for now.' +
            ' html:', html, 'foreign:', this.htmlForeign);
        if (autosize !== '1' && autosize !== 't' && autosize !== 'true') {
            return this;
        }
        // console.log('autosize() started');
        if (html.style.height !== 'auto') {
            U.pw(true, 'To use autosize the root node must have "height: auto;", this has been automatically solved. was:' + html.style.height);
            html.style.height = 'auto';
        }
        // const zoomLevel: number = DetectZoom.device();
        const actualSize = this.owner.toGraphCoordS(U.sizeof(html));
        // const minSize: GraphSize = new GraphSize(null, null, 200, 30);
        actualSize.min(IVertex.minSize, false);
        U.pe(actualSize.h === 100, '', IVertex.minSize, actualSize, html);
        this.setSize(new GraphSize(this.size.x, this.size.y, actualSize.w, actualSize.h), refreshVertex, refreshEdge);
        return this;
    }
    drawE(data, canfail = true) {
        try {
            this.drawE0(data);
        }
        catch (e) {
            if (!canfail) {
                throw e;
            }
            const style = data.getStyle();
            const styletype = style.isinstanceshtml ? 'inherited' : (style.isownhtml ? 'personal' : 'default');
            U.pw(true, 'failed to draw ' + styletype + ' style of enum "' + data.printableNameshort() + '", his style will be resetted.', e);
            if (style.isinstanceshtml)
                style.view.htmli = null;
            if (style.isownhtml)
                style.view.htmlo = null;
            this.htmlForeign = null;
            this.drawE(data, false);
        }
    }
    drawC(data, canfail = true) {
        try {
            this.drawC0(data);
        }
        catch (e) {
            if (!canfail) {
                throw e;
            }
            const m = data.getModelRoot();
            const style = data.getStyle();
            const styletype = style.isinstanceshtml ? 'inherited' : (style.isownhtml ? 'personal' : 'default');
            U.pw(true, 'failed to draw ' + styletype + ' style of ' + (m.isM() ? 'm1-object' : 'class') + ' "' + data.printableNameshort() + '", his style will be resetted.', e);
            if (style.isinstanceshtml)
                style.view.htmli = null;
            if (style.isownhtml)
                style.view.htmlo = null;
            this.htmlForeign = null;
            this.drawC(data, false);
        }
    }
    drawO(data, canfail = true) {
        try {
            return this.drawO0(data);
        }
        catch (e) {
            if (!canfail) {
                throw e;
            }
            const m = data.getModelRoot();
            const style = data.getStyle();
            const styletype = style.isinstanceshtml ? 'inherited' : (style.isownhtml ? 'personal' : 'default');
            U.pw(true, 'failed to draw ' + styletype + ' style of ' + m.getPrefix() + '-operation "' + data.printableNameshort() + '", his style will be resetted.', e);
            if (style.isinstanceshtml)
                style.view.htmli = null;
            if (style.isownhtml)
                style.view.htmlo = null;
            return this.drawO(data, false);
        }
    }
    drawParam(data, canfail = true) {
        try {
            return this.drawParam0(data);
        }
        catch (e) {
            if (!canfail) {
                throw e;
            }
            const m = data.getModelRoot();
            const style = data.getStyle();
            const styletype = style.isinstanceshtml ? 'inherited' : (style.isownhtml ? 'personal' : 'default');
            U.pw(true, 'failed to draw ' + styletype + ' style of ' + m.getPrefix() + '-parameter "' + data.printableNameshort() + '", his style will be resetted.', e);
            if (style.isinstanceshtml)
                style.view.htmli = null;
            if (style.isownhtml)
                style.view.htmlo = null;
            return this.drawParam(data, false);
        }
    }
    drawEChild(data) { return this.drawTerminal(data); }
    drawA(data) { return this.drawTerminal(data); }
    drawR(data) { return this.drawTerminal(data); }
    drawTerminal(data, canfail = true) {
        try {
            return this.drawTerminal0(data);
        }
        catch (e) {
            if (!canfail) {
                throw e;
            }
            const m = data.getModelRoot();
            const style = data.getStyle();
            const styletype = style.isinstanceshtml ? 'inherited' : (style.isownhtml ? 'personal' : 'default');
            U.pw(true, 'failed to draw ' + styletype + ' style of ' + m.getPrefix() + '"' + data.printableNameshort() + '", his style will be resetted.', e);
            if (style.isinstanceshtml)
                style.view.htmli = null;
            if (style.isownhtml)
                style.view.htmlo = null;
            return this.drawTerminal(data, false);
        }
    }
    drawE0(logic) {
        if (!this.htmlForeign) {
            const style = this.classe.getStyle();
            this.htmlForeign = style.html;
        }
        const html = this.htmlForeign;
        /// append childrens:
        const $eContainer = $(html).find('.LiteralContainer');
        let i;
        for (i = 0; i < logic.childrens.length; i++) {
            const field = this.drawEChild(logic.childrens[i]);
            $eContainer.append(field);
        }
    }
    drawC0(data) {
        // console.log('drawC()');
        if (!this.htmlForeign) {
            const style = this.classe.getStyle();
            this.htmlForeign = style.html;
        }
        const html = this.htmlForeign;
        /// append childrens:
        const $attContainer = $(html).find('.AttributeContainer');
        const $refContainer = $(html).find('.ReferenceContainer');
        const $opContainer = $(html).find('.OperationContainer');
        // U.pe($attContainer.length !== 1, 'there must be exactly one element with class "AttributeContainer".', $attContainer);
        // U.pe($refContainer.length !== 1, 'there must be exactly one element with class "ReferenceContainer".', $refContainer);
        // U.pe($opContainer.length !== 1, 'there must be exactly one element with class "OperationContainer".', $opContainer);
        // const attContainer = $attContainer[0];
        // const refContainer = $refContainer[0];
        // const opContainer = $opContainer[0];
        let i;
        for (i = 0; i < data.attributes.length; i++) {
            const field = this.drawA(data.attributes[i]);
            field.id = 'ID' + data.attributes[i].id;
            $attContainer.append(field);
        }
        for (i = 0; i < data.references.length; i++) {
            const field = this.drawR(data.references[i]);
            field.id = 'ID' + data.references[i].id;
            $refContainer.append(field);
        }
        const operations = data.getOperations();
        for (i = 0; i < operations.length; i++) {
            // console.log('append ref:', data.references[i]);
            const field = this.drawO(operations[i]);
            field.id = 'ID' + operations[i].id;
            $opContainer.append(field);
        }
    }
    getStartPointHtml() {
        const html = this.getHtml();
        const $start = $(html).find('.StartPoint');
        if ($start.length > 0) {
            return $start[0];
        }
        else {
            return html;
        }
    }
    getEndPointHtml() {
        const html = this.getHtml();
        const $start = $(html).find('.EndPoint');
        if ($start.length > 0) {
            return $start[0];
        }
        return (html.tagName.toLowerCase() === 'foreignobject') ? html.firstChild : html;
    }
    setHtmls(data, htmlRaw) {
        // console.log('drawCV()');
        const graphHtml = this.owner.vertexContainer;
        const $graphHtml = $(graphHtml);
        if (graphHtml.contains(this.htmlForeign)) {
            graphHtml.removeChild(this.htmlForeign);
        }
        // console.log('drawing Vertex[' + data.name + '] with style:', htmlRaw, 'logic:', data);
        // console.log('drawVertex: template:', htmlRaw);
        const foreign = this.htmlForeign = U.textToSvg(U.replaceVars(data, htmlRaw, true).outerHTML);
        const $foreign = $(foreign);
        data.linkToLogic(foreign);
        const $elementWithID = $foreign.find('[id]');
        let i;
        // duplicate prevention.
        for (i = 0; i < $elementWithID.length; i++) {
            const elem = $elementWithID[i];
            const id = '#' + elem.id;
            const $duplicate = $graphHtml.find(id);
            if ($duplicate.length) {
                $foreign.remove(id);
            }
        }
        graphHtml.appendChild(foreign);
        foreign.id = 'ID' + data.id;
        foreign.dataset.vertexID = '' + this.id;
        // graphHtml.innerHTML += foreign.outerHTML;
        // unica soluzione: chiedi a stack e crea manualmente il foreignobject copiando tutti gli attributi.
        // graphHtml.appendChild<Element>(foreign); problema: non renderizza gli svg che non sono stati creati con document.createElementNS()
        // $(graphHtml).append(foreign.outerHTML); doesn't work either
        // console.log('this.style:', this.style);
        // console.log('this.size? (' + (!!this.size) + ': setSize() : ', U.getSvgSize(this.style));
        // console.log('drawC_Vertex. size:', this.size, data.html, this.size = U.getSvgSize(data.html as SVGForeignObjectElement));
        if (!this.size) {
            this.size = this.getSize();
        }
        else {
            this.setSize(this.size, false, false);
        }
        U.pe(this.htmlForeign.tagName.toLowerCase() !== 'foreignobject', 'The custom style root must be a foreignObject node.', this.htmlForeign);
        U.pe(this.htmlForeign.childNodes.length !== 1, 'The custom style must have a single child node,' +
            ' without spaces between <foreignObject> and the next tag. found ' + this.htmlForeign.childNodes.length + ' childrens.', this.htmlForeign, this.htmlForeign.childNodes);
        // this.html = this.htmlForeign.firstChild as HTMLElement;
        return foreign;
    }
    drawO0(data) {
        const html = this.drawTerminal(data);
        const $html = $(html);
        const $signature = $html.find('.specialjs.signature');
        let i;
        for (i = 0; i < $signature.length; i++) {
            const htmldataset = $signature[0];
            data.setSignatureHtml(htmldataset, ', ', +htmldataset.dataset.maxargumentchars, +htmldataset.dataset.maxarguments);
        }
        const $detailHtml = $html.find('.operationDetail');
        $signature.off('click.show').on('click.show', (e) => {
            const target = e.target;
            let avoidToggle;
            switch (target.tagName.toLowerCase()) {
                case 'input':
                case 'textarea':
                case 'select':
                    avoidToggle = true;
                    break;
                default:
                    avoidToggle = ((target instanceof HTMLElement) && target.isContentEditable);
                    break;
            }
            if (avoidToggle) {
                return;
            }
            data.detailIsOpened = !data.detailIsOpened;
            data.detailIsOpened ? $detailHtml.show() : $detailHtml.hide();
            this.autosize(false, true);
        });
        data.detailIsOpened ? $detailHtml.show() : $detailHtml.hide();
        $html.find('input.name').val(data.name);
        const $parameterList = $detailHtml.find('.parameterList');
        let j;
        for (j = 0; j < $parameterList.length; j++) {
            const parameterList = $parameterList[j];
            // U.clear(parameterList);
            const lastChild = parameterList.childNodes[parameterList.childNodes.length - 1];
            for (i = 0; i < data.childrens.length; i++) {
                const field = this.drawParam(data.childrens[i]);
                parameterList.insertBefore(field, lastChild);
            }
            // for (i = oldChilds.length; i > 0; i--) { parameterList.prepend(oldChilds.item(i)); }
        }
        const $addParamButton = $html.find('.addParameterButton');
        // $addParamButton.html('<button style="width: 100%; height: 100%;">+</button>');
        $addParamButton.off('click.add').on('click.add', (e) => { data.addParameter(); this.refreshGUI(); });
        return html;
    }
    drawParam0(data) {
        let i;
        const html = this.drawTerminal(data);
        const $html = $(html);
        // const $typeHtml: JQuery<HTMLSelectElement> = $html.find('select.fullType') as JQuery<HTMLSelectElement>;
        const $nameHtml = $html.find('input.name');
        $nameHtml.val(data.name);
        return html;
    }
    drawTerminal0(data) {
        data.replaceVarsSetup();
        const style = data.getStyle();
        const htmlRaw = style.html;
        U.pe(!htmlRaw, 'failed to get attribute style:', data);
        // todo: sposta l'opearzione nei Graph.Field
        const html = U.replaceVars(data, htmlRaw, true);
        data.linkToLogic(html);
        return html;
    }
    toEdge(start, end) {
        // todo
        U.pe(true, 'vertexToEdge() todo.');
        return null;
    }
    addEventListeners() {
        // todo: viene chiamato 1 volta per ogni elementNode con modelID, ma io eseguo tutto dalla radice.
        // quindi viene eseguito N +1 volte per ogni vertice dove N sono i suoi (attributes + references)
        // console.log(html.tagName, html.dataset.modelPieceID);
        // if (html.tagName.toLowerCase() === 'foreignobject' && html.dataset.modelPieceID )
        //   { html = html.firstChild as Element; }
        // while (!(html.classList.contains('Vertex'))) { console.log(html); html = html.parentNode as Element; }
        const $html = $(this.getHtmlRawForeign());
        $html.off('mousedown.vertex').on('mousedown.vertex', (e) => { this.onMouseDown(e); });
        $html.off('mouseup.vertex').on('mouseup.vertex', (e) => { this.onMouseUp(e); });
        $html.off('mousemove.vertex').on('mousemove.vertex', (e) => { this.onMouseMove(e); });
        $html.off('mouseenter.vertex').on('mouseenter.vertex', (e) => { this.onMouseEnter(e); });
        $html.off('mouseleave.vertex').on('mouseleave.vertex', (e) => { this.onMouseLeave(e); });
        $html.off('click').on('click', (e) => { this.onClick(e); });
        // const $addFieldButtonContainer: JQuery<HTMLElement> = $html.find('.addFieldButtonContainer') as any as JQuery<HTMLElement>;
        // this.setAddButtonContainer($addFieldButtonContainer[0]);
        $html.find('.addFieldButton').off('click.addField').on('click.addField', (e) => { this.addFieldClick(e); });
        $html.find('.AddFieldSelect').off('change.addField').on('change.addField', (e) => { this.addFieldClick(e); });
        $html.find('input, select, textarea').off('change.fieldchange').on('change.fieldchange', (e) => IVertex.FieldNameChanged(e));
        // NB: deve essere solo un off, oppure metti selettore .NOT(class) nel selettore dei 'select' di sopra
        // if (!IVertex.contextMenu) { IVertex.contextMenu = new MyContextMenuClass(new ContextMenuService()); }
        $html.off('contextmenu').on('contextmenu', (e) => { return this.vertexContextMenu(e); });
        $html.find('.Attribute, .Reference, .ELiteral, .Operation, .Parameter').off('contextmenu').on('contextmenu', (e) => { return this.featureContextMenu(e); });
        // $html.find('.LinkVertex').off('mousedown.setReference').on('mousedown.setReference', IVertex.linkVertexMouseDownButton);
        const defaultResizeConfig = {};
        const defaultDragConfig = {};
        // NB: do not delete the apparantly useless dynamic functions.
        // jqueryui is binding this to e.currentTarget and e.currentTarget to document.body, the dynamic function makes this instanceof iVertex again.
        defaultResizeConfig.create = (e, ui) => this.measuringTrigger(ui, e, measurableRules.onRefresh);
        defaultResizeConfig.start = (e, ui) => this.measuringTrigger(ui, e, measurableRules.onResizeStart);
        defaultResizeConfig.resize = (e, ui) => this.measuringTrigger(ui, e, measurableRules.whileResizing);
        defaultResizeConfig.stop = (e, ui) => this.measuringTrigger(ui, e, measurableRules.onResizeEnd);
        // defaultDragConfig.create = (e: Event, ui: DraggableEventUIParams) => this.measuringTrigger(ui, e, measurableRules.onRefresh);
        defaultDragConfig.start = (e, ui) => this.measuringTrigger(ui, e, measurableRules.onDragStart);
        defaultDragConfig.drag = (e, ui) => this.measuringTrigger(ui, e, measurableRules.whileDragging);
        defaultDragConfig.stop = (e, ui) => this.measuringTrigger(ui, e, measurableRules.onDragEnd);
        //     console.log('measurableElementSetup:', defaultResizeConfig, defaultDragConfig);
        Measurable.measurableElementSetup($html, defaultResizeConfig, defaultDragConfig);
    }
    measuringTrigger(ui, e, prefix) {
        const html = e.currentTarget;
        if (!html.attributes)
            return;
        let i;
        for (i = 0; i < html.attributes.length; i++) {
            if (html.attributes[i].name.indexOf('prefix') !== 0)
                continue;
            new MeasurableRuleParts(html.attributes[i], prefix.length).process(false, this, this.owner);
        }
    }
    /*
      measuringInit(ui: ResizableUIParams | DraggableEventUIParams, e: Event): void {
        const m = U.measurableGetArrays(null, e);
        console.log('measuringInit:', ui, e, m);
        let i: number;
        const size: Size = U.sizeof(m.html);
        const absTargetSize: Size = this.owner.getSize();
        const logic: IClassifier = this.logic();
        for (i = 0; i < m.variables.length; i++) { U.processMeasurableVariable(m.variables[i], logic, m.html, size, absTargetSize); }
        for (i = 0; i < m.dstyle.length; i++) { U.processMeasurableDstyle(m.dstyle[i], logic, m.html, null, absTargetSize); }
        for (i = 0; i < m.imports.length; i++) { U.processMeasurableImport(m.imports[i], logic, m.html, null, absTargetSize); }
      }
    
      measuringChanging(ui: ResizableUIParams | DraggableEventUIParams, e: Event, measurHtml: Element = null): void {
        const m: MeasurableArrays = U.measurableGetArrays(measurHtml, e);
        console.log('Changing.measurableHtml parsed special attributes:', m);
        m.imports = [];
        m.chainFinal = [];
        // m.dstyle = [];
        // m.rules = [];
        // m.variables = [];
        U.processMeasuring(this.logic(), m, ui);
      }
    
      measuringChanged(ui: ResizableUIParams | DraggableEventUIParams, e: Event, measurHtml: Element = null): void {
        const m = U.measurableGetArrays(measurHtml, e);
        console.log('Changed.measurableHtml parsed special attributes:', m);
        m.chain = [];
        m.imports = [];
        U.processMeasuring(this.logic(), m, ui);
      }*/
    clickSetReference(e, debug = true) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const edge = IEdge.edgeChanging;
        if (!edge) {
            return;
        }
        U.pif(debug, 'setreferenceClick success!');
        const vertexLogic = this.logic();
        if (!(vertexLogic instanceof IClass))
            return;
        if (!edge.canBeLinkedTo(vertexLogic)) {
            U.pif(debug, 'edge ', edge.logic, 'cannot be linked to ', vertexLogic, 'hoveringvertex:', this);
            return;
        }
        if (edge.logic instanceof MReference)
            edge.logic.linkClass(vertexLogic, edge.getIndex(), true);
        if (edge.logic instanceof M2Reference)
            edge.logic.setType(vertexLogic.getEcoreTypeName());
        if (edge instanceof ExtEdge) {
            if (edge.end)
                U.arrayRemoveAll(edge.logic.extends, edge.end.logic());
            U.ArrayAdd(edge.logic.extends, this.logic());
        }
        else {
            U.pe(edge.logic instanceof MClass, 'cst: class edges are currently not supported');
        }
        this.mark(false, 'refhover');
        // altrimenti parte l'onClick su AddFieldButton quando fissi la reference.
        // setTimeout( () => { IEdge.edgeChanging = null; }, 1);
        IEdge.edgeChangingStopTime = Date.now();
        IEdge.edgeChanging = null;
        edge.tmpEnd = null;
        edge.useMidNodes = true;
        edge.useRealEndVertex = true;
        edge.end = this;
        edge.refreshGui();
    }
    onClick(e) {
        IVertex.ChangePropertyBarContentClick(e);
    }
    vertexContextMenu(evt) {
        DamContextMenuComponent.contextMenu.hide();
        // only if is focused input
        const lastSelected = U.focusHistoryEntries[U.focusHistoryElements.length - 1];
        const gotSelectedNow = lastSelected && U.isParentOf(lastSelected.element, evt.target) && (new Date().valueOf() - lastSelected.time.valueOf() < 0.3 * 1000);
        const isInput = U.isInput(evt.target, true, false) && !gotSelectedNow;
        const gotMoved = this.size.tl().subtract(U.vertexOldPos, false).absolute() > IVertex.tolleranzaRightClickMove;
        const ret = isInput && !gotMoved;
        if (ret)
            return true;
        else {
            evt.preventDefault();
            evt.stopPropagation();
        }
        if (gotMoved)
            return ret;
        // only if: !input && !gotMoved
        DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Vertex', evt.currentTarget);
        return false;
    }
    featureContextMenu(evt) {
        DamContextMenuComponent.contextMenu.hide();
        // only if is focused input
        const lastSelected = U.focusHistoryEntries[U.focusHistoryElements.length - 1];
        const gotSelectedNow = lastSelected && U.isParentOf(lastSelected.element, evt.target) && (new Date().valueOf() - lastSelected.time.valueOf() < 0.3 * 1000);
        const isInput = U.isInput(evt.target, true, false) && !gotSelectedNow;
        const gotMoved = this.size.tl().subtract(U.vertexOldPos, false).absolute() > IVertex.tolleranzaRightClickMove;
        const ret = isInput && !gotMoved;
        if (ret)
            return true;
        else {
            evt.preventDefault();
            evt.stopPropagation();
        }
        if (gotMoved)
            return ret;
        DamContextMenuComponent.contextMenu.show(new Point(evt.pageX, evt.pageY), '.Feature', evt.currentTarget);
        return false;
    }
    onMouseDown(e) {
        if (IEdge.edgeChanging) {
            this.clickSetReference(e);
            return;
        }
        let tmp = e.target;
        console.log(e.button, e.buttons, e);
        if (e.button === U.mouseLeftButton && U.isInput(tmp, true))
            return;
        if (e.button === U.mouseWheelButton)
            return this.owner.onMouseDown(e, true);
        if (e.button === U.mouseRightButton)
            U.vertexOldPos = this.size.tl();
        const thisHtml = this.getHtml();
        // i will not move the vertex while moving a measurable children.
        while (tmp && tmp !== thisHtml) {
            // if (tmp.classList.contains('measurable')) { return; }
            tmp = tmp.parentElement;
        }
        IVertex.selected = this;
        if (IVertex.selectedGridWasOn.x === 'prevent_doublemousedowncheck') {
            IVertex.selectedGridWasOn.x = IVertex.selected.owner.grid.x;
        }
        if (IVertex.selectedGridWasOn.y === 'prevent_doublemousedowncheck') {
            IVertex.selectedGridWasOn.y = IVertex.selected.owner.grid.y;
        }
        IVertex.selected.owner.grid.x = null;
        IVertex.selected.owner.grid.y = null;
        IVertex.selectedStartPt = this.owner.toGraphCoord(new Point(e.pageX, e.pageY));
        IVertex.selectedStartPt.subtract(this.size.tl(), false);
    }
    onMouseUp(e) {
        if (IEdge.edgeChanging) {
            this.clickSetReference(e);
            return;
        }
        const v = IVertex.selected;
        if (!v)
            return;
        v.owner.grid.x = IVertex.selectedGridWasOn.x;
        v.owner.grid.y = IVertex.selectedGridWasOn.y;
        IVertex.selectedGridWasOn.x = 'prevent_doublemousedowncheck';
        IVertex.selectedGridWasOn.y = 'prevent_doublemousedowncheck';
        this.owner.fitToGridS(v.size, false);
        this.setSize(this.size, false, true);
        IVertex.selected = null;
    }
    onMouseMove(e) { }
    onMouseEnter(e) { this.mouseEnterLinkPreview(e); }
    onMouseLeave(e) { this.mouseLeaveLinkPreview(e); }
    mouseEnterLinkPreview(e) {
        const edge = IEdge.edgeChanging;
        if (!edge) {
            return;
        }
        const ref = edge.logic;
        /*const edges: IEdge[] = ref.getEdges();
        U.pe(!edges, 'ref.edges === null', ref);
        let edge: IEdge;
        if (ref.upperbound > 0 && edges.length - 1 >= ref.upperbound) { edge = edges[edges.length - 1]; } else { edge = new IEdge(ref); }*/
        const html2 = e.currentTarget;
        // while (html2 && html2.classList && !html2.classList.contains('vertexShell')) { html2 = html2.parentNode as Element;}
        let hoveringTarget = html2 ? ModelPiece.getLogic(html2) : null;
        U.pe(!hoveringTarget || !(hoveringTarget instanceof IClassifier), 'the currentTarget should point to the vertex root, only classifier should be retrieved.', hoveringTarget, e, html2);
        const linkable = hoveringTarget instanceof IClass ? edge.canBeLinkedTo(hoveringTarget) : false;
        const size = hoveringTarget.getVertex().getSize();
        const width = 3;
        const pad = 5 + width;
        const padding = new GraphSize(pad, pad, pad, pad);
        const vertex = hoveringTarget.getVertex();
        // const oldHoverVertex: IVertex = window.oldEdgeLink_HoveringVertex;
        // if (oldHoverVertex) { vertex.mark(false, 'refhover'); }
        // window.oldEdgeLink_HoveringVertex = vertex;
        vertex.mark(true, 'refhover', linkable ? 'green' : 'red', (size.w + padding.x + padding.w) / 10, (size.h + padding.y + padding.h) / 10, width, null, padding);
        edge.tmpEndVertex = hoveringTarget.getVertex();
        // NB: serve farlo 2 volte, alla prima ripristina il targetEnd ma non corregge lo startingpoint adattandolo alla nuova destinazione.
        edge.refreshGui(null, false);
        edge.refreshGui(null, false);
    }
    mouseLeaveLinkPreview(evt, debug = true) {
        if (!IEdge.edgeChanging) {
            return;
        }
        const edge = IEdge.edgeChanging;
        U.pif(debug, 'vertexLeave()');
        edge.tmpEndVertex = null;
        edge.tmpEnd = GraphPoint.fromEvent(evt);
        this.mark(false, 'refhover');
    }
    addFieldClick(e) {
        // impedisco che un click mentre fisso un edge triggeri altre cose, 100ms di "cooldown"
        if (IEdge.edgeChanging || Date.now() - IEdge.edgeChangingStopTime < 100) {
            return;
        }
        const modelPiece = this.logic();
        const classe = modelPiece instanceof M2Class ? modelPiece : null;
        const enumm = modelPiece instanceof EEnum ? modelPiece : null;
        U.pe(!enumm && !classe, 'AddFieldClick should only be allowed on M2-Classes or enumerations.');
        U.pe(!this.classe, 'called addFieldClick on a package');
        Status.status.debug = true;
        const html = this.getHtml();
        let select;
        // const debugOldJson = U.cloneObj(modelPiece.generateModel());
        select = $(html).find('.AddFieldSelect')[0];
        switch (select.value.toLowerCase()) {
            default:
                U.pe(true, 'unexpected select value for addField:' + select.value + ' allowed values are: ["Reference", "Attribute", "Operation", "Literal"]');
                break;
            case 'reference':
                U.pe(!classe, '"Reference" as .AddFieldSelect value is only allowed on M2-classes');
                classe.addReference();
                break;
            case 'attribute':
                U.pe(!classe, '"Attribute" as .AddFieldSelect value is only allowed on M2-classes');
                classe.addAttribute();
                break;
            case 'operation':
                U.pe(!classe, '"Operation" as .AddFieldSelect value is only allowed on M2-classes');
                classe.addOperation();
                break;
            case 'literal':
                U.pe(!enumm, '"Literal" as .AddFieldSelect value is only allowed on Enumerations');
                enumm.addLiteral();
                break;
        }
    }
    /*
      setAddButtonContainer(container: HTMLElement): void {
        U.toHtml('<span style="display:flex; margin:auto;">Add&nbsp;</span>' +
          '<select class="AddFieldSelect" style="display:flex; margin:auto;"><optgroup label="FeatureType">' +
          '<option value="Attribute" selected="">Attribute</option>' +
          '<option value="Reference">Reference</option>' +
          '<option value="Operation">Operation</option>' +
          '</optgroup></select>' +
          '<span style="display:flex; margin:auto;">&nbsp;field</span>\n' +
          '<button>Go</button>', container); }
    */
    setFields(f) {
        this.fields = f;
    }
    setGraph(graph) {
        U.pe(!graph, 'Vertex should only be created after Graph initialization.');
        this.owner = graph;
    }
    refreshGUI() { this.draw(); }
    moveTo(graphPoint, gridIgnore = false) {
        // console.log('moveTo(', graphPoint, '), gridIgnore:', gridIgnore, ', grid:');
        const oldsize = this.size; // U.getSvgSize(this.logic().html as SVGForeignObjectElement);
        if (!gridIgnore) {
            graphPoint = this.owner.fitToGrid(graphPoint);
        }
        this.setSize(new GraphSize(graphPoint.x, graphPoint.y, oldsize.w, oldsize.h), false, true);
    }
    logic(set = null) {
        if (set) {
            return this.classe = set;
        }
        return this.classe;
    }
    // todo: elimina differenze html e htmlforeign o almeno controlla e riorganizza
    getHtmlRawForeign() { return this.htmlForeign; }
    getHtml() { return this.htmlForeign.firstChild; }
    minimize() {
        U.pe(true, 'minimize() to do.');
    }
    isDrawn() { return !!(this.htmlForeign && this.htmlForeign.parentNode); }
    /*pushDown(): void {
      if (!this.isDrawn()) { return; }
      const html = this.htmlForeign;
      const parent = html.parentNode;
      parent.removeChild(html);
      parent.appendChild(html); }
  
    pushUp(): void {
      if (!this.isDrawn()) { return; }
      const html = this.htmlForeign;
      const parent = html.parentNode;
      parent.removeChild(html);
      parent.prepend(html); }*/
    remove() {
        console.log('IVertex.delete();');
        let i;
        // for (i = 0; i < this.edgesStart.length; i++) {}
        let arr;
        arr = U.ArrayCopy(this.edgesStart, false);
        for (i = 0; i < arr.length; i++) {
            arr[i].remove();
        }
        arr = U.ArrayCopy(this.edgesEnd, false);
        for (i = 0; i < arr.length; i++) {
            arr[i].remove();
        }
        const html = this.htmlForeign;
        html.parentNode.removeChild(html);
        delete IVertex.all[this.id];
        for (const key in this.Vmarks) {
            if (this.Vmarks[key]) {
                continue;
            }
            const mark = this.Vmarks[key];
            if (mark.parentNode) {
                mark.parentNode.removeChild(mark);
            }
        }
        U.arrayRemoveAll(this.owner.vertex, this);
        this.classe.vertex = null;
        const fields = U.ArrayCopy(this.fields, false);
        for (i = 0; i < fields.length; i++) {
            fields[i].remove();
        }
        // gc helper
        this.owner = null;
        this.size = null;
        this.edgesStart = null;
        this.edgesEnd = null;
    }
    getSize(debug = false) {
        const html0 = this.htmlForeign;
        let sizeOld;
        if (debug) {
            sizeOld = this.size ? this.size.duplicate() : null;
            if (this.size) {
                this.owner.markgS(this.size, true, 'blue');
            }
        }
        const size = this.size = U.getSvgSize(html0, IVertex.minSize);
        U.pe(debug && !sizeOld.equals(size), 'Wrong size. this:', this);
        return this.size;
    }
    /// end of IVertex
    isMarkedWith(markKey, colorFilter = null) {
        if (!this.Vmarks.hasOwnProperty(markKey)) {
            return false;
        }
        if (!colorFilter) {
            return true;
        }
        const markRect = this.Vmarks[markKey];
        return (markRect.getAttributeNS(null, 'stroke') === colorFilter);
    }
}
IVertex.all = {};
IVertex.ID = 0;
IVertex.selected = null;
IVertex.selectedGridWasOn = null;
IVertex.selectedStartPt = null;
IVertex.oldEdgeLinkHoveringVertex = null;
IVertex.minSize = null;
IVertex.defaultSize = null;
IVertex.tolleranzaRightClickMove = 5;
//# sourceMappingURL=iVertex.js.map