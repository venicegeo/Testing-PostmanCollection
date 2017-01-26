var LoginPage = require('../pageObjects/login.po');  
var LandingPage = require('../pageObjects/landing.po');  
var HomePage = require('../pageObjects/home/home.po');  
var utils = require('../utils');

describe('Test custom dataset functionality', function() {
  
  var loginPage = new LoginPage();
  var landingPage = new LandingPage();
  var homePage = new HomePage();

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

  it('should be able to save and delete a stamp with a custom dataset', function() { 
    var stampName = utils.randomString();
    homePage.toolbar.saveStamp(stampName);
    var username = browser.params.wstampLogin.username
    var url = 'https://wstamp.ornl.gov/#/s/'+ username +'/' + stampName + '/analyze'
    browser.refresh();
    browser.get(url);
    expect(homePage.toolbar.numLocationsSelected()).toEqual(2);
    expect(homePage.toolbar.numAttributesSelected()).toEqual(1);
    landingPage.navigate();
    landingPage.deleteStamp(stampName);
    homePage.navigate();
  
  });

  it('should be able to delete a test dataset', function() { 
    homePage.deleteDataset('Test');
    expect(homePage.attributePanel.getStampElement('Test').isPresent()).toBeFalsy();
  });

});