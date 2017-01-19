
// // var AngularHomepage = require('./pages/angularHomepage.js');  
var LoginPage = require('./pageObjects/login.po');  
var LandingPage = require('./pageObjects/landing.po');  
var HomePage = require('./pageObjects/home/home.po');  
var utils = require('./utils');


// var verifyNoBrowserErrors = require('./utils.js')   
// var clearBrowserErrors = require('./utils.js')                          

describe('Protractor Demo App', function() {
  
  var loginPage = new LoginPage();
  var landingPage = new LandingPage();
  var homePage = new HomePage();

  beforeAll(function(){
    browser.driver.manage().window().maximize();
    loginPage.navigate();
    loginPage.login();
    landingPage.getStarted();
    browser.sleep(500)
    homePage.toolbar.resetSelections();
    homePage.map.selectCountries(['United States', 'Canada', 'Mexico', 'China', 'India', 'Australia'])
    homePage.attributePanel.selectStamp('Demography');
    homePage.attributePanel.selectAttribute('Population Density');
    utils.clearBrowserErrors();
  })

  afterEach(function(){
    browser.sleep(1000);
    utils.verifyNoBrowserErrors();
  })

 it('should select the center of the map', function() {  
    homePage.toolbar.selectVisType("Time Series");
    var yAxis = homePage.chart.getYAxis()
    expect(yAxis.getText()).toContain("Population")
  });

  it('should show a Time Series with outliers chart', function() {  
    homePage.toolbar.selectVisType("Time Series with outliers");
    var yAxis = homePage.chart.getYAxis()
    expect(yAxis.getText()).toContain("Population")
  });

  it('should show a Mean chart', function() {  
    homePage.toolbar.selectVisType("Mean");
    var yAxis = homePage.chart.getYAxis()
    expect(yAxis.getText()).toContain("Mean")
  });

  it('should show a Median chart', function() {   
    homePage.toolbar.selectVisType("Median");
    var yAxis = homePage.chart.getYAxis()
    expect(yAxis.getText()).toContain("Median")
  });

  it('should show a Variance chart', function() {   
    homePage.toolbar.selectVisType("Variance");
    var yAxis = homePage.chart.getYAxis()
    expect(yAxis.getText()).toContain("Variance")
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

  it('should show a  chart', function() {   
    homePage.toolbar.selectVisType("Change by Location"); 
  });

  it('should show a Change by Location chart', function() {   
    homePage.toolbar.selectVisType("Change by Attribute");
  });

  it('should show a Simple Clusters chart', function() {   
    homePage.toolbar.selectVisType("Simple Clusters");
  });

});