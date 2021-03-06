import {Observable} from 'rxjs/Observable';

export interface HttpUri {
  uri: string;
  verb: string;
}

export interface Endpoint {
  list?: HttpUri;
  create?: HttpUri;
  multiPartCreate?: HttpUri;
  multiPartUpdate?: HttpUri;
  update?: HttpUri;
  destroy?: HttpUri;
  logout?: HttpUri;
  login?: HttpUri;
  signup?: HttpUri;
  confirm?: HttpUri;
  verify?: HttpUri;
  view?: HttpUri;
  query?: HttpUri;
  updatePassword?: HttpUri;
  updateAvatar?: HttpUri;
  authURL?: HttpUri;
  connect?: HttpUri;
}

export interface AuthToken {
  token: string;
}

export interface ApiServiceInterface {
  endpoints: Endpoint;
  observer$: Observable<Array<any>>;
  list?(obj: any) : void;
  create?(obj: any) : void;
  multiPartCreate?(formData: FormData): void;
  multiPartUpdate?(formData: FormData): void;
  update?(obj: any) : void;
  destroy?(id:any, obj: any): void;
  view?(id:any, obj: any): void;
  query?(params:any):void;
}

export interface Token {
  token: string;
  type: string;
  expireAt: Date;
}
