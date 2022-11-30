import { Component, OnInit, Input } from "@angular/core";

import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { callStreamingStatus, ChatsService } from "../../chats.service";
import { XMPPService } from "../../../ejab.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { id } from "@swimlane/ngx-datatable";
import { GroupManagementService } from "app/main/pages/group-management/group-management.service";
import { ToastrService } from "ngx-toastr";
import { onGroupUpdateSend } from "../../utils/group-update";
import { IEventMessage } from "../../send-message";
import { EventTypes } from "../../utils/event-type-enums";
import { locale as english } from "../../i18n/en";
import { locale as arabic } from "../../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import { FirebaseMessageService } from "../../../services/firebase-message.service";
import { NotificationService } from "app/main/pages/notifications/notification.service";
// import { chatSvcvice } from 'app/main/apps/chat/chat.service';

@Component({
  selector: "app-chat-user-sidebar",
  templateUrl: "./chat-user-sidebar.component.html",
  styleUrls: ["./chat-user-sidebar.component.scss"],
})
export class ChatUserSidebarComponent implements OnInit {
  // Public
  @Input() memberData;
  @Input("selectedChat") selectedGroup: any;
  public userProfile;
  allMembers;
  selectedUser: void;
  multiEndUsers;
  selectedMembers;
  selectedChat: any;
  public onGroupUpdate: onGroupUpdateSend;
  public eventMessage: IEventMessage;
  currentLoggedInUser: any;
  public incomeCallUser;
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private chatSvc: ChatsService,
    private modalService: NgbModal,
    private groupManagementSvc: GroupManagementService,
    private _toastrService: ToastrService,
    private xamppSvc: XMPPService,
    private notificationService: NotificationService,
    private _coreTranslationService: CoreTranslationService,
    private messagingService: FirebaseMessageService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  toggleSidebar(name) {
    this.xamppSvc.clickMembersList.next(false);
    if (this._coreSidebarService.getSidebarRegistry(name)) {
      if (
        this._coreSidebarService.getSidebarRegistry(name)
          .isOpened == true
      ) {
        this._coreSidebarService.getSidebarRegistry(name).close();
      } else {
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
      }
    } 
  }

  ngOnInit(): void {
    this.multiEndUsers = [];
    this.allMembers = [];
    this.currentLoggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log(
      this._coreSidebarService.getSidebarRegistry("chat-user-sidebar").isOpened,
      "toogle"
      );
      this.messagingService.incomeCallNotification.subscribe((res: any) => {
        console.log(res?.data, "res");
        console.log(this.allMembers, "this.allMembers");
        this.incomeCallUser = res?.data?.sender_id;
    });

    this.chatSvc.membersData.subscribe((val) => {
      this.selectedChat = val;
      if (val?.group_id) this.getAllMembers(val.group_id);
    });
    
    this._coreSidebarService.getSidebarRegistry("chat-user-sidebar").open(),


    // Open Both sidebar on click of group.
   
    this.bothSideBarOpen("chat-user-sidebar");
    // this.bothSideBarOpen("chat-active-sidebar");

    // Live streaming notification.
    this.messagingService.liveStreaming.subscribe((data: any) => {
      if (this.selectedChat.room_jid == data.room_jid) {
        this.allMembers.filter((element) => {
          if (element.user.jid == data.user_jid) {
            if (data.is_live_stream_active == "true")
              element.user.is_streaming = true;
            if (data.is_live_stream_active == "false")
              element.user.is_streaming = false;
            if (
              data.notification_type.includes("live-stream-end") &&
              data.is_live_stream_active == "true"
            )
              element.user.is_streaming = false;
            return element;
          }
        });
      }
    });
    console.log(this.selectedChat.is_call_active, "this.selectedChat");
  }


  bothSideBarOpen(name){
    this.chatSvc.openSidebarEvent.subscribe((res) => {
      console.log(
        this._coreSidebarService.getSidebarRegistry(name).isOpened,
        "Service"
      );
      if (this._coreSidebarService.getSidebarRegistry(name))
        this._coreSidebarService
          .getSidebarRegistry(name)
          .close();
      setTimeout(() => {
        this.toggleSidebar(name);
      }, 300);
    });
  }

