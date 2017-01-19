
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
  })

  beforeEach(function() {
    loginPage.navigate();
    loginPage.login();
    landingPage.getStarted();
  })

  afterEach(function(){
    browser.sleep(1000);
    homePage.logout();
    // verifyNoBrowserErrors();
  })

  it('should be able to select countries', function() { 
    var countries = ['United States', 'Canada', 'Mexico', 'China', 'India', 'Australia'];
    homePage.map.selectCountries(countries);
    expect(homePage.locationPanel.numSelected()).toEqual(countries.length);
  });

  it('should be able to change the year to 1980', function() {  
    homePage.timeSelector.setYear(1980);
    expect(homePage.timeSelector.primaryYear.getText()).toEqual('1980')
    expect(homePage.timeSelector.minSelectedYear.getText()).toEqual('1980');
  });

  it('should be able to create and delete a location basket', function(){
    homePage.locationPanel.addWorld();
    var basketName = Math.random().toString(36).substring(2,7);
    homePage.locationPanel.saveBasket(basketName);
    browser.refresh();
    homePage.locationPanel.deleteBasket(basketName);
  });

  it('should be able to create and delete an attribute basket', function(){
    homePage.attributePanel.addACLED();
    var basketName = Math.random().toString(36).substring(2,7);
    homePage.attributePanel.saveBasket(basketName);
    browser.refresh();
    homePage.attributePanel.deleteBasket(basketName);
  });


});