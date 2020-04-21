import { Json, U, ModelPiece, ECoreAnnotation, EAnnotationDetail } from '../common/Joiner';
export class EAnnotation extends ModelPiece {
    constructor(parent, json) {
        super(parent, null);
        if (this.parent) {
            U.arrayRemoveAll(this.parent.childrens, this);
            this.parent.annotations.push(this);
        }
        this.parse(json);
    }
    duplicate(nameAppend, newParent) {
        return undefined; // todo
    }
    fullname() { return this.parent.fullname() + '//' + this.name; }
    setReferencesStr() {
        // todo?? se è il main package diventa "#//"
    }
    prepareSerialize() { this.setReferencesStr(); }
    generateModel() {
        const json = {};
        this.prepareSerialize();
        let i;
        const childarr = [];
        for (i = 0; i < this.childrens.length; i++) {
            childarr.push(this.childrens[i].generateModel());
        }
        Json.write(json, ECoreAnnotation.source, this.name);
        Json.write(json, ECoreAnnotation.references, this.referencesStr);
        Json.write(json, ECoreAnnotation.details, childarr);
        return json;
    }
    getVertex() { return this.parent.getVertex(); }
    parse(json, destructive) {
        let key;
        this.childrens = [];
        if (!json) {
            json = {};
        }
        for (key in json) {
            const value = json[key];
            switch (key) {
                default:
                    U.pe(true, 'unexpected field in EAnnotation:  ' + key + ' => |' + value + '|');
                    break;
                case ECoreAnnotation.details: break;
                case ECoreAnnotation.references: break;
                case ECoreAnnotation.source: break;
            }
        }
        this.referencesStr = Json.read(json, ECoreAnnotation.source, '#/');
        this.setName(Json.read(json, ECoreAnnotation.name, 'EAnnotation_1'));
        const details = Json.getDetails(json);
        for (let i = 0; i < details.length; i++) {
            new EAnnotationDetail(this, details[i]);
        }
    }
    refreshGUI_Alone(debug) {
        const v = this.getVertex();
        if (v)
            v.refreshGUI();
    }
}
//# sourceMappingURL=EAnnotation.js.map