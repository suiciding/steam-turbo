var SteamCommunity = require('steamcommunity');
var ReadLine = require('readline');
var fs = require('fs');

var request = require("request");


var community = new SteamCommunity();

var cnt = 0;

var targetUser = ""; // your username
var targetPass = ""; // your password
var apiKey = ""; // Steam dev api ke. Google steam api key
var pDelay = 100; // delay is in ms
var debug = 1; // displays the count. 0 to turn off


var targetID = ""; // steam id you're trying to get

var targetString = "No match";

var rl = ReadLine.createInterface({
"input": process.stdin,
"output": process.stdout
});

doLogin(targetUser, targetPass);

function jetEngine() {
request("http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" + apiKey + "&vanityurl=" + targetID, function(error, response, body) {
 if(body.indexOf(targetString) > -1) {
claim();
}
else {
cnt++;
if (debug > 0) {
console.log(cnt);
}
}
});
}



function doLogin(accountName, password, authCode, twoFactorCode, captcha) {
community.login({
"accountName": accountName,
"password": password,
"authCode": authCode,
"twoFactorCode": twoFactorCode,
"captcha": captcha
}, function(err, sessionID, cookies, steamguard) {
if(err) {
if(err.message == 'SteamGuard') {
rl.question("Steam Guard (EMAIL): ", function(code) {
doLogin(accountName, password, code);
});

return;
}
if(err.message == 'SteamGuardMobile') {

rl.question("Steam Guard (MOBILE): ", function(code) {
doLogin(accountName, password, null, code);
});

return;
}
if(err.message == 'CAPTCHA') {
console.log(err.captchaurl);
rl.question("CAPTCHA: ", function(captchaInput) {
doLogin(accountName, password, null, captchaInput);
});

return;
}

console.log(err);
process.exit();
return;
}

console.log("Started turboing " + targetID + " to account " + accountName);


setInterval(jetEngine, pDelay);

});

}

function setClaim() {
community.editProfile({
       "customURL": targetID,
   }, function(err){
       if (err) {

}
       else {
           console.log("Turboed!");
           sys.exit(0);
       }
});
}
var claim = (function() {
   var executed = false;
   return function() {
       if (!executed) {
           executed = true;
           setClaim();
}
   };
})();
