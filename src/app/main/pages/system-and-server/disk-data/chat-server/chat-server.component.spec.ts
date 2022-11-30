import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatServerComponent } from './chat-server.component';

describe('ChatServerComponent', () => {
  let component: ChatServerComponent;
  let fixture: ComponentFixture<ChatServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
