import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { BehaviorSubject } from "rxjs";
import { organizationFilter } from "./organization-filter-modal";

@Injectable({
  providedIn: "root",
})
export class IntegratedOrganizationiService {
  public rows: any;
  public onOrganizationListChanged: BehaviorSubject<any>;
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onOrganizationListChanged = new BehaviorSubject({});
  }

  //get all organization list
  getOrgList(orgFilter: organizationFilter) {
    let url = new URL(`${environment.apiUrl}/get-organization`);
    let paramemters = new URLSearchParams(url.search);
    if (orgFilter.search) paramemters.set("search", orgFilter.search);
    paramemters.set("page", orgFilter.pageNumber);
    paramemters.set("size", orgFilter.pageSize);
    url.search = paramemters.toString();
    return this._httpClient.get(url.toString()).subscribe((response: any) => {
      this.rows = response;
      this.onOrganizationListChanged.next(this.rows);
    });
  }

  // Edit organization
  editOrg(id: number, data) {
    return this._httpClient.patch(
      `${environment.apiUrl}/update-organization/${id}`,
      data
    );
  }

  // add organization
  addOrg(data) {
    return this._httpClient.post(
      `${environment.apiUrl}/add-organization`,
      data
    );
  }

  //Delete  organization
  deleteOrg(id: number) {
    return this._httpClient.delete(
      `${environment.apiUrl}/delete-organization/${id}`
    );
  }
}
