import {AuthService} from "../../services/auth/index";
import { Component, Directive, Input } from '@angular/core'
import { ControlGroup, Control, FormBuilder, Validators } from '@angular/common'
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { CustomValidators } from '../util/CustomValidators';
import {RouteConfig, Router, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';

@Component({
  selector: 'activate-account',
  template: `
<div class="card-container">
  <md-card x-large class="sample-content">
    <div *ngIf="!activated && !serverError">Activating...</div>
    <div *ngIf="activated">Your account has been activated. Please <a [routerLink]=" ['Login'] ">log in</a></div>
    <div *ngIf="serverError">{{serverError}}</div>
  </md-card>
</div>
  `
})
export class ActivateAccount  {

  serverError: string
  activated: boolean = false

  constructor(private authService: AuthService, private router: Router, private params: RouteParams) {}

  ngOnInit() {
    this.authService.activateAccount(this.params.get('key')).then(
      success => this.activated = true,
      error => this.serverError = error
    )
  }

}
