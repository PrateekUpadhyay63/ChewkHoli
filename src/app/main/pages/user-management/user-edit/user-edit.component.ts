import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Subject } from "rxjs";
import { FlatpickrOptions } from "ng2-flatpickr";
import { UserManagementService } from "../user-management.service";

// lanaguage
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserEditComponent implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;
  selectedFile: File = null;
  public userTypeArray: any[] = [];
  imageError = false;
  public passwordTextType: boolean;
  public loading = false;


  public language = [
    { id: 1, value: "Arabic" },
    { id: 2, value: "English" },
  ];

  public status = [
    { id: 1, value: "Pending" },
    { id: 2, value: "Active" },
    { id: 3, value: "Inactive" },
  ];

  public userTypes = [
    // {id: 1, value: "End User"},
    // {id: 4, value: "IT Admin"},
    // {id: 3, value: "Sub Admin"},
  ];

  public organizations = [
    // {id: 1, value: "Dubai Police"},
    // {id: 2, value: "Civil Defence"},
    // {id: 3, value: "Civil Aviation"},
  ];

  @ViewChild("accountForm") accountForm: NgForm;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(
    private router: Router,
    private _coreTranslationService: CoreTranslationService,
    private _toastrService: ToastrService,
    private _UserManagementService: UserManagementService
  ) {
    this._unsubscribeAll = new Subject();
    this._coreTranslationService.translate(english, arabic);
    this.urlLastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }
  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this.accountForm.resetForm(this.tempRow);
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * Upload Image
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        if (event.target.files[0].size > 100000) {
          this.imageError = true;
          this.selectedFile = null;
        } else {
          this.selectedFile = <File>event.target.files[0];
          this.imageError = false;
          this.avatarImage = e.target.result;
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  submit(id, form) {
    if (form.invalid || this.imageError) {
      return;
    }

    if (form.valid) {
      const formData = new FormData();
      formData.append("first_name", form.value.first_name);
      formData.append("last_name", form.value.last_name);
      formData.append("languageId", form.value.language);
      formData.append("roleId", form.value.roleId);
      formData.append("statusId", form.value.statusId);
      formData.append("profile_pic", this.selectedFile);
      this._UserManagementService
        .updateUserDetails(id, formData)
        .subscribe((res) => {
          this.cancel();
        },
        (err) => {
          this._toastrService.error(err.error.message, "Error", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.loading = false;
        }
        
        );
    } else {
      return;
    }
  }

  cancel() {
    this.router.navigateByUrl("/user-management/userlist");
  }

  ngOnInit(): void {
    this._UserManagementService
      .getUserByID(this.urlLastValue)
      .subscribe((res: any) => {
        this.rows = res.data.userDetails;
        this.currentRow = res.data.userDetails;
        this.avatarImage = res.data.userDetails.profile_image;
      });
    const loggedInUserData = JSON.parse(localStorage.getItem("currentUser"));
    this._UserManagementService.getRoleName().subscribe((res: any) => {
      this.userTypes = res.data;
      // filter user typr according logged in user
      if (loggedInUserData.Role.id != 5 && this.userTypes.length > 0) {
        // if logged in user is other than Super Admin then logged in user not allowed to create same level user
        this.userTypeArray = this.userTypes.filter(
          (ele) => ele.id != 4 && ele.id != 2 && ele.id != 5
        );
      } else
        this.userTypeArray = this.userTypes.filter(
          (ele) => ele.id != 5 && ele.id != 2
        ); // All avaible user will be shown except Super User.
    });

    this._UserManagementService.getOrgList().subscribe((res: any) => {
      this.organizations = res.data; // can create any organization user.
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //functionality to clear session of user
  deleteAllUserData(id: number){
    console.log('deleteAllUserData: ', id);
    this._UserManagementService.deleteAllUser(id).subscribe((res: any) => {
      console.log('deleteAllUserData: ', res.id);
    });
  }
}
