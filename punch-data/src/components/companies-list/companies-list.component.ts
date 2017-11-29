import {Component, OnInit, ViewEncapsulation} from 'angular2/core';
import {Router, PathLocationStrategy, RouteParams} from 'angular2/router';
import {CORE_DIRECTIVES} from 'angular2/common';
import {HeaderComponent} from '../wrapper/header.component';
import {CompanyModelService} from '../../services/model/company.model.service';
import {CompanyDetail, EditableCompany} from '../../common/interfaces/interfaces';
import {TitleService} from '../../services/helper/title.service';
import {ListPaginationComponent} from '../list-controls/list-pagination.component';
import {ListSearchComponent} from '../list-controls/list-search.component';
import {QueryFilterPipe} from '../../pipes/query-filter.pipe';
import {PaginatePipe, IPaginationInstance} from 'ng2-pagination/index';
import {CONFIG, companyEditableFields, keyPeopleEditableFields} from '../../config/config';
import {ExportCSVService} from '../../services/export/export-csv.service';
import {ListDropdownFilterComponent} from '../list-controls/list-dropdown-filter.component';
import {ListMultiSelectFilterComponent} from '../list-controls/list-multi-select-filter.component';
import {CompanyFundingFilterPipe} from '../../pipes/company-funding-filter.pipe';
import {EmployeeSizeFilterPipe} from '../../pipes/employee-size-filter.pipe';
import {MarketsFilterPipe} from '../../pipes/market-filter.pipe';
import {UrlFilterPipe} from '../../pipes/url-filter.pipe';
import {FormatNumberPipe} from '../../pipes/format-number.pipe';
import {ArrayUtils, StringUtils} from '../../common/utils/index';
import * as _ from 'lodash';
import {EditCompanyModalComponent} from '../modals/edit-company-modal.component';
import {AddToListModalComponent} from '../modals/add-to-list-modal.component';

@Component({
  selector: 'ar-companies-list',
  moduleId: module.id,
  templateUrl: './companies-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../common/stylesheets/components/list.css',
    '../../common/stylesheets/pages/companies-list.css'],
  directives: [CORE_DIRECTIVES, HeaderComponent, ListSearchComponent, ListPaginationComponent,
    ListDropdownFilterComponent, ListMultiSelectFilterComponent, EditCompanyModalComponent, AddToListModalComponent],
  pipes: [QueryFilterPipe, PaginatePipe, CompanyFundingFilterPipe, EmployeeSizeFilterPipe,
    MarketsFilterPipe, UrlFilterPipe, FormatNumberPipe],
  providers: [PathLocationStrategy]
})

export class CompaniesListComponent implements OnInit {

  /**
   * Contains currently applied pagination and filter information.
   */
  filters: any;

  //selection of textual search suing queryTargets. see below
  query;

  //hoverCompany
  hoveredCompany;

  /**
   * List of all companies fetched from db
   */
  companies:CompanyDetail[] = [];

  /**
   * List of Categories for market Filter
   */
  markets:string[] = [];

  /**
   * List of selected companies from filters
   */
  selectedCompanies:CompanyDetail[] = [];
  /**
   * List of companies to add to list
   */
  companiesToAdd:string[] = [];

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
   * Object having details of paginated companies, total results count,
   * page size, and page number
   */
  protected paginatedCompanies:any;

  /**
   * currentPAge object for pagination
   */
  currentPage:IPaginationInstance = {
    id: 'companiesTable',
    itemsPerPage: CONFIG.PAGINATION.ITEMS,
    currentPage: 1
  };

  /**
   * Page zero
   * @type {number}
   */
  protected PAGE_ZERO = 0;

  /**
   * Flag to show/hide edit company modal
   * @type {boolean}
   */
  protected showEditCompanyModal:boolean = false;
  /**
   * Flag to show/hide edit add to list modal
   * @type {boolean}
   */
  protected showAddToListModal:boolean = false;

