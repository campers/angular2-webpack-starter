// App
import {LocalJWT} from "../services/local-jwt/local-jwt";
export * from './app.component';
export * from './app.service';

import { AppState } from './app.service';
import {ServerService} from "../services/server/index";
import {AuthService} from "../services/auth/index";
import {Log} from "../services/log/log.service";
import {JwtHelper} from "angular2-jwt/angular2-jwt";

// Application wide providers
export const APP_PROVIDERS = [
  Log, AppState, ServerService, LocalJWT, AuthService, JwtHelper
];
// TODO LocalJWT only needs to be visible by AuthService
