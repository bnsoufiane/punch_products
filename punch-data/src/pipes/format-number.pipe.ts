import {Pipe, PipeTransform} from 'angular2/core';

/*
 * Transforms long number strings into a readable format
 */
@Pipe({name: 'formatNumber'})
export class FormatNumberPipe implements PipeTransform {
  transform(money:string, args:any[]):string {
    if (typeof money === 'String') {
      if (!money || money === '0' || isNaN(parseFloat(money.replace('$', '')))) {
        return '';
      }
      //money is already formatted
      return money;
    } else {
      //money is a number, should be formatted
      let skipThousands = args[0];
      let formattedMoney = parseFloat(money);
      let formattedMoneyString = ''+formattedMoney;
      let multiplier = '';
      if (formattedMoney >= 1000000000) {
        formattedMoneyString = parseFloat(''+(formattedMoney / 1000000000)).toFixed(2);
        multiplier = 'B';
      }
      if (multiplier === '' && formattedMoney >= 1000000) {
        formattedMoneyString = parseFloat(''+(formattedMoney / 1000000)).toFixed(2);
        multiplier = 'M';
      }
      if (multiplier === '' && formattedMoney >= 1000) {
        if (skipThousands) {
          let L = formattedMoneyString.length;
          formattedMoneyString = formattedMoneyString.substring(0, L - 3)+','+formattedMoneyString.substring(L - 3);
        } else {
          formattedMoneyString = parseFloat(''+(formattedMoney / 1000)).toFixed(2);
          multiplier = 'K';
        }

      }
      return formattedMoneyString + multiplier;
    }
  }
}

