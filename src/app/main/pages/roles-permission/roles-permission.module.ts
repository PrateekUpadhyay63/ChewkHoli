import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesPermissionRoutingModule } from './roles-permission-routing.module';
import { RolesPermissionsListComponent } from './roles-permissions-list/roles-permissions-list.component';
import { AddRolesPermissionsComponent } from './add-roles-permissions/add-roles-permissions.component';
import { EditRolesPermissionsComponent } from './edit-roles-permissions/edit-roles-permissions.component';
import { RolesPermissionsService } from './roles-permissions.service';
//
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreSidebarModule } from '@core/components';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { ViewRolesPermissionsComponent } from './view-roles-permissions/view-roles-permissions.component';
import { TruncatePipe } from '@core/pipes/truncate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    RolesPermissionsListComponent,
    AddRolesPermissionsComponent,
    EditRolesPermissionsComponent,
    ViewRolesPermissionsComponent,
  ],
  imports: [
    CommonModule,
    RolesPermissionRoutingModule,
    //
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CoreCommonModule,
    CoreSidebarModule,
    CoreDirectivesModule,
    CorePipesModule,
    FormsModule, 
    ReactiveFormsModule,
    TranslateModule,
    SharedModule
  ],
  providers: [RolesPermissionsService]
})
export class RolesPermissionModule { }
