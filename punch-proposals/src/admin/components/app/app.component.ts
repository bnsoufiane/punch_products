import {Component, ViewEncapsulation} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {ToolbarComponent} from './toolbar.component';
import {CandidateDetailComponent} from '../candidate-detail/candidate-detail.component';
import {CandidateListComponent} from '../candidate-list/candidate-list.component';
import {LoginComponent} from '../login/login.component';
import {CandidateProfileComponent} from '../candidate-profile/candidate-profile.component';
import {LoggedInRouterOutlet} from '../../services/router/logged-in.router.service';
import {ProposalListComponent} from '../proposal-list/proposal-list.component';
import {ProposalDetailComponent} from '../proposal-detail/proposal-detail.component';
import {ProposalLiveComponent} from '../proposal-live/proposal-live.component';
import {JobListComponent} from '../job-list/job-list.component';
import {CompaniesListComponent} from '../companies-list/companies-list.component';

@Component({
  selector: 'ar-app',
  moduleId: module.id,
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, ToolbarComponent, LoggedInRouterOutlet]
})
@RouteConfig([
  { path: '/', redirectTo: ['Home']  },

  { path: '/candidate-detail/:id', name: 'CandidateDetailEdit', component: CandidateDetailComponent },
  { path: '/candidate-detail', name: 'CandidateDetailAdd', component: CandidateDetailComponent },

  { path: '/proposal-list', name: 'Home',  component: ProposalListComponent  },
  { path: '/proposal-detail/:id', name: 'ProposalDetailEdit', component: ProposalDetailComponent },
  { path: '/proposal-detail', name: 'ProposalDetailAdd', component: ProposalDetailComponent },

  { path: '/admin/login', name: 'Login', component: LoginComponent },
  { path: '/candidate/:id', name: 'CandidateProfile', component: CandidateProfileComponent },
  { path: '/candidate', name: 'UserPage', component: CandidateProfileComponent },

  { path: '/proposal-live/:id', name: 'ProposalLive', component: ProposalLiveComponent },
])
export class AppComponent {}
