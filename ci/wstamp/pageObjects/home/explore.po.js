var Map = require('./map.po')


var Explore = function() {

    var me = element(by.css('.centerContent div.explore'));
    this.map = new Map(me);

  };

  module.exports = Explore