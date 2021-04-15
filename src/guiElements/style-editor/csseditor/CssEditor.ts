import {
  Dictionary, U, ModelPiece, StyleEditor,
  EditorContext, ColorScheme2, ColorSchemeComponent, CSS
} from '../../../common/Joiner';
import ClickEvent = JQuery.ClickEvent;
import ChangeEvent = JQuery.ChangeEvent;
// import CSSParser from 'jscssp';


type ColorScheme = { name: string, colors: string[]};
export class CSSEditor {
  static editor: CSSEditor;

  static defaultColorScheme: ColorScheme = { name: 'Default colors', colors: ['#ffffff', '#000000', '#1e90ff', '#ff8c00', '#28a745']};
  static defaultColorSchemes: ColorScheme[] = [
    CSSEditor.defaultColorScheme,
    { name: 'Color scheme 1', colors: ['#ffffff', '#364f6b', '#3fc1c9', '#f5f5f5', '#fc5185']},
    { name: 'Color scheme 2', colors: ['#ffffff', '#f9a828', '#ececeb', '#07617d', '#2e383f']},
    { name: 'Color scheme 3', colors: ['#ffffff', '#fa4659', '#effe40', '#a33e83', '#2eb872']},
    { name: 'Color scheme 4', colors: ['#ffffff', '#BE64FA', '#8459DE', '#5975DE', '#64ACFA']},
  ];

  activeColorScheme: ColorScheme;

  static updateGUI(se: StyleEditor, $html: JQuery<HTMLElement>, mp: ModelPiece, context: EditorContext): void {
    if (!CSSEditor.editor) { CSSEditor.editor = new CSSEditor(); CSSEditor.staticInit(); }
    return CSSEditor.editor.updateGUI(se, $html, mp, context);
  }

  private static makeColorBlockReadonly (color: string): Element {
    const el = document.createElement('div');
    el.classList.add('colorblock');
    el.style.backgroundColor = color;
    return el; }

  private static fillColorSchemeHtml($option: JQuery<HTMLElement>, colorscheme: ColorScheme){
    $option[0].classList.remove('template');
    $option[0].dataset.csname = colorscheme.name;
    $option.find('[value1]')[0].innerHTML = colorscheme.name;
    const colorcontainer = $option.find('[value2]')[0];
    colorcontainer.dataset.colors = colorscheme.colors.join(', ');
    for (let color of colorscheme.colors) {
      colorcontainer.appendChild(CSSEditor.makeColorBlockReadonly(color));
    }
  }

  private fillSelectorSuggestionDatalist(templateLevelRoot: Element): void {
    const repeatedClasses: string[] = $(templateLevelRoot).find('[class]').addBack('[class]').toArray()['flatMap'](e => e.className.toString().split(/\s+/));
    const set:Set<string> = new Set();
    repeatedClasses.forEach(c => c && set.add(c));
    const uniqueClasses: string[] = [...set].sort();
    const suggestSelectorsDataList = $('#currentNodeClassList')[0];
    U.clear(suggestSelectorsDataList);
    const makeOption = (classname: string): HTMLOptionElement => {
      const opt = document.createElement('option');
      opt.value = classname;
      return opt; }
    const options: HTMLOptionElement[] = uniqueClasses.map( (classname: string) => {
      return makeOption('.' + classname);
    });
    options.push(makeOption('input'));
    options.push(makeOption('textarea'));
    options.push(makeOption('select'));
    options.push(makeOption('h1, h2, h3, h4, h5, h6'));
    console.log('dsa', suggestSelectorsDataList, options, uniqueClasses, templateLevelRoot);
    /*window['CSSParser'] = CSSParser;
    console.log("CSSParser", CSSParser);*/
    suggestSelectorsDataList.append( ...options );
  }

