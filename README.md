# bookshelf-validation
[![Build Status](https://travis-ci.org/murmur76/bookshelf-validation.svg?branch=master)](https://travis-ci.org/murmur76/bookshelf-validation)

A simple &amp; flexible model validation plugin for [bookshelf](http://bookshelfjs.org)


## How to use

You can install it from npm package.

```
$ npm install bookshelf-validation
```
And then plug it into bookshelf instance.

```js
const knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: ':memory:' }
});
const Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin(require('bookshelf-validation'));
```
Now you are ready to use `bookshelf-validation`.

```js
const validator = require('validator');

let User = Bookshelf.Model.extend({
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
```
`bookshelf-validation` simply provides two model validation properties `required` and `validator`.
<br/>
<br/>
The default value of `required` field is `false` unless you explicitly specify it.
<br/>
<br/>
`validator` is just a function returns `true` / `false`, so it's highly customizable. I prefer to use it with [validator](https://github.com/chriso/validator.js) library which has lots of built-in functions.
<br/>
