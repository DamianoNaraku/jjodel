import { EOperation, IClass, IField, Info, ModelPiece, Type, U, EEnum } from '../../common/Joiner';
export class Typedd extends ModelPiece {
    constructor(parent, metaVersion) {
        super(parent, metaVersion);
        // upperbound and lowerbound are defining how much values can be given to a single typed element. (nullable, single value, array)
        this.upperbound = 1 || 1; // to avoid stupid compiler warning on primitive types
        this.lowerbound = 0 || 0;
        // tells if the values are ordered. useless if upperbound is <= 1
        this.ordered = false && false;
        // tells if the values are a set. useless if upperbound is <= 1
        this.unique = false && false;
        this.type = this.getModelRoot().isM2() || this.getModelRoot().isM3() ? new Type(this) : null;
    }
    // typeClassFullnameStr: string = null;
    /*
      parsePrintableTypeName(eTypeLongStr: string): void {
        this.classType = null;
        this.typeClassFullnameStr = null;
        const pkg: IPackage = this.getPackage();
        const searchStr: string = '#//' || '';
        const pos = eTypeLongStr.lastIndexOf(searchStr);
        if (pos === 0 && pkg) {
          this.typeClassFullnameStr = pkg.name + '.' + eTypeLongStr.substring(pos + searchStr.length);
          return; }
        this.updateTypeAndValue(EType.getFromLongString(eTypeLongStr), false);
        U.pe(!this.getType(), 'found json ecore type that is not a classname or a primitive type.', eTypeLongStr);
        return; }*/
    fieldChanged(e, ignoreSwitch = false) {
        const html = e.currentTarget;
        const graph = this.getModelRoot().graph;
        const fromGraph = U.isParentOf(graph.container, html);
        const fromSidebar = U.isParentOf(graph.propertyBar.container, html);
        if (!ignoreSwitch)
            switch (html.tagName.toLowerCase()) {
                default:
                    U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                    break;
                case 'textarea':
                case 'input':
                    this.setName(html.value);
                    break;
                case 'select':
                    this.setType(html.value, true, false);
                    break;
            }
        if (!fromGraph) {
            this.refreshGUI();
        }
        if (!fromSidebar) {
            graph.propertyBar.refreshGUI();
        }
    }
    setType(classOrPrimitiveString, throwError = true, refreshGui = true) {
        const type = this.getType();
        U.pe(type !== this.type, 'attempting to change parent type!', this, type);
        type.changeType(classOrPrimitiveString);
        if (refreshGui)
            this.refreshGUI();
        return true;
    }
    // updateTypeAndValue(primitiveType: EType = null, refreshGui: boolean = true): void {}
    /*
      setClassType(classType: M2Class = null, refreshGui: boolean = true): void {
        if (!classType || this.classType === classType) { return; }
        this.classType = classType;
        if (!refreshGui) { return; }
        this.refreshGUI();
        this.refreshInstancesGUI(); }*/
    getType() { return this.type || this.metaParent.type; }
    getInfo(toLower = false) {
        const info = super.getInfo(toLower);
        if (!(this instanceof EOperation)) {
            Info.unset(info, 'childrens');
        }
        Info.set(info, 'lowerBound', this.lowerbound);
        Info.set(info, 'upperBound', this.upperbound);
        const type = this.getType();
        Info.set(info, 'type', type.toEcoreString());
        Info.set(info, 'typeDetail', type);
        return info;
    }
    // copy(other: IAttribute, nameAppend: string = '_Copy', newParent: IClass = null): void {
    copy(c, nameAppend = '_Copy', newParent = null) {
        super.copy(c, nameAppend, newParent);
        this.setLowerbound(c.lowerbound);
        this.setUpperbound(c.upperbound);
        this.unique = c.unique;
        this.ordered = c.ordered;
        this.setType(c.getType().toEcoreString(), null, false);
        this.refreshGUI();
    }
    getPackage() { return this.parent ? this.getClass().parent : null; }
    graph() { return this.getVertex().owner; }
    getVertex() { return this.parent ? this.getClass().getVertex() : null; }
    /*linkToMetaParent<T extends Typedd>(classChild: T) {
      U.pe(true, 'linkToMetaPrent: todo();');
      this.metaParent = classChild;
      if (!this.metaParent) { return; }
      U.ArrayAdd(this.metaParent.instances, this); }*/
    fullname() { return this.getClass().fullname() + '.' + this.name; }
    generateField() { return this.field = new IField(this); }
    getField() { return this.field ? this.field : this.generateField(); }
    refreshGUI_Alone(debug = true) { this.getField().refreshGUI(true); }
    delete(refreshgui = true) {
        const oldparent = this.parent;
        super.delete(false);
        if (oldparent) {
            if (oldparent instanceof IClass) {
                U.arrayRemoveAll(oldparent.attributes, this);
                U.arrayRemoveAll(oldparent.references, this);
                U.arrayRemoveAll(oldparent.getOperations(), this);
            }
            else if (oldparent instanceof EEnum) {
                // U.arrayRemoveAll(oldparent.childrens, this as any); done in modelpiece.delete()
            }
            else if (oldparent instanceof EOperation) { }
            else {
                U.pe(true, 'unrecognized parent class of typed modelpiece:' + U.getTSClassName(oldparent) + ':', this);
            }
        }
        if (refreshgui)
            oldparent.refreshGUI();
    }
    // getClassType(): M2Class { return this.type.classType; }
    getUpperbound() { return this.upperbound; }
    getLowerbound() { return this.lowerbound; }
    setUpperbound(val) { this.upperbound = isNaN(+val) ? -1 : +val; }
    setLowerbound(val) { this.lowerbound = isNaN(+val) || +val < 0 ? 0 : +val; }
}
//# sourceMappingURL=Typedd.js.map