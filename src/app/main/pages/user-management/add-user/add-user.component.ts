import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { NgForm } from "@angular/forms";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { UserManagementService } from "../user-management.service";
// lanaguage
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IntegratedOrganizationiService } from "../../integrated-organizations/integrated-organizationi.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AddUserComponent implements OnInit {
  public first_name;
  public last_name;
  public username;
  public email;
  public selectedUserType;
  public selectedOrganizations;
  public selectedStatus;
  public selectedLanguage;
  public password;
  public passwordTextType: boolean;
  public submitted = false;
  public loading = false;
  public showOrgDropDown = false;
  public organizations: any[] = [];
  public userTypeArray: any[] = [];
  public userTypes: any[] = [];
  public loggedInUserData;

  public status = [{ id: 1, value: "Pending" }];

  public language = [
    { id: 2, value: "English" },
    { id: 1, value: "Arabic" },
  ];

  @ViewChild("newUserForm") newUserForm: NgForm;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private router: Router,
    private _coreSidebarService: CoreSidebarService,
    private _toastrService: ToastrService,
    private _coreTranslationService: CoreTranslationService,
    private userManagementService: UserManagementService,
    private ngxLoader: NgxUiLoaderService,
    private organizationSvc: IntegratedOrganizationiService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onUserSelect(eve) {
    // to getUserType  drop down event
    this.showOrgDropDown = true;
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    this.submitted = true;
    if (form.invalid) {
      return;
    } else {
      // let currentUserId = JSON.parse((localStorage.getItem("currentUser")));
      let payload = {
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        username: form.value.username,
        // status: this.selectedStatus.id,
        languageId: form.value.language,
        roleId: form.value.roleId,
        organization_id:
          form.value.organization_id || this.loggedInUserData.Organization.id,
        createdBy: this.loggedInUserData.id,
      };
      this.loading = true;
      this.userManagementService.addUser(payload).subscribe(
        (res) => {
          this.loading = false;
          this.router.navigateByUrl("/user-management/userlist");
          this.newUserForm.resetForm();
          this.newUserForm.reset();
          // form.value.reset();
        },
        (err) => {
          this._toastrService.error(err.error.message, "Error", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.loading = false;
        }
      );
    }
  }
  cancel() {
    this.newUserForm.resetForm();
    this.newUserForm.reset();
    this.router.navigateByUrl("/user-management/userlist");
  }

  ngOnInit(): void {
    this.loggedInUserData = JSON.parse(localStorage.getItem("currentUser"));
    this.userManagementService.getRoleName().subscribe((res: any) => {
      this.userTypes = res.data;
      // filter user typr according logged in user
      if (this.loggedInUserData.Role.id != 5 && this.userTypes.length > 0) {
        // if logged in user is other than Super Admin then logged in user not allowed to create same level user
        this.userTypeArray = this.userTypes.filter(
          (ele) => ele.id != 4 && ele.id != 2 && ele.id != 5
        );
      } else {
        this.userTypeArray = this.userTypes.filter(
          (ele) => ele.id != 5 && ele.id != 2
        ); // All avaible user will be shown except Super User.
      }
    });

    this.userManagementService.getOrgList().subscribe((response: any) => {
      let orgArray: any[] = [];

      orgArray = response.data;
      // if logged in user is other than Super Admin then
      // allowed to create  user of same organization only.
      if (orgArray.length > 0 && this.loggedInUserData.Role.id != 5) {
        this.organizations = orgArray.filter(
          (ele) => ele.id == this.loggedInUserData.Organization.id
        );
      } else this.organizations = response.data; // can create any organization user.
      this.selectedOrganizations = { id: 1, name: "Dubai Police" };
    });

    this.selectedStatus = this.status[0];
    this.selectedLanguage = this.language[0];
  }
}
