import {User} from '../../interfaces/interfaces';
import {Injectable} from 'angular2/core';
import {Endpoint} from '../../services/interfaces/interfaces';
import {ModelService} from './_model.service';
import {UserApiService} from './api/user.api.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserModelService extends ModelService {
  /**
   * Registers the observer with public `observer$` property.
   * Then the components, for example, 'ConversationListComponent',
   *   consumes this observer for listening to Model changes.
   */
  observer$:Observable<Array<User>>;

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
  protected _dataStore:User[] = [];

  /**
   * The UserModel service constructor function, invokes the base Model.
   */
  constructor(protected _api:UserApiService) {
    super(_api);
  }
}
