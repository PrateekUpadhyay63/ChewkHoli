import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LiveComponent} from './live/live.component';
import {RecordingsComponent} from './recordings/recordings.component';
import {SettingsComponent} from './settings/settings.component';
import { StreamComponent } from './stream.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'stream',
    pathMatch: 'full'
  },
  {
      path: 'stream',
      component: StreamComponent
    }, 

  {
    path: 'settings',
    component: SettingsComponent
  }, 
  {
    path: 'live',
    component: LiveComponent
  }, 
  {
    path: 'recordings',
    component: RecordingsComponent
  }, 
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreamRoutingModule { }
