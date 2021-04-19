import {Component, OnDestroy, OnInit} from '@angular/core';
import {U} from '../../common/Joiner';

export class ColorScheme2{
  public static all: {[id: number]: ColorScheme2} = {};
  private static maxID: number = 1;
  public static storageKey: string = 'jodelColorSchemes';
  public id: number;
  public name: string;
  public selector: string;
  public colorPrefix: string;
  public isActive: boolean = true;
  public foreColors: string[] = [];
  // public backColors: string[] = [];
  public autoselector: string;

  static get(id: number): ColorScheme2{ return ColorScheme2.all[id]; }
  static getAll(): ColorScheme2[]{ return Object.values(ColorScheme2.all); }

  static duplicate( other: JSON) :ColorScheme2 {
    const ret = new ColorScheme2(null, null, null, null, null);
    ret.clone(other);
    return ret; }

  constructor(name: string, selector: string, colorPrefix: string, isActive: boolean, foreColors: string[]) {
    this.name = name || 'cs-1';
    this.isActive = isActive;
    this.foreColors = foreColors || [];
    this.colorPrefix = colorPrefix || "color-";
    this.selector = selector || '';
    this.id = ColorScheme2.maxID++;
    this.autoGenerateSelector();
    ColorScheme2.all[this.id] = this;
  }

  // warning: deve generare qualcosa di indipendente dagli altri dati, altrimenti se l'utente cambia gli altri dati si rompono i selettori auto-gestiti tramite la gui del dropdown
  public autoGenerateSelector(): string { return this.autoselector = 'g.VertexRoot [color-scheme*="CS-' + this.id + '|"]'; }// '[color-scheme*="' + this.validateStringForCssVarName(this.name) + '"]'; }

  clone(json: JSON): this {
    let oldid = this.id;
    U.cloneProperties(this, json);
    this.autoGenerateSelector();
    ColorScheme2.maxID = Math.max(ColorScheme2.maxID, this.id + 1);
    ColorScheme2.all[oldid] = null;
    ColorScheme2.all[this.id] = this;
    return this; }

  public static staticinit(): ColorScheme2[] {
    const str: string = localStorage.getItem(ColorScheme2.storageKey) || '[]';
    const arr: ColorScheme2[] = (JSON.parse(str) || []).map(e => ColorScheme2.duplicate(e) );
    ColorScheme2.maxID = arr.length ? Math.max( ...(arr.map((e, i) => { return e.id; }))) + 1 : 0;
    return []; // arr; todo: rimetti array vero
  }

  static loadDefault(): ColorScheme2[]{
    let i = 0;
    const ret = [
      //   --color-1: '#f5f5f5', '#f0f0f0', '#3c3c44', '#2e2f34';
      //   --color-bg-1: '#ffffff', '#f0f0f0', '#2e2f34';
      new ColorScheme2('main theme Light', 'body', 'color-', true,  ['#f5f5f5', '#3c3c44', '#2e2f34', '#1E90FF']),
      // background was: ['#ffffff', '#f0f0f0', '#2e2f34']
      new ColorScheme2('main theme Light bg', 'body', 'color-bg-', true, ['#f4f4f4', '#e0e0e0', '#2e2f34']),
      new ColorScheme2('main theme Dark', 'body', 'color-', false,  [ '#3c3c44', '#b2b2ba', '#f0f0f0', '#1E90FF']),
      new ColorScheme2('main theme Dark bg', 'body', 'color-bg-', false, ['#1a1a1c', '#2e2f34', '#44444c']),
      new ColorScheme2('Vertex', 'g.VertexRoot', null, true, ['#ffffff', '#000000', '#000000', '#1E90FF', '#ff0000']),
      new ColorScheme2('Feature', '.graph .Feature', 'color-f-', true, ['#ff8c00', '#28a745', '#d3d3d3']),
      // examples
      new ColorScheme2('cs-' + i++, null, null, true, ['#ffffff', '#364f6b', '#3fc1c9', '#f5f5f5', '#fc5185']),
      new ColorScheme2('cs-' + i++, null, null, true, ['#ffffff', '#f9a828', '#ececeb', '#07617d', '#2e383f']),
      new ColorScheme2('cs-' + i++, null, null, true, ['#ffffff', '#fa4659', '#effe40', '#a33e83', '#2eb872']),
      new ColorScheme2('cs-' + i++, null, null, true, ['#ffffff', '#BE64FA', '#8459DE', '#5975DE', '#64ACFA']),
    ];
    return ret;
  }

  validateStringForCssVarName(name: string): string {
    name = name.trim().replace(/\s/gi, '-');
    name = name.replace(/([^a-z0-9_\-]+)/gi, '');
    if (!name.length) { name = "color-scheme-1"; }
    else if (!name.match(/^[a-zA-Z_]/)) { name += "_"; }
    return name; }

  getFullSelector(joinStr: string = ', '): string {
    if (!this.selector) return this.autoselector;
    if (U.replaceAll(this.autoselector, '"', "'") === U.replaceAll(this.selector, '"', "'")) return this.selector;
    return this.selector + joinStr + this.autoselector;
  }

}

