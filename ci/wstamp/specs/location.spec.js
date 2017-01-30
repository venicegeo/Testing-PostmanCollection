var LoginPage = require('../pageObjects/login.po');  
var LandingPage = require('../pageObjects/landing.po');  
var HomePage = require('../pageObjects/home/home.po');  
var utils = require('../utils');

describe('The homepage location panel', function() {
  
  var loginPage = new LoginPage();
  var landingPage = new LandingPage();
  var homePage = new HomePage();

  var locationBasketName = utils.randomString();

  beforeAll(function(){
    browser.driver.manage().window().maximize();
    loginPage.navigate();
    loginPage.login();
    landingPage.getStarted();
  })

  afterAll(function(){
    homePage.logout();
  })

  beforeEach(function(){
    homePage.toolbar.resetSelections();
  })


  it('should be able to search for South Korea', function(){
    homePage.locationPanel.search('South Korea');
    expect(homePage.locationPanel.searchResults.getText()).toContain('South Korea');
    expect(homePage.locationPanel.searchResults.count()).toEqual(1);
  });

  it('should be able to search for South', function(){
    homePage.toolbar.resetSelections();
    homePage.locationPanel.search('South');
    expect(homePage.locationPanel.searchResults.getText()).toContain('South Korea');
    expect(homePage.locationPanel.searchResults.count()).toBeGreaterThan(1);
  });

  it('should be able to search for a fake location', function(){
    homePage.toolbar.resetSelections();
    homePage.locationPanel.search('asdaskdlasda');
    expect(homePage.locationPanel.searchResults.count()).toEqual(0);
  });

  it('should be able to save a location basket', function(){
    homePage.toolbar.resetSelections();
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

});