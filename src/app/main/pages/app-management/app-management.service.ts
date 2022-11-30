import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class AppManagementService {
  constructor(private http: HttpClient) {}

  // get device data
  getDeviceData() {
    return this.http.get(`${environment.apiUrl}/mobile/force-upgrade`);
  }

  // Update device by id
  updateDeice(id: number, data) {
    return this.http.patch(
      `${environment.apiUrl}/mobile/app-version/${id}`,
      data
    );
  }
}
