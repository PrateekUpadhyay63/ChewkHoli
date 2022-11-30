import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class LocationServiceService {
  constructor(private _httpClient: HttpClient) {}

  //get Group and Id
  getGroupName(id:number) {
    return this._httpClient.get(`${environment.apiUrl}/groups-list?organization_id=${id}`);
  }

  // get user's name and id by group id
  getUserByID(id: number) {
    return this._httpClient.get(
      `${environment.apiUrl}/get-group-members/${id}`
    );
  }

  // get member location by id and date range
  getMemberLocationByDateRange(id: number, data) {
    return this._httpClient.post(
      `${environment.apiUrl}/locations-by-date-range?user_id=${id}`,
      data
    );
  }

  // get streaming device list with location
  getStreamingDeviceLocationById(id: number) {
    return this._httpClient.get(
      `${environment.apiUrl}/streaming-device-location/${id}`
    );
  }

  // get vehicle lists
  getVehiclesListByGroup(id: number) {
    return this._httpClient.get(
      `${environment.apiUrl}/get-group-vehicles/${id}`
    );
  }

  // get vehicle location by date range
  getVehicleLocation(id: number, data) {
    return this._httpClient.post(
      `${environment.apiUrl}/locations-by-vehicle-id?vehicle_id=${id}`,
      data
    );
  }

  //get all organization list
  getOrgList() {
    return this._httpClient.get(`${environment.apiUrl}/organizations-list`);
  }
}
