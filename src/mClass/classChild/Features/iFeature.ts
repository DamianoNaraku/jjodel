import {
  Json,
  U,
  IEdge,
  IField,
  IPackage,
  M2Class,
  IAttribute,
  AttribETypes,
  ModelPiece,
  ISidebar,
  IGraph, Typedd,
  IModel, IClass, M3Class,
  Status, MClass, IVertex, M3Reference, M3Attribute, M2Reference, MReference, MAttribute, M2Attribute
} from '../../../common/Joiner';

export abstract class IFeature extends Typedd {
  metaParent: IFeature;
  instances: IFeature[];
  parent: IClass;
  // isShadowed: boolean = false;

  // linkToMetaParent<T extends IFeature>(feature: T) { this.metaParent = feature; }
  getClass(): IClass { return this.parent; }

  // must be overriden for m1-elements
  setValues(values: any[] | any = null, index: number = null, autofix: boolean = true, debug: boolean = false): void {}
/*
  setShadowed(mapElement: boolean): void {
    U.pe(!this.getModelRoot().isM2(), 'setShadowed() must be called from M2.', this);
    this.isShadowed = mapElement; }*/

  isInherited(forClass: IClass): boolean {
    let thismr: IModel = this.getModelRoot();
    let targetmr: IModel = forClass.getModelRoot();
    U.pe(thismr !== targetmr, 'dev error isInherited(): cannot compare object from different models:', this, forClass);
    U.pe(thismr.isM3(), 'dev error isInherited(): cannot compare object from m3:', this, forClass);
    if (thismr.isM2()) return this.parent !== forClass; // for m2
    let m2classContaining: IClass = this.metaParent.parent;
    let m2classOfParent: IClass = forClass.metaParent;
    if (m2classContaining !== m2classOfParent) return true; // for m1
    return false; }

  isShadowed(forClass: IClass): boolean {
    const myroot: IModel = this.getModelRoot();
    const targetRoot: IModel = forClass.getModelRoot();
    U.pe(myroot !== targetRoot, 'error: called isShadowed with subject and parameters on different models:', this, forClass);
    if (myroot.isM1()) return this.metaParent.isShadowed(forClass.metaParent);
    let childs = forClass.getAllChildrens(false, false, true, true, false);
    let myIndex = childs.indexOf(this);
    for (let i = 0; i < myIndex; i++) {
      if (childs[i].name === this.name) {

        console.log (forClass.id + '_' + this.id + ' true 0isShadowed?', this.parent.name + '.' + this.name, myIndex, childs.map((e)=> e.parent.name + '.' + e.name));
        return true;
      }
    }
    console.log (forClass.id + '_' + this.id + ' false 0isShadowed?', this.parent.name + '.' + this.name, myIndex, childs.map((e)=> e.parent.name + '.' + e.name));

    return false;
  }



/*  isShadowedOld(forClass: IClass): boolean {
    if (forClass !== this.parent && !this.isInherited(forClass)) return false;
    if (this.getModelRoot().isM1()) return this.metaParent.isShadowed(forClass.metaParent);
    if (forClass.getModelRoot().isM1()) forClass = forClass.metaParent;
    let superclasses: IClass[] = forClass.getAllSuperClasses();
    let i: number;
    for (i = 0; i < superclasses.length; i++) {
      let sc: IClass = superclasses[i];
      let tmp = sc.isChildNameTaken(this.name);
      if (tmp) return true; }
    return false; }
*/
}

export type M3Feature = M3Reference | M3Attribute;
export type M2Feature = M2Reference | M2Attribute;
export type MFeature = MReference | MAttribute;
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
