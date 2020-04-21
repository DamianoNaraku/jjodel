import { U, ModelPiece, Status, M3Class, EEnum, Type } from '../../common/Joiner';
export class IPackage extends ModelPiece {
    constructor(mm, json, metaParent) {
        super(mm, metaParent);
        this.classes = [];
        this.enums = [];
    }
    addEmptyEnum() {
        const c = new EEnum(this, null);
        if (this instanceof M3Package || !Status.status.loadedLogic)
            return;
        c.generateVertex();
        Type.updateTypeSelectors(null, false, true, false);
        return c;
    }
    // conformability(metaparent: IPackage, outObj?: any, debug?: boolean): number { return 1; }
    fullname() { return this.name; }
    getVertex() { return undefined; }
    getEnum(name, caseSensitive = false, throwErr = true, debug = true) {
        let i;
        if (!caseSensitive) {
            name = name.toLowerCase();
        }
        for (i = 0; i < this.enums.length; i++) {
            let classname = this.enums[i].name;
            if (!caseSensitive) {
                classname = classname.toLowerCase();
            }
            if (name === classname) {
                return this.enums[i];
            }
        }
        return null;
    }
    getClass(name, caseSensitive = false, throwErr = true, debug = true) {
        let i;
        if (!caseSensitive) {
            name = name.toLowerCase();
        }
        for (i = 0; i < this.classes.length; i++) {
            let classname = this.classes[i].name;
            if (!caseSensitive) {
                classname = classname.toLowerCase();
            }
            if (name === classname) {
                return this.classes[i];
            }
        }
        return null;
    }
    duplicate(nameAppend = '_Copy', newParent = null) {
        U.pe(true, 'Package duplicate to do.');
        return undefined;
    }
    // todo:
    refreshGUI_Alone(debug) {
        let i;
        for (i = 0; i < this.childrens.length; i++) {
            this.childrens[i].refreshGUI_Alone(debug);
        }
    }
}
export class M3Package extends IPackage {
    constructor(model, json) { super(model, json, null); this.parse(json, true); }
    getClass(name, caseSensitive = false, throwErr = true, debug = true) {
        return super.getClass(name, caseSensitive, throwErr, debug);
    }
    addEmptyClass(metaVersion) {
        const c = new M3Class(this, null);
        return c;
    }
    generateModel() {
        return undefined;
    }
    parse(json, destructive = true) {
        this.name = 'Package';
        this.addEmptyClass(null);
        this.addEmptyEnum();
        this.enums[0].setName('Enumeration');
    }
    refreshGUI_Alone(debug = true) { }
}
//# sourceMappingURL=iPackage.js.map