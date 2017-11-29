import {Pipe, PipeTransform} from 'angular2/core';
import * as _ from 'lodash';

/*
 * filters businesses on any object that has an  attribute 'city' by their city
 * Usage:
 *   any[] | cityFilter:selectedCities -> [{id:, text}] as given by ng2-select
 */
@Pipe({name: 'cityFilter'})
export class CityFilterPipe implements PipeTransform {
  transform(items:any[], args:any[]):any[] {
    let cities = args[0];

    if (!cities || !_.isArray(cities) || cities.length === 0) {
      return items;
    }

    cities = _(cities).map('text').value();//from [{id:,text:}] -> [text,text2]

    return _.filter(items, (item) => {
      return (_.indexOf(cities, item.city) !== -1);
    });
  }

}