  private fillInheritedColorSchemeDropdown(se: StyleEditor, $html: JQuery<HTMLElement>, mp: ModelPiece, context: EditorContext, csTemplates: any): void {
    const ancestorLine: Element[] = U.ancestorArray(context.graphLevel, null, false);
    const $ancestorLine: JQuery<Element> = $(ancestorLine);
    const allColorSchemeSelectors: {[selector:string]: ColorScheme2[]} = ColorSchemeComponent.getAllSelectors();
    const inheritingLine: Map<Element, ColorScheme2[]> = new Map();
    let $results: JQuery<Element>;
    for (let selector in allColorSchemeSelectors) {
      try {
        $results = $ancestorLine.filter(selector);
        if (!$results) continue;
        for (let result of $results) {
          const oldArr: ColorScheme2[] = inheritingLine.get(result) || [];
          oldArr.push( ... allColorSchemeSelectors[selector]);
          inheritingLine.set(result, oldArr);
        }
      }catch(e){ ; }
    }
    // dati presi, ora riempio la lista cs ereditati
    let i: number;
    // ritorna un singolo cs option template con lista colori

    const fillListWithCs = ($element: JQuery<Element>, arr: ColorScheme2[]) => {
      for (let cs of arr) { $element.append(csTemplates.getCsOptionEntry(cs));}
    }

    const $inerhitingColorSchemeList = $html.find('.inheriting-color-scheme-list'); // todo direttamente dentro style editor, contiene niente e viene riempito dinamicamente.
    const container = $inerhitingColorSchemeList.find('.dropdownmenu')[0];
    for (i = 0; i < ancestorLine.length; i++) {
      const ancestor = ancestorLine[i];
      const csarr: ColorScheme2[] = inheritingLine.get(ancestor);
      if (!csarr || !csarr.length) continue;
      const goUpCount = ancestorLine.length - i + 1;
      const option = U.cloneHtml(csTemplates.csList);
      const $option = $(option);
      $option.find('.cs.level').text('' + goUpCount);
      $option.find('.cs.tag').text('' + ancestor.tagName + (ancestor.id ? '#' + ancestor.id : ''));
      const $csList = $option.find('.cs.list');
      fillListWithCs($csList, csarr);
      container.append(option);
    }
  }

