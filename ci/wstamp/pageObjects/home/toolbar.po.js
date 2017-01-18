"use strict";

var Toolbar = function() {

    var me = element(by.css('wstamp-time-selector'));
    this.visualizationSelector = element(by.css('button.visualization-selector'));

    this.select = function(label){
        this.visualizationSelector.click();
        element(by.cssContainingText('li.chart-choice', label)).click();
    }

    this.barGroups = element.all(by.css('.barGroup'));    
    this.boundaryYearStart = element.all(by.css('.boundarYear')).get(0);
    this.boundaryYearEnd = element.all(by.css('.boundarYear')).get(1);
    this.primaryYear = me.element(by.css('.primaryYearLabel'));
    this.minSelectedYear = me.element(by.css('.minSelectedYear'));
    this.maxSelectedYear = me.element(by.css('.maxSelectedYear'));

    this.setYear = function(year){
        this.boundaryYearStart.getText().then((startYear)=>{
            var index = year -parseInt(startYear);
            this.barGroups.get(index).click();
        })
    }

  };

  module.exports = Toolbar