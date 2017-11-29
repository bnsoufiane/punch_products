import {Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild} from 'angular2/core';
import {FooterComponent} from '../wrapper/wrapper';
import {RouteParams, Router} from 'angular2/router';
import {Candidate} from '../../interfaces/candidates/candidate.interface';
import {Role} from '../../interfaces/candidates/role.interface';
import {Proposal} from '../../interfaces/proposals/proposal.interface';
import {Portfolio} from '../../interfaces/proposals/portfolio.interface';
import {BreakdownTable} from '../../interfaces/proposals/breakdown-table.interface';
import {CONFIG} from '../../config/config';
import {CandidateModelService} from '../../services/model/candidate.model.service';
import {ProposalModelService} from '../../services/model/proposal.model.service';
import {TitleService} from '../../services/helper/title.service';
import {RoleTextPipe} from '../../pipes/role-text.pipe';
import {DatePipe} from 'angular2/common';
import {RoleModelService} from '../../services/model/role.model.service';
import {ViewPortfolioModalComponent} from '../modals/view-portfolio.modal.component';
import {CAROUSEL_DIRECTIVES, DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';
import {PageScroll, PageScrollConfig} from 'ng2-page-scroll';
import {ScrollSpyDirective, ScrollSpyService} from 'ng2-scrollspy';
import {DateUtils} from '../../../utils/index';


@Component({
  selector: 'ar-candidate-profile',
  moduleId: module.id,
  templateUrl: 'proposal-live.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/pages/proposal-live.css',
              '../../../css/admin/assets/stylesheets/components/list.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [FooterComponent, ViewPortfolioModalComponent, PageScroll, ScrollSpyDirective, DROPDOWN_DIRECTIVES,
    CAROUSEL_DIRECTIVES],
  pipes: [RoleTextPipe, DatePipe]
})

export class ProposalLiveComponent implements OnInit, AfterViewInit {
  /**
   * Reference to div #sections in template
   */
  @ViewChild('sections') sections;
  /**
   * Proposal object
   */
  proposal: Proposal;
  /**
   * Proposal date
   */
  proposalDate: any;
  /**
   * Array of Candidate Objects to hold candidates returned by API
   */
  candidates: Candidate[] = [];
  /**
   * Array of Role Objects to hold roles returned by API
   */
  roles: Role[] = [];
  /**
   * Array of Candidate Objects to hold candidates related to proposal
   */
  selectedCandidates: Candidate[] = [];
  selectedSamples: Portfolio[] = [];
  samples: Portfolio[] = CONFIG.PORTFOLIO_SAMPLES;
  currentAnchor = 'Overview';
  selectedPortfolio: any;
  showPortfolioModal = false;
  testimonials: Array<any> = CONFIG.TESTIMONIALS;
  private id:string;
  private title:string = '';
  private scrollTimeout:any = null;

  constructor(private _candidateModelService:CandidateModelService,
              private _roleModelService:RoleModelService,
              private _proposalModelService:ProposalModelService,
              private _params:RouteParams,
              private _router:Router,
              private _scrollSpyService:ScrollSpyService,
              private pageTitle:TitleService) {
    this.id = this._params.get('id');
    PageScrollConfig.defaultScrollOffset = 50;
    PageScrollConfig.defaultDuration = 600;
  }

  /**
   * Initial loading of roles
   */
  ngOnInit() {
    this.pageTitle.setTitle(this.title);
    this._roleModelService.observer$.subscribe(roles => this.roles = roles);
    this._candidateModelService.observer$.subscribe(candidates => {
      this.candidates = candidates;
      this.selectedCandidates = [];
      for(let candidate of this.candidates) {
        if(this.proposal.candidate_ids && this.proposal.candidate_ids.indexOf(candidate._id) !== -1)
          this.selectedCandidates.push(candidate);
      }
    });
    this._roleModelService.list();
    this._proposalModelService.fresh().then(proposal => this.proposal = proposal);
    if(this.id) {
      this._proposalModelService.view(this.id);
    } else {
      this._candidateModelService.list();
    }
    this._subscribe();
  }

  /**
   * Updating active navbar element as you scroll
   */
  ngAfterViewInit() {
    this._scrollSpyService.getObservable('window').subscribe((e: any) => {
      if(this.scrollTimeout)
        clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(function () {
        let doc = e.target.documentElement;
        let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        this.activateCurrentSection(top);
      }.bind(this), 200);
    });
  }

  /**
   * setting current anchor depending on scroll position
   * @param currentPos
     */
  protected activateCurrentSection(currentPos:number):void {
    let sectionsTop = [];
    for(let section of this.sections.nativeElement.getElementsByClassName('proposal-section')) {
      let top = section.getBoundingClientRect().bottom - document.body.getBoundingClientRect().top;
      sectionsTop.push({top:top, id:section.getAttribute('id')});
    }
    for(let section of sectionsTop) {
      if(section.top > currentPos) {
        this.currentAnchor = section.id;
        break;
      }
    }
  }

  /**
   * return table with only content to display in template
   * @param breakdownTable
   * @returns {{row: string[]}[]|T[]}
     */
  protected getTableContent(breakdownTable:BreakdownTable): Array<{row: string[]}> {
    let table = breakdownTable.table.slice(0);
    table.shift();
    return table;
  }

  /**
   * navigate to candidate page
   * @param id
   */
  onViewCandidate(id:string) {
    this._router.navigate(['CandidateProfile', {'id': id}]);
  }

  /**
   * Gets the currently active anchor from nav bar.
   * @param {string} anchor
   * @returns {boolean}
   */
  protected getActive(anchor: string): boolean {
    return this.currentAnchor === anchor;
  }

  /**
   * Show/hides the view-portfolio-modal
   * @param sample The sample portfolio object.
   */
  protected togglePortfolioModal(sample:any) {
    if(sample) {
      this.selectedPortfolio = sample;
    }
    this.showPortfolioModal = !this.showPortfolioModal;
  }

  /**
   * Subscribe to necessary services
   * @private
   */
  private _subscribe() {
    this._proposalModelService.observer$.subscribe((proposal:any) => {
      this._candidateModelService.list();
      this.proposal = proposal;
      this.proposalDate = new Date(Date.parse(proposal.createdAt));
      let monthNames = DateUtils.listOfMonths();

      this.proposalDate = monthNames[this.proposalDate.getMonth()] + ' '
        + this.proposalDate.getDate() +', '+ this.proposalDate.getFullYear();

      this.title = proposal.name;
      this.pageTitle.setTitle(this.title);
      this.selectedSamples = [];
      for(let sample of this.samples) {
        if(proposal.portfolio_ids && proposal.portfolio_ids.indexOf(sample._id) !== -1)
          this.selectedSamples.push(sample);
      }
    }, err => console.log('GOT error in component', err));
  }
}
