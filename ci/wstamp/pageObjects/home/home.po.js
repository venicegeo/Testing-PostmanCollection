"use strict";

var LocationPanel = require('./location.po');  
var AttributePanel = require('./attribute.po'); 
var TimeSelector = require('./time.po');
var Chart = require('./chart.po');
var Toolbar = require('./toolbar.po');
var Explore = require('./explore.po');
var Analyze = require('./analyze.po');

var HomePage = function() {

    var getStartedButton = element(by.css('.fa-play'));
    var startTutorialButton = element(by.css('.fa-question-circle'));
    var signOutButton = element(by.css('.fa-sign-out'));
    var searchInput = element(by.model('.searchText'));
    var searchButton = element(by.css('.fa-search'));

    var menuButton = element(by.css('.menuBtn'))

    this.locationPanel = new LocationPanel();
    this.attributePanel = new AttributePanel();
    this.timeSelector = new TimeSelector();
    this.chart = new Chart();
    this.toolbar = new Toolbar();
    this.explore = new Explore();
    this.analyze = new Analyze();

    this.search = function(text){
        searchInput.sendKeys(text);
        searchButton.click();
    }

    this.get = function() {
        browser.get('https://wstamp.ornl.gov/#/home/explore');
    };

    this.logout = function(){
       menuButton.click();
       signOutButton.click();
   }

  };

  module.exports = HomePage