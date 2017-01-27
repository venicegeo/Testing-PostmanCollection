"use strict";
var path = require("path");

require('dotenv').config()

let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {

  params:{
    wstampLogin:{
      username:process.env.WSTAMP_USERNAME,
      password:process.env.WSTAMP_PASSWORD,
    },
    shapefilePath: path.join(__dirname , "data/test-shapefile.shp"),
    datasetPath: path.join(__dirname, 'data/test-dataset.csv'),
  },

  onPrepare: function() {
    // Disable animations so e2e tests run more quickly
    
    var disableNgAnimate = function() {
        angular
            .module('disableNgAnimate', [])
            .run(['$animate', function($animate) {
                $animate.enabled(false);
            }]);
    };

    browser.addMockModule('disableNgAnimate', disableNgAnimate);

    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {displayStacktrace: true}
    }));
  },

  // uncomment out if you would like to use sauce labs
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_KEY,

  // uncomment out if you would like to use browserstack
  // browserstackUser: process.env.BROWSERSTACK_USERNAME,
  // browserstackKey: process.env.BROWSERSTACK_KEY,

  jasmineNodeOpts:{
    print: function(){},
    defaultTimeoutInterval: 60*1000, // default is 30 seconds
  },

  framework: 'jasmine',
  allScriptsTimeout: 15 * 1000, // default is 11 seconds 
  
  // to debug tests locally, uncomment and run 'webdriver-manager start' in another terminal
  // seleniumAddress:  "http://127.0.0.1:4444/wd/hub",

  // specs: ['specs/home.spec.js'],
  specs: ['specs/*spec.js'],

  multiCapabilities: [
    {
      browserName: 'chrome',
      os: 'Windows',
      os_version: '7',
      version: 55,
      loggingPrefs: {browser: 'SEVERE'}, // added so that warnings are ignored
      shardTestFiles: true,
      maxInstances: 2,
      screenResolution: '1280x1024'
    },
  ]
}