  private fillOwnColorSchemeDropDown(se: StyleEditor, $html: JQuery<HTMLElement>, mp: ModelPiece, context: EditorContext, csTemplates: any): void{
    const $ownCsSelect = $html.find('.own-color-scheme-list');
    const container = $ownCsSelect.find('.dropdownmenu')[0];
    const colorSchemeAttrContent: string = context.templateLevel.getAttribute('color-scheme');
    const currentCsIDList: string[] = colorSchemeAttrContent && U.replaceAll(colorSchemeAttrContent, 'CS-', '').split('|') || [];
    let currentCSList: ColorScheme2[] = currentCsIDList.filter( (e) => !!e).map(  (e) => ColorScheme2.get(+e));

    console.log('csl attrcontent', colorSchemeAttrContent, 'idlist', currentCsIDList, ' list', currentCSList);
    const debug: boolean = false;
    const applyCsList = (list: ColorScheme2[]) => {
      U.pif(debug, 'focusout');
      const strArr = list.map( (e) => "CS-" + e.id + "|");
      context.templateLevel.setAttribute('color-scheme', strArr.sort().join(''));
    };
    const onFocusLost = () => {
      if (colorSchemeAttrContent !== context.templateLevel.getAttribute('color-scheme')) context.applyNodeChangesToInput();
    }

    const toggleCsSelected = (option: Element, cs: ColorScheme2) => {
      const isSelected = !option.classList.contains('selected');
      if (isSelected) {
        option.classList.add('selected');
        U.ArrayAdd(currentCSList, cs);
      } else {
        option.classList.remove('selected');
        U.arrayRemoveAll(currentCSList, cs);
      }
      applyCsList(currentCSList);
    };

    for (let cs of ColorScheme2.getAll()) {
      const option = csTemplates.getCsOptionEntry(cs as ColorScheme2);
      if (currentCSList.indexOf(cs) >= 0) { option.classList.add('selected'); }
      $(option).on('click', (e) => toggleCsSelected(option, cs));
      container.append(option);
    }
    $ownCsSelect.on('focusout', onFocusLost).on('blur', ()=> {console.log('evt blur')}).on('focus', ()=> {console.log('evt blur')});
  }
  private updateGUI(se: StyleEditor, $html: JQuery<HTMLElement>, mp: ModelPiece, context: EditorContext): void {
    let tmp: any;/*
    ///////////////////////////////////////// setup dropdown with color scheme
    const optiontemplate = $html.find('.dropdown-item.template')[0];
    const optioncontainer = $html.find('.dropdown-menu')[0];
    for (let colorscheme of CSSEditor.defaultColorSchemes) {
      const $option: JQuery<HTMLElement> = $(U.cloneHtml(optiontemplate));
      CSSEditor.fillColorSchemeHtml($option, colorscheme);
      optioncontainer.appendChild($option[0]);
    }
    const $fillwithval1 = $html.find('[fillwithvalue1]');
    const $fillwithval2 = $html.find('[fillwithvalue2]');
    // NB: must be click, custom emulated select doesn't have 'change' or 'input' events.
    let selectedcolorscheme = CSSEditor.defaultColorSchemes[0]; // todo: find initial color scheme analizing html. save it as root template dataset.
    $html.find('.dropdown-item').on('click',(e: ClickEvent) => {
      const $option = $(e.currentTarget);
      const val1node = $option.find('[value1]')[0];
      const val2node = $option.find('[value2]')[0];
      $fillwithval1.html(val1node.innerHTML);
      $fillwithval2.html(val2node.innerHTML);
      selectedcolorscheme = null;
      for (let cs of CSSEditor.defaultColorSchemes) {
        console.log('hide detail:', cs.name !== val1node.innerHTML, ' === ', cs.name, val1node.innerHTML);
        if (cs.name !== val1node.innerHTML) continue;
        selectedcolorscheme = cs;
        break;
      }
      tmp = U.computeConditionalHides($html, { isCustomized: !selectedcolorscheme} as Dictionary, false);
      console.log('hide detail:', tmp);
    });*/

    /////// css editor
    // fill used classes

    let templateLevelRoot: Element = context.templateLevel;
    while (templateLevelRoot.parentElement) templateLevelRoot = templateLevelRoot.parentElement;
    this.fillSelectorSuggestionDatalist(templateLevelRoot);
    CSSEditor.setupCssRuleBlocks($html, context);
    ////// data presi, ora riempio la lista di cs ereditati


/*
    let sortedInheritanceListodes: Element[] = [...inheritingLine.keys()].sort(
      (e, e2) => { return ancestorLine.indexOf(e) - ancestorLine.indexOf(e2);
      });*/
    // ritorna il template di livello nodo + contenitore lista nomi dei color schemes
    const $cstemplates = $html.find('.cstemplates.template');
    const csTemplates = {} as any;
    csTemplates.csList = $cstemplates.find('.cslistreadonly')[0];
    csTemplates.csOption = $cstemplates.find('.csoption')[0];
    csTemplates.getCsOptionEntry = (cs: ColorScheme2): Element => {
      const template = U.cloneHtml(csTemplates.csOption);// todo: devi settargli-rimuovergli la classe selected (in questo preciso elemento) quando opportuno
      const $template = $(template);
      $template.find('.name').text(cs.name);
      const $colorContainer = $template.find('.colors');
      for (const color of cs.foreColors) { $colorContainer.append(CSSEditor.makeColorBlockReadonly(color)); }
      return template;
    }

    this.fillInheritedColorSchemeDropdown(se, $html, mp, context, csTemplates);
    this.fillOwnColorSchemeDropDown(se, $html, mp, context, csTemplates);
    const debug = true;
    if (debug) return;
    // adesso faccio il dropdown personal con multiselect editabile


    ////////////////////////////////////////////////// roba vecchia

    /*
    // colori attuali (con null = "custom" -> effettivamente colorato)
    const cssElement: HTMLStyleElement = CSSEditor.getCustomCssElement($templateLevelRoot, context, true);
    const inputColorScheme: ColorScheme = CSSEditor.getCurrentColorScheme(cssElement);
    const mappedColorScheme: ColorScheme = CSSEditor.mapColorSchemeToPredefined(inputColorScheme); // null if custom
    const $customOption: JQuery<HTMLElement> = $html.find('.dropdown.cscheme .dropdown-item[data-csname="custom"]');
    const isCustom: boolean = true;
    if (isCustom) {
      inputColorScheme.name = 'custom';
      CSSEditor.fillColorSchemeHtml($customOption, inputColorScheme);
    }
    const $selectedOption: JQuery<HTMLElement> = isCustom ? $customOption : $html.find('.dropdown.cscheme .dropdown-item[data-csname="' + mappedColorScheme.name + '"]');
    optioncontainer.innerHTML = $selectedOption[0].outerHTML;
    $selectedOption[0].classList.add('selected');
    /// add rule button start

    const $csseditor: JQuery<HTMLElement> = $html.find('.css_editor');
    // const $addselector: JQuery<HTMLElement> = $csseditor.find('.addselector');
    const $addcssProp: JQuery<HTMLElement> = $csseditor.find('.addcssprop');
    const ruletemplate: Element = $('.cssprop.template')[0];
    const addRuleHtml = (key: string, value: string): void => {
      const rulehtml = U.cloneHtml(ruletemplate);
      const $rulehtml = $(rulehtml);
      $rulehtml.find('.delcssprop').on('click', () => { U.remove(rulehtml); });
      const $rulekey: JQuery<HTMLInputElement> = $rulehtml.find('.cssprop') as JQuery<HTMLInputElement>;
      const $ruleval: JQuery<HTMLInputElement> = $rulehtml.find('.cssval') as JQuery<HTMLInputElement>;
      const onRuleChange = () => {
        context.templateLevel.setAttribute("style", context.templateLevel.getAttribute("style") + $rulekey[0].value + ':' + $ruleval[0].value + '; ');
        context.applyNodeChangesToInput();
      };
      $rulekey[0].value = key;
      $ruleval[0].value = value;
      $rulekey.on('change', onRuleChange);
      $ruleval.on('change', onRuleChange);
      ruletemplate.parentElement.append(rulehtml);
    };
    $addcssProp.on('click', (e: ClickEvent) => { addRuleHtml('', ''); });
    const actualInlineStyles: string[][] = U.getActualInlineStyles(context.templateLevel as HTMLElement);
    for (let pair of actualInlineStyles) { addRuleHtml(pair[0], pair[1]); }
  */

/*
    todo: actually flip this shit and just make css rule editor con il color picker come primo row obbligatorio.
    e il primo css rule editor è "this"
    e il secondo obbligatorio contiene la singola css rule obbligatoria/autogenerata con tutte le variabili.
      devo ripensarla quella rule obbligatoria e come collegarlo al dropwodn select con i colori
    un secondo dropdown che contiene una lista di N classi?
      a cui posso aggiungerne e incremento la size N del color picker
    e ogni selector ti dà in suggerimento autocompletamento gli id e le classi esistenti nel vertice.

      |dropdown|

    |.vertex| (colorato con primo colore)
    color picker .vertex
      altre rule .vertex
  |.Attribute| (colorato con secondo colore)
    color picker .Attribute
    altre rule .Attribute
    |.type| (colorato con terzo colore)
    color picker .type
    altre rule .type*/


    ///end
    // U.computeConditionalHides($html, { isCustomized: !selectedcolorscheme} as Dictionary, false);
  }
  private static setupCssRuleBlocks($html: JQuery<Element>, context: EditorContext): void {
    return;
    const $container = $html.find('.cssBlocksContainer');
    const container = $container[0];
    const $template = $container.find('.cssblock.template');
    // todo: dovrei aggiungere dal css tutte le variabili assegnate a colori o che iniziano con "color" o roba simile --colorPrimary...
    const targetEntryArray = ["this", ".Vertex", ".type", ".Feature", "input", "headings (rimappato a h1, h2, ...h6"];
    for (let target of targetEntryArray) {
      let rowhtml = CSSEditor.cloneTemplate($template, container);
      let $rowhtml = $(rowhtml);
      CSSEditor.setupCssRuleBlock($html, $rowhtml, context, context.templateLevel, target, undefined);
      // CSSEditor.setupColorRow($rowhtml, context, context.templateLevel, target, undefined, undefined);
    }

  }
  private static setupCssRuleBlock($root: JQuery<Element>, $cssBlock: JQuery<Element>, context: EditorContext, targetNode: Element, targetStr: string, targetStyle: CSSStyleSheet): void {
    const $colorPickerRow = $cssBlock.find('.colorPicker');/*
    const $container = $html.find('.csspropcontainer');
    const container = $container[0];
    const $template = $html.find('.template.cssprop');*/
    let title = $cssBlock.find(".title.selector")[0] as HTMLElement;
    title.innerText = targetStr;
    let style: HTMLStyleElement = CSSEditor.getCustomCssElement($(context.templateRoot), context, true);

    const cssParsed = CSS.toJSON( U.replaceAll(style.innerText, '#$##id$', ''));
    console.log("cssParsed", cssParsed);
    CSSEditor.setupColorRow($colorPickerRow, context, context.graphLevel, targetStr, undefined, undefined);
    CSSEditor.setupCssRows($root, $cssBlock, context, context.templateLevel, undefined, undefined);
  }
  private static cloneTemplate($template: JQuery<Element>, container: Element = null): Element{
    const template = U.cloneHtml($template[0]);
    template.classList.remove('template');
    if (container) container.append(template);
    return template; }

