import {InputPopup, U} from '../../common/util';
import {ReservedStorageKey} from '../../common/Joiner';
import ClickEvent = JQuery.ClickEvent;


export class ChangelogEntry {

  version: VersionUpload;
  title: string;
  description: string;
  subPoints: ChangelogEntry[];
  allowHtml: boolean;


  date: Date; // only for versions.

  constructor(title: string, description: string, subPoints: ChangelogEntry[] = null, allowHTML: boolean = false) {
    this.title = (title ? '' + title : '').trim();
    this.description = (description ? '' + description : '').trim();
    if (this.description) this.title += ' ';
    this.subPoints = subPoints || [];
    this.allowHtml = allowHTML; }

  generateHtml(): HTMLElement {
    const li: HTMLLIElement = document.createElement('li');
    const title: HTMLElement = document.createElement('span');
    const description: HTMLElement = document.createElement('span');
    const subPoints: HTMLUListElement = document.createElement('ul');
    title.classList.add('title');
    description.classList.add('description');
    // const date: HTMLElement = document.createElement('span');
    // li.appendChild(date);
    li.appendChild(title);
    li.appendChild(description);
    li.appendChild(subPoints);
    const isFeature: boolean = this instanceof Feature;
    const isInfo: boolean = this instanceof FeatureInfo;
    const isBug: boolean = this instanceof Bug;
    const isBugfix: boolean = this instanceof BugFix;
    const isVersion: boolean = this instanceof VersionUpload;
    const isRoot: boolean = this instanceof ChangelogRoot;
    if (isRoot) { subPoints.classList.add('versionPoints', 'changelog'); }
    else if (isVersion) { subPoints.classList.add('versionSubPoints'); }
    else { subPoints.classList.add('subPoint'); }

    if (isInfo) li.classList.add('info');
    if (isVersion) li.classList.add('version');
    if (isFeature) li.classList.add('feature');
    if (isBug) li.classList.add('bug');
    if (isBugfix) li.classList.add('bugfix');

    if (this.date) {
      let datestr: string = this.date.getDate() + ' ' + this.date.toLocaleString('default', { month: 'long' });
      if (new Date().getFullYear() !== this.date.getFullYear()) datestr +=  ' ' + this.date.getFullYear();
      this.title = datestr + (this.title ? ' - ' + this.title : ''); }
    if (this.allowHtml) {
      title.innerHTML = this.title || '';
      description.innerHTML = this.description || ''; }
    else {
      title.innerText = this.title || '';
      description.innerText = this.description || ''; }
    let i: number;
    for (i = 0; i < this.subPoints.length; i++) { subPoints.appendChild(this.subPoints[i].generateHtml()); }

    return li; }


  public addb(title: string, description: string, subPoints: ChangelogEntry[] = null, asHtml: boolean = false) {
    this.subPoints.push(new Bug( title, description, subPoints, asHtml)); }
  public addi(title: string, description: string, subPoints: ChangelogEntry[] = null, asHtml: boolean = false) {
    this.subPoints.push(new FeatureInfo( title, description, subPoints, asHtml)); }
  public addbf(title: string, description: string, subPoints: ChangelogEntry[] = null, asHtml: boolean = false) {
    this.subPoints.push(new BugFix( title, description, subPoints, asHtml)); }
  public addf(title: string, description: string, subPoints: ChangelogEntry[] = null, asHtml: boolean = false) {
    this.subPoints.push(new Feature( title, description, subPoints, asHtml)); }
}

export class Feature extends ChangelogEntry {

}
export class FeatureInfo extends ChangelogEntry {

}

export class BugFix extends ChangelogEntry {

}
export class Bug extends ChangelogEntry {

}

export class VersionUpload extends ChangelogEntry {
 static all: VersionUpload[] = [];
  constructor (date: Date, title: string, description: string, subPoints: ChangelogEntry[] = []) {
    super (title, description, subPoints);
    this.date = date;
    ChangelogRoot.latestVersion = date.toString();
    VersionUpload.all.push(this); }

}

export class ChangelogRoot extends ChangelogEntry {
  static latestVersion: string = null;

