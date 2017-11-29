import {Injectable} from 'angular2/core';
import {Endpoint} from '../../interfaces/interfaces';
import {ApiService} from './_api.service';
import {Observable} from 'rxjs/Observable';
import {HttpService} from '../../http/http.service';

@Injectable()
export class UserApiService extends ApiService {
  /**
   * The kind-specific endpionts list.
   * For example, 'candidates:create'
   */
  endpoints:Endpoint = {
    login: {uri: 'users/login/', verb: 'post'},
    signup: {uri: 'users/', verb: 'post'},
    confirm: {uri: 'users/confirm', verb: 'put'},
    verify: {uri: 'users/verify/', verb: 'get'},
    logout: {uri: 'users/logout', verb: 'get'},
    update: {uri: 'users', verb: 'put'},
    updatePassword: {uri: 'users/password', verb: 'put'},
    updateAvatar: {uri: 'users/avatar', verb: 'put'},
    authURL: {uri: 'users/auth', verb: 'get'},
    connect: {uri: 'users/auth', verb: 'post'}
  };

  /**
   * The kind-specific error endpoint.
   * Used with the base API class to register error handlers.
   */
  err:string = 'candidates:error';

  /**
   * The kind-specific string.
   * For example, 'messages'
   */
  kind:string = 'candidates';

  /**
   * Registers the observer with public `observer$` property.
   * Then the kind-specific model service, for example, 'UserModel',
   * consumes this observer for listening to API changes.
   */
  observer$:Observable<Array<any>>;

  /**
   * The User API service constructor function, invoked by base classes.
   */
  constructor(
    protected _http:HttpService) {
    super(_http);
    this.resetObserver();
  }

  /**
   * Resets the api's observers.
   */
  resetObserver() {
    this.observer$ = new Observable(observer =>
    this._observer = observer).share();
  }

  /**
   * Signs a user up.
   */
  signup(payload) {
    this._httpService.post(this.endpoints.signup.uri, JSON.stringify(payload))
    .subscribe(() => this._observer.next(),
      err => this._observer.error(err));
  }

  /**
   * Redeems email confirmation token.
   */
  confirm(token) {
    this._httpService.put(`${this.endpoints.confirm.uri}/${token}`, '')
    .subscribe(() => this._observer.next(),
      err => this._observer.error(err));
  }

  /**
   * Hits the endpoint to update user password.
   */
  updatePassword(payload) {
    this._httpService.put(this.endpoints.updatePassword.uri,
      JSON.stringify(payload))
    .subscribe(() => this._observer.next(),
      err => this._observer.error(err));
  }

  /**
   * Updates user's avatar.
   */
  updateAvatar(formData) {
    this._httpService.multiPartPut(this.endpoints.updateAvatar.uri, formData)
    .then(data => {
      if(data) data = JSON.parse(data);
      this._observer.next(data);
    })
    .catch(err => this._observer.error(err));
  }

  /**
   * Gets google oauth url.
   */
  getGoogleAuth() {
    this._httpService.get(this.endpoints.authURL.uri+'/google')
    .subscribe(data => this._observer.next(data),
      err => this._observer.error(err));
  }

  /**
   * Get linedin oauth url.
   */
  getLinkedinAuth() {
    this._httpService.get(this.endpoints.authURL.uri+'/linkedin')
    .subscribe(data => this._observer.next(data),
      err => this._observer.error(err));
  }

  /**
   * Connects current user to google.
   */
  connectToGoogle(payload: any) {
    this._httpService.post(this.endpoints.connect.uri+'/google', payload)
    .subscribe(data => this._observer.next(data),
      err => this._observer.error(err));
  }

  /**
   * Connects current user to linkedin.
   */
  connectToLinkedin(payload: any) {
    this._httpService.post(this.endpoints.connect.uri+'/linkedin', payload)
    .subscribe(data => this._observer.next(data),
      err => this._observer.error(err));
  }

  /**
   * Logs the user out.
   */
  logout() {
    this._httpService.get(this.endpoints.logout.uri)
    .subscribe(() => this._observer.next(),
      err => this._observer.error(err));
  }
}
