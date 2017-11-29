import {Component, OnInit, ViewEncapsulation} from 'angular2/core';
import {HeaderComponent} from '../wrapper/wrapper';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {TitleService} from '../../services/helper/title.service';
import {Proposal} from '../../interfaces/proposals/proposal.interface';
import {TableGridToggleComponent} from '../list-controls/table-grid-toggle.component';
import {ListSearchComponent} from '../list-controls/list-search.component';
import {ProposalTableComponent} from './proposal-table.component';
import {ProposalGridComponent} from './proposal-grid.component';
import {ProposalModelService} from '../../services/model/proposal.model.service';

@Component({
  selector: 'ar-proposal-list',
  moduleId: module.id,
  templateUrl: './proposal-list.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/components/list.css',
  '../../../css/admin/assets/stylesheets/pages/proposal-list.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [HeaderComponent, ROUTER_DIRECTIVES, TableGridToggleComponent, ListSearchComponent,
    ProposalTableComponent, ProposalGridComponent]
})
export class ProposalListComponent implements OnInit {
  proposals:Proposal[] = [];
  currentListType = 'grid';

  constructor(private _proposalModelService:ProposalModelService,
              private pageTitle:TitleService,
              private _router:Router) {
  }

  /**
   * Initial loading of roles
   */
  ngOnInit() {
    this._proposalModelService.observer$.subscribe(proposals => this.proposals = proposals);
    this._proposalModelService.list();
    this.pageTitle.setTitle('Proposals');
  }

  /**
   *
   * @param id
   */
  viewProposal(id:string) {
    this._router.navigate(['ProposalLive', {'id': id}]);
  }
  /**
   *
   * @param id
   */
  editProposal(id:string) {
    this._router.navigate(['ProposalDetailEdit', {'id': id}]);
  }
}
