// import { Component, OnInit } from '@angular/core';
// import sound  from 'src/assets/music/call-tune.mp3'
import { XMPPService } from "../ejab.service";
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { callStreamingStatus, ChatsService } from "./chats.service";
import { ChatActiveSidebarComponent } from "./chat-sidebars/chat-active-sidebar/chat-active-sidebar.component";
import { AudioRecordingService } from "./utils/audio.service";
import { DomSanitizer } from "@angular/platform-browser";

import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { GroupManagementService } from "../../group-management/group-management.service";
import { onGroupUpdateSend } from "./utils/group-update";
import { DeviceManagementService } from "../../device-management/device-management.service";
import { VideoPlaylistService } from "../../device-management/video-player/video-playlist.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { FirebaseMessageService } from "../services/firebase-message.service";
import { AngularFireMessaging } from "@angular/fire/compat/messaging";
import { IncomingcallData } from "./utils/incoming-call-data";
import { ToastrService } from "ngx-toastr";
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { TransferAuthorityService } from "../../transfer-authority/transfer-authority.service";
import { CoreTranslationService } from "@core/services/translation.service";
import { NotificationService } from "../../notifications/notification.service";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IEventMessage } from "./send-message";
import { EventTypes } from "./utils/event-type-enums";
import { nextTick } from "process";
import { IChatNotification } from "../../notifications/notification.model";
import { ControlPosition } from 'maplibre-gl';

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "chat-application" },
})
export class ChatComponent implements OnInit {
  clicked: boolean = false;
  public memberLocationData: any;
  usersGroupList = [];
  public groupClicked: any = false;
  public newVarible: any = true;
  title = true;
  currentLoggedInUser: any;
  @ViewChild(ChatActiveSidebarComponent) child: ChatActiveSidebarComponent;
  public isAudioRecording = false;
  public audioRecordedTime;
  public audioBlobUrl;
  public audioBlob;
  public audioName;
  public audioConf = { audio: true };
  public mapdivmargin: boolean = false;
  public mapdivRightmargin: boolean = false;
  public searchValue = "";
  public alertLevels = [
    { id: 1, name: "Grey" },
    { id: 2, name: "Yellow" },
    { id: 3, name: "Red" },
  ];
  public position: ControlPosition = 'bottom-right';
  selectedAlert;
  public onGroupUpdate: onGroupUpdateSend;
  public getLiveStreams = [];
  public ipStreamListData: any[];
  conferenceCallClicked: boolean = false;
  message: any;
  selectedChat: any;
  public selectedGroup: any;
  public alreadyCallState: boolean = false;
  public IncomingCallData;
  public eventMessage: IEventMessage;
  //
  groupData: any;
  public isFullScreen: boolean = false;
  constructor(
    private chatsSvc: ChatsService,
    private xamppSvc: XMPPService,
    private modalService: NgbModal,
    private _coreTranslationService: CoreTranslationService,
    private _coreSidebarService: CoreSidebarService,
    private grpManag: GroupManagementService,
    private _toastrService: ToastrService,
    private deviceManagementSvc: DeviceManagementService,
    private videoPlayList: VideoPlaylistService,
    private messagingService: FirebaseMessageService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  ngOnInit() {
    this.messagingService.requestPermission();
    // this.messagingService.receiveMessage();
    this.groupClick();
    this.currentLoggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    this.login(
      this.currentLoggedInUser.jid,
      this.currentLoggedInUser.jid_password
    );
    this.getAllGroups();
    this.xamppSvc.clickMembersList.subscribe((res) => {
      this.mapdivmargin = res;
    });
    this.xamppSvc.clickMapDiv.subscribe((res) => {
      this.mapdivRightmargin = res;
    });

    //call end event emitted
    this.chatsSvc.callEndEvent.subscribe((data: any) => {
      this.conferenceCallClicked = false;
      // this.alreadyCallState = false;
    });

    // Open group from Notification Click.
    this.notificationService.onNotificationCliked.subscribe((res) => {
      if (res != null) {
        setTimeout(() => {
          this.GroupChat(res);
        }, 1500);
      }
    });

    this.messagingService.callEndEvent.subscribe((data: any) => {
      setTimeout(() => {
        if (this.selectedChat && this.selectedChat.room_jid == data.room_jid) {
          if (data.is_call_active == "true")
            this.selectedChat.is_call_active = true;
          else this.selectedChat.is_call_active = false;
        }
      }, 200);
    });
    // setTimeout(() => {
    this.ref.detectChanges();
    // }, 3000);

    // Full screen mode check
    this.xamppSvc.isFullScreenMode.subscribe((res) => {
      this.isFullScreen = res;
    });
  }

  endcalled(event) {
    this.selectedChat.is_call_active = true;
  }

  openCall() {
    this.conferenceCallClicked = true;
    setTimeout(() => {
      // this.toggleSidebar("conference");
    }, 300);
  }

  toggleSidebar(name): void {
    this.messagingService.incomingCallEvent.emit(this.selectedChat);
    this.chatsSvc.onAnswerCallClicked(true);
    this.chatsSvc.callStatus(true);
    // setTimeout(() => {
    //   this._coreSidebarService.getSidebarRegistry(name)?.toggleOpen();
    // }, 300);
    if (!this.selectedChat.is_call_active) {
      this.eventMessage = {
        toGroup: this.selectedChat.room_jid,
        groupId: this.selectedChat.group_id,
        groupName: this.selectedChat.name,
        groupImageUrl: this.selectedChat.image || "",
        message: `${this.currentLoggedInUser.name} has started group call`,
        eventType: EventTypes.startAudioCall,
      };
      this.xamppSvc.onEventMessageStanza(this.eventMessage);
    }
  }

  alertFunc(alertLevel) {
    if (alertLevel == 3) {
      // return "../../../../../assets/images/redAlrt.svg";
      // return '{background:"red";}'
      return { background: "red" };
    }
    if (alertLevel == 2) {
      // return "../../../../../assets/images/yellowAlrt.svg";
      return { background: "#fd7a40" };
    }
    if (alertLevel == 1) {
      // return "../../../../../assets/images/icons/error.svg";
      return { background: "grey" };
    }
  }
  login(user_jid: string, password: string) {
    this.xamppSvc.login(user_jid, password);
  }

  getAllGroups() {
    return new Promise((resove, reject) => {
      this.chatsSvc.getChatGroupList(this.currentLoggedInUser.id);
      // Subscribe to chat users
      this.chatsSvc.onGroupListChange.subscribe((res) => {
        this.usersGroupList = [];
        if (res?.data?.groupList.length > 0) {
          this.usersGroupList = res.data.groupList;
          this.usersGroupList.map((val) => {
            return (val["active"] = false);
          });
        }
      });
    });
  }

  openModal(modal) {
    this.modalService.open(modal, {
      centered: true,
      backdrop: false,
      size: "lg",
      container: ".dashboard-group-chat",
      windowClass: "modal modal-primary",
    });
    this.selectedAlert = this.alertLevels.filter((val) => {
      return this.selectedChat.alert_level == val.id;
    })[0].name;
  }

  ipstreamModal(modal) {
    this.pageCallback({ offset: 1 });
    this.modalService.open(modal, {
      // centered: true,
      // backdrop: false,
      scrollable: true,
      // size: "lg",
      container: ".dashboard-group-chat",
      // windowClass: "modal modal-primary",
    });
  }

  viewstreamModal(modal) {
    if (this.selectedChat?.group_id) this.getLiveStream();
    this.modalService.open(modal, {
      centered: true,
      backdrop: false,
      size: "lg",
      container: ".dashboard-group-chat",
      windowClass: "modal modal-primary",
    });
  }
  getAllStreamingDeviceList() {
    let params = {
      pageNumber: this.page.offset,
      pageSize: this.page.limit,
    };
    this.chatsSvc
      .getAllStreamingDevicesDashboard(params)
      .subscribe((res: any) => {
        if (res) {
          this.ipStreamListData = res.data;
          this.current_page = res.current_page || 0;
          this.page.count = res.page_count || 0;
          this.fakeArray = new Array(res.page_count || 0);
        }
      });
  }

  //ip stream fn//
  openVideo(data) {
    let payload = {
      link: data,
    };
    this.deviceManagementSvc.getVideoUrl(payload).subscribe((res: any) => {
      if (res.success === true) {
        this.modalService.dismissAll();
        this.router.navigate(["/video-player"]);
        this.videoPlayList.fetchList(res.data.link, res.data.pid);
        this._toastrService.success(res.message, "Success", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      } else {
        this._toastrService.error(res.message, "Error", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    });
  }
  liveTsreamList() {
    this.deviceManagementSvc
      .getLiveStreams(this.selectedChat.group_id)
      .subscribe((res: any) => {
        if (res?.data?.streamList) this.getLiveStreams = res.data.streamList;
        else this.getLiveStreams = [];
      });
  }

  getLiveStream() {
    this.liveTsreamList();

    // notification_type: "live-stream-end"
    this.messagingService.callEndEvent.subscribe((data: any) => {
      if (data) {
        let currentLive = this.getLiveStreams.findIndex((val: any) => {
          return val.stream_key == data.stream_link;
        });
        this.liveTsreamList();
        // if(currentLive > -1 && data.notification_type == "live-stream-end") this.getLiveStreams.splice(currentLive, 1)
      }
    });
  }

  getCurrentVideo(data) {
    this.modalService.dismissAll();
    this.router.navigate(["/video-player"]);
    this.videoPlayList.fetchListViewStream(data["stream_key"]);
  }

  onAlertChange() {}

  cancel() {
    this.modalService.dismissAll();
  }

  // Change alert level for group.
  // submitAlert() {
  //   const data = this.alertLevels.filter((val) => {
  //     return this.selectedAlert == val.name;
  //   })[0].id;

  //   let values = {
  //     alert_level: data,
  //   };
  //   this.grpManag
  //     .updateGroupDetails(this.selectedChat.group_id, values)
  //     .subscribe((val: any) => {
  //       if (val.success) {
  //         this.modalService.dismissAll();
  //         this._toastrService.success(val["message"], "Success!", {
  //           toastClass: "toast ngx-toastr",
  //           closeButton: true,
  //         });
  //         this.getAllGroups();
  //         this.onGroupChangeData(
  //           val.data.groupDetails.id,
  //           val.data.groupDetails.room_jid
  //         );
  //         // on group alert level change
  //         if (val.data.alert_changed) {
  //           this.eventMessage = {
  //             toGroup: this.selectedChat.room_jid,
  //             groupId: this.selectedChat.group_id,
  //             groupName: this.selectedChat.name,
  //             groupImageUrl: this.selectedChat.image || "",
  //             message: `${this.currentLoggedInUser.name} changed group alert level`,
  //             eventType: EventTypes.alertLevelUpdate,
  //           };
  //           this.onGroupAlertLevelChange(this.eventMessage);
  //         }
  //       }
  //     });
  // }

  // // on group alert level change event
  // onGroupAlertLevelChange(data: IEventMessage) {
  //   this.xamppSvc.onEventMessageStanza(data);
  // }

  // // on Real time group Update
  // onGroupChangeData(id: number, group_jid: string) {
  //   this.chatsSvc.getChatGroupMmebersList(id).subscribe((res: any) => {
  //     res.data.groupDetails.members.forEach((element) => {
  //       this.onGroupUpdate = {
  //         toGroupJid: group_jid,
  //         groupId: id,
  //         toMemberJid: element.user.jid,
  //       };
  //       this.xamppSvc.onGroupUpdate(this.onGroupUpdate);
  //     });
  //   });
  // }

  //full screen
  // public onFullscreen() {
  //   if (document.fullscreenElement) {
  //     this.title = true;
  //     this.isFullScreen = false;
  //     document.exitFullscreen();
  //   } else {
  //     this.title = false;
  //     const dashboardDiv = document.querySelector(".dashboard-group-chat");
  //     if (dashboardDiv.requestFullscreen) {
  //       this.isFullScreen = true;
  //       dashboardDiv.requestFullscreen();
  //     }
  //   }
  // }

  groupClick() {
    this.xamppSvc.clickMembersList.subscribe((data) => {
      this.clicked = data;
    });
  }

  // On group click
  GroupChat(data) {
    this.selectedChat = data;
    this.selectedGroup = data;
    console.log("slected chat", this.selectedGroup);

    this.groupClicked = true;
    this.newVarible = false;
    this.chatsSvc.membersData.next(data);
    this.xamppSvc.clickGroupChat.next("clicked");
    let selectedChat = this.usersGroupList.findIndex(
      (x) => x.name == data.name
    );
    
    this.usersGroupList.map((val) => {
      return (val["active"] = false);
    });
    this.usersGroupList[selectedChat].active = true;
    this.chatsSvc.sideBarOpenEvent(true);
    this.getMemeberDataById(data.group_id);
    setTimeout(() => {
      this.chatsSvc.isCallActive.subscribe((res: callStreamingStatus) => {
        if (res != null) {
          this.selectedChat.is_call_active = res.isCallActive;
          this.selectedChat.is_live_stream_active = res.isLiveStreamingActive;
        }
      });
    }, 300);
  }

  getMemeberDataById(id: number) {
    this.chatsSvc.getMemberLocationById(id).subscribe((res: any) => {
      this.memberLocationData = res.data;
    });
  }

  ngOnDestroy(): void {
    // this.notificationService.onNotificationCliked.complete();
    this.notificationService.onNotificationCliked.next(null);
    this.chatsSvc.isCallActiveCheck(null);
    // this.messagingService.onPinDropSwtichChange.next(null);
    // this.messagingService.onPinDropSwtichChange.complete();
  }

  // down load file Fn
  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  onSearchClear() {
    this.searchValue = "";
    if (this.searchValue == "") {
      this.getAllGroups();
    }
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    if (val.length >= 3) {
      this.chatsSvc
        .getGroupBySearch(this.currentLoggedInUser.id, val)
        .subscribe((res: any) => {
          this.usersGroupList = res.data.groupList;
        });
    }
    if (val == "") {
      this.getAllGroups();
    }
  }

  addNewGroup() {
    this.router.navigateByUrl("/add-group");
  }

  onSwitchChange(eve) {
    // this.messagingService.onPinDropSwtichChange.next(eve.target.checked);
    this.messagingService.onSwitchChnage(eve.target.checked);
  }

  /** pagination */
  pageIfx = 5;
  pageIfy = 0;
  page = {
    limit: 10,
    count: 0,
    offset: 1,
  };
  fakeArray = [];
  public current_page: any;
  public totalPages = [];

  pagination(page) {
    this.page.offset = page;
    this.getAllStreamingDeviceList();
  }

  pageNext() {
    if (this.page.count > 5 && this.page.count - this.current_page > 4) {
      this.pageIfy += 1;
      this.pageIfx += 1;
    }

    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getAllStreamingDeviceList();
    }
  }

  pagePrev() {
    if (this.pageIfy > 0) {
      this.pageIfy -= 1;
      this.pageIfx -= 1;
    }

    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getAllStreamingDeviceList();
    }
  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.getAllStreamingDeviceList();
  }
}
