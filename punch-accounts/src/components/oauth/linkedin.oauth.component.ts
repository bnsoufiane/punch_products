import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {UserModelService} from '../../services/model/user.model.service';
import {AuthInfoService} from '../../services/auth/auth.info.service';


@Component({
  moduleId: module.id,
  templateUrl: './oauth.component.html'
})

export class LinkedinOAuthComponent {
  private _code: string;

  constructor(private _router: Router,
              private _routeParams: RouteParams,
              private _userModelService: UserModelService,
              private _authInfoService: AuthInfoService) {
    this._code = this._routeParams.get('code');
    console.log('CODE: ', this._code);
    if(!this._code) {
      this._router.navigate(['Account']);
    } else {
      this._subscribe();
      this._userModelService.connectToLinkedin(this._code);
    }
  }

  private _subscribe() {
    this._userModelService.subscribe(data => {
      console.log('in linkedin component');
      if(data) {
        this._authInfoService.setCurrentUser(data);
        this._router.navigate(['Account']);
      }
    }, err => {
      console.log('error linkedin oauth: ', err);
      this._router.navigate(['Account']);
    });
  }
}
