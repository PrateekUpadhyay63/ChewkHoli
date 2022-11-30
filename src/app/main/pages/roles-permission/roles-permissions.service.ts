import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { rolesListFilter } from "./roles-permissions-list/roles-list-filters-modal";

@Injectable({
  providedIn: "root",
})
export class RolesPermissionsService {
  public onPermissionListChanged: BehaviorSubject<any>;
  public rows: any;
  public onRolesPermissionsListChanged: BehaviorSubject<any>;
  public permissionModuleName: BehaviorSubject<any>;
  // public newRoleNameAdded: BehaviorSubject<any>;
  constructor(
    private _httpClient: HttpClient,
    private _toastrService: ToastrService,
    private ngxLoader: NgxUiLoaderService
  ) {
    // Set the defaults

    this.onRolesPermissionsListChanged = new BehaviorSubject({});
    this.onPermissionListChanged = new BehaviorSubject({});
    //  this.newRoleNameAdded = new BehaviorSubject({});
    this.permissionModuleName = new BehaviorSubject({});
    // this.getRolesPermissionsList({ pageNumber: 1, pageSize: 10});
    // this.getPermissionModule();
  }

  // get All Roles and Permission's List
  getRolesPermissionsList(roleListFilter : rolesListFilter) {
    let url = new URL(`${environment.apiUrl}/get-all-rolepermissions`);
    let paramemters = new URLSearchParams(url.search);
    if (roleListFilter.search) paramemters.set("search", roleListFilter.search);
    if ([0, 1, "0", "1"].includes(roleListFilter.statusId))
      paramemters.set("status", roleListFilter.statusId);
    paramemters.set("page", roleListFilter.pageNumber);
    paramemters.set("size", roleListFilter.pageSize);
    url.search = paramemters.toString();
    return this._httpClient.get(url.toString()).subscribe((response: any) => {
          this.rows = response;
          this.onPermissionListChanged.next(this.rows);
        });
    
  }

  // Update Status of Roles and Permission's
  updateRolesPermissionStatus(id: number, data) {
    return this._httpClient
      .patch(`${environment.apiUrl}/update-role-status/${id}`, data)
      .pipe(
        map((res: any) => {
          this._toastrService.success(res.message, "Top Left!", {
            positionClass: "toast-top-left",
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          // this.getRolesPermissionsList({ pageNumber: 1, pageSize: 10 });
        })
      );
  }

  // Delete Roles and Permission's
  deleteRolesPermission(id: number) {
    return this._httpClient.delete(
      `${environment.apiUrl}/delete-rolepermission/${id}`
    );
  }

  // //get all role name
  // getRoleName() {
  //   return this._httpClient.get(`${environment.apiUrl}/get-roles`).subscribe((response: any) => {
  //     this.newRoleNameAdded.next( response.data);
  // });
  // }

  addNewRole(data) {
    return this._httpClient.post(`${environment.apiUrl}/add-role`, data);
  }

  // get roles and permission by ID
  getRolePermissionByID(id: number) {
    return this._httpClient.get(
      `${environment.apiUrl}/get-rolepermission/${id}`
    );
  }

  //get all the permission's module name list
  getPermissionModule() {
    return this._httpClient.get(`${environment.apiUrl}/get-all-permissions`);
  }

  // add permission's
  addPermission(data) {
    return this._httpClient.post(
      `${environment.apiUrl}/add-rolepermission`,
      data
    );
  }

  //update role's and permission's
  updateRolesPermission(id: number, data) {
    return this._httpClient.patch(
      `${environment.apiUrl}/update-rolepermission/${id}`,
      data
    );
  }

  // export roles and permission  data to excel file
  exportRolePermissionData(data: string) {
    this.ngxLoader.start();
    const myHeaders = new Headers();
    if (localStorage.getItem("currentUser")) {
      let token = JSON.parse(localStorage.getItem("currentUser"));
      myHeaders.append("Authorization", `${token.token}`);
      myHeaders.append("language-id", `EN`);
      if (data === "CSV") {
        fetch(`${environment.apiUrl}/export-rolepermission-csv`, {
          method: "GET",
          headers: myHeaders,
        })
          .then((resp) => resp.arrayBuffer())
          .then((resp) => {
            if (resp.byteLength === 0) {
              // toaster call
              // console.log("error in downloading");
            }
            const file = new Blob([resp], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            // process to auto download it
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = "Roles and Permissions Data" + ".csv";
            link.click();
            this.ngxLoader.stop();
            this.rolePermissionExportToastrSuccess();
          })
          .catch((err) => {
            this.rolesPermissionExportFailedToastr();
          });
      } else if (data === "EXCEL") {
        fetch(`${environment.apiUrl}/export-rolepermission-to-xls`, {
          method: "GET",
          headers: myHeaders,
        })
          .then((resp) => resp.arrayBuffer())
          .then((resp) => {
            if (resp.byteLength === 0) {
              // toaster call
              // console.log("error in downloading");
            }
            const file = new Blob([resp], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            // process to auto download it
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = "Roles and Permissions Data" + ".xlsx";
            link.click();
            this.ngxLoader.stop();
            this.rolePermissionExportToastrSuccess();
          })
          .catch(() => {
            this.rolesPermissionExportFailedToastr();
          });
      }
    } else {
      this.rolesPermissionExportFailedToastr();
    }
  }

  rolePermissionExportToastrSuccess() {
    this._toastrService.success(
      "Roles and Permissions  Data Exported Sucessfully!",
      "Success!",
      {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      }
    );
  }

  rolesPermissionExportFailedToastr() {
    this._toastrService.error("Something went wrong", "Error!", {
      toastClass: "toast ngx-toastr",
      closeButton: true,
    });
  }
}
