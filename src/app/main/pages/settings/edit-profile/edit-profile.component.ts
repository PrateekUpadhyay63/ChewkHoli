import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "app/auth/service";
import { FlatpickrOptions } from "ng2-flatpickr";
import { ToastrService } from "ngx-toastr";
import { UserManagementService } from "../../user-management/user-management.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransferAuthorityService } from "../../transfer-authority/transfer-authority.service";
import { locale as english } from "../i18n/en";
import { locale as arabic } from "../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit {
  public contentHeader: object;
  public data: any;
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public avatarImage;
  public selectedFile: File = null;
  public currentUser: any;
  public AddUserDetails: FormGroup;
  submitted: Boolean = false;
  profile_image;
  imageError = false;
  public language = [
    { id: 1, value: "Arabic" },
    { id: 2, value: "English" },
  ];
  public confPasswordTextType: boolean;
  passwordTextTypeConfirm;
  public saveUsername: boolean = true;
  public noticationEnabled: boolean;

  //
  @ViewChild("accountForm") accountForm: NgForm;
  @ViewChild("PasswordResetForm") PasswordResetForm: NgForm;
  profile_image_name: any =
    "../../../../../assets/images/avatars/user-avatar-image.jpg";
  constructor(
    private router: Router,
    private _UserManagementService: UserManagementService,
    private _toastrService: ToastrService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private _coreTranslationService: CoreTranslationService,
    private transferAuthoritySvc: TransferAuthorityService
  ) {
    this._coreTranslationService.translate(english, arabic);
    this._authenticationService.currentUser.subscribe((x) => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    this.profile_image_name = this.currentUser.profile_image;
    this.AddUserDetails = this.formBuilder.group({
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      oldPassword: ["", [Validators.minLength(6)]],
      newpassword: [
        "",
        [
          Validators.pattern(
            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
          ),
        ],
      ],
      confirmpassword: [
        "",
        [
          Validators.pattern(
            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
          ),
        ],
      ],
      language: [""],
      notification: ['']
    });

    // Header Name
    this.contentHeader = {
      headerTitle: "Account Settings",
      breadcrumb: {},
    };

    this.AddUserDetails.patchValue({
      first_name: this.currentUser.first_name,
      last_name: this.currentUser.last_name,
      email: this.currentUser.username,
      language: this.currentUser.LanguageId,
      notification: this.currentUser.notification
    });
  }

  onCheckChange(event) {}

  notificationChange(eve: boolean) {
    let ischecked: boolean = true;
    ischecked = eve;
  }

  toggleConfPasswordTextType() {
    this.confPasswordTextType = !this.confPasswordTextType;
  }

  togglepasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  togglepasswordTextTypeConfirm() {
    this.passwordTextTypeConfirm = !this.passwordTextTypeConfirm;
  }

  get formC() {
    return this.AddUserDetails.controls;
  }

  submitUserDetails() {
    this.submitted = true;

    if (this.AddUserDetails.invalid || this.imageError) {
      return;
    }

    if (!this.profile_image_name || this.profile_image_name == "")
      this.profile_image =
        "../../../../../assets/images/avatars/user-avatar-image.jpg";

    let id = this.currentUser.id;

    const formData = new FormData();
    formData.append("first_name", this.AddUserDetails.value.first_name);
    formData.append("last_name", this.AddUserDetails.value.last_name);
    formData.append("languageId", this.AddUserDetails.value.language);
    formData.append("profile_pic", this.profile_image); 
    formData.append("notification", JSON.stringify(this.noticationEnabled) || this.AddUserDetails.value.notification);
    // console.log("Patch case: ", this.AddUserDetails.value.noticationEnabled)
    // formData.append("notification", this.AddUserDetails.value.noticationEnabled);
    if (
      this.AddUserDetails.value.newpassword != "" &&
      this.AddUserDetails.value.oldPassword != "" &&
      this.AddUserDetails.value.confirmpassword != ""
    ) {
      if (
        this.AddUserDetails.value.newpassword !=
        this.AddUserDetails.value.confirmpassword
      ) {
        this._toastrService.error(
          "new password and confirm password does not match",
          "Error!",
          {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          }
        );
        return;
      } else {
        // this.updatePasword()
        formData.append("password", this.AddUserDetails.value.oldPassword);
        formData.append("new_password", this.AddUserDetails.value.newpassword);
      }
    }

    this._UserManagementService.updateUserDetail(id, formData).subscribe(
      (data: any) => {
        this._toastrService.success(data["message"], "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });

        this.imageError = false;

        if (
          this.AddUserDetails.value.newpassword != "" &&
          this.AddUserDetails.value.oldPassword != "" &&
          this.AddUserDetails.value.confirmpassword != ""
        ) {
          this.router.navigateByUrl("/");
          localStorage.removeItem("currentUser");
        }

        this.currentUser = data.data;
        // this.currentUser.last_name = data.last_name
        // if (data['data']) this.currentUser.profile_image = data['data'].profile_image
        // this.currentUser.languageId = data.language

        // this._authenticationService.currentUserValue.firstName = this.AddUserDetails.value.first_name
        // this._authenticationService.currentUserValue.lastName = this.AddUserDetails.value.last_name
        // if(data['data']) this._authenticationService.currentUserValue.profile_image = data['data'].profile_image
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        this._authenticationService.currentUserSubject.next(this.currentUser);
      },
      (err) => {
        this._toastrService.error("Changes cannot be saved.", "Error!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    );
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadFiles(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      this.profile_image = <File>event.target.files[0];

      reader.onload = (e: any) => {
        this.profile_image_name = e.target.result;
        if (this.profile_image.size > 100000) {
          this.imageError = true;
          this.profile_image_name = null;
        } else {
          this.imageError = false;
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.profile_image_name = null;
    }
  }

  onCancel() {
    this.imageError = false;
    this.ngOnInit();
  }

  onSwitchChange(eve){
    this.noticationEnabled = eve.target.checked;
  }
}
