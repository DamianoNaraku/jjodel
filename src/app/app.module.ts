import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { AppComponent } from './app.component';
import { MminputComponent } from '../guiElements/mminput/mminput.component';
import { MmsidebarComponent } from '../guiElements/mmsidebar/mmsidebar.component';
import { MsidebarComponent } from '../guiElements/msidebar/msidebar.component';
import { IsidebarComponent} from '../guiElements/isidebar/isidebar.component';
import { TopBar, TopBarComponent } from '../guiElements/top-bar/top-bar.component';
import { GraphTabHtmlComponent } from '../guiElements/graph-tab-html/graph-tab-html.component';
import { MmGraphHtmlComponent } from '../guiElements/mm-graph-html/mm-graph-html.component';
import {
  IGraph,
  IModel,
  MetaModel,
  Model,
  ModelPiece,
  ISidebar,
  Json,
  U,
  DetectZoom,
  Dictionary,
  M2Class,
  GraphPoint,
  //Options,
  MyConsole,
  MetaMetaModel,
  ShortAttribETypes,
  ECoreRoot,
  M3Class,
  MClass,
  IClass,
  Typedd,
  EOperation,
  MPackage,
  M2Reference,
  M2Package,
  M2Attribute,
  IPackage,
  M3Package,
  M3Attribute,
  EParameter,
  IAttribute,
  MReference,
  IReference,
  M3Reference,
  MAttribute,
  Type,
  LocalStorage,
  ViewPoint,
  SaveListEntry,
  EType,
  IClassifier,
  GraphSize,
  ELiteral,
  EEnum,
  IEdge,
  IVertex,
  ExtEdge,
  EdgePoint, ViewRule, MeasurableRuleParts, Rotatableoptions, Resizableoptions, Draggableoptions, WebsiteTheme, ChangelogRoot,
} from '../common/Joiner';
import { PropertyBarrComponent }   from '../guiElements/property-barr/property-barr.component';
import { MGraphHtmlComponent }     from '../guiElements/m-graph-html/m-graph-html.component';
import { DamContextMenuComponent } from '../guiElements/dam-context-menu/dam-context-menu.component';
import { StyleEditorComponent }    from '../guiElements/style-editor/style-editor.component';
import { ConsoleComponent }        from '../guiElements/console/console.component';
import {MeasurabletemplateComponent} from './measurabletemplate/measurabletemplate.component';
import KeyDownEvent = JQuery.KeyDownEvent;

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    MminputComponent,
    MmsidebarComponent,
    MsidebarComponent,
    IsidebarComponent,
    TopBarComponent,
    GraphTabHtmlComponent,
    MmGraphHtmlComponent,
    PropertyBarrComponent,
    MGraphHtmlComponent,
    DamContextMenuComponent,
    StyleEditorComponent,
    TopBarComponent,
    ConsoleComponent,
    MeasurabletemplateComponent,
    /*BrowserAnimationsModule*/
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [
    AppComponent,
    MminputComponent,
    DamContextMenuComponent,
    TopBarComponent,
    ConsoleComponent,
    GraphTabHtmlComponent,
    MeasurabletemplateComponent], // todo: devi aggiungere qua ogni componente html (vengono caricati prima dei ts?)
  // aggiunto da me
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
export class Status {
  static status: Status = null;
  static userid: string;
  mmm: MetaMetaModel;
  mm: MetaModel = null;
  m: Model = null;
  typeAliasDictionary: Dictionary<ShortAttribETypes, string> = {};
  aliasTypeDictionary: Dictionary<string, ShortAttribETypes> = {};
  debug = false;
  loadedLogic = false;
  loadedGUI = false;
  XMLinlineMarker: string = '' + '@';
  // todo: consenti di customizzare il marker, (in m3options?)

  refreshModeAll: boolean = true || true;
  refreshModelAndInstances: boolean = false && false;
  refreshModelAndParent: boolean = false && false;
  refreshInstancesToo: boolean = false && false;
  refreshModel: boolean = false && false;
  refreshMetaParentToo: boolean = false && false;
  refreshParentToo: boolean = false && false;
  // modelMatTab: MatTabGroup = null;
  /*showMMGrid = true;
  showMGrid = true;
  mmGrid = new GraphPoint(20, 20);
  mGrid = new GraphPoint(20, 20);*/

