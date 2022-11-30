import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceManagementRoutingModule } from './device-management-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { DeviceManagemnetComponent } from './device-managemnet.component';
import { VechiclesListComponent } from './vehicles/vechicles-list/vechicles-list.component';
import { AddVechiclesComponent } from './vehicles/add-vechicles/add-vechicles.component';
import { EditVechiclesComponent } from './vehicles/edit-vechicles/edit-vechicles.component';
import { StreamingDevicesListComponent } from './streaming-devices/streaming-devices-list/streaming-devices-list.component';
import { AddStreamingDeviceComponent } from './streaming-devices/add-streaming-device/add-streaming-device.component';
import { EditStreamingDeviceComponent } from './streaming-devices/edit-streaming-device/edit-streaming-device.component';
import { NgxDatatableModule,  } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceManagementService } from './device-management.service';
import { VideoWraperComponent } from './video-player/video-wraper/video-wraper.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MinMaxPopupModule, MinMaxDirective } from 'min-max-popup';
import { ControlVolumeComponent } from './video-player/control-volume/control-volume.component';
import { TimeComponent } from './video-player/time/time.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
@NgModule({
  declarations: [
    DeviceManagemnetComponent,
    VechiclesListComponent,
    AddVechiclesComponent,
    EditVechiclesComponent,
    StreamingDevicesListComponent,
    
    AddStreamingDeviceComponent,
    EditStreamingDeviceComponent,
    VideoWraperComponent,
    ControlVolumeComponent,
    TimeComponent
  ],
  imports: [
    CommonModule,
    DeviceManagementRoutingModule,
    NgbModule,
    CoreCommonModule,
    NgxDatatableModule,
    MinMaxPopupModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    SharedModule
  ],
  providers:[DeviceManagementService,  MinMaxDirective,],
  entryComponents:[VideoWraperComponent]
})
export class DeviceManagementModule { }
