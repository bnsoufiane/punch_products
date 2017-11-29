import {Component, ViewEncapsulation} from 'angular2/core';
import {FooterComponent} from '../wrapper/wrapper';
import {WorkSamplesModalComponent, VideoModalComponent} from '../modals/modals';
import {CandidateModelService} from '../../services/model/candidate.model.service';
import {RouteParams} from 'angular2/router';
import {DateUtils} from '../../../utils/index';
import {TitleService} from '../../services/helper/title.service';

@Component({
  selector: 'ar-candidate-profile',
  moduleId: module.id,
  templateUrl: 'candidate-profile.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/pages/candidate-profile.css'],
  directives: [FooterComponent, WorkSamplesModalComponent, VideoModalComponent],
  providers: [WorkSamplesModalComponent, VideoModalComponent],
  encapsulation: ViewEncapsulation.None
})
export class CandidateProfileComponent {
  showWork:boolean;
  showInterview:boolean;
  interviewSource:string;
  protected candidate:any = {};
  protected workSamples:any[];
  protected companyName;
  protected listOfMonths;
  protected position;
  private _id:string;

  constructor(public fl:WorkSamplesModalComponent,
              private _candidateModelService:CandidateModelService,
              public videofl:VideoModalComponent,
              private _params:RouteParams,
              private pageTitle: TitleService) {
    this.showWork = fl.flag;
    this.showInterview = videofl.flag;
    this._id = this._params.get('id');
    this.listOfMonths = DateUtils.listOfMonths();
    pageTitle.setTitle(this.candidate.fullname || 'Profile');
  }

  /**
   * Initial loading of roles
   */
  ngOnInit() {
    this._candidateModelService.observer$.subscribe(candidates => {
      console.log(candidates);
      this.candidate = candidates;
      this.interviewSource = this.candidate.interviewVideo;
    });
    this.getData_();
  }

  /**
   * Get all required data for component
   * @private
   */
  getData_():void {
    this._existingCandidate(this._id);
  }


  /**
   * Show/hide the modal window for worksamples
   * @param pastCompanyId
   */
  toggleWorkSamplesModal(pastCompanyId?:number) {
    this.showWork = !this.showWork;
    this.workSamples = this.candidate && this.candidate.pastCompanies &&
      this.candidate.pastCompanies[pastCompanyId] && this.candidate.pastCompanies[pastCompanyId].workSamples;
    this.companyName = this.candidate && this.candidate.pastCompanies &&
      this.candidate.pastCompanies[pastCompanyId] && this.candidate.pastCompanies[pastCompanyId].name;
    this.position = this.candidate && this.candidate.pastCompanies &&
      this.candidate.pastCompanies[pastCompanyId] && this.candidate.pastCompanies[pastCompanyId].position;
  }

  /**
   * Show/hide the modal window for interview video
   */
  toggleInterview() {
    this.showInterview = !this.showInterview;
  }

  /**
   * Human readable differenc of dates
   * @param startMonth
   * @param startYear
   * @param endMonth
   * @param endYear
   * @returns {any}
   */
  difference(startMonth:number, startYear:number, endMonth:number, endYear:number):string {
    return DateUtils.difference(+startMonth, +startYear, +endMonth, +endYear);
  }

  /**
   * Remove the http:// https:// from start of url
   * @param url
   * @returns {string}
   */
  protected strippedUrl(url:string):string {
    return url.replace(/.*?:\/\//g, '');
  }
  /**
   * Get list of candidates
   */
  private _existingCandidate(id:string):void {
    this._candidateModelService.view(id);
  }
}
