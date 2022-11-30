import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { XMPPService } from "../../ejab.service";

import { locale as english } from "../i18n/en";
import { locale as arabic } from "../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";

@Component({
  selector: "app-chat-content",
  templateUrl: "./chat-content.component.html",
  styleUrls: ["./chat-content.component.scss"],
})
export class ChatContentComponent implements OnInit {
  // Decorator
  @ViewChild("scrollMe") scrollMe: ElementRef;
  scrolltop: number = null;

  // Public
  public activeChat: Boolean;
  public chats;
  public chatUser;
  public userProfile;
  public chatMessage = "";
  public newChat;

  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _coreTranslationService: CoreTranslationService,
    public xamppSvc: XMPPService
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update Chat
   */

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this.xamppSvc.clickGroupChat.next("clicked");
    this.xamppSvc.clickMapDiv.next(true);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {}
}
