import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from './must-match.validator';

@Component({
  selector: 'app-auth-reset-password-v1',
  templateUrl: './auth-reset-password-v1.component.html',
  styleUrls: ['./auth-reset-password-v1.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthResetPasswordV1Component implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public submitted = false;
  public loading = false;
  private user_id;
  registerForm: FormGroup;
  message
  // Private
  private _unsubscribeAll: Subject<any>;
  hidePage: boolean = false;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(private _coreConfigService: CoreConfigService,
    private _toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authSvc: AuthenticationService) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };

  }



  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * Toggle confirm password
   */
  toggleConfPasswordTextType() {
    this.confPasswordTextType = !this.confPasswordTextType;
  }

  // /**
  //  * On Submit
  //  */
  // onSubmit(form) {
  //   this.loading = true;
  //     let payload = {
  //       new_password : form.value.Password,
  //       user_id : +this.user_id
  //     }
  //     this.authSvc.updatePassword(payload).subscribe( (res:any) => { 
  //       this.loading = false;
  //       this._toastrService.success(
  //         res.message,
  //         'Success!', {
  //           toastClass: 'toast ngx-toastr',
  //           closeButton: true
  //         });
  //         this.router.navigate(["/authentication/password-update"]);
  //   });
  //   localStorage.removeItem("passwordResetToken");

  // }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    let payload = {
      new_password: this.registerForm.value.confirmPassword,
    }
    this.authSvc.updatePassword(payload).subscribe((res: any) => {
      this.loading = false;
      this._toastrService.success(
        res.message,
        'Success!', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
      this.router.navigateByUrl("/authentication/password-update");
    }, 
    err => {
      this.loading = false;
      this._toastrService.error(`${err.error.message}`, "Error!", {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    }
    );
    localStorage.removeItem("passwordResetToken");
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {    
    this.registerForm = this.formBuilder.group(
      {
        password: ['',
          [
            Validators.required,
            Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    // read user id and token from URL
    this.activatedRoute.params.subscribe(params => {
      this.user_id = params.id;
      localStorage.setItem("passwordResetToken", params.token);

      this.verifyUserToken(params.token)
    });
  }

  getUserDetails() {
    this.authSvc.getUserDetails(this.user_id).subscribe((data) => {
      if (data['data']['userDetails']['can_reset'] == 0) {
        this.hidePage = true
        this.message = "Your reset password link has been expired. Please Contact the administrator"
      }
    })
  }

  verifyUserToken(token) {
    this.authSvc.verifyUserToken({ token }).subscribe((data) => {
      if (data['data']['is_valid']) {
        this.getUserDetails()
      }
      else {        
        this.hidePage = true
        this.message = "Your Link Has Expired"
      }

    })
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    localStorage.removeItem("passwordResetToken");
  }
}
