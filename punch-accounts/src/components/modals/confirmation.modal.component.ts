import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';

/**
 * Shows the confirmation modal dialog with yes or no option
 */
@Component({
  selector: 'ar-confirmation-modal',
  moduleId: module.id,
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'confirmation.modal.component.html',
  styleUrls: ['../../common/stylesheets/components/modal.css']
})
export class ConfirmationModalComponent {
  @Input() showModal:boolean = false;
  @Input() message:string;
  @Input() cancelLabel:string = 'Cancel';
  @Input() positiveLabel:string = 'Ok';
  @Output() closed = new EventEmitter<boolean>();

  /**
   * Closes the modal with action confirmed
   * @returns {boolean}
   */
  positiveAction() {
    this.showModal = false;
    this.closed.emit(true);
    return false;
  }

  /**
   * Closes the modal with action canceled
   * @returns {boolean}
   */
  cancelAction() {
    this.showModal = false;
    this.closed.emit(false);
    return false;
  }
}