  static generateHtml(): HTMLElement {
    ChangelogRoot.versionBlockNoteWriteHere();
    let root: ChangelogRoot = new ChangelogRoot(null, null, VersionUpload.all.reverse());
    const points: HTMLUListElement = $(root.generateHtml()).find('.versionPoints')[0] as HTMLUListElement;
    const html: HTMLElement = document.createElement('div');
    const $html: JQuery<Element> = $(html);
    const buttonfilters: HTMLElement = document.createElement('div');
    const buttonnamesArr: string[] = ['Feature', 'Info', 'Bug', 'BugFix'];
    const buttonstylearr: string[] = ['info', 'secondary', 'danger', 'success'];
    const getStyle = (button: HTMLButtonElement): string => { let ind: number = buttonnamesArr.indexOf(button.getAttribute('stile')); return buttonstylearr[ind]; }
    let i: number;
    let button: HTMLButtonElement;
    let buttons: HTMLButtonElement[] = [];
    for (i = 0; i < buttonnamesArr.length; i++) {
      let name: string = buttonnamesArr[i];
      let namelc: string = name.toLowerCase();
      button = document.createElement('button');
      buttons.push(button);
      buttonfilters.append(button);
      button.classList.add('featurefilter', namelc, 'btn');
      button.setAttribute('filter', namelc);
      button.setAttribute('stile', name);
      button.innerText = name;
      button.classList.add('btn');
      button.classList.add('active'); }
    $(buttons).on('click', (e: ClickEvent) => {
      let button = e.currentTarget;
      let active: boolean = button.classList.contains('active');
      let targettype: string = button.getAttribute('filter');
      let $targets: JQuery<Element> = $html.find('.changelog li.' + targettype);
      let style = getStyle(button);
      if (active) {
        button.classList.remove('active', 'btn-' + style);
        button.classList.add('btn-outline-' + style);
        $targets.hide();
      } else {
        button.classList.add('active', 'btn-' + style);
        button.classList.remove( 'btn-outline-' + style);
        $targets.show();
      }
    }).trigger('click').trigger('click');
    buttonfilters.classList.add('filterContainer');
    /*const title = document.createElement('h1');
    title.style.textAlign = "center";
    title.innerText = 'Changelog';
    html.style.position = 'relative';
    html.append(title);*/
    html.append(buttonfilters);
    html.append(points);
    return html; }



