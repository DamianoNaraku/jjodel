import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { M2tcreatorComponent } from './m2tcreator.component';

describe('M2tcreatorComponent', () => {
  let component: M2tcreatorComponent;
  let fixture: ComponentFixture<M2tcreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ M2tcreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(M2tcreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
