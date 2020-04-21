import { IModel, U, MPackage, Status, MClass } from '../common/Joiner';
export class Model extends IModel {
    constructor(json, metaModel) {
        super(metaModel);
        this.classRoot = null;
        this.parse(json, true);
    }
    // fixReferences(): void {/*useless here? or useful in loops?*/}
    getClassRoot() {
        if (this.classRoot) {
            return this.classRoot;
        }
        const classes = this.getAllClasses();
        if (classes.length)
            U.pw(true, 'Failed to get m1 class root.<br>You need to select a root class in M1\'s structured editor', this);
        if (classes.length && classes[0]) {
            classes[0].setRoot(true);
            U.ps(true, 'Class root automatically selected.');
        }
        return null;
    }
    parse(json, destructive, metamodel = null) {
        if (!metamodel) {
            metamodel = Status.status.mm;
        }
        U.pe(!metamodel, 'parsing a model requires a metamodel linked');
        U.pw(json === '' + json, 'ModelPiece.parse() parameter must be a parsed ECORE/json. autofixed.');
        if (json === '' + json)
            json = JSON.parse(json + '');
        if (destructive) {
            this.childrens = [];
        }
        let key;
        for (key in json) {
            if (!json.hasOwnProperty(key)) {
                continue;
            }
            const namespacedclass = key;
            const mmclass = this.metaParent.getClassByNameSpace(namespacedclass, false, true);
            const value = json[key];
            new MClass(this.getDefaultPackage(), value, mmclass);
        }
        /*
        {
          "org.eclipse.example.bowling:League": { <-- :classroot
            "-xmlns:xmi": "http://www.omg.org/XMI",
            "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
            "-xmi:version": "2.0",
            "Players": [
              { "-name": "tizio" },
              { "-name": "asd" }
            ]
          }
        }
        */
    }
    // parse(deep: boolean) { super.parse(deep); }
    getAllClasses() { return super.getAllClasses(); }
    getAllReferences() { return super.getAllReferences(); }
    getClass(fullname, throwErr = true, debug = true) {
        return super.getClass(fullname, throwErr, debug);
    }
    generateModel() {
        const json = {};
        const classRoot = this.getClassRoot();
        if (!classRoot)
            return Model.emptyModel;
        json[classRoot.metaParent.getNamespaced()] = classRoot.generateModel(true);
        return json;
    }
    // namespace(set: string = null): string { return this.metaParent.namespace(set); }
    getDefaultPackage() {
        if (this.childrens.length !== 0) {
            return this.childrens[0];
        }
        new MPackage(this, null, this.metaParent.getDefaultPackage());
        return this.childrens[0];
    }
    conformability(metaparent, outObj, debug) {
        U.pw(true, 'm1.conformability(): to do.');
        return 1;
    }
    getPrefix() { return 'm'; }
    getPrefixNum() { return 'm1'; }
    isM1() { return true; }
    isM2() { return false; }
    isM3() { return false; }
    duplicate(nameAppend = '_Copy') {
        const m = new Model(null, null);
        m.copy(this);
        m.refreshGUI();
        return m;
    }
}
Model.emptyModel = '{}';
//# sourceMappingURL=Model.js.map