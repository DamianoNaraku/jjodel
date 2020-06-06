import { Component, OnInit } from '@angular/core';
import {
  IPackage,
  IVertex,
  Size,
  StyleEditor,
  U,
  M2Class,
  Point,
  ModelPiece,
  IFeature,
  IReference,
  IAttribute,
  IClass, ExtEdge, IEdge, IClassifier, IModel, MReference, GraphPoint, Status
} from '../../common/Joiner';
import ClickEvent = JQuery.ClickEvent;
import ContextMenuEvent = JQuery.ContextMenuEvent;
import MouseDownEvent = JQuery.MouseDownEvent;
import MouseEventBase = JQuery.MouseEventBase;

@Component({
  selector: 'app-dam-context-menu',
  templateUrl: './dam-context-menu.component.html',
  styleUrls: ['./dam-context-menu.component.css']
})

export class DamContextMenuComponent implements OnInit {
  static contextMenu: DamContextMenuComponent = null;
  private html: HTMLElement = null;
  private $html: JQuery<HTMLElement> = null;
  // private currentlyOpened: HTMLElement = null;
  private clickTarget: Element;
  private $vertexcontext: JQuery<HTMLUListElement>;
  private $edgecontext: JQuery<HTMLUListElement>;
  private $extedgecontext: JQuery<HTMLUListElement>;
  private vertexcontext: HTMLUListElement;
  private edgecontext: HTMLUListElement;
  private extedgecontext: HTMLUListElement;
  static staticInit() {
    DamContextMenuComponent.contextMenu = new DamContextMenuComponent();
  }
  constructor() {
    this.$html = $('#damContextMenuTemplateContainer');
    this.html = this.$html[0];
    $(document).off('mouseup.hideContextMenu').on('mouseup.hideContextMenu', (e: MouseDownEvent) => this.checkIfHide(e));
    this.$vertexcontext = this.$html.find('ul.vertex') as JQuery<HTMLUListElement>;
    this.$edgecontext = this.$html.find('ul.edge') as JQuery<HTMLUListElement>;
    this.$extedgecontext = this.$html.find('ul.extedge') as JQuery<HTMLUListElement>;
    this.vertexcontext = this.$vertexcontext[0];
    this.edgecontext = this.$edgecontext[0];
    this.extedgecontext = this.$extedgecontext[0];
    // no contextmenù allowed inside my contextmenù
    this.$html.on('contextmenu', (e: ContextMenuEvent): boolean => { e.preventDefault(); e.stopPropagation(); return false; });
  }

  ngOnInit() { }

