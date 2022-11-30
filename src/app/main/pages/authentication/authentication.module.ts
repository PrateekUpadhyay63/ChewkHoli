import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';

import { AuthLoginV2Component } from 'app/main/pages/authentication/auth-login-v2/auth-login-v2.component';
import { AuthForgotPasswordV1Component } from './auth-forgot-password-v1/auth-forgot-password-v1.component';
import { AuthResetPasswordV1Component } from './auth-reset-password-v1/auth-reset-password-v1.component';
import { AuthPasswordUpdate } from './auth-password-update/auth-password-update';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from 'app/auth/helpers';
import { ToastrModule } from 'ngx-toastr';

// routing
const routes: Routes = [
  {
    path: '',
    redirectTo: "/authentication/login",
    pathMatch: "full"
  },
  {
    path: 'authentication/login',
    component: AuthLoginV2Component,
    data: { animation: 'auth' }
  },
  {
    path: 'authentication/forgot-password',
    component: AuthForgotPasswordV1Component
  },
  {
    path: 'authentication/reset-password/:id/:token',
    component: AuthResetPasswordV1Component
  },
  {
    path: 'authentication/password-update',
    component: AuthPasswordUpdate
  }
];

@NgModule({
  declarations: [
    AuthLoginV2Component, 
    AuthForgotPasswordV1Component, 
    AuthResetPasswordV1Component, 
    AuthPasswordUpdate
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CoreCommonModule,
    ToastrModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class AuthenticationModule {}
