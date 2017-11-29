import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {UserModelService} from '../../services/model/user.model.service';
import {AuthInfoService} from '../../services/auth/auth.info.service';


@Component({
  moduleId: module.id,
  templateUrl: './oauth.component.html'
})

export class GoogleOAuthComponent {
  private _code: string;

  constructor(private _router: Router,
              private _routeParams: RouteParams,
              private _userModelService: UserModelService,
              private _authInfoService: AuthInfoService) {
    this._code = this._routeParams.get('code');
    if(!this._code) {
      this._router.navigate(['Account']);
    } else {
      this._subscribe();
      this._userModelService.connectToGoogle(this._code);
    }
  }

  private _subscribe() {
    this._userModelService.subscribe(data => {
      if(data) {
        this._authInfoService.setCurrentUser(data);
        this._router.navigate(['Account']);
      }
    }, err => {
      console.log('error gauth: ', err);
      this._router.navigate(['Account']);
    });
  }
}
