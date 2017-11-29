import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';
import {CONFIG} from '../../config/config';
import {AuthInfoService} from '../../services/auth/auth.info.service';
import {LocalStorageService} from '../../services/storage/storage.service';
import {UserModelService} from '../../services/model/user.model.service';

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
   * @param _router
   * @param _authInfoService
   * @param _localStorageService
   * @param _userModelService
   */
  constructor(
      private _router:Router,
      private _authInfoService:AuthInfoService,
      private _localStorageService:LocalStorageService,
      private _userModelService:UserModelService) {
    this.currentUser = this._localStorageService.get(CONFIG.STORAGE_KEYS.CURRENT_USER);
    this._subscribe();
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
    if (section === 'ListsList' && currentComponentName === 'ListsListComponent') {
      return true;
    }
    if (section === 'JobsList' && currentComponentName === 'JobsListComponent') {
      return true;
    }
    if (section === 'CompaniesList' && currentComponentName === 'CompaniesListComponent') {
      return true;
    }
    if (section === 'BusinessesList' && currentComponentName === 'BusinessesListComponent') {
      return true;
    }
    return false;
  }

  /**
   * Redirects to 'My Account' in accounts module.
   */
  openAccount():void {
    window.location.href = CONFIG.PRODUCTS.PUNCH_ACCOUNTS+'/account';
  }

  /**
   * Redirects to 'Subscription' in accounts module.
   */
  openSubscription():void {
    window.location.href = CONFIG.PRODUCTS.PUNCH_ACCOUNTS+'/subscription';
  }

  /**
   * Log out the current user
   */
  logOut():void {
    this._userModelService.logout();
  }

  /**
   * Default listener to the observable.
   */
  private _subscribe() {
    this._userModelService.subscribe(() => {
      this._authInfoService.clearSession();
      window.location.href = CONFIG.PRODUCTS.PUNCH_ACCOUNTS;
    }, err => {
      console.log('Error logging out: ', err);
    });
  }
}