@Component({
  selector: 'app-color-scheme',
  templateUrl: './color-scheme.component.html',
  styleUrls: ['./color-scheme.component.css']
})

export class ColorSchemeComponent implements OnInit, OnDestroy {
  public static cs: ColorSchemeComponent;
  private static $html: JQuery<HTMLElement>;
  private static $styleNode: JQuery<HTMLStyleElement>;
  private static styleNode: HTMLStyleElement;
  // public display: string;
  public styleStr: string;
  public colorSchemes: ColorScheme2[] = [];
  public temporaryInvisible: boolean;

  constructor() {
  }

  ngOnDestroy() {
    localStorage.setItem(ColorScheme2.storageKey, JSON.stringify(this.colorSchemes));
  }

  ngOnInit() {
    ColorSchemeComponent.cs = this;
    this.temporaryInvisible = false;
    this.colorSchemes = ColorScheme2.staticinit();
    if (this.colorSchemes.length === 0) { this.colorSchemes = ColorScheme2.loadDefault(); }
    // this.display = 'none';
    ColorSchemeComponent.$html = $('app-color-scheme > #colorSchemeEditorRoot');
    ColorSchemeComponent.$styleNode = $('style#colorSchemeStyle');
    ColorSchemeComponent.styleNode = ColorSchemeComponent.$styleNode[0];
    this.updateCss();
    ColorSchemeComponent.show();
  }




  toggleArchived(cs: ColorScheme2): void {
    cs.isActive = !cs.isActive;
    this.enableOmonyms(cs);
    this.updateCss();
  }

  private enableOmonyms(master: ColorScheme2): void {
    let csarr: ColorScheme2[] = [...this.colorSchemes] // must clone array, altrimenti updateOrder rompe l'iterazione forEach
    csarr.forEach( (cs) => {
      if (cs.name.indexOf(master.name) !== 0) return;
      cs.isActive = master.isActive;
      this.updateOrder(cs);
    });
  }


  private updateOrder(cs: ColorScheme2): void {
    U.arrayRemoveAll(this.colorSchemes, cs);
    let lastActiveIndex = this.colorSchemes.length;
    while (--lastActiveIndex) {
      if (this.colorSchemes[lastActiveIndex].isActive) break;
    }
    U.insertAt(this.colorSchemes, lastActiveIndex + 1, cs);
  }

  /*
  disable(cs: ColorScheme2): void {
    U.arrayRemoveAll(this.colorSchemes, cs);
    let lastActiveIndex = this.colorSchemes.length;
    while (--lastActiveIndex) {
      if (this.colorSchemes[lastActiveIndex].isActive) break;
    }
    U.insertAt(this.colorSchemes, lastActiveIndex, cs);
  }*/

  removeColor($event: Event, cs: ColorScheme2, arr: string[]): void {
    if (arr.length) arr.length = arr.length - 1;
    this.updateCss();
  }

  changeColor($event: Event, cs: ColorScheme2, arr: string[], index: number): void {
    const input: HTMLInputElement = $event.target as any;
    arr[index] = input.value;
    this.updateCss();
  }

  addColor($event: Event, cs: ColorScheme2, arr: string[]): void{
    const debug: boolean = false;
    debug&&console.log('addColor(', $event, cs, arr);
    const objarr: {r: number, g: number, b: number, a: number}[] = arr.map((e, i) => U.HexToHexObj(e));
    const avg: {r: number, g: number, b: number, a: number} = {r:0, g:0, b:0, a:0};
    let weights = [];
    let lastVal: number = 1; // 2^0
    const sum: number = Math.pow(2, objarr.length + 1) - 2; // perchè l'array parte da 2 invece che da 1
    for (let i = 0; i < objarr.length; i++) { weights.push( (lastVal *= 2) / sum); }
    if (objarr.length % 2 == 1) { weights = weights.reverse(); }

    debug&&console.log('objarr:', objarr, weights, sum);
    const randomPart = 0.5;
    if (objarr) {
      for (let i = objarr.length; --i >= 0;) {
        const color = objarr[i];
        const randomWeight = randomPart * (2 * Math.random() - 1);
        debug&&console.log('randomWeight', randomWeight);
        const weight = weights[i] * (1 + randomWeight);
        avg.a += color.a ? color.a * weight : 0;
        avg.r += color.r * weight;
        avg.g += color.g * weight;
        avg.b += color.b * weight;
        debug&&console.log('objarr adding::', color, weight, {r:color.r * weight, g: color.g * weight, b: color.b * weight}, U.cloneObj(avg));
      }/*
      avg.a /= objarr.length;
      avg.r /= objarr.length;
      avg.g /= objarr.length;
      avg.b /= objarr.length;*/
    }
    avg.a = Math.max(0, Math.min(255, avg.a));
    avg.r = Math.max(0, Math.min(255, avg.r));
    avg.g = Math.max(0, Math.min(255, avg.g));
    avg.b = Math.max(0, Math.min(255, avg.b));
    arr.push(U.colorObjToArgb(avg, '#', '').rgbhex);
    // this.colorSchemes = this.colorSchemes;// force trigger change?
    this.updateCss();
  }

