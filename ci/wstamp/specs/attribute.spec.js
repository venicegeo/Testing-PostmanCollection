var LoginPage = require('../pageObjects/login.po');  
var LandingPage = require('../pageObjects/landing.po');  
var HomePage = require('../pageObjects/home/home.po');  
var utils = require('../utils');

describe('The homepage attribute panel', function() {
  
  var loginPage = new LoginPage();
  var landingPage = new LandingPage();
  var homePage = new HomePage();

  var attributeBasketName = utils.randomString();


  beforeAll(function(){
    browser.driver.manage().window().maximize();
    loginPage.navigate();
    loginPage.login();
    landingPage.getStarted();
  })

  beforeEach(function() {
    homePage.toolbar.resetSelections();
  })

  afterAll(function(){
    homePage.logout();
  })

  it('should be able to search for population', function(){
    homePage.attributePanel.search('population');
    expect(homePage.attributePanel.searchResults.count()).toBeGreaterThan(1);
  });

  it('should be able to search for a fake attribute', function(){
    homePage.attributePanel.search('asdasfdasfdasfaseasd');
    expect(homePage.attributePanel.searchResults.count()).toEqual(0);
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

});