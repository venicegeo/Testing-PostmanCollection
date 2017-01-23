"use strict";

var Toolbar = function() {

    var me = $('wstamp-time-selector');
    this.visualizationSelector = $('button.visualization-selector');

    this.selectVisType = function(label){
        browser.ignoreSynchronization=true;
        this.visualizationSelector.click();
        element(by.cssContainingText('li.chart-choice', label)).click();
        browser.ignoreSynchronization=false;
    }

    this.resetSelections = function(){
        browser.ignoreSynchronization=true;
        element(by.css('button.resetStampBtn')).click();
        browser.ignoreSynchronization=false;
    }

    this.barGroups = $$('.barGroup');    
    this.boundaryYearStart = $$('.boundarYear').get(0);
    this.boundaryYearEnd = $$('.boundarYear').get(1);
    this.primaryYear = $$('.primaryYearLabel');
    this.minSelectedYear = $$('.minSelectedYear');
    this.maxSelectedYear = $$('.maxSelectedYear');

    this.setMode = function(mode){
        // mode should be either 'Analyze' or 'Explore'
        var button = element(by.cssContainingText('.temp-view-switcher span', mode))
        if (hasClass(button, 'view-switcher-off')){
            button.click();
        }
    }


    this.setYear = function(year){
        this.boundaryYearStart.getText().then((startYear)=>{
            var index = year-parseInt(startYear, 10);
            this.barGroups.get(index).click();
        })
    }


    var hasClass = function (element, cls) {
        return element.getAttribute('class').then((classes)=>{
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

  };

  module.exports = Toolbar