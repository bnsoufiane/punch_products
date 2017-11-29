import {Pipe, PipeTransform} from 'angular2/core';
import {DateUtils} from '../common/utils/date.utils';

/*
 * Transforms date string into a readable format
 */
@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
  transform(date:string, args:any[]):string {
    if (!date) return '';
    let format:string = args[0] || 'MMMM DD, YYYY';
    let formattedDate = DateUtils.getDateInFormat(date, format);
    return (formattedDate.toLowerCase() === 'invalid date') ? date : formattedDate;
  }
}

