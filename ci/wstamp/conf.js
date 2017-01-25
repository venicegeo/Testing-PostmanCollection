"use strict";
require('dotenv').config()

let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {

  params:{
    wstampLogin:{
      username:process.env.WSTAMP_USERNAME,
      password:process.env.WSTAMP_PASSWORD,
    }
  },

  // uncomment out if you would like to use sauce labs
  // sauceUser: process.env.SAUCE_USERNAME,
  // sauceKey: process.env.SAUCE_KEY,

  // uncomment out if you would like to use browserstack
  // browserstackUser: process.env.BROWSERSTACK_USERNAME,
  // browserstackKey: process.env.BROWSERSTACK_KEY,

  onPrepare: function(){
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {displayStacktrace: true}
    }));
  },

  jasmineNodeOpts:{
    print: function(){}
  },

  framework: 'jasmine',
  allScriptsTimeout: 15 * 1000, // default is 11 seconds 

  // specs: ['specs/chart.spec.js'],
  specs: ['specs/*spec.js'],

  multiCapabilities: [
    {
      browserName: 'chrome',
      os: 'Windows',
      os_version: '10',
      version: 55,
      loggingPrefs: {browser: 'SEVERE'}, // added so that warnings are ignored
      // shardTestFiles: true,
      // maxInstances: 25
    },
  ]
}