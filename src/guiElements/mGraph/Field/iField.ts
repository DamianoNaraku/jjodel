import {
  Json,
  U,
  IEdge,
  IVertex,
  IPackage,
  M2Class,
  IAttribute,
  AttribETypes,
  IFeature,
  ModelPiece,
  ISidebar,
  IGraph,
  IModel,
  Status, Typedd
} from '../../../common/Joiner';

export class IField {
  owner: IVertex;
  logic: Typedd;
  private html: HTMLElement | SVGElement;

  constructor(logic: Typedd) { this.logic = logic; }

  getHtml(): HTMLElement | SVGElement { return this.html; }

  refreshGUI(debug: boolean = true): void { }

  remove(): void {
    if (this.html && this.html.parentNode) { this.html.parentNode.removeChild(this.html); }
    this.logic.field = null;
    U.arrayRemoveAll(this.owner.fields, this);
  }
}
