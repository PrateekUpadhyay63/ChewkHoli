import { Component, OnInit } from "@angular/core";
// lanaguage
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { Router } from "@angular/router";
import { GroupManagementService } from "../group-management.service";
import { Observable } from "rxjs";
import { UserManagementService } from "../../user-management/user-management.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { repeaterAnimation } from "../add-group/form-repeater.animation";
import { async } from "@angular/core/testing";
import { onGroupUpdateSend } from "../../dashboard/chat/utils/group-update";
import { XMPPService } from "../../dashboard/ejab.service";
import { ChatsService } from "../../dashboard/chat/chats.service";
import { IEventMessage } from "../../dashboard/chat/send-message";
import { EventTypes } from "../../dashboard/chat/utils/event-type-enums";
@Component({
  selector: "app-edit-group",
  templateUrl: "./edit-group.component.html",
  styleUrls: ["./edit-group.component.scss"],
  animations: [repeaterAnimation],
})
export class EditGroupComponent implements OnInit {
  public url = this.router.url;
  public urlLastValue;
  public selectedStatus;
  public selectedLanguage;
  public rows;
  public currentRow;
  public avatarImage: string;
  public groupData: any[] = [];
  public userData: any[] = [];
  public superuserData: any[] = [];
  public selectedFile: File = null;
  public loading = false;
  public isSharedGroupChecked: boolean = false;
  public currentUserDetails: any;
  public multiOrganizationNameStored = [];
  public OtherorganizationName = [];
  public addClicked: boolean = false;
  showMaxLengthError: boolean = false;

  imageError = false;
  public isDisabled: boolean = false;
  // form
  public editGroupForm: FormGroup;
  public onGroupUpdate: onGroupUpdateSend;
  public alretLevel = [
    { id: 1, value: "Grey" },
    { id: 2, value: "Yellow" },
    { id: 3, value: "Red" },
  ];
  public language = [
    { id: 1, value: "Arabic" },
    { id: 2, value: "English" },
  ];

  public selecteedAdmins = [];
  // Select Multi sub-admin Variable
  public multiSubAdminUsers: any[] = [];
  // public multiSubAdminUsers:Observable< any []>;
  public multiSubAdminSelected: any[] = [];
  // Select Multi End user Variable
  public multiEndUsers: any = [];
  // public multiEndUsers: Observable<any[]>;
  public multiEndbUsersSelected = [];

  // Select Multi Super user Variable
  public multiSuperUsers: Observable<any[]>;
  public multiSuperbUsersSelected = [];
  public multiOrganizationSubAdminSelected = [];
  // code from view group
  public OrganizationName: any[] = [];
  public AllOrganizationName: any[] = [];
  public totalOrgCount: number = 0;

  // public
  public addnewOrg: { selectOrg: any; selectSubAdmin: string }[] = [];
  public eventMessage: IEventMessage;
  constructor(
    public formBuilder: FormBuilder,
    private _coreTranslationService: CoreTranslationService,
    private groupManagementSvc: GroupManagementService,
    private userManagementSvc: UserManagementService,
    private _toastrService: ToastrService,
    private router: Router,
    private xamppSvc: XMPPService,
    private chatsSvc: ChatsService
  ) {
    this._coreTranslationService.translate(english, arabic);
    this.urlLastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }
  check = false;

  public disabledValue: boolean = true;

  public adminValue = false;

  ngOnInit(): void {
    this.currentUserDetails = JSON.parse(localStorage.getItem("currentUser")); //to get current loged in user data
    this.getGroupData();
    if (
      (this.currentUserDetails.Role.id == 5 ||
        this.currentUserDetails.Role.id == 3) &&
      this.currentUserDetails.Organization.id == 1
    )
      this.adminValue = false;
    else this.adminValue = true;
    this.selectedLanguage = this.language[0];
    this.getAllUser();
  }

  checkMemberAllowed() {
    if (this.currentUserDetails.Role.id == 5) {
      return false;
    } else {
      let value = true;
      this.groupData.map((member) => {
        if (
          member.user_id == this.currentUserDetails.id &&
          member.added_by === 5 &&
          this.currentUserDetails.Role.id == 3
        ) {
          value = false;
          return;
        }
      });

      return value;
    }
  }
  dubaiPoliceSuperbUsersSelected;
  //get current  group data
  getGroupData() {
    this.groupManagementSvc
      .getGroupDetailsByID(this.urlLastValue)
      .subscribe((res: any) => {
        this.rows = res.data.groupDetails;
        this.groupData = res.data.groupDetails.members;
        this.avatarImage = res.data.groupDetails.image;
        this.isSharedGroupChecked = res.data.groupDetails.shared;
        this.selectedStatus = true;
        if((this.currentUserDetails.id !== this.rows.created_by) && (this.currentUserDetails.Role.id !== 5)){
          this.isDisabled = true;
        }
        else{
          this.isDisabled = false;
        }
        if (this.groupData.length > 0) {
          this.multiSubAdminSelected = this.groupData.filter(
            (ele: any) =>
              ele.organization_id == this.currentUserDetails.Organization.id &&
              ele.role_id == 3
          ); // select sub admins for current org. user
          this.multiEndbUsersSelected = this.groupData.filter(
            (ele: any) =>
              ele.organization_id == this.currentUserDetails.Organization.id &&
              ele.role_id == 1
          ); // select sub admins for current org. user
          this.multiSuperbUsersSelected = this.groupData.filter(
            (ele: any) =>
              ele.organization_id == this.currentUserDetails.Organization.id &&
              ele.role_id == 2
          ); // select sub admins for current org. user
          this.superuserData = this.multiSuperbUsersSelected; // console.log("super user selected", this.multiSuperbUsersSelected);

          this.dubaiPoliceSubAdminUsers = this.groupData.filter(
            (ele: any) => ele.organization_id == 1 && ele.role_id == 3
          ); // other sub admin for selection form current org. user list

          this.dubaiPoliceEndUsers = this.groupData.filter(
            (ele: any) => ele.organization_id == 1 && ele.role_id == 1
          ); // other sub admin for selection form current org. user list

          this.dubaiPoliceSuperbUsersSelected = this.groupData.filter(
            (ele: any) => ele.organization_id == 1 && ele.role_id == 2
          ); // select sub admins for current org. user

          //
        }

        this.getOrganization();
      });
  }

