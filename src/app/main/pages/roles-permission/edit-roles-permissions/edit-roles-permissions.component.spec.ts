import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRolesPermissionsComponent } from './edit-roles-permissions.component';

describe('EditRolesPermissionsComponent', () => {
  let component: EditRolesPermissionsComponent;
  let fixture: ComponentFixture<EditRolesPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRolesPermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRolesPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
