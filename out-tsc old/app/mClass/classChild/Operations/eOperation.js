import { AttribETypes, ECoreOperation, EParameter, Typedd, Info, Json, M2Class, M3Class, U } from '../../../common/Joiner';
// export abstract class EOperation extends Typedd {}
/*
export class OperationVisibility {
  static public = 'public';
  static private = 'private';
  static protected = 'protected';
  static internal = 'internal';
  static protectedinternal = 'protected internal';
  static protectedprivate = 'protected private'; }*/
export var OperationVisibility;
(function (OperationVisibility) {
    OperationVisibility["public"] = "public";
    OperationVisibility["private"] = "private";
    OperationVisibility["protected"] = "protected";
    OperationVisibility["internal"] = "internal";
    OperationVisibility["package"] = "package";
    OperationVisibility["protectedinternal"] = "protected internal";
    OperationVisibility["protectedprivate"] = "protected private";
})(OperationVisibility || (OperationVisibility = {}));
export class EOperation extends Typedd {
    // exceptions: IClass[];
    // todo: ha davvero senso processarli e creare anche IClass.Object etc? mi conviene tenerli a stringa.
    constructor(parent, json) {
        super(parent, null);
        this.visibility = OperationVisibility.private;
        this.detailIsOpened = false && false;
        if (parent instanceof M2Class)
            parent.operations.push(this);
        this.parse(json);
    }
    getVisibilityChar() {
        switch (this.visibility) {
            case OperationVisibility.public: return '+';
            case OperationVisibility.private: return '-';
            case OperationVisibility.protected: return '#';
            case OperationVisibility.internal:
            case OperationVisibility.package: return '~';
            case OperationVisibility.protectedinternal: return '#~';
            case OperationVisibility.protectedprivate: return '#-';
            default: return '?';
        }
    }
    getClass() { return this.parent; }
    conformability(metaparent, outObj, debug) { U.pe(true, 'operation.conformability()'); return 0; }
    duplicate(nameAppend = '_Copy', newParent = null) {
        const c = new EOperation(this.parent, null);
        c.copy(this);
        return c;
    }
    copy(c, nameAppend = '_Copy', newParent = null) {
        super.copy(c, nameAppend, newParent);
        this.exceptionsStr = c.exceptionsStr;
        //// set childrens
        // this.arguments = []; for (i = 0; i < this.childrens.length; i++) { U.ArrayAdd(this.arguments, this.childrens[i]); }
        this.refreshGUI();
    }
    generateModel() {
        const parameters = [];
        const json = {};
        json[ECoreOperation.eParameters] = parameters;
        /*
                            "_name": "EExceptionNameCustom",
                            "_ordered": "false",
                            "_unique": "false",
                            "_lowerBound": "5",
                            "_upperBound": "7",
                            "_eType": "#//Casa",
                            "_eExceptions": "#//Casa #//League ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt",
                            "eParameters": [ ]*/
        Json.write(json, ECoreOperation.namee, this.name);
        Json.write(json, ECoreOperation.eType, this.getType().toEcoreString());
        Json.write(json, ECoreOperation.lowerBound, '' + this.lowerbound);
        Json.write(json, ECoreOperation.upperBound, '' + this.upperbound);
        Json.write(json, ECoreOperation.eexceptions, this.exceptionsStr);
        Json.write(json, ECoreOperation.ordered, '' + this.ordered);
        Json.write(json, ECoreOperation.unique, '' + this.unique);
        let i;
        for (i = 0; i < this.childrens.length; i++) {
            parameters.push(this.childrens[i].generateModel());
        }
        return json;
    }
    getInfo(toLower = false) {
        const info = super.getInfo(toLower);
        Info.unset(info, 'instances');
        Info.rename(info, 'type', 'returnType');
        Info.rename(info, 'typeDetail', 'returnTypeDetail');
        return info;
    }
    parse(json, destructive) {
        this.setName((this.parent instanceof M3Class) ? 'Operation' : Json.read(json, ECoreOperation.namee, 'Func_1'));
        this.setType(Json.read(json, ECoreOperation.eType, AttribETypes.void));
        this.setLowerbound(+Json.read(json, ECoreOperation.lowerBound, 'NAN_Trigger'));
        this.setUpperbound(+Json.read(json, ECoreOperation.upperBound, 'NAN_Trigger'));
        this.exceptionsStr = Json.read(json, ECoreOperation.eexceptions, '');
        this.ordered = 'true' === '' + Json.read(json, ECoreOperation.ordered, 'false');
        this.unique = 'true ' === '' + Json.read(json, ECoreOperation.unique, 'false');
        this.visibility = OperationVisibility.package;
        const parameters = Json.getChildrens(json, false);
        let i;
        for (i = 0; i < parameters.length; i++) {
            const param = new EParameter(this, parameters[i]);
            // U.ArrayAdd(this.arguments, param);
            U.ArrayAdd(this.childrens, param);
        } /*
      this.views = [];
      for(i = 0; i < this.parent.views.length; i++) {
        const pv: ClassView = this.parent.views[i];
        const v = new OperationView(pv);
        this.views.push(v);
        pv.operationViews.push(v); }*/
        /*  https://codebeautify.org/xmltojson
                    "Operations": [ {
                            "_name": "EExceptionNameCustom",
                            "_ordered": "false",
                            "_unique": "false",
                            "_lowerBound": "5",
                            "_upperBound": "7",
                            "_eType": "#//Casa",
                            "_eExceptions": "#//Casa #//League ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt" },
                        {
                            "eParameters": [
                                {
                                    "_eType": "#//Casa"
                                },
                                {
                                    "eAnnotations": {
                                        "_source": "annotationtext",
                                        "_references": "#//Umano/anni #//Umano/Attribute_1"
                                    },
                                    "_name": "dbl",
                                    "_ordered": "false",
                                    "_unique": "false",
                                    "_lowerBound": "1",
                                    "_upperBound": "2",
                                    "_eType": "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble"
                                }
                            ],
                            "_name": "operationDam"
                        }
                    ],*/
    }
    getSignature(maxarguments = Number.POSITIVE_INFINITY) {
        let parameterStr = '';
        maxarguments = Math.min(maxarguments, this.childrens.length);
        let i;
        const debug = true;
        const separator = ', ';
        for (i = 0; i < maxarguments; i++) {
            if (i !== 0) {
                parameterStr += separator;
            }
            U.pif(debug, 'parameter[' + i + '] = ', this.childrens[i]);
            U.pif(debug, 'parameterStr: |' + parameterStr + '| --> |' + parameterStr + this.childrens[i].getType().toShortString() + '|');
            parameterStr += this.childrens[i].getType().toShortString();
        }
        return parameterStr;
    }
    setSignatureHtml(html, separator, maxargumentchars = null, maxarguments = null) {
        const debug = false && true;
        maxargumentchars = isNaN(+maxargumentchars) ? 10 : +maxargumentchars;
        maxarguments = isNaN(+maxarguments) ? 2 : +maxarguments;
        const fixName = (s) => {
            U.pif(debug, 'fixname: |' + s + '| --> |' + s.substring(0, maxargumentchars - 1) + '…|');
            if (s.length > maxargumentchars) {
                return s.substring(0, maxargumentchars - 1) + '…';
            }
            return s;
        };
        let i;
        let parameterStr = this.getSignature(maxarguments);
        U.pif(debug, 'finalSignature: ', this.getVisibilityChar(), fixName(this.name), parameterStr, fixName(this.type.toShortString()), this);
        // todo: innerText is not standard, switch to textContent
        html.innerHTML = '&nbsp'; // == ' '
        html.textContent += this.getVisibilityChar() + '' + fixName(this.name) + '(' + parameterStr + ') → ' // → ⇒
            + this.type.toShortString();
        html.dataset.visibility = this.visibility;
        html.dataset.exceptions = this.exceptionsStr;
    }
    // getReturnType(): EParameter { return this.getFakeReturnTypeParameter(); }
    /*
      getFakeReturnTypeParameter(): EParameter {
        const fake: EParameter = new EParameter(null, null);
        U.arrayRemoveAll(this.childrens, fake);
        fake.parent = this; // can travel fake -> original, can't original -> fake.
        fake.id = this.id;
        fake.ordered = this.ordered;
        fake.unique = this.unique;
        fake.setLowerbound(this.getLowerbound());
        fake.setUpperbound(this.getUpperbound());
        fake.setType(this.getType().toEcoreString());
        fake.name = '';
        return fake; }*/
    addParameter() {
        const p = new EParameter(this, null);
        U.ArrayAdd(this.childrens, p);
        return p;
    }
}
EOperation.counter = 0;
//# sourceMappingURL=eOperation.js.map