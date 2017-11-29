import {Pipe, PipeTransform} from 'angular2/core';

/*
 * Transforms seconds into a string of minutes and seconds
 */
@Pipe({name: 'formatTime'})
export class FormatTimePipe implements PipeTransform {
  transform(seconds:number, args:any[]):string {
    if(seconds) {
      seconds = Math.floor(seconds);
      return Math.floor(seconds/60)+':'+(seconds%60);
    } else {
      return '-:--';
    }
  }
}

