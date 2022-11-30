import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoWraperComponent } from './video-wraper.component';

describe('VideoWraperComponent', () => {
  let component: VideoWraperComponent;
  let fixture: ComponentFixture<VideoWraperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoWraperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoWraperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