  changeUser(event) {
    let members = [];
    let selectedUser = event;

    members.push({
      user_id: selectedUser.id,
      role_id: selectedUser.Role.id,
      organization_id: selectedUser.Organization.id,
      fcm_token: selectedUser.fcm_token,
    });

    // this.groupManagementSvc
    //   .updateGroupDetails(this.urlLastValue, {
    //     members: JSON.stringify(members),
    //   })
    //   .subscribe(
    //     (res: any) => {
    //       this._toastrService.success(res.message, "Success!", {
    //         toastClass: "toast ngx-toastr",
    //         closeButton: true,
    //       });
    //     },
    //     (err) => {
    //       // this.loading = false;
    //       this._toastrService.error(err.error.message, "Error!", {
    //         toastClass: "toast ngx-toastr",
    //         closeButton: true,
    //       });
    //     }
    //   );
  }

  // to get all user, sub admin and super user.

  dubaiPoliceSubAdminUsers = [];
  dubaiPoliceEndUsers = [];
  DubaimultiEndUsers = [];
  getAllUser() {
    this.groupManagementSvc.getAllUserDataFOrGroup().subscribe((res: any) => {
      this.userData = res.data;
      if (this.userData.length > 0) {
        this.multiSubAdminUsers = this.userData.filter(
          (ele: any) =>
            ele.Organization.id == this.currentUserDetails.Organization.id &&
            ele.Role.id == 3
        ); // other sub admin for selection form current org. user list
        this.DubaimultiEndUsers = this.userData.filter(
          (ele: any) =>
            ele.Organization.id == this.currentUserDetails.Organization.id &&
            ele.Role.id == 1
        ); // other sub admin for selection form current org. user list

        this.multiEndUsers = this.userData.filter(
          (ele: any) =>
            ele.Organization.id == this.currentUserDetails.Organization.id &&
            ele.Role.id == 1
        ); // other sub admin for selection form current org. user list
      }
    });
  }

  // filter  already added organization from group
  getOrganization() {
    this.groupManagementSvc.getOrgList().subscribe((res: any) => {
      this.AllOrganizationName = res.data;
      this.groupData.forEach((element) => {
        // console.log("ele", element)
        res.data.filter((ele) => {
          //  console.log("elemn",ele)
          if (ele.id != 1 && ele.id == element.organization_id) {
            this.OrganizationName.push({
              id: ele.id,
              name: ele.name,
              member: [element],
            });
            // console.log("org", this.OrganizationName);

            const result = [];
            const map = new Map();
            for (const item of this.OrganizationName) {
              if (!map.has(item.id)) {
                map.set(item.id, true); // set any value to Map
                result.push({ id: item.id, name: item.name });
              }
            }
            // console.log("result", result);

            let array = [];
            result.forEach((org_id) => {
              this.groupData.filter((org_id2) => {
                if (org_id.id == org_id2.organization_id) {
                  array.push({
                    id: org_id.id,
                    name: org_id.name,
                    member: [org_id2],
                  });
                }
              });
            });
            // console.log("array", array);

            const result1 = Array.from(new Set(array.map((s) => s.id))).map(
              (lab) => {
                //  console.log("name", lab)
                return {
                  id: lab,
                  member: array
                    .filter((s) => s.id === lab)
                    .map((edition) => {
                      return edition.member[0];
                    }),
                };
              }
            );
            let abc = result1.map((item) => {
              this.AllOrganizationName.forEach((item1) => {
                if (item.id == item1.id) {
                  item["name"] = item1.name;
                }
              });
              return item;
            });
            this.OrganizationName = abc;
          }
        });
      });
      let name = [];
      this.OrganizationName.forEach((ele) => {
        name.push(ele.id);
        this.onOrgnizationSelect(ele);
      });
      // console.log("id", name);
      let array = [];
      array = this.AllOrganizationName.filter((ele) => {
        if (!name.includes(ele.id) && ele.id != 1) {
          return ele;
        }
      });
      this.OtherorganizationName = array;
      this.totalOrgCount = array.length + 1;
    });
  }

  // Group image upload
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

  addItem() {
    // this.addClicked = true;
    this.addnewOrg.push({
      selectOrg: null,
      selectSubAdmin: "",
    });
    this.totalOrgCount--;
  }

