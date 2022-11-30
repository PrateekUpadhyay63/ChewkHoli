import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceCallComponent } from './conference-call.component';

describe('ConferenceCallComponent', () => {
  let component: ConferenceCallComponent;
  let fixture: ComponentFixture<ConferenceCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConferenceCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
