"use strict";
var BasePage = require('./base.po.js');

var LoginPage = function() {

    this.usernameInput = $('#username');
    this.passwordInput = $('#password');
    this.loginButton = $('.fa-sign-in');

    this.url = "https://wstamp.ornl.gov";
    this.pageLoaded = this.isVisible(this.usernameInput);

    this.username = browser.params.wstampLogin.username;
    this.password = browser.params.wstampLogin.password;

    this.login = function(username=this.username, password=this.password ){
        this.usernameInput.sendKeys(username);
        this.passwordInput.sendKeys(password);
        this.loginButton.click();
    }

  };

  LoginPage.prototype = BasePage; // extend BasePage...
  module.exports = LoginPage