import {ApiService} from './model/api/_api.service';
import {ModelService} from './model/_model.service';
import {RoleApiService} from './model/api/role.api.service';
import {RoleModelService} from './model/role.model.service';
import {CandidateModelService} from './model/candidate.model.service';
import {CandidateApiService} from './model/api/candidate.api.service';
import {ProposalModelService} from './model/proposal.model.service';
import {ProposalApiService} from './model/api/proposal.api.service';
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
import {CompanyModelService} from './model/company.model.service';
import {CompanyApiService} from './model/api/company.api.service';
import {ScrollSpyService} from 'ng2-scrollspy';
import {ExportCSVService} from './export/export-csv.service';

export const SERVICE_PROVIDERS:any[] = [
  ApiService,
  ModelService,
  RoleApiService,
  RoleModelService,
  UserModelService,
  UserApiService,
  CandidateModelService,
  CandidateApiService,
  ProposalModelService,
  ProposalApiService,
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
  CompanyModelService,
  CompanyApiService,
  ScrollSpyService,
  ExportCSVService
];
