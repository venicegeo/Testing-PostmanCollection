"use strict";

var BasePage = require('../base.po.js');
var LocationPanel = require('./location.po');  
var AttributePanel = require('./attribute.po'); 
var TimeSelector = require('./time.po');
var Chart = require('./chart.po');
var Toolbar = require('./toolbar.po');
var Explore = require('./explore.po');
var Analyze = require('./analyze.po');
var Grid = require('./grid.po')

var HomePage = function() {
    this.url = 'https://wstamp.ornl.gov/#/home/explore';
    this.pageLoaded = this.inDom($('i.fa-home'));

    this.menuButton = $('.menuBtn')
    this.manageDatasetsButton = element(by.cssContainingText('li', 'Manage Datasets'));
    this.uploadShapefileButton = element(by.cssContainingText('li', 'Upload Shapefile to Map'));
    this.signOutButton = element(by.cssContainingText('li', 'Log Out'));

    this.locationPanel = new LocationPanel();
    this.attributePanel = new AttributePanel();
    this.timeSelector = new TimeSelector();
    this.toolbar = new Toolbar();
    this.explore = new Explore();
    this.analyze = new Analyze();
    this.grid = new Grid();

    this.search = function(text){
        searchInput.sendKeys(text);
        searchButton.click();
    }

    this.logout = function(){
       this.menuButton.click();
       this.signOutButton.click();
   }

   this.uploadDataset = function(path){

       // used to allow file uploads on remote selenium grids
       var remote = require('selenium-webdriver/remote');
       browser.setFileDetector(new remote.FileDetector());

       this.menuButton.click();
       this.manageDatasetsButton.click();
       element(by.cssContainingText('button',"Upload New Dataset")).click();
       // this skips the step of opening the file dialog window and instead
       // sends the file path directly
       $('input[type="file"]').sendKeys(path);
       element(by.cssContainingText('button','Save')).click();
       $('button.ok').click();
       $('i.fa-times').click();
   }

   this.deleteDataset = function(name){
     this.menuButton.click();
     this.manageDatasetsButton.click();
     var ele = element(by.cssContainingText('div.ui-grid-canvas .ui-grid-cell-contents', name))
     var row = ele.element(by.xpath('..')).element(by.xpath('..')).element(by.xpath('..'))
     row.$('.deleteIcon').click();
     $('button.ok').click();
     $('i.fa-times').click();
   }

   this.uploadShapefile = function(path){

       // used to allow file uploads on remote selenium grids
       var remote = require('selenium-webdriver/remote');
       browser.setFileDetector(new remote.FileDetector());

       this.menuButton.click();
       this.uploadShapefileButton.click();
       // this skips the step of opening the file dialog window and instead
       // sends the file path directly
       $('input[type="file"]').sendKeys(path);
       browser.sleep(500);
       element(by.cssContainingText('button', 'Submit')).click();
   }

  };
  HomePage.prototype = BasePage; // extend BasePage...
  module.exports = HomePage