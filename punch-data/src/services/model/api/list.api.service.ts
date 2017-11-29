import {Injectable} from 'angular2/core';
import {Endpoint} from '../../interfaces/interfaces';
import {ApiService} from './_api.service';
import {Observable} from 'rxjs/Observable';
import {HttpService} from '../../http/http.service';


@Injectable()
export class ListApiService extends ApiService {
  /**
   * The kind-specific endpionts list.
   * For example, 'candidates:create'
   */
  endpoints: Endpoint = {
    list: {uri: 'lists/', verb: 'get'},
    create: {uri: 'lists/', verb: 'post'},
    update: {uri: 'lists/', verb: 'put'},
    view: {uri: 'lists/', verb: 'get'},
    destroy: {uri: 'lists/', verb: 'delete'},
    query: {uri: 'lists/user/', verb: 'get'}
  };

  /**
   * The kind-specific error endpoint.
   * Used with the base API class to register error handlers.
   */
  err: string = 'lists:error';

  /**
   * The kind-specific string.
   * For example, 'messages'
   */
  kind: string = 'lists';

  /**
   * Registers the observer with public `observer$` property.
   * Then the kind-specific model service, for example, 'CandidateModel',
   * consumes this observer for listening to API changes.
   */
  observer$: Observable<Array<any>> = new Observable(observer =>
    this._observer = observer).share();

  /**
   * The List API service constructor function, invoked by base classes.
   */
  constructor(protected _http: HttpService) {
    super(_http);
  }

  /**
   * The Base API query method. Invokes the API to query resources with query string
   */
  query(params:any = {}):void {
    params.userId = params.userId || '';
    this._httpService.get(this.endpoints.query.uri + params.userId)
      .subscribe(data => this._observer.next(data), err => this._observer.error(err));
  }
}
