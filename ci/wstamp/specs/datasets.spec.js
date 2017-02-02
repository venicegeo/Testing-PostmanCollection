var LoginPage = require('../pageObjects/login.po');  
var LandingPage = require('../pageObjects/landing.po');  
var HomePage = require('../pageObjects/home/home.po');  
var utils = require('../utils');

describe('Custom datasets', function() {
  
  var loginPage = new LoginPage();
  var landingPage = new LandingPage();
  var homePage = new HomePage();
  var stampName = utils.randomString();

  beforeAll(function(){
    browser.driver.manage().window().maximize();
    loginPage.navigate();
    loginPage.login();
    landingPage.getStarted();
  })

  afterAll(function(){
    homePage.logout();
  })

  it('should be able to upload a test dataset', function() { 
    homePage.uploadDataset(browser.params.datasetPath);
    expect(homePage.attributePanel.getStampElement('Test').isPresent()).toBeTruthy();
  });

  it('should be able to analyze a test dataset', function() { 
    homePage.explore.map.selectCountries(['United States', 'Canada']);
    homePage.attributePanel.addAllForStamp('Test');
    homePage.toolbar.setMode('Analyze');
    expect(homePage.grid.getValueByLocationAndYear('United States', 2002)).toEqual(700);
    expect(homePage.grid.getValueByLocationAndYear('United States', 2003)).toEqual(800);
    expect(homePage.grid.getValueByLocationAndYear('Canada', 2003)).toEqual('N/A');
  });

  it('should be able to save and a stamp with a custom dataset', function() { 
    homePage.toolbar.saveStamp(stampName);
  });

  it('should be able to delete all of my stamps', function() {
    landingPage.navigate();
    landingPage.deleteAllStamps();
    expect(landingPage.myStampInfoButtons.count()).toEqual(0)
  });

  it('should be able to delete a test dataset', function() { 
    homePage.navigate();
    homePage.deleteDataset('Test');
    expect(homePage.attributePanel.getStampElement('Test').isPresent()).toBeFalsy();
  });


});