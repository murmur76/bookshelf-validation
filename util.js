'use strict';

let Promise = require('bluebird');
let _ = require('lodash');

module.exports = {
  collectAndCheckMissingAttributes: function (options) {
    return _.reduce(this.rules, (attrs, rule, field) => {
      let value = this.attributes[field];
      if (value) {
        attrs[field] = value;
        return attrs;
      }
      if (rule.required && options.method === 'insert') {
        return Promise.reject(new Error('Missing Attribute: ' + field));
      }
      return attrs;
    }, {});
  },
  validateAttributes: function (attrs) {
    let validations = _.map(attrs, (value, field) => {
      if (!this.rules[field].validator(value)) {
        return Promise.reject(new Error(field + ': validation failed at ' + value));
      }
      return Promise.resolve(value);
    });
    return Promise.all(validations).then(() => attrs);
  },
  setValidatedAttributes: function (attrs) {
    if (this.hasTimestamps) {
      this.hasTimestamps.forEach((key) => {
        if (this.attributes[key]) {
          attrs[key] = this.attributes[key];
        }
      });
    }
    this.attributes = attrs;
  }
};
