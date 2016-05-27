import {Injectable} from '@angular/core';

// TODO update to be more like <jhipster>/src/main/webapp/app/services/auth/auth.jwt.service.js
@Injectable()
export class LocalJWT {

  private jwt:string

  parseJWT(jwt: string): any {
    var jwtDecoded = null;

    if (typeof jwt !== 'undefined' && jwt !== 'undefined' && jwt !== '') {
      var jwtDecode = require('jwt-decode');
      try { jwtDecoded = jwtDecode(jwt); } catch(e) { jwtDecoded = null; }
    }

    return jwtDecoded;
  }

  fetchJWT(): string {
    var jwt = localStorage.getItem('jwt');
    if (typeof jwt !== 'undefined' && jwt !== 'undefined' && jwt !== '') {
      return jwt;
    }
  return null;
  }

  saveJWT(idToken: string): void {
    localStorage.setItem('jwt', idToken);
  }

  removeJWT(): void {
    localStorage.removeItem('jwt');
  }
}
