"use strict";

var Grid = function() {

    var me = element(by.css('wstamp-grid'));

    var _getIndexForLocation = function(location){
        return $$('.ui-grid-canvas').get(0).$$('.ui-grid-cell-contents').map((e)=>{
            return e.getText();
        }).then((texts)=>{
            for(let [index, text] of texts.entries()){
                if (text.includes(location)){
                    return index;
                }
            }
            return null;
        })
    };

    var _getIndexForYear = function(year){
        return $$('.ui-grid-header-cell-row').get(1).$$('.ui-grid-header-cell-label').map((e)=>{
            return e.getText();
        }).then((texts)=>{
            for (let [index, text] of texts.entries()){
                if(text.includes(year.toString())){
                    return index;
                }
            }
            return null;
        })
    };

    this.getValueByLocationAndYear = function(location, year){
        return new Promise(function(resolve, reject){
             _getIndexForLocation(location).then((location_index)=>{
                _getIndexForYear(year).then((year_index)=>{
                    var row = $$('.ui-grid-canvas').get(1).$$('.ui-grid-row').get(location_index)
                    var cell = row.$$('.ui-grid-cell').get(year_index)
                    cell.getText().then((text)=>{
                        // '1,500' => '1500'
                        text = text.replace(/,/g, "");
                        if(isNaN(text)){
                            return text;
                        }else{
                            resolve(parseFloat(text));
                        }
                    })
                })
             })
        });
    };
    
};
  module.exports = Grid