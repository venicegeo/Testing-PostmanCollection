"use strict";

var LoginPage = function() {

    this.usernameInput = $('#username');
    this.passwordInput = $('#password');
    this.loginButton = $('.fa-sign-in');

    this.username = browser.params.wstampLogin.username;
    this.password = browser.params.wstampLogin.password;

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