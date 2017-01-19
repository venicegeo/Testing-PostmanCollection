
module.exports.verifyNoBrowserErrors = function verifyNoBrowserErrors(){
    browser.manage().logs().get('browser').then(function(browserLog) {
      browserLog.map(function(logEntry){
        console.log(logEntry.message);
      });
      expect(browserLog.length).toEqual(0);
    });
};

module.exports.clearBrowserErrors = function clearBrowserErrors(){
    browser.manage().logs().get('browser')
};