import { Component, OnInit } from "@angular/core";
import { CoreTranslationService } from "@core/services/translation.service";
import { UserService } from "app/auth/service";
import { ToastrService } from "ngx-toastr";
import { TransferAuthorityService } from "../transfer-authority/transfer-authority.service";
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-content-management",
  templateUrl: "./content-management.component.html",
  styleUrls: ["./content-management.component.scss"],
})
export class ContentManagementComponent implements OnInit {
  canEdit: boolean = true;

  constructor(
    private userService: UserService,
    private _toastrService: ToastrService,
    private modalService: NgbModal,
    private _coreTranslationService: CoreTranslationService,
    private transferAuthoritySvc: TransferAuthorityService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  selectedValue = "default";
  color = "blue";
  dataToSend;
  loading: boolean = false;
  currentLoggedInUser;
  colorArray = [
    { colorName: "Cadillac", colorCode: "#B54F78,#3D1A63", name: "Cadillac" },
    { colorName: "default", colorCode: "#23D493,#07724A", name: "Default" },
    {
      colorName: "Hippie_Green",
      colorCode: "#5A953C,#02214A",
      name: "Hippie Green",
    },
    {
      colorName: "Royal_Blue",
      colorCode: "#5063BF,#092660",
      name: "Royal Blue",
    },
    { colorName: "Tangerine", colorCode: "#FF9B39,#5E174C", name: "Tangerine" },
    { colorName: "Turquoise", colorCode: "#2ACCCD,#16226F", name: "Turquoise" },
   
  ];

  async ngOnInit() {
    this.currentLoggedInUser = JSON.parse(localStorage.getItem("currentUser"));

    let data = await this.userService.getAllCms();
    this.checkPermission();
    this.selectedValue = data["data"].name;
    let filtered = this.colorArray.filter((val) => {
      return val.colorName === data["data"].name;
    })[0];

    this.dataToSend = filtered;
  }

  checkPermission() {
    if (this.currentLoggedInUser.Role.id != 5) {
      this.currentLoggedInUser.Role.permissions.forEach((element) => {
        if (element.name === "Color") {
          this.canEdit = false;
        }
      });
    }
  }

  onColorChange() {
    let filtered = this.colorArray.filter((val) => {
      return val.colorName === this.selectedValue;
    })[0];
    this.color = this.selectedValue;
    this.dataToSend = filtered;
  }

  Save() {
    this.activateTheme();
  }

  saveTheme(modalDanger) {
    this.modalService.open(modalDanger, {
      centered: true,
      // backdrop: false,
      windowClass: "modal modal-danger",
    });
  }

  async activateTheme() {
    let dataToSend = {
      name: this.dataToSend.colorName,
      color_scheme: this.dataToSend.colorCode,
      font_scheme: "#FFFFFF",
    };

    let data = await this.userService.SubmitCms(dataToSend);
    this._toastrService.success(data["message"], "Success!", {
      toastClass: "toast ngx-toastr",
      closeButton: true,
    });

    this.modalService.dismissAll();
  }

  cancel() {
    this.ngOnInit();
  }
}
