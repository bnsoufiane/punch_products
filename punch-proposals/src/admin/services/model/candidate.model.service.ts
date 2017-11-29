import {Candidate, Company, Skillset} from '../../interfaces/interfaces';
import {Injectable} from 'angular2/core';
import {Endpoint} from '../../services/interfaces/interfaces';
import {ModelService} from './_model.service';
import {CandidateApiService} from './api/candidate.api.service';
import {Observable} from 'rxjs/Observable';
import {DateUtils} from '../../../utils/index';
import * as _ from 'lodash';
import {ObjectUtils} from '../../../utils/index';

@Injectable()
export class CandidateModelService extends ModelService {
  /**
   * Registers the observer with public `observer$` property.
   * Then the components, for example, 'ConversationListComponent',
   *   consumes this observer for listening to Model changes.
   */
  observer$:Observable<Array<Candidate>>;

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
  protected _dataStore:Candidate[] = [];

  /**
   * The CandidateModel service constructor function, invokes the base Model.
   */
  constructor(_api:CandidateApiService) {
    super(_api);
  }

  /**
   * Initialization for new empty candidate
   * @returns {any}
   */
  fresh():Promise<any> {
    let candidate = <Candidate>{};
    candidate.pastCompanies = [
      <Company>
        {
          workStartMonth: 0,
          workStartYear: 0,
          workEndMonth: 0,
          workEndYear: 0
        },
      <Company>
      {
        workStartMonth: 0,
        workStartYear: 0,
        workEndMonth: 0,
        workEndYear: 0
      },
      <Company>
        {
          workStartMonth: 0,
          workStartYear: 0,
          workEndMonth: 0,
          workEndYear: 0
        }
    ];
    candidate.skillset = [<Skillset>{}, <Skillset>{}, <Skillset>{},
      <Skillset>{}, <Skillset>{}, <Skillset>{}];
    candidate.roles = [];
    return Promise.resolve(candidate);
  }

  /**
   * Date used in generating dropdowns for
   * start and end dates of previous company
   */
  date():Promise<any> {
    let date = {
      MONTHS: DateUtils.listOfMonths(),
      YEARS: _.range(1980, +DateUtils.today('YYYY') + 1)
    };
    console.log(date);
    return Promise.resolve(date);
  }

  /**
   * Uploads the candidate using multipart
   * @param candidate
   * @param formType
   */
  upload(candidate: Candidate, formType: string):void {
    let formData = new FormData();
    ObjectUtils.forEach(candidate, (value, key) => {
      if (!value.lastModified && typeof value === 'object')
        value = JSON.stringify(value);
      formData.append(key, value);
    });
    formType === 'add' ?
      this.multiPartCreate(formData) : this.multiPartUpdate(formData);
  }
}
