import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'ar-view-portfolio-modal',
  moduleId: module.id,
  templateUrl: 'view-portfolio.modal.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/components/modal.css'],
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES],
})

export class ViewPortfolioModalComponent {

  @Input() showModal:boolean = false;
  @Input() portfolio: any;
  @Output() closed = new EventEmitter<boolean>();

  /**
   * Closes the modal with action canceled
   * @returns {boolean}
   */
  cancelAction(): boolean {
    this.showModal = false;
    this.closed.emit(false);
    return false;
  }
}
