import {Pipe, PipeTransform} from 'angular2/core';
import {Portfolio} from '../interfaces/proposals/portfolio.interface';
import * as _ from 'lodash';

/*
 * filters portfolio samples collection by title
 * Usage:
 *   Portfolio[] | portfolioQueryFilter:query
 */
@Pipe({name: 'portfolioQueryFilter'})
export class PortfolioQueryFilterPipe implements PipeTransform {
  transform(elements:Portfolio[], args:any[]):Portfolio[] {
    let query:string = args[0];
    if (!query) return elements;
    return _.filter(elements, elmt =>
        (elmt.title && elmt.title.toLowerCase().includes(query.toLowerCase())) ) || elements;
  }
}
