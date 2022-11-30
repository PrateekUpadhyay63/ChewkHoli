import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
//
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CoreSidebarModule } from '@core/components';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UserManagementService } from './user-management.service';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { SharedModule } from 'app/shared/shared.module';

// import { PaginationModule } from 'ngx-pagination-bootstrap'


@NgModule({
  declarations: [
    UserListComponent,
    AddUserComponent,
    UserEditComponent,
    UserViewComponent,
    UserActivityComponent,
    // PaginationModule,
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    //
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CoreCommonModule,
    CoreSidebarModule,
    CorePipesModule,
    CoreDirectivesModule,
    FormsModule,  
    TranslateModule,
    SharedModule
  ],
  providers: [UserManagementService]
})
export class UserManagementModule { }
