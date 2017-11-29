import {Component, Output, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {AuthService} from '../../../services/auth/auth.service';
import {TitleService} from '../../../services/helper/title.service';
import {CONFIG} from '../../../config/config';

@Component({
  selector: 'ar-login',
  moduleId: module.id,
  templateUrl: 'login.component.html',
  styleUrls: ['../../../common/stylesheets/pages/auth.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class LoginComponent {
  protected email:string;
  protected password:string;
  protected error:string;
  @Output() goTo = new EventEmitter<any>();

  constructor(private _authService:AuthService,
              private router:Router, private pageTitle: TitleService) {
    pageTitle.setTitle('Login');
  }

  onSubmit() {
    this._authService.login(this.email, this.password).subscribe(result => {
      console.log(result);
      if (result) {
        window.location.href = CONFIG.PRODUCTS.PUNCH_DATA + `?auth=${result.token}`;
      }
    }, err => {
      console.log(err);
      this.error = err._body;
    });
  }

  goToSignup() {
    this.goTo.emit('signup');
  }
}