  addCS(){
    const lastCS: ColorScheme2 = this.colorSchemes[this.colorSchemes.length - 1];
    const newCS: ColorScheme2 = new ColorScheme2(null, null, null, true, null);
    newCS.foreColors = lastCS.foreColors.map( (e) => {
      const color = U.HexToHexObj(e);
      color.r = (color.r + 127) % 256;
      color.g = (color.g + 127) % 256;
      color.b = (color.b + 127) % 256;
      color.a = (color.a + 127) % 256 || null;
      return U.colorObjToArgb(color, '#', '').rgbhex;
    });
    const index = this.colorSchemes.push(newCS);
    this.changeName(null, newCS, newCS.name);
    newCS.selector = newCS.autoGenerateSelector();
    this.updateCss();
  }

  remove(cs: ColorScheme2){
    U.arrayRemoveAll(this.colorSchemes, cs);
    ColorScheme2.all[cs.id] = null;
    this.updateCss(); }

  private updateCss(): void{
    // const scope = "body"; // ".Vertex";
    let str = "";
    for (let i = 0; i < this.colorSchemes.length; i++) {
      let cs = this.colorSchemes[i];
      if (!cs.isActive) continue;
      let selector = cs.getFullSelector(',\n');
      str += selector +' {'; // '[color-scheme="' + cs.name + '"] {\n';
      str += '        /***  ' + cs.name + "  ***/"
      for (let j = 0; j < cs.foreColors.length; j++) {
        const color = cs.foreColors[j];
        str += "\n    --"+cs.colorPrefix + (1+j) + ": " + color + ";";
      }
      /*
      for (let j = 0; j < cs.backColors.length; j++) {
        const color = cs.backColors[j];
        str += "\n    back-color-" + j + ": " + color + ";";
      }*/
      str += "\n}\n\n";
    }
    // str += "body{ color: red !important; background-color: wheat !important;}"
    this.styleStr = str;
    ColorSchemeComponent.styleNode.innerHTML = this.styleStr;
  }

  move($event: MouseEvent, cs: ColorScheme2, csindex: number, direction: -1 | 1): void {
    U.arrayRemoveAll(this.colorSchemes, cs);
    if (csindex + direction === -1) { csindex = this.colorSchemes.length; (direction as any) = 0; }
    else if (csindex + direction === this.colorSchemes.length + 1) { csindex = 0; (direction as any) = 0; }
    U.insertAt(this.colorSchemes, csindex + direction, cs);
    this.updateCss();
  }

  changeColorPrefix($event: Event, cs: ColorScheme2): void{
    const input: HTMLInputElement = $event && $event.target as any;
    cs.colorPrefix = cs.validateStringForCssVarName(input.value);
    this.updateCss();
  }

  changeSelector($event: Event, cs: ColorScheme2): void{
    const input: HTMLInputElement = $event && $event.target as any;
    input.value = cs.selector = input.value.trim();
    this.updateCss();
  }

  changeName($event: Event, cs: ColorScheme2, namepar: string = null): void {
    // let regenerateSelector: boolean = cs.name && cs.autoGenerateSelector() === cs.selector;
    const input: HTMLInputElement = $event && $event.target as any;
    let name: string = (namepar || input.value).trim();
    if (!namepar && cs.name === name) return;
    const namearr: string[] = this.colorSchemes.map( (e, i) => e.name );
    const names = U.ArrayToMap(namearr);
    // console.log('name map', names, namearr, 'name:', name);
    while (names[name]) { name = U.increaseEndingNumber(name); }
    input.value = cs.name = name;
    // regenerateSelector = true;
    // if (regenerateSelector) cs.selector = cs.autoGenerateSelector();
    this.updateCss();
  }
  hide(): void {
    ColorSchemeComponent.$html.hide();
    // this.display = 'none';
    //console.log("cs.hide()");
  }
/*
  show(): void {
    this.display = 'flex'; }*/

  static show(): void {
    // NB: il codice eseguito fuori da questo componente, o dentro componenti che NON hanno @ViewChild non viene osservato per cambiamenti,
    // se modifico le variabili esternamente la grafica non viene aggiornata.
    // quindi modifico direttamente html invece delle variabili
    // console.log("cs.show()");
    ColorSchemeComponent.$html.show();
  }


  public invisible(): void {
    this.temporaryInvisible = true;
  }
  public visible(): void {
    this.temporaryInvisible = false;
  }
  public static getAllSelectors(excludeDisabled: boolean = true): {[selector:string]: ColorScheme2[]} {
    const ret: {[selector:string]: ColorScheme2[]} = {};
    for (let cs of ColorSchemeComponent.cs.colorSchemes) {
      if (excludeDisabled && !cs.isActive) continue;
      const fullselector: string = cs.getFullSelector();
      if (!ret[fullselector]) ret[fullselector] = [cs];
      else ret[fullselector].push(cs);
    }
    return ret;
  }

}
