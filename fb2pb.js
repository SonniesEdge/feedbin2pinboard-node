// SETTINGS
var feedbin = '';   // Feedbin starred entries URL. Get from https://feedbin.com/settings
var pinboard = '';  // Pinboard apitoken username:random. Get from https://pinboard.in/settings/password

// REQUIREMENTS
var Pinboard = require('node-pinboard');
var request = require('request');
var parseString = require('xml2js').parseString;

// Access Pinboard
var pb = new Pinboard(pinboard);


request.get(feedbin, function (error, response, body) {
  if (!error && response.statusCode == 200) {

    // Parse the Feedbin XML
    parseString(body, function (err, result) {
      var feedlength = result['rss']['channel'][0]['item'].length;

      for (var i = 0; i < feedlength; i++) {
        console.log(result['rss']['channel'][0]['item'][i]['title'][0]);
        console.log(result['rss']['channel'][0]['item'][i]['pubDate'][0]);
        console.log(result['rss']['channel'][0]['item'][i]['link'][0]);
        console.log('-----------');

        var options = {
          url: result['rss']['channel'][0]['item'][i]['link'][0],
          description: result['rss']['channel'][0]['item'][i]['title'][0],
          tags: 'customimport, Feedbin, dailyimport',
          toread: 'yes',
          replace: 'no'
        };

        pb.add(options, function(res) {
          console.log(res);
        });


      } // /forloop
    }); // /Parsestring


  } else {
    console.log('Could not connect to ' + feedbin + ' \nCheck that the supplied URL is correct.');
  }
});
