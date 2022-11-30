import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GetLocalUserService } from "app/shared/services/get-local-user.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { userFilters } from "./user-filter-modal";

@Injectable({
  providedIn: "root",
})
export class UserManagementService {
  public rows: any;
  public onUserListChanged: BehaviorSubject<any>;
  public userData: any;
  public loggedInUserData: any;
  constructor(
    private _httpClient: HttpClient,
    private _toastrService: ToastrService,
    private getLoggedInUserData: GetLocalUserService,
    private ngxLoader: NgxUiLoaderService
  ) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject({});
    this.loggedInUserData = this.getLoggedInUserData.getLoggedInUserData();
  }

  // get user list
  getAlluser(userFilter: userFilters) {
    let url = new URL(`${environment.apiUrl}/users`);
    let paramemters = new URLSearchParams(url.search);
    let checkUserIfLogin = JSON.parse(localStorage.getItem("currentUser"));
    if (checkUserIfLogin.Role.id != "5")
      paramemters.set("createdBy", checkUserIfLogin.id);
    if (userFilter.orgId) paramemters.set("organization_id", userFilter.orgId);
    if (userFilter.search) paramemters.set("search", userFilter.search);
    if (userFilter.roleId) paramemters.set("roleId", userFilter.roleId);
    if (userFilter.statusId) paramemters.set("statusId", userFilter.statusId);
    paramemters.set("page", userFilter.pageNumber);
    paramemters.set("size", userFilter.pageSize);
    url.search = paramemters.toString();
    return this._httpClient.get(url.toString()).subscribe((response: any) => {
      this.rows = response;
      this.onUserListChanged.next(this.rows);
      // this.ngxLoader.stop();
    });
  }

  getAllGroups() {
    return this._httpClient.get(`${environment.apiUrl}/get-all-groups`);
  }

  // add user
  addUser(data: any) {
    return this._httpClient.post(`${environment.apiUrl}/add-user`, data).pipe(
      map((res: any) => {
        this._toastrService.success(res.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        // this.getAlluser({ pageNumber: 1, pageSize: 10});
      })
    );
  }

  // export user list to excel file
  exportUserData(data: string) {
    this.ngxLoader.start();
    const myHeaders = new Headers();
    if (localStorage.getItem("currentUser")) {
      let token = JSON.parse(localStorage.getItem("currentUser"));
      myHeaders.append("Authorization", `${token.token}`);
      myHeaders.append("language-id", `EN`);
      if (data === "CSV") {
        fetch(`${environment.apiUrl}/export-users-csv`, {
          method: "GET",
          headers: myHeaders,
        })
          .then((resp) => resp.arrayBuffer())
          .then((resp) => {
            if (resp.byteLength === 0) {
            }
            const file = new Blob([resp], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            // process to auto download it
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = "User Data" + ".csv";
            link.click();
             this.ngxLoader.stop();
            this.userExportToastr();
          })
          .catch((err) => {
            this.userExportFailedToastr();
          });
      } else if (data === "EXCEL") {
        fetch(`${environment.apiUrl}/export-users-xls`, {
          method: "GET",
          headers: myHeaders,
        })
          .then((resp) => resp.arrayBuffer())
          .then((resp) => {
            if (resp.byteLength === 0) {
            }
            const file = new Blob([resp], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            // process to auto download it
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = "User Data" + ".xlsx";
            link.click();
            this.ngxLoader.stop();
            this.userExportToastr();
          })
          .catch(() => {
            this.userExportFailedToastr();
          });
      }
    } else {
      this.userExportFailedToastr();
    }
  }

  // get user by id
  getUserByID(id: number) {
    return this._httpClient.get(`${environment.apiUrl}/user/${id}`);
  }

  //update user details
  updateUserDetails(id: number, data) {
    return this._httpClient
      .patch(`${environment.apiUrl}/update-user/${id}`, data)
      .pipe(
        map((res: any) => {
          this._toastrService.success(res.message, "Success!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          // this.getAlluser({ pageNumber: 1, pageSize: 10});
        })
      );
  }

  updateUserDetail(id: number, data) {
    return this._httpClient.patch(
      `${environment.apiUrl}/update-user/${id}`,
      data
    );
  }

  updatePassword(data, id) {
    return this._httpClient.patch(
      `${environment.apiUrl}/update-password/${id}`,
      data
    );
  }

  // Delete User
  deleteUser(id: number) {
    return this._httpClient
      .delete(`${environment.apiUrl}/delete-user/${id}`)
      .pipe(
        map((res: any) => {
          this._toastrService.success(res.message, "Success!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        })
      );
  }

  useractivity() {
    return this._httpClient.get(`${environment.apiUrl}/get-activities`);
  }

  // Delete Activity
  MassdeleteActivity(data) {
    return this._httpClient.post(
      `${environment.apiUrl}/mass-delete-activity`,
      data
    );
  }

  // Send invite mail
  sendInviteMailLink(id: number) {
    return this._httpClient
      .get(`${environment.apiUrl}/resend-invitation/${id}`)
      .pipe(
        map((res: any) => {
          this._toastrService.info(res.message, "Info!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        })
      );
  }

  userExportToastr() {
    this._toastrService.success("User Data Exported Sucessfully!", "Success!", {
      toastClass: "toast ngx-toastr",
      closeButton: true,
    });
  }

  userExportFailedToastr() {
    this._toastrService.error("Something went wrong", "Error!", {
      toastClass: "toast ngx-toastr",
      closeButton: true,
    });
  }

  //get user activity by username
  getUserActivity(username: string) {
    return this._httpClient.get(
      `${environment.apiUrl}/get-activity/${username}`
    );
  }

  //get all role name
  getRoleName() {
    return this._httpClient.get(`${environment.apiUrl}/get-roles`);
  }

  getOrgList() {
    return this._httpClient.get(`${environment.apiUrl}/get-organization`);
  }

  //force logout of users
  deleteAllUser(id: number) {
    return this._httpClient
      .delete(`${environment.apiUrl}/clear-session/${id}`)
      .pipe(
        map((res: any) => {
          this._toastrService.success(res.message, "Success!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        })
      );
  }

}
