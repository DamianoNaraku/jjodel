import { IEdge } from '../../../common/Joiner';
export class ExtEdge extends IEdge {
    constructor(logic, startv = null, end = null) {
        super(logic, null, startv, end);
    }
    canBeLinkedTo(target0) {
        const target = target0;
        return target && this.logic !== target && target.extends.indexOf(this.logic) === -1;
    }
}
//# sourceMappingURL=ExtEdge.js.map