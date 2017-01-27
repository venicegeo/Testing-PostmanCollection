var LoginPage = require('../pageObjects/login.po');  
var LandingPage = require('../pageObjects/landing.po');  
var HomePage = require('../pageObjects/home/home.po');  
var utils = require('../utils');

describe('Protractor Demo App', function() {
  
  var loginPage = new LoginPage();
  var landingPage = new LandingPage();
  var homePage = new HomePage();

  var locationBasketName = utils.randomString();
  var attributeBasketName = utils.randomString();


  beforeAll(function(){
    browser.driver.manage().window().maximize();
    loginPage.navigate();
    loginPage.login();
    landingPage.getStarted();
    // utils.hideTooltips();
  })

  beforeEach(function() {
    // utils.hideTooltips();
  })

  afterAll(function(){
    homePage.logout();
  })


  it('should be able to change the year to 1980', function() {  
    homePage.timeSelector.setYear(1980);
    expect(homePage.timeSelector.primaryYear.getText()).toEqual('1980')
    expect(homePage.timeSelector.minSelectedYear.getText()).toEqual('1980');
  });

  it('should be able to save a location basket', function(){
    homePage.locationPanel.addWorld();
    homePage.locationPanel.saveBasket(locationBasketName);
  });

  it('should be able to delete a location basket', function(){
    browser.refresh();
    homePage.locationPanel.deleteBasket(locationBasketName);
  });

  it('should delete all my location baskets', function() {  
    homePage.locationPanel.deleteAllMyBaskets();
    expect(homePage.locationPanel.myBasketsHeaderElement.isPresent()).toBe(false);
  });

  it('should be able to create an attribute basket', function(){
    homePage.attributePanel.addAllForStamp('ACLED');
    homePage.attributePanel.saveBasket(attributeBasketName);
  });

  it('should be able to delete an attribute basket', function(){
    browser.refresh();
    homePage.attributePanel.deleteBasket(attributeBasketName);
  });

  it('should delete all my attribute baskets', function() {  
    homePage.attributePanel.deleteAllMyBaskets();
    expect(homePage.attributePanel.myBasketsHeaderElement.isPresent()).toBe(false);
  });


  it('should add a shape file', function(){
    homePage.uploadShapefile(browser.params.shapefilePath);
  });

  it('should remove a shape file', function(){
    var removeShapefileButton = homePage.toolbar.removeShapefileButton;
    expect(removeShapefileButton.isDisplayed()).toBe(true);
    removeShapefileButton.click();
    expect(removeShapefileButton.isDisplayed()).toBe(false);
  });


});