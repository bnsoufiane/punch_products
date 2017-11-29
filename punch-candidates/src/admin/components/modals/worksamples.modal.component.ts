import {Component, Input, Output, EventEmitter, OnChanges} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'ar-worksamples-modal',
  moduleId: module.id,
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'worksamples.modal.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/components/modal.css']
})
export class WorkSamplesModalComponent implements OnChanges {
  @Input() flag;
  @Input() workSamples:any[];
  @Input() companyName;
  @Input() position;
  @Output() closed = new EventEmitter();
  protected selectedWorkSample:any = {};
  protected selectedWorkSampleIndex:number = 0;

  /**
   * Default selected worksample
   */
  ngOnChanges() {
    this.selectedWorkSample = this.workSamples && this.workSamples[this.selectedWorkSampleIndex];
  }

  toggleModalVisible() {
    this.flag = !this.flag;
    this.closed.emit('event');
  }

  /**
   * Enlarge the image of selected work sample
   * @param workSampleId
   */
  enlarge(workSampleId:number):void {
    this.selectedWorkSample = this.workSamples && this.workSamples[+workSampleId];
    this.selectedWorkSampleIndex = +workSampleId;
  }

  /**
   * Returns true of given index is equal to selected index
   * Used in applying active class on selected image of li
   * @param currentIndex
   * @returns {boolean}
   */
  isActive(currentIndex:number):boolean {
    return this.selectedWorkSampleIndex === currentIndex;
  }
}
