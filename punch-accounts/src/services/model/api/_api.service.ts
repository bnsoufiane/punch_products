import {Injectable} from 'angular2/core';
import {HttpService} from '../../http/http.service';
import {Observable} from 'rxjs/Observable';
import {ApiServiceInterface} from '../../interfaces/interfaces';
import 'rxjs/add/operator/share';

@Injectable()
export class ApiService implements ApiServiceInterface {
  /**
   * The kind-specific endpionts list.
   * For example, 'messages:create'.
   */
  endpoints:any;

  /**
   * The kind-specific error endpoint.
   * For example, 'messages:error'.
   */
  err:string;

  /**
   * The kind-specific model key.
   * For example, 'messages'.
   */
  kind:string;

  /**
   * The public observer, used with `subscribe` from `model`
   *     kind-specific classes.
   */
  observer$:Observable<Array<any>>;

  /**
   * The private observer holder, stores the observer for later use.
   */
  protected _observer:any;

  /**
   * The API service constructor function, invoked by child classes.
   */
  constructor(protected _httpService:HttpService) {
  }

  /**
   * Registers error handlers with the socket service.
   * All kinds have a generic catch-all error handler.
   */
  //registerErrors(): void {
  //  this._httpService.registerError(this.err, this.receivedError.bind(this));
  //}

  /**
   * The error event handler.
   */
  //receivedError(err: any): void {
  //  alert(JSON.stringify(err));
  //}

  /**
   * The Base API List method. Invokes the API to list resources.
   * Emits to the socket server the kind-specific *list* event.
   * For overrides call super() then add kind-specific logic in the child class.
   */
  list(params:any = {}):void {
    this._httpService.get(this.endpoints.list.uri, params)
      .subscribe(data => this._observer.next(data),
        err => this._observer.error(err));
  }

  /**
   * The Base API List method. Invokes the API to list resources.
   * Emits to the socket server the kind-specific *view* event.
   * For overrides call super() then add kind-specific logic in the child class.
   */
  view(id:any, params:any = {}):void {
    this._httpService.get(this.endpoints.view.uri.concat(id), params)
      .subscribe(data => this._observer.next(data),
        err => this._observer.error(err));
  }

  /**
   * The Base API Create method. Invokes the API to create a new resource.
   * Emits to the kind-specific *create* event.
   * For overrides call super() then add kind-specific logic in the child class.
   */
  create(obj:any):void {
    this._httpService.post(this.endpoints.create.uri, obj)
      .subscribe(data => this._observer.next(data),
        err => this._observer.error(err));
  }

  /**
   * The base API create method which uses multi part.
   * @param formData
   */
  multiPartCreate(formData:FormData):void {
    this._httpService.multiPartPost(this.endpoints.multiPartCreate.uri, formData)
      .then(data => this._observer.next(data))
      .catch(err => this._observer.error(err));
  }
  /**
   * The base API create method which uses multi part.
   * @param formData
   */
  multiPartUpdate(formData:FormData):void {
    this._httpService.multiPartPut(this.endpoints.multiPartUpdate.uri, formData)
      .then(data => this._observer.next(data))
      .catch(err => this._observer.error(err));
  }

  /**
   * The Base API Update method. Invokes the API to update a resource.
   * Emits to the socket server the kind-specific *update* event.
   * For overrides call super() then add kind-specific logic in the child class.
   */
  update(obj:any):void {
    this._httpService.put(this.endpoints.update.uri, JSON.stringify(obj))
      .subscribe(data => this._observer.next(data),
        err => this._observer.error(err));
  }

  /**
   * The Base API Destroy method.
   * Invokes the API to permanently destroy resource.
   * Emits to the socket server the kind-specific *destroy* event.
   * For overrides call super() then add kind-specific logic in the child class.
   */
  destroy(id:any, params:any = {}):void {
    this._httpService.destroy(this.endpoints.destroy.uri.concat(id), params)
      .subscribe(data => this._observer.next(data),
        err => this._observer.error(err));
  }

  /**
   * The Base API Received *destroy* event.
   * Event handler when the API service 'destroy:<kind>' is received.
   */
  receivedDestroy():void {
    //Add implementation
  }
}
