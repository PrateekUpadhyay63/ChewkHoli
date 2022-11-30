import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';

import { CoreCommonModule } from '@core/common.module';
import { MenuRoutingModule } from './menu-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { TruncatePipe } from '@core/pipes/truncate.pipe';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MenuRoutingModule,
    ContentHeaderModule, 
    TranslateModule, 
    CoreCommonModule,
    ToastrModule
  ],
  providers: []
})
export class MenuModule { }
