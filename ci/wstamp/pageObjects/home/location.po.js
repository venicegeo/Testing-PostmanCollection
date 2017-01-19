"use strict";

var LocationPanel = function() {

    var me = element(by.css('wstamp-location-mini'))

    var searchInput = me.element(by.model('stateStack[0].searchObj.name'));

    this.numSelected = function(){
        return me.element(by.css('button.showSelected .selectText')).getText().then(function(text){
            // expects text to be of the form '6 Selected'
            return parseInt(text.split(' ')[0])
        })
    }

    this.search = function(text){
        searchInput.sendKeys(text);
    };

    this.getBasketElement = function(name){
         return me.element(by.cssContainingText('.stamp .displayName', name));
    }

    this.addAll = function(){
        me.element(by.css('.fa-plus')).click();
    };

    this.addWorld = function(){
        this.getBasketElement('World').click();
        this.addAll();
    };

    this.saveBasket = function(name){
        me.element(by.css('.saveBtn')).click();
        var modal = element(by.css('.modal'))
        modal.element(by.model('stamp.name')).sendKeys(name)
        modal.element(by.cssContainingText('button', 'Save')).click();
    }

    this.deleteBasket = function(name){
        var ele = this.getBasketElement(name)
        browser.actions().mouseMove( ele ).perform();
        element(by.css('wstamp-popover-content .fa-trash')).click();
        element(by.cssContainingText('.modal button', 'Confirm')).click();
    }    

  };

  module.exports = LocationPanel