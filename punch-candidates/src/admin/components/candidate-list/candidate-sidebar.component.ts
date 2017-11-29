import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Role} from '../../interfaces/candidates/role.interface';

@Component({
  selector: 'ar-candidate-sidebar',
  moduleId: module.id,
  templateUrl: './candidate-sidebar.component.html',
})
export class CandidateSidebarComponent {
  @Input('roles') roles:Role[] = [];
  @Output() sidebarFilterChanged = new EventEmitter<Role>();
  activeSidebarFilter:Role = null;

  onFilterChanged(role:Role) {
    this.activeSidebarFilter = role;
    this.sidebarFilterChanged.emit(role);
  }

}
