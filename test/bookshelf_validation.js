'use strict';

const _ = require('lodash');
const assert = require('assert');
const validator = require('validator');
const knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: ':memory:' }
});
const db = require('bookshelf')(knex);
db.plugin(require('../index'));
const User = db.Model.extend({
  tableName: 'user',
  rules: {
    email: {
      required: true,
      validator: validator.isEmail
    },
    name: {
      required: true,
      validator: _.isString
    },
    age: { validator: _.isNumber },
    profileImage: { validator: validator.isURL },
    gender: { validator: _.contains.bind(null, ['male', 'female']) },
  },
  hasTimestamps: ['createdAt', 'updatedAt']
});

describe('bookshelf-validation', () => {
  before((done) => {
    return knex.schema.dropTableIfExists('user').then(() => {
      return knex.schema.createTable('user', (table) => {
        table.increments('id').primary();
        table.string('email').notNullable().unique();
        table.string('name');
        table.integer('age');
        table.string('profileImage');
        table.string('gender');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
        done();
      });
    });
  });

  let user = {
    email: 'test@user.com',
    name: 'test user',
    age: 21,
    profileImage: 'http://test.image.com',
    gender: 'male'
  };

  it('should successfully create a user', (done) => {
    return User.forge(user).save().then((created) => {
      assert.ok(_.isNumber(created.id));
      assert.ok(_.isDate(created.get('updatedAt')));
      assert.ok(_.isDate(created.get('createdAt')));
      assert.equal(created.get('name'), user.name);
      assert.equal(created.get('age'), user.age);
      assert.equal(created.get('profileImage'), user.profileImage);
      assert.equal(created.get('gender'), user.gender);
      done();
    });
  });

  it('should throw an error if required field missing', (done) => {
    return User.forge(_.omit(_.clone(user), 'email')).save().catch((err) => {
      assert.equal(err.message, 'Missing Attribute: email');
      return User.forge(_.omit(_.clone(user), 'name')).save().catch((err) => {
        assert.equal(err.message, 'Missing Attribute: name');
        done();
      });
    });
  });

  it('should throw an error for invalid name type', (done) => {
    return User.forge(_.extend(_.clone(user), { name: 123 })).save().catch((err) => {
      assert.equal(err.message, 'name: validation failed at 123');
      done();
    });
  });

  it('should throw an error for invalid profile image type', (done) => {
    return User.forge(_.extend(_.clone(user), { profileImage: 'profile' })).save().catch((err) => {
      assert.equal(err.message, 'profileImage: validation failed at profile');
      done();
    });
  });

  it('should throw an error for invalid gender type', (done) => {
    return User.forge(_.extend(_.clone(user), { gender: 'fe' })).save().catch((err) => {
      assert.equal(err.message, 'gender: validation failed at fe');
      done();
    });
  });

  it('should able to update attributes without required fields', (done) => {
    return User.forge({ id: 1 }).save({ name: 'test2', gender: 'female' }, { patch: true }).then((model) => {
      assert.equal(model.get('name'), 'test2');
      assert.equal(model.get('gender'), 'female');
      done();
    });
  });

  it('should filter atributes not defined', (done) => {
    return User.forge(_.extend(_.clone(user), { email: 'test2@user.com', height: 180, weight: 70 })).save().then((created) => {
      assert.ok(_.isNumber(created.id));
      assert.ok(_.isDate(created.get('updatedAt')));
      assert.ok(_.isDate(created.get('createdAt')));
      done();
    });
  });
});
