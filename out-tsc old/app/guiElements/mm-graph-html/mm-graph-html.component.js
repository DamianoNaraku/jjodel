var MmGraphHtmlComponent_1;
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Status } from '../../common/Joiner';
let MmGraphHtmlComponent = MmGraphHtmlComponent_1 = class MmGraphHtmlComponent {
    constructor() { }
    static graphMain() {
        if (Status.status === null) {
            setTimeout(MmGraphHtmlComponent_1.graphMain, 1000);
            return;
        }
        // real main can start
    }
    ngOnInit() {
        MmGraphHtmlComponent_1.graphMain();
    }
};
MmGraphHtmlComponent = MmGraphHtmlComponent_1 = tslib_1.__decorate([
    Component({
        selector: 'app-mm-graph-html',
        templateUrl: './mm-graph-html.component.html',
        styleUrls: ['./mm-graph-html.component.css']
    })
], MmGraphHtmlComponent);
export { MmGraphHtmlComponent };
//# sourceMappingURL=mm-graph-html.component.js.map