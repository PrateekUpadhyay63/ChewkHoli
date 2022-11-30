import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVechiclesComponent } from './add-vechicles.component';

describe('AddVechiclesComponent', () => {
  let component: AddVechiclesComponent;
  let fixture: ComponentFixture<AddVechiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVechiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVechiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
