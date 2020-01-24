(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["styles"],{

/***/ "./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src/index.js?!./src/styles.css":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src??embedded!./src/styles.css ***!
  \*****************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, "/*@import '../src/themes/squaredTabs.css'; /* You can add global styles to this file, and also import other style files */\r\n::-webkit-scrollbar {\r\n  background-color: rgba(00, 132, 255, 0.1);\r\n  /* background-color: var(--mainBorderColor); */\r\n  width: 10px;  /* Remove scrollbar space */\r\n  /* background: transparent;  /* Optional: just make scrollbar invisible */\r\n}\r\n/* Optional: show position indicator in red */\r\n/* resizable border */\r\n/* example-specific */\r\n.testresizablecontent {\r\n  background-color: blue;\r\n}\r\n.resizableBorder.left { border-left: 5px solid green; }\r\n.resizableBorder.right { border-right: 5px solid green; }\r\n.resizableBorder.top { border-top: 5px solid red; }\r\n.resizableBorder.bottom { border-bottom: 5px solid red; }\r\n.template{ display: none !important; }\r\n/* real css */\r\n.resizableBorderContainer {\r\n  background-color: black;\r\n  display: -webkit-box;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n          flex-flow: column;\r\n}\r\n.resizableStrip {\r\n  min-width: 100%;\r\n  height: -webkit-fit-content;\r\n  height: -moz-fit-content;\r\n  height: fit-content;\r\n  display: -webkit-box;\r\n  display: flex;\r\n}\r\n.resizableStrip.center{\r\n  -webkit-box-flex: 1;\r\n          flex-grow: 1;\r\n}\r\n.resizableBorder.side.top, .resizableBorder.side.bottom {\r\n  flex-basis: 0;\r\n  -webkit-box-flex: 1;\r\n          flex-grow: 1;\r\n  cursor: n-resize;\r\n}\r\n.resizableBorder.side.left, .resizableBorder.side.right {\r\n  width: -webkit-fit-content;\r\n  width: -moz-fit-content;\r\n  width: fit-content;\r\n  height: auto;\r\n  cursor: w-resize;\r\n}\r\n.resizableBorder.top.left { cursor: nw-resize; }\r\n.resizableBorder.top.right { cursor: ne-resize; }\r\n.resizableBorder.bottom.left { cursor: sw-resize; }\r\n.resizableBorder.bottom.right { cursor: se-resize; }\r\n/* others */\r\nhtml{\r\n  overflow:hidden;\r\n}\r\nbody{\r\n  min-width: 100vw;\r\n  min-height: 100vh;\r\n  padding: 0px;\r\n  margin: 0px;\r\n  box-sizing: border-box;\r\n  display: -webkit-box;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n          flex-flow: column;\r\n  flex-wrap: wrap;\r\n\r\n  color: #b2b2ba;\r\n  font-family: Helvetica, OpenSans, sans-serif;\r\n  font-size: 11px;\r\n  font-weight: 600;\r\n  line-height: 1.4;\r\n}\r\napp-graph-tab-html{\r\n  -webkit-box-flex: 1;\r\n          flex-grow: 1;\r\n  position: relative;\r\n  display: -webkit-box;\r\n  display: flex;\r\n}\r\n#MM_INPUT{\r\n  display: none;\r\n}\r\n/* horizontal & vertical filler */\r\n.verticalFiller, .horizontalFiller, .horizontalChild, .verticalChild{\r\n  min-width: 0;\r\n  flex-basis: 0;\r\n  -webkit-box-flex: 1;\r\n          flex-grow: 1;\r\n  overflow: auto;\r\n}\r\n.verticalFillingContainer, .verticalContainer{\r\n  height: 100%;\r\n  display: -webkit-box;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n          flex-flow: column;\r\n}\r\nh1, h2, h3, h4, h5, h6{\r\n  text-align: center;\r\n}\r\nbutton.duplicate:not(.btn), button.delete:not(.btn), button.remove:not(.btn), button.copy:not(.btn), button.paste:not(.btn), button.edit:not(.btn){\r\n  border-radius: 50%;\r\n  border: none;\r\n  background-size: cover;\r\n  background-color: black;\r\n}\r\nbutton.delete:not(.btn), button.remove:not(.btn) { background-image: url('delete.png'); }\r\nbutton.duplicate:not(.btn), button.copy:not(.btn) { background-image: url('duplicate.png'); }\r\nbutton.edit:not(.btn) { background-image: url('edit.png'); }\r\n.horizontalFillingContainer, .horizontalContainer {\r\n  display: -webkit-box;\r\n  display: flex;\r\n  -webkit-box-orient: horizontal;\r\n  -webkit-box-direction: normal;\r\n          flex-flow: row;\r\n}\r\n.editorShell {\r\n  position: relative;\r\n}\r\n.viewpointShell{\r\n  padding: 0;\r\n}\r\n.viewpointShell * {\r\n  color: #FFFFFF;\r\n  text-shadow: 2px 2px 3px #4074b5, 2px -2px 3px #4074b5, -2px 2px 3px #4074b5, -2px -2px 3px #4074b5, 2px 0px 3px #4074b5, 0px 2px 3px #4074b5, -2px 0px 3px #4074b5, 0px -2px 3px #4074b5;\r\n  text-shadow: 2px 2px 3px #000000, 2px -2px 3px #000000, -2px 2px 3px #000000, -2px -2px 3px #000000, 2px 0px 3px #000000, 0px 2px 3px #000000, -2px 0px 3px #000000, 0px -2px 3px #000000;\r\n  text-shadow: 1px 1px 0px #777777, 1px -1px 0px #777777, -1px 1px 0px #777777, -1px -1px 0px #777777, 1px 0px 0px #777777, 0px 1px 0px #777777, -1px 0px 0px #777777, 0px -1px 0px #777777\r\n}\r\n.viewpointShell h6 {\r\n  color: #FFFFFF;\r\n  /*text-shadow: 2px 2px 3px #4074b5, 2px -2px 3px #4074b5, -2px 2px 3px #4074b5, -2px -2px 3px #4074b5, 2px 0px 3px #4074b5, 0px 2px 3px #4074b5, -2px 0px 3px #4074b5, 0px -2px 3px #4074b5;*/\r\n  text-shadow: 1px 1px 1.3px #777777, 1px -1px 1.3px #777777, -1px 1px 1.3px #777777, -1px -1px 1.3px #777777, 1px 0px 1.3px #777777, 0px 1px 1.3px #777777, -1px 0px 1.3px #777777, 0px -1px 1.3px #777777;\r\n}\r\n.viewpointShell input{\r\n  margin-top: auto;\r\n  margin-bottom: auto;\r\n}\r\n/*others*/\r\n::-webkit-scrollbar-thumb {\r\n  background: #0084ff;\r\n  border: 2px solid darkblue;\r\n  border-radius: 5px;\r\n}\r\n.mainRow{\r\n  -webkit-box-flex: 1;\r\n          flex-grow: 1;\r\n}\r\n.mconsole, .mmconsole{\r\n  border-top: var(--mainBorder);\r\n  background-color: var(--mainBackgroundColor);\r\n  overflow-y: auto;\r\n  -webkit-box-flex: 0;\r\n          flex-grow: 0;\r\n  /*position: fixed;\r\n  bottom: 0;*/\r\n  height: 100%;\r\n  width: 100%;}\r\n.todo{\r\n  background-color: darkred !important;\r\n  cursor: not-allowed !important;\r\n}\r\n.todo>*, .todo *{\r\n  cursor: not-allowed !important;\r\n}\r\n.Vertex select{\r\n  -moz-text-align-last: end;\r\n       text-align-last: end;\r\n}\r\n.alertcontainer{\r\n  position: fixed;\r\n  display: -webkit-box;\r\n  display: flex;\r\n  top: 0;\r\n  height: 200%;\r\n  width: 100%;\r\n  max-height: 100vh;\r\n  overflow: hidden;\r\n  left: 0;\r\n  z-index: 100000;\r\n  pointer-events: none;\r\n  flex-wrap: wrap;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n          flex-flow: column;\r\n}\r\n.alertcontainer > * {\r\n  pointer-events: all; }\r\n.alertshell{\r\n  margin:auto;\r\n  padding-left: 30px;\r\n  padding-right: 30px;\r\n}\r\n.alert{\r\n  margin-bottom: 5px;\r\n}\r\n.UtabContainer{\r\n  -webkit-box-flex: 1;\r\n          flex-grow: 1;\r\n  flex-basis: 0;\r\n  overflow: auto;\r\n  display: -webkit-box;\r\n  display: flex;\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n          flex-flow: column;\r\n}\r\n.UtabContentContainer{\r\n  -webkit-box-flex: 1;\r\n          flex-grow: 1;\r\n  flex-basis: 0;\r\n  overflow: auto;\r\n}\r\n.UtabContent{\r\n  position: relative;\r\n  height: 100%;\r\n  overflow-y: auto;\r\n  overflow-x: auto;\r\n  padding: 17px;\r\n  padding-right: calc(17px - 10px); /*for scrollbar ?*/\r\n  -webkit-box-flex: 1;\r\n          flex-grow: 1;\r\n}\r\n.UtabContent.main{\r\n  padding:0;\r\n}\r\n.UtabHeader{\r\n  padding-top: 10px;\r\n  padding-bottom: 10px;\r\n  margin: 6px;\r\n  margin-left: 0;\r\n  /*\r\n  border: var(--mainBorder);\r\n  */\r\n  background-color: var(--mainBackgroundColor);\r\n  -webkit-box-orient: vertical;\r\n  -webkit-box-direction: normal;\r\n          flex-flow: column;\r\n  display: -webkit-box;\r\n  display: flex;\r\n  -webkit-box-flex: 1;\r\n          flex-grow: 1;\r\n  flex-basis: 0;\r\n  text-align: center;\r\n}\r\n.UtabHeader:last-of-type{ margin-right: 0; }\r\n.UtabHeader[selected=\"true\"]{\r\n  font-weight: bold;\r\n  background-color: var(--mainBorderColor);\r\n}\r\n.UtabHeaderContainer{\r\n  background-color: var(--mainBorderColor);\r\n  padding: 0;\r\n  margin: 0;\r\n  display: -webkit-box;\r\n  display: flex;}\r\n/* for squared */\r\n/* for squared end*/\r\n/* glowing tab headers* /\r\n.UtabHeader {\r\n  border: none !important;\r\n  margin: 2px !important;\r\n  margin-top: 4px !important;\r\n  margin-bottom: 4px !important;\r\n  box-shadow: 2px 2px 3px #506894, 2px -2px 3px #506894, -2px 2px 3px #506894, -2px -2px 3px #506894, 2px 0px 3px #506894, 0px 2px 3px #506894, -2px 0px 3px #506894, 0px -2px 3px #506894;\r\n  box-shadow: 2px 2px 3px #606373, 2px -2px 3px #606373, -2px 2px 3px #606373, -2px -2px 3px #606373, 2px 0px 3px #606373, 0px 2px 3px #606373, -2px 0px 3px #606373, 0px -2px 3px #606373;\r\n}\r\n.UtabHeader[selected=\"true\"] {\r\n  box-shadow: 2px 2px 3px #606373, 2px -2px 3px #606373, -2px 2px 3px #606373, -2px -2px 3px #606373, 2px 0px 3px #606373, 0px 2px 3px #606373, -2px 0px 3px #606373, 0px -2px 3px #606373;\r\n  box-shadow: 2px 2px 3px #506894, 2px -2px 3px #506894, -2px 2px 3px #506894, -2px -2px 3px #506894, 2px 0px 3px #506894, 0px 2px 3px #506894, -2px 0px 3px #506894, 0px -2px 3px #506894;\r\n  box-shadow: none;\r\n}\r\n/* glowing tab headers end*/\r\n.sidebarShell:first-child {\r\n  padding-top: 15px;\r\n  padding-left: 10px;\r\n}\r\n.sidebarShell {\r\n  padding: 0; /*required for U.resizingBorders*/\r\n}\r\n/****/\r\n\r\n/*# sourceMappingURL=data:application/json;base64,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Q0UsaUJBQWlCO0VBQ2pCLHdDQUF3QztBQUMxQztBQUNBO0VBQ0Usd0NBQXdDO0VBQ3hDLFVBQVU7RUFDVixTQUFTO0VBQ1Qsb0JBQWE7RUFBYixhQUFhLENBQUM7QUFDaEIsZ0JBQWdCO0FBQ2hCLG1CQUFtQjtBQUNuQjs7Ozs7Ozs7Ozs7Ozs7MkJBYzJCO0FBQzNCO0VBQ0UsaUJBQWlCO0VBQ2pCLGtCQUFrQjtBQUNwQjtBQUNBO0VBQ0UsVUFBVSxFQUFFLGlDQUFpQztBQUMvQztBQUlBLEtBQUsiLCJmaWxlIjoic3JjL3N0eWxlcy5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKkBpbXBvcnQgJy4uL3NyYy90aGVtZXMvc3F1YXJlZFRhYnMuY3NzJzsgLyogWW91IGNhbiBhZGQgZ2xvYmFsIHN0eWxlcyB0byB0aGlzIGZpbGUsIGFuZCBhbHNvIGltcG9ydCBvdGhlciBzdHlsZSBmaWxlcyAqL1xyXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAwLCAxMzIsIDI1NSwgMC4xKTtcclxuICAvKiBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluQm9yZGVyQ29sb3IpOyAqL1xyXG4gIHdpZHRoOiAxMHB4OyAgLyogUmVtb3ZlIHNjcm9sbGJhciBzcGFjZSAqL1xyXG4gIC8qIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyAgLyogT3B0aW9uYWw6IGp1c3QgbWFrZSBzY3JvbGxiYXIgaW52aXNpYmxlICovXHJcbn1cclxuLyogT3B0aW9uYWw6IHNob3cgcG9zaXRpb24gaW5kaWNhdG9yIGluIHJlZCAqL1xyXG4vKiByZXNpemFibGUgYm9yZGVyICovXHJcbi8qIGV4YW1wbGUtc3BlY2lmaWMgKi9cclxuLnRlc3RyZXNpemFibGVjb250ZW50IHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibHVlO1xyXG59XHJcbi5yZXNpemFibGVCb3JkZXIubGVmdCB7IGJvcmRlci1sZWZ0OiA1cHggc29saWQgZ3JlZW47IH1cclxuLnJlc2l6YWJsZUJvcmRlci5yaWdodCB7IGJvcmRlci1yaWdodDogNXB4IHNvbGlkIGdyZWVuOyB9XHJcbi5yZXNpemFibGVCb3JkZXIudG9wIHsgYm9yZGVyLXRvcDogNXB4IHNvbGlkIHJlZDsgfVxyXG4ucmVzaXphYmxlQm9yZGVyLmJvdHRvbSB7IGJvcmRlci1ib3R0b206IDVweCBzb2xpZCByZWQ7IH1cclxuLnRlbXBsYXRleyBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7IH1cclxuLyogcmVhbCBjc3MgKi9cclxuLnJlc2l6YWJsZUJvcmRlckNvbnRhaW5lciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWZsb3c6IGNvbHVtbjtcclxufVxyXG5cclxuLnJlc2l6YWJsZVN0cmlwIHtcclxuICBtaW4td2lkdGg6IDEwMCU7XHJcbiAgaGVpZ2h0OiBmaXQtY29udGVudDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG59XHJcbi5yZXNpemFibGVTdHJpcC5jZW50ZXJ7XHJcbiAgZmxleC1ncm93OiAxO1xyXG59XHJcblxyXG5cclxuLnJlc2l6YWJsZUJvcmRlci5zaWRlLnRvcCwgLnJlc2l6YWJsZUJvcmRlci5zaWRlLmJvdHRvbSB7XHJcbiAgZmxleC1iYXNpczogMDtcclxuICBmbGV4LWdyb3c6IDE7XHJcbiAgY3Vyc29yOiBuLXJlc2l6ZTtcclxufVxyXG5cclxuLnJlc2l6YWJsZUJvcmRlci5zaWRlLmxlZnQsIC5yZXNpemFibGVCb3JkZXIuc2lkZS5yaWdodCB7XHJcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xyXG4gIGhlaWdodDogYXV0bztcclxuICBjdXJzb3I6IHctcmVzaXplO1xyXG59XHJcblxyXG4ucmVzaXphYmxlQm9yZGVyLnRvcC5sZWZ0IHsgY3Vyc29yOiBudy1yZXNpemU7IH1cclxuLnJlc2l6YWJsZUJvcmRlci50b3AucmlnaHQgeyBjdXJzb3I6IG5lLXJlc2l6ZTsgfVxyXG4ucmVzaXphYmxlQm9yZGVyLmJvdHRvbS5sZWZ0IHsgY3Vyc29yOiBzdy1yZXNpemU7IH1cclxuLnJlc2l6YWJsZUJvcmRlci5ib3R0b20ucmlnaHQgeyBjdXJzb3I6IHNlLXJlc2l6ZTsgfVxyXG4vKiBvdGhlcnMgKi9cclxuaHRtbHtcclxuICBvdmVyZmxvdzpoaWRkZW47XHJcbn1cclxuXHJcbmJvZHl7XHJcbiAgbWluLXdpZHRoOiAxMDB2dztcclxuICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICBwYWRkaW5nOiAwcHg7XHJcbiAgbWFyZ2luOiAwcHg7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZmxvdzogY29sdW1uO1xyXG4gIGZsZXgtd3JhcDogd3JhcDtcclxuXHJcbiAgY29sb3I6ICNiMmIyYmE7XHJcbiAgZm9udC1mYW1pbHk6IEhlbHZldGljYSwgT3BlblNhbnMsIHNhbnMtc2VyaWY7XHJcbiAgZm9udC1zaXplOiAxMXB4O1xyXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgbGluZS1oZWlnaHQ6IDEuNDtcclxufVxyXG5hcHAtZ3JhcGgtdGFiLWh0bWx7XHJcbiAgZmxleC1ncm93OiAxO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG59XHJcbiNNTV9JTlBVVHtcclxuICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4vKiBob3Jpem9udGFsICYgdmVydGljYWwgZmlsbGVyICovXHJcbi52ZXJ0aWNhbEZpbGxlciwgLmhvcml6b250YWxGaWxsZXIsIC5ob3Jpem9udGFsQ2hpbGQsIC52ZXJ0aWNhbENoaWxke1xyXG4gIG1pbi13aWR0aDogMDtcclxuICBmbGV4LWJhc2lzOiAwO1xyXG4gIGZsZXgtZ3JvdzogMTtcclxuICBvdmVyZmxvdzogYXV0bztcclxufVxyXG5cclxuLnZlcnRpY2FsRmlsbGluZ0NvbnRhaW5lciwgLnZlcnRpY2FsQ29udGFpbmVye1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZmxvdzogY29sdW1uO1xyXG59XHJcbmgxLCBoMiwgaDMsIGg0LCBoNSwgaDZ7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcbmJ1dHRvbi5kdXBsaWNhdGU6bm90KC5idG4pLCBidXR0b24uZGVsZXRlOm5vdCguYnRuKSwgYnV0dG9uLnJlbW92ZTpub3QoLmJ0biksIGJ1dHRvbi5jb3B5Om5vdCguYnRuKSwgYnV0dG9uLnBhc3RlOm5vdCguYnRuKSwgYnV0dG9uLmVkaXQ6bm90KC5idG4pe1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxufVxyXG5idXR0b24uZGVsZXRlOm5vdCguYnRuKSwgYnV0dG9uLnJlbW92ZTpub3QoLmJ0bikgeyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi4vaW1nL2JsYWNrL2RlbGV0ZS5wbmcpOyB9XHJcbmJ1dHRvbi5kdXBsaWNhdGU6bm90KC5idG4pLCBidXR0b24uY29weTpub3QoLmJ0bikgeyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi4vaW1nL2JsYWNrL2R1cGxpY2F0ZS5wbmcpOyB9XHJcbmJ1dHRvbi5lZGl0Om5vdCguYnRuKSB7IGJhY2tncm91bmQtaW1hZ2U6IHVybCguLi9pbWcvYmxhY2svZWRpdC5wbmcpOyB9XHJcbi5ob3Jpem9udGFsRmlsbGluZ0NvbnRhaW5lciwgLmhvcml6b250YWxDb250YWluZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1mbG93OiByb3c7XHJcbn1cclxuLmVkaXRvclNoZWxsIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbn1cclxuLnZpZXdwb2ludFNoZWxse1xyXG4gIHBhZGRpbmc6IDA7XHJcbn1cclxuLnZpZXdwb2ludFNoZWxsICoge1xyXG4gIGNvbG9yOiAjRkZGRkZGO1xyXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDNweCAjNDA3NGI1LCAycHggLTJweCAzcHggIzQwNzRiNSwgLTJweCAycHggM3B4ICM0MDc0YjUsIC0ycHggLTJweCAzcHggIzQwNzRiNSwgMnB4IDBweCAzcHggIzQwNzRiNSwgMHB4IDJweCAzcHggIzQwNzRiNSwgLTJweCAwcHggM3B4ICM0MDc0YjUsIDBweCAtMnB4IDNweCAjNDA3NGI1O1xyXG4gIHRleHQtc2hhZG93OiAycHggMnB4IDNweCAjMDAwMDAwLCAycHggLTJweCAzcHggIzAwMDAwMCwgLTJweCAycHggM3B4ICMwMDAwMDAsIC0ycHggLTJweCAzcHggIzAwMDAwMCwgMnB4IDBweCAzcHggIzAwMDAwMCwgMHB4IDJweCAzcHggIzAwMDAwMCwgLTJweCAwcHggM3B4ICMwMDAwMDAsIDBweCAtMnB4IDNweCAjMDAwMDAwO1xyXG4gIHRleHQtc2hhZG93OiAxcHggMXB4IDBweCAjNzc3Nzc3LCAxcHggLTFweCAwcHggIzc3Nzc3NywgLTFweCAxcHggMHB4ICM3Nzc3NzcsIC0xcHggLTFweCAwcHggIzc3Nzc3NywgMXB4IDBweCAwcHggIzc3Nzc3NywgMHB4IDFweCAwcHggIzc3Nzc3NywgLTFweCAwcHggMHB4ICM3Nzc3NzcsIDBweCAtMXB4IDBweCAjNzc3Nzc3XHJcbn1cclxuLnZpZXdwb2ludFNoZWxsIGg2IHtcclxuICBjb2xvcjogI0ZGRkZGRjtcclxuICAvKnRleHQtc2hhZG93OiAycHggMnB4IDNweCAjNDA3NGI1LCAycHggLTJweCAzcHggIzQwNzRiNSwgLTJweCAycHggM3B4ICM0MDc0YjUsIC0ycHggLTJweCAzcHggIzQwNzRiNSwgMnB4IDBweCAzcHggIzQwNzRiNSwgMHB4IDJweCAzcHggIzQwNzRiNSwgLTJweCAwcHggM3B4ICM0MDc0YjUsIDBweCAtMnB4IDNweCAjNDA3NGI1OyovXHJcbiAgdGV4dC1zaGFkb3c6IDFweCAxcHggMS4zcHggIzc3Nzc3NywgMXB4IC0xcHggMS4zcHggIzc3Nzc3NywgLTFweCAxcHggMS4zcHggIzc3Nzc3NywgLTFweCAtMXB4IDEuM3B4ICM3Nzc3NzcsIDFweCAwcHggMS4zcHggIzc3Nzc3NywgMHB4IDFweCAxLjNweCAjNzc3Nzc3LCAtMXB4IDBweCAxLjNweCAjNzc3Nzc3LCAwcHggLTFweCAxLjNweCAjNzc3Nzc3O1xyXG59XHJcbi52aWV3cG9pbnRTaGVsbCBpbnB1dHtcclxuICBtYXJnaW4tdG9wOiBhdXRvO1xyXG4gIG1hcmdpbi1ib3R0b206IGF1dG87XHJcbn1cclxuLypvdGhlcnMqL1xyXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcclxuICBiYWNrZ3JvdW5kOiAjMDA4NGZmO1xyXG4gIGJvcmRlcjogMnB4IHNvbGlkIGRhcmtibHVlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcclxufVxyXG5cclxuLm1haW5Sb3d7XHJcbiAgZmxleC1ncm93OiAxO1xyXG59XHJcbi5tY29uc29sZSwgLm1tY29uc29sZXtcclxuICBib3JkZXItdG9wOiB2YXIoLS1tYWluQm9yZGVyKTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluQmFja2dyb3VuZENvbG9yKTtcclxuICBvdmVyZmxvdy15OiBhdXRvO1xyXG4gIGZsZXgtZ3JvdzogMDtcclxuICAvKnBvc2l0aW9uOiBmaXhlZDtcclxuICBib3R0b206IDA7Ki9cclxuICBoZWlnaHQ6IDEwMCU7XHJcbiAgd2lkdGg6IDEwMCU7fVxyXG4udG9kb3tcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiBkYXJrcmVkICFpbXBvcnRhbnQ7XHJcbiAgY3Vyc29yOiBub3QtYWxsb3dlZCAhaW1wb3J0YW50O1xyXG59XHJcbi50b2RvPiosIC50b2RvICp7XHJcbiAgY3Vyc29yOiBub3QtYWxsb3dlZCAhaW1wb3J0YW50O1xyXG59XHJcbi5WZXJ0ZXggc2VsZWN0e1xyXG4gIHRleHQtYWxpZ24tbGFzdDogZW5kO1xyXG59XHJcblxyXG4uYWxlcnRjb250YWluZXJ7XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgdG9wOiAwO1xyXG4gIGhlaWdodDogMjAwJTtcclxuICB3aWR0aDogMTAwJTtcclxuICBtYXgtaGVpZ2h0OiAxMDB2aDtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIGxlZnQ6IDA7XHJcbiAgei1pbmRleDogMTAwMDAwO1xyXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gIGZsZXgtd3JhcDogd3JhcDtcclxuICBmbGV4LWZsb3c6IGNvbHVtbjtcclxufVxyXG4uYWxlcnRjb250YWluZXIgPiAqIHtcclxuICBwb2ludGVyLWV2ZW50czogYWxsOyB9XHJcbi5hbGVydHNoZWxse1xyXG4gIG1hcmdpbjphdXRvO1xyXG4gIHBhZGRpbmctbGVmdDogMzBweDtcclxuICBwYWRkaW5nLXJpZ2h0OiAzMHB4O1xyXG59XHJcbi5hbGVydHtcclxuICBtYXJnaW4tYm90dG9tOiA1cHg7XHJcbn1cclxuXHJcbi5VdGFiQ29udGFpbmVye1xyXG4gIGZsZXgtZ3JvdzogMTtcclxuICBmbGV4LWJhc2lzOiAwO1xyXG4gIG92ZXJmbG93OiBhdXRvO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1mbG93OiBjb2x1bW47XHJcbn1cclxuLlV0YWJDb250ZW50Q29udGFpbmVye1xyXG4gIGZsZXgtZ3JvdzogMTtcclxuICBmbGV4LWJhc2lzOiAwO1xyXG4gIG92ZXJmbG93OiBhdXRvO1xyXG59XHJcbi5VdGFiQ29udGVudHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG4gIG92ZXJmbG93LXk6IGF1dG87XHJcbiAgb3ZlcmZsb3cteDogYXV0bztcclxuICBwYWRkaW5nOiAxN3B4O1xyXG4gIHBhZGRpbmctcmlnaHQ6IGNhbGMoMTdweCAtIDEwcHgpOyAvKmZvciBzY3JvbGxiYXIgPyovXHJcbiAgZmxleC1ncm93OiAxO1xyXG59XHJcbi5VdGFiQ29udGVudC5tYWlue1xyXG4gIHBhZGRpbmc6MDtcclxufVxyXG4uVXRhYkhlYWRlcntcclxuICBwYWRkaW5nLXRvcDogMTBweDtcclxuICBwYWRkaW5nLWJvdHRvbTogMTBweDtcclxuICBtYXJnaW46IDZweDtcclxuICBtYXJnaW4tbGVmdDogMDtcclxuICAvKlxyXG4gIGJvcmRlcjogdmFyKC0tbWFpbkJvcmRlcik7XHJcbiAgKi9cclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluQmFja2dyb3VuZENvbG9yKTtcclxuICBmbGV4LWZsb3c6IGNvbHVtbjtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZ3JvdzogMTtcclxuICBmbGV4LWJhc2lzOiAwO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG4uVXRhYkhlYWRlcjpsYXN0LW9mLXR5cGV7IG1hcmdpbi1yaWdodDogMDsgfVxyXG4uVXRhYkhlYWRlcltzZWxlY3RlZD1cInRydWVcIl17XHJcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbWFpbkJvcmRlckNvbG9yKTtcclxufVxyXG4uVXRhYkhlYWRlckNvbnRhaW5lcntcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1tYWluQm9yZGVyQ29sb3IpO1xyXG4gIHBhZGRpbmc6IDA7XHJcbiAgbWFyZ2luOiAwO1xyXG4gIGRpc3BsYXk6IGZsZXg7fVxyXG4vKiBmb3Igc3F1YXJlZCAqL1xyXG4vKiBmb3Igc3F1YXJlZCBlbmQqL1xyXG4vKiBnbG93aW5nIHRhYiBoZWFkZXJzKiAvXHJcbi5VdGFiSGVhZGVyIHtcclxuICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcclxuICBtYXJnaW46IDJweCAhaW1wb3J0YW50O1xyXG4gIG1hcmdpbi10b3A6IDRweCAhaW1wb3J0YW50O1xyXG4gIG1hcmdpbi1ib3R0b206IDRweCAhaW1wb3J0YW50O1xyXG4gIGJveC1zaGFkb3c6IDJweCAycHggM3B4ICM1MDY4OTQsIDJweCAtMnB4IDNweCAjNTA2ODk0LCAtMnB4IDJweCAzcHggIzUwNjg5NCwgLTJweCAtMnB4IDNweCAjNTA2ODk0LCAycHggMHB4IDNweCAjNTA2ODk0LCAwcHggMnB4IDNweCAjNTA2ODk0LCAtMnB4IDBweCAzcHggIzUwNjg5NCwgMHB4IC0ycHggM3B4ICM1MDY4OTQ7XHJcbiAgYm94LXNoYWRvdzogMnB4IDJweCAzcHggIzYwNjM3MywgMnB4IC0ycHggM3B4ICM2MDYzNzMsIC0ycHggMnB4IDNweCAjNjA2MzczLCAtMnB4IC0ycHggM3B4ICM2MDYzNzMsIDJweCAwcHggM3B4ICM2MDYzNzMsIDBweCAycHggM3B4ICM2MDYzNzMsIC0ycHggMHB4IDNweCAjNjA2MzczLCAwcHggLTJweCAzcHggIzYwNjM3MztcclxufVxyXG4uVXRhYkhlYWRlcltzZWxlY3RlZD1cInRydWVcIl0ge1xyXG4gIGJveC1zaGFkb3c6IDJweCAycHggM3B4ICM2MDYzNzMsIDJweCAtMnB4IDNweCAjNjA2MzczLCAtMnB4IDJweCAzcHggIzYwNjM3MywgLTJweCAtMnB4IDNweCAjNjA2MzczLCAycHggMHB4IDNweCAjNjA2MzczLCAwcHggMnB4IDNweCAjNjA2MzczLCAtMnB4IDBweCAzcHggIzYwNjM3MywgMHB4IC0ycHggM3B4ICM2MDYzNzM7XHJcbiAgYm94LXNoYWRvdzogMnB4IDJweCAzcHggIzUwNjg5NCwgMnB4IC0ycHggM3B4ICM1MDY4OTQsIC0ycHggMnB4IDNweCAjNTA2ODk0LCAtMnB4IC0ycHggM3B4ICM1MDY4OTQsIDJweCAwcHggM3B4ICM1MDY4OTQsIDBweCAycHggM3B4ICM1MDY4OTQsIC0ycHggMHB4IDNweCAjNTA2ODk0LCAwcHggLTJweCAzcHggIzUwNjg5NDtcclxuICBib3gtc2hhZG93OiBub25lO1xyXG59XHJcbi8qIGdsb3dpbmcgdGFiIGhlYWRlcnMgZW5kKi9cclxuLnNpZGViYXJTaGVsbDpmaXJzdC1jaGlsZCB7XHJcbiAgcGFkZGluZy10b3A6IDE1cHg7XHJcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xyXG59XHJcbi5zaWRlYmFyU2hlbGwge1xyXG4gIHBhZGRpbmc6IDA7IC8qcmVxdWlyZWQgZm9yIFUucmVzaXppbmdCb3JkZXJzKi9cclxufVxyXG5cclxuXHJcblxyXG4vKioqKi9cclxuIl19 */", '', '']]

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stylesInDom = {};

