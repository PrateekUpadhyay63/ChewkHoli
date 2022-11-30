import { Component, OnInit, ViewChild } from "@angular/core";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SystemServerManagementService } from "../../system-server.service";
import { ValueCompare } from "./value-compare";
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { diskListFilter } from "./disk-list-filter.modal";

@Component({
  selector: "app-disk-list",
  templateUrl: "./disk-list.component.html",
  styleUrls: ["./disk-list.component.scss"],
})
export class DiskListComponent implements OnInit {
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private _unsubscribeAll: Subject<any>;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = "";
  public organizationName: any[] = [];
  public addDiskSpaceForm: FormGroup;
  public editDiskSpaceForm: FormGroup;
  public submitted: boolean = false;
  public currentRowId: number;
  public currentRowOrgName: string;
  public totalspace: number = 0;
  public usedspace: number = 0;
  public onBackIcon: boolean = false;
  public onForwardIcon: boolean = true;
  public tottalSpaceError: boolean = false;
  page = {
    limit: 10,
    count: 0,
    offset: 1,
  };
  private userData = [];
  currentLoggedInUser;
  canDeleteUser: boolean = true;
  canViewUser: boolean = true;
  canEditUser: boolean = true;
  canAddUser: boolean = true;
  public diskListFilter: diskListFilter;
  constructor(
    private systemAndServerSvc: SystemServerManagementService,
    private fb: FormBuilder,
    private _toastrService: ToastrService,
    private modalService: NgbModal,
    private SystemServerManagementService: SystemServerManagementService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._unsubscribeAll = new Subject();
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.getAllDiskList();
    this.getAllOrgList();
    this.addDiskSpaceFormInit();
  }

  // get All organization List
  getAllOrgList() {
    this.systemAndServerSvc.getOrgList().subscribe((res: any) => {
      this.organizationName = res.data;
    });
  }

  // Add Disk Space Form
  addDiskSpaceFormInit() {
    this.addDiskSpaceForm = this.fb.group(
      {
        organization_id: [null, [Validators.required]],
        total_space: ["", [Validators.required, Validators.min(1)]],
        available_space: ["", [Validators.required]],
        used_space: ["", [Validators.required, Validators.min(1)]],
      },
      {
        validator: ValueCompare("total_space", "used_space"),
      }
    );
  }
  // convenience getter for easy access to form fields
  get formC() {
    return this.addDiskSpaceForm.controls;
  }
  get EditformC() {
    return this.editDiskSpaceForm.controls;
  }

  // on search clear
  onSearchClear() {
    this.searchValue = "";
    this.diskListFilter = {
      pageNumber: "1",
      pageSize: "10",
    };
    this.SystemServerManagementService.getDiskSpace(this.diskListFilter);
  }

