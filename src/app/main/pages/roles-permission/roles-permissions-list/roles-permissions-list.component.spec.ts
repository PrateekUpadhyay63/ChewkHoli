import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPermissionsListComponent } from './roles-permissions-list.component';

describe('RolesPermissionsListComponent', () => {
  let component: RolesPermissionsListComponent;
  let fixture: ComponentFixture<RolesPermissionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesPermissionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesPermissionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
