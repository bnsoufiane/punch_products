import {Injectable} from 'angular2/core';
import {Endpoint} from '../../interfaces/interfaces';
import {ApiService} from './_api.service';
import {Observable} from 'rxjs/Observable';
import {HttpService} from '../../http/http.service';


@Injectable()
export class ProposalApiService extends ApiService {
  /**
   * The kind-specific endpionts list.
   * For example, 'proposals:create'
   */
  endpoints: Endpoint = {
    list: {uri: 'proposals/', verb: 'get'},
    create: {uri: 'proposals/', verb: 'post'},
    update: {uri: 'proposals/', verb: 'put'},
    view: {uri: 'proposals/', verb: 'get'},
    destroy: {uri: 'proposals/', verb: 'delete'}
  };

  /**
   * The kind-specific error endpoint.
   * Used with the base API class to register error handlers.
   */
  err: string = 'proposals:error';

  /**
   * The kind-specific string.
   * For example, 'messages'
   */
  kind: string = 'proposals';

  /**
   * Registers the observer with public `observer$` property.
   * Then the kind-specific model service, for example, 'ProposalModel',
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
