import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeEditorComponent } from './edge-editor.component';

describe('EdgeEditorComponent', () => {
  let component: EdgeEditorComponent;
  let fixture: ComponentFixture<EdgeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdgeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdgeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
