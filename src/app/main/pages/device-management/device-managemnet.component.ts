import { Component, OnInit } from '@angular/core';
import { locale as english } from '../device-management/vehicles/i18n/en';
import { locale as arabic } from '../device-management/vehicles/i18n/ar';
import { CoreTranslationService } from '@core/services/translation.service';
import { TransferAuthorityService } from './../transfer-authority/transfer-authority.service';
@Component({
  selector: 'app-device-managemnet',
  templateUrl: './device-managemnet.component.html',
  styleUrls: ['./device-managemnet.component.scss']
})
export class DeviceManagemnetComponent implements OnInit {

  constructor(private _coreTranslationService: CoreTranslationService,
    private transferAuthoritySvc: TransferAuthorityService)
     {this._coreTranslationService.translate(english, arabic); }

  ngOnInit(): void {
  }

}
