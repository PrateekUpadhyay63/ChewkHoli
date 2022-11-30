import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppManagementComponent } from './app-management/app-management.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'app/shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: "app-management",
    component: AppManagementComponent,
  },
  {
    path: "",
    redirectTo: "app-management",
    pathMatch: "full",
  },
];


@NgModule({
  declarations: [
    AppManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    NgbModule,
    NgSelectModule,
    CorePipesModule,
    SharedModule,
    NgxDatatableModule,
    ReactiveFormsModule
  ]
})
export class AppManagementModule { }
