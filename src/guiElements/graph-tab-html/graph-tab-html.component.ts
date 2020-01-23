import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
// import {MatTab, MatTabChangeEvent, MatTabGroup} from '@angular/material';
import {U, IModel, Status} from '../../common/Joiner';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-graph-tab-html',
  templateUrl: './graph-tab-html.component.html',
  styleUrls: ['./graph-tab-html.component.css']
})
export class GraphTabHtmlComponent implements OnInit {
  // static matTabModel: MatTabGroup = null;
 // private static timesCanFailDuringInit = 1;
  //private selectedTab = 0;
  // @ViewChild('tabs') tabGroup: MatTabGroup;
  constructor() {
  }

  ngOnInit() {
    // this.selectModelTabOnInit(0);
  }
  /*
    private selectModelTabOnInit(tentativi: number = 0) {
      if (tentativi++ >= 10) { U.pe(true, 'failed to wait for Status initialization'); }
      if (Status.status === null) {
        setTimeout(() => this.selectModelTabOnInit(tentativi), 100);
        return;
      }
      U.pe(!this.tabGroup, 'init fail on mat-tab');
      this.tabGroup.selectedIndex = 1;
      Status.status.modelMatTab = this.tabGroup;
      GraphTabHtmlComponent.matTabModel = this.tabGroup;
      // todo: qua devo ottimizzare un bordello e togliere il "middle main", il campo statico è l'unica cosa che funziona, non usare status.
    }
    ngAfterViewInit() {
      console.log('afterViewInit => ', this.tabGroup.selectedIndex); }* /
  doChangeTab() {
    this.selectedTab += 1;
    if (this.selectedTab >= 2) { this.selectedTab = 0; }
  }
  onTabChange(e: MatTabChangeEvent) {
    const model: IModel = Status.status.getActiveModel();
    if (!model && GraphTabHtmlComponent.timesCanFailDuringInit-- > 0) { return; }
    let i;
    // for (i = 0; i < model.childrens.length; i++) { model.childrens[i].refreshGUI(); }
    const classes = model.getAllClasses();
    for (i = 0; i < classes.length; i++) { classes[i].refreshGUI(); }
  }*/

}
