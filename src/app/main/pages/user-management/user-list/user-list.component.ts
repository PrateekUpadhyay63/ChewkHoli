import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

import { async, Observable, of, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {  UserManagementService } from "../user-management.service";
import { Router } from "@angular/router";
import { CoreTranslationService } from "@core/services/translation.service";

// lanaguage
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { userFilters } from "../user-filter-modal";
interface dropdownValue {
  name: string;
  value: string;
}
@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserListComponent implements OnInit {
  // Public
  pageIfx = 5;
  pageIfy = 0;
  page = {
    limit: 10,
    count: 0,
    offset: 0,
  };
  public pageAdvancedNoEllipses = 7;
  public sidebarToggleRef = false;
  public rows = [];
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = "";
  public previousOrganizationFilter = "";
  public previousStatusFilter = "";
  public deleterUserId: number;
  public userName: string;
  resorg: any;
  ressta: any;
  resRoles;
  //  organizationName = [];
  // search
  public selectRole: Observable<dropdownValue[]>;
  public organizationName: Observable<dropdownValue[]>;

  public selectStatus: any = [
    { name: "All", value: "" },
    { name: "Pending", value: "Pending" },
    { name: "Active", value: "Active" },
    { name: "Inactive", value: "Inactive" },
  ];

  public selectFileType: any = [
    { name: "CSV", value: "CSV" },
    { name: "EXCEL", value: "EXCEL" },
  ];

  public selectedRole = [];
  public selectedOrganizationName = [];
  public selectedStatus = [];
  public selectedFileType = [];
  public userTypes = [];
  public searchValue = "";
  public canEditUser: boolean = true;
  public canAddUser: boolean = true;
  public canDeleteUser: boolean = true;
  public canViewUser: boolean = true;
  public currentLoggedInUser;
  public onBackIcon: boolean = false;
  public onForwardIcon: boolean = true;
  public selectedOrgValue: string;
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private userData = [];
  private _unsubscribeAll: Subject<any>;
  public filterData: userFilters;
  public selectedRoleFilter: string;
  public selectedStatusFilter: string;
  constructor(
    private _UserManagementService: UserManagementService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private _coreTranslationService: CoreTranslationService,
    private modalService: NgbModal,
    private router: Router,
    private ngxLoader: NgxUiLoaderService
  ) {
    this._coreTranslationService.translate(english, arabic);
    this._unsubscribeAll = new Subject();
  }

  getPage(event) {}

  ngOnInit(): void {
    this.currentLoggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    this.pageCallback({ offset: 1 });
    this.checkPermission();
  }

  pagination(page) {
    this.page.offset = page;
    this.getAllUsers();
  }

  pageNext() {
    if (this.page.count > 5 && this.page.count - this.current_page > 4) {
      this.pageIfy += 1;
      this.pageIfx += 1;
    }
    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getAllUsers();
    }
  }

  pagePrev() {
    if (this.pageIfy > 0) {
      this.pageIfy -= 1;
      this.pageIfx -= 1;
    }

    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getAllUsers();
    }
  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.getAllUsers();
  }
  fakeArray;
  current_page;
  getAllUsers() {
    let params: userFilters = {
      pageNumber: this.page.offset.toString(),
      pageSize: this.page.limit.toString(),
    };
    if (this.searchValue) {
      params.search = this.searchValue;
    }
    if (this.selectedRoleFilter)
      params.roleId = this.selectedRoleFilter.toString();
    if (this.selectedStatusFilter)
      params.statusId = this.selectedStatusFilter.toString();
    if (this.selectedOrgValue) {
      params.orgId = this.selectedOrgValue.toString();
    }
    this._UserManagementService.getAlluser(params);
    this._UserManagementService.onUserListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        if (response) {
          this.current_page = response.current_page || 0;
          this.page.count = response.page_count || 0;
          this.fakeArray = new Array(response.page_count || 0);
          if (response.organizations)
            this.resorg = response.organizations.filter((n: any) => n);
          if (response.statuses)
            this.ressta = response.statuses.filter((n: any) => n);
          if (response.roles)
            this.resRoles = response.roles.filter((n: any) => n);
          this.page.count = response.page_count || 0;

          this.rows = response.data || [];
          this.tempData = this.rows;
          this.userData = this.rows;
        }
      });
  }

  
  // check weather logged in user has access to edit, add, view and delete User .
  checkPermission() {
    if (this.currentLoggedInUser.Role.id != 5) {
      this.currentLoggedInUser.Role.permissions.forEach((element) => {
        if (element.name === "User") {
          this.canViewUser = element.view;
          this.canEditUser = element.edit;
          this.canAddUser = element.add;
          this.canDeleteUser = element.delete;
        }
      });
    }
  }

  //get all Organization Name
  getAllOrganization() {
    let orgName: dropdownValue[] = [];
    this._UserManagementService.getOrgList().subscribe((res: any) => {
      res.data.forEach((ele: any) => {
        orgName.push({ name: ele.name, value: ele.name });
      });
      orgName.unshift({ name: "All", value: "" });
      this.organizationName = of(orgName);
    });
  }

  // get All Role type.
  getAllUserType() {
    let roles: dropdownValue[] = [];
    this._UserManagementService.getRoleName().subscribe((res: any) => {
      this.userTypes = res.data;
      // filter user typr according logged in user
      if (this.currentLoggedInUser.Role.id != 5 && this.userTypes.length > 0) {
        // if logged in user is other than Super Admin then logged in user not allowed to create same level user
        this.userTypes.forEach((ele: any) => {
          if (ele.id != 4 && ele.id != 2 && ele.id != 5) {
            roles.push({ name: ele.name, value: ele.name });
          }
        });
      } else {
        this.userTypes.forEach((ele) => {
          if (ele.id != 5 && ele.id != 2) {
            roles.push({ name: ele.name, value: ele.name });
          }
        }); // All avaible user will be shown except Super User.
      }
      roles.unshift({ name: "All", value: "" });
      this.selectRole = of(roles);
    });
  }

  // on user search
  nameUpdate(event) {
    if (this.selectedRoleFilter)
    this.filterData.roleId = this.selectedRoleFilter.toString();
  if (this.selectedOrgValue)
    this.filterData.orgId = this.selectedOrgValue.toString();
  if (this.selectedStatusFilter)
    this.filterData.statusId = this.selectedStatusFilter.toString();
    this.filterData = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
      orgId: this.selectedOrgValue,
      roleId: this.selectedRoleFilter,
      statusId: this.selectedStatusFilter,
    };

    this._UserManagementService.getAlluser(this.filterData);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  // on search clear
  onSearchClear() {
    this.searchValue = '';
    this.onFilterClear();
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByRole(event) {
    if (event != null && event.id) {
      this.selectedRoleFilter = event.id;
      this.filterData = {
        pageNumber: "1",
        pageSize: "10",
        roleId: this.selectedRoleFilter.toString(),
      };
      if (this.searchValue) this.filterData.search = this.searchValue;
      if (this.selectedOrgValue)
        this.filterData.orgId = this.selectedOrgValue.toString();
      if (this.selectedStatusFilter)
        this.filterData.statusId = this.selectedStatusFilter.toString();
      this._UserManagementService.getAlluser(this.filterData);
    }else {
      this.selectedRoleFilter = null;
    }
  }

  /**
   * Filter By Status
   *
   * @param event
   */
  filterByStatus(event) {
    if (event != null && event.id) {
      this.selectedStatusFilter = event.id;
      this.filterData = {
        pageNumber: "1",
        pageSize: "10",
        statusId: this.selectedStatusFilter.toString(),
        // roleId: this.selectedRoleFilter,
        // search: this.searchValue,
        // orgId: this.selectedOrgValue,
      };
      if (this.searchValue) this.filterData.search = this.searchValue;
      if (this.selectedRoleFilter)
        this.filterData.roleId = this.selectedRoleFilter.toString();
      if (this.selectedOrgValue)
        this.filterData.orgId = this.selectedOrgValue.toString();
      this._UserManagementService.getAlluser(this.filterData);
    }else {
      this.selectedStatusFilter = null;
    }
  }

  // On filter select
  filterOrganization(event) {
    if (event != null && event.id) {
      this.selectedOrgValue = event.id;
      this.filterData = {
        pageNumber: "1",
        pageSize: "10",
        orgId: this.selectedOrgValue.toString(),
        // statusId: this.selectedStatusFilter,
        // roleId: this.selectedRoleFilter,
        // search: this.searchValue,
      };
      if (this.selectedRoleFilter)
      this.filterData.roleId = this.selectedRoleFilter.toString();
    if (this.searchValue) this.filterData.search = this.searchValue;
    if (this.selectedStatusFilter)
      this.filterData.statusId = this.selectedStatusFilter.toString();
      this._UserManagementService.getAlluser(this.filterData);
    }else {
      this.selectedOrgValue = null;
    }
  }

  // On  Filter clear
  onFilterClear() {
    this.filterData = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
      orgId: this.selectedOrgValue,
      roleId: this.selectedRoleFilter,
      statusId: this.selectedStatusFilter,
    };
    this._UserManagementService.getAlluser(this.filterData);
  }

  filterFileType(event) {
    const filter = event ? event.value : "";
    this._UserManagementService.exportUserData(filter);
  }

  // modal Open Danger
  modalOpenDanger(modalDanger, id: number, first_name, last_name) {
    this.deleterUserId = id;
    this.userName = `${first_name}  ${last_name}`;
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: "modal modal-danger",
    });
  }
  // user edit
  editUser(id: number) {
    this.router.navigateByUrl(`/user-management/user-edit/${id}`);
  }

  // Delete Single User
  deleteUser(id) {
    this._UserManagementService.deleteUser(id).subscribe((res) => {
      this.modalService.dismissAll();
      this.getAllUsers();
    });
  }

  //Add new User Route
  addNweUser() {
    this.router.navigateByUrl("/user-management/add-user");
  }

  onPagedestroy() {
    this.selectedRoleFilter = null;
    this.selectedStatusFilter = null;
    this.selectedOrgValue = null;
    this.searchValue = null;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.onPagedestroy();
  }
}
