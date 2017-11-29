import {
  Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges,
  SimpleChange, OnInit
} from 'angular2/core';
import {EditableCompany} from '../../common/interfaces/interfaces';
import {CompanyModelService} from '../../services/model/company.model.service';
import * as _ from 'lodash';
import {DateUtils} from '../../common/utils/date.utils';
import {StringUtils} from '../../common/utils/string.utils';

/**
 * Shows the modal to edit company info
 */
@Component({
  selector: 'ar-edit-company-modal',
  moduleId: module.id,
  templateUrl: 'edit-company-modal.component.html',
  styleUrls: ['../../common/stylesheets/components/modal.css',
    '../../common/stylesheets/components/list.css',
    '../../common/stylesheets/pages/modal-edit.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EditCompanyModalComponent implements OnInit, OnChanges {
  @Input()
  company:EditableCompany;
  @Input()
  showModal:boolean = false;
  @Input()
  positiveLabel:string = 'Save Edits';
  @Output()
  closed = new EventEmitter<boolean>();
  /**
   * Final output of edited company
   */
  @Output()
  editedCompany = new EventEmitter<EditableCompany>();
  /**
   * Different seed values which are used in populating html fields
   * @type {{DATE: {}, STATUSES: string[], LATEST_ROUNDS: string[], TOTAL_ROUNDS: number}}
   */
  protected SEED_DATA = {
    // TODO(irtaza): We should have this data come from api. Read details about this task here
    // TODO(irtaza): https://github.com/punchagency/punch-products/commit/ec64b4b4aacc3fa03694a1846cb3d5e4e102ea2a#commitcomment-18061554
    DATE: {},
    STATUSES: ['Private', 'Public', 'Acquired'],
    LAST_ROUNDS: ['Seed', 'Series A', 'Series B', 'Series C', 'Series D'],
    TOTAL_ROUNDS: 10,
    // its used in generating list of years for foundedYear drop-down.
    // its just an old number so that we can cover older companies
    START_YEAR: 1950
  };
  /**
   * Store month/year of company's foundedDate
   * @type {{}}
   */
  protected foundedDate = {
    month: '',
    year: ''
  };
  /**
   * Store markets as comma separated values
   */
  protected markets:string = '';
  /**
   * Store foundersNames as comma separated values
   */
  protected foundersNames:string = '';

  constructor(private _companyModelService:CompanyModelService) {
  }

  /**
   * Life-cycle hook to detect changed values
   * @param changes
   */
  ngOnChanges(changes:{[propertyName:string]:SimpleChange}) {
    this.extractMonthYear(_.get(changes, 'company.currentValue.dateFounded'));
    if (this.company) {
      this.markets = StringUtils.arrayToCsvString(this.company.categories);
      this.foundersNames = StringUtils.arrayToCsvString(this.company.foundersNames);
    }
  }

  /**
   * Extract month/year from company's date
   * @param date
   */
  extractMonthYear(date):void {
    if (_.isNil(date)) return;
    this.foundedDate.month = DateUtils.getDateInFormat(date, 'MMMM');
    this.foundedDate.year = DateUtils.getDateInFormat(date, 'YYYY');
  }

  /**
   * Initialize data fetching on init
   */
  ngOnInit() {
    this.getData_();
  }

  /**
   * Get all required data for component
   * @private
   */
  getData_() {
    this.setDate();
    this.takeFreshCompany();
  }

  /**
   * Generates array of total rounds
   */
  getTotalRounds() {
    return _.range(1, this.SEED_DATA.TOTAL_ROUNDS + 1);
  }

  /**
   * Fetch the fresh/empty company
   */
  takeFreshCompany():void {
    this.company = this._companyModelService.freshEditable();
  }

  /**
   * Used in generating drop-downs for date
   */
  setDate():void {
    this.SEED_DATA.DATE = this._companyModelService.date(this.SEED_DATA.START_YEAR);
  }

  /**
   * Add a fresh keyPerson to keyPeople
   */
  addKeyPerson():void {
    this.company.keyPeople.push(this._companyModelService.freshKeyPeople());
  }

  /**
   * Closes the modal with action confirmed
   * @returns {boolean}
   */
  positiveAction():boolean {
    this.showModal = false;
    this.editedCompany.emit(this.processForOutput(this.company));
    this.closed.emit(true);
    return false;
  }

  /**
   * We may need to process some company info before output
   * @param company
   * @returns {any}
   */
  processForOutput(company):EditableCompany {
    //TODO(Younes): remove unnecessary checks once Elastic is deployed
    if (this.foundedDate.year && this.foundedDate.year !== '0' && this.foundedDate.year !== 'Invalid date') {
      company.dateFounded = DateUtils
        .getDateFromYearMonthInFormat(this.foundedDate.year, this.foundedDate.month, 'MMMM D, YYYY');
    } else {
      company.dateFounded = '';
    }

    company.keyPeople = _(this.company.keyPeople)
      .filter(keyPerson => !_.isEqual(keyPerson, this._companyModelService.freshKeyPeople()))
      .map(keyPerson => _.omitBy(keyPerson, _.isEmpty))
      .value();
    company.source = 'user';
    company.categories = StringUtils.csvStringToArray(this.markets);
    company.foundersNames = StringUtils.csvStringToArray(this.foundersNames);

    return company;
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
