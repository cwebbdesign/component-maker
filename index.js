/*


      var stub = {
        name: 'test',
        events: {
          'click': 'clickHandler',
          'click a': 'clickHandler'
        },
        clickHandler: function() {},
        subscriptions: {
          'test': function() {}
        },
        initialize: function() {
          this.$el.html('test');
        }
      };

      component = make(stub, {
        $el: $('#test'),
        opts: {
          custom: 'customvalue'
        }
      });

    });

    var component = make({
        name: 'test',
        el: '',
        events: {
          'click': 'clickHandler',
          'click a': 'clickHandler'
        },
        clickHandler: function() {},
        subscriptions: {
          'test': function() {}
        },
        opts: {},
        initialize: function() {
          this.$el.html('test');
        }
    });
*/

module.exports = (function() {
  'use strict';

  // Declare Dependencies
  var subclass = require('compose-extend');
  var ApiInstance = require('./lib/sharedApi');
  var _ = require('lodash');

  // include lodash-node instead of lodash
  //_.each
  //_.isFunction
  //_.isObject
  //_.result
  // fix the jquery issue and maybe replace with not jquery

  // incorporate the shared api better: a way to extend it? a way to


  // Begin Module
  // -------------------------------------------------

  // Creates a component that inherits the sharedApi.
  var Component,
    subclasses = {},
    delegateEventSplitter;


  // Define the core Component
  // --------------------------------------------------

  // Component Constructor
  Component = function() {
    this.cid = _.uniqueId('component');

    this.delegateEvents();
    this.subscribeAppEvents();
    return this;
  };

  // give each component a way to extend itself
  Component.subclass = subclass;


  // Component Prototype
  Component.prototype.initialize = function() {
    // each component provides its own
  };

  Component.prototype.remove = function() {
    this.emitter.removeAllListeners();
    if (this.$el) {
      this.undelegateEvents();
      // TODO: delete store.get(this.cid)
      this.$el.remove();
    }
    //delete this;
  };

  Component.prototype.template = function() {};

  // Scoping further DOM query's to our cached $el
  Component.prototype.$find = function(selector) {
    return this.$el.find(selector);
  };


  // DOM Events
  // ---------------------------------------------------------------

  // Events will be Delegated using jQuery's .on() and .off() methods.
  // The events object key is an event name and an optional selector
  // The value is the callback which will be executed
  Component.prototype.events = {
    // Any jQuery supported event can be passed
    // along with a selector
    // 'click a': function () { }
  };
  Component.prototype.subscribeAppEvents = function() {
    var events = events || this.subscriptions,
      self = this;

    if (!_.isObject(events)) {
      return this;
    }

    _.each(events, function(method, key) {
      //method = _.bind(method, self);
      method = method.bind(self);
      if (_.isFunction(method)) {
        self.emitter.on(key, method);
      }
    });

    return this;
  };

  // Stealing the implementation from Backbone's View Object
  // Cached regex to split keys for `delegate`.
  delegateEventSplitter = /^(\S+)\s*(.*)$/;

  Component.prototype.delegateEvents = function(events) {

    if (!(events || (events = _.result(this, 'events')))) {
      return this;
    }

    this.undelegateEvents();

    for (var key in events) {
      var method, match, eventName, selector;

      method = events[key];

      if (!_.isFunction(method)) {
        method = this[events[key]];
      }

      if (!method) {
        continue;
      }

      match = key.match(delegateEventSplitter);
      eventName = match[1] += '.delegateEvents' + this.cid;
      selector = match[2];
      method = method.bind(this);

      if (selector === '') {
        this.$el.on(eventName, method);
      } else {
        this.$el.on(eventName, selector, method);
      }
    }
    return this;
  };

  Component.prototype.undelegateEvents = function() {

    this.$el.off('.delegateEvents' + this.cid);

    return this;
  };


  // Create the new instance
  // -----------------------------------------------------------------

  // Important to note that the components which are initialized,
  // inherit the same event emitter. this enables all components of the same type to listen to events.

  // TODO: decide if component instances should have their own emitter or if
  // all instances of the same component should share the instance of the emitter
  // As the emitter is intended to listen to application level events, it makes sense to me
  // that all instances would respond to the event


  // each component instance gets its own instance of event emitter
  // shared api is a constructor
  function make(component, config) {
    var Constructor, Subclass, conf = config || {};

    // Config exists as a way to create pass a set of derived options. In the original use case a function was created
    // to parse the DOM and pass information to the component at the time of creation.
    // Allow the $el to be passed directly as part of component instead of with the configuration.
    // this feels like a hack. which means it feals like somethings wrong with how the subclassing happens or how events are delegated...

    // i wonder if it would be smarter to return a function that's ready for configuration
    // or to allow passing configuration directly to the Component constructor?
    // TODO: sort out whats going on
    if (component.$el && !conf.$el) {
      conf.$el = component.$el
    }

    if (component.opts && !conf.opts) {
      conf.opts = component.opts
    }

    Constructor = Component.subclass(new ApiInstance());


    if (!subclasses[component.name]) {
      // Cache initialized subclasses so
      // we can reuse them with custom configuration.
      subclasses[component.name] = Constructor.subclass(component);
    }

    // Create the subclass constructor
    Subclass = subclasses[component.name].subclass(conf);


    // Return an instance
    return new Subclass();
  }

  return make;

}());
