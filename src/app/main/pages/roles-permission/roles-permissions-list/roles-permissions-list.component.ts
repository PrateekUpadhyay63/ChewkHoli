import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserManagementService } from "../../user-management/user-management.service";
import { Router } from "@angular/router";
import { RolesPermissionsService } from "../roles-permissions.service";
import { ToastrService } from "ngx-toastr";
// lanaguage
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { rolesListFilter } from "./roles-list-filters-modal";
@Component({
  selector: "app-roles-permissions-list",
  templateUrl: "./roles-permissions-list.component.html",
  styleUrls: ["./roles-permissions-list.component.scss"],
})
export class RolesPermissionsListComponent implements OnInit {
  // Public
  pageIfx = 5;
  pageIfy = 0;

  page = {
    limit: 10,
    count: 0,
    offset: 0,
  };
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public rolesPermissionList = [];
  public previousRoleFilter = "";
  public previousPlanFilter = "";
  public previousStatusFilter = "";
  public selectedRoleId: number;
  public roleName: string;
  public onBackIcon: boolean = false;
  public onForwardIcon: boolean = true;
  public roleStatus: string;
  currentLoggedInUser;
  canDeleteUser: boolean = true;
  canViewUser: boolean = true;
  canEditUser: boolean = true;
  canAddUser: boolean = true;
  resorg: any;
  ressta: any;
  resRoles;

  public selectFileType: any = [
    { name: "CSV", value: "CSV" },
    { name: "EXCEL", value: "EXCEL" },
  ];
  public selectedRole = [];
  public selectedStatus: string;
  public selectedFileType = [];
  public searchValue = "";
  public statusData = [];
  public roleListFilter: rolesListFilter;
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private _unsubscribeAll: Subject<any>;
  constructor(
    private rolesPermissionsService: RolesPermissionsService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
    private _toastrService: ToastrService,
    private _coreTranslationService: CoreTranslationService,
    private router: Router
  ) {
    this._unsubscribeAll = new Subject();
    this._coreTranslationService.translate(english, arabic);
  }

  // on search clear
  onSearchClear() {
    this.searchValue = "";
    this.onFilterClear();
  }

  // on role search
  onRoleSearch() {
    this.roleListFilter = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
    };

    if ([0, 1, "0", "1"].includes(this.selectedStatus))
      this.roleListFilter.statusId = this.selectedStatus.toString();
    this.rolesPermissionsService.getRolesPermissionsList(this.roleListFilter);
  }

  checkPermission() {
    if (this.currentLoggedInUser.Role.id != 5) {
      this.currentLoggedInUser.Role.permissions.forEach((element) => {
        if (element.name === "Roles") {
          this.canViewUser = element.view;
          this.canEditUser = element.edit;
          this.canAddUser = element.add;
          this.canDeleteUser = element.delete;
        }
      });
    }
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  addNewRolePermission() {
    this.router.navigateByUrl("roles-permission-management/add");
  }
  /**
   * Filter By Status
   *
   * @param event
   */
  filterByStatus(event) {
    if (event != null && [0, 1].includes(event)) {
      this.selectedStatus = event;
      this.roleListFilter = {
        pageNumber: "1",
        pageSize: "10",
        statusId: this.selectedStatus.toString(),
      };
      if (this.searchValue) this.roleListFilter.search = this.searchValue;
      this.rolesPermissionsService.getRolesPermissionsList(this.roleListFilter);
    } else {
      this.selectedStatus = null;
    }
  }

  onFilterClear() {
    this.roleListFilter = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
      statusId: this.selectedStatus,
    };
    this.rolesPermissionsService.getRolesPermissionsList(this.roleListFilter);
  }

  // Export Roles and permission data.
  filterFileType(event) {
    const filter = event ? event.value : "";
    this.rolesPermissionsService.exportRolePermissionData(filter);
  }

  // Update Role & Permissin modal Open
  updateStatusmodal(
    updateStatusmodalOpen,
    id: number,
    roleName: string,
    status: string
  ) {
    this.selectedRoleId = id;
    this.roleName = roleName;
    this.roleStatus = status;
    // console.log("role", this.roleStatus);
    this.modalService.open(updateStatusmodalOpen, {
      centered: true,
      windowClass: "modal modal-danger",
    });
  }
  // delete Role & Permissin modal Open
  deleteModal(deleteModalOpen, id: number, roleName: string) {
    this.selectedRoleId = id;
    this.roleName = roleName;
    this.modalService.open(deleteModalOpen, {
      centered: true,
      windowClass: "modal modal-danger",
    });
  }

  // edit roles and permission's
  editUser(id: number) {
    this.router.navigateByUrl(`/roles-permission-management/edit/${id}`);
    // this._UserManagementService.getUserByID(id);
  }

  deleteRolePermission(id) {
    this.rolesPermissionsService
      .deleteRolesPermission(this.selectedRoleId)
      .subscribe((res: any) => {
        this.modalService.dismissAll();
        if (res.success) {
          this._toastrService.success(res.message, "Success", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.rolesPermissionsService.getRolesPermissionsList({
            pageNumber: "1",
            pageSize: "10",
          });
        }
        this.modalService.dismissAll();
        this._toastrService.error(res.message, "Error", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      });
  }

  pagination(page) {
    this.page.offset = page;
    this.getRolesPermissionsList();
  }

  pageNext() {
    this.onBackIcon = true;
    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getRolesPermissionsList();
    }
    if (this.page.offset >= this.page.count) {
      this.onForwardIcon = false;
    }
  }

  pagePrev() {
    this.onForwardIcon = true;
    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getRolesPermissionsList();
      this.onBackIcon = true;
    }
    if (this.page.offset <= 1) {
      this.onBackIcon = false;
    }
  }

  fakeArray;
  current_page;
  getRolesPermissionsList() {
    let params: rolesListFilter = {
      pageNumber: this.page.offset.toString(),
      pageSize: this.page.limit.toString(),
    };
    if (this.searchValue) params.search = this.searchValue;
    if (this.selectedStatus) params.statusId = this.selectedStatus.toString();
    this.rolesPermissionsService.getRolesPermissionsList(params);
    this.rolesPermissionsService.onPermissionListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        if (response) {
          this.current_page = response.current_page || 0;
          this.page.count = response.page_count || 0;
          this.fakeArray = new Array(response.page_count || 0);
          this.rows = response.data || [];
          this.page.count = response.page_count || 0;
          this.statusData = response.statuses;
        }
      });
  }

  // Updte status
  updateStatus() {
    let statusBoolean: boolean;
    if (this.roleStatus == "Active") {
      statusBoolean = false;
    } else statusBoolean = true;
    let payload = {
      status: statusBoolean,
    };
    this.rolesPermissionsService
      .updateRolesPermissionStatus(this.selectedRoleId, payload)
      .subscribe((res) => {
        this.modalService.dismissAll();
        this.rolesPermissionsService.getRolesPermissionsList({
          pageNumber: "1",
          pageSize: "10",
        });
      });
  }

  ngOnInit(): void {
    this.pageCallback({ offset: 1 });
  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.getRolesPermissionsList();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.searchValue = "";
    this.selectedStatus = null;
  }
}
