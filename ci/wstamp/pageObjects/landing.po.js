"use strict";
var BasePage = require('./base.po.js');
var utils = require('../utils.js')

var LandingPage = function() {

    this.url = 'https://wstamp.ornl.gov/#/landing';
    this.pageLoaded = this.inDom($('i.fa-play'));
    this.myStampInfoButtons = $$('.stampWidgetList').get(0).$$('i.fa-info-circle');
    this.signOutButton = $('.fa-sign-out');

    this.deleteAllStamps = function(){
        this.myStampInfoButtons.each((button)=>{
            this.deleteStampFromButton(button);
        })
    }

    this.deleteStampFromButton = function(button){
        return new Promise((resolve, reject)=>{
            button.click();
            utils.hideTooltips();
            browser.sleep(2000);
            $('button .fa-trash').click();
            $('button.ok').click().then(()=>{
                browser.sleep(2000);
                resolve();
            })
        })
    }


    this.deleteStamp = function(name){
       utils.log(`deleting stamp: ${name}`);
       var ele = element(by.cssContainingText('div.name', name))
       var grandparent = ele.element(by.xpath('..')).element(by.xpath('..'));
       grandparent.$('i.fa-info-circle').click();
       utils.hideTooltips();
       $('button .fa-trash').click();
       $('button.ok').click();
    }

    this.getWelcomeMsg = function(){
        var welcome = $$('.welcome p').first();
        return welcome.getText()
    }

    this.getStarted = function(){
        $('.fa-play').click();
    }

    this.logout = function(){
        this.signOutButton.click();
    }
    

  };

  LandingPage.prototype = BasePage; // extend BasePage...
  module.exports = LandingPage;