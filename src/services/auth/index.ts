import { Injectable, Component, provide } from '@angular/core';
import { ServerService } from '../server/index';
import {LocalJWT} from "../local-jwt/local-jwt";


@Injectable()
@Component({
  providers: [ServerService, LocalJWT],
})
export class AuthService {

  constructor(private serverService: ServerService, private jwt: LocalJWT) {}

  public isAuthenticated(): boolean {

    return this.jwt.;
  }


  public login(username: string, password: string): Promise<any> {

    return this.serverService.postP('/authenticate', {username: username, password: password})
      .then(response => {
        console.log('authenticate response', response)
        this.jwt.saveJWT(response['id_token'])
      })
    //return new Promise((resolve, reject) => {
    //  return this.serverService.post('/auth/login',
    //    {username: username, password: password})
    //    .map((response: any) => response.meta)
    //    .subscribe(
    //      user => resolve(user),
    //      err => reject({username, password})
    //    );
    //});
  }

  public social(type: string, scope: string, csrf: string): Promise<any> {

    return this.serverService.postP('/social/' + type, {scope: scope, _csrf: csrf})
      .then(response => {
        console.log('social authenticate response', response)
        this.jwt.saveJWT(response['id_token'])
      })
    //return new Promise((resolve, reject) => {
    //  return this.serverService.post('/auth/login',
    //    {username: username, password: password})
    //    .map((response: any) => response.meta)
    //    .subscribe(
    //      user => resolve(user),
    //      err => reject({username, password})
    //    );
    //});
  }

  public register(username: string, email: string, password: string): Promise<any> {

    return this.serverService.postP('/register', {login: username, email:email, password: password})
      .then(response => {
        this.jwt.saveJWT(response['id_token'])
      })

    //return new Promise((resolve, reject) => {
    //  return this.serverService.post('/auth/register',
    //    {username: username, password: password})
    //    .map((response: any) => response.meta)
    //    .subscribe(
    //      (user) => resolve(user),
    //      err => reject({username, password})
    //    );
    //});
  }
}