  /**
   * Company info which will be passed on to edit modal for user edits
   */
  protected editableCompany:EditableCompany;

  /**
   * Constructor initializing services
   * @param _companyModelService
   * @param pageTitle
   * @param _router
   * @param _exportCSV
   * @param _locationStrategy
   * @param _routeParams
   */
  constructor(private _companyModelService:CompanyModelService,
              private pageTitle:TitleService,
              private _router:Router,
              private _exportCSV:ExportCSVService,
              private _locationStrategy: PathLocationStrategy,
              private _routeParams: RouteParams) {
    this.filters = {
      page: 1,
      size: 50,
      q: {
        markets: [],
        'funding~': [],
        'size~': [],
      }
    };
  }

  /**
   * Initial loading of companies and setting page title
   */
  ngOnInit() {
    this._companyModelService.observer$
      .subscribe(result => this.handleCompanyModelServiceChange(result));
    this.pageTitle.setTitle('Companies');
    //TODO(irtazabbas): Move pagination/filters routing to re-usable component.
    if (!_.isEmpty(this._routeParams.params)) {
      let params = _.clone(this._routeParams.params);
      params['q'] = StringUtils.parseQueryString(
        decodeURIComponent(params['q']));
      _.forIn(params['q'], (value, key, self) => {
        self[key] = value ? value.split(',') : [];
      });
      this.filters = params;
      this.currentPage.currentPage = this.filters.page;
      this.currentPage.itemsPerPage = this.filters.size;
    }
    this.fetchCompanies();
  }

  /**
   * Sets the selected Markets values. _.clone nudges change detect
   */
  setMarket(values) {
    this.filters.q.markets = values.map(value => value.text);
    this.fetchCompanies();
  }

  /**
   * Sets selected funding.
   */
  setFunding(funding) {
    this.filters.q['funding~'] = funding ? funding.value : [];
    this.fetchCompanies();
  }

  /**
   * Sets selected size.
   */
  setEmployeeSize(size) {
    this.filters.q['size~'] = size ? size.value : [];
    this.fetchCompanies();
  }

