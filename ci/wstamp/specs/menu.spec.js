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
      homePage.menuButton.click();
  })

  afterEach(function(){
     homePage.closeModalButton.click(); 
  })

  it('should open a profile modal', function() {  
    homePage.profileButton.click();
    expect(homePage.modalTitle.getText()).toEqual('Account Settings');
  });

  it('should open a groups modal', function() {  
    homePage.groupsButton.click();
    expect(homePage.modalTitle.getText()).toEqual('Group Management');
  });

  it('should open a manage datasets modal', function() {  
    homePage.manageDatasetsButton.click();
    expect(homePage.modalTitle.getText()).toEqual('Dataset Management');
  });

  it('should open an offer feedback modal', function() {  
    homePage.offerFeedbackButton.click();
    expect(homePage.modalTitle.getText()).toEqual('Offer Feedback');
  });

   it('should open a my stamps modal', function() {  
    homePage.myStampsButton.click();
    expect(homePage.modal.getText()).toContain('My Stamps');
  });

   it('should open a save modal', function() {  
    homePage.saveButton.click();
    expect(homePage.modalTitle.getText()).toEqual('Save STAMP');
  });

  it('should open a save as modal', function() {  
    homePage.saveAsButton.click();
    expect(homePage.modalTitle.getText()).toEqual('Save STAMP');
  });


});