import {Component, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES, RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';
import {Candidate, Portfolio, BreakdownTable, Insert} from '../../interfaces/interfaces';
import {HeaderComponent} from '../wrapper/header.component';
import {EditableStringComponent} from '../reusable-components/editable-string.component';
import {SelectCandidateModalComponent} from '../modals/select-candidate-modal.component';
import {AddPortfolioModalComponent} from '../modals/add-portfolio-modal.component';
import {EditableTableComponent} from '../reusable-components/editable-table.component';
import {ConfirmationModalComponent} from '../modals/confirmation.modal.component';
import {AddInsertModalComponent} from '../modals/add-insert-modal.component';
import {TitleService} from '../../services/helper/title.service';
import {ProposalModelService} from '../../services/model/proposal.model.service';
import {CandidateModelService} from '../../services/model/candidate.model.service';
import {ArrayUtils} from '../../../utils/array.utils';
import {CONFIG} from '../../config/config';
import * as _ from 'lodash';
import {ToggleableSectionComponent} from '../reusable-components/toggleable-section.component';

@Component({
  selector: 'ar-add-proposal',
  moduleId: module.id,
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/pages/proposal-detail.css'],
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, HeaderComponent, EditableStringComponent,
    SelectCandidateModalComponent, AddPortfolioModalComponent, EditableTableComponent,
    ConfirmationModalComponent, AddInsertModalComponent, ToggleableSectionComponent]
})
export class ProposalDetailComponent implements OnInit, CanDeactivate {
  /**
   * Array of Candidate objects to hold candidates returned by API
   */
  protected candidates: Candidate[] = [];
  /**
   * Array of Portfolio objects to hold elements from CONFIG file
   */
  protected samples: Portfolio[] = CONFIG.PORTFOLIO_SAMPLES;
  /**
   * Array of Candidate objects to hold selected candidates for proposal
   */
  protected selectedCandidates: Candidate[] = [];
  /**
   * Array of Portfolio objects to hold selected samples for proposal
   */
  protected selectedSamples: Portfolio[] = [];
  /**
   * Array of Portfolio objects to hold selected samples for proposal
   */
  protected selectedInserts: Insert[] = [];
  /**
   * Flag for showing select candidate modal
   */
  protected showSelectCandidateModal:boolean = false;
  /**
   * Flag for showing select portfolio modal
   */
  protected showSelectPortfolioModal:boolean = false;
  /**
   * Flag for showing select portfolio modal
   */
  protected showAddInsertModal:boolean = false;
  /**
   * Flag for showing confirm modal
   */
  protected showConfirmModal:boolean = false;
  /**
   * Flag for showing delete confirm modal
   */
  protected showProposalDeleteConfirmModal:boolean = false;
  /**
   * Flag for showing exit page confirm modal
   */
  protected showDeleteInsertConfirmModal:boolean = false;
  /**
   * Flag for showing exit page confirm modal
   */
  protected showPageExitConfirmModal:boolean = false;
  /**
   * Promise resolve function for exit page confirm modal
   */
  protected exitResolvePromise:Function;
  /**
   * Array of BreakdownTable objects to hold tables for breakdown section
   */
  protected breakdownTables:BreakdownTable[] = [];
  /**
   * Array of BreakdownTable objects to hold tables for timeline section
   */
  protected timelineTables:BreakdownTable[] = [];
  /**
   * id for table to be deleted
   */
  protected tableToDelete:number = null;
  /**
   * type of table to be deleted
   */
  protected tableTypeToDelete:string = '';
  /**
   * id for insert to be deleted
   */
  protected insertToDelete:number = null;
  /**
   * Proposal Object
   */
  protected proposal:any = null;
  /**
   * proposal id from url
   */
  protected id:string = null;
  /**
   * Edit or Add
   */
  protected formType:string = null;
  /**
   * Page title
   */
  protected title:string = null;
  /**
   * Flag for when form is submitted
   */
  protected submitted:boolean = false;

