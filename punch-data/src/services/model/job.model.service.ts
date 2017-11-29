import {Job} from '../../common/interfaces/interfaces';
import {Injectable} from 'angular2/core';
import {Endpoint} from '../interfaces/interfaces';
import {ModelService} from './_model.service';
import {JobApiService} from './api/job.api.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class JobModelService extends ModelService {
  /**
   * Registers the observer with public `observer$` property.
   * Then the components, for example, 'ConversationListComponent',
   *   consumes this observer for listening to Model changes.
   */
  observer$:Observable<Array<Job>>;

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
  protected _dataStore:Job[] = [];

  /**
   * The JobModel service constructor function, invokes the base Model.
   */
  constructor(_api:JobApiService) {
    super(_api);
  }

  /**
   * Invokes the query API method.
   */
  query(params: any = {}): void {
    this._api.query(params);
  }
}
