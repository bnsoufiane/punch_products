import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {AuthService} from '../../services/auth/auth.service';
import {TitleService} from '../../services/helper/title.service';

@Component({
  selector: 'login',
  moduleId: module.id,
  templateUrl: 'login.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/pages/auth.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class LoginComponent {
  protected username:string;
  protected password:string;
  protected error:string;

  constructor(private _authService:AuthService,
              private router:Router, private pageTitle: TitleService) {
    pageTitle.setTitle('Login');
  }

  onSubmit(email, password) {
    this._authService.login(email, password).subscribe(result => {
      console.log(result);
      if (result) {
        this.router.navigate(['Home']);
      }
    }, err => {
      console.log(err);
      this.error = err._body;
    });
  }
}
