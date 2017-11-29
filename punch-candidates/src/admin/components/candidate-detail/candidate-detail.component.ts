import {Component, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, COMMON_DIRECTIVES} from 'angular2/common';
import {HeaderComponent, SidebarComponent} from '../wrapper/wrapper';
import {ROUTER_DIRECTIVES, RouteParams, Router, CanDeactivate, ComponentInstruction} from 'angular2/router';
import {Candidate} from '../../interfaces/interfaces';
import {SELECT_DIRECTIVES} from 'ng2-select';
import {CandidateModelService} from '../../services/model/candidate.model.service';
import {RoleModelService} from '../../services/model/role.model.service';
import {ArrayUtils, ObjectUtils, DateUtils} from '../../../utils/index';
import {CONFIG} from '../../config/config';
import {TitleService} from '../../services/helper/title.service';
import {HttpService} from '../../services/http/http.service';
import * as _ from 'lodash';
import {ConfirmationModalComponent} from '../modals/confirmation.modal.component';


@Component({
  selector: 'ar-add-candidate',
  moduleId: module.id,
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/pages/candidate-detail.css'],
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, HeaderComponent,
    SidebarComponent, ROUTER_DIRECTIVES, SELECT_DIRECTIVES,
    COMMON_DIRECTIVES, ConfirmationModalComponent],
})
export class CandidateDetailComponent implements OnInit, CanDeactivate {
  /**
   * Flag to control the confirmation modal
   */
  protected showModal:boolean;
  /**
   * Flag for showing exit page confirm modal
   */
  protected showPageExitConfirmModal:boolean = false;
  /**
   * Promise resolve function for exit page confirm modal
   */
  protected exitResolvePromise:Function;
  /**
   * Two way bound candidate object
   */
  protected candidate:any;
  /**
   * List of roles from database
   */
  protected roles:any[];
  /**
   * Array used to display pre-selected roles in edit form
   */
  protected initRoles:any[];
  /**
   * Image holders to show previews
   * @type {{}}
   */
  protected previews:Object = {};
  /**
   * Date used in generating dropdowns for
   * start and end dates of previous company
   * @type {{}}
   */
  protected DATE:Object = {};

  /**
   * Flag for form submission
   * @type {boolean}
   */
  protected submitted:boolean;
  /**
   * Flag to notify that form is in the process of uploading
   * @type {boolean}
   */
  protected isUploading:boolean = false;
  /**
   * Error message, will be displayed on top of form
   */
  protected error:any;

  /**
   * Id of candidate
   */
  protected id:string;
  /**
   * Edit or add
   */
  protected formType:string;
  /**
   * Title of page
   */
  protected title:string;
  /**
   * Interview video url
   */
  protected videoUrl:string;
  /**
   * Flag for currently works here checkbox
   */
  protected currentlyWorksHereCheckBok:boolean[] = [false, false, false];
  /**
   * contains images in base64 format to use for PDF
   */
  base64Images = {
    logo: '',
    profile: '',
    companyLogos: ['', '', '']
  };

  /**
   * Constructor
   * @param _candidateModelService
   * @param _roleModelService
   * @param _params
   * @param _title
   * @param _router
   */
  constructor(private _candidateModelService:CandidateModelService,
              private _roleModelService:RoleModelService,
              private _params:RouteParams,
              private _title:TitleService,
              private _router:Router,
              private _httpService:HttpService) {
    this.id = this._params.get('id');
    this.formType = _.isEmpty(this.id) ? 'add' : 'edit';
    this.title = `${_.upperFirst(this.formType)} Candidate`;
    this._getData();
  }

  /**
   * Initial loading of data
   */
  ngOnInit():void {
    this._subscribe();
    this.listRoles();
    this._title.setTitle(this.title);

    window.onbeforeunload = function (e: any) {
      let message:string = 'Are you sure you wanna exit this page?';
      e = e || window.event;

      if (e) {
        e.returnValue = message;
      }

      return message;
    };
  }

