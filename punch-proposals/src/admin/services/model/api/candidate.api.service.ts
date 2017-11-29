import {Injectable} from 'angular2/core';
import {Endpoint} from '../../interfaces/interfaces';
import {ApiService} from './_api.service';
import {Observable} from 'rxjs/Observable';
import {HttpService} from '../../http/http.service';


@Injectable()
export class CandidateApiService extends ApiService {
  /**
   * The kind-specific endpionts list.
   * For example, 'candidates:create'
   */
  endpoints: Endpoint = {
    list: {uri: 'candidates/', verb: 'get'},
    multiPartCreate: {uri: 'candidates/', verb: 'post'},
    multiPartUpdate: {uri: 'candidates/', verb: 'put'},
    view: {uri: 'candidates/', verb: 'get'},
    destroy: {uri: 'candidates/', verb: 'delete'}
  };

  /**
   * The kind-specific error endpoint.
   * Used with the base API class to register error handlers.
   */
  err: string = 'candidates:error';

  /**
   * The kind-specific string.
   * For example, 'messages'
   */
  kind: string = 'candidates';

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
}
