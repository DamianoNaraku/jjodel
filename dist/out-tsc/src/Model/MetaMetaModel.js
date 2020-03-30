import { IModel, M3Package, U } from '../common/Joiner';
export class MetaMetaModel extends IModel {
    constructor(json) { super(null); this.parse(json, true); }
    conformability(metaparent, outObj = null, debug = false) { return 1; }
    getAllClasses() { return super.getAllClasses(); }
    getAllReferences() { return super.getAllReferences(); }
    generateModel() { return undefined; }
    getPrefix() { return 'mmm'; }
    getPrefixNum() { return 'm3'; }
    isM1() { return false; }
    isM2() { return false; }
    isM3() { return true; }
    parse(json, destructive) {
        this.name = 'Meta-Metamodel';
        const useless = new M3Package(this, null);
    }
    refreshGUI_Alone(debug = true) { }
    getDefaultPackage() {
        if (this.childrens.length !== 0) {
            return this.childrens[0];
        }
        U.ArrayAdd(this.childrens, new M3Package(this, null));
        return this.childrens[0];
    }
    getPackage() { return this.getDefaultPackage(); }
    getClass(fullname = null, throwErr = true, debug = true) { return this.getDefaultPackage().classes[0]; }
    getAttribute() { return this.getClass().attributes[0]; }
    getReference() { return this.getClass().references[0]; }
    getOperation() { return this.getClass().getOperations()[0]; }
    getParameter() { return this.getOperation().childrens[0]; }
    duplicate(nameAppend = '_Copy') { U.pe(true, 'invalid operation: m3.duplicate();'); return this; }
}
MetaMetaModel.emptyMetaMetaModel = '' + 'empty Meta-MetaModel: todo'; // todo
//# sourceMappingURL=MetaMetaModel.js.map