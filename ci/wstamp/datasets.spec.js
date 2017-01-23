
// // var AngularHomepage = require('./pages/angularHomepage.js');  
var LoginPage = require('./pageObjects/login.po');  
var LandingPage = require('./pageObjects/landing.po');  
var HomePage = require('./pageObjects/home/home.po');  
var verifyNoBrowserErrors = require('./utils.js')

describe('Protractor Demo App', function() {
  
  var loginPage = new LoginPage();
  var landingPage = new LandingPage();
  var homePage = new HomePage();

  beforeAll(function(){
    browser.driver.manage().window().maximize();
    loginPage.navigate();
    loginPage.login();
    landingPage.getStarted();
  })

  it('should be able to upload a test dataset', function() { 
    var path = __dirname + "/data/test-upload.csv"
    homePage.uploadDataset(path);
    expect(homePage.attributePanel.getStampElement('Test').isPresent()).toBeTruthy();
  });

  it('should be able to analyze a test dataset', function() { 
    homePage.explore.map.selectCountries(['United States', 'Canada']);
    homePage.attributePanel.addAllForStamp('Test');
    homePage.toolbar.setMode('Analyze');
    expect(homePage.grid.getValueByLocationAndYear('United States', 2005)).toEqual(1000);
    expect(homePage.grid.getValueByLocationAndYear('United States', 2010)).toEqual(1500);
  });

  it('should be able to delete a test dataset', function() { 
    homePage.deleteDataset('Test');
    expect(homePage.attributePanel.getStampElement('Test').isPresent()).toBeFalsy();
  });

});