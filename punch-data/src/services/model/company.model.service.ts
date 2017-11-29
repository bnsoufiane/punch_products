import {CompanyDetail} from '../../common/interfaces/interfaces';
import {Injectable} from 'angular2/core';
import {Endpoint} from '../interfaces/interfaces';
import {ModelService} from './_model.service';
import {CompanyApiService} from './api/company.api.service';
import {Observable} from 'rxjs/Observable';
import {DateUtils} from '../../common/utils/date.utils';
import * as _ from 'lodash';
import {EditableCompany, KeyPeople} from '../../common/interfaces/interfaces';
import {companyEditableFields, keyPeopleEditableFields} from '../../config/config';

@Injectable()
export class CompanyModelService extends ModelService {
  /**
   * Registers the observer with public `observer$` property.
   * Then the components, for example, 'ConversationListComponent',
   *   consumes this observer for listening to Model changes.
   */
  observer$:Observable<Array<CompanyDetail>>;

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
  protected _dataStore:CompanyDetail[] = [];

  /**
   * The CompanyModel service constructor function, invokes the base Model.
   */
  constructor(_api:CompanyApiService) {
    super(_api);
  }

  /**
   * Date used in generating dropdowns for founded dates of companies
   * @returns {{MONTHS: string[], YEARS: any}}
   */
  date(startYear):any {
    return {
      MONTHS: DateUtils.listOfMonths(),
      YEARS: DateUtils.listofYearsFrom(startYear)
    };
  }

  /**
   * Returns a fresh/empty copy of editable keyPeople instance
   * @returns {any}
   */
  freshKeyPeople():KeyPeople {
    return _(keyPeopleEditableFields)
      .keyBy(field => field)
      .mapValues(value => '')
      .value();
  }
  /**
   * Returns a fresh/empty copy of editable company
   * @returns {EditableCompany}
   */
  freshEditable():EditableCompany {
    return _(companyEditableFields)
      .keyBy(field => field)
      .mapValues(value => value === 'keyPeople' ?
        _.fill(new Array(1), this.freshKeyPeople())
        : '')
      .value();
  }
}
