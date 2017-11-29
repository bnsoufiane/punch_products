import {Component, ViewEncapsulation} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {ToolbarComponent} from './toolbar.component';
import {LoggedInRouterOutlet} from '../../services/router/logged-in.router.service';
import {JobsListComponent} from '../jobs-list/jobs-list.component';
import {CompaniesListComponent} from '../companies-list/companies-list.component';
import {BusinessesListComponent} from '../businesses-list/businesses-list.component';
import {CompanyPageComponent} from '../companies-list/company-page.component';
import {BusinessPageComponent} from '../businesses-list/business-page.component';
import {ListsListComponent} from '../lists-list/lists-list.component';
import {ListPageComponent} from '../lists-list/list-page.component';

@Component({
  selector: 'ar-app',
  moduleId: module.id,
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, ToolbarComponent, LoggedInRouterOutlet]
})
@RouteConfig([
  { path: '/companies', redirectTo: ['Home'] },

  { path: '/jobs', name: 'JobsList', component: JobsListComponent },
  { path: '/lists', name: 'ListsList', component: ListsListComponent },
  { path: '/businesses', name: 'BusinessesList', component: BusinessesListComponent },
  { path: '/', name: 'Home', component: CompaniesListComponent },

  { path: '/listPage/:id', name: 'ListPage', component: ListPageComponent },
  { path: '/companyPage/:id', name: 'CompanyPage', component: CompanyPageComponent },
  { path: '/businessPage/:id', name: 'BusinessPage', component: BusinessPageComponent }
])
export class AppComponent {}
