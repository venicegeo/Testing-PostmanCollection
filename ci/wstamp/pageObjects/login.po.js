"use strict";

var LoginPage = function() {

    this.usernameInput = $('#username');
    this.passwordInput = $('#password');
    this.loginButton = $('.fa-sign-in');

    this.username = process.env.WSTAMP_USERNAME;
    this.password = process.env.WSTAMP_PASSWORD;

    this.navigate = function() {
        browser.get('https://wstamp.ornl.gov');
    };

    this.login = function(username=this.username, password=this.password ){
        this.usernameInput.sendKeys(username);
        this.passwordInput.sendKeys(password);
        this.loginButton.click();
    }

  };

  module.exports = LoginPage