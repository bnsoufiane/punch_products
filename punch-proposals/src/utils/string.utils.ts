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

}
