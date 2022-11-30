import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { CoreCommonModule } from "@core/common.module";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { QuillModule } from "ngx-quill";
import { NotificationService } from "./notification.service";
import { NotificationComponent } from "./notification.component";
import { NotificationListComponent } from "./notification-list/notification-list.component";
import { NotificationListItemComponent } from "./notification-list/notification-list-item/notification-list-item.component";
import { SharedModule } from "app/shared/shared.module";

const routes: Routes = [
  {
    path: "notifications",
    component: NotificationComponent,
  },
  {
    path: "",
    redirectTo: "notifications",
    pathMatch: "full",
  },
];

@NgModule({
  declarations: [
    NotificationListComponent,
    NotificationListItemComponent,
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfectScrollbarModule,
    CoreCommonModule,
    NgbModule,
    NgSelectModule,
    QuillModule.forRoot(),
    CorePipesModule,
    SharedModule

  ],
  providers: [],
})
export class NotificationsModule {}
