import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';
import {CONFIG} from '../../config/config';
import {LocalStorageService} from '../../services/storage/storage.service';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'ar-header',
  moduleId: module.id,
  templateUrl: 'header.component.html',
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, DROPDOWN_DIRECTIVES],
  styleUrls: ['../../common/stylesheets/components/navbar.css']
})
export class HeaderComponent {
  /**
   * Current logged in user
   */
  protected currentUser;

  /**
   *
   * @param _authService
   * @param _localStorageService
   */
  constructor(
      private _router:Router,
      private _authService:AuthService,
      private _localStorageService:LocalStorageService) {
    this.currentUser = this._localStorageService.get(CONFIG.STORAGE_KEYS.CURRENT_USER);
  }

  /**
   * Safely get the username of logged in user
   * @returns {any|string}
   */
  getCurrentUserName() {
    return this.currentUser && this.currentUser.username || '';
  }

  /**
   * returns true/false if the passed section ('Home', 'Proposals', others to be added if needed) is active (one of its routes is active)
   * @returns {boolean}
   */
  isActive(section:string) {
    let currentComponentName = this._router.hostComponent.name;
    return currentComponentName.includes(section);
  }

  /**
   * Log out the current user
   */
  logOut():void {
    this._authService.logOut();
  }
}
