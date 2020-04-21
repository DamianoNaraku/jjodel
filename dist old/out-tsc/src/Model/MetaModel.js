import { Json, U, IModel, M2Package, ECoreRoot, Type } from '../common/Joiner';
import { EAnnotation } from './EAnnotation';
export class MetaModel extends IModel {
    constructor(json, metaParent) { super(metaParent); this.parse(json, true); }
    getAllClasses() { return super.getAllClasses(); }
    getAllReferences() { return super.getAllReferences(); }
    getClass(fullname, throwErr = true, debug = true) {
        return super.getClass(fullname, throwErr, debug);
    }
    getClassFromEcoreStr(targetstr) {
        U.pe(!targetstr || targetstr.indexOf(Type.classTypePrefix) !== 0, 'getClassFromString(): not a ecore class name:', targetstr);
        const classes = this.getAllClasses();
        let i;
        for (i = 0; i < classes.length; i++) {
            if (classes[i].getEcoreTypeName() === targetstr)
                return classes[i];
        }
        return null;
    }
    getEcoreStr_Class_Dictionary() {
        const classes = this.getAllClasses();
        let i;
        const dic = {};
        for (i = 0; i < classes.length; i++) {
            dic[classes[i].getEcoreTypeName()] = classes[i];
        }
        return dic;
    }
    getClassByNameSpace(fullnamespace, caseSensitive = false, canThrow = false) {
        const classes = this.getAllClasses();
        let i;
        if (caseSensitive) {
            fullnamespace = fullnamespace.toLowerCase();
        }
        let justNameMatchFallback = null;
        let namestr = fullnamespace.substr(fullnamespace.lastIndexOf(':') + 1);
        if (!caseSensitive) {
            namestr = namestr.toLowerCase();
        }
        for (i = 0; i < classes.length; i++) {
            const mmclass = classes[i];
            if ((caseSensitive ? mmclass.name : mmclass.name.toLowerCase()) === namestr) {
                justNameMatchFallback = mmclass;
            }
            let mmclassNS = mmclass.getNamespaced();
            if (!mmclassNS) {
                continue;
            }
            if (caseSensitive) {
                mmclassNS = mmclassNS.toLowerCase();
            }
            if (mmclassNS === fullnamespace) {
                return mmclass;
            }
        }
        U.pe(!justNameMatchFallback, 'class |' + fullnamespace + '| not found. classArr:', classes);
        return justNameMatchFallback;
    }
    /*
      fixReferences(): void {
        const arr: M2Reference[] = this.getAllReferences();
        let i = -1;
        while (++i < arr.length) {
          arr[i].linkClass();
          U.pe(!arr[i].classType, arr[i], Status.status.loadedLogic);
        } }*/
    parse(json, destructive = true) {
        if (destructive) {
            this.childrens = [];
        }
        const childrens = Json.getChildrens(json);
        const annotations = Json.getAnnotations(json);
        let i;
        for (i = 0; i < annotations.length; i++) {
            const child = annotations[i];
            // metaParent = U.findMetaParentP(this, child);
            if (destructive) {
                new EAnnotation(this, child);
                continue;
            }
            U.pe(true, 'Non-destructive m2-model parse: to do');
        }
        for (i = 0; i < childrens.length; i++) {
            const child = childrens[i];
            const metaParent = null;
            // metaParent = U.findMetaParentP(this, child);
            if (destructive) {
                new M2Package(this, child);
                continue;
            }
            U.pe(true, 'Non-destructive m2-model parse: to do');
        }
    }
    generateModel() {
        const packageArr = [];
        let i;
        for (i = 0; i < this.childrens.length; i++) {
            const pkg = this.childrens[i];
            packageArr.push(pkg.generateModel());
        }
        const model = new Json(null);
        model[ECoreRoot.ecoreEPackage] = packageArr;
        return model;
    }
    getDefaultPackage() {
        if (this.childrens.length !== 0) {
            return this.childrens[0];
        }
        U.ArrayAdd(this.childrens, new M2Package(this, null));
        return this.childrens[0];
    }
    conformability(metaparent, outObj, debug) { return 1; }
    getPrefix() { return 'mm'; }
    getPrefixNum() { return 'm2'; }
    isM1() { return false; }
    isM2() { return true; }
    isM3() { return false; }
    duplicate(nameAppend = '_Copy') {
        const m = new MetaModel(null, null);
        m.copy(this);
        m.refreshGUI();
        return m;
    }
}
MetaModel.emptyModel = '{}';
MetaModel.emptyModelOld = '{ "ecore:EPackage": {\n' +
    '    "@xmlns:xmi": "http://www.omg.org/XMI",\n' +
    '    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",\n' +
    '    "@xmlns:ecore": "http://www.eclipse.org/emf/2002/Ecore",\n' +
    '    "@xmi:version": "2.0",\n' +
    '    "eClassifiers": []' +
    '  }' +
    '}';
//# sourceMappingURL=MetaModel.js.map