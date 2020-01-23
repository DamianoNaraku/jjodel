import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmGraphHtmlComponent } from './mm-graph-html.component';

describe('MmGraphHtmlComponent', () => {
  let component: MmGraphHtmlComponent;
  let fixture: ComponentFixture<MmGraphHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmGraphHtmlComponent ]
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
