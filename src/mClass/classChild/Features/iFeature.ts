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

  // linkToMetaParent<T extends IFeature>(feature: T) { this.metaParent = feature; }
  getClass(): IClass { return this.parent; }
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
