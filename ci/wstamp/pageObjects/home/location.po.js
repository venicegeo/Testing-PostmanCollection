"use strict";

var LocationPanel = function() {

    var me = $('wstamp-location-mini');


    this.searchInput = me.element(by.model('stateStack[0].searchObj.name'));
    this.hideButton = me.$('button i.fa-eye-slash')
    this.myBasketsHeaderElement = me.element(by.cssContainingText('header.stampHeader', 'My Baskets'));

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

    this.addWorld = function(){
        this.getBasketElement('World').click();
        me.$('.fa-plus').click();
    };

    this.saveBasket = function(name){
        me.element(by.css('.saveBtn')).click();
        var modal = $('.modal');
        modal.element(by.model('stamp.name')).sendKeys(name)
        modal.element(by.cssContainingText('button', 'Save')).click();
    }

    function getNames(){
       return "var stamps = angular.element(arguments[0]).scope().$parent.type.stamps; \
       return stamps.map((stamp)=>{return stamp.name});"
    }

    this.deleteAllMyBaskets = function(){
        // me.element.all gives an error, and me.element ... .then gives an error, so forced to put
        // 'me' inside the css selector below.
        element.all(by.cssContainingText('wstamp-location-mini header.stampHeader', 'My Baskets')).then((headers)=>{
            if(headers.length){
                var header = headers[0];
                browser.executeScript(getNames(),header).then((names)=>{
                    names.map((name)=>{return this.deleteBasket(name)})
                })
            }
        })
        
    };

    this.deleteBasket = function(name){
        var ele = this.getBasketElement(name)
        browser.actions().mouseMove( ele ).perform();
        $('wstamp-popover-content .fa-trash').click();
        element(by.cssContainingText('.modal button', 'Confirm')).click();
    }    

  };

  module.exports = LocationPanel