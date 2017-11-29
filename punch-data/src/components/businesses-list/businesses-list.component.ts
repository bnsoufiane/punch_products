import {Component, OnInit, ViewEncapsulation} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {HeaderComponent} from '../wrapper/header.component';
import {BusinessModelService} from '../../services/model/business.model.service';
import {LocalBusiness} from '../../common/interfaces/interfaces';
import {TitleService} from '../../services/helper/title.service';
import {ListPaginationComponent} from '../list-controls/list-pagination.component';
import {ListSearchComponent} from '../list-controls/list-search.component';
import {QueryFilterPipe} from '../../pipes/query-filter.pipe';
import {PaginatePipe, IPaginationInstance} from 'ng2-pagination/index';
import {CONFIG} from '../../config/config';
import {ExportCSVService} from '../../services/export/export-csv.service';
import {ListDropdownFilterComponent} from '../list-controls/list-dropdown-filter.component';
import {ListMultiSelectFilterComponent} from '../list-controls/list-multi-select-filter.component';
import {UrlFilterPipe} from '../../pipes/url-filter.pipe';
import {CityFilterPipe} from '../../pipes/city-filter.pipe';
import * as _ from 'lodash';
import {MarketsFilterPipe} from '../../pipes/market-filter.pipe';

@Component({
  selector: 'ar-businesses-list',
  moduleId: module.id,
  templateUrl: './businesses-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../common/stylesheets/components/list.css',
    '../../common/stylesheets/pages/companies-list.css'],
  directives: [CORE_DIRECTIVES, HeaderComponent, ListSearchComponent, ListPaginationComponent,
    ListDropdownFilterComponent, ListMultiSelectFilterComponent],
  pipes: [QueryFilterPipe, PaginatePipe, UrlFilterPipe, MarketsFilterPipe, CityFilterPipe]
})

export class BusinessesListComponent implements OnInit {
  //selection of market categories from filter
  selectedMarkets = [];

  //selection of cities from filter
  selectedCities = [];

  //selection of textual search suing queryTargets. see below
  query;

