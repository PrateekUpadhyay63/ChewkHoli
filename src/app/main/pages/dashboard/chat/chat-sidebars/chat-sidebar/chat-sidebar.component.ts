import { Component, OnInit, Input } from "@angular/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { ChatsService } from "../../chats.service";
import { XMPPService } from "../../../ejab.service";
import { locale as english } from "../../i18n/en";
import { locale as arabic } from "../../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
@Component({
  selector: "app-chat-sidebar",
  templateUrl: "./chat-sidebar.component.html",
  styleUrls: ["./chat-sidebar.component.scss"],
})
export class ChatSidebarComponent implements OnInit {
  // Public
  public contacts;
  public chatUsers;
  public searchText;
  public chats;
  public selectedIndex = null;
  public userProfile;
  @Input() selectedChat: any;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private chatsSvc: ChatsService,
    private xamppSvc: XMPPService,
    private _coreSidebarService: CoreSidebarService,
    private _coreTranslationService: CoreTranslationService,
  ) {
    this._coreTranslationService.translate(english, arabic);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open Chat
   *
   * @param id
   * @param newChat
   */
  openChat(id) {
    // Reset unread Message to zero
    this.chatUsers.map((user) => {
      if (user.id === id) {
        user.unseenMsgs = 0;
      }
    });
  }

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    // console.log("pppppppppppppppp");
    this.xamppSvc.clickMembersList.next(true);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  clicked;

  /**
   * Set Index
   *
   * @param index
   */
  setIndex(index: number) {
    this.selectedIndex = index;
  }

  //   async joinRoom(occupantJid: JID) {
  //     this.selectedRoom = await this.multiUserChatPlugin.joinRoom(occupantJid);
  //     this.occupantJid = occupantJid;
  //     this.occupantJidText = occupantJid.toString();
  // }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // setTimeout(() => {
    //   this.toggleSidebar('chat-user-sidebar');
    // }, 300);
  }
}
