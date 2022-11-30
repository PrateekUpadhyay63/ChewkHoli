import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';

import { filter, take } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class CoreLoadingScreenService {
  loadingScreenEl: any;
  animationPlayer: AnimationPlayer;

  /**
   * Constructor
   *
   * @param _document
   * @param {Router} _router
   * @param {AnimationBuilder} _animationBuilder
   */
  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _animationBuilder: AnimationBuilder,
    private ngxLoader: NgxUiLoaderService
  ) {
    // Initialize
    // this._init();
  }

  // Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Initialize
   *
   * @private
   */
  private _init(): void {
    // Get the loading screen element
    this.loadingScreenEl = this._document.body.querySelector('#loading-bg');
    // this.loadingScreenEl = this.ngxLoader.start();
    // If loading screen element
    if (this.loadingScreenEl) {
      // Hide it on the first NavigationEnd event
      this._router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          take(1)
        )
        .subscribe(() => {
          setTimeout(() => {
            // this.ngxLoader.stop();
            this.hide();
          });
        });
    }
  }

  // Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show the loading screen
   */
  show(): void {
    this.animationPlayer = this._animationBuilder
      .build([
        style({
          opacity: '0',
          zIndex: '99999'
        }),
        animate('250ms ease', style({ opacity: '1' }))
      ])
      .create(this.loadingScreenEl);

    setTimeout(() => {
      this.animationPlayer.play();
    }, 0);
  }

  /**
   * Hide the loading screen
   */
  hide(): void {
    this.animationPlayer = this._animationBuilder
      .build([
        style({ opacity: '1' }),
        animate(
          '250ms ease',
          style({
            opacity: '0',
            zIndex: '-10'
          })
        )
      ])
      .create(this.loadingScreenEl);

    setTimeout(() => {
      this.loadingScreenEl.remove();
      this.animationPlayer.play();
    }, 0);
  }
}
