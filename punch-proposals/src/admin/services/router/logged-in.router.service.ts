import { ElementRef, DynamicComponentLoader, Directive, Attribute } from 'angular2/core';
import { Router, RouterOutlet, ComponentInstruction } from 'angular2/router';
import { AuthInfoService } from '../auth/auth.info.service';
import {CONFIG} from '../../config/config';
import {ArrayUtils} from '../../../utils/array.utils';

/**
 * When Angular loads the component of the route the RouterOutlet’s
 * activate function is called with the actual Instruction. The
 * Instruction describes information for the router how to transition
 * to the next component. From it we can extract the current url
 * and based on it redirect the user when trying to access a
 * restricted page without logging in.
 */
@Directive({
  selector: 'auth-router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
  private router:Router;

  /**
   *
   * @param _elementRef
   * @param _loader
   * @param _parentRouter
   * @param nameAttr
   * @param _authInfoService
   */
  constructor(_elementRef:ElementRef, _loader:DynamicComponentLoader,
              _parentRouter:Router, @Attribute('name') nameAttr:string,
              private _authInfoService:AuthInfoService) {
    super(_elementRef, _loader, _parentRouter, nameAttr);
    this.router = _parentRouter;
  }

  /**
   * Activate the desired url if user is allowed to see it
   * @param instruction
   * @returns {any|void}
   */
  activate(instruction:ComponentInstruction):any {
    if (this._canActivate(instruction.urlPath)) {
      return super.activate(instruction);
    }

    this.router.navigate(['Login']);
  }

  /**
   * Can activate if url starts with any public route or if
   * user is logged in
   * @param url
   * @returns {boolean}
   * @private
   */
  private _canActivate(url:string) {
    return ArrayUtils.any(CONFIG.PUBLIC_ROUTES, (route:string) => url.startsWith(route))
      || this._authInfoService.isLoggedIn();
  }
}
