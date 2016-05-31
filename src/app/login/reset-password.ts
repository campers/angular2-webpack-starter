import {AppState} from "../app.service";
import {AuthService} from "../../services/auth/index";
import { Injectable, Component, Directive, Input } from '@angular/core'
import { ControlGroup, Control, FormBuilder, Validators } from '@angular/common'
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { CustomValidators } from '../util/CustomValidators';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
  selector: 'reset-password-finish',
  //directives: [MD_INPUT_DIRECTIVES,...[SocialAuth, GoogleAuth]],
  //pipes: [],
  // Our list of styles in our component. We may add more to compose many styles together
  //styles: [require('./login.css')],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: `
    <form [ngFormModel]="f" (ngSubmit)="onSubmit()" autocomplete="off">
        <md-input
          ngControl="email" placeholder="Email" autofocus #username="ngForm">
        </md-input>
        <div *ngIf="!email.valid && submitted">Email is required</div>
        <br/>
        <div *ngIf="serverError">{{serverError}}</div>
        <br/>
        <button md-raised-button color="primary">Submit</button>
      </form>
  `
})
export class ResetPasswordFinish  {

  f: ControlGroup
  serverError: string
  submitted: boolean = false

  constructor(public appState:AppState, private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.f = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, CustomValidators.emailValidator])]
    })
  }

  onSubmit(form) {
    this.submitted = true
    this.serverError = ''
    if(!this.f.valid)
      return

    this.authService.resetPasswordFinish(this.f.controls['key'].value, this.f.controls['password'].value)
      .then(user => {
        this.router.navigateByUrl('/home')
      }, error => {
        this.serverError = error['_body']
        //this.f.controls['password'].value = ''
        console.log('login error',error)
      })
  }
}
