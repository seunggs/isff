$(document).ready(function(){
	
$("form").submit(function(){
	var signup_form = $(this);
	var email = $("input[name='email']",signup_form);
	var alert_div = signup_form.next(".alert");

	alert_div.hide();
	alert_div.removeClass("alert-info alert-success alert-error");
	alert_div.addClass("alert");

	if (email.val() == "" || email.val() == "Your email address") {
		alert_div.addClass("alert-error");
		alert_div.html("That's not a valid email address!");
		alert_div.show();
	} else {
		alert_div.addClass("alert-success");
		alert_div.html("Thanks for signing up!");
		alert_div.show();

		var q = "/email?email=" + email.val();

		$.get(q, function(data){
			// add error handling
			setTimeout(function(){
				alert_div.hide();
			}, 3000);
		})
	}
	
	return false;
})

})