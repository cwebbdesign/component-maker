// Dependencies
// --------------------------------------------------------------

// Test environment
var chai = require('chai'); // Test assertions that are expressive and readable
var should = chai.should();
//var expect = chai.expect;
var sinon = require('sinon');
var make = require('../index');

var jsdom = require('jsdom'); // A JavaScript implementation of the WHATWG DOM and HTML standards.
jsdom.defaultDocumentFeatures = {
  FetchExternalResources: ['script', 'img', 'css', 'frame', 'iframe', 'link'],
  ProcessExternalResources: ['script', 'img', 'css', 'frame', 'link']
};

// Stub the browser window
var document = jsdom.jsdom('<html><head></head><body></body></html>');
var window = document.parentWindow;
var $ = require('jquery')(window); // Add jquery
window.$ = $;

var fixture = '<div id="test"><a href="">test</a></div>';
// Tests
// ----------------------------------------------------------------
describe('Maker', function() {
  'use strict';
  var component;

  describe('Component', function() {

    // Setup each test
    beforeEach(function() {

      window.$('body').append(fixture);

      var $el = window.$('#test');

      var stub = {
        $els: $el,
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
        $el: $el,
        opts: {
          custom: 'customvalue'
        }
      });

    });

    // Clean up after each test
    afterEach(function() {
      component.remove();
      window.$('#test').remove();
    });

    it('Should have a name', function() {
      console.log('herro',component)
      (component.$el[0] === component.$els[0]).should.equal(true);
    });
    it('Should have a name', function() {
      component.name.should.equal('test');
    });

    it('Should have an initialize function', function() {
      component.initialize.should.be.a('function');
    });

    it('Should have access to it\'s \'el\'', function() {
      component.$el.html().should.equal('<a href="">test</a>');
    });

    describe('Events', function() {

      it('Should execute a click handler when clicked', function() {
        component.clickHandler = sinon.spy();
        component.delegateEvents();
        window.$('#test').click();

        component.clickHandler.called.should.equal(true);
      });

      it('Should execute a click handler when \'a\' is clicked', function() {
        component.clickHandler = sinon.spy();
        component.delegateEvents();
        window.$('#test a').click();

        component.clickHandler.called.should.equal(true);
      });
    });

    describe('Subscriptions', function() {
      it('Should register subscriptions with emitter', function() {
        component.emitter.listeners('test').length.should.equal(1);
        component.emitter.listeners('test')[0].should.be.a('function');
        //component.emitter.listeners.should.equal('h')
      });
      it('Should de-register subscriptions if removed', function() {
        component.remove();
        component.emitter.listeners('test').length.should.equal(0);
      });

      it('Should create a new instance of emitter for each type of component', function() {
        var val, component1, component2;
        window.$('body').append('<div id="test2"></div><div id="test3"></div>');

        component1 = make(
          {
            name: 'test1',
            initialize: function() {}
          },
          {
            $el: window.$('#test2')
          }
        );
        component2 = make(
          {
            name: 'test2',
            initialize: function() {}
          }, {
            $el: window.$('#test3')
          }
        );
        //(component1.prototype === component2.prototype).should.be.false;
        val = component1.emitter === component2.emitter
        val.should.be.false;

        window.$('#test2').remove();
        window.$('#test3').remove();

      });

      it('Should share an instance of emitter within each type of component', function() {
        var val, component1, component2;
        window.$('body').append('<div id="test2"></div><div id="test3"></div>');

        component1 = make(
          {
            name: 'test1',
            initialize: function() {}
          },
          {
            $el: window.$('#test2')
          }
        );
        component2 = make(
          {
            name: 'test1',
            initialize: function() {}
          }, {
            $el: window.$('#test3')
          }
        );
        val = component1.emitter === component2.emitter;
        val.should.be.true;


        window.$('#test2').remove();
        window.$('#test3').remove();

      });
    });
  });
});