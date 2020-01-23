import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmsidebarComponent } from './mmsidebar.component';

describe('MmsidebarComponent', () => {
  let component: MmsidebarComponent;
  let fixture: ComponentFixture<MmsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
