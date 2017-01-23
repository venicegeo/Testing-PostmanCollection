"use strict";

var Time = function() {

    var me = element(by.css('wstamp-time-selector'));

    this.barGroups = $$('.barGroup');    
    this.boundaryYearStart = $$('.boundarYear').get(0);
    this.boundaryYearEnd = $$('.boundarYear').get(1);
    this.primaryYear = me.$('.primaryYearLabel');
    this.minSelectedYear = me.$('.minSelectedYear');
    this.maxSelectedYear = me.$('.maxSelectedYear');

    this.setYear = function(year){
        this.boundaryYearStart.getText().then((startYear)=>{
            var index = year -parseInt(startYear);
            this.barGroups.get(index).click();
        })
    }

  };

  module.exports = Time