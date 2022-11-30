import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveDataComponent } from './active-data.component';

describe('ActiveDataComponent', () => {
  let component: ActiveDataComponent;
  let fixture: ComponentFixture<ActiveDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
