/**
 * Function specific utilities
 */
export class FunctionUtils {
  /**
   *
   * @returns {boolean}
   */
  static isFunction(test) {
    return !!(typeof test === 'function' || test instanceof Function);
  }
}
