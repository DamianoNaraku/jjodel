import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurabletemplateComponent } from './measurabletemplate.component';

describe('MeasurabletemplateComponent', () => {
  let component: MeasurabletemplateComponent;
  let fixture: ComponentFixture<MeasurabletemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurabletemplateComponent ]
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
