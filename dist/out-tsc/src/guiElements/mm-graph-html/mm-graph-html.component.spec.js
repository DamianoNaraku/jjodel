import { async, TestBed } from '@angular/core/testing';
import { MmGraphHtmlComponent } from './mm-graph-html.component';
describe('MmGraphHtmlComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MmGraphHtmlComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(MmGraphHtmlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=mm-graph-html.component.spec.js.map