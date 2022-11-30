import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { AuthenticationService } from 'app/auth/service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-forgot-password-v1',
  templateUrl: './auth-forgot-password-v1.component.html',
  styleUrls: ['./auth-forgot-password-v1.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthForgotPasswordV1Component implements OnInit {
  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: FormGroup;
  public submitted = false;
  public clicked = false;
  public loading = false;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */
  constructor(private _coreConfigService: CoreConfigService, 
              private _formBuilder: FormBuilder,
              private authSvc: AuthenticationService,
              private _toastrService: ToastrService,
              private router: Router) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      this.loading = false;
      return;
    }
      this.authSvc.forgetPassword(this.forgotPasswordForm.value).pipe(first())
      .subscribe( res => {
        // this.clicked = true;
        this.loading = false;
        this._toastrService.success(
          res.message,
          'Success!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });

          setTimeout(() => {
            this.backBtn();
          }, 2000);
      },
      err => {
        this.clicked = false;
        this._toastrService.error(
          err.error.message,
          'Error!', {
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
          setTimeout(() => {
            this.backBtn();
          }, 2000);
      }

      );
    
  }

  backBtn() {
    this.router.navigateByUrl("/authentication/login");
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      username: ['', [Validators.required, Validators.email]]
    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
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
