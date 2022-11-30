import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { INormalNotification } from "../notification.model";
import { NotificationService } from "../notification.service";
import { ToastrService } from "ngx-toastr";
// lanaguage
import { locale as english } from "../i18n/en";
import { locale as arabic } from "../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
@Component({
  selector: "app-email-list",
  templateUrl: "./notification-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class NotificationListComponent implements OnInit {
  // Public
  public emails: INormalNotification[];
  public hasSelectedMails;
  public isIndeterminate;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {EmailService} _emailService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private notificationService: NotificationService,
    private _toastrService: ToastrService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._unsubscribeAll = new Subject();
    this._coreTranslationService.translate(english, arabic);
  }

  /**
   * Toggle Select All
   */
  toggleSelectAll() {
    this.notificationService.toggleSelectAll();
  }

  /**
   * Update Folder On Selected Emails
   *
   * @param folderRef
   */
  updateFolderOnSelectedMails(folderRef) {
    this.notificationService.updateFolderOnSelectedEmails(folderRef);
  }

  /**
   * Un-Read
   */
  unRead() {
    this.notificationService.markAsUnread();
  }

  markAllread() {
    let payload = {
      is_read: 1,
    };
    this.notificationService.massReadNotifications(payload).subscribe(
      (res: any) => {
        this._toastrService.success(res.message, "Success", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        let params = {
          pageNumber: 1,
          pageSize: 10,
        };
        this.notificationService.getAllNotifications(params);
      },
      (err) => {
        this._toastrService.error(err.error.message, "Error", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    );
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */

  ngOnInit(): void {
    // Subscribe to Selected Emails changes
    // this.notificationService.onSelectedEmailsChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((selectedMails) => {
    //     setTimeout(() => {
    //       this.hasSelectedMails = selectedMails.length > 0;
    //       this.isIndeterminate =
    //         selectedMails.length !==
    //           this.notificationService.notifications.length &&
    //         selectedMails.length > 0;
    //     }, 0);
    //   });

    // Subscribe to update Emails on changes
    // this._emailService.onEmailsChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((emails) => {
    //     this.emails = emails;
    //   });

    // Subscribe to update Emails on changes
    this.notificationService.onNotificationListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((emails) => {
        // console.log("emails",emails.length);

        this.emails = emails.data;
      });
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
