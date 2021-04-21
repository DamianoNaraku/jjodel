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
  IClass,
  ExtEdge,
  IEdge,
  IClassifier,
  IModel,
  MReference,
  GraphPoint,
  Status,
  Model,
  MClass,
  FocusHistoryEntry,
  Dictionary,
  EOperation,
  EParameter, EAnnotation, is
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

export class DamContextMenuComponent {

}
export class DamContextMenu {
  static contextMenu: DamContextMenu = null;
  public html: HTMLElement = null;
  public $html: JQuery<HTMLElement> = null;
  // private currentlyOpened: HTMLElement = null;
  private clickTarget: Element;
  private readonly $vertexcontext: JQuery<HTMLUListElement>;
  private readonly $edgecontext: JQuery<HTMLUListElement>;
  private readonly $extedgecontext: JQuery<HTMLUListElement>;
  private readonly vertexcontext: HTMLUListElement;
  private readonly edgecontext: HTMLUListElement;
  private readonly extedgecontext: HTMLUListElement;
  private readonly defaultContainer: HTMLElement;
  static staticInit() {
    DamContextMenu.contextMenu = new DamContextMenu();
    console.log('sinit contextmenu', DamContextMenu.contextMenu);
    $(document).off('contextmenu')
      .on('contextmenu', (e: ContextMenuEvent): boolean => { return DamContextMenu.contextMenu.onContextMenu(e); });
  }

  constructor() {
    this.$html = $('#damContextMenuTemplateContainer');
    this.html = this.$html[0];
    // console.log('sinit contextmenu constructor', {$html: this.$html, html: this.html, thiss: this}, DamContextMenu.contextMenu);
    this.defaultContainer = this.html.parentElement;
    $(document).off('mouseup.hideContextMenu').on('mouseup.hideContextMenu', (e: MouseDownEvent) => this.checkIfHide(e));
    this.$vertexcontext = this.$html.find('ul.vertex') as JQuery<HTMLUListElement>;
    this.$edgecontext = this.$html.find('ul.edge') as JQuery<HTMLUListElement>;
    this.$extedgecontext = this.$html.find('ul.extedge') as JQuery<HTMLUListElement>;
    this.vertexcontext = this.$vertexcontext[0];
    this.edgecontext = this.$edgecontext[0];
    this.extedgecontext = this.$extedgecontext[0];
    // no contextmenù allowed inside my contextmenù
    this.$html.on('contextmenu', (e: ContextMenuEvent): boolean => {
      console.log('cannot open contextmenu nested in a contextmenu');
      e.preventDefault(); e.stopPropagation(); return false; });
    // viewpoints non va bene in quella posizione chiamalo layout (o syntax) layer non direttamente su canvas

  }

  public onContextMenu(evt: ContextMenuEvent): boolean {
    console.log('rx click contextmenu');
    // evt.preventDefault();
    // evt.stopPropagation();
    const vertex: IVertex = IVertex.getvertexByHtml(evt.target, false);
    DamContextMenu.contextMenu.hide();
    // only if is focused input
    const lastSelected: FocusHistoryEntry = U.focusHistoryEntries[U.focusHistoryElements.length - 1];
    const gotSelectedNow: boolean = false;// lastSelected && U.isParentOf(lastSelected.element, evt.target) && (new Date().valueOf() - lastSelected.time.valueOf() < 0.3 * 1000);
    const isInput = U.isInput(evt.target, true, false) && !gotSelectedNow;

    const clickStartedOutsideVertex: boolean = IVertex.startDragContext === null;
    // quando clickStartedOutsideVertex capita contextmenu dell'input senza che sia selezionato --> non triggerare contextmenu
    // quando contextmenù e gotSelectedNow fà il contextmenù personalizzato ma seleziona l'input --> non triggerare contextmenu
    // if (isInput && clickStartedOutsideVertex) evt.target.focus();
    // if (!isInput && gotSelectedNow) evt.target.blur();
    // happens when rightMouseDownClicked outside a vertex and rightMouseUpped inside a vertex.
    const pixelMoved: number = !clickStartedOutsideVertex ? 0 : vertex && vertex.size.tl().subtract(IVertex.startDragContext.size.tl(), false).absolute();
    const gotMoved: boolean = vertex && !clickStartedOutsideVertex && pixelMoved >= vertex.tolleranzaRightClickMove;
    const mp: ModelPiece = ModelPiece.get(evt);
    let ret: boolean;
    // evt['passedThroughVertex'] = ret;
    console.log('ret:', ret, 'mp:', mp, 'moved:', gotMoved, 'isInput:', isInput);
    const afterContextMenu = () => {
      console.log('rx mouseup');
      IVertex.startDragContext = null; }

    afterContextMenu();

    if (isInput) return true; else { ret = false; evt.preventDefault(); }
    if (gotMoved) { return ret; }
    if (!mp || isInput && !gotMoved) return ret;
    DamContextMenu.contextMenu.show(new Point(evt.pageX, evt.pageY), evt.target);
    return ret; }

