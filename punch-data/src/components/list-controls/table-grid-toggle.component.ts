import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'ar-table-grid-toggle',
  moduleId: module.id,
  templateUrl: './table-grid-toggle.component.html',
})
export class TableGridToggleComponent {
  @Input('currentListType') currentListType = 'grid';
  @Output() toggleClicked = new EventEmitter<string>();

  /**
   * toggling isGrid variable true/false state, emitting toggleClicked event
   */
  onToggleClicked(listType:string) {
    this.currentListType = listType;
    this.toggleClicked.emit(listType);
  }
}
