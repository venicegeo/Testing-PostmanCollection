"use strict";
require('dotenv').config()

exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  // seleniumAddress: 'http://' + process.env.SAUCE_USERNAME + ":" + process.env.SAUCE_KEY + '@ondemand.saucelabs.com:80/wd/hub',
  // seleniumAddress: 'http://' + process.env.BROWSERSTACK_USERNAME + ":" + process.env.BROWSERSTACK_KEY + '@hub.browserstack.com:80/wd/hub',
  // seleniumAddress: 'http://luke342:xQotqtzQL17qxid7DeSx@hub.browserstack.com:80/wd/hub',
  // specs: ['home.spec.js', 'login.spec.js'],
  specs: ['chart.spec.js'],
  multiCapabilities: [
    {
      browserName: 'chrome',
      version: 55,
      loggingPrefs: {browser: 'SEVERE'}, // added so that real console errors can be easily detected
      shardTestFiles: true,
      maxInstances: 25
    },
    // {
    //   browserName: 'chrome',
    //   version: 54,
    //   loggingPrefs: {browser: 'SEVERE'}, // added so that real console errors can be easily detected
    //   shardTestFiles: true,
    //   maxInstances: 25
    // },
    // {
    //   browserName: 'firefox',
    //   version: 50,
    //   loggingPrefs: {browser: 'SEVERE'}, // added so that real console errors can be easily detected
    //   shardTestFiles: true,
    //   maxInstances: 25
    // }
  
  ]
}