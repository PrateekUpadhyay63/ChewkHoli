import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "app/auth/helpers";
import { Role } from "app/auth/models";
import { DashboardComponent } from "app/main/pages/dashboard/dashboard.component";

const routes: Routes = [
  // {
  //     path: "",
  //     component: DashboardComponent
  // },
  {
    path: "",
    loadChildren: () =>
      import("../main/pages/dashboard/chat/chat.module").then(
        (m) => m.ChatModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "user-management",
    loadChildren: () =>
      import("../main/pages/user-management/user-management.module").then(
        (m) => m.UserManagementModule
      ),
    canActivate: [AuthGuard],
    // data: { roles: [Role.Admin], animation: 'user-management' },
  },
  {
    path: "group-management",
    loadChildren: () =>
      import("../main/pages/group-management/group-management.module").then(
        (m) => m.GroupManagementModule
      ),
    canActivate: [AuthGuard],
    // data: { roles: [Role.Admin], animation: 'group-management' },
  },
  {
    path: "roles-permission-management",
    loadChildren: () =>
      import("../main/pages/roles-permission/roles-permission.module").then(
        (m) => m.RolesPermissionModule
      ),
    canActivate: [AuthGuard],
    // data: { roles: [Role.Admin], animation: 'roles-permission-management' },
  },
  {
    path: "settings",
    loadChildren: () =>
      import("../main/pages/settings/settings.module").then(
        (m) => m.SettingsModule
      ),
    canActivate: [AuthGuard],
    // data: { roles: [Role.Admin], animation: 'roles-permission-management' },
  },
  {
    path: "organizations",
    loadChildren: () =>
      import(
        "../main/pages/integrated-organizations/integrated-organizations.module"
      ).then((m) => m.IntegratedOrganizationsModule),
    canActivate: [AuthGuard],
    // data: { roles: [Role.Admin], animation: 'roles-permission-management' },
  },
  {
    path: "transfer-authority",
    loadChildren: () =>
      import("../main/pages/transfer-authority/transfer-authority.module").then(
        (m) => m.TransferAuthorityModule
      ),
    canActivate: [AuthGuard],
    // data: { roles: [Role.Admin], animation: 'roles-permission-management' },
  },
  {
    path: "device-management",
    loadChildren: () =>
      import("../main/pages/device-management/device-management.module").then(
        (m) => m.DeviceManagementModule
      ),
    canActivate: [AuthGuard],
    // data: { roles: [Role.Admin], animation: 'roles-permission-management' },
  },
  {
    path: "system-server",
    loadChildren: () =>
      import("../main/pages/system-and-server/system-and-server.module").then(
        (m) => m.SystemAndServerModule
      ),
    canActivate: [AuthGuard],
    // data: { roles: [Role.Admin], animation: 'roles-permission-management' },
  },

  {
    path: "stream",
    loadChildren: () =>
      import("../main/pages/stream/stream.module").then((m) => m.StreamModule),
    canActivate: [AuthGuard],
    // data: { roles: [Role.Admin], animation: 'roles-permission-management' },
  },
  {
    path: "notifications",
    loadChildren: () =>
      import("../main/pages/notifications/notifications.module").then(
        (m) => m.NotificationsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "location-management",
    loadChildren: () =>
      import("../main/pages/location-managment/location-managment.module").then(
        (m) => m.LocationManagmentModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "Color",
    loadChildren: () =>
      import("../main/pages/content-management/content-management.module").then(
        (m) => m.ContentManagementModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "app",
    loadChildren: () =>
      import("../main/pages/app-management/app-management.module").then(
        (m) => m.AppManagementModule
      ),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoutingModule {}
