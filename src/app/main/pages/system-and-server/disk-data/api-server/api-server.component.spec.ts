import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiServerComponent } from './api-server.component';

describe('ApiServerComponent', () => {
  let component: ApiServerComponent;
  let fixture: ComponentFixture<ApiServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
