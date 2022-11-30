import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";
import { IChatNotification, INormalNotification } from "./notification.model";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  public onNotificationListChanged: BehaviorSubject<any>;
  public onSelectedEmailsChanged: BehaviorSubject<any>;
  public selectedEmails: INormalNotification[];
  public notifications: INormalNotification[];
  public onNotificationCliked: BehaviorSubject<any>;
  constructor(private httpClient: HttpClient) {
    this.onNotificationListChanged = new BehaviorSubject([]);
    this.onSelectedEmailsChanged = new BehaviorSubject([]);
    this.selectedEmails = [];
    //
    this.onNotificationCliked = new BehaviorSubject(null);
  }

  //Get all notification
  getAllNotifications(params) {
    return this.httpClient
      .get(
        `${environment.apiUrl}/get-notifications-list?page=${params.pageNumber}&size=${params.pageSize}`
      )
      .subscribe((res: any) => {
        this.onNotificationListChanged.next(res);
        this.notifications = res.data;
      });
  }

  //Update Single Read Notification
  updateSingleRead(id: number, payload) {
    return this.httpClient.patch(
      `${environment.apiUrl}/update-read/${id}`,
      payload
    );
  }

  // single delete notification by id
  deleteNotificationById(id: number) {
    return this.httpClient.delete(
      `${environment.apiUrl}/delete-notification/${id}`
    );
  }

  // mass delete of notification
  massDeleteNotifications(payload) {
    return this.httpClient.post(
      `${environment.apiUrl}/mass-delete-notification`,
      payload
    );
  }

  // mass read of notifications
  massReadNotifications(payload) {
    return this.httpClient.post(
      `${environment.apiUrl}/mark-all-read`,
      payload
    );
  }

  //mark as read 
  markAsUnread(){
    this.selectedEmails.map(email => {
      this.deselectEmails();
    });
  }
  /**
   * Toggle select all
   */
  toggleSelectAll(): void {
    if (this.selectedEmails.length > 0) {
      this.deselectEmails();
    } else {
      this.selectEmails();
    }
  }

  // selected Notifications
  selectEmails(): void {
    this.selectedEmails = JSON.parse(JSON.stringify(this.notifications));
    this.onSelectedEmailsChanged.next(this.selectedEmails);
  }

  /**
   * Deselect Emails
   */
  deselectEmails(): void {
    this.selectedEmails = [];
    // Trigger the next event
    this.onSelectedEmailsChanged.next(this.selectedEmails);
  }

  toggleSelectedMail(id): void {
    // First, check if we already have that Email as selected...
    if (this.selectedEmails.length > 0) {
      for (const email of this.selectedEmails) {
        // ...delete the unselected Email
        if (email.id === id) {
          const index = this.selectedEmails.indexOf(email);

          if (index !== -1) {
            this.selectedEmails.splice(index, 1);

            // Trigger the next event
            this.onSelectedEmailsChanged.next(this.selectedEmails);

            // Return
            return;
          }
        }
      }
    }

    // If we don't have it, push as selected
    this.selectedEmails.push(
      this.notifications.find((email) => {
        return email.id === id;
      })
    );

    // Trigger the next event
    this.onSelectedEmailsChanged.next(this.selectedEmails);
  }

  /**
   * Set/Update Folder On Selected Emails
   *
   * @param folderId
   */
  updateFolderOnSelectedEmails(folderRef): void {
    this.selectedEmails.map((email) => {
      // email.folder = folderRef;
      // this.updateEmail(email);
    });
    this.deselectEmails();

    // close Opened email
    // this.closeEmailDetails();
  }
}
