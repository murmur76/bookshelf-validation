'use strict';

let Promise = require('bluebird');
let _ = require('lodash');

module.exports = {
  collectAndCheckMissingAttributes: function () {
    return _.reduce(this.rules, (attrs, rule, field) => {
      let value = this.attributes[field];
      if (value) {
        attrs[field] = value;
        return attrs;
      }
      if (rule.required && this.isNew()) {
        return Promise.reject(new Error('Missing Attribute: ' + field));
      }
      return attrs;
    }, {});
  }
};
