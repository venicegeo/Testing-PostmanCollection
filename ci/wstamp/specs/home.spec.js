var path = require("path");
var LoginPage = require('../pageObjects/login.po');  
var LandingPage = require('../pageObjects/landing.po');  
var HomePage = require('../pageObjects/home/home.po');  
var utils = require('../utils');

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
    utils.hideTooltips();
  })

  afterEach(function(){
    browser.sleep(1000);
    homePage.logout();
    // utils.verifyNoBrowserErrors();
  })

  it('should be able to select countries', function() { 
    var countries = ['United States', 'Canada', 'Mexico', 'China', 'India', 'Australia'];
    homePage.explore.map.selectCountries(countries);
    expect(homePage.locationPanel.numSelected()).toEqual(countries.length);
  });

  it('should be able to change the year to 1980', function() {  
    homePage.timeSelector.setYear(1980);
    expect(homePage.timeSelector.primaryYear.getText()).toEqual('1980')
    expect(homePage.timeSelector.minSelectedYear.getText()).toEqual('1980');
  });

  it('should be able to create and delete a location basket', function(){
    homePage.locationPanel.addWorld();
    var basketName = utils.randomString();
    homePage.locationPanel.saveBasket(basketName);
    browser.refresh();
    homePage.locationPanel.deleteBasket(basketName);
  });

  it('should be able to create and delete an attribute basket', function(){
    homePage.attributePanel.addAllForStamp('ACLED');
    var basketName = utils.randomString();
    homePage.attributePanel.saveBasket(basketName);
    browser.refresh();
    homePage.attributePanel.deleteBasket(basketName);
  });

  it('should add and remove a shape file', function(){
    var removeShapefileButton = homePage.toolbar.removeShapefileButton;
    var absolutePath = path.join(__dirname , "../data/test-shapefile.shp");
    homePage.uploadShapefile(absolutePath);
    expect(removeShapefileButton.isDisplayed()).toBe(true);
    removeShapefileButton.click();
    expect(removeShapefileButton.isDisplayed()).toBe(false);
  });

});