  constructor() { }
  save(): string {
    return 'TO DO: SERIALIZE'; }
  getActiveModel(): IModel {
    // if (Status.status.modelMatTab) { if (Status.status.modelMatTab.selectedIndex === 0) { return this.mm; } else { return this.m; } }
    if ($('.UtabHeader.main[data-target="1"][selected="true"]').length === 1) { return Status.status.mm; }
    if ($('.UtabHeader.main[data-target="2"][selected="true"]').length === 1) { return Status.status.m; }
    U.pe(true, 'modello attivo non trovato.');
    return null;
  }

  isM(): boolean {return this.getActiveModel() === this.m; }
  isMM(): boolean {return this.getActiveModel() === this.mm; }

  enableAutosave(timer: number): void {
    $(window).off('beforeunload.unload_autosave').on('beforeunload.unload_autosave', () => { this.autosave(); });
    localStorage.setItem('autosave', 'true');
    setInterval(() => { this.autosave(); }, timer);
  }
  autosave(): void {
    this.mm.save(true, null);
    this.m.save(true, null);


    console.log('autosave completed.');
  }
}


export function main0(loadEvent: Event, tentativi: number = 0) {
  try {
    Status.status = new Status();
    (window as any).global = window;
    // (window as any).global.Buffer = (window as any).global.Buffer || require('buffer').Buffer;
    if (document.getElementById('MM_INPUT') === null) {
      if (tentativi++ >= 10)  { U.pe(true, 'failed to load MM_INPUT'); }
      setTimeout(() => main0(null, tentativi), 100);
      console.log('main0 wait(100)');
      return; }// else { mainForceTabChange(0); }

    // U.loadScript('./app/common/jquery-ui-1.12.1/jquery-ui.js');
    // U.loadScript('./app/common/jquery-ui-1.12.1/jquery-ui.structure.js');
    // U.loadScript('https://code.jquery.com/ui/1.12.1/jquery-ui.min.js');
    main(); }
    catch (e) {
      const errormsg = 'initialization failed, this is likely caused by a failure on connection while downloading libraries or by unsupported browser.';
      console.log('first error:', e);
      try { U.pw(true, errormsg); } catch(ee) { console.log('second error while printing:', ee); document.body.innerHTML = errormsg; }
    }
  // console.log('main(), $ loaded:', $ !== undefined, 'status: ', Status.status);
}
/*function mainForceTabChange(tentativi: number = 0) {
  let retry = false;
  if (!Status.status.modelMatTab) {
    Status.status.modelMatTab = GraphTabHtmlComponent.matTabModel;
    retry = true;
    if (tentativi++ >= 10) { U.pe(true, 'failed to change tab (not initialized)', Status.status); }}
  if (Status.status.modelMatTab && Status.status.modelMatTab.selectedIndex === 1) {
    Status.status.modelMatTab.selectedIndex = 0;
    if (tentativi++ >= 10) { U.pe(true, 'failed to change tab (changeindex)'); }
    retry = true; }
  if (retry) {
    setTimeout(() => mainForceTabChange(tentativi), 100);
  } else { main(); }
}*/

const M2InputXml: string = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<ecore:EPackage xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
  '    xmlns:ecore="http://www.eclipse.org/emf/2002/Ecore" name="pkg" nsURI="http://www.pkg.uri.com" nsPrefix="pkg.prefix">\n' +
  '  <eClassifiers xsi:type="ecore:EClass" name="player">\n' +
  '   <eStructuralFeatures xsi:type="ecore:EAttribute" name="name"' +
  '       eType="ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EChar"/>\n' +
  '  </eClassifiers>\n' +
  '  <eClassifiers xsi:type="ecore:EClass" name="league">\n' +
  '    <eStructuralFeatures xsi:type="ecore:EReference" name="playerlist" eType="#//player"/>\n' +
  '  </eClassifiers>\n' +
  '</ecore:EPackage>\n';

