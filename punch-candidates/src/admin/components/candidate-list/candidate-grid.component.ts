import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Candidate, Role} from '../../interfaces/interfaces';
import {CONFIG} from '../../config/config';
import {CANDIDATE_FILTER_PIPES} from '../../pipes/candidate-filters.pipe';
import {RoleTextPipe} from '../../pipes/role-text.pipe';
import {PaginatePipe} from 'ng2-pagination';
import {IPaginationInstance} from 'ng2-pagination';
import {DateUtils} from '../../../utils/index';
import {ListPaginationComponent} from '../list-controls/list-pagination.component';

@Component({
  selector: 'ar-candidate-grid',
  moduleId: module.id,
  templateUrl: './candidate-grid.component.html',
  directives: [ListPaginationComponent],
  pipes: [RoleTextPipe, CANDIDATE_FILTER_PIPES, PaginatePipe],
})
export class CandidateGridComponent {
  @Output() viewCandidateClicked = new EventEmitter<string>();
  @Output() editCandidateClicked = new EventEmitter<string>();
  @Input('candidates') candidates:Candidate[] = [];
  @Input('roles') roles:Role[] = [];
  @Input('filters') filters = {query:'', role:''};
  currentPage:IPaginationInstance = {
    id: 'custom',
    itemsPerPage: CONFIG.PAGINATION.ITEMS,
    currentPage: 1
  };
  /**
   * @param id
   */
  onViewCandidate(id:string) {
    this.viewCandidateClicked.emit(id);
  }
  /**
   * @param id
   */
  onEditCandidate(id:string) {
    this.editCandidateClicked.emit(id);
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
