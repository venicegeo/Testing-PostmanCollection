"use strict";

var LandingPage = function() {

    // var getStartedButton = element(by.css('.fa-play'));
    var startTutorialButton = element(by.css('.fa-question-circle'));
    var signOutButton = element(by.css('.fa-sign-out'));
    var searchInput = element(by.model('.searchText'));
    var searchButton = element(by.css('.fa-search'));


    this.search = function(text){
        searchInput.sendKeys(text);
        searchButton.click();
    }

    this.get = function() {
        browser.get('https://wstamp.ornl.gov/#/landing');
    };

    this.getWelcomeMsg = function(){
        var welcome = element.all(by.css('.welcome p')).first();
        return welcome.getText()
    }

    this.getStarted = function(){
        element(by.css('.fa-play')).click();
    }

    this.logout = function(){
        signOutButton.click();
    }


  };

  module.exports = LandingPage;