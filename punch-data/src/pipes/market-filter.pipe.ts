import {Pipe, PipeTransform} from 'angular2/core';
import * as _ from 'lodash';

/*
 * filters companies/businesses on any object that has an array attribute of categories by their market categories
 * Usage:
 *   any[] | marketsFilter:selectedMarkets -> [{id:, text}] as given by ng2-select
 */
@Pipe({name: 'marketsFilter'})
export class MarketsFilterPipe implements PipeTransform {
  transform(items:any[], args:any[]):any[] {
    let markets = args[0];

    if (!markets || !_.isArray(markets) || markets.length === 0) {
      return items;
    }

    markets = _(markets).map('text').value();//from [{id:,text:}] -> [text,text2]

    let containsSelected = new RegExp(markets.join('|'), 'gi');
    let itemMarkets;
    return _.filter(items, (item) => {

      itemMarkets = item.categories ? item.categories.join(',') : '';

      return containsSelected.test(itemMarkets);
    });
  }

}

