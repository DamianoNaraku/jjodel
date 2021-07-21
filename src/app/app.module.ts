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
  EdgePoint,
  ViewRule,
  MeasurableRuleParts,
  Rotatableoptions,
  Resizableoptions,
  Draggableoptions,
  WebsiteTheme,
  ChangelogRoot,
  TSON,
  TSON_JSTypes,
  TSON_UnsupportedTypes,
  PropertyBarr,
  MeasurableEvalContext,
  InputPopup,
  ECoreEnum,
  MeasurableOperators,
  VsCodeLayerIn,
  VsCodeLayerOut,
  is, Size, ISize, IPoint, Point, measurableRules,
} from '../common/Joiner';

import { PropertyBarrComponent }   from '../guiElements/property-barr/property-barr.component';
import { MGraphHtmlComponent }     from '../guiElements/m-graph-html/m-graph-html.component';
import {DamContextMenu, DamContextMenuComponent} from '../guiElements/dam-context-menu/dam-context-menu.component';
import { StyleEditorComponent }    from '../guiElements/style-editor/style-editor.component';
import { ConsoleComponent }        from '../guiElements/console/console.component';
import {MeasurabletemplateComponent} from './measurabletemplate/measurabletemplate.component';
import KeyDownEvent = JQuery.KeyDownEvent;
import {AutocompleteMatch} from '../common/util';
import MouseDownEvent = JQuery.MouseDownEvent;
import {Network} from 'vis-network';
import {Layouting} from '../guiElements/mGraph/Layouting';
import {M2tcreatorComponent} from '../guiElements/top-bar/m2tcreator/m2tcreator.component';
import {FormsModule} from '@angular/forms';
import {User} from './User';
import { ColorSchemeComponent } from './color-scheme/color-scheme.component';
import Swal from "sweetalert2";

