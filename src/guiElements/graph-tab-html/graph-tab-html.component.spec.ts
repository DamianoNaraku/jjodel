import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphTabHtmlComponent } from './graph-tab-html.component';

describe('GraphTabHtmlComponent', () => {
  let component: GraphTabHtmlComponent;
  let fixture: ComponentFixture<GraphTabHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphTabHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphTabHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
