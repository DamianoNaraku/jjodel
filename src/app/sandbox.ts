// var Parser = require('boreas/lib/parser');

function sandbox(){
  /*  crea un
  <style id="$##id$colorset">
    #Vertex_$##id$ variabili
  #Vertex_$##id$ rulelist1
  #Vertex_$##id$ rulelist2...
  per ogni stile.
    se mancante viene generato. variabili css ci sono sempre, anch'esse autogenerate.

    per determinare il color scheme leggo innerhtml del css aggiungendo quotemark ai css selectors e lo parso come json.
     poi analizzo le variabili e genero un color scheme e se generatedColorScheme is inside ColorSchemeArray allora cerco il match, sennò is custom.
     color scheme setta solo le variabili css.
     css editor edita tutto il css.
     html editor edita tutto.
     */
  let css: HTMLStyleElement;
  let ruleList: CSSStyleRule[] = css.sheet['cssRules'] || css.sheet['rules']; // sono alias.
  const stylePropertyMap: any /*StylePropertyMap*/ = ruleList[0]['styleMap'];
  stylePropertyMap.forEach( (v: any/*CSSUnparsedValue*/, k: string) => { console.log(k, v[0][0]); } );
}
