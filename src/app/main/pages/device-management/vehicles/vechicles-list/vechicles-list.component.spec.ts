import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VechiclesListComponent } from './vechicles-list.component';

describe('VechiclesListComponent', () => {
  let component: VechiclesListComponent;
  let fixture: ComponentFixture<VechiclesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VechiclesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VechiclesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
