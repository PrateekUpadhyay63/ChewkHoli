import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './location/location.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';


const routes:Routes = [
  {
    path: "location-management",
    component: LocationComponent
  },
  {
    path: '',
    redirectTo: 'location-management',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [
    LocationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgSelectModule,
    TranslateModule,
    NgbModule,
    CoreCommonModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2FlatpickrModule
  ]
})
export class LocationManagmentModule { }
