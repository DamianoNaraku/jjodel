import {Component, OnInit} from '@angular/core';
import {
  ChangelogRoot,
  EType,
  IModel,
  InputPopup,
  Json,
  LocalStorage,
  M2Attribute,
  M2Class,
  M2Reference,
  MClass,
  MetaModel,
  Model,
  prjson2xml,
  prxml2json,
  ShortAttribETypes,
  Status,
  U,
  WebsiteTheme
} from '../../common/Joiner';
import {M2tcreatorComponent} from './m2tcreator/m2tcreator.component';
import ChangeEvent = JQuery.ChangeEvent;
import ClickEvent = JQuery.ClickEvent;
import {ColorSchemeComponent} from '../../app/color-scheme/color-scheme.component';

// @ts-ignore
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  topbar: TopBar;
  status: Status;
  Object: Object = Object;
  constructor() { }

  ngOnInit() {
    setTimeout(
      () => {
        this.status = Status.status;
        this.topbar = TopBar.topbar;
      }, 0);
  }

  createM2T_Rule(forModel: 'm1' | 'm2'): void {
    M2tcreatorComponent.willUseThis();
  }

  displayResult(m2tname: string, m2tresult: string): void {
    const input = new InputPopup();
    input.setText("M2T \"" + m2tname + "\" result", '', '');
    const innerInput: HTMLTextAreaElement = document.createElement('textarea');
    innerInput.value = m2tresult;
    innerInput.style.width = '100%';
    innerInput.style.minHeight = '75vh';
    input.setNestedInputNode(null, innerInput, false);
    input.show();
  }

  m2t_mysql_m2(): string {
    const classes: M2Class[] = Status.status.mm.getAllClasses();
    let tables: string[] = [];
    let foreignKeys: string[] = [];
    const getType = (attr: M2Attribute) => {
      switch (attr.type.primitiveType.short){
        // default: console.error('m2t mysql unsupported attr type:', attr.type.primitiveType.short, attr);
        case ShortAttribETypes.EBoolean:
        case ShortAttribETypes.EByte: return 'TINYINT(1)';
        case ShortAttribETypes.EChar: return 'CHAR(1)';
        case ShortAttribETypes.EDate:
        default:
        case ShortAttribETypes.EString: return 'VARCHAR' + (attr.getUpperbound() >= 0 ? '(' + attr.getUpperbound() + ')' : '');
        case ShortAttribETypes.EShort:
        case ShortAttribETypes.EInt:
        case ShortAttribETypes.ELong:
        case ShortAttribETypes.EFloat: return 'INT';
      }
    }
    for (const classe of classes) {
      let tableStr: string = 'CREATE TABLE ' + classe.name + ' {\n';
      let foreignkey: string = '';
      // let pkFeatures: M2Feature[] = [];
      const attributes: M2Attribute[] = [...classe.getAllAttributes()];
      const references: M2Reference[] = [...classe.getAllReferences()];
      const indent: string = '    ';
      let hasIDField: boolean = false;
      for (const attr of attributes) {
        if (attr.name.toLowerCase() === 'id' && attr.type.primitiveType.short === ShortAttribETypes.EInt) {
          hasIDField = true;
        }
        // if (attr.name.toLowerCase() === 'id') { pkFeatures = [attr]; }
        // if (pkAttributes.length !== 1 && pkFeatures[0].name.toLowerCase() !== 'id') { pkFeatures.push(attr); }
        tableStr += indent + attr.name + ' ' + getType(attr) + ',\n';
      }
      for (const ref of references) {
        if (ref.name.toLowerCase() === 'id') { hasIDField = true; }
        // if (ref.name.toLowerCase() === 'id') { pkFeatures = [ref]; }
        // if (pkAttributes.length !== 1 && pkFeatures[0].name.toLowerCase() !== 'id') { pkFeatures.push(ref); }
        tableStr += indent + ref.name + ' INT,\n';
        foreignKeys.push('ALTER TABLE ' + classe.name + '\n' +
          indent + 'ADD FOREIGN KEY (' + ref.name + ') REFERENCES ' + ref.getTarget().name + '(id);');
      }
      if (!hasIDField) {
        return "ERROR on class: " + classe.name +
          ".\nFor this beta version of mysql m2t all tables must have an \"id\" integer field."
      }
      // todo: PrimaryKey dovrebbe essere una annotation presente su [1,N] features.
      tableStr += indent + 'PRIMARY KEY (id)\n}';
      tables.push(tableStr);
    }
    return tables.join('\n\n') + '\n\n## Constraints\n\n' +  foreignKeys.join('\n\n');
  }
  m2t_mysql_m1(): string {
    return 'm2t mysql m1 to do';
  }

  m2t_byText_m2(): string{
    return U.copyVisibleText(Status.status.mm.graph.container);
  }
  m2t_byText_m1(): string{
    return U.copyVisibleText(Status.status.m.graph.container);
  }
}

