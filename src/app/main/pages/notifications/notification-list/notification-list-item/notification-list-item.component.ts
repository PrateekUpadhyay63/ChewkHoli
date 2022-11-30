import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { VideoPlaylistService } from "app/main/pages/device-management/video-player/video-playlist.service";
import { ToastrService } from "ngx-toastr";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  IChatNotification,
  INormalNotification,
} from "../../notification.model";
import { NotificationService } from "../../notification.service";

@Component({
  selector: "email-list-item",
  templateUrl: "./notification-list-item.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class NotificationListItemComponent implements OnInit {
  // Public
  public selected;
  public SelectedNotification: IChatNotification;
  // Private
  private _unsubscribeAll: Subject<any>;
  @ViewChild("modalConfirm") confrimModal;
  public viewStreamData: any = null;
  // Input Decorator
  @Input() email: INormalNotification;

  /**
   *
   * @param {EmailService} _emailService
   */
  constructor(
    private notificationService: NotificationService,
    private videoPlayList: VideoPlaylistService,
    private router: Router,
    private _toastrService: ToastrService,
    private modalService: NgbModal
  ) {
    this._unsubscribeAll = new Subject();
  }

  /**
   * On Checkbox Change
   */
  onSelectedChange() {
    this.notificationService.toggleSelectedMail(this.email.id);
  }

  onNotificationClicked(data) {
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
  }

  markAsRead(id: number) {
    let payload = {
      is_read: 1,
    };
    this.notificationService.updateSingleRead(id, payload).subscribe((res) => {
      let params = {
        pageNumber: 1,
        pageSize: 10,
      };
      this.notificationService.getAllNotifications(params);
    });
  }
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to update on selected email change
    this.notificationService.onSelectedEmailsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((selectedMails) => {
        this.selected = false;

        if (selectedMails.length > 0) {
          for (const email of selectedMails) {
            if (email.id === this.email.id) {
              this.selected = true;
              break;
            }
          }
        }
      });
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
   * On destroy
   */

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
