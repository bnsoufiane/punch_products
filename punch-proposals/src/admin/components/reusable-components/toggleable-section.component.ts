import {Component, Output, EventEmitter, Input} from 'angular2/core';

@Component({
  selector: 'ar-toggleable-section',
  moduleId: module.id,
  templateUrl: './toggleable-section.component.html',
  styleUrls: ['../../../css/admin/assets/stylesheets/components/toggleable-section.css']
})
export class ToggleableSectionComponent {
  /**
   * set the inactive state of the component
   * @type {boolean}
   */
  @Input() inactive:boolean = false;
  /**
   * even emitted when active state changes
   * @type {EventEmitter<boolean>}
   */
  @Output() activated = new EventEmitter<boolean>();

  /**
   * function called when we click on activate link
   * @returns {boolean}
   */
  onActivate():boolean {
    this.inactive = false;
    this.activated.emit(this.inactive);
    return false;
  }

}
