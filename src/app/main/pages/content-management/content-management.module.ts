import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ContentManagementComponent } from './content-management.component';

import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
  { path: '', component: ContentManagementComponent }
];

@NgModule({
  declarations: [
    ContentManagementComponent
  ],
  imports: [
    CommonModule,NgSelectModule,
    RouterModule.forChild(routes),
    FormsModule,
    TranslateModule,
    SharedModule
  ]
})
export class ContentManagementModule { }
