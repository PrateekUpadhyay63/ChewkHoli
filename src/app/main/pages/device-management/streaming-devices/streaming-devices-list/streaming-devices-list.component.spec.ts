import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingDevicesListComponent } from './streaming-devices-list.component';

describe('StreamingDevicesListComponent', () => {
  let component: StreamingDevicesListComponent;
  let fixture: ComponentFixture<StreamingDevicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamingDevicesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamingDevicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
