import { ModelPiece, XMIModel, Status, ECoreClass, ECorePackage, ECoreRoot, ECoreOperation, ECoreAnnotation, ECoreEnum } from './Joiner';
export class Dictionary extends Object {
}
import * as detectzoooom from 'detect-zoom'; // https://github.com/tombigel/detect-zoom broken 2013? but works
export class myFileReader {
    // constructor(onchange: (e: ChangeEvent) => void = null, fileTypes: FileReadTypeEnum[] | string[] = null) { myFileReader.setinfos(fileTypes, onchange); }
    static setinfos(fileTypes = null, onchange, readcontent) {
        myFileReader.fileTypes = (fileTypes || myFileReader.fileTypes);
        console.log('fileTypes:', myFileReader.fileTypes, fileTypes);
        myFileReader.input = document.createElement('input');
        const input = myFileReader.input;
        myFileReader.onchange = function (e) {
            if (!readcontent) {
                onchange(e, input.files, null);
                return;
            }
            let contentObj = {};
            let fileLetti = 0;
            for (let i = 0; i < input.files.length; i++) {
                const f = input.files[i];
                console.log('filereadContent[' + i + ']( file:', f, ')');
                U.fileReadContent(f, (content) => {
                    console.log('file[' + i + '] read complete. done: ' + (1 + fileLetti) + ' / ' + input.files.length, 'contentObj:', contentObj);
                    contentObj[i] = content; // cannot use array, i'm not sure the callbacks will be called in order. using push is safer but could alter order.
                    // this is last file to read.
                    if (++fileLetti === input.files.length) {
                        const contentArr = [];
                        for (let j = 0; j < input.files.length; j++) {
                            contentArr.push(contentObj[j]);
                        }
                        onchange(e, input.files, contentArr);
                    }
                });
            }
        } || myFileReader.onchange;
    }
    static reset() {
        myFileReader.fileTypes = null;
        myFileReader.onchange = null;
        myFileReader.input = null;
    }
    static show(onChange, extensions = null, readContent) {
        myFileReader.setinfos(extensions, onChange, readContent);
        myFileReader.input.setAttribute('type', 'file');
        if (myFileReader.fileTypes) {
            let filetypestr = '';
            const sepkey = U.getStartSeparatorKey();
            for (let i = 0; i < myFileReader.fileTypes.length; i++) {
                filetypestr += U.startSeparator(sepkey, ',') + myFileReader.fileTypes[i];
            }
            myFileReader.input.setAttribute('accept', filetypestr);
        }
        console.log('fileTypes:', myFileReader.fileTypes, 'input:', myFileReader.input);
        $(myFileReader.input).on('change.custom', myFileReader.onchange).trigger('click');
        myFileReader.reset();
    }
}
export class FocusHistoryEntry {
    constructor(e, element = null, time = null) {
        this.evt = e;
        this.element = element || e.target;
        this.time = time || new Date();
    }
}
export class InputPopup {
    constructor(title, txtpre, txtpost, event /* array of (['oninput', onInputFunction])*/, placeholder = null, value, inputType = 'input', inputSubType = null, onsuccess) {
        this.validators = [];
        this.valid = false;
        const value0 = value;
        if (!value) {
            value = '';
        }
        this.onsuccess = onsuccess ? onsuccess : [];
        const id = 'popup_' + InputPopup.popupCounter++;
        placeholder = (placeholder ? 'placeholder="' + placeholder + '"' : '');
        inputSubType = (inputSubType ? 'type = "' + inputSubType + '"' : '');
        let innerValue;
        if (inputType.toLowerCase() === 'textarea') {
            innerValue = U.replaceAll(U.replaceAll(value, '<', '&lt;'), '>', '&gt;');
            innerValue += '</' + inputType + '>';
            value = '';
        }
        else {
            value = value === '' ? '' : 'value="' + U.replaceAll(value, '"', '&quot;') + '"';
            innerValue = '';
        }
        const container = U.toHtml('' +
            '<div _ngcontent-c3="" data-closebuttontarget="' + id + '" class="screenWideShadow" style="display: none;">' +
            '<div _ngcontent-c3="" class="popupContent">' +
            '<h1 _ngcontent-c3="" style="text-align: center;">' + title + '</h1>' +
            '<button _ngcontent-c3="" class="closeButton" data-closebuttontarget="' + id + '">X</button>' +
            '<br _ngcontent-c3="">' +
            '<div _ngcontent-c3="" class="TypeList">' +
            '<table class="typeTable"><tbody>' +
            '<tr class="typeRow"><td class="alias textPre">' + txtpre + '</td>' +
            '<' + inputType + ' ' + inputSubType + ' ' + placeholder + ' ' + value + ' class="form-control popupInput" ' +
            'aria-label="Small" aria-describedby="inputGroup-sizing-sm">' + innerValue + txtpost +
            '</td>' +
            '</tr>' +
            '<tr><td class="errors" style="display: none;"></td></tr>' +
            '</tbody></table></div>' +
            '</div></div>');
        U.closeButtonSetup($(container));
        this.events = event;
        this.html = container;
        if (inputType === 'textarea') {
            this.getInputNode()[0].setAttribute('style', 'width: calc(75vw - 152px); height: calc(75vh - 200px);');
        }
        this.show();
    }
    getInputNode() { return $(this.html).find('.popupInput'); }
    defaultBlurEvt(e) { this.inputted(); }
    defaultKeydownEvt(e, input = null) {
        input = input || this.getInputNode()[0];
        if (e.key === 'escape') {
            input.innerText = ''; // if contenteditable
            input.value = '';
        }
        if (e.key === 'return') {
            this.inputted();
        }
    }
    inputted(input = null) {
        input = input || this.getInputNode()[0];
        const value = this.getValue(input);
        let i;
        let valid = true;
        for (i = 0; this.validators && i < this.validators.length; i++) {
            const valentry = this.validators[i];
            if (!valentry)
                continue;
            console.log('this:', this, 'input:', input, 'value:', value);
            if (!valentry.validatorCallback(value, input)) {
                this.setErrText(valentry.errormsg);
                valid = false;
            }
        }
        this.valid = valid;
        if (!valid)
            return;
        for (i = 0; this.onsuccess && i < this.onsuccess.length; i++) {
            if (this.onsuccess[i])
                this.onsuccess[i](this.getValue(input), input);
        }
        this.destroy();
    }
    getValue(inputnode = null) {
        inputnode = inputnode || this.getInputNode()[0];
        let value;
        if (inputnode['' + 'value']) {
            return inputnode['' + 'value'];
        }
        // if (inputnode.hasAttribute('value')) value = inputnode.getAttribute('value');
        else
            value = inputnode.innerText;
        return value;
    }
    show(addDefaultEvents = true) {
        let i = -1;
        const $input = this.getInputNode();
        while (this.events && ++i < this.events.length) {
            const currentEvt = this.events[i];
            if (!currentEvt)
                continue;
            $input.on(currentEvt[0], currentEvt[1]);
        }
        if (addDefaultEvents) {
            $input.off('keydown.defaultvalidate').on('keydown.defaultvalidate', (e) => { this.defaultKeydownEvt(e); });
            $input.off('blur.defaultvalidate').on('blur.defaultvalidate', (e) => { this.defaultBlurEvt(e); });
            // $input.off('change.defaultvalidate').on('change.defaultvalidate', (e: BlurEvent) => {this.defaultChangeEvt(e)});
            this.validators.push({ validatorCallback: (value, input) => {
                    const pattern = input.getAttribute('pattern');
                    if (!pattern)
                        return true;
                    const regex = new RegExp(pattern);
                    console.log('validating pattern:', regex, pattern, value);
                    console.log(value);
                    return regex.test(value);
                }, errormsg: 'pattern violated.' });
        }
        document.body.appendChild(this.html);
        this.html.style.display = 'block';
    }
    hide() { this.html.style.display = 'none'; }
    destroy() {
        if (this.html && this.html.parentNode) {
            this.html.parentNode.removeChild(this.html);
            return this.html = null;
        }
    }
    addOkButton(load1, finish) {
        const input = this.getInputNode()[0];
        const button = document.createElement('button');
        button.innerText = 'Confirm';
        const size = U.sizeof(button);
        button.style.left = 'calc( 50% - ' + size.w / 2 + 'px);';
        input.parentNode.appendChild(button);
        $(button).on('click.btnclickpopup', finish);
    }
    setPostText(str) { $(this.html).find('.textPre')[0].innerHTML = str; }
    setErrText(str) {
        U.pw(true, str);
        /*
        const $err = $(this.html).find('.errors');
        if (!str) { $err.hide(); return; }
        $err.show();
        $err[0].innerHTML = str; */
    }
    setValidation(validatorCallback, errormsg) {
        if (validatorCallback)
            this.validators.push({ validatorCallback: validatorCallback, errormsg: errormsg });
    }
}
InputPopup.popupCounter = 0;
export var ShortAttribETypes;
(function (ShortAttribETypes) {
    ShortAttribETypes["void"] = "void";
    ShortAttribETypes["EChar"] = "Echar";
    ShortAttribETypes["EString"] = "EString";
    ShortAttribETypes["EDate"] = "EDate";
    ShortAttribETypes["EFloat"] = "EFloat";
    ShortAttribETypes["EDouble"] = "EDouble";
    ShortAttribETypes["EBoolean"] = "EBoolean";
    ShortAttribETypes["EByte"] = "EByte";
    ShortAttribETypes["EShort"] = "EShort";
    ShortAttribETypes["EInt"] = "EInt";
    ShortAttribETypes["ELong"] = "ELong";
    /*
    ECharObj  = 'ECharObj',
    EStringObj  = 'EStringObj',
    EDateObj  = 'EDateObj',
    EFloatObj  = 'EFloatObj',
    EDoubleObj  = 'EDoubleObj',
    EBooleanObj = 'EBooleanObj',
    EByteObj  = 'EByteObj',
    EShortObj  = 'EShortObj',
    EIntObj  = 'EIntObj',
    ELongObj  = 'ELongObj',
    EELIST  = 'EELIST',*/
})(ShortAttribETypes || (ShortAttribETypes = {}));
export class EvalOutput {
}
export class U {
    // todo: move @ start
    static checkDblClick() {
        const now = new Date().getTime();
        const old = U.dblclickchecker;
        U.dblclickchecker = now;
        console.log('dblclick time:', now - old, now, old);
        return (now - old <= U.dblclicktimerms);
    }
    static remove(x) { if (x.parentElement)
        x.parentElement.removeChild(x); }
    static EvalContext(context, str, allowContextEvalEdit) {
        U.EC_TmpAllowcontextEvalEdit = allowContextEvalEdit;
        U.EC_ParStr = str;
        U.EC_TmpParContext = context;
        U.EC_TmpAllowcontextEvalEdit = allowContextEvalEdit;
        U.EC_ret = undefined;
        U.EC_exception = null;
        delete this['str'];
        delete this['context'];
        delete this['allowContextEvalEdit'];
        for (U.EC_TmpKey in U.EC_TmpParContext) {
            this['' + U.EC_TmpKey] = U.EC_TmpParContext['' + U.EC_TmpKey];
        }
        try {
            U.EC_ret = eval(U.EC_ParStr);
        }
        catch (e) {
            U.EC_exception = e;
        }
        if (!U.EC_TmpAllowcontextEvalEdit)
            return;
        for (U.EC_TmpKey in this) {
            U.EC_TmpParContext['' + U.EC_TmpKey] = this['' + U.EC_TmpKey];
        }
    }
    static evalInContext(context, str, allowcontextEvalEdit = true) {
        const out = new U.EvalContext(context, str, allowcontextEvalEdit);
        const ret = {};
        ret.outContext = allowcontextEvalEdit ? context : out;
        ret.return = U.EC_ret;
        ret.exception = U.EC_exception;
        return ret;
    }
    static firstToUpper(s) {
        if (!s || s === '')
            return s;
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
    static fileReadContent(file, callback) {
        const textType = /text.*/;
        try {
            if (!file.type || file.type.match(textType)) {
                let reader = new FileReader();
                reader.onload = function (e) { callback('' + reader.result); };
                reader.readAsText(file);
                return;
            }
        }
        catch (e) {
            U.pe(true, "Exception while trying to read file as text. Error: |", e, "|", file);
        }
        U.pe(true, "Wrong file type found: |", file ? file.type : null, "|", file);
    }
    static fileRead(onChange, extensions = null, readContent) {
        myFileReader.show(onChange, extensions, readContent);
    }
    static textToSvg(str) { return U.textToSvgArr(str)[0]; }
    static textToSvgArr(str) {
        if (!U.varTextToSvg) {
            U.varTextToSvg = U.newSvg('svg');
        }
        U.varTextToSvg.innerHTML = str;
        const ret = [];
        let i;
        for (i = 0; i < U.varTextToSvg.childNodes.length; i++) {
            ret.push(U.varTextToSvg.childNodes[i]);
        }
        return ret;
    }
    static addCss(key, str, prepend = true) {
        const css = document.createElement('style');
        css.innerHTML = str;
        const old = U.addCssAvoidDuplicates[key];
        if (old) {
            old.parentNode.removeChild(old);
        }
        U.addCssAvoidDuplicates[key] = css;
        if (prepend) {
            document.head.prepend(css);
        }
        else {
            document.head.append(css);
        }
    }
    static clear(htmlNode) {
        while (htmlNode.firstChild) {
            htmlNode.removeChild(htmlNode.firstChild);
        }
    }
    static clearAllTimeouts() {
        const highestTimeoutId = setTimeout(() => { }, 1);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }
    }
    static petmp(b, s, ...restArgs) { return U.pe(b, s, restArgs); }
    static pe(b, s, ...restArgs) {
        if (!b) {
            return null;
        }
        if (restArgs === null || restArgs === undefined) {
            restArgs = [];
        }
        let str = 'Error:' + s + '';
        console.error('pe[0/' + (restArgs.length + 1) + ']: ', s);
        for (let i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'pe[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
            console.error('pe[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
        }
        if (!U.production) {
            alert(str);
        }
        else
            U.pw(true, s, ...restArgs);
        return b['@makeMeCrash']['@makeMeCrash'];
    }
    static pw(b, s, ...restArgs) {
        if (!b) {
            return null;
        }
        if (restArgs === null || restArgs === undefined) {
            restArgs = [];
        }
        console['' + 'trace']();
        let str = 'Warning:' + s + '';
        console.warn('pw[0/' + (restArgs.length + 1) + ']: ', s);
        for (let i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
            console.warn('pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
        }
        U.bootstrapPopup(str, 'warning', 5000);
        // s = (((b as unknown) as any[])['@makeMeCrash'] as any[])['@makeMeCrash'];
        return str;
    }
    static ps(b, s, ...restArgs) {
        if (!b) {
            return null;
        }
        if (restArgs === null || restArgs === undefined) {
            restArgs = [];
        }
        let str = s + '';
        console.info('ps[0/' + (restArgs.length + 1) + ']: ', s);
        for (let i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'ps[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ' + s + '\t\t\r\n';
            console.info('pw[' + (i + 1) + '/' + (restArgs.length + 1) + ']: ', s);
        }
        U.bootstrapPopup(str, 'success', 3000);
        // s = (((b as unknown) as any[])['@makeMeCrash'] as any[])['@makeMeCrash'];
        return str;
    }
    static pif(b, s, ...restArgs) {
        if (!b) {
            return null;
        }
        if (restArgs === null || restArgs === undefined) {
            restArgs = [];
        }
        let str = 'p: ' + s;
        console.info('p:', s);
        for (let i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'p[' + (i + 1) + '/' + restArgs.length + ']: ' + s + '\t\t\r\n';
            console.info('p[' + (i + 1) + '/' + restArgs.length + ']: ', s);
        }
        // alert(str);
        return str;
    }
    static p(s, ...restArgs) {
        if (restArgs === null || restArgs === undefined) {
            restArgs = [];
        }
        let str = 'p: ' + s;
        console.info('p:', s);
        for (let i = 0; i < restArgs.length; i++) {
            s = restArgs[i];
            str += 'p[' + (i + 1) + '/' + restArgs.length + ']: ' + s + '\t\t\r\n';
            console.info('p[' + (i + 1) + '/' + restArgs.length + ']: ', s);
        }
        // alert(str);
        return str;
    }
    static bootstrapPopup(innerhtmlstr, color, timer) {
        const div = document.createElement('div');
        if (!U.$alertcontainer) {
            U.alertcontainer = document.createElement('div');
            U.alertcontainer.classList.add('alertcontainer');
            document.body.appendChild(U.alertcontainer);
            U.$alertcontainer = $(U.alertcontainer);
        }
        const container = U.alertcontainer;
        const $container = U.$alertcontainer;
        const $div = $(div);
        container.appendChild(div);
        div.classList.add('alertshell');
        document.body.appendChild(container);
        div.setAttribute('role', 'alert');
        const alertMargin = document.createElement('div');
        alertMargin.innerHTML = innerhtmlstr;
        alertMargin.classList.add('alert');
        alertMargin.classList.add('alert-' + color);
        div.appendChild(alertMargin);
        const end = () => { $div.slideUp(400, () => { container.removeChild(div); }); };
        $div.hide().slideDown(200, () => setTimeout(end, timer));
    }
    static cloneHtml(html, deep = true, defaultIDNum = 1) {
        const clone = html.cloneNode(deep);
        const getLastNum = (str) => {
            let pos = str.length;
            while (--pos > 0 && !isNaN(+str.charAt(pos))) { }
            const numstr = (str.substring(pos));
            return isNaN(+numstr) ? defaultIDNum : +numstr;
        };
        if (!clone.id) {
            return clone;
        }
        let lastnum = getLastNum(clone.id) - 1;
        const tmpID = clone.id + (clone.id.indexOf('_Clone') === -1 ? '_Clone' : '');
        while (document.getElementById(tmpID + (++lastnum))) { }
        clone.id = tmpID + lastnum;
        return clone;
    }
    static clearAttributes(node) {
        let j;
        for (j = 0; j < node.attributes.length; j++) {
            node.removeAttribute(node.attributes[j].name);
        }
    }
    static cloneObj(o) {
        // const r: HTMLElement = document.createElement(o.tagName);
        // r.innerHTML = o.innerHTML;
        // U.pe( o as HTMLElement !== null, 'non utilizzabile su html');
        return JSON.parse(JSON.stringify(o));
        // todo: questa funzione non può clonare html. allow cloneObj of circular objects.
    }
    static cloneObj2(o) {
        U.pe(true, 'todo: dovrebbe fare una deep copy copiando anche le funzioni (cosa che json.stringify non fa).');
        return null;
    }
    static loadScript(path, useEval = false) {
        const script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        U.pe(useEval, 'useEval: todo. potrebbe essere utile per avviare codice fuori dalle funzioni in futuro.');
        document.body.append(script);
    }
    static newSvg(type) {
        return document.createElementNS('http://www.w3.org/2000/svg', type);
    }
    static replaceVars(obj, html0, cloneHtml = true, debug = false) {
        const html = cloneHtml ? U.cloneHtml(html0) : html0;
        /// see it in action & parse or debug at
        // v1) perfetto ma non supportata in jscript https://regex101.com/r/Do2ndU/1
        // v2) usata: aggiustabile con if...substring(1). https://regex101.com/r/Do2ndU/3
        // get text between 2 single '$' excluding $$, so they can be used as escape character to display a single '$'
        // console.log('html0:', html0, 'html:', html);
        U.pe(!(html instanceof Element), 'target must be a html node.', html, html0);
        html.innerHTML = U.replaceVarsString(obj, html.innerHTML, debug);
        U.pif(debug, 'ReplaceVars() return = ', html.innerHTML);
        return html;
    }
    static replaceVarsString0(obj, str, escapeC = null, replacer = null, debug = false) {
        U.pe(escapeC && !replacer, 'replacer cannot be null if escapeChar is defined.');
        U.pe(replacer && !escapeC, 'escapeChar cannot be null if replacer is defined');
        if (!escapeC && !replacer) {
            escapeC = replacer = [];
        }
        U.pe(escapeC.length !== replacer.length, 'replacer and escapeChar must be arrays of the same length');
        str = str.replace(/(^\$|(((?!\$).|^))[\$](?!\$))(.*?)(^\$|((?!\$).|^)[\$](?!\$))/gm, (match, capture) => {
            // console.log('matched:', match, 'capture: ', capture);
            if (match === '$') {
                return '';
            }
            let prefixError = '';
            if (match.charAt(0) !== '$') {
                prefixError = match.charAt(0);
                match = match.substring(1);
            }
            // # = default value: {asHtml = true, isbase64 = false}
            const asHtml = match.charAt(1) === '1' || match.charAt(1) !== '#';
            const isBase64 = match.charAt(2) === '1' || match.charAt(2) !== '#';
            const varname = match.substring(3, match.length - 1);
            const debugtext = varname + '(' + match + ')';
            U.pif(debug, 'match:', match);
            const resultarr = U.replaceSingleVar(obj, varname, isBase64, false);
            let result = resultarr[resultarr.length - 1].value;
            if (result !== '' + result) {
                try {
                    result = JSON.stringify(result);
                }
                catch (e) {
                    result = '{_Cyclic object_}';
                }
            }
            let i = -1;
            U.pif(debug, 'replaceSingleVar: ', match, ', arr', resultarr, ', ret', result, ', this:', obj);
            if (!asHtml) {
                while (++i < escapeC.length) {
                    result = U.replaceAll(result, escapeC[i], replacer[i]);
                }
            }
            U.pif(debug, 'replaceSingleVar: ' + debugtext + ' --> ' + result + ' --> ' + prefixError, result, obj);
            if (U.isObject(result)) { }
            return prefixError + result;
        });
        return str;
    }
    static replaceVarsString(obj, htmlStr, debug = false) {
        U.pe(!obj || !htmlStr, 'parameters cannot be null. obj:', obj, ', htmlString:', htmlStr);
        //  https://stackoverflow.com/questions/38563414/javascript-regex-to-select-quoted-string-but-not-escape-quotes
        //  good regex fatto da me https://regex101.com/r/bmWVrp/4
        // only replace content inside " quotes. (eventually escaping ")
        htmlStr = U.QuoteReplaceVarString(obj, htmlStr, '"', debug);
        // only replace content inside ' quotes. (eventually escaping ')
        htmlStr = U.QuoteReplaceVarString(obj, htmlStr, '\'', debug);
        // replaces what's left outside any quotation. (eventually escaping <>)
        htmlStr = U.replaceVarsString0(obj, htmlStr, ['<', '>'], ['&lt;', '&gt;']); // check here aaaaaaaaaaaaaa $$$$$$$$$$$
        return htmlStr;
    }
    static QuoteReplaceVarString(obj, htmlStr, quote, debug = false) {
        U.pe(quote !== '"' && quote !== '\'', 'the only quote supported are single chars " and \'.');
        const quoteEscape = quote === '&quot;' ? '' : '&#39;'; // '\\' + quote;
        // todo: dovrei anche rimpiazzare & with &amp; per consentire input &something; trattati come stringhe.
        // ""|(:?[^\\](?!"")|^)((:?\\\\)*\"(:?.*?[^\\"]+){0,1}(:?\\\\)*\")
        // '""|(:?[^\\](?!"")|^)((:?\\\\)*\"(:?.*?[^\\"]+){0,1}(:?\\\\)*\")'
        // let regex = /""|(:?[^\\](?!"")|^)((:?\\\\)*\"(:?.*?[^\\"]+){0,1}(:?\\\\)*\")/;
        let regexStr = '""|(:?[^\\\\](?!"")|^)((:?\\\\\\\\)*\\"(:?.*?[^\\\\"]+){0,1}(:?\\\\\\\\)*\\")';
        if (quote !== '"') {
            regexStr = U.replaceAll(regexStr, '"', '\'');
        }
        const quoteRegex = new RegExp(regexStr, 'g'); // new RegExp("a", "b"); === /a/b
        htmlStr = htmlStr.replace(quoteRegex, (match, capture) => {
            const start = match.indexOf(quote);
            const end = match.lastIndexOf(quote);
            const content = U.replaceVarsString0(obj, match.substring(start + 1, end), [quote], [quoteEscape], debug);
            const ret = match.substring(0, start + 1) + content + match.substring(end);
            U.pif(debug, 'replaceQuotedVars: match: |' + match + '| --> |' + content + '| --> |' + ret + '| html:', htmlStr, 'capt:', capture);
            return ret;
        });
        return htmlStr;
    }
    //todo: da rimuovere, è stata completamente superata dal nuovo return type array di replaceSingleVar
    static replaceSingleVarGetParentAndChildKey(obj, fullpattern, canThrow = false) {
        const ret = { parent: null, childkey: null };
        let targetPatternParent;
        const pos = fullpattern.indexOf('.');
        const isBase64 = fullpattern.charAt(2) === '1' || fullpattern.charAt(2) !== '#';
        U.pe(isBase64, 'currently this method does not support base64 encoded templates. the conversion is still to do.', fullpattern);
        if (pos === -1) {
            ret.parent = obj;
            ret.childkey = fullpattern.substring(3, fullpattern.length - 1);
            return ret;
        }
        try {
            targetPatternParent = fullpattern.substring(0, pos) + '$';
            const tmparr = U.replaceSingleVarRaw(obj, targetPatternParent);
            ret.parent = tmparr[tmparr.length - 1].value;
            ret.childkey = fullpattern.substring(pos + 1, fullpattern.length - 1);
        }
        catch (e) {
            U.pw(true, 'replaceSingleVarGetParentAndChildKey failed. fullpattern: |' + fullpattern + '| targetPatternParent: |'
                + targetPatternParent + '| obj: ', obj, ' reason: ', e);
            return null;
        }
        return ret;
    }
    static replaceSingleVarRaw(obj, fullpattern, canThrow = false) {
        fullpattern = fullpattern.trim();
        const isBase64 = fullpattern.charAt(2) === '1' || fullpattern.charAt(2) !== '#';
        const varName = fullpattern.substring(3, fullpattern.length - 1);
        return U.replaceSingleVar(obj, varName, isBase64, canThrow);
    }
    static replaceSingleVar(obj, varname, isBase64, canThrow = false) {
        const debug = false;
        const showErrors = false;
        let debugPathOk = '';
        if (isBase64) {
            varname = atob(varname);
        }
        let requestedValue = obj;
        const fullpath = varname;
        const tokens = varname.split('.'); // varname.split(/\.,/);
        const ret = [];
        let j;
        let token = null;
        for (j = 0; j < tokens.length; j++) {
            ret.push({ token: token === null ? 'this' : token, value: requestedValue });
            token = tokens[j];
            U.pif(debug || showErrors, 'replacer: obj[req] = ', requestedValue, '[', token, '] =', (requestedValue ? requestedValue[token] : ''));
            if (requestedValue === null || requestedValue === undefined) {
                U.pe(showErrors, 'requested null or undefined:', obj, ', canthrow ? ', canThrow, ', fillplath:', fullpath);
                if (canThrow) {
                    U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. object = ', obj);
                    throw new DOMException('replace_Vars.WrongVariablePath', 'replace_Vars.WrongVariablePath');
                }
                else {
                    U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. ovjet = ', obj);
                }
                ret.push({ token: token, value: 'Error: ' + debugPathOk + '.' + token + ' = ' + undefined });
                // ret.push({token: token, value: requestedValue});
                return ret;
            }
            else {
                debugPathOk += (debugPathOk === '' ? '' : '.') + token;
            }
            ////
            if (requestedValue instanceof ModelPiece) {
                const info = requestedValue.getInfo(true);
                const key = token.toLowerCase();
                if (key in info) {
                    requestedValue = info[key];
                }
                else {
                    requestedValue = requestedValue[token];
                }
            }
            else {
                requestedValue = (requestedValue === null) ? undefined : requestedValue[token];
            }
        }
        ret.push({ token: token, value: requestedValue });
        return ret;
    }
    static replaceSingleVar_backup(obj, varname, isBase64, canThrow = false) {
        const debug = false;
        const showErrors = false;
        let debugPathOk = '';
        if (isBase64) {
            varname = atob(varname);
        }
        let requestedValue = obj;
        const fullpath = varname;
        const tokens = varname.split('.'); // varname.split(/\.,/);
        let j;
        for (j = 0; j < tokens.length; j++) {
            const token = tokens[j];
            U.pif(debug || showErrors, 'replacer: obj[req] = ', requestedValue, '[', token, '] =', (requestedValue ? requestedValue[token] : ''));
            if (requestedValue === null || requestedValue === undefined) {
                U.pe(showErrors, 'requested null or undefined:', obj, ', canthrow ? ', canThrow, ', fillplath:', fullpath);
                if (canThrow) {
                    U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. object = ', obj);
                    throw new DOMException('replace_Vars.WrongVariablePath', 'replace_Vars.WrongVariablePath');
                }
                else {
                    U.pif(showErrors, 'wrong variable path:', debugPathOk + '.' + token, ': ' + token + ' is undefined. ovjet = ', obj);
                }
                return 'Error: ' + debugPathOk + '.' + token + ' = ' + undefined;
            }
            else {
                debugPathOk += (debugPathOk === '' ? '' : '.') + token;
            }
            ////
            if (requestedValue instanceof ModelPiece) {
                const info = requestedValue.getInfo(true);
                const key = token.toLowerCase();
                if (key in info) {
                    requestedValue = info[key];
                }
                else {
                    requestedValue = requestedValue[token];
                }
            }
            else {
                requestedValue = (requestedValue === null) ? undefined : requestedValue[token];
            }
        }
        return requestedValue;
    }
    static changeVarTemplateDelimitersInMeasurables(innerText, toReplace = '$', replacement = '£') {
        if (!innerText.indexOf('measurable')) {
            return innerText;
        } // + performance su scommessa probabilistica. better avg, worser worst case.
        const html = document.createElement('div');
        html.innerHTML = innerText;
        const $measurables = $(html).find('.measurable');
        let i;
        let j;
        for (i = 0; i < $measurables.length; i++) {
            for (j = 0; j < $measurables[i].attributes.length; j++) {
                if ($measurables[i].attributes[j].name[0] !== '_') {
                    continue;
                }
                U.changeVarTemplateDelimitersInMeasurablesAttr($measurables[i].attributes[j], toReplace, replacement);
            }
        }
        return html.innerHTML;
    }
    static changeBackVarTemplateDelimitersInMeasurablesAttr(attrVal, toReplace = '£', replacement = '$') {
        return U.changeVarTemplateDelimitersInMeasurablesAttrStr(attrVal, toReplace, replacement);
    }
    static changeVarTemplateDelimitersInMeasurablesAttr(attr, toReplace = '$', replacement = '£') {
        attr.value = U.changeVarTemplateDelimitersInMeasurablesAttrStr(attr.value, toReplace, replacement);
    }
    static changeVarTemplateDelimitersInMeasurablesAttrStr(val, toReplace, replacement) {
        const r = toReplace;
        const rstr = '(^\\' + r + '|(((?!\\' + r + ').|^))[\\' + r + '](?!\\' + r + '))(.*?)(^\\' + r + '|((?!\\' + r + ').|^)[\\' + r + '](?!\\' + r + '))';
        return val.replace(new RegExp(rstr, 'gm'), (match, capture) => {
            if (match === toReplace) {
                return toReplace;
            }
            let prefixError = '';
            if (match.charAt(0) !== toReplace) {
                prefixError = match.charAt(0);
                match = match.substring(1);
            }
            return prefixError + replacement + match.substring(1, match.length - 1) + replacement;
        });
    }
    static sizeof(element0, debug = false) {
        let element = element0;
        U.pif(debug, 'sizeof(', element, ')');
        U.pe(element === document, 'trying to measure document.');
        if (element === document) {
            element = document.body;
        }
        const $element = $(element);
        U.pe(element.tagName === 'foreignObject', 'SvgForeignElementObject have a bug with size, measure a child instead.');
        let i;
        let tmp;
        let size;
        if (!U.sizeofvar) {
            U.sizeofvar = document.createElement('div');
            document.body.append(U.sizeofvar);
        }
        const isOrphan = element.parentNode === null;
        // var visible = element.style.display !== 'none';
        // var visible = $element.is(":visible"); crea bug quando un elemento è teoricamente visibile ma orfano
        const ancestors = U.ancestorArray(element);
        const visibile = [];
        if (isOrphan) {
            U.sizeofvar.append(element);
        }
        // show all and saveToDB visibility to restore it later
        for (i = 0; i < ancestors.length; i++) { // document has undefined style
            visibile[i] = (ancestors[i].style === undefined) ? (true) : (ancestors[i].style.display !== 'none');
            if (!visibile[i]) {
                $(ancestors[i]).show();
            }
        }
        tmp = $element.offset();
        size = new Size(tmp.left, tmp.top, 0, 0);
        tmp = element.getBoundingClientRect();
        size.w = tmp.width;
        size.h = tmp.height;
        // restore visibility
        for (i = 0; i < ancestors.length; i++) {
            if (!visibile[i]) {
                $(ancestors[i]).hide();
            }
        }
        if (isOrphan) {
            U.clear(U.sizeofvar);
        }
        // Status.status.getActiveModel().graph.markS(size, false);
        return size;
    }
    /* ritorna un array con tutti i figli, nipoti... discendenti di @parent */
    static iterateDescendents(parent) {
        return parent.getElementsByTagName('*');
    }
    static ancestorArray(domelem) {
        // [0]=element, [1]=father, [2]=grandfather... [n]=document
        if (domelem === null || domelem === undefined) {
            return [];
        }
        const arr = [domelem];
        let tmp = domelem.parentNode;
        while (tmp !== null) {
            arr.push(tmp);
            tmp = tmp.parentNode;
        }
        return arr;
    }
    static toSvg(html) {
        U.pe(true, 'toSvg maybe not working, test before use');
        const o = U.newSvg('svg');
        o.innerHTML = html;
        return o.firstChild;
    }
    static toHtmlRow(html) {
        return U.toHtml(html, U.toHtml('<table><tbody></tbody></table>').firstChild);
    }
    static toHtmlCell(html) {
        return U.toHtml(html, U.toHtml('<table><tbody><tr></tr></tbody></table>').firstChild.firstChild);
    }
    static toHtml(html, container = null, containerTag = 'div') {
        if (container === null) {
            container = document.createElement(containerTag);
        }
        container.innerHTML = html;
        const ret = container.firstChild;
        container.removeChild(ret);
        return ret;
    }
    static toBase64Image(html, container = null, containerTag = 'div') {
        // https://github.com/tsayen/dom-to-image
        return 'HtmlToImage todo: check https://github.com/tsayen/dom-to-image';
    }
    /**
     * checks if nodes have a vertical line relationship in the tree (parent, grandparent, ...);
     * @ return {boolean}
     */
    static isParentOf(parent, child) {
        //  parent chains:   element -> ... -> body -> html -> document -> null
        while (child !== null) {
            if (parent === child) {
                return true;
            }
            child = child.parentNode;
        }
        return false;
    }
    static isChildrenOf(child, parent) {
        return U.isParentOf(parent, child);
    }
    static setSvgSize(style, size, defaultsize) {
        if (!style)
            return;
        if (size) {
            size = size.duplicate();
        }
        else {
            size = defaultsize.duplicate();
            defaultsize = null;
        }
        if (!U.isNumber(size.x)) {
            U.pw(true, 'VertexSize Svg x attribute is NaN: ' + size.x + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.x));
            U.pe(!defaultsize || !U.isNumber(defaultsize.x), 'Both size and defaultsize are null.', size, defaultsize, style);
            size.x = defaultsize.x;
        }
        if (!U.isNumber(size.y)) {
            U.pw(true, 'VertexSize Svg y attribute is NaN: ' + size.y + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.y));
            U.pe(!defaultsize || !U.isNumber(defaultsize.y), 'Both size and defaultsize are null.', size, defaultsize, style);
            size.y = defaultsize.y;
        }
        if (!U.isNumber(size.w)) {
            U.pw(true, 'VertexSize Svg w attribute is NaN: ' + size.w + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.w));
            U.pe(!defaultsize || !U.isNumber(defaultsize.w), 'Both size and defaultsize are null.', size, defaultsize, style);
            size.w = defaultsize.w;
        }
        if (!U.isNumber(size.h)) {
            U.pw(true, 'VertexSize Svg h attribute is NaN: ' + size.h + (!defaultsize ? '' : ' will be set to default: ' + defaultsize.h));
            U.pe(!defaultsize || !U.isNumber(defaultsize.h), 'Both size and defaultsize are null.', size, defaultsize, style);
            size.h = defaultsize.h;
        }
        // U.pe(true, '100!, ', size, style);
        style.setAttributeNS(null, 'x', '' + size.x);
        style.setAttributeNS(null, 'y', '' + size.y);
        style.setAttributeNS(null, 'width', '' + size.w);
        style.setAttributeNS(null, 'height', '' + size.h);
        return size;
    }
    static getSvgSize(elem, minimum = null, maximum = null) {
        const defaults = new GraphSize(0, 0, 200, 99);
        const ret0 = new GraphSize(+elem.getAttribute('x'), +elem.getAttribute('y'), +elem.getAttribute('width'), +elem.getAttribute('height'));
        const ret = ret0.duplicate();
        if (!U.isNumber(ret.x)) {
            U.pw(true, 'Svg x attribute is NaN: ' + elem.getAttribute('x') + ' will be set to default: ' + defaults.x);
            ret.x = defaults.x;
        }
        if (!U.isNumber(ret.y)) {
            U.pw(true, 'Svg y attribute is NaN: ' + elem.getAttribute('y') + ' will be set to default: ' + defaults.y);
            ret.y = defaults.y;
        }
        if (!U.isNumber(ret.w)) {
            U.pw(true, 'Svg w attribute is NaN: ' + elem.getAttribute('width') + ' will be set to default: ' + defaults.w);
            ret.w = defaults.w;
        }
        if (!U.isNumber(ret.h)) {
            U.pw(true, 'Svg h attribute is NaN: ' + elem.getAttribute('height') + ' will be set to default: ' + defaults.h);
            ret.h = defaults.h;
        }
        if (minimum) {
            if (U.isNumber(minimum.x) && ret.x < minimum.x) {
                ret.x = minimum.x;
            }
            if (U.isNumber(minimum.y) && ret.y < minimum.y) {
                ret.y = minimum.y;
            }
            if (U.isNumber(minimum.w) && ret.w < minimum.w) {
                ret.w = minimum.w;
            }
            if (U.isNumber(minimum.h) && ret.h < minimum.h) {
                ret.h = minimum.h;
            }
        }
        if (maximum) {
            if (U.isNumber(maximum.x) && ret.x > maximum.x) {
                ret.x = maximum.x;
            }
            if (U.isNumber(maximum.y) && ret.y > maximum.y) {
                ret.y = maximum.y;
            }
            if (U.isNumber(maximum.w) && ret.w > maximum.w) {
                ret.w = maximum.w;
            }
            if (U.isNumber(maximum.h) && ret.h > maximum.h) {
                ret.h = maximum.h;
            }
        }
        if (!ret.equals(ret0)) {
            U.setSvgSize(elem, ret, null);
        }
        return ret;
    }
    static findMetaParent(parent, childJson, canFail, debug = true) {
        const modelRoot = parent.getModelRoot();
        // instanceof crasha non so perchè, dà undefined constructor quando non lo è.
        if (U.getClass(modelRoot) === 'MetaMetaModel') {
            U.pif(debug, 'return null;');
            return null;
        }
        if (U.getClass(modelRoot) === 'MetaModel') {
            U.pif(debug, 'return null;');
            return null;
        } // potrei ripensarci e collegarlo a m3
        // todo: risolvi bene e capisci che collegamento deve esserci tra mmpackage e mpackage.
        // fix temporaneo: così però consento di avere un solo package.
        if (U.getClass(modelRoot) === 'Model' && U.getClass(parent) === 'Model') {
            U.pif(debug, 'return: ', parent.metaParent.childrens[0]);
            return parent.metaParent.childrens[0];
        }
        // if (modelRoot === Status.status.mmm || !Status.status.mmm && modelRoot instanceof MetaMetaModel) { return null; }
        // if (modelRoot === Status.status.mm) { return null; }
        const ParentMetaParent = parent.metaParent;
        const metaParentName = Json.read(childJson, XMIModel.namee, null);
        // U.pe(!metaParentName, 'type not found.', childJson);
        let i;
        let ret = null;
        U.pif(debug, 'finding metaparent of:', childJson, 'parent:', parent, 'parent.metaparent:', ParentMetaParent, 'childrens:', ParentMetaParent ? ParentMetaParent.childrens : 'null parent');
        for (i = 0; i < ParentMetaParent.childrens.length; i++) {
            const metaVersionCandidate = ParentMetaParent.childrens[i];
            const candidateName = metaVersionCandidate.name;
            U.pif(debug, 'check[' + i + '/' + ParentMetaParent.childrens.length + '] ' + candidateName + ' =?= ' + metaParentName + ' ? ' +
                (candidateName === metaParentName));
            // console.log('is metaparent? of:', metaParentName, ' === ', candidateName, ' ? ', candidateName === metaParentName);
            if (candidateName === metaParentName) {
                ret = metaVersionCandidate;
                break;
            }
        }
        U.pif(debug, 'return: ', ret);
        U.pe(ret == null && !canFail, 'metaParent not found. metaParentParent:', ParentMetaParent, 'metaParentName:', metaParentName, 'parent:', parent, 'json:', childJson);
        // console.log('findMetaParent of:', childJson, ' using parent:', parent, ' = ', ret);
        return ret;
    }
    /*
      static findMetaParentP(parent: IModel, childJson: Json, canFail: boolean = true): IPackage {
        return U.findMetaParent<IModel, IPackage>(parent, childJson, canFail);
      }
  
      static findMetaParentC(parent: IPackage, childJson: Json, canFail: boolean = true): M2Class {
        return U.findMetaParent<IPackage, M2Class>(parent, childJson, canFail);
      }
  
      static findMetaParentA(prnt: M2Class, childJ: Json, canFail: boolean = true): IAttribute {
        return U.findMetaParent<M2Class, IAttribute>(prnt, childJ, canFail);
      }
  
      static findMetaParentR(prnt: M2Class, childJ: Json, canFail: boolean = true): IReference {
        return U.findMetaParent<M2Class, IReference>(prnt, childJ, canFail);
      }
    */
    static arrayRemoveAll(arr, elem, debug = false) {
        let index;
        while (true) {
            index = arr.indexOf(elem);
            U.pif(debug, 'ArrayRemoveAll: index: ', index, '; arr:', arr, '; elem:', elem);
            if (index === -1) {
                return;
            }
            arr.splice(index, 1);
            U.pif(debug, 'ArrayRemoveAll RemovedOne:', arr);
        }
    }
    static eventiDaAggiungereAlBody(selecteds) {
        // todo: guarda gli invocatori
    }
    static isOnEdge(pt, shape) {
        return U.isOnHorizontalEdges(pt, shape) || U.isOnVerticalEdges(pt, shape);
    }
    static isOnVerticalEdges(pt, shape) {
        return U.isOnLeftEdge(pt, shape) || U.isOnRightEdge(pt, shape);
    }
    static isOnHorizontalEdges(pt, shape) {
        return U.isOnTopEdge(pt, shape) || U.isOnBottomEdge(pt, shape);
    }
    static isOnRightEdge(pt, shape) {
        if (!pt || !shape) {
            return null;
        }
        return (pt.x === shape.x + shape.w) && (pt.y >= shape.y && pt.y <= shape.y + shape.h);
    }
    static isOnLeftEdge(pt, shape) {
        if (!pt || !shape) {
            return null;
        }
        return (pt.x === shape.x) && (pt.y >= shape.y && pt.y <= shape.y + shape.h);
    }
    static isOnTopEdge(pt, shape) {
        if (!pt || !shape) {
            return null;
        }
        return (pt.y === shape.y) && (pt.x >= shape.x && pt.x <= shape.x + shape.w);
    }
    static isOnBottomEdge(pt, shape) {
        if (!pt || !shape) {
            return null;
        }
        return (pt.y === shape.y + shape.h) && (pt.x >= shape.x && pt.x <= shape.x + shape.w);
    }
    // usage: var scope1 = makeEvalContext("variable declariation list"); scope1("another eval like: x *=3;");
    // remarks: variable can be declared only on the first call, further calls on a created context can only modify the context without expanding it.
    // same as above, but with dynamic context, although it's only extensible manually and not by the eval code itself.
    static evalInContextOld(context, js) {
        let value;
        try { // for expressions
            value = eval('with(context) { ' + js + ' }');
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                //try { // for statements
                value = (new Function('with(this) { ' + js + ' }')).call(context);
                //} catch (e) { U.pw(true, 'error evaluating')}
            }
        }
        return value;
    }
    static multiReplaceAllKV(a, kv = []) {
        const keys = [];
        const vals = [];
        let i;
        for (i = 0; i < kv.length; i++) {
            keys.push(kv[i][0]);
            vals.push(kv[i][0]);
        }
        return U.multiReplaceAll(a, keys, vals);
    }
    static multiReplaceAll(a, searchText = [], replacement = []) {
        U.pe(!(searchText.length === replacement.length), 'search and replacement must be have same length:', searchText, replacement);
        let i = -1;
        while (++i < searchText.length) {
            a = U.replaceAll(a, searchText[i], replacement[i]);
        }
        return a;
    }
    static toFileName(a = 'nameless.txt') {
        if (!a) {
            a = 'nameless.txt';
        }
        a = U.multiReplaceAll(a.trim(), ['\\', '//', ':', '*', '?', '<', '>', '"', '|'], ['[lslash]', '[rslash]', ';', '°', '_', '{', '}', '\'', '!']);
        return a;
    }
    static download(filename = 'nameless.txt', text = null, debug = true) {
        if (!text) {
            return;
        }
        filename = U.toFileName(filename);
        const htmla = document.createElement('a');
        const blob = new Blob([text], { type: 'text/plain', endings: 'native' });
        const blobUrl = URL.createObjectURL(blob);
        U.pif(debug, text + '|\r\n| <-- rn, |\n| <--n.');
        htmla.style.display = 'none';
        htmla.href = blobUrl;
        htmla.download = filename;
        document.body.appendChild(htmla);
        htmla.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(htmla);
    }
    /// arrotonda verso zero.
    static trunc(num) {
        if (Math['trunc' + '']) {
            return Math['trunc' + ''](num);
        }
        if (Math.floor && Math.ceil) {
            return Math[num > 0 ? 'floor' : 'ceil'](num);
        }
        return Number(String(num).replace(/\..*/, ''));
    }
    static closeButtonSetup($root, debug = false) {
        $root.find('.closeButton').off('click.closeButton').on('click.closeButton', (e) => {
            let html = e.target;
            const target = html.dataset.closebuttontarget;
            html = html.parentElement;
            U.pif(debug, 'html:', html, 'target:', e.target, 'targetstr:', target, 'dataset:', e.target.dataset);
            while (html && html.dataset.closebuttontarget !== target) {
                U.pif(debug, 'html:', html, ', data:', (html).dataset.closebuttontarget, ' === ' + target);
                html = html.parentElement;
            }
            U.pif(debug, 'html:', html);
            U.pe(!html, 'closeTarget not found: event trigger:', e.target, 'html:', html);
            $(html).hide();
        });
    }
    static insertAt(arr, index, elem) {
        const oldl = arr.length;
        const ret = arr.splice(index, 0, elem);
        U.pe(oldl + 1 !== arr.length, oldl + ' --> ' + arr.length + '; arr not growing. ret:', ret, arr);
    }
    static setViewBox(svg, size = null) {
        if (!size) {
            size = new Size();
            size.x = size.y = size.w = size.h = null;
        }
        let x = +size.x;
        let y = +size.y;
        let w = +size.w;
        let h = +size.h;
        let htmlsize = null;
        if (isNaN(x)) {
            x = 0;
        }
        if (isNaN(y)) {
            y = 0;
        }
        if (isNaN(w)) {
            w = htmlsize ? htmlsize.w : (htmlsize = U.sizeof(svg)).w;
        }
        if (isNaN(h)) {
            h = htmlsize ? htmlsize.h : (htmlsize = U.sizeof(svg)).h;
        }
        svg.setAttributeNS(null, 'viewBox', x + ' ' + y + ' ' + w + ' ' + h);
    }
    static getViewBox(svg) {
        const str = svg.getAttributeNS(null, 'viewbox');
        if (!str)
            return U.sizeof(svg);
        const arr = str.split(' ');
        let vbox = new Size(0, 0, 0, 0);
        if (isNaN(+arr[0])) {
            vbox = U.sizeof(svg);
            vbox.x = vbox.y = 0;
            return vbox;
        }
        else {
            vbox.x = +arr[0];
        }
        if (isNaN(+arr[1])) {
            vbox = U.sizeof(svg);
            vbox.x = vbox.y = 0;
            return vbox;
        }
        else {
            vbox.y = +arr[1];
        }
        if (isNaN(+arr[2])) {
            vbox = U.sizeof(svg);
            vbox.x = vbox.y = 0;
            return vbox;
        }
        else {
            vbox.w = +arr[2];
        }
        if (isNaN(+arr[3])) {
            vbox = U.sizeof(svg);
            vbox.x = vbox.y = 0;
            return vbox;
        }
        else {
            vbox.h = +arr[3];
        }
        return vbox;
    }
    static selectHtml(htmlSelect, optionValue, canFail = false) {
        const $options = $(htmlSelect).find('option');
        let i;
        let isFound = false;
        if (optionValue === null || optionValue === undefined) {
            return;
        }
        for (i = 0; i < $options.length; i++) {
            const opt = $options[i];
            if (opt.value === optionValue) {
                opt.selected = isFound = true;
            }
        }
        U.pw(!isFound, 'SelectOption not found. html:', htmlSelect, ', searchingFor: |' + optionValue + '|, in options:', $options);
        U.pe(!isFound && !canFail, 'SelectOption not found. html:', htmlSelect, ', searchingFor: |' + optionValue + '| in options:', $options);
    }
    static tabSetup(root = document.body) {
        $('.UtabHeader').off('click.tabchange').on('click.tabchange', U.tabClick);
        $('.UtabContent').hide();
        const $tabRoots = $('.UtabContainer');
        let i;
        for (i = 0; i < $tabRoots.length; i++) {
            const selectedStr = $tabRoots[i].dataset.selectedtab;
            const $selected = $($tabRoots[i]).find('>.UtabHeaderContainer>.UtabHeader[data-target="' + selectedStr + '"]');
            U.pe($selected.length !== 1, 'tab container must select exactly one tab. found instead: ' + $selected.length, 'tabRoot:', $tabRoots[i], 'selector:', selectedStr);
            // console.clear(); console.log('triggered: ', $selected);
            $selected.trigger('click');
        }
        /*
            U.addCss('customTabs',
              '.UtabHeaderContainer{ padding: 0; margin: 0; display: flex;}\n' +
              '.UtabContainer{\n' +
              'display: flex;\n' +
              'flex-flow: column;\n' +
              '\n}\n' +
              '.UtabHeader{\n' +
              'display: inline-block;\n' +
              'width: auto; flex-grow: 1;\n' +
              'margin: 10px;\n' +
              'margin-bottom: 0;\n' +
              'flex-basis: 0;\n' +
              'text-align: center;\n' +
              'border: 1px solid red;\n}\n' +
              '.UtabHeader+.UtabHeader{\n' +
              'margin-left:0;\n}\n' +
              '.UtabHeader[selected="true"]{\n' +
              'background-color: darkred;\n' +
              '}\n' +
              '.UtabContentContainer{\n' +
              '\n' +
              '    flex-grow: 1;\n' +
              '    flex-basis: 0;\n' +
              '    overflow: auto;' +
              '\n}\n' +
              '.UtabContent{\n' +
              'flex-grow: 1;\n' +
              // 'height: 100%;\n' +
              '\n}\n');*/
    }
    static tabClick(e) {
        let root = e.currentTarget;
        const target = root.dataset.target;
        while (root && !root.classList.contains('UtabContainer')) {
            root = root.parentNode;
        }
        const $root = $(root);
        const oldTarget = root.dataset.selectedtab;
        root.dataset.selectedtab = target;
        const $targethtml = $root.find('>.UtabContentContainer>.UtabContent[data-target="' + target + '"]');
        U.pe($targethtml.length !== 1, 'tab target count (' + $targethtml.length + ') is !== 1');
        const $oldTargetHtml = $root.find('>.UtabContentContainer>.UtabContent[data-target="' + oldTarget + '"]');
        U.pe($oldTargetHtml.length !== 1, 'oldTab target count (' + $oldTargetHtml.length + ') is !== 1');
        const $oldTargetHeader = $root.find('>.UtabHeaderContainer>.UtabHeader[data-target="' + oldTarget + '"]');
        U.pe($oldTargetHeader.length !== 1, 'oldTabHeader target count (' + $oldTargetHeader.length + ') is !== 1');
        const $targetHeader = $root.find('>.UtabHeaderContainer>.UtabHeader[data-target="' + target + '"]');
        U.pe($targetHeader.length !== 1, 'TabHeader target count (' + $targetHeader.length + ') is !== 1');
        if ($targethtml[0].getAttribute('selected') === 'true') {
            return;
        }
        $oldTargetHeader[0].setAttribute('selected', 'false');
        $targetHeader[0].setAttribute('selected', 'true');
        $oldTargetHtml.slideUp();
        $targethtml.slideDown();
    }
    static removeemptynodes(root, includeNBSP = false, debug = false) {
        let n;
        for (n = 0; n < root.childNodes.length; n++) {
            const child = root.childNodes[n];
            U.pif(debug, 'removeEmptyNodes: ', child.nodeType);
            switch (child.nodeType) {
                default:
                    break;
                case 1:
                    U.removeemptynodes(child, includeNBSP);
                    break; // node: element
                case 2:
                    break; // leaf: attribute
                case 8:
                    break; // leaf: comment
                case 3: // leaf: text node
                    let txt = child.nodeValue;
                    let i;
                    // replacing first blanks (\n, \r, &nbsp;) with classic spaces.
                    for (i = 0; i < txt.length; i++) {
                        let exit = false && false;
                        switch (txt[i]) {
                            default:
                                exit = true;
                                break; // if contains non-blank is allowed to live but trimmed.
                            case '&nbsp':
                                if (includeNBSP) {
                                    txt[i] = ' ';
                                }
                                else {
                                    exit = true;
                                }
                                break;
                            case ' ':
                            case '\n':
                            case '\r':
                                txt[i] = ' ';
                                break;
                        }
                        if (exit) {
                            break;
                        }
                    }
                    // replacing last blanks (\n, \r, &nbsp;) with classic spaces.
                    for (i = txt.length; i >= 0; i--) {
                        let exit = false && false;
                        switch (txt[i]) {
                            default:
                                exit = true;
                                break; // if contains non-blank is allowed to live but trimmed.
                            case '&nbsp':
                                if (includeNBSP) {
                                    txt[i] = ' ';
                                }
                                else {
                                    exit = true;
                                }
                                break;
                            case ' ':
                            case '\n':
                            case '\r':
                                txt[i] = ' ';
                                break;
                        }
                        if (exit) {
                            break;
                        }
                    }
                    txt = txt.trim();
                    U.pif(debug, 'txt: |' + root.nodeValue + '| --> |' + txt + '| delete?', (/^[\n\r ]*$/g.test(txt)));
                    if (txt === '') {
                        root.removeChild(child);
                        n--;
                    }
                    else {
                        root.nodeValue = txt;
                    }
                    break;
            }
        }
        return root;
    }
    static replaceAll(str, searchText, replacement, debug = false, warn = true) {
        if (!str) {
            return str;
        }
        return str.split(searchText).join(replacement);
        let lastPos = 0;
        if (searchText === replacement) {
            U.pw(warn, 'replaceAll invalid parameters: search text === replacement === ' + replacement);
            return str;
        }
        U.pif(debug, 'replaceAll(', searchText, ' with ', replacement, ') starting str:', searchText);
        while (str.indexOf(searchText, lastPos)) {
            const old = searchText;
            const lastPosOld = lastPos;
            searchText = searchText.substring(0, lastPos) + replacement + searchText.substring(lastPos + searchText.length);
            lastPos = lastPos + replacement.length;
            U.pif(debug, 'replaceAll() ', old, ' => ', searchText, '; lastpos:' + lastPosOld + ' => ', lastPos);
        }
        return str;
    }
    static isValidHtml(htmlStr, debug = false) {
        const div = document.createElement('div');
        if (!htmlStr) {
            return false;
        }
        div.innerHTML = htmlStr;
        // if (div.innerHTML === htmlStr) { return true; }
        const s2 = U.multiReplaceAll(div.innerHTML, [' ', ' ', '\n', '\r'], ['', '', '', '']);
        const s1 = U.multiReplaceAll(htmlStr, [' ', ' ', '\n', '\r'], ['', '', '', '']);
        const ret = s1 === s2;
        if (ret || !debug) {
            return ret;
        }
        const tmp = U.strFirstDiff(s1, s2, 20);
        U.pif(debug, 'isValidHtml() ' + (tmp ? '|' + tmp[0] + '| vs |' + tmp[1] + '|' : 'tmp === null'));
        return ret;
    }
    static getIndex(node) {
        if (!node.parentElement) {
            return -1;
        }
        // return U.toArray(node.parentElement.children).indexOf(node);
        return Array.prototype.indexOf.call(node.parentElement.children, this);
    }
    static toArray(childNodes) {
        if (Array['' + 'from']) {
            return Array['' + 'from'](childNodes);
        }
        const array = [];
        let i = -1;
        while (++i < childNodes.length) {
            array.push(childNodes[i]);
        }
        return array;
    }
    static getClass(obj) { return obj.__proto__.constructor.name; }
    static isString(elem) { return elem + '' === elem; }
    static permuteV2(input) {
        U.PermuteArr = [];
        U.PermuteUsedChars = [];
        return U.permute0V2(input);
    }
    static permute0V2(input) {
        let i;
        let ch;
        for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            U.PermuteUsedChars.push(ch);
            if (input.length === 0) {
                U.PermuteArr.push(U.PermuteUsedChars.slice());
            }
            U.permute0V2(input);
            input.splice(i, 0, ch);
            U.PermuteUsedChars.pop();
        }
        return U.PermuteArr;
    }
    static permute(inputArr, debug = true) {
        const results = [];
        const permuteInner = (arr, memo = []) => {
            let cur;
            let i;
            for (i = 0; i < arr.length; i++) {
                cur = arr.splice(i, 1);
                if (arr.length === 0) {
                    results.push(memo.concat(cur));
                }
                permuteInner(arr.slice(), memo.concat(cur));
                arr.splice(i, 0, cur[0]);
            }
            return results;
        };
        return permuteInner(inputArr);
    }
    static resizableBorderMouseDblClick(e) {
        const size = U.sizeof(U.resizingContainer);
        const minSize = U.sizeof(U.resizingBorder);
        const oldSize = new Size(0, 0, +U.resizingContainer.dataset.oldsizew, +U.resizingContainer.dataset.oldsizeh);
        const horiz = U.resizingBorder.classList.contains('left') || U.resizingBorder.classList.contains('right');
        const vertic = U.resizingBorder.classList.contains('top') || U.resizingBorder.classList.contains('bottom');
        if (horiz && vertic)
            return; // do nothing on corner, non voglio che venga resizato sia a minheight che a minwidth, solo uno dei 2.
        minSize.w *= horiz ? 2 : 1;
        minSize.h *= vertic ? 2 : 1;
        minSize.x = size.x;
        minSize.y = size.y;
        console.log('old, size, min', oldSize, size, minSize, oldSize.w && size.equals(minSize));
        if (oldSize.w && size.equals(minSize)) {
            U.resizingContainer.style.width = U.resizingContainer.style.minWidth = U.resizingContainer.style.maxWidth = oldSize.w + 'px';
            U.resizingContainer.style.height = U.resizingContainer.style.minHeight = U.resizingContainer.style.maxHeight = oldSize.h + 'px';
        }
        else {
            U.resizingContainer.style.width = U.resizingContainer.style.minWidth = U.resizingContainer.style.maxWidth = minSize.w + 'px';
            U.resizingContainer.style.height = U.resizingContainer.style.minHeight = U.resizingContainer.style.maxHeight = minSize.h + 'px';
            U.resizingContainer.dataset.oldsizew = '' + size.w;
            U.resizingContainer.dataset.oldsizeh = '' + size.h;
        }
    }
    static resizableBorderMouseDown(e) {
        U.resizingBorder = e.currentTarget;
        U.resizingContainer = U.resizingBorder;
        U.resizingContainer.style.padding = '0';
        U.resizingContainer.style.flexBasis = '0';
        // U.resizingContent.style.width = '100%'; required too
        while (!U.resizingContainer.classList.contains('resizableBorderContainer')) {
            U.resizingContainer = U.resizingContainer.parentNode;
        }
        if (U.checkDblClick())
            U.resizableBorderMouseDblClick(e);
    }
    static resizableBorderMouseUp(e) { U.resizingBorder = U.resizingContainer = null; }
    static resizableBorderUnset(e) {
        e.preventDefault();
        const border = e.currentTarget;
        let container = border;
        while (container.classList.contains('resizableBorderContainer')) {
            container = container.parentNode;
        }
        container.style.flexBasis = '';
        container.style.minHeight = container.style.minWidth =
            container.style.maxHeight = container.style.maxWidth =
                container.style.height = container.style.width = '';
    }
    static resizableBorderMouseMove(e) {
        if (!U.resizingBorder) {
            return;
        }
        const size = U.sizeof(U.resizingContainer);
        const missing = new Point(0, 0);
        const cursor = new Point(e.pageX, e.pageY);
        const puntoDaFarCoinciderePT = cursor.duplicate();
        const l = U.resizingBorder.classList.contains('left');
        const r = U.resizingBorder.classList.contains('right');
        const t = U.resizingBorder.classList.contains('top');
        const b = U.resizingBorder.classList.contains('bottom');
        if (l) {
            puntoDaFarCoinciderePT.x = size.x;
        }
        if (r) {
            puntoDaFarCoinciderePT.x = size.x + size.w;
        }
        if (t) {
            puntoDaFarCoinciderePT.y = size.y;
        }
        if (b) {
            puntoDaFarCoinciderePT.y = size.y + size.h;
        }
        const add = cursor.subtract(puntoDaFarCoinciderePT, true);
        if (l) {
            add.x *= -1;
        }
        if (t) {
            add.y *= -1;
        }
        // o = p0 - c
        // p = c
        // c = p0-o
        // console.log('lrtb: ', l, r, t, b);
        // console.log('ptcoinc: ', puntoDaFarCoinciderePT, ' cursor:', cursor, ' size:', size, 'adjust:', add);
        size.w += add.x;
        size.h += add.y;
        const borderSize = U.sizeof(U.resizingBorder);
        if (l || r) {
            size.w = Math.max(size.w, borderSize.w * 2);
        }
        if (t || b) {
            size.h = Math.max(size.h, borderSize.h * 2);
        }
        U.resizingContainer.style.width = U.resizingContainer.style.maxWidth = U.resizingContainer.style.minWidth = (size.w) + 'px';
        U.resizingContainer.style.height = U.resizingContainer.style.maxHeight = U.resizingContainer.style.minHeight = (size.h) + 'px';
        // console.log('result:' + U.resizingContainer.style.width);
        U.resizingContainer.style.flexBasis = 'unset';
    }
    static resizableBorderSetup(root = document.body) {
        // todo: addBack is great, aggiungilo tipo ovunque. find() esclude l'elemento radice anche se matcha la query, addback rimedia aggiungendo il
        //  previous matched set che matcha la condizione.
        const $arr = $(root).find('.resizableBorder').addBack('.resizableBorder');
        let i = -1;
        const nl = '\n';
        while (++i < $arr.length) {
            U.makeResizableBorder($arr[i]);
        }
        U.eventiDaAggiungereAlBody(null);
        $(document.body).off('mousemove.ResizableBorder').on('mousemove.ResizableBorder', U.resizableBorderMouseMove);
        $(document.body).off('mouseup.ResizableBorder').on('mouseup.ResizableBorder', U.resizableBorderMouseUp);
        $('.resizableBorder.corner').off('mousedown.ResizableBorder').on('mousedown.ResizableBorder', U.resizableBorderMouseDown)
            .off('contextmenu.ResizableBorder').on('contextmenu.ResizableBorder', U.resizableBorderUnset);
        $('.resizableBorder.side').off('mousedown.ResizableBorder').on('mousedown.ResizableBorder', U.resizableBorderMouseDown)
            .off('contextmenu.ResizableBorder').on('contextmenu.ResizableBorder', U.resizableBorderUnset);
        return;
    }
    static makeResizableBorder(html, left = true, top = true, right = true, bottom = true) {
        // if (!html.classList.contains('resizableBorderContainer')) { html.classList.add('resizableBorderContainer'); }
        let container = null;
        let content = null;
        if (false && html.children.length === 9 && html.children[4].classList.contains('resizableContent')) {
            // already initialized.
            container = html;
            content = container.children[4];
            U.clear(container);
        }
        else {
            // first run: initialing now.
            // const tmpNode: HTMLElement = document.createElement('div');
            // while (html.firstChild) { tmpNode.appendChild(html.firstChild); }
            // while (tmpNode.firstChild) { content.appendChild(tmpNode.firstChild); }
            content = html;
            container = U.cloneHtml(html, false);
            html.setAttribute('original', 'true');
            while (container.classList.length > 0) {
                container.classList.remove(container.classList.item(0));
            }
        }
        console.log('container:', container, 'content:', content);
        U.pe(container.children.length !== 0, '');
        // U.copyStyle(html, container);
        html.parentNode.insertBefore(container, html);
        content.classList.remove('resizableBorderContainer');
        content.classList.add('resizableContent');
        container.classList.add('resizableBorderContainer');
        if (left) {
            html.dataset.resizableleft = 'true';
        }
        if (right) {
            html.dataset.resizableright = 'true';
        }
        if (top) {
            html.dataset.resizabletop = 'true';
        }
        if (bottom) {
            html.dataset.resizablebottom = 'true';
        }
        left = html.dataset.resizableleft === 'true';
        right = html.dataset.resizableright === 'true';
        top = html.dataset.resizabletop === 'true';
        bottom = html.dataset.resizablebottom === 'true';
        // const size: Size = U.sizeof(html);
        // container.style.width = size.w + 'px';
        // container.style.height = size.h + 'px';
        const l = U.toHtml('<div class="resizableBorder side left"></div>');
        const r = U.toHtml('<div class="resizableBorder side right"></div>');
        const t = U.toHtml('<div class="resizableBorder side top"></div>');
        const b = U.toHtml('<div class="resizableBorder side bottom"></div>');
        const tl = U.toHtml('<div class="resizableBorder corner top left"></div>');
        const tr = U.toHtml('<div class="resizableBorder corner top right"></div>');
        const bl = U.toHtml('<div class="resizableBorder corner bottom left"></div>');
        const br = U.toHtml('<div class="resizableBorder corner bottom right"></div>');
        const hstripT = U.toHtml('<div class="resizableStrip up"></div>');
        const hstripM = U.toHtml('<div class="resizableStrip center"></div>');
        const hstripB = U.toHtml('<div class="resizableStrip down"></div>');
        l.dataset.resizeenabled = left ? 'true' : 'false';
        r.dataset.resizeenabled = right ? 'true' : 'false';
        t.dataset.resizeenabled = top ? 'true' : 'false';
        b.dataset.resizeenabled = bottom ? 'true' : 'false';
        tl.dataset.resizeenabled = top && left ? 'true' : 'false';
        tr.dataset.resizeenabled = top && right ? 'true' : 'false';
        bl.dataset.resizeenabled = bottom && left ? 'true' : 'false';
        br.dataset.resizeenabled = bottom && right ? 'true' : 'false';
        const style = getComputedStyle(html, null);
        // html.style.border = 'none';
        t.style.borderTop = tl.style.borderTop = tr.style.borderTop = style.borderTop;
        b.style.borderBottom = bl.style.borderBottom = br.style.borderBottom = style.borderBottom;
        l.style.borderLeft = tl.style.borderLeft = bl.style.borderLeft = style.borderLeft;
        r.style.borderRight = tr.style.borderRight = br.style.borderRight = style.borderRight;
        // per un bug lo stile viene sempre letto come "none"
        /*l.style.borderStyle = 'solid';
        r.style.borderStyle = 'solid';
        t.style.borderStyle = 'solid';
        b.style.borderStyle = 'solid';*/
        //console.log('style.border:', style.border);
        /*U.pe(t.style.borderTopStyle === 'none', '1');
        U.pe(isNaN(+t.style.borderWidth), '2');
        U.pe(+t.style.borderWidth === 0, '3');
        if (t.style.borderTopStyle === 'none' || isNaN(+t.style.borderWidth) || +t.style.borderWidth === 0) {
          t.style.borderWidth = t.style.height = t.style.width = t.style.flexGrow = '0'; }
        if (b.style.borderBottomStyle === 'none' || isNaN(+b.style.borderWidth) || +b.style.borderWidth === 0) {
          b.style.borderWidth = b.style.height = b.style.width = b.style.flexGrow = '0'; }
        if (l.style.borderLeftStyle === 'none' || isNaN(+l.style.borderWidth) || +l.style.borderWidth === 0) {
          l.style.borderWidth = l.style.height = l.style.width = l.style.flexGrow = '0'; }
        if (r.style.borderTopStyle === 'none' || isNaN(+r.style.borderWidth) || +r.style.borderWidth === 0) {
          r.style.borderWidth = r.style.height = r.style.width = r.style.flexGrow = '0'; }*/
        /*
        const borderSizeL: Size;
        const borderSizeR: Size;
        const borderSizeT: Size;
        const borderSizeB: Size;
        tl.style.width = l.style.width = bl.style.width = (borderSizeL.w) + 'px';
        tr.style.width = r.style.width = br.style.width = (borderSizeR.w) + 'px';
        tl.style.height = t.style.height = tr.style.height = (borderSizeT.h) + 'px';
        bl.style.height = b.style.height = br.style.height = (borderSizeB.h) + 'px';
    
        t.style.width = b.style.width = (size.w - (borderSizeL.w + borderSizeR.w)) + 'px';
        l.style.height = r.style.height = (size.h - (borderSizeT.h + borderSizeB.w)) + 'px';*/
        // html.parentNode.appendChild(container);
        hstripT.appendChild(tl);
        hstripT.appendChild(t);
        hstripT.appendChild(tr);
        hstripM.appendChild(l);
        hstripM.appendChild(content);
        hstripM.appendChild(r);
        hstripB.appendChild(bl);
        hstripB.appendChild(b);
        hstripB.appendChild(br);
        container.appendChild(hstripT);
        container.appendChild(hstripM);
        container.appendChild(hstripB);
        container.style.border = 'none'; /*
        const size: Size = U.sizeof(container);
        const hbordersize = 10;
        const vbordersize = 10;
        container.style.width = Math.max(hbordersize * 2 + size.w) + 'px';
        container.style.height = Math.max(vbordersize * 2 + size.h) + 'px';*/
        content.style.border = 'none';
        if (!content.style.width || content.style.width === 'auto') {
            content.style.width = '100%';
            content.style.height = '100%';
        }
        content.style.minWidth = '0';
        content.style.minHeight = '0';
    }
    static copyStyle(from, to, computedStyle = null) {
        // trying to figure out which style object we need to use depense on the browser support, so we try until we have one.
        if (!computedStyle) {
            computedStyle = from['' + 'currentStyle'] || document.defaultView.getComputedStyle(from, null);
        }
        // if the browser dose not support both methods we will return failure.
        if (!computedStyle) {
            return false;
        }
        // checking that the value is not a undefined, object, function, empty or int index ( happens on some browser)
        const stylePropertyValid = (name, value) => {
            // nb: mind that typeof [] === 'object';
            return typeof value !== 'undefined' && typeof value !== 'object' && typeof value !== 'function' && value.length > 0
                // && value !== parseInt(value, 10); };
                && +name !== parseInt(name, 10);
        };
        let property;
        for (property in computedStyle) {
            // hasOwnProperty is useless, but compiler required
            // console.log('property[', property, '] = ', computedStyle[property]);
            if (!computedStyle.hasOwnProperty(property) || !stylePropertyValid(property, computedStyle[property])) {
                continue;
            }
            to.style[property] = computedStyle[property];
        }
        return true;
    }
    static cclear() { console.clear(); console.trace(); }
    static toDottedURI(uri) {
        return U.replaceAll(U.replaceAll(uri.substring(uri.indexOf('://') + '://'.length), '\\', '/'), '/', '.');
    }
    static toHttpsURI(uri, folderChar = '/') {
        return 'https://' + U.replaceAll(uri, '.', folderChar);
    }
    static toNumber(o) {
        if (o === null || o === undefined || (U.isString(o) && o.trim() === ''))
            return null;
        o = +o;
        if (isNaN(o))
            return null;
        return o;
    }
    // returns true only if parameter is already a number by type. U.isNumber('3') will return false
    static isNumber(o) { return +o === o && o !== NaN; }
    // returns true only if parameter is a number or a stringified number. U.isNumber('3') will return true
    static isNumerizable(o) { return o !== null && o !== undefined && !isNaN(+0); }
    static isNumberArray(o, minn = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY, ifItIsEmptyArrReturn = true) {
        const validation = (val) => U.isNumber(val) && val >= minn && val <= max;
        return U.isArrayOf(o, validation, ifItIsEmptyArrReturn);
    }
    static isIntegerArray(o, minn = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY, ifItIsEmptyArrReturn = true) {
        const validation = (val) => (U.isNumber(val) && Math.floor(val) === val && val >= minn && val <= max);
        return U.isArrayOf(o, validation, ifItIsEmptyArrReturn);
    }
    static isCharArray(values, ifItIsEmpryArrayReturn = true) {
        const charValidator = (val) => (val.length === 1);
        return U.isArrayOf(values, charValidator, ifItIsEmpryArrayReturn);
    }
    static isArrayOf(value, functionCheck, ifItIsEmptyArrayReturn = true) {
        if (!Array.isArray(value)) {
            return false;
        }
        let i;
        if (value.length === 0) {
            return ifItIsEmptyArrayReturn;
        }
        for (i = 0; i < value.length; i++) {
            if (!functionCheck(value[i]) && !U.isArrayOf(value[i], functionCheck, ifItIsEmptyArrayReturn)) {
                return false;
            }
        }
        return true;
    }
    static isStringArray(value, ifItIsEmptyArrayReturn = true) {
        if (!Array.isArray(value)) {
            return false;
        }
        let i;
        if (value.length === 0) {
            return ifItIsEmptyArrayReturn;
        }
        for (i = 0; i < value.length; i++) {
            if (!U.isString(value[i]) && !U.isStringArray(value[i], true)) {
                return false;
            }
        }
        return true;
    }
    static clipboardCopy(text) {
        if (!U.clipboardinput) {
            U.clipboardinput = document.createElement('input');
            U.clipboardinput.id = U.prefix + 'CopyDataToClipboard';
            U.clipboardinput.type = 'text';
            U.clipboardinput.style.display = 'block';
            U.clipboardinput.style.position = 'absolute';
            U.clipboardinput.style.top = '-100vh';
        }
        document.body.appendChild(U.clipboardinput);
        U.clipboardinput.value = text;
        U.clipboardinput.select();
        document.execCommand('copy');
        document.body.removeChild(U.clipboardinput);
        U.clearSelection();
    }
    static clearSelection() { }
    static refreshPage() { window.location.href += ''; }
    static isArray(v) { return Array.isArray(v); }
    static isEmptyObject(v, returnIfNull = true, returnIfUndefined = false) {
        return U.isObject(v, returnIfNull, returnIfUndefined) && $.isEmptyObject(v);
    }
    static isObject(v, returnIfNull = true, returnIfUndefined = false, retIfArray = false) {
        if (v === null) {
            return returnIfNull;
        }
        if (v === undefined) {
            return returnIfUndefined;
        }
        if (Array.isArray(v)) {
            return retIfArray;
        }
        // nb: mind that typeof [] === 'array'
        return typeof v === 'object';
    }
    static isFunction(v) { return (typeof v === 'function'); }
    static isPrimitive(v, returnIfNull = true, returnIfUndefined = true) {
        if (v === null) {
            return returnIfNull;
        }
        if (v === undefined) {
            return returnIfUndefined;
        }
        // return (typeof v !== 'function') && (typeof v !== 'object') && (!U.isArray(v));
        return !U.isObject(v) && !Array.isArray(v) && !U.isFunction(v);
    }
    static getEndingNumber(s, ignoreNonNumbers = false, allowDecimal = false) {
        let i = s.length;
        let numberEnd = -1;
        while (--i > 0) {
            if (!isNaN(+s[i])) {
                if (numberEnd === -1) {
                    numberEnd = i;
                }
                continue;
            }
            if (s[i] === '.' && !allowDecimal) {
                break;
            }
            if (s[i] === '.') {
                allowDecimal = false;
                continue;
            }
            if (!ignoreNonNumbers) {
                break;
            }
            if (numberEnd !== -1) {
                ignoreNonNumbers = false;
            }
        }
        s = numberEnd === -1 ? '1' : s.substring(i, numberEnd);
        return +parseFloat(s);
    }
    static increaseEndingNumber(s, allowLastNonNumberChars = false, allowDecimal = false, increaseWhile = null) {
        /*let i = s.length;
        let numberEnd = -1;
        while (--i > 0) {
          if (!isNaN(+s[i])) { if (numberEnd === -1) { numberEnd = i; } continue; }
          if (s[i] === '.' && !allowDecimal) { break; }
          if (s[i] === '.') { allowDecimal = false; continue; }
          if (!ignoreNonNumbers) { break; }
          if (numberEnd !== -1) { ignoreNonNumbers = false; }
        }
        if (numberEnd === -1) { return s + '_1'; }
        // i++;
        numberEnd++;*/
        let regexpstr = '([0-9]+' + (allowDecimal ? '|[0-9]+\\.[0-9]+' : '') + ')' + (allowLastNonNumberChars ? '[^0-9]*' : '') + '$';
        const matches = new RegExp(regexpstr, 'g').exec(s); // Global (return multi-match) Single line (. matches \n).
        // S flag removed for browser support (firefox), should work anyway.
        U.pe(matches.length > 2, 'parsing error: /' + regexpstr + '/gs.match(' + s + ')');
        let i = s.length - matches[0].length;
        const prefix = s.substring(0, i);
        let num = 1 + (+matches[1]);
        // U.pe(isNaN(num), 'wrong parsing:', s, s.substring(i, numberEnd), i, numberEnd);
        // const prefix: string = s.substring(0, i);
        // console.log('increaseendingNumber:  prefix: |' + prefix+'| num:'+num, '[i] = ['+i+']; s: |'+s+"|");
        while (increaseWhile !== null && increaseWhile(prefix + num)) {
            num++;
        }
        return prefix + num;
    }
    static isValidName(name) { return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name); }
    static getTSClassName(thing) { return thing.constructor.name + ''; }
    static detailButtonSetup($root = null) {
        if (!$root)
            $root = $(document.body);
        $root.find('button.detail').off('click.detailbutton').on('click.detailbutton', (e, forceHide) => {
            const btn = e.currentTarget;
            const $btn = $(btn);
            const $detailPanel = $root.find(btn.getAttribute('target'));
            const otherButtons = $(btn.parentElement).find('button.detail').toArray().filter(x => x != btn);
            // $styleown.find('div.detail:not(' + btn.getAttribute('target') + ')');
            const b = btn.dataset.on === '1';
            if (forceHide || b) {
                btn.style.width = '';
                btn.dataset.on = '0';
                btn.style.borderBottom = '';
                btn.style.borderBottomLeftRadius = '';
                btn.style.borderBottomRightRadius = '';
                $btn.find('.closed').show();
                $btn.find('.opened').hide();
                // $detailcontainers.show();
                $detailPanel.hide();
            }
            else {
                const size = U.sizeof(btn);
                btn.style.width = size.w + 'px';
                btn.dataset.on = '1';
                btn.style.borderBottom = 'none'; // '3px solid #252525';
                btn.style.borderBottomLeftRadius = '0';
                btn.style.borderBottomRightRadius = '0';
                $btn.find('.closed').hide();
                $btn.find('.opened').show()[0].style.width = (size.w - 15 * 2) + 'px';
                console.log('others:', otherButtons, 'me:', $btn);
                $(otherButtons).data('on', '1').trigger('click', true);
                $detailPanel.show();
            }
        });
        $root.find('div.detail').hide();
    }
    // Prevent the backspace key from navigating back.
    static preventBackSlashHistoryNavigation(event) {
        if (!event || !event.key || event.key.toLowerCase() !== 'backspace') {
            return true;
        }
        const types = ['text', 'password', 'file', 'search', 'email', 'number', 'date',
            'color', 'datetime', 'datetime-local', 'month', 'range', 'search', 'tel', 'time', 'url', 'week'];
        const srcElement = $(event['' + 'srcElement'] || event.target);
        const disabled = srcElement.prop('readonly') || srcElement.prop('disabled');
        if (!disabled) {
            if (srcElement[0].isContentEditable || srcElement.is('textarea')) {
                return true;
            }
            if (srcElement.is('input')) {
                const type = srcElement.attr('type');
                if (!type || types.indexOf(type.toLowerCase()) > -1) {
                    return true;
                }
            }
        }
        event.preventDefault();
        return false;
    }
    // esercizio per antonella array deep copy
    /// copy all the element inside the array, eventually deep cloning but not duplicating objects or leaf elements.
    static ArrayCopy(arr, deep) {
        const ret = [];
        let i;
        for (i = 0; i < arr.length; i++) {
            if (deep && Array.isArray(arr[i])) {
                const tmp = U.ArrayCopy(arr[i], deep);
                ret.push(tmp);
            }
            else {
                ret.push(arr[i]);
            }
        }
        return ret;
    }
    static ArrayMerge(arr1, arr2) {
        if (!arr1 || !arr2)
            return;
        Array.prototype.push.apply(arr1, arr2);
    }
    static ArrayMergeUnique(arr1, arr2) {
        if (!arr1 || !arr2)
            return;
        let i;
        for (i = 0; i < arr2.length; i++) {
            U.ArrayAdd(arr1, arr2[i]);
        }
    }
    static ArrayAdd(arr, elem, unique = true, throwIfContained = false) {
        U.pe(!arr || !Array.isArray(arr), 'arr null or not array:', arr);
        if (!unique) {
            arr.push(elem);
            return true;
        }
        if (arr.indexOf(elem) === -1) {
            arr.push(elem);
            return true;
        }
        U.pe(throwIfContained, 'element already contained:', arr, elem);
        return false;
    }
    static fieldCount(obj) {
        let counter = 1 - 1;
        for (const key in obj) {
            if (!(key in obj)) {
                continue;
            }
            counter++;
        }
        return counter;
    }
    static isPositiveZero(m) {
        if (Object['is' + '']) {
            return Object['is' + ''](m, +0);
        }
        return (1 / m === Number.POSITIVE_INFINITY);
    }
    static isNegativeZero(m) {
        if (Object['is' + '']) {
            return Object['is' + ''](m, -0);
        }
        return (1 / m === Number.NEGATIVE_INFINITY);
    }
    static TanToRadian(n) { return U.DegreeToRad(U.TanToDegree(n)); }
    static TanToDegree(n) {
        if (U.isPositiveZero(n)) {
            return 0;
        }
        if (n === Number.POSITIVE_INFINITY) {
            return 90;
        }
        if (U.isNegativeZero(n)) {
            return 180;
        }
        if (n === Number.POSITIVE_INFINITY) {
            return 270;
        }
        return U.RadToDegree(Math.atan(n));
    }
    static RadToDegree(radians) { return radians * (180 / Math.PI); }
    static DegreeToRad(degree) { return degree * (Math.PI / 180); }
    static replaceAllRegExp(value, regExp, replacement) { return value.replace(regExp, replacement); }
    static fixHtmlSelected($root) {
        const $selecteds = $root.find('select');
        let i;
        for (i = 0; i < $selecteds.length; i++) {
            const $option = $($selecteds[i]).find('option[selected]');
            U.selectHtml($selecteds[i], $option.length ? $option[0].value : null);
        }
    }
    // ignores first N equal chars and return the substring of s1 from N to N+len or until s1 end.
    static strFirstDiff(s1, s2, len) {
        let i;
        if (!s1 && !s2) {
            return [s1, s2];
        }
        if (s1 && !s2) {
            return [s1.substr(0, len), s2];
        }
        if (!s1 && s2) {
            return [s1, s2.substr(0, len)];
        }
        const min = Math.min(s1.length, s2.length);
        for (i = 0; i < min; i++) {
            if (s1[i] !== s2[i]) {
                return [s1.substr(i, len), s2.substr(i, len)];
            }
        }
        return null;
    }
    static mergeArray(a, b, inplace, asSet) {
        a = a || [];
        b = b || [];
        let ret;
        if (inplace) {
            (ret = a).push(...b);
        }
        else {
            ret = a.concat(...b);
        }
        return asSet ? [...new Set(ret)] : ret;
    }
    static mergeClasses(elem1, elem2) {
        const classes1 = elem1.getAttribute('class').split(' ');
        const classes2 = elem2.getAttribute('class').split(' ');
        elem1.setAttribute('class', U.mergeArray(classes1, classes2, true, true).join(' '));
    }
    static mergeStyles(html, fake, styleString = null) {
        let i;
        const styles1 = html.getAttribute('style').split(';');
        const styles2 = (styleString ? styleString : fake.getAttribute('style')).split(';');
        let stylesKv1 = {};
        const stylesKv2 = {};
        let key;
        let val;
        let pos;
        for (i = 0; i < styles1.length; i++) {
            pos = styles1[i].indexOf(':');
            key = styles1[i].substr(0, pos).trim();
            val = styles1[i].substr(pos + 1).trim();
            if (key == '' || val == '')
                continue;
            stylesKv1[key] = val;
        }
        for (i = 0; i < styles2.length; i++) {
            pos = styles2[i].indexOf(':');
            key = styles2[i].substr(0, pos).trim();
            val = styles2[i].substr(pos + 1).trim();
            if (key == '' || val == '')
                continue;
            stylesKv2[key] = val;
        }
        stylesKv1 = U.join(stylesKv1, stylesKv2, true, false);
        let style = '';
        for (key in stylesKv1) {
            style += key + ':' + stylesKv1[key] + '; ';
        }
        html.setAttribute('style', style);
    }
    static merge(a, b, overwriteNull = true, clone = true) { return U.join(a, b, overwriteNull, clone); }
    static join(a, b, overwriteNull = true, clone = true) {
        if (clone) {
            a = U.cloneObj(a);
        }
        let key;
        for (key in b) {
            if (!b.hasOwnProperty(key)) {
                continue;
            }
            if (b[key] !== undefined && a[key] === null && overwriteNull || a[key] === undefined) {
                a[key] = b[key];
            }
        }
        return a;
    }
    static getChildIndex_old(html, allNodes = true) {
        if (allNodes) {
            return Array.prototype.indexOf.call(html.parentNode.childNodes, html);
        }
        return Array.prototype.indexOf.call(html.parentNode.children, html);
    }
    static getChildIndex(array, child) {
        return Array.prototype.indexOf.call(array, child);
    }
    static getIndexesPath_old(parent, child) {
        let ret = [];
        while (child && child !== parent) {
            ret.push(U.getChildIndex(parent.childNodes, child));
            child = child.parentElement;
        }
        // ret = ret.splice(ret.length - 2, 1);
        return ret.reverse();
    }
    static getIndexesPath_NoParentKey(child, parent) {
        U.pe(true, 'getindexespath without parent key: todo');
        return null;
        // todo: top-down ricorsivo a tentativi. implementa loop detection. senza childkey (può variare es: parent.a[3].b.c[1] = child)
        //  return string array con nomi di campi e indici di array.
    }
    static getIndexesPath(child, parentKey, childKey = null /* null = parent is raw array*/, parentLimit = null) {
        let ret = [];
        while (child) {
            const parent = child[parentKey];
            if (child === parentLimit) {
                break;
            }
            if (!parent || parent === child) {
                break;
            }
            const parentArrChilds = childKey ? parent[childKey] : parent;
            ret.push(U.getChildIndex(parentArrChilds, child));
            child = child[parentKey];
        }
        return ret.reverse();
    }
    static followIndexesPath(root, indexedPath, childKey = null, outArr = { indexFollowed: [],
        debugArr: [{ index: 'Start', elem: root }] }, debug = false) {
        let j;
        let ret = root;
        let oldret = ret;
        if (outArr)
            outArr.debugArr.push({ index: 'start', elem: root, childKey: childKey });
        U.pe(childKey && childKey !== '' + childKey, 'U.followIndexesPath() childkey must be a string or a null:', childKey, 'root:', root);
        for (j = 0; j < indexedPath.length; j++) {
            let key = indexedPath[j];
            let childArr = childKey ? ret[childKey] : ret;
            U.pif(debug, 'path ' + j + ') = elem.' + childKey + ' = ', childArr);
            if (!childArr) {
                return oldret;
            }
            ret = childArr[key];
            if (key >= childArr.length) {
                key = 'Key out of boundary: ' + key + '/' + childArr.length + '.';
            }
            U.pif(debug, 'path ' + j + ') = elem.' + childKey + '[ ' + key + '] = ', ret);
            if (outArr)
                outArr.debugArr.push({ index: key, elem: ret });
            if (!ret) {
                return oldret;
            }
            if (outArr)
                outArr.indexFollowed.push(key);
            oldret = ret;
        }
        return ret;
    }
    static followIndexesPathOld(templateRoot, indexedPath, allNodes = true, outArr = { indexFollowed: [] }, debug = false) {
        let j;
        let ret = templateRoot;
        let oldret = ret;
        const debugarr = [{ index: 'Start', html: ret }];
        for (j = 0; j < indexedPath.length; j++) {
            const index = indexedPath[j];
            ret = (allNodes ? ret.childNodes[index] : ret.children[index]);
            if (!ret) {
                console.log('folllowPath: clicked on some dinamically generated content, returning the closest static parent.', debugarr);
                U.pw(debug, 'clicked on some dinamically generated content, returning the closest static parent.', debugarr);
                return oldret;
            }
            oldret = ret;
            outArr.indexFollowed.push(index);
            debugarr.push({ index: index, html: ret });
        }
        U.pif(debug, 'followpath debug arr:', debugarr);
        return ret;
    }
    static removeDuplicates(arr0, clone = false) { return U.mergeArray(arr0, [], !clone, true); }
    static getStartSeparatorKey() { return ++U.startSeparatorKeyMax + ''; }
    static startSeparator(key, separator = ', ') {
        if (key in U.startSeparatorKeys)
            return separator;
        U.startSeparatorKeys[key] = true;
        return '';
    }
    static arrayContains(arr, searchElem) {
        if (!arr)
            return false;
        // return arr && arr.indexOf(searchElem) === -1; not working properly on strings. maybe they are evaluated by references and not by values.
        let i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i] === searchElem)
                return true;
        }
        return false;
    }
    static toBoolString(bool) { return bool ? "true" : "false"; }
    static fromBoolString(str) { return str === "true" || str === 't' || +str === 1; }
    static parseSvgPath(str) {
        let i;
        let letter = null;
        let num1 = null;
        let num2 = null; // useless initializing phase to avoid IDE warnings
        let foundFloat = null;
        let pt = null;
        let current = null;
        const assoc = [];
        const pts = [];
        const ret = { assoc: assoc, pts: pts };
        const debug = false;
        str = str.toUpperCase();
        const startNextEntry = () => {
            num1 = '';
            num2 = '';
            pt = new Point(0, 0);
            pt.x = null;
            pt.y = null;
            foundFloat = false;
        };
        const endCurrentEntry = () => {
            pt.y = +num2;
            U.pe(isNaN(pt.y), 'parsed non-number as value of: |' + letter + '| in svg.path attribute: |' + str + '|', ret);
            current = { letter: letter, pt: pt };
            U.pe(pt.x === null || pt.y === null, num1, num2, pt, i, str);
            pts.push(pt);
            assoc.push(current);
            U.pif(debug, 'endEntry:', current, ' position: |' + str.substr(0, i) + '|' + str.substr(i) + "|");
            startNextEntry();
        };
        startNextEntry();
        for (i = 0; i < str.length; i++) {
            const c = str[i];
            switch (c) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '.':
                case '-':
                case '+':
                    if (c === '.') {
                        U.pe(foundFloat, ' found 2 floating points in a single parsed number in svg.path attribute: |' + str + '|');
                        foundFloat = true;
                    }
                    U.pe((c === '+' || c === '-') && (pt.x === null && num1 !== '' || pt.y === null && num2 !== ''), 'found a ' + c + ' sign inside a number:', ret, i, str);
                    if (pt.x === null) {
                        num1 += c;
                        break;
                    }
                    if (pt.y === null) {
                        num2 += c;
                        break;
                    }
                    U.pe(true, 'found 3 numbers while parsing svg.path attribute: |' + str + '|', ret);
                    break;
                case ' ':
                    if (pt.x === null) {
                        pt.x = +num1;
                        foundFloat = false;
                        U.pe(isNaN(+pt.x), 'parsed non-number as value of: |' + letter + '| in svg.path attribute: |' + str + '|', ret);
                        break;
                    }
                    if (pt.y === null) {
                        pt.y = +num2;
                        U.pe(isNaN(+pt.y), 'parsed non-number as value of: |' + letter + '| in svg.path attribute: |' + str + '|', ret);
                        break;
                    }
                    break;
                default:
                    if (letter) {
                        endCurrentEntry();
                    }
                    letter = c;
                    break;
            }
        }
        endCurrentEntry();
        return ret;
    }
    static focusHistorySetup() {
        U.focusHistoryEntries = U.focusHistoryEntries || [];
        U.focusHistoryElements = U.focusHistoryElements || [];
        U.focusHistoryEntriesAndIdleTimes = U.focusHistoryEntriesAndIdleTimes || [];
        $(document).off('focusin.history').on('focusin.history', (e) => {
            const element = e.target;
            // if (document.activeElement === element) return; // do i need to avoid duplicates or not?
            const entry = new FocusHistoryEntry(e, element);
            U.focusHistoryEntriesAndIdleTimes.push(entry);
            U.focusHistoryElements.push(element);
            U.focusHistoryEntries.push(entry);
            setTimeout(() => { U.focusHistoryEntriesAndIdleTimes.push(null); }, 0);
        });
    }
    static focusHistoryReset() {
        U.focusHistoryEntries = [];
        U.focusHistoryElements = [];
    }
    static getLastFocusEntry() {
        U.pe(!U.focusHistoryEntries, 'focus history not initializated. call U.focusHistorySetup() before');
        return U.focusHistoryEntries[U.focusHistoryEntries.length];
    }
    /*
      static unescapeHtmlEntities(s: string): string { return HE.decode(s); }
      static escapeHtmlEntities(s: string): string { return HE.encode(s); }*/
    static shallowArrayCopy(arr) {
        let ret = [];
        let i;
        if (!arr)
            return null;
        for (i = 0; i < arr.length; i++) {
            ret.push(arr[i]);
        }
        return ret;
    }
    static arrayInsertAt(arr, index, item) {
        U.pe(!arr || !Array.isArray(arr), 'ArrayInsertAt() must have a parameter array');
        index = Math.max(0, index);
        index = Math.min(arr.length, index);
        arr.splice(index, 0, item);
    }
    static newArray(size) {
        let ret = [];
        ret.length = Math.max(0, size);
        return ret;
    }
    static isInput(target, deep_up, select = true, input = true, textarea = true, contenteditable = true) {
        let tag;
        let attrcontenteditable;
        let inputcheck = input ? 'input' : 'mustfail';
        let selectcheck = select ? 'select' : 'mustfail';
        let textareacheck = textarea ? 'textarea' : 'mustfail';
        while (target) {
            if (target === window.document)
                return false;
            let targetElement = target instanceof Element ? target : null;
            tag = targetElement ? targetElement.tagName.toLowerCase() : null;
            if (tag === inputcheck || tag === selectcheck || tag === textareacheck) {
                console.log('isInput:', target);
                return true;
            }
            attrcontenteditable = contenteditable && targetElement ? targetElement.getAttribute('contenteditable') : null;
            if (attrcontenteditable === '' || attrcontenteditable === 'true') {
                console.log('isInput:', target);
                return true;
            }
            if (!deep_up)
                return false;
            target = target.parentNode;
        }
        return false;
    }
    static getValue(input0) {
        const input = (input0 instanceof HTMLInputElement) ? input0 : null;
        if (input)
            return input.value;
        const textarea = (input0 instanceof HTMLTextAreaElement) ? input0 : null;
        if (textarea)
            return textarea.value;
        return input0.getAttribute('value') || input0['' + 'innerText'] || input0.innerHTML;
    }
    static followsPattern(input0) {
        let input = (input0 instanceof HTMLInputElement) ? input0 : null;
        let pattern = input ? input.pattern : input0.getAttribute('pattern');
        if (pattern === null || pattern === undefined)
            return true;
        const val = input ? input.value : U.getValue(input0);
        const regex = new RegExp(pattern);
        return regex && regex.test(val);
    }
    static trimStart(s, trimchars) {
        let i;
        for (i = 0; i < s.length && trimchars.indexOf(s[i]) !== -1; i++) {
            ;
        }
        return s.substr(i);
    }
    static arraySubtract(arr1, arr2, inPlace) {
        let i;
        const ret = inPlace ? arr1 : [...arr1];
        for (i = 0; i < arr2.length; i++) {
            U.arrayRemoveAll(ret, arr2[i]);
        }
        return ret;
    }
    static getAttributesByRegex(elem, regexp) {
        const ret = [];
        let i;
        for (i = 0; i < elem.attributes.length; i++) {
            const attr = elem.attributes[i];
            if (regexp.test(attr.name))
                ret.push(attr);
        }
        return ret;
    }
    static getRelativeParentNode(node) {
        while (node && node instanceof Element) {
            if (window.getComputedStyle(node.parentElement).position === 'relative') {
                return node;
            }
            node = node.parentElement;
        }
        return document.body;
    }
    static swapChildrens(node1, node2) {
        const arr = Array.from(node1.childNodes);
        let i;
        for (i = 0; i < node2.childNodes.length; i++) {
            node1.appendChild(node2.childNodes[i]);
        }
        for (i = 0; i < arr.length; i++) {
            node2.appendChild(arr[i]);
        }
    }
    static swap(node1, node2) {
        U.pe(node1 && !(node1 instanceof Node) || node2 && !(node2 instanceof Node), 'aU.swap() arguments mudt be nodes, found instead:', node1, node2);
        const parent1 = node1.parentNode;
        const parent2 = node2.parentNode;
        // const next1: Node = node1.nextSibling; // qui non è necessario
        const next2 = node2.nextSibling; // se non metto almeno next2, il secondo insertBefore fallisce perchè node2 è stato spostato.
        //console.log('if (parent1 (', parent1, '))  parent1.insertBefore(', node2, node1, '); parent1.removeChild(', node1, '); }');
        //console.log('if (parent2 (', parent2, '))  parent2.insertBefore(', node1, next2, '); parent2.removeChild(', node2, '); }');
        if (parent1) {
            parent1.insertBefore(node2, node1);
            parent1.removeChild(node1);
        }
        if (parent2) {
            parent2.insertBefore(node1, next2);
            parent2.removeChild(node2);
        }
    }
}
U.loopcounter = 0;
U.prefix = 'ULibrary_';
U.sizeofvar = null;
U.$sizeofvar = null;
U.clipboardinput = null;
U.PermuteArr = [];
U.PermuteUsedChars = [];
U.resizingBorder = null;
U.resizingContainer = null;
// static he = null;
U.production = false;
U.addCssAvoidDuplicates = {};
U.varTextToSvg = null;
U.dblclickchecker = new Date().getTime(); // todo: move @ start
U.dblclicktimerms = 300;
U.mouseLeftButton = 0;
U.mouseWheelButton = 1;
U.mouseRightButton = 2;
U.mouseBackButton = 3;
U.mouseForwardButton = 4;
U.mouseLeftButtons = 1; // "evt.buttons" is binary. 7 = left + right + wheel; 0 = no button pressed.
U.mouseRightButtons = 2;
U.mouseWheelButtons = 4;
U.mouseBackButtons = 8;
U.mouseForwardButtons = 16;
U.vertexOldPos = null;
U.$alertcontainer = null;
U.alertcontainer = null;
U.startSeparatorKeys = {};
U.startSeparatorKeyMax = -1;
U.focusHistoryEntriesAndIdleTimes = undefined;
U.focusHistoryEntries = undefined;
U.focusHistoryElements = undefined;
export var AttribETypes;
(function (AttribETypes) {
    //  FakeElementAddFeature = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//FakeElement',
    // era il 'pulsante per aggiungere feature nel mm.',
    // reference = 'reference??',
    AttribETypes["void"] = "???void";
    AttribETypes["EChar"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EChar";
    AttribETypes["EString"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString";
    AttribETypes["EDate"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDate";
    AttribETypes["EFloat"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EFloat";
    AttribETypes["EDouble"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble";
    AttribETypes["EBoolean"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBoolean";
    AttribETypes["EByte"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EByte";
    AttribETypes["EShort"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EShort";
    AttribETypes["EInt"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EInt";
    AttribETypes["ELong"] = "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//ELong";
    /*
    ECharObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//ECharObject',
    EStringObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EStringObject',
    EDateObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDateObject',
    EFloatObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EFloatObject',
    EDoubleObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDoubleObject',
    EBooleanObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EBooleanObj',
    EByteObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EByteObject',
    EShortObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EShortObject',
    EIntObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EIntegerObject',
    ELongObj = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//ELongObject', */
    // EELIST = 'ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EEList', // List<E> = List<?>
})(AttribETypes || (AttribETypes = {}));
// export type Json = object;
export class Json {
    constructor(j) { }
    static getAnnotations(thiss) {
        const ret = thiss[ECorePackage.eAnnotations];
        if (!ret || $.isEmptyObject(ret)) {
            return [];
        }
        if (Array.isArray(ret)) {
            return ret;
        }
        else {
            return [ret];
        }
    }
    static getDetails(thiss) {
        const ret = thiss[ECoreAnnotation.details];
        if (!ret || $.isEmptyObject(ret)) {
            return [];
        }
        if (Array.isArray(ret)) {
            return ret;
        }
        else {
            return [ret];
        }
    }
    static getChildrens(thiss, throwError = false, functions = false) {
        if (!thiss && !throwError) {
            return [];
        }
        const mod = thiss[ECoreRoot.ecoreEPackage];
        const pkg = thiss[ECorePackage.eClassifiers];
        const cla = thiss[functions ? ECoreClass.eOperations : ECoreClass.eStructuralFeatures];
        const fun = thiss[ECoreOperation.eParameters];
        const lit = thiss[ECoreEnum.eLiterals];
        const ret = mod || pkg || cla || fun || lit;
        /*if ( ret === undefined || ret === null ) {
          if (thiss['@name'] !== undefined) { ret = thiss; } // if it's the root with only 1 child arrayless
        }*/
        // U.pe(true, debug, 'getchildrens(', thiss, ')');
        U.pe(throwError && !ret, 'getChildrens() Failed: ', thiss, ret);
        // console.log('ret = ', ret, ' === ', {}, ' ? ', ($.isEmptyObject(ret) ? [] : [ret]));
        if (!ret || $.isEmptyObject(ret)) {
            return [];
        }
        if (Array.isArray(ret)) {
            return ret;
        }
        else {
            return [ret];
        }
    }
    static read(json, field, valueIfNotFound = 'read<T>()CanThrowError') {
        let ret = json ? json[field] : null;
        if (ret !== null && ret !== undefined && field.indexOf(Status.status.XMLinlineMarker) !== -1) {
            U.pe(U.isObject(ret, false, false, true), 'inline value |' + field + '| must be primitive.', ret);
            ret = U.multiReplaceAll('' + ret, ['&amp;', '&#38;', '&quot;'], ['&', '\'', '"']);
        }
        if ((ret === null || ret === undefined)) {
            U.pe(valueIfNotFound === 'read<T>()CanThrowError', 'Json.read<', '> failed: field[' + field + '], json: ', json);
            return valueIfNotFound;
        }
        return ret;
    }
    static write(json, field, val) {
        if (val !== null && field.indexOf(Status.status.XMLinlineMarker) !== -1) {
            U.pe(val !== '' + val, 'inline value |' + field + '| must be a string.', val);
            val = U.multiReplaceAll(val, ['&', '\'', '"'], ['&amp;', '&#38;', '&quot;']);
        }
        else
            U.pe(val !== '' + val || !U.isObject(val, true), 'primitive values should be inserted only inline in the xml:', field, val);
        json[field] = val;
        return val;
    }
}
export class DetectZoom {
    static device() { return detectzoooom.device(); }
    static zoom() { U.pe(true, 'better not use this, looks like always === 1'); return detectzoooom.zoom(); }
    test() {
        let a;
        return a = null;
    }
}
export class ISize {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        if (isNaN(+x)) {
            x = 0;
        }
        if (isNaN(+y)) {
            y = 0;
        }
        if (isNaN(+w)) {
            w = 0;
        }
        if (isNaN(+h)) {
            h = 0;
        }
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    tl() { return this.makePoint(this.x, this.y); }
    tr() { return this.makePoint(this.x + this.w, this.y); }
    bl() { return this.makePoint(this.x, this.y + this.h); }
    br() { return this.makePoint(this.x + this.w, this.y + this.h); }
    equals(size) { return this.x === size.x && this.y === size.y && this.w === size.w && this.h === size.h; }
    /// field-wise Math.min()
    min(minSize, clone) {
        const ret = clone ? this.duplicate() : this;
        if (!isNaN(minSize.x) && ret.x < minSize.x) {
            ret.x = minSize.x;
        }
        if (!isNaN(minSize.y) && ret.y < minSize.y) {
            ret.y = minSize.y;
        }
        if (!isNaN(minSize.w) && ret.w < minSize.w) {
            ret.w = minSize.w;
        }
        if (!isNaN(minSize.h) && ret.h < minSize.h) {
            ret.h = minSize.h;
        }
        return ret;
    }
    max(maxSize, clone) {
        const ret = clone ? this.duplicate() : this;
        if (!isNaN(maxSize.x) && ret.x > maxSize.x) {
            ret.x = maxSize.x;
        }
        if (!isNaN(maxSize.y) && ret.y > maxSize.y) {
            ret.y = maxSize.y;
        }
        if (!isNaN(maxSize.w) && ret.w > maxSize.w) {
            ret.w = maxSize.w;
        }
        if (!isNaN(maxSize.h) && ret.h > maxSize.h) {
            ret.h = maxSize.h;
        }
        return ret;
    }
    contains(pt) {
        return pt.x >= this.x && pt.x <= this.x + this.w && pt.y >= this.y && pt.y <= this.y + this.h;
    }
}
export class Size extends ISize {
    static fromPoints(firstPt, secondPt) {
        const minX = Math.min(firstPt.x, secondPt.x);
        const maxX = Math.max(firstPt.x, secondPt.x);
        const minY = Math.min(firstPt.y, secondPt.y);
        const maxY = Math.max(firstPt.y, secondPt.y);
        return new Size(minX, minY, maxX - minX, maxY - minY);
    }
    clone(json) { return new Size(json.x, json.y, json.w, json.h); }
    duplicate() { return new Size().clone(this); }
    makePoint(x, y) { return new Point(x, y); }
    tl() { return super.tl(); }
    tr() { return super.tr(); }
    bl() { return super.bl(); }
    br() { return super.br(); }
    equals(size) { return super.equals(size); }
    min(minSize, clone) { return super.min(minSize, clone); }
    max(minSize, clone) { return super.max(minSize, clone); }
    intersection(size) {
        // anche "isinside"
        let startx, starty, endx, endy;
        startx = Math.max(this.x, size.x);
        starty = Math.max(this.y, size.y);
        endx = Math.min(this.x + this.w, size.x + size.w);
        endy = Math.min(this.y + this.h, size.y + size.h);
        const intersection = new Size(0, 0, 0, 0);
        intersection.x = startx;
        intersection.y = starty;
        intersection.w = endx - startx;
        intersection.h = endy - starty;
        const doesintersect = intersection.w > 0 && intersection.h > 0;
        return (doesintersect) ? intersection : null;
    }
}
export class GraphSize extends ISize {
    static fromPoints(firstPt, secondPt) {
        const minX = Math.min(firstPt.x, secondPt.x);
        const maxX = Math.max(firstPt.x, secondPt.x);
        const minY = Math.min(firstPt.y, secondPt.y);
        const maxY = Math.max(firstPt.y, secondPt.y);
        return new GraphSize(minX, minY, maxX - minX, maxY - minY);
    }
    static closestIntersection(vertexGSize, prevPt, pt0, gridAlign = null) {
        let pt = pt0.duplicate();
        const m = GraphPoint.getM(prevPt, pt);
        const q = GraphPoint.getQ(prevPt, pt);
        U.pe(Math.abs((pt.y - m * pt.x) - (prevPt.y - m * prevPt.x)) > .001, 'wrong math in Q:', (pt.y - m * pt.x), ' vs ', (prevPt.y - m * prevPt.x));
        /*const isL = prevPt.x < pt.x;
        const isT = prevPt.y < pt.y;
        const isR = !isL;
        const isB = !isT; */
        if (m === Number.POSITIVE_INFINITY && q === Number.NEGATIVE_INFINITY) { // bottom middle
            return new GraphPoint(vertexGSize.x + vertexGSize.w / 2, vertexGSize.y + vertexGSize.h);
        }
        // console.log('pt:', pt, 'm:', m, 'q:', q);
        let L = new GraphPoint(0, 0);
        let T = new GraphPoint(0, 0);
        let R = new GraphPoint(0, 0);
        let B = new GraphPoint(0, 0);
        L.x = vertexGSize.x;
        L.y = m * L.x + q;
        R.x = vertexGSize.x + vertexGSize.w;
        R.y = m * R.x + q;
        T.y = vertexGSize.y;
        T.x = (T.y - q) / m;
        B.y = vertexGSize.y + vertexGSize.h;
        B.x = (B.y - q) / m;
        // prendo solo il compreso pt ~ prevPt (escludo così il "pierce" sulla faccia opposta), prendo il più vicino al centro.
        // console.log('4 possibili punti di intersezione (LTBR):', L, T, B, R);
        /* this.owner.mark(this.owner.toHtmlCoord(T), true, 'blue');
        this.owner.mark(this.owner.toHtmlCoord(B), false, 'violet');
        this.owner.mark(this.owner.toHtmlCoord(L), false, 'red');
        this.owner.mark(this.owner.toHtmlCoord(R), false, 'orange');*/
        if ((B.x >= pt.x && B.x <= prevPt.x) || (B.x >= prevPt.x && B.x <= pt.x)) { }
        else {
            B = null;
        }
        if ((T.x >= pt.x && T.x <= prevPt.x) || (T.x >= prevPt.x && T.x <= pt.x)) { }
        else {
            T = null;
        }
        if ((L.y >= pt.y && L.y <= prevPt.y) || (L.y >= prevPt.y && L.y <= pt.y)) { }
        else {
            L = null;
        }
        if ((R.y >= pt.y && R.y <= prevPt.y) || (R.y >= prevPt.y && R.y <= pt.y)) { }
        else {
            R = null;
        }
        // console.log('superstiti step1: (LTBR):', L, T, B, R);
        const vicinanzaT = !T ? Number.POSITIVE_INFINITY : ((T.x - pt.x) * (T.x - pt.x)) + ((T.y - pt.y) * (T.y - pt.y));
        const vicinanzaB = !B ? Number.POSITIVE_INFINITY : ((B.x - pt.x) * (B.x - pt.x)) + ((B.y - pt.y) * (B.y - pt.y));
        const vicinanzaL = !L ? Number.POSITIVE_INFINITY : ((L.x - pt.x) * (L.x - pt.x)) + ((L.y - pt.y) * (L.y - pt.y));
        const vicinanzaR = !R ? Number.POSITIVE_INFINITY : ((R.x - pt.x) * (R.x - pt.x)) + ((R.y - pt.y) * (R.y - pt.y));
        const closest = Math.min(vicinanzaT, vicinanzaB, vicinanzaL, vicinanzaR);
        // console.log( 'closest:', closest);
        // succede quando pt e prevPt sono entrambi all'interno del rettangolo del vertice.
        // L'edge non è visibile e il valore ritornato è irrilevante.
        if (closest === Number.POSITIVE_INFINITY) {
            /* top center */
            pt = vertexGSize.tl();
            pt.x += vertexGSize.w / 2;
        }
        else if (closest === Number.POSITIVE_INFINITY) {
            /* bottom center */
            pt = vertexGSize.br();
            pt.x -= vertexGSize.w / 2;
        }
        else if (closest === vicinanzaT) {
            pt = T;
        }
        else if (closest === vicinanzaB) {
            pt = B;
        }
        else if (closest === vicinanzaR) {
            pt = R;
        }
        else if (closest === vicinanzaL) {
            pt = L;
        }
        if (!gridAlign) {
            return pt;
        }
        if ((pt === T || pt === B || isNaN(closest)) && gridAlign.x) {
            const floorX = Math.floor(pt.x / gridAlign.x) * gridAlign.x;
            const ceilX = Math.ceil(pt.x / gridAlign.x) * gridAlign.x;
            let closestX;
            let farthestX;
            if (Math.abs(floorX - pt.x) < Math.abs(ceilX - pt.x)) {
                closestX = floorX;
                farthestX = ceilX;
            }
            else {
                closestX = ceilX;
                farthestX = floorX;
            }
            // todo: possibile causa del bug che non allinea punti fake a punti reali. nel calcolo realPT questo non viene fatto.
            // if closest grid intersection is inside the vertex.
            if (closestX >= vertexGSize.x && closestX <= vertexGSize.x + vertexGSize.w) {
                pt.x = closestX;
            }
            else 
            // if 2° closer grid intersection is inside the vertex.
            if (closestX >= vertexGSize.x && closestX <= vertexGSize.x + vertexGSize.w) {
                pt.x = farthestX;
                // if no intersection are inside the vertex (ignore grid)
            }
            else {
                pt = pt;
            }
        }
        else if ((pt === L || pt === R) && gridAlign.y) {
            const floorY = Math.floor(pt.y / gridAlign.y) * gridAlign.y;
            const ceilY = Math.ceil(pt.y / gridAlign.y) * gridAlign.y;
            let closestY;
            let farthestY;
            if (Math.abs(floorY - pt.y) < Math.abs(ceilY - pt.y)) {
                closestY = floorY;
                farthestY = ceilY;
            }
            else {
                closestY = ceilY;
                farthestY = floorY;
            }
            // if closest grid intersection is inside the vertex.
            if (closestY >= vertexGSize.y && closestY <= vertexGSize.y + vertexGSize.h) {
                pt.y = closestY;
            }
            else 
            // if 2° closer grid intersection is inside the vertex.
            if (closestY >= vertexGSize.y && closestY <= vertexGSize.y + vertexGSize.h) {
                pt.y = farthestY;
                // if no intersection are inside the vertex (ignore grid)
            }
            else {
                pt = pt;
            }
        }
        return pt;
    }
    clone(json) { return new GraphSize(json.x, json.y, json.w, json.h); }
    duplicate() { return new GraphSize().clone(this); }
    makePoint(x, y) { return new GraphPoint(x, y); }
    tl() { return super.tl(); }
    tr() { return super.tr(); }
    bl() { return super.bl(); }
    br() { return super.br(); }
    equals(size) { return super.equals(size); }
    min(minSize, clone) { return super.min(minSize, clone); }
    max(minSize, clone) { return super.max(minSize, clone); }
    intersection(size) {
        // anche "isinside"
        let startx, starty, endx, endy;
        startx = Math.max(this.x, size.x);
        starty = Math.max(this.y, size.y);
        endx = Math.min(this.x + this.w, size.x + size.w);
        endy = Math.min(this.y + this.h, size.y + size.h);
        const intersection = new GraphSize(0, 0, 0, 0);
        intersection.x = startx;
        intersection.y = starty;
        intersection.w = endx - startx;
        intersection.h = endy - starty;
        const doesintersect = intersection.w > 0 && intersection.h > 0;
        return (doesintersect) ? intersection : null;
    }
    contains(pt) { return super.contains(pt); }
}
export class IPoint {
    static getM(firstPt, secondPt) { return (firstPt.y - secondPt.y) / (firstPt.x - secondPt.x); }
    static getQ(firstPt, secondPt) { return firstPt.y - IPoint.getM(firstPt, secondPt) * firstPt.x; }
    constructor(x, y) {
        if (isNaN(+x)) {
            x = 0;
        }
        if (isNaN(+y)) {
            y = 0;
        }
        this.x = +x;
        this.y = +y;
    }
    toString() { return '(' + this.x + ', ' + this.y + ')'; }
    subtract(p2, newInstance) {
        U.pe(!p2, 'subtract argument must be a valid point: ', p2);
        let p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.duplicate();
        }
        p1.x -= p2.x;
        p1.y -= p2.y;
        return p1;
    }
    add(p2, newInstance) {
        U.pe(!p2, 'add argument must be a valid point: ', p2);
        let p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.duplicate();
        }
        p1.x += p2.x;
        p1.y += p2.y;
        return p1;
    }
    addAll(p, newInstance) {
        let i;
        let p0;
        if (!newInstance) {
            p0 = this;
        }
        else {
            p0 = this.duplicate();
        }
        for (i = 0; i < p.length; i++) {
            p0.add(p[i], true);
        }
        return p0;
    }
    subtractAll(p, newInstance) {
        let i;
        let p0;
        if (!newInstance) {
            p0 = this;
        }
        else {
            p0 = this.duplicate();
        }
        for (i = 0; i < p.length; i++) {
            p0.subtract(p[i], true);
        }
        return p0;
    }
    multiply(scalar, newInstance) {
        U.pe(isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
        let p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.duplicate();
        }
        p1.x *= scalar;
        p1.y *= scalar;
        return p1;
    }
    divide(scalar, newInstance) {
        U.pe(isNaN(+scalar), 'scalar argument must be a valid number: ', scalar);
        let p1;
        if (!newInstance) {
            p1 = this;
        }
        else {
            p1 = this.duplicate();
        }
        p1.x /= scalar;
        p1.y /= scalar;
        return p1;
    }
    isInTheMiddleOf(firstPt, secondPt, tolleranza) {
        const rectangle = Size.fromPoints(firstPt, secondPt);
        const tolleranzaX = tolleranza; // actually should be cos * arctan(m);
        const tolleranzaY = tolleranza; // actually should be sin * arctan(m);
        if (this.x < rectangle.x - tolleranzaX || this.x > rectangle.x + rectangle.w + tolleranzaX) {
            return false;
        }
        if (this.y < rectangle.y - tolleranzaX || this.y > rectangle.y + rectangle.h + tolleranzaY) {
            return false;
        }
        const m = IPoint.getM(firstPt, secondPt);
        const q = IPoint.getQ(firstPt, secondPt);
        const lineDistance = this.distanceFromLine(firstPt, secondPt);
        // console.log('distance:', lineDistance, ', this:', this, ', p1:', firstPt, ', p2:', secondPt);
        return lineDistance <= tolleranza;
    }
    distanceFromLine(p1, p2) {
        const top = +(p2.y - p1.y) * this.x
            - (p2.x - p1.x) * this.y
            + p2.x * p1.y
            - p1.x * p2.y;
        const bot = (p2.y - p1.y) * (p2.y - p1.y) +
            (p2.x - p1.x) * (p2.x - p1.x);
        return Math.abs(top) / Math.sqrt(bot);
    }
    equals(pt, tolleranzaX = 0, tolleranzaY = 0) {
        if (pt === null) {
            return false;
        }
        return Math.abs(this.x - pt.x) <= tolleranzaX && Math.abs(this.y - pt.y) <= tolleranzaY;
    }
    moveOnNearestBorder(startVertexSize, clone, debug = true) {
        const pt = clone ? this.duplicate() : this;
        const tl = startVertexSize.tl();
        const tr = startVertexSize.tr();
        const bl = startVertexSize.bl();
        const br = startVertexSize.br();
        const L = pt.distanceFromLine(tl, bl);
        const R = pt.distanceFromLine(tr, br);
        const T = pt.distanceFromLine(tl, tr);
        const B = pt.distanceFromLine(bl, br);
        const min = Math.min(L, R, T, B);
        if (min === L) {
            pt.x = tl.x;
        }
        if (min === R) {
            pt.x = tr.x;
        }
        if (min === T) {
            pt.y = tr.y;
        }
        if (min === B) {
            pt.y = br.y;
        }
        if (debug && pt instanceof GraphPoint) {
            Status.status.getActiveModel().graph.markg(pt, false, 'purple');
        }
        return pt;
    }
    getM(pt2) { return IPoint.getM(this, pt2); }
    degreeWith(pt2, toRadians) {
        const directionVector = this.subtract(pt2, true);
        const ret = Math.atan2(directionVector.y, directionVector.x);
        return toRadians ? ret : U.RadToDegree(ret);
    }
    absolute() { return Math.sqrt(this.x * this.x + this.y * this.y); }
}
export class GraphPoint extends IPoint {
    static fromEvent(e) {
        if (!e) {
            return null;
        }
        const p = new Point(e.pageX, e.pageY);
        const g = Status.status.getActiveModel().graph;
        return g.toGraphCoord(p);
    }
    duplicate() { return new GraphPoint(this.x, this.y); }
    clone(other) { this.x = other.x; this.y = other.y; }
    subtract(p2, newInstance) { return super.subtract(p2, newInstance); }
    add(p2, newInstance) { return super.add(p2, newInstance); }
    multiply(scalar, newInstance) { return super.multiply(scalar, newInstance); }
    divide(scalar, newInstance) { return super.divide(scalar, newInstance); }
    isInTheMiddleOf(firstPt, secondPt, tolleranza) { return super.isInTheMiddleOf(firstPt, secondPt, tolleranza); }
    distanceFromLine(p1, p2) { return super.distanceFromLine(p1, p2); }
    equals(pt, tolleranzaX = 0, tolleranzaY = 0) { return super.equals(pt, tolleranzaX, tolleranzaY); }
    moveOnNearestBorder(startVertexSize, clone, debug = true) {
        return super.moveOnNearestBorder(startVertexSize, clone, debug);
    }
    getM(pt2) { return super.getM(pt2); }
    degreeWith(pt2, toRadians) { return super.degreeWith(pt2, toRadians); }
}
export class Point extends IPoint {
    static fromEvent(e) {
        if (!e) {
            return null;
        }
        const p = new Point(e.pageX, e.pageY);
        return p;
    }
    duplicate() { return new Point(this.x, this.y); }
    clone(other) { this.x = other.x; this.y = other.y; }
    subtract(p2, newInstance) { return super.subtract(p2, newInstance); }
    add(p2, newInstance) { return super.add(p2, newInstance); }
    multiply(scalar, newInstance) { return super.multiply(scalar, newInstance); }
    divide(scalar, newInstance) { return super.divide(scalar, newInstance); }
    isInTheMiddleOf(firstPt, secondPt, tolleranza) { return super.isInTheMiddleOf(firstPt, secondPt, tolleranza); }
    distanceFromLine(p1, p2) { return super.distanceFromLine(p1, p2); }
    equals(pt, tolleranzaX = 0, tolleranzaY = 0) { return super.equals(pt, tolleranzaX, tolleranzaY); }
    moveOnNearestBorder(startVertexSize, clone, debug = true) {
        return super.moveOnNearestBorder(startVertexSize, clone, debug);
    }
    getM(pt2) { return super.getM(pt2); }
    degreeWith(pt2, toRadians) { return super.degreeWith(pt2, toRadians); }
}
export class FileReadTypeEnum {
}
FileReadTypeEnum.image = "image/*";
FileReadTypeEnum.audio = "audio/*";
FileReadTypeEnum.video = "video/*";
/// a too much huge list https://www.iana.org/assignments/media-types/media-types.xhtml
FileReadTypeEnum.AndManyOthersButThereAreTooMuch = "And many others... https://www.iana.org/assignments/media-types/media-types.xhtml";
FileReadTypeEnum.OrJustPutFileExtension = "OrJustPutFileExtension";
//# sourceMappingURL=util.js.map