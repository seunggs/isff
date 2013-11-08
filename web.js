var express = require("express");
var url = require("url");
var https = require("https");
var http = require("http");

var app = express();
// app.use(express.logger());

app.use(express.static(__dirname + '/public'));

/* Helper UTILS */
var validateEmail = function(query){
	var re = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}\b/;
	if (query.email && re.test(query.email.toLowerCase())){
		return(true);
	} else {
		return(false);
	}
}

/* Surface ROUTES */
// Routes to views
app.get('/', function(request, response) {
	response.sendfile('./views/index.html');
});

app.get('/email', function(request, response) {
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;

	if (validateEmail(query)){
	// 	var path = "/1.3/?method=listSubscribe";
	// 	// DEV key
	// 	path += "&apikey=f763c3e3b52322971d34e694d6b45f25-us6";
	// 	path += "&id=599e0cea16";
	// 	// PRODUCTION key
	// 	// path += "&apikey=419d7b769b3aba041aa80a0a7cd4edd1-us6";
	// 	// path += "&id=743f4bd26a";
	// 	path += "&email_address=" + query.email.toLowerCase();
	// 	path += "&double_optin=false";
	// 	path += "&update_existing=true";

	// 	var options = {
	// 		host: 'us6.api.mailchimp.com',
	// 		port: 443,
	// 		path: path,
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Length': 0
	// 		}
	// 	};

	// 	var req = https.request(options, function(res) {
	// 		console.log("statusCode: ", res.statusCode);
	// 		res.setEncoding('utf8');
	// 		res.on('data', function (chunk) {
	// 			if(chunk == "true")
	// 				response.send("Thank you for signing up!");
	// 			else{
	// 				response.send("Something went wrong.");
	// 			}
	// 		});
	// });

		req.on('error', function(e){
			response.send("Something went wrong... " + e);
		});
		req.end();
	} else {
		response.json({e:1, msg:"This email address does not look valid."});
	}

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});