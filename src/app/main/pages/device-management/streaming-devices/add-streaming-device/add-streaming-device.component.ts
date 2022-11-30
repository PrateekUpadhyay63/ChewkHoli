import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeviceManagementService } from '../../device-management.service';

@Component({
  selector: 'app-add-streaming-device',
  templateUrl: './add-streaming-device.component.html',
  styleUrls: ['./add-streaming-device.component.scss']
})
export class AddStreamingDeviceComponent implements OnInit {
  public AddStreamingDevice: FormGroup;
  public submitted: boolean = false;
  public organizationName: any[] = [];
  public groupName = [];
  public currentLoggedInUser;
  uploadProfileImage;
  logo;
  constructor(private formBuilder:FormBuilder, 
    private _toastrService: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private deviceManagementSvc: DeviceManagementService) { }

  ngOnInit(): void {
    this.currentLoggedInUser = JSON.parse((localStorage.getItem("currentUser")));
    this.AddStreamingForm();
    this.getAllOrgList();
    this.addOrgDropDwon();
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
        this.AddStreamingDevice.addControl('orgnization_id', this.formBuilder.control(null, [Validators.required]));
      }
    }
    // convenience getter for easy access to form fields
    get formC() { return this.AddStreamingDevice.controls; }

    // Add new Streaming Device Form Init.
    AddStreamingForm() {
      this.AddStreamingDevice = this.formBuilder.group({
        device_name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
        rtsp_link: ['', [Validators.required, Validators.min(5),
        Validators.maxLength(50),
          // Validators.pattern('/(rtsp):\/\/(?:([^\s@\/]+)@)?([^\s\/:]+)(?::([0-9]+))?(?:\/(.*))?')
        ]],
        serialNumber: ["", Validators.required],
        comment: ["", Validators.required],
        longitude:["", Validators.required],
        latitude:["", Validators.required],
        group_ids: [""]
      });
    }


    imageError = false;
    uploadFiles(event: any) {
  
      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.logo = e.target.result;
          if (event.target.files[0].size > 100000) {
            this.imageError = true;
            this.logo = null;
            this.uploadProfileImage = null;
          }
          else {
            this.uploadProfileImage = event.target.files[0];
            this.imageError = false;
          }
        };
  
        reader.readAsDataURL(event.target.files[0]);
      }
      else {
        this.logo = null;
        this.uploadProfileImage = null;
      }
    }

 // Submit Fn of  Add new Streaming device
 onAddNewStreamingDevice() {
  console.log("group ids", this.AddStreamingDevice.value.group_ids);
  
  this.submitted = true;
  if (this.AddStreamingDevice.invalid || !this.uploadProfileImage) return;
  let org_id;

  if (this.currentLoggedInUser.Role.id != 5) {
    org_id = this.currentLoggedInUser.Organization.id
  }
  else {
    org_id = this.AddStreamingDevice.value.orgnization_id
  }

  let formData = new FormData();

  formData.append("name", this.AddStreamingDevice.value.device_name);
  formData.append("rts_link", this.AddStreamingDevice.value.rtsp_link);
  formData.append("organization_id", org_id);
  formData.append("comments", this.AddStreamingDevice.value.comment);
  formData.append("serial_number", this.AddStreamingDevice.value.serialNumber);
  formData.append("icon", this.uploadProfileImage);
  formData.append("longitude", this.AddStreamingDevice.value.longitude);
  formData.append("latitude", this.AddStreamingDevice.value.latitude);
  formData.append("group_ids", this.AddStreamingDevice.value.group_ids.join(","));

  this.deviceManagementSvc.addStreamingDevice(formData).subscribe((res: any) => {
    if (res.success == true) {
      this._toastrService.success(
        res.message,
        'Success!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
      this.uploadProfileImage = undefined
      this.submitted = false
      this.logo = undefined
      this.modalService.dismissAll();
      this.AddStreamingDevice.reset();
      this.ngOnInit();
    } else {
      this._toastrService.error(
        res.message,
        'Error!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    }
  }, (err) => {

    this._toastrService.error(
      err.error.message,
      'Error!', {
      toastClass: 'toast ngx-toastr',
      closeButton: true
    });
  });

}


}
