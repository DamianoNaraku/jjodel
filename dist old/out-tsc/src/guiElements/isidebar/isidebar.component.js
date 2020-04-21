import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { U, ModelPiece, Status, IClass, EEnum } from '../../common/Joiner';
let IsidebarComponent = class IsidebarComponent {
    constructor() { }
    ngOnInit() {
    }
};
IsidebarComponent = tslib_1.__decorate([
    Component({
        selector: 'app-isidebar',
        templateUrl: './isidebar.component.html',
        styleUrls: ['./isidebar.component.css']
    })
], IsidebarComponent);
export { IsidebarComponent };
export class ISidebar {
    // htmls: Dictionary<string /*ModelPiece.fullname*/, HTMLElement | SVGGElement> = null;
    // nodeContainer: HTMLDivElement = null;
    constructor(model, container) {
        this.container = null;
        this.packageContainer = null;
        this.classContainer = null;
        this.model = model;
        // this.mm = (model instanceof MetaModel);
        if (Status.status.mmm === this.model) {
            Status.status.mm.sidebar = this;
        }
        else {
            Status.status.m.sidebar = this;
        }
        this.container = container;
        this.packageContainer = document.createElement('div');
        this.packageContainer.classList.add('sidebarPackageContainer');
        this.classContainer = document.createElement('div');
        this.classContainer.classList.add('sidebarClassContainer');
        this.container.appendChild(this.packageContainer);
        this.container.appendChild(this.classContainer);
        this.updateAll();
        // this.htmls = this.loadDefaultHtmls();
    }
    /*
      loadDefaultHtmls(): Dictionary<string, HTMLElement | SVGGElement> /*
        console.log('refresh left iSidebar');
        // bug: todo: not refreshing quando cambio il nome di un m2class. però i classSelector si aggiornano.
        this.clear();
        let arr: IClassifier[];
        let i;
        // this.htmls = {};
        /*if (false && false) {
          arr = this.model.childrens;
          for (i = 0; i < arr.length; i++) { this.htmls[arr[i].fullname()] = IPackage.defaultSidebarHtml(); } } * /
        // arr = this.model.getAllClasses();
        // if (this.model.isM3()) Array.prototype.push.apply(arr, this.model.getAllEnums());
        // for (i = 0; i < arr.length; i++) { this.htmls[arr[i].fullname()] = arr[i].getSidebarHtml();  }
        this.updateAll();
        return this.htmls; */
    clear() {
        U.clear(this.packageContainer);
        U.clear(this.classContainer);
    }
    updateAll() {
        this.clear();
        let i;
        const cla = this.model.getAllClasses();
        const enu = this.model.isM2() ? [] : this.model.getAllEnums();
        for (i = 0; i < cla.length; i++) {
            this.updateNode(cla[i], this.classContainer);
        }
        for (i = 0; i < enu.length; i++) {
            this.updateNode(enu[i], this.classContainer);
        }
    }
    addEventListeners(html) {
        const $html = $(html);
        $html.off('click.sidebarNode').on('click.sidebarNode', (e) => {
            Status.status.getActiveModel().sidebar.sidebarNodeClick(e);
        });
    }
    sidebarNodeClick(e) {
        console.log('sidebarNodeClick()', Status.status.getActiveModel() === Status.status.mm, Status.status.getActiveModel());
        if (Status.status.getActiveModel().isMM()) {
            this.sidebarNodeClick0(e);
        }
        else {
            this.sidebarNodeClick0(e);
        }
    }
    sidebarNodeClick0(e) {
        console.log('sidebarNodeClick()');
        let html = e.currentTarget;
        while (!html.dataset.modelPieceID) {
            html = html.parentElement;
        }
        const metaParent = ModelPiece.getLogic(html);
        U.pe(!metaParent, 'the id does not match any class or package', e);
        const modelOfSidebar = metaParent.getModelRoot();
        const modelOfGraph = Status.status.getActiveModel();
        const graph = modelOfGraph.graph; /*m2*/
        U.pe(!graph, 'invalid graph of model:', modelOfGraph);
        const pkg = modelOfGraph.getDefaultPackage();
        if (metaParent instanceof IClass /*m3*/) {
            pkg.addEmptyClass(metaParent);
        }
        else if (metaParent instanceof EEnum /*m3*/) {
            pkg.addEmptyEnum();
        }
        else {
            U.pe(true, 'unxpected class type of metaparent:', metaParent);
        }
        console.log('addSidebarNodeClick done');
    }
    updateNode(piece, containerr) {
        const html = U.replaceVars(piece, piece.getSidebarHtml(), true);
        piece.linkToLogic(html);
        this.addEventListeners(html);
        containerr.appendChild(html);
    }
}
//# sourceMappingURL=isidebar.component.js.map