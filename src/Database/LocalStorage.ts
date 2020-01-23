import {IModel, Json, TopBar, U, InputPopup, ViewRule, ViewPoint, Dictionary, GraphSize} from '../common/Joiner';
import ChangeEvent = JQuery.ChangeEvent;
import KeyDownEvent = JQuery.KeyDownEvent;
import BlurEvent = JQuery.BlurEvent;

export class SaveListEntry {
  static vertexPos = new SaveListEntry('_LastOpenedVertexPos', 'VertexPos', '_SaveListVertexPos');
  static view = new SaveListEntry('_LastOpenedView', 'ViewRule', '_SaveListView');
  static model = new SaveListEntry('_LastOpened', '', '_SaveList');
  lastopened: string;
  prefix: string;
  listname: string;

  constructor(lastopened: string, prefix: string, listname: string) {
    this.lastopened = lastopened;
    this.prefix = prefix;
    this.listname = listname; }
}

export class LocalStorage {
  private static reservedprefix: string = '_';
  prefix: string = '' + '';
  print = true;
  popupTmp: InputPopup = null;
  private model: IModel = null;
  private isAutosavetmp: boolean;
  private saveAstmp: boolean;
  private vertexSaveStr: string;

  static getLastOpened(modelNumber: 1 | 2): {model: string, vertexpos: string, view: string} {
    const ret: {model: string, vertexpos: string, view: string} = {model: null, vertexpos: null, view: null};
    ret.model = localStorage.getItem(LocalStorage.reservedprefix + 'm' + modelNumber + '_' + SaveListEntry.model.lastopened);
    ret.view = localStorage.getItem(LocalStorage.reservedprefix + 'm' + modelNumber + '_' + SaveListEntry.view.lastopened);
    ret.vertexpos = localStorage.getItem(LocalStorage.reservedprefix + 'm' + modelNumber + '_' + SaveListEntry.vertexPos.lastopened);
    return ret; }

  static deleteLastOpened(modelNumber: 1 | 2): void { this.setLastOpened(modelNumber, null, null, null); }

  static setLastOpened(modelNumber: 1 | 2, model: string = null, view: string = null, vertex: string = null): void {
    const prefix = LocalStorage.reservedprefix + 'm' + modelNumber + '_';
    if (model) localStorage.setItem(prefix + SaveListEntry.model.lastopened, model);
    else localStorage.removeItem(prefix +  SaveListEntry.model.lastopened);
    if (view) localStorage.setItem(prefix + SaveListEntry.view.lastopened, view);
    else localStorage.removeItem(prefix +  SaveListEntry.view.lastopened);
    if (vertex) localStorage.setItem(prefix + SaveListEntry.vertexPos.lastopened, vertex);
    else localStorage.removeItem(prefix +  SaveListEntry.vertexPos.lastopened); }

  getViewPoints(): {view: string, vertexPos: string} {
    const m: IModel = this.model;
    const ret = {view: null, vertexPos: null};
    if (!m.name) return ret;
    ret.view = this.get(m.name, SaveListEntry.view);
    ret.vertexPos = this.get(m.name, SaveListEntry.vertexPos);
    return ret; }

  constructor(model: IModel) {
    this.model = model;
    this.prefix = model.getPrefixNum() + '_'; }

  private addToList(key: string, listname: string): void {
    const saveKeyList: string[] = this.getKeyList(listname, null);
    if (U.arrayContains(saveKeyList, key)) return;
    saveKeyList.push(key);
    this.overwriteList(listname, saveKeyList); }

  private removeFromList(key: string, listname: string): void {
    const saveKeyList: string[] = this.getKeyList(listname, null);
    if (!U.arrayContains(saveKeyList, key)) return;
    U.arrayRemoveAll(saveKeyList, key);
    this.overwriteList(listname, saveKeyList); }

  private overwriteList(listname: string, value: string[]): void {
    U.pe(!Array.isArray(value), 'recent savelist must be an array.');
    localStorage.setItem(LocalStorage.reservedprefix + this.prefix + listname, JSON.stringify(value));
    TopBar.topbar.updateRecents(); }

  getKeyList(listname: string, limit: number = null): string[] {
    const ret: string[] = JSON.parse(localStorage.getItem(LocalStorage.reservedprefix + this.prefix + listname));
    if (!ret) { return []; }
    U.pe(!Array.isArray(ret), 'savelist got is not an array:', ret);
    return isNaN(limit) ? ret : ret.splice(limit); }

  add(key: string = null, val: string, saveList: SaveListEntry): void {
    U.pe(val !== '' + val, 'parameter should be string:', val);
    if (val !== '' + val) { val = JSON.stringify(val); }
    key = key ? this.prefix + saveList.prefix + key : null;
    if (val !== 'null' && val !== 'undefined') localStorage.setItem(LocalStorage.reservedprefix + this.prefix + saveList.lastopened, val);
    else localStorage.removeItem(LocalStorage.reservedprefix + this.prefix + saveList.lastopened);
    if (!key) { return; }
    this.addToList(key, saveList.listname);
    localStorage.setItem(key, val);
  }

