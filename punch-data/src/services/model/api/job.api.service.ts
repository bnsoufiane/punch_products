import {Injectable} from 'angular2/core';
import {Endpoint} from '../../interfaces/interfaces';
import {ApiService} from './_api.service';
import {Observable} from 'rxjs/Observable';
import {HttpService} from '../../http/http.service';


@Injectable()
export class JobApiService extends ApiService {
  /**
   * The kind-specific endpionts list.
   * For example, 'jobs:create'
   */
  endpoints: Endpoint = {
    list: {uri: 'jobs/', verb: 'get'},
    view: {uri: 'jobs/', verb: 'get'},
    query: {uri: 'jobs', verb: 'get'}
  };

  /**
   * The kind-specific error endpoint.
   * Used with the base API class to register error handlers.
   */
  err: string = 'jobs:error';

  /**
   * The kind-specific string.
   * For example, 'messages'
   */
  kind: string = 'jobs';

  /**
   * Registers the observer with public `observer$` property.
   * Then the kind-specific model service, for example, 'CandidateModel',
   * consumes this observer for listening to API changes.
   */
  observer$: Observable<Array<any>> = new Observable(observer =>
    this._observer = observer).share();

  /**
   * The Candidate API service constructor function, invoked by base classes.
   */
  constructor(protected _http: HttpService) {
    super(_http);
  }

  /**
   * The Base API query method. Invokes the API to query resources with query string
   */
  query(params:any = {}):void {
    let queryArray = [];
    let queryString = '';
    //Object to query string
    for (let key in params) {
      queryArray.push(key + '=' + params[key]);
    }

    queryString = queryArray.length > 0 ? '?' + queryArray.join('&') : '';
    this._httpService.get(this.endpoints.list.uri + queryString)
      .subscribe(data => this._observer.next(data),
        err => this._observer.error(err));
  }
}
