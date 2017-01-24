"use strict";

var Chart = function(parent) {
    // parent is passed in because there are two charts that are very, very similar.
    // one map is for exploring and the other for analyzing

    var me = parent.$('wstamp-chart');

    this.getYAxis = function(){
        browser.sleep(1000);
        browser.ignoreSynchronization=true;
        return me.$('.y.axis');
        browser.ignoreSynchronization=false;
    }

  };

  module.exports = Chart