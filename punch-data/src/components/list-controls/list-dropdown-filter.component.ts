import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';

@Component({
  selector: 'ar-list-dropdown-filter',
  moduleId: module.id,
  templateUrl: './list-dropdown-filter.component.html',
  directives: [DROPDOWN_DIRECTIVES],
})
export class ListDropdownFilterComponent implements OnInit {
  @Input('elements') elements:any[] = [];
  @Input('mainIndex') mainIndex:string = 'text';
  @Input('defaultText') defaultText:string = 'Select';
  @Input('value') value:any;
  @Output() dropdownFilterChanged = new EventEmitter<any>();
  activeDropdownFilter:any = null;

  ngOnInit() {
    if (this.value) {
      let found = this.elements.find(elm => {
        let equals = false;
        if (Array.isArray(elm.value) && Array.isArray(this.value) &&
            elm.value.length === this.value.length) {
          equals = true;
          elm.value.forEach((val, i) => {
            //tslint keeping from a non-strict comparison.
            if (val !== this.value[i] &&
                val.toString() !== this.value[i].toString()) {
              equals = false;
            }
          });
        } else {
          equals = elm.value === this.value;
        }
        return equals;
      });
      this.activeDropdownFilter = found;
    }
  }

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
