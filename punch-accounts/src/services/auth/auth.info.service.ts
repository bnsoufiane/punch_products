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
    return authToken ? `Bearer ${authToken}` : undefined;
  }

  /**
   * Get headers with bearer token
   */
  getAuthHeaders():Headers | {} {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    if (!this.isLoggedIn()) return headers;

    headers.append('Authorization', this.getAuthBearer());
    return headers;
  }

  /**
   * Gets the locally stored user.
   */
  getCurrentUser() {
    return this._localStorageService.get(CONFIG.STORAGE_KEYS.CURRENT_USER);
  }

  /**
   * Flag to check login status
   * @returns {boolean}
   */
  isLoggedIn():boolean {
    //TODO(hhsadiq): replace this flag with the one which I should set at user logs in (for security)
    return !!this._localStorageService.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Sets the current user.
   * @param {Object<any>} user
   */
  setCurrentUser(user) {
    this._localStorageService.set(CONFIG.STORAGE_KEYS.CURRENT_USER, user);
  }

  /**
   * Sets the auth token.
   * @param {String} authToken
   */
  setAuthToken(authToken: String) {
    this._localStorageService.set(CONFIG.STORAGE_KEYS.AUTH_TOKEN, authToken);
  }

  /**
   * Clears session data.
   */
  clearSession() {
    this._localStorageService.clear(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    this._localStorageService.clear(CONFIG.STORAGE_KEYS.CURRENT_USER);
  }

}
