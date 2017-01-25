"use strict";

var AttributePanel = function() {

    var me = $('wstamp-attribute-mini');

    this.searchInput = me.element(by.model('attributeService.searchText'));
    this.hideButton = me.$('button i.fa-eye-slash')

    

    this.hide = function(){
        this.hideButton.click();
    }

    this.search = function(text){
        searchInput.sendKeys(text);
    };

    this.getStampElement = function(name){
         return me.element(by.cssContainingText('.stamp .displayName', name));
    }

    this.getAttributeElement = function(name){
        var ele = me.element(by.cssContainingText('wstamp-attribute .displayName', name));
        var grandparent = ele.element(by.xpath('..')).element(by.xpath('..'));
        return grandparent.$('i.fa.toggle.selectionIcon');
    };

    this.selectStamp = function(name){
        this.getStampElement(name).click();
    }

    this.selectAttribute = function(name){
        this.getAttributeElement(name).click();
    };

    this.addAllForStamp = function(name){
        this.getStampElement(name).click();
        me.element(by.css('.fa-plus')).click();
    }

    this.saveBasket = function(name){
        me.$('.saveBtn').click();
        browser.sleep(2000);
        var modal = $('.modal');
        modal.element(by.model('stamp.name')).sendKeys(name);
        browser.sleep(1000);
        modal.element(by.cssContainingText('button', 'Save')).click();
        browser.sleep(1000);
    }

    this.deleteBasket = function(name){
        var ele = this.getStampElement(name);
        browser.actions().mouseMove( ele ).perform();
        element(by.css('wstamp-popover-content .fa-trash')).click();
        element(by.cssContainingText('.modal button', 'Confirm')).click();
    }    

  };

  module.exports = AttributePanel