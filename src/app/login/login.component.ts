import { Injectable, Component, Directive, Input } from '@angular/core'
import { ControlGroup, Control, FormBuilder, Validators } from '@angular/common'
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { AppState } from '../app.service'
import { CustomValidators } from '../util/CustomValidators';
import { AuthService } from '../../services/auth/index';
import {ServerService} from "../../services/server/index";
import {RouteConfig, Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';


@Component({
  selector: 'google-auth',
  styles: [require('./social.css')],
  template: `
    <form action="/api/signin/google" method="GET">
        <input type="submit" class="btn btn-block jh-btn-social jh-btn-google" value="Sign in with Google" onclick="this.form.submit()"/>
        <input name="scope" type="hidden" value="https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"/>
        <input name="_csrf" type="hidden" value="xyz"/>
    </form>
  `
})
export class GoogleAuth {
}


@Component({
  selector: 'social-auth',
  inputs: ['type'],
  styles: [require('./social.css')],
  template: `
    <form (ngSubmit)="onSubmit()" [action]="providerURL">
        <button type="submit" class="btn btn-block jh-btn-social jh-btn-{{ provider }}" [class]="{}">
            <span translate="social.btnLabel">Sign in with {{ label }}</span>
        </button>
        <!--
        <input ngControl="scope" type="hidden" value="{{ providerSetting }}"/>
        <input ngControl="_csrf" type="hidden" value="{{ csrf }}"/>
        -->
    </form>
    <div *ngIf="serverError">{{serverError}}</div>
  `
})
export class SocialAuth {

  providerURL: string
  label: string
  providerSetting: string
  csrf: string = 'aevrouiahpiuer'
  type: string
  serverError: string

  constructor(public appState:AppState, private authService: AuthService, private router: Router) {}

  onSubmit() {
    console.log('social auth submit')
    this.authService.social(this.type, this.providerSetting, this.csrf)
      .then(response => {
        console.log('social response', response)
        //this.router.navigateByUrl('/home')
      }, error => {
        this.serverError = error['_body']
        //this.f.controls['password'].value = ''
        console.log('social auth error',error)
      })
  }

  ngOnInit() {
    this.csrf = this.getCSRF()
    this.providerURL = 'signin/' + this.type

    if(this.type === 'google') {
      this.label = 'Google'
      this.providerSetting = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
    }
    else if(this.type === 'facebook') {
      this.label = 'Facebook'
      this.providerSetting = 'public_profile,email'
    }
    else if(this.type === 'linkedin') {
      this.label = 'LinkedIn'
      this.providerSetting = 'r_basicprofile,r_emailaddress'
    }
    else
      console.error('Invalid social authentication provider', this.type)
  }

  getCSRF () {
    /* globals document */
    var name = 'CSRF-TOKEN=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) !== -1) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
}

@Component({
  selector: 'login-form',
  directives: [...[SocialAuth, GoogleAuth]],
  template: `
    <form [ngFormModel]="f" (ngSubmit)="onSubmit()" autocomplete="off">
        <md-input
          ngControl="username" placeholder="Username" autofocus #username="ngForm">
        </md-input>
        <div *ngIf="!username.valid && submitted" class="error-msg">Username is required</div>
        <md-input
          ngControl="password" placeholder="Password" type="password" #password="ngForm">
        </md-input>
        <div *ngIf="!password.valid && submitted" class="error-msg">Password is required</div>
        <md-checkbox ngControl="rememberMe" #rememberMe="ngForm">Remember Me</md-checkbox>
        <div *ngIf="serverError" class="error-msg">{{serverError}}</div>
        <br/><br/>
        <button md-raised-button color="primary">Login</button>
      </form>
      <br/>
      <google-auth></google-auth>
      <social-auth type="facebook"></social-auth>
      <social-auth type="linkedin"></social-auth>
  `
})
export class LoginForm  {

  f: ControlGroup
  serverError: string
  submitted: boolean = false

  constructor(public appState:AppState, private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.f = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      rememberMe: ['']
    })
  }

  onSubmit(form) {
    this.submitted = true
    this.serverError = ''
    if(!this.f.valid)
      return

    this.authService.login(this.f.controls['username'].value, this.f.controls['password'].value, this.f.controls['rememberMe'].value)
      .then(user => {
        this.router.navigateByUrl('/home')
      }, error => {
        this.serverError = error['_body']
        //this.f.controls['password'].value = ''
        console.log('login error',error)
      })
  }
}