  private static setupCssRows($root: JQuery<Element>, $cssBlock: JQuery<Element>, context: EditorContext, targetNode: Element, selector: string, style: CSSStyleDeclaration): void {
    console.log("csspropcontainer", $root, $cssBlock);
    const $container = $cssBlock.find('.csspropcontainer');
    const container = $container[0];
    const $template = $root.find('.template.cssprop');
    const template = CSSEditor.cloneTemplate($template, container);
  }
  private static setupCssRow($html: JQuery<Element>, context: EditorContext, targetNode: Element, targetStr: string, targetStyle: CSSStyleSheet): void {

  }
  /*
  private static setupColorRows($html: JQuery<Element>, context: EditorContext): void {
    const $container = $html.find('.customColorsContainer'); nope, noty anymore
    const container = $container[0];
    const $template = $container.find('.template');
    const template = $template[0];


  }*/

  private static setupColorRow($html: JQuery<Element>, context: EditorContext, targetNode: Element, targetStr: string, targetStyle: CSSStyleDeclaration, cssentry: string): void {
    if (targetStr !== "this") { targetNode = null; }
    const $toColor = $html.find('.c') as JQuery<HTMLInputElement>;
    console.log("setupColorRow $html", $html);
    const $fontinput: JQuery<HTMLInputElement> = $html.find('.fontstyle .fc input[type="color"]') as JQuery<HTMLInputElement>;
    const $backinput: JQuery<HTMLInputElement> = $html.find('.backstyle .bc input[type="color"]') as JQuery<HTMLInputElement>;
    const $fonttransp: JQuery<HTMLInputElement> = $html.find('.fontstyle .fc .opacity') as JQuery<HTMLInputElement>;
    const $backtransp: JQuery<HTMLInputElement> = $html.find('.backstyle .bc .opacity') as JQuery<HTMLInputElement>;
    let fontColor: string = '';
    let backColor: string = '';
    let fontOpacity: number = 255;
    let backOpacity: number = 255;
    let updateFontColor = () => {
      // $.css('color') non funziona perchè setta RGB ignorando l'opacity
      $toColor.each( (i, e) => { e.style.color = fontColor + U.toHex(fontOpacity, 2); });
    };
    let updateBackColor = () => {
      $toColor.each( (i, e) => { e.style.backgroundColor = backColor + U.toHex(backOpacity, 2); });
    };

    $fontinput.on('input', (e: ChangeEvent) => {
      fontColor = $fontinput[0].value;
      updateFontColor();
    });
    $backinput.on('input', (e: ChangeEvent) => {
      backColor = $backinput[0].value;
      updateBackColor();
    });
    $fonttransp.on('input', (e: ChangeEvent) => {
      fontOpacity = Math.floor(255 * +$fonttransp[0].value);
      console.log('xopacity font:', fontOpacity, U.toHex(fontOpacity, 2), fontColor + U.toHex(fontOpacity, 2));
      updateFontColor();
    });
    $backtransp.on('input', (e: ChangeEvent) => {
      backOpacity = Math.floor(255 * +$backtransp[0].value);
      console.log('xopacity back:', backOpacity, U.toHex(backOpacity, 2), backColor + U.toHex(backOpacity, 2));
      updateBackColor();
    });
    let saveColors = (e: ChangeEvent) => {
      let fontfinal = fontColor + U.toHex(fontOpacity, 2), backfinal = backColor + U.toHex(backOpacity, 2);
      console.log("x fontfinal:", fontfinal, ' backfinal:', backfinal, 'opacities:', fontOpacity, backOpacity);
      if (targetNode) {
        (targetNode as HTMLElement).style.color = fontfinal;
        (targetNode as HTMLElement).style.backgroundColor = backfinal;
        context.applyNodeChangesToInput();
      }
      else {
        // todo: come setto la ccs variabile nello stylesheet?
        context.applyRootChangesToInput();
        // todo: come salvo la css var? basta fare applyRootChangesToInput() ?
      }
    };
    $fonttransp.on('change', saveColors);
    $backtransp.on('change', saveColors);
    $backinput.on('change', saveColors);
    $fontinput.on('change', saveColors);
    // setting current color
    // const oldParent = context.graphRoot.parentElement;
    // const graphHtml = se.propertyBar.model.graph.container;
    // graphHtml.append(context.graphRoot);
    const computedStyle: CSSStyleDeclaration = targetNode ? window.getComputedStyle(targetNode) : targetStyle; // todo get css rule from css-var in stylesheet, ma come??';
    // if (oldParent) oldParent.append(context.graphRoot); else graphHtml.removeChild(context.graphRoot);
    const fontColorObj = targetNode ? U.RGBAToHexObj(computedStyle.color, '#', '') : null; // todo: nodeComputer ritorna "rgb(x,y,z,w)", css parser potrebbe ritornare #hexcolor, variabili...-
    const backColorObj = U.RGBAToHexObj(computedStyle.backgroundColor, '#', '');
    fontColor = fontColorObj.rgbhex;
    fontOpacity = fontColorObj.a
    backColor = backColorObj.rgbhex;
    backOpacity = backColorObj.a
    $fontinput[0].value = fontColor;
    $backinput[0].value = backColor;
    $fonttransp[0].value = '' + fontOpacity / 255;
    $backtransp[0].value = '' + backOpacity / 255;
    updateFontColor();
    updateBackColor();
    console.log('aa set colors:', fontColorObj, backColorObj);
    console.log("aa set colors:", computedStyle.color, computedStyle.backgroundColor, context.templateLevel, context.graphLevel, $fontinput[0]);
  }
  private static staticInit(): void{
    const cssrules = $('#cssrules')[0];

  }
  private static generateCssVarFromColorScheme(cs: ColorScheme): string[] {
    const str: string[] = [ ('--colorSchemeName') + ':' + ('\'' + cs.name + '\'') ];
    for (let i = 0; i < cs.colors.length; i++) {
      str.push( ('--color' + (i)) + ':' + ('\'' + cs.colors[i] + '\'') );
    }
    return str;
  }

