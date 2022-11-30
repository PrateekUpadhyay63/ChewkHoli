import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { environment } from "environments/environment";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(public loaderService: NgxUiLoaderService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes(`${environment.apiUrl}/notifications-list?page=1&size=5`)) {
      return next.handle(req);
    }
    // else if(!req.url.match('get-notifications-list')) {
    this.loaderService.start();
    return next.handle(req).pipe(
      finalize(() => {
        this.loaderService.stop();
      })
    );
    // }
  }
}
