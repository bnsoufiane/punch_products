import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'ar-footer',
  moduleId: module.id,
  templateUrl: 'footer.component.html',
  directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES],
  styleUrls: ['../../../css/admin/assets/stylesheets/components/footer.css']
})
export class FooterComponent {
}