  remove(oldKey: string, saveList: SaveListEntry): void {
    if (!oldKey) return;
    oldKey = this.prefix + saveList.prefix + oldKey;
    this.removeFromList(oldKey, saveList.listname);
    localStorage.removeItem(oldKey); }

  get(key: string, saveList: SaveListEntry): string {
    key = this.prefix + saveList.prefix + key;
    return localStorage.getItem(key); }

  rename(oldKey: string, newKey: string, saveList: SaveListEntry): void {
    const oldVal: any = this.get(oldKey, saveList);
    this.remove(oldKey, saveList);
    this.add(newKey, oldVal, saveList); }

  p(arg1: any, ...restArgs: any[]): void { U.pif(this.print, arg1, ...restArgs); }

  private finishSave(saveVal: string): void {
    const m: IModel = this.model;
    if (this.popupTmp) { this.popupTmp = this.popupTmp.destroy(); }
    U.pe(!m.name, 'model name should be filled with a validated user input.');

    // must be recalculated, model.name might have been changed by user input (saveas or un-named model being given a name)
    let viewpointSave: string = JSON.stringify(m.generateViewPointSaveArr());
    this.add(m.name, saveVal, SaveListEntry.model);
    this.add(m.name, viewpointSave, SaveListEntry.view);
    this.add(m.name, this.vertexSaveStr, SaveListEntry.vertexPos);
    this.p(m.name + ' VertexPositions saved:', saveVal);
    this.p(m.name + ' ViewPoints saved:', viewpointSave);
    this.p(m.name + ' Model saved:', this.vertexSaveStr);
  }

  private save_BlurEvent(e: BlurEvent | KeyDownEvent, saveVal: string): void {
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    if (!+input.getAttribute('valid')) return;
    this.finishSave(saveVal); }

  private save_OnKeyDown(e: KeyDownEvent, saveVal: string): void {
    // this.save_OnChange(e, popup, model);
    if (e.key !== 'return') { return; }
    this.save_BlurEvent(e, saveVal); }

  private save_OnChange(e: ChangeEvent, model: IModel): void {
    this.p('onchange');
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    let error: boolean = false;
    try { model.setName(input.value); } catch (e) { error = true; } finally {}
    if (error || input.value !== model.name) {
      this.popupTmp.setPostText('invalid or already registered name, a fix');
      input.setAttribute('valid', '0');
      if (model.name) { input.value = model.name; }
      return; }
    input.setAttribute('valid', '1'); }

  saveModel(isAutosave: boolean, saveAs: boolean = false): void {
    U.pe(!!this.popupTmp, 'should not be allowed to have 2 popup for the same Storage. this would lead to a conflict mixing data.');
    this.isAutosavetmp = isAutosave;
    this.saveAstmp = saveAs;
    const model: IModel = this.model;
    const ecoreJSONStr: string = model.generateModelString();
    this.vertexSaveStr = JSON.stringify(model.generateVertexPositionSaveArr() as Dictionary<string, GraphSize>);
    const name = model.name;
    const viepointJSONStr: string = JSON.stringify(model.generateViewPointSaveArr() as Json[]);
    this.p('save ' + this.prefix + 'Model[' + name + '] = ', ecoreJSONStr, 'viewpoints:', viepointJSONStr);

    this.add(null, ecoreJSONStr, SaveListEntry.model);
    this.add(null, viepointJSONStr, SaveListEntry.view);
    this.add(null, this.vertexSaveStr, SaveListEntry.vertexPos);

    let popup: InputPopup;
    const onblur = (e: BlurEvent) => { this.save_BlurEvent(e, ecoreJSONStr); };
    const onkeydown = (e: KeyDownEvent) => { this.save_OnKeyDown(e, ecoreJSONStr); };
    const onchange = (e: any) => { this.save_OnChange(e, model); };
    this.p('isAutosave:', isAutosave, 'saveAs:', saveAs, 'model.name:', model.name);

    // save with a name.
    if (name && name !== '') { this.finishSave(ecoreJSONStr); return; }
    // autosave without a name.
    if (isAutosave) { return; }
    // saveas without a name.
    if (saveAs) {
      popup = new InputPopup('Choose a name for the ' + model.friendlyClassName(),
        '', '', [['change', onchange], ['keydown', onkeydown], ['blur', onblur]],
        'Viewpoint', model.friendlyClassName() + ' name', '');
      popup.show(); return; }
    // user clicked save without a name
  }

  pushToServer(): void {}

  autosave(turn: boolean, permanendNotImplemented: boolean = false): void {
    localStorage.setItem('autosave', '' + turn);
  }

}

export class LocalStorageM {


}
export class LocalStorageM3 extends LocalStorageM {

}
export class LocalStorageM2 extends LocalStorageM {

}
export class LocalStorageM1 extends LocalStorageM {

}

export class LocalStorageStyles extends LocalStorage {

}
