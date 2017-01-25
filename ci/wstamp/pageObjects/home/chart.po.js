"use strict";

var Chart = function(parent) {
    // parent is passed in because there are two charts that are very, very similar.
    // one map is for exploring and the other for analyzing

    var me = parent.$('wstamp-chart');

    this.getYAxisText = function(){
        return new Promise(( resolve, reject)=>{
            browser.sleep(1000);
            me.$('.y.axis').getText().then((text)=>{
                resolve(text);
            })
        })
    };

  };

  module.exports = Chart