  /**
   *
   * @param nextInstruction
   * @param prevInstruction
   * @returns {Promise<boolean>}
   */
  routerCanDeactivate(nextInstruction:ComponentInstruction, prevInstruction:ComponentInstruction):boolean|Promise<boolean> {
    if(this.submitted) {
      this.submitted = false;
      window.onbeforeunload = null;
      return true;
    } else {
      this.showPageExitConfirmModal = true;
    }

    return new Promise<boolean>(function(resolve) {
      this.exitResolvePromise = resolve;
    }.bind(this));
  }

  /**
   * confirm exit page action
   * @param confirmed
   */
  confirmExitPage(confirmed:boolean): void {
    this.showPageExitConfirmModal = false;
    if(confirmed)
      window.onbeforeunload = null;
    this.exitResolvePromise(confirmed);
  }

  /**
   * Initiate the model service to load roles
   */
  listRoles():void {
    this._roleModelService.list();
  }

  /**
   * Submit candidate to backend
   * @param candidate
   */
  onSubmit(candidate:Candidate):void {
    if (this.rolesNotProvided()) return; //roles are required
    this.isUploading = true;
    this._candidateModelService.upload(candidate, this.formType);
  }

  /**
   * Get empty candidate
   */
  setCandidate():void {
    this._candidateModelService.fresh()
      .then(candidate => this.candidate = candidate);
  }

  /**
   * Add role
   * @param value
   */
  selected(value:any):void {
    this.candidate.roles.push(value.id);
  }

  /**
   * Remove role
   * @param value
   */
  removed(value:any):void {
    ArrayUtils.remove(this.candidate.roles, value.text);
  }

  /**
   * Invoked by image input fields
   * @param $event
   */
  uploadImage($event):void {
    this._uploadMedia($event.target, CONFIG.LIMITS.IMAGE, CONFIG.ERRORS.IMAGE_TOO_LARGE);
  }

  /**
   * Invoked by video input fields
   * @param $event
   */
  uploadVideo($event):void {
    this._uploadMedia($event.target, CONFIG.LIMITS.VIDEO, CONFIG.ERRORS.VIDEO_TOO_LARGE);
  }

  /**
   * Validates the roles multi select field
   * @returns {boolean}
   */
  rolesNotProvided():boolean {
    return _.isEmpty(this.candidate.roles) && this.submitted;
  }

  /**
   * Remove CDN urls
   */
  removeAvatar():void {
    delete this.candidate.avatar;
  }

  /**
   * Remove CDN urls
   * @param company
   */
  removeCompanyLogo(company:number):void {
    delete this.candidate.pastCompanies[company].logo;
  }

  /**
   * Remove cdn urls
   * @param company
   * @param sample
   */
  removeCompanySample(company:number, sample:number):void {
    delete this.candidate.pastCompanies[company].workSamples[sample];
  }
  /**
   * Removes the image preview
   * @param name
   */
  removePreview(name):void {
    ObjectUtils.remove(this.previews, name);
    ObjectUtils.remove(this.candidate, name);
  }

  /**
   * The name of image file holder for company logo
   * @param i
   * @returns {string}
   */
  companyLogo(i):string {
    return 'company'.concat(i).concat('_logo');
  }

  /**
   * The name of image file holder for company work sample
   * @param i
   * @param j
   * @returns {string}
   */
  companyWorkSample(i, j):string {
    return 'company'.concat(i).concat('_worksample').concat(j);
  }

  /**
   * Date used in generating dropdowns for
   * start and end dates of previous company
   */
  setDate():void {
    this._candidateModelService.date()
      .then(date => this.DATE = date);
  }

  /**
   * Flag to check roles are ready to load in form
   * @returns {boolean}
   */
  protected areRolesReady():boolean {
    return this.formType === 'add' ?
      !_.isEmpty(this.roles) : !_.isEmpty(this.initRoles);
  }

