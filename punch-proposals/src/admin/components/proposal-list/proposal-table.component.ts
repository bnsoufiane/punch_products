import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Proposal} from '../../interfaces/proposals/proposal.interface';
import {CONFIG} from '../../config/config';
import {PaginatePipe} from 'ng2-pagination';
import {ProposalQueryFilterPipe} from '../../pipes/proposal-query-filter.pipe';
import {IPaginationInstance} from 'ng2-pagination';
import {ListPaginationComponent} from '../list-controls/list-pagination.component';
import {DateUtils} from '../../../utils/date.utils';

@Component({
  selector: 'ar-proposal-table',
  moduleId: module.id,
  templateUrl: './proposal-table.component.html',
  directives: [ListPaginationComponent],
  pipes: [ProposalQueryFilterPipe, PaginatePipe],
})
export class ProposalTableComponent {
  @Output() viewProposalClicked = new EventEmitter<string>();
  @Output() editProposalClicked = new EventEmitter<string>();
  @Input('proposals') proposals:Proposal[] = [];
  @Input('query') query = '';
  currentPage:IPaginationInstance = {
    id: 'proposalTable',
    itemsPerPage: CONFIG.PAGINATION.ITEMS,
    currentPage: 1
  };

  /**
   * @param id
   */
  onViewProposal(id:string) {
    this.viewProposalClicked.emit(id);
  }
  /**
   * @param id
   */
  onEditProposal(id:string) {
    this.editProposalClicked.emit(id);
  }

  /**
   * Display the date
   * @param date
   * @returns {string}
   */
  standardDate(date:Date):string {
    return DateUtils.standardDate(date);
  }

}