  private setActiveAllAncestors(element: Element, stopElement: Element): void{
    while (element !== stopElement && element && element.classList) {
      if (element.hasAttribute('tabIndex')) element.classList.add('active');
      element = element.parentElement;
    }
  }
  private unsetActiveAllAncestors(element: Element, stopElement: Element): void{
    while (element !== stopElement && element && element.classList) {
      if (element.hasAttribute('tabIndex')) element.classList.remove('active');
      element = element.parentElement;
    }
  }

  private checkIfHide(e: MouseEventBase, debug: boolean = true) {
    // do not hide if click on non-terminal options (but do on terminals)
    debug&&console.trace('contextMenuCheckHide()', e);
    if (e && e.target.getAttribute('tabIndex') && U.isParentOf(this.html, e.target)) {
      this.$html.find('.active').removeClass('active');
      this.setActiveAllAncestors(e.target, this.html);
      IVertex.getvertexByHtml(e.target).fixFirefoxOverflowBug();
      debug&&console.log('contextMenuCheckHide-button-option: hidden for click on non-terminal option', e.target, this.html);
      return; }
    this.$html.find('.active').removeClass('active');
    // hide if tap again on the sam openOption button
    const openOptions = U.findFirstAncestor<HTMLElement>(e.target as HTMLElement, node => node.classList && node.classList.contains('open-options'));
    if (openOptions) {
      this.hide();
      if (this.isShowingInside(openOptions)) {
        debug&&console.log('contextMenuCheckHide-button-option: hidden for double-tap on same option button');
        return; }
      debug&&console.log('contextMenuCheckHide-button-option show for tap on option button');
      this.show(new Point(e.pageX, e.pageY), openOptions, openOptions);
      return; }
    const originalTarget: Element = e.target;
    const isInput: boolean = U.isInput(originalTarget, true);
    const isDisabled: boolean = (originalTarget as any).disabled;
    const focused: boolean = this.html.contains(document.activeElement);
    const isButton: boolean = (originalTarget.tagName.toLowerCase() === 'button')
      && !(originalTarget as HTMLButtonElement).disabled
      && originalTarget === document.activeElement;// se la selezione non è sul bottone, per me non l'ho premuto,
    // magari era un mousedown di selezione su un input terminato con mouseup su un button

    const clickedOutside = !U.isParentOf(this.html, originalTarget);
    // clicking on a submenu header should not cause it to disappear making the user incorrectly believe they triggered an action
    /*if (!clickedOutside && originalTarget.classList.contains('popupRightParent')) {
      debug&&console.log('contextMenuCheckHide keep-visible because clicked on non-terminal entry inside the menu');
      return;
    }*/

    // console.log('isInput:', isInput, 'isButton:', isButton, 'clickedOutside:', clickedOutside, '!focused:', !focused, originalTarget, document.activeElement, e);

    if (isButton || clickedOutside || !isInput && !isDisabled && !focused) {
      debug&&console.log('contextMenuCheckHide hidden because:', {isButton, clickedOutside, isInput, isDisabled, focused,
        condition: 'isButton || clickedOutside || !isInput && !isDisabled && !focused'});
      this.hide();
    }

  }

