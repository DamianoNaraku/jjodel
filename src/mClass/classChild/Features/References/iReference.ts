import {
  EdgeModes,
  EdgePointStyle,
  EdgeStyle,
  IClass, IClassifier,
  IEdge,
  IFeature,
  Json,
  M2Class,
  M2Reference,
  M3Class, MAttribute, MetaMetaModel, MetaModel,
  MReference,
  U
} from '../../../../common/Joiner';

export abstract class IReference extends IFeature {
  // static all: any[] = [];
  // type: AttribETypes = null;
  metaParent: IReference;
  instances: IReference[];

  edges: IEdge[] = [];
  edgeStyleCommon: EdgeStyle;
  edgeStyleHighlight: EdgeStyle;
  edgeStyleSelected: EdgeStyle;
  constructor(parent: IClass, meta: IReference) {
    super(parent, meta);
    if (parent) parent.references.push(this);
    this.edgeStyleCommon = new EdgeStyle(EdgeModes.straight, 2, '#ffffff',
      new EdgePointStyle(5, 2, '#ffffff', '#000000'));
    this.edgeStyleHighlight = new EdgeStyle(EdgeModes.straight, 4, '#ffffff',
      new EdgePointStyle(5, 2, '#ffffff', '#0077ff'));
    this.edgeStyleSelected = new EdgeStyle(EdgeModes.straight, 4, '#ffffff', // #ffbb22
      new EdgePointStyle(5, 2, '#ffffff', '#ff0000'));
  }

  clearTargets(): void {
    let i: number;
    const thiss: MReference = this instanceof MReference ? this : null;
    for (i = 0; thiss && i < thiss.mtarget.length; i++) { thiss.setTarget(i, null); }
    if (thiss) thiss.mtarget = U.newArray(this.metaParent.upperbound);
    this.edges = U.newArray(this.metaParent.upperbound); }

  abstract generateEdges(): IEdge[];

  abstract duplicate(nameAppend?: string, newParent?: IClass): IReference;

  delete(linkStart: number = null, linkEnd: number = null): void {
    if (linkStart === null && linkEnd === null) {
      super.delete();
      linkStart = 0;
      linkEnd = this.edges.length; }
    const edges: IEdge[] = U.ArrayCopy(this.getEdges(), false);
    let i: number;
    linkEnd = Math.min(edges.length, linkEnd);
    linkStart = Math.max(0, linkStart);
    for (i = linkStart; i < linkEnd; i++) { edges[i].remove(); }
  }

  // abstract linkClass(classe?: IClass): void;
  getEdges(): IEdge[] { return this.edges; }

  refreshGUI_Alone(debug: boolean = true): void {
    super.refreshGUI_Alone(debug);
    let i = -1;
    const edges: IEdge[] = this.getEdges();
    while (++i < edges.length) { if (edges[i]) { edges[i].refreshGui(); } }
  }

  copy(r: IReference, nameAppend: string = '_Copy', newParent: IClass = null): IReference {
    while (this.edges.length) { if (this.edges[0]) this.edges[0].remove(); }
    super.copy(r, nameAppend, newParent);
    this.clearTargets();
    super.copy(r, nameAppend, newParent);
    this.generateEdges();
    this.edgeStyleCommon = r.edgeStyleCommon.clone();
    this.edgeStyleHighlight = r.edgeStyleHighlight.clone();
    this.edgeStyleSelected = r.edgeStyleSelected.clone();
    // this.typeClassFullnameStr = r.typeClassFullnameStr;
    if (newParent) { U.ArrayAdd(newParent.references, this); }
    this.refreshGUI();
    return this; }

