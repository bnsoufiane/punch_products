import {Pipe, PipeTransform} from 'angular2/core';
import {CompanyDetail} from '../interfaces/interfaces';
import * as _ from 'lodash';

/*
 * filters candidates collection by role
 * Usage:
 *   Candidate[] | candidateRoleFilter:role
 */
@Pipe({name: 'companyFundingFilter'})
export class CompanyFundingFilterPipe implements PipeTransform {
  transform(companies:CompanyDetail[], args:any[]):CompanyDetail[] {
    let fundingInterval = args[0];
    if (!fundingInterval) return companies;
    fundingInterval.text = fundingInterval.text.replace('+', '- 0');
    let min = fundingInterval.text.toLowerCase().substring(0, fundingInterval.text.indexOf('-')).trim();

    if(String(min).indexOf('k') !== -1)
      min = parseInt(min.replace('k', ''))*1000;
    if(String(min).indexOf('m') !== -1)
      min = parseInt(min.replace('m', ''))*1000*1000;
    min = parseInt(min);
    let max = fundingInterval.text.toLowerCase().substring(fundingInterval.text.indexOf('-') + 1).trim();

    if(String(max).indexOf('k') !== -1)
      max = parseInt(max.replace('k', ''))*1000;
    if(String(max).indexOf('m') !== -1)
      max = parseInt(max.replace('m', ''))*1000*1000;

    return _.filter(companies, company =>
      (this.inInterval(this.getAmountAsNumber(company.fundingAmount), min, max))
    );
  }

  /**
   * Get amount number from amount string with $ and commas
   * @param amount
   * @returns {number}
     */
  private getAmountAsNumber (amount:string):number {
    if(!amount || amount === 'unknown')
      amount = '-1';
    amount = amount.replace('$', '').replace(/,/g, '');
    return isNaN(parseInt(amount)) ? -1 : parseInt(amount);
  }

  /**
   * checks if min <= amount < max
   * @param amount
   * @param min
   * @param max
   * @returns {boolean}
     */
  private inInterval(amount:number, min:number, max:number):boolean {
    return !((amount < min) || (max > 0 && amount >= max));
  }

}

