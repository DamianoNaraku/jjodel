import { M2Class, IEdge, Json, Status, U, ECoreReference, IReference, Info, } from '../../../../common/Joiner';
export class M2Reference extends IReference {
    constructor(classe, json) {
        super(classe, Status.status.mmm.getReference());
        this.containment = false && false;
        if (!classe && !json) {
            return;
        } // empty constructor for .duplicate();
        this.parse(json, true);
    }
    getModelRoot() { return super.getModelRoot(); }
    parse(json, destructive) {
        /// own attributes.
        this.setName(Json.read(json, ECoreReference.namee, 'Ref_1'));
        this.type.changeType(Json.read(json, ECoreReference.eType, this.parent.getEcoreTypeName()));
        //const eType = Json.read<string>(json, ECoreReference.eType, '#//' + this.parent.name );
        // this.type = AttribETypes.reference;
        // this.parsePrintableTypeName(eType);
        // this.linkClass();
        this.containment = Json.read(json, ECoreReference.containment, false);
        this.setLowerbound(+Json.read(json, ECoreReference.lowerbound, 0));
        this.setUpperbound(+Json.read(json, ECoreReference.upperbound, 1));
        let i; /*
        this.views = [];
        for(i = 0; i < this.parent.views.length; i++) {
          const pv: ClassView = this.parent.views[i];
          const v = new ReferenceView(pv);
          this.views.push(v);
          pv.referenceViews.push(v); }*/
    }
    generateModel() {
        const model = new Json(null);
        model[ECoreReference.xsitype] = 'ecore:EReference';
        model[ECoreReference.eType] = this.type.toEcoreString();
        model[ECoreReference.namee] = this.name;
        if (this.lowerbound != null && !isNaN(+this.lowerbound)) {
            model[ECoreReference.lowerbound] = +this.lowerbound;
        }
        if (this.upperbound != null && !isNaN(+this.lowerbound)) {
            model[ECoreReference.upperbound] = +this.upperbound;
        }
        if (this.containment != null) {
            model[ECoreReference.containment] = this.containment;
        }
        return model;
    }
    generateEdges() {
        if (!this.edges)
            this.edges = [null]; // size must be 1
        const e = new IEdge(this, 0, this.parent.getVertex(), this.type.classType.getVertex());
        return [e];
    }
    useless() { }
    /*
      fieldChanged(e: JQuery.ChangeEvent) {
        const html: HTMLElement = e.currentTarget;
        switch (html.tagName.toLowerCase()) {
          default: U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e); break;
          case 'textarea':
          case 'input': this.setName((html as HTMLInputElement).value); break;
          case 'select':
            const select: HTMLSelectElement = html as HTMLSelectElement;
            const m: M2Class = ModelPiece.getByID(+select.value) as any;
            this.linkClass(m); break;
        }
      }*/
    setContainment(b) { this.containment = b; }
    setUpperbound(n) {
        super.setUpperbound(n);
        let i = -1;
        while (++i < this.instances.length) {
            const mref = this.instances[i];
            if (n !== -1) {
                mref.mtarget.length = mref.edges.length = n;
            }
            mref.delete(true, n, Number.POSITIVE_INFINITY);
        }
    }
    delete(refreshgui = true, linkStart = null, linkEnd = null) {
        super.delete(false, linkStart, linkEnd);
        // total deletion
        if (linkStart === null && linkEnd === null) {
            if (this.type.classType)
                U.arrayRemoveAll(this.type.classType.referencesIN, this);
        }
        if (refreshgui)
            this.refreshGUI();
    }
    /*
      getStyle(debug: boolean = true): HTMLElement | SVGElement {
        const raw: HTMLElement | SVGElement = super.getStyle(debug);
        const $raw = $(raw);
        const $selector = $raw.find('select.ClassSelector');
        M2Class.updateMMClassSelector($selector[0] as HTMLSelectElement, this.classType);
        return raw; }*/
    duplicate(nameAppend = '_Copy', newParent = null) {
        const r = new M2Reference(null, null);
        return r.copy(this, nameAppend, newParent);
    }
    copy(r, nameAppend = '_Copy', newParent = null) {
        super.copy(r, nameAppend, newParent);
        this.setLowerbound(r.lowerbound);
        this.setUpperbound(r.upperbound);
        this.containment = r.containment;
        this.type.changeType(r.type.toEcoreString());
        this.refreshGUI();
        return this;
    }
    // linkClass(classe: M2Class = null): void { return this.type.changeType(null, null, classe); }
    // conformability(meta: M3Reference, debug: boolean = true): number { U.pw(true, 'it\'s ok but should not be called'); return 1; }
    getInfo(toLower = true) {
        const info = super.getInfo();
        // set('typeOriginal', this.type);
        // info['' + 'tsClass'] = (this.getModelRoot().getPrefix()) + 'Reference';
        Info.rename(info, 'type', 'target');
        Info.rename(info, 'typeDetail', 'targetDetail');
        Info.set(info, 'containment', this.containment);
        const targetinfo = this.type.classType ? this.type.classType.getInfo(toLower) : {};
        Info.set(info, 'target', targetinfo);
        Info.merge(info, targetinfo);
        return info;
    }
    canBeLinkedTo(hoveringTarget) {
        return (hoveringTarget instanceof M2Class);
        //  return (this.type.classType === hoveringTarget || this.type.classType.isExtending(hoveringTarget));
    } // && !(hoveringTarget instanceof EEnum); }
}
//# sourceMappingURL=M2Reference.js.map