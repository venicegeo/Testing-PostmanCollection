var LoginPage = require('../pageObjects/login.po');  
var LandingPage = require('../pageObjects/landing.po');  
var HomePage = require('../pageObjects/home/home.po');  
var utils = require('../utils');

describe('The homepage', function() {
  
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