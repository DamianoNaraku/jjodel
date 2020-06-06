import {ReservedStorageKey, TopBar, U} from '../common/Joiner';

export class WebsiteTheme{
  static readonly Dark: string = 'Dark';
  static readonly Light: string = 'Light';

  static setTheme(checkbox: HTMLInputElement = null) {
    let s: string = checkbox && checkbox.value;
    let oldTheme = localStorage.getItem(ReservedStorageKey.userTheme);
    if (!s) { s = oldTheme; }
    if (!s) {
      let radio: HTMLInputElement = TopBar.topbar.$topbar.find('input.themename:checked')[0] as HTMLInputElement;
      U.pe(!radio, 'a theme must be selected');
      s = radio.value; }
    if (!checkbox) { checkbox = TopBar.$checkboxesTheme.filter('[value="'+s+'"]')[0]; }
    localStorage.setItem(ReservedStorageKey.userTheme, '' + s);
    TopBar.$checkboxesTheme.removeAttr('checked');
    checkbox.checked = true;
    const change = (property: string) => { document.documentElement.style.setProperty('--' + property, 'var(--' + s + property + ')'); }
    change('mainFontColor');
    change('mainBackgroundColor');
    change('mainBorderColor');
    change('secondaryBorderColor');
    change('popupBackgroundColor');
    change('altBackgroundColor');
    change('altFontColor');
    document.body.classList.remove(oldTheme);
    document.body.classList.add(s);
  }

  static get(): string { return (TopBar.topbar.$topbar.find('input.themename:checked')[0] as HTMLInputElement).value; }
}
