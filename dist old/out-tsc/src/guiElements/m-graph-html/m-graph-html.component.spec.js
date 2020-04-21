import { async, TestBed } from '@angular/core/testing';
import { MGraphHtmlComponent } from './m-graph-html.component';
describe('MGraphHtmlComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MGraphHtmlComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(MGraphHtmlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=m-graph-html.component.spec.js.map