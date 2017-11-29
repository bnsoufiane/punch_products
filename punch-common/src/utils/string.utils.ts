import * as _ from 'lodash';
/**
 * String specific utilities
 */
export class StringUtils {
  /**
   *
   */
  static isString(test) {
    return !!(typeof test === 'string' || test instanceof String);
  };

  /**
   * Convert object to query string
   * @param obj
   * @returns {string}
   */
  static toQueryString(obj) {
    return _(obj).map((v, k) => encodeURIComponent(<string>k) + '=' + encodeURIComponent(<string>v))
      .join('&');
  };

  /**
   * Parses a query string to object.   
   */
  static parseQueryString(str) {
    //TODO(irtazabbas): Create a re-usable component for appending and
    //retreiving page/filters as url params, and may be move this method there.
    var ret = Object.create(null);

    if (typeof str !== 'string') {
      return ret;
    }

    str = str.trim().replace(/^(\?|#|&)/, '');

    if (!str) {
      return ret;
    }

    str.split('&').forEach(function (param) {
      var parts = param.replace(/\+/g, ' ').split('=');
      var key = parts.shift();
      var val = parts.length > 0 ? parts.join('=') : undefined;

      key = decodeURIComponent(key);
      val = val === undefined ? null : decodeURIComponent(val);

      if (ret[key] === undefined) {
        ret[key] = val;
      } else if (Array.isArray(ret[key])) {
        ret[key].push(val);
      } else {
        ret[key] = [ret[key], val];
      }
    });

    return ret;
  }

  /**
   * Convert comma separated values string to array
   * @param csvString
   * @returns array
   */
  static csvStringToArray(csvString) {
    return csvString.match(/(?=\S)[^,]+?(?=\s*(,|$))/g);
  };

  /**
   * Convert array to comma separated values string
   * @param data
   * @returns string
   */
  static arrayToCsvString(data) {
    let csvString = '';
    data = data || [];
    _.each(data, (element, i) => {
      if (+i !== 0) csvString += ', ';
      csvString += element;
    });
    return csvString;
  };

  /**
   * If object exists, convert it to query string and append it to base url
   * @param base
   * @param obj
   * @returns {any}
   */
  static appendAsQueryString(base, obj) {
    if (_.isEmpty(obj)) return base;
    return base + '?' + this.toQueryString(obj);
  }
}