  /**
   * Deleting the candidate after confirmation
   */
  protected showConfirmation():void {
    this.showModal = true;
  }

  /**
   * The checkbox sets the end date to either current daate or default
   * @param index
   */
  protected setEndDate(index:number):void {
    this.currentlyWorksHereCheckBok[index] = !this.currentlyWorksHereCheckBok[index];
    if (this.currentlyWorksHereCheckBok[index]) {
      this.candidate.pastCompanies[index].workEndMonth = +DateUtils.today('MM');
      this.candidate.pastCompanies[index].workEndYear = DateUtils.today('YYYY');
    } else {
      this.candidate.pastCompanies[index].workEndMonth = 0;
      this.candidate.pastCompanies[index].workEndYear = 0;
    }
  }

  /**
   * Delete the candidate if confirmed
   * @param confirmed
   */
  protected destroy(confirmed:boolean):void {
    this.showModal = false;
    if (confirmed && this.candidate._id) {
      this.submitted = true;
      this._candidateModelService.destroy(this.candidate._id);
    }
  }

  /**
   * copies link for live proposal to clipboard
   */
  copyLiveURLToClipboard(): void {
    let temp = document.createElement('input');
    document.body.appendChild(temp);
    temp.value = window.location.href.replace('admin/candidate-detail', 'candidate');
    temp.select();
    document.execCommand('copy');
    temp.parentNode.removeChild(temp);
  }

  /**
   * checks if browser supports copying to clipboard
   * @returns {boolean}
   */
  canCopy(): boolean {
    return document.queryCommandSupported('copy');
  }

  difference(startMonth:number, startYear:number, endMonth:number, endYear:number):string {
    return DateUtils.difference(+startMonth, +startYear, +endMonth, +endYear);
  }

  /**
   * Get necessary data
   * @private
   */
  private _getData():void {
    this._freshCandidate();
    if (this.id) { this._existingCandidate(this.id); }
    this.setDate();
  }

  /**
   * Get empty candidate
   */
  private _freshCandidate():void {
    this._candidateModelService.fresh()
      .then(candidate => this.candidate = candidate);
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
      this._loadPreview(media);
    }
  }

  /**
   * Load the image preview in this.previews object
   * Name of file input filed is key of object
   * Value is image
   * @param inputValue
   */
  private _loadPreview(inputValue:any):void {
    let file:File = inputValue.files[0];
    let myReader:FileReader = new FileReader();
    this.candidate[inputValue.name] = file;
    myReader.addEventListener('load', (event:any) =>
        this.previews[inputValue.name] = event.target.result,
      false);
    myReader.readAsDataURL(file);
  }

  /**
   * Get existing candidate
   */
  private _existingCandidate(id:string):void {
    this._candidateModelService.view(id);
  }

  /**
   * Subscribe to necessary services
   * @private
   */
  private _subscribe() {
    this._roleModelService.observer$.subscribe(roles => {
      this.roles = roles;
      //The roles and candidates response, any of them can come first, we cannot guarantee
      //any order, and since here we need both the roles and candidates, so we are
      //writing this piece of code on both sides. Ideally this should not happen. There
      //has to have a way like promise.all() in observalbes, but could not find yet.
      if (this.roles && this.candidate.roles) {
        this.initRoles = _.intersectionWith(this.roles, this.candidate.roles,
          (role, cRole) => role.id === cRole);
      }
    }, err => console.error('component roles', err));

    //TODO(hhsadiq): Show the errors in html when candidate is saved
    this._candidateModelService.observer$.subscribe((candidate:any) => {
      this.isUploading = false;
      this.candidate = candidate;
      this.videoUrl = candidate.interviewVideo;
      if (this.roles && this.candidate.roles) {
        this.initRoles = _.intersectionWith(this.roles, this.candidate.roles,
          (role, cRole) => role.id === cRole);
      }
      if (this.submitted) {
        this._router.navigate(['Home']);
      }
    }, err => console.log('GOT error in component', err));
  }


}
