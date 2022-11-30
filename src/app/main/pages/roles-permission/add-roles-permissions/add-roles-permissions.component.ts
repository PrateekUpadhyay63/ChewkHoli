import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { ToastrService } from "ngx-toastr";
import { RolesPermissionsService } from "../roles-permissions.service";
// lanaguage
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
@Component({
  selector: "app-add-roles-permissions",
  templateUrl: "./add-roles-permissions.component.html",
  styleUrls: ["./add-roles-permissions.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AddRolesPermissionsComponent implements OnInit {
  public role_name;
  public submitted = false;
  public loading = false;
  public mainData: [];
  public role = [];

  @ViewChild("newUserForm") newUserForm: NgForm;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private rolesPermissionsService: RolesPermissionsService,
    private router: Router,
    private _coreTranslationService: CoreTranslationService,
    private _coreSidebarService: CoreSidebarService,
    private _toastrService: ToastrService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  // Toggle the sidebar

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  submit(form) {
    if (form.invalid) {
      return;
    } else {
      let rolePermissionData: any[] = this.mainData;

      let permissionObj: any[] = [];
      rolePermissionData.forEach((item: any) => {
        // if(!!item.view || !!item.edit || !!item.add || !!item.delete) {
        permissionObj.push({
          permissionId: item.id,
          view: !!item.view ? true : false,
          edit: !!item.edit ? true : false,
          add: !!item.add ? true : false,
          delete: !!item.delete ? true : false,
        });
        //  }
      });

      let count = 0;

      for (let index = 0; index < permissionObj.length; index++) {
        if (permissionObj[index]["view"]) count++;
        if (permissionObj[index]["edit"]) count++;
        if (permissionObj[index]["add"]) count++;
        if (permissionObj[index]["delete"]) count++;
      }

      if (count === 0) {
        this._toastrService.error(
          "Please select atleast one permission to add new role",
          "Error!",
          {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          }
        );
        this.loading = false;
        return;
      }

      let payload = {
        permissions: permissionObj,
        role_name: form.value.roleName,
      };
      this.loading = true;
      this.rolesPermissionsService.addPermission(payload).subscribe(
        (res: any) => {
          this.loading = false;
          this.newUserForm.resetForm();
          this.newUserForm.reset();
          this.router.navigateByUrl("/roles-permission-management/list");
          this._toastrService.success(res.message, "Success", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        },
        (err) => {
          this.loading = false;
          // this.toggleSidebar("add-new-role");
          this._toastrService.error(err.error.message, "Error", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        }
      );
    }
  }

  cancel() {
    this.router.navigateByUrl("/roles-permission-management/list");
  }

  ngOnInit(): void {
    // get all module names
    this.rolesPermissionsService.getPermissionModule().subscribe((res: any) => {
      this.mainData = res.data;
      // console.log(this.mainData);
    });

    // get all roles
    // this.rolesPermissionsService.getRoleName();
    // this.rolesPermissionsService.newRoleNameAdded.subscribe((res:any) => {
    //   if(res.length > 0){
    //     this.role = res.filter(ele => ele.id != 2 && ele.id != 5 && ele.id != 1); // remove Super admin and Super user from dropdown.
    //   }
    // })
  }
}
