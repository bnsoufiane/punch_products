import {Injectable} from 'angular2/core';
import {LocalStorageService} from '../storage/storage.service';
import {CONFIG} from '../../config/config';
import {Headers} from 'angular2/http';

/**
 * Why we need to make a separate class for auth info => to break the cyclic dependency
 * Read this great article
 * http://misko.hevery.com/2008/08/01/circular-dependency-in-constructors-and-dependency-injection/
 */
@Injectable()
export class AuthInfoService {

  /**
   *
   * @param _localStorageService
   */
  constructor(private _localStorageService:LocalStorageService) {
  }

  /**
   * Get auth token
   * @returns {Object}
   */
  getAuthToken() {
    return this._localStorageService.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Auth bearer
   * @returns {any}
   */
  getAuthBearer() {
    let authToken = this.getAuthToken();
    return `Bearer ${authToken}`;
  }

  /**
   * Get headers with bearer token
   */
  getAuthHeaders():Headers | {} {
    let headers = new Headers();
    headers.append('Authorization', this.getAuthBearer());
    headers.append('Content-Type', 'application/json');
    return this.isLoggedIn() ? headers : {};
  }

  /**
   * Flag to check login status
   * @returns {boolean}
   */
  isLoggedIn():boolean {
    //TODO(hhsadiq): replace this flag with the one which I should set at user logs in (for security)
    return !!this._localStorageService.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  }

}
