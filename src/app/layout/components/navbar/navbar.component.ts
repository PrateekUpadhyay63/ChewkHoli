import {
  Component,
  OnDestroy,
  OnInit,
  HostBinding,
  HostListener,
  ViewEncapsulation,
} from "@angular/core";
import { MediaObserver } from "@angular/flex-layout";

import * as _ from "lodash";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";

import { AuthenticationService } from "app/auth/service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreConfigService } from "@core/services/config.service";
import { CoreMediaService } from "@core/services/media.service";

import { User } from "app/auth/models";

import { coreConfig } from "app/app-config";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CoreTranslationService } from "@core/services/translation.service";

// lanaguage
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { XMPPService } from "app/main/pages/dashboard/ejab.service";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit, OnDestroy {
  public horizontalMenu: boolean;
  public hiddenMenu: boolean;
  title = true;
  public coreConfig: any;
  public currentSkin: string;
  public prevSkin: string;
  public isFullScreen : boolean = false;
  public currentUser: any;

  public languageOptions: any;
  public navigation: any;
  public selectedLanguage: any;
  public avtarImage: string;
  public role = [
    { id: 1, value: "End User" },
    { id: 4, value: "IT Admin" },
    { id: 3, value: "Sub Admin" },
    { id: 5, value: "Admin" },
  ];
  public roleName;
  @HostBinding("class.fixed-top")
  public isFixed = false;

  @HostBinding("class.navbar-static-style-on-scroll")
  public windowScrolled = false;

  // Add .navbar-static-style-on-scroll on scroll using HostListener & HostBinding
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (
      (window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop > 100) &&
      this.coreConfig.layout.navbar.type == "navbar-static-top" &&
      this.coreConfig.layout.type == "horizontal"
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CoreMediaService} _coreMediaService
   * @param {MediaObserver} _mediaObserver
   * @param {TranslateService} _translateService
   */
  constructor(
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _coreConfigService: CoreConfigService,
    private _coreMediaService: CoreMediaService,
    private _coreSidebarService: CoreSidebarService,
    private _mediaObserver: MediaObserver,
    public _translateService: TranslateService,
    private _coreTranslationService: CoreTranslationService,
    private _toastrService: ToastrService,
    private xamppSvc: XMPPService
  ) {
    this._coreTranslationService.translate(english, arabic);
    this._authenticationService.currentUser.subscribe((x) => {
      if (x) {
        this.currentUser = x;
        if (this.currentUser)
          this.avtarImage = this.currentUser.profile_image
            ? this.currentUser.profile_image
            : "../../../../../assets/images/avatars/user-avatar-image.jpg";
        let lanaguage;

        if (this.currentUser.Language.id == 2) {
          lanaguage = "en";
        } else lanaguage = "ar";
        this.setLanguage(lanaguage);
      }
    });

    this.languageOptions = {
      en: {
        title: "English",
        flag: "us",
      },
      ar: {
        title: "Arabic",
        flag: "ae",
      },
    };

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebar(key): void {
    this._coreSidebarService.getSidebarRegistry(key).toggleOpen();
  }

  /**
   * Set the language
   *
   * @param language
   */
  setLanguage(language): void {
    // Set the selected language for the navbar on change
    this.selectedLanguage = language;

    // Use the selected language id for translations
    this._translateService.use(language);
    this._coreConfigService.setConfig(
      { app: { appLanguage: language } },
      { emitEvent: true }
    );
    this.updateUsersLanguage(language);
  }

  updateUsersLanguage(language) {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    let lan;
    if (language == "ar") {
      lan = 1;
    } else {
      lan = 2;
    }
    // if(currentUser?.id){
    //   this._authenticationService.updateUserLanguage({languageId : lan}, currentUser.id).subscribe((data:any)=>{
    //     currentUser.Language = data.data.Language
    //     localStorage.setItem("currentUser", JSON.stringify(currentUser))
    //   })
    // }
  }

  /**
   * Toggle Dark Skin
   */
  toggleDarkSkin() {
    // Get the current skin
    this._coreConfigService
      .getConfig()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.currentSkin = config.layout.skin;
      });

    // Toggle Dark skin with prevSkin skin
    this.prevSkin = localStorage.getItem("prevSkin");

    if (this.currentSkin === "dark") {
      this._coreConfigService.setConfig(
        { layout: { skin: this.prevSkin ? this.prevSkin : "default" } },
        { emitEvent: true }
      );
    } else {
      localStorage.setItem("prevSkin", this.currentSkin);
      this._coreConfigService.setConfig(
        { layout: { skin: "dark" } },
        { emitEvent: true }
      );
    }
  }

  //check for dashboard route
  public checkRoute() {
    if(this._router.url === "/dashboard"){
      return true;
    }
    return false;
  }

  

  //full screen
   public onFullscreen() {
    const div = document.querySelector('.dashboard-group-chat');

    if (div['requestFullscreen']) {
      div['requestFullscreen']();
    } else if (div['webkitRequestFullscreen']) {
      div['webkitRequestFullscreen']();
    } else if (div['msRequestFullscreen']) {
      div['msRequestFullscreen']();
    } else if (div['mozRequestFullScreen']) {
      div['mozRequestFullScreen']();
    }

    this.xamppSvc.isFullScreenMode.next(true);

    div.classList.add('fullmode');

    div.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        this.xamppSvc.isFullScreenMode.next(false);
        div.classList.remove('fullmode');
      }
    });

    div.addEventListener("mozfullscreenchange", function() {
      if (!document.fullscreenElement) {
        this.xamppSvc.isFullScreenMode.next(false);
        div.classList.remove('fullmode');
      }
    });

    div.addEventListener("webkitfullscreenchange", function() {
      if (!document.fullscreenElement) {
        this.xamppSvc.isFullScreenMode.next(false);
        div.classList.remove('fullmode');
      }
    });

    div.addEventListener("msfullscreenchange", function() {
      if (!document.fullscreenElement) {
        this.xamppSvc.isFullScreenMode.next(false);
        div.classList.remove('fullmode');
      }
    });

    // if (document.fullscreenElement) {
    //   this.title = true;
    //   this.isFullScreen = false;
    //   this.xamppSvc.isFullScreenMode.next(this.isFullScreen);
    //   document.exitFullscreen();
    // } else {
    //   this.title = true;
    //   const dashboardDiv = document.querySelector(".dashboard-group-chat");
    //   if (dashboardDiv.requestFullscreen) {
    //     dashboardDiv.requestFullscreen();
    //     this.isFullScreen = true;
    //     this.xamppSvc.isFullScreenMode.next(this.isFullScreen);
    //   }
    // }
  }

  /**
   * Logout method
   */
  logout() {
    // this._authenticationService.logout(id).subscribe((res: any) => {
    this._authenticationService.logout().subscribe((data) => {
      // remove user from local storage to log user out

      localStorage.removeItem("currentUser");
      // notify
      // this.currentUserSubject.next(null);
      // redirect to login page
      this.xamppSvc.logout();
      this._router.navigate(["/authentication/login"]);
      this._toastrService.info(
        " You have logged out successfully !",
        "Info!",
        {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        }
      );
    });

    // })
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // get the currentUser details from localStorage
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //  console.log("current user", this.currentUser);
    if (this.currentUser) {
      // console.log(this.currentUser.profile_image);

      this.avtarImage = this.currentUser.profile_image;
    }
    //
    // this.roleName = this.role.find((val:any) => {
    //    return this.currentUser.RoleId === val.id
    //  })
    // Subscribe to the config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
        this.horizontalMenu = config.layout.type === "horizontal";
        this.hiddenMenu = config.layout.menu.hidden === true;
        this.currentSkin = config.layout.skin;

        // Fix: for vertical layout if default navbar fixed-top than set isFixed = true
        if (this.coreConfig.layout.type === "vertical") {
          setTimeout(() => {
            if (this.coreConfig.layout.navbar.type === "fixed-top") {
              this.isFixed = true;
            }
          }, 0);
        }
      });

    // Horizontal Layout Only: Add class fixed-top to navbar below large screen
    if (this.coreConfig.layout.type == "horizontal") {
      // On every media(screen) change
      this._coreMediaService.onMediaUpdate
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          const isFixedTop = this._mediaObserver.isActive("bs-gt-xl");
          if (isFixedTop) {
            this.isFixed = false;
          } else {
            this.isFixed = true;
          }
        });
    }

    // Set the selected language from default languageOptions
    this.selectedLanguage = _.find(this.languageOptions, {
      id: this._translateService.currentLang,
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
