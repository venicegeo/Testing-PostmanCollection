var Map = require('./map.po');
var Chart = require('./chart.po');


var Explore = function() {

    var me = $('.centerContent div.explore');
    this.map = new Map(me);
    this.chart = new Chart(me);

  };

  module.exports = Explore