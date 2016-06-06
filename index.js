'use strict';

const _ = require('lodash');
const spawn = require('child_process').spawn;

// Holds a list of all flattened packages used in this module
let packages = [];

/**
 * Run through the npm dependencies object and recursively accumulate all
 * the child dependencies. Once this completes, the package array will contain
 * every package used here in a flattened list.
 *
 * @param  {Object} obj    The current level that we are in the dependency obj
 * @param  {Array} parent the array that tracks the parent structure.
 */
function flattenPackages(obj, parent) {
  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {
      packages.push({
        package: property,
        version: obj[property].version,
        parent: parent,
        uniqueName: `${property}@${obj[property].version}`
      })
      flattenPackages(obj[property].dependencies, parent.concat(property));
    }
  }
}

/**
 * Flatten all pckages, and group the packages by their unique names. For any
 * package group with more than one value, it implies there are duplicates.
 *
 * @param  {Object} dependencies The dependency tree from npm list.
 */
function checkDups(dependencies) {
  let obj = dependencies;

  flattenPackages(obj.dependencies, [obj.name]);

  let packageGroups = _.groupBy(packages, 'package');

  _.forEach(packageGroups, group => {
    if (_.uniq(_.map(group, 'uniqueName')).length > 1) {
      _.forEach(group, pkg => {
        console.log(pkg.package, pkg.version, pkg.parent.join('->'));
      });
    }
  });
}

/**
 * Run npm list and aggregate the stdout buffer a JSON object.
 * @param  {Function} cb Callback upon completion
 */
function run(cb) {
  let command = spawn('npm', ['list', '--json', '--silent']);
  let result = '';
  command.stdout.on('data', data => {
    result += data.toString();
  });
  command.on('close', code => {
    return cb(result);
  });
}

run((result) => {
  checkDups(JSON.parse(result));
});
