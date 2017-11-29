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
  selector: 'ar-create-list-modal',
  moduleId: module.id,
  templateUrl: './create-list-modal.component.html',
  styleUrls: ['../../common/stylesheets/components/modal.css'],
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES, ListPaginationComponent],
  pipes: [QueryFilterPipe, PaginatePipe, FormatDatePipe]
})
export class CreateListModalComponent implements OnInit {
  @Input() showModal:boolean = false;
  @Output() closed = new EventEmitter<List>();
  newListName:string = '';
  pendingCreation:boolean = false;
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
  }

  /**
   * Closes the modal with action canceled
   * @returns {boolean}
   */
  cancelAction() {
    this.showModal = false;
    this.closed.emit(null);
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
      this.pendingCreation = true;
      this._listModelService.create(JSON.stringify(list));
      this.newListName = '';
    }
    this.showModal = false;
    return false;
  }

  _subscribe(result) {
console.warn(result);
    console.warn(this.pendingCreation);

    if (result && this.pendingCreation) {
      this.closed.emit(result);
      this.pendingCreation = false;
    }
    console.info(result);
  }
}
