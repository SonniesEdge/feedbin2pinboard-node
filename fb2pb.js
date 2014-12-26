// SETTINGS
var feedbin = '';   // Feedbin starred entries URL. Get from https://feedbin.com/settings
var pinboard = '';  // Pinboard apitoken username:random. Get from https://pinboard.in/settings/password

// REQUIREMENTS
var Pinboard = require('node-pinboard');
var request = require('request');
var parseString = require('xml2js').parseString;

// Access Pinboard
var pb = new Pinboard(pinboard);
var fs = require("fs");
// var storage = {};

request.get(feedbin, function (error, response, body) {
  if (!error && response.statusCode == 200) {

    // Parse the Feedbin XML
    parseString(body, function (err, result) {
      // console.log(JSON.stringify(result));
      // console.log(result.rss.channel[0].item[0].title[0]);
      // console.log(result.rss.length);

      var feedlength = result['rss']['channel'][0]['item'].length;

      for (var i = 0; i < feedlength; i++) {
        // Enclose everything in enclosed function so that it works correctly with
        // async operations
        (function(cntr) {
          var options = {
            url: result['rss']['channel'][0]['item'][i]['link'][0],
            description: result['rss']['channel'][0]['item'][i]['title'][0],
            tags: 'customimport, Feedbin, dailyimport',
            toread: 'yes',
            replace: 'no'
          };

          // Load this every loop, as it might have been changed by other operations
          var storage = require("./storage.json");

          // check to see if URL is in "completed" object
          if (storage[options.url] == 'done') {
            console.log('I think I have already sent this to Pinboard: ' + options.url);
          } else {
            pb.add(options, function(res) {
              if (res.result_code == 'done') {
                storage[options.url] = res.result_code;
                fs.writeFile( "storage.json", JSON.stringify(storage), "utf8", function(err) {
                  if (err) {
                    return console.log(err);
                  } else {
                    console.log('I have sent the following to Pinboard: ' + options.url);
                  }
                });
              }
            });
          }

        })(i);
      } // /forloop

    }); // /Parsestring

  } else {
    console.log('I could not connect to ' + feedbin + ' \nPlease check that the supplied URL is correct.');
  }
});
