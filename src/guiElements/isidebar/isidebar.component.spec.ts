import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsidebarComponent } from './isidebar.component';

describe('IsidebarComponent', () => {
  let component: IsidebarComponent;
  let fixture: ComponentFixture<IsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
