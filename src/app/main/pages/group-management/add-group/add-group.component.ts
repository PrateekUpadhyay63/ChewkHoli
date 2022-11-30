import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreTranslationService } from "@core/services/translation.service";
// lanaguage
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { Observable } from "rxjs";
import { repeaterAnimation } from "./form-repeater.animation";
import { UserManagementService } from "../../user-management/user-management.service";
import { GroupManagementService } from "../group-management.service";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { onGroupUpdateSend } from "../../dashboard/chat/utils/group-update";
import { ChatsService } from "../../dashboard/chat/chats.service";
import { XMPPService } from "../../dashboard/ejab.service";
@Component({
  selector: "app-add-group",
  templateUrl: "./add-group.component.html",
  styleUrls: ["./add-group.component.scss"],
  animations: [repeaterAnimation],
})
export class AddGroupComponent implements OnInit {

  public loading = false;
  public avatarImage: string = null;
  public selectedFile: File = null;
  public group_name='';
  public selectedStatus;
  public selectedLanguage;
  public first_name;
  public last_name;
  public username;
  public email;
  public selectedUserType;
  public selectedOrganizations;
  public password;
  public passwordTextType: boolean;
  public isSharedGroupChecked: boolean = false;
  public submitted = false;
  public userData: any[] = [];
  public OrganizationName: any[] = [];
  public totalOrgCount: number = 0;
  public currentUserDetails: any;
  public resultOrgName: any[] = [];
  showMaxLengthError:boolean=false;
  
  // new code
  public AddNewGroupForm: FormGroup;
  public status = [{ id: 1, value: "Active" }];
  public language = [
    { id: 2, value: "English" },
    { id: 1, value: "Arabic" },
  ];
  // Select Multi sub-admin Variable
  public multiSubAdminUsers: any = [];
  // public multiSubAdminUsers:Observable< any []>;
  public multiSubAdminUsersSelected = [];

  // Select Multi End user Variable
  public multiEndUsers: any = [];
  // public multiEndUsers: Observable<any[]>;
  public multiEndbUsersSelected = [];

  // Select Multi Super user Variable
  public multiSuperUsers: Observable<any[]>;
  public multiSuperbUsersSelected = [];

  // Select Multi sub admin for other org.  Variable
  public multiOrganizationNameStored = [];
  public multiOrganizationSubAdminSelected = [];

  // public
  public items = [{ selectOrg: null, selectSubAdmin: "" }];

  public item = {
    itemName: "",
    itemQuantity: "",
  };
  public onGroupUpdate: onGroupUpdateSend;
  formChangesSubscription: any;

  constructor(
    private router: Router,
    private _coreSidebarService: CoreSidebarService,
    private _coreTranslationService: CoreTranslationService,
    private userManagementSvc: UserManagementService,
    private groupManagementSvc: GroupManagementService,
    private _toastrService: ToastrService,
    private fb: FormBuilder,
    private chatsSvc: ChatsService,
    private xamppSvc: XMPPService
  ) {
    this._coreTranslationService.translate(english, arabic);
    this.userManagementSvc.onUserListChanged.subscribe((res: any) => {
      this.userData = res;
    });
  }

  ngOnInit(): void {
    

    this.currentUserDetails = JSON.parse(localStorage.getItem("currentUser")); //to get current loged in user data
    this.selectedLanguage = this.language[0];
    this.selectedStatus = this.status[0];
    this.groupManagementSvc.getAllSubAdminLists().subscribe((response: any) => {
      this.multiSubAdminUsers = response.data;
    });
    this.groupManagementSvc.getAllEndUserLists().subscribe((response: any) => {
      this.multiEndUsers = response.data;
    });
  }

  /**
   * Add Item
   */
  addItem() {
    this.items.push({
      selectOrg: null,
      selectSubAdmin: "",
    });
    this.totalOrgCount--;
  }

