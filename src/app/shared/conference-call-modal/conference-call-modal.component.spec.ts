import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceCallModalComponent } from './conference-call-modal.component';

describe('ConferenceCallModalComponent', () => {
  let component: ConferenceCallModalComponent;
  let fixture: ComponentFixture<ConferenceCallModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConferenceCallModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceCallModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
