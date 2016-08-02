/**
 * Simple underscore function to create secure inmutable (recursive deep copy) JavaScript Objects 
 * @param {Object/Array} obj Target Object. Required
 * @param {Number} depth Depth level. Defaults to 1
 * @return {Object/Array) Super inmutable new Object
 * @method deepClone
 */
_.deepClone = function deepClone(obj, depth) {
  var clone, key;
  depth = depth || 1;
  if (typeof obj !== 'object' || obj === null) { return obj; }
  if (_.isString(obj)) { return obj.splice(); }
  if (_.isDate(obj)) { return new Date(obj.getTime()); }
  if (_.isFunction(obj.clone)) { return obj.clone(); }
  clone = _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  if (depth !== undefined && depth > 0) {
    for (key in clone) {
      clone[key] = deepClone(clone[key], depth-1);
    }
  }
  return clone;
}
