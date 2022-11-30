import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingServerComponent } from './streaming-server.component';

describe('StreamingServerComponent', () => {
  let component: StreamingServerComponent;
  let fixture: ComponentFixture<StreamingServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamingServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamingServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
