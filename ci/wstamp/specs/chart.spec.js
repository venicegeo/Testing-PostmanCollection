var LoginPage = require('../pageObjects/login.po');  
var LandingPage = require('../pageObjects/landing.po');  
var HomePage = require('../pageObjects/home/home.po');  
var utils = require('../utils');
                      
describe('Charts should function correctly.', function() {
  
  var loginPage = new LoginPage();
  var landingPage = new LandingPage();
  var homePage = new HomePage();
  var name = utils.randomString();
  var chart = homePage.explore.chart;

  beforeAll(function(){
    
    browser.driver.manage().window().maximize();
    loginPage.navigate();
    loginPage.login();

    landingPage.getStarted();
    
    homePage.explore.map.selectCountries(['United States', 'Canada', 'Mexico', 'China', 'India', 'Australia'])
    homePage.attributePanel.selectStamp('Demography');
    homePage.attributePanel.selectAttribute('Population Density');
    browser.ignoreSynchronization = true;
    homePage.attributePanel.hide();
    homePage.locationPanel.hide();
    utils.clearBrowserErrors();
    
  })

  afterAll(function(){
    browser.refresh()
    browser.ignoreSynchronization = false;
    homePage.logout();
  });

  beforeEach(function(){
    // necessary to prevent large tooltips from blocking buttons
    // utils.hideTooltips();  
  })

  afterEach(function(){
    browser.sleep(1000);
    utils.verifyNoBrowserErrors();
  })

 it('should show a Time Series chart', function() {  
    homePage.toolbar.selectVisType("Time Series");
    expect(chart.getYAxisText()).toContain("Population")
  });

  it('should show a Time Series with outliers chart', function() {  
    homePage.toolbar.selectVisType("Time Series with outliers");
    expect(chart.getYAxisText()).toContain("Population")
  });

  it('should show a Mean chart', function() {  
    homePage.toolbar.selectVisType("Mean");
    expect(chart.getYAxisText()).toContain("Mean")
  });

  it('should show a Median chart', function() {   
    homePage.toolbar.selectVisType("Median");
    expect(chart.getYAxisText()).toContain("Median")
  });

  it('should show a Variance chart', function() {   
    homePage.toolbar.selectVisType("Variance");
    expect(chart.getYAxisText()).toContain("Variance")
  });

  it('should show a Completeness by Location & Time chart', function() {   
    homePage.toolbar.selectVisType("Completeness by Location & Time");
  });

  it('should show a Completeness by Attribute & Time chart', function() {   
    homePage.toolbar.selectVisType("Completeness by Attribute & Time");
  });

  it('should show a Repetition by Location & Time chart', function() {   
    homePage.toolbar.selectVisType("Repetition by Location & Time");
  });

  it('should show a Repetition by Attribute & Time chart', function() {   
    homePage.toolbar.selectVisType("Repetition by Attribute & Time");
  });

  it('should show a Change by Location chart', function() {   
    homePage.toolbar.selectVisType("Change by Location"); 
  });

  it('should show a Change by Attribute chart', function() {   
    homePage.toolbar.selectVisType("Change by Attribute");
  });

  it('should show a Simple Clusters chart', function() {   
    homePage.toolbar.selectVisType("Simple Clusters");
  });

});