  // abstract link(targetStr?: string, debug?: boolean): void;
  // abstract conformability(meta: IReference, debug?: boolean): number;
  abstract canBeLinkedTo(hoveringTarget: IClass): boolean;


/*
  getStartPoint(nextPt: GraphPoint = null, fixOnSides: boolean = true): GraphPoint {
    let html: HTMLElement | SVGElement = this.getField().getHtml();
    // todo: introduzione field con campo html.
    if ( this.html && this.html.style.display !== 'none') {
      html = this.getStartPointHtml();
    } else { html = this.parent.getStartPointHtml(); }
    const vertexSize: GraphSize = this.graph().toGraphCoordS(U.sizeof(this.parent.html.firstChild as HTMLElement | SVGElement ));
    let htmlSize: Size = U.sizeof(html);
    let size: GraphSize = this.getModelRoot().graph.toGraphCoordS(htmlSize);
    if ( size.w === 0 || size.h === 0) {
      html = this.parent.getEndPointHtml();
      htmlSize = U.sizeof(html);
      size = this.getModelRoot().graph.toGraphCoordS(htmlSize); }

    let ep: GraphPoint = new GraphPoint(size.x + size.w / 2, size.y + size.h / 2);
    // console.log('sizeH:', htmlSize, 'sizeg:', size, ' center: ', ep);
    // this.getModelRoot().graph.markS(htmlSize, false, 'green');
    // this.getModelRoot().graph.markS(htmlSize, false, 'green');
    // ora è corretto, ma va fissato sul bordo vertex più vicino
    let fixOnHorizontalSides = false;
    const oldEpDebug = new GraphPoint(ep.x, ep.y);
    let vicinanzaL;
    let vicinanzaR;
    let vicinanzaT;
    let vicinanzaB;
    if (!nextPt) {
      vicinanzaL = Math.abs(ep.x - (vertexSize.x));
      vicinanzaR = Math.abs(ep.x - (vertexSize.x + vertexSize.w));
      vicinanzaT = Math.abs(ep.y - (vertexSize.y)) + (fixOnHorizontalSides ? Number.POSITIVE_INFINITY : 0);
      vicinanzaB = Math.abs(ep.y - (vertexSize.y + vertexSize.h)) + (fixOnHorizontalSides ? Number.POSITIVE_INFINITY : 0);
      const nearest = Math.min(vicinanzaL, vicinanzaT, vicinanzaR, vicinanzaB);
      // console.log('vicinanze (LRTB)', vicinanzaL, vicinanzaR, vicinanzaT, vicinanzaB, 'vSize: ', vertexSize);
      if ( nearest === vicinanzaT || (false && nextPt.x >= vertexSize.x && nextPt.x <= vertexSize.x + vertexSize.w && nextPt.y < ep.y)) {
        ep.y = vertexSize.y; } else
      if ( nearest === vicinanzaB || (false && nextPt.x >= vertexSize.x && nextPt.x <= vertexSize.x + vertexSize.w && nextPt.y > ep.y)) {
        ep.y = vertexSize.y + vertexSize.h; } else
      if ( nearest === vicinanzaR || (false && nextPt.x >= ep.x)) { ep.x = vertexSize.x + vertexSize.w; } else
      if ( nearest === vicinanzaL) { ep.x = vertexSize.x; }
      console.log('html:', html);
    } else {
      const grid = this.getModelRoot().graph.grid;
      ep = GraphSize.closestIntersection(vertexSize, nextPt, ep, grid); }
    // console.log('StartPoint fissato sul bordo:', oldEpDebug, '-->', ep);
    // return this.parent.vertex.owner.fitToGrid(ep);
    // if (fixOnSides && nextPt) { if (nextPt.x > ep.x) { ep.x += size.w / 2; } else { ep.x -= size.w / 2; }  }
    return ep; // meglio se svincolato dalla grid: il vertica può essere di width ~ height non conforme alla grid e il punto risultare fuori
  }
*/
  setDefaultStyle(value: string): void {
    U.pw(true, 'IReference.setDefaultStyle(): todo.');
  }

  isContainment(): boolean {
    if (this instanceof M2Reference) { return this.containment; }
    if (this instanceof MReference) { return this.metaParent.containment; }
    U.pe(true, 'unrecognized class.'); }
  /*getM2Target(): M2Class {
    if (this instanceof M2Reference) { return this.classType; }
    if (this instanceof MReference) { return this.metaParent.classType; }
    U.pe(true, 'unrecognized class.'); }*/
  getUpperbound(): number {
    if (this instanceof M2Reference) { return this.upperbound; }
    if (this instanceof MReference) { return this.metaParent.upperbound; }
    U.pe(true, 'unrecognized class.'); }
  getLowerbound(): number {
    if (this instanceof M2Reference) { return this.lowerbound; }
    if (this instanceof MReference) { return this.metaParent.lowerbound; }
    U.pe(true, 'unrecognized class.'); }


}

export class M3Reference extends IReference {
  parent: M3Class;
  metaParent: M3Reference;
  instances: M2Reference[];

  constructor(parent: M3Class, meta: M3Reference = null) {
    super(parent, meta);
    this.parse(null); }

  canBeLinkedTo(hoveringTarget: M3Class): boolean { U.pe(true, 'Invalid operation: m3Reference.canBeLinkedTo()'); return true; }

  //conformability(meta: IReference, debug?: boolean): number { U.pe(true, 'Invalid operation: m3Reference.comformability()'); return 0; }

  duplicate(nameAppend?: string, newParent?: IClass): M3Reference {  U.pe(true, 'Invalid operation: m3Reference.duplicate()'); return this; }

  generateEdges(): IEdge[] { U.pe(true, 'Invalid operation: m3Reference.generateEdges()'); return []; }

  generateModel(): Json { U.pe(true, 'Invalid operation: m3Reference.generateModel()'); return {}; }

  parse(json: Json, destructive?: boolean): void { this.name = 'Reference'; }

  linkClass(classe: IClass = null): void { U.pe(true, 'Invalid operation: M3Reference.linkClass();'); }
  // metaParent: M3Reference;
  // instances: M3Reference[] | M2Reference[];
}
