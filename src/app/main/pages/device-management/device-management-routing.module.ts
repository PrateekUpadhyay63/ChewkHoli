import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceManagemnetComponent } from './device-managemnet.component';
import { AddStreamingDeviceComponent } from './streaming-devices/add-streaming-device/add-streaming-device.component';
import { EditStreamingDeviceComponent } from './streaming-devices/edit-streaming-device/edit-streaming-device.component';
import { StreamingDevicesListComponent } from './streaming-devices/streaming-devices-list/streaming-devices-list.component';
import { AddVechiclesComponent } from './vehicles/add-vechicles/add-vechicles.component';
import { EditVechiclesComponent } from './vehicles/edit-vechicles/edit-vechicles.component';
import { VechiclesListComponent } from './vehicles/vechicles-list/vechicles-list.component';
import { VideoWraperComponent } from './video-player/video-wraper/video-wraper.component';


const routes: Routes = [

  {
    path: 'vehicles',
    component: VechiclesListComponent
  }, 
  {
    path: 'camera',
    component: StreamingDevicesListComponent
  },

  /* Vehicles Routing Config. */
  {
    path: 'add-ehicle',
    component: AddVechiclesComponent
  },
  {
    path: 'edit-vehicle/:id',
    component: EditVechiclesComponent
  },

  /* Streaming Devices Routing Config. */
  {
    path: 'add-streaming-device',
    component: AddStreamingDeviceComponent
  },
  {
    path: 'edit-streaming-device/:id',
    component: EditStreamingDeviceComponent
  },
  {
    path: 'video-player',
    component: VideoWraperComponent
  }, 
  {
    path: "view-stream/:link/:pid", 
    component: VideoWraperComponent
  }, 
  {
    path: "live-stream/:link", 
    component: VideoWraperComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceManagementRoutingModule { }
