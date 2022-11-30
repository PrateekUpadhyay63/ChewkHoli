import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SystemServerRoutingModule } from './system-and-server-routing.module';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SystemAndServerComponent } from './system-and-server.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DiskListComponent } from './disk/disk-list/disk-list.component';
import { DataComponent } from './data/data.component';
import { ActivityComponent } from './activity/activity.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
import { DiskDataComponent } from './disk-data/disk-data.component';
import { ChatServerComponent } from './disk-data/chat-server/chat-server.component';
import { ActiveDataComponent } from './disk-data/active-data/active-data.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApiServerComponent } from './disk-data/api-server/api-server.component';
import { AudioCallServerComponent } from './disk-data/audio-call-server/audio-call-server.component';
import { StreamingServerComponent } from './disk-data/streaming-server/streaming-server.component';


@NgModule({
  declarations: [
    SystemAndServerComponent,
    DiskListComponent,
    DataComponent,
    ActivityComponent,
    DiskDataComponent,
    ChatServerComponent,
    ActiveDataComponent,
    ApiServerComponent,
    AudioCallServerComponent,
    StreamingServerComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    CoreCommonModule,
    NgSelectModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FormsModule,
    SystemServerRoutingModule,
    TranslateModule,
    SharedModule,
    NgApexchartsModule
  ]
})
export class SystemAndServerModule { }
