import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { pinDropData } from "./pin-drop-interface";

@Injectable({
  providedIn: "root",
})
export class MapService {
  constructor(private http: HttpClient) {}

  addPinDrop(data: pinDropData) {
    return this.http.post(`${environment.apiUrl}/add-pin-drop`, data);
  }

  updatePinDrop(id: number, data: pinDropData) {
    return this.http.patch(`${environment.apiUrl}/update-pin-drop/${id}`, data);
  }

  deletePinDrop(id: number) {
    return this.http.delete(`${environment.apiUrl}/delete-pin-drop/${id}`);
  }

  //Get Member location's for selected group
  getMemberLocationById(id: number) {
    return this.http.get(
      `${environment.apiUrl}/group-members-location/${id}`
    );
  }
}
