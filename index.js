'use strict';

var Promise = require('bluebird');
var util = require('./util');

module.exports = function (bookshelf) {
  var BaseModel = bookshelf.Model.extend({
    initialize: function () {
      this.on('saving', this.validate);
    },

    validate: function (model, attrs, options) {
      return Promise.resolve(null)
      .then(util.collectAndCheckMissingAttributes.bind(this))
      .then(util.validateAttributes.bind(this))
      .then(util.setValidatedAttributes.bind(this));
    }
  });

  bookshelf.Model = BaseModel;
};
