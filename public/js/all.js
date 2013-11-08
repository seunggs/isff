$(document).ready(function(){
	
$("[id$=email]").click(function(){
	// this.parent is the containing div -> next is the names div
	$(this).parent().next().show();
})

var feedback = function(div, msg, mode) {
	div.html(msg);
	div.removeClass("alert-info alert-success alert-error");
	
	if(mode == 0) // This is a success mode
		div.addClass("alert-success");
	if(mode == 1) // This is an error mode
		div.addClass("alert-error");
	if(mode == 2) // This is an info mode
		div.addClass("alert-info");
}

$("[id$=signup]").submit(function(){
	var signup_form = $(this);
	var email = $("input[name='email']",signup_form);
	var fname = $("input[name='fname']",signup_form);
	var lname = $("input[name='lname']",signup_form);
	var alert_div = signup_form.next("div.alert");

	alert_div.hide();
	alert_div.removeClass("alert-info alert-success alert-error");



	if (email.val() == "" || email.val() == "Your email address") {
		feedback(alert_div, "That's not a valid email address!", 1);
		alert_div.slideDown("fast", function(){
			// Option to do something to highlight more
		});
	} else if (fname.val() == "" || fname.val() == "First name") {
		feedback(alert_div, "Please enter your first name.", 1);
		alert_div.slideDown("fast", function(){
			// Option to do something to highlight more
		});
	} else if (lname.val() == "" || lname.val() == "Last name") {
		feedback(alert_div, "Please enter your last name.", 1);
		alert_div.slideDown("fast", function(){
			// Option to do something to highlight more
		});
	} else {
		alert_div.addClass("alert-success");
		alert_div.html("Thanks for signing up!");
		alert_div.slideDown("fast", function(){
			// Option to do something to highlight more
		});

		var q = "/email?email=" + email.val();
		q += "&fname=" + fname.val();
		q += "&lname=" + lname.val();

		$.get(q, function(data){
			if(data){
				if("e" in data){
					switch (data.e){
						case 0: // Successful signup of new email
							break;

						case 1: // Some error
							feedback(alert_div, data.msg, data.e);
							break;
					}
				} else {
					// the email GET should always return something
					// if nothing is returned, we couldn't hit the server
					feedback(alert_div, "We're sorry, but we couldn't reach the server at this time. Please try again in a bit!", 2);
				}
			} else {
				// the email GET should always return something
				// if nothing is returned, we couldn't hit the server
				feedback(alert_div, "We're sorry, but we couldn't reach the server at this time. Please try again in a bit!", 2);
			}
		})
	}
	
	return false;
})

})