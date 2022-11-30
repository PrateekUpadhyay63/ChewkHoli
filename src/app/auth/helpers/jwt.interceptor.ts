import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "environments/environment";
import { AuthenticationService } from "app/auth/service";
import { Router } from "@angular/router";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   *
   * @param {AuthenticationService} _authenticationService
   */
  constructor(
    private _authenticationService: AuthenticationService,
    private router: Router
  ) {}

  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser = this._authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    let url = this.router.url;
    let urlverify =
      url.includes("/authentication/reset-password") ||
      url.includes("/authentication/forgot-password");
    // const isApiUrl = request.url.startsWith(environment.apiUrl);
    const checkCurrentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!checkCurrentUser && !urlverify) {
      if (!url.includes("authentication/login"))
        this._authenticationService.logout();
      // this._authenticationService.logout();
      // currentUser = null;
    }
    if (checkCurrentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `${checkCurrentUser?.token}`,
          "language-id": `${checkCurrentUser?.Language?.code}`,
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          "language-id": "EN",
        },
      });
    }
    return next.handle(request);
  }
}
