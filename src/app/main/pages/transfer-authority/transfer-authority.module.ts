import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferAuthorityRoutingModule } from './transfer-authority-routing.module';
import { TransferAuthorityComponent } from './transfer-authority/transfer-authority.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TransferAuthorityService } from './transfer-authority.service';
import { CoreDirectivesModule } from '@core/directives/directives';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    TransferAuthorityComponent
  ],
  imports: [
    CommonModule,
    TransferAuthorityRoutingModule,
    NgbModule,
    FormsModule,  
    ReactiveFormsModule,
    NgSelectModule,
    CoreDirectivesModule,
    TranslateModule,
    SharedModule
  ],
  providers: [TransferAuthorityService]
})
export class TransferAuthorityModule { }
