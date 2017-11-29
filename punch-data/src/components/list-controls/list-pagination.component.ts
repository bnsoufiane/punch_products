import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {CONFIG} from '../../config/config';
import {PaginationControlsCmp, IPaginationInstance} from 'ng2-pagination';
import {CompanyModelService} from '../../services/model/company.model.service';

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

  /**
   * Constructor
   * @param _companyModelService
   */
  constructor (private _companyModelService:CompanyModelService) {}

  /**
   * Request new data on page change
   * @param currentPage
   */
  onPageChanged(currentPage:number) {
    if (this.config.currentPage !== currentPage && currentPage !== 0) {
      this.config.currentPage = currentPage;
      this.pageChanged.emit(this.config);
    }
  }
}
