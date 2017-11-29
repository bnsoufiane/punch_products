import {Pipe, PipeTransform} from 'angular2/core';
import {CompanyDetail} from '../interfaces/interfaces';
import * as _ from 'lodash';

/*
 * filters companies by their market categories
 * Usage:
 *   Companies[] | companyMarketsFilter:selectedMarkets -> [{id:, text}] as given by ng2-select
 */
@Pipe({name: 'companyMarketsFilter'})
export class CompanyMarketsFilterPipe implements PipeTransform {
  transform(companies:CompanyDetail[], args:any[]):CompanyDetail[] {
    let markets = args[0];

    if (!markets || !_.isArray(markets)) {
      return companies;
    }

    if (markets.length == 0) {
      return companies;
    }

    markets = _(markets).map('text').value();//from [{id:,text:}] -> [text,text2]

    let containsSelected = new RegExp(markets.join('|'), 'gi');
    let companyMarkets;
    return _.filter(companies, (company) => {

      companyMarkets = company.categories ? company.categories.join(',') : '';

      return containsSelected.test(companyMarkets);
    });
  }

}

