import {Proposal} from '../../interfaces/proposals/proposal.interface';
import {Injectable} from 'angular2/core';
import {Endpoint} from '../../services/interfaces/interfaces';
import {ModelService} from './_model.service';
import {ProposalApiService} from './api/proposal.api.service';
import {Observable} from 'rxjs/Observable';
import {ObjectUtils} from '../../../utils/index';
import {BreakdownTable} from '../../interfaces/proposals/breakdown-table.interface';
import {Insert} from '../../interfaces/proposals/insert.interface';
import {CONFIG} from '../../config/config';

@Injectable()
export class ProposalModelService extends ModelService {
  /**
   * Registers the observer with public `observer$` property.
   * Then the components, for example, 'ConversationListComponent',
   *   consumes this observer for listening to Model changes.
   */
  observer$:Observable<Array<Proposal>>;

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
  protected _dataStore:Proposal[] = [];

  /**
   * The CandidateModel service constructor function, invokes the base Model.
   */
  constructor(_api:ProposalApiService) {
    super(_api);
  }

  /**
   * Initialization for new empty candidate
   * @returns {any}
   */
  fresh():Promise<any> {
    let proposal = <Proposal>{};
    proposal.name = '';
    proposal.overview = CONFIG.PROPOSAL_PREMADE_STRINGS.overview;
    proposal.scope_of_work = CONFIG.PROPOSAL_PREMADE_STRINGS.scope;
    proposal.inserts = [<Insert>{}];
    proposal.breakdown = {
      title: 'Breakdown',
      summary: CONFIG.PROPOSAL_PREMADE_STRINGS.breakdown,
      tables : [<BreakdownTable>{}]
    };
    proposal.timeline = {
      title: 'Timeline',
      summary: '',
      tables : [<BreakdownTable>{}]
    };
    proposal.steps = {
      title: 'Steps',
      summary: '',
      list: []
    };

    return Promise.resolve(proposal);
  }

  /**
   * Submits the proposal using
   * @param proposal
   * @param formType
   */
  submit(proposal: Proposal, formType: string):void {
    let objectToSend = proposal;
    ObjectUtils.forEach(proposal, (value, key) => {
      if (!Array.isArray(value) && !value.lastModified && typeof value === 'object')
        value = JSON.stringify(value);
      if(Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' )
        value = JSON.stringify(value);
      objectToSend[key] =  value;
    });
    let stringObject = JSON.stringify(objectToSend);
    formType === 'add' ? this.create(stringObject) : this.update(stringObject);
  }
}