// @ts-ignore
@NgModule({
    declarations:[
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
        ConsoleComponent,
        M2tcreatorComponent,
        ColorSchemeComponent,
        MeasurabletemplateComponent,
        /*BrowserAnimationsModule*/
    ],
  imports:[
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [
    AppComponent,
    MminputComponent,
    DamContextMenuComponent,
    TopBarComponent,
    ConsoleComponent,
    GraphTabHtmlComponent,
    ColorSchemeComponent,
    MeasurabletemplateComponent],
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
  typeAliasDictionary: Dictionary<string, Dictionary<ShortAttribETypes, string>> = {};
  currentTypeAlias: string;
  // aliasTypeDictionary: Dictionary<string, ShortAttribETypes> = {};
  debug = false;
  loadedLogic = false;
  loadedGUI = false;
  XMLinlineMarker: string = '' + '@';
  // todo: consenti di customizzare il marker, (in m3options?)

  refreshModeAll: boolean = true;
  refreshModelAndInstances: boolean = false;
  refreshModelAndParent: boolean = false;
  refreshInstancesToo: boolean = false;
  refreshModel: boolean = false;
  refreshMetaParentToo: boolean = false;
  refreshParentToo: boolean = false;
  // modelMatTab: MatTabGroup = null;
  /*showMMGrid = true;
  showMGrid = true;
  mmGrid = new GraphPoint(20, 20);
  mGrid = new GraphPoint(20, 20);*/
  user: User = new User('mock_user');
  isEmbed: boolean = window.parent !== window;
  isFirefox: boolean = is.firefox();
  allowGenericObjects: boolean = false;
  isProduction: any = window.location.href.indexOf('http://localhost') !== 0;
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

  if (is.safari() && null === localStorage.getItem('unsupported-browser-warned')) {
    localStorage.setItem('unsupported-browser-warned', 'true');
    Swal.fire({
      icon: 'error',
      title: 'Unsupported browser',
      html: 'Using safari might cause visual glitches, gui differences and possibly other issues.' +
        '<br>Best experience with: chrome, edge.' +
        '<br>Trivial issues with: Firefox.' +
        '<br>Major issues with: Safari' +
        '<br>Unknown status for others.'
    });
  }
  if (document.getElementById('MM_INPUT') === null) {
    if (tentativi++ >= 10)  { U.pe(true, 'failed to load html'); }
    console.log('main0 wait(100)');
    setTimeout(() => main0(null, tentativi), 100);
    return; }

  try {
    Status.status = new Status();
    (window as any).global = window;
    U.disableConsole();
    main();
    setTimeout(() => delayedMain(), 1);
  }
    catch (e) {
      const errormsg = 'initialization failed, this is likely caused by a failure on connection while downloading libraries or by unsupported browser.';
      console.error('first error:', e);
      U.disableConsole();
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

function globalNativeFunctionOverride() {
  const getattr = Element.prototype.getAttribute;
  // apparently getattrib() in svg elements is case sensitive, while in html is not. but still svg cannot have uppercase letters in attributes. (chrome bug?)
  Element.prototype.getAttribute = function(qualifiedName: string): string | null { return typeof qualifiedName === TSON_JSTypes.string ? getattr.call(this, qualifiedName.toLowerCase()) : null; }
}

function globalevents(): void {
  globalNativeFunctionOverride();
  // Prevent the backspace key from navigating back.
  const $document = $(document);
  $document.off('mousedown.print').on('mousedown.print', (e: MouseDownEvent) => {
    let mp: ModelPiece = ModelPiece.get(e);
    if (!mp) return;
    let name: string =  mp.printableName(20, true);
    console.info('clicked mp:', mp.id, name, mp);
  });
  $document.off('keydown.preventBackslash').on('keydown.preventBackslash', U.preventBackSlashHistoryNavigation);
  $document.off('keydown.abortEdgeChange').on('keydown.abortEdgeChange', (e: KeyDownEvent): void  => {
    // console.log('documentKeyDown: ', e.key, e.keyCode);
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
  window['' + 'measurableRules'] = measurableRules;
  window['Rotatableoptions'] = Rotatableoptions;
  window['Resizableoptions'] = Resizableoptions;
  window['Draggableoptions'] = Draggableoptions;
  window['TSON'] = TSON;
  window['TSON_JSTypes'] = TSON_JSTypes;
  window['TSON_UnsupportedTypes'] = TSON_UnsupportedTypes;
  window['Network'] = Network;
  window['Layouting'] = Layouting;
  window['TopBar'] = TopBar;
  window['ColorSchemeComponent'] = ColorSchemeComponent;
  window['DamContextMenu'] = DamContextMenu;
  window['is'] = is;
  window['Type'] = Type;
  window['ISize'] = ISize;
  window['Size'] = Size;
  window['GraphSize'] = GraphSize;
  window['IPoint'] = IPoint;
  window['Point'] = Point;
  window['GraphPoint'] = GraphPoint;
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
  window['' + 's'] = Status.status;



  $('#testbtn').on('click', function testClick(){
    console.log("testbtn clicked");
    VsCodeLayerOut.send({type:"jodel.test", body:{a:'a', b:5, c:{d:"nested test", e:2.7}}});
  });

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
  document.body.classList.add(true || Status.status.isProduction ? 'production' : 'debug');
  VsCodeLayerIn.setupReceive();
  setBootstrapOnLowestPriority();
  U.focusHistorySetup();
  U.tabSetup();
  //U.resizableBorderSetup();

  const $resizableBorders: JQuery<HTMLElement> = $('.resizableBorder.side, .resizableBorder.corner');
  for (i = 0; i < $resizableBorders.length; i++) { $resizableBorders[i].style.borderColor = 'var(--mainBorderColor)'; }


  ECoreRoot.initializeAllECoreEnums();
  globalevents();
  EType.LoadTypeMaps();
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
  DamContextMenu.staticInit();

  if (!Status.status.isEmbed) {
    const savem2 = LocalStorage.getLastOpened(2);
    const savem1 = LocalStorage.getLastOpened(1);
    window['' + 'exportexample'] = () => {
      document.body.innerText = 'savem2.model = ' + JSON.stringify(savem2.model)+';\n' +
        'savem2.view = ' + JSON.stringify(savem2.view)+';\n' +
        'savem2.vertexpos = ' + JSON.stringify(savem2.vertexpos)+';\n' +
        'savem1.model = ' + JSON.stringify(savem1.model)+';\n' +
        'savem1.view = ' + JSON.stringify(savem1.view)+';\n' +
        'savem1.vertexpos = ' + JSON.stringify(savem1.vertexpos)+';\n' +
        'break;';
      document.body.style.userSelect = 'all';
    }


    console.error('pre check example');
    switch (U.findGetParameter('example')){
      case 'aircrafts':
        console.log = ()=>{};
        console.info = ()=>{};
        console.warn = ()=>{};
        console.error('aircraft check example');
        savem2.model = "{\n \"ecore:EPackage\": [\n {\n \"@xmi:version\": \"2.0\",\n \"@xmlns:xmi\": \"http://www.omg.org/XMI\",\n \"@xmlns:xsi\": \"http://www.w3.org/2001/XMLSchema-instance\",\n \"@xmlns:ecore\": \"http://www.eclipse.org/emf/2002/Ecore\",\n \"@name\": \"defaultPackage\",\n \"@nsURI\": \"http://default/uri/to/change\",\n \"@nsPrefix\": \"default.namespace.to.change\",\n \"eClassifiers\": [\n {\n \"@xsi:type\": \"ecore:EClass\",\n \"@name\": \"Aircraft\",\n \"@interface\": \"false\",\n \"@abstract\": \"false\",\n \"eStructuralFeatures\": [\n {\n \"@xsi:type\": \"ecore:EAttribute\",\n \"@eType\": \"ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble\",\n \"@name\": \"maxAltitude\",\n \"@lowerBound\": \"0\",\n \"@upperBound\": \"1\"\n },\n {\n \"@xsi:type\": \"ecore:EAttribute\",\n \"@eType\": \"ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble\",\n \"@name\": \"emptyWeight\",\n \"@lowerBound\": \"0\",\n \"@upperBound\": \"1\"\n },\n {\n \"@xsi:type\": \"ecore:EAttribute\",\n \"@eType\": \"ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EShort\",\n \"@name\": \"seats\",\n \"@lowerBound\": \"0\",\n \"@upperBound\": \"1\"\n },\n {\n \"@xsi:type\": \"ecore:EAttribute\",\n \"@eType\": \"ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString\",\n \"@name\": \"model\",\n \"@lowerBound\": \"0\",\n \"@upperBound\": \"1\"\n },\n {\n \"@xsi:type\": \"ecore:EAttribute\",\n \"@eType\": \"ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble\",\n \"@name\": \"height\",\n \"@lowerBound\": \"0\",\n \"@upperBound\": \"1\"\n },\n {\n \"@xsi:type\": \"ecore:EAttribute\",\n \"@eType\": \"ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble\",\n \"@name\": \"width\",\n \"@lowerBound\": \"0\",\n \"@upperBound\": \"1\"\n },\n {\n \"@xsi:type\": \"ecore:EAttribute\",\n \"@eType\": \"ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble\",\n \"@name\": \"wings\",\n \"@lowerBound\": \"0\",\n \"@upperBound\": \"1\"\n }\n ],\n \"eOperations\": []\n },\n {\n \"@xsi:type\": \"ecore:EClass\",\n \"@name\": \"Motorized\",\n \"@interface\": \"false\",\n \"@abstract\": \"false\",\n \"@eSuperTypes\": \"#//Aircraft\",\n \"eStructuralFeatures\": [\n {\n \"@xsi:type\": \"ecore:EAttribute\",\n \"@eType\": \"ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EDouble\",\n \"@name\": \"tankCapacity\",\n \"@lowerBound\": \"0\",\n \"@upperBound\": \"1\"\n }\n ],\n \"eOperations\": []\n },\n {\n \"@xsi:type\": \"ecore:EClass\",\n \"@name\": \"Hangar\",\n \"@interface\": \"false\",\n \"@abstract\": \"false\",\n \"eStructuralFeatures\": [\n {\n \"@xsi:type\": \"ecore:EReference\",\n \"@eType\": \"#//Aircraft\",\n \"@name\": \"aircrafts\",\n \"@lowerBound\": 0,\n \"@upperBound\": -1,\n \"@containment\": true\n }\n ],\n \"eOperations\": []\n },\n {\n \"@xsi:type\": \"ecore:EClass\",\n \"@name\": \"GraphRuler\",\n \"@interface\": \"false\",\n \"@abstract\": \"false\",\n \"eStructuralFeatures\": [],\n \"eOperations\": []\n },\n {\n \"@xsi:type\": \"ecore:EClass\",\n \"@name\": \"Glider\",\n \"@interface\": \"false\",\n \"@abstract\": \"false\",\n \"@eSuperTypes\": \"#//Aircraft\",\n \"eStructuralFeatures\": [\n {\n \"@xsi:type\": \"ecore:EAttribute\",\n \"@eType\": \"ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString\",\n \"@name\": \"glido\",\n \"@lowerBound\": \"0\",\n \"@upperBound\": \"1\"\n }\n ],\n \"eOperations\": []\n }\n ]\n }\n ]\n}";
        savem2.view = "[{\"targetStr\":\"[1]\",\"htmlo\":null,\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":null,\"edgeViews\":[],\"isDefault\":false,\"id\":0,\"isApplied\":true,\"runtimeorder\":2,\"scroll\":{\"x\":0,\"y\":0},\"zoom\":{\"x\":1,\"y\":1},\"grid\":{\"x\":20,\"y\":20},\"views\":[],\"defaultStyleMap\":{},\"name\":\"ViewPoint 1\"}]";
        savem2.vertexpos = "{\"[1,0,0]\":{\"x\":460,\"y\":280,\"w\":201,\"h\":244},\"[1,0,1]\":{\"x\":780,\"y\":280,\"w\":201,\"h\":88},\"[1,0,2]\":{\"x\":160,\"y\":280,\"w\":201,\"h\":88},\"[1,0,3]\":{\"x\":160,\"y\":440,\"w\":201,\"h\":75},\"[1,0,4]\":{\"x\":780,\"y\":420,\"w\":201,\"h\":88}}";
        savem1.model = "{\n \"default.namespace.to.change:Hangar\": {\n \"@xmlns:xmi\": \"http://www.omg.org/XMI\",\n \"@xmlns:default.namespace.to.change\": \"http://default/uri/to/change\",\n \"@xmi:version\": \"2.0\",\n \"aircrafts\": [\n {\n \"@wings\": 25.55,\n \"@width\": 10.16,\n \"@height\": 2.21,\n \"@model\": \"Perlan2\",\n \"@seats\": 2,\n \"@emptyWeight\": 390,\n \"@maxAltitude\": 23195,\n \"@glido\": \"glider\"\n },\n {\n \"@wings\": 59.6,\n \"@width\": 70.6,\n \"@height\": 19.3,\n \"@model\": \"Boeing747-100\",\n \"@seats\": 366,\n \"@emptyWeight\": 162386,\n \"@maxAltitude\": 13700,\n \"@tankCapacity\": 183380\n },\n {\n \"@wings\": 37.57,\n \"@width\": 34.1,\n \"@height\": 12,\n \"@model\": \"AirbusA320\",\n \"@seats\": 150,\n \"@emptyWeight\": 39500,\n \"@maxAltitude\": 11900,\n \"@tankCapacity\": 27200\n }\n ]\n }\n}";
        savem1.view = "[{\"targetStr\":\"[0]\",\"htmlo\":null,\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":null,\"edgeViews\":[],\"isDefault\":false,\"id\":1,\"isApplied\":false,\"runtimeorder\":4,\"scroll\":{\"x\":0,\"y\":0},\"zoom\":{\"x\":1,\"y\":1},\"grid\":{\"x\":20,\"y\":20},\"views\":[{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(+this.vertexSize.x)\\\" varseats_x=\\\"\\\" _varyaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((this.vertexSize.y/50+16)^(10/3))\\\" varyaltitude_y=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"/*pointer-events: none; flex-basis:0;*/ background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(+this.vertexSize.x)\\\" varseats_x=\\\"\\\" _varyaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((this.vertexSize.y/50+16)^(10/3))\\\" varyaltitude_y=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"/*pointer-events: none; flex-basis:0;*/ background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(+this.vertexSize.x)\\\" varseats_x=\\\"\\\" _varyaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((this.vertexSize.y/50+16)^(10/3))\\\" varyaltitude_y=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"/*pointer-events: none; flex-basis:0;*/ background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(+this.vertexSize.x)\\\" varseats_x=\\\"\\\" _varyaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((this.vertexSize.y/50+16)^(10/3))\\\" varyaltitude_y=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"/*pointer-events: none; flex-basis:0;*/ background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(+this.vertexSize.x)\\\" varseats_x=\\\"\\\" _varyaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((this.vertexSize.y/50+16)^(10/3))\\\" varyaltitude_y=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"/*pointer-events: none; flex-basis:0;*/ background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"/*pointer-events: none; flex-basis:0;*/ background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"/*pointer-events: none; flex-basis:0;*/ background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**(this.vertexSize.h/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"pointer-events: none; background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**(this.vertexSize.h/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"pointer-events: none; background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**(this.vertexSize.h/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"pointer-events: none; background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**(this.vertexSize.h/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"pointer-events: none; background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**(this.vertexSize.h/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"pointer-events: none; background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**(this.vertexSize.h/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"pointer-events: none; background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**(this.vertexSize.h/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.4.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"pointer-events: none; background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**(this.vertexSize.h/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem; border-bottom: 0.5px solid rgba(119, 119, 119, 0.467);\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"pointer-events: none; background:var(--color-1); display: flex; height:100%; width:100%; box-shadow: 0 0 3pt 0.5pt var(--color-3); border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**(this.vertexSize.h/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: 100%; font-size: 1rem;\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\" style=\\\"display: flex; height:100%; width:100%; border-radius: 7px;\\\"> </div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,0]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-otv-c6=\\\"\\\" class=\\\"Vertex invisibleNode\\\" height=\\\"40\\\" keep-edges=\\\"false\\\" overflow=\\\"hidden\\\" show-in-ext-edges=\\\"false\\\" show-in-oth-edges=\\\"false\\\" show-in-rel-edges=\\\"false\\\" show-out-ext-edges=\\\"false\\\" show-out-oth-edges=\\\"false\\\" show-out-rel-edges=\\\"false\\\" style=\\\"display:none\\\" width=\\\"200\\\" x=\\\"0\\\" y=\\\"0\\\"><div _ngcontent-otv-c6=\\\"\\\" style=\\\"height:auto;\\\"></div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":360,\"y\":-180,\"w\":250,\"h\":62},\"edgeViews\":[],\"isDefault\":false,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔38+30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**((this.vertexSize.h-38)/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" type=\\\"$##attributes.3.values.0$\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <style> [aircraft_example] .aircraft{ display: none; flex-basis: 0; flex-grow:1; width:100%; border-radius: 7px; } [aircraft_example] [type*=\\\"boeing\\\"] > .aircraft.boeing{ display: flex; } [aircraft_example] [type*=\\\"boeing\\\"] > .aircraft.perlan{ display: none; } [aircraft_example] [type*=\\\"airbus\\\"] > .aircraft.airbus{ display: flex; } [aircraft_example] [type*=\\\"airbus\\\"] > .aircraft.perlan{ display: none; } [aircraft_example] .aircraft.perlan{ display: flex; } </style> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: min-content; min-width: 100%; font-size: 1rem;\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" class=\\\"aircraft perlan\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\"> <img _ngcontent-mrc-c7=\\\"\\\" class=\\\"aircraft airbus\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/airbus.png\\\"> <img _ngcontent-mrc-c7=\\\"\\\" class=\\\"aircraft boeing\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/boeing.png\\\"></div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-59.999999999999964,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"},{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔38+30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**((this.vertexSize.h-38)/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" type=\\\"$##attributes.3.values.0$\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <style> [aircraft_example] .aircraft{ display: none; flex-basis: 0; flex-grow:1; width:100%; border-radius: 7px; } [aircraft_example] [type*=\\\"boeing\\\"] > .aircraft.boeing{ display: flex; } [aircraft_example] [type*=\\\"boeing\\\"] > .aircraft.perlan{ display: none; } [aircraft_example] [type*=\\\"airbus\\\"] > .aircraft.airbus{ display: flex; } [aircraft_example] [type*=\\\"airbus\\\"] > .aircraft.perlan{ display: none; } [aircraft_example] .aircraft.perlan{ display: flex; } </style> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: min-content; min-width: 100%; font-size: 1rem;\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" class=\\\"aircraft perlan\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\"> <img _ngcontent-mrc-c7=\\\"\\\" class=\\\"aircraft airbus\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/airbus.png\\\"> <img _ngcontent-mrc-c7=\\\"\\\" class=\\\"aircraft boeing\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/boeing.png\\\"></div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-219.97215877166863,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"}],\"defaultStyleMap\":{\"class\":{\"targetStr\":\"[0,0,1]\",\"htmlo\":{\"featuredependency\":[],\"allowedOnClass\":false,\"allowedOnAttribute\":false,\"allowedOnReference\":false,\"allowedOnOperation\":false,\"allowedOnParameter\":false,\"AllowedOnM1\":false,\"AllowedOnM2\":false,\"htmlstr\":\"<foreignobject _ngcontent-mrc-c7=\\\"\\\" aircraft_example=\\\"\\\" class=\\\"Vertex Class onRefresh measurable\\\" hover-base=\\\"v1\\\" style=\\\"cursor: pointer; color: var(--color-2); position: absolute;\\\" tabindex=\\\"-1\\\" width=\\\"300\\\" x=\\\"50\\\" y=\\\"50\\\" _jquidraaxis=\\\"x, y\\\" jquidraaxis=\\\"\\\" constraint1=\\\"\\\" constraint2=\\\"\\\" _constraintheight=\\\"vertexSize.h≔=≔38+30*Math.log2(+this.unsafec.model.getAttribute('height').values[0])\\\" constraintheight=\\\"\\\" _constraintwidth=\\\"vertexSize.w≔=≔30*Math.log2(+this.unsafec.model.getAttribute('width').values[0])\\\" constraintwidth=\\\"\\\" onrefresh1=\\\"\\\" _onrefreshwidth=\\\"true≔-> _constraintwidth\\\" onrefreshwidth=\\\"\\\" _onrefreshheight=\\\"true≔-> _constraintheight\\\" onrefreshheight=\\\"\\\" _constrainty=\\\"vertexSize.y≔=≔-50*(Math.pow(+this.unsafec.model.getAttribute('maxAltitude').values[0], 0.3) - 16)\\\" constrainty=\\\"\\\" _constraintx=\\\"vertexSize.x≔=≔2 * this.unsafec.model.getAttribute('seats').values[0]\\\" constraintx=\\\"\\\" onrefresh2=\\\"\\\" _onrefreshx=\\\"true≔-> _constraintx\\\" onrefreshx=\\\"\\\" _onrefreshy=\\\"true≔-> _constrainty\\\" onrefreshy=\\\"\\\" ondragend1=\\\"\\\" _ondragendx=\\\"true≔-> _varseats_x\\\" ondragendx=\\\"\\\" _ondragendy=\\\"true≔-> _varaltitude_y\\\" ondragendy=\\\"\\\" var1=\\\"\\\" _varseats_x=\\\"≔this.unsafec.model.getAttribute('seats').setValues(this.vertexSize.x/2)\\\" varseats_x=\\\"\\\" varyaltitude_y=\\\"\\\" _varaltitude_y=\\\"≔this.unsafec.model.getAttribute('maxAltitude').setValues((-this.vertexSize.y/50+16)**(10/3))\\\" varaltitude_y=\\\"\\\" _jquireshandles=\\\"se\\\" jquireshandles=\\\"\\\" _varw=\\\"≔this.unsafec.model.getAttribute('width').setValues(2**(this.vertexSize.w/30))\\\" varw=\\\"\\\" _varh=\\\"≔this.unsafec.model.getAttribute('height').setValues(2**((this.vertexSize.h-38)/30))\\\" varh=\\\"\\\"><div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"Class\\\" data-autosizex=\\\"false\\\" data-autosizey=\\\"false\\\" type=\\\"$##attributes.3.values.0$\\\" style=\\\"pointer-events:none; height: 100%; width: 100%; display: inline-flex; flex-flow: column;\\\"> <style> [aircraft_example] .aircraft{ display: none; flex-basis: 0; flex-grow:1; width:100%; border-radius: 7px; } [aircraft_example] [type*=\\\"boeing\\\"] > .aircraft.boeing{ display: flex; } [aircraft_example] [type*=\\\"boeing\\\"] > .aircraft.perlan{ display: none; } [aircraft_example] [type*=\\\"airbus\\\"] > .aircraft.airbus{ display: flex; } [aircraft_example] [type*=\\\"airbus\\\"] > .aircraft.perlan{ display: none; } [aircraft_example] .aircraft.perlan{ display: flex; } </style> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"VertexHeader\\\" style=\\\"pointer-events:all; top: -35px; text-align: center; display: flex; padding: 8px 0px; width: min-content; min-width: 100%; font-size: 1rem;\\\"> <input _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" pattern=\\\"[a-zA-Z_\\\\u0024][a-zA-Z\\\\d_\\\\u0024]*\\\" placeholder=\\\"Object name\\\" style=\\\"display:none; background:transparent; border:none; text-align:right; order:1; flex-basis: 50%; min-width:10px;\\\" value=\\\"$##name$\\\"> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-2); margin:auto;\\\"> $##attributes.3.values.0$:&nbsp; </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"no-ov\\\" style=\\\"text-align: center; order:2; flex-grow:1; color:var(--color-4); margin:auto;\\\">$##metaParent.name$ </div> <div _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\" class=\\\"hover-unfade open-options\\\" hover-display=\\\"v1\\\" style=\\\"top: 7px; right: 0; border-radius: 999px;\\\" tabindex=\\\"-1\\\"><span _ngcontent-mrc-c7=\\\"\\\" _ngcontent-fmh-c7=\\\"\\\">...</span></div> </div> <img _ngcontent-mrc-c7=\\\"\\\" class=\\\"aircraft perlan\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/glider%20small.png\\\"> <img _ngcontent-mrc-c7=\\\"\\\" class=\\\"aircraft airbus\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/airbus.png\\\"> <img _ngcontent-mrc-c7=\\\"\\\" class=\\\"aircraft boeing\\\" src=\\\"https://raw.githubusercontent.com/DamianoNaraku/jodel-wiki/main/examples/boeing.png\\\"></div></foreignobject>\"},\"htmli\":null,\"displayAsEdge\":false,\"vertexSize\":{\"x\":4,\"y\":-219.97215877166863,\"w\":100.34485490992323,\"h\":248},\"edgeViews\":[],\"isDefault\":true,\"viewpointstr\":\"ViewPoint 2\"}},\"name\":\"ViewPoint 2\"}]";
        savem1.vertexpos = "{\"[0,0,0]\":{\"x\":360,\"y\":-180,\"w\":250,\"h\":62},\"[0,0,1]\":{\"x\":4,\"y\":-219.97215877166863,\"w\":100.34485490992323,\"h\":248},\"[0,0,2]\":{\"x\":732,\"y\":-70.93586376841952,\"w\":184.24788835151455,\"h\":248},\"[0,0,3]\":{\"x\":300,\"y\":-34.899291970099,\"w\":152.75099502410433,\"h\":248}}";
        break;
      default: break;
    }
    onModelsReceive(savem2, savem1);
  }
}
export function onModelsReceive(savem2: {model: string, vertexpos: string, view: string}, savem1: {model: string, vertexpos: string, view: string}): void {
  let useless: any;
  /*let MetaMetaModelStr = MetaMetaModel.emptyMetaMetaModel;
  let MetaModelinputStr = MetaModel.emptyModel;
  let ModelinputStr = Model.emptyModel;*/
  const validate = (thing: string, defaultvalue: string): string => { return thing && thing !== '' && thing !== 'null' && thing !== 'undefined' ? thing : defaultvalue; };
  savem2.model = validate(savem2.model, MetaModel.emptyModel);
  savem1.model = validate(savem1.model, Model.emptyModel);
  TopBar.staticInit();
  WebsiteTheme.setTheme();
  Status.status.mmm = new MetaMetaModel(null);
  console.log('loading MM:', savem2);
  console.log('loading M:', savem1);

  try {
    Status.status.mm = new MetaModel(JSON.parse(savem2.model), Status.status.mmm);
  } catch(e) {
    U.pw(true, 'Failed to load the metamodel.', {e, model: savem2.model});
    if (!Status.status.isProduction) throw e;
    Type.all = [];// reset invalid old parsed types, enums... they are no longer defined in the empty metamodel
    Status.status.mm = new MetaModel(JSON.parse(MetaModel.emptyModel), Status.status.mmm);
  }
  window['' + 'mm'] = Status.status.mm;
  // console.log('m3:', Status.status.mmm, 'm2:', Status.status.mm, 'm1:', Status.status.m); return;
  Type.linkAll();
  M2Class.updateSuperClasses();
  let m2classes: M2Class[] = Status.status.mm.getAllClasses();
  // m2classes.forEach((classe: M2Class) => { classe.calculateShadowings(false); });
  try {
    Status.status.m = new Model(JSON.parse(savem1.model), Status.status.mm);
  } catch(e) {
    U.pw(true, 'Failed to load the model. Does it conform to the metamodel?', e);
    if (!Status.status.isProduction) throw e;
    Status.status.m = new Model(JSON.parse(Model.emptyModel), Status.status.mm);
  }

  window['' + 'm'] = Status.status.m;
  // console.log('m3:', Status.status.mmm, 'm2:', Status.status.mm, 'm1:', Status.status.m);
  // Status.status.m.LinkToMetaParent(Status.status.mm);
  Status.status.m.fixReferences(); // for non-containment references
  Status.status.loadedLogic = true;
  useless = new ISidebar(Status.status.mmm, document.getElementById('metamodel_sidebar'));
  useless = new ISidebar(Status.status.mm, document.getElementById('model_sidebar'));
  useless = new IGraph(Status.status.mm, document.getElementById('metamodel_editor') as unknown as SVGSVGElement);
  useless = new IGraph(Status.status.m, document.getElementById('model_editor') as unknown as SVGSVGElement);
  m2classes.forEach((classe: M2Class) => { classe.checkViolations(false); });
  Status.status.mm.graph.setGrid(20, 20, true);
  Status.status.m.graph.setGrid(20, 20, true);
  Status.status.loadedGUI = true;
  Status.status.mm.calculateViolations();
  IEdge.all.forEach((e: IEdge) => { e.refreshGui();  e.refreshGui(); });
  Status.status.mm.graph.propertyBar.show(Status.status.mm, null, null);
  Status.status.m.graph.propertyBar.show(Status.status.m, null, null);
  PropertyBarr.staticinit();
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
  let i:number, j: number;
  for (j = 0; j < vertexposMat.length; j++) {
    const vdic: Dictionary<string, GraphPoint> = vertexposMat[j];
    const m: IModel = marr[j];
    for (let key in vdic) {
      // console.log('key:', key, 'varr:', vdic);
      const mp: IClassifier = ModelPiece.getByKeyStr(key) as IClassifier;
      const size: GraphSize = new GraphSize().clone(vdic[key]);
      if (!mp || !(mp instanceof IClassifier)) {
        // U.cclear();
        U.pw(true, 'invalid vertexposition save, failed to get classifier:', key, vdic); continue; }
      mp.getVertex().setSize(size);
    }
  }

  for (j = 0; j < vpmatjson.length; j++) {
    let vparr: ViewPoint[] = vpmatjson[j] as ViewPoint[];
    const m: IModel = marr[j];
    let v: ViewPoint;
    vparr = vparr.sort(ViewPoint.sortCriteria);
    for (i = 0; i < vparr.length; i++) {
      const jsonvp: ViewPoint = vparr[i];
      // console.clear();
      // console.log('looping this:', jsonvp, ', vpmatjson:', vpmatjson);
      v = new ViewPoint(m);
      v.clone(jsonvp);
      v.updateTarget(m);
      v.runtimeorder = ViewPoint.LAST_ORDER++;
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

  // setTimeout( () => { Status.status.mm.graph.setGrid0(); Status.status.m.graph.setGrid0(); }, 1);
  // Imposto un autosave raramente (minuti) giusto nel caso di crash improvvisi o disconnessioni
  // per evitare di perdere oltre X minuti di lavoro.
  // In condizioni normali non è necessario perchè il salvataggio è effettuato al cambio di pagina asincronamente
  // e con consegna dei dati garantita dal browser anche a pagina chiusa (navigator.beacon)

  IEdge.all.forEach((e: IEdge) => { e.refreshGui(); });
  ChangelogRoot.CheckUpdates();
  fakemain();

  switch (U.findGetParameter('example')){
    default:
      break;
    case 'aircrafts':
      console.error('aircraft example triggering vp', Status.status.m.graph.viewPointShell.checkboxes[0]);
      Status.status.m.graph.setUseGrid(false);
      Status.status.m.graph.setScroll(-72, -278);
      break;
  }
  // todo: migliora questo è un quick fix per gli archi che non caricano bene
  // todo fai un altro quickfix che forzi l'esecuzione degli onrefresh appena dopo che fai un cambio di viewpoint.
  $('.UtabHeaderContainer.main').on('click', () => {
    setTimeout(()=> {
      $(Status.status.m.graph.viewPointShell.checkboxes[0]).trigger('click');
      // setTimeout( ()=>Status.status.mm.refreshInstancesGUI(true), 200);
    }, 300);
  });
  return;
  Status.status.enableAutosave(2 * 60 * 1000);
  //Options.enableAutosave(2 * 60 * 1000);
  // Options.Load(Status.status);

}

function delayedMain(): void {
}

function fakemain() {

}

window['' + 'main'] = main0;
document.addEventListener('DOMContentLoaded', main0);
