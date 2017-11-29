/**
 * Array-specific utilities.
 */
export class ArrayUtils {

  /**
   *
   */
  static findIndexWhere(array, f, context?):any {
    for (var i = 0; i < array.length; i++) {
      if (f.call(context, array[i], i, array)) return i;
    }
  };


  /**
   *
   */
  static findWhere(array, f, opt_context) {
    var index = this.findIndexWhere(array, f, opt_context);
    if (index !== undefined) return array[index];
  };


  /**
   *
   */
  static findAllWhere(array, f, opt_context) {
    var results = [];
    for (var i = 0; i < array.length; i++) {
      if (f.call(opt_context, array[i], i, array)) results.push(array[i]);
    }
    return results.length ? results : undefined;
  };


  /**
   * Returns true if all elements in the list meet the condition provided.
   */
  static all(array, f, opt_context) {
    for (var i = 0; i < array.length; i++) {
      if (!f.call(opt_context, array[i], i, array)) return false;
    }
    return true;
  };


  /**
   * Returns true if any of the elements in the list meet the condition provided.
   */
  static any(array, f, opt_context?) {
    for (var i = 0; i < array.length; i++) {
      if (f.call(opt_context, array[i], i, array)) return true;
    }
    return false;
  };


  /**
   *
   */
  static addOrReplace(array, replacement) {
    var index = array.indexOf(replacement);
    if (index > -1) {array.splice(index, 1, replacement);
    } else {array.push(replacement);}
    return array;
  };


  /**
   *
   */
  static addOrReplaceWhere(array, f, replacement, opt_context) {
    var index = this.findIndexWhere(array, f, opt_context);
    if (index !== undefined) {array.splice(index, 1, replacement);
    } else {array.push(replacement);}
    return array;
  };


  /**
   *
   */
  static remove(array, target) {
    var index = array.indexOf(target);
    if (index !== undefined) array.splice(index, 1);
    return array;
  };


  /**
   *
   */
  static removeAll(array, target) {
    var index;
    while ((index = array.indexOf(target)) > -1) {
      array.splice(index, 1);
    }
    return array;
  };


  /**
   *
   */
  static removeWhere(array, f, opt_context) {
    var index = this.findIndexWhere(array, f, opt_context);
    if (index !== undefined) array.splice(index, 1);
    return array;
  };


  /**
   *
   */
  static removeAllWhere(array, f, opt_context) {
    for (var i = 0; i < array.length; i++) {
      if (f.call(opt_context, array[i], i, array)) {
        array.splice(i--, 1);
      }
    }
    return array;
  };


  /**
   * Remove and return all values matching condition f.
   */
  static popOutAllWhere(array, f, opt_context) {
    var popped = [];
    for (var i = 0; i < array.length; i++) {
      if (f.call(opt_context, array[i], i, array)) {
        popped.push(array[i]);
        array.splice(i--, 1);
      }
    }
    return popped;
  };


  static hashByProperty(array, property) {
    return array.reduce(function (hash, value) {
      hash[value[property]] = value;
      return hash;
    }, {});
  };


  /**
   * Group array of objects by values of a key.
   * @param {!Array<!Object>} array Array of objects.
   * @param {!string} key The key whose value should be grouped on.
   * @return {!Array<!Array<!Object>>}
   */
  static groupByKeyValue(array, key) {
    var groups = {};
    return array.reduce(function (agg, item) {
      groups[item[key]] = groups[item[key]] !== undefined ?
        groups[item[key]] : agg.length;
      agg[groups[item[key]]] = (agg[groups[item[key]]] || []).concat([item]);
      return agg;
    }, []);
  };


  /**
   * Group array of objects by values of a key.
   * @param {!Array<!Object>} array Array of objects.
   * @param {!string} key The key whose value should be grouped on.
   * @return {!Array<!Array<!Object>>}
   */
  static groupByValue(array, f, opt_context) {
    var groups = {};
    return array.reduce(function (agg, item, key) {
      var value = f.call(opt_context, item, key, array);
      groups[value] = groups[value] !== undefined ? groups[value] : agg.length;
      agg[groups[value]] = (agg[groups[value]] || []).concat([item]);
      return agg;
    }, []);
  };
}
