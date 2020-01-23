import {IClass, IEdge, IReference, IVertex, M2Class} from '../../../common/Joiner';

export class ExtEdge extends IEdge{
  logic: M2Class;

  constructor(logic: IClass | IReference, startv: IVertex = null, end: IVertex = null) {
    super(logic, null, startv, end);
  }
  canBeLinkedTo(target0: IClass): boolean {
    const target: M2Class = target0 as M2Class;
    return target && this.logic !== target && target.extends.indexOf(this.logic) === -1;
  }
}
