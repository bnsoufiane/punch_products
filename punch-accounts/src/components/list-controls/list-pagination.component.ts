import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {CONFIG} from '../../config/config';
import {PaginationControlsCmp, IPaginationInstance} from 'ng2-pagination';

@Component({
  selector: 'ar-list-pagination',
  moduleId: module.id,
  templateUrl: './list-pagination.component.html',
  directives: [PaginationControlsCmp]
})
export class ListPaginationComponent {
  /**
   * Pagination configuration object
   * @type {{id: string, itemsPerPage: number, currentPage: number}}
   */
  @Input() config:IPaginationInstance = {
    id: 'custom',
    itemsPerPage: CONFIG.PAGINATION.ITEMS,
    currentPage: 1
  };
  @Output() pageChanged = new EventEmitter<IPaginationInstance>();

  onPageChanged(currentPage:number) {
    this.config.currentPage = currentPage;
    this.pageChanged.emit(this.config);
  }
}