  /**
   * Constructor
   * @param _candidateModelService
   * @param _proposalModelService
   * @param _params
   * @param _pageTitle
   * @param _router
   */
  constructor(private _candidateModelService:CandidateModelService,
              private _proposalModelService:ProposalModelService,
              private _params:RouteParams,
              private _pageTitle:TitleService,
              private _router:Router) {
    this.id = this._params.get('id');
    this.formType = _.isEmpty(this.id) ? 'add' : 'edit';
    this.title = `${_.upperFirst(this.formType)} Proposal`;
  }

  /**
   * Initial loading of data, setting page title
   */
  ngOnInit():void {
    this._pageTitle.setTitle(this.title);
    this._candidateModelService.observer$.subscribe(candidates => this.readyCandidates(candidates));
    this._subscribe();
    this._getData();

    //asking to confirm before closing window.
    window.onbeforeunload = this.onBeforeUnload;
  }

  /**
   * interrupts navigating out of the window to a different route, shows a confirm modal first
   * @param nextInstruction
   * @param prevInstruction
   * @returns {Promise<boolean>}
     */
  routerCanDeactivate(nextInstruction:ComponentInstruction, prevInstruction:ComponentInstruction):boolean|Promise<boolean> {
    if(this.submitted) {
      this.submitted = false;
      window.onbeforeunload = null;
      return true;
    } else {
      this.showPageExitConfirmModal = true;
    }

    return new Promise<boolean>(function(resolve) {
      this.exitResolvePromise = resolve;
    }.bind(this));
  }

  /**
   * confirm exit page action
   * @param confirmed
     */
  confirmExitPage(confirmed:boolean): void {
    this.showPageExitConfirmModal = false;
    if(confirmed)
      window.onbeforeunload = null;
    this.exitResolvePromise(confirmed);
  }

  /**
   * interrupt closing the window and show a confirm dialog box, should be affected to window.onbeforeunload
   * @param e
   * @returns {string}
     */
  onBeforeUnload(e: any) {
    let message:string = 'Are you sure you wanna exit this page?';
    e = e || window.event;

    if (e) {
      e.returnValue = message;
    }

    return message;
  }

  /**
  * Prepare candidates and fill in selectedCandidates Array
  * @param candidates
  */
  protected readyCandidates(candidates:Candidate[]):void {
    this.candidates = candidates;
    this.selectedCandidates = [];
    for(let candidate of this.candidates) {
      if(this.proposal.candidate_ids && this.proposal.candidate_ids.indexOf(candidate._id) !== -1)
        this.selectedCandidates.push(candidate);
    }
  }

  /**
   * submitting proposal object
   */
  protected onSubmit():void {
    if(this.submitted === true) {
      this.proposal.inserts = this.selectedInserts;
      this._proposalModelService.submit(this.proposal, this.formType);
    }
  }

  /**
   * updating selectedCandidates and proposal.candidate_ids
   * @param candidates
   */
  protected updateSelectedCandidates(candidates:Candidate[]):void {
    this.selectedCandidates = candidates;
    this.proposal.candidate_ids = [];
    for(let candidate of candidates) {
      this.proposal.candidate_ids.push(candidate._id);
    }
  }

  /**
   * updating selectedSamples and proposal.portfolio_ids
   * @param samples
   */
  protected updateSelectedSamples(samples:Portfolio[]):void {
    this.selectedSamples = samples;
    this.proposal.portfolio_ids = [];
    for(let sample of samples) {
      this.proposal.portfolio_ids.push(sample._id);
    }
  }

  /**
   * toggling show modal flag
   */
  protected toggleSelectCandidateModal():void {
    this.showSelectCandidateModal = !this.showSelectCandidateModal;
  }

  protected toggleSelectPortfolioModal():void {
    this.showSelectPortfolioModal = !this.showSelectPortfolioModal;
  }

  protected toggleAddInsertsModal():boolean {
    this.showAddInsertModal = !this.showAddInsertModal;
    return false;
  }

