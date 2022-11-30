import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'app/auth/service';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;

  @Input()
  layout = 'vertical';

  @Input()
  menu: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {CoreMenuService} _coreMenuService
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _coreMenuService: CoreMenuService,
    public _authenticationService: AuthenticationService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
   basicMenu
  ngOnInit() {
    // Set the menu either from the input or from the service

    this.basicMenu = [...this._coreMenuService.getCurrentMenu()]
    this.menu = this.menu || this._coreMenuService.getCurrentMenu();
    
    // Subscribe to the current menu changes
    this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(async () => {
      // const userRole: any = JSON.parse(localStorage.getItem('currentUser'));

      await this.getUserPermissions()
      // console.log("heererer");



    });
  }

  getUserPermissions() {
    return new Promise((resolve, reject) => {
      let finalSubsc = this._authenticationService.UserPermissions.subscribe((val: any) => {
        let userRole = undefined;
        // console.log(val);

        if (val?.data) {
          userRole = val.data.rolesDetails
        }

        if (userRole) {
          // console.log(userRole.name, userRole.id);

          if (userRole && userRole.name !== "Admin" && userRole.id !== 5) {
            let userMenus = [];
            let allMenus = [];
            let finalMennus = []

            this.menu = this._coreMenuService.getCurrentMenu();
            userRole.permissions.forEach(element => {
              // console.log("in navbaaar")
              if (element.view) {
                this.menu.forEach(item => {
                  if (item.title == element.Permission.name) {
                    userMenus.push(item);
                  }
                  if (item.children) {
                    item.children.forEach((data) => {
                      if (data.title == element.Permission.name) {
                        let child = data
                        let UsersMenus = {
                          id: item.id,
                          title: item.title,
                          translate: item.translate,
                          type: item.type,
                          icon: item.icon,
                          children: [child]
                        }

                        let checkData = allMenus.filter((newVal) => {
                          return newVal.id == UsersMenus.id
                        })[0]



                        if (checkData) {
                          checkData.children.push(child)
                        }
                        else {
                          allMenus.push(UsersMenus)
                        }

                      }
                    })
                  }



                });
                // let newUserMenu = userMenus.map((val) => {
                //   return 
                // })

                // userMenus.sort(function (a, b) { return a.id - b.id });
                // allMenus.sort(function (a, b) { return a.id - b.id });
              }
            });

            allMenus.map((child) => {
              child.children = child.children.sort(function (a, b) { return a.id - b.id });
            })

            finalMennus = userMenus.concat(allMenus)
            finalMennus.sort(function (a, b) { return a.id - b.id });

            // console.log(finalMennus);

            this.menu = finalMennus;

            return


          }
          else{
            this.menu = this.basicMenu
          }
          this._changeDetectorRef.markForCheck();
        }
      });
    })
  }
}
