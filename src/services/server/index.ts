import { Injectable, provide } from '@angular/core'
import {Http, Request, Response, Headers} from '@angular/http'
import 'rxjs/add/operator/map'

const HEADERS = new Headers({ 'Content-Type': 'application/json' })// 'Accept', 'application/json'


/**
 * Components should use the IServerService interface so implementation can set the BASE_URL. This way if
 * a components functionality is split off into a new micro-service then just the BASE_URL needs to be updated
 * for that service.
 */
export interface IServerService {
  post(path: string, data, headers?: any)
  postP(path: string, data, headers?: any): Promise<any>
  get(path)
  put(path, id, data)
  delete(path, id)
}

@Injectable()
export class ServerService implements IServerService {

  private BASE_URL = 'http://localhost:8080/api'

  constructor(private _http: Http) {}

  public post(path: string, data, headers?: any) {
    return this._http.post(this.BASE_URL + path, JSON.stringify(data),
      { headers: HEADERS})
     .map((res: Response) => res.json())
  }

  public postP(path: string, data, headers?: any) {
    return new Promise((resolve, reject) => {
     this.post(path, data)
        .subscribe(
          user => resolve(user),
          err => reject(err)
        );
    });
  }

  public get(path) {
    return this._http.get(this.BASE_URL + path)
    .map((res: Response) => res.json())
  }

  public put(path, id, data) {
    return this._http.put(this.BASE_URL + path + '/' + id, data)
    .map((res: Response) => res.json())
  }

  public delete(path, id) {
    return this._http.delete(this.BASE_URL + path + '/' + id)
  }
}
