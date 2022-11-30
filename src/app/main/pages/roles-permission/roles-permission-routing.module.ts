import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRolesPermissionsComponent } from './add-roles-permissions/add-roles-permissions.component';
import { EditRolesPermissionsComponent } from './edit-roles-permissions/edit-roles-permissions.component';
import { RolesPermissionsListComponent } from './roles-permissions-list/roles-permissions-list.component';
import { ViewRolesPermissionsComponent } from './view-roles-permissions/view-roles-permissions.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full"
  },
  {
    path: "list",
    component: RolesPermissionsListComponent
  },
  {
    path: "roles-permission-management/add",
    component: AddRolesPermissionsComponent
  },
  {
    path: "roles-permission-management/edit/:id",
    component: EditRolesPermissionsComponent
  },
  {
    path: "roles-permission-management/view/:id",
    component:ViewRolesPermissionsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesPermissionRoutingModule { }
