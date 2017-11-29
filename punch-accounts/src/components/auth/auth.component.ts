import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import * as _ from 'lodash';

@Component({
  moduleId: module.id,
  templateUrl: './auth.component.html',
  styleUrls: ['../../common/stylesheets/pages/auth.css'],
  directives: [LoginComponent, SignupComponent]
})

export class AuthComponent {
  protected children = {
    login: {path: '/login', name: 'Login', active: false},
    signup: {path: '/signup', name: 'Signup', active: false}
  };
  protected login: boolean;
  protected signup: boolean;
  protected forgotPassword: boolean;

  constructor(private router: Router) {
    //TODO(irtazabbas): This method is implemented to created nested views functionality.
    //This functionality is native in the later versions of angular2's router.
    //Following piece of code tries to get the current route name using path.location.
    //This functionality is also avaiable in later versions of angular2's router
    //through router.url property. Should be updated if moved to later versions.
    switch (location.pathname) {
      case this.children.login.path:
        this.children.login.active = true;
        break;
      case this.children.signup.path:
        this.children.signup.active = true;
        break;
      default:
        this.children.login.active = true;
        break;
    }
  }

  /**
   * Switches child.
   */
  goTo(child) {
    _.forIn(this.children, (value, key) => {
      this.children[key].active = child === key;
    });
    this.router.navigate([this.children[child].name]);
  }
}
