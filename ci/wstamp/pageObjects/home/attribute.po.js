"use strict";

var AttributePanel = function() {

    var me = $('wstamp-attribute-mini');

    this.searchInput = me.element(by.model('attributeService.searchText'));
    this.hideButton = me.$('button i.fa-eye-slash');
    this.myBasketsHeaderElement = me.element(by.cssContainingText('header.stampHeader', 'My Baskets'));
    this.searchResults = me.$$('wstamp-attribute');

    this.hide = function(){
        this.hideButton.click();
    }

    this.search = function(text){
        this.searchInput.sendKeys(text);
    };

    this.getStampElement = function(name){
         return me.element(by.cssContainingText('.stamp .displayName', name));
    };

    this.getAttributeElement = function(name){
        var ele = me.element(by.cssContainingText('wstamp-attribute .displayName', name));
        var grandparent = ele.element(by.xpath('..')).element(by.xpath('..'));
        return grandparent.$('i.fa.toggle.selectionIcon');
    };

    this.selectStamp = function(name){
        this.getStampElement(name).click();
    };

    this.selectAttribute = function(name){
        this.getAttributeElement(name).click();
    };

    this.addAllForStamp = function(name){
        this.getStampElement(name).click();
        me.element(by.css('.fa-plus')).click();
    };

    this.saveBasket = function(name){
        me.$('.saveBtn').click();
        browser.sleep(2000);
        var modal = $('.modal');
        modal.element(by.model('stamp.name')).sendKeys(name);
        browser.sleep(1000);
        modal.element(by.cssContainingText('button', 'Save')).click();
        browser.sleep(1000);
    };


    function getNames(){
       return "var stamps = angular.element(arguments[0]).scope().$parent.type.stamps; \
       return stamps.map((stamp)=>{return stamp.name});"
    };

    this.deleteAllMyBaskets = function(){
        // me.element.all gives an error, and me.element ... .then gives an error, so forced to put
        // 'me' inside the css selector below.
        element.all(by.cssContainingText('wstamp-attribute-mini header.stampHeader', 'My Baskets')).then((headers)=>{
            if(headers.length){
                var header = headers[0];
                browser.executeScript(getNames(),header).then((names)=>{
                    names.map((name)=>{return this.deleteBasket(name)})
                })
            }
        })
    };

    this.deleteBasket = function(name){
        var ele = this.getStampElement(name);
        browser.actions().mouseMove( ele ).perform();
        element(by.css('wstamp-popover-content .fa-trash')).click();
        element(by.cssContainingText('.modal button', 'Confirm')).click();
    };

  };

  module.exports = AttributePanel