  private static getCustomCssElement($templateLevelRoot: JQuery<Element>, context: EditorContext, allowCreation: boolean = true): HTMLStyleElement {
    let $style: JQuery<HTMLStyleElement>
    // se c'è style esplicitamente legato a color scheme uso quello
    $style = $templateLevelRoot.find('style.colorScheme') as JQuery<HTMLStyleElement>;
    if ($style.length) return $style[0];
    // se non c'è, ma ce ne sono altri non legati, ne prendo uno style qualsiasi e lo faccio diventare lo style del color scheme
    $style = $templateLevelRoot.find('style') as JQuery<HTMLStyleElement>;
    if ($style.length) return $style[0];
    if (!allowCreation) return null;
    // altrimenti lo creo e lo associo.
    const style: HTMLStyleElement = U.makeCssSheet();
    if ($templateLevelRoot[0].firstElementChild) $templateLevelRoot[0].firstElementChild.append(style);
    // insertRule: mono-stringa selettore + blocco valori, indiceInserimento (-1 = append);
    // addRule: non standard, selettore e blocco valori separati, indiceInserimento (-1 = append);
    let cs: ColorScheme = CSSEditor.defaultColorScheme;
    CSSEditor.applyColorScheme(context, cs, $templateLevelRoot, style);
    return style;
  }

