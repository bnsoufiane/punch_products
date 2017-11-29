import {Component} from 'angular2/core';
import {HeaderComponent} from '../wrapper/wrapper';

@Component({
  moduleId: module.id,
  templateUrl: './subscription.component.html',
  directives: [HeaderComponent]
})

export class SubscriptionComponent {
  private _data:any;
  constructor() {
    this._data = {};
  }
}
