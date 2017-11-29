import {ApiService} from './model/api/_api.service';
import {ModelService} from './model/_model.service';
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
import {JobModelService} from './model/job.model.service';
import {JobApiService} from './model/api/job.api.service';
import {ListModelService} from './model/list.model.service';
import {ListApiService} from './model/api/list.api.service';
import {CompanyModelService} from './model/company.model.service';
import {CompanyApiService} from './model/api/company.api.service';
import {BusinessModelService} from './model/business.model.service';
import {BusinessApiService} from './model/api/business.api.service';
import {ScrollSpyService} from 'ng2-scrollspy';
import {ExportCSVService} from './export/export-csv.service';

export const SERVICE_PROVIDERS:any[] = [
  ApiService,
  ModelService,
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
  JobModelService,
  JobApiService,
  ListModelService,
  ListApiService,
  CompanyModelService,
  CompanyApiService,
  BusinessModelService,
  BusinessApiService,
  ScrollSpyService,
  ExportCSVService
];
