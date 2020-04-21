import { ECoreEnum, ELiteral, EType, IClassifier, Json, ShortAttribETypes, Type, U } from '../common/Joiner';
export class EEnum extends IClassifier {
    constructor(parent, json) {
        super(parent, null);
        if (this.parent) {
            U.ArrayAdd(this.parent.enums, this);
        }
        this.parse(json);
    }
    fullname() { return this.parent.name + '.' + this.name; }
    refreshGUI_Alone(debug = false) { this.getVertex().refreshGUI(); }
    addLiteral() {
        const attr = new ELiteral(this, null);
        if (attr.ordinal === Number.NEGATIVE_INFINITY)
            this.autofixEnumValues();
        this.refreshGUI();
        return attr;
    }
    parse(json, destructive) {
        /*
      <eClassifiers xsi:type="ecore:EEnum" name="EnumNamecustom" instanceTypeName="instanceTypeName"
          serializable="false">
        <eLiterals name="child2name" value="3" literal="child2literal"/>
        <eLiterals name="NameStr" literal="LiteralStr"/>
      </eClassifiers>*/
        // literal, name sono entrambi unici, ma è possibile che literal1.name === literal2.literal; .name è obbligatorio, .literal può essere null/empty
        this.childrens = [];
        this.instanceTypeName = '';
        let i;
        this.setName(Json.read(json, ECoreEnum.namee, 'Enum_1'), false);
        for (let key in json) {
            const value = json[key];
            switch (key) {
                default:
                    U.pe(true, 'Enum.parse() unexpected key:', key, 'in json:', json);
                    break;
                case ECoreEnum.xsitype:
                case ECoreEnum.namee: break;
                case ECoreEnum.eLiterals: break;
                case ECoreEnum.serializable:
                    this.serializable = value === 'true';
                    break;
                case ECoreEnum.instanceTypeName:
                    this.instanceTypeName = value + '';
                    break;
            }
        }
        const literals = Json.getChildrens(json);
        for (i = 0; i < literals.length; i++) {
            new ELiteral(this, literals[i]);
        }
        if (!this.childrens.length)
            new ELiteral(this, null);
        this.autofixEnumValues();
    }
    duplicate(nameAppend, newParent) {
        return undefined;
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
    generateModel() {
        const arr = [];
        const model = {};
        model[ECoreEnum.xsitype] = 'ecore:EEnum';
        model[ECoreEnum.namee] = this.name;
        model[ECoreEnum.serializable] = this.serializable ? "true" : "false";
        if (this.instanceTypeName)
            model[ECoreEnum.instanceTypeName] = this.instanceTypeName;
        model[ECoreEnum.eLiterals] = arr;
        let i;
        for (i = 0; i < this.childrens.length; i++) {
            arr.push(this.childrens[i].generateModel());
        }
        return model;
    }
    /*must remain private*/ autofixEnumValues() {
        // valori duplicati sono ammessi se esplicitamente inseriti, ma se il campo è vuoto io cerco di generarli
        let i;
        let valuesfound = {};
        let firsthole = 0;
        for (i = 0; i < this.childrens.length; i++) {
            const lit = this.childrens[i];
            if (lit.ordinal !== Number.NEGATIVE_INFINITY) {
                valuesfound[lit.ordinal] = true;
                if (lit.ordinal === firsthole) {
                    while (valuesfound[++firsthole]) {
                        ;
                    }
                } // update first hole.
                continue;
            }
            lit.ordinal = firsthole;
            if (!lit.name)
                lit.name = this.name + '_' + lit.ordinal;
        }
    }
    isChildLiteralTaken(s) {
        let i;
        for (i = 0; i < this.childrens.length; i++) {
            if (s === this.childrens[i].literal) {
                return true;
            }
        }
        return false;
    }
    delete(refreshgui = true) {
        const oldparent = this.parent;
        super.delete(false);
        if (oldparent)
            U.arrayRemoveAll(oldparent.enums, this);
        // todo: che fare con gli attributes che hanno questo enum come tipo? per ora cambio in stringa.
        let i = 0;
        for (i = 0; i < Type.all.length; i++) {
            if (Type.all[i].enumType !== this)
                continue;
            Type.all[i].changeType(null, EType.get(ShortAttribETypes.EString), null, null);
        }
        Type.updateTypeSelectors(null, false, false, true);
        this.getVertex().remove();
        if (refreshgui)
            this.refreshGUI();
    }
    getDefaultValueStr() { return this.childrens[0].name; }
    getAllowedValuesStr() {
        const arr = [];
        let i;
        for (i = 0; i < this.childrens.length; i++) {
            arr.push(this.childrens[i].name);
        }
        return arr;
    }
    getAllowedValuesInt() {
        const arr = [];
        let i;
        for (i = 0; i < this.childrens.length; i++) {
            arr.push(this.childrens[i].ordinal);
        }
        return arr;
    }
}
//# sourceMappingURL=EEnum.js.map