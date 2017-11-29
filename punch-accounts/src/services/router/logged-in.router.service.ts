import {ElementRef, DynamicComponentLoader, Directive, Attribute} from 'angular2/core';
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';
import {AuthInfoService} from '../auth/auth.info.service';
import {AuthService} from '../auth/auth.service';
import {CONFIG} from '../../config/config';

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
  private _router:Router;

  /**
   *
   * @param _elementRef
   * @param _loader
   * @param _parentRouter
   * @param nameAttr
   * @param _authInfoService
   * @param _authService
   */
  constructor(_elementRef:ElementRef, _loader:DynamicComponentLoader,
              _parentRouter:Router, @Attribute('name') nameAttr:string,
              private _authInfoService:AuthInfoService,
              private _authService:AuthService) {
    super(_elementRef, _loader, _parentRouter, nameAttr);
    this._router = _parentRouter;
  }

  /**
   * Activate the desired url if user is allowed to see it
   * @param instruction
   * @returns {any|void}
   */
  activate(instruction:ComponentInstruction):any {
    let observer = this._authService.handleSession();
    if(observer) {
      observer.subscribe(res => {
        if (res.user) {
          this._authInfoService.setCurrentUser(res.user);
        }
        if (instruction.routeName === 'Login') {
          let token = this._authInfoService.getAuthToken();
          window.location.href = CONFIG.PRODUCTS.PUNCH_DATA + `?auth=${token}`;
        } else super.activate(instruction);
      }, err => {
        this._authInfoService.clearSession();
        console.log('ins', instruction);
        if (CONFIG.PUBLIC_ROUTES.indexOf(instruction.routeName) !== -1) {
          super.activate(instruction);
        } else this._router.navigate(['Login']);
      });
    } else {
      if (CONFIG.PUBLIC_ROUTES.indexOf(instruction.routeName) !== -1) {
        super.activate(instruction);
      } else this._router.navigate(['Login']);
    }
  }
}
