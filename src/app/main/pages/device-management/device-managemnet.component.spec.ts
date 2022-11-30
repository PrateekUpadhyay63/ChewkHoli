import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceManagemnetComponent } from './device-managemnet.component';

describe('DeviceManagemnetComponent', () => {
  let component: DeviceManagemnetComponent;
  let fixture: ComponentFixture<DeviceManagemnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceManagemnetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceManagemnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
