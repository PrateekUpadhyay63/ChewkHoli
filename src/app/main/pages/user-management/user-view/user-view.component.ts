import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UserManagementService } from "../user-management.service";
import { CoreTranslationService } from "@core/services/translation.service";

// lanaguage
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";

@Component({
  selector: "app-user-view",
  templateUrl: "./user-view.component.html",
  styleUrls: ["./user-view.component.scss"],
})
export class UserViewComponent implements OnInit {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;

  public passwordTextType: boolean;

  @ViewChild("accountForm") accountForm: NgForm;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private router: Router,
    private _coreTranslationService: CoreTranslationService,
    private _UserManagementService: UserManagementService
  ) {
    this._unsubscribeAll = new Subject();
    this._coreTranslationService.translate(english, arabic);
    this.urlLastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }

  // Send invite mail link
  sendMail() {
    this._UserManagementService
      .sendInviteMailLink(this.urlLastValue)
      .subscribe((res) => {});
  }

  back() {
    this.router.navigateByUrl("/user-management/userlist");
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._UserManagementService
      .getUserByID(this.urlLastValue)
      .subscribe((res: any) => {
        this.rows = res.data.userDetails;
        this.currentRow = res.data.userDetails;
        this.avatarImage = res.data.userDetails.profile_image;
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
