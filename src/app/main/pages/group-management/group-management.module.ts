import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupManagementRoutingModule } from './group-management-routing.module';
import { GroupListComponent } from './group-list/group-list.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
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
import { ViewGroupComponent } from './view-group/view-group.component';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatePipe } from '@core/pipes/truncate.pipe';
import { GroupManagementService } from './group-management.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'app/shared/shared.module';
import { MinMaxPopupModule, MinMaxDirective } from 'min-max-popup';
@NgModule({
  declarations: [
    GroupListComponent,
    AddGroupComponent,
    EditGroupComponent,
    ViewGroupComponent,
    // 
  ],
  imports: [
    NgxPaginationModule,
    CommonModule,
    GroupManagementRoutingModule,
    MinMaxPopupModule,
    //
    NgbModule,
    NgSelectModule,
    NgxDatatableModule,
    CoreCommonModule,
    CorePipesModule,
    CorePipesModule,
    CoreDirectivesModule,
    FormsModule,  
    ReactiveFormsModule,
    TranslateModule,
    SharedModule
   
    
  ], 
  providers: [GroupManagementService,MinMaxDirective,]
})
export class GroupManagementModule { }
