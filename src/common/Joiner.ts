/* NOTE: error in module.extends: devi importare i file rispettando l'ordine di dichiarazioni delle classi, se dichiaro class A nel file A, e class
 B extensa A nel file B, il file B non può essere importato prima del file A*/
/* this is undefined in constructors or method calls: likely caused by a reserved class name that is listed in config.ts and is behaving
 differently.*/
// /*new*/export {Styles, ModelPieceStyleEntry, SortType, StyleVisibility} from '../GuiStyles/styles';
// /*new*/export {ViewHtmlSettings, ViewPoint, ViewRule, ModelView, PackageView, ClassView, AttributeView, EdgeViewRule, ReferenceView, OperationView,
// ParameterView} from '../GuiStyles/viewpoint';




export type MyException = any;
import { default as AnsiUp } from 'ansi_up';
export const ansiUp = new AnsiUp(); // https://github.com/drudru/ansi_up // ansi color formatter.

import * as stringsimilarity from '../common/StringSimilarity.js';
export const StringSimilarity = stringsimilarity;
import { toCSS, toJSON } from 'cssjson';
export const CSS = { toCSS, toJSON };
export const JSCSS_CSSPARSER = window['CSSParser'] || {};
/*import * as CSSS from 'css';
export const CSS = CSSS;*/

import "jqueryui";
// import "jquery";
import * as $$ from 'jquery';
export const $ = window['' + '$'] = $$;
import * as $bb from 'bootstrap';
export const $b = $bb;

import Swal0 from 'sweetalert2'
export const Swal = Swal0;
/*
import * as JQueryUII        from '../../node_modules/jqueryui';
export const JQueryUI: JQueryUII = JQueryUII.JQueryUI;*/
import * as _pr_json2xml     from '../common/prj_json2xml.js';
import * as _pr_xml2json     from '../common/prj_xml2json.js';
export const prjson2xml = _pr_json2xml;
export const prxml2json = _pr_xml2json;
/*export const $$$: JQueryStatic = require('jquery-ui');
export const $ui: JQueryStatic = $$$;*/
export {Layouting} from '../guiElements/mGraph/Layouting';
export {VsCodeLayerIn, VsCodeLayerOut} from '../vscodeLayer/VsCodeLayer';
export {ViewHtmlSettings, ViewPoint, ViewRule, EdgeViewRule} from '../GuiStyles/viewpoint';
export {LocalStorage} from '../Database/LocalStorage';
export {ModelPiece, Info, ModelNone, StyleComplexEntry} from '../Model/modelPiece';
/*new*/export {ECoreEnum, EcoreLiteral,
  ECoreParameter, ECoreOperation, ECoreAttribute, ECoreReference,
  ECoreClass, ECorePackage, ECoreRoot, ECoreAnnotation, ECoreDetail, XMIModel, IModel} from '../Model/iModel';
export {TagNames, ShortAttribETypes, U, Json, AttribETypes,
  InputPopup, DetectZoom, Dictionary, ParseNumberOrBooleanOptions,
  IPoint, Point, GraphPoint, ISize, Size, GraphSize, myFileReader, FocusHistoryEntry, FileReadTypeEnum, EvalOutput, SelectorOutput,
  TSON_JSTypes, TSON, TSON_UnsupportedTypes, TSONString, GenericObject, CSSRuleSorted, Keystrokes, AutocompleteMatch, CSSParser} from './util';
export {ColorScheme2, ColorSchemeComponent} from '../app/color-scheme/color-scheme.component';

export {
  MeasurableRuleParts, Measurable, MeasurableEvalContext, measurableRules,
  MeasurableRuleLists, MeasurableOperators, DraggableOptionsImpl, ResizableOptionsImpl,
  RotatableOptions, UnsafeMeasurableEvalContext, ConstraintLeftAdmittedsStatic} from './measurable';
export {EditorContext} from '../guiElements/style-editor/style-editor.component';
export {Status} from '../../src/app/app.module';
export {IGraph, ViewPointShell} from '../guiElements/mGraph/iGraph';
export {IVertex} from '../guiElements/mGraph/Vertex/iVertex';
export {IField} from '../guiElements/mGraph/Field/iField';
export {ISidebar} from '../guiElements/isidebar/isidebar.component';
export {IEdge, EdgeModes} from '../guiElements/mGraph/Edge/iEdge';
export {ExtEdge} from '../guiElements/mGraph/Edge/ExtEdge';
export {EdgePoint, EdgePointFittizio, CursorFollowerEP} from '../guiElements/mGraph/Edge/EdgePoint';
export {EdgeStyle, EdgePointStyle} from '../guiElements/mGraph/Edge/edgeStyle';
export {PropertyBarr, PropertyBarTabs} from '../guiElements/propertyBar/propertyBar';
export {TopBar} from '../guiElements/top-bar/top-bar.component';
export {StyleEditor} from '../guiElements/style-editor/style-editor.component';
/*neww*/ export {SaveListEntry} from '../Database/LocalStorage';
// export {Options} from '../Save/Save';
export {MyConsole} from '../guiElements/console/console.component';/*
export {IModel, ECoreRoot, ECorePackage, ECoreClass, ECoreReference,
  ECoreAttribute, ECoreParameter, ECoreOperation, XMIModel, EcoreLiteral, ECoreEnum } from '../Model/iModel';*/
