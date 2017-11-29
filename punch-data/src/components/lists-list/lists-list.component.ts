import {Component, OnInit, ViewEncapsulation} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {HeaderComponent} from '../wrapper/header.component';
import {ListModelService} from '../../services/model/list.model.service';
import {List} from '../../common/interfaces/list/list.interface';
import {TitleService} from '../../services/helper/title.service';
import {ListPaginationComponent} from '../list-controls/list-pagination.component';
import {ListSearchComponent} from '../list-controls/list-search.component';
import {QueryFilterPipe} from '../../pipes/query-filter.pipe';
import {FormatDatePipe} from '../../pipes/format-date.pipe';
import {PaginatePipe, IPaginationInstance} from 'ng2-pagination/index';
import {LocalStorageService} from '../../services/storage/storage.service';
import {CONFIG} from '../../config/config';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {ConfirmationModalComponent} from '../modals/confirmation.modal.component';
import {CreateListModalComponent} from "../modals/create-list-modal.component";

@Component({
  selector: 'ar-lists-list',
  moduleId: module.id,
  templateUrl: './lists-list.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../common/stylesheets/components/list.css', '../../common/stylesheets/pages/lists-list.css'],
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, HeaderComponent, ListSearchComponent, ListPaginationComponent,
    ConfirmationModalComponent, CreateListModalComponent],
  pipes: [QueryFilterPipe, PaginatePipe, FormatDatePipe]
})

export class ListsListComponent implements OnInit {
  //selection of textual search using queryTargets. see below
  query;

  /**
   * List of company attributes to search in
   */
  queryTargets:string[] = ['name'];

  /**
   * List of lists fetched from db
   */
  lists:List[] = [];

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
   * logged in user ID
   */
  protected currentUserId:string = null;
  /**
   * confirm modal toggle
   */
  showConfirmModal: boolean = false;
  /**
   * Flag to show/hide create list modal
   * @type {boolean}
   */
  protected showCreateListModal:boolean = false;
  /**
   * list to delete
   */
  listToDelete: string = null;

  /**
   * currentPAge object for pagination
   */
  currentPage:IPaginationInstance = {
    id: 'listsTable',
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
   * @param _listModelService
   * @param _localStorageService
   * @param _router
   * @param pageTitle
   */
  constructor(private _listModelService:ListModelService,
              private _localStorageService:LocalStorageService,
              private _router:Router,
              private pageTitle:TitleService) {
    this.currentUserId = this._localStorageService.get(CONFIG.STORAGE_KEYS.CURRENT_USER)['_id'];
    if (!this.currentUserId) {
      console.log('could not get userId, will not be able to get/create/update lists');
    }
  }

  /**
   * navigate to list page
   * @param id
   */
  onViewList(id) {
    this._router.navigate(['ListPage', {'id': id}]);
  }

  /**
   * updating number of results per page
   * @param choice
   */
  updateResultsPerPage(choice) {
    if (choice) {
      this.currentPage.itemsPerPage = choice['value'];
    } else {
      this.currentPage.itemsPerPage = CONFIG.PAGINATION.ITEMS;
    }
  }

  /**
   * Show Delete list modal, and set the list to delete
   * @param list
   */
  showDeleteListModal(list) {
    this.listToDelete = list._id;
    this.showConfirmModal = !this.showConfirmModal;
  }

  /**
   * confirm deleting companies from list
   * @param confirmed
   */
  confirmDelete(confirmed) {
    if (confirmed && this.listToDelete) {
      this._listModelService.destroy(this.listToDelete);
      this.listToDelete = null;
    }
    this.showConfirmModal = false;
  }

  /**
   * add the created list to the lists list
   * @param list
   */
  listCreated(list) {
    if (list) {
      console.warn('_____ listCreated ________');
      console.warn(list);
      console.warn('_____ listCreated ________');
      //this.lists.push(list);
    }
    this.showCreateListModal = false;
  }

  /**
   * Initial loading of lists and setting page title
   */
  ngOnInit() {
    this._listModelService.observer$.subscribe(result => this._subscribe(result));
    this._listModelService.query({userId:this.currentUserId});
    this.pageTitle.setTitle('Lists');
  }

  /**
   * Handle result data
   * @param result
   */
  protected _subscribe(result):any {
    console.warn('_____ lists subscribe ________');
    console.warn(result);
    console.warn('_____ lists subscribe ________');
    this.lists = result;
  }
}
