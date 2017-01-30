var LoginPage = require('../pageObjects/login.po');  
var LandingPage = require('../pageObjects/landing.po');  
var HomePage = require('../pageObjects/home/home.po');  
var utils = require('../utils');

describe('The homepage menu', function() {
  
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
  })

  afterAll(function(){
    homePage.logout();
  })

  beforeEach(function(){
      browser.sleep(1000);
  })

  it('should open a profile modal', function() {  
    homePage.menuButton.click()
    homePage.profileButton.click();
    expect(homePage.modalTitle.getText()).toEqual('Account Settings');
    homePage.closeModalButton.click();
  });

  it('should open a group modal', function() {  
    homePage.menuButton.click()
    homePage.groupsButton.click();
    expect(homePage.modalTitle.getText()).toEqual('Group Management');
    homePage.closeModalButton.click();
  });

  it('should open an offer feedback modal', function() {  
    homePage.menuButton.click()
    homePage.offerFeedbackButton.click();
    expect(homePage.modalTitle.getText()).toEqual('Offer Feedback');
    homePage.closeModalButton.click();
  });

   it('should open a my stamps modal', function() {  
    homePage.menuButton.click()
    homePage.myStampsButton.click();
    expect(homePage.modal.getText()).toContain('My Stamps');
    homePage.closeModalButton.click();
  });

   it('should open a save modal', function() {  
    homePage.menuButton.click()
    homePage.saveButton.click();
    expect(homePage.modalTitle.getText()).toEqual('Save STAMP');
    homePage.closeModalButton.click();
  });

  it('should open a save as modal', function() {  
    homePage.menuButton.click()
    homePage.saveAsButton.click();
    expect(homePage.modalTitle.getText()).toEqual('Save STAMP');
    homePage.closeModalButton.click();
  });


});