export class TopBar {
  static topbar: TopBar = null;
  $shell: JQuery<HTMLElement> = null;
  $topbar: JQuery<HTMLElement> = null;
  html: HTMLElement = null;
  topbar: HTMLElement = null;
  static $checkboxesTheme: JQuery<HTMLInputElement>;
  private $typemapSelect: JQuery<HTMLSelectElement>;
  private typemapSelect: HTMLSelectElement;
  typemapArr: string[] = [];

  static staticInit(): void {
    TopBar.topbar = new TopBar();
  }

  constructor() {
    U.pe(!!TopBar.topbar, 'top bar instantiated twice, but it is a singleton.');
    TopBar.topbar = this;
    this.$shell = $('#topbarShell');
    this.html = this.$shell[0];
    this.$topbar = this.$shell.find('#topbar');
    this.topbar = this.$topbar[0];
    this.$typemapSelect = this.$topbar.find('.typemapselector') as JQuery<HTMLSelectElement>;
    this.typemapSelect = this.$typemapSelect[0];
    this.typemapSelect.value = Status.status.currentTypeAlias;
    this.updateTypeMapList();
    TopBar.topbar.updateRecents();
    this.addEventListeners(); }

  updateTypeMapList(): void {
    TopBar.topbar.typemapArr = Object.keys(Status.status.typeAliasDictionary).filter((s: string) => s.indexOf('predefined.') === -1);
  }

  changeTypeMap(newTypeMap: string = null): void {
    const oldTypemap: string = Status.status.currentTypeAlias;
    if (!newTypeMap) { newTypeMap = this.typemapSelect.value; }
    else { this.typemapSelect.value = newTypeMap; }
    console.log('changetm:', oldTypemap, 'new:', newTypeMap);
    if (oldTypemap === newTypeMap) return;
    U.pe(!Status.status.typeAliasDictionary[newTypeMap], 'Invalid typemap name:', newTypeMap,
      'allowed:', Status.status.typeAliasDictionary);
    Status.status.currentTypeAlias = newTypeMap;
    this.showTypeMap();
    Status.status.mm.refreshGUI();
    Status.status.m.refreshGUI();
  }

  createTypeMap(event: Event){
    let newkey: string;
    const userkey: string = Status.status.user.getID();
    if (Status.status.typeAliasDictionary[userkey + '.custom']) {
      newkey = U.increaseEndingNumber( userkey+'.custom 1', false, false,
          s => !!Status.status.typeAliasDictionary[s]);
    } else { newkey = userkey + '.custom'; }
    Status.status.typeAliasDictionary[newkey] = new Map<ShortAttribETypes, string>();
    this.updateTypeMapList();
    setTimeout(() => {
      console.log('tmkey:', newkey, 'select.val:', this.typemapSelect.value, 'mapselect', this.typemapSelect);
      this.changeTypeMap(newkey);
    }, 0);
  }

  showTypeMap(): void {
    const $shell = this.$shell.find('#TypeMapper');
    const $html = $shell.find('.TypeList');
    const html = $html[0];
    U.clear(html);
    const table: HTMLTableElement = U.toHtml<HTMLTableElement>('<table class="typeTable"><tbody></tbody></table>');
    const tbody = table.firstChild as HTMLElement;
    for (const m3TypeName in ShortAttribETypes) {
      if ( !ShortAttribETypes[m3TypeName] ) { continue; }
      const type: EType = EType.get(ShortAttribETypes[m3TypeName] as ShortAttribETypes);
      const row: HTMLTableRowElement = U.toHtmlRow('' +
        '<tr class="typeRow">' +
        '<td class="typeName" data-m3name="' + type.short + '">' + type.short + '</td>' +
        '<td class="alias">is aliased to</td>' +
        '<td>' +
        '<input class="AliasName form-control" placeholder="Not aliased" value="' + type.getName() + '"' +
        ' aria-label="Small" aria-describedby="inputGroup-sizing-sm">' +
        '</td>' +
        '</tr>');
      tbody.appendChild(row);
      console.log('row:', row, ', tbody:', tbody);
    }
    html.appendChild(table);
    $html.find('input.AliasName').off('change').on('change', (e: ChangeEvent) => { TopBar.topbar.aliasChange(e); } );
    $shell.show();
    U.closeButtonSetup($shell); }

