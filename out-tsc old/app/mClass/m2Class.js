import { Json, U, Status, Model, ECoreAttribute, ECoreClass, MAttribute, MReference, IClass, M2Reference, M2Attribute, EOperation, Type, ExtEdge, } from '../common/Joiner';
export class M2Class extends IClass {
    /*
      static updateAllMMClassSelectors(root0: Element = null, updateModel: boolean = false, updateSidebar: boolean = true): void {
        let root: Element = root0;
        if (!Status.status.loadedGUI) { return; }
        if (!root) { root = Status.status.mm.graph.container; }
        // console.log('updateAllMMClassSelectors()', 'selects:', $selectors, root);
        const $selectors = $(root).find('select.ClassSelector');
        let i = -1;
        while (++i < $selectors.length) { M2Class.updateMMClassSelector($selectors[i] as HTMLSelectElement); }
        if (updateSidebar && Status.status.m && Status.status.m.sidebar) { Status.status.m.sidebar.loadDefaultHtmls(); }
        if (!updateModel) { return; }
        // if (Status.status.mm && Status.status.mm.sidebar) { Status.status.mm.sidebar.updateAll(); }
        if (Status.status.m) { Status.statm.refreshGUI(); }
      }
    /*
      static updateMMClassSelector(htmlSelect: HTMLSelectElement, selected: M2Class = null, debug = false,
                                   mustSelect: boolean = true): HTMLSelectElement {
        if (!htmlSelect || !Status.status.loadedGUI) { return; }
        const optGrp: HTMLOptGroupElement = document.createElement('optgroup');
        let toSelect: string;
        if (debug) { console.clear(); }
        if (mustSelect && !selected) {
          const mp: ModelPiece = ModelPiece.getLogic(htmlSelect);
          U.pif(debug, 'ownermp:', mp, 'select:', htmlSelect);
          // if (ownermp instanceof IAttribute || ownermp instanceof MAttribute) { selected = ownermp.parent as M2Class; }
          if (mp instanceof Typedd) { selected = (mp as Typedd).type; }
          U.pw(!selected, 'ClassSelectors must be held inside a m2-reference:', htmlSelect, 'ownermp:', mp) ;
          if (!selected) { return; }
        }
        toSelect = '' + (selected ? selected.id : '');
        U.pif(debug, 'selected:', selected);
        U.clear(htmlSelect);
        htmlSelect.appendChild(optGrp);
        optGrp.setAttribute('label', 'Class list');
        const mmClasses: M2Class[] = Status.status.mm.getAllClasses();
        let i: number;
        let found: boolean = !mustSelect;
        for (i = 0; i < mmClasses.length; i++) {
          const classe: M2Class = mmClasses[i];
          if (classe.shouldBeDisplayedAsEdge()) { continue; }
          const opt: HTMLOptionElement = document.createElement('option');
          opt.value = '' + classe.id;
          if (toSelect && opt.value === toSelect) { opt.setAttribute('selected', ''); opt.selected = found = true; }
          // console.log('mustselect?' + mustSelect + ': ' + toSelect + '&&' + opt.value + ' ? ' + found);
          opt.innerHTML = classe.name;
          optGrp.appendChild(opt); }
        U.pw(debug && !found, 'class not found.', mmClasses, 'searchedClass:', selected,
          'shouldBeEdge?', selected && selected.shouldBeDisplayedAsEdge());
        return htmlSelect; }
    */
    // isRoot(): boolean { U.pe(true, 'm2 class cannot be roots.'); return false; }
    // setRoot(value: boolean): void { U.pe(true, 'only usable in model version'); }
    constructor(pkg, json) {
        super(pkg, Status.status.mmm.getAllClasses()[0]);
        // features: M2Feature[]; // M2Feature[];
        this.operations = [];
        this.extends = [];
        this.instances = [];
        if (!pkg && !json) {
            return;
        } // empty constructor for .duplicate();
        this.parse(json, true);
    }
    getModelRoot() { return super.getModelRoot(); }
    getNamespaced() {
        const str = this.getModelRoot().namespace();
        if (this instanceof Model) {
            return str;
        }
        return str + ':' + this.name;
    }
    parse(json, destructive) {
        //     console.log('M2Class.parse(); json:', json, '; metaVersion: ', this.metaParent, 'this:', this);
        /// own attributes.
        this.extendEdges = [];
        this.setName(Json.read(json, ECoreClass.namee, 'Class_1'), false);
        let key;
        for (key in json) {
            switch (key) {
                default:
                    U.pw(true, 'unexpected field in M2Class.parse() |' + key + '|', json);
                    break;
                case ECoreClass.instanceTypeName:
                case ECoreClass.eSuperTypes:
                case ECoreClass.xsitype:
                case ECoreClass.eOperations:
                case ECoreClass.eStructuralFeatures:
                case ECoreClass.abstract:
                case ECoreClass.interface:
                case ECoreClass.namee: break;
            }
        }
        this.instanceTypeName = Json.read(json, ECoreClass.instanceTypeName, '');
        this.isInterface = Json.read(json, ECoreClass.interface, 'false') === 'true';
        this.isAbstract = Json.read(json, ECoreClass.abstract, 'false') === 'true';
        let tmps = Json.read(json, ECoreClass.eSuperTypes, null);
        this.extendsStr = tmps ? tmps.split(' ') : [];
        // U.pe(true, 'extendsStr:', this.extendsStr, 'tmps', tmps, 'typeof tmps:' + typeof(tmps), 'json:', json);
        /*this.name = Json.read<string>(this.json, ECoreClass.name);
        this.fullname = this.midname = this.parent.fullname + '.' + this.name;*/
        /// childrens
        const features = Json.getChildrens(json);
        const functions = Json.getChildrens(json, false, true);
        let i;
        let newFeature;
        const oldChildrens = this.childrens;
        // let metaParent: M3Feature;
        if (destructive) {
            this.childrens = [];
            this.attributes = [];
            this.references = [];
            this.operations = [];
        }
        for (i = 0; i < features.length; i++) {
            // console.log('reading class children[' + i + '/' + childs.length + '] of: ', childs, 'of', json);
            const child = features[i];
            const xsiType = Json.read(child, ECoreAttribute.xsitype);
            U.pe(!destructive, 'Non-destructive class parse: to do');
            switch (xsiType) {
                default:
                    U.pe(true, 'unexpected xsi:type: ', xsiType, ' in feature:', child);
                    break;
                case 'ecore:EAttribute':
                    // metaParent = oldChildrens[i] && oldChildrens[i].metaParent ? oldChildrens[i].metaParent : U.findMetaParentA(this, child);
                    newFeature = new M2Attribute(this, child);
                    U.ArrayAdd(this.attributes, newFeature);
                    break;
                case 'ecore:EReference':
                    const metaRef = null;
                    // metaParent = oldChildrens[i] && oldChildrens[i].metaParent ? oldChildrens[i].metaParent : U.findMetaParentA(this, child);
                    newFeature = new M2Reference(this, child);
                    U.ArrayAdd(this.references, newFeature);
                    break;
            }
            U.ArrayAdd(this.childrens, newFeature);
        }
        for (i = 0; i < functions.length; i++) {
            const newFunction = new EOperation(this, functions[i]);
            U.ArrayAdd(this.operations, newFunction);
            U.ArrayAdd(this.childrens, newFunction);
        }
    }
    generateModel() {
        const featurearr = [];
        const operationsarr = [];
        const model = {};
        let supertypesstr = '';
        const key = U.getStartSeparatorKey();
        let i;
        for (i = 0; i < this.extends.length; i++) {
            supertypesstr += U.startSeparator(key, ' ') + this.extends[i].getEcoreTypeName();
        }
        for (i = 0; i < this.attributes.length; i++) {
            featurearr.push(this.attributes[i].generateModel());
        }
        for (i = 0; i < this.references.length; i++) {
            featurearr.push(this.references[i].generateModel());
        }
        for (i = 0; i < this.operations.length; i++) {
            operationsarr.push(this.operations[i].generateModel());
        }
        model[ECoreClass.xsitype] = 'ecore:EClass';
        model[ECoreClass.namee] = this.name;
        model[ECoreClass.interface] = U.toBoolString(this.isInterface);
        model[ECoreClass.abstract] = U.toBoolString(this.isAbstract);
        model[ECoreClass.instanceTypeName] = this.instanceTypeName;
        model[ECoreClass.eSuperTypes] = supertypesstr;
        model[ECoreClass.eStructuralFeatures] = featurearr;
        model[ECoreClass.eOperations] = operationsarr;
        return model;
    }
    addOperation() {
        const op = new EOperation(this, null);
        let i;
        for (i = 0; i < this.instances.length; i++) {
            const inst = this.instances[0];
        }
        this.refreshInstancesGUI();
        this.refreshGUI();
        return op;
    }
    addReference() {
        const ref = new M2Reference(this, null);
        ref.type.changeType(null, null, this);
        ref.generateEdges();
        let i;
        for (i = 0; i < this.instances.length; i++) {
            const inst = this.instances[i];
            new MReference(inst, null, ref);
        }
        this.refreshInstancesGUI();
        this.refreshGUI();
        // M2Class.updateAllMMClassSelectors(ref.getHtml());
        return ref;
    }
    addAttribute() {
        console.log('addAttribute: pre', this);
        const attr = new M2Attribute(this, null);
        let i;
        for (i = 0; i < this.instances.length; i++) {
            const inst = this.instances[i];
            new MAttribute(inst, null, attr);
        }
        this.refreshInstancesGUI();
        this.refreshGUI();
        return attr;
    }
    fieldChanged(e) {
        const html = e.currentTarget;
        if (html.classList.contains('AddFieldSelect'))
            return;
        switch (html.tagName.toLowerCase()) {
            case 'select':
            default:
                U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                break;
            case 'textarea':
            case 'input':
                const input = html;
                input.value = this.setName(input.value);
                break;
        }
    }
    /*
      setName(name: string, refreshGUI: boolean = true): void {
        super.setName(name, refreshGUI);
        return;
        this.midname = this.parent.name + '.' + this.name;
        this.fullname = this.midname;
        let i;
        for (i = 0; i < this.childrens.length; i++) {
          this.childrens[i].setName(this.childrens[i].name, false && refreshGUI); // per aggiornare il fullname.
        }
        if (refreshGUI) { this.refreshGUI(); M2Class.updateAllMMClassSelectors(); }
    }*/
    duplicate(nameAppend = '_Copy', newParent = null) {
        const c = new M2Class(null, null);
        c.copy(this);
        Type.updateTypeSelectors(null, false, false, true);
        c.refreshGUI();
        return c;
    }
    getExtendedClassArray(levelDeep = Number.POSITIVE_INFINITY, out = []) {
        let i;
        for (i = 0; i < this.extends.length; i++) {
            const curr = this.extends[i];
            U.ArrayAdd(out, curr);
            if (levelDeep > 0) {
                curr.getExtendedClassArray(levelDeep--, out);
            }
        }
        return out;
    }
    // linkToMetaParent(meta: M3Class): void { return super.linkToMetaParent(meta); }
    getReferencePointingHere() { return super.getReferencePointingHere(); }
    getAttribute(name, caseSensitive = false) { return super.getAttribute(name, caseSensitive); }
    getReference(name, caseSensitive = false) { return super.getReference(name, caseSensitive); }
    isExtending(subclass) {
        if (!subclass)
            return false;
        const extendedTargetClasses = subclass.getExtendedClassArray();
        let i;
        for (i = 0; i < extendedTargetClasses.length; i++) {
            if (this === extendedTargetClasses[i]) {
                return true;
            }
        }
        return false;
    }
    static updateSuperClasses() {
        const dictionary = Status.status.mm.getEcoreStr_Class_Dictionary();
        const classes = Status.status.mm.getAllClasses();
        let j;
        let i;
        for (i = 0; i < classes.length; i++) {
            const classe = classes[i];
            for (j = 0; j < classe.extendsStr.length; j++) {
                const target = dictionary[classe.extendsStr[j]];
                U.pe(!target, 'e1, failed to find extended class.extendsStr[' + j + ']:', classe.extendsStr[j], 'in classList:', classes, 'classe to extend:', classe, 'dictionary:', dictionary);
                classe.extendClass(null, target);
            }
            classe.extendsStr = [];
        }
    }
    extendClass(targetstr, target) {
        if (!target)
            target = this.getModelRoot().getClassFromEcoreStr(targetstr);
        U.pe(!target, 'e2, failed to find extended class:', targetstr, 'in classList:', Status.status.mm.getAllClasses(), 'this:', this);
        U.ArrayAdd(this.extends, target);
    }
    unextendClass(targetstr, target) {
        if (!target)
            target = this.getModelRoot().getClassFromEcoreStr(targetstr);
        U.pe(!target, 'e3, failed to find extended class:', targetstr, 'in classList:', Status.status.mm.getAllClasses(), 'this:', this);
        U.arrayRemoveAll(this.extends, target);
    }
    makeExtendEdge(target) {
        const ret = new ExtEdge(this, this.getVertex(), target.getVertex());
        this.extendEdges.push(ret);
        return ret;
    }
}
//# sourceMappingURL=m2Class.js.map