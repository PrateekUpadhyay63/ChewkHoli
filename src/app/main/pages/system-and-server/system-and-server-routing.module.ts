import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemAndServerComponent } from './system-and-server.component';



const routes: Routes = [
  { 
    path: '',
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    component: SystemAndServerComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemServerRoutingModule { }