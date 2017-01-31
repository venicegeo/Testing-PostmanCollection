"use strict";

var BasePage = require('../base.po');
var LocationPanel = require('./location.po');  
var AttributePanel = require('./attribute.po'); 
var TimeSelector = require('./time.po');
var Chart = require('./chart.po');
var Toolbar = require('./toolbar.po');
var Explore = require('./explore.po');
var Analyze = require('./analyze.po');
var Grid = require('./grid.po')
var Tour = require('./tour.po')

var HomePage = function() {
    this.url = 'https://wstamp.ornl.gov/#/home/explore';
    this.pageLoaded = this.inDom($('i.fa-home'));

    this.menuButton = $('.menuBtn')
    this.profileButton = element(by.cssContainingText('li', 'Profile'));
    this.groupsButton = element(by.cssContainingText('li', 'Groups'));
    this.manageDatasetsButton = element(by.cssContainingText('li', 'Manage Datasets'));
    this.uploadShapefileButton = element(by.cssContainingText('li', 'Upload Shapefile to Map'));
    this.offerFeedbackButton = element(by.cssContainingText('li', 'Offer Feedback'));
    this.myStampsButton = element(by.cssContainingText('li', 'My Stamps'));
    this.saveButton = element.all(by.cssContainingText('li', 'Save')).get(0);
    this.saveAsButton = element(by.cssContainingText('li', 'Save As'));
    this.signOutButton = element(by.cssContainingText('li', 'Log Out'));
    
    this.modal = $('.modal-content');
    this.modalTitle = this.modal.$('h1');
    this.closeModalButton = this.modal.$('i.fa-times');
    
    this.startTutorialButton = element(by.cssContainingText('button', 'Start Tutorial'));


    this.locationPanel = new LocationPanel();
    this.attributePanel = new AttributePanel();
    this.timeSelector = new TimeSelector();
    this.toolbar = new Toolbar();
    this.explore = new Explore();
    this.analyze = new Analyze();
    this.grid = new Grid();
    this.tour= new Tour();

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