  /**
   * remove candidate from selectedCandidates and proposal.candidate_ids
   * @param candidate
   */
  protected removeCandidate(candidate:Candidate):void {
    ArrayUtils.remove(this.selectedCandidates, candidate);
    ArrayUtils.remove(this.proposal.candidate_ids, candidate._id);
  }

  /**
   * remove sample from selectedSamples and proposal.portfolio_ids
   * @param sample
   */
  protected removeSample(sample:Portfolio):void {
    ArrayUtils.remove(this.selectedSamples, sample);
    ArrayUtils.remove(this.proposal.portfolio_ids, sample._id);
  }

  /**
   * adding and empty breakdownTable to breakdownTables
   * @returns {boolean}
   */
  protected addBreakdownTable():boolean {
    let table = <BreakdownTable>{title:'', table: [{row: ['', '', '']}, {row: ['', '', '']}]};
    this.breakdownTables.push(table);
    return false;
  }
  /**
   * adding and empty breakdownTable to timelineTables
   * @returns {boolean}
   */
  protected addTimelineTable():boolean {
    let table = <BreakdownTable>{title:'', table: [{row: ['', '', '']}, {row: ['', '', '']}]};
    this.timelineTables.push(table);
    return false;
  }
  /**
   * adding and empty step
   * @returns {boolean}
   */
  protected addStep():boolean {
    if(!this.proposal.steps || !this.proposal.steps.list)
      this.proposal.steps = {summary:'', list:[]};
    this.proposal.steps.list.push({header:'', paragraph:''});
    return false;
  }

  /**
   * Remove step from list of steps
   * @param i
   * @returns {boolean}
     */
  removeStep(i:number):boolean {
    this.proposal.steps.list.splice(i, 1);
    return false;
  }

  /**
   * set tableToDelete variable and show deleteTableModal
   * @param i
   * @param type
   * @returns {boolean}
   */
  protected confirmDeleteTable(i:number, type:string):boolean {
    this.showConfirmModal = true;
    this.tableToDelete = i;
    if(type)
      this.tableTypeToDelete = type;
    return false;
  }

  /**
   * delete tableToDelete from breakdownTables
   * @param confirmed
   */
  protected confirmDeleteTableAction(confirmed:boolean):void {
    this.showConfirmModal = false;
    if (confirmed) {
      if(this.tableToDelete !== null) {
        if(this.tableTypeToDelete === 'timeline') {
          this.timelineTables.splice(this.tableToDelete, 1);
        } else {
          this.breakdownTables.splice(this.tableToDelete, 1);
        }
        this.tableToDelete = null;
        this.tableTypeToDelete = '';
      }
    }
  }

  /**
   * adding Insert
   * @param insert
   * @returns {boolean}
   */
  protected addInsert(insert:Insert):boolean {
    this.selectedInserts.push(<Insert> JSON.parse(JSON.stringify(insert)));
    return false;
  }

  /**
   * set tableToDelete variable and show deleteTableModal
   * @param i
   * @returns {boolean}
   */
  protected confirmDeleteInsert(i:number):boolean {
    this.showDeleteInsertConfirmModal = true;
    this.insertToDelete = i;
    return false;
  }

  /**
   * delete insertToDelete from selectedInserts
   * @param confirmed
   */
  protected confirmDeleteInsertAction(confirmed:boolean) {
    this.showDeleteInsertConfirmModal = false;
    if (confirmed) {
      if(this.insertToDelete !== null) {
        this.selectedInserts.splice(this.insertToDelete, 1);
        this.insertToDelete = null;
      }
    }
  }

  /**
   * update breakdownTables[index] with data coming from editable table
   * @param index
   * @param table
   */
  protected updateBreakdownTables(index:number, table:Array<string[]>):void {
    let breakdownTables = this.breakdownTables.slice(0);

    if(breakdownTables[index].title) {
      breakdownTables[index].table = [];
    } else {
      breakdownTables[index] = {title: '', table: []};
    }

    for(let i = 0; i < table.length; i++) {
      breakdownTables[index].table.push({row: table[i].slice(0)});
    }

    this.proposal.breakdown.tables = breakdownTables;
  }

