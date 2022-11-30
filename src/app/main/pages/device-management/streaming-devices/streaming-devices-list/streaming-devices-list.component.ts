import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { ToastrService } from "ngx-toastr";
import { DeviceManagementService } from "../../device-management.service";
import { VideoPlaylistService } from "../../video-player/video-playlist.service";

import { Observable, Subscriber } from "rxjs";
import { TransferAuthorityService } from "../../../transfer-authority/transfer-authority.service";
import { locale as english } from "../i18n/en";
import { locale as arabic } from "../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { onGroupUpdateSend } from "app/main/pages/dashboard/chat/utils/group-update";
import { XMPPService } from "app/main/pages/dashboard/ejab.service";
import { streamingDeviceFilter } from "./streaming-device-filter-modal";

@Component({
  selector: "app-streaming-devices-list",
  templateUrl: "./streaming-devices-list.component.html",
  styleUrls: ["./streaming-devices-list.component.scss"],
})
export class StreamingDevicesListComponent implements OnInit {
  // Decorator
  pageIfy = 0;
  pageIfx = 5;
  page = {
    limit: 10,
    count: 0,
    offset: 0,
  };
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = "";
  private tempData = [];
  public organizationName: any[] = [];
  public streamingDeviceList: any[] = [];
  public submitted: boolean = false;
  public currentLoggedInUser;
  public currentRowId;
  public deviceName: string;
  public deviceDeleteId: number;
  public canEditStreamingDevice: boolean = true;
  public canAddStreamingDevice: boolean = true;
  public canDeleteStreamingDevice: boolean = true;
  public onBackIcon: boolean = false;
  public onForwardIcon: boolean = true;
  public AddStreamingDevice: FormGroup;
  public EditStreamingDeviceFG: FormGroup;
  latitu: number = 0;
  long;
  logo;
  resorg;
  public organizationData = [];
  public groupName = [];
  public edit_row_id: number;
  public onGroupUpdate: onGroupUpdateSend;
  public group_id = [];
  public uploadProfileImage;
  public current_page;
  public fakeArray;
  public imageError = false;
  public selectedOrganization: string;
  public ipStreamFilter: streamingDeviceFilter;
  @ViewChild("modalConfirm") confrimModal;
  public viewStreamData: any = null;
  constructor(
    private deviceManagementSvc: DeviceManagementService,
    private _toastrService: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private videoPlayList: VideoPlaylistService,
    private formBuilder: FormBuilder,
    private _coreTranslationService: CoreTranslationService,
    private xamppSvc: XMPPService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }
  ngOnInit(): void {
    this.currentLoggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    this.pageCallback({ offset: 1 });
    this.getAllStreamingDevice();
    this.AddStreamingForm();
    this.getAllOrgList();
    this.addOrgDropDwon();
    this.checkPermission();
  }

