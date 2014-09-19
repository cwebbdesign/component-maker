# Component Maker

Takes a JavaScript object with a name property and returns it as a subclass of Component. Mixes in event emitter, backbone.extend and an events hash.

Component maker was originally intended to create an instance of a Component with a set of options derived from data-attributes. The Component is cached and the instance is returned.
Originally, this was designed to work in conjuction with an initializer that looks at the DOM, creates Component instances with custom config parsed from data-attributes and then calls initialize. 

Component maker has since been modified to directly accept options instead of a separate config object. This is merely syntactic sugar.

## Installation

    npm install component-make

## Usage

    var make = require('component-maker');
    var component = make({
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

         // Instance configuration
         {
         $el: $("#test"),
         opts: {custom: 'customValue'}
     })


	which of course should also be able to look like this:
      var component = make({
   		 $el: ''
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
         opts: {custom: 'customValue'}
         
      });
	
    There is still a possibility that the API will change to 
    var component = make(component);
    var instance = component(config);
    
   