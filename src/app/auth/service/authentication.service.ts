import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "environments/environment";
import { User, Role } from "app/auth/models";
import { Router } from "@angular/router";
import { Buffer } from "buffer";
import { XMPPService } from "app/main/pages/dashboard/ejab.service";
import { ToastrService } from "ngx-toastr";
@Injectable({ providedIn: "root" })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  public currentUserSubject: BehaviorSubject<User>;
  public UserPermissions = new BehaviorSubject<any>([]);

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(
    private _http: HttpClient,
    private router: Router,
    private _toastrService: ToastrService,
    private xamppSvc: XMPPService
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return (
      this.currentUser && this.currentUserSubject.value.role === Role.Admin
    );
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return (
      this.currentUser && this.currentUserSubject.value.role === Role.Client
    );
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(username: string, password: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/login`, { username, password })
      .pipe(
        map((user: any) => {
          // login successful if there's a jwt token in the response
          if (user.data.userDetails && user.data.userDetails.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem(
              "currentUser",
              JSON.stringify(user.data.userDetails)
            );
            this.currentUserSubject.next(user.data.userDetails);
          }
          return user.data.userDetails;
        })
      );
  }

  updateUserLanguage(data, id) {
    return this._http.patch(`${environment.apiUrl}/update-user/${id}`, data);
  }

  /**
   * User logout
   *
   */
  logout() {
    const checkCurrentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!checkCurrentUser) {
      localStorage.removeItem("currentUser");
      // notify
      // this.currentUserSubject.next(null);
      // redirect to login page
      this.xamppSvc.logout();
      this.router.navigate(["/authentication/login"]);
      this._toastrService.info(
        "your session is terminated successfully  !",
        "Info!",
        {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        }
      );
    }

    return this._http.get(
      `${environment.apiUrl}/logout/${checkCurrentUser?.id}`
    );
  }

  // forget password
  forgetPassword(username: string) {
    return this._http.post<any>(
      `${environment.apiUrl}/reset-password`,
      username
    );
    // .pipe(
    //   map((res : any) => {
    //     this._toastrService.info(
    //       res.message,
    //       'Info!', {
    //         toastClass: 'toast ngx-toastr',
    //         closeButton: true
    //       });
    //     })
    // );
  }

  // update password
  updatePassword(payload: any) {
    return this._http.patch(
      `${environment.apiUrl}/change-password`,
      payload,
      this.setHeader()
    );
    // .pipe(
    //   map((res : any) => {
    //     this._toastrService.info(
    //       res.message,
    //       'Info!', {
    //         toastClass: 'toast ngx-toastr',
    //         closeButton: true
    //       });
    //     })
    //     );
  }

  verifyUserToken(tokenn) {
    let base64Token;
    let token = tokenn.token;

    // base64Token = Buffer.from(token, "base64");
    // let dataToSend = JSON.parse(base64Token.toString("utf8"))
    // console.log(dataToSend);

    let headers = new HttpHeaders({ Authorization: `${token}` });

    return this._http.get(`${environment.apiUrl}/verify-token`, {
      headers: headers,
    });
  }

  getUserDetails(userId) {
    return this._http.get(
      `${environment.apiUrl}/user/${userId}`,
      this.setHeader()
    );
  }

  getUserRoles(roleId) {
    return this._http.get(`${environment.apiUrl}/get-rolepermission/${roleId}`);
  }

  setHeader(): any {
    const passwordResetToken = localStorage.getItem("passwordResetToken");
    let headers = new HttpHeaders({ Authorization: `${passwordResetToken}` });
    return { headers: headers };
  }
}
