import {Component, ViewEncapsulation} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
import {ToolbarComponent} from './toolbar.component';
import {AuthComponent} from '../auth/auth.component';
import {ComfirmationComponent} from '../auth/signup/confirmation.component';
import {LoggedInRouterOutlet} from '../../services/router/logged-in.router.service';
import {AccountComponent} from '../account/account.component';
import {SubscriptionComponent} from '../subscription/subscription.component';
import {GoogleOAuthComponent} from '../oauth/google.oauth.component';
import {LinkedinOAuthComponent} from '../oauth/linkedin.oauth.component';

@Component({
  selector: 'ar-app',
  moduleId: module.id,
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, ToolbarComponent, LoggedInRouterOutlet]
})
@RouteConfig([
  { path: '/', redirectTo: ['Login'] },

  { path: '/login', name: 'Login', component: AuthComponent },

  { path: '/signup', name: 'Signup', component: AuthComponent },

  { path: '/confirm', name: 'Confirmation', component: ComfirmationComponent },

  { path: '/account', name: 'Account', component: AccountComponent },

  { path: '/subscription', name: 'Subscription', component: SubscriptionComponent },

  { path: '/oauth/google', name: 'GoogleOAuth', component: GoogleOAuthComponent },

  { path: '/oauth/linkedin', name: 'LinkedinOAuth', component: LinkedinOAuthComponent }
])
export class AppComponent {}
