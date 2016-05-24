// App
import {LocalJWT} from "../services/local-jwt/local-jwt";
export * from './app.component';
export * from './app.service';

import { AppState } from './app.service';
import {ServerService} from "../services/server/index";
import {AuthService} from "../services/auth/index";

// Application wide providers
export const APP_PROVIDERS = [
  AppState, ServerService, LocalJWT, AuthService
];
