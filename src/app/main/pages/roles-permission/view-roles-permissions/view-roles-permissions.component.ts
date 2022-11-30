import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolesPermissionsService } from '../roles-permissions.service';
// lanaguage 
import { locale as english } from './i18n/en';
import { locale as arabic } from './i18n/ar';
import { CoreTranslationService } from '@core/services/translation.service';
@Component({
  selector: 'app-view-roles-permissions',
  templateUrl: './view-roles-permissions.component.html',
  styleUrls: ['./view-roles-permissions.component.scss']
})
export class ViewRolesPermissionsComponent implements OnInit {
  public url = this.router.url;
  public urlLastValue;
  public  rolePermissionData;
  constructor(private router: Router,
    private _coreTranslationService: CoreTranslationService,
    private rolesPermissionsService: RolesPermissionsService,) { 
    this._coreTranslationService.translate(english, arabic);
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }



  ngOnInit(): void {
    this.rolesPermissionsService.getRolePermissionByID(this.urlLastValue).subscribe( (res:any) => {
      this.rolePermissionData = res.data;
    });
  }

  back() {
    this.router.navigateByUrl("/roles-permission-management/list");
  }

}
