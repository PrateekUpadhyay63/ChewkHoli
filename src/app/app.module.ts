import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import "hammerjs";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr"; // For auth after login toast
import { CoreModule } from "@core/core.module";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule, CoreThemeCustomizerModule } from "@core/components";
import { coreConfig } from "app/app-config";
import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";
import { MenuModule } from "./menu/menu.module";
import { MinMaxPopupModule, MinMaxDirective } from 'min-max-popup';

import { PagesModule } from "./main/pages/pages.module";
import {
  AuthGuard,
  ErrorInterceptor,
  JwtInterceptor,
  LoaderInterceptor,
} from "./auth/helpers";
import { UserManagementService } from "./main/pages/user-management/user-management.service";
import { RolesPermissionsService } from "./main/pages/roles-permission/roles-permissions.service";
import { SharedModule } from "./shared/shared.module";
import { XMPPService } from "./main/pages/dashboard/ejab.service";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireMessagingModule } from "@angular/fire/compat/messaging";
import { environment } from "environments/environment";
import { AsyncPipe } from "@angular/common";
import { ContextMenuModule } from "@ctrl/ngx-rightclick";
import { NgApexchartsModule } from "ng-apexcharts";
import { ConferenceCallModalComponent } from "./shared/conference-call-modal/conference-call-modal.component";
import { ConferenceCallComponent } from "./shared/conference-call/conference-call.component";
import { OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { VideoWraperComponent } from "./main/pages/device-management/video-player/video-wraper/video-wraper.component";
import { SecurePipe } from "@core/pipes/imageauthorisation.pipe";

const appRoutes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./main/pages/authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
    // canActivate: [AuthGuard]
  },
  {
    path: "conference-call",
    component: ConferenceCallModalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "",
    redirectTo: "/auth",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "/miscellaneous/error", //Error 404 - Page not found
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    // NgxChatModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    MinMaxPopupModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: "enabled", // Add options right here
      relativeLinkResolution: "legacy",
    }),
    TranslateModule.forRoot(),

    //NgBootstrap
    NgbModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      maxOpened: 1,
    }),

    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,

    // App modules
    LayoutModule,
    PagesModule,
    MenuModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    ContextMenuModule,
    NgApexchartsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    AuthGuard,
    RolesPermissionsService,
    MinMaxDirective,
    XMPPService,
    AsyncPipe,
    SecurePipe
  ],

  bootstrap: [AppComponent,VideoWraperComponent],
})
export class AppModule {}
