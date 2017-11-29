import {Component, Input, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'ar-list-search',
  moduleId: module.id,
  templateUrl: './list-search.component.html'
})
export class ListSearchComponent {
  @Input('placeholder') placeholder = 'Filter By Name...';
  @Output() queryChanged = new EventEmitter<string>();


  onQueryChanged(query:string) {
    this.queryChanged.emit(query);
  }
}
