import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from 'app/auth/service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, private _authenticationService: AuthenticationService, private router: ActivatedRoute) { }

  // canActivate
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser: any = this._authenticationService.currentUserValue;

// console.log("in authhh gaaauurrdddd");

    if (currentUser) {
      let value = await this.checkPemmissions(currentUser, state)
      // console.log(value, "lllll");

      if (value) {
        return true;
      }
      else {
        return false;
      }
    }

    // not logged in so redirect to login page with the return url
    this._router.navigate(['/authentication/login']);
    return false;
  }

  checkPemmissions(currentUser, state) {
    return new Promise((resolve, reject) => {
      let returnValue: boolean = false;

      if(currentUser.RoleId != 5){
        this._authenticationService.getUserRoles(currentUser.RoleId).subscribe((data: any) => {
          this._authenticationService.UserPermissions.next(data);
          // console.log(data.data.rolesDetails.permissions);
          // console.log("in", currentUser);
  
  
          let url = state.url
  
  
          if (currentUser.Role.id != 5) {
            // console.log(data.data.rolesDetails.permissions);
  
            data.data.rolesDetails.permissions.forEach((data) => {
              let permissionName = data.Permission.name
              // console.log(url, permissionName);
              if (url.includes("dashboard")) return returnValue = true;
              if (permissionName == "System & Server" && data.view && url.includes("system-server")) return returnValue = true;
              if (permissionName == "Theme" && data.view && url.includes("Color")) return returnValue = true;
              if (permissionName == "Profile" && data.view && url.includes("settings")) return returnValue = true;
              if (permissionName == "IP Camera" && data.view && url.includes("device-management/camera")) return returnValue = true;
              if (permissionName == "Vehicle" && data.view && url.includes("device-management/vehicles")) return returnValue = true;
              if (permissionName == "Users" && data.view && url.includes("user-management")) return returnValue = true;
              if (permissionName == "Groups" && data.view && url.includes("group-management")) return returnValue = true;
              // if (permissionName == "transfer-authority" && data.view && url.includes("transfer-authority")) return returnValue = true;
              if (permissionName == "Roles & Permission" && data.view && url.includes("roles-permission-management")) return returnValue = true;
              if (permissionName == "Organizations" && data.view && url.includes("organizations")) return returnValue = true;
              if (permissionName == "Location" && data.view && url.includes("location-management")) return returnValue = true;
              if (permissionName == "Stream" && data.view && url.includes("stream")) return returnValue = true;
              if(url.includes("conference-call")) return returnValue = true;
  
  
              // if (permissionName == "Settings" && data.view && url.includes("settings")) return returnValue = true;
              // if (permissionName == "Settings" && data.view && url.includes("settings")) return returnValue = true;
            })
  
            console.log(returnValue, "authhhh");
            
            if (!returnValue) {
              this._router.navigate(['/dashboard']);
            }
  
            resolve(returnValue);
          }

        })
      }
      else {
        returnValue = true;
        resolve(returnValue);
      }
    })
  }
}
