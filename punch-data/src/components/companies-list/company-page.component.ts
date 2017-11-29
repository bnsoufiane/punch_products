import {Component, OnInit, ViewEncapsulation} from 'angular2/core';
import {HeaderComponent} from '../wrapper/header.component';
import {CompanyDetail} from '../../common/interfaces/company-detail/company-detail.interface';
import {EditableCompany} from '../../common/interfaces/editable-company/editable-company.interface';
import {CompanyModelService} from '../../services/model/company.model.service';
import {RouteParams} from 'angular2/router';
import {TitleService} from '../../services/helper/title.service';
import {EditCompanyModalComponent} from '../modals/edit-company-modal.component';
import * as _ from 'lodash';
import {companyEditableFields, keyPeopleEditableFields} from '../../config/config';

@Component({
  selector: 'ar-company-page',
  moduleId: module.id,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../common/stylesheets/pages/company-detail.css',
              '../../common/stylesheets/components/list.css',],
  templateUrl: './company-page.component.html',
  directives: [HeaderComponent, EditCompanyModalComponent],
})

export class CompanyPageComponent implements OnInit {
  /**
   * company object
   */
  company: CompanyDetail;
  /**
   * company id
   */
  id: string;
  /**
   * Flag to show/hide edit company modal
   * @type {boolean}
   */
  protected showEditCompanyModal:boolean = false;
  /**
   * Company info which will be passed on to edit modal for user edits
   */
  protected editableCompany:EditableCompany;

  constructor(private _companyModelService:CompanyModelService,
              private _params:RouteParams,
              private pageTitle:TitleService) {
    this.id = this._params.get('id');
    this.pageTitle.setTitle('Company Detail Page: ');
  }

  /**
   * loading company by id
   */
  ngOnInit() {
    if (this.id) {
      this._companyModelService.view(this.id);
    }
    this._companyModelService.observer$.subscribe(result => this.handleCompanyModelServiceChange(result));
  }

  /**
   * returns the company logo or no-logo avatar if no logo is found
   * @param company
   * @returns {string}
   */
  getCompanyLogo(company) {
    if (company && company['logos']) {
      if (company['logos']['crunchBaseLogo']) return company['logos']['crunchBaseLogo'];
      if (company['logos']['craftLogo']) return company['logos']['craftLogo'];
      if (company['logos']['otherLogo']) return company['logos']['otherLogo'];
    }
    return 'common/images/no-logo.png';
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
    this.pickEditableInfo(company);
    this.showEditCompanyModal = !this.showEditCompanyModal;
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
   * Handle result data
   */
  protected handleCompanyModelServiceChange(result):any {
    this.company = result;
    let editedCompany = _.find(this.company['edits'], ['source', 'user']);
    for(let k in editedCompany) {
      //TODO(Younes): remove unnecessary checks once Elastic is deployed
      if (k !== 'source' && _.has(editedCompany, k) && editedCompany[k] !== 'undefined NaN, -0NaN') {
        if (typeof editedCompany[k] !== 'object' || (typeof editedCompany[k] === 'object' && !_.isEmpty(editedCompany[k]))) {
          this.company[k] = editedCompany[k];
        }
      }
    }
    this.pageTitle.setTitle('Company Detail Page: ' + this.company.companyName);
  }
}
