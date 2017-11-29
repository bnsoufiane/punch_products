import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';

@Component({
  selector: 'ar-list-dropdown-filter',
  moduleId: module.id,
  templateUrl: './list-dropdown-filter.component.html',
  directives: [DROPDOWN_DIRECTIVES],
})
export class ListDropdownFilterComponent {
  @Input('elements') elements:any[] = [];
  @Input('mainIndex') mainIndex:string = 'text';
  @Input('defaultText') defaultText:string = 'Select';
  @Output() dropdownFilterChanged = new EventEmitter<any>();
  activeDropdownFilter:any = null;

  onDropdownChanged(elmt:any):boolean {
    this.activeDropdownFilter = elmt;
    this.dropdownFilterChanged.emit(elmt);
    return false;
  }

  getDefaultText():string {
    if(this.activeDropdownFilter && this.activeDropdownFilter[this.mainIndex]) {
      return this.activeDropdownFilter[this.mainIndex];
    } else {
      return this.defaultText;
    }
  }

}
