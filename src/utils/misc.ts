/**
 * Removes undefined filters passed to mongoose
 * @param filter 
 * @returns 
 */
 export function removeEmptyfilters(filter: { [key: string]: any }) {
    const filter_clone = JSON.parse(JSON.stringify(filter));
    for (const key in filter_clone) {
      if (!Array.isArray(filter_clone[key])) {
        if (!filter_clone[key]) delete filter_clone[key];
      } else {
        const new_arr = [];
        for (const obj of filter_clone[key]) {
          if (Object.values(obj)[0] !== undefined) new_arr.push(obj);
        }
        filter_clone[key] = new_arr;
      }
    }
    return filter_clone;
}

/**
 * Checks if a variable holds a value that is an object
 * @param obj
 * @returns boolean
 */
 export function isObject(data: any) {
    return Object.prototype.toString.call(data) === '[object Object]';
}

/**
 * Determines whether or not an object is empty
 * @param obj
 * @returns boolean
 */
 export function objectIsEmpty(obj: any) {
  if (!isObject(obj)) return false;

  return Object.keys(obj).length === 0;
}

/**
 * Removes properties that do not have valid values from an object
 * @param data object to be stripped of it's properties with invalid values
 * @returns an object with only properties that have valid values from the original object passed
 */
 export function stripEmptyProperties(data: any) {
    if (!isObject(data)) return data;
  
    const new_data: { [key: string]: any } = {};
    for (const key in data) {
      if (data[key]) new_data[key] = data[key];
    }
    return new_data;
  }