  public static getCurrentColorScheme(stylenode: HTMLStyleElement): ColorScheme {
    const oldParent = stylenode.parentElement;
    document.body.append(stylenode);
    const cssRules: CSSStyleRule[] = stylenode.sheet['cssRules'];
    const ruleindex = CSSEditor.getColorSchemeRuleIndex(stylenode);
    window['lastcss'] = stylenode;
    console.log('StyleNode', stylenode, 'cssRules:', cssRules, ', cssRules[' + ruleindex + ']', cssRules[ruleindex]);
    const block: CSSStyleRule = cssRules[ruleindex];
    console.log('stylemap?', block);
    const stylePropertyMap: any /*StylePropertyMap*/ = block['styleMap'];
    let ruleStartingWithColor: string[] = [];
    let colorSchemeName: string = '?';
    stylePropertyMap.forEach( (v: any/*CSSUnparsedValue*/, k: string) => {
      // console.log(k, v[0][0]);
      k = k.trim().toLowerCase();
      v = v[0][0].trim().toLowerCase();
      if (k.indexOf('--') !== 0) return;
      if (k.toLowerCase().indexOf('--color') === 0) ruleStartingWithColor.push(k + ':' + v);
      if (k.toLowerCase().indexOf('--colorSchemeName') === 0) colorSchemeName = v;
    });
    ruleStartingWithColor = ruleStartingWithColor.sort();
    const cs: ColorScheme = {name: colorSchemeName, colors: []};
    // prendo i colori in ordine alfabetico, non mi importa se non sono enumerate correttamente (--colorZ o buchi nei numeri)
    for (let line of ruleStartingWithColor) {
      const splitpos: number = line.indexOf(':');
      // const cssvarname: string = line.substring(0, splitpos).trim();
      const cssvarvalue: string = line.substring(splitpos + 1).trim();
      cs.colors.push(cssvarvalue);
    }
    oldParent.append(stylenode);
    return cs;
  }