var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

function listToStyles(list, options) {
  var styles = [];
  var newStyles = {};

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var css = item[1];
    var media = item[2];
    var sourceMap = item[3];
    var part = {
      css: css,
      media: media,
      sourceMap: sourceMap
    };

    if (!newStyles[id]) {
      styles.push(newStyles[id] = {
        id: id,
        parts: [part]
      });
    } else {
      newStyles[id].parts.push(part);
    }
  }

  return styles;
}

function addStylesToDom(styles, options) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i];
    var domStyle = stylesInDom[item.id];
    var j = 0;

    if (domStyle) {
      domStyle.refs++;

      for (; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j]);
      }

      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j], options));
      }
    } else {
      var parts = [];

      for (; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j], options));
      }

      stylesInDom[item.id] = {
        id: item.id,
        refs: 1,
        parts: parts
      };
    }
  }
}

function insertStyleElement(options) {
  var style = document.createElement('style');

  if (typeof options.attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      options.attributes.nonce = nonce;
    }
  }

  Object.keys(options.attributes).forEach(function (key) {
    style.setAttribute(key, options.attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {};
  options.attributes = typeof options.attributes === 'object' ? options.attributes : {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  var styles = listToStyles(list, options);
  addStylesToDom(styles, options);
  return function update(newList) {
    var mayRemove = [];

    for (var i = 0; i < styles.length; i++) {
      var item = styles[i];
      var domStyle = stylesInDom[item.id];

      if (domStyle) {
        domStyle.refs--;
        mayRemove.push(domStyle);
      }
    }

    if (newList) {
      var newStyles = listToStyles(newList, options);
      addStylesToDom(newStyles, options);
    }

    for (var _i = 0; _i < mayRemove.length; _i++) {
      var _domStyle = mayRemove[_i];

      if (_domStyle.refs === 0) {
        for (var j = 0; j < _domStyle.parts.length; j++) {
          _domStyle.parts[j]();
        }

        delete stylesInDom[_domStyle.id];
      }
    }
  };
};

/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!../node_modules/postcss-loader/src??embedded!./styles.css */ "./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src/index.js?!./src/styles.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ 3:
/*!******************************!*\
  !*** multi ./src/styles.css ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\diama\WebstormProjects\jjodel\src\styles.css */"./src/styles.css");


/***/ })

},[[3,"runtime"]]]);
//# sourceMappingURL=styles-es2015.js.map