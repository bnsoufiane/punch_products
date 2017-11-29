import {Injectable} from 'angular2/core';
import {Endpoint} from '../../interfaces/interfaces';
import {ApiService} from './_api.service';
import {Observable} from 'rxjs/Observable';
import {HttpService} from '../../http/http.service';


@Injectable()
export class CompanyApiService extends ApiService {
  /**
   * The kind-specific endpionts list.
   * For example, 'companies:list'
   */
  endpoints: Endpoint = {
    list: {uri: 'companies/', verb: 'get'}
  };

  /**
   * The kind-specific error endpoint.
   * Used with the base API class to register error handlers.
   */
  err: string = 'companies:error';

  /**
   * The kind-specific string.
   * For example, 'messages'
   */
  kind: string = 'companies';

  /**
   * Registers the observer with public `observer$` property.
   * Then the kind-specific model service, for example, 'CandidateModel',
   * consumes this observer for listening to API changes.
   */
  observer$: Observable<Array<any>> = new Observable(observer =>
    this._observer = observer).share();

  /**
   * The Company API service constructor function, invoked by base classes.
   */
  constructor(protected _http: HttpService) {
    super(_http);
  }
}