  uploadFiles(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        this.logo = e.target.result;
        if (event.target.files[0].size > 100000) {
          this.imageError = true;
          this.logo = null;
          this.uploadProfileImage = null;
        } else {
          this.uploadProfileImage = event.target.files[0];
          this.imageError = false;
        }
      };

      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.logo = null;
      this.uploadProfileImage = null;
    }
  }

  getAllStreamingDevice(search?) {
    let params: streamingDeviceFilter = {
      pageNumber: this.page.offset.toString(),
      pageSize: this.page.limit.toString(),
    };
    if (this.searchValue) params.search = this.searchValue;
    if (this.selectedOrganization) params.orgId = this.selectedOrganization;
    this.deviceManagementSvc.getAllStreamingDevicesparams(params);
    this.deviceManagementSvc.onIPStreamListChanged.subscribe((res: any) => {
      if (res) {
        this.current_page = res.current_page || 0;
        this.page.count = res.page_count || 0;
        this.fakeArray = new Array(res.page_count || 0);
        if (res.organizations)
          this.organizationData = res.organizations.filter((n: any) => n);
      }
      this.page.count = res.page_count || 0;
      this.rows = res.data;
    });
  }
  pagination(page) {
    this.page.offset = page;
    this.getAllStreamingDevice();
  }

  pageNext() {
    if (this.page.count > 5 && this.page.count - this.current_page > 4) {
      this.pageIfy += 1;
      this.pageIfx += 1;
    }

    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getAllStreamingDevice();
    }
  }

  pagePrev() {
    if (this.pageIfy > 0) {
      this.pageIfy -= 1;
      this.pageIfx -= 1;
    }

    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getAllStreamingDevice();
    }
  }

  onIPStreamSearch() {
    this.ipStreamFilter = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
    };
    if (this.selectedOrganization)
      this.ipStreamFilter.orgId = this.selectedOrganization.toString();
    this.deviceManagementSvc.getAllStreamingDevicesparams(this.ipStreamFilter);
  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    // this.getAllStreamingDevice();
  }
  // Add new Streaming Device Form Init.
  AddStreamingForm() {
    this.AddStreamingDevice = this.formBuilder.group({
      device_name: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ],
      ],
      rtsp_link: [
        "",
        [
          Validators.required,
          Validators.min(5),
          Validators.maxLength(50),
          // Validators.pattern('/(rtsp):\/\/(?:([^\s@\/]+)@)?([^\s\/:]+)(?::([0-9]+))?(?:\/(.*))?')
        ],
      ],
      serialNumber: ["", Validators.required],
      comment: ["", Validators.required],
      longitude: ["", Validators.required],
      latitude: ["", Validators.required],
      group_ids: [""],
    });
  }
  // check weather logged in user has access to edit, add, view and delete User .
  checkPermission() {
    if (this.currentLoggedInUser.Role.id != 5) {
      this.currentLoggedInUser.Role.permissions.forEach((element) => {
        if (element.name === "Camera") {
          this.canEditStreamingDevice = element.edit;
          this.canAddStreamingDevice = element.add;
          this.canDeleteStreamingDevice = element.delete;
        }
      });
    }
  }
  // get All organization List
  getAllOrgList() {
    this.deviceManagementSvc.getOrgList().subscribe((res: any) => {
      this.organizationName = res.data;
    });
  }

  // show org. dropdown oly Admin
  addOrgDropDwon() {
    if (this.currentLoggedInUser.Role.id === 5) {
      this.AddStreamingDevice.addControl(
        "orgnization_id",
        this.formBuilder.control(null, [Validators.required])
      );
    }
  }
  // convenience getter for easy access to form fields
  get formC() {
    return this.AddStreamingDevice.controls;
  }
  get EditformC() {
    return this.EditStreamingDeviceFG.controls;
  }

  // on search clear
  onSearchClear() {
    this.searchValue = "";
    this.onFilterClear();
  }

  // Add  modal Open
  addNewStreamingDevice(modalDanger) {
    this.getGroupData();
    this.modalService.open(modalDanger, {
      centered: true,
      backdrop: false,
      size: "lg",
      windowClass: "modal modal-primary",
    });
    // this.initGeolocation()
    // this.loadMap();
  }

  // Get group name and there ID's
  getGroupData() {
    this.deviceManagementSvc.getGroupName().subscribe((res: any) => {
      this.groupName = res.data;
    });
  }

  // Delete modal
  deletStreamDModal(modalDanger, data) {
    this.deviceName = data.name;
    this.deviceDeleteId = data.id;
    this.modalService.open(modalDanger, {
      centered: true,
      // backdrop: false,
      windowClass: "modal modal-danger",
    });
  }

  icon;

  getOrgain(value) {
    return this.organizationName.filter((data) => {
      return data.id == value;
    })[0].name;
  }

  filterOrganization(event) {
    if (event != null && event) {
      this.selectedOrganization = event.toString();
      this.ipStreamFilter = {
        pageNumber: "1",
        pageSize: "10",
        orgId: this.selectedOrganization,
      };
      if (this.searchValue) this.ipStreamFilter.search = this.searchValue;
      this.deviceManagementSvc.getAllStreamingDevicesparams(
        this.ipStreamFilter
      );
    } else {
      this.selectedOrganization = null;
    }
  }

  // on filtes clear
  onFilterClear() {
    this.ipStreamFilter = {
      pageNumber: "1",
      pageSize: "10",
      search: this.searchValue,
      orgId: this.selectedOrganization,
    };
    this.deviceManagementSvc.getAllStreamingDevicesparams(this.ipStreamFilter);
  }

  public selectedGroups: any[] = [
    // {
    //     stream_group_id: 4,
    //     grouid: 5,
    //     name: "UAE"
    // },
    // {
    //     stream_group_id: 5,
    //     id: 4,
    //     name: "Dubai Poilic"
    // },
    // {
    //     stream_group_id: 6,
    //     id: 3,
    //     name: "Texas New"
    // }
  ];
  // Edit modal Open
  editStreamDevice(modalDanger, data) {
    this.edit_row_id = data.id;

    this.getGroupData();
    this.icon = data.icon;
    this.deviceManagementSvc
      .getStreamDeviceById(data.id)
      .subscribe((res: any) => {
        this.selectedGroups = res.data.stream_groups;
      });
    // Edit Streaming Device Form Init.
    this.EditStreamingDeviceFG = this.formBuilder.group({
      edit_device_name: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ],
      ],
      edit_rtsp_link: [
        "",
        [
          Validators.required,
          Validators.min(5),
          Validators.maxLength(50),
          // Validators.pattern('/(rtsp):\/\/(?:([^\s@\/]+)@)?([^\s\/:]+)(?::([0-9]+))?(?:\/(.*))?')
        ],
      ],
      edit_orgnization_id: ["", [Validators.required]],
      edit_serialNumber: ["", Validators.required],
      edit_comment: ["", Validators.required],
      longitude: ["", Validators.required],
      latitude: ["", Validators.required],
      edit_group_id: [],
    });

    this.currentRowId = data;

    this.EditStreamingDeviceFG.patchValue({
      edit_device_name: data.name,
      edit_rtsp_link: data.rts_link,
      edit_orgnization_id: data.organization_id,
      edit_serialNumber: data.serial_number,
      edit_comment: data.comments,
      longitude: data.longitude,
      latitude: data.latitude,
      edit_group_id: data.stream_groups,
    });

    this.modalService.open(modalDanger, {
      centered: true,
      backdrop: false,
      size: "lg",
      windowClass: "modal modal-primary",
    });
  }

  cancel() {
    this.submitted = false;

    this.modalService.dismissAll();
    this.AddStreamingDevice.reset();
    this.uploadProfileImage = undefined;
    this.logo = undefined;
    this.icon = undefined;
    this.imageError = false;
  }

  cancel_edit() {
    this.submitted = false;
    this.modalService.dismissAll();
    this.EditStreamingDeviceFG.reset();
    this.uploadProfileImage = undefined;
    this.icon = undefined;
    this.logo = undefined;
    this.imageError = false;
  }

  // Submit Fn of  Add new Streaming device
  onAddNewStreamingDevice() {
    this.submitted = true;
    if (this.AddStreamingDevice.invalid || !this.uploadProfileImage) return;
    let org_id;
    if (this.currentLoggedInUser.Role.id != 5) {
      org_id = this.currentLoggedInUser.Organization.id;
    } else {
      org_id = this.AddStreamingDevice.value.orgnization_id;
    }
    let formData = new FormData();
    formData.append("name", this.AddStreamingDevice.value.device_name);
    formData.append("rts_link", this.AddStreamingDevice.value.rtsp_link);
    formData.append("organization_id", org_id);
    formData.append("comments", this.AddStreamingDevice.value.comment);
    formData.append(
      "serial_number",
      this.AddStreamingDevice.value.serialNumber
    );
    formData.append("icon", this.uploadProfileImage);
    formData.append("longitude", this.AddStreamingDevice.value.longitude);
    formData.append("latitude", this.AddStreamingDevice.value.latitude);
    if (this.AddStreamingDevice.value.group_ids.length > 0) {
      this.AddStreamingDevice.value.group_ids.forEach((element) => {
        this.group_id.push({ id: element });
      });
      formData.append(
        "group_ids",
        this.AddStreamingDevice.value.group_ids.join(",")
      );
    }

    this.deviceManagementSvc.addStreamingDevice(formData).subscribe(
      (res: any) => {
        if (res.success == true) {
          this._toastrService.success(res.message, "Success!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.uploadProfileImage = undefined;
          this.submitted = false;
          this.logo = undefined;
          this.modalService.dismissAll();
          this.AddStreamingDevice.reset();
          this.ngOnInit();
          this.onRealTimeofIPStnza(this.group_id);
        } else {
          this._toastrService.error(res.message, "Error!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
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

  // Update Fn of   Streaming device
  onEditStreamingDevice() {
    this.submitted = true;
    if (this.EditStreamingDeviceFG.invalid || this.imageError) {
      return;
    }

    let org_id;

    if (this.currentLoggedInUser.Role.id != 5) {
      org_id = this.currentLoggedInUser.Organization.id;
    } else {
      org_id = this.EditStreamingDeviceFG.value.edit_orgnization_id;
    }
    let edit_ids = [];
    this.EditStreamingDeviceFG.value.edit_group_id.forEach((element) => {
      edit_ids.push({
        group_id: element.group_id,
      });
      this.group_id.push({ id: element.group_id });
    });
    let dataToSave = new FormData();

    dataToSave.append(
      "name",
      this.EditStreamingDeviceFG.value.edit_device_name
    );
    dataToSave.append(
      "rts_link",
      this.EditStreamingDeviceFG.value.edit_rtsp_link
    );
    dataToSave.append("organization_id", org_id);
    dataToSave.append(
      "comments",
      this.EditStreamingDeviceFG.value.edit_comment
    );
    dataToSave.append(
      "serial_number",
      this.EditStreamingDeviceFG.value.edit_serialNumber
    );
    dataToSave.append("longitude", this.EditStreamingDeviceFG.value.longitude);
    dataToSave.append("latitude", this.EditStreamingDeviceFG.value.latitude);
    if (edit_ids.length > 0)
      dataToSave.append("group_ids", JSON.stringify(edit_ids));

    if (this.uploadProfileImage) {
      dataToSave.append("icon", this.uploadProfileImage);
    }

    this.deviceManagementSvc
      .updateStreamingDevice(this.currentRowId.id, dataToSave)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
            this._toastrService.success(res.message, "Success!", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
            this.uploadProfileImage = undefined;
            this.submitted = false;
            this.logo = undefined;
            this.icon = undefined;
            this.modalService.dismissAll();
            this.EditStreamingDeviceFG.reset();
            this.ngOnInit();
            this.onRealTimeofIPStnza(this.group_id);
          } else {
            this._toastrService.error(res.message, "Error!", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
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

  // On group removed from Device
  onGroupRemoveFromDevice(item) {
    let payload = {
      group_id: item.group_id,
      stream_device_id: this.edit_row_id,
    };
    this.group_id.push({ id: item.group_id });
    this.deviceManagementSvc.deleteStreamDeviceById(payload).subscribe(
      (res: any) => {
        this._toastrService.success(res.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.onRealTimeofIPStnza(this.group_id);
      },
      (err) => {
        this._toastrService.error(err.error.message, "Error!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    );
  }

  //delete streaming device
  deleteStreamDevice() {
    this.deviceManagementSvc
      .deleteStreamingDevice(this.deviceDeleteId)
      .subscribe((res: any) => {
        this._toastrService.success(res.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.modalService.dismissAll();
        this.onRealTimeofIPStnza(res.group_ids);
        // this.AddStreamingDevice.reset();
        this.getAllStreamingDevice();
      });
  }

  //on realtime ip device add, remove
  onRealTimeofIPStnza(data) {
    if (data != null) {
      data.forEach((ele) => {
        this.deviceManagementSvc
          .getGroupMmebersJid(ele.id)
          .subscribe((res: any) => {
            if (res.data != null) {
              res.data.forEach((element) => {
                this.onGroupUpdate = {
                  toGroupJid: "dontrefresh",
                  groupId: "dontrefresh",
                  toMemberJid: element,
                };
                this.xamppSvc.onGroupUpdate(this.onGroupUpdate);
              });
            }
          });
      });
    }
  }

  getCurrentVideo(data) {
    // this.router.navigateByUrl(`/video-player/${data}`);
    let payload = {
      link: data,
    };
    this.openCofirmModal();
    this.viewStreamData = payload;
  }

  //open IP stream
  openIPStream(payload) {
    this.deviceManagementSvc.getVideoUrl(payload).subscribe((res: any) => {
      if (res.success === true) {
        this.modalService.dismissAll();
        let stream_data = {
          stream_link: res.data.link,
          pid: res.data.pid,
        };
        localStorage.setItem("link", JSON.stringify(stream_data));
        this._toastrService.success(res.message, "Success", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        this.openNewTab();
      } else {
        this._toastrService.error(res.message, "Error", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    });
  }
  openNewTab() {
    setTimeout(() => {
      window.open("video-player");
      this.modalService.dismissAll();
    }, 100);
  }

  openInNewTab() {
    this.openIPStream(this.viewStreamData);
  }
  // open confirm modal
  openCofirmModal() {
    this.modalService.dismissAll();
    this.modalService.open(this.confrimModal, {
      centered: true,
      backdrop: false,
      // scrollable: true,
      size: "sm",
      // container: ".dashboard-group-chat",
      // windowClass: "modal modal-primary",
    });
  }

  ngOnDestroy(): void {
    //  this.deviceManagementSvc.onStreamingDeviceListChanged.next(null);
    //  this.deviceManagementSvc.onStreamingDeviceListChanged.complete;
  }
}
