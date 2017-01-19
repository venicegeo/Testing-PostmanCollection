"use strict";

var Map = function() {
    var me = element(by.css("openlayermap"));
   

    function centerMap(lat, long){
       return "var m = document.querySelector('openlayermap'); \
       map = angular.element(m).scope().settings.mapReference; \
       map.getView().setCenter(ol.proj.transform([" + long + "," + lat +"], 'EPSG:4326', 'EPSG:3857')); \
       map.getView().setZoom(3);"
   }

//    this.selectCountries = function(countries){
//        var promises = []
//        countries.map((country)=>{
//         //    return this.selectCountry(country);
//            promises.push(this.selectCountry(country));
//        })

//        promises.reduce((p, fn) => p.then(fn), Promise.resolve())

//        return Promise.all(promises)
//        for(let country of countries){
//            this.selectCountry(country);
//         }
//    }

   this.selectCountry = function(country){
       var countries = {
           'UNITED STATES': {lat:40.4 , long:-101.3},
           'CANADA': {lat:40.4 , long:-101.3},
           'MEXICO': {lat: 23.6, long:-102.6},
           'CHINA': {lat: 34.4 , long: 103.6},
           'INDIA': {lat: 22.6, long:79.4},
           'AUSTRALIA': {lat: -25.1, long: 134.3},
        }

        var center = countries[country.toUpperCase()];

        return browser.executeScript(centerMap(center.lat, center.long)).then(function(){
            browser.sleep(500)
            me.click();
        })
     }

  };

  module.exports = Map