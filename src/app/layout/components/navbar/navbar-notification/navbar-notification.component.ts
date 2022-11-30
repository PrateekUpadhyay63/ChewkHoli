import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { VideoPlaylistService } from "app/main/pages/device-management/video-player/video-playlist.service";
import { IChatNotification } from "app/main/pages/notifications/notification.model";
import { NotificationService } from "app/main/pages/notifications/notification.service";
import { ToastrService } from "ngx-toastr";
import { NavrBarNotificationsService } from "./navbarnotifications.service";
import { CoreTranslationService } from "@core/services/translation.service";

// lanaguage
import { locale as english } from "../i18n/en";
import { locale as arabic } from "../i18n/ar";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-navbar-notification",
  templateUrl: "./navbar-notification.component.html",
  host: { class: "email-application" },
})
export class NavbarNotificationComponent implements OnInit {
  public hideHover: boolean = false;
  public notifications;
  public SelectedNotification: IChatNotification;
  @ViewChild("modalConfirm") confrimModal;
  public viewStreamData: any = null;
  constructor(
    private _notificationsService: NavrBarNotificationsService,
    private router: Router,
    private videoPlayList: VideoPlaylistService,
    private notificationService: NotificationService,
    private _toastrService: ToastrService,
    private _coreTranslationService: CoreTranslationService,
    private modalService: NgbModal
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  readAllNotifications(myDrop) {
    this.router.navigateByUrl("/notifications");
    myDrop.close();
  }

  onNotificationClicked(data, myDrop) {
    if (
      data.notification_type == "missed-call" ||
      data.notification_type == "group-member-add" ||
      data.notification_type == "group-creation" ||
      data.notification_type == "group-member-removed" ||
      data.notification_type == "help" ||
      data.notification_type == "group-update"
    ) {
      this.SelectedNotification = {
        group_id: data.group_data.id,
        group_name: data.group_data.name,
        room_jid: data.group_data.room_jid,
        name: data.group_data.name,
        active: true,
      };
      this.notificationService.onNotificationCliked.next(
        this.SelectedNotification
      );
      setTimeout(() => {
        this.router.navigateByUrl("dashboard");
      }, 300);
    }
    // for live stream
    if (
      data.notification_type == "live-stream-start" ||
      data.notification_type == "live-stream-end"
    ) {
      if (data.stream_link) {
        let payload = {
          stream_link: data.stream_link,
          pid: 1,
        };
        this.openCofirmModal();
        this.viewStreamData = payload;
      }
    }

    // if group is delete
    if (data.group_data == null) {
      this._toastrService.info("This group does not exists", "Info!", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
    }

    if (data.stream_link == null) {
      this._toastrService.info("Live streaming ended.", "Info!", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
    }
    // mark read notificatio
    this.markAsRead(data.id);
    myDrop.close();
  }

  markAsRead(id: number) {
    let payload = {
      is_read: 1,
    };
    this.notificationService.updateSingleRead(id, payload).subscribe((res) => {
      this._notificationsService.getAllNotifications();
    });
  }

  // on bell icon click
  onBellIconClick() {
    this.hideHover = false;
  }

  // open confirm modal
  openCofirmModal() {
    this.modalService.dismissAll();
    this.modalService.open(this.confrimModal, {
      centered: true,
      backdrop: false,
      // scrollable: true,
      size: "sm",
      // container: ".dashboard-group-chat",
      // windowClass: "modal modal-primary",
    });
  }

  openInNewTab() {
    // open View Stream
    localStorage.setItem("link", JSON.stringify(this.viewStreamData));
    window.open("video-player", "_blank");
    this.modalService.dismissAll();
  }
  /**
   * On init
   */
  ngOnInit(): void {
    const currentUserDetails = JSON.parse(localStorage.getItem("currentUser")); //to get current loged in user data
    if (currentUserDetails) {
      this._notificationsService.getAllNotifications();
      this._notificationsService.onNavBarNotificationListChanged.subscribe(
        (res) => {
          this.notifications = res.data;
        }
      );

      // subscribe to new notification
      this._notificationsService.latestNotification.subscribe((res) => {
        this.hideHover = true;
        this._notificationsService.getAllNotifications();
        // setTimeout(() => {
        //   this.hideHover = false;
        // }, 5000);
      });
    }
  }
}
