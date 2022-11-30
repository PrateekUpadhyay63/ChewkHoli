import { Component, ViewEncapsulation } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { ContextMenuService } from "@ctrl/ngx-rightclick";
import { MenuPackage } from "@ctrl/ngx-rightclick";
import { MenuComponent } from "@ctrl/ngx-rightclick";
import { ChatsService } from "../../../chats.service";
import { locale as english } from "../../../i18n/en";
import { locale as arabic } from "../../../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
@Component({
  selector: "app-animated-custom-context-menu",
  templateUrl: "./custom-context-menu.component.html",
  styleUrls: ["./context-menu.component.scss"],
  animations: [
    trigger("menu", [
      state(
        "enter",
        style({ opacity: 1, marginTop: "0px", visibility: "visible" })
      ),
      state("exit, void", style({ opacity: 0, marginTop: "-15px" })),
      transition("* => *", animate("120ms ease-in")),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AnimatedCustomContextMenuComponent extends MenuComponent {
  constructor(
    public menuPackage: MenuPackage,
    public contextMenuService: ContextMenuService,
    private chatService: ChatsService,
    private _coreTranslationService: CoreTranslationService
  ) {
    super(menuPackage, contextMenuService);
    this._coreTranslationService.translate(english, arabic);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  handleClick() {
    this.chatService.onReplyMessageClick(true);
    this.contextMenuService.closeAll();
  }
}
