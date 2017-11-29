import {Pipe, PipeTransform} from 'angular2/core';

/*
 * gets URL or TEXT from the passed url
 * Usage:
 *   string | urlFilter:returnedType
 *   returnedType should be either 'text' or 'url'
 *
 * Example 'www.punch.com/' | urlFilter:'text' returns 'punch.com'
 * Example 'www.punch.com/' | urlFilter:'url' returns 'http://www.punch.com/'
 */
@Pipe({name: 'urlFilter'})
export class UrlFilterPipe implements PipeTransform {
  transform(url:string, args:any[]):string {
    let returnValue = url.toLowerCase();
    if (returnValue.indexOf('&src_bizid') !== -1) returnValue = returnValue.substring(0, returnValue.indexOf('&src_bizid'));
    if (returnValue.indexOf('%26src_bizid') !== -1) returnValue = returnValue.substring(0, returnValue.indexOf('%26src_bizid'));
    if (args[0] === 'url') {
      if(returnValue.indexOf('http://') === -1 && returnValue.indexOf('https://') === -1) {
        returnValue = 'http://' + returnValue;
      }
      return returnValue;
    }
    if(args[0] === 'text') {
      returnValue = returnValue.replace('http://', '').replace('https://', '').replace('www.', '');
      if (returnValue[returnValue.length-1] === '/') returnValue = returnValue.slice(0, -1);
      if (returnValue.length > 40) returnValue = returnValue.substring(0, 38) + '...';
      return returnValue;
    }
    return returnValue;
  }
}

