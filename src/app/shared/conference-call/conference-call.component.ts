import { Location } from "@angular/common";
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { FirebaseMessageService } from "../../main/pages/dashboard/services/firebase-message.service";
import { ChatsService } from "../../main/pages/dashboard/chat/chats.service";
import { CallService } from "../services/call.service";
import { IncomingcallData } from "app/main/pages/dashboard/chat/utils/incoming-call-data";
import { environment } from "environments/environment";
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
declare var JitsiMeetExternalAPI: any;
@Component({
  selector: "app-conference-call",
  templateUrl: "./conference-call.component.html",
  styleUrls: ["./conference-call.component.scss"],
})
export class ConferenceCallComponent implements OnInit {
  @Output() endcalled = new EventEmitter();
  domain: string = environment.audioServerUrl;
  room: any;
  options: any;
  api: any;
  user: any;
  userProfileImage: any;
  show: boolean = false;
  @Input("selectedChat") selectedChat;
  // For Custom Controls
  isAudioMuted = false;
  isVideoMuted = false;
  //added
  isShowDiv = false;
  width: number = 900;
  tileViewEnabled: boolean = false;
  totalMembers: number;
  datas: any;
  numberOfParticipants: number;
  isSmallScreen :boolean =false;
  constructor(
    // private router: Router,
    private location: Location,
    private _coreSidebarService: CoreSidebarService,
    private chatSvc: ChatsService,
    private router: Router,
    private messagingService: FirebaseMessageService,
    private callStatus: CallService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.breakpoints();
  }
  ngOnInit(): void {
    this.onCallStart();
  }

  breakpoints(){
    this.breakpointObserver.observe([
      "(max-width: 1000px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches && this.isShowDiv) {
          this.isSmallScreen=true;   
      } 
      else {
          // show stuff
          this.isSmallScreen=false;
      }
    });
  }

  onCallStart() {
    if (this.selectedChat) {
      this.show = true;
      const currentLoggedInUser = JSON.parse(
        localStorage.getItem("currentUser")
      );
      let nick = this.selectedChat.room_jid;
      nick = nick.split("@")[0];
      this.room = nick; // set your room name
      this.user = {
        avatarURL: currentLoggedInUser.profile_image,
        name: currentLoggedInUser.name, // set your username
      };
      this.user = currentLoggedInUser.name;
      this.userProfileImage = currentLoggedInUser.profile_image;
      if (!this.selectedChat.is_call_active) {
        this.sendCallNotification(this.selectedChat.group_id);
      }
    }
  }

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  toogleClass(){
    if(this.isSmallScreen) return 'hideConference' 
    else 'users align-items-center justify-content-center w-100 d-flex';
  }
  // toogle-chat
  toggleChat() {
    this.breakpoints()
    console.log(this.isSmallScreen,"this.isSmallScreen")
    // if(!this.isSmallScreen){
      if (!this.isShowDiv) {
        this.width = 900;
      } else{ this.width = 500;}
      // this.isShowDiv = !this.isShowDiv;
    // }
    if(this.isShowDiv){this.isShowDiv=false}
    else{this.isShowDiv=true}
    console.log(this.isShowDiv)
  }

  closed() {
    this.isShowDiv = false;
  }

  endCall() {
    this.api.executeCommand("hangup");
    this.api.dispose();
    this._coreSidebarService.getSidebarRegistry("conference").close();
    this.router.navigateByUrl("dashboard");
    this.selectedChat = null;
    // this.chatSvc.callEndEvent.emit(true);
    window.close();
    
  }

  sendCallNotification(group_id: number) {
    let payload = {
      group_id: group_id,
    };
    this.chatSvc.sendCallNotification(payload).subscribe();
  }

  ngAfterViewInit(): void {
    if (this.selectedChat) {
      this.initCall();
      const iframe = this.api.getIFrame();
    }
    setTimeout(() => {
      this.removeConferenceDatas()
    }, 5000);
  }

  initCall() {
    if (this.selectedChat) {
      this.options = {
        roomName: this.room,
        width: this.width,
        height: 500,
        configOverwrite: {
          startAudioOnly: true,
          TOOLBAR_BUTTONS: [],
          TOOLBAR_ALWAYS_VISIBLE: false,
          // DISABLE_JOIN_LEAVE_NOTIFICATIONS : true,
        },
        interfaceConfigOverwrite: {
          startAudioOnly: true,
          TOOLBAR_BUTTONS: [],
          TOOLBAR_ALWAYS_VISIBLE: false,
          DEFAULT_LOGO_URL: "../../../../../../assets/images/logo/logo.png",
          SHOW_JITSI_WATERMARK: false,
          // filmStripOnly:false,
          // DISABLE_JOIN_LEAVE_NOTIFICATIONS : true,
        },
        // configOverwrite: { prejoinPageEnabled: false },
        // interfaceConfigOverwrite: {
        // overwrite interface properties
        // },
        parentNode: document.querySelector("#jitsi-iframe"),
        userInfo: {
          avatarURL: this.userProfileImage,
          displayName: this.user,
        },
      };
      this.api = new JitsiMeetExternalAPI(this.domain, this.options);
      this.callStatus.onCallStateChanged.next(this.api);
      this.api.addEventListeners({
        readyToClosed: this.handleClosed,
        participantLeft: this.handleParticipantLeft,
        participantJoined: this.handleParticipantJoined,
        videoConferenceJoined: this.handleVideoConferenceJoined,
        videoConferenceLeft: this.handleVideoConferenceLeft,
        audioMuteStatusChanged: this.handleMuteStatus,
        videoMuteStatusChanged: this.handleVideoStatus,
        // numberOfParticipant: this.noParticipant,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedChat.currentValue) {
      this.api.dispose();
      let nick = changes.selectedChat.currentValue.room_jid.split("@")[0];
      this.room = nick; // set your room name
      this.onCallStart();
      this.initCall();
    }
  }

  noParticipant = async () => {
    this.numberOfParticipants = await this.api.getNumberOfParticipants();
  };
  handleClosed = () => {
    this.api.dispose();
  };

  handleParticipantLeft = async (participant) => {
    this.datas = await this.getParticipants();
    this.totalMembers = this.datas.length;
  };

  handleParticipantJoined = async (participant) => {
    this.datas = await this.getParticipants();
    this.totalMembers = this.datas.length;
  };

  handleVideoConferenceJoined = async (participant) => {
    const datas = await this.getParticipants();
    this.api.executeCommand("avatarUrl", this.userProfileImage);
  };

  handleVideoConferenceLeft = () => {
    this.location.back();
  };

  handleMuteStatus = (audio) => {
    // console.log("handleMuteStatus", audio); // { muted: true }
  };

  handleVideoStatus = (video) => {
    // console.log("handleVideoStatus", video); // { muted: true }
  };

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500);
    });
  }

  // custom events
  executeCommand(command: string) {
    this.api.executeCommand(command);
    if (command == "hangup") {
      this.router.navigateByUrl("dashboard");
      return;
    }

    if (command == "toggleAudio") {
      this.isAudioMuted = !this.isAudioMuted;
    }

    if (command == "setTileView") {
      this.tileViewEnabled = !this.tileViewEnabled;
      let enabled;
      this.api.executeCommand("setTileView", (enabled = this.tileViewEnabled));
    }
  }

  // Remove conference call datas after user 
  removeConferenceDatas(){
    let conferenceCallDatas =JSON.parse(localStorage.getItem("conferenceCallDatas"));
    if(conferenceCallDatas) return localStorage.removeItem("conferenceCallDatas")
  }

  ngOnDestroy(): void {
    this.removeConferenceDatas();
  }
}
