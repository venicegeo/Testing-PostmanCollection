"use strict";

var Chart = function() {

    var me = element(by.css('wstamp-chart'));

    this.getYAxis = function(){
        browser.sleep(1000);
        browser.ignoreSynchronization=true;
        return me.element(by.css('.y.axis'))
        browser.ignoreSynchronization=false;
    }

  };

  module.exports = Chart