  show(location: Point, classSelectorUseless: string, target: SVGElement) {
    U.pe(!target, 'target is null.');
    this.clickTarget = target;
    this.html.style.display = 'none'; // if was already displaying, start the scrollDown animation without doing the scrollUp()
    this.$html.slideDown();
    const vertex: IVertex = IVertex.getvertexByHtml(target);

    let edge: IEdge = IEdge.getByHtml(target);
    let extedge: ExtEdge = null;
    if (edge instanceof ExtEdge) { extedge = edge; edge = null; }

    console.log('contextmenu target:', this.clickTarget);

    const templateSize: Size = U.sizeof(this.html);
    // todo:
    const viewPortSize: Size = new Size(0, 0, window.innerWidth, window.innerHeight);
    location.x = Math.max(0, location.x );
    location.y = Math.max(0, location.y );
    location.x = Math.min(viewPortSize.w - (templateSize.w), location.x );
    console.log('vp.w:', viewPortSize.w, ' - t.w:', templateSize.w, ', loc.x', location.x, ', t.size:', templateSize, this.html);
    location.y = Math.min(viewPortSize.h - (templateSize.h), location.y );
    this.html.style.position = 'absolute';
    this.html.style.zIndex = '1000';
    this.html.style.left = '' + location.x + 'px';
    this.html.style.top = '' + location.y + 'px';
    this.extedgecontext.style.display = 'none';
    this.edgecontext.style.display  = 'none';
    this.vertexcontext.style.display = 'none';
    this.edgecontext.style.display = edge ? '' : 'none';
    this.extedgecontext.style.display = extedge ? '' : 'none';
    this.vertexcontext.style.display = vertex ? '' : 'none';
    this.$vertexcontext.find('.Reference').hide();
    this.$vertexcontext.find('.refli.dynamic').remove();
    const mp: ModelPiece = ModelPiece.getLogic(target);
    const model: IModel = mp.getModelRoot();
    if (vertex) {/*
      if (model.isM1()) {
        this.$vertexcontext.find('.m1hide').hide();
        this.$vertexcontext.find('.m2hide').show(); }
      else {
        this.$vertexcontext.find('.m1hide').show();
        this.$vertexcontext.find('.m2hide').hide(); }*/

      if (mp instanceof IClassifier) {
        this.$vertexcontext.find('.Feature').hide();
        this.$vertexcontext.find('.Vertex').show();
      }
      else {
        if (mp instanceof MReference) {
          let i: number;
          const $refli = this.$vertexcontext.find('.refli.template');
          for (i = 0; i < mp.mtarget.length; i++) {
            const target = mp.mtarget[i];
            const li = U.cloneHtml($refli[0], true);
            li.classList.remove('template');
            li.classList.add('dynamic');
            li.dataset.index = '' + i;
            const $li = $(li);
            $li.find('.index').text('' + i);
            $li.find('.text').text(target ? target.printableNameshort() : 'Empty');
            $refli[0].parentNode.appendChild(li);
          }
          this.$vertexcontext.find('.Reference').show(); }
        this.$vertexcontext.find('.Feature').show();
        this.$vertexcontext.find('.Vertex').hide();
      }
      const mr: MReference = mp instanceof MReference ? mp : null;
      const $indexinput = this.$vertexcontext.find('input.byindex');
      const upperbound = mr ? mr.metaParent.upperbound : null;
      if (mr) {
        if (upperbound === -1) $indexinput[0].removeAttribute('max');
        else $indexinput[0].setAttribute('max', '' + upperbound);
      } else $indexinput[0].setAttribute('max', '-999');
    }
    if (model.isM1()) {
      this.$html.find('.m1hide').hide();
      this.$html.find('.m2hide').show();
    }
    else {
      this.$html.find('.m1hide').show();
      this.$html.find('.m2hide').hide();
    }
    this.addEventListeners(location, vertex, mp); // [??? what?] must be done here, per facilità di fare binding usando variabili esterne agli eventi.

  }
  hide(): void {
    this.$html.slideUp();
  }

