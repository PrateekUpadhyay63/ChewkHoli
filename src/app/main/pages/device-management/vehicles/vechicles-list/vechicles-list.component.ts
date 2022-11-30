import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { ToastrService } from "ngx-toastr";
import { DeviceManagementService } from "../../device-management.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { locale as english } from "../i18n/en";
import { locale as arabic } from "../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { vehicleListFilters } from "./vehicle-list-filters.modal";

@Component({
  selector: "app-vechicles-list",
  templateUrl: "./vechicles-list.component.html",
  styleUrls: ["./vechicles-list.component.scss"],
})
export class VechiclesListComponent implements OnInit {
  // Decorator
  pageIfx = 5;
  pageIfy = 0;

  page = {
    limit: 10,
    count: 0,
    offset: 0,
  };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public selectedOrganization: string;
  public searchValue = "";
  public vehicleName: string;
  public vehicleDeleteId: number;
  public AddNewVehicle: FormGroup;
  public EditVehicle: FormGroup;
  public onBackIcon: boolean = false;
  public onForwardIcon: boolean = true;
  public canEdit: boolean = true;
  public canAdd: boolean = true;
  public canDelete: boolean = true;
  public uploadProfileImage;
  public vehicle_image;
  public currentRowId;
  public fakeArray;
  public current_page;
  public imageError = false;
  public submitted: Boolean = false;
  public currentLoggedInUser: any;
  public organizationName: any;
  public organizationData: any;
  public groupName = [];
  public edit_row_id: number;
  public vehicleFilter: vehicleListFilters;
  constructor(
    private deviceManagementSvc: DeviceManagementService,
    private _toastrService: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private _coreTranslationService: CoreTranslationService,
  ) {
    this._coreTranslationService.translate(english, arabic);
  }
  ngOnInit(): void {
    this.currentLoggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    this.getAllOrganization();
    this.pageCallback({ offset: 1 });

    this.checkPermission();
    this.AddNewVehicle = this.formBuilder.group({
      vehicle_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      chassis_number: [
        "",
        [
          Validators.required,
          Validators.minLength(17),
          Validators.maxLength(17),
        ],
      ],
      organization_id: [null, [Validators.required]],
      group_ids: [""],
    });
    if (this.currentLoggedInUser.RoleId != 5) {
      this.AddNewVehicle.patchValue({
        organization_id: this.currentLoggedInUser.organization_id,
      });
    }
  }
  // check the permission add, edit and delete
  checkPermission() {
    if (this.currentLoggedInUser.Role.id != 5) {
      this.currentLoggedInUser.Role.permissions.forEach((element) => {
        if (element.name === "Vehicle") {
          this.canEdit = element.edit;
          this.canAdd = element.add;
          this.canDelete = element.delete;
        }
      });
    }
  }

  // get all vehicle lists.
  getAllVehicles() {
    let params: vehicleListFilters = {
      pageNumber: this.page.offset.toString(),
      pageSize: this.page.limit.toString(),
    };
    if (this.searchValue) params.search = this.searchValue;
    if (this.selectedOrganization) params.orgId = this.selectedOrganization;
    this.deviceManagementSvc.getAllVechicles(params);
    this.deviceManagementSvc.onVehicleListChanged.subscribe((res: any) => {
      if (res) {
        this.current_page = res.current_page || 0;
        this.page.count = res.page_count || 0;
        this.fakeArray = new Array(res.page_count || 0);
        if (res.organizations) {
          this.organizationData = res.organizations.filter((n: any) => n);
        }
        this.page.count = res.page_count || 0;
        this.rows = res.data || [];
      }
    });
  }

  pagination(page) {
    this.page.offset = page;
    this.getAllVehicles();
  }

