import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Injectable, Output } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NavrBarNotificationsService {
  public onNavBarNotificationListChanged: BehaviorSubject<any>;
  @Output() latestNotification = new EventEmitter<boolean>();
  constructor(private httpClient: HttpClient) {
    this.onNavBarNotificationListChanged = new BehaviorSubject({});
  }

  //Get all notification
  getAllNotifications() {
    return this.httpClient
      .get(`${environment.apiUrl}/notifications-list?page=1&size=5`)
      .subscribe((res: any) => {
        this.onNavBarNotificationListChanged.next(res);
        // console.log("notification", res);
      });
  }

  newNotificationReceived(isLatestNotification: boolean) {
    this.latestNotification.emit(isLatestNotification);
  }
}
