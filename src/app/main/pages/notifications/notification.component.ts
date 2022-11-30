import { DOCUMENT } from "@angular/common";
import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavrBarNotificationsService } from "app/layout/components/navbar/navbar-notification/navbarnotifications.service";
import { Subject } from "rxjs";
import { NotificationService } from "./notification.service";

@Component({
  selector: "app-email",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "email-application" },
})
export class NotificationComponent {
  pageIfx = 5;
  pageIfy = 0;
  page = {
    limit: 10,
    count: 0,
    offset: 1,
  };
  fakeArray = [];

  public totalPages = [];
  private _unsubscribeAll: Subject<any>;
  public current_page: any;
  constructor(
    @Inject(DOCUMENT) private document,
    private navBarNotificationSvc: NavrBarNotificationsService,
    private notificationService: NotificationService
  ) {}

  pagination(page) {
    this.page.offset = page;
    this.getAllNotificationsList();
  }

  pageNext() {
    if (this.page.count > 5 && this.page.count - this.current_page > 4) {
      this.pageIfy += 1;
      this.pageIfx += 1;
    }

    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getAllNotificationsList();
    }
  }

  pagePrev() {
    if (this.pageIfy > 0) {
      this.pageIfy -= 1;
      this.pageIfx -= 1;
    }

    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getAllNotificationsList();
    }
  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.getAllNotificationsList();
  }

  getAllNotificationsList() {
    let params = {
      pageNumber: this.page.offset,
      pageSize: this.page.limit,
    };
    this.notificationService.getAllNotifications(params);
    this.notificationService.onNotificationListChanged.subscribe((response) => {
      if (response) {
        this.current_page = response.current_page || 0;
          this.page.count = response.page_count || 0;
          this.fakeArray = new Array(response.page_count || 0);
      }
    });
  }

  ngOnInit(): void {
    this.getAllNotificationsList();
    // this.navBarNotificationSvc.latestNotification.subscribe((res) => {
    //   this.getAllNotificationsList();
    // });
  }
}
