import {Injectable} from 'angular2/core';
import {LocalStorageService} from '../storage/storage.service';
import {CONFIG} from '../../config/config';
import {Headers} from 'angular2/http';
import {HttpService} from '../http/http.service';
import {UserApiService} from '../model/api/user.api.service';
import {Observable} from 'rxjs/Observable';
import {Router} from 'angular2/router';
import {AuthInfoService} from './auth.info.service';

@Injectable()
export class AuthService {

  /**
   *
   * @param _localStorageService
   * @param router
   * @param _httpService
   * @param _userApiService
   * @param _authInfoService
   */
  constructor(
    private _localStorageService:LocalStorageService,
    private router:Router,
    private _httpService:HttpService,
    private _userApiService:UserApiService,
    private _authInfoService:AuthInfoService) {
  }

  /**
   * Login the user by username and password
   * @param username
   * @param password
   * @returns {Observable<R>}
   */
  login(username, password):Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._httpService
      .post(
        this._userApiService.endpoints.login.uri,
        JSON.stringify({username, password}),
        {headers}
      )
      .map(res => {
        if (res.user) {
          this._localStorageService.set(CONFIG.STORAGE_KEYS.AUTH_TOKEN, res.token);
          this._localStorageService.set(CONFIG.STORAGE_KEYS.CURRENT_USER, res.user);
        }
        return this._authInfoService.isLoggedIn();
      });
  }

  /**
   * Logouts the user by clearing the tokens
   */
  logOut():void {
    let authToken = this._authInfoService.getAuthBearer();
    let headers = new Headers();
    headers.append('Authorization', authToken);
    this._httpService.get(
      this._userApiService.endpoints.logout.uri,
      {headers}
    ).subscribe(response => {
      this._localStorageService.clear(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      this._localStorageService.clear(CONFIG.STORAGE_KEYS.CURRENT_USER);
      window.location.href = CONFIG.PRODUCTS.PUNCH_ACCOUNTS;
    });
  }


  /**
   * Handles the incomming request, redirects if necessary.
   * @param {string} authToken
   * @returns {Observable<any>}
   */
  handleSession(authToken: string): Observable<any> {
    if(!authToken) {
      window.location.href = CONFIG.PRODUCTS.PUNCH_ACCOUNTS;
      return null;
    }

    authToken = `Bearer ${authToken}`;

    let headers = new Headers();
    headers.append('Authorization', authToken);
    return this._httpService.get(
      this._userApiService.endpoints.verify.uri,
      {headers}
    );
  }


  getCurrentUser() {
    let headers = new Headers();
    let authToken = this._localStorageService.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    headers.append('Authorization', `Bearer ${authToken}`);
    console.log(headers);

    return this._httpService
      .get('http://localhost:3000/users/current', {headers: headers})
      .subscribe(data => {
        console.log('SUCCESS', data);
      }, err => {
        console.log('ERROR', err);
      });
  }
}
