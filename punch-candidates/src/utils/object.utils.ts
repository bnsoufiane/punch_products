import {StringUtils} from './string.utils';
import {FunctionUtils} from './function.utils';

/**
 * Object-specific utilities.
 */
export class ObjectUtils {

  /**
   * Checks if property is present and on the object itself, not including
   * its prototype chain.
   * @param {!Object} object The object to test.
   * @param {!string} property The property to test.
   */
  static hasOwnProperty(object, property) {
    return Object.hasOwnProperty.call(object, property);
  };


  /**
   * Iterates through the properties and values of an object, ignoring prototype
   * chain.
   */
  static forEach(object, f, context?) {
    for (var key in object) {
      if (!this.hasOwnProperty(object, key)) continue;
      f.call(context, object[key], key, object);
    }
  };

  /**
   * Removes a property based on given key
   * @param object
   * @param key
   * @returns {boolean}
     */
  static remove(object, key) {
    return delete object[key];
  }

  /**
   *
   */
  static map(object, f, context) {
    var results = [];
    this.forEach(object, function (v, k, object) {
      results.push(f.call(context, v, k, object));
    }, context);
    return results;
  };


  /**
   * Returns true if condition is met for every value on the object.
   */
  static all(object, f, context) {
    for (var key in object) {
      if (!this.hasOwnProperty(object, key)) continue;
      if (!f.call(context, object[key], key, object)) return false;
    }
    return true;
  };


  /**
   * Returns true if condition is met for any value on the object.
   */
  static any(object, f, context) {
    for (var key in object) {
      if (!this.hasOwnProperty(object, key)) continue;
      if (f.call(context, object[key], key, object)) return true;
    }
    return false;
  };


  /**
   * Returns true if condition isn't met for any value on the object.
   */
  static none(object, f, context) {
    return !this.any(object, f, context);
  };


  /**
   *
   */
  static reduce(object, f, starting?, context?) {
    var current = starting;
    this.forEach(object, function (value, key) {
      current = f.call(context, current, value, key, object);
    });
    return current;
  };


  /**
   *
   */
  static findWhere(object, f, context) {
    for (var key in object) {
      if (!this.hasOwnProperty(object, key)) continue;
      if (f.call(context, object[key], key, object)) return object[key];
    }
  };


  /**
   * Converts object to array.
   */
  static asArray(object) {
    return this.reduce(object, function (agg, value) {
      agg.push(value);
      return agg;
    }, []);
  };


  /**
   *
   */
  static addIfExists(key, value, target):any {
    if (value === undefined) return false;
    if (StringUtils.isString(value) && !value.length) return false;
    target[key] = value;
  };


  /**
   * Maps properties from source object onto a target object following
   * either a string to string key to key map or a string to function key
   * to function converter.
   */
  static formatByMapping(map, source) {
    return this.reduce(function (target, value, targetProperty) {
      if (FunctionUtils.isFunction(value)) {
        try {
          this.addIfExists(targetProperty, value(source), target);
        } catch (err) {
          console.log(err);
        }
      } else {
        this.addIfExists(targetProperty, source[value], target);
      }
    }, {});
  };


  /**
   * Extends specified properties from the provided source/sources onto the
   * target object.
   * @param {!Object} target The target to extend properties onto.
   * @param {!Object|!Array<!Object>} sources The sources to extend property
   *     values from.
   * @param {!Array<!string>} properties The properties to extend from the source
   *     objects.
   * @return {!Object} The target object with extended values.
   */
  static extendProperties(target, sources, properties, opt_config) {
    var config = opt_config || {};
    sources = Array.isArray(sources) ? sources : [sources];
    sources.forEach(function (source) {
      properties.forEach(function (property) {
        var value = config.get ? config.get(source, property) : source[property];
        if (config.set) {
          config.set(target, source, property);
        } else {
          target[property] = value;
        }
      });
    });
  };


  /**
   * Extends specified properties from the provided source/sources onto the
   * target object, but only if the condition is met.
   * @param {!Object} target The target to extend properties onto.
   * @param {!Object|!Array<!Object>} sources The sources to extend property
   *     values from.
   * @param {!Array<!string>} properties The properties to extend from the source
   *     objects.
   * @param {Function} condition The function to call for each value at the given
   *     property on a source to determine whether or not it should be extended.
   *     Is passed the value on the source object, the property, and the source
   *     object itself.
   * @param {boolean=} opt_allOrNothing Whether all values must pass the condition
   *     on a source object in order for it to be extended.
   * @return {!Object} The target object with extended values.
   */
  static extendPropertiesIf(target, sources, properties,
                            condition, opt_config) {
    var config = opt_config || {};
    sources = Array.isArray(sources) ? sources : [sources];
    sources.forEach(function (source) {
      var passed = properties.filter(function (property) {
        try {
          return !!condition(source[property], property, source);
        } catch (err) {
          return false;
        }
      });
      if (passed.length === properties.length || !config.allOrNothing) {
        this.extendProperties(target, source, passed, config);
      }
    });
    return target;
  };


  /**
   *
   */
  static extendIfValued() {
    var base = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
      this.forEach(arguments[i], function (value, prop) {
        if (value !== undefined) base[prop] = value;
      });
    }
    return base;
  }

}
