import { Typedd } from '../../../common/Joiner';
export class IFeature extends Typedd {
    // linkToMetaParent<T extends IFeature>(feature: T) { this.metaParent = feature; }
    getClass() { return this.parent; }
    // must be overriden for m1-elements
    setValues(values = null, index = null, autofix = true, debug = false) { }
}
/*
export abstract class M3Feature extends IFeature {
  parent: M3Class;
  metaParent: M3Feature;
  instances: M3Feature[] | M2Feature[];
}
export abstract class M2Feature extends IFeature {
  parent: M2Class;
  metaParent: M3Feature;
  instances: MFeature[];
}
export abstract class MFeature extends IFeature {
  parent: MClass;
  metaParent: M2Feature;
  instances: ModelNone;
}*/
//# sourceMappingURL=iFeature.js.map