  private addEventListeners(location: Point, v: IVertex, m: ModelPiece) {
    const graphLocation: GraphPoint = Status.status.getActiveModel().graph.toGraphCoord(location);
    const html = this.html;
    const $html = $(html);
    // const v: IVertex = IVertex.getvertexByHtml(this.clickTarget);
    // const m: ModelPiece = ModelPiece.getLogic(this.clickTarget);
    console.log('contextMenu target:', this.clickTarget, 'modelPiece:', m);
    const mr: MReference = m instanceof MReference ? m : null;
    const $indexinput: JQuery<HTMLInputElement> = $html.find('input.byindex') as JQuery<HTMLInputElement>;
    const upperbound = mr ? mr.getUpperbound() : null;
    U.pe(!v, 'vertex null:', v, this.clickTarget);

    const $firstempty = $html.find('.refli .firstempty') as JQuery<HTMLButtonElement>;
    let $byindexInputAndButton = ($html.find('.refli .byindex') as JQuery<HTMLButtonElement>);
    console.log($byindexInputAndButton);
    $byindexInputAndButton.each(
      (index: number, el: HTMLButtonElement): false | void => { el.disabled = mr && upperbound === 0});
    $firstempty[0].disabled = mr && upperbound === 0;

    $html.find('.refli .firstempty').off('click.setref').on('click.setref', (e: ClickEvent) => {
      let index = mr.getfirstEmptyTarget();
      if (index === -1) { U.pw(true, 'This reference is already filled to his upperbound.'); e.preventDefault(); e.stopPropagation(); return; }
      U.pw(upperbound === 0, 'Before setting a reference change set an Upperbound != 0 for his m2 counterpart.');
      if(upperbound === 0) return;
      const edge: IEdge = mr.edges[index];
      if (!edge) {
        const tmpend: GraphPoint = GraphPoint.fromEvent(e);
        new IEdge(mr, index, v, null, tmpend);
        return; }
      IVertex.linkVertexMouseDown(null, edge, graphLocation);
    });
    $html.find('.refli button.byindex').off('click.setref').on('click.setref', (e: ClickEvent) => {
      let index: number = +$indexinput[0].value;
      if (index < 0 || ( upperbound > 0 && index >= upperbound)) {
        U.pw(true, 'invalid reference index. It must be a value inside the [0,' + upperbound + '] interval.');
        return; }
      const edge: IEdge = mr.edges[index] ? mr.edges[index] : new IEdge(mr, index, v, null, null);
      IVertex.linkVertexMouseDown(null, edge, graphLocation);
    });
    console.log('refli dynamic setup', $html.find('li.refli.dynamic').length);
    $html.find('li.refli.dynamic').off('click.setref').on('click.setref', (e: ClickEvent) => {
      const index: number = +e.currentTarget.dataset.index;
      console.log('refli dynamic click');
      console.log('setting reference[' + index + '] = ', mr.mtarget[index], mr);
      const edge: IEdge = mr.edges[index] ? mr.edges[index] : new IEdge(mr, index, v, null, null);
      IVertex.linkVertexMouseDown(null, edge, graphLocation);
    });
    // U.pe(true, $html.find('li.refli.dynamic'), $html);
    $html.find('button.refli.delete').off('click.setref').on('click.setref', (e: ClickEvent) => {
      e.preventDefault(); e.stopPropagation(); // impedisco di nascondere il contextmenù per tanto poco
      const li = e.currentTarget.parentNode;
      const index: number = li.dataset.index;
      U.pe(!index || U.isNumber(index), 'failed to get index.');
      mr.setTarget(index, null);
      $(li).find('.text').text('Empty');
    });
    $html.find('.Vertex.duplicate').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.duplicate('_Copy', m.parent); });
    $html.find('.Vertex.delete').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.delete(true); });
    $html.find('.Vertex.minimize').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { v.minimize(); });
    $html.find('.Vertex.extend').off('click.ctxMenu').on('click.ctxMenu', (e: ClickEvent) => {
      new ExtEdge(m as M2Class, m.getVertex(), null, GraphPoint.fromEvent(e));
    });
    $html.find('.Vertex.up').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.pushDown(true); m.getModelRoot().refreshGUI_Alone(); }); // must be the opposite of the text
    $html.find('.Vertex.down').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.pushUp(true); m.getModelRoot().refreshGUI_Alone(); }); // must be the opposite of the text
    $html.find('.Vertex.editStyle').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { U.pw(true, 'deprecato'); /*StyleEditor.editor.show(m);*/ });

    $html.find('.Feature.autofix').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { alert('autofix conformity: todo.'); });
    $html.find('.Feature.autofixinstances').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { alert('autofix instances: todo.'); });
    $html.find('.Feature.duplicate').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.duplicate('_Copy', m.parent); v.refreshGUI(); });
    $html.find('.Feature.delete').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.delete(true); });
    $html.find('.Feature.minimize').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { v.minimize(); });
    $html.find('.Feature.up').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.pushUp(false); v.refreshGUI(); });
    $html.find('.Feature.down').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.pushDown(false); v.refreshGUI(); });

  }
  private checkIfHide(e: MouseEventBase) {
    const originalTarget: Element = e.target;
    const isInput: boolean = U.isInput(originalTarget, true);
    const isDisabled: boolean = (originalTarget as any).disabled;
    const focused: boolean = this.html.contains(document.activeElement);
    const isButton: boolean = (originalTarget.tagName.toLowerCase() === 'button')
      && !(originalTarget as HTMLButtonElement).disabled
      && originalTarget === document.activeElement;// se la selezione non è sul bottone, per me non l'ho premuto,
    // magari era un mousedown di selezione su un input terminato con mouseup su un button

    const clickedOutside = !U.isParentOf(this.html, originalTarget);
    console.log('isInput:', isInput, 'isButton:', isButton, 'clickedOutside:', clickedOutside, '!focused:', !focused, originalTarget, document.activeElement, e);

    if (isButton || clickedOutside || !isInput && !isDisabled && !focused) { this.hide(); }

  }
}
