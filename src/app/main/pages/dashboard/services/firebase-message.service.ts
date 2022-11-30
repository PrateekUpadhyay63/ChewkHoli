import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { AngularFireMessaging } from "@angular/fire/compat/messaging";
import { environment } from "environments/environment";
import { IncomingcallData } from "../chat/utils/incoming-call-data";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbdModalContent } from "../chat/utils/custom-modal-call/modal-component";
import { NavrBarNotificationsService } from "app/layout/components/navbar/navbar-notification/navbarnotifications.service";
import { BehaviorSubject, Subject } from "rxjs";
import { XMPPService } from "../ejab.service";
import { pinDropVar } from "../map/pin-drop-interface";
import { notification_type } from "../chat/utils/notification-types";
// import moment from "moment";

@Injectable({
  providedIn: "root",
})
export class FirebaseMessageService {
  public IncomingCallData: IncomingcallData;
  @Output() incomingCallEvent = new EventEmitter<IncomingcallData>();
  // public onPinDropSwtichChange: BehaviorSubject<boolean>;
  incomeCallNotification=new Subject();
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private _httpClient: HttpClient,
    private modalService: NgbModal,
    private navBarNotificationSvc: NavrBarNotificationsService,
    private xamppSvc: XMPPService
  ) {
    // this.onPinDropSwtichChange = new BehaviorSubject(false);
    this.angularFireMessaging.messages.subscribe((_messaging: any) => {
      this.receiveMessage(_messaging);
      // _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      // _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    });
  }
  callEndEvent = new Subject();
  liveStreaming = new Subject();

  @Output() onPinDropSwtichChange = new EventEmitter<pinDropVar>();
  onSwitchChnage(data: pinDropVar) {
    this.onPinDropSwtichChange.emit(data);
  }

  // Request Notification Permission.
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        let payload = {
          fcm_token: token,
        };
        this.updateFcmToken(payload).subscribe();
      },
      (err) => {
        console.error("Unable to get permission to notify.", err);
      }
    );
  }

  // Subscribes to All notification send to logged in user
  // localstorage, subjectbehavior()
  // localstorage : [
  //  { group_id 1 : true/false }  , { group_id 2 : true/false }
  // ]
  // we need to continue with the subject behaviour
  receiveMessage(payload) {
    this.incomeCallNotification.next(payload);
    // this.angularFireMessaging.messages.subscribe((payload) => {
    console.log("new message received. ", payload);
    const loggedUserData = JSON.parse(localStorage.getItem("currentUser")); // get current logged in user details.
    // if call end notification receives.
    if (
      (payload.data.notification_type == "call-end" ||
        payload.data.notification_type == "call") &&
      payload.data
    ) {
      this.callEndEvent.next(payload.data);
    }

    // if live stream start or end
    if (
      payload.data.notification_type == "live-stream-start" ||
      payload.data.notification_type == "live-stream-end"
    ) {
      this.liveStreaming.next(payload.data);
    }
    if (
      payload.data.notification_type == "call" &&
      loggedUserData.id !== +payload.data.sender_id
    ) {
      this.IncomingCallData = {
        name: payload.data.name,
        sender_profile_image: payload.data.sender_profile_image,
        room_jid: payload.data.room_jid,
        sender_id: payload.data.sender_id,
        sender_Name: payload.data.sender_Name,
        group_id: +payload.data.group_id,
        notification_type: payload.data.notification_type,
        is_call_active: payload.data.is_call_active,
        sender_first_name: payload.data.sender_first_name,
        sender_last_name: payload.data.sender_last_name,
      };
      this.incomingCallNotification(this.IncomingCallData);
      /**
       * code commentted as feature is removed.
       *  if (this.modalService.hasOpenModals()) {
        this.modalService.dismissAll();
        this.open(this.IncomingCallData);
      } else {
        this.open(this.IncomingCallData);
      }
       */
    }
    if (!notification_type.includes(payload.data.notification_type)) {
      this.newNotification(true);
    }
  }

  //open custom modal for call
  open(data: IncomingcallData) {
    // console.log("compoent call..");
    const modalRef = this.modalService.open(NgbdModalContent, {
      backdrop: false,
      centered: true,
      size: "sm",
      container: ".dashboard-group-chat",
      keyboard: false,
    });
    modalRef.componentInstance.name = data;
  }

  // Update FCM token
  updateFcmToken(payload) {
    return this._httpClient.patch(
      `${environment.apiUrl}/mobile/firebase-token-update`,
      payload
    );
  }

  // Event Emiter for incoming call data
  incomingCallNotification(callData: IncomingcallData) {
    this.incomingCallEvent.emit(callData);
  }

  // new notification received
  newNotification(received: boolean) {
    this.navBarNotificationSvc.latestNotification.emit(received);
  }

  // add miss call to notification list.
  addMisscallNotification(payload) {
    return this._httpClient
      .post(`${environment.apiUrl}/add-notification`, payload)
      .subscribe((res: any) => {
        if (res.success) {
          this.newNotification(true);
        }
      });
  }
}

//get the timezone of user's
// const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// console.log(timeZone);
// let incomingCalldate =  moment(+payload.data.timestamp).format("DD-MM-YYYY h:mm:ss");
// let currentDate = moment(Date.now()).format("DD-MM-YYYY h:mm:ss");;
// console.log(
//   incomingCalldate,
//   currentDate
// );
