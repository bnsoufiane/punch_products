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

  /**
   * Subscribes with given handlers.
   */
  subscribe(success: any, error: any) {
    this._api.resetObserver();
    this._api.observer$.subscribe(success, error);
  }

  /**
   * Signs a user up.
   */
  signup(payload) {
    return this._api.signup(payload);
  }

  /**
   * Requests api for email confirmation.
   */
  confirm(token) {
    return this._api.confirm(token);
  }

  /**
   * Updates user's password.
   */
  updatePassword(payload) {
    return this._api.updatePassword(payload);
  }

  /**
   * Updates user's avatar.
   */
  updateAvatar(avatar) {
    let formData = new FormData();
    formData.append('file', avatar);
    return this._api.updateAvatar(formData);
  }

  /**
   * Gets google oauth url.
   */
  getGoogleAuth() {
    this._api.getGoogleAuth();
  }

  /**
   * Gets linkedin oauth url.
   */
  getLinkedInAuth() {
    this._api.getLinkedinAuth();
  }

  /**
   * Connects user to google.
   */
  connectToGoogle(code: string) {
    this._api.connectToGoogle(JSON.stringify({code}));
  }

  /**
   * Connects user to liknedin.
   */
  connectToLinkedin(code: string) {
    this._api.connectToLinkedin(JSON.stringify({code}));
  }

  /**
   * Logs the user out.
   */
  logout() {
    this._api.logout();
  }

}
