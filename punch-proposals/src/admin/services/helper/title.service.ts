import {Injectable} from 'angular2/core';
@Injectable()
export class TitleService {
  private title;

  constructor() {
    this.title = document.title;
  }

  public setTitle(title:string):void {
    document.title = 'Punch | ' + title;
  }
}
