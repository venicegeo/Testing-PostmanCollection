"use strict";

var LandingPage = function() {

    // var getStartedButton = element(by.css('.fa-play'));
    var startTutorialButton = $('.fa-question-circle');
    var signOutButton = $('.fa-sign-out');
    var searchInput = $('.searchText');
    var searchButton = $('.fa-search');


    this.search = function(text){
        searchInput.sendKeys(text);
        searchButton.click();
    }

    this.get = function() {
        browser.get('https://wstamp.ornl.gov/#/landing');
    };

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

  module.exports = LandingPage;