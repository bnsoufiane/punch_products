import {Component, Output, EventEmitter} from 'angular2/core';
import {TitleService} from '../../../services/helper/title.service';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserModelService} from '../../../services/model/user.model.service';

@Component({
  selector: 'ar-signup',
  moduleId: module.id,
  templateUrl: 'signup.component.html',
  styleUrls: ['../../../common/stylesheets/pages/auth.css'],
  directives: [ROUTER_DIRECTIVES]
})

export class SignupComponent {
  protected email: string;
  protected password: string;
  protected confirmPassword: string;
  protected firstName: string;
  protected lastName: string;
  protected error: string;
  @Output() goTo = new EventEmitter<any>();
  protected processing: boolean;

  constructor(private pageTitle: TitleService,
              private userModelService: UserModelService,
              private router: Router) {
    pageTitle.setTitle('Signup');
    this.processing = false;

    this.userModelService.subscribe(_ => {
      this.goTo.emit('login');
      this.processing = false;
    }, err => {
      this.error = err._body;
      this.processing = false;
    });
  }

  submit() {
    this.error = '';
    this.processing = true;

    // Reusable and flexible front-end validation method is to be added in
    // common module, following are temporary checks.
    if (!this.firstName || !this.lastName || !this.email || !this.password ||
      !this.confirmPassword || this.password !== this.confirmPassword) {
      this.error = 'Please fix the errors below.';
      return;
    }

    this.userModelService.signup({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    });
  }

  goToLogin() {
    this.goTo.emit('login');
  }
}