@Component({
  selector: 'register-form',
  template: `
    <form [ngFormModel]="f" (ngSubmit)="onSubmit()" autocomplete="off">
        <md-input
          ngControl="username" placeholder="Username" autofocus #username="ngForm">
        </md-input>
        <div *ngIf="!username.valid && submitted" class="error-msg">Please enter a valid username</div>
        <md-input
          ngControl="email" placeholder="Email" autofocus #email="ngForm">
        </md-input>
        <div *ngIf="!email.valid && submitted" class="error-msg">Please enter a valid email</div>
        <md-input
          ngControl="password" placeholder="Password" type="password" #password="ngForm">
        </md-input>
        <div *ngIf="!password.valid && submitted" class="error-msg">Password must be at least 6 characters</div>
        <md-input
          ngControl="passwordRepeat" placeholder="Repeat password" type="password" #passwordRepeat="ngForm">
        </md-input>
        <div *ngIf="f.hasError('passwordMismatch') && submitted" class="error-msg">Passwords must match</div>
        <div *ngIf="serverError" class="error-msg">{{serverError}}</div>
        <br/>
        <button md-raised-button color="primary">Register</button>
      </form>
  `
})
export class RegisterForm  {

  f: ControlGroup
  serverError: string
  submitted: boolean = false

  constructor(public appState:AppState, private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.f = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, CustomValidators.emailValidator])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordRepeat: [''],
    }, {validator: this.passwordsMatch})
  }

  onSubmit(form) {
    this.submitted = true
    this.serverError = ''
    if(!this.f.valid)
      return
    console.debug('submitting register form', this.f.controls['email'].value)
    this.authService.register(this.f.controls['username'].value, this.f.controls['email'].value, this.f.controls['password'].value)
      .then(user => {
        this.router.navigateByUrl('/home')
      }, error => {
        this.serverError = error['_body']
        //this.f.controls['password'].value = ''
        console.log('error',error)
      })
  }

  passwordsMatch(form: ControlGroup): { [s: string]: boolean } {
    if(form.controls['password'].value === form.controls['passwordRepeat'].value) {
      return null
    }
    return {passwordMismatch:true}
  }

}



@Component({
  selector: 'reset-password-init',
  template: `
    <div *ngIf="!emailSent">
      <form [ngFormModel]="f" (ngSubmit)="onSubmit()" autocomplete="off">
        <md-input
          ngControl="email" placeholder="Email" autofocus #email="ngForm">
        </md-input>
        <div *ngIf="!email.valid && submitted" class="error-msg">A valid email is required</div>
        <br/>
        <div *ngIf="serverError" class="error-msg">{{serverError}}</div>
        <br/>
        <button md-raised-button color="primary">Reset Password</button>
      </form>
    </div>
    <div *ngIf="emailSent">An email has been sent with a link to reset your password</div>
  `
})
export class ResetPasswordInit  {

  f: ControlGroup
  serverError: string
  submitted: boolean = false
  emailSent: boolean = false

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {}

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

    this.authService.resetPassword(this.f.controls['email'].value)
      .then(success => {
        this.emailSent = true
      }, error => {
        this.serverError = error['_body']
        console.log('login error',error)
      })
  }
}




// TODO Forgot password, Reset password, Confirm email

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'login',  // <login></login>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  // We need to tell Angular's compiler which directives are in our template.
  // Doing so will allow Angular to attach our behavior to an element
  directives: [LoginForm, RegisterForm, ResetPasswordInit],
  // We need to tell Angular's compiler which custom pipes are in our template.
  pipes: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styles: [require('./login.css')],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: require('./login.html')
})
export class Login {
  // Set our default values
  credentials = {email: '', password: ''}

  constructor(public appState:AppState) {
  }

  ngOnInit() {
  }

  login(value) {
    console.log('submitState', value)
    this.appState.set('value', value)
    this.credentials = {email: '', password: ''}
  }

}
