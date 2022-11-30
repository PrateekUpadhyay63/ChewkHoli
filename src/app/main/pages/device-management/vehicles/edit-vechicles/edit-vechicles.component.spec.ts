import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVechiclesComponent } from './edit-vechicles.component';

describe('EditVechiclesComponent', () => {
  let component: EditVechiclesComponent;
  let fixture: ComponentFixture<EditVechiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVechiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVechiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
