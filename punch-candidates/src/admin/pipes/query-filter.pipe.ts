import {Pipe, PipeTransform} from 'angular2/core';
import {ArrayUtils} from '../../utils/index';

/*
 * filters Elements by target fields
 * Usage:
 *   elements[] | QueryFilter:target:query
 */
@Pipe({name: 'queryFilter'})
export class QueryFilterPipe implements PipeTransform {
  transform(elements:any[], args:any[]):any[] {
    let targets:[string] = args[0];
    let query:string = args[1];
    if (!query || !targets) return elements;
    let result: any[] = [];
    for(let elmt of elements) {
      for(let target of targets) {
        if(elmt[target]) {
          if(Array.isArray(elmt[target])) {
            if(ArrayUtils.any(elmt[target], subElmt => ( subElmt.toLowerCase().includes(query.toLowerCase()) ) )) {
              if(result.indexOf(elmt) === -1)
                result.push(elmt);
            }
          } else {
            if(elmt[target].toLowerCase().includes(query.toLowerCase()) && result.indexOf(elmt) === -1)
              result.push(elmt);
          }
        }
      }
    }
    return result;
  }
}
