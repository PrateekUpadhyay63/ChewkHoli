import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegratedOrganizationsRoutingModule } from './integrated-organizations-routing.module';
import { OrganizationsListComponent } from './organizations-list/organizations-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { IntegratedOrganizationiService } from './integrated-organizationi.service';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    OrganizationsListComponent
  ],
  imports: [
    CommonModule,
    IntegratedOrganizationsRoutingModule,
    //
    NgbModule,
    NgxDatatableModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,  
    ReactiveFormsModule,
    CoreCommonModule,
    CoreSidebarModule,
    CorePipesModule,
    CoreDirectivesModule,
    SharedModule
  ],
  providers: [IntegratedOrganizationiService]
})
export class IntegratedOrganizationsModule { }
