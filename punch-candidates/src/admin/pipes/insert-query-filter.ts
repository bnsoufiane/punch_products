import {Pipe, PipeTransform} from 'angular2/core';
import {Insert} from '../interfaces/proposals/insert.interface';
import * as _ from 'lodash';

/*
 * filters inserts collection by title
 * Usage:
 *   Insert[] | insertQueryFilter:query
 */
@Pipe({name: 'insertQueryFilter'})
export class InsertQueryFilterPipe implements PipeTransform {
  transform(elements:Insert[], args:any[]):Insert[] {
    let query:string = args[0];
    if (!query) return elements;
    return _.filter(elements, elmt =>
        (elmt.title && elmt.title.toLowerCase().includes(query.toLowerCase())) ) || elements;
  }
}
