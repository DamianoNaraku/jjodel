import { U } from '../../../common/Joiner';
export class IField {
    constructor(logic) { this.logic = logic; }
    getHtml() { return this.html; }
    refreshGUI(debug = true) { }
    remove() {
        if (this.html && this.html.parentNode) {
            this.html.parentNode.removeChild(this.html);
        }
        this.logic.field = null;
        U.arrayRemoveAll(this.owner.fields, this);
    }
}
//# sourceMappingURL=iField.js.map