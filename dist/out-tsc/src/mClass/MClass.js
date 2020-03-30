import { U, ModelPiece, Status, IClass, MReference, MAttribute, } from '../common/Joiner';
export class MClass extends IClass {
    // external pointers to this class.
    // id: number;
    // instances: ModelPiece[];
    // metaParent: M2Class;
    // parent: MPackage;
    // childrens: ModelPiece[];
    /*attributes: MAttribute[];
    references: MReference[];
    referencesIN: MReference[];
  */
    static getArrayIndex_ByMetaParentName(name, array) {
        let i = -1;
        while (++i < array.length) {
            if (name === array[i].metaParent.name) {
                return i;
            }
        }
        return -1;
    }
    constructor(pkg, json, metaVersion) {
        super(pkg, metaVersion);
        if (!pkg && !json && !metaVersion) {
            return;
        } // empty constructor for .duplicate();
        U.pe(!metaVersion, 'null metaparent?');
        this.parse(json, true);
    }
    endingName(valueMaxLength = 10) {
        if (this.attributes.length > 0) {
            return this.attributes[0].endingName(valueMaxLength);
        }
        if (this.references.length > 0) {
            return this.references[0].endingName(valueMaxLength);
        }
        return '';
    }
    getModelRoot() { return super.getModelRoot(); }
    isRoot() { return this === Status.status.m.classRoot; }
    setRoot(value) {
        U.pe(!value, 'should only be used to set root. to delete a root choose another one and call setRoot on it.');
        this.getModelRoot().classRoot = this;
    }
    conformability(meta, outObj) {
        throw new Error('M.conformability%() todo');
    }
    duplicate(nameAppend = null, newParent = null) {
        const c = new MClass(null, null, null);
        c.copy(this);
        c.refreshGUI_Alone();
        return c;
    }
    // linkToMetaParent(meta: M2Class): void { return super.linkToMetaParent(meta); }
    generateModel(root = false) {
        /*
           { "-name": "tizio", "attrib2": value2, ...}
        OR:
           {
            "-xmlns:xmi": "http://www.omg.org/XMI",
            "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
            "-xmi:version": "2.0",
            "Players": [
              { "-name": "tizio" },
              { "-name": "asd" }
            ]
          }
        */
        const inlineMarker = Status.status.XMLinlineMarker;
        const json = {};
        if (root) {
            json[inlineMarker + 'xmlns:xmi'] = 'http://www.omg.org/XMI';
            json[inlineMarker + 'xmlns:' + this.getModelRoot().namespace()] = this.getModelRoot().uri();
            json[inlineMarker + 'xmi:version'] = '2.0';
        }
        let outi;
        let i;
        const set = (k, v) => { json[k] = v; };
        const arr = [this.attributes, this.references];
        for (outi = 0; outi < arr.length; outi++) {
            for (i = 0; i < arr[outi].length; i++) {
                const child = arr[outi][i];
                const value = (child).generateModel();
                U.pe(value instanceof ModelPiece, 'value returned is modelpiece.', child);
                // some error here, il value = ELIteral viene assegnato alla key .nome
                if (value === '' || value === null || value === undefined || U.isEmptyObject(value)) {
                    continue;
                }
                const key = (U.isPrimitive(value) ? inlineMarker : '') + child.metaParent.name;
                json[key] = value;
            }
        }
        return json;
    }
    parse(json, destructive = true) {
        const attributes = (this.metaParent).attributes;
        const references = (this.metaParent).references;
        // const childrens: M2Feature[] = (this.metaParent).childrens;
        let i = -1;
        if (destructive) {
            this.attributes = [];
            this.references = [];
            this.childrens = [];
            this.referencesIN = [];
            while (++i < attributes.length) {
                const attr = new MAttribute(this, null, attributes[i]);
                /*U.ArrayAdd(this.childrens, attr);*/
                U.ArrayAdd(this.attributes, attr);
                console.trace();
                console.log('add[' + i + '/' + this.metaParent.attributes.length + ']:', attr, this.attributes, this.attributes.length, this);
            }
            i = -1;
            while (++i < references.length) {
                const ref = new MReference(this, null, references[i]);
                /*U.ArrayAdd(this.childrens, ref);*/
                U.ArrayAdd(this.references, ref);
            }
        }
        U.pe(this.attributes.length > 4, this, this.attributes.length);
        /*{                                                           <--- classRoot
            "-xmlns:xmi": "http://www.omg.org/XMI",
            "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
            "-xmi:version": "2.0",
            "Players": [
              { "-name": "tizio" },          <-- class[0]
              { "-name": "asd" }             <-- class[1]
            ]
          }*/
        const inlineMarker = Status.status.XMLinlineMarker;
        for (let key in json) {
            if (!json.hasOwnProperty(key)) {
                continue;
            }
            const value = json[key];
            switch (key) {
                case inlineMarker + 'xmlns:xmi':
                // case inlineMarker + 'xmlns:' + this.getModelRoot().namespace():
                case inlineMarker + 'xmi:version':
                    this.setRoot(true);
                    break;
                default:
                    // todo: usa il ns del modello per caricare il metamodello con quel namespace se quello attuale non è conforme?
                    if (key.indexOf(inlineMarker) === 0) {
                        key = key.substr(inlineMarker.length);
                    }
                    if (key.indexOf('xmlns:') === 0) {
                        key = key.substr('xmlns:'.length);
                        this.getModelRoot().namespace(key);
                        U.pw(false, 'setns?', key, this, this.metaParent);
                        continue;
                    }
                    const metaAttr = this.metaParent.getAttribute(key);
                    const metaRef = this.metaParent.getReference(key);
                    if (metaAttr) {
                        const cindex = this.getChildrenIndex_ByMetaParent(metaAttr);
                        const aindex = this.getAttributeIndex_ByMetaParent(metaAttr);
                        /*const newA: MAttribute = new MAttribute(this, value, metaAttr);
                        this.childrens[cindex] = this.attributes[aindex] = newA;*/
                        this.attributes[aindex].parse(value, true);
                    }
                    else if (metaRef) {
                        const cindex = this.getChildrenIndex_ByMetaParent(metaRef);
                        const rindex = this.getReferenceIndex_ByMetaParent(metaRef);
                        // const newR: MReference = new MReference(this, value, metaRef);
                        // this.childrens[cindex] = this.references[rindex] = newR;
                        let j;
                        let edges = this.references[rindex].getEdges();
                        for (j = 0; j < edges.length; j++) { }
                        this.references[rindex].parse(value, true);
                    }
                    else {
                        U.pe(true, 'model attribute-or-reference type not found. class:', this, ', json:', json, 'key/name:', key, ', Iclass:', this.metaParent);
                    }
                    break;
            }
        }
        console.log('here2', this, this.attributes.length);
        U.pe(this.attributes.length > 4, this, this.attributes.length);
    }
    modify_Old(json, destructive = true) {
        /*{                                                                                           <-- :classroot
            "-xmlns:xmi": "http://www.omg.org/XMI",
            "-xmlns:org.eclipse.example.bowling": "https://org/eclipse/example/bowling",
            "-xmi:version": "2.0",
            "Players": [
              { "-name": "tizio" },          <-- class[0]
              { "-name": "asd" }             <-- class[1]
            ]
          }*/
        if (destructive) {
            this.childrens = [];
            this.references = [];
            this.attributes = [];
            this.referencesIN = [];
        }
        const inlineMarker = Status.status.XMLinlineMarker;
        for (let key in json) {
            if (!json.hasOwnProperty(key)) {
                continue;
            }
            const value = json[key];
            switch (key) {
                case inlineMarker + 'xmlns:xmi':
                // case inlineMarker + 'xmlns:' + this.getModelRoot().namespace():
                case inlineMarker + 'xmi:version':
                    this.setRoot(true);
                    break;
                default:
                    // todo: usa il ns del modello per caricare il metamodello con quel namespace se quello attuale non è conforme?
                    if (key.indexOf(inlineMarker) === 0) {
                        key = key.substr(inlineMarker.length);
                    }
                    if (key.indexOf('xmlns:') === 0) {
                        key = key.substr('xmlns:'.length);
                        this.getModelRoot().namespace(key);
                        U.pw(false, 'setns?', key, this, this.metaParent);
                        continue;
                    }
                    const metaAttr = this.metaParent.getAttribute(key);
                    const metaRef = this.metaParent.getReference(key);
                    let newA;
                    let newR;
                    if (metaAttr) {
                        newA = new MAttribute(this, value, metaAttr);
                        U.ArrayAdd(this.childrens, newA);
                        U.ArrayAdd(this.attributes, newA);
                    }
                    else if (metaRef) {
                        newR = new MReference(this, value, metaRef);
                        U.ArrayAdd(this.childrens, newR);
                        U.ArrayAdd(this.references, newR);
                    }
                    else {
                        U.pe(true, 'model attribute-or-reference type not found. class:', this, ', json:', json, 'key/name:', key, ', Iclass:', this.metaParent);
                    }
                    break;
            }
        }
    }
    getChildrenIndex_ByMetaParent(meta) { return MClass.getArrayIndex_ByMetaParentName(meta.name, this.childrens); }
    getAttributeIndex_ByMetaParent(meta) { return MClass.getArrayIndex_ByMetaParentName(meta.name, this.attributes); }
    getReferenceIndex_ByMetaParent(meta) { return MClass.getArrayIndex_ByMetaParentName(meta.name, this.references); }
}
//# sourceMappingURL=MClass.js.map