  pageNext() {
    if (this.page.count > 5 && this.page.count - this.current_page > 4) {
      this.pageIfy += 1;
      this.pageIfx += 1;
    }
    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getAllVehicles();
    }
  }

  pagePrev() {
    if (this.pageIfy > 0) {
      this.pageIfy -= 1;
      this.pageIfx -= 1;
    }
    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getAllVehicles();
    }
  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.getAllVehicles();
  }

  getAllOrganization() {
    this.deviceManagementSvc.getOrgList().subscribe((res: any) => {
      this.organizationName = res.data;
    });
  }

  uploadFiles(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        this.vehicle_image = e.target.result;
        if (event.target.files[0].size > 100000) {
          this.imageError = true;
          this.vehicle_image = null;
          this.uploadProfileImage = null;
        } else {
          this.uploadProfileImage = event.target.files[0];
          this.imageError = false;
        }
      };

      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.vehicle_image = null;
      this.uploadProfileImage = null;
    }
  }

  getOrgain(value) {
    return this.organizationName.filter((data) => {
      return data.id == value;
    })[0].name;
  }

  // Get group name and there ID's
  getGroupData() {
    this.deviceManagementSvc.getGroupName().subscribe((res: any) => {
      this.groupName = res.data;
    });
  }

  filterOrganization(event) {
    if (event != null && event) {
      this.selectedOrganization = event.toString();
      this.vehicleFilter = {
        pageNumber: "1",
        pageSize: "10",
        orgId: this.selectedOrganization,
      };
      if (this.searchValue) this.vehicleFilter.search = this.searchValue;
      this.deviceManagementSvc.getAllVechicles(this.vehicleFilter);
    } else {
      this.selectedOrganization = null;
    }
  }

  // Edit modal Open

  editVehicle(modalDanger, data) {
    this.getGroupData();
    // Edit Streaming Device Form Init.
    this.submitted = false;
    this.edit_row_id = data.id;
    this.EditVehicle = this.formBuilder.group({
      vehicle_name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      chassis_number: [
        "",
        [
          Validators.required,
          Validators.minLength(17),
          Validators.maxLength(17),
        ],
      ],
      organization_id: ["", [Validators.required]],
      edit_group_id: [],
    });

    this.currentRowId = data;
    let organi = data.organization_id;
    if (!data.organization_id) {
      organi = this.currentLoggedInUser.organization_id;
    }

    this.EditVehicle.patchValue({
      vehicle_name: data.name,
      chassis_number: data.chassis_number,
      organization_id: parseInt(organi),
      edit_group_id: data.vehicle_groups,
    });

    this.modalService.open(modalDanger, {
      centered: true,
      backdrop: false,
      size: "lg",
      windowClass: "modal modal-primary",
    });
  }

  // On vehicle Detail's Update
  OnEditVehicleData() {
    this.submitted = true;
    let edit_ids = [];
    this.EditVehicle.value.edit_group_id.forEach((element) => {
      edit_ids.push({
        group_id: element.group_id,
      });
    });
    if (this.EditVehicle.invalid || this.imageError) return;
    let dataToSave = new FormData();

    dataToSave.append("name", this.EditVehicle.value.vehicle_name);
    dataToSave.append("chassis_number", this.EditVehicle.value.chassis_number);
    dataToSave.append(
      "organization_id",
      this.EditVehicle.value.organization_id
    );
    dataToSave.append("group_ids", JSON.stringify(edit_ids));
    if (this.vehicle_image) {
      dataToSave.append("profile_pic", this.uploadProfileImage);
    }

    this.onVehicleDataUpdate(dataToSave, this.currentRowId.id);
  }

  onVehicleDataUpdate(values, id) {
    this.deviceManagementSvc.editVehicles(values, id).subscribe(
      (data) => {
        this._toastrService.success(data["message"], "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.uploadProfileImage = undefined;
        this.vehicle_image = undefined;
        this.modalService.dismissAll();
        this.AddNewVehicle.reset();
        this.ngOnInit();
        this.submitted = false;
      },
      (err) => {
        this._toastrService.error(err.error["message"], "Error!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    );
  }

  // On group removed from Device
  onGroupRemoveFromVehicle(item) {
    let payload = {
      group_id: item.group_id,
      vehicle_id: this.edit_row_id,
    };
    this.deviceManagementSvc.deleteVehicleById(payload).subscribe(
      (res: any) => {
        this._toastrService.success(res.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      },
      (err) => {
        this._toastrService.error(err.error.message, "Error!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    );
  }

  // Submit New Vehicle Deatil's
  submitNewVehicleDetails() {
    this.submitted = true;
    if (this.AddNewVehicle.invalid || !this.uploadProfileImage) return;
    let formData = new FormData();
    formData.append("name", this.AddNewVehicle.value.vehicle_name);
    formData.append("chassis_number", this.AddNewVehicle.value.chassis_number);
    formData.append(
      "organization_id",
      this.AddNewVehicle.value.organization_id
    );
    formData.append("profile_pic", this.uploadProfileImage);
    if (this.AddNewVehicle.value.group_ids)
      formData.append(
        "group_ids",
        this.AddNewVehicle.value.group_ids.join(",")
      );
    this.postData(formData);
  }

  cancel() {
    this.submitted = false;
    this.modalService.dismissAll();
    this.AddNewVehicle.reset();
    this.uploadProfileImage = undefined;
    this.vehicle_image = undefined;
    this.imageError = false;
  }

  cancelEdit() {
    this.submitted = false;
    this.modalService.dismissAll();
    this.AddNewVehicle.reset();
    this.uploadProfileImage = undefined;
    this.vehicle_image = undefined;
    this.imageError = false;
  }

  postData(data) {
    this.deviceManagementSvc.addVehicles(data).subscribe(
      (res) => {
        this._toastrService.success(res["message"], "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.uploadProfileImage = undefined;
        this.vehicle_image = undefined;
        this.modalService.dismissAll();
        this.AddNewVehicle.reset();
        this.vehicle_image = undefined;
        this.ngOnInit();
        this.submitted = false;
      },
      (err) => {
        this._toastrService.error(err.error["message"], "Error!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    );
  }

  // on search clear
  onSearchClear() {
    this.searchValue = "";
    this.onFilterClear();
  }

  get formC() {
    return this.AddNewVehicle.controls;
  }
  get formEdit() {
    return this.EditVehicle.controls;
  }

  // on vehicle search
  onVehicleSearch() {
    this.vehicleFilter = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
    };
    if (this.selectedOrganization)
      this.vehicleFilter.orgId = this.selectedOrganization.toString();
    this.deviceManagementSvc.getAllVechicles(this.vehicleFilter);
  }

  // on filtes clear
  onFilterClear() {
    this.vehicleFilter = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
      orgId: this.selectedOrganization,
    };
    this.deviceManagementSvc.getAllVechicles(this.vehicleFilter);
  }
  // Delete modal
  deleteVehicleModal(modalDanger, data) {
    this.vehicleName = data.name;
    this.vehicleDeleteId = data.id;
    this.modalService.open(modalDanger, {
      centered: true,
      // backdrop: false,
      windowClass: "modal modal-danger",
    });
  }

  // Delete Vehicle
  onDeleteVehicle() {
    this.deviceManagementSvc
      .deleteVehicle(this.vehicleDeleteId)
      .subscribe((res: any) => {
        this._toastrService.success(res.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.modalService.dismissAll();
        this.getAllVehicles();
      });
  }

  // Add  modal Open
  addNewVehicleDevice(modal) {
    this.submitted = false;
    this.getGroupData();
    this.modalService.open(modal, {
      centered: true,
      backdrop: false,
      size: "lg",
      windowClass: "modal modal-primary",
    });
  }
}
