"use strict";
var BasePage = require('./base.po.js');

var LandingPage = function() {

    // var getStartedButton = element(by.css('.fa-play'));
    var startTutorialButton = $('.fa-question-circle');
    var signOutButton = $('.fa-sign-out');
    var searchInput = $('.searchText');
    var searchButton = $('.fa-search');

    this.url = 'https://wstamp.ornl.gov/#/landing';
    this.pageLoaded = this.inDom($('i.fa-play'));

    this.search = function(text){
        searchInput.sendKeys(text);
        searchButton.click();
    }

    this.deleteStamp = function(name){
       var ele = element(by.cssContainingText('div.name', name))
       var grandparent = ele.element(by.xpath('..')).element(by.xpath('..'));
       grandparent.$('button.infoButton').click();
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
        signOutButton.click();
    }
    

  };

  LandingPage.prototype = BasePage; // extend BasePage...
  module.exports = LandingPage;