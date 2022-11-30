import {  NgModule,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { ChatModule } from './chat/chat.module';
import { ChatsService } from './chat/chats.service';
import { XMPPService } from './ejab.service';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    ChatModule
  ],
  exports: [DashboardComponent],
  providers: [ChatsService, XMPPService ]
})
export class DashboardModule {}
