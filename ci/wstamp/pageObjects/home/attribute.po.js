"use strict";

var AttributePanel = function() {

    var me = element(by.css('wstamp-attribute-mini'))

    var searchInput = me.element(by.model('attributeService.searchText'));

    this.search = function(text){
        searchInput.sendKeys(text);
    };

    this.getBasketElement = function(name){
         return me.element(by.cssContainingText('.stamp .displayName', name));
    }

    this.addAll = function(){
        me.element(by.css('.fa-plus')).click();
    };

    this.addACLED = function(){
        this.getBasketElement('ACLED').click();
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

  module.exports = AttributePanel