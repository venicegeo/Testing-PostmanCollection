var LoginPage = require('./pageObjects/login.po');  
var LandingPage = require('./pageObjects/landing.po');  
var HomePage = require('./pageObjects/home/home.po');  
var utils = require('./utils');
                      
describe('Test the map year functionality', function() {
  
  var loginPage = new LoginPage();
  var landingPage = new LandingPage();
  var homePage = new HomePage();

  var map = homePage.analyze.map;
  var year = 2016;

  beforeAll(function(){
    browser.driver.manage().window().maximize();
    loginPage.navigate();
    loginPage.login();
    landingPage.getStarted();

    homePage.explore.map.selectCountries(['United States']);
    homePage.attributePanel.addAllForStamp('ACLED');
    homePage.toolbar.setMode('Analyze');
    year = 2000;
  })


 it('should be able to change times amnd stay in sync', function() { 
    expect(map.getYear()).toEqual(homePage.timeSelector.getYear());
    homePage.timeSelector.setYear(2012);
    expect(map.getYear()).toEqual(2012);
    expect(homePage.timeSelector.getYear()).toEqual(2012);
    map.previousYear();
    expect(map.getYear()).toEqual(2011);
    expect(homePage.timeSelector.getYear()).toEqual(2011);
    map.nextYear();
    map.nextYear();
    expect(map.getYear()).toEqual(2013);
    expect(homePage.timeSelector.getYear()).toEqual(2013);   
 });



});