  /**
   * List of all companies fetched from db
   */
  businesses:LocalBusiness[] = [];
  /**
   * List of Categories for market Filter
   */
  markets:string[] = [];
  /**
   * List of Cities for city Filter
   */
  cities:string[] = [];
  /**
   * List of selected businesses from filters
   */
  selectedBusinesses:LocalBusiness[] = [];
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
   * List of businesses attributes to search in
   */
  queryTargets:string[] = ['name', 'street', 'city', 'state', 'postalCode'];
  /**
   * currentPAge object for pagination
   */
  currentPage:IPaginationInstance = {
    id: 'businessesTable',
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
   * @param _businessModelService
   * @param pageTitle
   * @param _exportCSV
   */
  constructor(private _businessModelService:BusinessModelService,
              private pageTitle:TitleService,
              private _exportCSV:ExportCSVService) {
  }

  /**
   * Initial loading of local businesses and setting page title
   */
  ngOnInit() {
    this._businessModelService.observer$
      .subscribe(businesses => this.handleBusinessModelServiceChange(businesses));
    this._businessModelService
      .list({page: this.currentPage.currentPage, size: CONFIG.PAGINATION.ITEMS});
    this.pageTitle.setTitle('Local Businesses');
  }

  /**
   * Sets the selected Markets values. _.clone nudges change detect
   */
  setMarket(values) {
    this.selectedMarkets = _.clone(values);
  }

  /**
   * Sets the selected city values. _.clone nudges change detect
   */
  setCity(values) {
    this.selectedCities = _.clone(values);
  }

  /**
   * Fetch businesses for current page
   */
  fetchBusinesses():void {
    this._businessModelService
      .list({page: this.currentPage.currentPage, size: this.currentPage.itemsPerPage});
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
    this.fetchBusinesses();
  }

  /**
   * Updating the selected businesses to prepare them for export
   */
  updateSelectedBusinesses() {
    this.selectedBusinesses = new QueryFilterPipe().transform(this.businesses, [this.queryTargets, this.query]);
    this.selectedBusinesses = new MarketsFilterPipe().transform(this.selectedBusinesses, [this.selectedMarkets, this.query]);
    this.selectedBusinesses = new CityFilterPipe().transform(this.selectedBusinesses, [this.selectedCities, this.query]);
  }

  /**
   * Handle business model service change by preparing businesses for view
   * after getting them from db, also preparing markets for filtering dropDown
   * @param businesses
   */
  handleBusinessModelServiceChange(businesses) {
    this.currentPage.totalItems = businesses.total;
    this.businesses = businesses.businesses;
    this.selectedBusinesses = _.clone(businesses);

    //TODO(Irtaza): should be provided by server
    this.markets = <string[]>_(this.businesses)
      .map('categories')
      .flatten()
      .uniq()
      .sort()
      .value();

    this.cities = <string[]>_(this.businesses)
      .map('city')
      .flatten()
      .uniq()
      .sort()
      .value();
  }

  /**
   * Export companies as CSV
   * @param option - option to export all or filtered
   */
  exportAsCSV(option) {
    let businesses:LocalBusiness[] = option ? this.selectedBusinesses : this.businesses;

    if (businesses.length > 0) {
      let businessesTable = [
        ['Name', 'Website', 'Street', 'City', 'State', 'Postal code', 'Neighborhood', 'Country', 'Phone', 'Part of chain',
          'Price range', 'Price Description', 'Health inspection', 'Yelping since', 'Yelp URL', 'Yelp avatar',
          'Categories', 'Coordinates', 'hours', 'reviews', 'Additional info']
      ];

      for (let biz of businesses) {
        let row = [biz.name, biz.website, biz.street, biz.city, biz.state, biz.postalCode, biz.neighborhood,
          biz.country, biz.phone, biz.partOfChain.toString(), biz.priceRange, biz.priceDescription,
          biz.healthInspection, biz.yelpingSince, biz.yelpUrl, biz.yelpAvatar];

        let cats = '';
        for (let i = 0; i < biz.categories.length; i++) {
          if (i !== 0) cats += ', ';
          cats += biz.categories[i];
        }
        row.push(cats);

        if (biz.coordinates.length === 2) row.push(biz.coordinates[0]+', '+biz.coordinates[1]);

        let days = '';
        if (biz.hours.mon) {
          days += 'Mon: '+biz.hours.mon+', \r\n';
          days += 'Tue: '+biz.hours.tue+', \r\n';
          days += 'Wed: '+biz.hours.wed+', \r\n';
          days += 'Thu: '+biz.hours.thu+', \r\n';
          days += 'Fri: '+biz.hours.fri+', \r\n';
          days += 'Sat: '+biz.hours.sat+', \r\n';
          days += 'Sun: '+biz.hours.fri;
        }
        row.push(days);

        let reviews = '';
        if (biz.reviews['five']) {
          reviews += '5 starts: '+biz.reviews['five']+', \r\n';
          reviews += '4 starts: '+biz.reviews['four']+', \r\n';
          reviews += '3 starts: '+biz.reviews['three']+', \r\n';
          reviews += '2 starts: '+biz.reviews['two']+', \r\n';
          reviews += '1 starts: '+biz.reviews['one'];
        }
        row.push(reviews);

        let additionalInfo = '';
        if (biz.additionalInfo.length > 0) {
          for (let i = 0; i < biz.additionalInfo.length; i++) {
            if (i !== 0) additionalInfo += ', \r\n';
            additionalInfo += biz.additionalInfo[i].key+': '+biz.additionalInfo[i].value;
          }
        }
        row.push(additionalInfo);

        businessesTable.push(row);
      }
      //file name:
      let fileName = 'Local Businesses';
      if (option) {
        if (this.selectedCities.length === 1) {
          fileName += ' - ' + this.selectedCities[0].text;
        }
        if (this.selectedMarkets.length === 1 && !this.query) {
          fileName += ' - ' + this.selectedMarkets[0].text;
        } else {
          fileName += ' - Filtered';
        }
      } else {
        fileName += ' - All';
      }
      this._exportCSV.exportToCsv(fileName+'.csv', businessesTable);
    }
  }

  stringAsDate(dateStr) {
    return new Date(dateStr);
  }

  /**
   * Request new data on page change
   * @param currentPage
   */
  pageChanged(currentPage):void {
    this.currentPage = currentPage;
    if (this.currentPage.currentPage > this.PAGE_ZERO) {
      this.fetchBusinesses();
    }
  }
}
