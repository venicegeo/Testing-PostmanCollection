"use strict";

var Toolbar = function() {

    var me = $('.centerPane div.toolbar');
    this.visualizationSelector = $('button.visualization-selector');
    this.attributeButton = me.$('button.showExploreAttributeMiniBtn');
    this.locationButton = me.$('button.showExploreLocationMiniBtn');
    this.removeShapefileButton = me.$('button .fa-remove');

    this.selectVisType = function(label){
        this.visualizationSelector.click();
        element(by.cssContainingText('li.chart-choice', label)).click();
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
    };

    this.saveStamp = function(name){
        me.$('button.saveStampBtn').click();
        element(by.model('vm.stampName')).sendKeys(name);
        element(by.cssContainingText('button', 'Save STAMP')).click();
    };

    this.setYear = function(year){
        this.boundaryYearStart.getText().then((startYear)=>{
            var index = year-parseInt(startYear, 10);
            this.barGroups.get(index).click();
        })
    };


    var hasClass = function (element, cls) {
        return element.getAttribute('class').then((classes)=>{
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    this.numAttributesSelected = function(){
        return this.attributeButton.getText().then((text)=>{
            // expects text to be of the form '6 Attributes'
            return parseInt(text.split(' ')[0], 10);
        });
    };
    
    this.numLocationsSelected = function(){
        return this.locationButton.getText().then((text)=>{
            // expects text to be of the form '6 Locations'
            return parseInt(text.split(' ')[0], 10);
        });
    };

    this.showAttributePanel = function(){
        this.attributeButton.click();
    };

    this.showLocationPanel = function(){
        this.locationButton.click();
    };

  };

  module.exports = Toolbar