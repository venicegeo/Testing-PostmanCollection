
// // var AngularHomepage = require('./pages/angularHomepage.js');  
var LoginPage = require('./pageObjects/login.po');  
var LandingPage = require('./pageObjects/landing.po');  
var HomePage = require('./pageObjects/home/home.po');  
var verifyNoBrowserErrors = require('./utils.js')

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
  })

  afterEach(function(){
    browser.sleep(1000);
    homePage.logout();
    // verifyNoBrowserErrors();
  })

it('should select the center of the map', function() {  
  homePage.map.selectCountry("United States");
  homePage.map.selectCountry("China");
  homePage.map.selectCountry("Australia");
  homePage.map.selectCountry("India");
  browser.sleep(5000);
});


// m = document.querySelector('openlayermap')
// rect = m.getBoundingClientRect()
// center = {x: rect.right - rect.left, y: rect.bottom - rect.top}

// map = angular.element(m).scope().settings.mapReference
// map.getView().setCenter(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'))
// map.getView().setZoom(10)




// it('should be able to logout on main page', function() {  
//   homePage.timeSelector.setYear(1980);
//   expect(homePage.timeSelector.primaryYear.getText()).toEqual('1980')
//   expect(homePage.timeSelector.minSelectedYear.getText()).toEqual('1980');
//   homePage.toolbar.select('Time Series');
// });

  // it('should be able to logout on main page', function() {  
  //   homePage.timeSelector.setYear(1980);
  //   expect(homePage.timeSelector.primaryYear.getText()).toEqual('1980')
  //   expect(homePage.timeSelector.minSelectedYear.getText()).toEqual('1980');
  //   homePage.toolbar.select('Time Series');
  // });

  it('should be able to create and delete a location basket called locationtest', function(){
    homePage.locationPanel.addWorld();
    var basketName = Math.random().toString(36).substring(2,7);
    homePage.locationPanel.saveBasket(basketName);
    browser.refresh();
    homePage.locationPanel.deleteBasket(basketName);
  });

  it('should be able to create and delete an attribute basket called attributetest', function(){
    homePage.attributePanel.addACLED();
    var basketName = Math.random().toString(36).substring(2,7);
    homePage.attributePanel.saveBasket(basketName);
    browser.refresh();
    homePage.attributePanel.deleteBasket(basketName);
  });

  it('should be able to select the US, CA, MX and population density', function(){
    homePage.locationPanel.addWorld();
    var basketName = Math.random().toString(36).substring(2,7);
    homePage.locationPanel.saveBasket(basketName);
    browser.refresh();
    homePage.locationPanel.deleteBasket(basketName);
  });

});