  aliasChange(e: ChangeEvent): void {
    const input: HTMLInputElement = e.target as HTMLInputElement;
    let row: HTMLElement = input;
    while (!row.classList.contains('typeRow')) { row = row.parentNode as HTMLElement; }
    const typestr: string = $(row).find('.typeName')[0].dataset.m3name;
    const typemap = Status.status.typeAliasDictionary[Status.status.currentTypeAlias];
    const newAlias = input.value.trim();
    if (typemap[typestr] === newAlias) return;
    typemap[typestr] = newAlias;
    Status.status.mm.refreshGUI();
    Status.status.m.refreshGUI();
    // const type: EType = EType.get(typestr as ShortAttribETypes);
    // type.changeAlias(input.value);
  }

  static load_empty(e: JQuery.ClickEvent, prefix: 'mm' | 'm') {
    const empty: string = prefix === 'm' ? Model.emptyModel : MetaModel.emptyModel;
    TopBar.load(empty, prefix); }

  static load_XMI_File(e: JQuery.ClickEvent, prefix: 'mm' | 'm') {
    // filename:   rootClass.name + '.' + MetaModel.name;   es: path\league.bowling
    // open file dialog
    // read file
    // transform in json
    const extension = Status.status.getActiveModel().isM1() ? '.' + Status.status.mm.fullname() : '.ecore';
    let xmistring = '';
    U.fileRead((e: ChangeEvent, files: FileList, fileContents: string[]) => {
      U.pe(!fileContents || !files || fileContents.length !== files.length, 'Failed to get file contents:', files, fileContents);
      U.pe(fileContents.length > 1, 'should not be possible to input multiple files.');
      if (fileContents.length == 0) return;
      xmistring = fileContents[0];
      console.log('xmistr input: ', xmistring);
      const xmlDoc = new DOMParser().parseFromString(xmistring,"text/xml");
      console.log('xml:', xmlDoc);
      let  jsonstr = prxml2json.xml2json(xmlDoc, '    ');
      console.log('jsonstr input: ', jsonstr);
      // U.pe(true, 'xml -> json', prxml2json, 'json -> xml', prjson2xml);
      TopBar.load(jsonstr, prefix);
    }, [extension], true);


  }

  static load(json: string, prefix: string) {
    const m: IModel = prefix === 'm' ? Status.status.m : Status.status.mm;
    const num: 1 | 2 = prefix === 'm' ? 1 : 2;
    window['' + 'discardSave']();
    if (m.name) m.save(false);
    if (m.isM2()) {
      Status.status.m.save(false);
      LocalStorage.deleteLastOpened(1); }
    LocalStorage.setLastOpened(num, json, null, null);
    U.refreshPage(); }

  static load_JSON_Text(e: JQuery.ClickEvent, prefix: string, callback:(val: string) => void = null): void {
    const popup: InputPopup = new InputPopup();
    popup.setText('paste JSON/string data', '', '');
    popup.setInputNode('textarea');
    popup.setInput('', 'paste data here.');
    const finish = (e: ClickEvent, value: string) => {
      popup.destroy();
      if (callback) callback(value);
      else TopBar.load(value, prefix); };
    // $(popup).find('.closeButton');
    popup.addOkButton('Load', [finish]);
    popup.show(); }

  static download_JSON_String(e: ClickEvent, modelstr: string): void {
    const model: IModel = Status.status[modelstr];
    U.pe(!model, 'invalid modelStr in export-save_str: |' + modelstr + '|, status:', status);
    const savetxt: string = model.generateModelString();
    U.pe(!savetxt || savetxt === '', 'empty str');
    U.clipboardCopy(savetxt);
    const popup: InputPopup = new InputPopup();
    popup.setText((model.isM() ? 'Model' : 'Metamodel') + ' eCore/JSON', '', 'Already copied to clipboard.');
    popup.setInputNode('textarea');
    popup.setInput('' + savetxt);
    popup.show(); }

