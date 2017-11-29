import {Component, ViewEncapsulation} from 'angular2/core';
import {Router} from 'angular2/router';
import {HeaderComponent} from '../wrapper/wrapper';
import {AuthInfoService} from '../../services/auth/auth.info.service';
import {User} from '../../interfaces/user/user.interface';
import {UserModelService} from '../../services/model/user.model.service';
import {SELECT_DIRECTIVES} from 'ng2-select';
import {CONFIG} from '../../config/config';


@Component({
  moduleId: module.id,
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None,
  directives: [HeaderComponent, SELECT_DIRECTIVES],
  styleUrls: ['../../common/stylesheets/pages/account.css']
})


export class AccountComponent {

  /**
   * Has the current user's data.
   */
  protected user;

  /**
   * Flag to control profile form submission.
   */
  protected updatingProfile: boolean;

  /**
   * Flag to control password form submission.
   */
  protected updatingPassword: boolean;

  /**
   * Holds existing password.
   */
  protected oldPassword: string;

  /**
   * Holds new password.
   */
  protected newPassword: string;

  /**
   * Error message.
   */
  protected error: any;

  constructor(private _authInfoService: AuthInfoService,
              private _router: Router,
              private _userModelService: UserModelService) {
    this.getUser();
    this._subscribe();
    this.updatingPassword = false;
    this.updatingProfile = false;
  }

  /**
   * Submits profile update form.
   */
  updateProfile(user:User) {
    this.updatingProfile = true;
    this._userModelService.update(user);
  }

  /**
   * Submits password update form.
   */
  updatePassword() {
    this.updatingPassword = true;
    this._userModelService.updatePassword({
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    });
  }

  /**
   * Gets current user.
   */
  getUser() {
    this.user = this._authInfoService.getCurrentUser();
  }

  /**
   * Updloads the avatar.
   */
  uploadImage($event): void {
    this._uploadMedia($event.target, CONFIG.LIMITS.IMAGE, CONFIG.ERRORS.IMAGE_TOO_LARGE);
  }

  /**
   * Removes the avatar from the view.
   */
  removeAvatar() {
    delete this.user.avatar;
  }

  connectGoogle() {
    this._userModelService.getGoogleAuth();
  }

  connectLinkedin() {
    this._userModelService.getLinkedInAuth();
  }

  /**
   * @param media
   * @param limit
   * @param error
   */
  private _uploadMedia(media:any, limit:number, error:string) {
    if (media.files[0].size >= (limit * 1000000)) {
      this.error = error;
    } else {
      this.error = '';
      this._userModelService.updateAvatar(media.files[0]);
    }
  }

  /**
   * Subscribes to the necessary observable.
   */
  private _subscribe() {
    this._userModelService.subscribe(data => {
      if(data) {
        if(data.url) {
          window.location.href = data.url;
        } else {
          this._authInfoService.setCurrentUser(data);
          this.getUser();
        }
      }
      this.updatingProfile = false;
      this.updatingPassword = false;
    }, error => {
      this.updatingProfile = false;
      this.updatingPassword = false;
    });
  }

}
