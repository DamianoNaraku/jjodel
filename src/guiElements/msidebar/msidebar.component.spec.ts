import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsidebarComponent } from './msidebar.component';

describe('MsidebarComponent', () => {
  let component: MsidebarComponent;
  let fixture: ComponentFixture<MsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
