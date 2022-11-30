import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioCallServerComponent } from './audio-call-server.component';

describe('AudioCallServerComponent', () => {
  let component: AudioCallServerComponent;
  let fixture: ComponentFixture<AudioCallServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioCallServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioCallServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
