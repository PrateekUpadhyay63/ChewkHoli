import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';
import { AddUserComponent } from './add-user/add-user.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserManagementService } from './user-management.service';
import { UserViewComponent } from './user-view/user-view.component';

const routes: Routes = [
  {
        path: "",
        redirectTo: "userlist",
        pathMatch: "full"
  },
  {
      path: "userlist",
      component: UserListComponent,
      // resolve: {
      //   userlist: UserManagementService
      // },
      // canActivate: [AuthGuard],
      // data: { roles: [Role.Admin], animation: 'userlist' },
      // data: { animation: 'userlist' }
  },
  {
      path: "add-user",
      component: AddUserComponent,
      // canActivate: [AuthGuard],
      // data: { roles: [Role.Admin], animation: 'add-user' },

  }, 
  {
    path: 'user-management/user-edit/:id',
      component: UserEditComponent,
      // resolve: {
      //   ues: UserManagementService
      // }, 
      // canActivate: [AuthGuard],
      // data: { roles: [Role.Admin], animation: 'user-edit' },
  },
  {
    path: 'user-management/user-view/:id',
      component: UserViewComponent,
      // resolve: {
      //   ues: UserEditService
      // }, 
  }, 
  {
    path: 'user-management/user-activity/:username',
      component: UserActivityComponent,
      // resolve: {
      //   ues: UserEditService
      // }, 
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }