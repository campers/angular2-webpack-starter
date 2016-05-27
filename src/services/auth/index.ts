import { Injectable, Component, EventEmitter, provide } from '@angular/core';
import { ServerService } from '../server/index';
import {LocalJWT} from "../local-jwt/local-jwt";
import {Log} from "../log/log.service";
import {JwtHelper} from "angular2-jwt/angular2-jwt";
import {tokenNotExpired} from "angular2-jwt/angular2-jwt";


@Injectable()
@Component({
  //providers: [LocalJWT, JwtHelper,tokenNotExpired],

})
export class AuthService {

  private userLoggedOut = new EventEmitter<any>()
  private jwtHelper: JwtHelper = new JwtHelper()

  constructor(private serverService: ServerService, private jwt: LocalJWT, private log:Log) {}


  public isAuthenticated(): boolean {

    let jwt = this.jwt.fetchJWT()
    if(!jwt) {
      this.log.info('AuthService: No JWT token')
      return false
    }

    const expired = this.jwtHelper.isTokenExpired(jwt)
    if(expired) {
      this.log.info('AuthService: JWT has expired')
      return false
    }

    return true
  }

  public getLoggedOutEvent() {
    return this.userLoggedOut
  }

  public activateAccount(key) {
    return this.serverService.postP('/activate', {key: key})
  }

  public login(username: string, password: string, rememberMe: boolean): Promise<any> {
    return this.serverService.postP('/authenticate', {username: username, password: password, rememberMe: rememberMe})
      .then(response => {
        this.log.debug('authenticate response', response)
        // TODO if rememberMe store in localStorage, else store in sessionStorage. Check both when getting the jwt, and clear both on logout
        this.jwt.saveJWT(response['id_token'])
      })
  }

  public logout() {
    this.log.debug('logout()')
    this.jwt.removeJWT()
    this.userLoggedOut.emit(null)
  }

  public social(type: string, scope: string, csrf: string): Promise<any> {

    return this.serverService.postP('/social/' + type, {scope: scope, _csrf: csrf})
      .then(response => {
        console.log('social authenticate response', response)
        this.jwt.saveJWT(response['id_token'])
      })
  }

  public register(username: string, email: string, password: string): Promise<any> {

    return this.serverService.postP('/register', {login: username, email:email, password: password})
      .then(response => {
        this.jwt.saveJWT(response['id_token'])
      })
  }
}


