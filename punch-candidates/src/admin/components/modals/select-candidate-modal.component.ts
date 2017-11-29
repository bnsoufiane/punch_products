import {
  Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChange,
  OnInit} from 'angular2/core';
import {CANDIDATE_FILTER_PIPES} from '../../pipes/candidate-filters.pipe';
import {RoleTextPipe} from '../../pipes/role-text.pipe';
import {PaginatePipe} from 'ng2-pagination';
import {IPaginationInstance} from 'ng2-pagination';
import {Candidate, Role} from '../../interfaces/interfaces';
import {ListPaginationComponent} from '../list-controls/list-pagination.component';
import {ListSearchComponent} from '../list-controls/list-search.component';
import {ListDropdownFilterComponent} from '../list-controls/list-dropdown-filter.component';
import {ArrayUtils} from '../../../utils/array.utils';
import {RoleModelService} from '../../services/model/role.model.service';

/**
 * Shows the confirmation modal dialog with yes or no option
 */
@Component({
  selector: 'ar-select-candidate-modal',
  moduleId: module.id,
  templateUrl: 'select-candidate-modal.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/components/modal.css', '../../../css/admin/assets/stylesheets/components/list.css'],
  directives: [ListPaginationComponent, ListSearchComponent, ListDropdownFilterComponent],
  pipes: [RoleTextPipe, CANDIDATE_FILTER_PIPES, PaginatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class SelectCandidateModalComponent implements OnInit, OnChanges {
  @Input() candidates:Candidate[] = [];
  @Input() selectedCandidates:Candidate[] = [];
  @Input() showModal:boolean = false;
  @Input() positiveLabel:string = 'Add Candidates';
  @Output() closed = new EventEmitter<boolean>();
  @Output() selectionFinished = new EventEmitter<Candidate[]>();

  roles:Role[] = [];

  temporarySelection:Candidate[] = [];
  candidatesPerPage = 6;
  currentPage:IPaginationInstance = {
    id: 'candidatesList',
    itemsPerPage: this.candidatesPerPage,
    currentPage: 1
  };

  constructor(private _roleModelService:RoleModelService) {
  }

  ngOnInit() {
    this._roleModelService.observer$.subscribe(roles => this.roles = roles );
    this.getData_();
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    for (let propName in changes) {
      if(propName === 'showModal') {
        let prop = changes[propName];
        if(prop.currentValue === true) {
          this.temporarySelection = this.selectedCandidates.slice();
        }
        return;
      }
    }
  }

  /**
   * Get all required data for component
   * @private
   */
  getData_() {
    this.listRoles();
  }

  /**
   * Initiate the model service to load roles
   */
  listRoles() {
    this._roleModelService.list();
  }

  toggleSelected(candidate:Candidate) {
    if(this.temporarySelection.indexOf(candidate) !== -1) {
      ArrayUtils.remove(this.temporarySelection, candidate);
    } else {
      this.temporarySelection.push(candidate);
    }
  }

  isSelected(candidate:Candidate):boolean {
    return (this.temporarySelection.indexOf(candidate) !== -1);
  }

  /**
   * Closes the modal with action confirmed
   * @returns {boolean}
   */
  positiveAction():boolean {
    this.showModal = false;
    this.closed.emit(true);
    this.selectedCandidates = this.temporarySelection.slice();
    this.selectionFinished.emit(this.temporarySelection);
    return false;
  }

  /**
   * Closes the modal with action canceled
   * @returns {boolean}
   */
  cancelAction():boolean {
    this.showModal = false;
    this.closed.emit(false);
    return false;
  }
}
