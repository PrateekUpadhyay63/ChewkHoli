import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiskDataComponent } from './disk-data.component';

describe('DiskDataComponent', () => {
  let component: DiskDataComponent;
  let fixture: ComponentFixture<DiskDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiskDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiskDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
