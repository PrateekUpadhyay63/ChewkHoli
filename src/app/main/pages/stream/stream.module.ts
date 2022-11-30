import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StreamRoutingModule } from './stream-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { LiveComponent } from './live/live.component';
import { RecordingsComponent } from './recordings/recordings.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StreamComponent } from './stream.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    SettingsComponent,
    LiveComponent,
    RecordingsComponent,
    StreamComponent
  ],
  imports: [
    CommonModule,
    StreamRoutingModule,
    NgbModule,
    CoreCommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SharedModule

  ]
})
export class StreamModule { }
