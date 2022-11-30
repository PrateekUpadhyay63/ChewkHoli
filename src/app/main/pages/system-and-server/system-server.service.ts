import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { BehaviorSubject } from "rxjs";
import { activityListingFilter } from "./activity/activity-filters-modal";
import { dataFilter } from "./data/data-filter-modal";
import { diskListFilter } from "./disk/disk-list/disk-list-filter.modal";

@Injectable({
  providedIn: "root",
})
export class SystemServerManagementService {
  public rows: any;
  public onStreamingDeviceListChanged: BehaviorSubject<any>;
  public onGetAllMemberGroupChanged: BehaviorSubject<any>;
  public onGroupListingMediaChange: BehaviorSubject<any>;

  constructor(private http: HttpClient, private ngxLoader: NgxUiLoaderService) {
    this.onStreamingDeviceListChanged = new BehaviorSubject({});
    this.onGetAllMemberGroupChanged = new BehaviorSubject({});
    this.onGroupListingMediaChange = new BehaviorSubject({});
  }

  /* ------------- Disk Space API start -------------  */
  //get all organization list
  getOrgList() {
    return this.http.get(`${environment.apiUrl}/get-organization`);
  }

  // get all disk space list
  getDiskSpace(diskListFilter?: diskListFilter) {
    let url = new URL(`${environment.apiUrl}/get-diskspace`);
    let paramemters = new URLSearchParams(url.search);
    if (diskListFilter.search) paramemters.set("search", diskListFilter.search);
    paramemters.set("page", diskListFilter.pageNumber);
    paramemters.set("size", diskListFilter.pageSize);
    url.search = paramemters.toString();
    return this.http.get(url.toString()).subscribe((response: any) => {
      this.rows = response;
      this.onStreamingDeviceListChanged.next(this.rows);
    });
  }

  // delete disk space
  deleteDiskSpace(id: number) {
    return this.http.delete(`${environment.apiUrl}/delete-diskspace/${id}`);
  }

  // add new disk space
  addDiskSpace(data) {
    return this.http.post(`${environment.apiUrl}/add-diskspace`, data);
  }

  //update disk space
  updateDiskSpace(id: number, data) {
    return this.http.patch(
      `${environment.apiUrl}/update-diskspace/${id}`,
      data
    );
  }
  /* ------------- Disk Space API end -------------  */
  //Server Data
  getServerData(serverType:string) {
    return this.http.get(`${environment.apiUrl}/server-data?type=${serverType}`);
  }

  // Server Band Width
  getServerBandWidth(serverType:string) {
    return this.http.get(
      `${environment.apiUrl}/server-bandwidth?type=${serverType}`
    );
  }
  // Get Active groups
  getActiveGroupData() {
    return this.http.get(`${environment.apiUrl}/active-groups`);
  }

  //Get Active user data
  getActiveUserData() {
    return this.http.get(`${environment.apiUrl}/active-users`);
  }

  //Get Currently runing Audio call and live streaming.
  getCurrentCallAndStreaming() {
    return this.http.get(`${environment.apiUrl}/active-calls-streams`);
  }

  // Get live streaming server status
  getLiveStreamingServerStatus() {
    return this.http.get(`${environment.liveStreamServrUrl}`,  {observe: 'response'})
  }
  /*----------------------Disk Data --------------------*/

  /* ---------------------------End of Disk Data--------------------- */

  /* ------------- Activity API start -------------  */

  getAllGroupMembers(activitFilter: activityListingFilter) {
    let url = new URL(`${environment.apiUrl}/get-all-group-members`);
    let paramemters = new URLSearchParams(url.search);
    if (activitFilter.groupId)
      paramemters.set("groupId", activitFilter.groupId);
    if (activitFilter.roleId) paramemters.set("roleId", activitFilter.roleId);
    if ([1, 2, 3, "3", "1", "2"].includes(activitFilter.statusId))
      paramemters.set("statusId", activitFilter.statusId);
    paramemters.set("page", activitFilter.pageNumber);
    paramemters.set("size", activitFilter.pageSize);
    url.search = paramemters.toString();
    return this.http.get(url.toString()).subscribe((response: any) => {
      this.rows = response;
      this.onGetAllMemberGroupChanged.next(this.rows);
    });
  }

  /* ------------- Activity API end -------------  */

  /* ------------- data API start -------------  */

  getGroupMediaListing(dataFilters: dataFilter) {
    let url = new URL(`${environment.apiUrl}/get-groups`);
    let paramemters = new URLSearchParams(url.search);
    if (dataFilters.search) paramemters.set("search", dataFilters.search);
    if (dataFilters.mediaType)
      paramemters.set("media_type", dataFilters.mediaType);
    paramemters.set("page", dataFilters.pageNumber);
    paramemters.set("size", dataFilters.pageSize);
    url.search = paramemters.toString();
    return this.http.get(url.toString()).subscribe((response: any) => {
      this.rows = response;
      this.onGroupListingMediaChange.next(this.rows);
    });
  }

  getGroupAattachment(id, media_type?) {
    let url = new URL(`${environment.apiUrl}/get-groupdata/${id}`);
    let paramemters = new URLSearchParams(url.search);
    if (media_type) paramemters.set("media_type", media_type);
    url.search = paramemters.toString();
    return this.http.get(url.toString());
  }

  deteleAttachment(id) {
    return this.http.delete(`${environment.apiUrl}/groupdata/${id}`);
  }
  /* ------------- data API end -------------  */
}
