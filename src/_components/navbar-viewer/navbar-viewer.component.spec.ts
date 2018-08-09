import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarViewerComponent } from './navbar-viewer.component';

describe('NavbarViewerComponent', () => {
  let component: NavbarViewerComponent;
  let fixture: ComponentFixture<NavbarViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
