import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { ChatsService } from "app/main/pages/dashboard/chat/chats.service";
import { XMPPService } from "app/main/pages/dashboard/ejab.service";
import {ConferenceCallComponent} from "../conference-call/conference-call.component"
@Component({
  selector: "app-conference-call-modal",
  templateUrl: "./conference-call-modal.component.html",
  styleUrls: ["./conference-call-modal.component.scss"],
  
})
export class ConferenceCallModalComponent implements OnInit {
  // @ViewChild(ConferenceCallComponent, {static : true}) child : ConferenceCallComponent;
  // @Input() data: any = {}; //add this
  // @Input() parentRef: any; //add this
  // @Input() unique_key: any; //add this

  public conferenceCallClicked: boolean = false;
  public selectedGroup: any;
  public currentLoggedInUser: any;
  constructor(
    private chatSvc: ChatsService,
    private _coreSidebarService: CoreSidebarService,
    private router: Router,
    private xamppSvc: XMPPService
  ) {}

  ngOnInit(): void {
    let conferenceCallData = JSON.parse(
      localStorage.getItem("conferenceCallData")
    );
    if (conferenceCallData) {
      this.currentLoggedInUser = JSON.parse(
        localStorage.getItem("currentUser")
      );
      this.login(
        this.currentLoggedInUser.jid,
        this.currentLoggedInUser.jid_password
      );
      this.getAllGroups();
      this.selectedGroup = conferenceCallData;
      this.openCall();
    } else {
      this.router.navigateByUrl("miscellaneous/error");
    }
  }

  // close() {
  //   this.parentRef.remove(this.unique_key);
  //   this.child.closed();
  // }

  // Chat server login
  login(user_jid: string, password: string) {
    this.xamppSvc.login(user_jid, password);
  }
  // Get Groups
  getAllGroups() {
    this.chatSvc.getChatGroupList(this.currentLoggedInUser.id);
  }
  //Open sidebar for conference call.
  openCall() {
    this.conferenceCallClicked = true;
    setTimeout(() => {
      this.chatSvc.membersData.next(this.selectedGroup);
      this._coreSidebarService.getSidebarRegistry("conference").toggleOpen();
    }, 300);
  }
}