  static download_JSON_File(e: ClickEvent, modelstr: string): void {
    const model: IModel = Status.status[modelstr];
    U.pe(!model, 'invalid modelStr in export-save_json_file: |' + modelstr + '|, status:', status);
    const savetxt: string = model.generateModelString();
    U.download((model.name || (model.isM1() ? 'M1' : 'M2') + '_unnamed') + '.json', savetxt); }

  static download_XMI_File(e: ClickEvent, modelstr: string): void {
    const model: IModel = Status.status[modelstr];
    U.pe(!model, 'invalid modelStr in export-save_xmi_file: |' + modelstr + '|, status:', status);
    let savetxt: string = model.generateModelString();
    const json: Json = JSON.parse(savetxt);
    /*const parser = new FastXmi.j2xParser(new FastXmiOptions());
    const xml: string = parser.parse(json, new FastXmiOptions());
    savetxt = '' + xml; */
    // savetxt = json2xml(savetxt, { header: true } as JS2XML); // , Options.JS2XML);
    // console.log('xmljson: ', parser.parse(json));
    savetxt = '' + prjson2xml.json2xml(json, ' ');
    savetxt = TopBar.formatXml(savetxt).trim();
    let name: string;
    let extension: string;
    if (model.isM()) {
      const classRoot: MClass = (model as Model).classRoot;
      name = (model.name || (classRoot ? classRoot.metaParent.name : 'M1_unnamed'));
      extension = '.' + (Status.status.mm.childrens[0].name).toLowerCase();
    } else {
      name = (model.name || model.getDefaultPackage().name || 'M2_unnamed');
      extension = '.ecore'; }
    U.download(name + extension, savetxt); }