  // On Disk Organization search
  onDiskListSearch() {
    this.diskListFilter = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
    };
    this.SystemServerManagementService.getDiskSpace(this.diskListFilter);
  }

  checkPermission() {
    if (this.currentLoggedInUser.Role.id != 5) {
      this.currentLoggedInUser.Role.permissions.forEach((element) => {
        if (element.name === "System & Server") {
          this.canViewUser = element.view;
          this.canEditUser = element.edit;
          this.canAddUser = element.add;
          this.canDeleteUser = element.delete;
        }
      });
    }
  }

  // Add Disk Space Modal Open Handler
  addNewDiskSpace(modalAddDisk) {
    this.modalService.open(modalAddDisk, {
      centered: true,
      backdrop: false,
      size: "lg",
      windowClass: "modal modal-primary",
    });
  }

  // Delete Disk Space Modal Open Handler
  deleteDiskSpaceModal(modalDeleDiskSpace, data) {
    this.currentRowOrgName = data.Organization.name;
    this.currentRowId = data.id;
    this.modalService.open(modalDeleDiskSpace, {
      centered: true,
      // backdrop: false,
      // size:'lg',
      windowClass: "modal modal-primary",
    });
  }

  // Edit Disk Space Modal Open Handler
  editDiskModalOpen(EditDiskModal, data) {
    this.editDiskSpaceForm = this.addDiskSpaceForm;
    this.currentRowId = data.id;
    this.totalspace = data.total_space;
    this.usedspace = data.used_space;
    this.editDiskSpaceForm.setValue({
      organization_id: data.Organization.id,
      total_space: data.total_space,
      available_space: data.available_space,
      used_space: data.used_space,
    });
    this.modalService.open(EditDiskModal, {
      centered: true,
      backdrop: false,
      size: "lg",
      windowClass: "modal modal-primary",
    });
  }

  totalSpaceChange(eve) {
    if (eve.target.value == 0) {
      this.tottalSpaceError = true;
    } else this.tottalSpaceError = false;
    this.totalspace = eve.target.value;
    let avail = this.totalspace - this.usedspace;
    this.addDiskSpaceForm.patchValue({ available_space: avail });
    this.editDiskSpaceForm.patchValue({ available_space: avail });
  }

  usedSpaceChange(eve) {
    this.usedspace = eve.target.value;
    let avail = this.totalspace - this.usedspace;
    this.addDiskSpaceForm.patchValue({ available_space: avail });
    this.editDiskSpaceForm.patchValue({ available_space: avail });
  }

  //Disk Space Submit
  onAddNewDispSpaceSubmit() {
    this.submitted = true;
    if (this.addDiskSpaceForm.invalid) return;
    let payload;
    payload = {
      organization_id: this.addDiskSpaceForm.value.organization_id,
      total_space: this.addDiskSpaceForm.value.total_space,
      available_space: this.addDiskSpaceForm.value.available_space,
      used_space: this.addDiskSpaceForm.value.used_space,
    };
    this.systemAndServerSvc.addDiskSpace(payload).subscribe((res: any) => {
      this._toastrService.success(res.message, "Success!", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      this.modalService.dismissAll();
      this.addDiskSpaceForm.reset();
      this.getAllDiskList();
      this.submitted = false;
    });
  }

  //Edit Disk Space Submit
  onEditDispSpaceSubmit() {
    this.submitted = true;
    if (this.addDiskSpaceForm.invalid) return;
    let payload;
    payload = {
      organization_id: this.addDiskSpaceForm.value.organization_id,
      total_space: this.addDiskSpaceForm.value.total_space,
      available_space: this.addDiskSpaceForm.value.available_space,
      used_space: this.addDiskSpaceForm.value.used_space,
    };
    this.systemAndServerSvc
      .updateDiskSpace(this.currentRowId, payload)
      .subscribe((res: any) => {
        this._toastrService.success(res.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.modalService.dismissAll();
        this.addDiskSpaceForm.reset();
        this.getAllDiskList();
        this.submitted = false;
      });
  }

  pagination(page) {
    this.page.offset = page;
    this.getAllDiskList();
  }

  pageNext() {
    this.onBackIcon = true;
    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getAllDiskList();
    }
    if (this.page.offset >= this.page.count) {
      this.onForwardIcon = false;
    }
  }

  pagePrev() {
    this.onForwardIcon = true;
    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getAllDiskList();
      this.onBackIcon = true;
    }
    if (this.page.offset <= 1) {
      this.onBackIcon = false;
    }
  }

  fakeArray;
  current_page;
  getAllDiskList() {
    let params: diskListFilter = {
      pageNumber: this.page.offset.toString(),
      pageSize: this.page.limit.toString(),
    };
    if (this.searchValue) params.search = this.searchValue;
    this.SystemServerManagementService.getDiskSpace(params);
    this.SystemServerManagementService.onStreamingDeviceListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        if (response) {
          this.current_page = response.current_page || 0;
          this.page.count = response.page_count || 0;
          this.fakeArray = new Array(response.page_count || 0);
          this.rows = response.data || [];
        }
      });
  }

  // Delete Disk space
  deleteDiskSpace() {
    this.systemAndServerSvc
      .deleteDiskSpace(this.currentRowId)
      .subscribe((res: any) => {
        this._toastrService.success(res.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.modalService.dismissAll();
        this.addDiskSpaceForm.reset();
        this.getAllDiskList();
        this.submitted = false;
      });
  }
}
