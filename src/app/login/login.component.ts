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

@Directive({})
@Component({
  selector: 'login-form',
  directives: [MD_INPUT_DIRECTIVES,...[SocialAuth, GoogleAuth]],
  //pipes: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styles: [require('./login.css')],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: `
    <form [ngFormModel]="f" (ngSubmit)="onSubmit()" autocomplete="off">
        <md-input
          ngControl="username" placeholder="Username" autofocus #username="ngForm">
        </md-input>
        <div *ngIf="!username.valid">Username is required</div>
        <br/>
        <md-input
          ngControl="password" placeholder="Password" type="password" #password="ngForm">
        </md-input>
        <div *ngIf="!password.valid">Password is required</div>
        <br/>
        <md-checkbox ngControl="rememberMe" #rememberMe="ngForm">Remember Me</md-checkbox>
        <br/>
        <div *ngIf="serverError">{{serverError}}</div>
        <br/>
        <button [disabled]="!f.valid" md-raised-button color="primary">Login</button>
      </form>
      <google-auth></google-auth>
      <social-auth type="google"></social-auth>
      <social-auth type="facebook"></social-auth>
      <social-auth type="linkedin"></social-auth>
  `
})
export class LoginForm  {

  f: ControlGroup
  serverError: string

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
    this.serverError = ''
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

@Directive({})
@Component({
  selector: 'register-form',
  //directives: [MD_INPUT_DIRECTIVES],
  //pipes: [],
  styles: [require('./login.css')],
  template: `
    <form [ngFormModel]="f" (ngSubmit)="onSubmit()" autocomplete="off">
        <md-input
          ngControl="username" placeholder="Username" autofocus #username="ngForm">
        </md-input>
        <div *ngIf="!username.valid">Please enter a valid username</div>
        <br/>
        <md-input
          ngControl="email" placeholder="Email" autofocus #email="ngForm">
        </md-input>
        <div *ngIf="!email.valid">Please enter a valid email</div>
        <br/>
        <md-input
          ngControl="password" placeholder="Password" type="password" #password="ngForm">
        </md-input>
        <div *ngIf="!password.valid">Password must be at least 6 characters</div>
        <br/>
        <md-input
          ngControl="passwordRepeat" placeholder="Password" type="password" #passwordRepeat="ngForm">
        </md-input>
        <div *ngIf="f.hasError('passwordMismatch')">Passwords must match</div>
        <br/>
        <div *ngIf="serverError">{{serverError}}</div>
        <br/>
        <button [disabled]="!f.valid" md-raised-button color="primary">Register</button>
      </form>
  `
})
export class RegisterForm  {

  f: ControlGroup
  serverError: string

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
    this.serverError = ''
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


// TODO Forgot password, Reset password, Confirm email

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'login',  // <login></login>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  // We need to tell Angular's compiler which directives are in our template.
  // Doing so will allow Angular to attach our behavior to an element
  directives: [LoginForm, RegisterForm],
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
