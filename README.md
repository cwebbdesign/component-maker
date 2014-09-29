# Component Maker

Provides a default API and default features for JavaScript components which interact with the DOM. The interface is very similar to that of a Backbone views. Components are generally intended to only be concerned with what happens in their DOM element, but they are given the ability to publish and subscribe to application level events. Component maker was created with component initializer as a system for using Data-attributes to initialize and declaratively configure instances of components. It was not intended to be a replacement for Backbone or any other framework but is given enough functionality that eliminates the need for frameworks in some situations.


## Installation

    npm install component-make

## Usage
	// Components have a standard interface
    var make = require('component-maker');

    var component = make({
   		$el: $('#test'),
        name: 'test',
        events: {
            'click': 'clickHandler',
            'click a': 'clickHandler'
        },
        clickHandler: function () {},
        subscriptions: {
            'test': function () {}
        },
        initialize: function () {
            this.$el.html('test');
        },
        custom: 'customValue'
      });

	 // the $el and any custom options can also be passed to the component at the time of initialization which allows component definitions to exist separately from the instance options.
	var obj = {
        name: 'test', // components must have a name
        events: {}, // an event hash mapped to jquery (copied from Backbone.View)
        subscriptions: {}, // application level events)
        initialize: function () {
            // components must have an initialize function
            this.$el.html('test');
        }
    };

    var component = make(obj, {
       $el: $("#test"),
       opts: {custom: 'customValue'}
    });
