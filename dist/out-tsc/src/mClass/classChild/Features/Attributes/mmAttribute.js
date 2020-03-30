import { IAttribute, ECoreAttribute, Json, AttribETypes, Status, } from '../../../../common/Joiner';
export class M2Attribute extends IAttribute {
    constructor(classe, json) {
        super(classe, Status.status.mmm.getAttribute());
        if (!classe && !json) {
            return;
        } // empty constructor for .duplicate();
        this.parse(json, true);
    }
    getModelRoot() { return super.getModelRoot(); }
    parse(json, destructive) {
        this.setName(Json.read(json, ECoreAttribute.namee, 'Attribute_1'));
        this.type.changeType(Json.read(json, ECoreAttribute.eType, AttribETypes.EString));
        /*
        this.views = [];
        let i: number;
        for(i = 0; i < this.parent.views.length; i++) {
          const pv: ClassView = this.parent.views[i];
          const v = new AttributeView(pv);
          this.views.push(v);
          pv.attributeViews.push(v); }*/
    }
    generateModel() {
        const model = new Json(null);
        Json.write(model, ECoreAttribute.xsitype, 'ecore:EAttribute');
        Json.write(model, ECoreAttribute.eType, this.type.toEcoreString());
        Json.write(model, ECoreAttribute.namee, this.name);
        return model;
    }
    duplicate(nameAppend = '_Copy', newParent = null) {
        const a = new M2Attribute(null, null);
        a.copy(this, nameAppend, newParent);
        return a;
    }
    replaceVarsSetup() { super.replaceVarsSetup(); }
    conformability(metaparent, outObj, debug) { return 1; }
}
//# sourceMappingURL=mmAttribute.js.map