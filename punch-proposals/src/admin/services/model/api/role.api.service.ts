import {Injectable} from 'angular2/core';
import {Endpoint} from '../../interfaces/interfaces';
import {ApiService} from './_api.service';
import {Observable} from 'rxjs/Observable';
import {HttpService} from '../../http/http.service';


@Injectable()
export class RoleApiService extends ApiService {
  /**
   * The kind-specific endpionts list.
   * For example, 'roles:create'
   */
  endpoints: Endpoint = {
    list: {uri: 'roles/', verb: 'get'}
  };

  /**
   * The kind-specific error endpoint.
   * Used with the base API class to register error handlers.
   */
  err: string = 'roles:error';

  /**
   * The kind-specific string.
   * For example, 'messages'
   */
  kind: string = 'roles';

  /**
   * Registers the observer with public `observer$` property.
   * Then the kind-specific model service, for example, 'RoleModel',
   * consumes this observer for listening to API changes.
   */
  observer$: Observable<Array<any>> = new Observable(observer =>
    this._observer = observer).share();

  /**
   * The Role API service constructor function, invoked by base classes.
   */
  constructor(protected _http: HttpService) {
    super(_http);
  }
}
