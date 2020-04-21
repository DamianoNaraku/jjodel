/*import {
  AttribETypes,
  Database,
  EOperation,
  EParameter, IAttribute, IClass,
  IModel, IReference,
  M2Attribute,
  M2Class,
  M2Reference,
  MAttribute,
  MClass, Model,
  ModelPiece,
  MReference, Status, U
} from '../common/Joiner';
export class SortType{
  ElementCountCurrentlyStyling: string = "a";
  LexicalOrder: string = "a";

}
export class StyleVisibility {
  public static _public: string = 'public';
  public static _private: string = 'private';
  // approccio estendibile ai gruppi senza neanche creare nuove tabelle.
  public static _publicExceptUserList: string = 'crea una relationship table key=tutto= (owner+stylename+utenteCheNONPuòVedere)';
  public static _privateExceptUserList: string = 'crea una relationship table key=tutto= (owner+stylename+utenteChePuòVedere)';  // lo vede nessuno tranne...
  visibility: string;
}
export class ModelPieceStyleEntry {
  styleVisibility: StyleVisibility;
  name: string;
  userOwner: string;
  imgurlPreview: Element;
  elementStylingCount: number;
  userImportingThis: number;
  forkCounter: number;
  ForkedFromStr_user: string;
  ForkedFromStr_name: string;
  AllowedOnM2: boolean;
  AllowedOnM1: boolean;
  allowedOnClass: boolean;
  allowedOnAttribute: boolean;
  allowedOnReference: boolean;
  allowedOnOperation: boolean;
  allowedOnParameter: boolean;
  featuredependency: {template: string, namesArray: string, typesArray: string}[] = []; // dot separated. "Class" as typeof (m1class | m2class) instead of the name
  protected html: Element = null;

  constructor(ConsiderUsing_constructorr: Element = null) { }

  static load(html: HTMLElement | SVGElement, htmlstr: string, owner: string = null, mp: ModelPiece = null, model: IModel = null): ModelPieceStyleEntry {
    const style: ModelPieceStyleEntry = new ModelPieceStyleEntry(null);
    style.constructorr(html, htmlstr, mp, model);
    return style; }

  public setHtml(html: Element): void { return this.setHtml0(html, null); }
  public setHtmlStr(html: string): void { return this.setHtml0(null, html); }
  private setHtml0(html: Element, htmlstr: string): void {
    // U.pe(!html && !htmlstr, 'both html and htmlstr are null.');
    // U.pe(true, this, html, htmlstr, !html, !htmlstr, !html && !htmlstr);
    if (!html) { html = U.toHtml(htmlstr); }
    if (!htmlstr) { htmlstr = html ? html.outerHTML : null; }
    U.pe(!html || !htmlstr, this, 'html:', html, 'htmlstr:', htmlstr, 'html?', !html, 'htmlstr?', !htmlstr, 'html && htmlstr?', !html && !htmlstr);
    this.html = html;
    const $meta: JQuery<Element> = $(html).find('meta');
    const getValue = (jq: JQuery<Element>): string => { return jq.length === 0 ? '' : jq[0].innerHTML; };
    const isTrue = (jq: JQuery<Element>): boolean => { return jq.length > 0 && (jq[0].innerHTML  === '1' || jq[0].innerHTML === 'true'); };
    this.userOwner = getValue($meta.find('owner'));
    this.name = getValue($meta.find('name'));
    this.AllowedOnM1 = isTrue($meta.find('isM1'));
    this.AllowedOnM2 = isTrue($meta.find('isM2'));
    this.allowedOnClass = isTrue($meta.find('isClass'));
    this.allowedOnAttribute = isTrue($meta.find('isAttribute'));
    this.allowedOnReference = isTrue($meta.find('isReference'));
    this.allowedOnOperation = isTrue($meta.find('isOperation'));
    this.allowedOnParameter = isTrue($meta.find('isParameter'));
    const $tmp = $meta.find('preview');
    this.imgurlPreview = $tmp.length > 0 ? $tmp[0] : U.toHtml('<div>Select a instance to initializeFromModel the preview.</div>'); }
  public getHtml(): Element { return this.html; }
  public getHtmlstr(): string { return this.html.outerHTML; }
  private constructorr(html: Element, htmlstr: string, mp: ModelPiece = null, model: IModel = null): void {
    this.setHtml0(html, htmlstr);
    /*if (ownermp) {
      if (!model) { model = ownermp.getModelRoot(); }
      if (ownermp instanceof IClass) { this.allowedOnClass = true; }
      ...
    } * /
  }


  public saveToDB(): void {
    this.updateHtmlMetaData();
    // Database.updateStyle(this);
  }

  getKey(): string { return this.userOwner + '.' + this.name; }

  duplicate(userid: string = null, newname: string = null): ModelPieceStyleEntry {
    const clone: ModelPieceStyleEntry = new ModelPieceStyleEntry(null);
    if (!userid) { userid = Status.userid; }
    if (!newname) { newname = U.increaseEndingNumber(this.name); }
    const namelist: string[] = Styles.getnamelist();
    while(namelist.indexOf(newname) >= 0) { newname = U.increaseEndingNumber(newname); }
    for (let key in this) { clone['' + key] = this[key]; }
    clone.ForkedFromStr_name = clone.name;
    clone.ForkedFromStr_user = clone.userOwner;
    clone.userOwner = userid;
    clone.name = newname;
    // Database.createStyle(clone);
    Styles.UserStyles.push(clone);
    return clone; }

  delete() {
    const callback = (result: string) => {
      if (result === '1') { U.arrayRemoveAll(Styles.UserStyles, this); }
      else { U.pe(true, 'database request failed, are you connected?'); }
    };
    // Database.deleteStyle(this, callback);
  }

  static getByKey(ownStyleKey: string): ModelPieceStyleEntry {
//    todo: prima check tra gli importati, poi interroga il db.
//    todo 2: se è nel db devo fare una callback e ritornare null.
    U.pe(true, 'getstyleobj by key: todo');
    return undefined;
  }
}

export class Styles {
  static UserStyles: ModelPieceStyleEntry[] = [];
  static searchGlobal(namefragment: string, sortBy: SortType, forM1: boolean = true, callback: (result: ModelPieceStyleEntry[]) => any,
                      includeClass: boolean = true, includeAttribute: boolean = true, includeReference: boolean = true,
                      includeEoperation: boolean = true, includeEParameter: boolean = true,
                      ascending: boolean = true,): void {
    const post: object =
  {operation: 'searchstyleglobally',
    searchstr: namefragment,
    ascending: ascending,
    forM1: forM1,
    includeClass: includeClass,
    includeAttribute: includeAttribute,
    includeReference: includeReference,
    includeEoperation: includeEoperation,
    includeEParameter: includeEParameter,
  };

}
  static displayPreviews(styles: ModelPieceStyleEntry[], entryesForPage: number = 10*5): void {}

  static getStyleFromKey(key: string){
    let i: number;
    for(i = 0; i < Styles.UserStyles.length; i++) { if (Styles.UserStyles[i].getKey() === key) return Styles.UserStyles[i]; }
    return null;
  }
  static staticInit(): void {
    const all: HTMLDataListElement[] = [];
    M2Class.stylesDatalist = document.createElement('datalist');
    all.push(M2Class.stylesDatalist);
    MClass.stylesDatalist = document.createElement('datalist');
    all.push(MClass.stylesDatalist);

    M2Attribute.stylesDatalist = document.createElement('datalist');
    all.push(M2Attribute.stylesDatalist);
    MAttribute.stylesDatalist = document.createElement('datalist');
    all.push(MAttribute.stylesDatalist);

    M2Reference.stylesDatalist = document.createElement('datalist');
    all.push(M2Reference.stylesDatalist);
    MReference.stylesDatalist = document.createElement('datalist');
    all.push(MReference.stylesDatalist);

    EOperation.stylesDatalist = document.createElement('datalist');
    all.push(EOperation.stylesDatalist);
    EParameter.stylesDatalist = document.createElement('datalist');
    all.push(EParameter.stylesDatalist);
  }
  static importStyleEntry(clicked: ModelPieceStyleEntry, fork: boolean = false): void {
    if (fork) {
      // Database.callForkRoutine(clicked, Styles.importStyleEntryFinish);
    } else {this.importStyleEntryFinish(clicked); }
  }
  static importStyleEntryFinish(forkedStyle: ModelPieceStyleEntry, fork: boolean = false): void {
    Styles.UserStyles.push(forkedStyle);
  }


  static getAllowed(o: ModelPiece, m: IModel = null): ModelPieceStyleEntry[] {
    let i: number;
    if (!m) { m = o.getModelRoot(); }
    const ret: ModelPieceStyleEntry[] = [];
    for (i = 0; i < Styles.UserStyles.length; i++) {
      const style: ModelPieceStyleEntry = Styles.UserStyles[i];
      if (m.isM1() && !style.AllowedOnM1) { continue; }
      if (m.isM2() && !style.AllowedOnM2) { continue; }
      if (m instanceof IClass && !style.allowedOnClass) { continue; }
      if (m instanceof IReference && !style.allowedOnReference) { continue; }
      if (m instanceof IAttribute && !style.allowedOnAttribute) { continue; }
      if (m instanceof EOperation && !style.allowedOnOperation) { continue; }
      if (m instanceof EParameter && !style.allowedOnParameter) { continue; }
      ret.push(style); }
    return ret;
  }

  static getnamelist(): string[] { return Styles.UserStyles.map(x => x.name); }
}

/*
gui: import styles from other users
popup opens
search with SortType, checkbix order and text-searchbar by name and owner
display first X result and add a "page" navigation such as google's   '
onclick alla preview incrementa UserImportingThis
crea tab con stili importati e consenti di "cancellarli" (de-importare) o forkare. aggiorna il db di conseguenza.
on applicazione di uno style su una classe / feature: decrementa elementStylingCount allo stile attuale, ed incrementalo a quello cliccato ed applicalo.
Se un user cancella un suo stile che è stato forkato da altri, invece di cancellarlo si cambia user in specialUser "deleted" e si aggiornano tutte le reference.
  quando il forkCounter diventa zero (gli altri utenti hanno tutti abbandonato lo stile) allora si cancella davvero.
*/
//# sourceMappingURL=styles.js.map