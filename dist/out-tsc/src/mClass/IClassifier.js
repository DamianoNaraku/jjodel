import { IVertex, U, ModelPiece, Status, M2Class, Type, EEnum, } from '../common/Joiner';
export class IClassifier extends ModelPiece {
    constructor() {
        super(...arguments);
        this.vertex = null;
    }
    static defaultSidebarHtml() {
        return U.toHtml('<div class="sidebarNode class"><p class="sidebarNodeName">$##name$</p></div>');
    }
    generateVertex() {
        if (this.vertex)
            return;
        const lastView = this.getLastViewWith('vertexSize');
        const size = lastView ? lastView.vertexSize : null;
        const v = this.vertex = new IVertex(this, size);
        return v;
    }
    getSidebarHtml() {
        if (this.sidebarHtml) {
            return this.sidebarHtml;
        }
        return IClassifier.defaultSidebarHtml();
    }
    setName(value, refreshGUI = false) {
        super.setName(value, refreshGUI);
        if (refreshGUI)
            this.refreshInstancesGUI();
        // for (i = 0; model && i < model.instances.length; i++) { model.instances[i].sidebar.fullnameChanged(oldName, this.name); }
        Type.updateTypeSelectors(null, false, true, true);
        return this.name;
    }
    getVertex() {
        const displayAsEdge = this.shouldBeDisplayedAsEdge();
        // U.pw(displayAsEdge, 'getvertex called on a class that should not have a vertex.', this);
        if (!displayAsEdge && this.vertex === null && Status.status.loadedLogic) {
            this.generateVertex();
        }
        return this.vertex;
    }
    refreshGUI_Alone(debug) {
        if (!Status.status.loadedLogic) {
            return;
        }
        this.getVertex().refreshGUI();
    }
    getEcoreTypeName() {
        if (this instanceof EEnum || M2Class)
            return Type.classTypePrefix + this.name;
        return Type.classTypePrefix + this.parent.name;
    }
}
//# sourceMappingURL=IClassifier.js.map