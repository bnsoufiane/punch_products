import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from 'angular2/common';
import {BUTTON_DIRECTIVES} from 'ng2-bootstrap';
import {SELECT_DIRECTIVES} from 'ng2-select';
import {Ng2SelectClickAction} from './ng-select-click-action.directive';
import * as _ from 'lodash';

@Component({
  selector: 'ar-list-multi-select-filter',
  moduleId: module.id,
  templateUrl: './list-multi-select-filter.component.html',
  directives: [
    BUTTON_DIRECTIVES,
    SELECT_DIRECTIVES,
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    NgClass,
    Ng2SelectClickAction],
})
export class ListMultiSelectFilterComponent {
  @Input('elements') elements:any[] = [];
  @Input('defaultText') defaultText:string = 'Select';
  @Input('initSelectedItems') initData:any[] = [];
  @Input('selectedTextLength') selectedTextLength = 2;
  @Output() multiSelectFilterChanged = new EventEmitter<any>();
  activeDropdownFilter:any = [];
  private mainIndex = 'text';

  private disabled:boolean = false;
  private _disabledV:string = '0';

  private get disabledV():string {
    return this._disabledV;
  }

  //external to interanl ng2-select disabled state
  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  //If < 1 then the default text is shown, otherwise there are two
  //spans that replace the default text. selectedText, and overFlowtext
  showDefault() {
    return this.activeDropdownFilter.length < 1;
  }

  //shortlist of items to display in close menu button
  getButtonText() {
    return _(this.activeDropdownFilter)
      .map(this.mainIndex)
      .slice(0, this.selectedTextLength)
      .join(', ');
  }

  //when shortlist is overflowed, show how many others are hidden from the user
  getOverflowText() {
    let tailLength = this.activeDropdownFilter.length - this.selectedTextLength;
    return tailLength < 1 ? '' : tailLength === 1 ? tailLength + ' other' : tailLength + ' others';
  }

  //Is trigger on ALL ng2-select events. Sends output of values
  refreshValue(items:any):void {
    this.activeDropdownFilter = items;
    this.multiSelectFilterChanged.emit(items);
  }
}
