import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { RolesPermissionsService } from '../roles-permissions.service';
// lanaguage 
import { locale as english } from './i18n/en';
import { locale as arabic } from './i18n/ar';
import { CoreTranslationService } from '@core/services/translation.service';
@Component({
  selector: 'app-edit-roles-permissions',
  templateUrl: './edit-roles-permissions.component.html',
  styleUrls: ['./edit-roles-permissions.component.scss']
})
export class EditRolesPermissionsComponent implements OnInit {
 // Public
 public url = this.router.url;
 public urlLastValue;
 public rows;
 public  rolePermissionData:any= [];
 public Data =[] ;
 public submitData: Array<any> = [];
 public submitted = false;
 @ViewChild('newUserForm') newUserForm: NgForm;
 // Private
 private _unsubscribeAll: Subject<any>;

 /**
  * Constructor
  *
  * @param {Router} router
  * @param {UserEditService} _userEditService
  */
 constructor(private router: Router, 
  private _coreTranslationService: CoreTranslationService,
   private rolesPermissionsService: RolesPermissionsService,
  private _toastrService: ToastrService) {
  //  this._unsubscribeAll = new Subject();
  this._coreTranslationService.translate(english, arabic);
   this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
 }

 /**
  * Submit
  *
  * @param form
  */
 submit() {
   
  const dataArray = [{...this.rolePermissionData.rolesDetails}];
  let permissionObj:any =  dataArray.map((item:any)=> {
    delete item.name;
    delete item.id;
    delete item.status;
   item["permissions"] = item.permissions.map((element:any)=> { 
      delete element.Permission
      return element
    });
    return item; 
   });
   let payload = {
     permissions:permissionObj[0].permissions,
    role_name: this.newUserForm.value.roleName
    }
    //  console.log("payload",this.newUserForm.value.roleName);
     this.rolesPermissionsService.updateRolesPermission(+this.urlLastValue,payload).subscribe( (res:any) => {
      //  console.log("update successfully...")
       this.cancel();
       this._toastrService.success(
        res.message,
        'Success', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
     }, 
     (err) => {
      this._toastrService.error(
        err.error.message,
        'Error', {
          toastClass: 'toast ngx-toastr',
          closeButton: true
        });
     }
     
     );
  
 }

 cancel() {
  this.router.navigateByUrl("/roles-permission-management/list");
}
 // Lifecycle Hooks
 // -----------------------------------------------------------------------------------------------------
 /**
  * On init
  */
 ngOnInit(): void {
  this.rolesPermissionsService.getRolePermissionByID(this.urlLastValue).subscribe( (res:any) => {
    this.rolePermissionData = res.data;
    // console.log("roles",this.rolePermissionData);
  });

 }
 
 /**
  * On destroy
  */
 ngOnDestroy(): void {
   // Unsubscribe from all subscriptions
  //  this._unsubscribeAll.next();
  //  this._unsubscribeAll.complete();
 }
}
