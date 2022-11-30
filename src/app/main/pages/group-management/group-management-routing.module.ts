import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGroupComponent } from './add-group/add-group.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { GroupListComponent } from './group-list/group-list.component';
import { ViewGroupComponent } from './view-group/view-group.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "group-list",
    pathMatch: "full"
  },
  {
    path: "group-list",
    component: GroupListComponent
  },
  {
    path: "add-group",
    component: AddGroupComponent
  }, 
  {
    path: "group-management/edit-group/:id",
    component: EditGroupComponent
  }, 
  {
    path: "group-management/view-group/:id",
    component: ViewGroupComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupManagementRoutingModule { }
