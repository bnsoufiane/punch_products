import {Injectable} from 'angular2/core';
import {Endpoint} from '../../services/interfaces/interfaces';
import {Role} from '../../interfaces/interfaces';
import {ModelService} from './_model.service';
import {RoleApiService} from './api/role.api.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RoleModelService extends ModelService {
  /**
   * Registers the observer with public `observer$` property.
   * Then the components, for example, 'ConversationListComponent',
   *   consumes this observer for listening to Model changes.
   */
  observer$: Observable<Array<Role>>;

  /**
   * Reference to available API endpoints from kind-specific API service.
   * Used with the base class to factory-out endpoints for each CRUD operation.
   */
  protected _APIEndpoints : Endpoint;

  /**
   * The private observer holder, stores the observer for later use.
   */
  protected _observer: any;

  /**
   * The private data store, stores the retrieved messages for later use.
   */
  protected _dataStore: Role[] = [];

  /**
   * The RoleModel service constructor function, invokes the base Model.
   */
  constructor(_api: RoleApiService) {
    super(_api);
  }
}
