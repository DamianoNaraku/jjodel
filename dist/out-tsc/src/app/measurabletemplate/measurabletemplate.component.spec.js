import { async, TestBed } from '@angular/core/testing';
import { MeasurabletemplateComponent } from './measurabletemplate.component';
describe('MeasurabletemplateComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MeasurabletemplateComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(MeasurabletemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=measurabletemplate.component.spec.js.map