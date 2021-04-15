import { Component, OnInit } from '@angular/core';
import {U, EdgeStyle, ColorSchemeComponent} from '../../../common/Joiner';
/*
@Component({
  selector: 'app-edge-editor',
  templateUrl: './edge-editor.component.html',
  styleUrls: ['./edge-editor.component.css']
})*/
export class EdgeEditorComponent implements OnInit {
  public static $html: JQuery<Element>;
  temporaryInvisible: boolean;
  svgPaths: {letter: string, text: string, additionalX1?: boolean, additionalY1?: boolean, additionalX2?: boolean, additionalY2?: boolean}[] = [];
  styles: EdgeStyle[] = [];

  constructor() { }

  ngOnInit() { // singleton
    EdgeEditorComponent.$html = $('app-edge-editor');
    this.svgPaths = [
      {letter: 'C', text: 'Bézier curve', additionalX1: true, additionalY1: true, additionalX2: true, additionalY2: true}
    ]
  }

  hide(): void {
    EdgeEditorComponent.$html.hide();
    // this.display = 'none';
    console.log("cs.hide()"); }
  /*
    show(): void {
      this.display = 'flex'; }*/

  static show(): void {
    // NB: il codice eseguito fuori da questo componente, o dentro componenti che NON hanno @ViewChild non viene osservato per cambiamenti,
    // se modifico le variabili esternamente la grafica non viene aggiornata.
    // quindi modifico direttamente html invece delle variabili
    console.log("cs.show()");
    EdgeEditorComponent.$html.show();
  }


  public invisible(): void {
    this.temporaryInvisible = true;
  }
  public visible(): void {
    this.temporaryInvisible = false;
  }
}
