import {ApiService} from './model/api/_api.service';
import {ModelService} from './model/_model.service';
import {RoleApiService} from './model/api/role.api.service';
import {UserModelService} from './model/user.model.service';
import {UserApiService} from './model/api/user.api.service';
import {LocalStorageService} from './storage/storage.service';
import {SessionStorageService} from './storage/storage.service';
import {AuthService} from './auth/auth.service';
import {AuthInfoService} from './auth/auth.info.service';
import {HttpService} from './http/http.service';
import {HTTP_PROVIDERS} from 'angular2/http';
import {PaginationService} from 'ng2-pagination';
import {TitleService} from './helper/title.service';
import {ScrollSpyService} from 'ng2-scrollspy';
import {ExportCSVService} from './export/export-csv.service';

export const SERVICE_PROVIDERS:any[] = [
  ApiService,
  ModelService,
  RoleApiService,
  UserModelService,
  UserApiService,
  LocalStorageService,
  SessionStorageService,
  AuthService,
  AuthInfoService,
  HttpService,
  HTTP_PROVIDERS,
  PaginationService,
  TitleService,
  ScrollSpyService,
  ExportCSVService
];
