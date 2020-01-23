import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MGraphHtmlComponent } from './m-graph-html.component';

describe('MGraphHtmlComponent', () => {
  let component: MGraphHtmlComponent;
  let fixture: ComponentFixture<MGraphHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MGraphHtmlComponent ]
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
