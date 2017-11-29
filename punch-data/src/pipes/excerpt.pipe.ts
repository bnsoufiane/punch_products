import {Pipe, PipeTransform} from 'angular2/core';

/*
 * truncate text to the last space before the desired amount of characters
 * Usage:
 *   string | excerpt:100
 */
@Pipe({name: 'excerpt'})
export class ExcerptPipe implements PipeTransform {
  transform(text:string, args:any[]):string {
    let limit:number = args[0];
    if (!limit) return text;
    if (!text) return text;
    if(text.length < limit)
      return text;
    text = text.substring(0, limit);
    return text.substring(0, text.lastIndexOf(' ')) + ' ...';
  }
}

