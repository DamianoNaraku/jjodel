/*import {
  Dictionary,
  EdgeModes,
  EdgePoint, EdgePointStyle,
  EdgeStyle,
  GraphPoint, GraphSize,
  IAttribute,
  M2Class, IEdge,
  IModel,
  IReference, Json, ModelPiece,
  Point,
  Status, InputPopup, ShortAttribETypes,
  U, IClass, MetaModel, M2Attribute, M2Reference, Model,
}                  from '../common/Joiner';

import ClickEvent = JQuery.ClickEvent;
import {ViewPoint} from '../GuiStyles/viewpoint';

export class StatusOptions {
  typeAliasDictionary: Dictionary<ShortAttribETypes, string> = {};
  aliasTypeDictionary: Dictionary<string, ShortAttribETypes> = {};
  debug = false;
}
export class ModelOptions {
  graph: GraphOptions;
  class: ClassOptions[];
  constructor() {
    this.graph = new GraphOptions();
    this.class = []; // new ClassOptions();
  }
}
export class GraphOptions {
  gridShow: boolean;
  grid: GraphPoint;
  zoom: Point;
  scroll: GraphPoint;
  constructor() {
    this.grid = new GraphPoint(20, 20);
    this.gridShow = true;
    this.scroll = new GraphPoint(0, 0);
    this.zoom = new Point(0, 0);
  }
}
export class EdgeOptions {
  common: EdgeStyle = null;
  highlight: EdgeStyle = null;
  selected: EdgeStyle = null;
  midPoints: EdgePointOption[] = [];

  /*loadEdgeOptions(m: M2Class | IReference): void {
    let i = -1;
    const e = m.edge;
    U.pe(!e, 'se l\'edge è null ora, lo dev\'essere stato anche prima, ma in tal caso le edgeoptions non dovevano essere state prodotte.');
    // if (!e) { return; }
    U.pe(e.midNodes.length > 0, 'failed to load midpoints: the edge already have some points, even before the loading of savefile.');
    while (++i < this.midPoints.length) {
      const ownermp: EdgePointOption = this.midPoints[i];
      e.midNodes.push(new EdgePoint(e, ownermp.pos));
    }
    e.refreshGui();
  }* /
}
export class ModelPieceOptions {
  fullnameTarget: string = null;
  ownStyle: string = null;
  instancesStyle: string = null;

  /*loadModelPieceOptions(m: ModelPiece): void {
    m.customStyleToErase = this.ownStyle;
    m.styleOfInstances = this.instancesStyle;
    const namePos = this.fullnameTarget.lastIndexOf('.');
    m.setName(this.fullnameTarget.substr(namePos + 1));
  }* /
}
export class ClassOptions extends ModelPieceOptions {
  displayAsEdge = false;
  attributes: AttributeOptions[] = []; // Dictionary<string, AttributeOptions> = {};
  references: ReferenceOptions[] = []; // Dictionary<string, ReferenceOptions> = {};
  edgeOptions: EdgeOptions[] = null;
  size: GraphSize = null;
  // pos: GraphPoint = null;

  static FindTargetingClass(fullnameTarget: string, m: MetaModel) {
    const classes: M2Class[] = m.getAllClasses();
    let i = -1;
    while (++i < classes.length) {
      if (classes[i].fullname() === fullnameTarget) { return classes[i]; }
    }
    U.pe(true, 'target of classOption not found.', ' classname:', fullnameTarget, ', Model:', m);
    return null;
  }
  // findTargetingClass(m: IModel): M2Class { return ClassOptions.FindTargetingClass(this.fullnameTarget, m); }
/*
  loadClassOptions(classe: M2Class): void {
    const oclasse: ClassOptions = this;
    let oattribute: AttributeOptions;
    let oreference: ReferenceOptions;
    let attribute: IAttribute;
    let reference: IReference;

    oclasse.loadModelPieceOptions(classe);
    classe.shouldBeDisplayedAsEdge(oclasse.displayAsEdge);
    if (oclasse.edgeOptions) { oclasse.edgeOptions.loadEdgeOptions(classe); }
    console.log('vertex:', classe.vertex, ' osize:', oclasse.size);
    alert();
    if (classe.vertex) { classe.vertex.setSize(oclasse.size); }

    let j = -1;
    while (++j < oclasse.attributes.length) {
      oattribute = oclasse.attributes[j];
      attribute = oattribute.findTargetingAttribute(classe);
      oattribute.loadModelPieceOptions(attribute);
    }
    j = -1;
    while (++j < oclasse.references.length) {
      oreference = oclasse.references[j];
      reference = oreference.findTargetingReference(classe);
      oreference.loadModelPieceOptions(reference);
      if (true || oreference.edgeOptions) { oreference.edgeOptions.loadEdgeOptions(reference); }
    }
    classe.refreshGUI();
    return; }
* /
}
export class AttributeOptions extends ModelPieceOptions {
  static findTargeting(fullnameTarget: string, classe: M2Class): IAttribute {
    let i = -1;
    while (++i < classe.attributes.length) {
      const attribute: M2Attribute = classe.attributes[i];
      if (fullnameTarget === attribute.fullname()) { return attribute; }
    }
    U.pe(true, 'AttributeOptions targeting failed. fullnameTarget:', fullnameTarget, ', classe:', classe);
    return null; }
  // findTargetingAttribute(classe: M2Class): IAttribute { return AttributeOptions.findTargeting(this.fullnameTarget, classe); }
}
export class ReferenceOptions extends ModelPieceOptions {
  edgeOptions: EdgeOptions[];
  constructor() {
    super();
    this.edgeOptions = [];
  }

  static findTarget(fullnameTarget: string, m: M2Class): M2Reference {
    let i = -1;
    while (++i < m.references.length) {
      const reference: M2Reference = m.references[i];
      if (fullnameTarget === reference.fullname()) { return reference; }
    }
    U.pe(true, 'referenceOptions targeting failed. fullnameTarget:', fullnameTarget, ', classe:', m);
    return null; }
  // findTargetingReference(classe: M2Class): IReference { return ReferenceOptions.findTarget(this.fullnameTarget, classe); }
}
export class EdgePointOption {
  pos: GraphPoint;
}* /

import {Status} from '../common/Joiner';

export class Options {/*
  status: StatusOptions;
  mm: ModelOptions;
  m: ModelOptions;
  version: number;* /


  static Save(isAutosave: boolean, saveAs: boolean) {
    if (localStorage.getItem('autosave') !== 'true') { return; }
    Options.generateSaveJson().saveToDB(isAutosave, saveAs);
    console.log('autosave style done: ', this);
    Status.status.mm.saveToDB(isAutosave, null);
    Status.status.m.saveToDB(isAutosave, null);
    // for (let i = 0; i < Status.status.m.viewpoints.length; i++) { Status.status.m.saveView(Status.status.m.viewpoints[i], isAutosave, null); }
    // incluso in model.saveToDB() for (let i = 0; i < Status.status.mm.viewpoints.length; i++) {
    // Status.status.mm.saveView(Status.status.mm.viewpoints[i], isAutosave, null); }
    console.log('autosave fully finished.'); }

  static Load(s: Status) {
    Options.LoadFromBrowserMemory(s); }
  static LoadFromBrowserMemory(s, key: string = null): void {
    if (key === null ) { key = 'modelGraphSave_GUI_Damiano'; }
    const value = localStorage.getItem(key);
    if (!value || value === '') { return; }
    const saveToDB: Options = JSON.parse(value);
    // saveToDB = Options.fromJson(saveToDB);
    // console.clear();
    console.log('saveToDB.version:', saveToDB.version, ', saveRaw:', value, 'saveToDB:', saveToDB);
    try {
      switch (saveToDB.version) {
        default: U.pe(true, 'unrecognized optionSave version:', saveToDB.version); break;
        case 1: Options.LoadV1(saveToDB, s); break;
      }
    } catch (e) {
      U.pw(true, 'the style saveToDB had some errors, it will be resetted. Only style customizations will be lost.');
      // disable saveToDB on exit to avoid error survival.
      $(window).off('beforeunload.unload_autosave');
      localStorage.setItem(key, null); }
  }
  private static LoadV1(o: Options, s: Status): void {
    s.debug = o.status.debug;
    s.aliasTypeDictionary = o.status.aliasTypeDictionary;
    s.typeAliasDictionary = o.status.typeAliasDictionary;
    console.log('load(options:', o, 'status:', s, ')');
    Options.LoadV1Model(o.mm, s.mm);
    console.log('load mm done.');
    Options.LoadV1ModelM(o.m, s.m);
    console.log('load m done.');
    s.mm.refreshGUI();
    s.m.refreshGUI(); }

  private static LoadV1ModelM(o: ModelOptions, m: Model): void {
    U.pw(true, 'load m1: todo.');
  }
  private static LoadV1Model(o: ModelOptions, m: MetaModel): void {
    m.graph.grid = new GraphPoint(o.graph.grid.x, o.graph.grid.y);
    m.graph.zoom = new Point(o.graph.zoom.x, o.graph.zoom.y);
    m.graph.scroll = new GraphPoint(o.graph.scroll.x, o.graph.scroll.y);
    m.graph.ShowGrid(o.graph.gridShow);
    let i = -1;
    while (++i < o.class.length) {
      Options.LoadV1Class(o.class[i], m);
    }
  }
  private static LoadV1Class(o: ClassOptions, root: MetaModel): void {
    const m: M2Class = ClassOptions.FindTargetingClass(o.fullnameTarget, root);
    if (m.vertex) { m.vertex.setSize(new GraphSize(o.size.x, o.size.y, o.size.w, o.size.h)); }
    m.shouldBeDisplayedAsEdge(o.displayAsEdge);
    let namepos: number = o.fullnameTarget.lastIndexOf('.');
    m.setName(o.fullnameTarget.substr(namepos + 1));
    m.customStyleToErase = U.toHtml(o.ownStyle);
    m.styleOfInstances = U.toHtml(o.instancesStyle);
    console.log('eoc:', o.edgeOptions, o);
    Options.LoadV1EdgeOptions(o.edgeOptions, m);
    let i = -1;
    while (++i < o.attributes.length) {
      const oa: AttributeOptions = o.attributes[i];
      const a: IAttribute = AttributeOptions.findTargeting(oa.fullnameTarget, m);
      namepos = oa.fullnameTarget.lastIndexOf('.');
      a.setName(oa.fullnameTarget.substr(namepos + 1));
      a.styleOfInstances = U.toHtml(oa.instancesStyle);
      a.customStyleToErase = U.toHtml(oa.ownStyle);
    }
    i = -1;
    while (++i < o.references.length) {
      const or: ReferenceOptions = o.references[i];
      const r: IReference = ReferenceOptions.findTarget(or.fullnameTarget, m);
      namepos = or.fullnameTarget.lastIndexOf('.');
      r.setName(or.fullnameTarget.substr(namepos + 1));
      r.styleOfInstances = U.toHtml(or.instancesStyle);
      r.customStyleToErase = U.toHtml(or.ownStyle);
      console.log('eor:', or.edgeOptions, or);
      Options.LoadV1EdgeOptions(or.edgeOptions, r);
    }

  }
  private static LoadV1EdgeOptions(eo: EdgeOptions[], r: IReference | M2Class): void {
    if (!eo || eo.length === 0) { return; }
    console.log('eo:', eo);
    r.edgeStyleCommon.style = eo[0].common.style;
    r.edgeStyleCommon.width = eo[0].common.width;
    r.edgeStyleCommon.color = eo[0].common.color;
    r.edgeStyleHighlight.style = eo[0].highlight.style;
    r.edgeStyleHighlight.width = eo[0].highlight.width;
    r.edgeStyleHighlight.color = eo[0].highlight.color;
    r.edgeStyleSelected.style = eo[0].selected.style;
    r.edgeStyleSelected.width = eo[0].selected.width;
    r.edgeStyleSelected.color = eo[0].selected.color;
    r.edgeStyleCommon.edgePointStyle.radius = eo[0].common.edgePointStyle.radius;
    r.edgeStyleCommon.edgePointStyle.fillColor = eo[0].common.edgePointStyle.fillColor;
    r.edgeStyleCommon.edgePointStyle.strokeColor = eo[0].common.edgePointStyle.strokeColor;
    r.edgeStyleCommon.edgePointStyle.strokeWidth = eo[0].common.edgePointStyle.strokeWidth;
    r.edgeStyleHighlight.edgePointStyle.radius = eo[0].highlight.edgePointStyle.radius;
    r.edgeStyleHighlight.edgePointStyle.fillColor = eo[0].highlight.edgePointStyle.fillColor;
    r.edgeStyleHighlight.edgePointStyle.strokeColor = eo[0].highlight.edgePointStyle.strokeColor;
    r.edgeStyleHighlight.edgePointStyle.strokeWidth = eo[0].highlight.edgePointStyle.strokeWidth;
    r.edgeStyleSelected.edgePointStyle.radius = eo[0].selected.edgePointStyle.radius;
    r.edgeStyleSelected.edgePointStyle.fillColor = eo[0].selected.edgePointStyle.fillColor;
    r.edgeStyleSelected.edgePointStyle.strokeColor = eo[0].selected.edgePointStyle.strokeColor;
    r.edgeStyleSelected.edgePointStyle.strokeWidth = eo[0].selected.edgePointStyle.strokeWidth;
    let i = -1;
    if (!r.edges || r.edges.length === 0) { return; }
    let j = -1;
    while (++j < eo.length && j < r.edges.length) {
      U.pe(r.edges[j].midNodes.length > 0, 'found a edge with midPoints before the style loading was finished.');
      while (++i < eo[j].midPoints.length) { r.edges[j].midNodes.push(new EdgePoint(r.edges[j], eo[j].midPoints[i].pos, null)); }
    }
  }
  /*private static fromJsonAssignEdgeOptions(eoTarget: EdgeOptions, oeSource0: Json) {
    if (!oeSource0) { return; }
    const oeSource: EdgeOptions = oeSource0 as EdgeOptions;
    console.log('AssignEdgeOptions(). eoTarget:', eoTarget, ', eoSource:', oeSource);
    // Object['' + 'assign'](eoTarget, oeSource);
    if (oeSource.common) {
      Object['' + 'assign'](eoTarget.common, oeSource.common);
      eoTarget.common.edgePointStyle = new EdgePointStyle();
      Object['' + 'assign'](eoTarget.common.edgePointStyle, oeSource.common.edgePointStyle); }
    if (oeSource.highlight) {
      Object['' + 'assign'](eoTarget.highlight, oeSource.highlight);
      eoTarget.highlight.edgePointStyle = new EdgePointStyle();
      Object['' + 'assign'](eoTarget.highlight.edgePointStyle, oeSource.highlight.edgePointStyle); }
    if (oeSource.selected) {
      Object['' + 'assign'](eoTarget.selected, oeSource.selected);
      eoTarget.selected.edgePointStyle = new EdgePointStyle();
      Object['' + 'assign'](eoTarget.selected.edgePointStyle, oeSource.selected.edgePointStyle); }
    let k = -1;
    const eptarget: EdgePointOption[] = [];
    const epsource: EdgePointOption[] = oeSource.midPoints;
    while (++k < epsource.length) {
      // alert('ep[' + (k + 1) + '/' + epsource.length + ']');
      eptarget.push(new EdgePointOption());
      Object['' + 'assign'](eptarget[k], epsource[k]);
      Object['' + 'assign'](eptarget[k].pos, epsource[k].pos);
    }
  }
  static fromJsonAssignFunctionsModel(mo: ModelOptions, jj: Json): void {
    const moj: ModelOptions = jj as ModelOptions;
    Object['' + 'assign'](mo, moj);
    Object['' + 'assign'](mo.graph, moj.graph);
    Object['' + 'assign'](mo.graph.scroll, moj.graph.scroll);
    Object['' + 'assign'](mo.graph.zoom, moj.graph.zoom);
    Object['' + 'assign'](mo.graph.grid, moj.graph.grid);
    // alert('fromjsonassignfunctionsmodel');
    let i = -1;
    console.log('class.len:', moj.class.length);
    mo.class = [];
    console.log('class.len:', moj.class.length);
    alert();
    while (++i < moj.class.length) {
      // alert('class[' +  (i + 1) + '/' + moj.class.length + ']');
      mo.class.push(new ClassOptions());
      // console.log('mo.class[' + i + ']:', mo.class[i], ', moj.class[' + i + ']:', moj.class[i], 'mo:', mo, ', moj:', moj);
      Object['' + 'assign'](mo.class[i], moj.class[i]);
      // todo: this is hell: dovrei usare assign solo sui primitivi.
      Object['' + 'assign'](mo.class[i].size, moj.class[i].size);
      // console.log(!mo.class[i].fullnameTarget, mo.class[i].fullnameTarget, 'classType:', mo.class[i], 'source:', moj.class[i]);
      console.log('autosaveRoot_String:', (localStorage.getItem('modelGraphSave_GUI_Damiano')));
      console.log('autosaveRoot:_JSON', JSON.parse(localStorage.getItem('modelGraphSave_GUI_Damiano')));
      U.pe(!moj.class[i].fullnameTarget, 'source is wrong (savefile wrong). classType:', mo.class[i],
        'source:', moj.class[i], 'moj:', moj, 'jj:', jj);
      U.pe(!mo.class[i].fullnameTarget, 'classType is wrong (load wrong). classType:', mo.class[i], 'source:', moj.class[i]);
      Options.fromJsonAssignEdgeOptions(mo.class[i].edgeOptions, moj.class[i].edgeOptions);
      // alert('assignEdgeOptions done');
      let k = -1;
      const rtarget: ReferenceOptions[] = mo.class[i].references = [];
      const rsource: ReferenceOptions[] = moj.class[i].references;
      while (++k < rsource.length) {
        alert('reference[' +  (k + 1) + '/' + rsource.length + '], ' + moj.class[i].references.length);
        rtarget.push(new ReferenceOptions());
        Object['' + 'assign'](rtarget[k], rsource[k]);
        Options.fromJsonAssignEdgeOptions(rtarget[k].edgeOptions, rsource[k].edgeOptions);
      }
      k = -1;
      // alert('[' + (i + 1) + '/' + moj.class.length + ']references done');
      const atarget: AttributeOptions[] = mo.class[i].attributes = [];
      const asource: AttributeOptions[] = moj.class[i].attributes;
      while (++k < rsource.length) {
        atarget.push(new AttributeOptions());
        Object['' + 'assign'](atarget[k], asource[k]);
      }
    }
  }
  static fromJson(jj: Json): Options {
    // Necessario per assegnare i campi-funzione che JSON.stringify ignora e ritrovarsi un vero oggetto Options funzionante.
    const o: Options = new Options();
    const j: Options = jj as Options;
    // Object['' + 'assign'](o, j);
    Object['' + 'assign'](o.status, j.status);
    Object['' + 'assign'](o.mm, j.mm);
    Options.fromJsonAssignFunctionsModel(o.m, j.m);
    // alert('m done');
    Options.fromJsonAssignFunctionsModel(o.mm, j.mm);
    // alert('mm done');
    return o;
  }
  private static load(st: Status, oJson: Options): void {

  }
  * /
  private static MakeEdgeOptions(logic: IClass | IReference): EdgeOptions[] {
    const edges: IEdge[] = logic.edges;
    let j = -1;
    const ret: EdgeOptions[] = [];
    while (++j < edges.length) {
      const edge = edges[j];
      const eo: EdgeOptions = new EdgeOptions();
      eo.common = logic.edgeStyleCommon;
      U.pe(!eo.common, eo, logic);
      eo.highlight = logic.edgeStyleHighlight;
      eo.selected = logic.edgeStyleSelected;
      eo.midPoints = [];
      let i = -1;
      while (++i < edge.midNodes.length) {
        const midNode = edge.midNodes[i];
        const mo: EdgePointOption = new EdgePointOption();
        mo.pos = midNode.pos;
        eo.midPoints.push(mo);
      }
      ret.push(eo);
    }
    return ret; }
  private static MakeClassOption(classe: IClass) {
    const co: ClassOptions = new ClassOptions();
    co.fullnameTarget = classe.fullname();
    co.instancesStyle = classe.styleOfInstances ? classe.styleOfInstances.outerHTML : null;
    co.ownStyle = classe.customStyleToErase ? classe.customStyleToErase.outerHTML : null;
    co.displayAsEdge = classe.shouldBeDisplayedAsEdge();
    co.edgeOptions = co.displayAsEdge && classe.edges ? Options.MakeEdgeOptions(classe) : null;
    co.size = classe.vertex.size;
    const attributes: IAttribute[] = classe.attributes;
    let j = -1;
    while (++j < attributes.length) {
      const attribute: IAttribute = attributes[j];
      const ca: AttributeOptions = new AttributeOptions();
      ca.fullnameTarget = attribute.fullname();
      ca.ownStyle = attribute.customStyleToErase ? attribute.customStyleToErase.outerHTML : null;
      ca.instancesStyle = attribute.styleOfInstances ? attribute.styleOfInstances.outerHTML : null;
      co.attributes.push(ca);
    }
    const references: IReference[] = classe.references;
    j = -1;
    while (++j < references.length) {
      const reference: IReference = references[j];
      const cr: ReferenceOptions = new ReferenceOptions();
      cr.fullnameTarget = reference.fullname();
      cr.ownStyle = reference.customStyleToErase ? reference.customStyleToErase.outerHTML : null;
      cr.instancesStyle = reference.styleOfInstances ? reference.styleOfInstances.outerHTML : null;
      cr.edgeOptions = reference.edges ? Options.MakeEdgeOptions(reference) : null;
      co.references.push(cr);
    }
    return co; }

  private static generateSaveJson(): Options {
    const st: Status = Status.status;
    const s: Options = new Options();
    let i: number;
    s.status.aliasTypeDictionary = st.aliasTypeDictionary;
    s.status.typeAliasDictionary = st.typeAliasDictionary;
    s.status.debug = st.debug;

    s.mm.graph.scroll = st.mm.graph.scroll;
    s.m.graph.scroll = st.m.graph.scroll;
    s.mm.graph.zoom = st.mm.graph.zoom;
    s.m.graph.zoom = st.m.graph.zoom;
    s.mm.graph.grid = st.mm.graph.grid;
    s.m.graph.grid = st.m.graph.grid;
    s.mm.graph.gridShow = st.mm.graph.gridDisplay;
    s.m.graph.gridShow = st.m.graph.gridDisplay;
    let classes: IClass[];
    classes = st.mm.getAllClasses();
    i = -1;
    while (++i < classes.length) {
      const classe: IClass = classes[i];
      s.mm.class.push(Options.MakeClassOption(classe));
    }
    classes = st.m.getAllClasses();
    i = -1;
    while (++i < classes.length) {
      const classe: IClass = classes[i];
      s.m.class.push(Options.MakeClassOption(classe));
    }
    return s; }

  public static enableAutosave(delay: number) {
    $(window).off('beforeunload.unload_autosave').on('beforeunload.unload_autosave', Options.AutoSave);
    localStorage.setItem('autosave', 'true');
    setInterval(Options.AutoSave, delay);
  }
  private static AutoSave() { Options.Save(true, null); }

  constructor() {
    this.version = 1;
    this.mm = new ModelOptions();
    this.m = new ModelOptions();
    this.status = new StatusOptions();
  }

  private saveToDB(isAutosave: boolean, saveAs: boolean) {
    U.pe(saveAs, 'style.SaveAs() to do.');
    this.saveInBrowserMemory(saveAs);
  }
  private saveInBrowserMemory(saveAs: boolean, key: string = null, value: string = null): void {
    if (key === null ) { key = 'modelGraphSave_GUI_Damiano'; }
    U.pe(!key || key === '', 'cannot saveToDB with null or empty name.');
    if (value === null) { value = JSON.stringify(this); }
    localStorage.setItem(key, value);
  }
 /* private saveWithPostOnPage(url: string, value: string = null): void {
    if (value === null) { value = JSON.stringify(this); }
    navigator.sendBeacon(url, value);
  }
  public load(s: Status): void {
    // status
    s.typeAliasDictionary = this.status.typeAliasDictionary;
    s.aliasTypeDictionary = this.status.aliasTypeDictionary;
    s.debug = this.status.debug;
    // graph
    s.mm.graph.grid        = this.mm.graph.grid;
    s.mm.graph.ShowGrid(this.mm.graph.gridShow);
    s.mm.graph.zoom        = this.mm.graph.zoom;
    // s.mm.graph.setZoom(this.mm.graph.zoom);
    s.mm.graph.scroll      = this.mm.graph.scroll;
    s.m.graph.grid         = this.m.graph.grid;
    s.m.graph.ShowGrid(this.m.graph.gridShow);
    s.m.graph.zoom         = this.m.graph.zoom;
    // s.m.graph.setZoom(this.m.graph.zoom);
    s.m.graph.scroll       = this.m.graph.scroll;
    let classe: M2Class;
    let oclasse: ClassOptions;
    let i: number;

    i = -1;
    console.log('saveToDB:', this);
    while (++i < this.mm.class.length) {
      oclasse = this.mm.class[i];
      classe = oclasse.findTargetingClass(s.mm);

      console.log('loadclass[' + (i + 1) + '/' + this.mm.class.length + '] classe:', classe, ', oclasse:', oclasse);
      oclasse.loadClassOptions(classe);
    }

    alert('mm.loadclass[' + i + '/' + this.mm.class.length + '] done');
    i = -1;
    while (++i < this.m.class.length) {
      oclasse = this.m.class[i];
      classe = oclasse.findTargetingClass(s.m);
      oclasse.loadClassOptions(classe);
    }

    s.m.refreshGUI();
    s.mm.refreshGUI();
  }
* /

}
*/
