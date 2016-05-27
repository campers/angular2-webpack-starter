/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { RouteConfig, Router } from '@angular/router-deprecated';

import { AppState } from './app.service';
import { Login } from './login';
import { Home } from './home';
import { RouterActive } from './router-active';
import { AuthService } from "../services/auth/index";
import { ActivateAccount } from "./account/activate/index";

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  pipes: [ ],
  providers: [ ],
  directives: [ RouterActive ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    require('normalize.css'),
    require('./app.css')
  ],
  template: `
    <md-content>
      <md-toolbar color="primary">
          <span>{{ name }}</span>
          <span class="fill"></span>
          <button md-button router-active [routerLink]=" ['Index'] ">
            Index
          </button>
          <button md-button router-active [routerLink]=" ['Home'] ">
            Home
          </button>
          <button *ngIf="authService.isAuthenticated()" md-button router-active [routerLink]=" ['About'] ">
            About
          </button>
          <button *ngIf="!authService.isAuthenticated()" md-button router-active [routerLink]=" ['Login'] ">
            Login
          </button>
          <button *ngIf="authService.isAuthenticated()" (click)="logout()" md-button>
            Logout
          </button>

      </md-toolbar>

      <md-progress-bar mode="indeterminate" color="primary" *ngIf="loading"></md-progress-bar>

      <auth-router-outlet></auth-router-outlet>

      <footer>
        Kava by <a [href]="url">AppOrchestra</a>
      </footer>
      </md-content>
  `
})
@RouteConfig([
  { path: '/login',  name: 'Login',  component: Login, useAsDefault: true  },
  { path: '/',      name: 'Index', component: Home},
  { path: '/home',  name: 'Home',  component: Home },
  { path: '/activate',  name: 'Activate',  component: ActivateAccount },
  // Async load a component using Webpack's require with es6-promise-loader and webpack `require`
  { path: '/about', name: 'About', loader: () => require('es6-promise!./about')('About') }
])
export class App {
  loading = false;
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  constructor(
    public appState: AppState, public authService: AuthService, private router: Router) {

  }

  private logout() {
    this.authService.logout()
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
    this.authService.getLoggedOutEvent().subscribe(() => this.router.navigate(['Login']))
  }

}
