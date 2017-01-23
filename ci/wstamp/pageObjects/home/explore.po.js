var Map = require('./map.po')


var Explore = function() {

    var me = $('.centerContent div.explore');
    this.map = new Map(me);

  };

  module.exports = Explore