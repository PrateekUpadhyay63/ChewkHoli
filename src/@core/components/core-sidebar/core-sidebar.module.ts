import { NgModule } from '@angular/core';

import { CoreSidebarComponent } from '@core/components/core-sidebar/core-sidebar.component';
import { CoreSidebarService } from './core-sidebar.service';

@NgModule({
  declarations: [CoreSidebarComponent],
  exports: [CoreSidebarComponent],
  providers:[CoreSidebarService]
})
export class CoreSidebarModule {}