  private computePosition(location: Point, appendTo: HTMLElement = null): void {
    const templateSize: Size = U.sizeof(this.html);
    const viewPortSize: Size = new Size(0, 0, window.innerWidth, window.innerHeight);
    location.x = Math.max(0, location.x );
    location.y = Math.max(0, location.y );
    location.x = Math.min(viewPortSize.w - (templateSize.w), location.x );
    console.log('vp.w:', viewPortSize.w, ' - t.w:', templateSize.w, ', loc.x', location.x, ', t.size:', templateSize, this.html);
    console.log('vp.h:', viewPortSize.h, ' - t.h:', templateSize.h, ', loc.y', location.y, ', t.size:', templateSize, this.html);
    location.y = Math.min(viewPortSize.h - (templateSize.h), location.y );
    this.html.style.position = 'absolute';
    this.html.style.zIndex = '1000';
    this.html.style.width = 'max-content';
    if (appendTo) {
      this.html.style.left = '-2px';
      this.html.style.top = 'calc(100% - 2px)';
      return;
    }
    this.html.style.left = '' + location.x + 'px';
    this.html.style.top = '' + location.y + 'px';
  }

  public show(location: Point, target: Element, appendTo: HTMLElement = null): void {
    console.log('contextmenu show()');
    DamContextMenu.contextMenu.html.style.display = 'none';
    const vertex: IVertex = IVertex.getvertexByHtml(appendTo);
    appendTo = appendTo || this.defaultContainer;
    if (this.html.parentElement !== appendTo) { appendTo.appendChild(this.html); }
    if (appendTo === this.defaultContainer) appendTo = null;
    if (appendTo && Status.status.isFirefox) {
      this.setActiveAllAncestors(appendTo, vertex.getHtmlRawForeign());
      vertex.fixFirefoxOverflowBug();
    }
    const mp: ModelPiece = ModelPiece.getLogic(target);
    U.pe(!target, 'target is null.');
    if (!mp) return;
    mp.linkToLogic(this.html, false);
    console.log('contextmenu target:', this.clickTarget);
    const model: IModel = mp.getModelRoot();
    if (model.isM3()) { U.pw(true, 'No context-menu is currently available for M3 elements'); return; }
    this.clickTarget = target;
    this.html.style.display = 'none'; // if was already displaying, start the scrollDown animation without doing the scrollUp()
    // const vertex: IVertex = IVertex.getvertexByHtml(target);
    let edge: IEdge = IEdge.getByHtml(target);
    let extedge: ExtEdge = null;
    if (edge instanceof ExtEdge) { extedge = edge; edge = null; }


    this.extedgecontext.style.display = 'none';
    this.edgecontext.style.display  = 'none';
    this.vertexcontext.style.display = 'none';
    this.edgecontext.style.display = edge ? '' : 'none';
    this.extedgecontext.style.display = extedge ? '' : 'none';
    this.vertexcontext.style.display = !edge && !extedge ? '' : 'none';
    // this.$vertexcontext.find('.Reference').hide();
    this.$vertexcontext.find('.refli.dynamic').remove();
    this.$vertexcontext.find('.typeli.dynamic').remove();
    let i: number;
 //   if (vertex) {
      /*
      if (model.isM1()) {
        this.$vertexcontext.find('.m1hide').hide();
        this.$vertexcontext.find('.m2hide').show(); }
      else {
        this.$vertexcontext.find('.m1hide').show();
        this.$vertexcontext.find('.m2hide').hide(); }*/


    if (mp instanceof IClassifier) {
      const lishow = ($jq: JQuery<HTMLElement>): JQuery<HTMLElement> => $jq.each((i:number, e:HTMLElement) => { e.style.display = ''; });
      // this.$vertexcontext.find('.Feature').hide();
      // this.$vertexcontext.find('.Vertex').show();
      if (mp instanceof IClass) { this.fillTypeLi(mp, lishow); }
    }
    else {
      if (mp instanceof MReference) {
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
        // this.$vertexcontext.find('.Reference').show();
      }
      /*this.$vertexcontext.find('.Feature').show();
      this.$vertexcontext.find('.Vertex').hide();*/
    }
    const mr: MReference = mp instanceof MReference ? mp : null;
    const $indexinput = this.$vertexcontext.find('input.byindex');
    const upperbound = mr ? mr.metaParent.upperbound : null;
    if (mr) {
      if (upperbound === -1) $indexinput[0].removeAttribute('max');
      else $indexinput[0].setAttribute('max', '' + upperbound);
    } else $indexinput[0].setAttribute('max', '-999');
//
    /*
    if (model.isM1()) {
      this.$html.find('.m1hide').hide();
      this.$html.find('.m2hide').show();
    }
    else {
      this.$html.find('.m1hide').show();
      this.$html.find('.m2hide').hide();
    }*/

    let dic: Dictionary<string, boolean> = {};
    dic['m1'] = model.isM1();
    dic['m2'] = model.isM2();
    dic['class'] = mp instanceof IClass;
    dic['classifier'] = mp instanceof IClassifier;
    dic['feature'] = mp instanceof IFeature;
    dic['attribute'] = mp instanceof IAttribute;
    dic['reference'] = mp instanceof IReference;
    dic['operation'] = mp instanceof EOperation;
    dic['param'] = mp instanceof EParameter;
    dic['annotation'] = mp instanceof EAnnotation;
    dic['edge'] = !!edge;
    dic['extedge'] = !!extedge;
    dic['ongraph'] = !!U.isParentOf(model.graph.container, target);
    let ret = U.computeConditionalHides(this.$html, dic);
    console.log('rrer', ret);
    if (ret.show.length + ret.inaltered.length === 0) return;
    this.addEventListeners(location, mp); // [??? what?] must be done here, per facilità di fare binding usando variabili esterne agli eventi.
    this.computePosition(location, appendTo);
    // computePosition() needs to be after deciding sub-elements visibility and before sliding down, because needs to compute
    // the final height with correct children display and without slideDown temporary height hard-limiter with inline css.
    this.$html.slideDown();
  }
  private hide(): void {
    // double tap on "..." su firefox non nasconde (ri-esegue show() e riattiva l'overflow bug7')
    const parent = this.html.parentNode as HTMLElement;
    if (!parent) return;
    const vertex: IVertex = IVertex.getvertexByHtml(parent);
    if (vertex) this.unsetActiveAllAncestors(parent, vertex.getHtmlRawForeign());
    this.$html.slideUp('fast', null);
  }