  deleteItem(id, delOrgId) {
    for (let i = 0; i < this.OrganizationName.length; i++) {
      if (this.OrganizationName.indexOf(this.OrganizationName[i]) === id) {
        this.OrganizationName.splice(i, 1);
        this.AllOrganizationName.filter((ele) => {
          if (ele.id == delOrgId.id) {
            this.OtherorganizationName.push(ele);
          }
        });
        break;
      }
    }
    this.groupManagementSvc
      .deleteOrgFromGroup(delOrgId.id, this.urlLastValue)
      .subscribe((res: any) => {
        //  console.log(res)
        this._toastrService.success(res.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      });
    this.totalOrgCount++;
  }

  deletenewOrg(id, delOrgId) {
    // console.log("new added delete org", id);
    for (let i = 0; i < this.addnewOrg.length; i++) {
      if (this.addnewOrg.indexOf(this.addnewOrg[i]) === id) {
        this.addnewOrg.splice(i, 1);
        this.AllOrganizationName.filter((ele) => {
          if (ele.id == delOrgId) {
            this.OtherorganizationName.push(ele);
          }
        });
        break;
      }
    }
    this.totalOrgCount++;
  }

  onShareGroupchecked(isChecked: boolean) {
    this.isSharedGroupChecked = isChecked;
  }

  // get sub admins for selected org.
  onOrgnizationSelect(eve) {
    this.groupManagementSvc.getAllSubAdminList(eve.id).subscribe((res: any) => {
      this.multiOrganizationSubAdminSelected = res.data;
      // console.log("user", this.multiOrganizationSubAdminSelected);
    });
    // console.log("eve", eve)
    this.OtherorganizationName.splice(
      this.OtherorganizationName.findIndex((x) => x.id == eve.id),
      1
    );
  }

  // On Sub Admin is removed Transfer To will be removed.
  onSelectedSubAdminDelete(item1) {
    this.groupManagementSvc
      .deleteMemberById(item1.member_id)
      .subscribe((res: any) => {
        // on Real time group Update
        res.data.old_members.forEach((element) => {
          this.onGroupUpdate = {
            toGroupJid: res.data.room_jid,
            groupId: res.data.group_id,
            toMemberJid: element.user.jid,
          };
          this.xamppSvc.onGroupUpdate(this.onGroupUpdate);
        });
        // on  member remove send event stanza
        if (res.data.removed_member) {
          this.eventMessage = {
            toGroup: res.data.room_jid,
            groupId: res.data.group_id,
            groupName: res.data.name,
            groupImageUrl: res.data.image || "",
            message: `${this.currentUserDetails.name} removed ${res.data.removed_member.member_name}`,
            eventType: EventTypes.removeMember,
          };
          this.onGroupMemberAddEvent(this.eventMessage);
        }
        this._toastrService.success(res.message, "Success!", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      });
  }

  onSelectedSubAdminClear(item1) {
    let payload = {
      group_id: this.urlLastValue,
      role_id: 3,
      member_id: item1?.id || item1?.user_id,
      organization_id: item1.Organization?.id || item1?.organization_id,
    };
    // console.log("payload", payload);
    this.groupManagementSvc.deleteMember(payload).subscribe(
      (res: any) => {
        if (res.success) {
          res.data.old_members.forEach((element) => {
            this.onGroupUpdate = {
              toGroupJid: res.data.room_jid,
              groupId: res.data.group_id,
              toMemberJid: element.user.jid,
            };
            this.xamppSvc.onGroupUpdate(this.onGroupUpdate);
          });
          // on  member remove send event stanza
          if (res.data.removed_member) {
            this.eventMessage = {
              toGroup: res.data.room_jid,
              groupId: res.data.group_id,
              groupName: res.data.name,
              groupImageUrl: res.data.image || "",
              message: `${this.currentUserDetails.name} removed ${res.data.removed_member.member_name}`,
              eventType: EventTypes.removeMember,
            };
            this.onGroupMemberAddEvent(this.eventMessage);
          }
          this._toastrService.success(res.message, "Success!", {
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

  onSelectedUserClear(item1) {
    console.log("item", item1);

    let payload = {
      group_id: this.urlLastValue,
      role_id: 1,
      member_id: item1.id || item1.member_id,
      organization_id: item1.Organization?.id || item1.organization_id,
    };
    this.groupManagementSvc.deleteMember(payload).subscribe(
      (res: any) => {
        if (res.success) {
          res.data.old_members.forEach((element) => {
            this.onGroupUpdate = {
              toGroupJid: res.data.room_jid,
              groupId: res.data.group_id,
              toMemberJid: element.user.jid,
            };
            this.xamppSvc.onGroupUpdate(this.onGroupUpdate);
          });
          // on  member remove send event stanza
          if (res.data.removed_member) {
            this.eventMessage = {
              toGroup: res.data.room_jid,
              groupId: res.data.group_id,
              groupName: res.data.name,
              groupImageUrl: res.data.image || "",
              message: `${this.currentUserDetails.name} removed ${res.data.removed_member.member_name}`,
              eventType: EventTypes.removeMember,
            };
            this.onGroupMemberAddEvent(this.eventMessage);
          }
          this._toastrService.success(res.message, "Success!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        }

        if (item1.Organization.id == 1) {
          this.dubaiPoliceEndUsers = this.dubaiPoliceEndUsers.filter(function (
            el
          ) {
            if (el.id) return el.id != item1.id;
            if (el.user_id) return el.user_id != item1.id;
          });
        } else {
          this.multiEndbUsersSelected = this.multiEndbUsersSelected.filter(
            function (el) {
              if (el.id) return el.id != item1.id;
              if (el.user_id) return el.user_id != item1.id;
            }
          );
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

  onSelectedSuperUserClear(item1) {
    let payload: any;
    if (item1.member_id) {
      payload = {
        group_id: this.urlLastValue,
        role_id: 2,
        member_id: item1.user_id,
        organization_id: item1.organization_id,
      };
    } else {
      payload = {
        group_id: this.urlLastValue,
        role_id: 2,
        member_id: item1.id,
        organization_id: item1.Organization.id,
      };
    }

    this.groupManagementSvc.deleteMember(payload).subscribe(
      (res: any) => {
        if (res.success) {
          res.data.old_members.forEach((element) => {
            this.onGroupUpdate = {
              toGroupJid: res.data.room_jid,
              groupId: res.data.group_id,
              toMemberJid: element.user.jid,
            };
            this.xamppSvc.onGroupUpdate(this.onGroupUpdate);
          });

          this._toastrService.success(res.message, "Success!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });

          // on  member remove send event stanza
          if (res.data.removed_member) {
            this.eventMessage = {
              toGroup: res.data.room_jid,
              groupId: res.data.group_id,
              groupName: res.data.name,
              groupImageUrl: res.data.image || "",
              message: `${this.currentUserDetails.name} removed ${res.data.removed_member.member_name}`,
              eventType: EventTypes.removeMember,
            };
            this.onGroupMemberAddEvent(this.eventMessage);
          }
        }

        if (item1.Organization?.id == 1 || item1.organization_id == 1) {
          this.dubaiPoliceSuperbUsersSelected =
            this.dubaiPoliceSuperbUsersSelected.filter(function (el) {
              if (el.user_id && item1.id) return el.user_id != item1.id;
              if (el.user_id && item1.user_id)
                return el.user_id != item1.user_id;
              if (el.id) return el.id != item1.id;
            });
        } else {
          this.multiSuperbUsersSelected = this.multiSuperbUsersSelected.filter(
            function (el) {
              if (el.user_id && item1.id) return el.user_id != item1.id;
              if (el.user_id && item1.user_id)
                return el.user_id != item1.user_id;
              if (el.id) return el.id != item1.id;
            }
          );
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

  submitNew(form) {
    if (form.invalid || this.imageError) {
      return;
    }
    
    let changedSubAmdin = [];
    let chagnedEndUser = [];
    console.log("end user selected: " , this.dubaiPoliceEndUsers);
    console.log('superUserSelected: ', this.dubaiPoliceSuperbUsersSelected);
    for (let i = 0; i < this.dubaiPoliceSuperbUsersSelected.length; i++) {
      if (+this.dubaiPoliceSuperbUsersSelected[i]["id"] >= 0) {
        changedSubAmdin.push(this.dubaiPoliceSuperbUsersSelected[i]);
      } else if (+this.dubaiPoliceSuperbUsersSelected[i]["user_id"] >= 0) {
        this.dubaiPoliceSuperbUsersSelected[i]["id"] = this.dubaiPoliceSuperbUsersSelected[i]["user_id"];
        changedSubAmdin.push(this.dubaiPoliceSuperbUsersSelected[i]);
      }
    }

    for (let i = 0; i < this.dubaiPoliceEndUsers.length; i++) {
      if (this.dubaiPoliceEndUsers[i]["id"] >= 0) {
        chagnedEndUser.push(this.dubaiPoliceEndUsers[i]);
      } else if (this.dubaiPoliceEndUsers[i]["user_id"] >= 0) {
        this.dubaiPoliceEndUsers[i]["id"] = this.dubaiPoliceEndUsers[i]["user_id"];
        chagnedEndUser.push(this.dubaiPoliceEndUsers[i]);
      }
    }

    let intersectionOfEndUser = chagnedEndUser.filter(
      (a) => !changedSubAmdin.some((b) => a.id === b.id)
    );

    // let intersectionOfEndUser = this.dubaiPoliceEndUsers.filter(
    //   (a) =>
    //     !this.dubaiPoliceSuperbUsersSelected.some(
    //       (b) => a.id === b.user_id || a.user_id === b.user_id
    //     )
    // );

    this.loading = true;
    const members = [];

    this.dubaiPoliceSubAdminUsers.forEach((ele: any) => {
      //  console.log("ele",ele)
      if (ele.user_id != null) {
        members.push({
          user_id: ele.user_id,
          role_id: ele.role_id,
          organization_id: ele.organization_id,
          fcm_token: ele.fcm_token,
        });
      } else if (ele.id) {
        members.push({
          user_id: ele.id,
          role_id: ele.Role.id,
          organization_id: ele.Organization.id,
          fcm_token: ele.fcm_token,
        });
      }
    });

    this.dubaiPoliceSuperbUsersSelected.forEach((ele) => {
      if (ele.user_id) {
        members.push({
          user_id: ele.user_id,
          role_id: 2,
          organization_id: ele.organization_id,
          fcm_token: ele.fcm_token,
        });
      } else if (ele.id) {
        members.push({
          user_id: ele.id,
          role_id: 2,
          organization_id: ele.Organization.id,
          fcm_token: ele.fcm_token,
        });
      }
    });

    let data = [];
    // filter super user details, shared group

    if (this.currentUserDetails.Organization.id != 1) {
      this.multiSuperbUsersSelected.forEach((ele) => {
        if (ele.user_id) {
          members.push({
            user_id: ele.user_id,
            role_id: 2,
            organization_id: ele.organization_id,
            fcm_token: ele.fcm_token,
          });
        } else if (ele.id) {
          members.push({
            user_id: ele.id,
            role_id: 2,
            organization_id: ele.Organization.id,
            fcm_token: ele.fcm_token,
          });
        }
      });

      this.multiSubAdminSelected.forEach((ele: any) => {
        //  console.log("ele",ele)
        if (ele.user_id != null) {
          members.push({
            user_id: ele.user_id,
            role_id: ele.role_id,
            organization_id: ele.organization_id,
            fcm_token: ele.fcm_token,
          });
        } else if (ele.id) {
          members.push({
            user_id: ele.id,
            role_id: ele.Role.id,
            organization_id: ele.Organization.id,
            fcm_token: ele.fcm_token,
          });
        }
      });

      data = this.multiEndbUsersSelected.filter(
        (a) =>
          !this.multiSuperbUsersSelected.some(
            (b) => a.id === b.user_id || a.user_id === b.user_id
          )
      );
    }

    // // filter  user details, shared group
    // let array = [];
    // if (this.currentUserDetails.Organization.id != 1) {
    //   this.multiSuperbUsersSelected.forEach((ele) => {
    //     if (ele.id) {
    //       array.push(ele.id);
    //     }
    //     if (ele.member_id) {
    //       array.push(ele.user_id);
    //     }
    //   });
    // }

    // let arrayDubai = [];
    // this.dubaiPoliceSuperbUsersSelected.forEach((ele) => {
    //   if (ele.id) {
    //     arrayDubai.push(ele.id);
    //   }
    //   if (ele.member_id) {
    //     arrayDubai.push(ele.user_id);
    //   }
    // });

    // val = this.dubaiPoliceEndUsers.filter((ele) => {
    //   if (!arrayDubai.includes(ele.id) || !arrayDubai.includes(ele.user_id)) {
    //     return ele;
    //   }
    // });

    // console.log(val); ye hai kalesh

    [...data, ...intersectionOfEndUser].forEach((ele) => {
      if (ele.user_id) {
        members.push({
          user_id: ele.user_id,
          role_id: 1,
          organization_id: ele.Organization?.id || ele.organization_id,
          fcm_token: ele.fcm_token,
        });
      } else
        members.push({
          user_id: ele.id,
          role_id: 1,
          organization_id: ele.Organization?.id || ele.organization_id,
          fcm_token: ele.fcm_token,
        });
    });

    // show only when  other org. selected sub admins
    if (this.isSharedGroupChecked) {
      this.OrganizationName.forEach((ele: any) => {
        if (ele.member.length > 0) {
          ele.member.forEach((element) => {
            members.push({
              user_id: element.id || element.user_id,
              role_id: 3,
              organization_id: ele.id,
              member_id: element.member_id,
              fcm_token: ele.fcm_token,
            });
          });
        }
      });

      this.addnewOrg.forEach((ele: any) => {
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

    if (!this.selectedFile) {
      this.selectedFile = null;
    }

    const formData = new FormData();

    let oldMembers = [];
    members.map((val) => {
      let index = oldMembers.findIndex((a) => a.user_id == val.user_id);
      if (index > -1 && val.member_id) oldMembers[index] = val;
      else oldMembers.push(val);
    });

    formData.append("name", form.value.name);
    formData.append("languageId", form.value.language);
    formData.append("status", form.value.status);
    formData.append("alert_level", form.value.alert_level);
    formData.append("profile_pic", this.selectedFile);
    if (this.currentUserDetails.Role.id == 5)
      formData.append("created_by", JSON.stringify(this.currentUserDetails.id));
    formData.append(
      "organization_id",
      JSON.stringify(this.currentUserDetails.Organization.id)
    );
    formData.append("shared", JSON.stringify(this.isSharedGroupChecked));
    formData.append("members", JSON.stringify(oldMembers));

    this.groupManagementSvc
      .updateGroupDetails(this.urlLastValue, formData)
      .subscribe(
        (res: any) => {
          //  console.log(res)
          this._toastrService.success(res.message, "Success!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.loading = false;
          this.router.navigateByUrl("/group-management/group-list");
          this.onGroupChangeData(
            res.data.groupDetails.id,
            res.data.groupDetails.room_jid
          );

          // on new member added send event stanza
          if (res.data.new_members_added) {
            res.data.new_members_added.forEach((element) => {
              this.eventMessage = {
                toGroup: res.data.groupDetails.room_jid,
                groupId: res.data.groupDetails.id,
                groupName: res.data.groupDetails.name,
                groupImageUrl: res.data.groupDetails.image || "",
                message: `${this.currentUserDetails.name} added ${element.member_name}`,
                eventType: EventTypes.addMember,
              };
              this.onGroupMemberAddEvent(this.eventMessage);
            });
          }

          // on group alert level change
          if (res.data.alert_changed) {
            const colorText = [{ id: 1, name: "Grey" }, { id: 2, name: "Orange" }, { id: 3, name: "Red" }].filter((el) => {
              return el.id == res.data.groupDetails.alert_level;
            })[0].name;

            this.eventMessage = {
              toGroup: res.data.groupDetails.room_jid,
              groupId: res.data.groupDetails.id,
              groupName: res.data.groupDetails.name,
              groupImageUrl: res.data.groupDetails.image || "",
              message: `${this.currentUserDetails.name} changed group alert level to ${colorText}`,
              eventType: EventTypes.alertLevelUpdate,
            };
            this.onGroupMemberAddEvent(this.eventMessage);
          }
        },
        (err) => {
          this.loading = false;
          this._toastrService.error(err.error.message, "Error!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        }
      );
  }

  // submit(form) {
  //   // if (form.invalid || this.imageError) {
  //   //   return;
  //   // }

  //   // let intersectionOfEndUser = this.dubaiPoliceEndUsers.filter(
  //   //   (a) =>
  //   //     !this.dubaiPoliceSuperbUsersSelected.some(
  //   //       (b) => a.id === b.id || a.user_id === b.user_id
  //   //     )

  //   // );


  //   // this.loading = true;
  //   // const members = [];

  //   // this.dubaiPoliceSubAdminUsers.forEach((ele: any) => {
  //   //   //  console.log("ele",ele)
  //   //   if (ele.user_id != null) {
  //   //     members.push({
  //   //       user_id: ele.user_id,
  //   //       role_id: ele.role_id,
  //   //       organization_id: ele.organization_id,
  //   //       fcm_token: ele.fcm_token,
  //   //     });
  //   //   } else if (ele.id) {
  //   //     members.push({
  //   //       user_id: ele.id,
  //   //       role_id: ele.Role.id,
  //   //       organization_id: ele.Organization.id,
  //   //       fcm_token: ele.fcm_token,
  //   //     });
  //   //   }
  //   // });

  //   // this.dubaiPoliceSuperbUsersSelected.forEach((ele) => {
  //   //   if (ele.user_id) {
  //   //     members.push({
  //   //       user_id: ele.user_id,
  //   //       role_id: 2,
  //   //       organization_id: ele.organization_id,
  //   //       fcm_token: ele.fcm_token,
  //   //     });
  //   //   } else if (ele.id) {
  //   //     members.push({
  //   //       user_id: ele.id,
  //   //       role_id: 2,
  //   //       organization_id: ele.Organization.id,
  //   //       fcm_token: ele.fcm_token,
  //   //     });
  //   //   }
  //   // });
  //   if (form.invalid || this.imageError) return;

  //   // this.loading = true;

  //   let members = [];
  //   let changedSubAmdin = [];
  //   let chagnedEndUser = [];
  //   console.log('superUserSele', this.dubaiPoliceSuperbUsersSelected)
  //   for (let i = 0; i < this.dubaiPoliceSuperbUsersSelected.length; i++) {
  //     if (this.dubaiPoliceSuperbUsersSelected[i]["id"] >= 0) {
  //       changedSubAmdin.push(this.dubaiPoliceSuperbUsersSelected[i]);
  //     } else if (this.dubaiPoliceSuperbUsersSelected[i]["user_id"] >= 0) {
  //       this.dubaiPoliceSuperbUsersSelected[i]["id"] = this.dubaiPoliceSuperbUsersSelected[i]["user_id"];
  //       changedSubAmdin.push(this.dubaiPoliceSuperbUsersSelected[i]);
  //     }
  //   }

  //   for (let i = 0; i < this.dubaiPoliceEndUsers.length; i++) {
  //     if (this.dubaiPoliceEndUsers[i]["id"] >= 0) {
  //       chagnedEndUser.push(this.dubaiPoliceEndUsers[i]);
  //     } else if (this.dubaiPoliceEndUsers[i]["user_id"] >= 0) {
  //       this.dubaiPoliceEndUsers[i]["id"] = this.dubaiPoliceEndUsers[i]["user_id"];
  //       chagnedEndUser.push(this.dubaiPoliceEndUsers[i]);
  //     }
  //   }

  //   let intersectionOfEndUser = chagnedEndUser.filter(
  //     (a) => !changedSubAmdin.some((b) => a.id === b.id)
  //   );
  //   console.log("🚀 ~ changedSubAmdin", changedSubAmdin);
  //   console.log("🚀 ~ changedEnUser", chagnedEndUser);
  //   console.log("🚀 ~ intersectionOfEndUser", intersectionOfEndUser);
  //   //         console.log('this.endUser',this.dubaiPoliceEndUsers);
  //   // console.log('this.SubAdmiUsers',this.dubaiPoliceSuperbUsersSelected);
  //   //         this.dubaiPoliceSubAdminUsers.forEach((ele: any) => members.push({
  //   //         user_id: ele.user_id || ele.id,
  //   //         role_id: ele.role_id || ele.Role.id,
  //   //         organization_id: ele.organization_id || ele.Organization.id,
  //   //         fcm_token: ele.fcm_token
  //   //         }));

  //   //         this.dubaiPoliceSuperbUsersSelected
  //   //         .filter((ele: any) => !this.dubaiPoliceSuperbUsersSelected.some((obj: any) => (ele.id === obj.user_id && ele.user_id === obj.id) || (ele.id === obj.id)))
  //   //         .map((d) => members.push({
  //   //         user_id: d.user_id || d.id,
  //   //         role_id: d.role_id || d.Role.id,
  //   //         organization_id: d.organization_id || d.Organization.id,
  //   //         fcm_token: d.fcm_token
  //   //         }));


  //   //          this.dubaiPoliceEndUsers.forEach((ele: any) => members.push({
  //   //         user_id: ele.user_id || ele.id,
  //   //         role_id: ele.role_id || ele.Role.id,
  //   //         organization_id: ele.organization_id || ele.Organization.id,
  //   //         fcm_token: ele.fcm_token
  //   //         }))

  //   //         for (var i = this.dubaiPoliceEndUsers.length - 1; i >= 0; i--) {
  //   //         for (var j = 0; j < this.dubaiPoliceSuperbUsersSelected.length; j++) {
  //   //         if (this.dubaiPoliceEndUsers[i] && this.dubaiPoliceEndUsers[i].user_id === this.dubaiPoliceSuperbUsersSelected[j].user_id || this.dubaiPoliceSuperbUsersSelected[j].id) {
  //   //         console.log("match kar gyi");
  //   //         console.log(this.dubaiPoliceEndUsers[i],this.dubaiPoliceEndUsers[i].user_id ,"Only Id matching", this.dubaiPoliceSuperbUsersSelected[j].user_id );
  //   //         console.log(this.dubaiPoliceEndUsers[i].user_id ,"Only UserId matching", this.dubaiPoliceSuperbUsersSelected[j].user_id );

  //   //         this.dubaiPoliceEndUsers.splice(i, 1);
  //   //         members.push({
  //   //           user_id: this.dubaiPoliceEndUsers[i].id || this.dubaiPoliceEndUsers[i].user_id,
  //   //           role_id: 2,
  //   //           organization_id: this.dubaiPoliceEndUsers[i].organization_id,
  //   //           fcm_token: this.dubaiPoliceEndUsers[i].fcm_token


  //   //         });
  //   //         }

  //   //         }

  //   //         }
  //   //         console.log("End user : ", this.dubaiPoliceEndUsers)

  //   //         console.log("Dubai Police Super Users Selected: ", this.dubaiPoliceSuperbUsersSelected)

  //   //         console.log("Member : ", members);


  //   let data = [];
  //   // filter super user details, shared group

  //   if (this.currentUserDetails.Organization.id != 1) {
  //     this.multiSuperbUsersSelected.forEach((ele) => {
  //       if (ele.user_id) {
  //         members.push({
  //           user_id: ele.user_id,
  //           role_id: 2,
  //           organization_id: ele.organization_id,
  //           fcm_token: ele.fcm_token,
  //         });
  //       } else if (ele.id) {
  //         members.push({
  //           user_id: ele.id,
  //           role_id: 2,
  //           organization_id: ele.Organization.id,
  //           fcm_token: ele.fcm_token,
  //         });
  //       }
  //     });

  //     this.multiSubAdminSelected.forEach((ele: any) => {
  //       //  console.log("ele",ele)
  //       if (ele.user_id != null) {
  //         members.push({
  //           user_id: ele.user_id,
  //           role_id: ele.role_id,
  //           organization_id: ele.organization_id,
  //           fcm_token: ele.fcm_token,
  //         });
  //       } else if (ele.id) {
  //         members.push({
  //           user_id: ele.id,
  //           role_id: ele.Role.id,
  //           organization_id: ele.Organization.id,
  //           fcm_token: ele.fcm_token,
  //         });
  //       }
  //     });

  //     data = this.multiEndbUsersSelected.filter(
  //       (a) =>
  //         !this.multiSuperbUsersSelected.some(
  //           (b) => a.id === b.user_id || a.user_id === b.user_id
  //         )
  //     );
  //   }

  //   // // filter  user details, shared group
  //   // let array = [];
  //   // if (this.currentUserDetails.Organization.id != 1) {
  //   //   this.multiSuperbUsersSelected.forEach((ele) => {
  //   //     if (ele.id) {
  //   //       array.push(ele.id);
  //   //     }
  //   //     if (ele.member_id) {
  //   //       array.push(ele.user_id);
  //   //     }
  //   //   });
  //   // }

  //   // let arrayDubai = [];
  //   // this.dubaiPoliceSuperbUsersSelected.forEach((ele) => {
  //   //   if (ele.id) {
  //   //     arrayDubai.push(ele.id);
  //   //   }
  //   //   if (ele.member_id) {
  //   //     arrayDubai.push(ele.user_id);
  //   //   }
  //   // });

  //   // val = this.dubaiPoliceEndUsers.filter((ele) => {
  //   //   if (!arrayDubai.includes(ele.id) || !arrayDubai.includes(ele.user_id)) {
  //   //     return ele;
  //   //   }
  //   // });

  //   // console.log(val); ye hai kalesh

  //   [...data, ...intersectionOfEndUser].forEach((ele) => {
  //     if (ele.user_id) {
  //       members.push({
  //         user_id: ele.user_id,
  //         role_id: 1,
  //         organization_id: ele.Organization?.id || ele.organization_id,
  //         fcm_token: ele.fcm_token,
  //       });
  //     } else
  //       members.push({
  //         user_id: ele.id,
  //         role_id: 1,
  //         organization_id: ele.Organization?.id || ele.organization_id,
  //         fcm_token: ele.fcm_token,
  //       });
  //   });

  //   // show only when  other org. selected sub admins
  //   if (this.isSharedGroupChecked) {
  //     this.OrganizationName.forEach((ele: any) => {
  //       if (ele.member.length > 0) {
  //         ele.member.forEach((element) => {
  //           members.push({
  //             user_id: element.id || element.user_id,
  //             role_id: 3,
  //             organization_id: ele.id,
  //             member_id: element.member_id,
  //             fcm_token: ele.fcm_token,
  //           });
  //         });
  //       }
  //     });

  //     this.addnewOrg.forEach((ele: any) => {
  //       if (ele.selectSubAdmin.length > 0) {
  //         ele.selectSubAdmin.forEach((element) => {
  //           members.push({
  //             user_id: element,
  //             role_id: 3,
  //             organization_id: ele.selectOrg,
  //             fcm_token: ele.fcm_token,
  //           });
  //         });
  //       }
  //     });
  //   }

  //   if (!this.selectedFile) {
  //     this.selectedFile = null;
  //   }

  //   const formData = new FormData();

  //   let oldMembers = [];
  //   members.map((val) => {
  //     let index = oldMembers.findIndex((a) => a.user_id == val.user_id);
  //     if (index > -1 && val.member_id) oldMembers[index] = val;
  //     else oldMembers.push(val);
  //   });

  //   formData.append("name", form.value.name);
  //   formData.append("languageId", form.value.language);
  //   formData.append("status", form.value.status);
  //   formData.append("alert_level", form.value.alert_level);
  //   formData.append("profile_pic", this.selectedFile);
  //   if (this.currentUserDetails.Role.id == 5)
  //     formData.append("created_by", JSON.stringify(this.currentUserDetails.id));
  //   formData.append(
  //     "organization_id",
  //     JSON.stringify(this.currentUserDetails.Organization.id)
  //   );
  //   formData.append("shared", JSON.stringify(this.isSharedGroupChecked));
  //   formData.append("members", JSON.stringify(oldMembers));

  //   this.groupManagementSvc
  //     .updateGroupDetails(this.urlLastValue, formData)
  //     .subscribe(
  //       (res: any) => {
  //         //  console.log(res)
  //         this._toastrService.success(res.message, "Success!", {
  //           toastClass: "toast ngx-toastr",
  //           closeButton: true,
  //         });
  //         this.loading = false;
  //         this.router.navigateByUrl("/group-management/group-list");
  //         this.onGroupChangeData(
  //           res.data.groupDetails.id,
  //           res.data.groupDetails.room_jid
  //         );

  //         // on new member added send event stanza
  //         if (res.data.new_members_added) {
  //           res.data.new_members_added.forEach((element) => {
  //             this.eventMessage = {
  //               toGroup: res.data.groupDetails.room_jid,
  //               groupId: res.data.groupDetails.id,
  //               groupName: res.data.groupDetails.name,
  //               groupImageUrl: res.data.groupDetails.image || "",
  //               message: `${this.currentUserDetails.name} added ${element.member_name}`,
  //               eventType: EventTypes.addMember,
  //             };
  //             this.onGroupMemberAddEvent(this.eventMessage);
  //           });
  //         }

  //         // on group alert level change
  //         if (res.data.alert_changed) {
  //           const colorText = [{ id: 1, name: "Grey" }, { id: 2, name: "Orange" }, { id: 3, name: "Red" }].filter((el) => {
  //             return el.id == res.data.groupDetails.alert_level;
  //           })[0].name;

  //           this.eventMessage = {
  //             toGroup: res.data.groupDetails.room_jid,
  //             groupId: res.data.groupDetails.id,
  //             groupName: res.data.groupDetails.name,
  //             groupImageUrl: res.data.groupDetails.image || "",
  //             message: `${this.currentUserDetails.name} changed group alert level to ${colorText}`,
  //             eventType: EventTypes.alertLevelUpdate,
  //           };
  //           this.onGroupMemberAddEvent(this.eventMessage);
  //         }
  //       },
  //       (err) => {
  //         this.loading = false;
  //         this._toastrService.error(err.error.message, "Error!", {
  //           toastClass: "toast ngx-toastr",
  //           closeButton: true,
  //         });
  //       }
  //     );
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

  // on group member add change event
  onGroupMemberAddEvent(data: IEventMessage) {
    this.xamppSvc.onEventMessageStanza(data);
  }

  cancel() {
    this.router.navigateByUrl("/group-management/group-list");
  }

  // on super user add, remove end user.
  onSuperUser(eve) {
    let payload: any;

    if (eve.member_id) {
      payload = {
        group_id: this.urlLastValue,
        role_id: 1,
        member_id: eve.user_id,
        organization_id: 1,
      };
    } else {
      payload = {
        group_id: this.urlLastValue,
        role_id: 1,
        member_id: eve.id,
        organization_id: 1,
      };
    }

    this.groupManagementSvc.deleteMember(payload).subscribe((res: any) => {
      res.data?.old_members.forEach((element) => {
        this.onGroupUpdate = {
          toGroupJid: res.data.room_jid,
          groupId: res.data.group_id,
          toMemberJid: element.user.jid,
        };
        this.xamppSvc.onGroupUpdate(this.onGroupUpdate);
      });
      // on  member remove send event stanza
      if (res.data?.removed_member) {
        this.eventMessage = {
          toGroup: res.data.room_jid,
          groupId: res.data.group_id,
          groupName: res.data.name,
          groupImageUrl: res.data.image || "",
          message: `${this.currentUserDetails.name} removed ${res.data.removed_member.member_name}`,
          eventType: EventTypes.removeMember,
        };
        this.onGroupMemberAddEvent(this.eventMessage);
      }

      let members = [];
      // this.dubaiPoliceSuperbUsersSelected.forEach((ele) => {
      //   if (ele.user_id) {
      //     members.push({
      //       user_id: ele.user_id,
      //       role_id: 2,
      //       organization_id: ele.organization_id,
      //       fcm_token: ele.fcm_token,
      //     });
      //   } else if (ele.id) {
      //     members.push({
      //       user_id: ele.id,
      //       role_id: 2,
      //       organization_id: ele.Organization.id,
      //       fcm_token: ele.fcm_token,
      //     });
      //   }
      // });

      // this.groupManagementSvc
      //   .updateGroupDetails(this.urlLastValue, { members: JSON.stringify(members) })
      //   .subscribe(
      //     (res: any) => {
      //       //  console.log(res)
      //       this._toastrService.success(res.message, "Success!", {
      //         toastClass: "toast ngx-toastr",
      //         closeButton: true,
      //       });
      //       this.loading = false;
      //     },
      //     (err) => {
      //       this.loading = false;
      //       this._toastrService.error(err.error.message, "Error!", {
      //         toastClass: "toast ngx-toastr",
      //         closeButton: true,
      //       });
      //     }
      //   );
    });
  }
  checkFocus() {
    if (this.rows.name === undefined || this.rows.name === null || this.rows.name.length === 0) {
      this.showMaxLengthError = true;
    }
  }

  checkMaxLength(event?) {
    if (this.rows.name && this.rows.name.length > 1) {
      return this.showMaxLengthError = false;
    } else if (this.rows.name.length === 0) {
      return this.showMaxLengthError = true;
    } else {
      return this.showMaxLengthError = false;
    }
  }


}
