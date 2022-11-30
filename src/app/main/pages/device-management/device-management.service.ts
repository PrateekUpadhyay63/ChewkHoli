import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GetLocalUserService } from "app/shared/services/get-local-user.service";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { streamingDeviceFilter } from "./streaming-devices/streaming-devices-list/streaming-device-filter-modal";
import { vehicleListFilters } from "./vehicles/vechicles-list/vehicle-list-filters.modal";
import { VideoService } from "./video-player/video.service";

@Injectable({
  providedIn: "root",
})
export class DeviceManagementService {
  public loggedInUserData: any;
  public currentVideo = new BehaviorSubject<any>("");
  public onVehicleListChanged: BehaviorSubject<any>;
  public onIPStreamListChanged: BehaviorSubject<any>;
  constructor(
    private http: HttpClient,
    private getLoggedInUserData: GetLocalUserService,
    private videoService: VideoService
  ) {
    this.loggedInUserData = this.getLoggedInUserData.getLoggedInUserData();
    this.onVehicleListChanged = new BehaviorSubject({});
    this.onIPStreamListChanged = new BehaviorSubject({});
  }

  /* ------------Vehicles API Start------------------------ */

  // Get all the vechicles.
  getAllVechicles(vehicleListFilters: vehicleListFilters) {
    let url = new URL(`${environment.apiUrl}/get-all-vehicles`);
    let paramemters = new URLSearchParams(url.search);
    if (this.loggedInUserData.Role.id != "5")
      paramemters.set("organization_id", this.loggedInUserData.Organization.id);
    if (vehicleListFilters.orgId)
      paramemters.set("organization_id", vehicleListFilters.orgId);
    if (vehicleListFilters.search)
      paramemters.set("search", vehicleListFilters.search);
    paramemters.set("page", vehicleListFilters.pageNumber);
    paramemters.set("size", vehicleListFilters.pageSize);
    url.search = paramemters.toString();
    return this.http.get(url.toString()).subscribe((res) => {
      this.onVehicleListChanged.next(res);
    });
  }

  getVechicleById(id: number) {
    return this.http.get(`${environment.apiUrl}/`);
  }

  // Delete Vehicle.
  deleteVehicle(id: number) {
    return this.http.delete(`${environment.apiUrl}/delete-vehicle/${id}`);
  }

  addVehicles(data) {
    return this.http.post(`${environment.apiUrl}/add-vehicle`, data);
  }

  editVehicles(data, id) {
    return this.http.patch(`${environment.apiUrl}/update-vehicle/${id}`, data);
  }

  // Delete Stream Device From Group
  deleteVehicleById(data) {
    return this.http.post(`${environment.apiUrl}/delete-vehicle-group`, data);
  }

  /* ------------Vehicles API End------------------------ */

  /* ------------Streaming Device API Start------------------------ */

  getVideoUrl(url) {
    return this.http.post(`${environment.apiUrl}/videos`, url);
  }

  // Get all the streaming devices.
  getAllStreamingDevices() {
    const loggedUserData = JSON.parse(localStorage.getItem("currentUser")); // get current logged in user details.
    if (loggedUserData.Role.id !== 5) {
      return this.http.get(
        `${environment.apiUrl}/get-all-streaming-devices?organization_id=${loggedUserData.Organization.id}`
      );
    }
    return this.http.get(`${environment.apiUrl}/get-all-streaming-devices`);
  }

  getAllStreamingDevicesparams(ipStreamFilter: streamingDeviceFilter) {
    let url = new URL(`${environment.apiUrl}/get-all-streaming-devices`);
    let paramemters = new URLSearchParams(url.search);
    if (this.loggedInUserData.Role.id != "5")
      paramemters.set("organization_id", this.loggedInUserData.Organization.id);
    if (ipStreamFilter.orgId)
      paramemters.set("organization_id", ipStreamFilter.orgId);
    if (ipStreamFilter.search) paramemters.set("search", ipStreamFilter.search);
    paramemters.set("page", ipStreamFilter.pageNumber);
    paramemters.set("size", ipStreamFilter.pageSize);
    url.search = paramemters.toString();
    return this.http.get(url.toString()).subscribe((res) => {
      this.onIPStreamListChanged.next(res);
    });
  }

  //get all organization list
  getOrgList() {
    return this.http.get(`${environment.apiUrl}/organizations-list`);
  }

  // Add new streaming device.
  addStreamingDevice(data) {
    return this.http.post(`${environment.apiUrl}/add-streaming-devices`, data);
  }

  // Update streaming device.
  updateStreamingDevice(id: number, data) {
    return this.http.patch(
      `${environment.apiUrl}/update-streaming-devices/${id}`,
      data
    );
  }

  // Delete streaming device.
  deleteStreamingDevice(id: number) {
    return this.http.delete(
      `${environment.apiUrl}/delete-streaming-device/${id}`
    );
  }

  //mobile get live streams by group id.
  getLiveStreams(group_id: number) {
    return this.http.get(
      `${environment.apiUrl}/mobile/get-live-streams/${group_id}`
    );
  }

  //get Group and Id
  getGroupName() {
    return this.http.get(`${environment.apiUrl}/groups-list`);
  }

  // get Single stream device data by id
  getStreamDeviceById(id: number) {
    return this.http.get(`${environment.apiUrl}/streaming-device/${id}`);
  }

  // Delete Stream Device From Group
  deleteStreamDeviceById(data) {
    return this.http.post(`${environment.apiUrl}/stream-device-group`, data);
  }

  /* ------------Streaming Device API End------------------------ */

  getGroupMmebersJid(id: number) {
    return this.http.get(`${environment.apiUrl}/group-members-jid/${id}`);
  }
}