function globalevents(): void {
  // Prevent the backspace key from navigating back.
  const $document = $(document);
  $document.unbind('keydown').bind('keydown', U.preventBackSlashHistoryNavigation);
  $document.on('keydown', (e: KeyDownEvent): void  => {
    console.log('documentKeyDown: ', e.key, e.keyCode);
    if (e.key === 'Escape') { Status.status.getActiveModel().graph.edgeChangingAbort(e); }
  });
  window['' + 'U'] = U;
  window['' + 'IGraph'] = IGraph;
  window['' + 'IVertex'] = IVertex;
  window['' + 'IEdge'] = IEdge;
  window['' + 'ExtEdge'] = ExtEdge;
  window['' + 'EdgePoint'] = EdgePoint;
  window['' + 'ViewPoint'] = ViewPoint;
  window['' + 'ViewRule'] = ViewRule;
  window['' + 'ModelPiece'] = ModelPiece;
  window['' + 'IModel'] = IModel;
  window['' + 'Status'] = Status;
  window['' + 'M3Model'] = MetaMetaModel;
  window['' + 'M2Model'] = MetaModel;
  window['' + 'MModel'] = Model;
  window['' + 'IPackage'] = IPackage;
  window['' + 'M3Package'] = M3Package;
  window['' + 'M2Package'] = M2Package;
  window['' + 'MPackage'] = MPackage;
  window['' + 'Enum'] = EEnum;
  window['' + 'ELiteral'] = ELiteral;
  window['' + 'IClassifier'] = IClass;
  window['' + 'IClass'] = IClass;
  window['' + 'M3Class'] = M3Class;
  window['' + 'M2Class'] = M2Class;
  window['' + 'MClass'] = MClass;
  window['' + 'Typedd'] = Typedd;
  window['' + 'EOperation'] = EOperation;
  window['' + 'EParameter'] = EParameter;
  window['' + 'IReference'] = IReference;
  window['' + 'M3Reference'] = M3Reference;
  window['' + 'M2Reference'] = M2Reference;
  window['' + 'MReference'] = MReference;
  window['' + 'IAttribute'] = IAttribute;
  window['' + 'M3Attribute'] = M3Attribute;
  window['' + 'M2Attribute'] = M2Attribute;
  window['' + 'MAttribute'] = MAttribute;
  window['Rotatableoptions'] = Rotatableoptions;
  window['Resizableoptions'] = Resizableoptions;
  window['Draggableoptions'] = Draggableoptions;
  window['' + 'help'] = [
    'setBackup (backup <= saveToDB)',
    'backupSave (saveToDB <= backup)',
    'destroy (the backup)',
    'discardSave (stop autosave)'];
  window['' + 'destroy'] = () => {
    localStorage.setItem('m1_' + SaveListEntry.model.lastopened, null);
    localStorage.setItem('m2_' + SaveListEntry.model.lastopened, null);
    localStorage.setItem('m1_' + SaveListEntry.view.lastopened, null);
    localStorage.setItem('m2_' + SaveListEntry.view.lastopened, null);
    localStorage.setItem('m1_' + SaveListEntry.vertexPos.lastopened, null);
    localStorage.setItem('m2_' + SaveListEntry.vertexPos.lastopened, null);
    localStorage.setItem('backupMM', null);
    localStorage.setItem('backupGUI', null);
    localStorage.setItem('backupM', null);
    localStorage.setItem('autosave', 'false');
  };
  window['' + 'discardSave'] = () => {
    localStorage.setItem('autosave', 'false');
    $(window).off('beforeunload.unload_autosave');
    window.location.href += ''; };
  window['' + 'backupSave'] = () => {
    window['' + 'discardSave']();
    window['' + 'backupSaveMM']();
    window['' + 'backupSaveM']();
    window['' + 'backupSaveGUI'](); };
  window['' + 'backupSaveGUI'] = () => { localStorage.setItem('modelGraphSave_GUI_Damiano', localStorage.getItem('backupGUI')); };
  window['' + 'backupSaveMM'] = () => { localStorage.setItem('LastOpenedMM', localStorage.getItem('backupMM')); };
  window['' + 'backupSaveM'] = () => { localStorage.setItem('LastOpenedM', localStorage.getItem('backupM')); };
  window['' + 'setBackup'] = () => { window['' + 'setBackupM'](); window['' + 'setBackupMM'](); window['' + 'setBackupGUI'](); };
  window['' + 'setBackupGUI'] = () => { localStorage.setItem('backupGUI', localStorage.getItem('modelGraphSave_GUI_Damiano')); };
  window['' + 'setBackupMM'] = () => { localStorage.setItem('backupMM', localStorage.getItem('LastOpenedMM')); };
  window['' + 'setBackupM'] = () => { localStorage.setItem('backupM', localStorage.getItem('LastOpenedM')); };
}
function setBootstrapOnLowestPriority() {
  let $s = $('style');
  for(let i = 0; i < $s.length; i++) {
    if ($s[i].innerText.substring(0, 220).indexOf('https://getbootstrap.com/') === -1) continue;
    document.head.prepend($s[i]);
    return; }
}

