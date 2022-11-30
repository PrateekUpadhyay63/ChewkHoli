import { NgModule } from '@angular/core';

import { FilterPipe } from '@core/pipes/filter.pipe';

import { InitialsPipe } from '@core/pipes/initials.pipe';

import { SafePipe } from '@core/pipes/safe.pipe';
import { StripHtmlPipe } from '@core/pipes/stripHtml.pipe';
import { SecurePipe } from './imageauthorisation.pipe';
import { TruncatePipe } from './truncate.pipe';
import { CustomDatePipe } from './custom-date.pipe';


@NgModule({
  declarations: [InitialsPipe, FilterPipe, StripHtmlPipe, SafePipe, TruncatePipe, SecurePipe, CustomDatePipe],
  imports: [],
  exports: [InitialsPipe, FilterPipe, StripHtmlPipe, SafePipe, TruncatePipe, SecurePipe, CustomDatePipe]
})
export class CorePipesModule {}
