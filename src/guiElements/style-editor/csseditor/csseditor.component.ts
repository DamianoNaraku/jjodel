/*import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {StyleEditor} from '../style-editor.component';
import {IModel} from '../../../Model/iModel';
import {ModelPiece} from '../../../Model/modelPiece';
import {Dictionary} from '../../../common/util';

type colorScheme = { name: string, colors: string[]};
@Component({
  selector: 'app-csseditor',
  templateUrl: './csseditor.component.html',
  styleUrls: ['./csseditor.component.css']
})
export class CsseditorComponent implements OnInit {
  static maxID: number = 0;
  static all: Dictionary<number, CsseditorComponent> = {}
  public id: number;

  static getComponent(html: HTMLElement): CsseditorComponent{
    while (html) {
      const idstr: string = html.dataset.angularid;
      if (idstr) {
        let component: any = CsseditorComponent.all[+idstr];
        if (component instanceof CsseditorComponent) { return component; }
      }
      html = html.parentElement;
    }
    return null;
  }

  defaultColorSchemes: colorScheme[] = [
    { name: 'Color scheme 1', colors: ['#364f6b', '#3fc1c9', '#f5f5f5', '#fc5185']},
    { name: 'Color scheme 2', colors: ['#f9a828', '#ececeb', '#07617d', '#2e383f']},
    { name: 'Color scheme 3', colors: ['#fa4659', '#effe40', '#a33e83', '#2eb872']},
    { name: 'Color scheme 4', colors: ['#BE64FA', '#8459DE', '#5975DE', '#64ACFA']},
  ];
  @ViewChild('csseditorroot', {read: true, static: true}) csseditorroot: ElementRef;
  activeColorScheme: colorScheme;


  constructor() {
    this.id = CsseditorComponent.maxID++;
    CsseditorComponent.all[this.id] = this;
    // ne vengono creati 2 e rimangono 2: uno per mm e uno per m
  }

  ngOnInit() {
    if (!window['colorschemes']) window['colorschemes'] = []
    window['colorschemes'].push(this);
  }

  changeColorScheme($event: MouseEvent){

  }

  setDefaultColorScheme($event: MouseEvent){

  }

}*/
