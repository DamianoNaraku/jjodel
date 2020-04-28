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
    VersionUpload.all.push(this); }

}

export class ChangelogRoot extends ChangelogEntry {
  static readonly latestVersion = '1';

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
    v = new VersionUpload(new Date(2020, 4, 30), 'small update', '');
    v.addi('Info:', 'measurable elements are now called layouting elements');
    v.addf('GUI:', 'layouting elements editor now have a search form to filter layouting rules.');
    v.addf('Changelog:', 'inserted possibility to filter news on your interests (features, info, bugfix...).');
    v.addbf('GUI:', 'layouting elements editor counter was not updated on element removal.');
    // v = new VersionUpload(new Date(2020,4, 20), 'faketitle', 'fakedescr.');
    // v.addf('fakegfeat', 'kkk');
    // v = new VersionUpload('v3'...);

  }

  static popup: InputPopup;
  static show(): void {
    if (!ChangelogRoot.popup){
      ChangelogRoot.popup = new InputPopup('Changelog', ' ', ' ', null, null, null, 'input', null, null);
      ChangelogRoot.popup.getInputNode().hide();
      const html: HTMLElement = this.generateHtml();
      ChangelogRoot.popup.setPostHtml(html);
      $(ChangelogRoot.popup.html).find('button.closeButton').on('click.acknowledgeOnClose', ChangelogRoot.acknowledgeOnClose);
    }

    ChangelogRoot.popup.show();
  }
  static acknowledgeOnClose(): void {
    localStorage.setItem(ReservedStorageKey.versionAcknowledged, ChangelogRoot.latestVersion);
  }
  static CheckUpdates() {
    let acknowledgedVersion: string = localStorage.getItem(ReservedStorageKey.versionAcknowledged);
    if (acknowledgedVersion !== ChangelogRoot.latestVersion) ChangelogRoot.show();
  }
}

