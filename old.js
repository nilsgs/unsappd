var fs = require('fs');
var https = require('https');
var last_check = '343858753';

// Read last checkin from file
fs.readFile("c:/Temp/node_text.txt", "utf8", function(err, checkin_id) {
    if (err) {
        return console.log(err);
    }
    last_check = checkin_id;
    // Print last checkin to console
    console.log("Checkin ID logged was: " + checkin_id);
    console.log("Checkin ID logged was: " + last_check);
});

console.log(last_check);

var optionsget = {
    host: 'api.untappd.com', // here only the domain name
    // (no http/https !)
    //port : 443,
    path: '/v4/user/checkins/erikfosser?client_id=27499F942C819337A0985BF35259CEF030C27E70&client_secret=D099C1C6B71797FEC0294D01EA3BF9A5BC0F0DB2&min_id=' + last_check,
    method: 'GET' // do GET
};

var optionspost = {
    host: 'iotmmsa3c582d9e.hana.ondemand.com',
    path: '/com.sap.iotservices.mms/v1/api/http/data/ccde54d4-1058-43c9-81c9-fa29deaa1805',
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + '3b66df9b905da9ffd2a199dfcdbe6a19',
        'Content-Type': 'application/json;charset=utf-8'
    }
};

// do the GET request
var reqGet = https.request(optionsget, function(res) {
    var obj = '';
    var beername;
    var beerscore;

    res.on('data', function(d) {
        obj += d;
    });

    res.on('end', function() {
        var result = JSON.parse(obj);

        //fs.writeFile("c:/Temp/node_text.txt", obj, function(err) {
        //    if (err) {
        //        return console.log(err);
        //    }
        //});

        result.response.items.map(function(item) {
            console.log('Checkin id: ' + item.checkin_id);
            console.log('Checked in at: ' + item.user.created_at);
            console.log('User name: ' + item.user.user_name);
            console.log('Location: ' + item.user.location);
            console.log('Beer: ' + item.beer.beer_name);
            console.log('Beer style: ' + item.beer.beer_style);
            console.log('Beer alc: ' + item.beer.beer_abv);
            console.log('Brewery: ' + item.brewery.brewery_name);
            console.log('Brewery country: ' + item.brewery.country_name);
            console.log('Rate score: ' + item.rating_score);
            console.log('Comment: ' + item.checkin_comment);
            console.log('\n-----------------------------------------\n');


            beername = item.beer.beer_name;
            beerscore = item.rating_score;

        });

        var reqPost = https.request(optionspost, function(res) {
            res.on('data', function(d) {
                console.log(d);
            });

            res.on('end', function() {
                console.log('finished');
            });

            res.on('error', function(e) {
                console.error(e);
            });
        });
        var x = {
            "mode": "sync",
            "messageType": "6c0d63f5601e043f6ca9",
            "messages": [{
                "beername": beername,
                "beerscore": beerscore
            }]
        };
        reqPost.write(JSON.stringify(x));
        reqPost.end();

    });
});

reqGet.end();
