"use strict";

var LocationPanel = function() {

    var me = $('wstamp-location-mini');

    this.searchInput = me.element(by.model('stateStack[0].searchObj.name'));

    this.hideButton = me.$('button i.fa-eye-slash')

    this.hide = function(){
        this.hideButton.click();
    }

    this.numSelected = function(){
        return me.$('button.showSelected .selectText').getText().then((text)=>{
            // expects text to be of the form '6 Selected'
            return parseInt(text.split(' ')[0], 10);
        });
    }

    this.search = function(text){
        this.searchInput.sendKeys(text);
    };

    this.getBasketElement = function(name){
         return me.element(by.cssContainingText('.stamp .displayName', name));
    }

    this.addAll = function(){
        me.$('.fa-plus').click();
    };

    this.addWorld = function(){
        this.getBasketElement('World').click();
        this.addAll();
    };

    this.saveBasket = function(name){
        me.element(by.css('.saveBtn')).click();
        var modal = $('.modal');
        modal.element(by.model('stamp.name')).sendKeys(name)
        modal.element(by.cssContainingText('button', 'Save')).click();
    }

    this.deleteBasket = function(name){
        var ele = this.getBasketElement(name)
        browser.actions().mouseMove( ele ).perform();
        $('wstamp-popover-content .fa-trash').click();
        element(by.cssContainingText('.modal button', 'Confirm')).click();
    }    

  };

  module.exports = LocationPanel