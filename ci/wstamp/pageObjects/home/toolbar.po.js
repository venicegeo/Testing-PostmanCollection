"use strict";

var Toolbar = function() {

    var me = element(by.css('wstamp-time-selector'));
    this.visualizationSelector = element(by.css('button.visualization-selector'));

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

    this.barGroups = element.all(by.css('.barGroup'));    
    this.boundaryYearStart = element.all(by.css('.boundarYear')).get(0);
    this.boundaryYearEnd = element.all(by.css('.boundarYear')).get(1);
    this.primaryYear = me.element(by.css('.primaryYearLabel'));
    this.minSelectedYear = me.element(by.css('.minSelectedYear'));
    this.maxSelectedYear = me.element(by.css('.maxSelectedYear'));

    this.setMode = function(mode){
        // mode should be either 'Analyze' or 'Explore'
        var button = element(by.cssContainingText('.temp-view-switcher span', mode))
        if (hasClass(button, 'view-switcher-off')){
            button.click();
        }
    }


    this.setYear = function(year){
        this.boundaryYearStart.getText().then((startYear)=>{
            var index = year -parseInt(startYear);
            this.barGroups.get(index).click();
        })
    }


    var hasClass = function (element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

  };

  module.exports = Toolbar