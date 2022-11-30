import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import moment from "moment";
import { FlatpickrOptions } from "ng2-flatpickr";
import { ToastrService } from "ngx-toastr";
import { LocationServiceService } from "../location-service.service";
import { type2, types } from "./const";
// lanaguage
import { locale as english } from "../i18n/en";
import { locale as arabic } from "../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { ControlPosition } from "maplibre-gl";
@Component({
  selector: "app-location",
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LocationComponent implements OnInit {
  public types = types;
  public types2 = type2;
  public groupData = [];
  public usersData = [];
  public vehicleData = [];
  public ipCameraData = [];
  public organizationData = [];
  public placeHolder: string;
  public showSecondDropDown: boolean = false;
  public selectedGroupId: number;
  public showThirdDropDown: boolean = false;
  public showDatePicker: boolean = false;
  public showGroupDropDown: boolean = false;
  public selectUserVehicle: number;
  public memberLocationData = [];
  public defaultIPCamera: number;
  public defaultSelect;
  public fromDate;
  public toDate;
  public selectedUserID: number;
  public selectedVehicleID: number;
  public position: ControlPosition = 'top-right';
  // Flat picker date
  public DateRangeOptions: FlatpickrOptions = {
    altInput: true,
    mode: "range",
    altFormat: "j/m/Y",
    dateFormat: "d.m.Y",
    allowInput: true,
    defaultDate: null,
    onChange: (selectedDates: any) => {
      // this.resetDate();
      // this.fromDate = moment(selectedDates[0]).format("YYYY-MM-DD");
      // this.toDate = moment(selectedDates[1]).format("YYYY-MM-DD");
      // if (!this.toDate) this.toDate = this.fromDate;
      // if (this.fromDate && this.toDate) return this.onDateSelect();
    },
    onClose: (selectedDates: any, dateStr: any) => {
      this.fromDate = moment(selectedDates[0]).format("YYYY-MM-DD");
      this.toDate = moment(selectedDates[1]).format("YYYY-MM-DD");
      if (!this.toDate) this.toDate = this.fromDate;
      if (this.fromDate && this.toDate) return this.onDateSelect();
    },
  };
  constructor(
    private locationSerice: LocationServiceService,
    private _toastrService: ToastrService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit(): void {
    this.getOrgData();
    let obj:any = {
      isFromLocationMdoule: true,
    }
    this.memberLocationData = obj
  }

  onDateSelect() {
    let obj = {
      start_date: this.fromDate,
      end_date: this.toDate,
    };
    if (this.selectUserVehicle === 1)
      return this.getMemberLocation(this.selectedUserID, obj);
    if (this.selectUserVehicle === 2)
      return this.getVehicleLocation(this.selectedVehicleID, obj);
  }

  // On Org select get groups 
  getOrgData() {
    this.locationSerice.getOrgList().subscribe((res:any) => {
      if(res){
        this.organizationData = res.data; 
      }
    })
  }

  // On org select
  onOrgSelect(eve){
   if(eve) this.getGroupData(eve);
    this.showGroupDropDown = true;
  }

  // on Org. clear
  onOrgClear() {
    this.showGroupDropDown = false;
    this.onGroupClear();
  }

  // On select of group
  onGroupSelect(eve) {
    this.selectedGroupId = eve;
    this.showSecondDropDown = false;
    setTimeout(() => {
      this.showSecondDropDown = true;
      if (!eve) this.showSecondDropDown = false;
    }, 200);
    this.showThirdDropDown = false;
    this.showDatePicker = false;
    if (!eve) this.showSecondDropDown = false;
  }

  // on user, vehicle or ip camera select event
  onUserVehicleIPSelect(eve) {
    this.memberLocationData = null;
    this.vehicleData = null;
    this.ipCameraData = null;
    this.showThirdDropDown = true;
    this.selectUserVehicle = eve;
    if (eve === 1) return this.getUserByGroupId(this.selectedGroupId);
    if (eve === 2) return this.getVehicleLists(this.selectedGroupId);
    if (eve === 3) {
      this.showDatePicker = false;
      return this.getStreamingDevice(this.selectedGroupId);
    }
  }

  // get group data
  getGroupData(id:number) {
    this.locationSerice.getGroupName(id).subscribe((res: any) => {
      if (res.data != null) this.groupData = res.data;
    });
  }

  // get user's location
  getUserByGroupId(id: number) {
    this.locationSerice.getUserByID(id).subscribe((res: any) => {
      this._toastrService.success(res.message, "Success", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      if (res.data != null) {
        this.usersData = res.data;
      }
    });
  }

  // get streaming device list with location
  getStreamingDevice(id: number) {
    this.memberLocationData = null;
    this.locationSerice
      .getStreamingDeviceLocationById(id)
      .subscribe((res: any) => {
        this._toastrService.success(res.message, "Success", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        if (res.data != null && res.data) {
          this.ipCameraData = res.data;
          // this.ipCameraData.unshift({ id: 0, name: "All" });
          // this.defaultIPCamera = this.ipCameraData[0];
          let ipCameraDatas = [];
          this.ipCameraData.forEach((ele) => {
            ipCameraDatas.push(ele);
          });
          // let obj: any = {
          //   IpStream: ipCameraDatas,
          // };
          // this.memberLocationData = obj;
        }
      });
  }

  // get vehicle list for selected group
  getVehicleLists(id: number) {
    this.locationSerice.getVehiclesListByGroup(id).subscribe((res: any) => {
      this._toastrService.success(res.message, "Success", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      if (res.data != null) {
        this.vehicleData = res.data;
      }
    });
  }

  // on user select get location data with selected date range
  onUserSelect(eve) {
    this.memberLocationData = null;
    this.showDatePicker = false;
    this.selectedUserID = eve;
    this.resetDate();
    setTimeout(() => {
      this.showDatePicker = !false;
    }, 100);
  }

  // get member location for date range
  getMemberLocation(id: number, data) {
    this.memberLocationData = null;
    this.locationSerice.getMemberLocationByDateRange(id, data).subscribe(
      (res: any) => {
        this._toastrService.success(res.message, "Success", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        if (res.data != null) {
          let members = [];
          res.data.forEach((element) => {
            members.push(element);
          });
          let obj: any = {
            members: members,
            isFromLocationMdoule: true,
          };
          this.memberLocationData = obj;
        }
      },
      (err) => {
        this._toastrService.error(err.error.message, "Error", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    );
  }

  // on vehicle select get location data with select date range
  onVehicleSelect(eve) {
    this.memberLocationData = null;
    this.selectedVehicleID = eve;
    this.showDatePicker = false;
    setTimeout(() => {
      this.showDatePicker = !false;
    }, 100);
  }

  // get vehicle location data by date range
  getVehicleLocation(id: number, data) {
    this.memberLocationData = null;
    this.locationSerice.getVehicleLocation(id, data).subscribe((res: any) => {
      this._toastrService.success(res.message, "Success", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      if (res.data != null) {
        let vehicleData = [];
        res.data.forEach((ele) => {
          vehicleData.push(ele);
        });
        let obj: any = {
          Vehicles: vehicleData,
          isFromLocationMdoule: true,
        };
        this.memberLocationData = obj;
      }
    });
  }

  // on IP camera select get location with selected group
  onIPCameraSelect(eve) {
    this.showDatePicker = false;
    let ipLocation = [];
    ipLocation.push(eve);
    let obj: any = {
      IpStream: ipLocation,
      isFromLocationMdoule: true,
    };
    this.memberLocationData = obj;
    if (eve.id == 0) {
      let ipCameraDatas = [];
      this.ipCameraData.forEach((ele) => {
        ipCameraDatas.push(ele);
      });
      let obj: any = {
        IpStream: ipCameraDatas,
        isFromLocationMdoule: true,
      };
      this.memberLocationData = obj;
    }
  }

  // on group clear
  onGroupClear() {
    this.showDatePicker = false;
    this.showSecondDropDown = false;
    this.showThirdDropDown = false;
    this.memberLocationData = null;
  }

  //On member, vehicle or IP camera clear
  onMemberIPVehicleClear() {
    this.showThirdDropDown = false;
    this.showDatePicker = false;
    this.memberLocationData = null;
  }

  // on Member clear
  onMemberClear() {
    this.showDatePicker = false;
    this.memberLocationData = null;
  }

  // on Vehicle clear
  onVehicleClear() {
    this.showDatePicker = false;
    this.memberLocationData = null;
  }

  // on IP camera clear
  onIPCameraClear() {
    this.showDatePicker = false;
    this.memberLocationData = null;
  }

  resetDate() {
    return (this.fromDate = null), (this.toDate = null);
  }
}
