import {Component, ViewEncapsulation} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {ToolbarComponent} from './toolbar.component';
import {CandidateDetailComponent} from '../candidate-detail/candidate-detail.component';
import {CandidateListComponent} from '../candidate-list/candidate-list.component';
import {LoginComponent} from '../login/login.component';
import {CandidateProfileComponent} from '../candidate-profile/candidate-profile.component';
import {LoggedInRouterOutlet} from '../../services/router/logged-in.router.service';

@Component({
  selector: 'ar-app',
  moduleId: module.id,
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, ToolbarComponent, LoggedInRouterOutlet]
})
@RouteConfig([
  { path: '/', redirectTo: ['Home']  },
  { path: '/admin', redirectTo: ['Home']  },

  { path: '/admin/candidate-list', name: 'Home',  component: CandidateListComponent  },
  { path: '/admin/candidate-detail/:id', name: 'CandidateDetailEdit', component: CandidateDetailComponent },
  { path: '/admin/candidate-detail', name: 'CandidateDetailAdd', component: CandidateDetailComponent },

  { path: '/admin/login', name: 'Login', component: LoginComponent },
  { path: '/candidate/:id', name: 'CandidateProfile', component: CandidateProfileComponent },
  { path: '/candidate', name: 'UserPage', component: CandidateProfileComponent },
])
export class AppComponent {}