// export {IModel} from '../Model/iModel';
export {MetaMetaModel} from '../Model/MetaMetaModel';
export {MetaModel} from '../Model/MetaModel';
export {Model} from '../Model/Model';
export {IPackage, M3Package} from '../Model/mPackage/iPackage';
export {M2Package} from '../Model/mPackage/MMPackage';
export {MPackage} from '../Model/mPackage/MPackage.component';
export {IClassifier} from '../mClass/IClassifier';
export {IClass, M3Class} from '../mClass/iClass';
export {M2Class} from '../mClass/m2Class';
export {MClass} from '../mClass/MClass';
export {EEnum} from '../mClass/EEnum';
export {Type, EType} from '../mClass/classChild/Type';
export {Typedd} from '../mClass/classChild/Typedd';
export {ELiteral} from '../mClass/classChild/ELiteral';
export {IFeature, M3Feature, M2Feature, MFeature} from '../mClass/classChild/Features/iFeature';
export {IReference, M3Reference} from '../mClass/classChild/Features/References/iReference';
export {M2Reference} from '../mClass/classChild/Features/References/M2Reference';
export {MReference} from '../mClass/classChild/Features/References/MReference';
export {IAttribute, M3Attribute} from '../mClass/classChild/Features/Attributes/iAttribute';
export {M2Attribute} from '../mClass/classChild/Features/Attributes/mmAttribute';
export {MAttribute} from '../mClass/classChild/Features/Attributes/MAttribute';
export {EAnnotation} from '../Model/EAnnotation';
export {EAnnotationDetail} from '../Model/EAnnotationDetail';
/*new*/export {Database} from '../common/Database';
export {DamContextMenuComponent} from '../guiElements/dam-context-menu/dam-context-menu.component';
export {EOperation, AccessModifier} from '../mClass/classChild/Operations/eOperation';
export {EParameter} from '../mClass/classChild/Operations/eParameter';
export {Draggableoptions, Resizableoptions, Rotatableoptions, ResizableoptionsPH,
  DraggableOptionsPH, RotatableoptionsPH, MeasurableTemplateGenerator, MeasurabletemplateComponent} from '../app/measurabletemplate/measurabletemplate.component';
export {ChangelogRoot, ChangelogEntry, VersionUpload, Feature, Bug, BugFix} from '../guiElements/changelog/ChangelogEntry';
export {WebsiteTheme} from '../GuiStyles/global';
export {ModelUpdateMessage} from '../ServerCommunication/Synchronization/ModelUpdateMessage';
export {SendManager} from '../ServerCommunication/Synchronization/SendManager';


export {CSSEditor} from '../../src/guiElements/style-editor/csseditor/CssEditor';


export class ReservedClasses {
  // everytime i draw a vertex, i need to search in all the DOM sub-tree for all attributes starting with measurableRules.onRefresh and execute them.
  // hence i made a class tied with the presence of attributes starting with measurableRules.onRefresh for efficiency.
  static readonly onRefresh = 'onRefresh';
  static readonly template = 'template';
  static readonly vertexRootG = 'VertexRoot'; // on G element
}
export class ReservedAttributes {
  static readonly todo = 'todo';
}
export class ReservedDatasets {
  static readonly todo = 'todo';
}
export class ReservedStorageKey {
  static readonly userTheme: string = 'userTheme';
  static readonly versionAcknowledged = 'versionAcknowledged';
}



// import {IClassifier} from '../mClass/IClassifier';

/*
// @ts-ignore
let enc = he.encode;
// @ts-ignore
let dec = he.decode;
// @ts-ignore
let esc = he.escape;
// @ts-ignore
let unesc = he.unescape;
// @ts-ignore
let ver = he.version;
export const HE = {encode: enc, decode: dec, escape: esc, unescape: unesc, version: ver};*/


// NB: se li esporti e usi come identificatori/costruttori nel codice, typescript li collega da una fantomatica user-class con nome __CambiatoTipoCosì
// e pur esistendo la classe A, lui cerca __A e dice che non esiste.
// soluzione: attiva quando scrivi codice per abilitare il type check, disabilita in produzione.
/*
type ResizeObserverSize = unknown;
declare type ResizeObserverEntry = {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize: ResizeObserverSize[]; // type was "readonly attribute sequence<ResizeObserverSize>"
  readonly contentBoxSize: ResizeObserverSize[];
  devicePixelContentBoxSize: ResizeObserverSize[];
}
declare type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserverr) => unknown;
declare type ResizeObserverOptions = {box: 'content-box' | 'border-box'}
declare type ResizeObserverr = {
  constructor(callback: ResizeObserverCallback);
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
  disconnect(): void;
}
export let ResizeObserver: ResizeObserverr = window['' + 'ResizeObserver'];
*/
