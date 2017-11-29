import {Pipe, PipeTransform} from 'angular2/core';
import {CompanyDetail} from '../common/interfaces/company-detail/company-detail.interface';
import * as _ from 'lodash';

/*
 * filters companies by their number of employees
 * Usage:
 *   Companies[] | employeeSizeFilter:selectedEmployeeSize
 */
@Pipe({name: 'employeeSizeFilter'})
export class EmployeeSizeFilterPipe implements PipeTransform {
  transform(companies:CompanyDetail[], args:any[]):CompanyDetail[] {
    let employeeSizeInterval = args[0];

    if (!employeeSizeInterval || !_.isArray(employeeSizeInterval.value)) return companies;
    employeeSizeInterval = employeeSizeInterval.value;//[min, max]

    return _.filter(companies, (company) => {

      let minMax = _(company.numberOfEmployees)
        .replace(/k/gi, '000')
        .split('-')
        .map(_.parseInt);//[min, max]

      return minMax && (minMax[0] >= employeeSizeInterval[0] &&
        (_.isNil(minMax[1]) ? minMax[0] : minMax[1]) <= employeeSizeInterval[1]);
    });
  }

}

