import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {UserModelService} from '../../../services/model/user.model.service';

@Component({
  moduleId: module.id,
  templateUrl: 'confirmation.component.html'
})

export class ComfirmationComponent implements OnInit {
  protected token: string;
  protected error: string;

  constructor(private router: Router,
              private routeParams: RouteParams,
              private userModelService: UserModelService) {
    this.userModelService.subscribe(() => {
      this.router.navigate(['Login']);
    }, err => {
      console.log('ERROR confirming: ', err);
      this.error = 'ERROR CONFIRMING';
    });
  }

  ngOnInit() {
    this.token = this.routeParams.params['tk'];
    if (!this.token) {
      this.router.navigate(['Login']);
    }

    this.userModelService.confirm(this.token);
  }
}