  private fillTypeLi(mp: IClass, lishow: ($jq: JQuery<HTMLElement>) => JQuery<HTMLElement>): void {
    let i: number;
    const $typeli = this.$vertexcontext.find('.typeli.template');
    const $fallback = this.$vertexcontext.find('.typeli.fallback').hide();
    const containerli: HTMLElement = $typeli[0].parentElement;
    const isM2: boolean = mp instanceof M2Class;
    const m2Class: M2Class = (isM2 ? mp : mp.metaParent) as M2Class;
    if (isM2 && mp.instances.length === 0) {
      $(containerli).find('.typeli').hide();
      lishow($fallback.text("This class does not have any instances to convert."));
      return; }

    const separator: HTMLElement = $(containerli).find('.separator')[0];
    const arr = m2Class.getTypeConversionScores(true, true);

    if (arr.length === 0) {
      $(containerli).find('.typeli').hide();
      lishow($fallback.text("This class does not have any super or subclass available for conversion."));
      return; } else
    if (arr.length === 1) {
      lishow($(containerli).find('.typeli'));
      $(containerli).find('.typeli.description, .typeli.separator').hide();
    } else lishow($(containerli).find('.typeli'));

    $fallback.hide();
    for (i = 0; i < arr.length; i++) {
      const li = U.cloneHtml($typeli[0], true);
      const element = arr[i];
      const popuptxt: string = "Features: " + (element.features >= 0 ? "+" : "") + element.features +
        "; Operations: " + (element.operations >= 0 ? "+" : "") +element.operations +
        "; Annotations: " + (element.annotations >= 0 ? "+" : "") +element.annotations + ";"
      li.classList.remove('template');
      li.classList.add('dynamic');
      li.setAttribute("title", popuptxt);
      li.dataset.index = '' + i;
      li.dataset.classID = '' + element.class.getID();
      const $li = $(li);
      // $li.find('.index').text('' + i);
      $li.find('.text').text(element.class.printableNameshort());
      if (i === 0) containerli.insertBefore(li, separator);
      else containerli.appendChild(li);
    }
  }

  private addEventListeners(location: Point, m: ModelPiece) {
    const graphLocation: GraphPoint = Status.status.getActiveModel().graph.toGraphCoord(location);
    const html = this.html;
    const $html = this.$html;
    // const v: IVertex = IVertex.getvertexByHtml(this.clickTarget);
    // const m: ModelPiece = ModelPiece.getLogic(this.clickTarget);
    console.log('contextMenu target:', this.clickTarget, 'modelPiece:', m);
    const mr: MReference = m instanceof MReference ? m : null;
    const $indexinput: JQuery<HTMLInputElement> = $html.find('input.byindex') as JQuery<HTMLInputElement>;
    const upperbound = mr ? mr.getUpperbound() : null;
    U.pe(!m, 'mp null:', m, this.clickTarget);

    const $firstempty = $html.find('.refli .firstempty') as JQuery<HTMLButtonElement>;
    let $byindexInputAndButton = ($html.find('.refli .byindex') as JQuery<HTMLButtonElement>);
    console.log($byindexInputAndButton);
    $byindexInputAndButton.each(
      (index: number, el: HTMLButtonElement): false | void => { el.disabled = mr && upperbound === 0});
    $firstempty[0].disabled = mr && upperbound === 0;

    $html.find('.refli .firstempty').off('click.setref').on('click.setref', (e: ClickEvent) => {
      IVertex.linkVertexMouseDown(e, null, graphLocation);
    });
    $html.find('.refli button.byindex').off('click.setref').on('click.setref', (e: ClickEvent) => {
      let index: number = +$indexinput[0].value;
      if (index < 0 || ( upperbound > 0 && index >= upperbound)) {
        U.pw(true, 'invalid reference index. It must be a value inside the [0,' + upperbound + '] interval.');
        return; }
      const edge: IEdge = mr.edges[index] ? mr.edges[index] : new IEdge(mr, index, m.getVertex(), null, null);
      IVertex.linkVertexMouseDown(null, edge, graphLocation);
    });
    console.log('refli dynamic setup', $html.find('li.refli.dynamic').length);
    $html.find('li.refli.dynamic').off('click.setref').on('click.setref', (e: ClickEvent) => {
      const index: number = +e.currentTarget.dataset.index;
      console.log('refli dynamic click');
      console.log('setting reference[' + index + '] = ', mr.mtarget[index], mr);
      const edge: IEdge = mr.edges[index] ? mr.edges[index] : new IEdge(mr, index, m.getVertex(), null, null);
      IVertex.linkVertexMouseDown(null, edge, graphLocation);
    });
    $html.find('li.typeli.dynamic').off('click.changetype').on('click.changetype', (e: ClickEvent) => {
      const newType: M2Class = ModelPiece.getByID(+e.currentTarget.dataset.classID) as M2Class;
      U.pe(!(m instanceof IClass), "tryed to change type of non-class element.", m, e);
      U.pe(!(newType instanceof M2Class), "tryed to change type into non-class element.", newType, e);
      console.log('typeli dynamic click, changing type of: ', m, ' into: ', newType, this);
      if (m instanceof M2Class) m.convertInstancesTo(newType);
      if (m instanceof MClass) m.convertTo(newType);
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
      (e: ClickEvent) => { m.getVertex().minimize(); });
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
      (e: ClickEvent) => { m.duplicate('_Copy', m.parent); m.refreshGUI(); });
    $html.find('.Feature.delete').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.delete(true); });
    $html.find('.Feature.minimize').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.getVertex().minimize(); });
    $html.find('.Feature.up').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.pushUp(false); m.refreshGUI(); });
    $html.find('.Feature.down').off('click.ctxMenu').on('click.ctxMenu',
      (e: ClickEvent) => { m.pushDown(false); m.refreshGUI(); });

  }

  isOpened(): boolean {
    return this.html.style.display !== 'none';
  }
  isShowingInside(target: Element): boolean{
    return this.isOpened() && U.isParentOf(target, this.html);
  }
}
