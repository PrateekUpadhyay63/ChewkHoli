import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAuthorityComponent } from './transfer-authority.component';

describe('TransferAuthorityComponent', () => {
  let component: TransferAuthorityComponent;
  let fixture: ComponentFixture<TransferAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferAuthorityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
