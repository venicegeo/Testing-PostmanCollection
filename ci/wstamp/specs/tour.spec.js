var LoginPage = require('../pageObjects/login.po');  
var LandingPage = require('../pageObjects/landing.po');  
var HomePage = require('../pageObjects/home/home.po');  
var utils = require('../utils');

describe('The tutorial', function() {
  
  var loginPage = new LoginPage();
  var landingPage = new LandingPage();
  var homePage = new HomePage();

  var locationBasketName = utils.randomString();
  var attributeBasketName = utils.randomString();


  beforeAll(function(){
    browser.driver.manage().window().maximize();
    loginPage.navigate();
    loginPage.login();
  })

  it('should start', function() {  
    landingPage.startTutorial();
    expect(browser.getCurrentUrl()).toContain("/home");
  });
 
  it('should go to the next step', function() {  
    expect(browser.getCurrentUrl()).toContain("/home");
    homePage.tour.next();
  });

  it('should go to the previous step', function() {  
    homePage.tour.previous();
  });

  it('should end early', function() {  
    homePage.tour.endTour();
  });

  it('should start again from the button on the home page', function() {  
    homePage.startTutorialButton.click();
  });
  
  it('should click next all the way to the end', function() {  
    homePage.tour.stepThrough();
  });


});