import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamContextMenuComponent } from './dam-context-menu.component';

describe('DamContextMenuComponent', () => {
  let component: DamContextMenuComponent;
  let fixture: ComponentFixture<DamContextMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
