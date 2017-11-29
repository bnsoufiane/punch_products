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
    verify: {uri: 'users/verify/', verb: 'get'},
    logout: {uri: 'users/logout', verb: 'get'}
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
  observer$:Observable<Array<any>> = new Observable(observer =>
    this._observer = observer).share();

  /**
   * The User API service constructor function, invoked by base classes.
   */
  constructor(
    protected _http:HttpService) {
    super(_http);
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
