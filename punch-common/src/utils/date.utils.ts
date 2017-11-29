import * as _ from 'lodash';
import * as moment from 'moment';

export class DateUtils {
  /**
   * Get date in given format
   * @param date
   * @param format
   * @returns {any}
   */
  static getDateInFormat(date, format):any {
    return moment(new Date(date)).format(format);
  }

  /**
   * Get date from year, month in given format
   * @param year
   * @param month
   * @param format
   * @returns {any}
   */
  static getDateFromYearMonthInFormat(year, month, format):any {
    return moment().year(year).month(month).date(1).format(format);
  }
  /**
   * Get today in given format
   * @param format
   * @returns {any}
   */
  static today(format) {
    return moment().format(format);
  }

  /**
   * List of months
   * @returns {string[]}
   */
  static listOfMonths() {
    let months:string[] = [];
    _.times(12, n => months.push(moment().month(n).format('MMMM')));
    return months;
  };

  /**
   * Generate list of years from startYear, up-til current
   * @param startYear
   * @returns {any}
   */
  static listofYearsFrom(startYear) {
    return _.range(startYear, +this.today('YYYY') + 1);
  }

  /**
   * Difference of two date in human readable string
   * @param startMonth
   * @param startYear
   * @param endMonth
   * @param endYear
   * @returns {string|string}
   */
  static difference(startMonth:number, startYear:number, endMonth:number, endYear:number):string {
    let end = moment({year: endYear, month: endMonth});
    let start = moment({year: startYear, month: startMonth});
    return this.preciseDiff(end, start);
  }

  /**
   * Our application level standard date format
   * @param date
   * @returns {any}
   */
  static standardDate(date:Date):string {
    return moment(date).format('MM/DD/YYYY');
  }

  /**
   * Calculates the difference of two dates and returns Human readable string
   * @param d1
   * @param d2
   * @param opts
   * @returns {string}
     */
  static preciseDiff(d1, d2, opts?) {
    var m1 = moment(d1), m2 = moment(d2);
    opts = opts || {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: true
      };

    if (m1.isSame(m2)) {
      return '';
    }
    if (m1.isAfter(m2)) {
      var tmp = m1;
      m1 = m2;
      m2 = tmp;
    }

    var yDiff = m2.year() - m1.year();
    var mDiff = m2.month() - m1.month();
    var dDiff = m2.date() - m1.date();
    var hourDiff = m2.hour() - m1.hour();
    var minDiff = m2.minute() - m1.minute();
    var secDiff = m2.second() - m1.second();

    if (secDiff < 0) {
      secDiff = 60 + secDiff;
      minDiff--;
    }
    if (minDiff < 0) {
      minDiff = 60 + minDiff;
      hourDiff--;
    }
    if (hourDiff < 0) {
      hourDiff = 24 + hourDiff;
      dDiff--;
    }
    if (dDiff < 0) {
      var daysInLastFullMonth = moment(m2.year() + '-' + (m2.month() + 1), 'YYYY-MM')
        .subtract(1, 'months').daysInMonth();
      if (daysInLastFullMonth < m1.date()) { // 31/01 -> 2/03
        dDiff = daysInLastFullMonth + dDiff + (m1.date() - daysInLastFullMonth);
      } else {
        dDiff = daysInLastFullMonth + dDiff;
      }
      mDiff--;
    }
    if (mDiff < 0) {
      mDiff = 12 + mDiff;
      yDiff--;
    }

    var result = [];

    moment.relativeTimeThreshold('s', 60);
    moment.relativeTimeThreshold('m', 60);
    moment.relativeTimeThreshold('h', 23);
    moment.relativeTimeThreshold('dd', 28);
    moment.relativeTimeThreshold('dm', 45);
    moment.relativeTimeThreshold('dy', 365);

    if (yDiff && opts.year) {
      result.push(moment.duration(yDiff, 'year').humanize());
    }
    if (mDiff && opts.month) {
      result.push(moment.duration(mDiff, 'month').humanize());
    }
    if (dDiff && opts.day) {
      result.push(moment.duration(dDiff, 'day').humanize());
    }
    if (hourDiff && opts.hour) {
      result.push(moment.duration(hourDiff, 'hour').humanize());
    }
    if (minDiff && opts.minute) {
      result.push(moment.duration(minDiff, 'minute').humanize());
    }
    if (secDiff && opts.second) {
      result.push(moment.duration(secDiff, 'second').humanize());
    }

    return result.join(' ');
  };
}
