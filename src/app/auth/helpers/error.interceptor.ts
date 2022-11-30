import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthenticationService } from "app/auth/service";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(
    private _router: Router,
    private _authenticationService: AuthenticationService,
    public loaderService: NgxUiLoaderService,
    private _toastrService: ToastrService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let url = this._router.url;
    return next.handle(request).pipe(
      catchError((err) => {
        // this.loaderService.stop();
        if ([401, 403].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          localStorage.removeItem("currentUser");
          if (!url.includes("authentication/login"))
            this._authenticationService.logout();
          this._router.navigate(["/authentication/login"]);
          // alert(err);
          this._toastrService.error(`${err.error.message}`, "Error!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });

          // ? Can also logout and reload if needed
          // location.reload(true);
        }
        // throwError
        // console.log("error.ts",err)
        const error = err;
        return throwError(error);
      })
    );
  }
}
