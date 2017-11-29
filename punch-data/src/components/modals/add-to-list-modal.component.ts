import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {PaginatePipe} from 'ng2-pagination';
import {IPaginationInstance} from 'ng2-pagination';
import {ListPaginationComponent} from '../list-controls/list-pagination.component';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {ListModelService} from '../../services/model/list.model.service';
import {List} from '../../common/interfaces/list/list.interface';
import {CONFIG} from '../../config/config';
import {LocalStorageService} from '../../services/storage/storage.service';
import {FormatDatePipe} from '../../pipes/format-date.pipe';
import {QueryFilterPipe} from '../../pipes/query-filter.pipe';
import * as _ from 'lodash';

/**
 * Shows the add to list modal
 */
@Component({
  selector: 'ar-add-to-list-modal',
  moduleId: module.id,
  templateUrl: './add-to-list-modal.component.html',
  styleUrls: ['../../common/stylesheets/components/modal.css'],
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES, ListPaginationComponent],
  pipes: [QueryFilterPipe, PaginatePipe, FormatDatePipe]
})
export class AddToListModalComponent implements OnInit{
  @Input() showModal:boolean = false;
  @Input() companiesToAdd:any = null;
  @Output() closed = new EventEmitter<boolean>();
  newListName:string = '';
  lists:List[] = [];
  currentPage:IPaginationInstance = {
    id: 'candidatesList',
    itemsPerPage: 10,
    currentPage: 1
  };
  protected currentUserId:string = null;

  /**
   * Constructor initializing services
   * @param _listModelService
   * @param _localStorageService
   */
  constructor(private _listModelService:ListModelService,
              private _localStorageService:LocalStorageService) {
    this.currentUserId = this._localStorageService.get(CONFIG.STORAGE_KEYS.CURRENT_USER)['_id'];
    if (!this.currentUserId) {
      console.log('could not get userId, will not be able to get/create/update lists');
    }
  }

  /**
   * Initial loading of lists
   */
  ngOnInit() {
    this._listModelService.observer$.subscribe(result => this._subscribe(result));
    this._listModelService.query({userId:this.currentUserId});
  }

  /**
   * Closes the modal with action confirmed
   * @returns {boolean}
   */
  positiveAction() {
    console.log(this.companiesToAdd);
    return false;
  }

  /**
   * Closes the modal with action canceled
   * @returns {boolean}
   */
  cancelAction() {
    this.lists.forEach(l => {
      l['updated'] = false;
      l['loading'] = false;
    });
    this.showModal = false;
    this.closed.emit(false);
    return false;
  }

  /**
   * creates a list
   * @returns {boolean}
   */
  createList() {
    if (this.newListName && this.newListName.length > 2) {
      let list:List = {
        name: this.newListName,
        userId: this.currentUserId,
        companies: [],
        businesses: [],
        jobs: [],
        sharedWithUsers: [],
        sharedWithTeams: []
      };
      this._listModelService.create(JSON.stringify(list));
      this.newListName = '';
    }
    return false;
  }

  /**
   * updates a list
   * @returns {boolean}
   */
  updateList(list) {
    list.companies = _.uniq(list.companies.concat(this.companiesToAdd));
    this._listModelService.update(list);
    list['loading'] = true;
    return false;
  }

  _subscribe(result) {
    if (result.length) {
      //list response
      this.lists = result;
    } else {
      if (result) {
        let index = _.findIndex(this.lists, result);
        //update response
        if (index !== -1) {
          this.lists[index]['updated'] = true;
          this.lists[index]['loading'] = false;
          console.log(index);
          console.log(this.lists);

        } else {
          //add response
          this.lists.unshift(result);
        }
      }
    }
    console.log('result from subscribe method:');
    console.log(result);
  }
}