function main() {
  let tmp: any;
  let useless: any;
  let i: number;
  setBootstrapOnLowestPriority();
  (window as any).U = U;
  (window as any).status = Status.status;
  U.focusHistorySetup();
  U.tabSetup();
  $('app-mm-graph-html .propertyBarContainer .UtabHeader').on('click', (e) =>  {
    if (e.currentTarget.innerText === 'Style') { Status.status.mm.graph.propertyBar.styleEditor.onShow(); } else
    if (e.currentTarget.innerText === 'Structured') { Status.status.mm.graph.propertyBar.onShow(); } else
    if (e.currentTarget.innerText === 'Raw')  { Status.status.mm.graph.propertyBar.onShow(true); }
    else { U.pe(true, 'unrecognized right-side tab:', e.currentTarget); }
  });
  $('app-m-graph-html .propertyBarContainer .UtabHeader').on('click', (e) =>  {
    if (e.currentTarget.innerText === 'Style') { Status.status.m.graph.propertyBar.styleEditor.onShow(); } else
    if (e.currentTarget.innerText === 'Structured') { Status.status.m.graph.propertyBar.onShow(); } else
    if (e.currentTarget.innerText === 'Raw')  { Status.status.m.graph.propertyBar.onShow(true); }
    else { U.pe(true, 'unrecognized right-side tab:', e.currentTarget); }
  });
  U.resizableBorderSetup();

  const $resizableBorders: JQuery<HTMLElement> = $('.resizableBorder.side, .resizableBorder.corner');
  for (i = 0; i < $resizableBorders.length; i++) { $resizableBorders[i].style.borderColor = 'var(--mainBorderColor)'; }

  ChangelogRoot.CheckUpdates();

  ECoreRoot.initializeAllECoreEnums();
  globalevents();
  MeasurableRuleParts.staticinit();
  IVertex.staticinit();
  IEdge.staticInit();
  new MyConsole();
  U.pw((tmp = +DetectZoom.device()) !== 1, 'Current zoom level is different from 100%.',
    'The graph part of this website may be graphically misplaced due to a bug with Svg\'s <foreignObject> content.',
    'current zoom:' + (+tmp * 100) + '%',
    'The bug happens in: Chrome.',
    'The bug does NOT happen in: Firefox.',
    'Behaviour is unknown for other browsers.');
  Status.status.typeAliasDictionary[ShortAttribETypes.void] = 'void';
  Status.status.typeAliasDictionary[ShortAttribETypes.EChar] = 'char';
  Status.status.typeAliasDictionary[ShortAttribETypes.EString] = 'string';
  Status.status.typeAliasDictionary[ShortAttribETypes.EDate] = 'date';
  Status.status.typeAliasDictionary[ShortAttribETypes.EFloat] = 'float';
  Status.status.typeAliasDictionary[ShortAttribETypes.EDouble] = 'double';
  Status.status.typeAliasDictionary[ShortAttribETypes.EBoolean] = 'bool';
  Status.status.typeAliasDictionary[ShortAttribETypes.EByte] = 'byte';
  Status.status.typeAliasDictionary[ShortAttribETypes.EShort] = 'short';
  Status.status.typeAliasDictionary[ShortAttribETypes.EInt] = 'int';
  Status.status.typeAliasDictionary[ShortAttribETypes.ELong] = 'long';
  /*
  Status.status.typeAliasDictionary[ShortAttribETypes.ECharObj] = 'ECharObj';
  Status.status.typeAliasDictionary[ShortAttribETypes.EStringObj] = 'EStringObj';
  Status.status.typeAliasDictionary[ShortAttribETypes.EDateObj] = 'EDateObj';
  Status.status.typeAliasDictionary[ShortAttribETypes.EFloatObj] = 'EFloatObj';
  Status.status.typeAliasDictionary[ShortAttribETypes.EDoubleObj] = 'EDoubleObj';
  Status.status.typeAliasDictionary[ShortAttribETypes.EByteObj] = 'EByteObj';
  Status.status.typeAliasDictionary[ShortAttribETypes.EShortObj] = 'EShortObj';
  Status.status.typeAliasDictionary[ShortAttribETypes.EIntObj] = 'EIntObj';
  Status.status.typeAliasDictionary[ShortAttribETypes.ELongObj] = 'ELongObj';
  Status.status.typeAliasDictionary[ShortAttribETypes.EELIST] = 'EELIST';*/
  EType.staticInit();
  DamContextMenuComponent.staticInit();

  const savem2 = LocalStorage.getLastOpened(2);
  const savem1 = LocalStorage.getLastOpened(1);
  /*let MetaMetaModelStr = MetaMetaModel.emptyMetaMetaModel;
  let MetaModelinputStr = MetaModel.emptyModel;
  let ModelinputStr = Model.emptyModel;*/
  const validate = (thing: string, defaultvalue: string): string => { return thing && thing !== '' && thing !== 'null' && thing !== 'undefined' ? thing : defaultvalue; };
  savem2.model = validate(savem2.model, MetaModel.emptyModel);
  savem1.model = validate(savem1.model, Model.emptyModel);

  console.log('loading MM:', savem2);
  console.log('loading M:', savem1);

  Status.status.mmm = new MetaMetaModel(null);
  useless = new TopBar();
  WebsiteTheme.setTheme();
  try {
    Status.status.mm = new MetaModel(JSON.parse(savem2.model), Status.status.mmm);
  } catch(e) {
    U.pw(true, 'Failed to load the metamodel.');
    console.log(e, savem2.model);
    Status.status.mm = new MetaModel(JSON.parse(MetaModel.emptyModel), Status.status.mmm);
  }
  // console.log('m3:', Status.status.mmm, 'm2:', Status.status.mm, 'm1:', Status.status.m); return;
  Type.linkAll();
  M2Class.updateSuperClasses();
  try {
    Status.status.m = new Model(JSON.parse(savem1.model), Status.status.mm);
  } catch(e) {
    U.pw(true, 'Failed to load the model. Does it conform to the metamodel?');
    console.log(e);
    Status.status.m = new Model(JSON.parse(Model.emptyModel), Status.status.mm);
  }
  console.log('m3:', Status.status.mmm, 'm2:', Status.status.mm, 'm1:', Status.status.m);
  // Status.status.m.LinkToMetaParent(Status.status.mm);
  // Status.status.m.fixReferences(); already linked at parse time.
  Status.status.loadedLogic = true;
  useless = new ISidebar(Status.status.mmm, document.getElementById('metamodel_sidebar'));
  useless = new ISidebar(Status.status.mm, document.getElementById('model_sidebar'));
  useless = new IGraph(Status.status.mm, document.getElementById('metamodel_editor') as unknown as SVGSVGElement);
  useless = new IGraph(Status.status.m, document.getElementById('model_editor') as unknown as SVGSVGElement);
  Status.status.loadedGUI = true;
  Status.status.mm.graph.propertyBar.show(Status.status.mm, null, null);
  Status.status.m.graph.propertyBar.show(Status.status.m, null, null);
  Type.updateTypeSelectors(null, true, true, true);

  if (!savem2.vertexpos || !savem2.view){
    const tmpp: {view: string, vertexPos: string} = Status.status.mm.storage.getViewPoints();
    savem2.view = savem2.view || tmpp.view;
    savem2.vertexpos = savem2.vertexpos || tmpp.vertexPos; }

  if (!savem1.vertexpos || !savem1.view){
    const tmpp: {view: string, vertexPos: string} = Status.status.m.storage.getViewPoints();
    savem1.view = savem1.view || tmpp.view;
    savem1.vertexpos = savem1.vertexpos || tmpp.vertexPos; }

  savem2.view = validate(savem2.view, '[]');
  savem2.vertexpos = validate(savem2.vertexpos, '{}');
  savem1.view = validate(savem1.view, '[]');
  savem1.vertexpos = validate(savem1.vertexpos, '{}');
  let marr: IModel[] = [Status.status.mm, Status.status.m];
  let vpmatjson: Json[][] = [JSON.parse(savem2.view || '[]'), JSON.parse(savem1.view || '[]')] as Json[][];
  const vertexposMat: Dictionary<string, GraphPoint>[] = [JSON.parse(savem2.vertexpos), JSON.parse(savem1.vertexpos)] as Dictionary<string, GraphPoint>[];
  // console.log(vpmatjson, Status.status.mm.graph.viewPointShell);

  // return;
  let j: number;
  for (j = 0; j < vertexposMat.length; j++) {
    const vdic: Dictionary<string, GraphPoint> = vertexposMat[j];
    const m: IModel = marr[j];
    for (let key in vdic) {
      console.log('key:', key, 'varr:', vdic);
      const mp: IClassifier = ModelPiece.getByKeyStr(key) as IClassifier;
      const size: GraphSize = new GraphSize().clone(vdic[key]);
      if (!mp || !(mp instanceof IClassifier)) {
        U.cclear();
        U.pw(true, 'invalid vertexposition save, failed to get classifier:', key, vdic); continue; }
      mp.getVertex().setSize(size);
    }
  }

  for (j = 0; j < vpmatjson.length; j++) {
    const vparr: ViewPoint[] = vpmatjson[j] as ViewPoint[];
    const m: IModel = marr[j];
    let v: ViewPoint;
    for (i = 0; i < vparr.length; i++) {
      const jsonvp: ViewPoint = vparr[i];
      // console.clear();
      // console.log('looping this:', jsonvp, ', vpmatjson:', vpmatjson);
      v = new ViewPoint(m);
      v.clone(jsonvp);
      v.updateTarget(m);
      m.graph.viewPointShell.add(v, false); // [persistent isApplied] STEP 1: qui setto checked sulla gui in base al v.isApplied salvato.
      v.isApplied = false; // STEP 2: qui affermo che non è stato ancora applicato
    }
    if (vparr.length === 0) {
      v = new ViewPoint(m); // m.getPrefix() + '_VP autogenerated');
      v.isApplied = true;
      m.graph.viewPointShell.add(v, false); // [persistent isApplied] STEP 1: qui setto checked sulla gui in base al v.isApplied salvato.
      v.isApplied = false; }
    m.graph.viewPointShell.refreshApplied(); // STEP 3: qui vedo che non è stato applicato, ma è stato ordinato dalla gui di applicarlo -> lo applico.
  }

  IEdge.all.forEach((e: IEdge) => { e.refreshGui(); });
  // setTimeout( () => { Status.status.mm.graph.setGrid0(); Status.status.m.graph.setGrid0(); }, 1);
  // Imposto un autosave raramente (minuti) giusto nel caso di crash improvvisi o disconnessioni
  // per evitare di perdere oltre X minuti di lavoro.
  // In condizioni normali non è necessario perchè il salvataggio è effettuato al cambio di pagina asincronamente
  // e con consegna dei dati garantita dal browser anche a pagina chiusa (navigator.beacon)
  return;
  Status.status.enableAutosave(2 * 60 * 1000);
  //Options.enableAutosave(2 * 60 * 1000);
  // Options.Load(Status.status);

}
window['' + 'main'] = main0;
document.addEventListener('DOMContentLoaded', main0);
