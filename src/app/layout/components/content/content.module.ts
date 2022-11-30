import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';

import { ContentComponent } from 'app/layout/components/content/content.component';
import { environment } from 'environments/environment';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderRouterModule, PB_DIRECTION, POSITION, SPINNER } from 'ngx-ui-loader';
const confirg:NgxUiLoaderConfig ={
    "bgsColor": "#97e9d3",
    "bgsOpacity": 0.5,
    "bgsPosition": "center-center",
    "bgsSize": 80,
    "bgsType": "three-strings",
    "blur": 6,
    "delay": 0,
    "fastFadeOut": true,
    "fgsColor": "#97e9d3",
    "fgsPosition": "center-center",
    "fgsSize": 60,
    "fgsType": "three-strings",
    "gap": 24,
    "logoPosition": "center-center",
    "logoSize": 150,
    "logoUrl": "",
    "masterLoaderId": "master",
    "overlayBorderRadius": "0",
    "overlayColor": "rgba(40, 40, 40, 0.8)",
    "pbColor": "red",
    "pbDirection": "ltr",
    "pbThickness": 3,
    "hasProgressBar": false,
    "text": "Loading...",
    "textColor": "#fdf9f9",
    "textPosition": "center-center",
    "maxTime": -1,
    "minTime": 300
  
}
@NgModule({
  declarations: [ContentComponent],
  imports: [RouterModule, CoreCommonModule,
    NgxUiLoaderModule.forRoot(confirg),
  ],
  exports: [ContentComponent]
})
export class ContentModule {}