  private static addcssrule(styleNode: HTMLStyleElement, selector: string, rules: string[],
                            $templateRoot: JQuery<Element>, context: EditorContext, index: number = -1): void{
    // const cssElem: HTMLStyleElement = CSSEditor.getCustomCssElement($templateRoot, context, false);
    const oldParent = styleNode.parentElement;
    document.body.append(styleNode);
    const rawRule: string = '' + selector + ' {\n' + rules.join(';\n   ') + '}\n\n';
    if (index < 0 || !index && (index !== 0)) index = styleNode.sheet['rules'].length;
    styleNode.sheet['insertRule'](rawRule, index);
    // cssElem.innerHTML += rawRule;
    // cssElem.innerHTML += '*{ border: 2px solid red; }';
    oldParent.append(styleNode);
    context.applyRootChangesToInput();
  }

  public static getColorSchemeRuleIndex(styleNode: HTMLStyleElement): number {
    const oldContainer = styleNode.parentElement;
    document.body.append(styleNode);
    U.pif(!styleNode || !styleNode.sheet || !styleNode.sheet['cssRules'], 'sheet.cssRules are null?',
      styleNode,
      styleNode && styleNode.sheet,
      styleNode && styleNode.sheet && styleNode.sheet['cssRules']);
    let ruleList: CSSStyleRule[] = styleNode.sheet['cssRules'] || styleNode.sheet['rules']; // sono alias.
    let i: number;
    for (i = 0; i < ruleList.length; i++) {
      if (ruleList[i].selectorText === '.VertexRoot #$##id$'){ i = -1; break;} // comments are ignored
    }
    oldContainer.append(styleNode);
    return i == ruleList.length ? -1 : i;
    // const stylePropertyMap: any /*StylePropertyMap*/ = ruleList[0]['styleMap'];
    // key-value for single ccs rule inside a selector
    // stylePropertyMap.forEach( (v: any/*CSSUnparsedValue*/, k: string) => { console.log(k, v[0][0]); } );
  }

  public static applyColorScheme(context: EditorContext, cs: ColorScheme, $templateRoot: JQuery<Element>, style: HTMLStyleElement): void {
    const sheet: StyleSheet = style.sheet;
    const colorSchemeRuleIndex: number = CSSEditor.getColorSchemeRuleIndex(style);
    if (colorSchemeRuleIndex >= 0) sheet['deleteRule'](colorSchemeRuleIndex); // problema: così quella regola css se viene estesa con altro oltre i colori lo perdi.
    CSSEditor.addcssrule(style, '.VertexRoot #$##id$', CSSEditor.generateCssVarFromColorScheme(cs), $templateRoot, context, 0);
  }

  private static mapColorSchemeToPredefined(inputColorScheme: ColorScheme): ColorScheme {
    for (const cs of CSSEditor.defaultColorSchemes) {
      if (CSSEditor.compareColorScheme(inputColorScheme, cs, true) === 0) return cs;
    }
    return null;
  }

  private static compareColorScheme(cs1: ColorScheme, cs2: ColorScheme, ignoreName: boolean = true): number {
    if (!ignoreName && cs1.name !== cs2.name) return cs1.name.localeCompare(cs2.name);
    if (cs1.colors.length !== cs2.colors.length) return cs1.colors.length - cs2.colors.length;
    for (let i = 0; i < cs1.colors.length; i++) {
      if (cs1.colors[i] !== cs2.colors[i]) return cs1.colors[i].localeCompare(cs2.colors[i]);
    }
    return 0;
  }
}