  static versionBlockNoteWriteHere(): void {
    let v: VersionUpload;

    v = new VersionUpload(new Date('2020/4/21'), 'Measurable reworking:',
      'Measurable system got rewritten from scratch to expand functionality and making the syntax more user friendly, the old documentation became obsolete and will be rewritten.', null);
    v.addf('GUI: ', 'Demo of light theme inserted (in the topbar).');
    v.addf('GUI: ', 'for inserting measurable rules without editing directly the HTML with some suggestion while typing and minor autocorrections on input mistakes.');
    v.addf('debugger: ', 'built-in simple debugger to see the output or execution errors of the rules executed and manually trigger measurable events. ("Test it!" button)');
    v.addf('Popup improvement 1: ',
      'now a single click on a popup will close all of them and copy the content of the clicked alert in the clipboard.\n' +
      'useful to dismiss them faster or as an help to read long messages without rush.');
    v.addf('Popup improvement 2: ',
      'Some popup will now be displayed just once for each page visit.' +
      'Such as warning the user about improper usage of some feature or warning about partially invalid inputs that are being auto-corrected.');
    v.addi('Measurable: ', 'inserted 3 logical group of rules:<ul><li>Event triggers</li><li>Executable rules</li><li>JqueryUI config (measurable relies on jqueryUI)</li></ul>', null, true);
    v.addbf('Many minor bugfixed', '');
    v.addf('Vertex', 'Support for manually set vertex size and position through coordinates and possibility to set a vertex in autosize mode, losing the ability to manually resize it but ensuring it will always fit to his contents.');
    v.addi('Other:', 'Implemented this self-referential changelog system, that will automatically pop-up every time there are new updates not yet acknowledged.');

    v = new VersionUpload(new Date('2020/4/30'), '', '');
    v.addi('Info:', 'Measurable elements are now called layouting elements');
    v.addf('GUI:', 'Layouting elements editor now have a search form to filter layouting rules.');
    v.addf('Changelog:', 'Inserted possibility to filter news on your interests (features, info, bugfix...).');
    v.addbf('GUI:', 'Layouting rules counter on the editor gui was not updated on rule removal.');
    v.addf('GUI:', 'Default edge colors will now change according to website theme (manually edited styles won\'t change).');
    v.addbf('Layoutable:', '_Constraint was not working properly, rules sometime were improperly altering graph grid\'s size.');
    v.addbf('GUI:', 'A recent chrome update was making the graph grid blurry on extremely big or small grid sizes, fixed.');

    v = new VersionUpload(new Date('2020/5/6'), '', '');
    v.addf('Layoutable:', 'Improved the rule editor with code autocompletion, providing dynamic suggestions and information about types of available variables, function\'s parameters and return values. With a link to documentation.');
    v.addi('Optimization:', 'Reduced redundant calls during MClass creation and loading.');

    v = new VersionUpload(new Date('2020/6/6'), 'Generalization / Inheritance system', 'Huge update with many features and bugfixes.');
    v.addf('Generalization / Inheritance:', 'Can be added through vertex contextmenù.\n'
      + 'Like all edges, you can change their endpoint by selecting the edge and dragging the dot near the target vertex, and you can delete them by pressing CANC/DEL key.\n' +
      'By default inherited features are hidden in m2 and displayed in m1, this behaviour can be changed using the new filtering feature described in a following point.\n' +
      'Chain of inheritances are supported. (ClassA can extend ClassB and ClassB will extend classC, so ClassA indirectly extends classC).\n' +
      'Multiple inheritance is allowed. (ClassA can directly extend ClassB and ClassC at the same time)\n' +
      'The setup of circular inheritances will be prevented, either directly or indirectly and a popup will warn the user.\n' +
      'E.g. If ClassA extends ClassB, and ClassB extends ClassC, you cannot make classC extend classA.');
    v.addf('Overriding / Polymorphism', 'Operations can now violate name uniqueness constraint to allow overriding and polymorphism.\n' +
      'If two functions are homonym and cannot be in a polymorphism or overriding relationship they will be marked in pairs as invalid with the same dynamic color until the user makes a change to fix the violation.');
    v.addf('Shadowing',
      'Features shadowed by redeclaration on subclasses are now detected and hidden.\n' +
      'Shadowed variables can be displayed in M1 for informative purpose, but their value will not be saved (on purpose).');
    v.addf('Style editor: ', 'Inserted "Use as default style" checkbox which can only be used on customized elements.\n' +
      'When marked the customized style of this element will be inherited by all other elements of the same type (Class, Enum, Attribute, Reference...) with the least priority.\n' +
      'A reminder on style priorities:' +
      '<ul>' +
      '<li>1) "Own html" customized style attached to the element itself.</li>' +
      '<li>2) "Inherited html" customized style attached to the meta-parent of the element (eg: a M1-class instance inheriting his style from his M2-class type).</li>' +
      '<li>3) User-defined "default html", eg: a M1-class instance inheriting his style from another M1-class peer marked as default style with this brand new feature.</li>' +
      '<li>4) Hardcoded, static "default html", the one you see on "default" viewpoint.</li>' +
      '</ul>' +
      'If one of those style throws an exception while rendering or executing custom code injected inside the style,' +
      ' that faulty style will be automatically removed and the next style in priority order will be applied.' +
      'Until eventually the fourth level is reached, which has been broadly tested and should never fail.', null, true);
    v.addf('Vertex gui customization:', 'It is now possible to set up a custom filter and condition to select which childrens of a classifier / operation should be displayed.' +
      'There are shortcuts to filter children based on their type or whether they are inherited or not. <a href="https://github.com/DamianoNaraku/jjodel/wiki/Display-and-filter-sub-features-inside-a-vertex">More info here.</a>', null, true)
    v.addf('Text popup improved:', '' +
      'Textual popup notifying the user about invalid actions, errors, tooltip or automatic fixing invalid user input now cannot show duplicates at the same time.\n' +
      'Clicking a popup will make it disappear instantly while copying his text to the clipboard (copy-paste, old feature reminder).\n' +
      'Right-clicking a popup will now hide all same-colored notifications.\n' +
      'Wheel-clicking a popup will now hide all notifications.');
    v.addf('Usability: mouse shortcuts', '' +
      '<ul>' +
      '<li>Rightclicking a vertex will make it follow the cursor until released, ignoring measurables.\n' +
      'Can be useful if the only visible part of a vertex / feature is a input or a measurable, as left-clicking them will not drag the vertex.</li>'+
      '<li>MouseWheel-clicking anywhere on the graph and start dragging will ignore any vertexes and make the graph offset follow the cursor.\n' +
      'Can be useful on high zoom levels, huge vertexes or densely populated graph.</li></ul>', null, true);
    v.addf('ContextMenu:', 'User right-clicking input elements inside vertexes might desire both native contextmenù or customized contextmenù.\n' +
      'To access the native context menù, the user must rightclicking a input field inside the currently selected feature / vertex or do a slow right-click.\n' +
      'Here are detailed rules to check which one will appear: '+
    '<ul>' +
      '<li>RightClick and drag on any child of a vertex / feature: no custom menù, the whole vertex will be dragged, measurables and inputs will be ignored.</li>' +
      '<li>still RightClick on a input child of a selected vertex / feature: native context menù.</li>' +
      '<li>still RightClick on any child of a un-selected vertex / feature: custom context menù.</li>' +
      '<li>still, slow (hold for 1 sec) RightClick a input child of vertex / feature: native menù</li></ul>', null, true);
    v.addb('Bug:', 'The usage of the $ and £ characters outside variable templates ($##likeThis$) and inside the html of custom styles might cause errors.\n' +
      'Until bugfix use the unicode combination \\u0024 for $ and \\u00A3 for £ when possible. This bugfix will have low priority.');

    v.addbf('Edge:', 'Fixed an error that was preventing to insert the first mid-points to an edge when his style was "straight".');
    v.addbf('PropertyBar:', 'Automatized update of structured view, style editor and raw viewer when visualized html node in graph or his parents are updated.\n');
    v.addbf('ContextMenu:', 'Was not appearing.');

    v = new VersionUpload(new Date('2020/7/31'), '', '');
    v.addf('Interface and Abstract classes support', 'Accessible through the structured tree view on the right bar.');
    v.addf('Class conversion:',
      'It is now possible to change type of a single M1-class, or of all instances of a target M2-class. (<a href="https://github.com/DamianoNaraku/jjodel/wiki/Class-deletion-&-Class-type-conversion">Full guide here</a>)\n' +
      'For example converting all "Date" instances to "DateTime" instances, adding a "time" attribute to all of them without changing the definition of the "Date" class.', null, true);
    v.addbf('children filtering:', 'was not working properly only on his generic version (childrenContainer) and not on AttributeContainer');
    v.addbf('validation:', 'was working on run-time edits, but not on the initial load of the model');
    v.addbf('class deletion:', 'When a class was used as function parameter, the removal was causing exceptions.' +
      '\nNow it will change the parmaeter\'s type using class conversion, or removing it if conversion is impossible.');
    v.addbf('firefox', 'default style of vertex had transparent background.');
    v.addbf('Edges', 'Trying to delete the mandatory start and end-point of a edge would cause visual errors.');
    v.addbf('Edges', 'Edges changing his target by dragging where not following his new target vertex when dragged.');

    v = new VersionUpload(new Date('2020/10/26'), 'M2T groundwork, Type mapping improvement', '');
    v.addf('Type mapping', 'Accessible through the topbar, it allows now to define sets of typing aliases.\n' +
      'Once a set of aliases is created you can give it a name to switch between saved alias sets, changing multiple aliases with one action.');
    v.addf('M2T', 'Can be done in 2 ways.<br>' + '<ul>' +
      '<li>Through style editor: Code will be produced according to nodes content, node content can become shards of code through style editor.<br>' +
      'Combined style overriding it is extremely easy to customize code generation for specific cases or single classes / objects.<br>' +
      'The final output will be obtained through the "By text" predefined transformation.<br>' +
      'Users will be able to use pre-existing transformations by importing a viewpoint from the store.</li>' +
      '<li>In future through the MTL standard (not yet supported)<br>' +
      'Users will be able to create their own M2T transformation and share them on a public store.</li>' +
      '</ul>', null, true);

    v = new VersionUpload(new Date('2020/12/05'), 'Auto-layouting', '');
    v.addf('Auto-layout',
      'Accessible through the style editor of a graph, guide on the <a href="https://github.com/DamianoNaraku/jjodel/wiki/Auto-Layout">wiki page</a>.', null, true);
    v.addbf('zoom & pan',
      'Zoom and pan weren\'t combining well, panning with a zoom level used to cause calculation error leading to graphical mismatch.');

    v.addf('Import / Export / Reset of viewpoint and vertices positions',
      'Accessible through the top-bar, can be used to share a viewpoint while waiting for the store.\n' +
      'Resetting the viewpoint might fix errors caused by a wrong customization of a viewpoint.', null, true);
    let searchterm = 'clog addbf ';

    // v = new VersionUpload(new Date('2020/4/21'), 'faketitle', 'fakedescr.');
    // v.addf('fakegfeat', 'kkk');
    // v = new VersionUpload('v3'...);

  }
  private static clog(){}

  static popup: InputPopup;
  static generate(): void {
    if (ChangelogRoot.popup) return;
    ChangelogRoot.popup = new InputPopup();
    ChangelogRoot.popup.setText('Changelog', this.generateHtml(), '');
    ChangelogRoot.popup.onCloseButton([ChangelogRoot.acknowledgeOnClose]); }

  static show(): void {
    ChangelogRoot.generate();
    ChangelogRoot.popup.show(); }

  static acknowledgeOnClose(): void { localStorage.setItem(ReservedStorageKey.versionAcknowledged, ChangelogRoot.latestVersion); }

  static CheckUpdates() {
    ChangelogRoot.generate();
    let acknowledgedVersion: string = localStorage.getItem(ReservedStorageKey.versionAcknowledged);
    if (acknowledgedVersion !== ChangelogRoot.latestVersion) ChangelogRoot.show();
  }
}

