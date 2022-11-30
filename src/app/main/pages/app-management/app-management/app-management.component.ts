import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreTranslationService } from "@core/services/translation.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { ToastrService } from "ngx-toastr";
import { AppManagementService } from "../app-management.service";
// lanaguage
import { locale as english } from "../i18n/en";
import { locale as arabic } from "../i18n/ar";
@Component({
  selector: "app-app-management",
  templateUrl: "./app-management.component.html",
  styleUrls: ["./app-management.component.scss"],
})
export class AppManagementComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public editDeviceData: FormGroup;
  public isAndroidEdit: boolean = true;
  public submitted: boolean = false;
  public fileSizeLimit: boolean = false;
  public fileName: string;
  public fileFormat: string = ".apk";
  public applicationFile: File = null;
  constructor(
    private formBuilder: FormBuilder,
    private appMgtSvc: AppManagementService,
    private modalService: NgbModal,
    private _toastrService: ToastrService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.getAppDevicelist();
  }

  // get App device list
  getAppDevicelist() {
    this.appMgtSvc.getDeviceData().subscribe((res: any) => {
      if (res.data.appVersions) {
        this.rows = res.data.appVersions;
      }
    });
  }

  // Edit Device Details.
  editDeviceDetailForm() {
    this.editDeviceData = this.formBuilder.group({
      version: ["", [Validators.required, Validators.maxLength(8), Validators.pattern("^[0-9]*\.[0-9]{1,2}\.[0-9]{1,2}$")]],
      device_file: ["", Validators.required],
      id: [],
    });
  }

  // convenience getter for easy access to form fields
  get editDeviceFormControl() {
    return this.editDeviceData.controls;
  }

  // On App Device edit modal open
  onEditDeice(editModal, data) {
    this.editDeviceDetailForm();
    if (data.type !== "android" || data.id !== 1) {
      this.isAndroidEdit = false;
      this.fileFormat = ".ipa";
    } else {
      this.isAndroidEdit = true;
      this.fileFormat = ".apk";
    }
    this.editDeviceData.patchValue({ id: data.id, version: data.app_version });
    this.modalService.open(editModal, {
      centered: true,
      backdrop: false,
      size: "lg",
      windowClass: "modal modal-primary",
    });
  }

  //Upload file validation
  uploadFile(event: any) {
    this.fileName = event.target.files[0].name;
    if (event.target.files[0]) {
      if (event.target.files[0].size / 1024 / 1024 <= 1000) {
        this.fileSizeLimit = false;
        this.applicationFile = event.target.files[0];
      } else {
        this.fileSizeLimit = true;
        this.applicationFile = null;
      }
    }
  }

  // On Update device submit
  updateDeviceDetails() {
    this.submitted = true;
    if (this.editDeviceData.invalid) return;
    const formData = new FormData();
    formData.append("app_version", this.editDeviceData.value.version);
    formData.append("app_file", this.applicationFile);
    if (this.applicationFile) {
      this.appMgtSvc
        .updateDeice(this.editDeviceData.value.id, formData)
        .subscribe(
          (res: any) => {
            if (res.success) {
              this._toastrService.success(res.message, "Success!", {
                toastClass: "toast ngx-toastr",
                closeButton: true,
              });
              this.cancel();
              this.getAppDevicelist();
            }
          },
          (err) => {
            this._toastrService.error(err.error.message, "Error!", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          }
        );
    }
  }

  // On cancel click
  cancel() {
    this.submitted = false;
    this.fileName = null;
    this.modalService.dismissAll();
    this.editDeviceData.reset();
  }
}
