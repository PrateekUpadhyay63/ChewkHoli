import { Component, OnInit, ViewChild } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { SystemServerManagementService } from "../system-server.service";
import { activityListingFilter } from "./activity-filters-modal";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.scss"],
})
export class ActivityComponent implements OnInit {
  pageIfx = 5;
  pageIfy = 0;
  page = {
    limit: 10,
    count: 0,
    offset: 0,
  };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  onForwardIcon = false;
  onBackIcon = false;
  public statusData: any;
  public roleData;
  public ColumnMode = ColumnMode;
  public selectedOption = 10;
  public selectedGroup: string;
  public currentLoggedInUser;
  public selectedRole: string;
  public selectedStatus: string;
  public rows: any;
  public fakeArray;
  public current_page;
  public groupData;
  public userGroupCount;
  public activityListFilter: activityListingFilter;
  constructor(
    private SystemServerManagementService: SystemServerManagementService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.pageCallback({ offset: 1 });
  }

  getActivityListing() {
    let params: activityListingFilter = {
      pageNumber: this.page.offset.toString(),
      pageSize: this.page.limit.toString(),
    };
    if (this.selectedGroup) params.groupId = this.selectedGroup.toString();
    if (this.selectedRole) params.roleId = this.selectedRole.toString();
    if (this.selectedStatus) params.statusId = this.selectedStatus.toString();
    this.SystemServerManagementService.getAllGroupMembers(params);
    this.SystemServerManagementService.onGetAllMemberGroupChanged.subscribe(
      (response) => {
        if (response.data) {
          this.current_page = response.current_page;
          this.page.count = response.page_count;
          if (this.page.count > 5) this.onForwardIcon = true;
          this.fakeArray = new Array(response.page_count);
          this.userGroupCount = response;
          this.rows = response.data.rows;
        }
        if (response.groups) {
          this.groupData = response.groups.filter((n: any) => n);
        }

        if (response.statuses)
          this.statusData = response.statuses.filter((n: any) => n);
        if (response.roles)
          this.roleData = response.roles.filter((n: any) => n);
      }
    );
  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.getActivityListing();
  }

  // Filter By Group Name
  filterByGroup(event) {
    if (event != null && event.id) {
      this.selectedGroup = event.id;
      this.activityListFilter = {
        pageNumber: "1",
        pageSize: "10",
        groupId: this.selectedGroup.toString(),
      };
      if (this.selectedRole)
        this.activityListFilter.roleId = this.selectedRole.toString();
      if (this.selectedStatus)
        this.activityListFilter.statusId = this.selectedStatus.toString();
      this.SystemServerManagementService.getAllGroupMembers(
        this.activityListFilter
      );
    } else {
      this.selectedGroup = null;
    }
  }

  // Filter by role
  filterByRole(event) {
    if (event != null && event.id) {
      this.selectedRole = event.id;
      this.activityListFilter = {
        pageNumber: "1",
        pageSize: "10",
        roleId: this.selectedRole.toString(),
      };
      if (this.selectedGroup)
        this.activityListFilter.groupId = this.selectedGroup.toString();
      if (this.selectedStatus)
        this.activityListFilter.statusId = this.selectedStatus.toString();
      this.SystemServerManagementService.getAllGroupMembers(
        this.activityListFilter
      );
    } else {
      this.selectedRole = null;
    }
  }

  // filter by status
  filterByStatus(event) {
    if (event != null && [1, 2, 3, "3", "1", "2"].includes(event.id)) {
      this.selectedStatus = event.id;
      this.activityListFilter = {
        pageNumber: "1",
        pageSize: "10",
        statusId: this.selectedStatus.toString(),
      };
      if (this.selectedGroup)
        this.activityListFilter.groupId = this.selectedGroup.toString();
      if (this.selectedRole)
        this.activityListFilter.roleId = this.selectedRole.toString();
      this.SystemServerManagementService.getAllGroupMembers(
        this.activityListFilter
      );
    } else {
      this.selectedStatus = null;
    }
  }

  // on filter clear
  onFilterClear() {
    this.activityListFilter = {
      pageNumber: "1",
      pageSize: "10",
      groupId: this.selectedGroup,
      roleId: this.selectedRole,
      statusId: this.selectedStatus,
    };
    this.SystemServerManagementService.getAllGroupMembers(
      this.activityListFilter
    );
  }

  pagination(page) {
    this.page.offset = page;
    this.getActivityListing();
  }

  pageNext() {
    if (this.page.count > 5 && this.page.count - this.current_page > 4) {
      this.pageIfy += 1;
      this.pageIfx += 1;
    }
    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getActivityListing();
    }
  }

  pagePrev() {
    if (this.pageIfy > 0) {
      this.pageIfy -= 1;
      this.pageIfx -= 1;
    }
    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getActivityListing();
    }
  }
}
