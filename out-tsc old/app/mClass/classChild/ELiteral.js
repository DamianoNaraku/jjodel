import { Json, U, MAttribute, Typedd, Type, EcoreLiteral } from '../../common/Joiner';
export class ELiteral extends Typedd {
    constructor(parent, json) {
        super(parent, null);
        this.parse(json);
    }
    duplicate(nameAppend, newParent) {
        return undefined; //todo
    }
    generateModel() {
        const model = {};
        model[EcoreLiteral.value] = this.ordinal;
        model[EcoreLiteral.literal] = this.literal;
        model[EcoreLiteral.namee] = this.name;
        return model;
    }
    getClass() { return this.parent; }
    setLiteral(value, refreshGUI = false, warnDuplicateFix = true) {
        if (value === '' || !value) {
            this.literal = '';
            return;
        }
        return this.setName0(value, refreshGUI, warnDuplicateFix, 'literal', true);
    }
    parse(json, destructive = true) {
        this.ordinal = Json.read(json, EcoreLiteral.value, Number.NEGATIVE_INFINITY);
        this.setLiteral(Json.read(json, EcoreLiteral.literal, ''), false);
        let name = Json.read(json, EcoreLiteral.namee, this.ordinal === Number.NEGATIVE_INFINITY ? null : this.parent.name + '_' + this.ordinal);
        if (name)
            this.setName(name, false);
        else
            this.name = null;
    }
    delete(refreshgui = true) {
        super.delete(false);
        // todo: che fare con gli attributes che hanno questo literal come valore?
        let i;
        for (i = 0; i < Type.all.length; i++) {
            if (Type.all[i].enumType !== this.parent)
                continue;
            if (Type.all[i].owner instanceof MAttribute)
                Type.all[i].owner.valuesAutofix();
        }
        if (refreshgui)
            this.refreshGUI();
    }
    fieldChanged(e) {
        const html = e.currentTarget;
        switch (html.tagName.toLowerCase()) {
            default:
                U.pe(true, 'unexpected tag:', html.tagName, ' of:', html, 'in event:', e);
                break;
            case 'textarea':
            case 'input':
                const input = html;
                if (input.classList.contains('name')) {
                    this.setName(input.value);
                }
                else if (input.classList.contains('literal')) {
                    this.setLiteral(input.value);
                }
                else if (input.classList.contains('value')) {
                    this.ordinal = isNaN(+input.value) ? this.ordinal : +input.value;
                }
                else
                    U.pe(true, 'ELiteral input fields must contain one of the following classes: name, literal, value');
                break;
            case 'select':
                U.pe(true, 'Unexpected non-disabled select field in a Vertex.ELiteral.');
                break;
        }
        super.fieldChanged(e, true);
    }
    generateModelM1() { return this.name; }
}
//# sourceMappingURL=ELiteral.js.map