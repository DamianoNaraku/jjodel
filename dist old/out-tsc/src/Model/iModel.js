import { Status, U, ModelPiece, MetaMetaModel, LocalStorage, MetaModel, Model, GraphSize, SaveListEntry, } from '../common/Joiner';
export class IModel extends ModelPiece {
    constructor(metaVersion) {
        super(null, metaVersion);
        this.graph = null;
        this.sidebar = null;
        this.storage = null;
        this.namespaceVar = null;
        this.uriVar = null;
        this.viewpoints = [];
        this.storage = new LocalStorage(this);
    }
    // viewpoint: ViewPoint;
    /*
    constructor(json: Json, metaParent: MetaModel, skipParse: boolean = false) {
      super(null, metaParent);
      // todo: mi sa che chiama parse a ripetizione: Modelpiece.parse, IFeature.parse, IAttribute.parse, M2Attribute.parse...
      if (!skipParse) { this.parse(json, true); }
    }*/
    static isValidURI(str) { return str.indexOf(' ') !== -1 && true; }
    static removeInvalidNameChars(name) { return U.multiReplaceAll(name, [' '], ['']); }
    uri(str = null) {
        if (str) {
            if (IModel.isValidURI(str)) {
                return this.uriVar = str;
            }
            else {
                return null;
            }
        }
        if (this.uriVar) {
            return this.uriVar;
        }
        return this.uriVar = 'http://default/uri/to/change';
    }
    namespace(value = null) {
        let pos;
        if (value) {
            this.namespaceVar = value;
            pos = this.namespaceVar.lastIndexOf(':');
            this.namespaceVar = pos === -1 ? this.namespaceVar : this.namespaceVar.substring(0, pos);
        }
        const ns = this.namespaceVar;
        if (!ns) {
            return this.namespace('default.namespace.to.change');
        }
        pos = ns.lastIndexOf(':');
        return pos === -1 ? ns : ns.substring(0, pos);
    }
    getAllClasses() {
        const arr = [];
        const packages = this.childrens;
        let i;
        for (i = 0; i < packages.length; i++) {
            packages[i].classes.forEach((elem) => { arr.push(elem); });
        }
        return arr;
    }
    getAllEnums() {
        const arr = [];
        const packages = this.childrens;
        let i;
        for (i = 0; i < packages.length; i++) {
            packages[i].enums.forEach((elem) => { arr.push(elem); });
        }
        return arr;
    }
    fullname() { return this.name; }
    getVertex() { U.pe(true, 'IModel.getVertex();', this); return undefined; }
    getAllReferences() {
        const arr = [];
        const classes = this.getAllClasses();
        let i;
        for (i = 0; i < classes.length; i++) {
            classes[i].references.forEach((elem) => { arr.push(elem); });
        }
        return arr;
    }
    getPackage(fullname, throwErr = true) {
        if (fullname.indexOf('.') !== -1) {
            U.pe(throwErr, 'not a package name:', fullname);
            return null;
        }
        let i;
        for (i = 0; i < this.childrens.length; i++) {
            if (this.childrens[i].name === fullname) {
                return this.childrens[i];
            }
        }
        if (fullname.indexOf('.') !== -1) {
            U.pe(throwErr, 'valid a package name, but package does not exist:', fullname);
            return null;
        }
        return null;
    }
    getClass(fullname, throwErr = true, debug = true) {
        const tks = fullname.split('.');
        if (tks.length !== 2) {
            U.pe(throwErr, 'not a full class name:', fullname);
            return null;
        }
        const classes = this.getAllClasses();
        let i = -1;
        while (++i < classes.length) {
            const currentFname = classes[i].fullname();
            U.pif(debug, 'fllname: |' + fullname + '| =?= |' + currentFname + '| = ' + currentFname === fullname);
            if (currentFname === fullname) {
                return classes[i];
            }
        }
        const name = fullname.substr(fullname.indexOf('.') + 1);
        i = -1;
        while (++i < classes.length) {
            U.pif(debug, 'name: |' + name + '| =?= |' + classes[i].name + '| = ' + classes[i].name === name);
            if (classes[i].name === name) {
                return classes[i];
            }
        }
        U.pe(throwErr, 'valid name but unable to find it. fullname:', fullname, 'classes:', classes);
        return null;
        // let i;
        // for ( i = 0; i < pkg.childrens.length; i++) { if (pkg.childrens[i].name === fullname) { return pkg.childrens[i] as M2Class; } }
    }
    getEmptyModel() {
        if (this instanceof MetaMetaModel)
            return MetaMetaModel.emptyMetaMetaModel;
        if (this instanceof MetaModel)
            return MetaModel.emptyModel;
        if (this instanceof Model)
            return Model.emptyModel;
        return null;
    }
    delete() {
        this.storage.remove(this.name, SaveListEntry.model);
        // set empty (meta)model as most recent anonymous savefile and next to be opened.
        LocalStorage.deleteLastOpened(this instanceof MetaModel ? 2 : 1);
        /*this.storage.add(null, null, SaveListEntry.model);
        this.storage.add(null, null, SaveListEntry.view);
        this.storage.add(null, null, SaveListEntry.vertexPos);*/
        U.refreshPage();
    }
    refreshGUI_Alone(debug = true) {
        let i;
        for (i = 0; i < this.childrens.length; i++) {
            this.childrens[i].refreshGUI_Alone(debug);
        }
    }
    isNameTaken(name) { return !!this.storage.get(name, SaveListEntry.model); }
    setName(value, refreshGUI = false) {
        const oldname = this.name;
        if (this.isNameTaken(value)) {
            U.pw(true, 'tried to saveToDB a model with a name already in use');
            return oldname;
        }
        super.setName(value);
        this.storage.rename(oldname, this.name, SaveListEntry.model);
        if (this.graph.propertyBar.selectedModelPiece === this)
            this.graph.propertyBar.refreshGUI();
        return this.name;
    }
    save(isAutosave, saveAs = false) {
        this.storage.saveModel(isAutosave, saveAs);
    }
    isMMM() { return this.isM3(); }
    isMM() { return this.isM2(); }
    isM() { return this.isM1(); }
    addClass(parent = null, meta = null) {
        if (!parent) {
            parent = this.getDefaultPackage();
        }
        return parent.addEmptyClass(meta);
    }
    friendlyClassName(toLower = true) {
        if (this instanceof MetaMetaModel) {
            return 'Meta-metamodel'.toLowerCase();
        }
        if (this instanceof MetaModel) {
            return 'Metamodel'.toLowerCase();
        }
        if (this instanceof Model) {
            return 'Model'.toLowerCase();
        }
        U.pe(true, 'unexpected');
        return 'error';
    }
    getLastView() {
        let i;
        for (i = this.viewpoints.length; --i >= 0;) {
            const vp = this.viewpoints[i];
            if (vp.isApplied)
                return vp;
        }
        return null;
    }
    static getByName(name) {
        if (Status.status.mmm.fullname() === name)
            return Status.status.mmm;
        if (Status.status.mm.fullname() === name)
            return Status.status.mm;
        if (Status.status.m.fullname() === name)
            return Status.status.m;
        return null;
    }
    readVertexPositionSaveArr(dic) {
        for (let key in dic) {
            const value = new GraphSize().clone(dic[key]);
            const mp = ModelPiece.getByKeyStr(key);
            if (!mp) {
                U.pw(true, 'invalid vertex save, failed to get targetmodelpiece: ', key, dic, this);
                continue;
            }
            mp.getVertex().setSize(value);
        }
    }
    generateVertexPositionSaveArr() {
        let i;
        let j;
        let ret = {};
        let arr = [this.getAllEnums(), this.getAllClasses()];
        for (j = 0; j < arr.length; j++)
            for (i = 0; i < arr[j].length; i++) {
                ret[arr[j][i].getKeyStr()] = arr[j][i].getVertex().getSize();
            }
        return ret;
    }
    generateViewPointSaveArr() {
        /*let i: number;
        let tmp: any = [];
        for (i = 0; i < this.viewpoints.length; i++) { tmp.push(this.viewpoints[i].toJSON()); }
        return tmp;*/
        return this.viewpoints;
    }
}
export class ECoreRoot {
    static initializeAllECoreEnums() {
        ECoreRoot.ecoreEPackage = 'ecore:EPackage';
        ECorePackage.eAnnotations = ECoreClass.eAnnotations = ECoreEnum.eAnnotations = EcoreLiteral.eAnnotations =
            ECoreReference.eAnnotations = ECoreAttribute.eAnnotations = ECoreOperation.eAnnotations = ECoreParameter.eAnnotations = 'eAnnotations';
        ECoreAnnotation.source = Status.status.XMLinlineMarker + 'source';
        ECoreAnnotation.references = Status.status.XMLinlineMarker + 'references'; // "#/" for target = package.
        ECoreAnnotation.details = 'details'; // arr
        ECoreDetail.key = Status.status.XMLinlineMarker + 'key'; // can have spaces
        ECoreDetail.value = Status.status.XMLinlineMarker + 'value';
        ECorePackage.eClassifiers = 'eClassifiers';
        ECorePackage.xmlnsxmi = Status.status.XMLinlineMarker + 'xmlns:xmi'; // typical value: http://www.omg.org/XMI
        ECorePackage.xmlnsxsi = Status.status.XMLinlineMarker + 'xmlns:xsi'; // typical value: http://www.w3.org/2001/XMLSchema-instance
        ECorePackage.xmiversion = Status.status.XMLinlineMarker + 'xmi:version'; // typical value: "2.0"
        ECorePackage.xmlnsecore = Status.status.XMLinlineMarker + 'xmlns:ecore';
        ECorePackage.nsURI = Status.status.XMLinlineMarker + 'nsURI'; // typical value: "http://org/eclipse/example/bowling"
        ECorePackage.nsPrefix = Status.status.XMLinlineMarker + 'nsPrefix'; // typical value: org.eclipse.example.bowling
        ECorePackage.namee = Status.status.XMLinlineMarker + 'name';
        ECoreClass.eStructuralFeatures = 'eStructuralFeatures';
        ECoreClass.eOperations = 'eOperations';
        ECoreClass.xsitype = Status.status.XMLinlineMarker + 'xsi:type'; // "ecore:EClass"
        ECoreClass.namee = ECorePackage.namee;
        ECoreClass.eSuperTypes = Status.status.XMLinlineMarker + 'eSuperTypes'; // space separated: "#name1 #name2"...
        ECoreClass.instanceTypeName = Status.status.XMLinlineMarker + 'instanceTypeName'; // raw str
        ECoreClass.instanceTypeName = Status.status.XMLinlineMarker + 'instanceTypeName';
        ECoreClass.abstract = Status.status.XMLinlineMarker + 'abstract'; // bool
        ECoreClass.interface = Status.status.XMLinlineMarker + 'interface'; // bool
        ECoreEnum.instanceTypeName = ECoreClass.instanceTypeName;
        ECoreEnum.serializable = 'serializable'; // "false", "true"
        ECoreEnum.xsitype = ECoreClass.xsitype; // "ecore:EEnum"
        ECoreEnum.eLiterals = 'eLiterals';
        ECoreEnum.namee = ECorePackage.namee;
        EcoreLiteral.literal = 'literal';
        EcoreLiteral.namee = ECorePackage.namee;
        EcoreLiteral.value = 'value'; // any integer (-inf, +inf), not null. limiti = a type int 32 bit?
        ECoreReference.xsitype = Status.status.XMLinlineMarker + 'xsi:type'; // "ecore:EReference"
        ECoreReference.eType = Status.status.XMLinlineMarker + 'eType'; // "#//Player"
        ECoreReference.containment = Status.status.XMLinlineMarker + 'containment'; // "true"
        ECoreReference.upperbound = Status.status.XMLinlineMarker + 'upperBound'; // "@1"
        ECoreReference.lowerbound = Status.status.XMLinlineMarker + 'lowerBound'; // does even exists?
        ECoreReference.namee = Status.status.XMLinlineMarker + 'name';
        ECoreAttribute.xsitype = Status.status.XMLinlineMarker + 'xsi:type'; // "ecore:EAttribute",
        ECoreAttribute.eType = Status.status.XMLinlineMarker + 'eType'; // "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString"
        ECoreAttribute.namee = Status.status.XMLinlineMarker + 'name';
        ECoreOperation.eParameters = 'eParameters';
        ECoreOperation.namee = Status.status.XMLinlineMarker + 'name'; // "EExceptionNameCustom",
        ECoreOperation.ordered = Status.status.XMLinlineMarker + 'ordered'; // "false",
        ECoreOperation.unique = Status.status.XMLinlineMarker + 'unique'; // "false",
        ECoreOperation.lowerBound = Status.status.XMLinlineMarker + 'lowerBound'; // "5", ma che senso ha su una funzione?? è il return?
        ECoreOperation.upperBound = Status.status.XMLinlineMarker + 'upperBound';
        ECoreOperation.eType = Status.status.XMLinlineMarker + 'eType'; // "#//Classname",
        ECoreOperation.eexceptions = Status.status.XMLinlineMarker + 'eExceptions';
        // "#//ClassnameException1 #//ClassNameException2 (also custom classes) ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt
        ECoreParameter.namee = Status.status.XMLinlineMarker + 'name';
        ECoreParameter.ordered = Status.status.XMLinlineMarker + 'ordered'; // "false";
        ECoreParameter.unique = Status.status.XMLinlineMarker + 'unique'; // "false"
        ECoreParameter.lowerBound = Status.status.XMLinlineMarker + 'lowerBound'; // "1"
        ECoreParameter.upperBound = Status.status.XMLinlineMarker + 'upperBound'; // "2"
        ECoreParameter.eType = Status.status.XMLinlineMarker + 'eType'; // "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDoubl
        XMIModel.type = Status.status.XMLinlineMarker + 'type';
        XMIModel.namee = Status.status.XMLinlineMarker + 'name';
    }
}
export class ECoreAnnotation {
}
export class ECoreDetail {
}
export class ECorePackage {
}
export class ECoreClass {
}
export class ECoreEnum {
}
export class EcoreLiteral {
}
export class ECoreReference {
}
export class ECoreAttribute {
}
export class ECoreOperation {
}
export class ECoreParameter {
}
export class XMIModel {
}
//# sourceMappingURL=iModel.js.map