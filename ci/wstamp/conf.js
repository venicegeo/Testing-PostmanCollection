"use strict";
require('dotenv').config()

let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  // sauceUser: process.env.SAUCE_USERNAME,
  // sauceKey: process.env.SAUCE_ACCESS_KEY,

  onPrepare: function(){
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {displayStacktrace: true}
    }));
  },
  jasmineNodeOpts:{
    print: function(){}
  },
  framework: 'jasmine',
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  // seleniumAddress: 'http://' + process.env.SAUCE_USERNAME + ":" + process.env.SAUCE_KEY + '@ondemand.saucelabs.com:80/wd/hub',
  // seleniumAddress: 'http://' + process.env.BROWSERSTACK_USERNAME + ":" + process.env.BROWSERSTACK_KEY + '@hub.browserstack.com:80/wd/hub',
  // specs: ['chart.spec.js', 'home.spec.js', 'login.spec.js', 'datasets.spec.js'],
  specs: ['home.spec.js'],
  multiCapabilities: [
    {
      browserName: 'chrome',
      version: 55,
      loggingPrefs: {browser: 'SEVERE'}, // added so that real console errors can be easily detected
      shardTestFiles: true,
      maxInstances: 25
    },
  ]
}