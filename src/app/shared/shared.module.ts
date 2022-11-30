import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConferenceCallComponent } from "app/shared/conference-call/conference-call.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreDirectivesModule } from "@core/directives/directives";
import { FirebaseMessageService } from "app/main/pages/dashboard/services/firebase-message.service";
import { ChatActiveSidebarComponent } from "app/main/pages/dashboard/chat/chat-sidebars/chat-active-sidebar/chat-active-sidebar.component";
import { CoreSidebarModule } from "@core/components";
import { CoreCommonModule } from "@core/common.module";
import { CallService } from "./services/call.service";
import { MapComponent } from "app/main/pages/dashboard/map/map/map.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxColorsModule } from "ngx-colors";
import { TranslateModule } from "@ngx-translate/core";
import { ContextMenuModule } from "@ctrl/ngx-rightclick";
import { AnimatedCustomContextMenuComponent } from "app/main/pages/dashboard/chat/chat-sidebars/chat-active-sidebar/custom-context-menu/custom-context-menu.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { Router, RouterModule, Routes } from "@angular/router";
import { ConferenceCallModalComponent } from './conference-call-modal/conference-call-modal.component';
import { MinMaxPopupModule, MinMaxDirective } from 'min-max-popup';
import { VideoWraperComponent } from "app/main/pages/device-management/video-player/video-wraper/video-wraper.component";

const routes: Routes = [
  // {
  //   path: "conference-call",
  //   component: ConferenceCallComponent
  // }
]
@NgModule({
  declarations: [
    ConferenceCallComponent,
    ChatActiveSidebarComponent,
    MapComponent,
    AnimatedCustomContextMenuComponent,
    ConferenceCallModalComponent,
    // VideoWraperComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreDirectivesModule,
    CoreCommonModule,
    MinMaxPopupModule,
    CoreSidebarModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxColorsModule,
    TranslateModule,
    ContextMenuModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    ConferenceCallComponent,
    ChatActiveSidebarComponent,
    ConferenceCallModalComponent,
    //module
    CommonModule,
    FormsModule,
    CoreDirectivesModule,
    CoreCommonModule,
    CoreSidebarModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    MapComponent,
    NgxColorsModule,
    TranslateModule,
    AnimatedCustomContextMenuComponent,
  ],
  providers: [FirebaseMessageService,MinMaxDirective, CallService],
  entryComponents: [AnimatedCustomContextMenuComponent],
})
export class SharedModule {}
