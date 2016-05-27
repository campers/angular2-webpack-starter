import {Directive, Attribute, ViewContainerRef, DynamicComponentLoader} from '@angular/core';
import {Router, RouterOutlet, ComponentInstruction} from '@angular/router-deprecated';
import {AuthService} from "../../services/auth/index";
import {Log} from "../../services/log/log.service";

@Directive({
  selector: 'auth-router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
  publicRoutes: any;
  private parentRouter: Router;

  constructor(_viewContainerRef: ViewContainerRef, _loader: DynamicComponentLoader,
              _parentRouter: Router, @Attribute('name') nameAttr: string,
              private authService: AuthService, private log: Log) {
    super(_viewContainerRef, _loader, _parentRouter, nameAttr);

    this.parentRouter = _parentRouter;
    // The Boolean following each route below
    // denotes whether the route requires authentication to view
    this.publicRoutes = {
      'login': true,
      'signup': true,
      // resetPassword flow
      // contact
    };
  }

  activate(instruction: ComponentInstruction) {
    let url = instruction.urlPath;
    this.log.debug('activating', url)

    if(this.authService.isAuthenticated()) {

      //if(!this.authService.isActivated()) {
      //  this.parentRouter.navigateByUrl('/activate-account');
      //}

    } else if (!this.publicRoutes[url]) {
      this.log.debug('redirecting to login')
      this.parentRouter.navigateByUrl('/login');
    }

    return super.activate(instruction);
  }
}
