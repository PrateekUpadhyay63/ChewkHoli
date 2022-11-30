import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";

import { CoreSidebarModule } from "@core/components";
import { CoreCommonModule } from "@core/common.module";
import { ChatActiveSidebarComponent } from "./chat-sidebars/chat-active-sidebar/chat-active-sidebar.component";
import { ChatComponent } from "./chat.component";
import { ChatContentComponent } from "./chat-content/chat-content.component";
import { ChatSidebarComponent } from "./chat-sidebars/chat-sidebar/chat-sidebar.component";
import { ChatUserSidebarComponent } from "./chat-sidebars/chat-user-sidebar/chat-user-sidebar.component";
import { ChatsService } from "./chats.service";
import { XMPPService } from "../ejab.service";
import { AudioRecordingService } from "./utils/audio.service";
import { ConferenceComponent } from "./conference/conference.component";
import { FirebaseMessageService } from "../services/firebase-message.service";
// import { ConferenceCallComponent } from "./conference-call/conference-call.component";
import { NgbdModalContent } from "./utils/custom-modal-call/modal-component";
import { NotificationService } from "../../notifications/notification.service";
import { AuthGuard } from "app/auth/helpers/auth.guards";
// import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { SharedModule } from "app/shared/shared.module";

// routing
const routes: Routes = [
  {
    path: "dashboard",
    component: ChatComponent,
    data: { animation: "chat" },
    canActivate: [AuthGuard]
  },
  {
    path: "conference",
    component: ConferenceComponent,
  },
  {
    path: "open-chat/:group_id/:room_jid/:name/:active",
    component: ChatComponent,
  },
  {

    path: "open-dashboard",
    component: ChatComponent,

  }
];

@NgModule({
  declarations: [
    ChatComponent,
    ChatContentComponent,
    ChatSidebarComponent,
    ChatUserSidebarComponent,
    // ChatActiveSidebarComponent,
    ConferenceComponent,
    // ConferenceCallComponent,
    NgbdModalContent,
   
  ],
  imports: [
    CommonModule,
    CoreSidebarModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    PerfectScrollbarModule,
    NgbModule,
    NgSelectModule,
    TranslateModule,
    SharedModule
    // ToastrModule
    // NgxChatModule.forRoot()
  ],
  exports: [ ],
  providers: [
    ChatsService,
    XMPPService,
    FirebaseMessageService,
    AudioRecordingService,
    NotificationService,
  ],
})
export class ChatModule { }
