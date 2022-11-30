import { Component, OnInit, ViewChild } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
// lanaguage
import { locale as english } from "../i18n/en";
import { locale as arabic } from "../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { Subject } from "rxjs";
import { IntegratedOrganizationiService } from "../integrated-organizationi.service";
import { takeUntil } from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { organizationFilter } from "../organization-filter-modal";
@Component({
  selector: "app-organizations-list",
  templateUrl: "./organizations-list.component.html",
  styleUrls: ["./organizations-list.component.scss"],
})
export class OrganizationsListComponent implements OnInit {
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public selectedOrg = [];
  public searchValue = "";
  private tempData = [];
  private organizationList = [];

  pageIfx = 5;
  pageIfy = 0;
  page = {
    limit: 10,
    count: 0,
    offset: 1,
  };
  public deleteOrgId: number;
  public editOrgId: number;
  public groupName: string;
  currentLoggedInUser;
  public editOrgName: string;
  public isOrgnizationDeletable: boolean;
  private _unsubscribeAll: Subject<any>;
  public addOrgnizationForm: FormGroup;
  public editOrgnizationForm: FormGroup;
  public onBackIcon: boolean = false;
  public onForwardIcon: boolean = true;
  public submitted = false;
  canDeleteUser: boolean = true;
  canViewUser: boolean = true;
  canEditUser: boolean = true;
  canAddUser: boolean = true;
  public orgnizationFilter: organizationFilter;
  public fakeArray;
  public current_page;
  constructor(
    private _coreTranslationService: CoreTranslationService,
    private organizationiService: IntegratedOrganizationiService,
    private modalService: NgbModal,
    private _toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this._coreTranslationService.translate(english, arabic);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Add new Orgnization Form Init.
    this.pageCallback({ offset: 1 });
    this.addOrgnizationForm = this.formBuilder.group({
      OrgnizationName: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ],
      ],
    });
  }
  // convenience getter for easy access to form fields
  get addOrgNameFormControl() {
    return this.addOrgnizationForm.controls;
  }

  // convenience getter for easy access to form fields
  get editOrgNameFormControl() {
    return this.editOrgnizationForm.controls;
  }

  // on search clear
  onSearchClear() {
    this.searchValue = "";
    this.orgnizationFilter = {
      pageNumber: "1",
      pageSize: "10",
    };
    this.organizationiService.getOrgList(this.orgnizationFilter);
  }

  // add new org.
  addNweOrg(data) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addOrgnizationForm.invalid) {
      return;
    }
    data = {
      name: this.addOrgnizationForm.value.OrgnizationName,
    };
    this.organizationiService.addOrg(data).subscribe(
      (res: any) => {
        if (res.success) {
          this._toastrService.success(res.message, "Success!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        }
        this.modalService.dismissAll();
        this.getOrgList();
        this.addOrgnizationForm.reset();
        this.submitted = false;
      },
      (err) => {
        this.modalService.dismissAll();
        this.addOrgnizationForm.reset();
        this._toastrService.error(err.error.message, "Error!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.submitted = false;
      }
    );
  }

  checkPermission() {
    if (this.currentLoggedInUser.Role.id != 5) {
      this.currentLoggedInUser.Role.permissions.forEach((element) => {
        if (element.name === "Organization") {
          this.canViewUser = element.view;
          this.canEditUser = element.edit;
          this.canAddUser = element.add;
          this.canDeleteUser = element.delete;
        }
      });
    }
  }

  // Delete Org. modal Open
  modalOpenDeleteOrg(modalDanger, id: number, name, deletable: boolean) {
    this.deleteOrgId = id;
    this.groupName = name;
    this.isOrgnizationDeletable = deletable;
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: "modal modal-danger",
    });
  }

  // Edit Org. modal Open
  modalOpenEditOrg(modalDanger, id: number, name) {
    this.editOrgId = id;
    this.editOrgName = name;
    // Edit Orgnization Form Init.
    this.editOrgnizationForm = this.formBuilder.group({
      OrgnizationNameEdit: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ],
      ],
    });

    this.editOrgnizationForm.controls["OrgnizationNameEdit"].setValue(
      this.editOrgName
    );
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: "modal modal-primary",
    });
  }

  // Add Org. modal Open
  modalOpenAddOrg(modalDanger) {
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: "modal modal-primary",
    });
  }

  // Delete  organization
  deleteOrg() {
    this.organizationiService
      .deleteOrg(this.deleteOrgId)
      .subscribe((res: any) => {
        this._toastrService.success(res.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.modalService.dismissAll();
        this.getOrgList();
      });
  }

  //edit organization
  UpdateOrgName() {
    this.submitted = true;
    if (this.editOrgnizationForm.invalid) {
      return;
    }
    let data = {
      name: this.editOrgnizationForm.value.OrgnizationNameEdit,
    };
    this.organizationiService
      .editOrg(this.editOrgId, data)
      .subscribe((res: any) => {
        this._toastrService.success(res.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.modalService.dismissAll();
        this.getOrgList();
      });
  }

  pagination(page) {
    this.page.offset = page;
    this.getOrgList();
  }

  pageNext() {
    this.onBackIcon = true;
    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getOrgList();
    }
    if (this.page.offset >= this.page.count) {
      this.onForwardIcon = false;
    }
  }

  pagePrev() {
    this.onForwardIcon = true;
    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getOrgList();
      this.onBackIcon = true;
    }
    if (this.page.offset <= 1) {
      this.onBackIcon = false;
    }
  }
  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.getOrgList();
  }

  getOrgList() {
    let params: organizationFilter = {
      pageNumber: this.page.offset.toString(),
      pageSize: this.page.limit.toString(),
    };
    if (this.searchValue) params.search = this.searchValue;
    this.organizationiService.getOrgList(params);
    this.organizationiService.onOrganizationListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        if (response) {
          this.current_page = response.current_page || 0;
          this.page.count = response.page_count || 0;
          this.fakeArray = new Array(response.page_count || 0);
          this.rows = response.data || [];
          this.tempData = this.rows;
        }
      });
  }

  // on Organization search
  onOrganizationSearch() {
    this.orgnizationFilter = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
    };
    this.organizationiService.getOrgList(this.orgnizationFilter);
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
