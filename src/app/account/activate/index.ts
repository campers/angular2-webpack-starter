import { Component, ViewEncapsulation } from '@angular/core';
import { RouteConfig, Router,RouteParams } from '@angular/router-deprecated';
import {AuthService} from "../../../services/auth/index";
import {Log} from "../../../services/log/log.service";

/*
 * Component for activating an account by the email verification link
 */
@Component({
  selector: 'activate-account',
  template: `
    <md-card>
      <div *ngIf="!error">Activating account...</div>
      <div *ngIf="error">{{error}}</div>
      <!-- If the key is invalid we could give the option of sending a new verification email
      <div *ngIf="error.resend">Verification key invalid <button>Send new verification email</button></div>
      -->
    </md-card>
  `
})
export class ActivateAccount {

  private key:string
  private error:string

  constructor(private authService: AuthService, private router: Router, params: RouteParams, private log: Log) {
    this.key = params.get('key')
  }

  ngOnInit() {
    this.log.info('Activating account key:', this.key)

    this.authService.activateAccount(this.key).then(
      success => this.router.navigateByUrl('/'),
      error => {this.error = error}
    )
  }

}

