import {Component, OnInit, ViewEncapsulation} from 'angular2/core';
import {HeaderComponent} from '../wrapper/header.component';
import {List} from '../../common/interfaces/list/list.interface';
import {RouteParams, Router} from 'angular2/router';
import {TitleService} from '../../services/helper/title.service';
import {ListModelService} from '../../services/model/list.model.service';
import {CompanyDetail} from '../../common/interfaces/company-detail/company-detail.interface';
import {FormatNumberPipe} from '../../pipes/format-number.pipe';
import {UrlFilterPipe} from '../../pipes/url-filter.pipe';
import {MarketsFilterPipe} from '../../pipes/market-filter.pipe';
import {EmployeeSizeFilterPipe} from '../../pipes/employee-size-filter.pipe';
import {CompanyFundingFilterPipe} from '../../pipes/company-funding-filter.pipe';
import {QueryFilterPipe} from '../../pipes/query-filter.pipe';
import {PaginatePipe, IPaginationInstance} from 'ng2-pagination/index';
import {ListMultiSelectFilterComponent} from '../list-controls/list-multi-select-filter.component';
import {ListDropdownFilterComponent} from '../list-controls/list-dropdown-filter.component';
import {ListPaginationComponent} from '../list-controls/list-pagination.component';
import {ListSearchComponent} from '../list-controls/list-search.component';
import {CONFIG} from '../../config/config';
import {ArrayUtils} from '../../common/utils/array.utils';
import {ConfirmationModalComponent} from '../modals/confirmation.modal.component';
import * as _ from 'lodash';


@Component({
  selector: 'ar-list-page',
  moduleId: module.id,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../common/stylesheets/pages/list-detail.css',
    '../../common/stylesheets/components/list.css',],
  templateUrl: './list-page.component.html',
  directives: [HeaderComponent, ListSearchComponent, ListPaginationComponent, ConfirmationModalComponent,
    ListDropdownFilterComponent, ListMultiSelectFilterComponent],
  pipes: [QueryFilterPipe, PaginatePipe, CompanyFundingFilterPipe, EmployeeSizeFilterPipe,
    MarketsFilterPipe, UrlFilterPipe, FormatNumberPipe]
})

export class ListPageComponent implements OnInit {
  /**
   * list object
   */
  list: List;
  /**
   * list object
   */
  companies: CompanyDetail[];
  /**
   * ids object
   */
  companiesToDelete: string[] = [];
  /**
   * list id
   */
  id: string;
  /**
   * confirm modal toggle
   */
  showConfirmModal: boolean = false;

  /**
   * List of funding intervals to filter by
   */
  fundingIntervals = [
    {text: '0 - 1m', value: [0, 1000000]},
    {text: '1m - 5m', value: [1000000, 5000000]},
    {text: '5m - 10m', value: [5000000, 10000000]},
    {text: '10m - 20m', value: [10000000, 20000000]},
    {text: '20m - 30m', value: [20000000, 30000000]},
    {text: '30m - 100m', value: [30000000, 100000000]},
    {text: '100m +', value: [100000000, 1000000000]}
  ];

  // List of employee size intervals to filter by
  employeeIntervals = [
    {text: '1 - 10', value: [1, 10]},
    {text: '11 - 50', value: [11, 50]},
    {text: '51 - 150', value: [51, 150]},
    {text: '150 - 250', value: [150, 250]},
    {text: '250 - 500', value: [250, 500]},
    {text: '501 - 1k', value: [501, 1000]},
    {text: '1k+', value: [1000, 10000000]}//largest is US DOD 3.5 Million
  ];

  /**
   * List of results per page choices
   */
  resultsPerPage = [
    {text: '10 per page', value: 10},
    {text: '20 per page', value: 20},
    {text: '50 per page', value: 50},
    {text: '100 per page', value: 100},
    {text: '200 per page', value: 200}
  ];

  /**
   * List of company attributes to search in
   */
  queryTargets:string[] = ['companyName', 'foundersNames', 'cityHeadQuartersIn'];

  /**
   * currentPAge object for pagination
   */
  currentPage:IPaginationInstance = {
    id: 'listCompaniesTable',
    itemsPerPage: CONFIG.PAGINATION.ITEMS,
    currentPage: 1
  };

  /**
   * initialize needed services and variables, setting up page title
   * @param _listModelService
   * @param _params
   * @param _router
   * @param pageTitle
   */
  constructor(private _listModelService:ListModelService,
              private _params:RouteParams,
              private _router:Router,
              private pageTitle:TitleService) {
    this.id = this._params.get('id');
    this.pageTitle.setTitle('List Detail Page: ');
  }

  /**
   * loading company by id
   */
  ngOnInit() {
    if (this.id) {
      this._listModelService.view(this.id);
    }
    this._listModelService.observer$.subscribe(result => this._subscribe(result));
  }

  /**
   *
   * returns the right scraped page URL for a company depending on the source
   * @returns string
   */
  getCompanyURL(company:CompanyDetail):string {
    if (company['source'] === 'craft') {
      return company['craftURL'];
    }
    if (company['source'] === 'owler') {
      return company['owlerURL'];
    }
    if (company['source'] === 'crunchBase' && company['crunchBaseURL']) {
      return company['crunchBaseURL'];
    }
    return company['angelURL'];
  }

  /**
   * redirect to company page
   * @param id
   */
  onViewCompany(id) {
    this._router.navigate(['CompanyPage', {'id': id}]);
  }

  /**
   * confirm deleting companies from list
   * @param confirmed
   */
  confirmDelete(confirmed) {
    if (confirmed) {
      console.log(this.list.companies);
      console.log(this.companiesToDelete);
      this.list.companies = _.difference(this.list.companies, this.companiesToDelete);
      console.log(this.list.companies);
      this._listModelService.update(this.list);
    }
  }

  /**
   * action when checkbox is checked/unchecked
   * @param company
   */
  protected onCheckboxChange(company) {
    if (company['selected']) {
      this.companiesToDelete.push(company._id);
    } else {
      ArrayUtils.remove(this.companiesToDelete, company._id);
    }
  }

  /**
   * Handle result data
   */
  protected _subscribe(result):any {
    if (result.list) {
      this.companies = result.listCompanies ? result.listCompanies : [];
      this.list = result.list;
      this.pageTitle.setTitle('List Detail Page: ' + this.list.name);
    }
  }
}
