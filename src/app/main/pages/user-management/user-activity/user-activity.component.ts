import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { UserManagementService } from "../user-management.service";
// lanaguage
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-user-activity",
  templateUrl: "./user-activity.component.html",
  styleUrls: ["./user-activity.component.scss"],
})
export class UserActivityComponent implements OnInit {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  canAdd = true;
  selected = [];
  value;
  displayCheck;
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(
    private router: Router,
    private _toastrService: ToastrService,
    private _coreTranslationService: CoreTranslationService,
    private modalService: NgbModal,
    private userManagmentSvc: UserManagementService
  ) {
    this._coreTranslationService.translate(english, arabic);
    this.urlLastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }

  ngOnInit(): void {
    this.userManagmentSvc
      .getUserActivity(this.urlLastValue)
      .subscribe((res: any) => {
        this.rows = res.data;
        if (this.rows && this.rows.length > 0) {
          this.rows.map((data) => {
            data["checked"] = false;
          });
        }
      });
  }

  backClick() {
    this.router.navigateByUrl("/user-management/userlist");
  }

  onSelect(event) {
    this.checkedData = event.selected;
  }

  allTradesObservable(event, id) {
    this.rows.map((val) => {
      if (val.id == id) val.checked = event;
    });
  }

  checkedData = [];
  delete(modal) {
    if (this.checkedData.length > 0) {
      this.modalService.open(modal, {
        centered: true,
        windowClass: "modal modal-danger",
      });
    } else {
      this._toastrService.error("Please Select Atleast 1 Activity", "Error!", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
    }
  }

  deleteData() {
    let ids = [];
    this.checkedData.forEach((val) => {
      ids.push(val.id);
    });

    let data = { ids: ids.toString() };

    this.userManagmentSvc.MassdeleteActivity(data).subscribe((res: any) => {
      this.modalService.dismissAll();
      this._toastrService.success(res.message, "Success!", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
      this.ngOnInit();
    });
  }
}
