import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ModelPiece, Status, U, ansiUp } from '../../common/Joiner';
import * as util from 'util';
// @ts-ignore
let ConsoleComponent = class ConsoleComponent {
    constructor() { }
    ngOnInit() {
    }
};
ConsoleComponent = tslib_1.__decorate([
    Component({
        selector: 'app-console',
        templateUrl: './console.component.html',
        styleUrls: ['./console.component.css']
    })
], ConsoleComponent);
export { ConsoleComponent };
export class MyConsole {
    constructor() {
        this.container = null;
        this.content = null;
        this.inputLine = null;
        this.input = null;
        this.suggestion = null;
        this.commandindex = 0;
        this.commandHistory = [];
        this.newline = '<br/>';
        this.tab = '&nbsp;&nbsp;&nbsp;&nbsp;';
        /*
        * azioni:
        * arrowUp: history--
        * arrowDown: history++
        * enter: apply suggestion, if suggestion is empty executes the user input as command
        * escape: delete suggestion, if suggestion is empty deletes user input too
        * tab: iterate through suggestion list
        * */
        this.suggestionArray = [];
        this.suggestionIndex = -1;
        MyConsole.console = this;
        const $consoleRoot = $('.consoleRoot');
        const $inputLine = $consoleRoot.find('.inputLine');
        this.container = $consoleRoot[0];
        this.content = $consoleRoot.find('.consoleContent')[0];
        this.inputLine = $inputLine[0];
        this.input = $consoleRoot.find('span.input')[0];
        this.suggestion = $consoleRoot.find('.suggestion')[0];
        $inputLine.off('keydown.input').on('keydown.input', (e) => { this.onKeyDown(e); });
        $inputLine.off('keyup.input').on('keyup.input', (e) => { this.onKeyUp(e); });
    }
    onKeyUp(e) {
        switch (e.key) {
            default:
                this.scrollBottom();
                break;
            case 'ArrowUp':
            case 'Enter':
                this.scrollBottom();
                break;
        }
    }
    getText() { return (this.input.innerText + this.suggestion.innerText).trim(); }
    onKeyDown(e) {
        switch (e.key) {
            case 'Enter':
                this.position = 0;
                if (this.suggestion.innerText.length !== 0) {
                    this.input.innerText += this.suggestion.innerText;
                    this.suggestion.innerText = '';
                    this.suggestionArray = [];
                    break;
                }
                this.command(this.getText());
                return;
            case 'Backspace':
                if (this.position === 0) {
                    break;
                }
                this.generateSuggestion();
                break;
            case 'Escape':
                if (this.suggestion.innerText.length > 0) {
                    this.suggestion.innerText = '';
                    break;
                }
                this.input.innerText = '';
                break;
            case 'Tab':
                this.inputLine.focus();
                this.iterateNextSuggestion();
                break;
            case 'ArrowUp':
                e.preventDefault(); // avoid scroll.
                this.suggestionIndex = -1;
                this.suggestionArray = [];
                this.suggestion.innerText = '';
                if (--this.commandindex === -1) {
                    this.commandindex = this.commandHistory.length - 1;
                }
                this.commandindex = (this.commandindex % this.commandHistory.length);
                this.input.innerText = this.commandHistory[this.commandindex];
                this.position = this.input.innerText.length - 1;
                console.log('command[' + (this.commandindex) + '/' + this.commandHistory.length + '] = ' +
                    this.commandHistory[this.commandindex], 'arr:', this.commandHistory);
                break;
            case 'ArrowDown':
                e.preventDefault(); // avoid scroll.
                this.suggestionIndex = -1;
                this.suggestionArray = [];
                this.suggestion.innerText = '';
                this.commandindex = (++this.commandindex % this.commandHistory.length);
                this.input.innerText = this.commandHistory[this.commandindex];
                this.position = this.input.innerText.length - 1;
                console.log('command[' + (this.commandindex) + '/' + this.commandHistory.length + '] = ' +
                    this.commandHistory[this.commandindex], 'arr:', this.commandHistory);
                break;
            case 'ArrowRight':
                if (this.position !== this.input.innerText.length - 1 || this.suggestion.innerText.length === 0)
                    break;
                this.position++;
                this.input.innerText += this.suggestion.innerText.charAt(0);
                this.generateSuggestion();
                break;
            case 'ArrowLeft':
                this.position = Math.max(0, this.position - 1);
                this.suggestion.innerText = '';
                break;
            default:
                // this.input.innerHTML += e.key === ' ' ? '&nbsp;' : e.key;
                this.generateSuggestion();
                this.scrollBottom();
                break;
        }
    }
    scrollBottom() {
        console.log('scrollBottom()');
        // this.container.scrollTop = this.inputLine.offsetHeight;
        this.container.scrollTop = this.content.offsetHeight;
    } /*
    todo:
      comando "setcontext" stessi parametri di getinfo, imposta l'oggetto root.
      comando "getcontext" senza parametri, risponde con l'oggetto root, visualizzato come getinfo.*/
    command(str) {
        str = U.replaceAll(str, ' ', ' ').trim(); // &nbsp; with space
        console.log('myConsole.command(' + str + ')');
        this.commandHistory.push(str);
        // così quando fa keyUp si ritrova l'ultimo comando, se fa keyDown il 2°.
        // dovrei dargli il 1° ma servirebbe un bool o un valore decimale (.5) per metterlo in una posizione tra l'ultimo e il primo
        // invece di sovrapposto al primo o all'ultimo (ho scelto di sovrapporlo al primo).
        this.commandindex = 0;
        this.input.innerText = this.suggestion.innerText = '';
        this.appendInput(str);
        this.appendOutput(this.execCommand(str));
        this.scrollBottom();
    }
    appendInput(str, compoundCommandPart = false) {
        const input = document.createElement('div');
        input.setAttribute('tabindex', '-1');
        input.classList.add('inputEcho');
        if (compoundCommandPart) {
            input.classList.add('compoundCommandPart');
        }
        input.innerHTML = str;
        this.content.appendChild(input);
    }
    appendOutput(str, compoundCommandPart = false) {
        if (str === '') {
            return;
        } // CLS special rule
        U.pe(!str, 'null output');
        const output = document.createElement('div');
        output.setAttribute('tabindex', '-1');
        output.classList.add('output');
        if (compoundCommandPart) {
            output.classList.add('compoundCommandPart');
        }
        output.innerHTML = str;
        this.content.appendChild(output);
    }
    exampleFormatting(s) {
        const es = '<b style="color: forestgreen;">&lt;';
        const ee = '&gt;</b>';
        return es + s + ee;
    }
    optionalFormatting(s) {
        const os = '<i style="color: cornflowerblue;">[';
        const oe = ']</i>';
        return os + s + oe;
    }
    commandFormatting(s) { return '&nbsp;&nbsp;○&nbsp;' + s + this.newline; }
    xmp(str) { return '<xmp style="display: inline;">' + str + '</xmp>'; }
    descriptionFormatting(s) { return this.tab + '<span style = "color: lightsteelblue;">' + s + '</span>' + this.newline; }
    help() {
        const nl = this.newline;
        const tab = this.tab;
        const desc = (s) => this.descriptionFormatting.call(this, s);
        const command = (s) => this.commandFormatting.call(this, s);
        const e = (s) => this.exampleFormatting.call(this, s);
        const o = (s) => this.optionalFormatting.call(this, s);
        return '' +
            'Available Commands:' + this.newline +
            'Normal text like this means literal constants.' + this.newline +
            e('Text like this') + ' are examples that should be replaced without brakets' + this.newline +
            o('Text like this') + ' are optional parameters' + this.newline +
            e('leftCommand') + '|' + e('rightCommand') + ' The vertical bar means "OR", you must choose to insert the left or the ' +
            'right command piece or argument.' + this.newline +
            // 'Non-underlined text is just comments and explanations.' + this.newline +
            'Commands executed without arguments or preceded by the "?" prefix will show the command guide.' + this.newline +
            // '••••'
            command('info ' + e('className') + o('.' + e('attributeName') + '|' + e('referenceName') + '|')) +
            desc('Visualizza informationi riguardo la classe, reference o attributo fornito dal parametro.') +
            command('cc ' + e('Comando Composito')) +
            desc('Consente di concatenare ed eseguire multipli comandi elementari in una sola linea di comando composita, ' +
                'di utilizzare l\'output di un comando come parte dei parametri input di altri comandi e di poter eseguire un qualsiasi ' +
                'codice javascript che interagisca con l\'output dei comandi console') +
            command('raw ' + e('ProssimoComando')) +
            desc('Esegue il prossimo comando mostrandone l\'output come testo grezzo invece che come html ' +
                'per individuare eventuali errori nell\'html impedendo che il browser esegua la correzione automatica, nascondendo il problema.') +
            command('cls') +
            desc(this.cls_Help());
    }
    execCommand(str) {
        str = str.trim();
        const pos = str.indexOf(' ');
        let command = (pos > 0 ? str.substring(0, pos) : str).toLowerCase();
        const params = str.substring(pos).trim();
        console.log('com: "' + command + '", par: "' + params + '"; pos:' + pos + '; str:' + str);
        if (params === '/?' || params === 'help') {
            command = '?' + command;
        }
        switch (command) {
            default:
                console.log(command, str, (command === 'help'), (str === 'help'));
                return 'unrecognized command: |' + this.errorFormatting(this.xmp(command))
                    + '| To see the full list of commands type "help".';
            case '?h':
            case '?help':
            case '?/?':
            case 'h':
            case 'help':
            case '/?': return this.help();
            case '?i':
            case '?info': return this.getModelPieceInfo_Help();
            case 'i':
            case 'info': return this.getModelPieceInfo(params);
            case '?cc':
            case '?compoundcommand': return this.compoundCommand_Help();
            case 'cc':
            case 'compoundcommand': return this.compoundCommand(params);
            case '?raw':
            case '?debug': return this.rawDebug_Help();
            case 'raw':
            case 'debug': return this.rawDebug(params);
            case '?cls': return this.cls_Help();
            case 'cls':
                this.cls();
                return '';
        }
    }
    compoundCommand_Help() {
        let ret;
        const nl = this.newline;
        ret = '' +
            'Consente di concatenare ed eseguire multipli comandi elementari in una sola linea di comando composita' +
            ', di utilizzare l\'output di un comando come parte dei parametri input di altri comandi' +
            ' e di poter eseguire un qualsiasi codice javascript che interagisca con l\'output dei comandi console.' + nl +
            'Il corpo del comando va scritto in codice javascript, all\'interno del quale è possibile eseguire comandi console ' + nl +
            'delimitati dal carattere "$" come prefisso e appendice al comando desiderato, l\'output di tale comando può essere utilizzato ' +
            'dal codice javascript come se fosse una variabile o una funzione che ritorna un oggetto.' + nl +
            'esempio 1:' + nl +
            'cc alert("L\'output del comando help è: " + $help$);' + nl +
            'È anche possibile utilizzare l\'output di un comando come parametro di un altro comando, ' +
            'aggiungendo un ulteriore delimitatore "$" per ogni livello di nesting dei comandi.' + nl +
            'Se ipotizziamo che il ' + nl +
            'esempio 2:' + nl +
            'cc alert($info $$comando2$$.name$);' + nl +
            'Se ad esempio l\'output di \"comando2\" è "Book", il comando diventerà "cc alert($info Book.name$);"' +
            ' e verrà poi eseguito come nell\'esempio 1.' + nl +
            'Terzo esempio ulteriormente compesso, con due compound command concatenati.' +
            'cc alert($info $$cc [altro codice js]$$$comando2$$$[altro codice js] $$.name$);';
        return ret;
    }
    compoundCommand(str, debug = true) {
        const prefix = '$';
        const fullPrefix = prefix + '';
        str = str.replace(/(^\$|(((?!\$).|^))[\$](?!\$))(.*?)(^\$|((?!\$).|^)[\$](?!\$))/gm, (match, capture) => {
            // console.log('matched:', match, 'capture: ', capture);
            if (match === '$') {
                return '';
            }
            // prefixError: un lieve fix manuale alla regexp non 100% esatta.
            let prefixError = '';
            if (match.charAt(0) !== '$') {
                prefixError = match.charAt(0);
                match = match.substring(1);
            }
            let subcommand = match.substring(fullPrefix.length, match.length - 1);
            // todo: max nesting attuale = 3. se faccio nesting 4 allora $$$$ ---> $$
            // per risolvere: sostituisci [not($)]$^n[not($)]  --->  [not($)]$^(n-1)[not($)] in pratica: riduci di una singola $.
            // oppure usa 2^n volte il $ al posto di solo n volte. es 4 nested: $$$$$$$$$$$$$$$$ ---> $$$$$$$$ -> $$$$ -> $$ -> $
            subcommand = U.replaceAll(subcommand, '$$', '$');
            const debugtext = subcommand + '(' + match + ')';
            const tmp = prefixError + '' + this.execCommand(subcommand);
            this.appendInput(subcommand, true);
            this.appendOutput(tmp, true);
            U.pif(debug, 'replaceSingleVar: ' + debugtext + ' --> ' + tmp);
            return tmp;
        });
        return this.execCommand(str);
    }
    rawDebug_Help() {
        let ret;
        const nl = this.newline;
        const e = this.exampleFormatting;
        ret = 'Sintassi: ' + nl + this.commandFormatting('raw' + e('Command'));
        this.descriptionFormatting('Esegue il prossimo comando mostrandone l\'output come testo grezzo invece che come html per individuare' +
            ' eventuali errori nell\'html impedendo che il browser esegua la correzione automatica, nascondendo il problema.');
        return ret;
    }
    cls_Help() {
        return 'Svuota la console cancellando tutti gli input e gli output dei comandi precedenti.';
    }
    cls() { U.clear(this.content); }
    rawDebug(params) {
        let ret = this.execCommand(params);
        ret = U.replaceAll(ret, '<', '&lt;');
        ret = U.replaceAll(ret, '>', '&gt;');
        return '<xmp>' + (ret) + '</xmp>';
    }
    errorFormatting(s) { return '<div class="console_error">' + s + '</div>'; }
    getModelPieceInfo_Help() {
        const nl = this.newline;
        let ret;
        ret = '' +
            'Displays the available sub-fields of an object accessible through the \'.\' operator.' + nl +
            'If a name conflict arise with a childrenObject or instanceObject name, that name will be added with the \'_\' prefix.' + nl +
            'If a name conflict arise with a property only owned by a particular model piece type (es: reference target),' +
            ' that name will be added with the \'@\' prefix.';
        return ret;
    }
    getModelPieceInfo(name) {
        console.log('getModelPieceInfo:', name);
        if (name.indexOf(' ') !== -1) {
            return this.errorFormatting('Spaces are not allowed inside a class, attribute or reference name-path.');
        }
        const tokens = name.split('.');
        const modelPrio = Status.status.getActiveModel();
        let info = this.getModelPieceInfoByModel(modelPrio, tokens);
        if (info) {
            return this.stringify(info);
        }
        // info = this.getModelPieceInfoByModel(modelPrio.isMM() ? Status.status.m : Status.status.mm, tokens);
        info = this.getModelPieceInfoByModel(modelPrio.isMM() ? Status.status.m : Status.status.mm, tokens);
        if (info) {
            return this.stringify(info);
        }
        return this.errorFormatting('"' + name + '" is not matching any class, attribute or reference name-path.');
    }
    stringify(obj) {
        let str = util.inspect(obj, false, 0, true);
        str = ansiUp.ansi_to_html(str);
        return str;
    }
    stringify_Old(obj) {
        const duplicateChecker = [];
        return JSON.stringify(obj, (key, value) => {
            if (!value) {
                return value;
            }
            if ($.isEmptyObject(value)) {
                return '{}';
            }
            if (U.isObject(value)) {
                return '{' + U.getTSClassName(value) + '(' + U.fieldCount(value) + ' fields)}';
            }
            if (U.isArray(value)) {
                return '[Array(' + value.length + ')]';
            }
            if (duplicateChecker.indexOf(value) === -1) {
                return '{_CIRCULAR_REFERENCE_}';
            }
            duplicateChecker.push(value);
            return '' + value;
        });
    }
    getModelPieceInfoByModel(m, tokens, debug = true) {
        const toLower = true;
        const classes = m.getAllClasses();
        debug = true;
        let i = -1;
        if (toLower) {
            while (++i < tokens.length) {
                tokens[i] = toLower ? tokens[i].toLowerCase() : tokens[i];
            }
        }
        i = -1;
        let current = null;
        while (++i < classes.length) {
            const classe = classes[i];
            U.pe(!classe.name, 'err');
            if (!classe.name) {
                return null;
            }
            U.pif(debug, tokens[0] + '===' + classe.name + ' ? ' + (classe.name.toLowerCase() === tokens[0]));
            if (classe.name.toLowerCase() === tokens[0]) {
                current = classe;
                break;
            }
        }
        let ret = current;
        U.pif(debug, 'tokens:', tokens);
        i = 0;
        while (++i < tokens.length) {
            const oldRet = ret;
            U.pif(debug, 'PRE_ret: ', oldRet, ' ---> ', ret, 'token[' + i + '/' + tokens.length + '] = |' + tokens[i] + '|, tok:', tokens);
            if (ret instanceof ModelPiece) {
                U.pif(debug, 'Modelpiece');
                ret = ret.getInfo(toLower);
            }
            else {
                U.pif(debug, 'Terminale');
            }
            U.pif(debug, 'gotInfo:', ret);
            ret = ret[tokens[i]];
            U.pif(debug, 'POST_ret: ', oldRet, ' ---> ', ret, 'token[' + i + '] = |' + tokens[i] + '|');
        }
        if (ret instanceof ModelPiece) {
            return ret.getInfo();
        }
        return ret;
    }
    iteratePrevSuggestion() { this.iterateSuggestionDONOTUSEDirectly(-1); }
    iterateNextSuggestion() { this.iterateSuggestionDONOTUSEDirectly(+1); }
    iterateSuggestionDONOTUSEDirectly(offset) {
        if (!this.suggestionArray.length)
            return;
        this.suggestionIndex = Math.abs((this.suggestionIndex + offset) % this.suggestionArray.length);
        this.suggestion.innerText = this.suggestionArray[this.suggestionIndex];
    }
    generateSuggestion() {
        const oldSuggestion = this.suggestion.innerText;
        return;
        // NB: after the generation, if oldSuggestion is still viable, set that index, otherwise set this.suggestionArray[0];
        this.suggestion.innerText = '//GenerateSuggestion(): to do.';
    }
}
//# sourceMappingURL=console.component.js.map