  /**
   * returns true if amount is valid, false otherwise
   * @param amount
   * @returns {boolean}
   */
  isValidAmount(amount):boolean {
    return amount > 0;
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
   * Fetch companies for current page
   */
  fetchCompanies(payload?):void {
    payload = payload || this.prepareFilters();
    //TODO(irtazabbas): Move pagination/filters routing to re-usable component.
    this._locationStrategy.pushState({}, '',
      '', StringUtils.toQueryString(payload));
    this._companyModelService.list(payload);
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
    this.fetchCompanies();
  }

  /**
   * Updating the selected companies to prepare them for export
   */
  updateSelectedCompanies() {
    let temp = new CompanyFundingFilterPipe().transform(this.companies, [this.filters.q.funding]);
    temp = new EmployeeSizeFilterPipe().transform(temp, [this.filters.q.size]);
    temp = new QueryFilterPipe().transform(temp, [this.queryTargets, this.query]);
    this.selectedCompanies = new MarketsFilterPipe().transform(temp, [this.filters.q.markets, this.query]);
  }

  /**
   * Reset client collections before parsing new data
   */
  resetCollections():void {
    this.companies = [];
    this.selectedCompanies = [];
  }

  /**
   * Preparing companies for view after getting them from db,
   * also preping markets for filtering dropDown
   * @param paginatedCompanies
   */
  prepareCompanies(paginatedCompanies) {
    this.paginatedCompanies = paginatedCompanies;
    this.currentPage.totalItems = this.paginatedCompanies.total;
    this.resetCollections();
    let companies = paginatedCompanies.companies || [];

    companies.forEach(company => {
      let index = ArrayUtils.findIndexWhere(this.companies, comp => comp.companyName === company.companyName);
      if (index === undefined) {
        this.companies.push(company);
        this.selectedCompanies.push(company);
      } else {
        if (company['source'] === 'crunchBase') {
          this.companies[index] = company;
          this.selectedCompanies[index] = company;
        }
      }
    });

    this.companies.forEach(company => {
      if (company['edits'] && company['edits'].length > 0) {
        let editedCompany = _.find(company['edits'], ['source', 'user']);
        for(let k in editedCompany) {
          //TODO(Younes): remove unnecessary checks once Elastic is deployed
          if (k !== 'source' && _.has(editedCompany, k) && editedCompany[k] !== 'undefined NaN, -0NaN') {
            if (typeof editedCompany[k] !== 'object' || (typeof editedCompany[k] === 'object' && !_.isEmpty(editedCompany[k]))) {
              company[k] = editedCompany[k];
            }
          }
        }
      }
    });

    if (paginatedCompanies.aggregations && paginatedCompanies.aggregations.markets) {
      this.markets = <string[]>_(paginatedCompanies.aggregations.markets)
        .map('key')
        .sort()
        .value();
    }
  }

  /**
   * Prepares query string parameter for applied filters.
   */
  prepareFilters():any {
    let qry = _.clone(this.filters);
    qry.q = StringUtils.toQueryString(qry.q);
    return qry;
  }

  /**
   * Export companies as CSV
   * @param option - option to export all or filtered
   */
  exportAsCSV(option) {
    let companies:CompanyDetail[] = option ? this.selectedCompanies : this.companies;

    if (companies.length > 0) {
      let companiesTable = [
        ['Name', 'Company website', 'Founders', 'Headquarters', 'Employees', 'Funding', 'Founded', 'Markets',
          '# Acquisitions', 'Status', 'revenue', 'Key People', 'LinkedIn', 'Twitter', 'Facebook', 'Description', 'URL']
      ];

      for (let company of companies) {
        let row = [company.companyName];
        row.push(company.websiteLink);
        let founders = '';
        for (let i = 0; i < company.foundersNames.length; i++) {
          if (i !== 0) founders += ', ';
          founders += company.foundersNames[i];
        }
        row.push(founders);
        row.push(company.cityHeadQuartersIn);
        let employees = '';
        if (company.numberOfEmployees) {
          if (company.numberOfEmployees.indexOf('-') !== -1) {
            employees = 'between ' + company.numberOfEmployees.replace('-', ' and ');
          } else {
            employees = company.numberOfEmployees;
          }
        }
        row.push(employees);

        let funding = '';
        if (company.fundingRounds)
          funding += 'Rounds: ' + company.fundingRounds + '. ';
        if (company.fundingAmount)
          funding += 'Amount: ' + company.fundingAmount + '. ';
        if (company.lastFundingDate)
          funding += 'Last Funding: ' + company.lastFundingDate + '.';
        row.push(funding);

        row.push(company.dateFounded);

        let cats = '';
        for (let i = 0; i < company.categories.length; i++) {
          if (i !== 0) cats += ', ';
          cats += company.categories[i];
        }
        row.push(cats);
        row.push(company['acquisitionsNumber']);
        row.push(company['status']);
        row.push(company['revenue']);
        let keyPeople = '';
        for (let i = 0; i < company['keyPeople'].length; i++) {
          if (i !== 0) keyPeople += ', ';
          keyPeople += company['keyPeople'][i]['name'] + ' (' + company['keyPeople'][i]['title'] + ')';
        }

        row.push(keyPeople);
        row.push(company['linkedInURL']);
        row.push(company['twitterURL']);
        row.push(company['facebookURL']);
        row.push(company['description']);
        row.push(company['angelURL']);

        companiesTable.push(row);
      }
      //file name:
      let fileName = 'Companies - All';
      if (option && this.filters.q.markets.length) {
        fileName = `Companies - ${this.filters.q.markets.length > 1 ?
          'Filtered' : this.filters.q.markets[0].text }`;
      }
      this._exportCSV.exportToCsv(fileName + '.csv', companiesTable);
    }
  }

  onViewCompany(id) {
    this._router.navigate(['CompanyPage', {'id': id}]);
  }

  /**
   * Request new data on page change
   * @param currentPage
   */
  pageChanged(currentPage):void {
    this.currentPage = currentPage;
    this.filters.page = currentPage.currentPage;
    this.filters.size = currentPage.itemsPerPage;
    if (this.currentPage.currentPage > this.PAGE_ZERO) {
      this.fetchCompanies();
    }
  }

  /**
   * Save the company edits to database
   * @param editedCompany
   */
  protected saveEdits(editedCompany):void {
    this._companyModelService.update(editedCompany);
  }

  /**
   * Show/hide company edit modal
   * @param company
   */
  protected toggleEditCompanyModal(company):void {
    if (company && company._id) {
      this.pickEditableInfo(company);
    }
    this.showEditCompanyModal = !this.showEditCompanyModal;
  }
  /**
   * Show/hide add to list modal modal
   */
  protected toggleAddToListModal():void {
    this.showAddToListModal = !this.showAddToListModal;
  }

  protected onCheckboxChange(company) {
    if (company['selected']) {
      this.companiesToAdd.push(company._id);
    } else {
      ArrayUtils.remove(this.companiesToAdd, company._id);
    }
  }

  /**
   * It takes scraped company object as input
   * and outputs the company object which user can edit in edit modal
   * it makes sure to output at-least those fields which are editable in modal
   * so if a scraped company has less fields than our edit modal fields
   * it adds missing fields with empty values in output object
   * also, if scraped company has already any saved edits by user
   * it overrides the output object and replaces scraped values with edited
   * also, if any field has null value, it replaces with empty string,
   * and also, capitalizes the value of status field, to make sure we
   * get consistent data on edit modal
   * @param company
   */
  protected pickEditableInfo(company):void {
    if (_.isEmpty(company)) return;
    company.keyPeople = company.keyPeople || [];
    company.keyPeople = company.keyPeople.map(keyPerson => _.pick(keyPerson, keyPeopleEditableFields));
    let previouslyEditedCompany = _.find(company.edits, ['source', 'user']);

    this.editableCompany = _.merge(this._companyModelService.freshEditable(), _(company)
      .merge(previouslyEditedCompany !== undefined ? previouslyEditedCompany : company)
      .pick(companyEditableFields)
      .mapValues((value, key) => {
        value = value === null ? '' : value;
        return key === 'status' ? _.capitalize(<string>value) : value;
      })
      .value());
  }

  /**
   * Handle successful save of edits in database
   * @param companyWithSavedEdits
   */
  handleSavedEdits(companyWithSavedEdits):void {
    let index = _.findIndex(this.companies, ['_id', companyWithSavedEdits._id]);
    if (index !== -1) {
      if (companyWithSavedEdits['edits'] && companyWithSavedEdits['edits'].length > 0) {
        let editedCompany = _.find(companyWithSavedEdits['edits'], ['source', 'user']);
        for(let k in editedCompany) {
          //TODO(Younes): remove unnecessary checks once Elastic is deployed
          if (k !== 'source' && _.has(editedCompany, k) && editedCompany[k] !== 'undefined NaN, -0NaN') {
            if (typeof editedCompany[k] !== 'object' || (typeof editedCompany[k] === 'object' && !_.isEmpty(editedCompany[k]))) {
              companyWithSavedEdits[k] = editedCompany[k];
            }
          }
        }
      }
      this.companies[index] = companyWithSavedEdits;
    }
  }

  /**
   * Handle result data
   * @param result
   */
  protected handleCompanyModelServiceChange(result):any {
    this.prepareCompanies(result);
    if (_.isEmpty(result.companies)) this.handleSavedEdits(result);
  }
}
