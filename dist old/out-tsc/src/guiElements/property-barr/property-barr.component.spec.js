import { async, TestBed } from '@angular/core/testing';
import { PropertyBarrComponent } from './property-barr.component';
describe('PropertyBarrComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PropertyBarrComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(PropertyBarrComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=property-barr.component.spec.js.map