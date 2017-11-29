import {Component, OnInit, ViewEncapsulation} from 'angular2/core';
import {HeaderComponent} from '../wrapper/wrapper';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CandidateModelService} from '../../services/model/candidate.model.service';
import {RoleModelService} from '../../services/model/role.model.service';
import {Candidate, Role} from '../../interfaces/interfaces';
import {TitleService} from '../../services/helper/title.service';
import {TableGridToggleComponent} from '../list-controls/table-grid-toggle.component';
import {ListSearchComponent} from '../list-controls/list-search.component';
import {CandidateSidebarComponent} from './candidate-sidebar.component';
import {CandidateTableComponent} from './candidate-table.component';
import {CandidateGridComponent} from './candidate-grid.component';

@Component({
  selector: 'ar-candidate-list',
  moduleId: module.id,
  templateUrl: './candidate-list.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/components/list.css',
    '../../../css/admin/assets/stylesheets/pages/candidate-list.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [HeaderComponent, ROUTER_DIRECTIVES, TableGridToggleComponent, ListSearchComponent,
               CandidateSidebarComponent, CandidateTableComponent, CandidateGridComponent]
})
export class CandidateListComponent implements OnInit {
  /**
   * List of all candidates fetched from db
   */
  protected candidates:Candidate[];
  /**
   * List of all roles fetched from db
   */
  protected roles:Role[];
  currentListType = 'grid';

  constructor(private _candidateModelService:CandidateModelService,
              private _roleModelService:RoleModelService,
              private _router:Router,
              private pageTitle:TitleService) {

  }

  /**
   * Initial loading of candidates and roles
   */
  ngOnInit() {
    this._roleModelService.observer$.subscribe(roles => this.roles = roles );
    this._candidateModelService.observer$.subscribe(candidates => this.candidates = candidates);
    this.getData_();
    this.pageTitle.setTitle('Candidates');
  }

  /**
   * Get all required data for component
   * @private
   */
  getData_() {
    this.getCandidates();
    this.listRoles();
  }

  /**
   * Initiate the model service to load roles
   */
  listRoles() {
    this._roleModelService.list();
  }

  /**
   * Get list of candidates
   */
  getCandidates() {
    this._candidateModelService.list();
  }

  /**
   *
   * @param id
   */
  viewProfile(id:string) {
    this._router.navigate(['CandidateProfile', {'id': id}]);
  }
  /**
   *
   * @param id
   */
  viewDetail(id:string) {
    this._router.navigate(['CandidateDetailEdit', {'id': id}]);
  }
}
