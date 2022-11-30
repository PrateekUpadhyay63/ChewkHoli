import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAndServerComponent } from './system-and-server.component';

describe('SystemAndServerComponent', () => {
  let component: SystemAndServerComponent;
  let fixture: ComponentFixture<SystemAndServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemAndServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAndServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
