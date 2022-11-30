import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStreamingDeviceComponent } from './edit-streaming-device.component';

describe('EditStreamingDeviceComponent', () => {
  let component: EditStreamingDeviceComponent;
  let fixture: ComponentFixture<EditStreamingDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStreamingDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStreamingDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
