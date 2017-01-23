var Map = require('./map.po')


var Analyze = function() {

    var me = $('.centerContent div.analyze');
    this.map = new Map(me);

  };

  module.exports = Analyze