  static formatXml(xml: string): string {
    const reg = /(>)\s*(<)(\/*)/g; // updated Mar 30, 2015
    const wsexp = / *(.*) +\n/g;
    const contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    const pad: string = '' || '\t';
    let formatted = '';
    const lines = xml.split('\n');
    let indent = 0;
    let lastType = 'other';
    // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
    const transitions = {
      'single->single': 0,
      'single->closing': -1,
      'single->opening': 0,
      'single->other': 0,
      'closing->single': 0,
      'closing->closing': -1,
      'closing->opening': 0,
      'closing->other': 0,
      'opening->single': 1,
      'opening->closing': 0,
      'opening->opening': 1,
      'opening->other': 1,
      'other->single': 0,
      'other->closing': -1,
      'other->opening': 0,
      'other->other': 0
    };
    let i = 0;
    for (i = 0; i < lines.length; i++) {
      const ln = lines[i];

      // Luca Viggiani 2017-07-03: handle optional <?xml ... ?> declaration
      if (ln.match(/\s*<\?xml/)) {
        formatted += ln + '\n';
        continue;
      }
      // ---

      const single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
      const closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
      const opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
      const type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
      const fromTo = lastType + '->' + type;
      lastType = type;
      let padding = '';

      indent += transitions[fromTo];
      let j: number;
      for (j = 0; j < indent; j++) {
        padding += pad;
      }
      if (fromTo === 'opening->closing') {
        formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
      } else {
        formatted += padding + ln + '\n';
      }
    }

    return formatted; }

  updateRecents(): void {
    let tmp: string;
    tmp = localStorage.getItem('MM_SaveList');
    if (!tmp || tmp === '' || tmp === 'null' || tmp === 'undefined') { tmp = JSON.stringify([]); }
    const mmSaveList: string[] = JSON.parse(tmp);
    tmp = localStorage.getItem('M_SaveList');
    if (!tmp || tmp === '' || tmp === 'null' || tmp === 'undefined') { tmp = JSON.stringify([]); }
    const mSaveList: string[] = JSON.parse(tmp);
    const $metamodelHtml: JQuery<HTMLElement> = this.$shell.find('.metamodel');
    const $modelHtml: JQuery<HTMLElement> = this.$shell.find('.model');
    const recentContainerMM: HTMLElement = $metamodelHtml.find('.recentSaveContainer')[0];
    const recentContainerM: HTMLElement = $modelHtml.find('.recentSaveContainer')[0];
    console.log(recentContainerM, recentContainerMM);
    const exampleChilds: HTMLElement[] = [recentContainerMM.childNodes[0], recentContainerM.childNodes[0]] as HTMLElement[];
    U.clear(recentContainerMM);
    U.clear(recentContainerM);
    let i = -1;
    let j = -1;
    let child: HTMLElement;
    const prefixarr = ['MM_', 'M_'];
    const containerArr: HTMLElement[] = [recentContainerMM, recentContainerM];
    const saveList: string[][] = [mmSaveList, mSaveList];

    // U.pw(true, recentContainerM, recentContainerMM, exampleChilds, saveList);
    while (++j < prefixarr.length) {
      i = -1;
      while (++i < saveList[j].length) {
        child = U.cloneHtml(exampleChilds[j]);
        $(child).find('.recentsave')[0].innerText = saveList[j][i];
        // child.dataset.value = prefixarr[j] + mSaveList[i];
        containerArr[j].appendChild(child);
      }
    }
    $metamodelHtml.find('.recentsave').off('click.load').on('click.load', (e: Event) => {
      this.loadRecent((e.currentTarget as HTMLElement).innerText, true); });
    $modelHtml.find('.recentsave').off('click.load').on('click.load', (e: Event) => {
      this.loadRecent((e.currentTarget as HTMLElement).innerText, false); });
  }

  loadRecent(name: string, isMetaModel: boolean): void {
    const prefix: string = isMetaModel ? 'MM' : 'M';
    const tmp: string = localStorage.getItem(prefix + '_' + name);
    U.pe(!tmp || tmp === '' || tmp === 'null' || tmp === 'undefined', 'uncorrect savename: |' + prefix + '_' + name + '|');
    localStorage.setItem('LastOpened' + prefix, tmp);
    U.refreshPage(); }

  addEventListeners() {
    const $t = this.$topbar;
    const $m2 = $t.find('.root.metamodel');
    const $m1 = $t.find('.root.model');
    TopBar.$checkboxesTheme = $t.find('input.themename') as JQuery<HTMLInputElement>;
    $t.find('.TypeMapping').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.topbar.showTypeMap(); });
    $t.find('.changelogbutton').off('click.btn').on('click.btn', (e: ClickEvent) => { ChangelogRoot.show(); });
    TopBar.$checkboxesTheme.off('change.btn').on('change.btn', (e: ChangeEvent) => {
      const checkboxTriggered: HTMLInputElement = e.currentTarget;
      WebsiteTheme.setTheme(checkboxTriggered);
    });
    $t.find('.colorschemeopener').on('click', (e: ClickEvent) => { ColorSchemeComponent.show(); } );
    $m2.find('.save').off('click.btn').on('click.btn', (e: ClickEvent) => { Status.status.mm.save(false, true); } );
    $m1.find('.save').off('click.btn').on('click.btn', (e: ClickEvent) => { Status.status.m.save(false, true); } );

    // download
    $m2.find('.model .download_JSON_String').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_String(e, 'mm'); } );
    $m2.find('.model .download_JSON').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_File(e, 'mm'); } );
    $m2.find('.model .download_XMI').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_XMI_File(e, 'mm'); } );
    $m1.find('.model .download_JSON_String').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_String(e, 'm'); } );
    $m1.find('.model .download_JSON').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_File(e, 'm'); } );
    $m1.find('.model .download_XMI').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_XMI_File(e, 'm'); } );
    //// load
    $m2.find('.model .loadEmpty').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_empty(e, 'mm'); } );
    $m2.find('.model .loadFile').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_XMI_File(e, 'mm'); } );
    $m2.find('.model .loadTxt').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_JSON_Text(e, 'mm'); } );
    $m1.find('.model .loadEmpty').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_empty(e, 'm'); } );
    $m1.find('.model .loadFile').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_XMI_File(e, 'm'); } );
    $m1.find('.model .loadTxt').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_JSON_Text(e, 'm'); } );


    window['t'] = {
      $: this.$topbar,
      $t: $t,
      $m1: $m1,
      $m2: $m2,
    }
    $m1.find('.vertex .loadTxt').off('click.btn').on('click.btn', (e: ClickEvent) => {  } );
    $m1.find('.viewpoints .loadTxt').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_JSON_Text(e, 'm', (val: string) => { TopBar.loadVP(val, 'm'); }); } );
    $m2.find('.viewpoints .loadTxt').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_JSON_Text(e, 'm', (val: string) => { TopBar.loadVP(val, 'mm'); }); } );


  }


  private static loadVP(val: string, prefix: 'm' | 'mm'): void{
    window['discardSave'](); // stop autosave;
    const model: IModel = prefix === 'm' ? Status.status.m : Status.status.mm;
    Status.status.m.save(false);
    LocalStorage.setLastOpened( prefix === 'm' ? 1 : 2, null, val, null);
    U.refreshPage();
  }

}
