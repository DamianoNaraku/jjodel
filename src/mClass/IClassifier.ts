import {
  IVertex,
  IEdge,
  IField,
  IPackage,
  IAttribute,
  AttribETypes,
  IFeature,
  Json,
  U,
  ModelPiece,
  ISidebar,
  IGraph,
  IReference,
  Status,
  DetectZoom,
  Model,
  ECoreAttribute,
  ECoreClass,
  ECorePackage,
  ECoreReference,
  ECoreRoot,
  Point,
  GraphPoint,
  IModel,
  Size,
  MAttribute,
  MReference,
  MClass,
  M2Class,
  EdgeStyle,
  M2Reference,
  M2Attribute,
  M3Package,
  M3Reference,
  M3Attribute,
  M3Feature,
  EdgeModes,
  EdgePointStyle, EOperation, EParameter, Typedd, Type, EEnum, GraphSize, ViewRule,
} from '../common/Joiner';


export abstract class IClassifier extends ModelPiece{
  parent: IPackage;
  childrens: Typedd[];
  vertex: IVertex = null;
  instanceTypeName: string;
  // WITHOUT edges
  private sidebarHtml: HTMLElement;

  static defaultSidebarHtml(): HTMLElement {
    return U.toHtml<HTMLElement>('<div class="sidebarNode class"><p class="sidebarNodeName">$##name$</p></div>'); }

  generateVertex(): IVertex {
    if (this.vertex) return;
    const lastView: ViewRule = this.getLastViewWith('vertexSize');
    const size: GraphSize =  lastView ? lastView.vertexSize : null;
    const v: IVertex = this.vertex = new IVertex(this, size);
    return v; }

  getSidebarHtml(): HTMLElement {
    if (this.sidebarHtml) { return this.sidebarHtml; }
    return IClassifier.defaultSidebarHtml(); }

  setName(value: string, refreshGUI: boolean = false): string {
    const oldName = this.name;
    super.setName(value, refreshGUI);
    const model: IModel = this.parent ? this.getModelRoot() : null;
    let i: number;
    // for (i = 0; model && i < model.instances.length; i++) { model.instances[i].sidebar.fullnameChanged(oldName, this.name); }
    Type.updateTypeSelectors(null, false, true, true);
    return this.name; }

  getVertex(): IVertex {
    const displayAsEdge: boolean = this.shouldBeDisplayedAsEdge();
    // U.pw(displayAsEdge, 'getvertex called on a class that should not have a vertex.', this);
    if (!displayAsEdge && this.vertex === null && Status.status.loadedLogic) { this.generateVertex(); }
    return this.vertex; }


  refreshGUI_Alone(debug?: boolean): void {
    if (!Status.status.loadedLogic) { return; }
    this.getVertex().refreshGUI();
  }

  getEcoreTypeName(): string {
    if (this instanceof EEnum || M2Class) return Type.classTypePrefix + this.name;
    return Type.classTypePrefix + this.parent.name;
  }

}
