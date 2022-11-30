import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "edit-profile",
    pathMatch: "full"
  },
  {
    path: "view-profile",
    component: ViewProfileComponent
  },
  {
    path: "edit-profile",
    component:EditProfileComponent
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
