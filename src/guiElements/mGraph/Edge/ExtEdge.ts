import {GraphPoint, IClass, IClassifier, IEdge, IReference, IVertex, M2Class, MReference, U} from '../../../common/Joiner';
import KeyDownEvent = JQuery.KeyDownEvent;
import {Keystrokes} from '../../../common/util';

export class ExtEdge extends IEdge{
  logic: M2Class;

  constructor(logic: M2Class, startv: IVertex, end: IVertex, tmpend: GraphPoint) { super(logic, null, startv, end, tmpend); }

  canBeLinkedTo(target0: M2Class): boolean {
    let out: {reason: string, indirectExtendChain: IClass[]} = {reason: '', indirectExtendChain: null};
    if (!this.logic.canExtend(target0, out)) { U.ps(true, out.reason); return false; }
    return true; }

  addEventListeners(foredge: boolean, forheadtail: boolean): void {
    super.addEventListeners(foredge, forheadtail);
    const $edgetail: JQuery<Element> = forheadtail ? $(this.headShell).add(this.tailShell) : $();
    const $shell: JQuery<Element> = foredge ? $(this.shell) : $();
    $edgetail.off('keydown.delete').on('keydown.delete', (e: KeyDownEvent) => this.keydown(e));
    $shell.off('keydown.delete').on('keydown.delete', (e: KeyDownEvent) => this.keydown(e)); }


  getContainedArray(): ExtEdge[] { return this.logic.extendEdges; }
  remove(): void {
    if (this.end) this.logic.unsetExtends(this.end.logic() as M2Class, false);
    super.remove();
  }
}

