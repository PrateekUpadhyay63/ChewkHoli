import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { Toast, ToastPackage, ToastrService } from "ngx-toastr";
import { FirebaseMessageService } from "../../services/firebase-message.service";
import { ChatsService } from "../chats.service";
import { IncomingcallData } from "./incoming-call-data";

//   import { Toast, ToastrService, ToastPackage } from '../li';

@Component({
  selector: "[pink-toast-component]",
  styles: [
    `
      /* :host {
        background-color: #FF69B4;
        position: relative;
        overflow: hidden;
        margin: 0 0 6px;
        padding: 10px 10px 10px 10px;
        width: 300px;
        border-radius: 3px 3px 3px 3px;
        color: #FFFFFF;
        pointer-events: all;
        cursor: pointer;
      } */
      .btn-pink {
        -webkit-backface-visibility: hidden;
        -webkit-transform: translateZ(0);
      }
    `,
  ],
  template: `
    <div class="row" [style.display]="state.value === 'inactive' ? 'none' : ''">
      <div class="col-9">
        <div
          *ngIf="title"
          [class]="options.titleClass"
          [attr.aria-label]="title"
        >
          {{ title }}
        </div>
        <div
          *ngIf="message && options.enableHtml"
          role="alert"
          [class]="options.messageClass"
          [innerHTML]="message"
        ></div>
        <div
          *ngIf="message && !options.enableHtml"
          role="alert"
          [class]="options.messageClass"
          [attr.aria-label]="message"
        >
          {{ message }}
        </div>
        <div class="row">
          <span
            class="col-4"
            placement="right"
            ngbTooltip="Answer Call"
            style=" color: green;"
            (click)="joinCall()"
          >
            <i size="24" data-feather="phone"> </i
          ></span>
          <span
            class="col-4"
            placement="right"
            ngbTooltip="Reject Call"
            style=" color: red; "
            (click)="remove()"
          >
            <i size="24" data-feather="phone-off"> </i
          ></span>
        </div>
      </div>
      <div class="col-3 text-right">
        <button
          *ngIf="!options.closeButton"
          (click)="remove()"
          aria-label="Close"
          class="toast-close-button"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
    <div *ngIf="options.progressBar">
      <div class="toast-progress" [style.width]="width + '%'"></div>
    </div>
    <!-- <core-sidebar
 *ngIf="conferenceCallClicked"
 class="modal modal-slide-in sidebar-todo-modal fade"
 name="conference"
 overlayClass="modal-backdrop"
>
 <app-conference-call [selectedChat]="selectedChat"></app-conference-call>
</core-sidebar> -->
  `,
  animations: [
    trigger("flyInOut", [
      state(
        "inactive",
        style({
          opacity: 0,
        })
      ),
      transition(
        "inactive => active",
        animate(
          "400ms ease-out",
          keyframes([
            style({
              transform: "translate3d(100%, 0, 0) skewX(-30deg)",
              opacity: 0,
            }),
            style({
              transform: "skewX(20deg)",
              opacity: 1,
            }),
            style({
              transform: "skewX(-5deg)",
              opacity: 1,
            }),
            style({
              transform: "none",
              opacity: 1,
            }),
          ])
        )
      ),
      transition(
        "active => removed",
        animate(
          "400ms ease-out",
          keyframes([
            style({
              opacity: 1,
            }),
            style({
              transform: "translate3d(100%, 0, 0) skewX(30deg)",
              opacity: 0,
            }),
          ])
        )
      ),
    ]),
  ],
  preserveWhitespaces: false,
})
export class CustomCallNotificationComponent extends Toast implements OnInit {
  // used for demo purposes
  undoString = "undo";
  // conferenceCallClicked:boolean = false;
  // public selectedChat;
  // constructor is only necessary when not using AoT
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    private _coreSidebarService: CoreSidebarService,
    private commonService: ChatsService,
    private firebaseSvc: FirebaseMessageService
  ) {
    super(toastrService, toastPackage);
  }
  ngOnInit(): void {

    // let audio: HTMLAudioElement = new Audio('../../../../../assets//music/call-tune.mp3');
    // audio.play();
  
  }

  joinCall() {
    //  this.conferenceCallClicked = true;
    this.commonService.onAnswerCallClicked(true);
    // this._coreSidebarService.getSidebarRegistry('conference').toggleOpen();
    // alert("Checking..");
  }

  // toggleSidebar(name): void {
  //   console.log("name", name);
  //   this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  // }
  action(event: Event) {
    event.stopPropagation();
    this.undoString = "undid";
    this.toastPackage.triggerAction();
    return false;
  }
}
