import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStreamingDeviceComponent } from './add-streaming-device.component';

describe('AddStreamingDeviceComponent', () => {
  let component: AddStreamingDeviceComponent;
  let fixture: ComponentFixture<AddStreamingDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStreamingDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStreamingDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
