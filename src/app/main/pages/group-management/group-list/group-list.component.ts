import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { GroupManagementService } from "../group-management.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

// lanaguage
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { onGroupUpdateSend } from "../../dashboard/chat/utils/group-update";
import { XMPPService } from "../../dashboard/ejab.service";
import { ChatsService } from "../../dashboard/chat/chats.service";
import { groupFilters } from "./group-filter-modal";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.scss"],
})
export class GroupListComponent implements OnInit {
  pageIfy = 0;
  pageIfx = 5;
  page = {
    limit: 10,
    count: 0,
    offset: 0,
  };
  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public groupList = [];
  public deleteGroupId: number;
  public groupName: string;
  public canEditGroup: boolean = true;
  public canAddGroup: boolean = true;
  public canDeleteGroup: boolean = true;
  public canViewGroup: boolean = true;
  public onBackIcon: boolean = false;
  public onForwardIcon: boolean = true;
  public orgnizationData;
  public statusData;
  public onGroupUpdate: onGroupUpdateSend;
  public selectStatus: any = [
    { name: "All", value: "" },
    { name: "Active", value: "Active" },
    { name: "In-active", value: "In-active" },
  ];
  public selectFileType: any = [
    { name: "CSV", value: "CSV" },
    { name: "EXCEL", value: "EXCEL" },
  ];

  public selectedFileType = [];
  public selectedStatus: string;
  public selectedOrgnization: string;
  public searchValue = "";
  public groupFilterData: groupFilters;
  public fakeArray;
  public current_page;
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;
  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;
  constructor(
    private router: Router,
    private groupManagementSvc: GroupManagementService,
    private _coreTranslationService: CoreTranslationService,
    private _toastrService: ToastrService,
    private modalService: NgbModal,
    private xamppSvc: XMPPService,
    private chatsSvc: ChatsService
  ) {
    this._coreTranslationService.translate(english, arabic);
    this._unsubscribeAll = new Subject();
  }

  // on search clear
  onSearchClear() {
    this.searchValue = "";
    this.onFilterClear();
  }

  // on search by
  onSearchByGroup() {
    if ([0, 1, "0", "1"].includes(this.selectedStatus))
      this.groupFilterData.statusId = this.selectedStatus.toString();
    if (this.selectedOrgnization)
      this.groupFilterData.orgId = this.selectedOrgnization.toString();
    this.groupFilterData = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
      orgId: this.selectedOrgnization,
      statusId: this.selectedStatus,
    };
    this.groupManagementSvc.getGroupList(this.groupFilterData);
  }

  // Add new group
  addNewGroup() {
    this.router.navigateByUrl("/group-management/add-group");
  }

  // filter by status
  filterByStatus(event) {
    if (event != null && [0, 1, "0", "1"].includes(event)) {
      this.selectedStatus = event;
      this.groupFilterData = {
        pageNumber: "1",
        pageSize: "10",
        statusId: this.selectedStatus.toString(),
      };
      if (this.searchValue) this.groupFilterData.search = this.searchValue;
      if (this.selectedOrgnization)
        this.groupFilterData.orgId = this.selectedOrgnization.toString();
      this.groupManagementSvc.getGroupList(this.groupFilterData);
    } else {
      this.selectedStatus = null;
    }
  }

  //for downloading group data.
  filterFileType(event) {
    const filter = event ? event.value : "";
    this.groupManagementSvc.exportGroupData(filter);
  }

  // filter by organization
  filterOrganization(event) {
    console.log("eve", event);
    if (event != null && event) {
      this.selectedOrgnization = event;
      this.groupFilterData = {
        pageNumber: "1",
        pageSize: "10",
        orgId: this.selectedOrgnization.toString(),
      };
      if (this.searchValue) this.groupFilterData.search = this.searchValue;
      if ([0, 1, "0", "1"].includes(this.selectedStatus))
        this.groupFilterData.statusId = this.selectedStatus.toString();
      this.groupManagementSvc.getGroupList(this.groupFilterData);
    } else {
      this.selectedOrgnization = null;
    }
  }

  // On  Filter clear
  onFilterClear() {
    this.groupFilterData = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
      orgId: this.selectedOrgnization,
      statusId: this.selectedStatus,
    };
    this.groupManagementSvc.getGroupList(this.groupFilterData);
  }

  // modal Open Danger
  deleteModal(modalDanger, id: number, group_name: string) {
    this.deleteGroupId = id;
    this.groupName = group_name;
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: "modal modal-danger",
    });
  }

  // Delete Single Group
  deleteGroup(id) {
    this.groupManagementSvc.deleteGroup(id).subscribe((res: any) => {
      this._toastrService.success(res.message, "Success!", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      // on Real time group Update
      res.data.members.forEach((element) => {
        this.onGroupUpdate = {
          toGroupJid: res.data.room_jid,
          groupId: res.data.group_id,
          toMemberJid: element.jid,
        };
        this.xamppSvc.onGroupUpdate(this.onGroupUpdate);
      });
      this.modalService.dismissAll();
      this.getGroupList();
    });
  }

  currentLoggedInUser;
  ngOnInit(): void {
    this.currentLoggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    this.pageCallback({ offset: 1 });

    // check weather logged in user has access to edit, add, view and delete User .
    this.currentLoggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.currentLoggedInUser.Role.id != 5) {
      this.currentLoggedInUser.Role.permissions.forEach((element) => {
        if (element.name === "Group") {
          this.canViewGroup = element.view;
          this.canEditGroup = element.edit;
          this.canAddGroup = element.add;
          this.canDeleteGroup = element.delete;
        }
      });
    }
  }

  getGroupList() {
    let params: groupFilters = {
      pageNumber: this.page.offset.toString(),
      pageSize: this.page.limit.toString(),
    };
    if (this.searchValue) params.search = this.searchValue;
    if (this.selectedOrgnization)
      params.orgId = this.selectedOrgnization.toString();
    if ([0, 1, "0", "1"].includes(this.selectedStatus))
      params.statusId = this.selectedStatus.toString();
    this.groupManagementSvc.getGroupList(params);
    this.groupManagementSvc.onGroupListChanged.subscribe((response) => {
      if (response) {
        this.current_page = response.current_page || 0;
        this.page.count = response.page_count || 0;
        this.fakeArray = new Array(response.page_count || 0);

        // console.log(this.fakeArray);
        if (response.organizations)
          this.orgnizationData = response.organizations.filter((n: any) => n);
        if (response.statuses)
          this.statusData = response.statuses.filter((n: any) => n);
        this.page.count = response.page_count || 0;

        this.rows = response.data || [];
        this.groupList = response;
        this.tempData = this.rows;
      }
    });
  }

  pagination(page) {
    this.page.offset = page;
    this.getGroupList();
  }

  pageNext() {
    if (this.page.count > 5 && this.page.count - this.current_page > 4) {
      this.pageIfy += 1;
      this.pageIfx += 1;
    }

    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getGroupList();
    }
  }

  pagePrev() {
    if (this.pageIfy > 0) {
      this.pageIfy -= 1;
      this.pageIfx -= 1;
    }

    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getGroupList();
    }
  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.getGroupList();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
