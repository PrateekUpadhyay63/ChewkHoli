import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRolesPermissionsComponent } from './view-roles-permissions.component';

describe('ViewRolesPermissionsComponent', () => {
  let component: ViewRolesPermissionsComponent;
  let fixture: ComponentFixture<ViewRolesPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRolesPermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRolesPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