  /**
   * update timelineTables[index] with data coming from editable table
   * @param index
   * @param table
   */
  protected updateTimelineTables(index:number, table:Array<string[]>):void {
    let breakdownTables = this.timelineTables.slice(0);

    if(breakdownTables[index].title) {
      breakdownTables[index].table = [];
    } else {
      breakdownTables[index] = {title: '', table: []};
    }

    for(let i = 0; i < table.length; i++) {
      breakdownTables[index].table.push({row: table[i].slice(0)});
    }

    this.proposal.timeline.tables = breakdownTables;
  }

  /**
   * update breakdownTables[i] title for proposal.breakdown
   * @param i
   * @param txt
   */
  protected updateBreakdownTableTitle(i:number, txt:string):void {
    this.breakdownTables[i].title = txt;
    this.proposal.breakdown.tables = this.breakdownTables;
  }
  /**
   * update timelineTables[i] title for proposal.timeline
   * @param i
   * @param txt
   */
  protected updateTimelineTableTitle(i:number, txt:string):void {
    this.timelineTables[i].title = txt;
    this.proposal.timeline.tables = this.timelineTables;
  }

  /**
   * get data from breakdownTable in the form of array of strings
   * @param breakdownTable
   * @returns {Array<string[]>}
   */
  protected getTableData(breakdownTable:BreakdownTable):Array<string[]> {
    let table:Array<string[]> = [];
    if(breakdownTable.table) {
      for(let row of breakdownTable.table) {
        table.push(row.row.slice(0));
      }
    }
    return table;
  }

  /**
   * Show modal window to confirm deletion of proposal
   */
  protected confirmDeleteProposal(): void {
    this.showProposalDeleteConfirmModal = true;
  }

  /**
   * Delete the proposal if confirmed
   * @param confirmed
   */
  protected confirmDeleteProposalAction(confirmed:boolean): void {
    this.showProposalDeleteConfirmModal = false;
    if (confirmed && this.proposal._id) {
      this.submitted = true;
      this._proposalModelService.destroy(this.proposal._id);
    }
  }

  /**
   * copies link for live proposal to clipboard
   */
  protected copyLiveURLToClipboard(): void {
    let temp = document.createElement('input');
    document.body.appendChild(temp);
    temp.value = window.location.href.replace('admin/proposal-detail', 'proposal-live');
    temp.select();
    document.execCommand('copy');
    temp.parentNode.removeChild(temp);
  }

  /**
   * checks if browser supports copying to clipboard
   * @returns {boolean}
     */
  protected canCopy(): boolean {
    return document.queryCommandSupported('copy');
  }

  /**
   * Get necessary data
   * @private
   */
  private _getData():void {
    if(this.id) {
      this._proposalModelService.view(this.id);
    } else {
      this._proposalModelService.fresh().then(proposal => this.proposal = proposal);
      this._candidateModelService.list();
    }
  }

  /**
   * Subscribe to necessary services
   * @private
   */
  private _subscribe() {
    this._proposalModelService.observer$.subscribe((proposal:any) => {
      console.log(proposal);
      this.proposal = proposal;

      if(!this.submitted) {
        this._candidateModelService.list();

        this.selectedInserts = [];
        if(proposal.inserts) {
          for(let insert of proposal.inserts) {
            this.selectedInserts.push(insert);
          }
        }

        this.selectedSamples = [];
        for(let sample of this.samples) {
          if(proposal.portfolio_ids && proposal.portfolio_ids.indexOf(sample._id) !== -1)
            this.selectedSamples.push(sample);
        }

        if(this.proposal.breakdown && this.proposal.breakdown.tables && this.proposal.breakdown.tables.length > 0) {
          this.breakdownTables = this.proposal.breakdown.tables;
        }
        if(this.proposal.timeline && this.proposal.timeline.tables && this.proposal.timeline.tables.length > 0) {
          this.timelineTables = this.proposal.timeline.tables;
        }
      } else {
        this._router.navigate(['Proposals']);
      }
    }, err => console.log('GOT error in component', err));
  }
}
