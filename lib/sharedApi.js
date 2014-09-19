module.exports = (function() {
  'use strict';

  // Dependencies
  // -------------------------------------------------------
  var EventEmitter = require('eventemitter2').EventEmitter2;


  // Begin Module
  // -------------------------------------------------------

  // Api constructor
  function Api() {
    this.emitter = new EventEmitter({
      wildcard: true,
      delimiter: '.',
      newListener: true,
      maxListeners: 20
    });
    return this;
  }

  return Api;

}());
