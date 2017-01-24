var Map = require('./map.po');
var Chart = require('./chart.po');


var Analyze = function() {

    var me = $('.centerContent div.analyze');
    this.map = new Map(me);
    this.chart = new Chart(me);

  };

  module.exports = Analyze