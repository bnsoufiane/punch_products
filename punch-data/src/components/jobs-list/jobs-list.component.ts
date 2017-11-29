import {Component, OnInit, ViewEncapsulation} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {HeaderComponent} from '../wrapper/header.component';
import {JobModelService} from '../../services/model/job.model.service';
import {Job} from '../../common/interfaces/job/job.interface';
import {TitleService} from '../../services/helper/title.service';
import {ListPaginationComponent} from '../list-controls/list-pagination.component';
import {ListSearchComponent} from '../list-controls/list-search.component';
import {QueryFilterPipe} from '../../pipes/query-filter.pipe';
import {PaginatePipe, IPaginationInstance} from 'ng2-pagination/index';
import {CONFIG} from '../../config/config';
import {ListDropdownFilterComponent} from '../list-controls/list-dropdown-filter.component';
import {ListMultiSelectFilterComponent} from '../list-controls/list-multi-select-filter.component';
import {FormatDatePipe} from '../../pipes/format-date.pipe';
import {StringUtils} from '../../common/utils/index';

@Component({
  selector: 'ar-jobs-list',
  moduleId: module.id,
  templateUrl: './jobs-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../common/stylesheets/components/list.css',
    '../../common/stylesheets/pages/jobs-list.css'],
  directives: [CORE_DIRECTIVES, HeaderComponent, ListSearchComponent, ListPaginationComponent,
    ListDropdownFilterComponent, ListMultiSelectFilterComponent],
  pipes: [QueryFilterPipe, PaginatePipe, FormatDatePipe]
})

export class JobsListComponent implements OnInit {
  //selection of textual search suing queryTargets. see below
  query;

  /**
   * List of jobs fetched from db
   */
  jobs:Job[] = [];

  /**
   * List of company attributes to search in
   */
  queryTargets:string[] = ['title', 'company', 'location'];

  /**
   * Object having details of paginated companies, total results count,
   * page size, and page number
   */
  protected paginatedJobs:any;

  /**
   * currentPAge object for pagination
   */
  currentPage:IPaginationInstance = {
    id: 'jobsTable',
    itemsPerPage: CONFIG.PAGINATION.ITEMS,
    currentPage: 1
  };

  /**
   * Page zero
   * @type {number}
   */
  protected PAGE_ZERO = 0;

  /**
   * Constructor initializing services
   * @param _jobModelService
   * @param pageTitle
   */
  constructor(private _jobModelService:JobModelService,
              private pageTitle:TitleService) {
  }

  /**
   * Initial loading of jobs and setting page title
   */
  ngOnInit() {
    this._jobModelService.observer$
      .subscribe(result => this.handleJobModelServiceChange(result));
    this._jobModelService.list({page: 1, size: CONFIG.PAGINATION.ITEMS});
    this.pageTitle.setTitle('Jobs');
  }

  /**
   * Fetch companies for current page
   */
  fetchJobs():void {
    this._jobModelService.list({
      page: this.currentPage.currentPage,
      size: this.currentPage.itemsPerPage,
      q: this.prepareFilters()
    });
  }

  /**
   * updating number of results per page
   * @param choice
   */
  updateResultsPerPage(choice:number) {
    if (choice) {
      this.currentPage.itemsPerPage = choice['value'];
    } else {
      this.currentPage.itemsPerPage = CONFIG.PAGINATION.ITEMS;
    }
    this.fetchJobs();
  }

  /**
   * Preparing jobs for view after getting them from db,
   * @param paginatedJobs
   */
  prepareJobs(paginatedJobs) {
    this.paginatedJobs = paginatedJobs;
    this.currentPage.totalItems = this.paginatedJobs.total;
    this.jobs = paginatedJobs.jobs || [];
  }

  /**
   * Prepares query string parameter for applied filters.
   */
  prepareFilters():string {
    return StringUtils.toQueryString({});
  }

  /**
   * Request new data on page change
   * @param currentPage
   */
  pageChanged(currentPage):void {
    this.currentPage = currentPage;
    if (this.currentPage.currentPage > this.PAGE_ZERO) {
      this.fetchJobs();
    }
  }

  /**
   * Handle result data
   * @param result
   */
  protected handleJobModelServiceChange(result):any {
    this.prepareJobs(result);
  }
}
