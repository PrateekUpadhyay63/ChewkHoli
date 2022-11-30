import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";

import { CoreCommonModule } from "@core/common.module";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";

import { AuthenticationModule } from "./authentication/authentication.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { UserManagementModule } from "./user-management/user-management.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { GroupManagementModule } from "./group-management/group-management.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthGuard, ErrorInterceptor, JwtInterceptor } from "app/auth/helpers";
import { ToastrModule } from "ngx-toastr";
import { RolesPermissionModule } from "./roles-permission/roles-permission.module";
// import { GroupManagementService } from './group-management/group-management.service';
import { RolesPermissionsService } from "./roles-permission/roles-permissions.service";
import { UserManagementService } from "./user-management/user-management.service";
import { SettingsModule } from "./settings/settings.module";
import { TruncatePipe } from "@core/pipes/truncate.pipe";
import { TransferAuthorityModule } from "./transfer-authority/transfer-authority.module";
import { DeviceManagementModule } from "./device-management/device-management.module";
import { SystemAndServerModule } from "./system-and-server/system-and-server.module";
// import { StreamComponent } from './stream/stream.component';
import { StreamModule } from "./stream/stream.module";
import { FirebaseMessageService } from "./dashboard/services/firebase-message.service";
import { GroupManagementService } from "./group-management/group-management.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    AuthenticationModule,
    UserManagementModule,
    MiscellaneousModule,
    DashboardModule,
    GroupManagementModule,
    RolesPermissionModule,
    TransferAuthorityModule,
    DeviceManagementModule,
    //
    ToastrModule,
    // StreamModule,
  ],
  // entryComponents: [CustomToastrComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // ! IMPORTANT: Provider used to create fake backend, comment while using real API
    // fakeBackendProvider,
    AuthGuard,
    UserManagementService,
    RolesPermissionsService,
    GroupManagementService,
    SettingsModule,
    SystemAndServerModule,
  ],
})
export class PagesModule {}
