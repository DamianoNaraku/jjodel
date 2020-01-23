import { Component, OnInit } from '@angular/core';
import KeyDownEvent = JQuery.KeyDownEvent;
import {M2Class, IModel, Model, ModelPiece, Status, U, IClass, ansiUp} from '../../common/Joiner';
import KeyUpEvent = JQuery.KeyUpEvent;
import * as util from 'util';

// @ts-ignore
@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
export class MyConsole {
  static attribute = '_ngcontent-c4';
  container: HTMLElement = null;
  content: HTMLElement = null;
  inputLine: HTMLElement = null;
  input: HTMLElement = null;
  suggestion: HTMLElement = null;
  position: number;
  commandindex = 0;
  commandHistory: string[] = [];
  newline = '<br/>';
  tab = '&nbsp;&nbsp;&nbsp;&nbsp;';
  constructor(root: HTMLElement) {
    this.container = document.createElement('div');
    this.container.classList.add('consoleRoot');
    this.content = document.createElement('div');
    this.content.classList.add('consoleContent');
    this.inputLine = document.createElement('div');
    this.inputLine.classList.add('inputLine');
    this.input = document.createElement('span');
    this.input.classList.add('input');
    this.inputLine.setAttribute('tabindex', '-1');
    this.suggestion = document.createElement('span');
    this.suggestion.classList.add('suggestion');
    root.appendChild(this.container);
    this.container.appendChild(this.content);
    this.container.appendChild(this.inputLine);
    this.inputLine.appendChild(this.input);
    this.inputLine.appendChild(this.suggestion);

    this.container.setAttribute(MyConsole.attribute, '');
    this.content.setAttribute(MyConsole.attribute, '');
    this.inputLine.setAttribute(MyConsole.attribute, '');
    this.input.setAttribute(MyConsole.attribute, '');
    this.suggestion.setAttribute(MyConsole.attribute, '');
    U.addCss('console', '' +
      '.console_error{ display: inline-block; color: red; }' +
      '.console_input{ display: inline-block; color: red; }' +
      '' +
      '' +
      '');
    this.addEventListeners();
  }
  addEventListeners(): void {
    $(this.inputLine).off('keydown.input').on('keydown.input', (e: KeyDownEvent) => { this.onKeyDown(e); });
    $(this.inputLine).off('keyup.input').on('keyup.input', (e: KeyUpEvent) => { this.onKeyUp(e); });
  }
  onKeyUp(e: KeyUpEvent): void {
    switch (e.key) {
      default: this.scrollBottom(); break;
      case 'ArrowUp': case 'Enter':
        this.scrollBottom(); break;
    }
  }
  onKeyDown(e: KeyDownEvent): void {
    console.log('myconsole.keydown:', e.key);
    switch (e.key) {
      case 'Enter':
        this.position = 0;
        if (this.suggestion.innerText.length !== 0) {
          this.input.innerText += this.suggestion.innerText;
          this.position = this.input.innerText.length - 1;
          this.suggestion.innerText = '';
          return; }
        this.command(this.input.innerText);
        return;
      case 'Backspace':
        this.suggestion.innerText = '';
        if (this.position === 0) { return; }
        this.input.innerText = this.input.innerText.substr(0, --this.position);
        // this.generateSuggestion();
        return;
      case 'Escape':
        if (this.suggestion.innerText.length > 0) { this.suggestion.innerText = ''; return; }
        this.input.innerText = '';
        return;
      case 'Tab':
        this.inputLine.focus();
        this.generateSuggestion();
        return;
      case 'ArrowUp':
        if (--this.commandindex === -1) { this.commandindex = this.commandHistory.length - 1; }
        this.commandindex = (this.commandindex % this.commandHistory.length);
        this.input.innerText = this.commandHistory[this.commandindex];
        this.position = this.input.innerText.length - 1;
        console.log('command[' + (this.commandindex) + '/' + this.commandHistory.length + '] = ' +
          this.commandHistory[this.commandindex], 'arr:', this.commandHistory);
        // avoid scroll.
        e.preventDefault();
        return;
      case 'ArrowDown':
        this.commandindex = (++this.commandindex % this.commandHistory.length);
        this.input.innerText = this.commandHistory[this.commandindex];
        this.position = this.input.innerText.length - 1;
        console.log('command[' + (this.commandindex) + '/' + this.commandHistory.length + '] = ' +
          this.commandHistory[this.commandindex], 'arr:', this.commandHistory);
        // avoid scroll.
        e.preventDefault();
        return;
      case 'ArrowRight':
        if (this.position === this.input.innerText.length - 1 && this.suggestion.innerText.length > 0) {
          this.position++;
          this.input.innerText += this.suggestion.innerText.charAt(0);
          this.suggestion.innerText = this.suggestion.innerText.substr(1);
          return; }
        this.position = Math.min(this.input.innerText.length - 1, this.position + 1);
        return;
      case 'ArrowLeft':
        this.position = Math.max(0, this.position - 1);
        this.suggestion.innerText = '';
        return;
      case 'Shift': case 'Alt': case 'Control': return;
      default:
        if (e.key.length !== 1) {console.log('unexpected key:', e.key); return; }
        this.input.innerHTML += e.key === ' ' ? '&nbsp;' : e.key;
        this.position = (this.position + 1); // % this.input.innerText;
        this.suggestion.innerText = '';
        this.scrollBottom();
    }
  }
  scrollBottom(): void {
    console.log('scrollBottom()');
    // this.container.scrollTop = this.inputLine.offsetHeight;
    this.container.scrollTop = this.content.offsetHeight;
  }
  command(str: string): void {
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
  appendInput(str: string, compoundCommandPart: boolean = false): void {
    const input: HTMLElement = document.createElement('div');
    input.setAttribute(MyConsole.attribute, '');
    input.setAttribute('tabindex', '-1');
    input.classList.add('inputEcho');
    if (compoundCommandPart) { input.classList.add('compoundCommandPart'); }
    input.innerHTML = str;
    this.content.appendChild(input); }

  appendOutput(str: string, compoundCommandPart: boolean = false): void {
    if (str === '') { return; } // CLS special rule
    U.pe(!str, 'null output');
    const output: HTMLElement = document.createElement('div');
    output.setAttribute(MyConsole.attribute, '');
    output.setAttribute('tabindex', '-1');
    output.classList.add('output');
    if (compoundCommandPart) { output.classList.add('compoundCommandPart'); }
    output.innerHTML = str;
    this.content.appendChild(output); }

  exampleFormatting(s: string): string {
    const es = '<b style="color: forestgreen;">&lt;';
    const ee = '&gt;</b>';
    return  es + s + ee; }
  optionalFormatting(s: string): string {
      const os = '<i style="color: cornflowerblue;">[';
      const oe = ']</i>';
      return  os + s + oe; }
  commandFormatting(s: string): string { return '&nbsp;&nbsp;○&nbsp;' + s + this.newline; }
  xmp(str: string): string { return '<xmp style="display: inline;">' + str + '</xmp>'; }
  descriptionFormatting(s: string): string { return this.tab + '<span style = "color: lightsteelblue;">' + s + '</span>' + this.newline; }
  help(): string {
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
      command('cc ' + e('Comando Composito') ) +
      desc('Consente di concatenare ed eseguire multipli comandi elementari in una sola linea di comando composita, ' +
        'di utilizzare l\'output di un comando come parte dei parametri input di altri comandi e di poter eseguire un qualsiasi ' +
        'codice javascript che interagisca con l\'output dei comandi console') +
      command('raw ' + e('ProssimoComando') ) +
      desc('Esegue il prossimo comando mostrandone l\'output come testo grezzo invece che come html ' +
        'per individuare eventuali errori nell\'html impedendo che il browser esegua la correzione automatica, nascondendo il problema.') +
      command('cls' ) +
      desc(this.cls_Help());
  }

  execCommand(str: string): string {
    str = str.trim();
    const pos = str.indexOf(' ');
    let command = (pos > 0 ? str.substring(0, pos) : str).toLowerCase();
    const params = str.substring(pos).trim();
    console.log('com: "' + command + '", par: "' + params + '"; pos:' + pos + '; str:' + str);
    if (params === '/?' || params === 'help') { command = '?' + command; }
    switch (command) {
      default:
        console.log(command, str, (command === 'help'), (str === 'help'));
        return 'unrecognized command: |' + this.errorFormatting(this.xmp(command))
        + '| To see the full list of commands type "help".';
      case '?h': case '?help': case '?/?':
      case 'h': case 'help': case '/?': return this.help();

      case '?i': case '?info': return this.getModelPieceInfo_Help();
      case 'i': case 'info': return this.getModelPieceInfo(params);

      case '?cc': case '?compoundcommand': return this.compoundCommand_Help();
      case 'cc': case 'compoundcommand': return this.compoundCommand(params);

      case '?raw': case '?debug': return this.rawDebug_Help();
      case 'raw': case 'debug': return this.rawDebug(params);

      case '?cls': return this.cls_Help();
      case 'cls': this.cls(); return '';
    }
  }
  compoundCommand_Help(): string {
    let ret: string;
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
    return ret; }

  compoundCommand(str: string, debug: boolean = true): string {
    const prefix = '$';
    const fullPrefix = prefix + '';
    str = str.replace(/(^\$|(((?!\$).|^))[\$](?!\$))(.*?)(^\$|((?!\$).|^)[\$](?!\$))/gm,
      (match: string, capture) => {
        // console.log('matched:', match, 'capture: ', capture);
        if (match === '$') { return ''; }
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
    return this.execCommand(str); }

  rawDebug_Help(): string {
    let ret: string;
    const nl = this.newline;
    const e = this.exampleFormatting;
    ret = 'Sintassi: ' + nl + this.commandFormatting('raw' + e('Command'));
    this.descriptionFormatting('Esegue il prossimo comando mostrandone l\'output come testo grezzo invece che come html per individuare' +
      ' eventuali errori nell\'html impedendo che il browser esegua la correzione automatica, nascondendo il problema.');
    return ret; }

  cls_Help(): string {
    return 'Svuota la console cancellando tutti gli input e gli output dei comandi precedenti.';
  }
  cls(): void { U.clear(this.content); }
  rawDebug(params: string): string {
    let ret = this.execCommand(params);
    ret = U.replaceAll(ret, '<', '&lt;');
    ret = U.replaceAll(ret, '>',  '&gt;');
    return '<xmp>' + (ret) + '</xmp>'; }

  errorFormatting(s: string): string { return '<div class="console_error">' + s + '</div>'; }

  getModelPieceInfo_Help(): string {
    const nl = this.newline;
    let ret: string;
    ret = '' +
      'Displays the available sub-fields of an object accessible through the \'.\' operator.' + nl +
      'If a name conflict arise with a childrenObject or instanceObject name, that name will be added with the \'_\' prefix.' + nl +
      'If a name conflict arise with a property only owned by a particular model piece type (es: reference target),' +
      ' that name will be added with the \'@\' prefix.';
    return ret; }

  getModelPieceInfo(name: string): string {
    console.log('getModelPieceInfo:', name);
    if (name.indexOf(' ') !== -1) {
      return this.errorFormatting('Spaces are not allowed inside a class, attribute or reference name-path.'); }
    const tokens: string[] = name.split('.');
    const modelPrio = Status.status.getActiveModel();
    let info = this.getModelPieceInfoByModel(modelPrio, tokens);
    if (info) { return this.stringify(info); }
    // info = this.getModelPieceInfoByModel(modelPrio.isMM() ? Status.status.m : Status.status.mm, tokens);
    info = this.getModelPieceInfoByModel(modelPrio.isMM() ? Status.status.m : Status.status.mm, tokens);
    if (info) { return this.stringify(info); }
    return this.errorFormatting('"' + name + '" is not matching any class, attribute or reference name-path.'); }

  stringify(obj: any): string {
    let str: string = util.inspect(obj, false, 0, true);
    str = ansiUp.ansi_to_html(str);
    return str; }

  stringify_Old(obj: any): string {
    const duplicateChecker: any[] = [];
    return JSON.stringify(obj, (key: string, value: any) => {
      if (!value) { return value; }
      if ($.isEmptyObject(value)) { return '{}'; }
      if (U.isObject(value)) { return '{' + U.getTSClassName(value) + '(' + U.fieldCount(value) + ' fields)}'; }
      if (U.isArray(value)) { return '[Array(' + value.length + ')]'; }
      if (duplicateChecker.indexOf(value) === -1) { return '{_CIRCULAR_REFERENCE_}'; }
      duplicateChecker.push(value);
      return '' + value; }); }

  getModelPieceInfoByModel(m: IModel, tokens: string[], debug: boolean = true): any {
    const toLower = true;
    const classes: IClass[] = m.getAllClasses();
    debug = true;
    let i = -1;
    if (toLower) { while (++i < tokens.length) { tokens[i] = toLower ? tokens[i].toLowerCase() : tokens[i]; } }
    i = -1;
    let current: IClass = null;
    while (++i < classes.length) {
      const classe = classes[i];
      U.pe(!classe.name, 'err');
      if (!classe.name) { return null; }
      U.pif(debug, tokens[0] + '===' + classe.name + ' ? ' + (classe.name.toLowerCase() === tokens[0]));
      if (classe.name.toLowerCase() === tokens[0]) { current = classe; break; }
    }
    let ret: any = current;
    U.pif(debug, 'tokens:', tokens);
    i = 0;
    while (++i < tokens.length) {
      const oldRet = ret;
      U.pif(debug, 'PRE_ret: ', oldRet, ' ---> ', ret, 'token[' + i + '/' + tokens.length + '] = |' + tokens[i] + '|, tok:', tokens);
      if (ret instanceof ModelPiece) { U.pif(debug, 'Modelpiece'); ret = (ret as ModelPiece).getInfo(toLower);
      } else { U.pif(debug, 'Terminale'); }
      U.pif(debug, 'gotInfo:', ret);
      ret = ret[tokens[i]];
      U.pif(debug, 'POST_ret: ', oldRet, ' ---> ', ret, 'token[' + i + '] = |' + tokens[i] + '|');
    }
    if (ret instanceof ModelPiece) { return ret.getInfo(); }
    return ret;
  }
  private generateSuggestion(): void {
    this.suggestion.innerText = '//GenerateSuggestion(): to do.';
  }
}
