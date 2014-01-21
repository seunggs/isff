var express = require("express");
var url = require("url");
var https = require("https");
var http = require("http");

var app = express();
// app.use(express.logger());

app.use(express.static(__dirname + '/public'));
// app.use(express.favicon(__dirname, 'public/image/favicon.ico')); 

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
// Routes to static views
app.get('/', function(request, response) {
	response.sendfile('./public/index.html');
});

app.get('/404', function(request, response) {
	response.sendfile('./public/404.html')
})

app.get('/toronto-poutine-fest', function(request, response) {
	response.sendfile('./public/poutine-fest.html')
})

app.get('/grilled-cheese-fest', function(request, response) {
	// response.sendfile('./public/grilled-cheese.html')
	response.redirect('http://signup.torontogrilledcheesefest.com')

})

app.get('/grilled-cheese-fest-buynow', function(request, response) {
	response.sendfile('./public/grilled-cheese.html')
})

app.get('/poutine-passport', function(request, response) {
	response.sendfile('./public/passport.html')
})

// app.get('/toronto-bar-fest', function(request, response) {
// 	response.sendfile('./public/bar-fest.html')
// })

// Special link to bar fest purchasing
// app.get('/toronto-bar-fest-presale', function(request, response) {
// 	response.redirect('http://ticketing.joylister.com/purchase/toronto-bar-fest')
// })

// Special link to grilled cheese fest purchasing
app.get('/grilled-cheese-fest-presale', function(request, response) {
	response.redirect('http://ticketing.joylister.com/purchase/grilled-cheese-fest')
})

app.get('/privacy', function(request, response) {
	response.sendfile('./public/privacy.html')
})
app.get('/tac', function(request, response) {
	response.sendfile('./public/tac.html')
})
app.get('/tos', function(request, response) {
	response.sendfile('./public/tos.html')
})

/* RESTful ROUTES */
// Email signup
app.get('/email', function(request, response) {
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;

	// Master list Id
	// 785c85c66f
		
	// Bar-fest list ID
	// 85423af617

	// Grilled cheese list ID
	// 66f3172c35

	if (validateEmail(query)){
		var path = "/1.3/?method=listSubscribe";
		// DEV key
		// path += "&apikey=f763c3e3b52322971d34e694d6b45f25-us6";
		// path += "&id=599e0cea16";
		// PRODUCTION key
		path += "&apikey=419d7b769b3aba041aa80a0a7cd4edd1-us6";


		if(typeof(query.mail_list) === 'undefined') {
			console.log("No list specified");
			path += "&id=785c85c66f";
		} else {
			console.log(query.mail_list + " is the list to be subscribed");
			if(query.mail_list == 'grilled-cheese-fest') {
				path += "&id=66f3172c35";
			} else {
				path += "&id=785c85c66f"; // default to master list
			}
		}

		// Main joylister mailing list

		path += "&email_address=" + query.email.toLowerCase();
		path += "&double_optin=false";
		path += "&update_existing=true";
		path += "&merge_vars[FNAME]=" + query.fname;
		path += "&merge_vars[LNAME]=" + query.lname;

		var options = {
			host: 'us6.api.mailchimp.com',
			port: 443,
			path: path,
			method: 'POST',
			headers: {
				'Content-Length': 0
			}
		};

		var req = https.request(options, function(res) {
			console.log("statusCode: ", res.statusCode);
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				if(chunk == "true")
					response.json({e:0, msg:"Thank you for signing up!"});
				else{
					response.json({e:2, msg:"We're sorry, but we couldn't reach the server at this time. Please try again in a bit!"});
					console.log("Unable to successfully get response from Mailchimp");
				}
			});
	});

		req.on('error', function(e){
			response.json({e:2, msg:"We're sorry, but we couldn't reach the server at this time. Please try again in a bit!"});
			console.log("Error from mailchimp: " + e);
		});
		req.end();
	} else {
		response.json({e:1, msg:"This email address does not look valid."});
	}

});


// Error handling
app.get('*', function(req, res){
  res.sendfile('./public/404.html', 404);
});


// Start the server
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});