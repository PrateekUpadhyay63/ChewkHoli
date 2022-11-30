import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GetLocalUserService } from "app/shared/services/get-local-user.service";
import { RestfulService } from "app/shared/services/restful.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { BehaviorSubject } from "rxjs";
import { groupFilters } from "./group-list/group-filter-modal";

@Injectable({
  providedIn: "root",
})
export class GroupManagementService {
  public rows: any;
  public onGroupListChanged: BehaviorSubject<any>;
  private loggedUserData: any;
  constructor(
    private _httpClient: HttpClient,
    private _toastrService: ToastrService,
    private getLoggedInUserData: GetLocalUserService,
    public restFulSvc: RestfulService,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.onGroupListChanged = new BehaviorSubject({});
    this.loggedUserData = this.getLoggedInUserData.getLoggedInUserData();
  }

  // get all group list
  getGroupList(groupFilter: groupFilters) {
    let url = new URL(`${environment.apiUrl}/get-all-groups`);
    let paramemters = new URLSearchParams(url.search);
    if (groupFilter.orgId)
      paramemters.set("organization_id", groupFilter.orgId);
    if (groupFilter.search) paramemters.set("search", groupFilter.search);
    if ([0, 1, "0", "1"].includes(groupFilter.statusId))
      paramemters.set("status", groupFilter.statusId);
    paramemters.set("page", groupFilter.pageNumber);
    paramemters.set("size", groupFilter.pageSize);
    url.search = paramemters.toString();
    return this._httpClient.get(url.toString()).subscribe((response: any) => {
      this.rows = response;
      this.onGroupListChanged.next(this.rows);
    });
  }

  getGroupsOfMedia(media, params) {
    if (!media)
      return this._httpClient.get(
        `${environment.apiUrl}/get-groups?page=${params.pageNumber}&size=${params.pageSize}`
      );
    else
      return this._httpClient.get(
        `${environment.apiUrl}/get-groups/?media_type=${media}&page=${params.pageNumber}&size=${params.pageSize}`
      );
  }

  getGroupAattachment(id) {
    // if(!media) return this._httpClient.get(`${environment.apiUrl}/get-groups`);
    return this._httpClient.get(`${environment.apiUrl}/get-groupdata/${id}`);
  }

  deteleAttachment(id) {
    return this._httpClient.delete(`${environment.apiUrl}/groupdata/${id}`);
  }

  // Delete User
  deleteGroup(id: number) {
    return this._httpClient.delete(`${environment.apiUrl}/delete-group/${id}`);
  }

  //Create new group
  addNewGroup(data) {
    return this._httpClient.post(`${environment.apiUrl}/add-group`, data);
  }

  // Get all sub admin list
  getAllSubAdminLists() {
    if (this.loggedUserData.Role.id != 5) {
      return this._httpClient.get(
        `${environment.apiUrl}/users?roleId=3&organization_id=${this.loggedUserData.Organization.id}`
      );
    } else {
      return this._httpClient.get(
        `${environment.apiUrl}/users?roleId=3&organization_id=${this.loggedUserData.Organization.id}`
      );
    }
  }

  // get end users list
  getAllEndUserLists() {
    //  if(this.loggedUserData.Role.id != 5) {
    //    return this._httpClient.get(`${environment.apiUrl}/users?roleId=1&organization_id=${this.loggedUserData.Organization.id}`)
    //   }
    //   else {
    const loggedUserData = JSON.parse(localStorage.getItem("currentUser")); // get current logged in user details.
    return this._httpClient.get(
      `${environment.apiUrl}/users?roleId=1&organization_id=${loggedUserData.Organization.id}`
    );
    // }
  }

  //get group details by ID
  getGroupDetailsByID(id: number) {
    return this.restFulSvc.get(`${environment.apiUrl}/get-group/${id}`);
  }

  getAllUserDataFOrGroup() {
    return this.restFulSvc.get(`${environment.apiUrl}/users`);
  }

  updateGroupDetails(id: number, data) {
    return this._httpClient.patch(
      `${environment.apiUrl}/update-group/${id}`,
      data
    );
  }

  //new api added for alert level change
  updateAlertLevelDetails(id: number, data) {
    return this._httpClient.patch(
      `${environment.apiUrl}/update-alert-level/${id}`,
      data
    );
  }

  //new api added for dashboard component
  updateGroupDetailsData(id: number, data) {
    return this._httpClient.patch(
      `${environment.apiUrl}/add-group-member/${id}`,
      data
    );
  }
  
  deleteMember(data) {
    return this._httpClient.post(
      `${environment.apiUrl}/delete-group-member`,
      data
    );
  }

  deleteMemberById(id: number) {
    return this._httpClient.delete(
      `${environment.apiUrl}/delete-group-member/${id}`
    );
  }

  getOrgList() {
    return this._httpClient.get(`${environment.apiUrl}/get-organization`);
  }

  //get all sub admin list for requested organization
  getAllSubAdminList(organization_id: number) {
    return this._httpClient.get(
      `${environment.apiUrl}/users?roleId=3&organization_id=${organization_id}`
    );
  }

  //delete organization from group
  deleteOrgFromGroup(organization_id: number, group_id: number) {
    return this._httpClient.delete(
      `${environment.apiUrl}/delete-group-member/${organization_id}/${group_id}`
    );
  }

  //  getGroupDetailsByID(id:number) {
  //    return this._httpClient.get(`${environment.apiUrl}/get-group/${id}`);
  //  }

  // export group data to excel file
  exportGroupData(data: string) {
    this.ngxLoader.start();
    const myHeaders = new Headers();
    if (localStorage.getItem("currentUser")) {
      let token = JSON.parse(localStorage.getItem("currentUser"));
      myHeaders.append("Authorization", `${token.token}`);
      myHeaders.append("language-id", `EN`);
      if (data === "CSV") {
        fetch(`${environment.apiUrl}/export-group-csv`, {
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
            link.download = "Group Data" + ".csv";
            link.click();
            this.ngxLoader.stop();
            this.groupExportToastr();
          })
          .catch((err) => {
            this.groupExportFailedToastr();
          });
      } else if (data === "EXCEL") {
        fetch(`${environment.apiUrl}/export-group-xls`, {
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
            link.download = "Group Data" + ".xlsx";
            link.click();
            this.ngxLoader.stop();
            this.groupExportToastr();
          })
          .catch(() => {
            this.groupExportFailedToastr();
          });
      }
    } else {
      this.groupExportFailedToastr();
    }
  }

  groupExportToastr() {
    this._toastrService.success(
      "Group Data Exported Sucessfully!",
      "Success!",
      {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      }
    );
  }

  groupExportFailedToastr() {
    this._toastrService.error("Something went wrong", "Error!", {
      toastClass: "toast ngx-toastr",
      closeButton: true,
    });
  }
}
