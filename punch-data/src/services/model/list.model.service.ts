import {List} from '../../common/interfaces/interfaces';
import {Injectable} from 'angular2/core';
import {Endpoint} from '../../services/interfaces/interfaces';
import {ModelService} from './_model.service';
import {Observable} from 'rxjs/Observable';
import {ListApiService} from './api/list.api.service';

@Injectable()
export class ListModelService extends ModelService {
  /**
   * Registers the observer with public `observer$` property.
   * Then the components, for example, 'ConversationListComponent',
   *   consumes this observer for listening to Model changes.
   */
  observer$:Observable<Array<List>>;

  /**
   * Reference to available API endpoints from kind-specific API service.
   * Used with the base class to factory-out endpoints for each CRUD operation.
   */
  protected _APIEndpoints:Endpoint;

  /**
   * The private observer holder, stores the observer for later use.
   */
  protected _observer:any;

  /**
   * The private data store, stores the retrieved messages for later use.
   */
  protected _dataStore:List[] = [];

  /**
   * The CandidateModel service constructor function, invokes the base Model.
   */
  constructor(_api:ListApiService) {
    super(_api);
  }

  /**
   * Invokes the query API method.
   */
  query(params: any = {}): void {
    this._api.query(params);
  }
}