  // Add new Member to group
  addNew(modal) {
    this.groupManagementSvc.getAllEndUserLists().subscribe((response: any) => {
      this.multiEndUsers = response.data;
      this.multiEndUsers = this.multiEndUsers.filter(
        (a) => !this.allMembers.some((b) => a.name === b.name)
      );
      this.multiEndUsers.map((val) => {
        val["userNameAndEmail"] = `${val.name} (${val.username})`;
      });
    });
    this.modalService.open(modal, {
      centered: true,
      backdrop: false,
      size: "lg",
      container: ".dashboard-group-chat",
      windowClass: "modal modal-primary",
    });
    // this.selectedUser = this.allMembers
  }

  cancel() {
    this.modalService.dismissAll();
  }

  // Get member list for slected group
  getAllMembers(id) {
    this.chatSvc.getChatGroupMmebersList(id).subscribe((res: any) => {
      if (res.data) {
        this.allMembers = res.data.groupDetails.members;
        console.log("All members: ", this.allMembers);
        // this.chatSvc.onGroupMembers(res.data.groupDetails.members);
        let status: callStreamingStatus = {
          isCallActive: res.data.groupDetails.is_call_active,
          isLiveStreamingActive: res.data.groupDetails.is_live_stream_active,
        };
        this.chatSvc.isCallActiveCheck(status);
        // const fullname = res.data.groupDetails.members.user.first_name + ' ' + res.data.groupDetails.members.user.last_name;
        // console.log("Full name: ",fullname)
        // if(fullname.length >=25){
        //   return fullname.slice(0,25)+'...'
        // }else {
        //   return fullname;
        // }
      }
    });
  }

  // on adding new members
  submit() {
    let members = [];
    this.selectedMembers.forEach((data) => {
      let selectedUser = this.multiEndUsers.filter((val) => {
        return data == val.name;
      })[0];
      members.push({
        user_id: selectedUser.id,
        role_id: selectedUser.Role.id,
        organization_id: selectedUser.Organization.id,
        fcm_token: selectedUser.fcm_token,
      });
    });

    this.groupManagementSvc
      .updateGroupDetailsData(this.selectedChat.group_id, {
        members: JSON.stringify(members),
      })
      .subscribe(
        (res: any) => {
          this.selectedMembers = undefined;
          if(res?.exist_members && res.exist_members !== ""){
            this._toastrService.error(res.exist_members, "error!", {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            });
          }else
          this._toastrService.success(res.message, "Success!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.modalService.dismissAll();
          this.ngOnInit();
          if (res.data?.groupDetails?.id != null) {
            this.onGroupChangeData(
              res.data.groupDetails.id,
              res.data.groupDetails.room_jid
            );
          }

          // // on new member added send event stanza
          if (res.data?.new_members_added) {
            res.data?.new_members_added.forEach((element) => {
              this.eventMessage = {
                toGroup: res.data.groupDetails.room_jid,
                groupId: res.data.groupDetails.id,
                groupName: res.data.groupDetails.name,
                groupImageUrl: res.data.groupDetails.image || "",
                message: `${this.currentLoggedInUser.name} added ${element.member_name}`,
                eventType: EventTypes.addMember,
              };
              this.onGroupMemberAddEvent(this.eventMessage);
            });
          }
        },
        (err) => {
          // this.loading = false;
          this._toastrService.error(err.error.message, "Error!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        }
      );
  }

  // on group member add change event
  onGroupMemberAddEvent(data: IEventMessage) {
    this.xamppSvc.onEventMessageStanza(data);
  }

  // on Real time group Update
  onGroupChangeData(id: number, group_jid: string) {
    this.chatSvc.getChatGroupMmebersList(id).subscribe((res: any) => {
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

  getConferenceStatus(Conference_status) {
    // console.log(this.incomeCallUser,"this.allMembers")
    const result = this.allMembers.filter(
      (element) =>element.user.user_id > this.incomeCallUser
    );
    if (result && Conference_status) {
      return `color : #28C76F`;
    }
    // this.allMembers.forEach((element) => {
    //   if(element.user.user_id==this.incomeCallUser){
    //     console.log(element.user.user_id, "userId")
    //     if(Conference_status) return `color : #28C76F`
    //   }
    // })
  }
}
