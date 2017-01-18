"use strict";

var Chart = function() {

    var me = element(by.css('wstamp-time-selector'));

    this.barGroups = element.all(by.css('.barGroup'));    
    this.boundaryYearStart = element.all(by.css('.boundarYear')).get(0);
    this.boundaryYearEnd = element.all(by.css('.boundarYear')).get(1);
    this.primaryYear = me.element(by.css('.pelement(byrimaryYearLabel'));
    this.minSelectedYear = me.element(by.css('.minSelectedYear'));
    this.maxSelectedYear = me.element(by.css('.maxSelectedYear'));

    this.setYear = function(year){
        this.boundaryYearStart.getText().then((startYear)=>{
            var index = year -parseInt(startYear);
            this.barGroups.get(index).click();
        })
    }

  };

  module.exports = Chart