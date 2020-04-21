import { Json, U, ModelPiece } from '../common/Joiner';
import { ECoreDetail } from './iModel';
export class EAnnotationDetail extends ModelPiece {
    constructor(parent, json) {
        super(parent, null);
        this.parse(json);
    }
    duplicate(nameAppend, newParent) {
        return undefined; // todo
    }
    fullname() { return this.parent.fullname() + '.' + this.name; }
    generateModel() {
        const json = {};
        if (this.name !== null)
            Json.write(json, ECoreDetail.key, this.name);
        if (this.value !== null)
            Json.write(json, ECoreDetail.value, this.value);
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
                    U.pe(true, 'unexpected field in EDetail:  ' + key + ' => |' + value + '|');
                    break;
                case ECoreDetail.key: break;
                case ECoreDetail.value: break;
            }
        }
        this.value = Json.read(json, ECoreDetail.value, '');
        this.setName(Json.read(json, ECoreDetail.key, 'DetailKey1'));
    }
    refreshGUI_Alone(debug) { return this.parent.refreshGUI_Alone(); }
}
//# sourceMappingURL=EAnnotationDetail.js.map