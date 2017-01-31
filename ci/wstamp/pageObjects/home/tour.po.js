"use strict";

var Tour = function() {

    var me = $('.popover.tour-step');
    this.nextButton = me.element(by.cssContainingText('button', 'Next'));
    this.previousButton = me.element(by.cssContainingText('button', 'Prev'));
    this.endTourButton = me.element(by.cssContainingText('button', 'End tour'));

    this.next = function(){
        this.nextButton.click();
    };

    this.previous = function(){
        this.previousButton.click();
    };

    this.endTour = function(){
        this.endTourButton.click();
    };

    this.nextOrEnd = function(){
        return this.nextButton.isPresent().then((present)=>{
            if(present){
                return this.next();
            } else{
                return this.endTour();
            }
        });
    };

    this.stepThrough = function(){
        return this.nextOrEnd().then(()=>{
            return me.isPresent().then((present)=>{
                if(present){
                    return this.stepThrough();
                } else{
                    return; 
                }
            });
        });
    };

};

  module.exports = Tour