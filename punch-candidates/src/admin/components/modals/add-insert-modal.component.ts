import {Component, Input, Output, EventEmitter, ViewEncapsulation} from 'angular2/core';
import {PaginatePipe, IPaginationInstance} from 'ng2-pagination';
import {ListPaginationComponent} from '../list-controls/list-pagination.component';
import {ListSearchComponent} from '../list-controls/list-search.component';
import {Insert} from '../../interfaces/proposals/insert.interface';
import {InsertQueryFilterPipe} from '../../pipes/insert-query-filter';
import {ExcerptPipe} from '../../pipes/excerpt.pipe';
import {CONFIG} from '../../config/config';

/**
 * Shows the confirmation modal dialog with yes or no option
 */
@Component({
  selector: 'ar-add-insert-modal',
  moduleId: module.id,
  templateUrl: 'add-insert-modal.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/components/modal.css', '../../../css/admin/assets/stylesheets/components/list.css'],
  directives: [ListPaginationComponent, ListSearchComponent],
  pipes: [PaginatePipe, InsertQueryFilterPipe, ExcerptPipe],
  encapsulation: ViewEncapsulation.None
})
export class AddInsertModalComponent {
  @Input() showModal:boolean = false;
  @Output() closed = new EventEmitter<boolean>();
  @Output() insertAdded = new EventEmitter<Insert>();

  inserts:Insert[] = CONFIG.INSERTS;

  currentPage:IPaginationInstance = {
    id: 'insertsPagination',
    itemsPerPage: 10,
    currentPage: 1
  };

  /**
   * Closes the modal with action confirmed
   * @Param element
   * @returns {boolean}
   */
  protected addInsert(element:Insert):boolean {
    this.showModal = false;
    this.closed.emit(true);
    this.insertAdded.emit(element);
    return false;
  }

  /**
   * Closes the modal with action canceled
   * @returns {boolean}
   */
  protected cancelAction():boolean {
    this.showModal = false;
    this.closed.emit(false);
    return false;
  }
}
