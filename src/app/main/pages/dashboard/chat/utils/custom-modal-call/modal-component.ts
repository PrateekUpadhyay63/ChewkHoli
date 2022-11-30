import { Component, Input, OnInit } from "@angular/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CallService } from "app/shared/services/call.service";
import { FirebaseMessageService } from "../../../services/firebase-message.service";
import { ChatsService } from "../../chats.service";

@Component({
  selector: "ngbd-modal-content",
  templateUrl: "./modal-component.html",
  styleUrls: [".//modal-component.scss"],
})
export class NgbdModalContent implements OnInit {
  @Input() name;
  public callData: any;
  public audioRef: any;
  public incomingCallModalOpen: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private commonService: ChatsService,
    private messagingService: FirebaseMessageService,
    private modalService: NgbModal,
    private callStatus: CallService,
    private _coreSidebarService: CoreSidebarService
  ) {}

  ngOnInit(): void {
    /**
     * code commentted. 
     */
    // this.callData = this.name;
    // this.incomingCallModalOpen = true;
    // // Play audio file for incomeing call
    // this.playAudio();
    // // check if call end notification recieved for active call.
    // this.messagingService.callEndEvent.subscribe((res: any) => {
    //   if (
    //     +res.group_id == this.callData.group_id &&
    //     this.modalService.hasOpenModals()
    //   ) {
    //     this.incomingCallModalOpen = false;
    //     this.rejectConfernceCall();
    //   }
    // });
    // //Auto reject call after 30 sec.
    // this.autoRejectCall();
  }
  playAudio() {
    this.audioRef  = new Audio();
    this.audioRef.src = "../../../../../../../assets/music/call-tune.mp3";
    this.audioRef.load();
    this.audioRef.play();
    this.audioRef.loop = true;
    this.audioRef.muted = false;
  }

  joinConferenceCall() {
    setTimeout(() => {
      this.commonService.onAnswerCallClicked(true);
    }, 200);
    this.incomingCallModalOpen = false;
    this.activeModal.close();
    this.audioRef.pause();
  }

  rejectConfernceCall() {
    this.incomingCallModalOpen = false;
    this.messagingService.incomingCallEvent.emit(null);
    this.activeModal.close();
    this.audioRef.pause();
  }

  autoRejectCall() {
    if (this.modalService.hasOpenModals()) {
      setTimeout(() => {
        if (this.incomingCallModalOpen) {
          this.rejectConfernceCall();
          const loggedUserData = JSON.parse(
            localStorage.getItem("currentUser")
          ); // get current logged in user details.
          let payload = {
            sender_id: this.callData.sender_id,
            receiver_id: loggedUserData.id,
            group_id: this.callData.group_id,
            notification_type: "missed-call",
            title: "Missed Call",
            body: `${this.callData.sender_Name} (${this.callData.name})`,
            stream_link: "gfgdgdf",
          };
          this.messagingService.addMisscallNotification(payload);
          this.messagingService.incomingCallEvent.emit(null);
        }
      }, 30000);
    }
  }
}