  /**
   * DeleteItem for add other org.
   *
   * @param id
   */
  deleteItem(id, delOrgId) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items.indexOf(this.items[i]) === id) {
        this.items.splice(i, 1);
        this.multiOrganizationNameStored.filter((ele) => {
          if (ele.id == delOrgId) {
            this.OrganizationName.push(ele);
          }
        });
        break;
      }
    }
    this.totalOrgCount++;
  }

  onShareGroupchecked(isChecked: boolean) {
    // console.log("check", isChecked);
    this.isSharedGroupChecked = isChecked;
    // to get all available Organization Name
    this.groupManagementSvc.getOrgList().subscribe((res: any) => {
      this.multiOrganizationNameStored = res.data;
      this.OrganizationName = res.data.filter((ele) => ele.id != 1);
      this.totalOrgCount = this.OrganizationName.length;
    });
  }

  // get sub admins for selected org.
  onOrgnizationSelect(eve) {
    this.groupManagementSvc.getAllSubAdminList(eve.id).subscribe((res: any) => {
      this.multiOrganizationSubAdminSelected = res.data;
    });
    this.OrganizationName.splice(
      this.OrganizationName.findIndex((x) => x.id == eve.id),
      1
    );
  }

  // Group image upload

  imageError = false;
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

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  // cancel
  cancel() {
    this.router.navigateByUrl("/group-management/group-list");
  }

  submit(form) {
    if (form.invalid || this.imageError) {
      return;
    }

    if (form.valid) {
      this.loading = true;
      const members = [];
      // filter sub admin
      this.multiSubAdminUsersSelected.forEach((ele) => {
        members.push({
          user_id: ele.id,
          role_id: ele.Role.id,
          organization_id: ele.Organization.id,
          fcm_token: ele.fcm_token,
        });
      });
      // filter end user details
      let array = [];
      this.multiSuperbUsersSelected.forEach((ele) => {
        if (ele.id) {
          array.push(ele.id);
        }
      });
      let data = [];
      data = this.multiEndbUsersSelected.filter((ele) => {
        if (!array.includes(ele.id)) {
          return ele;
        }
      });
      data.forEach((ele) => {
        members.push({
          user_id: ele.id,
          role_id: ele.Role.id,
          organization_id: ele.Organization.id,
          fcm_token: ele.fcm_token,
        });
      });

      // filter super user details
      this.multiSuperbUsersSelected.forEach((ele) => {
        members.push({
          user_id: ele.id,
          role_id: 2,
          organization_id: ele.Organization.id,
          fcm_token: ele.fcm_token,
        });
      });

      // show only when  other org. selected sub admins
      if (this.isSharedGroupChecked) {
        this.items.forEach((ele: any) => {
          if (ele.selectSubAdmin.length > 0) {
            ele.selectSubAdmin.forEach((element) => {
              members.push({
                user_id: element,
                role_id: 3,
                organization_id: ele.selectOrg,
                fcm_token: ele.fcm_token,
              });
            });
          }
        });
      }
      // console.log("members", members);
      const formData = new FormData();
      formData.append("name", form.value.group_name);
      formData.append("languageId", form.value.language);
      formData.append("status", JSON.stringify(1));
      formData.append("profile_pic", this.selectedFile);
      formData.append("created_by", JSON.stringify(this.currentUserDetails.id));
      formData.append(
        "organization_id",
        JSON.stringify(this.currentUserDetails.Organization.id)
      );
      formData.append("shared", JSON.stringify(this.isSharedGroupChecked));
      formData.append(`members`, JSON.stringify(members));
      this.groupManagementSvc.addNewGroup(formData).subscribe(
        (res: any) => {
          this._toastrService.success(res.message, "Success!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.loading = false;
          this.router.navigateByUrl("/group-management/group-list");
          this.onGroupChangeData(res.data.id, res.data.room_jid);
          // this.groupManagementSvc.getGroupList({offset: 1});
        },
        (err) => {
          this._toastrService.error(err.error.message, "Error!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.loading = false;
        }
      );
    }
  }

//    setFocusToTextBox(){
//     document.getElementById("basic-icon-default-fullname").focus();
// }

  // on Real time group Update
  onGroupChangeData(id: number, group_jid: string) {
    this.chatsSvc.getChatGroupMmebersList(id).subscribe((res: any) => {
      // console.log("res", res);
      res.data.groupDetails.members.forEach((element) => {
        this.onGroupUpdate = {
          toGroupJid: group_jid,
          groupId: id,
          toMemberJid: element.user.jid,
        };
        this.xamppSvc.onGroupUpdate(this.onGroupUpdate);
      });
    });
  }

  //code to check the group name
  checkFocus(){   
    if(this.group_name===undefined|| this.group_name===null || this.group_name.length===0)
    {
      this.showMaxLengthError=true;
    }
  }

  checkMaxLength(event?){
    if(this.group_name && this.group_name.length>1)
    {
     return this.showMaxLengthError=false;
    }else if(this.group_name.length===0){
      return this.showMaxLengthError=true;
    }else{
      return this.showMaxLengthError=false;
    }
  }

}
