import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Endpoint, ApiServiceInterface} from '../interfaces/interfaces';
import {ApiService} from './api/_api.service';
import 'rxjs/add/operator/share';



@Injectable()
export class ModelService {
  /**
   * Registers the kind-specific observer with public `observer$` property.
   * Then the components, for example, 'ConversationListComponent',
   *   consumes this observer for listening to Model changes.
   */
  observer$: Observable<Array<{}>>;

  /**
   * Reference to available API endpoints from kind-specific API service.
   * Used with the child class to factory-out endpoints for each CRUD operation.
   */
  protected _APIEndpoints : Endpoint;

  /**
   * The private observer holder, stores the observer for later use.
   */
  protected _observer: any;

 /**
  * The private data store, stores the retrieved objects for later use.
  */
  protected _dataStore: any[] = [];

  protected _api: ApiServiceInterface;

  /**
   * The Base Model service constructor function, invoked by child classes.
   */
  constructor(_api?:ApiService) {
    if (_api) {
      this._api = _api;
      this.setAPIEndpoints();
      this.setObserver();
      this.setObserverSubscriber();
    }
  }

  /**
   * Sets the API Endpoints property.
   * Required to be invoked by base class so that the injected API service
   *   is used by the base class and injected by the compiler.
   */
  setAPIEndpoints(): void {
    this._APIEndpoints = this._api.endpoints;
  }

  /**
   * Sets the kind-specific observer.
   * The observer watches for changes on the object and disseminates those
   *     changes to all subscribers of the observer.
   */
  setObserver(): void {
    this.observer$ = new Observable( observer => {
      this._observer = observer; }).share();
  }

  /**
   * Sets the API service subscriber here.
   * When changes are emitted from the server, those kind-specific
   *     implementation changes should be handled by the base class.
   */
  setObserverSubscriber(): void {
    this._api.observer$.subscribe(receivedObjects => {
      if (receivedObjects) {
        this._dataStore = receivedObjects;
        if (this._observer) {
          this._observer.next(receivedObjects);
         }
      }
    }, err => {
      console.log('_model.service', err);
      if (this._observer) {
        this._observer.error(err);
      }
    });
  }

  /**
   * The kind-specific model service base *list* method.
   * Invokes the kind-specific API *list* method.
   */
  list(params: any = {}): void {
    this._api.list(params);
  }
  /**
   * The kind-specific model service base *list* method.
   * Invokes the kind-specific API *list* method.
   */
  view(id:any, params: any = {}): void {
    this._api.view(id, params);
  }

  /**
   * The kind-specific model service base *create* method.
   * Invokes the kind-specific API *create* method.
   */
  create(obj: any): void {
    return this._api.create(obj);
  }

  /**
   * The kind-specific model service base *create* method.
   * Invokes the kind-specific API *create* method.
   */
  multiPartCreate(formData: FormData): void {
    return this._api.multiPartCreate(formData);
  }

  /**
   * The kind-specific model service base *update* method.
   * Invokes the kind-specific API *update* method.
   */
  update(obj: any): void {
    return this._api.update(obj);
  }
  /**
   * The kind-specific model service base *update* method.
   * Invokes the kind-specific API *update* method.
   */
  multiPartUpdate(formData: FormData): void {
    return this._api.multiPartUpdate(formData);
  }

  /**
   * The kind-specific model service base *destroy* method.
   * Invokes the kind-specific API *destroy* method.
   */
  destroy(id:any, params: any = {}): void {
    this._api.destroy(id, params);
  }
}
